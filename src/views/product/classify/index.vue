<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="filterText"  placeholder="输入关键字进行过滤" style="width: 200px;" class="filter-item"/>
      <!-- <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button> -->
      <el-button v-waves class="filter-item" @click="handAddRoot">新增一级分类</el-button>
    </div>
    <div class="clearfix">
      <div class="left">
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
          :expand-on-click-node="false"
          :default-expanded-keys="keyArr"
          :auto-expand-parent="false"
          :highlight-current="true"
          ref="tree">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span class="col-cont" v-html="showFilter(node.label)" ></span>
            <span class="more">
              <i class="product-num" :ref="data.id"></i>
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
      </div>
      <div class="right">
        <div class="data-box">
          <el-row type="flex" class="mb5" justify="space-around">
            <el-col><div class="box-title">计量单位管理</div></el-col>
            <el-col><div class="tr"><el-button v-waves size="small" type="primary" @click="add(1)">新增</el-button></div></el-col>
          </el-row>
          <el-table
            :data="unitData"
            border
            >
            <el-table-column
              prop="date"
              label="日期"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="updateAdd(1, row)">
                  编辑
                </el-button>
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteAdd(row,'deleted')">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="data-box">
          <el-row type="flex" class="mb5" justify="space-around">
            <el-col><div class="box-title">规格管理</div></el-col>
            <el-col><div class="tr"><el-button v-waves size="small" type="primary" @click="add(2)">新增</el-button></div></el-col>
          </el-row>
          <el-table
            :data="unitData"
            border
            >
            <el-table-column
              prop="date"
              label="日期"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="updateAdd(2, row)">
                  编辑
                </el-button>
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteAdd(row,'deleted')">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="data-box">
          <el-row type="flex" class="mb5" justify="space-around">
            <el-col><div class="box-title">模板属性</div></el-col>
            <el-col><div class="tr"><el-button v-waves size="small" type="primary" @click="add(3)">新增</el-button></div></el-col>
          </el-row>
          <el-table
            :data="unitData"
            border
            >
            <el-table-column
              prop="date"
              label="日期"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="updateAdd(3, row)">
                  编辑
                </el-button>
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteAdd(row,'deleted')">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogMsg">
      <template v-if="dialogType === 'unit'">
        <el-form v-loading="diaLoading" ref="unitForm" :model="role" label-width="100px" label-position="left" :rules="productRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="启用状态" prop="name">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="dialogType === 'spec'">
        <el-form v-loading="diaLoading" ref="specForm" :model="role" label-width="120px" label-position="left" :rules="productRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="属性类型" prop="name">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="单选框"></el-checkbox>
              <el-checkbox label="复选框"></el-checkbox>
              <el-checkbox label="下拉框"></el-checkbox>
              <el-checkbox label="文本输入框" disabled></el-checkbox>
              <el-checkbox label="地址选择框" disabled></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="属性值" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入规格值" style="width: 60%" /><el-button
             v-waves size="mini" type="danger" plain class="ml10">删除</el-button><el-button
            v-waves size="mini" type="primary" plain>新增</el-button>
          </el-form-item>
          <el-form-item label="属性值描述" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入规格值" />
          </el-form-item>
          <el-form-item label="精确城市等级" prop="name">
            <el-select v-model="cityValue" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入排序" />
          </el-form-item>
          <el-form-item label="提示语" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入提示语" />
          </el-form-item>
          <el-form-item label="尾部语" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入名称尾部语" />
          </el-form-item>
          <el-form-item label="是否必填" prop="name">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="是否搜索" prop="name">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="启用状态" prop="name">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="dialogType === 'prop'">
        <el-form v-loading="diaLoading" ref="propForm" :model="role" label-width="140px" label-position="left" :rules="productRules">
          <el-form-item label="属性名称" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入属性名称" />
          </el-form-item>
          <el-form-item label="是否设定规格值" prop="name">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-form-item>
          <el-form-item label="规格值" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入规格值" style="width: 60%" /><el-button
             v-waves size="mini" type="danger" plain class="ml10">删除</el-button><el-button
            v-waves size="mini" type="primary" plain>新增规格值</el-button>
          </el-form-item>
          <el-form-item label="启用状态" prop="name">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="dialogType === 'new' || dialogType === 'edit'">
        <el-form v-loading="diaLoading" ref="productForm" :model="role" label-width="80px" label-position="left" :rules="productRules">
          <el-form-item label="分类名" prop="name">
            <el-input v-model="role.name" maxlength="20" placeholder="请输入分类名" />
          </el-form-item>
        </el-form>
      </template>
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
      num: 1,
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
      checkList: [],
      cityValue: '',
      unitData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
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
    // 获取树信息
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
      // 过滤搜索
      this.listQuery.pageIndex = 1
      this.getRoleList()
    },
    handAddRoot() {
      // 添加顶级树
      this.dialogType = 'root'
      this.dialogMsg = '添加一级分类'
      this.dialogVisible = true
    },
    filterNode(value, data) {
      // 查询节点
      if(!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    nodeClick(data, node, dom) {
      // 点击获取产品数量
      this.listLoading = true
      getProductNum({id: data.id}).then(res => {
        this.listLoading = false
        let num = 0
        if(res.data !== null) {
          num = res.data
        }
        this.$refs[data.id].innerHTML = '(' + num + ')'
      }).catch(err => {
        this.listLoading = false
      })
      // 显示四级分类的计量单位、规格管理、属性模板数据
      if(node.level === 4) {
      }
    },
    nodeExpan(data, node, e) {
      // 展开树
      this.keyArr.push(data.id)
    },
    nodeCols(data, node, e) {
      // 关闭树
      let arr = []
      for(let i = 0; i < this.keyArr.length; i++) {
        if(data.id !== this.keyArr[i]) {
          arr.push(this.keyArr[i])
        }
      }
      this.keyArr = arr
    },
    allowDrop(draggingNode, dropNode, type) {
      // 拖拽操作
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
      // 添加子分类
      this.dialogMsg = '添加子分类'
      this.nodeData = data
      this.node = node
      this.role = Object.assign({}, defaultRole)
      this.parentId = data.id
      this.dialogType = 'new'
      this.dialogVisible = true
    },

    remove(node, data) {
      // 删除分类
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
        // 判断删除类目下商品数量
        this.listLoading = true
        getProductNum({id: data.id}).then(res => {
          this.listLoading = false
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
      // 拖拽之后的重新组合的数组
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
    add(type) {
      // 新增计量单位、规格、属性
      if (type === 1) {
        this.dialogType = 'unit'
        this.dialogMsg = '新增计量单位'
        
      } else if (type === 2) {
        this.dialogType = 'prop'
        this.dialogMsg = '新增规格管理'
      } else {
        this.dialogType = 'spec'
        this.dialogMsg = '新增属性模板'
      }
      this.dialogVisible = true
      this.checkStrictly = true
    },
    msgEdit(node, data) {
      // 编辑分类
      this.dialogType = 'edit'
      this.dialogMsg = '编辑分类名'
      this.dialogVisible = true
      this.checkStrictly = true
      this.nodeData = data
      this.role = deepClone(data)
    },
    msgAdd(scope) {
      // 添加分类
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.changeId = scope.id
      this.changePid = scope.pid
    },
    regFun () {
      // 表单校验
      this.$refs.productForm.validate(valid => {
        if(valid) {
          this.confirmRole()
        }
      })
    },
    async confirmRole() {
      // 弹窗确认操作
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
      } else if (this.dialogType === 'unit') {

      } else if (this.dialogType === 'spec') {

      } else if (this.dialogType === 'prop') {

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
    showFilter(val) {
      val = val + '';
      if (val.indexOf(this.filterText) !== -1 && this.filterText !== '') {
      return val.replace(this.filterText, '<font color="#FF0000">' + this.filterText + '</font>')
      } else {
      return val
      }
    },
    updateAdd(type, row) {
     // 编辑计量单位、规格、属性
     if (type === 1) {
        this.dialogType = 'unit'
        this.dialogMsg = '编辑计量单位'
        
      } else if (type === 2) {
        this.dialogType = 'prop'
        this.dialogMsg = '编辑规格管理'
      } else {
        this.dialogType = 'spec'
        this.dialogMsg = '编辑属性模板'
      }
      this.dialogVisible = true
      this.checkStrictly = true
    //  this.temp = Object.assign({}, row)
    },
    deleteAdd(type) {
     // 删除计量单位、规格、属性
     let deleteMsg = ''
     if (type === 1) {
       deleteMsg = '确定删除该计量单位？'
     } else if (type === 2) {
       deleteMsg = '确定删除该规格管理？'
     } else {
       deleteMsg = '确定删除该属性模板？'
     }
      this.$confirm(deleteMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 判断删除类目下商品数量
        this.listLoading = true
        getProductNum({id: data.id}).then(res => {
        
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
    handleChange(value) {
      console.log(value);
    }
  }
}
</script>

<style lang="scss" scoped>
  .left{
    width: 50%;
    float: left;
  }
  .right{
    width: 50%;
    float: left;
  }
  .mb5{
    margin-bottom: 5px;
  }
  .ml10{
    margin-left: 10px;
  }
  .tr{
    text-align: right;
  }
  .more{
    visibility: hidden;
    margin-left: 20px;
    .product-num{
      font-style: normal;
    }
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
  .data-box{
    width: 800px;
    background: #eee;
    padding: 10px 20px 20px 20px;
    margin-bottom: 20px;
    .box-title{
      line-height: 32px;
    }
  }
</style>
