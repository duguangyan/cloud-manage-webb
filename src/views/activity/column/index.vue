<template>
  <div class="app-container">
    <div class="filter-container mb20">
      <div v-if="btnsPermission.search.auth" class="mb40 mr20">
        广告名称：
        <el-input v-model="listQuery.name"  placeholder="请输入广告名称" style="width: 200px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
        广告位名称：
        <el-input v-model="listQuery.adPositionName"  placeholder="请输入广告位名称" style="width: 200px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
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
          <img style="width: 120px; height: 50px;" :src="scope.row.path" />
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
        <el-form-item label="图片" prop="path">
          <el-upload
            class="self-upload"
            v-model="banner.path"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :limit="1"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeImgUpload"
            :file-list="banner.pathBox"
            :on-exceed="handleExceed"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>建议尺寸像素：700*400，文件大小不能超过3M，图片格式 jpg、png、gif</div>
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
        <el-form-item v-if="banner.type === 1 || banner.type === 2 || banner.type === 3 || banner.type === 4" label="跳转链接" prop="url">
          <el-input v-model.trim="banner.url" maxlength="64" placeholder="请输入跳转链接" />
        </el-form-item>
        <el-form-item label="开始和结束时间" prop="dateValue">
          <el-date-picker
            v-model="banner.dateValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd hh:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dateChange"
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
                <el-radio  v-model="bannerRow" :label="scope.row"><i></i></el-radio>
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
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { addAd, deleteAd, updateAd, getAdList, getBannerList, getAdById, updateAdStatus } from '@/api/act/banner'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { fileUpload } from '@/api/goods/upload'
import { getUserBtnByPId } from '@/api/upms/menu'
const defaultBanner = {
  id: '',
  name: '',
  adPositionName: '',
  path: '',
  pathBox: [],
  type: '',
  beginTime: '',
  endTime: '',
  sort: '',
  pid: '',
  dateValue: [],
  url: ''
}

export default {
  name: 'Column',
  directives: { waves },
  data() {
    const validateNum = (rule, value, callback) => {
      let numReg = /^(0|[1-9][0-9]*)$/
      if(rule.required) {
        if(value.length === 0) {
          callback(new Error(rule.des))
        } else if (!numReg.test(value)) {
            callback(new Error('请输入大于等于0整数'))
        } else {
            callback()
        }
      } else {
        if (value.length > 0 && !numReg.test(value)) {
            callback(new Error('请输入大于等于0整数'))
        } else {
            callback()
        }
      }
      
    }
    return {
      banner: Object.assign({}, defaultBanner),
      disable: false,
      diaDisable: false,
      listLoading: false,
      bannerDataLoading: false,
      bannerRow: {},
      bannerData: [],
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
          value: 1,
          label: '打开网站'
        },
        {
          value: 2,
          label: '打开应用'
        },
        {
          value: 3,
          label: '下载'
        },
        {
          value: 4,
          label: '打开功能'
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
        url: [{
          required: true,
          trigger: 'blur',
          message: '请输入跳转链接'        
        }],
        dateValue: [{
            required: true,
            trigger: 'blur',
            type: 'array',
            message: '请选择开始和结束时间'
        }],
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
          if(this.btnsPermission.hasOwnProperty(val.code)) {
            this.btnsPermission[val.code].auth = val.checked === 1
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
      this.banner.dateValue = []
      this.dialogType = 'new'
      this.dialogVisible = true
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
      this.$confirm('确定要删除该广告?', 'Warning', {
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
          if(this.adData.length - 1 === 0 && this.allPages - 1 > 0) {
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
      getAdById({ id: row.id }).then(res => {
        this.diaLoading = false
        this.banner.id = res.data.id
        this.banner.pid = res.data.pid
        this.banner.name = res.data.name
        this.banner.beginTime = res.data.createTime
        this.banner.endTime = res.data.endTime
        this.banner.adPositionName = res.data.adPositionName
        this.banner.path = res.data.path
        this.banner.type = res.data.type
        this.banner.url = res.data.url
        this.banner.sort = res.data.sort
        this.banner.dateValue = []
        this.banner.dateValue[0] = res.data.createTime
        this.banner.dateValue[1] = res.data.endTime
        this.banner.pathBox = []
        this.banner.pathBox.push({
          url: res.data.path,
          type: 1
        })
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
        await updateAd({
          id: this.banner.id,
          name: this.banner.name,
          beginTime: this.banner.beginTime,
          endTime: this.banner.endTime,
          type: this.banner.type,
          pId: this.banner.pid,
          path: this.banner.path,
          sort: this.banner.sort,
          url: this.banner.url
        }).catch(err => {
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
        await addAd({
          name: this.banner.name,
          beginTime: this.banner.beginTime,
          endTime: this.banner.endTime,
          type: this.banner.type,
          pId: this.banner.pid,
          path: this.banner.path,
          sort: this.banner.sort,
          url: this.banner.url
        }).catch(err => {
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
        this.banner.pathBox.push({
          url: res.data,
          type: 1,
          uid: file.file.uid
        })
        this.banner.path = res.data
        file.file.status = 'success'
      })
    },
    handlePictureCardPreview(file) {
      // 图片预览
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeImgUpload(file) {
      // console.log(file)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt4M = file.size / 1024 / 1024 < 4;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg、jpeg、gif、png 格式!');
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
      }
      return isJPG && isLt4M;
    },
    handleExceed(files, fileList) {
      // 图片数量提示
      this.$message({
        message: '图片数量不能大于1',
        type: 'warning'
      })
    },
    handleRemove(file, fileList) {
      // 删除图片
      this.banner.pathBox = []
    },
    dateChange(data) {
      // 日期选择
      console.log(data)
      this.banner.beginTime = data[0]
      this.banner.endTime = data[1]
    },
    handlePictureCardPreview(file) {
      // 图片预览
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    chooseBanner() {
      // 选择广告位
      this.dialogVisibleBanner = true
      this.getBannerList()
    },
    chooseBannerSure() {
      if(this.bannerRow.id !== undefined) {
        this.banner.pid = this.bannerRow.id
        this.banner.adPositionName = this.bannerRow.name
        this.dialogVisibleBanner = false
      }
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
