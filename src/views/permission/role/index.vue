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

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'分配权限':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
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
        <!-- <el-form-item label="权限列表">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item> -->
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="roleDialogVisible" :title="'分配权限'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="role.name" placeholder="" readonly />
        </el-form-item>
        <el-form-item label="权限列表">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
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
import { getRoutes, getRoles, addRole, deleteRole, updateRole, getRoleList } from '@/api/manageRole'
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
    // Mock: get all routes and roles list from server
    this.getRoutes()
    // this.getRoles()
    this.getRoleList() 
  },
  methods: {
    handleSelectionChange(val) {
      // 多选事件
      console.log(val)
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
      const res = await getRoutes({userId: 1})
      if(Array.isArray(res.data)) {
        this.serviceRoutes = res.data
        this.routes = this.generateRoutes(res.data)
        console.log('routes')
        console.log(this.routes)
      }
    },
    async getRoles() {
      const res = await getRoles({id: 1})
      this.rolesList = res.data.resources
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      console.log('generateRoutes:')
      console.log(routes)
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        
        // const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        const onlyOneShowingChild = false
        

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        this.num++
        const data = {
          // path: path.resolve(basePath, route.path),
          path: '/example' + this.num,
          title: route.name

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
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
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    msgEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
    },
    handleEdit(scope) {
      // this.dialogType = 'edit'
      this.roleDialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      console.log(this.role)
      getRoutes({userId: this.role.id}).then(res => {
        this.$nextTick(() => {
        
        const routes = Array.isArray(res.data)? this.generateRoutes(res.data): this.generateRoutes([])
        
          
          console.log('edit routes')
          console.log(routes)
          this.$refs.tree.setCheckedNodes(this.generateArr([
            {
            path: "/example1",
            title: "主页"
            }
          ]))
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
      const isEdit = this.dialogType === 'edit'
      
       const checkedKeys = this.$refs.tree.getCheckedKeys()
       console.log('checkedKeys:')
       console.log(checkedKeys)
       this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        console.log(this.role)
        return
        // await updateRole(this.role.key, this.role)
         await updateRole({
           name: this.role.name,
           remark: this.role.remark,
           id: this.role.id
         })
        // for (let index = 0; index < this.rolesData.length; index++) {
        //   if (this.rolesList[index].key === this.role.key) {
        //     this.rolesList.splice(index, 1, Object.assign({}, this.role))
        //     break
        //   }
        // }
        for (const v of this.rolesData) {
          if (v.id === this.role.id) {
            const index = this.rolesData.indexOf(v)
            this.rolesData.splice(index, 1, this.role)
            break
          }
        }
      } else {
        const { data } = await addRole({
          systemId: '592b138f23894630b549af231677e5fe',
          name: this.role.name,
          remark: this.role.remark
        })
        // this.role.key = data.key
        // this.rolesList.push(this.role)
        // this.listQuery.pageIndex = 1
        this.getRoleList()
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
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
