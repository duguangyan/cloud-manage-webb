<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filterText"  placeholder="输入关键字进行过滤" style="width: 200px;" class="filter-item"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" @click="handAddRoot">新增一级分类</el-button>
    </div>

    <el-tree
      class="filter-tree"
      v-loading="listLoading"
      draggable
      @node-drop="sort"
      @node-expand="nodeClick"
      :data="productData"
      node-key="id"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :allow-drop="allowDrop"
      :expand-on-click-node="false"
      :default-expanded-keys="expandArr"
      :highlight-current="true"
      ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <!-- <span>{{ node.label }}</span> -->
        <span class="col-cont" v-html="showDate(node.label)" ></span>
        <span class="more">
          <i class="el-icon-edit" @click="msgEdit(node, data)" />
          <i class="el-icon-remove-outline" 
            type="text"
            size="mini"
            @click="() => handleDelete(node, data)" />
          <i class="el-icon-circle-plus-outline" 
            type="text"
            size="mini"
            @click="() => append(node, data)" />
        </span>
      </span>
    </el-tree>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑分类':'添加子分类'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="分类名">
          <el-input v-model="role.name" placeholder="请输入分类名" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { deepClone } from '@/utils'
import { getProductTree, insertRootProduct, insertProduct, deleteProduct, updateProduct, searchProduct } from '@/api/product'
let id = 1000;
const defaultRole = {
  name: '',
  id: ''
}

export default {
  name: 'classify',
  directives: { waves },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      filterText: '',
      productData: [],
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      expandArr: [],
      defaultProps: {
        children: 'children',
        label: function(a, b) {
          return a.name
        }
      },
      parentId: '',
      node: {},
      nodeData: {},
      dialogType: 'new',
      dialogVisible: false,
      checkStrictly: false,
      downloadLoading: false,
      listLoading: false
    }
  },
  watch: {
    filterText(val) {
      console.log(val)
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
    nodeClick(data) {
      console.log('---')
      console.log(data)
    },
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
      this.dialogVisible = true
    },
     filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },

    allowDrop(draggingNode, dropNode, type){
          if (draggingNode.data.level === dropNode.data.level) {
            if (draggingNode.data.aboveId === dropNode.data.aboveId) {
              return type === 'prev' || type === 'next'
            }
          } else {
            // 不同级进行处理
            return false
          }
    },
    append(node, data) {
      console.log('node')
      console.log(node)
      console.log('data')
      console.log(data)
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
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
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
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    sort(draggingNode,dropNode,type,event) {
      /* console.log('排序')
      console.log(dropNode)   //dropNode.parent.childNodes =[] 拖拽之后的重新组合的数组 */
      let obj = {
        aboveId:'',
        arr:[]
      }
      obj.aboveId = dropNode.data.aboveId
      for (let item of dropNode.parent.childNodes) {
        obj.arr.push(item.data.id)
      }
      // this.updateOrderMe(obj)
      console.log(obj)
    },
    msgEdit(node, data) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.nodeData = data
      this.role = deepClone(data)
    },
    msgAdd(scope) {
      this.role = Object.assign({}, defaultRole)
      console.log(scope)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.changeId = scope.id
      this.changePid = scope.pid
    },
    async confirmRole() {
      this.listLoading = true
      if (this.dialogType === 'edit') {
        console.log('node')
        console.log(this.node)
         await updateProduct({
          id: this.role.id,
          name: this.role.name
         })
         this.nodeData.name = this.role.name
      } else if(this.dialogType === 'new') {
        const { data } = await insertProduct({
          parentId: this.nodeData.id,
          name: this.role.name
        })
        const newChild = { id: data.id + 1, name: this.role.name, children: [] };
        if (!this.nodeData.children) {
          this.$set(this.nodeData, 'children', []);
        }
        this.nodeData.children.push(newChild);
        this.node.expanded = true
        console.log('x')
        console.log(this.nodeData)
      } else if(this.dialogType === 'root') {
        this.listLoading = true
        await insertRootProduct({ name: this.role.name })
        this.listLoading = false
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
      return val.replace(this.filterText, '<font color="#409EFF">' + this.filterText + '</font>')
      } else {
      return val
      }
   }
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
