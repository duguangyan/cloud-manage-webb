<template>
  <div v-loading="searchLoading" class="app-container">

    <div class="filter-container">
      <template v-if="btnsPermission.search.auth">
        名称：
        <el-input v-model.trim="listQuery.name" maxlength="64" placeholder="请输入用户姓名" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
        状态：
        <el-select v-model="listQuery.status" class="mr10" placeholder="请选择">
          <el-option
            v-for="item in statusData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        类型：
        <el-select v-model="listQuery.type" class="mr10" placeholder="请选择">
          <el-option
            v-for="item in typeData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
      

      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetResource">重置</el-button>
      <el-button v-if="btnsPermission.addSource.auth" v-waves class="filter-item" @click="handleAddResource">{{btnsPermission.addSource.name}}</el-button>
    </div>

    <el-table
      v-if="isLazy"
      :header-cell-style="{background: '#f3f3f3'}" 
      ref="treeTable"
      v-loading="listLoading"
      :data="meanData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="名称"
        >
        <template slot-scope="{ row }">
            <svg-icon v-if="row.icon" :icon-class="row.icon" />
            <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center"
        width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">菜单</span>
          <span v-else-if="scope.row.type === 1">按钮</span>
          <span v-else-if="scope.row.type === 2">接口</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="链接地址"
        align="center"
        width="500">
      </el-table-column>
      <el-table-column
        label="状态"
        width="60"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">禁用</span>
          <span v-else-if="scope.row.status === 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column
        label="事件"
        width="150"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operation === 0">--</span>
          <span v-else-if="scope.row.operation === 1">tab打开</span>
          <span v-else-if="scope.row.operation === 2">窗口打开</span>
        </template>
      </el-table-column>
      <el-table-column
        label="授权"
          width="100"
        align="center">
        <template slot-scope="scope" v-if="scope.row.type !== 1">
          <span v-if="scope.row.auth === -1">禁止</span>
          <span v-else-if="scope.row.auth === 0">不需要认证</span>
          <span v-else-if="scope.row.auth === 1">已认证</span>
          <span v-else-if="scope.row.auth === 2">角色</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button v-if="btnsPermission.add.auth" type="primary" size="mini" @click="msgAdd(row)">
            {{btnsPermission.add.name}}
          </el-button>
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="mini" @click="msgEdit(row)">
            {{btnsPermission.edit.name}}
          </el-button>
          <el-button v-if="btnsPermission.delete.auth && row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            {{btnsPermission.delete.name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

     <el-table
        v-show="!isLazy"
        rel="searchTree"
        :header-cell-style="{background: '#f3f3f3'}" 
        :data="searchData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
       >
      <el-table-column
        prop="name"
        label="名称"
        >
        <template slot-scope="{ row }">
            <svg-icon v-if="row.icon" :icon-class="row.icon" />
            <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center"
        width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 0">菜单</span>
          <span v-else-if="scope.row.type === 1">按钮</span>
          <span v-else-if="scope.row.type === 2">接口</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="链接地址"
        align="center"
        width="250">
      </el-table-column>
      <el-table-column
        label="状态"
          width="60"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">禁用</span>
          <span v-else-if="scope.row.status === 1">启用</span>
        </template>
      </el-table-column>
      <el-table-column
        label="事件"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operation === 0">--</span>
          <span v-else-if="scope.row.operation === 1">tab打开</span>
          <span v-else-if="scope.row.operation === 2">窗口打开</span>
        </template>
      </el-table-column>
      <el-table-column
        label="授权"
          width="100"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.auth === -1">禁止</span>
          <span v-else-if="scope.row.auth === 0">不需要认证</span>
          <span v-else-if="scope.row.auth === 1">已认证</span>
          <span v-else-if="scope.row.auth === 2">角色</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="msgAdd(row)">
            添加
          </el-button>
          <el-button type="primary" size="mini" @click="msgEdit(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑':'新增资源'">
      <el-form ref="meanForm" v-loading="diaLoading" :model="role" label-width="80px" label-position="left" :rules="rules">
        <el-form-item label="父级">
          <span v-if="checkParentName.length > 0" class="mr10">{{checkParentName}}</span>
          <span v-else-if="role.parentName !== undefined && role.parentName !== ''" class="mr10">{{role.parentName}}</span>
          <span v-else class="mr10">顶级</span>
          <el-button v-waves class="filter-item" size="small" @click="selectParent">选择父级</el-button>
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model="role.name" maxlength="64" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item prop="type" label="类型">
          <el-select v-model="role.type" placeholder="请选择">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="role.type === 1" label="按钮code">
          <el-input v-model="role.code" maxlength="32" placeholder="请输入按钮code" />
        </el-form-item>
         <el-form-item v-if="role.type === 0 || role.type === 2" label="链接地址">
          <el-input v-model="role.url" maxlength="255" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item v-if="role.type === 0" label="图标">
          <svg-icon v-if="role && role.icon" :icon-class="role.icon" class="mr10" />
          <el-button v-waves class="filter-item" size="small" @click="selectIcon">选择图标</el-button>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="role.status" placeholder="请选择">
            <el-option
              v-for="item in statusData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="role.type === 0" label="事件">
          <el-select v-model="role.operation" placeholder="请选择">
            <el-option
              v-for="item in operaData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="role.type === 2" label="授权">
          <el-select v-model="role.auth" placeholder="请选择">
            <el-option
              v-for="item in authData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="role.sort" maxlength="11" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="描述">
        <el-input
          v-model="role.remark"
          :autosize="{ minRows: 2, maxRows: 4}"
          type="textarea"
          maxlength="255"
          placeholder="请输入描述内容"
        />
      </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dioCancle">取消</el-button>
        <el-button type="primary" @click="regFun" :disabled="diaDisable">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="prarentDialogVisible" :closeOnClickModal="false" :title="'选择父级'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="权限列表">
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

    <el-dialog class="icon-box" :visible.sync="iconDialogVisible" :closeOnClickModal="false" :title="'选择图标'">
      
            <div v-for="item of svgIcons" :key="item" @click="handleClipboard(item, $event)">
                <div class="icon-item">
                  <svg-icon :icon-class="item" class-name="disabled" />
                  <span>{{ item }}</span>
                </div>
            </div>
            <div class="clear"></div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { getMeanFirstRec, getMeanByPid, resourceDelete, updateUser, addResource, updateResource, getUserBtnByPId, resourceSearch, getResourceById } from '@/api/upms/menu'
import { getRoutes } from '@/api/upms/manageRole'
import { getSystem } from '@/api/upms/systemList'
import Pagination from '@/components/Pagination'
import svgIcons from './svg-icons'
const defaultRole = {
  name: '',
  status: '',
  url: '',
  type: '',
  operation: '',
  auth: '',
  remark: ''
}

export default {
  name: 'systemMenu',
  directives: { waves },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      svgIcons,
      isLazy: true,
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      searchLoading: false,
      systemData: [],
      meanData: [],
      searchData: [],
      keyArr: [''],
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        add: {
          name: '添加',
          auth: false
        },
        addSource: {
          name: '新增资源',
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
      rules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: '请填写名称'
        }],
        type: [{
            required: true,
            trigger: 'change',
            message: '请选择类型'
        }]
      },
      statusData: [
        {
          value: 0,
          label: '禁止'
        },
        {
          value: 1,
          label: '启用'
        }
      ],
      typeData: [
        {
          value: 0,
          label: '菜单'
        },
        {
          value: 1,
          label: '按钮'
        },
        {
          value: 2,
          label: '接口'
        }
      ],
      operaData: [
        {
          value: 0,
          label: '--'
        },
        {
          value: 1,
          label: 'tab打开'
        },
        {
          value: 2,
          label: '窗口打开'
        }
      ],
      authData: [
        {
          value: -1,
          label: '禁止'
        },
        {
          value: 0,
          label: '不需要认证'
        },
        {
          value: 1,
          label: '已认证'
        },
        {
          value: 2,
          label: '角色'
        }
      ],
      isChangeParent: false,
      routes: [],
      rolesList: [],
      resourceData: [],
      dialogVisible: false,
      prarentDialogVisible: false,
      iconDialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      allPages: 0,
      listQuery: {
        name: '',
        status: '',
        type: ''
      },
      searchQuery: {

      },
      checkParentId: '',
      checkParentName: '',
      iconShow: '',
      parentShowId: '',
      multipleSelection: [],
      loadNodeMap: new Map(),
      isSearch: false
    }
  },
  components: { Pagination },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getMeanFirstRec()
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
  methods: {
    getMeanFirstRec() {
      // 获取一级资源树
      this.meanData = []
      this.listLoading = true
      getMeanFirstRec().then(res => {
        this.listLoading = false
        let resData = []
        if(Array.isArray(res.data)) {
          for(let i = 0; i < res.data.length; i++) {
            let obj = {
              name: res.data[i].name,
              id: res.data[i].id,
              parentId: res.data[i].parentId,
              parentName: '',
              code: res.data[i].code,
              icon: res.data[i].icon,
              url: res.data[i].url,
              sort: typeof(res.data[i].sort) === 'number'? res.data[i].sort: 0,
              status: res.data[i].status,
              operation: res.data[i].operation,
              auth: res.data[i].auth,
              type: res.data[i].type,
              remark: res.data[i].remark === null? '': res.data[i].remark,
              hasChildren: res.data[i].haveChild === 1? true: false
            }
            resData.push(obj)
          }
        }
        this.meanData = resData
      })
    },
    load(tree, treeNode, resolve) {
      // 懒加载资源树
      this.loadNodeMap.set(tree.id, { tree, treeNode, resolve })
      getMeanByPid({
        parentId: tree.id
      }).then(res => {
        let data = []
        if(Array.isArray(res.data)) {
          for(let i = 0; i < res.data.length; i++) {
            let obj = {
              name: res.data[i].name,
              id: res.data[i].id,
              parentId: res.data[i].parentId,
              parentName: tree.name,
              code: res.data[i].code,
              icon: res.data[i].icon,
              url: res.data[i].url,
              sort: typeof(res.data[i].sort) === 'number'? res.data[i].sort: 0,
              status: res.data[i].status,
              operation: res.data[i].operation,
              auth: res.data[i].auth,
              type: res.data[i].type,
              remark: res.data[i].remark === null? '': res.data[i].remark,
              hasChildren: res.data[i].haveChild === 1? true: false
            }
            data.push(obj)
          }
        }
        if(data.length === 0) {
          this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap,tree.id,[])
        }
        resolve(data)
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
          this.getMeanFirstRec()
        }
      } else if(type === 2) {
        if (this.loadNodeMap.has(pid)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(pid);
          this.load(tree, treeNode, resolve, pid)
        } else {
          this.getMeanFirstRec()
        }
      } else if(type === 3) {
        if (this.loadNodeMap.has(pid)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(pid);
          this.load(tree, treeNode, resolve, pid)
        } else {
          this.getMeanFirstRec()
        }
      }
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
    dioCancle() {
      // 取消编辑
      this.dialogVisible = false
      this.checkParentName = ''
      this.checkParentId = ''
      this.routes = []
    },
    handleClipboard(text, event) {
      // 复制图标
      this.iconDialogVisible = false
      this.role.icon = text
    },
    parentCancle() {
      // 取消选择父级
      this.isChangeParent = false
      this.checkParentName = ''
      this.checkParentId = ''
      this.prarentDialogVisible = false
    },
    async getRoutes() {
      // 获取资源树
      this.listLoading = true
      await getRoutes().then(res => {
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
          this.routes = this.generateRoutes(pData)
          this.$refs.parentTree.setCheckedKeys([this.parentShowId]);
        }
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
      
    },
    generateRoutes(routes) {
      // 生成资源树
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
        if(this.role.id !== data.id) {
          res.push(data)
        }
      }
      return res
    },
    handleFilter() {
      // 搜索事件
      if(this.listQuery.status === '' && this.listQuery.type === '' && this.listQuery.name.length === 0) {
        this.$message({
          type: 'warning',
          message: '请输入搜索内容或选择搜索状态、类型！'
        })
      } else {
        this.searchQuery = deepClone(this.listQuery)
        this.resourceSearch(this.listQuery)
      }
    },
    resourceSearch(obj) {
      // 搜索接口
      this.searchLoading = true
      resourceSearch(obj).then(res => {
        this.isSearch = true
        this.searchLoading = false
        this.meanData = []
        this.isLazy = false
        if(Array.isArray(res.data)) {
          this.searchData = res.data
        }
      }).catch(err => {
        this.searchLoading = false
      })
    },
    resetResource() {
      // 重置事件
      this.isChangeParent = false
      this.isSearch = false
      this.isLazy = true
      this.listQuery = {
        name: ''
      }
      this.searchData = []
      this.getMeanFirstRec()
    },
    async handleAddResource() {
      // 添加顶级资源
      this.isChangeParent = false
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.checkStrictly = true
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['meanForm'].clearValidate()
      })
    },
    msgEdit(row) {
      // 编辑资源
      this.isChangeParent = false
      this.dialogVisible = true
      this.checkStrictly = true
      this.dialogType = 'edit'
      this.role = deepClone(row)
      console.log(this.role)
      this.$nextTick(() => {
        this.$refs['meanForm'].clearValidate()
      })
    },
    msgAdd(row) {
      // 添加资源
      this.isChangeParent = false
      this.dialogType = 'new'
      const pName = row.name
      const pId = row.id
      this.role = Object.assign({}, defaultRole)
      this.role.parentName = pName
      this.role.parentId = row.parentId
      this.role.id = row.id
      this.checkParentId = pId
      this.dialogType = 'new'
      this.dialogVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs['meanForm'].clearValidate()
      })
    },
    async selectParent() {
      // 选择父级事件
      if(this.role && this.role.parentId) {
        this.parentShowId = this.role.parentId
      } else {
        this.parentShowId = ''
      }
      this.prarentDialogVisible = true
      await this.getRoutes()
    },
    selectIcon() {
      // 选择图标
      this.iconDialogVisible = true
    },
    handleCheckChange (data, checked, indeterminate) {
      // 通过checked进行判断
      if (checked) {
        let arr = [data.id];
        this.$refs.parentTree.setCheckedKeys(arr);
        this.checkParentId = data.id
        this.checkParentName = data.title
      }
    },
    handleDelete(row) {
      // 删除资源
      this.$confirm('确定要删除该资源?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.listLoading = true
          await resourceDelete({id: row.id})
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
        }).catch(err => {
            this.listLoading = false
      })
    },
    regFun() {
      // 校验表单
      this.$refs.meanForm.validate((valid) => {
        if (valid) {
          this.confirmRole()
        }
      });
    },
    async confirmRole() {
      // 新增、编辑后提交表单
      const isEdit = this.dialogType === 'edit'
      let succMsg = ''
      if (isEdit) {
        succMsg = '编辑成功'
        this.diaDisable = true
        this.diaLoading = true
        let parem = {
           id: this.role.id,
           name: this.role.name,
           sort: this.role.sort,
           icon: this.role.icon,
           code: this.role.code,
           parentId: this.checkParentName.length > 0? this.checkParentId: this.role.parentId,
           status: this.role.status,
           url: this.role.url,
           type: this.role.type,
           operation: this.role.operation,
           auth: this.role.auth,
           remark: this.role.remark
         }
         await updateResource(parem).catch(err => {
           this.diaDisable = false
          this.diaLoading = false
         })
         this.diaDisable = false
         this.diaLoading = false
         if(this.isChangeParent) {
           this.resetResource()
         } else {
           if(this.isSearch) {
          // this.resourceSearch(this.searchQuery)
            this.searchData = this.filterData(this.searchData, parem, 2)
          } else {
            this.handleLoad(this.role.id, this.role.parentId, 2)
          }
         }
      } else {
        succMsg = '新增成功'
        this.diaDisable = true
        this.diaLoading = true
        const { data } = await addResource({
          name: this.role.name,
          sort: this.role.sort,
          icon: this.role.icon,
          code: this.role.code,
          parentId: this.checkParentId,
          url: this.role.url,
          type: this.role.type,
          operation: this.role.operation,
          auth: this.role.auth,
          remark: this.role.remark
        }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        this.diaDisable = false
        this.diaLoading = false
        if(this.isChangeParent) {
          this.resetResource()
        } else {
          if(this.isSearch) {
            // this.resourceSearch(this.searchQuery)
            if(data.parentId) {
              this.searchData = this.filterData(this.searchData, data, 1)
            } else {
              this.resetResource()
            }
          } else {
            this.handleLoad(this.role.id, this.role.parentId, 1)
          }
        }
        
      }
      this.checkParentName = ''
      this.checkParentId = ''
      const { name, url, remark } = this.role
      this.dialogVisible = false
      this.$notify({
        title: succMsg,
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
    },
    confirmParent() {
      // 选择父级确认
      this.isChangeParent = true
      this.prarentDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .icon-box{
    .clear{
      clear: both;
    }
    .icon-item {
      margin: 10px;
      height: 85px;
      text-align: center;
      width: 95px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }

    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }

    .disabled {
      pointer-events: none;
    }
  }
  .mr10{
    margin-right: 10px;
  }
  .filter-container{
    padding-bottom: 30px;
  }
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin: 7px 0 30px 0;
  }
}
</style>
