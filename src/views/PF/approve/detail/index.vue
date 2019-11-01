<template>
  <div class="app-container">
    <el-form v-loading="listLoading" ref="productForm" :model="form" label-position="right" label-width="180px" style="">
      <el-card class="box-card mb20">
        
        <template v-if="person.status === 0">
          审核状态：<span class="status">待审核</span>
        </template>
        <template v-else-if="person.status === 1">
          审核状态：<span class="status">已通过</span>
        </template>
        <template v-else-if="person.status === 2">
          <el-row>
            <el-col :span="12"><div class="grid-content bg-purple-dark">审核状态：<span class="status">未通过</span></div></el-col>
            <el-col :span="12"><div class="grid-content bg-purple-dark" style="text-align:right"><span>该用户审核不通过，修改为<span class="status-type" @click="check(1)">通过</span></span></div></el-col>
          </el-row>
        </template>
      </el-card>
      <el-card class="box-card mb20">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <div  class="text item">
          <el-form-item label="申请人姓名：">{{person.realName}}</el-form-item>
          <el-form-item label="身份证号码：" >{{person.identify}}</el-form-item>
          <el-form-item label="手机号码：">{{person.phone}}</el-form-item>
          <el-form-item label="身份证正面照：">
            <img :src="person.cardImgFront" alt="">
          </el-form-item>
          <el-form-item label="身份证国徽照：">
            <img :src="person.cardImgReverse" alt="">
          </el-form-item>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>店铺信息</span>
        </div>
        <div  class="text item">
          <el-form-item label="经营类目：">{{person.categoryName}}</el-form-item>
          <el-form-item label="经营地区：">{{person.area}}</el-form-item>
        </div>
        <div v-if="person.status === 0" class="tc">
          <el-button v-waves type="primary" :disabled="disable" @click="check(1)">通过</el-button>
          <el-button v-waves type="primary" :disabled="disable" @click="handleCheck">不通过</el-button>
        </div>
      </el-card>
    </el-form>
    <el-dialog title="填写原因" :closeOnClickModal="false" :visible.sync="dialogVisible">
      <el-form v-loading="diaLoading" ref="reasonForm" :model="reasonForm" label-position="left" label-width="100px">
        <el-form-item label="不通过原因"
        prop="reason"
        :rules="{
            required: true, message: '请填写不通过原因', trigger: 'blur'
        }">
          <el-input
            v-model.trim="reasonForm.reason"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            placeholder="请输入不通过原因"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="diaDisable" @click="sure">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getApproveDetail, checkApprove, modifyApprove } from '@/api/PF/apply/apply'

export default {
  name: 'PFapproveDetail',
  directives: { waves },
  data() {
    return {
      id: '',
      form: {},
      person: {
        status: null,
        realName: '',
        identify: null,
        phone: null,
        cardImgFront: null,
        cardImgReverse: null,
        type: null,
        area: null,
        categoryName: null
      },
      reasonForm: {
        reason: ''
      },
      listLoading: false,
      diaLoading: false,
      disable: false,
      dialogVisible: false,
      diaDisable: false,
    }
  },
  created() {
    if(this.$route.query.id) {
      this.id = this.$route.query.id
    }
    this.getApproveDetail()
  },
  methods: {
    getApproveDetail() {
      getApproveDetail({ id: this.id }).then(res => {
        this.person.realName = res.data.realName
        this.person.status = res.data.status
        this.person.identify = res.data.cardNo
        this.person.phone = res.data.phone
        this.person.cardImgFront = res.data.cardImgFront
        this.person.cardImgReverse = res.data.cardImgReverse
        this.person.type = res.data.type
        this.person.area =  res.data.province + res.data.city + res.data.region
        this.person.categoryName = res.data.categoryName
      })
    },
    handleCheck() {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['reasonForm'].clearValidate()
      })
    },
    sure() {
      this.$refs['reasonForm'].validate((valid) => {
        if(valid) {
          this.check(2)
        }
      })
    },
    check(type) {
      let noticeMsg = ''
      if(type === 1) {
        if(this.person.status === 0) {
          noticeMsg = '确定通过审核？'
        } else {
          noticeMsg = '确定修改为通过审核？'
        }
      } else {
        noticeMsg = '确定不通过审核？'
      }
      this.$confirm(noticeMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.diaLoading = true
        this.diaDisable = true
        if(this.person.status === 0) {
          let query = {
            auditUserId: this.$store.getters.userId,
            id: this.id,
            status: type
          }
          if(type === 2) {
            query.auditOpinion = this.reasonForm.reason
          }
          checkApprove(query).then(res => {
            this.diaLoading = false
            this.diaDisable = false
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '审核成功！',
              type: 'success',
              duration: 2000
            })
            this.$router.push({path: '/PF/approve/list', query:{ 
              status: this.person.status,
              type: this.person.type
            }})
          }).catch(err => {
            this.diaLoading = false
            this.diaDisable = false
          })
        } else {
          let query = {
            id: this.id,
          }
          if(type === 2) {
            query.auditOpinion = this.reasonForm.reason
          }
          modifyApprove(query).then(res => {
            this.diaLoading = false
            this.diaDisable = false
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '更改审核成功！',
              type: 'success',
              duration: 2000
            })
            this.$router.push({path: '/PF/approve/list', query:{ 
              status: this.person.status,
              type: this.person.type
            }})
          }).catch(err => {
            this.diaLoading = false
            this.diaDisable = false
          })
        }
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tc{
    text-align: center;
  }
  .add-btn{
    color: #ff9933;
    border-color: #ff9933;
    &:hover{
      color: #fff;
      background-color: #ff9933;
    }
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mr20{
    margin-right: 20px;
  }
  .mb20{
    margin-bottom: 20px;
  }
  .status{
    font-weight: 400;
    font-style: normal;
    font-size: 20px;
    color: #FF6600;
  }
  .status-type{
    color: #409EFF;
    cursor: pointer;
  }

</style>
<style lang="scss">
  .el-date-editor .el-range-separator{
    width: auto;
  }
</style>