<template>
  <div class="app-container">
    <div class="filter-container mb20">
      <div v-if="btnsPermission.search.auth" class="mb40">
        广告位名称：
        <el-input v-model="listQuery.name"  placeholder="请输入广告位名称" style="width: 200px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" :disabled="disable" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
        <el-button v-waves class="filter-item" @click="resetList">重置</el-button>
      </div>
      <div>
        <el-button v-if="btnsPermission.add.auth" type="primary" size="small" @click="addBanner">{{btnsPermission.add.name}}</el-button>
      </div>
    </div>
    <el-table
      :data="adData"
      border
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
        width="180">
      </el-table-column>
      <el-table-column
        prop="id"
        label="编码"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        align="center"
        label="投放方式">
        <template slot-scope="scope">
          <span v-if="scope.row.pushType === 1">随机</span>
          <span v-else-if="scope.row.pushType === 2">顺序</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="modifyTime"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        align="center"
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
          <el-input v-model.trim="banner.name" maxlength="64" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="编码" prop="id">
          <el-input v-model.trim="banner.id" maxlength="32" placeholder="请输入编码" />
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
            maxlength="255"
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
import { addAd, deleteAd, updateAd, getAdList } from '@/api/act/banner'
import Pagination from '@/components/Pagination'
import { deepClone } from '@/utils'
const defaultBanner = {
  name: '',
  id: '',
  quantity: '',
  spaceTime: '',
  pushType: '',
  width: '',
  height: '',
  remark: ''
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
      btnsPermission: {
        search: {
          name: '搜索',
          auth: true
        },
        add: {
          name: '新增广告位',
          auth: true
        },
        edit: {
          name: '编辑',
          auth: true
        },
        delete: {
          name: '删除',
          auth: true
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
        status: ''
      },
      adData: [],
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
    this.getAdList()
  },
  methods: {
    getAdList() {
      // 获取广告列表
      getAdList(this.listQuery).then(res => {
        if(Array.isArray(res.data.records)) {
          this.adData = res.data.records
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
        pageSize: 10
      }
      this.getBannerList()
    },
    async addBanner() {
      this.banner = Object.assign({}, defaultBanner)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    getPage(data) {
     // 分页事件
      this.listQuery.pageIndex = data.page
      this.getBannerList()
    },
    handleDelete(row) {
      this.$confirm('确定要删除该广告位?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.listLoading = true
          await deleteBanner({id: row.id})
          this.listLoading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if(this.adData.length - 1 === 0 && this.allPages - 1 > 0) {
            --this.listQuery.pageIndex
          }
          this.getBannerList()
        }).catch(err => {
            this.listLoading = false
      })
      this.getBannerList()
    },
    edit(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.dialogType = 'edit'
      this.banner = deepClone(row)
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
        succMsg = '编辑成功'
        this.diaDisable = true
        this.diaLoading = true
        await updateBanner({
          id: this.banner.id,
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
        succMsg = '新增成功'
        this.diaDisable = true
        this.diaLoading = true
        await addBanner({
          id: this.banner.id,
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
