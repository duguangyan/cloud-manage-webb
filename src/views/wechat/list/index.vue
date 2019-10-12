<template>
  <div class="app-container">
    <div v-if="btnsPermission.search.auth" class="filter-container" style="padding-bottom: 10px">
      公众号名称：<el-input v-model="listQuery.name" maxlength="64" placeholder="请输入公众号名称" style="width: 200px;margin-right:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      应用ID：<el-input v-model="listQuery.appId" maxlength="64" placeholder="请输入应用ID" style="width: 200px;margin-right:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="请选择类型">
        <el-option
          v-for="item in typeData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{btnsPermission.search.name}}
      </el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetSearch">重置</el-button>
    </div>
    <div v-if="btnsPermission.add.auth" style="margin-bottom: 10px;">
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate">
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
      <el-table-column 
        prop="systemId"
        label="系统ID"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="name"
        label="公众账号名称"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        label="类型"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">订阅号</span>
          <span v-else-if="scope.row.type === 2">服务号</span>
          <span v-else-if="scope.row.type === 3">小程序</span>
        </template>
      </el-table-column>
      <el-table-column 
        prop="appId"
        label="应用ID"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="appSecret"
        label="应用密钥"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="token"
        label="公众账号token"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="encodingAESKey"
        label="加解密密钥"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        label="加密方式"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.encrypt === 1">明文</span>
          <span v-else-if="scope.row.encrypt === 2">兼容</span>
          <span v-else-if="scope.row.encrypt === 3">安全</span>
        </template>
      </el-table-column>
       <el-table-column 
        prop="accessToken"
        label="凭证"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="expiresIn"
        label="凭证有效时间"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="expiresTime"
        label="凭证更新时间"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="createTime"
        label="凭证创建时间"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="modifyTime"
        width="160"
        label="更新时间"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="remark"
        label="备注"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
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
      <el-form v-loading="diaLoading" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
        <el-form-item prop="name" label="公众号名称">
          <el-input v-model="temp.name" maxlength="64" />
        </el-form-item>
        <el-form-item prop="systemId" label="系统ID">
          <el-input v-model="temp.systemId" maxlength="32" />
        </el-form-item>
        <el-form-item prop="type" label="类型">
          <el-select v-model="temp.type" placeholder="请选择">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="appId" label="应用ID">
          <el-input v-model="temp.appId" maxlength="32" />
        </el-form-item>
        <el-form-item prop="appSecret" label="应用密钥">
          <el-input v-model="temp.appSecret" maxlength="32" />
        </el-form-item>
        <el-form-item prop="token" label="公众账号token">
          <el-input v-model="temp.token" maxlength="64" />
        </el-form-item>
        <el-form-item prop="encrypt" label="加密方式">
          <el-select v-model="temp.encrypt" placeholder="请选择">
            <el-option
              v-for="item in encryptData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="encodingAESKey" label="加密密钥">
          <el-input v-model="temp.encodingAESKey" maxlength="64" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.remark"
            maxlength="256"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入备注内容"
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
import { addWechat, deleteWechat, updateWechat, getWechatList, getWechatById } from '@/api/wechat/list'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive



export default {
  name: 'Wechat',
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
    return {
      list: null,
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      total: 0,
      allPages: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        type: '',
        appId: '',
        name: ''
      },
      btnsPermission: {
        search: {
          name: '查询',
          auth: false
        },
        add: {
          name: '添加',
          auth: false
        },
        delete: {
          name: '删除',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        }
      },
      rules: {
        encodingAESKey: [{
          required: true,
          trigger: 'blur',
          message: '请填写加密密钥'
        }],
        systemId: [{
          required: true,
          trigger: 'blur',
          message: '请填写系统ID'
        }],
        appId: [{
          required: true,
          trigger: 'blur',
          message: '请填写appID'
        }],
        appSecret: [{
            required: true,
            trigger: 'blur',
            message: '请填写应用密钥'
        }],
        encrypt: [{
            required: true,
            trigger: 'change',
            message: '请选择加密方式'
        }],
        name: [{
            required: true,
            trigger: 'blur',
            message: '请填写公众帐号名称'
        }],
        token: [{
            required: true,
            trigger: 'blur',
            message: '请填写公众帐号TOKEN'
        }],
        type: [{
            required: true,
            trigger: 'change',
            message: '请选择类型'
        }],
      },
      temp: {
        appId : '',
        appSecret: '',
        encodingAESKey: '',
        encrypt: '',
        name: '',
        remark: '',
        systemId: '',
        token: '',
        type: ''
      },
      typeData: [
        {
          value: 1,
          label: '订阅号'
        },
        {
          value: 2,
          label: '服务号'
        },
        {
          value: 3,
          label: '小程序'
        }
      ],
      encryptData: [
        {
          value: 1,
          label: '明文'
        },
        {
          value: 2,
          label: '兼容'
        },
        {
          value: 3,
          label: '安全'
        }
      ],
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      statusOptions: ['published', 'draft', 'deleted'],
    }
  },
  components: { Pagination },
  created() {
    this.getWechatList()
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
    getWechatList() {
      //获取系统数据
      this.listLoading = true
      getWechatList(this.listQuery).then(res => {
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
        appId : '',
        appSecret: '',
        encodingAESKey: '',
        encrypt: '',
        name: '',
        remark: '',
        systemId: '',
        token: '',
        type: ''
      }
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getWechatList()
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
          addWechat({
            systemId: this.temp.systemId,
            appId : this.temp.appId,
            appSecret: this.temp.appSecret,
            encodingAESKey: this.temp.encodingAESKey,
            encrypt: this.temp.encrypt,
            name: this.temp.name,
            token: this.temp.token,
            type: this.temp.type,
            remark: this.temp.remark
          }).then(() => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加微信账号成功！',
              type: 'success',
              duration: 2000
            })
            this.getWechatList()
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
      this.getWechatList()
    },
    updateData() {
      // 编辑
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.diaDisable = true
          this.diaLoading = true
          let updateParam = {
            id: this.temp.id,
            systemId: this.temp.systemId,
            appId : this.temp.appId,
            appSecret: this.temp.appSecret,
            encrypt: this.temp.encrypt,
            name: this.temp.name,
            token: this.temp.token,
            type: this.temp.type,
            encodingAESKey: this.temp.encodingAESKey
          }
          if(this.temp.remark !== null && this.temp.remark.length > 0) {
            updateParam.remark = this.temp.remark
          }
          updateWechat(updateParam).then(response => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '数据修改成功！',
              type: 'success',
              duration: 2000
            })
            this.getWechatList()
          }).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
          })
        }
      })
      
    },
    handleUpdate(row) {
      // 编辑事件
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.diaLoading = true
      this.diaDisable = true
      getWechatById({id: row.id}).then(res => {
        this.diaLoading = false
        this.diaDisable = false
        this.temp = res.data
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
      // this.temp = Object.assign({}, row) // copy obj
      
    },
    handleDelete(data) {
      // 删除
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteWechat({id: data.id}).then(response => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if(this.list.length === 1 && this.allPages - 1 > 0) {
              --this.listQuery.pageIndex
            }
            this.getWechatList()
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
        pageIndex: 1,
        pageSize: 10,
        type: '',
        appId: '',
        name: ''
      }
      this.getWechatList()
    }
  }
}
</script>
