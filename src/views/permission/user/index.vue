<template>
  <div class="app-container"  v-loading="btnLoading">

    <div v-if="btnsPermission.search.auth" class="filter-container">
      <el-input v-model="listQuery.realName"  placeholder="请输入真实姓名" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      账号：
      <el-input v-model="listQuery.username"  placeholder="请输入用户账号" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      手机号码：
      <el-input v-model="listQuery.phone"  placeholder="请输入手机号码" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
      <el-button v-waves class="filter-item" @click="resetSearch">重置</el-button>
    </div>

    <el-button v-if="btnsPermission.add.auth" type="primary" size="small" @click="handleAddRole">{{btnsPermission.add.name}}</el-button>
    <el-button v-if="btnsPermission.lock.auth" size="small" @click="handleLockMul" >{{btnsPermission.lock.name}}</el-button>

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
      <el-table-column align="center" label="操作" min-width="320">
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
          <el-button type="primary" size="small" @click="setRole(scope)">分配角色</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogMsg">
      <template v-if="dialogType === 'role'">
        <el-table
          v-loading="roleListLoading"
          ref="roleMmulTable"
          :data="roleTable"
          tooltip-effect="dark"
          style="width: 100%"
          @select="roleSelectFun">
          <el-table-column
            type="selection"
             label="角色名"
            width="55">
          </el-table-column>
          <el-table-column
            prop="name"
            label="角色名"
          >
          </el-table-column>
        </el-table>
        <pagination v-show="roleTotal>0" :total="roleTotal" :page.sync="roleListQuery.pageIndex" :limit.sync="roleListQuery.pageSize"  @pagination="getRoleList" />
      </template>
      <template v-else>
        <el-form ref="editForm" :model="role" label-width="80px" label-position="left" :rules="editRules">
        <el-form-item label="昵称">
          <el-input v-model="role.nickName" maxlength="255" placeholder="请输入昵称" />
        </el-form-item>
         <el-form-item label="真实姓名">
          <el-input v-model="role.realName" maxlength="255" placeholder="请输入真实姓名" />
        </el-form-item>
         <el-form-item label="手机号码" prop="phone">
          <el-input v-model="role.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="role.username" maxlength="32" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="role.password" minlength="6" maxlength="255" placeholder="请输入密码" />
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
import path from 'path'
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
  name: 'user',
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
          name: '批量锁定',
          auth: false
        }
      },
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
          console.log(val)
          if(this.btnsPermission.hasOwnProperty(val.code)) {
            this.btnsPermission[val.code].auth = val.checked === 1
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
        this.userData = res.data.records
        this.total = res.data.total
        this.allPages = res.data.pages
      }).catch(err => {
        this.listLoading = false
      })
    },
    async getRoleList() {
      this.roleListLoading = true
      const { data } = await  getRoleList(this.roleListQuery).catch(err => {
        this.roleListLoading = false
      })
      this.roleTotal = data.total
      this.addLen = 0
      if(Array.isArray(data.records)) {
        this.roleTable = data.records
        this.roleTable.map((val, index) => {
          if(this.addObj.has(val.id) || (!this.deleteObj.has(val.id) && val.userHave === 1)) {
            ++this.addLen
            this.$nextTick(() => {
              this.$refs.roleMmulTable.toggleRowSelection(val, true);//默认选中   
            })
          }
          
        })
      }
      this.roleListLoading = false
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
      // 新增角色
      await this.getSystem()
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogMsg = '新增角色'
      this.dialogVisible = true
    },
    async msgEdit(scope) {
      // 编辑角色
      await this.getSystem()
      this.dialogType = 'edit'
      this.dialogMsg = '编辑角色'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
    },
    handleLock({ $index, row }) {
      // 锁定、解锁角色
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
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该角色?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.listLoading = true
          await userDelete({id: row.id}).catch(err => {
            this.listLoading = false
          })
          this.listLoading = false
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
      if ( this.dialogType === 'edit') {
        this.diaDisable = true
        this.roleListLoading = true
         await updateUser({
           systemId: this.role.systemId,
           id: this.role.id,
           nickName: this.role.nickName,
           username: this.role.username,
           realName: this.role.realName,
           password: this.role.password,
           phone: this.role.phone
         }).catch(err => { 
           this.diaDisable = false
          this.listLoading = false
        })
        this.diaDisable = false
        this.roleListLoading = false
        for (const v of this.userData) {
            if (v.id === this.role.id) {
              const index = this.userData.indexOf(v)
              this.userData.splice(index, 1, this.role)
              break
            }
        }
      } else if (this.dialogType === 'new'){
        this.diaDisable = true
        this.roleListLoading = true
        const { data } = await addUser({
          systemId: '553ebb6cad7440c99d5f89b26ef4fd2c',
          nickName: this.role.nickName,
          username: this.role.username,
          realName: this.role.realName,
          phone: this.role.phone,
          password: this.role.password
        }).catch(err => { 
          this.diaDisable = false
          this.roleListLoading = false
        })
        this.diaDisable = false
        this.roleListLoading = false
        this.getUserList()
      } else if(this.dialogType === 'role') {
        // let roleIds = ''
        // this.selectObj.map((val, index) => {
        //   val.map((valIn, indexIn) => {
        //     if(index === 0) {
        //     roleIds += valIn.id
        //     } else {
        //       roleIds += ',' + valIn.id
        //     }
        //   })
          
        // })
        let addIds = ''
        let deleteIds = ''
        this.addObj.forEach((item) => {
          addIds += addIds.length === 0? item: ',' + item
        })
        this.deleteObj.forEach((item) => {

          deleteIds += deleteIds.length === 0? item: ',' + item
        })
        this.diaDisable = true
        this.roleListLoading = true
        const { data } = await processUserRoleBatch({
          userId: this.role.id,
          roleIds: addIds,
          delRoleIds: deleteIds
        }).catch(err => { 
          this.diaDisable = false
          this.roleListLoading = false
        })
        this.diaDisable = false
        this.roleListLoading = false
        this.roleListQuery.pageIndex = 1
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
  .mr10{
    margin-right: 10px;
  }
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
