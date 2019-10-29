<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-if="btnsPermission.search.auth" v-model.trim="listQuery.name"  placeholder="请输入搜索关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetResource">重置</el-button>
      <el-button v-if="btnsPermission.addDic.auth" v-waves class="filter-item" @click="handAddTop">{{btnsPermission.addDic.name}}</el-button>
    </div>

    <el-table
      v-if="!isSearch"
      ref="treeTable"
      v-loading="listLoading"
      :data="dictData"
      style="width: 100%"
      row-key="id"
      border
      :header-cell-style="{background: '#f3f3f3'}"
      lazy
      :expand-row-keys="expandArr"
      :load="load">
      <el-table-column
        prop="name"
        label="字典名"
        >
      </el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="编号"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">启用</span>
          <span v-else-if="scope.row.status === 0">禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="value"
        label="字典值"
        align="center"
        width="400">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="mini" @click="msgEdit(row)">
            {{btnsPermission.edit.name}}
          </el-button>
          <el-button v-if="btnsPermission.add.auth" type="primary" size="mini" @click="msgAdd(row)">
            {{btnsPermission.add.name}}
          </el-button>
          <el-button v-if="btnsPermission.delete.auth" size="mini" type="danger" @click="handleDelete(row)">
            {{btnsPermission.delete.name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-show="isSearch"
      ref="treeTableSearch"
      v-loading="listLoading"
      :data="searchData"
      style="width: 100%"
      row-key="id"
      border
      default-expand-all
      :header-cell-style="{background: '#f3f3f3'}">
      <el-table-column
        prop="name"
        label="字典名"
        >
      </el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="编号"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">启用</span>
          <span v-else-if="scope.row.status === 0">禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="value"
        label="字典值"
        align="center"
        width="400">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="msgEdit(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="msgAdd(row)">
            添加
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑字典':'添加字典'">
      <el-form ref="dictForm" v-loading="diaLoading" :model="role" label-width="80px" label-position="left" :rules="rules">
        <el-form-item label="父级">
          <span v-if="checkParentName.length > 0" class="mr10">{{checkParentName}}</span>
          <span v-else-if="role.parentName !== undefined && role.parentName !== ''" class="mr10">{{role.parentName}}</span>
          <span v-else class="mr10">顶级</span>
          <el-button v-waves class="filter-item" size="small" @click="selectParent">选择父级</el-button>
        </el-form-item>
        <el-form-item prop="name" label="字典名">
          <el-input v-model.trim="role.name" maxlength="64" placeholder="请输入字典名" />
        </el-form-item>
        <el-form-item prop="code" label="编号">
          <el-input v-model.trim="role.code" maxlength="128" placeholder="请输入字典名" />
        </el-form-item>
        <el-form-item label="状态" v-if="dialogType==='edit'">
          <el-select v-model="role.status" placeholder="请选择">
            <el-option
              v-for="item in statusData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="value" label="字典值">
          <el-input v-model.trim="role.value" maxlength="255" placeholder="请输入字典值" />
        </el-form-item>
         <el-form-item label="备注">
          <el-input
            v-model="role.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="255"
            placeholder="请输入备注内容"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="diaDisable" @click="regFun">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="prarentDialogVisible" :closeOnClickModal="false" :title="'选择父级'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="字典列表">
          <el-tree
            ref="parentTree"
            :default-expanded-keys="keyArr"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            @check-change="handleCheckChange"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="parentCancle">取消</el-button>
        <el-button type="primary" @click="confirmParent">确定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { getUserBtnByPId } from '@/api/upms/menu'
import { addDict, getDictById, getDictByPid, updateDict, deleteDict, searchDictByPid, getTreeNode } from '@/api/upms/dict'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { deepClone } from '@/utils'
import treeTable from '@/components/TreeTable'
const defaultRole = {
  parentId: '',
  id: '',
  name: '',
  code: '',
  status: '',
  remark: ''
}

export default {
  name: 'systemDict',
  directives: { waves },
  components: { treeTable },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      dictData: [],
      tableData: [],
      searchData: [],
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        addDic: {
          name: '新增字典',
          auth: false
        },
        add: {
          name: '添加',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        },
        delete: {
          name: '删除',
          auth: false
        }
      },
      statusData: [
        {id: 0, name: '禁止'},
        {id: 1, name: '启用'}
      ],
      statusDes: ['禁用', '启用'],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        code: [{
          required: true,
          trigger: 'blur',
          message: '请填写编号'
        }],
        name: [{
          required: true,
          trigger: 'blur',
          message: '请填写字典名'
        }],
        value: [{
            required: true,
            trigger: 'blur',
            message: '请填写字典值'
        }]
      },
      expandArr: [],
      isSearch: false,
      changeId: '',
      changePid: '',
      dialogType: 'new',
      temp: {
        id: '',
        name: '',
        remark: ''
      },
      listQuery: {
        name: ''
      },
      query: {
        id: ''
      },
      treeNode: {},
      dialogVisible: false,
      checkStrictly: true,
      dialogFormVisible: false,
      prarentDialogVisible: false,
      checkParentName: '',
      checkParentId: '',
      keyArr: [''],
      routes: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      dialogStatus: '',
      isChangeParent: false,
      dialogPvVisible: false,
      downloadLoading: false,
      loadNodeMap: new Map()
    }
  },
  created() {
    this.getDictById()
  },
  mounted() {
    getUserBtnByPId({ parentId: this.$route.meta.id }).then(res => {
      if(Array.isArray(res.data)) {
        res.data.map((val) => {
          if(this.btnsPermission.hasOwnProperty(val.code) && val.status === 1 && val.checked === 1) {
            this.btnsPermission[val.code].auth = true
            this.btnsPermission[val.code].name = val.name
          }
        })
      }
    })
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  methods: {
    getDictById() {
      // 通过ID获取一级字典表
      this.listLoading = true
      this.dictData = []
      getDictById().then(res => {
        this.listLoading = false
        let resData = []
        if(Array.isArray(res.data)) {
          res.data.forEach(item => {
            let v = {
              name: item.name,
              code: item.code,
              hasChildren: item.haveChild === 1 ? true : false,
              id: item.id,
              parentId: item.parentId,
              parentName: '',
              remark: item.remark,
              sort: item.sort,
              status: item.status,
              value: item.value,
              createTime: item.createTime
            }
            resData.push(v)
          })
        }
        this.dictData = resData
      })
    },
    load(tree, treeNode, resolve) {
      // 懒加载字典
      const pid = tree.id
      this.loadNodeMap.set(pid, { tree, treeNode, resolve })
      getDictByPid({
        pid: tree.id
      }).then(res => {
        let resData = []
        if(Array.isArray(res.data)) {
          res.data.forEach(item => {
            let v = {
              name: item.name,
              code: item.code,
              hasChildren: item.haveChild === 1 ? true : false,
              id: item.id,
              parentId: item.parentId,
              parentName: tree.name,
              remark: item.remark,
              sort: item.sort,
              status: item.status,
              value: item.value,
              createTime: item.createTime
            }
            resData.push(v)
          })
        }
        if(resData.length === 0) {
          this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap,tree.id,[])
        }
        resolve(resData)
      })
    },
    handleLoad(id, pid, type) {
      /**
       * 根据type动态增删改查
       * type {number} 1:新增 2:更新 3:删除
       */
      if(type === 1) {
        if (this.loadNodeMap.has(id)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(id);
          this.load(tree, treeNode, resolve, id)
        } else if(this.loadNodeMap.has(pid)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(pid);
          this.load(tree, treeNode, resolve, pid)
        } else {
          this.getDictById()
        }
      } else if(type === 2) {
        if (this.loadNodeMap.has(pid)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(pid);
          this.load(tree, treeNode, resolve, pid)
        } else {
          this.getDictById()
        }
      } else if(type === 3) {
        if (this.loadNodeMap.has(pid)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(pid);
          this.load(tree, treeNode, resolve, pid)
        } else {
          this.getDictById()
        }
      }
      
    },
    handleFilter() {
      // 搜索功能
      if(this.listQuery.name.length === 0) {
        this.$message({
          type: 'warning',
          message: '请输入搜索内容！'
        })
      } else {
        this.searchDictByPid(this.listQuery)
      }
    },
    searchDictByPid(obj) {
      // 搜索接口
      searchDictByPid(obj).then(res => {
        this.isSearch = true
        this.searchData = []
        if(Array.isArray(res.data)) {
          this.searchData = this.filterSearch(res.data, '')
        }
      })
    },
    filterSearch(data, msg) {
      const res = data.filter(item => {
        item.parentName = msg
        if(Array.isArray(item.children)) {
          this.filterSearch(item.children, item.name)
        }
        return item
      })
      return res
    },
    async selectParent() {
      // 选择父级
      this.prarentDialogVisible = true
      await this.getAllTree()
    },
    async getAllTree() {
      // 获取父级树列表
      this.listLoading = true
      await getTreeNode().then(res => {
        if(Array.isArray(res.data)) {
          // this.serviceRoutes = res.data
          this.routes = []
          const pData = [
              {
              id: '',
              name: '顶级',
              parentId: '',
              children: res.data
            }
          ]
          console.log('id', this.checkParentId)
          this.routes = this.generateRoutes(pData)
          this.$refs.parentTree.setCheckedKeys([this.checkParentId])
        }
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    generateRoutes(routes) {
      // 生成树
      const res = []
      for (let route of routes) {
        const data = {
          id: route.id,
          title: route.name
        }
        // recursive child routes
        if (Array.isArray(route.children)) {
          data.children = this.generateRoutes(route.children)
        }
        if(this.dialogType === 'edit' && this.role.id === data.id) {
        } else {
          res.push(data)
        }
      }
      return res
    },
    dioCancle() {
      // 取消编辑
      this.dialogVisible = false
      this.checkParentName = ''
      this.checkParentId = ''
      this.routes = []
    },
    handleCheckChange (data, checked, indeterminate) {
      // 通过checked判断选中的父级
      if (checked) {
        let arr = [data.id];
        this.$refs.parentTree.setCheckedKeys(arr);
        this.checkParentId = data.id
        this.checkParentName = data.title
      }
    },
    parentCancle() {
      // 取消选择父元素
      this.isChangeParent = false
      this.checkParentName = ''
      this.checkParentId = ''
      this.prarentDialogVisible = false
    },
    confirmParent() {
      // 确定选择父级事件
      this.isChangeParent = true
      this.prarentDialogVisible = false
    },
    resetResource() {
      // 重置事件
      this.isChangeParent = false
      this.isSearch = false
      this.listQuery = {
        name: ''
      }
      this.searchData = []
      this.getDictById()
    },
    handAddTop() {
      // 新增顶级字典事件
      this.isChangeParent = false
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'top'
      this.dialogVisible = true
      this.checkParentName = ''
      this.checkParentId = ''
      this.$nextTick(() => {
        this.$refs['dictForm'].clearValidate()
      })
    },
    msgEdit(row) {
      // 编辑字典事件
      this.isChangeParent = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(row)
      console.log(row)
      this.checkParentId = row.parentId ? row.parentId : ''
      this.checkParentName = row.parentName
      this.$nextTick(() => {
        this.$refs['dictForm'].clearValidate()
      })
    },
    msgAdd(row) {
      // 添加字典事件
      this.isChangeParent = false
      this.role = Object.assign({}, defaultRole)
      this.role.parentName = row.name
      this.role.parentId = row.parentId
      this.role.id = row.id
      this.checkParentId = row.id
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dictForm'].clearValidate()
      })
    },
    handleDelete(row) {
      // 删除字典
      this.$confirm('此操作将永久删除该系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteDict({ id: row.id }).then(response => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if(this.isSearch) {
              this.searchData = this.filterData(this.searchData, {id: row.id}, 3)
            } else {
              this.handleLoad(row.id, row.parentId, 3)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    regFun() {
      // 校验输入内容
      this.$refs.dictForm.validate((valid) => {
        if (valid) {
          this.confirmRole()
        }
      });
    },
    filterData(arr, obj, type) {
      // 非懒加载时数据动态增删改
      const sData = arr.filter((item, index, array) => {
        let r = true
        if(type === 1) {
          if(item.id === obj.parentId) {
            if(Array.isArray(item.children)) {
              item.children.push(obj)
            } else {
              item.children = []
              item.children.push(obj)
            }
          }
        } else if (type === 2) {
          if(item.id === obj.id) {
            item.name = obj.name
            item.sort = obj.sort
            item.icon = obj.icon 
            item.code = obj.code 
            item.status = obj.status
            item.url = obj.url 
            item.type = obj.type
            item.operation = obj.operation
            item.auth = obj.auth
            item.remark = obj.remark
          }
        } else {
          if(item.id === obj.id) {
            array.splice(index, 1)
            r = false
          }
        }
        if(Array.isArray(item.children)) {
          this.filterData(item.children, obj, type)
        }
        if(r) {
          return item
        }
      })
      return sData
    },
    async confirmRole() {
      // 新增、修改后提交form表单
      this.listLoading = true
      this.dialogVisible = false
      let succMsg = ''
      if (this.dialogType === 'edit') {
        succMsg = '编辑字典成功'
        await updateDict({
        id: this.role.id,
        parentId: this.checkParentName.length > 0? this.checkParentId: this.role.parentId,
        name: this.role.name,
        code: this.role.code,
        status: (this.role.status === '启用'? 1: 0),
        value: this.role.value,
        remark: this.role.remark
        })
        this.listLoading = false
        if(this.isChangeParent) {
           this.resetResource()
         } else {
           if(this.isSearch) {
            this.searchData = this.filterData(this.searchData, parem, 2)
          } else {
            this.handleLoad(this.role.id, this.role.parentId, 2)
          }
         }
      } else if(this.dialogType === 'new') {
        succMsg = '添加字典成功'
        const { data } = await addDict({
          parentId: this.checkParentId,
          name: this.role.name,
          code: this.role.code,
          value: this.role.value,
          remark: this.role.remark
        })
        this.listLoading = false
        if(this.isChangeParent) {
          this.resetResource()
        } else {
          if(this.isSearch) {
            if(data.parentId) {
              this.searchData = this.filterData(this.searchData, data, 1)
            } else {
              this.resetResource()
            }
          } else {
            this.handleLoad(this.role.id, this.role.parentId, 1)
          }
        }
      } else if(this.dialogType === 'top') {
        succMsg = '添加字典成功'
        const { data } = await addDict({
          name: this.role.name,
          code: this.role.code,
          value: this.role.value,
          remark: this.role.remark
        })
        this.listLoading = false
        this.getDictById()
      }
      const { name, remark } = this.role
      this.$notify({
        title: succMsg,
        type: 'success'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .filter-container{
    padding-bottom: 30px;
  }
</style>
