<template>
  <div class="dashboard-container">
    <!-- <component :is="currentRole" /> -->
    <div class="msg-title"> 昨日数据一览</div>
    <panel-group :uv="yesterday.uv" :pv="yesterday.pv" :customer="yesterday.customer" :number="yesterday.number" />
    <div class="msg-title"> 最近30天成交商品</div>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      border
      :data="tableData"
      :header-cell-style="{background: '#f3f3f3'}" 
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        label="序号"
        align="center"
        width="180">
        <template slot-scope="scope">
          {{ scope.$index + 1 + (list.pageIndex - 1) * list.pageSize }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="图片"
        width="180">
        <template slot-scope="scope">
          <el-avatar shape="square" size="large" :src="scope.row.imageUrl"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsName"
        label="标题"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="price"
        label="单价"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="payTime"
        label="支付完成时间"
        width="220">
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="list.pageIndex" :limit.sync="list.pageSize"  @pagination="getPage" />
    
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import adminDashboard from "./admin";
import editorDashboard from "./editor";
import { token } from "@/store/getters";
import { getStore } from "@/store/store"
import { getsaleGoodsList } from '@/api/order/order'
import { getStatDataByDay } from '@/api/analyse/analyse'
import PanelGroup from './admin/components/PanelGroup'
import Pagination from '@/components/Pagination'
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}


export default {
  name: "Dashboard",
  components: { adminDashboard, editorDashboard, Pagination, PanelGroup },
  data() {
    return {
      currentRole: "adminDashboard",
      listLoading: false,
      tableData: [],
      list: {
        pageIndex: 1,
        pageSize: 10,
        shopId: ''
      },
      yesterday: {
        uv: null,
        pv: null,
        customer: null,
        number: null
      },
      total: 0,
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: "",
      expires_in: getStore({ name: "expires_in" })
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    let self = this;
    this.refreshToken();
    this.getStatDataByDay();
    this.getsaleGoodsList();
  },
  methods: {
    getStatDataByDay() {
      // 获取昨日数据一览
      let date = new Date()
      date.setDate(date.getDate() - 1)
      let y = date.getFullYear()
      let M = date.getMonth() + 1
      let d = date.getDate()
      let yesterday = y + '-' + M + '-' + d
      getStatDataByDay({ day: yesterday }).then(res => {
        this.yesterday.uv = res.data.uv
        this.yesterday.pv = res.data.pv
        this.yesterday.customer = res.data.userNum
        this.yesterday.number = res.data.orderNum
      })
    },
    getsaleGoodsList() {
      // 获取最近30天成交商品数据
      let query = {
        pageIndex: this.list.pageIndex,
        pageSize: this.list.pageSize
      }
      query.shopId = localStorage.getItem('shopId') || this.$store.state.user.shop.id 
      getsaleGoodsList(query).then(res => {
        this.total = res.data.total
        if(Array.isArray(res.data.records)) {
          this.tableData = res.data.records
        }
      })
    },
    // 实时检测刷新token
    refreshToken() {

      let self = this;
      self.refreshTime = setInterval(() => {

        if (self.expires_in <= 10 && !self.refreshLock) {
          self.refreshLock = true;
          self.$store.dispatch("user/RefreshToken").then(data=>{
            self.expires_in = data
          }).catch(() => {
            clearInterval(self.refreshTime);
          });
          self.refreshLock = false;
        }
        self.$store.commit("user/SET_EXPIRES_IN", --self.expires_in);
      }, 1000);
    },
    getPage(data) {
     // 分页事件
      this.list.pageIndex = data.page
      this.getsaleGoodsList()
    }
  }
};
</script>
<style lang="scss" scoped>
  .pd10{
    padding: 10px;
  }
  .msg-title{
    font-size: 18px;
    font-weight: 700;
    font-style: normal;
    color: #797979;
    background: #fff;
    height: 38px;
    line-height: 38px;
  }

  .dashboard-container {
    padding: 32px;
    // background-color: rgb(240, 242, 245);
    position: relative;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }
    
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  @media (max-width:1024px) {
    .chart-wrapper {
      padding: 8px;
    }
  }
</style>
