<template>
  <div class="app-container">

    <div v-if="btnsPermission.search.auth" class="filter-container">
      角色名称：
      <el-input v-model="listQuery.name" maxlength="64"  placeholder="请输入角色名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
      {{btnsPermission.search.name}}
      </el-button>
      <el-button v-waves class="filter-item" @click="resetSearch">重置</el-button>
    </div>

    <el-button v-if="btnsPermission.add.auth" type="primary" size="small" @click="handleAddRole">{{btnsPermission.add.name}}</el-button>

    <el-table 
      v-loading="listLoading"
      ref="multipleTable" 
      :data="rolesData"
      tooltip-effect="dark" 
      border
      :header-cell-style="{background: '#f3f3f3'}" 
      style="width: 100%;margin-top:10px;">
      <el-table-column align="center" label="角色名称" width="220">
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
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="small" @click="msgEdit(scope)">{{btnsPermission.edit.name}}</el-button>
          <el-button v-if="btnsPermission.role.auth" type="primary" size="small" @click="handleEdit(scope)">{{btnsPermission.role.name}}</el-button>
          <el-button v-if="btnsPermission.user.auth" type="primary" size="small" @click="setUser(scope)">{{btnsPermission.user.name}}</el-button>
          <el-button v-if="btnsPermission.delete.auth" type="danger" size="small" @click="handleDelete(scope)">{{btnsPermission.delete.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :width="dialogType ==='edit' || dialogType === 'new'?'50%':'80%'" :title="dialogTitle">
      <el-form ref="roleForm" v-loading="diaLoading" :model="role" label-width="80px" label-position="left">
        <template v-if="dialogType ==='edit' || dialogType === 'new'">
         <el-form-item label="角色名称"
         prop="name"
         :rules="{
            required: true, message: '请填写角色名称', trigger: 'blur'
          }">
            <el-input v-model.trim="role.name" maxlength="64" placeholder="请输入角色名称" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="role.remark"
              :autosize="{ minRows: 2, maxRows: 4}"
              type="textarea"
              maxlength="255"
              placeholder="请输入备注"
            />
          </el-form-item>
          <el-form-item label="系统" 
          prop="systemId"
          :rules="{
            required: true, message: '请选择所属系统', trigger: 'change'
          }">
            <el-select v-model="role.systemId" placeholder="请选择">
              <el-option
                v-for="item in systemData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-else-if="dialogType === 'user'">
          <el-form label-width="80px" label-position="left" >
            <el-form-item label="角色名称">
                <span>{{checkRoleName}}</span>
              </el-form-item>
              <el-form-item label="用户列表">
                <el-table
                  v-loading="userListLoading"
                  border
                  ref="userMmulTable"
                  :data="userTable"
                  tooltip-effect="dark"
                  style="width: 100%"
                  >
                  <el-table-column
                    align="center"
                    width="55">
                    <template slot-scope="scope">
                      <el-checkbox v-model="userCheck[scope.row.index]" @change="(val) => userCheckChange(val, scope.row)"></el-checkbox>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="nickName"
                    label="用户名">
                  </el-table-column>
                  <el-table-column
                    prop="realName"
                    label="真实姓名">
                  </el-table-column>
                  <el-table-column
                    prop="username"
                    label="所属系统">
                  </el-table-column>
                </el-table>
              </el-form-item>
            <pagination v-show="userTotal>0" :total="userTotal" :page.sync="userListQuery.pageIndex" :limit.sync="userListQuery.pageSize"  @pagination="getUserByRole" />
          </el-form>
        </template>
        <template v-else>
          <el-form-item label="角色名称">
            <span>{{checkRoleName}}</span>
          </el-form-item>
          <el-form-item label="权限列表">
            <el-table
              ref="tableTree"
              v-loading="treeLoading"
              :data="tableData"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              :indent="15"
              :header-cell-style="{background: '#f3f3f3'}"
              border>
              <el-table-column
              width="55"
              align="center"
              type="index"
              label="选择">
                <template slot-scope="scope">
                 <el-checkbox v-model="checkRoleArr[scope.row.index]" @change="(val) => checkChange(val, scope.row)"></el-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                label="名称"
                show-overflow-tooltip>
                <template slot-scope="{ row }">
                  <svg-icon v-if="row.icon" :icon-class="row.icon" />
                  <span>{{row.name}}</span>
                </template>
              </el-table-column>
              <el-table-column
                width="50"
                align="center"
                label="类型">
                <template slot-scope="scope">
                <span v-if="scope.row.type === 0">菜单</span>
                <span v-else-if="scope.row.type === 1">按钮</span>
                <span v-else-if="scope.row.type === 2">接口</span>
              </template>
              </el-table-column>
              <el-table-column
                prop="url"
                align="center"
                label="链接地址"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                width="50"
                align="center"
                label="状态">
                <template slot-scope="scope">
                <span v-if="scope.row.status === 0">禁用</span>
                <span v-else-if="scope.row.status === 1">启用</span>
              </template>
              </el-table-column>
              <el-table-column
                width="100"
                align="center"
                label="授权">
                <template slot-scope="scope">
                  <div v-if="scope.row.type === 2">
                    <span v-if="scope.row.auth === -1">禁止</span>
                    <span v-else-if="scope.row.auth === 0">不需要认证</span>
                    <span v-else-if="scope.row.auth === 1">已认证</span>
                    <span v-else-if="scope.row.auth === 2">角色</span>
                  </div>
                  <div v-else>
                    <span>角色</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </template>
      </el-form>
      <div v-if="dialogType === 'roles'" style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">关闭</el-button>
      </div>
      <div v-else style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button v-show="dialogType != 'user'" type="primary" :disabled="diaDisable" @click="regFun">确定</el-button>
      </div>
    </el-dialog>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import waves from '@/directive/waves'
import { getUserBtnByPId } from '@/api/upms/menu'
import { getRoles, addRole, deleteRole, updateRole, getRoleList, addResource, deleteResource, getRoleResources, getRoleResourceTree, getUserByRole } from '@/api/upms/manageRole'
import { getSystem } from '@/api/upms/systemList'
import Pagination from '@/components/Pagination'
import { addUserRole, delUserRole } from '@/api/upms/manageUser'
const defaultRole = {
  id: '',
  name: '',
  remark: '',
  systemId: '',
  systemName: '',
  checked: ''
}

export default {
  name: 'permissionRole',
  directives: { waves },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      treeLoading: false,
      userListLoading: false,
      canCheck: false,
      systemData: [],
      rolesList: [],
      rolesData: [],
      userTable: [],
      checkRoleId: '',
      checkUserId: '',
      checkRoleName: '',
      userCheck: '',
      btnsPermission: {
        search: {
          name: '搜索',
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
        role: {
          name: '分配',
          auth: false
        },
        user: {
          name: '分配用户',
          auth: true
        },
        delete: {
          name: '删除',
          auth: false
        }
      },
      bannerRow: {},
      tableData: [],
      checkRoleArr: [],
      checkIndex: 0,
      dialogVisible: false,
      roleDialogVisible: false,
      dialogType: 'new',
      dialogTitle: '新增角色',
      total: 0,
      userTotal: 0,
      allPages: 0,
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      userListQuery: {
        roleId: '',
        pageIndex: 1,
        pageSize: 10
      },
      userMulSelect: [],
      multipleSelection: [],
      num: 0,
      selectObj: {},
      selectData: [],
      addObj: new Set(),
      deleteObj: new Set(),
      addLen: 0
    }
  },
  components: { Pagination },
  created() {
    this.getRoleList() 
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
    getRoleList() {
      let param = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize
      }
      if(this.listQuery.name.length > 0) {
        param.name = this.listQuery.name;
      }
      this.listLoading = true
      getRoleList(param).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data.records)) {
          this.rolesData = res.data.records
        }
        this.total = res.data.total != null? res.data.total: 0
        this.allPages = res.data.pages != null? res.data.pages: 0
      })
    },
    getUserByRole() {
      this.userListLoading = true
      getUserByRole(this.userListQuery).then(res => {
        this.userListLoading = false
        this.userTotal = res.data.total
        this.addLen = 0
        this.$refs.userMmulTable.clearSelection()
        this.userCheck = []
        let userData = []
        if (Array.isArray(res.data.records)) {
          res.data.records.forEach((item, index) => {
            this.userCheck[index] = item.checked == 1 ? true : false
            userData[index] = item
            userData[index].index = index
          })
          this.userTable = userData
          // this.userTable.map((val, index) => {
          //   if(this.addObj.has(val.id) || (!this.deleteObj.has(val.id) && val.checked === 1)) {
          //     ++this.addLen
          //     this.$nextTick(() => {
          //       this.$refs.userMmulTable.toggleRowSelection(val, true);//默认选中   
          //     })
          //   }
            
          // })
        }
      }).catch(err => {
        this.userListLoading = false
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
    async getRoles() {
      const res = await getRoles({id: 1})
      this.rolesList = res.data.resources
    },
    generateTable(routes) {
      const res = []
      for (let route of routes) {
        this.checkIndex++
        const data = {
          id: route.id,
          name: route.name,
          operation: route.operation,
          status: route.status,
          type: route.type,
          url: route.url,
          auth: route.auth,
          icon: route.icon,
          checked: route.checked,
          index: this.checkIndex
        }
        this.checkRoleArr[this.checkIndex] = route.checked === 1
        if (Array.isArray(route.children) && route.children.length > 0) {
          data.haschildren = true
          data.children = this.generateTable(route.children)
        } else {
          data.haschildren = false
        }
        res.push(data)
      }
      return res
    },
    checkChange(val, row) {
      // 分配权限
      this.treeLoading = true
      if (val) {
        addResource({
          roleId: this.checkRoleId,
          resourceId: row.id
        }).then(res => {
          this.treeLoading = false
          this.$notify({
            title: '分配权限成功',
            message: `已为角色分配${row.name}权限`,
            type: 'success'
          })
        })
      } else {
        deleteResource({
          roleId: this.checkRoleId,
          resourceId: row.id
        }).then(res => {
          this.treeLoading = false
          this.$notify({
            title: '取消权限成功',
            message: `已取消角色${row.name}权限`,
            type: 'success'
          })
        })
      }
    },
    userCheckChange(val, row) {
      if (val) {
        addUserRole({
          userId: row.id,
          roleId: this.checkUserId
        }).then(res => {
          this.treeLoading = false
          let nickName = ''
          if (row.nickName) {
            nickName = row.nickName
          }
          this.$notify({
            title: '分配用户成功',
            message: '已为角色分配' + nickName + '用户',
            type: 'success'
          })
        })
      } else {
        delUserRole({
          userId: row.id,
          roleId: this.checkUserId
        }).then(res => {
          this.treeLoading = false
          let nickName = ''
          if (row.nickName) {
            nickName = row.nickName
          }
          this.$notify({
            title: '取消用户分配成功',
            message: '已取消角色用户' + nickName + '分配',
            type: 'success'
          })
        })
      }
    },
    async setUser(scope) {
      // 分配用户
      this.dialogType = 'user'
      this.dialogTitle = '分配用户'
      this.checkUserId = scope.row.id
      this.userListQuery.pageIndex = 1
      this.checkRoleName = scope.row.name
      this.userListQuery.roleId  = scope.row.id
      this.dialogVisible = true
      this.checkStrictly = true
      this.userTable = []
      // this.addObj = new Set()
      // this.deleteObj = new Set()
      this.getUserByRole()
    },
    async getSystem() {
      this.listLoading = true
      await getSystem({
        pageIndex: 1,
        pageSize: 500
      }).then(res => {
        this.listLoading = false
        this.systemData = res.data.records
      }).catch(err => {
        this.listLoading =false
      })
    },
    async handleAddRole() {
      await this.getSystem()
      this.dialogTitle = '新增角色'
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    async msgEdit(scope) {
      await this.getSystem()
      this.dialogTitle = '编辑'
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    async handleEdit(scope) {
      this.dialogTitle = '分配权限'
      this.dialogType = 'roles'
      this.canCheck = false
      this.dialogVisible = true
      this.checkRoleId = scope.row.id
      this.checkRoleName = scope.row.name
      this.treeLoading = true
      getRoleResourceTree({roleId: scope.row.id}).then(res => {
        this.treeLoading = false
        this.checkIndex = 0
        this.tableData = this.generateTable(res.data)
      })
    },
    handleDelete({ row }) {
      this.$confirm('确定要删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.listLoading = true
        await deleteRole({id: row.id}).catch(err => {
          this.listLoading = false
        })
        this.listLoading = false
        this.$message({
          type: '成功',
          message: '角色删除成功!'
        })
        if(this.rolesData.length === 1 && this.allPages - 1 > 0) {
          --this.listQuery.pageIndex
        }
        this.getRoleList()
      }).catch(err => { console.error(err) })
    },
    regFun() {
      // 输入校验
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          this.confirmRole()
        } 
      });
    },
    async confirmRole() {
      if (this.dialogType === 'edit') {
         this.diaDisable = true
         this.diaLoading = true
         await updateRole({
           name: this.role.name,
           remark: this.role.remark,
           id: this.role.id,
           systemId: this.role.systemId
         }).catch(err => {
           this.diaDisable = false
           this.diaLoading = false
         })
        for (const v of this.rolesData) {
          if (v.id === this.role.id) {
            const index = this.rolesData.indexOf(v)
            this.rolesData.splice(index, 1, this.role)
            break
          }
        }
        this.diaDisable = false
        this.diaLoading = false
      } else if (this.dialogType === 'new') {
        this.diaDisable = true
        this.diaLoading = true
        const { data } = await addRole({
          systemId: this.role.systemId,
          name: this.role.name,
          remark: this.role.remark
        }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        this.diaDisable = false
        this.diaLoading = false
        this.getRoleList()
      }
      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: '成功',
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
    },
    resetSearch() {
      this.listQuery = {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      this.getRoleList()
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
