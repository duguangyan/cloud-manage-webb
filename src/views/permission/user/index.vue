<template>
  <div class="app-container">

    <div class="filter-container">
      用户姓名：
      <el-input v-model="listQuery.username"  placeholder="请输入用户姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      手机号码：
      <el-input v-model="listQuery.phone"  placeholder="请输入手机号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="resetSearch">重置</el-button>
    </div>

    <el-button type="primary" size="small" @click="handleAddRole">新增角色</el-button>
    <el-button size="small" @click="handleLockMul" >批量锁定</el-button>

    <el-table 
      v-loading="listLoading"
      ref="multipleTable" 
      :data="userData"
      tooltip-effect="dark" 
      @selection-change="handleSelectionChange"
      :header-cell-style="{background: '#f3f3f3'}" 
      style="width: 100%;margin-top:10px;">
      <el-table-column
        type="selection"
        width="55"> 
      </el-table-column>
      <el-table-column align="center" label="头像" width="220">
        <template slot-scope="scope">
          <img v-if="scope.row.headImgUrl && scope.row.headImgUrl.length > 0" :src="scope.row.headImgUrl" class="user-avatar">
          <img v-else-if="scope.row.headImgUrl === '' || scope.row.headImgUrl === null" src= "@/assets/img/circle_avatar.png" size="50" class="user-avatar">
        </template>
      </el-table-column>
      <el-table-column align="center" label="昵称" width="220">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="真实姓名" width="220">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="手机号码" width="220">
        <template slot-scope="scope">
          {{ scope.row.phone }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" width="220">
        <template slot-scope="scope">
          <template v-if="scope.row.status === 0">
              锁定
            </template>
            <template v-else-if="scope.row.status === 1">
              正常
            </template>
            <template v-else-if="scope.row.status === -1">
              删除
            </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="220">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="msgEdit(scope)">编辑</el-button>
          <el-button type="primary" size="small" @click="handleLock(scope)">
            <template v-if="scope.row.status === 0">
              解锁
            </template>
            <template v-else-if="scope.row.status === 1">
              锁定
            </template>
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑用户信息':'新增角色'">
      <el-form ref="editForm" :model="role" label-width="80px" label-position="left" :rules="editRules">
        <el-form-item label="昵称">
          <el-input v-model="role.nickName" placeholder="请输入昵称" />
        </el-form-item>
         <el-form-item label="真实姓名">
          <el-input v-model="role.realName" placeholder="请输入真实姓名" />
        </el-form-item>
         <el-form-item label="手机号码" prop="phone">
          <el-input v-model="role.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="role.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="role.password" minlength="6" maxlength="32" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="系统">
          <el-select v-model="role.systemId" placeholder="请选择">
            <el-option
              v-for="item in systemData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="regFun">确定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { getUserList, updateUser, addUser, userDelete, lockUser, lockUsers } from '@/api/manageUser'
import { getSystem } from '@/api/systemList'
import Pagination from '@/components/Pagination'
import { validTelphone } from '@/utils/validate'
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  name: 'User',
  directives: { waves },
  data() {
    const validateTelphone = (rule, value, callback) => {
      if (!validTelphone(value)) {
          callback(new Error('请输入正确的手机号码'))
      } else {
          callback()
      }
    }
    return {
      role: Object.assign({}, defaultRole),
      listLoading: false,
      systemData: [
      ],
      editRules: {
          phone: [{
              required: false,
              trigger: 'blur',
              validator: validateTelphone
          }]
      },
      routes: [],
      rolesList: [],
      userData: [],
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
        username: '',
        phone: '',
        pageIndex: 1,
        pageSize: 10
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
    this.getUserList() 
    this.getSystem()
  },
  methods: {
    handleSelectionChange(val) {
      // 多选事件
      this.multipleSelection = val
    },
    resetSearch() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 10,
        username: '',
        phone: ''
      },
      this.getUserList()
    },
    getUserList() {
      this.listLoading = true
      getUserList(this.listQuery).then(res => {
        this.listLoading = false
        this.userData = res.data.records
        this.total = res.data.total
        this.allPages = res.data.pages
      })
    },
    getSystem() {
      getSystem().then(res => {
        this.systemData = res.data.records
      })
    },
    getList(data) {
      // 分页事件
      this.listQuery.pageIndex = data.page
      this.getRoleList()
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getUserList()
    },
    async getRoutes(scope) {
      const res = await getRoutes({id: scope.row.id})
      this.serviceRoutes = res.data.resources
      this.routes = this.generateRoutes(res.data)
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
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    msgEdit(scope) {
      if(this.systemData.length === 0) {
        this.getSystem()
      }
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
    },
    handleLock({ $index, row }) {
      this.listLoading = true
      lockUser({ id: row.id }).then(res => {
        this.listLoading = false
        if(this.userData[$index].status === 0) {
          this.userData[$index].status = 1
        } else if(this.userData[$index].status === 1) {
          this.userData[$index].status = 0
        }
      })
    },
    handleLockMul() {
      if(this.multipleSelection.length === 0) {
          this.$message({ type: 'warning', message: '请先勾选要锁定的用户！' })
      } else {
        this.$confirm('确定要批量锁定这些用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          let ids = ''
          for(let i = 0; i < this.multipleSelection.length; i++) {
            if(i != this.multipleSelection.length - 1) {
              ids += this.multipleSelection[i].id + ','
            } else {
              ids += this.multipleSelection[i].id
            }
          }
          lockUsers({ ids: ids }).then(res => {
            for (const v1 of this.multipleSelection) {
              for(const v2 of this.userData) {
                if(v1.id === v2.id) {
                  const index = this.userData.indexOf(v2)
                  this.userData[index].status = 0
                  break
                }
              }
            }
          })
          this.listLoading = false
        })
      }
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该角色?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          await userDelete({id: row.id})
          this.userData.splice($index, 1)
          this.$message({
            type: '成功',
            message: '角色删除成功!'
          })
          if(this.userData.length === 0 && this.allPages - 1 > 0) {
            --this.listQuery.pageIndex
          }
          this.getUserList()
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
    regFun () {
      this.$refs.editForm.validate(valid => {
        if(valid) {
          this.confirmRole()
        }
      })
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      console.log(this.role)
      if (isEdit) {
         await updateUser({
           systemId: this.role.systemId,
           id: this.role.id,
           nickName: this.role.nickName,
           username: this.role.username,
           realName: this.role.realName,
           password: this.role.password,
           phone: this.role.phone
         })
        for (const v of this.userData) {
            if (v.id === this.role.id) {
              const index = this.userData.indexOf(v)
              this.userData.splice(index, 1, this.role)
              break
            }
        }
      } else {
        const { data } = await addUser({
          systemId: '553ebb6cad7440c99d5f89b26ef4fd2c',
          nickName: this.role.nickName,
          username: this.role.username,
          realName: this.role.realName,
          phone: this.role.phone,
          password: this.role.pass
        })
        this.getUserList()
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
  .user-avatar{
    width: 30px;
    height: 30px;
  }
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
