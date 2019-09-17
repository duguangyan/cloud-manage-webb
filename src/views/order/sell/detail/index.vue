<template>
  <div class="app-container">
      <div class="filter-container mb10">
        <el-card class="box-card order-box">
          <div slot="header" class="clearfix">
            <span class="mr10">订单状态</span>
            <span class="order-status">待付款</span>
            <el-button class="fr" type="primary" size="medium">返回</el-button>
          </div>
          <el-steps :active="2" align-center finish-status="success">
            <el-step title="提交订单" description="2017-07-19 15:43:23"></el-step>
            <el-step title="支付订单" description="未支付"></el-step>
            <el-step title="商家发货" status="wait" description=""></el-step>
            <el-step title="确认收货" description=""></el-step>
          </el-steps>
        </el-card>
      </div>
    <el-card class="box-card mb10">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card mb10">
      <div slot="header" class="clearfix">
        <span>收货人信息</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card mb10">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>费用信息</span>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址">
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import waves from '@/directive/waves'

export default {
  name: 'orderDetail',
  directives: { waves },
  data() {
    return {
      tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
    }
  },
  components: {  },
  computed: {

  },
  created() {

  },
   mounted() {
    let dom = document.querySelector('.el-steps')
    let selfClass = dom.getAttribute('class') + ' self-step'
    dom.setAttribute('class', selfClass)
  },
  methods: {
    handleFilter() {
      // 搜索
      this.getList()
    },
    resetOrder() {
      // 重置
      this.listQuery = {
        createTimeStart: '',
        createTimeEnd: '',
        downTimeStart: '',
        downTimeEnd: '',
        sellTimeStart: '',
        sellTimeEnd: '',
        categoryId: '',
        keywords: '',
        pageIndex: 1,
        pageSize: 10,
        sortColumn: 'min_price',
        sortType: 0,
        status: 3
      }
      this.dateValue = ''
      this.treeValue = ''
      this.saleType = '3'
      this.getList()
    },
    dateChange(data) {
      // 日期选择
      if(this.saleType === '3') {
        this.listQuery.sellTimeStart = data[0]
        this.listQuery.sellTimeEnd = data[1]
      } else if(this.saleType === '1') {
        this.listQuery.createTimeStart = data[0]
        this.listQuery.createTimeEnd = data[1]
      } else if(this.saleType === '4') {
        this.listQuery.downTimeStart = data[0]
        this.listQuery.downTimeEnd = data[1]
      }
    },
    handleClick(tab, event) {
      // 已上架、待上架、已下架切换
      this.listQuery.status = tab.name
      this.listQuery.sellTimeStart = ''
      this.listQuery.sellTimeEnd = ''
      this.listQuery.createTimeStart = ''
      this.listQuery.createTimeEnd = ''
      this.listQuery.downTimeStart = ''
      this.listQuery.downTimeEnd = ''
      this.dateValue = ''
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
}
</script>

<style lang="scss" scoped>
  .mb10{
    margin-bottom: 10px;
  }
  .mr10{
    margin-right: 10px;
  }
  .fr{
    float: right;
  }
  .filter-container{
    min-width: 1500px;
  }
  .order-box{
    color: #FF6600;
    .order-status{
      font-size: 24px;
    }
  }
</style>
<style lang="scss">
  .self-step{
    .el-step__icon{
      width: 50px;
      height: 50px;
    }
    .el-step.is-horizontal .el-step__line{
      top: 24px;
    }
    .el-step__icon{
      font-size: 20px;
    }
  }
</style>