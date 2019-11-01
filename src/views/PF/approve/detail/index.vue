<template>
  <div class="app-container">
    <el-form v-loading="diaLoading" ref="productForm" :model="form" label-position="right" label-width="140px" style="">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <div  class="text item">
          <el-form-item label="申请人姓名：" required>代用名</el-form-item>
          <el-form-item label="身份证号码：" required>430512198908131367</el-form-item>
          <el-form-item label="手机号码：" required>13665545885</el-form-item>
          <el-form-item label="身份证正面照：" required>430512198908131367</el-form-item>
          <el-form-item label="身份证国徽照：" required>430512198908131367</el-form-item>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>店铺信息</span>
        </div>
        <div  class="text item">
          <el-form-item label="经营类目：" required>农用作物/蔬菜/红薯</el-form-item>
          <el-form-item label="经营地区：" required>河北廊坊长安区</el-form-item>
        </div>
      </el-card>
    </el-form>
    
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getApproveDetail } from '@/api/PF/apply/apply'

export default {
  name: 'PFapproveDetail',
  directives: { waves },
  data() {
    return {
      id: '',
      form: {},
      diaLoading: false,
    }
  },
  created() {
    console.log(this.$route)
    if(this.$route.query.id) {
      this.id = this.$route.query.id
    }
    this.getApproveDetail()
  },
  methods: {
    getApproveDetail() {
      getApproveDetail({ id: this.id }).then(res => {

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
</style>
<style lang="scss">
  .el-date-editor .el-range-separator{
    width: auto;
  }
</style>