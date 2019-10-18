<template>
  <div v-loading="listLoading" class="app-container">
      <div class="filter-container mb20">
          <template v-if="btnsPermission.search.auth">
            订单编号 
            <el-input v-model="order.orderId"  placeholder="请输入订单号" style="width: 200px;margin-right: 20px;" @keyup.enter.native="handleFilter" />
            订单状态
            <el-select v-model="order.status" placeholder="请选择" style="width: 200px;margin-right: 20px;">
              <el-option
                v-for="item in orderOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            买家账号
            <el-input v-model="order.userName"  placeholder="请输入买家账号" style="width: 200px;margin-right: 20px;" @keyup.enter.native="handleFilter" />
              下单时间
              <el-date-picker
                v-model="dateValue"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                value-format="yyyy-MM-dd hh:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange"
                align="right">
              </el-date-picker>
          </template>
      </div>
      <div class="mb20">
        <el-button :loading="downloadLoading" v-if="btnsPermission.export.auth" v-waves class="filter-item add-btn" @click="exportMsg">{{btnsPermission.export.name}}</el-button>
        <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" type="primary" :disabled="disable" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
        <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetOrder">重置</el-button>
      </div>
      <div>
        <el-tabs v-model="orderStatus" @tab-click="handleClick">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="待支付" name="0"></el-tab-pane>
          <el-tab-pane label="待发货" name="2"></el-tab-pane>
          <el-tab-pane label="待收货" name="3"></el-tab-pane>
          <el-tab-pane label="已完成" name="4"></el-tab-pane>
        </el-tabs>
        <el-table
          ref="orderTable"
          :data="orderData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          :header-cell-style="{background: '#f3f3f3'}">
          <el-table-column
            prop="orderId"
            label="订单编号"
            align="center"
            width="300">
          </el-table-column>
          <el-table-column
            label="订单状态"
            align="center"
            width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.status === -1">已取消</span>
              <span v-else-if="scope.row.status === 0">待支付</span>
              <span v-else-if="scope.row.status === 1">已支付</span>
              <span v-else-if="scope.row.status === 2">待发货</span>
              <span v-else-if="scope.row.status === 3">待收货</span>
              <span v-else-if="scope.row.status === 4">已完成</span>
              <span v-else-if="scope.row.status === 5">已关闭</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="payMoney"
            label="交易金额"
            align="center"
            width="180"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="num"
            label="商品数量"
            align="center"
            width="180"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="nickName"
            label="买家"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="下单时间"
            align="center"
            width="180"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="orderDetail(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="order.pageIndex" :limit.sync="order.pageSize"  @pagination="getOrderList" />
      </div>
      
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getOrderList, exportOrder } from '@/api/order/order'
import Pagination from '@/components/Pagination'
import { getUserBtnByPId } from '@/api/upms/menu'

export default {
  name: 'orderSellList',
  directives: { waves },
  data() {
    return {
      disable: false,
      listLoading: false,
      orderStatus: 'all',
      order: {
        createTimeBegin: '',
        createTimeEnd: '',
        orderId: '',
        pageIndex: 1,
        pageSize: 10,
        shopId: '',
        status: '',
        userId: '',
        userName: ''
      },
      downloadLoading: false,
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        export: {
          name: '导出',
          auth: false
        }
      },
      orderOption: [{
        value: '',
        label: '全部'
      }, {
        value: 0,
        label: '待支付'
      }, {
        value: 2,
        label: '待发货'
      }, {
        value: 3,
        label: '待收货'
      }, {
        value: 4,
        label: '已完成'
      }],
      orderValue: '',
      dateValue: '',
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
      orderData: [],
      total: 0,
      multipleSelection: []
    }
  },
  components: { Pagination },
  computed: {

  },
  created() {
    if(this.$route.query.orderStatus !== undefined) {
      this.orderStatus = this.$route.query.orderStatus
      this.order.pageIndex = this.$route.query.pageIndex
      this.order.pageSize = this.$route.query.pageSize
      this.order.userId = this.$route.query.userId
      this.order.userName = this.$route.query.userName
      this.order.shopId = this.$route.query.shopId
      this.order.status = this.$route.query.status
      this.order.createTimeBegin = this.$route.query.createTimeBegin
      this.order.createTimeEnd = this.$route.query.createTimeEnd
      this.order.orderId = this.$route.query.orderId
    }
    this.getOrderList()
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
    getOrderList() {
      // 订单列表
      this.listLoading = true
      getOrderList(this.order).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data.records)) {
          this.orderData = res.data.records,
          this.total = res.data.total
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleFilter() {
      // 搜索
      this.getOrderList()
    },
    resetOrder() {
      // 重置
      this.order = {
        createTimeBegin: '',
        createTimeEnd: '',
        orderId: '',
        pageIndex: 1,
        pageSize: 10,
        shopId: '',
        status: '',
        userId: '',
        userName: ''
      }
      this.dateValue = ''
      this.getOrderList()
    },
    dateChange(data) {
      // 日期选择
      this.order.createTimeBegin = data[0]
      this.order.createTimeEnd = data[1]
    },
    handleClick(tab, event) {
      // 已上架、待上架、已下架切换
      this.order.status = tab.name
      this.order.status = tab.name === 'all' ? '' : parseInt(tab.name)
      this.getOrderList()
    },
    orderDetail(row) {
      // 查看订单
      this.$router.push({
        path: 'sell/detail', 
        query:{ 
          id: row.orderId,
          createTimeBegin: this.order.createTimeBegin,
          createTimeEnd: this.order.createTimeEnd,
          orderId: this.order.orderId,
          pageIndex: this.order.pageIndex,
          userName: this.order.userName,
          pageSize: this.order.pageSize,
          shopId: this.order.shopId,
          userId: this.order.userId,
          status: this.order.status,
          orderStatus: this.orderStatus
        }
      })
    },
    exportMsg() {
      this.downloadLoading = true
      exportOrder({
        shopId: this.order.shopId,
        createTimeBegin: this.order.createTimeBegin,
        createTimeEnd: this.order.createTimeEnd,
        orderId: this.order.orderId,
        status: this.order.status,
        userId: this.order.userId,
        userName: this.order.userName
      }).then(res => {
        this.downloadLoading = false
        window.open(res.request.responseURL)
        window.href = res.request.responseURL
      }).catch(err => {
        this.downloadLoading = false
        this.$message.error('导出失败！');
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mb20{
    margin-bottom: 20px;
  }
  .fr{
    float: right;
  }
  .filter-container{
    min-width: 1500px;
  }
</style>
