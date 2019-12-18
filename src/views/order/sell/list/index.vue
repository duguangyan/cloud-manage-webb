<template>
  <div v-loading="listLoading" class="app-container">
      <div class="filter-container mb20">
          <template v-if="btnsPermission.search.auth">
            订单编号 
            <el-input v-model="order.orderId"  placeholder="请输入订单号" style="width: 200px;margin-right: 20px;" @keyup.enter.native="handleFilter" />
            订单状态
            <el-select v-model="order.searchStatus" placeholder="请选择" style="width: 200px;margin-right: 20px;">
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
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
          @selection-change="handleSelectionChange"
          :header-cell-style="{background: '#f3f3f3'}">
           <el-table-column
            type="selection"
            width="55">
          </el-table-column>
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
        <pagination v-show="total>0" :total="total" :page.sync="order.pageIndex" :limit.sync="order.pageSize"  @pagination="getPage" />
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
        orderId: '',
        pageIndex: 1,
        pageSize: 10,
        shopId: localStorage.getItem('shopId') || this.$store.state.user.shop.id,
        status: '',
        userId: '',
        userName: '',
        searchStatus: ''
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
        value: 'all',
        label: '全部'
      }, {
        value: '0',
        label: '待支付'
      }, {
        value: '2',
        label: '待发货'
      }, {
        value: '3',
        label: '待收货'
      }, {
        value: '4',
        label: '已完成'
      }],
      orderValue: '',
      dateValue: null,
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
  created() {
    if(this.$route.query.orderStatus !== undefined) {
      this.orderStatus = this.$route.query.orderStatus
      this.order.pageIndex = Number(this.$route.query.pageIndex)
      this.order.pageSize = Number(this.$route.query.pageSize)
      this.order.userId = this.$route.query.userId
      this.order.userName = this.$route.query.userName
      this.order.status = this.$route.query.status
      this.dateValue = this.$route.query.dateValue
      this.order.orderId = this.$route.query.orderId
      this.order.searchStatus = this.$route.query.searchStatus
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
      let param = {
        status: this.order.status,
        pageIndex : this.order.pageIndex,
        pageSize: this.order.pageSize,
        shopId: this.order.shopId
      }
      if(this.order.userId.length > 0) {
        param.userId = this.order.userId;
      }
      if(Array.isArray(this.dateValue)) {
        param.createTimeBegin = this.dateValue[0]
        param.createTimeEnd = this.dateValue[1]
      }
      if(this.order.userName.length > 0) {
        param.userName = this.order.userName
      }
      if(this.order.orderId.length > 0) {
        param.orderId = this.order.orderId
      }
      getOrderList(param).then(res => {
        this.listLoading = false
        this.total = res.data.total
        if(Array.isArray(res.data.records)) {
          this.orderData = res.data.records
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleFilter() {
      // 搜索
      if (this.order.searchStatus !== '') {
        this.order.status = this.order.searchStatus === 'all' ? '' : this.order.searchStatus;
        this.orderStatus = this.order.searchStatus;
      } 
      this.order.pageIndex = 1;
      this.getOrderList()
    },
    clearList() {
      this.order.orderId = '';
      this.order.pageIndex = 1;
      this.order.userId = '';
      this.order.userName = '';
      this.order.searchStatus = '';
      this.dateValue = null
    },
    resetOrder() {
      // 重置
      this.clearList();
      this.getOrderList()
    },
    handleClick(tab, event) {
      // 订单状态切换
      this.clearList();
      this.order.status = tab.name === 'all' ? '' : tab.name
      this.getOrderList()
    },
    orderDetail(row) {
      // 查看订单
      this.$router.push({
        path: '/order/sell/detail', 
        query:{ 
          id: row.orderId,
          dateValue: this.dateValue,
          orderId: this.order.orderId,
          pageIndex: this.order.pageIndex,
          userName: this.order.userName,
          pageSize: this.order.pageSize,
          shopId: this.order.shopId,
          userId: this.order.userId,
          status: this.order.status,
          orderStatus: this.orderStatus,
          searchStatus: this.order.searchStatus
        }
      })
    },
    getPage(data) {
     // 分页事件
      this.order.pageIndex = data.page
      this.getOrderList()
    },
    handleSelectionChange(val) {
      // 多选数据
      this.multipleSelection = val;
    },
    exportMsg() {
      this.downloadLoading = true
      let param = {
        shopId: this.order.shopId,
        pageIndex: this.order.pageIndex,
        pageSize: this.order.pageSize,
        status: this.order.status,
      }
      if(Array.isArray(this.dateValue)) {
        param.createTimeBegin = this.dateValue[0]
        param.createTimeEnd = this.dateValue[1]
      }
      if(this.order.orderId.length > 0) {
        param.orderId = this.order.orderId;
      }
      if(this.order.userId.length > 0) {
        param.userId = this.order.userId;
      }
      if(this.order.userName.length > 0) {
        param.userName = this.order.userName;
      }
      if (this.multipleSelection.length > 0) {
        let exportArr = [];
        this.multipleSelection.forEach(item => {
          exportArr.push(item.orderId);
        });
        param.expIds = exportArr;
      }
      
      exportOrder(param).then(res => {
        this.downloadLoading = false
        // window.open(res.request.responseURL)
        // window.href = res.request.responseURL
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' }); // 将服务端返回的文件流（二进制）excel文件转化为blob
        let d = new Date();
        let fileName = '订单' + d.getFullYear() + (d.getMonth() + 1) + d.getDate();
        if (window.navigator && window.navigator.msSaveOrOpenBlob) { // IE
          window.navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          let objectUrl = (window.URL || window.webkitURL).createObjectURL(blob);
          let downFile = document.createElement('a');
          downFile.style.display = 'none';
          downFile.href = objectUrl;
          downFile.download = fileName; // 下载后文件名
          document.body.appendChild(downFile);
          downFile.click();
          document.body.removeChild(downFile); // 下载完成移除元素
          // window.location.href = objectUrl
          window.URL.revokeObjectURL(objectUrl);  // 只要映射存在，Blob就不能进行垃圾回收，因此一旦不再需要引用，就必须小心撤销URL，释放掉blob对象。
        }
      }).catch(err => {
        this.downloadLoading = false
        // this.$message.error('导出失败！');
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
