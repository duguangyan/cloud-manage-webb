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
      <div v-show="rightBoxShow" v-loading="boxLoading" class="right">
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
              type=index
              prop="index"
              label="序号"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="计量单位"
              align="center">
            </el-table-column>
            <el-table-column
              label="启用状态"
              align="center"
              width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">禁用</span>
                <span v-else-if="scope.row.status === 1">启用</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="160"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              width="150"
              align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="updateAdd(1, row)">
                  编辑
                </el-button>
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteAdd(1, row.id)">
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
            :data="specData"
            border
            >
            <el-table-column
              type=index
              prop="index"
              label="序号"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="规格项"
              align="center">
            </el-table-column>
            <el-table-column
              label="启用状态"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">禁用</span>
                <span v-else-if="scope.row.status === 1">启用</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="160"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              width="150"
              align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="updateAdd(2, row)">
                  编辑
                </el-button>
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteAdd(2, row.id)">
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
            :data="propData"
            border
            >
            <el-table-column
              type="index"
              prop="index"
              label="序号"
              align="center"
              width="100">
            </el-table-column>
            <el-table-column
              prop="name"
              label="属性名"
              align="center">
            </el-table-column>
            <el-table-column
              prop="isRequire"
              label="是否必填"
              align="center"
              width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.isRequire === 0">否</span>
                <span v-else-if="scope.row.isRequire === 1">是</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="status"
              label="启用状态"
              align="center"
              width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">禁用</span>
                <span v-else-if="scope.row.status === 1">启用</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              width="160"
              align="center">
            </el-table-column>
            <el-table-column
              prop="address"
              label="操作"
              width="160"
              align="center">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="updateAdd(3, row)">
                  编辑
                </el-button>
                <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteAdd(3, row.id)">
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
        <el-form v-loading="diaLoading" ref="unitForm" :model="unit" label-width="100px" label-position="left" :rules="unitRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="unit.name" maxlength="20" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-radio v-model="unit.status" :label="1">是</el-radio>
            <el-radio v-model="unit.status" :label="0">否</el-radio>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="dialogType === 'prop'">
        <el-form v-loading="diaLoading" ref="propForm" :model="prop" label-width="120px" label-position="left" :rules="propRules">
          <el-form-item label="名称" prop="name">
            <el-input v-model="prop.name" maxlength="20" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="属性类型" prop="type">
              <el-radio v-model="prop.type" size="medium" :label="1" border>单选框</el-radio>
              <el-radio v-model="prop.type" size="medium" :label="2" border>复选框</el-radio>
              <el-radio v-model="prop.type" size="medium" :label="3" border>下拉框</el-radio>
              <el-radio v-model="prop.type" size="medium" :label="4" border>文本输入框</el-radio>
              <el-radio v-model="prop.type" size="medium" :label="0" border>地址选择框</el-radio>
          </el-form-item>
          <template v-if="prop.type === 1 || prop.type === 2 || prop.type === 3">
            <el-form-item v-for="(item, index) in prop.list" :key="index" :label="index === 0 ? '属性值' : ''" :prop="'list.' + index +'.value'" :rules="{
            required: true, message: '属性值不能为空', trigger: 'blur'
            }">
              <el-input v-model="prop.list[index].value" maxlength="20" placeholder="请输入规格值" style="width: 60%" /><el-button
              v-waves v-show="index !== 0 || (index === 0 && prop.list.length > 1)" size="mini" type="danger" plain class="ml10" @click=deleteProp(index)>删除</el-button><el-button
              v-waves v-show="index === prop.list.length - 1" size="mini" type="primary" plain @click="addProp">新增</el-button>
            </el-form-item>
          </template>
          <el-form-item v-if="prop.type === 4" label="属性值描述">
            <el-input v-model="prop.textDes" maxlength="20" placeholder="请输入文本框描述" />
          </el-form-item>
          <el-form-item v-if="prop.type === 0" label="精确城市等级" prop="level">
            <el-select v-model="prop.level" placeholder="请选择城市等级">
              <el-option
                v-for="item in cityOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model="prop.sort" maxlength="20" placeholder="请输入排序" />
          </el-form-item>
          <el-form-item label="提示语" prop="notice">
            <el-input v-model="prop.notice" maxlength="20" placeholder="请输入提示语" />
          </el-form-item>
          <el-form-item v-if="prop.type === 4" label="尾部语" prop="afterDes">
            <el-input v-model="prop.afterDes" maxlength="20" placeholder="请输入名称尾部语" />
          </el-form-item>
          <el-form-item label="是否必填" prop="isRequire">
            <el-radio v-model="prop.isRequire" :label="1">是</el-radio>
            <el-radio v-model="prop.isRequire" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="是否搜索" prop="isSearch">
            <el-radio v-model="prop.isSearch" :label="1">是</el-radio>
            <el-radio v-model="prop.isSearch" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-radio v-model="prop.status" :label="1">是</el-radio>
            <el-radio v-model="prop.status" :label="0">否</el-radio>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="dialogType === 'spec'">
        <el-form v-loading="diaLoading" ref="specForm" :model="spec" label-width="120px" label-position="left" :rules="specRules">
          <el-form-item label="属性名称" prop="name">
            <el-input v-model="spec.name" maxlength="20" placeholder="请输入属性名称" />
          </el-form-item>
          <el-form-item label="展示方式" prop="showType">
            <el-radio v-model="spec.showType" size="medium" :label="1" border>阶梯方式</el-radio>
            <el-radio v-model="spec.showType" size="medium" :label="2" border>普通方式</el-radio>
          </el-form-item>
          <el-form-item v-show="spec.showType === 1" label="规格值后缀" prop="afterDes" :rules="{
            required: spec.showType === 1, message: '属性值不能为空', trigger: 'blur'
            }">
            <el-input v-model="spec.afterDes" maxlength="20" placeholder="请输入规格值后缀" style="width: 60%" />
          </el-form-item>
          <el-form-item label="启用状态" prop="status">
            <el-radio v-model="spec.status" :label="1">是</el-radio>
            <el-radio v-model="spec.status" :label="0">否</el-radio>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="dialogType === 'new' || dialogType === 'edit' || dialogType === 'root'">
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
import { getUnitList, insetUnitList, updateUnitList, deleteUnitList, getSpeList, insetSpeList, updateSpeList, deleteSpeList, getPropList, insetPropList, updatePropList, deletePropList } from '@/api/goods/list'
import { validWord } from '@/utils/validate'
let id = 1000;
const defaultRole = {
  id: '',
  name: ''
}
const defaultUnit = {
  id: '',
  name: '',
  status: -1
}
const defaultProp = {
  id: '',
  name: '',
  status: '', 
  type: -1,
  level: '',
  list: [
    { value: '' }
  ],
  sort: '',
  isSearch: -1,
  isRequire: -1,
  afterDes: '',
  notice: ''
}
const defaultSpec = {
  id: '',
  name: '',
  showType: -1,
  afterDes: '',
  status: -1
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
      unit: Object.assign({}, defaultUnit),
      prop: Object.assign({}, defaultProp),
      spec: Object.assign({}, defaultSpec),
      filterText: '',
      productData: [],
      keyArr: [],
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      num: 1,
      rightBoxShow: false,
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
      unitRules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: '请填写名称'
        }],
        status: [{
            required: true,
            trigger: 'blur',
            message: '请选择启用状态'
        }]
      },
      specRules: {
        name: [{
            required: true,
            trigger: 'blur',
            message: '请填写属性名称'        
          }],
        status: [{
            required: true,
            trigger: 'blur',
            message: '请选择启用状态'
        }],
        showType: [{
            required: true,
            trigger: 'blur',
            message: '请选择展示方式'
        }],
      },
      propRules: {
        name: [{
            required: true,
            trigger: 'blur',
            message: '请填写属性名称'        
          }],
        status: [{
            required: true,
            trigger: 'blur',
            message: '请选择启用状态'
        }],
        type: [{
            required: true,
            trigger: 'blur',
            message: '请选择属性类型'
        }],
        isRequire: [{
            required: true,
            trigger: 'blur',
            message: '请选择是否必填'
        }],
        isSearch: [{
            required: true,
            trigger: 'blur',
            message: '请选择是否可搜索'
        }],
        level: [{
            required: true,
            trigger: 'blur',
            message: '请选择城市等级'
        }]
      },
      form: {
        unit: {
          name: '',
          status: ''
        },
        spec: {
          name: '',
          status: '',
          require: '',
          level: ''
        },
        prop: {
          name: '',
          status: ''
        }
      },
      checkList: [],
      cityValue: '',
      unitData: [],
      propData: [],
      specData: [],
      cityOptions: [
        { value: 0, label: '省级地址' },
        { value: 1, label: '市级地址' },
        { value: 2, label: '区级地址' },
        { value: 3, label: '县级地址' },
        { value: 4, label: '乡级地址' }
      ],
      parentId: '',
      node: {},
      nodeData: {},
      dialogType: 'new',
      dialogMsg: '新增一级分类',
      unitId: '',
      propId: '',
      specId: '',
      dialogVisible: false,
      checkStrictly: false,
      downloadLoading: false,
      listLoading: false,
      boxLoading: false,
      diaLoading: false,
      diaDisable: false,
      isEdit: false
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
        this.rightBoxShow = true
        this.unitId = data.id
        this.specId = data.id 
        this.propId = data.id
        this.getUnitList()
        this.getSpeList()
        this.getPropList()
      } else {
        this.rightBoxShow = false
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
      this.isEdit = false
      if (type === 1) {
        this.dialogType = 'unit'
        this.dialogMsg = '新增计量单位'
        this.unit = Object.assign({}, defaultUnit)
      } else if (type === 2) {
        this.dialogType = 'spec'
        this.dialogMsg = '新增规格管理'
        this.spec = Object.assign({}, defaultSpec)
      } else {
        this.dialogType = 'prop'
        this.dialogMsg = '新增属性模板'
        this.prop = Object.assign({}, defaultProp)
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
      if(this.dialogType === 'edit' || this.dialogType === 'new' || this.dialogType === 'root') {
        this.$refs.productForm.validate(valid => {
          if(valid) {
            this.confirmRole()
          }
        })
      } else if(this.dialogType === 'unit') {
        this.$refs.unitForm.validate(valid => {
          if(valid) {
            this.confirmRole()
          }
        })
      } else if(this.dialogType === 'spec') {
        this.$refs.specForm.validate(valid => {
          if(valid) {
            this.confirmRole()
          }
        })
      } else if(this.dialogType === 'prop') {
        this.$refs.propForm.validate(valid => {
          if(valid) {
            this.confirmRole()
          }
        })
      }
    },
    getUnitList() {
      // 获取计量单位表
      this.listLoading = true
      getUnitList({ categoryId: this.unitId }).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          this.unitData = res.data
        }
      })
    },
    getSpeList() {
      // 获取规格管理表
      this.listLoading = true
      getSpeList({ categoryId: this.specId }).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          this.specData = res.data
        }
      })
    },
    getPropList(id) {
      // 获取属性表
      this.listLoading = true
      getPropList({ categoryId: this.propId }).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          this.propData = res.data
        }
      })
    },
    async confirmRole() {
      // 弹窗确认操作
      let succMsg = ''
      let isFalse = false
      if (this.dialogType === 'edit') {
        succMsg = '分类名编辑成功'
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
        succMsg = '分类新增成功'
        this.diaDisable = true
        this.diaLoading = true
        const { data } = await insertProduct({
          parentId: this.nodeData.id,
          name: this.role.name
        }).catch(err => { 
          this.diaDisable = false
          this.diaLoading = false
          isFalse = true
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
        succMsg = '一级分类新增成功'
        this.diaDisable = true
        this.diaLoading = true
        await insertRootProduct({ name: this.role.name }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
          isFalse = true
        })
        if(isFalse) {
          return false
        }
        this.diaDisable = false
        this.diaLoading = false
        this.getProductTree()
      } else if (this.dialogType === 'unit') {
        this.diaDisable = true
        this.diaLoading = true
        if(this.isEdit) {
          succMsg = '计量单位编辑成功'
          await updateUnitList({
            categoryId: this.unitId,
            id: this.unit.id,
            name: this.unit.name,
            status: this.unit.status
          }).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
            isFalse = true
          })
        } else {
          succMsg = '计量单位新增成功'
          await insetUnitList({
            categoryId: this.unitId,
            name: this.unit.name,
            status: this.unit.status
          }).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
            isFalse = true
          })
        }
        if(isFalse) {
          return false
        }
        this.diaDisable = false
        this.diaLoading = false
        this.getUnitList()
      } else if (this.dialogType === 'spec') {
        this.diaDisable = true
        this.diaLoading = true
        let specObj = {
          categoryId: this.specId,
          name: this.spec.name,
          showStyle: this.spec.showType,
          status: this.spec.status,
        }
        if(this.spec.showType === 1) {
          specObj.valueSuffix = this.spec.afterDes
        }
        if(this.isEdit) {
          specObj.id = this.spec.id
          succMsg = '规格管理编辑成功'
          await updateSpeList(specObj).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
            isFalse = true
          })
        } else {
          succMsg = '规格管理新增成功'
          await insetSpeList(specObj).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
            isFalse = true
          })
        }
        if(isFalse) {
          return false
        }
        this.diaDisable = false
        this.diaLoading = false
        this.getSpeList()
      } else if (this.dialogType === 'prop') {
        this.diaDisable = true
        this.diaLoading = true
        let valueStr = ''
        if(this.prop.type === 1 || this.prop.type === 2 || this.prop.type === 3) {
          this.prop.list.forEach(item => {
            valueStr += valueStr.length === 0 ? item.value : ',' + item.value
          })
        } else if(this.prop.type === 0) {
          valueStr = this.prop.level
        }
        let insetParams = {
          categoryId: this.propId,
          name: this.prop.name,
          hint: this.prop.notice,
          inputType: this.prop.type,
          isRequire: this.prop.isRequire,
          isSearch: this.prop.isSearch,
          sort: this.prop.sort,
          status: this.prop.status,
          valueStr: valueStr
        }
        if(this.prop.type.id === '4') {
          insetParams.exp = this.prop.afterDes
        }
        if(this.isEdit) {
          insetParams.id = this.prop.id
          succMsg = '模板属性编辑成功'
          insetParams.id = this.prop.id
          await updatePropList(insetParams).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
            isFalse = true
          })
        } else {
          succMsg = '模板属性新增成功'
          await insetPropList(insetParams).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
            isFalse = true
          })
        }
        if(isFalse) {
          return false
        }
        this.diaDisable = false
        this.diaLoading = false
        this.getPropList()
      }
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: succMsg,
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
    addProp() {
      // 添加属性值
      this.prop.list.push({
        value: ''
      })
    },
    deleteProp(index) {
      // 删除添加的属性值
      this.prop.list.splice(index, 1)
    },
    updateAdd(type, row) {
     // 编辑计量单位、规格、属性
     this.isEdit = true
     if (type === 1) {
        this.unit.id = row.id
        this.unit.name = row.name
        this.unit.status = row.status
        this.dialogType = 'unit'
        this.dialogMsg = '编辑计量单位'
      } else if (type === 2) {
        this.spec.id = row.id
        this.spec.name = row.name
        this.spec.status = row.status
        this.spec.showType = Number(row.showStyle)
        this.spec.afterDes = row.valueSuffix
        this.dialogType = 'spec'
        this.dialogMsg = '编辑规格管理'
      } else {
        this.dialogType = 'prop'
        this.dialogMsg = '编辑属性模板'
        this.prop.id = row.id
        this.prop.name = row.name
        this.prop.status = row.status
        this.prop.afterDes = row.exp
        this.prop.notice = row.hint
        this.prop.type = row.inputType
        this.prop.list = row.valueSet
        this.prop.isRequire = row.isRequire
        this.prop.isSearch = row.isSearch
        this.prop.sort = row.sort
      }
      this.dialogVisible = true
      this.checkStrictly = true
    //  this.temp = Object.assign({}, row)
    },
    deleteAdd(type, id) {
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
        this.boxLoading = true
        if(type === 1) {
          deleteUnitList({ id: id }).then(res => {
            this.boxLoading = false
            this.getUnitList()
          }).catch(err => {
            this.boxLoading = false
          })
        } else if(type === 2) {
          deleteSpeList({ id: id }).then(res => {
            this.boxLoading = false
            this.getSpeList()
          }).catch(err => {
            this.boxLoading = false
          })
        } else if(type === 3){
          deletePropList({ categoryAttrId: id }).then(res => {
            this.boxLoading = false
            this.getPropList()
          }).catch(err => {
            this.boxLoading = false
          })
        }
        this.$message({
          type: 'success',
          message: '删除成功'
        });  
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
  }
}
</script>

<style lang="scss" scoped>
  .left{
    width: 40%;
    float: left;
  }
  .right{
    width: 60%;
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
    min-width: 1000px;
    background: #eee;
    padding: 10px 20px 20px 20px;
    margin-bottom: 20px;
    .box-title{
      line-height: 32px;
    }
  }
</style>
