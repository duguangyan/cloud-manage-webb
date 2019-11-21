<template>
  <div class="app-container">
    <div class="filter-container mb20">
      <div v-if="btnsPermission.search.auth" class="mb40 mr20">
        广告名称：
        <el-input v-model="listQuery.name" maxlength="50" placeholder="请输入广告名称" style="width: 200px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
        广告位名称：
        <el-input v-model="listQuery.adPositionName" maxlength="30" placeholder="请输入广告位名称" style="width: 200px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
        状态：
        <el-select v-model="listQuery.status" class="mr20" placeholder="请选择">
          <el-option
            v-for="item in statusData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button v-waves class="filter-item" type="primary" :disabled="disable" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
        <el-button v-waves class="filter-item" :disabled="disable" @click="resetList">重置</el-button>
      </div>
      <div>
        <el-button v-if="btnsPermission.add.auth" type="primary" size="small" @click="addBanner">{{btnsPermission.add.name}}</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="adData"
      border
      :header-cell-style="{background: '#f3f3f3'}" 
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center"
        width="180">
         <template slot-scope="scope">
          {{ scope.$index + 1 + (listQuery.pageIndex - 1) * listQuery.pageSize }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="图片"
        width="180">
        <template slot-scope="scope">
          <div v-if="scope.row.path && scope.row.path.lastIndexOf('.mp4') > -1 && scope.row.path.length - 4 === scope.row.path.lastIndexOf('.mp4')">
            视频无预览图
          </div>
          <img v-else style="width: 120px; height: 50px;" :src="scope.row.path" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">下线</span>
          <span v-else-if="scope.row.status === 1">上线</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="adPositionName"
        label="广告位"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="showTime"
        label="展示次数"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="hits"
        label="点击次数"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        width="330"
        align="center"
        label="操作">
        <div class="more-btn" slot-scope="scope">
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="small" @click="edit(scope.row)">{{btnsPermission.edit.name}}</el-button>
          <el-button v-if="btnsPermission.on.auth && scope.row.status === 0" type="primary" size="small" @click="line(scope.row, 1)">{{btnsPermission.on.name}}</el-button>
          <el-button v-if="btnsPermission.off.auth && scope.row.status === 1" type="primary" size="small" @click="line(scope.row, 0)">{{btnsPermission.off.name}}</el-button>
          <el-button v-if="btnsPermission.delete.auth && scope.row.status === 0" type="danger" size="small" @click="handleDelete(scope.row)">{{btnsPermission.delete.name}}</el-button>
        </div>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="(data) => getPage(data, 1)" />
    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑Banner':'新增Banner'">
      <el-form ref="bannerForm" v-loading="diaLoading" :model="banner" label-width="120px" label-position="left" :rules="bannerRules">
        <el-form-item label="标题" prop="name">
          <el-input v-model.trim="banner.name" maxlength="50" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="位置" prop="pid">
          <span v-if="banner.adPositionName !== null && banner.adPositionName.length > 0" class="mr10">{{banner.adPositionName}}</span>
          <el-button size="small" @click="chooseBanner">选择广告位</el-button>
        </el-form-item>
        <el-form-item label="图片或视频" prop="path">
          <el-upload
            class="self-upload"
            action=""
            list-type="picture-card"
            :class="{disabled: uploadDisabled}"
            :limit="1"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeImgUpload"
            :file-list="banner.pathBox"
            :on-exceed="handleExceed"
            :on-change="handleLimit"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>建议尺寸像素：700*400，图片大小不能超过3M，图片格式 jpg、png、gif，视频大小不超过10M，视频格式mp4</div>
        </el-form-item>
        <el-form-item label="事件动作" prop="type">
          <el-select v-model="banner.type" placeholder="请选择事件动作">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="banner.type === 1" label="跳转链接" prop="webUrl">
          <el-input v-model.trim="banner.webUrl" maxlength="128" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item v-else-if="banner.type === 5" label="商品ID" prop="selfUrl">
          <el-input v-model.trim="banner.selfUrl" maxlength="128" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="开始和结束时间" prop="dateValue">
          <el-date-picker
            v-model="banner.dateValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.trim="banner.sort" maxlength="10" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="diaDisable" @click="regFun">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisibleBanner" :closeOnClickModal="false" title="选择广告位">
      <el-table
        v-loading="bannerDataLoading"
        :data="bannerData"
        class="hidde-all-select"
        style="width: 100%;margin-bottom: 20px;">
        <el-table-column label="选择" width="55">
            <template slot-scope="scope">
                <el-radio  v-model="selectPid" :label="scope.row.code"><i></i></el-radio>
            </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间">
        </el-table-column>
      </el-table>
      <pagination v-show="bannerDataTotal>0" :total="bannerDataTotal" :page.sync="bannerDataQuery.pageIndex" :limit.sync="bannerDataQuery.pageSize"  @pagination="(data) => getPage(data, 2)" />
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisibleBanner=false">取消</el-button>
        <el-button type="primary" :disabled="diaDisable" @click="chooseBannerSure">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPreview">
      <template v-if="dialogImgType === 1">
        <div>
          <img width="100%" :src="dialogImageUrl" alt="">
        </div>
      </template>
      <template v-else-if="dialogImgType === 2">
        <div style="text-align: center">
          <video style="max-width: 100%;max-height: 800px;" :src="dialogImageUrl" controls="controls">
          您的浏览器不支持视频播放。
          </video>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { validInt } from "@/utils/validate"
import { addAd, deleteAd, updateAd, getAdList, getBannerList, getAdById, updateAdStatus, fileUpload } from '@/api/act/banner'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { getUserBtnByPId } from '@/api/upms/menu'
const defaultBanner = {
  id: '',
  name: '',
  adPositionName: '',
  path: '',
  pathBox: [],
  type: '',
  sort: '',
  pid: '',
  dateValue: [],
  url: '',
  webUrl: '',
  selfUrl: ''
}

export default {
  name: 'activityColumn',
  directives: { waves },
  data() {
    const validateUrl = (rule, value, callback) => {
      let reg = /^https?:\/\/.*$/
      if (!value) {
          callback(new Error('请输入跳转链接'))
      } else if(!reg.test(value)) {
        callback(new Error('请输入http://或https://开头的链接地址'))
      } else {
          callback()
      }
    }
    const validateId = (rule, value, callback) => {
      let reg = /^[A-Za-z0-9]+$/
      if (!value) {
          callback(new Error('请输入商品ID'))
      } else if(!reg.test(value)) {
        callback(new Error('请输入正确的商品ID，商品ID为字母和数字的组合'))
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
      banner: Object.assign({}, defaultBanner),
      disable: false,
      diaDisable: false,
      listLoading: false,
       dialogPreview: false,
      bannerDataLoading: false,
      bannerRow: {},
      selectPid: '',
      bannerData: [],
      uploadDisabled: false,
      dialogVisibleBanner: false,
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        add: {
          name: '新增Banner',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        },
        on: {
          name: '上线',
          auth: false
        },
        off: {
          name: '下线',
          auth: false
        },
        delete: {
          name: '删除',
          auth: false
        }
      },
      typeData: [
        {
          value: 0,
          label: '无任何动作'
        },
         {
          value: 5,
          label: '跳转商品详情'
        },
        {
          value: 1,
          label: '跳转链接(打开网站)'
        },
        {
          value: 2,
          label: '打开应用(敬请期待)'
        },
        {
          value: 3,
          label: '下载应用(敬请期待)'
        },
        {
          value: 4,
          label: '打开功能(敬请期待)'
        },
      ],
      statusData: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 0,
          label: '下线'
        },
        {
          value: 1,
          label: '上线'
        }
      ],
      total: 0,
      bannerDataTotal: 0,
      allPages: 0,
      dialogImgType: 0,
      dialogImageUrl: '',
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10,
        status: ''
      },
      bannerDataQuery: {
        pageIndex: 1,
        pageSize: 10,
        status: '',
      },
      adData: [],
      bannerRules: {
        name: [{
            required: true,
            trigger: 'blur',
            message: '请填写名称'        
          }],
        pid: [{
          required: true,
          trigger: 'blur',
          message: '请选择广告位'        
        }],
        path: [{
          required: true,
          trigger: 'blur',
          message: '请上传图片'        
        }],
        webUrl: [{
          required: true,
          trigger: 'blur',
          validator: validateUrl    
        }],
        selfUrl: [{
          required: true,
          trigger: 'blur',
          validator: validateId
        }],
        dateValue: [{
            required: true,
            trigger: 'blur',
            type: 'array',
            message: '请选择开始和结束时间'
        }],
        sort: [{
            required: false,
            trigger: 'blur',
            validator: validateSort
        }]
      },
      dialogVisible: false,
      diaLoading: false,
      dialogType: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  components: { Pagination },
  computed: {

  },
  created() {
    this.getAdList()
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
    getAdList() {
      // 获取广告列表
      this.listLoading = true
      this.disable = true
      getAdList(this.listQuery).then(res => {
        this.listLoading = false
        this.disable = false
        if(Array.isArray(res.data.records)) {
          this.adData = res.data.records
        }
        this.total = res.data.total
        this.allPages = res.data.pages
      }).catch(err => {
        console.log(err)
      })
    },
    getBannerList() {
      this.bannerDataLoading = true
      getBannerList(this.bannerDataQuery).then(res => {
        this.bannerDataLoading = false
        if(Array.isArray(res.data.records)) {
          this.bannerData = res.data.records
        }
        this.bannerDataTotal = res.data.total
      }).catch(err => {
        this.bannerDataLoading = false
      })
    },
    handleFilter() {
      // 搜索
      this.getAdList()
    },
    resetList() {
      // 重置
      this.listQuery = {
        name: '',
        pageIndex: 1,
        pageSize: 10
      }
      this.getAdList()
    },
    async addBanner() {
      this.banner = Object.assign({}, defaultBanner)
      this.banner.pathBox = []
      this.uploadDisabled = false
      this.banner.dateValue = []
      this.selectPid = ''
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['bannerForm'].clearValidate()
      })
    },
    getPage(data, type) {
     // 分页事件
     if(type === 1) {
       this.listQuery.pageIndex = data.page
       this.getAdList()
     } else {
       this.bannerDataQuery.pageIndex = data.page
       this.getBannerList()
     }
    },
    handleDelete(row) {
      this.$confirm('确定要删除该广告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.listLoading = true
          await deleteAd({id: row.id})
          this.listLoading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if(this.adData.length === 1 && this.allPages - 1 > 0) {
            --this.listQuery.pageIndex
          }
          this.getAdList()
        }).catch(err => {
            this.listLoading = false
      })
      this.getAdList()
    },
    edit(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.diaLoading = true
      this.$nextTick(() => {
        this.$refs['bannerForm'].clearValidate()
      })
      getAdById({ id: row.id }).then(res => {
        this.selectPid = res.data.pid
        this.diaLoading = false
        this.banner.id = res.data.id
        this.banner.pid = res.data.pid
        this.banner.name = res.data.name
        this.banner.adPositionName = res.data.adPositionName
        this.banner.path = res.data.path
        this.banner.type = res.data.type
        if(res.data.type === 1) {
          this.banner.webUrl = res.data.url
          this.banner.selfUrl = ''
        } else if(res.data.type === 5) {
          this.banner.webUrl = ''
          this.banner.selfUrl = res.data.url
        } else {
          this.banner.webUrl = ''
          this.banner.selfUrl = ''
        }
        this.uploadDisabled = true
        this.banner.sort = res.data.sort
        this.banner.dateValue = []
        this.banner.dateValue[0] = res.data.createTime
        this.banner.dateValue[1] = res.data.endTime
        this.banner.pathBox = []
        if(res.data.path) {
          let mp4Index = res.data.path.lastIndexOf('.mp4')
          this.banner.pathBox.push({
            url: res.data.path,
            type: mp4Index > -1 && res.data.path.length - 4 === mp4Index ? 2 : 1,
          })
        } else {
          this.banner.pathBox.push({
            url: res.data.path,
            type: 0,
          })
        }
      })
      
    },
    line(row, status) {
      // 上线、下线
      const noticeMsg = status === 1 ? '确定要上线广告？' : '确定要下线广告？'
      const succMsg = status === 1 ? '上线成功' : '下线成功'
      this.$confirm(noticeMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        updateAdStatus({
          id: row.id,
          status: status
        }).then(res => {
          this.listLoading = false
          this.$notify({
            title: succMsg,
            dangerouslyUseHTMLString: true,
            type: 'success'
          })
          this.getAdList()
        }).catch(err => {
          this.listLoading = false
        })
      })
    },
    regFun () {
      // 表单校验
      this.$refs.bannerForm.validate(valid => {
        if(valid) {
          this.confirm()
        }
      })
    },
    async confirm() {
      const isEdit = this.dialogType === 'edit'
      let succMsg = ''
      let isError = false
      if (isEdit) {
        succMsg = '编辑广告成功'
        this.diaDisable = true
        this.diaLoading = true
        let param = {
          id: this.banner.id,
          name: this.banner.name,
          beginTime: this.banner.dateValue[0],
          endTime: this.banner.dateValue[1],
          type: this.banner.type,
          pId: this.banner.pid,
          path: this.banner.path,
          sort: this.banner.sort
        }
        if(this.banner.type === 1) {
          param.url = this.banner.webUrl
        } else if(this.banner.type === 5) {
          param.url = this.banner.selfUrl
        }
        await updateAd(param).catch(err => {
          isError = true
        })
        this.diaDisable = false
        this.diaLoading = false
         if(isError) {
          return false
        }
        this.getAdList()
      } else {
        succMsg = '新增广告成功'
        this.diaDisable = true
        this.diaLoading = true
        let param = {
          name: this.banner.name,
          beginTime: this.banner.dateValue[0],
          endTime: this.banner.dateValue[1],
          type: this.banner.type,
          pId: this.banner.pid,
          path: this.banner.path,
          sort: this.banner.sort
        }
        if(this.banner.type === 1) {
          param.url = this.banner.webUrl
        } else if(this.banner.type === 5) {
          param.url = this.banner.selfUrl
        }
        await addAd(param).catch(err => {
          isError = true
          return false
        })
        this.diaDisable = false
        this.diaLoading = false
        if(isError) {
          return false
        }
        this.getAdList()
      }
      this.dialogVisible = false
      this.$notify({
        title: succMsg,
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
    },
    uploadImg(file) {
      let formData = new FormData()
      formData.append('file', file.file)
      fileUpload(formData).then(res => {
        let mp4Index = res.data.lastIndexOf('.mp4')
        this.banner.pathBox.push({
          url: res.data,
          type: mp4Index > -1 && res.data.length - 4 === mp4Index ? 2 : 1,
          uid: file.file.uid
        })
        this.banner.path = res.data
        file.file.status = 'success'
      })
    },
    handlePictureCardPreview(file) {
      // 图片预览
      this.dialogImgType = file.type
      this.dialogImageUrl = file.url
      this.dialogPreview = true
    },
    beforeImgUpload(file) {
      if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif') {
        this.fileType = 1
        if(file.size / 1024 / 1024 < 3) {
           return true
        } else {
          this.$message.error('上传图片大小不能超过 3MB!')
          return false
        }
      } else if(file.type === 'video/mp4') {
        this.fileType = 2
        if(file.size / 1024 / 1024 < 10) {
           return true
        } else {
          this.$message.error('上传视频大小不能超过 10MB!')
          return false
        }
      } else {
        this.$message.error('上传文件类型错误!')
        return false
      }
    },
    handleLimit(file,fileList){
      // 是否隐藏加号
      if(fileList.length >= 1){
        this.uploadDisabled = true
      } else {
        this.uploadDisabled = false
      }
    },
    handleExceed(files, fileList) {
      // 图片数量提示
      this.$message({
        message: '上传图片或视频数量不能大于1',
        type: 'warning'
      })
    },
    handleRemove(file, fileList) {
      // 删除图片
      this.banner.pathBox = []
      this.uploadDisabled = false
    },
    chooseBanner() {
      // 选择广告位
      this.dialogVisibleBanner = true
      this.getBannerList()
    },
    chooseBannerSure() {
      this.banner.pid = this.selectPid
      this.bannerData.forEach(item => {
        if(item.code === this.selectPid) {
          this.banner.adPositionName = item.name
          return false
        }
      })
      this.dialogVisibleBanner = false
      
    }
  }
}
</script>

<style lang="scss" scoped>
  .mr10{
    margin-right: 10px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .mr20{
    margin-right: 20px;
  }
  .mb40{
    margin-bottom: 40px;
  }
  .short-width{
    width: 80%;
    margin-right: 10px;
  }
  .more-btn{
    width: 200px;
    display: inline-block;
    text-align: left;
  }
</style>
