<template>
  <div class="app-container"  v-loading="btnLoading">

    <div v-if="btnsPermission.search.auth" class="filter-container">
      真实姓名：
      <el-input v-model="listQuery.realName" maxlength="20" placeholder="请输入真实姓名" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      账号：
      <el-input v-model="listQuery.username" maxlength="32" placeholder="请输入用户账号" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      手机号码：
      <el-input v-model="listQuery.phone" maxlength="20" placeholder="请输入手机号码" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
      <el-button v-waves class="filter-item" @click="resetSearch">重置</el-button>
    </div>

    <el-button v-if="btnsPermission.add.auth" type="primary" size="small" @click="handleAddRole">{{btnsPermission.add.name}}</el-button>
    <el-button v-if="btnsPermission.lock.auth" size="small" @click="handleLockMul" >批量锁定</el-button>

    <el-table 
      v-loading="listLoading"
      ref="multipleTable" 
      :data="userData"
      tooltip-effect="dark" 
      border
      @selection-change="handleSelectionChange"
      :header-cell-style="{background: '#f3f3f3'}" 
      style="width: 100%;margin-top:10px;">
      <el-table-column
        type="selection"
        align="center"
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
      <el-table-column align="center" label="操作" min-width="320">
        <template slot-scope="scope">
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="small" @click="msgEdit(scope)">{{btnsPermission.edit.name}}</el-button>
          <el-button v-if="btnsPermission.lock.auth" type="primary" size="small" @click="handleLock(scope)">
            <template v-if="scope.row.status === 0">
              解锁
            </template>
            <template v-else-if="scope.row.status === 1">
              锁定
            </template>
          </el-button>
          <el-button v-if="btnsPermission.role.auth" type="primary" size="small" @click="setRole(scope)">{{btnsPermission.role.name}}</el-button>
          <el-button v-if="btnsPermission.delete.auth" type="danger" size="small" @click="handleDelete(scope)">{{btnsPermission.delete.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogMsg">
      <template v-if="dialogType === 'role'">
         <el-form label-width="80px" label-position="left" >
          <el-form-item label="用户昵称">
              <span>{{role.nickName}}</span>
            </el-form-item>
            <el-form-item label="角色列表">
              <el-table
                v-loading="roleListLoading"
                border
                ref="roleMmulTable"
                :data="roleTable"
                tooltip-effect="dark"
                style="width: 100%"
                @select="roleSelectFun"
                @select-all="roleSelectAllFun">
                <el-table-column
                  type="selection"
                  align="center"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="角色名">
                </el-table-column>
                <el-table-column
                  prop="systemName"
                  label="所属系统">
                </el-table-column>
              </el-table>
            </el-form-item>
          <pagination v-show="roleTotal>0" :total="roleTotal" :page.sync="roleListQuery.pageIndex" :limit.sync="roleListQuery.pageSize"  @pagination="getRoleList" />
         </el-form>
      </template>
      <template v-else>
        <el-form ref="editForm" :model="role" label-width="80px" label-position="left" :rules="dialogType === 'new' ? newRules : editRules">
          <el-form-item v-if="dialogType === 'new'" label="账号" prop="username">
            <el-input v-model.trim="role.username" maxlength="32" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item v-else label="账号">
            <span>{{role.username}}</span>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="role.password" minlength="6" maxlength="64" placeholder="请输入密码" />
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input v-model.trim="role.nickName" maxlength="20" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model.trim="role.realName" maxlength="20" placeholder="请输入真实姓名" />
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model.trim="role.phone" maxlength="20" placeholder="请输入手机号码" />
          </el-form-item>
          <el-form-item v-if="dialogType === 'new'" label="系统" prop="systemId">
            <el-select v-model.trim="role.systemId" placeholder="请选择">
              <el-option
                v-for="item in systemData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="diaDisable" @click="regFun">确定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { getUserBtnByPId } from '@/api/upms/menu'
import { getUserList, updateUser, addUser, userDelete, lockUser, lockUsers, processUserRoleBatch } from '@/api/upms/manageUser'
import { getRoleList } from '@/api/upms/manageRole'
import { getSystem } from '@/api/upms/systemList'
import Pagination from '@/components/Pagination'
import { validTelphone } from '@/utils/validate'
const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  name: 'permissionUser',
  directives: { waves },
  data() {
    const validateTelphone = (rule, value, callback) => {
      if (!validTelphone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
          callback()
      }
      if (value && !validTelphone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
          callback()
      }
    }
    const validateLen = (rule, value, callback) => {
      if(rule.required) {
          if (!value) {
          callback(new Error(rule.des))
        } else if (value.length < 5 || value.length > 64) {
          callback(new Error(rule.lenDes))
        } else if (!/^[a-zA-Z0-9]*$/.test(value)) {
          callback('密码只能由字母、数字数字组成')
        } else {
            callback()
        }
      } else {
        if (value && (value.length < 5 || value.length > 64)) {
          callback(new Error(rule.lenDes))
        } else if (value && !/^[a-zA-Z0-9]*$/.test(value)) {
          callback('密码只能由字母、数字数字组成')
        } else {
            callback()
        }
      }
      
    }
    return {
      role: Object.assign({}, defaultRole),
      roleClose: {},
      roleTable: [],
      listLoading: false,
      roleListLoading: false,
      diaDisable: false,
      btnLoading: false,
      systemData: [],
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        add: {
          name: '添加',
          auth: false
        },
        lock: {
          name: '锁定',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        },
        role: {
          name: '分配角色',
          auth: false
        },
        delete: {
          name: '删除',
          auth: false
        }
      },
      editRules: {
        phone: [{
            required: true,
            trigger: 'blur',
            validator: validateTelphone
        }],
        nickName: [{
            required: false,
            trigger: 'blur',
            message: '请填写昵称'
        }],
        password: [{
            required: false,
            trigger: 'blur',
            validator: validateLen,
            lenDes: '密码长度下限为5，上限为64',
            des: '请填写密码'
        }],
        systemId: [{
            required: true,
            trigger: 'blur',
            message: '请选择系统'
        }]
      },
      newRules: {
        phone: [{
            required: true,
            trigger: 'blur',
            validator: validateTelphone
        }],
        nickName: [{
            required: true,
            trigger: 'blur',
            message: '请填写昵称'
        }],
        username: [{
            required: true,
            trigger: 'blur',
            validator: validateLen,
            lenDes: '账号长度下限为5，上限为64',
            des: '请填写账号'
        }],
        password: [{
            required: true,
            trigger: 'blur',
            validator: validateLen,
            lenDes: '密码长度下限为5，上限为64',
            des: '请填写密码'
        }],
        systemId: [{
            required: true,
            trigger: 'blur',
            message: '请选择系统'
        }]
      },
      routes: [],
      rolesList: [],
      userData: [],
      dialogVisible: false,
      dialogType: 'new',
      dialogMsg: '新增角色',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      roleTotal: 0,
      allPages: 0,
      listQuery: {
        username: '',
        phone: '',
        realName: '',
        pageIndex: 1,
        pageSize: 10
      },
      roleListQuery: {
        userId: '',
        pageIndex: 1,
        pageSize: 10
      },
      userMulSelect: [],
      roleMulSelect: [],
      selectObj: {},
      selectData: [],
      addObj: new Set(),
      deleteObj: new Set(),
      addLen: 0
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
    roleSelectFun(val, row) {
      if(this.addLen < val.length) {
        if(row.userHave === 0) {
          this.addObj.add(row.id)
        } else {
          this.deleteObj.delete(row.id)
        }
      } else {
        if(row.userHave === 1) {
          this.deleteObj.add(row.id)
        } else {
          this.addObj.delete(row.id)
        }
      }
      this.addLen = val.length
    },
    roleSelectAllFun(selection) {
      let allData = []
      if(selection.length > 0) {
        allData = selection
      } else {
        allData = this.roleTable
      }
      allData.forEach(item => {
        if(this.addLen < allData.length) {
          if(item.userHave === 0) {
            this.addObj.add(item.id)
          } else {
            this.deleteObj.delete(item.id)
          }
        } else {
          if(item.userHave === 1) {
            this.deleteObj.add(item.id)
          } else {
            this.addObj.delete(item.id)
          }
        }
      })
      this.addLen = allData.length
    },
    handleSelectionChange(val) {
      // 多选事件
      this.userMulSelect = val
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
        this.total = res.data.total
        this.allPages = res.data.pages
        if(Array.isArray(res.data.records)) {
          this.userData = res.data.records
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    getRoleList() {
      this.roleListLoading = true
      getRoleList(this.roleListQuery).then(res => {
        this.roleListLoading = false
        this.roleTotal = res.data.total
        this.addLen = 0
        this.$refs.roleMmulTable.clearSelection()
        if(Array.isArray(res.data.records)) {
          this.roleTable = res.data.records
          this.roleTable.map((val, index) => {
            if(this.addObj.has(val.id) || (!this.deleteObj.has(val.id) && val.userHave === 1)) {
              ++this.addLen
              this.$nextTick(() => {
                this.$refs.roleMmulTable.toggleRowSelection(val, true);//默认选中   
              })
            }
            
          })
        }
      }).catch(err => {
        this.roleListLoading = false
      })
    },
    async getSystem() {
      this.listLoading = true
      await getSystem().then(res => {
        this.listLoading = false
        this.systemData = res.data.records
      }).catch(err => {
        this.listLoading =false
      })
    },
    getList(data) {
      // 分页事件
      this.listQuery.pageIndex = data.page
      this.getUserList()
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getUserList()
    },
    async handleAddRole() {
      // 新增用户
      await this.getSystem()
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogMsg = '新增用户'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
    },
    async msgEdit(scope) {
      // 编辑用户
      await this.getSystem()
      this.dialogType = 'edit'
      this.dialogMsg = '编辑用户'
      this.dialogVisible = true
      this.checkStrictly = true
      this.$nextTick(() => {
        this.$refs.editForm.clearValidate()
      })
      this.roleClone = deepClone(scope.row)
      this.role = deepClone(scope.row)
    },
    handleLock({ $index, row }) {
      // 锁定、解锁用户
      this.listLoading = true
      lockUser({ id: row.id, status: row.status===0? 1: 0 }).then(res => {
        this.listLoading = false
        this.userData[$index].status = this.userData[$index].status === 0? 1: 0
        this.$notify({
          title: '操作成功',
          dangerouslyUseHTMLString: true,
          type: 'success'
        })
      }).catch(err => {
        this.listLoading = false
      })
    },
    async setRole(scope) {
      // 分配角色
      this.dialogType = 'role'
      this.dialogMsg = '分配角色'
      this.role = deepClone(scope.row)
      this.roleListQuery.userId = this.role.id
      this.dialogVisible = true
      this.checkStrictly = true
      this.roleTable = []
      this.addObj = new Set()
      this.deleteObj = new Set()
      this.getRoleList()
    },
    handleLockMul() {
      // 批量锁定用户
      if(this.userMulSelect.length === 0) {
          this.$message({ type: 'warning', message: '请先勾选要锁定的用户！' })
      } else {
        this.$confirm('确定要批量锁定这些用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.btnLoading = true
          let ids = ''
          for(let i = 0; i < this.userMulSelect.length; i++) {
            if(i != this.userMulSelect.length - 1) {
              ids += this.userMulSelect[i].id + ','
            } else {
              ids += this.userMulSelect[i].id
            }
          }
          lockUsers({ ids: ids }).then(res => {
            for (const v1 of this.userMulSelect) {
              for(const v2 of this.userData) {
                if(v1.id === v2.id) {
                  const index = this.userData.indexOf(v2)
                  this.userData[index].status = 0
                  break
                }
              }
            }
            this.$notify({
              title: '批量锁定成功',
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            this.getUserList()
          }).catch(err => {
            this.btnLoading = false
          })
          this.btnLoading = false
        })
      }
    },
    handleDelete({ row }) {
      this.$confirm('确定要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.listLoading = true
          userDelete({id: row.id}).then(res => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '用户删除成功!'
            })
            if(this.userData.length === 1 && this.allPages - 1 > 0) {
              --this.listQuery.pageIndex
            }
            this.getUserList()
          }).catch(err => {
            this.listLoading = false
          })
        }).catch(err => { console.error(err) })
    },
    regFun () {
      if(this.dialogType === 'role') {
        this.confirmRole()
      } else {
        this.$refs.editForm.validate(valid => {
          if(valid) {
            this.confirmRole()
          }
        })
      }
      
    },
    async confirmRole() {
      let noErr = true
      this.diaDisable = true
      if ( this.dialogType === 'edit') {
        this.roleListLoading = true
        let param = {
           username: this.role.username,
           id: this.role.id,
           phone: this.role.phone,
           nickName: this.role.nickName
         }
         if(this.role.realName && this.role.realName !== this.roleClone.realName) {
           param.realName = this.role.realName
         }
         if(this.role.password && this.role.password !== this.roleClone.password) {
           param.password = this.role.password
         }
         await updateUser(param).catch(err => { 
          noErr = false
        })
        this.diaDisable = false
        this.roleListLoading = false
        this.getUserList()
      } else if (this.dialogType === 'new') {
        this.roleListLoading = true
        await addUser({
          systemId: this.role.systemId,
          nickName: this.role.nickName,
          username: this.role.username,
          realName: this.role.realName,
          phone: this.role.phone,
          password: this.role.password
        }).catch(err => { 
          noErr = false
        })
        this.diaDisable = false
        this.roleListLoading = false
        this.getUserList()
      } else if(this.dialogType === 'role') {
        let addIds = ''
        let deleteIds = ''
        this.addObj.forEach((item) => {
          addIds += addIds.length === 0? item: ',' + item
        })
        this.deleteObj.forEach((item) => {
          deleteIds += deleteIds.length === 0? item: ',' + item
        })
        if(addIds.length === 0 && deleteIds.length === 0) {
          this.$message({
            message: '请先选择角色',
            type: 'warning'
          })
          return false
        }
        this.roleListLoading = true
        await processUserRoleBatch({
          userId: this.role.id,
          roleIds: addIds,
          delRoleIds: deleteIds
        }).catch(err => { 
          noErr = false
        })
        this.diaDisable = false
        this.roleListLoading = false
        this.roleListQuery.pageIndex = 1
        this.getRoleList()
      }
      if(noErr) {
        const { description, key, name } = this.role
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          dangerouslyUseHTMLString: true,
          type: 'success'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .mr10{
    margin-right: 10px;
  }
  .user-avatar{
    width: 30px;
    height: 30px;
    border-radius: 50%;
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
