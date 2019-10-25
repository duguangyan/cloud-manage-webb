<template>
  <div class="app-container">
    <div class="filter-container mb20">
      <div v-if="btnsPermission.search.auth" class="mb40">
        广告位名称：
        <el-input v-model="listQuery.name" maxlength="30" placeholder="请输入广告位名称" style="width: 200px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" :disabled="disable" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
        <el-button v-waves class="filter-item" @click="resetList">重置</el-button>
      </div>
      <div>
        <el-button v-if="btnsPermission.add.auth" type="primary" size="small" @click="addBanner">{{btnsPermission.add.name}}</el-button>
      </div>
    </div>
    <el-table
      :data="bannerData"
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
        prop="name"
        label="名称"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="code"
        label="编码"
        align="center"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        width="180"
        label="投放方式">
        <template slot-scope="scope">
          <span v-if="scope.row.pushType === 1">随机</span>
          <span v-else-if="scope.row.pushType === 2">顺序</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        align="center"
        width="220"
        label="更新时间">
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        width="220"
        label="创建时间">
      </el-table-column>
      <el-table-column
        align="center"
        width="300px"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="small" @click="edit(scope.row)">{{btnsPermission.edit.name}}</el-button>
          <el-button v-if="btnsPermission.delete.auth" type="danger" size="small" @click="handleDelete(scope.row)">{{btnsPermission.delete.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getPage" />
    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑广告位':'新增广告位'">
      <el-form ref="bannerForm" v-loading="diaLoading" :model="banner" label-width="80px" label-position="left" :rules="bannerRules">
        <el-form-item label="名称" prop="name">
          <el-input v-model.trim="banner.name" maxlength="30" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model.trim="banner.code" maxlength="32" placeholder="请输入编码" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model.trim="banner.quantity" maxlength="11" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="时间间隔" prop="spaceTime">
          <el-input class="short-width" v-model="banner.spaceTime" maxlength="11" placeholder="请输入时间间隔" />ms
        </el-form-item>
        <el-form-item label="投放方式" prop="pushType">
          <el-select v-model="banner.pushType" placeholder="请选择投放方式">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宽度" prop="width">
          <el-input class="short-width" v-model.trim="banner.width" maxlength="6" placeholder="请输入宽度" />px
        </el-form-item>
        <el-form-item label="高度" prop="height">
          <el-input class="short-width" v-model.trim="banner.height" maxlength="6" placeholder="请输入高度" />px
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model.trim="banner.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="200"
            placeholder="请输入备注内容"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="diaDisable" @click="regFun">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { addBanner, deleteBanner, updateBanner, getBannerList, getBannerById } from '@/api/act/banner'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
import { getUserBtnByPId } from '@/api/upms/menu'

const defaultBanner = {
  name: '',
  id: '',
  code: '',
  quantity: '',
  spaceTime: '',
  pushType: '',
  width: '',
  height: '',
  remark: ''
}

export default {
  name: 'activityBanner',
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
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        add: {
          name: '新增广告位',
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
      typeData: [
        {
          value: 1,
          label: '顺序'
        },
        {
          value: 2,
          label: '随机'
        },
      ],
      total: 0,
      allPages: 0,
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10,
        status: '',
      },
      bannerData: [],
      bannerRules: {
        name: [{
            required: true,
            trigger: 'blur',
            message: '请填写名称'        
          }],
        id: [{
            required: true,
            trigger: 'blur',
            message: '请填写编码'
        }],
        quantity: [{
            type: 'number',
            required: true,
            trigger: 'blur',
            validator: validateNum,
            des: '请填写数量'
        }],
        spaceTime: [{
            required: true,
            trigger: 'blur',
            validator: validateNum,
            des: '请填写间隔时间'
        }],
        width: [{
            required: false,
            trigger: 'blur',
            validator: validateNum,
        }],
        height: [{
            required: false,
            trigger: 'blur',
            validator: validateNum,
        }],
        pushType: [{
            required: true,
            trigger: 'blur',
            message: '请选择投放方式'
        }]
      },
      dialogVisible: false,
      diaLoading: false,
      dialogType: ''
    }
  },
  components: { Pagination },
  computed: {

  },
  created() {
    this.getBannerList()
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
    getBannerList() {
      // 获取广告列表
      getBannerList(this.listQuery).then(res => {
        if(Array.isArray(res.data.records)) {
          this.bannerData = res.data.records
        }
        this.total = res.data.total
        this.allPages = res.data.pages
      })
    },
    handleFilter() {
      // 搜索
      this.getBannerList()
    },
    resetList() {
      // 重置
      this.listQuery = {
        name: '',
        pageIndex: 1,
        pageSize: 10,
        status: ''
      }
      this.getBannerList()
    },
    async addBanner() {
      // 新增广告位
      this.banner = Object.assign({}, defaultBanner)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['bannerForm'].clearValidate()
      })
    },
    getPage(data) {
     // 分页事件
      this.listQuery.pageIndex = data.page
      this.getBannerList()
    },
    handleDelete(row) {
      // 删除广告位
      this.$confirm('确定要删除该广告位?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.listLoading = true
          await deleteBanner({ id: row.id, code: row.code })
          this.listLoading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if(this.bannerData.length === 1 && this.allPages - 1 > 0) {
            --this.listQuery.pageIndex
          }
          this.getBannerList()
        }).catch(err => {
            this.listLoading = false
      })
      this.getBannerList()
    },
    edit(row) {
      // 修改广告位
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.dialogType = 'edit'
      this.diaLoading = true
      this.$nextTick(() => {
        this.$refs['bannerForm'].clearValidate()
      })
      getBannerById({ id: row.id }).then(res => {
        this.diaLoading = false
        this.banner = res.data
      })
      // this.banner = deepClone(row)
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
      // 确认操作
      const isEdit = this.dialogType === 'edit'
      let succMsg = ''
      let isError = false
      if (isEdit) {
        succMsg = '编辑广告位成功'
        this.diaDisable = true
        this.diaLoading = true
        await updateBanner({
          id: this.banner.id,
          code: this.banner.code,
          name: this.banner.name,
          pushType: this.banner.pushType,
          quantity: this.banner.quantity,
          remark: this.banner.remark,
          spaceTime: this.banner.spaceTime,
          width: this.banner.width,
          height: this.banner.height
        }).catch(err => {
          isError = true
        })
        this.diaDisable = false
        this.diaLoading = false
         if(isError) {
          return false
        }
        this.getBannerList()
      } else {
        succMsg = '新增广告位成功'
        this.diaDisable = true
        this.diaLoading = true
        await addBanner({
          code: this.banner.code,
          name: this.banner.name,
          pushType: this.banner.pushType,
          quantity: this.banner.quantity,
          remark: this.banner.remark,
          spaceTime: this.banner.spaceTime,
          width: this.banner.width,
          height: this.banner.height
        }).catch(err => {
          isError = true
          return false
        })
        this.diaDisable = false
        this.diaLoading = false
        if(isError) {
          return false
        }
        this.getBannerList()
      }
      this.dialogVisible = false
      this.$notify({
        title: succMsg,
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .mb20{
    margin-bottom: 20px;
  }
  .mb40{
    margin-bottom: 40px;
  }
  .short-width{
    width: 80%;
    margin-right: 10px;
  }
</style>
