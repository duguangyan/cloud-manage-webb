<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 10px">
      <template v-if="btnsPermission.search.auth">
         名称：<el-input v-model="listQuery.name" maxlength="64" placeholder="请输入名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        客户端ID：<el-input v-model="listQuery.clientId" maxlength="128" placeholder="请输入客户端ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        系统ID：<el-input v-model="listQuery.systemId" maxlength="32" placeholder="请输入系统ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
          {{btnsPermission.search.name}}
        </el-button>
        <el-button v-waves class="filter-item" @click="resetSearch">重置</el-button>
      </template>
      <el-button v-if="btnsPermission.add.auth" class="filter-item" style="margin-left: 10px;" @click="handleCreate">
        {{btnsPermission.add.name}}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      :header-cell-style="{background: '#f3f3f3'}" 
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="名称" prop="name"  width="250"></el-table-column>
      <el-table-column label="客户端ID" prop="clientId" align="center"></el-table-column>
      <el-table-column label="系统ID" prop="systemId" align="center"></el-table-column>
      <el-table-column label="资源ID" prop="resourceIds" align="center"></el-table-column>
      <el-table-column label="授权" prop="authorities" align="center"></el-table-column>
      <el-table-column label="授权方式" prop="authorizedGrantTypes" align="center"></el-table-column>
      <el-table-column label="范围" prop="scope" align="center"></el-table-column>
      <el-table-column label="WEB服务器重定向URI" prop="webServerRedirectUri" align="center"></el-table-column>
      <el-table-column label="ACCESS_TOKEN" prop="accessTokenValidity" align="center"></el-table-column>
      <el-table-column label="REFRESH_TOKEN" prop="refreshTokenValidity" align="center"></el-table-column>
      <el-table-column label="自动批准" prop="autoapprove" align="center"></el-table-column>
      <el-table-column label="附加信息" prop="additionalInformation" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="mini" @click="handleUpdate(row)">
            {{btnsPermission.edit.name}}
          </el-button>
          <el-button v-if="btnsPermission.delete.auth" size="mini" type="danger" @click="handleDelete(row)">
            {{btnsPermission.delete.name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />


    <el-dialog :title="textMap[dialogStatus]" :closeOnClickModal="false" :visible.sync="dialogFormVisible">
      <el-form v-loading="diaLoading" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="160px">
        <el-form-item prop="name" label="名称">
          <el-input v-model.trim="temp.name" maxlength="64" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item prop="clientId" label="客户端ID">
          <el-input v-model.trim="temp.clientId" maxlength="128" placeholder="请输入客户端ID" />
        </el-form-item>
        <el-form-item prop="systemId" label="系统ID">
          <el-input v-model.trim="temp.systemId" maxlength="32" placeholder="请输入系统ID" />
        </el-form-item>
        <el-form-item prop="resourceIds" label="资源ID">
          <el-input v-model.trim="temp.resourceIds" maxlength="256" placeholder="请输入资源ID" />
        </el-form-item>
        <el-form-item prop="clientSecret" label="客户端密钥">
          <el-input v-model.trim="temp.clientSecret" maxlength="256" placeholder="请输入客户端密钥" />
        </el-form-item>
        <el-form-item prop="authorities" label="授权">
          <el-input v-model.trim="temp.authorities" maxlength="256" placeholder="请输入授权" />
        </el-form-item>
        <el-form-item prop="authorizedGrantTypes" label="授权方式">
          <el-input v-model.trim="temp.authorizedGrantTypes" maxlength="256" placeholder="请输入授权方式" />
        </el-form-item>
        <el-form-item prop="scope" label="范围">
          <el-input v-model.trim="temp.scope" maxlength="256" placeholder="请输入范围" />
        </el-form-item>
        <el-form-item prop="webServerRedirectUri" label="WEB服务器重定向URI">
          <el-input v-model.trim="temp.webServerRedirectUri" maxlength="256" placeholder="请输入WEB服务器重定向URI" />
        </el-form-item>
        <el-form-item prop="accessTokenValidity" label="ACCESS_TOKEN">
          <el-input v-model.trim="temp.accessTokenValidity" maxlength="11" placeholder="请输入ACCESS_TOKEN" />
        </el-form-item>
        <el-form-item prop="refreshTokenValidity" label="REFRESH_TOKEN">
          <el-input v-model.trim="temp.refreshTokenValidity" maxlength="11" placeholder="请输入REFRESH_TOKEN" />
        </el-form-item>
        <el-form-item prop="autoapprove" label="自动批准">
          <el-input v-model.trim="temp.autoapprove" maxlength="256" placeholder="请输入自动批准" />
        </el-form-item>
        <el-form-item prop="additionalInformation" label="附加信息">
          <el-input
            v-model.trim="temp.additionalInformation"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="4096"
            placeholder="请输入附加信息"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="diaDisable" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserBtnByPId } from '@/api/upms/menu'
import { addClient, deleteClient, updateClient, getClientList, getClientById } from '@/api/oauth/client'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive



export default {
  name: 'systemClient',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  directives: { waves },
  data() {
    const checkNum = (rule, value, callback) => {
      if(value && !/^[0-9]*$/.test(value)) {
        callback(new Error('请输入整数'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      total: 0,
      allPages: 0,
      listQuery: {
        name: '',
        systemId: '',
        clientId: '',
        pageIndex: 1,
        pageSize: 10
      },
      btnsPermission: {
        search: {
          name: '查询',
          auth: false
        },
        add: {
          name: '新增',
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
        clientId: [{
          required: true,
          trigger: 'blur',
          message: '请填写客户端ID'
        }],
        scope: [{
          required: true,
          trigger: 'blur',
          message: '请填写范围'
        }],
        clientSecret: [{
            required: true,
            trigger: 'blur',
            message: '请填写客户端密钥'
        }],
        authorizedGrantTypes: [{
            required: true,
            trigger: 'blur',
            message: '请填写授权方式'
        }],
        accessTokenValidity: [{
            required: false,
            trigger: 'blur',
            validator: checkNum
        }],
        refreshTokenValidity: [{
            required: false,
            trigger: 'blur',
            validator: checkNum
        }]
      },
      temp: {
        id: '',
        name: '',
        clientId: '',
        systemId: '',
        resourceIds: '',
        clientSecret: '',
        scope: '',
        authorizedGrantTypes: '',
        webServerRedirectUri: '',
        authorities: '',
        accessTokenValidity: '',
        refreshTokenValidity: '',
        additionalInformation: '',
        autoapprove: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑客户端',
        create: '新增客户端'
      },
      statusOptions: ['published', 'draft', 'deleted'],
    }
  },
  components: { Pagination },
  created() {
    this.getClientList()
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
    getClientList() {
      //获取系统数据
      this.listLoading = true
      let param = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize
      }
      if(this.listQuery.name.length > 0) {
        param.name = this.listQuery.name
      }
      if(this.listQuery.clientId.length > 0) {
        param.clientId = this.listQuery.clientId
      }
      if(this.listQuery.systemId.length > 0) {
        param.systemId = this.listQuery.systemId
      }
      getClientList(param).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.allPages = res.data.pages
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        clientId: '',
        systemId: '',
        resourceIds: '',
        clientSecret: '',
        scope: '',
        authorizedGrantTypes: '',
        webServerRedirectUri: '',
        authorities: '',
        accessTokenValidity: '',
        refreshTokenValidity: '',
        additionalInformation: '',
        autoapprove: ''
      }
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getClientList()
    },
    handleCreate() {
      // 添加事件
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      // 添加
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.diaDisable = true
          this.diaLoading = true
          addClient({
            name: this.temp.name,
            clientId: this.temp.clientId,
            systemId: this.temp.systemId,
            resourceIds: this.temp.resourceIds,
            clientSecret: this.temp.clientSecret,
            scope: this.temp.scope,
            authorizedGrantTypes: this.temp.authorizedGrantTypes,
            webServerRedirectUri: this.temp.webServerRedirectUri,
            authorities: this.temp.authorities,
            accessTokenValidity: this.temp.accessTokenValidity,
            refreshTokenValidity: this.temp.refreshTokenValidity,
            additionalInformation: this.temp.additionalInformation,
            autoapprove: this.temp.autoapprove
          }).then(() => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加成功！',
              type: 'success',
              duration: 2000
            })
            this.getClientList()
          }).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
          })
        }
      })
    },
    getList(data) {
      // 分页事件
      this.listQuery.pageIndex = data.page
      this.getClientList()
    },
    updateData() {
      // 编辑
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.diaDisable = true
          this.diaLoading = true
          updateClient({
            id: this.temp.id,
            name: this.temp.name,
            clientId: this.temp.clientId,
            systemId: this.temp.systemId,
            resourceIds: this.temp.resourceIds,
            clientSecret: this.temp.clientSecret,
            scope: this.temp.scope,
            authorizedGrantTypes: this.temp.authorizedGrantTypes,
            webServerRedirectUri: this.temp.webServerRedirectUri,
            authorities: this.temp.authorities,
            accessTokenValidity: this.temp.accessTokenValidity,
            refreshTokenValidity: this.temp.refreshTokenValidity,
            additionalInformation: this.temp.additionalInformation,
            autoapprove: this.temp.autoapprove
          }).then(response => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '数据修改成功！',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          }).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
          })
        }
      })
      
    },
    handleUpdate(row) {
      // 编辑事件
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(data) {
      // 删除
      this.$confirm('此操作将永久删除该客户端信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteClient({id: data.id}).then(response => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if(this.list.length === 1 && this.allPages > 1) {
              --this.listQuery.pageIndex
            }
            this.getClientList()
          }).catch(err => {
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })   
        })
    },
    resetSearch() {
      this.listQuery = {
        name: '',
        clientId: '',
        systemId: '',
        pageIndex: 1,
        pageSize: 10
      },
      this.getClientList()
    }
  }
}
</script>
