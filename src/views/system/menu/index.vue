<template>
  <div class="app-container">

    <div class="filter-container">
      名称：
      <el-input v-model="listQuery.name"  placeholder="请输入用户姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      状态：
      <el-select v-model="listQuery.status" placeholder="请选择">
        <el-option
          v-for="item in statusData"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      类型：
      <el-select v-model="listQuery.type" placeholder="请选择">
        <el-option
          v-for="item in typeData"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="resetResource">重置</el-button>
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleAddResource">新增资源</el-button>
    </div>

    <el-table 
      ref="multipleTable" 
      :data="resourceData"
      tooltip-effect="dark" 
      @selection-change="handleSelectionChange"
      :header-cell-style="{background: '#f3f3f3'}" 
      style="width: 100%;margin-top:10px;">
      <el-table-column align="center" label="名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="类型" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.type === 0">
            菜单
          </template>
          <template v-else-if="scope.row.type === 1">
            按钮
          </template>
          <template v-else-if="scope.row.type === 2">
            接口
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="链接地址" width="220">
        <template slot-scope="scope">
          {{ scope.row.url }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 0">
          禁用
          </template>
          <template v-else-if="scope.row.status === 1">
          启用
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="事件" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.operation === 0">
          tab打开
          </template>
          <template v-else-if="scope.row.operation === 1">
          窗口打开
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="授权" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.auth === -1">
          禁止
          </template>
          <template v-else-if="scope.row.auth === 0">
          不需要认证
          </template>
          <template v-else-if="scope.row.auth === 1">
          已认证
          </template>
          <template v-else-if="scope.row.auth === 2">
          角色
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="描述" width="220">
        <template slot-scope="scope">
         {{scope.row.remark}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="msgEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'分配权限':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="role.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="role.type" placeholder="请选择">
            <el-option
              v-for="item in typeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="链接地址">
          <el-input v-model="role.url" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="role.status" placeholder="请选择">
            <el-option
              v-for="item in statusData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件">
          <el-select v-model="role.operation" placeholder="请选择">
            <el-option
              v-for="item in operaData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权">
          <el-select v-model="role.auth" placeholder="请选择">
            <el-option
              v-for="item in authData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="描述">
          <el-input
            v-model="role.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入描述内容"
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
import { getResource, updateUser, addResource, resourceDelete, updateResource } from '@/api/menu'
import { getSystem } from '@/api/systemList'
import Pagination from '@/components/Pagination'
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
  name: 'User',
  directives: { waves },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      systemData: [],
      statusData: [
        {id: 0, name: '禁止'},
        {id: 1, name: '启用'}
      ],
      typeData: [
        {id: 0, name: '菜单'},
        {id: 1, name: '按钮'},
        {id: 2, name: '接口'}
      ],
      operaData: [
        {id: 0, name: 'tab打开'},
        {id: 1, name: '窗口打开'}
      ],
      authData: [
        {id: -1, name: '禁止'},
        {id: 0, name: '不需要认证'},
        {id: 1, name: '已认证'},
        {id: 2, name: '角色'}
      ],
      routes: [],
      rolesList: [],
      resourceData: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      allPages: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        status: '',
        type: ''
      },
      multipleSelection: []
    }
  },
  components: { Pagination },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getResource() 
  },
  methods: {
    handleSelectionChange(val) {
      // 多选事件
    },
    getResource() {
      getResource(this.listQuery).then(res => {
        this.resourceData = res.data.records
        this.total = res.data.total
        this.allPages = res.data.pages
      })
    },
    getList(data) {
      // 分页事件
      this.listQuery.pageIndex = data.page
      this.getResource()
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getResource()
    },
    resetResource() {
      // 重置事件
      this.listQuery = {
        pageIndex: 1,
        pageSize: 10,
        status: '',
        type: ''
      },
      this.getResource()
    },
    async getRoutes(scope) {
      const res = await getRoutes({id: scope.row.id})
      this.serviceRoutes = res.data.resources
      this.routes = this.generateRoutes(res.data)
      console.log(routes)
    },
    async getRoles() {
      const res = await getRoles({id: 1})
      this.rolesList = res.data.resources
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

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
    handleAddResource() {
      this.role = Object.assign({}, defaultRole)
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
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.role.routes = [
        {id: 1, name: 'souye'},
        {id: 2, name: 'caiwuye'}
      ]
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该资源?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          await resourceDelete({id: row.id})
          this.resourceData.splice($index, 1)
          this.$message({
            type: '成功',
            message: '删除成功!'
          })
          if(this.resourceData.length === 0 && this.allPages - 1 > 0) {
            --this.listQuery.pageIndex
          }
          this.getResource()
        }).catch(err => { console.error(err) })
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
      if (isEdit) {
         await updateResource({
           id: this.role.id,
           name: this.role.name,
            status: this.role.status,
           url: this.role.url,
           type: this.role.type,
           operation: this.role.operation,
           auth: this.role.auth,
           remark: this.role.remark
         })
        for (const v of this.resourceData) {
            if (v.id === this.role.id) {
              const index = this.resourceData.indexOf(v)
              this.resourceData.splice(index, 1, this.role)
              break
            }
        }
      } else {
        const { data } = await addResource({
          name: this.role.name,
          // status: this.role.status,
          url: this.role.url,
          type: this.role.type,
          operation: this.role.operation,
          auth: this.role.auth,
          remark: this.role.remark
        })
        this.getResource()
      }

      const { name, url, remark } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>名称: ${name}</div>
            <div>链接: ${url}</div>
            <div>描述: ${remark}</div>
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
