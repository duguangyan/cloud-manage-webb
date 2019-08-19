<template>
  <div class="app-container">

    <div class="filter-container">
      角色名称：
      <el-input v-model="listQuery.name"  placeholder="请输入角色名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      搜索
      </el-button>
    </div>

    <el-button type="primary" size="small" @click="handleAddRole">新增角色</el-button>

    <el-table 
      v-loading="listLoading"
      ref="multipleTable" 
      :data="rolesData"
      tooltip-effect="dark" 
      @selection-change="handleSelectionChange"
      :header-cell-style="{background: '#f3f3f3'}" 
      style="width: 100%;margin-top:10px;">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column align="left" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="left" label="所属系统" width="220">
        <template slot-scope="scope">
          {{ scope.row.systemName }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="备注">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="msgEdit(scope)">编辑</el-button>
          <el-button type="primary" size="small" @click="handleEdit(scope)">分配权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogTitle">
      <el-form :model="role" label-width="80px" label-position="left">
        <template v-if="dialogType ==='edit' || dialogType === 'new'">
         <el-form-item label="角色名称">
            <el-input v-model="role.name" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="role.remark"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              placeholder="请输入备注"
            />
          </el-form-item>
        </template>
        <template v-else>
          <el-form-item label="角色名称">
            <span>{{role.name}}</span>
          </el-form-item>
          <el-form-item label="权限列表">
            <el-tree
              ref="tree"
              :check-strictly="checkStrictly"
              :data="routesData"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              class="permission-tree"
            />
          </el-form-item>
        </template>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { getRoutes, getRoles, addRole, deleteRole, updateRole, getRoleList, addResourceBatch, getRoleResources } from '@/api/manageRole'
import Pagination from '@/components/Pagination'
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  name: 'Roles',
  directives: { waves },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      listLoading: false,
      routes: [],
      rolesList: [],
      rolesData: [],
      dialogVisible: false,
      roleDialogVisible: false,
      dialogType: 'new',
      dialogTitle: '新增角色',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      allPages: 0,
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      multipleSelection: [],
      num: 0
    }
  },
  components: { Pagination },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoleList() 
  },
  methods: {
    handleSelectionChange(val) {
      // 多选事件
    },
    getRoleList() {
      this.listLoading = true
      getRoleList(this.listQuery).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data.records)) {
          this.rolesData = res.data.records
        }
        this.total = res.data.total != null? res.data.total: 0
        this.allPages = res.data.pages != null? res.data.pages: 0
      })
    },
    getList(data) {
      // 分页事件
      this.listQuery.pageIndex = data.page
      this.getRoleList()
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getRoleList()
    },
    async getRoutes(scope) {
      this.listLoading = true
      const res = await getRoutes({ userId: this.$store.getters.userId })
      if(Array.isArray(res.data)) {
        this.serviceRoutes = res.data
        this.routes = this.generateRoutes(res.data)
      }
      this.listLoading = false
    },
    async getRoles() {
      const res = await getRoles({id: 1})
      this.rolesList = res.data.resources
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes) {
      const res = []
      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }
        // const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        const onlyOneShowingChild = false
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          id: route.id,
          title: route.name
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.dialogTitle = '新增角色'
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    msgEdit(scope) {
      this.dialogTitle = '编辑'
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
    },
    handleEdit(scope) {
      this.dialogTitle = '分配权限'
      this.dialogType = 'roles'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.getRoutes()
      getRoleResources({roleId: this.role.id}).then(res => {
        this.$nextTick(() => {
        const routes = Array.isArray(res.data.resources)? this.generateRoutes(res.data.resources): this.generateRoutes([])
        this.$refs.tree.setCheckedNodes(routes)
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
        })
      })
      
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该角色?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          await deleteRole({id: row.id})
          this.rolesData.splice($index, 1)
          this.$message({
            type: '成功',
            message: '角色删除成功!'
          })
          if(this.rolesData.length === 0 && this.allPages - 1 > 0) {
            --this.listQuery.pageIndex
          }
          this.getRoleList()
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      if (this.dialogType === 'edit') {
         await updateRole({
           name: this.role.name,
           remark: this.role.remark,
           id: this.role.id
         })
        for (const v of this.rolesData) {
          if (v.id === this.role.id) {
            const index = this.rolesData.indexOf(v)
            this.rolesData.splice(index, 1, this.role)
            break
          }
        }
      } else if (this.dialogType === 'new') {
        const { data } = await addRole({
          systemId: '592b138f23894630b549af231677e5fe',
          name: this.role.name,
          remark: this.role.remark
        })
        this.getRoleList()
      } else {
        const checkedKeysId = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys()).join(',')
        await addResourceBatch({
           roleId: this.role.id,
           resourceIds: checkedKeysId
        })
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Nmae: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container{
    padding-bottom: 30px;
  }
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
