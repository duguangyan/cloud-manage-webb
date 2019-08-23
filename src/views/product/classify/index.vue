<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filterText"  placeholder="输入关键字进行过滤" style="width: 200px;" class="filter-item"/>
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <el-button v-waves class="filter-item" @click="handAddRoot">新增一级分类</el-button>
    </div>

    <el-tree
      class="filter-tree"
      v-loading="listLoading"
      draggable
      @node-drop="sort"
      @node-click="nodeClick"
      @node-expand="nodeExpan"
      @node-collapse="nodeCols"
      :data="productData"
      node-key="id"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :allow-drop="allowDrop"
      :expand-on-click-node="true"
      :default-expanded-keys="keyArr"
      :auto-expand-parent="false"
      :highlight-current="true"
      ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <!-- <span>{{ node.label }}</span> -->
        <span class="col-cont" v-html="showDate(node.label)" ></span>
        <!-- <span v-html="showCount(data.id)"></span> -->
        <span class="more">
          <i :ref="data.id">{{node.label}}</i>
          <i class="el-icon-edit" title="修改名称" @click.stop="msgEdit(node, data)" />
          <i class="el-icon-remove-outline" 
            type="text"
            size="mini"
            title="删除分类"
            @click.stop="() => handleDelete(node, data)" />
          <i class="el-icon-circle-plus-outline" 
            type="text"
            size="mini"
            title="新增子集分类"
            @click.stop="() => append(node, data)" />
        </span>
      </span>
    </el-tree>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogMsg">
      <el-form v-loading="diaLoading" ref="productForm" :model="role" label-width="80px" label-position="left" :rules="productRules">
        <el-form-item label="分类名" prop="name">
          <el-input v-model="role.name" maxlength="20" placeholder="请输入分类名" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="diaDisable" @click="regFun">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { deepClone } from '@/utils'
import { getProductTree, insertRootProduct, insertProduct, deleteProduct, updateProduct, searchProduct, getProductNum, moveProduct } from '@/api/goods/product'
import { validWord } from '@/utils/validate'
let id = 1000;
const defaultRole = {
  name: '',
  id: ''
}

export default {
  name: 'classify',
  directives: { waves },
  data() {
    const validateName = (rule, value, callback) => {
      if (!validWord(value)) {
          callback(new Error('名称里不能有特殊字符'))
      } else {
          callback()
      }
    }
    return {
      role: Object.assign({}, defaultRole),
      filterText: '',
      productData: [],
      keyArr: [],
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      defaultProps: {
        children: 'children',
        label: function(a, b) {
          return a.name
        }
      },
      productRules: {
          name: [{
              required: true,
              trigger: 'blur',
              validator: validateName
          }]
      },
      count: 0,
      countCode: '',
      parentId: '',
      node: {},
      nodeData: {},
      dialogType: 'new',
      dialogMsg: '新增一级分类',
      dialogVisible: false,
      checkStrictly: false,
      downloadLoading: false,
      listLoading: false,
      diaLoading: false,
      diaDisable: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  components: {  },
  computed: {
    // 实时监听表格
    tables: function() {
      const search = this.filterText
      if (search) {
      return this.productData.filter(dataNews => {
        return Object.keys(dataNews).some(key => {
        return String(dataNews[key]).toLowerCase().indexOf(search) > -1
        })
      })
      }
      return this.productData
    }
  },
  created() {
    this.getProductTree()
  },
  methods: {
    getProductTree() {
      // 获取初始商品树
      getProductTree().then(res => {
        if(Array.isArray(res.data)) {
          this.productData = res.data
        }
      })
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getRoleList()
    },
    handAddRoot() {
      this.dialogType = 'root'
      this.dialogMsg = '添加一级分类'
      this.dialogVisible = true
    },
     filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    nodeClick(data, node, dom) {
      console.log('node')

      const id = data.id
      console.log(id)
      console.log(this.$refs.id)
      console.log(dom.$children[0])
      console.log(dom.$children[0].$el.childNodes[2].childNodes[0].innerHtml)
      this.$nextTick(() => {
        dom.$children[0].$el.childNodes[2].childNodes[0].innerHtml = 'SSS'
      })
      
      return
 
      getProductNum({id: data.id}).then(res => {
      
        return
        if(res.data !== null) {
          this.count = res.data
        }
        this.countCode = data.id
      })
    },
    nodeExpan(data, node, e) {
      this.keyArr.push(data.id)
    },
    nodeCols(data, node, e) {
      let arr = []
      for(let i = 0; i < this.keyArr.length; i++) {
        if(data.id !== this.keyArr[i]) {
          arr.push(this.keyArr[i])
        }
      }
      this.keyArr = arr
    },
    allowDrop(draggingNode, dropNode, type){
      if (draggingNode.level === dropNode.level) {
        if (draggingNode.data.aboveId === dropNode.data.aboveId) {
          return type === 'prev' || type === 'next'
        }
      } else {
        // 不同级不进行处理
        return false
      }
    },
    append(node, data) {
      this.dialogMsg = '添加子分类'
      this.nodeData = data
      this.node = node
      this.role = Object.assign({}, defaultRole)
      this.parentId = data.id
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    handleDelete(node, data) {
      // 删除
      console.log('?')
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log('############')
          // 判断删除类目下商品数量
          this.listLoading = true
          console.log('-----')
          console.log(data)
          getProductNum({id: data.id}).then(res => {
            if(res.data > 0) {
              this.$message({
                type: 'warning',
                message: '该分类下面商品数量大于0，不能删除!'
              })
            } else {
              deleteProduct({id: data.id}).then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
                const parent = node.parent;
                const children = parent.data.children || parent.data;
                const index = children.findIndex(d => d.id === data.id);
                children.splice(index, 1);
                this.listLoading = false
              }).catch(err => {
                this.listLoading = false
              })
            }
          }).catch(err => {
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    sort(draggingNode, dropNode,type, event) {
      // dropNode.parent.childNodes =[] 拖拽之后的重新组合的数组
      let sort = 0
      for(let i = 0; i < dropNode.parent.childNodes.length; i++) {
        if(dropNode.parent.childNodes[i].data.id === draggingNode.data.id) {
          if(i - 1 >= 0) {
            sort = parseInt(dropNode.parent.childNodes[i - 1].data.sort) + 1
          } else {
            sort = 1
          }
          break
        }
      }
      this.listLoading = true
      moveProduct({ 
        categoryId: draggingNode.data.id,
        parentId: dropNode.parent.data.id,
        sort: sort
      }).then(res => {
        this.listLoading = false
        this.getProductTree()
      }).catch(err => {
        this.listLoading = false
      })
    },
    sortArr(draggingNode, dropNode,type, event) {
      if (draggingNode.data.aboveId === dropNode.data.aboveId) {
        let obj = {
          aboveId:'',
          arr:[]
        }
        obj.aboveId = dropNode.data.aboveId
        for (let item of dropNode.parent.childNodes) {
          obj.arr.push(item.data.id)
        }
        this.updateOrderMe(obj)
      } else {
        let obj = {
          aboveId:'',
          id:'',
          newAboveId:''
        }
        obj.aboveId = draggingNode.data.aboveId
        obj.id = draggingNode.data.id
        obj.newAboveId = dropNode.data.id
        this.randomDrag(obj)
      }
    },
    msgEdit(node, data) {
      this.dialogType = 'edit'
      this.dialogMsg = '编辑分类名'
      this.dialogVisible = true
      this.checkStrictly = true
      this.nodeData = data
      this.role = deepClone(data)
    },
    msgAdd(scope) {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.changeId = scope.id
      this.changePid = scope.pid
    },
    regFun () {
      this.$refs.productForm.validate(valid => {
        if(valid) {
          this.confirmRole()
        }
      })
    },
    async confirmRole() {
      this.listLoading = true
      if (this.dialogType === 'edit') {
        this.diaDisable = true
        this.diaLoading = true
        await updateProduct({
        id: this.role.id,
        name: this.role.name
        }).catch(err => { 
          this.diaDisable = false
          this.diaLoading = false
        })
        this.nodeData.name = this.role.name
        this.diaDisable = false
        this.diaLoading = false
      } else if(this.dialogType === 'new') {
        this.diaDisable = true
        this.diaLoading = true
        const { data } = await insertProduct({
          parentId: this.nodeData.id,
          name: this.role.name
        }).catch(err => { 
          this.diaDisable = false
          this.diaLoading = false
        })
        this.diaDisable = false
        this.diaLoading = false
        const newChild = { id: data.id, name: data.name, sort: data.sort, level: data.level, parentId: data.parentId, status: data.status, children: [] };
        if (!this.nodeData.children) {
          this.$set(this.nodeData, 'children', []);
        }
        this.nodeData.children.push(newChild);
        this.node.expanded = true
        this.keyArr.push(this.nodeData.id)
      } else if(this.dialogType === 'root') {
        this.diaDisable = true
        this.diaLoading = true
        await insertRootProduct({ name: this.role.name }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        this.diaDisable = false
        this.diaLoading = false
        this.getProductTree()
      }
      this.listLoading = false
      const { name, remark } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>字典名: ${name}</div>
            <div>备注: ${remark}</div>
          `,
        type: 'success'
      })
    },
    // 筛选变色
   showDate(val) {
      val = val + '';
      if (val.indexOf(this.filterText) !== -1 && this.filterText !== '') {
      return val.replace(this.filterText, '<font color="#FF0000">' + this.filterText + '</font>')
      } else {
      return val
      }
   },
  }
}
</script>

<style lang="scss" scoped>
  .more{
    visibility: hidden;
    margin-left: 20px;
    i{
      margin-left: 10px;
      &:hover{
        color: #409EFF;
      }
    }
  }
  .el-tree-node__content:hover .more{
    visibility: visible;
  }
  .filter-container{
    padding-bottom: 30px;
  }
</style>
