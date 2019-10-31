<template>
  <div class="app-container">
    审核详情页面

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