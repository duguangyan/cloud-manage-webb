<template>
  <div class="app-container">
    <div class="mb20">
      <div class="mb20">
        <el-button v-if="btnsPermission.add.auth" class="filter-item" style="margin-left: 10px; background: rgb(255, 102, 0);color: #fff;border:none;" @click="handleCreate">
          {{btnsPermission.add.name}}
        </el-button>
      </div>
      <div>
        <template v-if="btnsPermission.search.auth">
          应用名称：<el-input v-model="listQuery.name" maxlength="64" placeholder="请输入名称" style="width: 200px;" class="mr10" @keyup.enter.native="handleFilter" />
          应用编码：<el-input v-model="listQuery.code" maxlength="64" placeholder="请输入名称" style="width: 200px;" class="mr10" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
            {{btnsPermission.search.name}}
          </el-button>
          <el-button v-waves class="filter-item" @click="resetSearch">重置</el-button>
        </template>
      </div>
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
      <el-table-column label="应用名称" prop="name" align="center"></el-table-column>
      <el-table-column label="应用编码" prop="code" align="center" width="250"></el-table-column>
      <el-table-column label="版本序号" prop="versionNum" align="center"  width="150"></el-table-column>
      <el-table-column label="版本号" prop="version" align="center"  width="150"></el-table-column>
      <el-table-column label="是否强制升级" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.forceUpdate === 1">是</span>
          <span v-else-if="scope.row.forceUpdate === 0">否</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center"></el-table-column>
      <el-table-column label="应用包路径" align="center">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" @click="handleClipboard(scope.row.packagePath, $event)">复制</el-button>
        </template>
      </el-table-column>
      <el-table-column label="更新包路径" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.updatePackagePath" size="mini" plain type="primary" @click="handleClipboard(scope.row.updatePackagePath, $event)">复制</el-button>
        </template>
      </el-table-column>
      <el-table-column label="提示语" prop="tips" align="center"></el-table-column>
      <el-table-column label="创建时间" prop="createTime" align="center" width="160"></el-table-column>
       <el-table-column label="更新时间" prop="modifyTime" align="center" width="160"></el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="mini" @click="handleUpdate(row)">
            {{btnsPermission.edit.name}}
          </el-button>
          <el-button v-if="btnsPermission.detail.auth" size="mini" type="primary" @click="detail(row)">
            {{btnsPermission.detail.name}}
          </el-button>
          <el-button v-if="btnsPermission.delete.auth" size="mini" type="danger" @click="handleDelete(row)">
            {{btnsPermission.delete.name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />


    <el-dialog :title="textMap[dialogStatus]" :closeOnClickModal="false" :visible.sync="dialogFormVisible">
      <template v-if="dialogStatus === 'detail'">
        <el-form label-position="left" label-width="160px">
          <el-form-item label="应用名称">
            {{temp.name}}
          </el-form-item>
          <el-form-item label="应用编码">
            {{temp.code}}
          </el-form-item>
          <el-form-item label="版本序号">
            {{temp.versionNum}}
          </el-form-item>
          <el-form-item label="版本号">
            {{temp.version}}
          </el-form-item>
          <el-form-item label="是否强制升级">
            <span v-if="temp.forceUpdate === 1">是</span>
            <span v-else-if="temp.forceUpdate === 0">否</span>
          </el-form-item>
          <el-form-item label="排序">
            {{temp.sort}}
          </el-form-item>
          <el-form-item label="提示语">
            {{temp.tips}}
          </el-form-item>
          <el-form-item label="安装包路径">
            {{temp.packagePath}}
            <el-button size="mini" plain type="primary" @click="handleClipboard(temp.packagePath, $event)">复制</el-button>
          </el-form-item>
          <el-form-item label="更新包路径">
            {{temp.updatePackagePath}}
            <el-button v-if="temp.updatePackagePath" size="mini" plain type="primary" @click="handleClipboard(temp.updatePackagePath, $event)">复制</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">
            返回
          </el-button>
        </div>
      </template>
      <template v-else>
        <el-form v-loading="diaLoading" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="160px">
          <el-form-item prop="name" label="应用名称">
            <el-input v-model.trim="temp.name" maxlength="64" placeholder="请输入应用名称" />
          </el-form-item>
          <el-form-item prop="code" label="应用编码">
            <el-input v-model.trim="temp.code" maxlength="32" placeholder="请输入应用编码" />
          </el-form-item>
          <el-form-item prop="versionNum" label="版本序号">
            <el-input v-model.trim="temp.versionNum" maxlength="9" placeholder="请输入版本序号" />
          </el-form-item>
          <el-form-item prop="version" label="版本号">
            <el-input v-model.trim="temp.version" maxlength="32" placeholder="请输入版本号" />
          </el-form-item>
          <el-form-item prop="forceUpdate" label="是否强制升级">
            <el-radio v-model="temp.forceUpdate" :label="1">是</el-radio>
            <el-radio v-model="temp.forceUpdate" :label="0">否</el-radio>
          </el-form-item>
          <el-form-item prop="sort" label="排序">
            <el-input v-model.trim="temp.sort" maxlength="9" placeholder="请输入排序" />
          </el-form-item>
          <el-form-item prop="tips" label="提示语">
            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 4}" v-model.trim="temp.tips" maxlength="256" placeholder="请输入提示语" />
          </el-form-item>
          <el-form-item required label="安装包">
            <el-upload
              ref="uplodadInstall"
              class="self-upload"
              action=""
              :http-request="(file) => uploadFile(file, 1)"
              :multiple="false"
              :limit="1"
              :file-list="fileInstall"
              :before-upload="(file) => beforeFileUpload(file, 1)"
              :on-exceed="handleExceed"
              :on-remove="(file, fileList) => handleRemove(file, fileList, 1)">
              <el-button size="small" type="primary">上传安装包</el-button>
              <div slot="tip" class="el-upload__tip">
                {{temp.packagePath}}
                <el-button v-if="dialogStatus === 'update'" size="mini" plain type="primary" @click="handleClipboard(temp.packagePath, $event)">复制</el-button>
              </div>
            </el-upload>
            <div v-if="showPackgeErr" class="el-form-item__error">
              请选择安装包
            </div>
          </el-form-item>
          <el-form-item prop="scope" label="更新包">
            <el-upload
              ref="uplodadUpdate"
              class="self-upload"
              action=""
              :http-request="(file) => uploadFile(file, 2)"
              :multiple="false"
              :limit="1"
              :file-list="fileUpdate"
              :before-upload="(file) => beforeFileUpload(file, 2)"
              :on-exceed="handleExceed"
              :on-remove="(file, fileList) => handleRemove(file, fileList, 2)">
              <el-button size="small" type="primary">上传更新包</el-button>
              <div slot="tip" class="el-upload__tip">
                {{temp.updatePackagePath}}
                <el-button v-if="dialogStatus === 'update' && temp.updatePackagePath" size="mini" plain type="primary" @click="handleClipboard(temp.updatePackagePath, $event)">复制</el-button>
              </div>
            </el-upload>
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
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getUserBtnByPId } from '@/api/upms/menu'
import { validInt } from "@/utils/validate"
import { getAppList, getAppById, addApp, deleteApp, updateApp, uploadAppPackage } from '@/api/upms/application'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive
import clipboard from '@/utils/clipboard'



export default {
  name: 'systemApplication',
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
      if(!value) {
        callback(new Error('请输入版本序号'))
      } else if(!/^[1-9]\d*|0$/.test(value)) {
        callback(new Error('请输入整数'))
      } else {
        callback()
      }
      
    }
    const validateSort = (rule, value, callback) => {
      if (value && !validInt(value)) {
        callback(new Error("请输入整数"));
      } else {
        callback();
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
        code: '',
        pageIndex: 1,
        pageSize: 10
      },
      showPackgeErr: false,
      btnsPermission: {
        search: {
          name: '查询',
          auth: false
        },
        add: {
          name: '新增版本',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        },
        detail: {
          name: '查看',
          auth: false
        },
        delete: {
          name: '删除',
          auth: false
        }
      },
      fileInstall: [],
      fileUpdate: [],
      rules: {
        versionNum: [{
          required: true,
          trigger: 'blur',
          validator: checkNum
        }],
        version: [{
          required: true,
          trigger: 'blur',
          message: '请填写版本号'
        }],
        name: [{
          required: true,
          trigger: 'blur',
          message: '请填写应用名称'
        }],
        code: [{
          required: true,
          trigger: 'blur',
          message: '请填写应用编码'
        }],
        forceUpdate: [{
          required: true,
          trigger: 'blur',
          message: '请选择是否强制升级'
        }],
        packagePath: [{
          required: true,
          trigger: 'blur',
          message: '请选择安装包'
        }],
        sort: [{
            required: false,
            trigger: 'blur',
            validator: validateSort
        }]
      },
      temp: {
        id: '',
        name: '',
        code: '',
        forceUpdate: 0,
        packagePath: '',
        updatePackagePath: '',
        version: '',
        versionNum: '',
        tips: '',
        sort: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑版本',
        create: '新增版本',
        detail: '版本详情'
      }
    }
  },
  components: { Pagination },
  created() {
    this.getAppList()
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
    getAppList() {
      //获取系统数据
      this.listLoading = true
      let param = {
        pageIndex: this.listQuery.pageIndex,
        pageSize: this.listQuery.pageSize
      }
      if(this.listQuery.name.length > 0) {
        param.name = this.listQuery.name
      }
      if(this.listQuery.code.length > 0) {
        param.code = this.listQuery.code
      }
      getAppList(param).then(res => {
        this.total = res.data.total
        this.allPages = res.data.pages
        this.listLoading = false
        if(Array.isArray(res.data.records)) {
          this.list = res.data.records
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        code: '',
        forceUpdate: 0,
        packagePath: '',
        updatePackagePath: '',
        version: '',
        versionNum: '',
        tips: '',
        sort: ''
      }
      this.fileInstall = []
      this.fileUpdate = []
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getAppList()
    },
    handleCreate() {
      // 添加事件
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.showPackgeErr = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      // 添加
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.temp.packagePath.length === 0) {
            this.showPackgeErr = true
            return false
          } else {
            this.showPackgeErr = false
          }
          this.diaDisable = true
          this.diaLoading = true
          let query = {
            versionNum: this.temp.versionNum,
            version: this.temp.version,
            name: this.temp.name,
            code: this.temp.code,
            forceUpdate: this.temp.forceUpdate,
            packagePath: this.temp.packagePath
          }
          if(this.temp.sort.length > 0) {
            query.sort = this.temp.sort
          }
          if(this.temp.tips.length > 0) {
            query.tips = this.temp.tips
          }
          if(this.temp.updatePackagePath.length > 0) {
            query.updatePackagePath = this.temp.updatePackagePath
          }
          addApp(query).then(() => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '新增版本成功！',
              type: 'success',
              duration: 2000
            })
            this.getAppList()
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
    detail(row) {
      // 查看详情
      this.dialogStatus = 'detail'
      this.temp = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
    },
    updateData() {
      // 编辑
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.temp.packagePath.length === 0) {
            this.showPackgeErr = true
            return false
          } else {
            this.showPackgeErr = false
          }
          this.diaDisable = true
          this.diaLoading = true
          let query = {
            id: this.temp.id,
            versionNum: this.temp.versionNum,
            version: this.temp.version,
            name: this.temp.name,
            code: this.temp.code,
            forceUpdate: this.temp.forceUpdate,
            packagePath: this.temp.packagePath,
          }
          if(this.temp.sort !== null && this.temp.sort.length > 0) {
            query.sort = this.temp.sort
          }
          if(this.temp.tips !== null && this.temp.tips.length > 0) {
            query.tips = this.temp.tips
          }
          if(this.temp.updatePackagePath !== null && this.temp.updatePackagePath.length > 0) {
            query.updatePackagePath = this.temp.updatePackagePath
          }
          updateApp(query).then(response => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '数据修改成功！',
              type: 'success',
              duration: 2000
            })
            this.getAppList()
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
      this.showPackgeErr = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.resetTemp()
      this.diaLoading = true
      getAppById({ id: row.id }).then(res => {
        this.diaLoading = false
        this.temp.id = res.data.id
        this.temp.versionNum = res.data.versionNum
        this.temp.version = res.data.version
        this.temp.name = res.data.name
        this.temp.code = res.data.code
        this.temp.forceUpdate = res.data.forceUpdate
        this.temp.sort = res.data.sort
        this.temp.tips = res.data.tips
        if(res.data.packagePath !== null) {
          let arr1 = res.data.packagePath.split('/')
          this.temp.packagePath = res.data.packagePath
          this.fileInstall = [{
            name: arr1[arr1.length - 1],
            url: res.data.packagePath
          }]
        } else {
          this.temp.packagePath = ''
        }
        if(res.data.updatePackagePath !== null) {
          this.temp.updatePackagePath = res.data.updatePackagePath
          let arr2 = res.data.updatePackagePath.split('/')
          this.fileUpdate = [{
            name: arr2[arr2.length - 1],
            url: res.data.updatePackagePath
          }]
        } else {
          this.temp.updatePackagePath = ''
        }
      })
    },
    handleDelete(data) {
      // 删除
      this.$confirm('此操作将永久删除该版本信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteApp({id: data.id}).then(response => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if(this.list.length === 1 && this.allPages > 1) {
              --this.listQuery.pageIndex
            }
            this.getAppList()
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
        code: '',
        pageIndex: 1,
        pageSize: 10
      }
      this.getAppList()
    },
    uploadFile(file, type) {
      let formData = new FormData()
      formData.append('file', file.file)
      uploadAppPackage(formData).then(res => {
        if(type === 1) {
          this.temp.packagePath = res.data
          this.fileInstall.push({
            name: file.file.name,
            url: res.data
          })
        } else {
           this.temp.updatePackagePath = res.data
           this.fileUpdate.push({
            name: file.file.name,
            url: res.data
          })
        }
      })
    },
    beforeFileUpload(file, type) {
      if(type === 1) {
        if(file.name.length > 0 && file.name.lastIndexOf('.apk') > - 1 && file.name.length - 4 === file.name.lastIndexOf('.apk')) {
          if(file.size / 1024 / 1024 < 1024) {
            return true
          } else {
            this.$message.error('上传安装包大小不能超过 1000M!')
            return false
          }
        } else {
          this.$message.error('请上传apk安装包!')
          return false
        }
      } else if (type === 2) {
        if(file.name.length > 0 && file.name.lastIndexOf('.wgt') > - 1 && file.name.length - 4 === file.name.lastIndexOf('.wgt')) {
          if(file.size / 1024 / 1024 < 3) {
            return true
          } else {
            this.$message.error('上传更新包大小不能超过 1000M!')
            return false
          }
        } else {
          this.$message.error('请上传wgt更新包!')
          return false
        }
      } else {
        return false
      }
    },
    handleExceed(files, fileList) {
      // 图片数量提示
      this.$message({
        message: '上传包数量不能大于1',
        type: 'warning'
      })
    },
    handleRemove(file, fileList, type) {
      // 删除文件
      if(type === 1) {
        this.temp.packagePath = ''
        this.fileInstall = []
      } else {
        this.temp.updatePackagePath = ''
        this.fileUpdate = []
      }
    },
    handleClipboard(text, event) {
      // 复制路径
      clipboard(text, event)
    }
  }
}
</script>
<style>
  .mr10{
    margin-right: 10px;
  }
  .mb20{
    margin-bottom: 20px;
  }
</style>
