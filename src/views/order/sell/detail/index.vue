<template>
  <div class="app-container">
      <div class="filter-container mb10">
        <el-card class="box-card order-box">
          <div slot="header" class="clearfix">
            <span class="mr10">订单状态</span>
            <span v-if="status === -1" class="order-status">已取消</span>
            <span v-else-if="status === 0" class="order-status">待支付</span>
            <span v-else-if="status === 1" class="order-status">已支付</span>
            <span v-else-if="status === 2" class="order-status">未发货</span>
            <span v-else-if="status === 3" class="order-status">已发货</span>
            <span v-else-if="status === 4" class="order-status">已完成</span>
            <span v-else-if="status === 5" class="order-status">已关闭</span>
          </div>
          <el-steps :active="activeStep" align-center finish-status="success">
            <el-step title="提交订单" :description="time[0]"></el-step>
            <el-step title="支付订单" :description="time[1]"></el-step>
            <el-step title="商家发货" :description="time[2]"></el-step>
            <el-step title="确认收货" :description="time[3]"></el-step>
          </el-steps>
        </el-card>
      </div>
    <el-card class="box-card mb10">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-table
        :data="baseData"
        border
        style="width: 100%">
        <el-table-column
          prop="orderId"
          label="订单编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="payChannel"
          label="支付方式"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户账号"
          align="center">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card mb10">
      <div slot="header" class="clearfix">
        <span>收货人信息</span>
      </div>
      <el-table
        :data="addressData"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="receiver"
          label="收货人姓名"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="phone"
          label="收货人手机号码"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          width="600"
          label="收货地址">
          <template slot-scope="scope">
            {{scope.row.province}}{{scope.row.city}}{{scope.row.region}}{{scope.row.address}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="postscript"
          label="买家留言">
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card mb10">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <el-table
        :data="productData"
        border
        style="width: 100%">
        <el-table-column
          prop="goodsId"
          label="商品ID"
          align="center"
          width="260">
        </el-table-column>
        <el-table-column
          label="主图"
          align="center"
          width="180">
          <template slot-scope="scope">
            <el-avatar shape="square" size="large" :src="scope.row.imgUrl"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="goodsName"
          label="标题"
          align="center">
        </el-table-column>
        <el-table-column
          prop="skuDesc"
          align="center"
          label="规格">
        </el-table-column>
        <el-table-column
          align="center"
          label="单价/数量">
          <template slot-scope="scope">
            <p style="color: #ff0000">{{scope.row.price | money}}</p>
            <p>{{scope.row.num | multiply}}</p>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="box-card mb10">
      <div slot="header" class="clearfix">
        <span>费用信息</span>
      </div>
      <el-table
        :data="feeData"
        border
        style="width: 100%">
        <el-table-column
          label="商品合计"
          align="center">
          <template slot-scope="scope">
            {{scope.row.totalMoney | money}}
          </template>
        </el-table-column>
        <el-table-column
          label="运费"
          align="center">
          <template slot-scope="scope">
            {{scope.row.deliverMoney | money}}
          </template>
        </el-table-column>
        <el-table-column
          label="订单金额"
          align="center">
          <template slot-scope="scope">
            {{scope.row.orderMoney | money}}
          </template>
        </el-table-column>
        <el-table-column
          label="交易金额"
          align="center">
          <template slot-scope="scope">
            <span style="color: #ff0000">{{scope.row.settleMoney | money}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card v-if="status > 3" class="box-card mb10">
      <div slot="header" class="clearfix">
        <span>物流信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <p>货运单号：{{express.num}}</p>
            <p style="font-size: 14px;">快递公司：{{express.name}}</p>
            <p style="font-size: 14px;">发货时间：{{express.time}}</p>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="grid-content bg-purple">
            <el-steps direction="vertical" :active="expressHistory.length">
              <el-step v-for="(item, index) in expressHistory" :key="index" :title="item.time" :description="item.context"></el-step>
            </el-steps>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card mb10">
      <div class="send-box">
        <el-button v-if="btnsPermission.send.auth && status === 2" type="primary" @click="shipping">{{btnsPermission.send.name}}</el-button>
        <el-button v-if="btnsPermission.edit.auth && status === 3" type="primary" @click="editShipping">{{btnsPermission.edit.name}}</el-button>
        <el-button @click="back">返回</el-button>
      </div>
    </el-card>
    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'修改运单号':'发货操作'">
      <el-form v-loading="diaLoading" ref="expressForm" :model="express" label-width="120px" label-position="left" :rules="rule">
        <el-form-item label="物流公司" prop="id">
          <el-select v-model="express.id" filterable remote :remote-method="remoteExpress" placeholder="请选择物流公司">
            <el-option
              v-for="item in expressData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="运单号" prop="num">
          <el-input v-model.trim="express.num" maxlength="20" placeholder="请填写运单号" />
        </el-form-item>
        <el-form-item label="邮寄人手机号" prop="phone">
          <el-input v-model.trim="express.phone" maxlength="11" placeholder="请填写手机号码" />
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
import { getOrderDetail } from '@/api/order/order'
import { getExpress, sendExpress, editExpress } from '@/api/order/express'
import { validTelphone } from '@/utils/validate'
import { getUserBtnByPId } from '@/api/upms/menu'

export default {
  name: 'OrderDetail',
  directives: { waves },
  data() {
    const validateTelphone = (rule, value, callback) => {
      if(rule.required) {
        if(value === '') { 
          callback(new Error('顺丰必填'))
        }else if (!validTelphone(value)) {
          callback(new Error('请输入正确的手机号码'))
        }else {
          callback()
        }
      } else {
        if(value !== '' && !validTelphone(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
      
    }
    return {
      id: '',
      shopId: '',
      shippingId: '',
      status: '',
      time: ['', '', '', ''],
      activeStep: -1,
      baseData: [],
      addressData: [],
      productData: [],
      feeData: [],
      express: {
        num: '',
        code: '',
        id: '',
        name: '',
        phone: '',
        time: ''
      },
      btnsPermission: {
        send: {
          name: '发货',
          auth: false
        },
        edit: {
          name: '修改运单号',
          auth: false
        }
      },
      order: {
        orderStatus: 'all',
        createTimeBegin: '',
        createTimeEnd: '',
        orderId: '',
        pageIndex: '',
        pageSize: '',
        shopId: '',
        status: '',
        userId: '',
        userName: ''
      },
      expressData: [],
      expressHistory: [],
      expressSelect: [],
      hasCompany: false,
      value: '',
      rule: {
        id: [{
            required: true,
            message: '请选择快递公司',
            trigger: 'blur'
        }],
        num: [{
            required: true,
            message: '请填写运单号',
            trigger: 'blur'
        }],
        phone: [{
          required: false,
          trigger: 'blur',
          validator: validateTelphone
        }]
      },
      dialogType: 'new',
      diaDisable: false,
      dialogVisible: false,
      diaLoading: false
    }
  },
  components: {  },
  created() {
    this.id = this.$route.query.id
    this.order.orderStatus = this.$route.query.orderStatus
    this.order.createTimeBegin = this.$route.query.createTimeBegin
    this.order.createTimeEnd = this.$route.query.createTimeEnd
    this.order.orderId = this.$route.query.orderId
    this.order.pageIndex = this.$route.query.pageIndex
    this.order.userName = this.$route.query.userName
    this.order.shopId = this.$route.query.shopId
    this.order.status = this.$route.query.status
    this.order.pageSize = this.$route.query.pageSize
    this.order.userId = this.$route.query.userId
    this.getOrderDetail()
  },
   mounted() {
    // 默认样式修改 
    let dom = document.querySelector('.el-steps')
    let selfClass = dom.getAttribute('class') + ' self-step'
    dom.setAttribute('class', selfClass)
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
    getOrderDetail() {
      // 获取订单详情
      getOrderDetail({ orderId: this.id }).then(res => {
        if(res.data !== null) {
          this.baseData = []
          let baseObj = {}
          baseObj.payChannel = res.data.payChannel
          baseObj.userName = res.data.userName
          if(res.data.orderShipping !== null) {
            if(res.data.shopOrder !== null && res.data.shopOrder.status === 3) {
              this.express.id = res.data.orderShipping.courierId
              this.express.num = res.data.orderShipping.courierNum
              this.express.phone = res.data.orderShipping.senderPhone
              this.expressSelect = []
              this.expressSelect.push({
                id: res.data.orderShipping.courierId,
                name: res.data.orderShipping.courierCompany
              })
            }
            let addressObj = res.data.orderShipping
            this.shippingId = res.data.orderShipping.id
            this.addressData = []
            addressObj.postscript = res.data.postscript
            this.addressData.push(addressObj)
          }
          if(res.data.shopOrder !== null) {
            this.shopId = res.data.shopOrder.shopId
            this.status = res.data.shopOrder.status
            this.time[0] = res.data.shopOrder.createTime
            this.time[1] = res.data.shopOrder.payTime
            this.time[2] = res.data.shopOrder.sendTime
            this.time[3] = res.data.shopOrder.finishTime
            if(this.status > 3) {
              this.activeStep = 4 
              if(res.data.expressDetails !==null && Array.isArray(res.data.expressDetails.traceList)) {
                this.expressHistory = res.data.expressDetails.traceList.reverse()
              }
              if(res.data.orderShipping !== null) {
                this.express.num = res.data.orderShipping.courierNum
                this.express.name = res.data.orderShipping.courierCompany
              }
              this.express.time = res.data.shopOrder.sendTime
            } else if(this.status > 2) {
              this.activeStep = 3
            } else if(this.status > 0) {
              this.activeStep = 2
            } else if(this.status > -1) {
              this.activeStep = 1
            } else {
              this.activeStep = -1
            }
            baseObj.orderId = res.data.shopOrder.orderId
            if(Array.isArray(res.data.shopOrder.orderDetailList)) {
              this.productData = res.data.shopOrder.orderDetailList
            }
            this.feeData = []
            this.feeData.push({
              totalMoney: res.data.shopOrder.totalMoney,
              deliverMoney: res.data.shopOrder.deliverMoney,
              orderMoney: res.data.shopOrder.orderMoney,
              settleMoney: res.data.shopOrder.settleMoney
            })
          }
          this.baseData.push(baseObj)
        }
      })
    },
    getExpress(param) {
      // 获取快递公司
      this.diaLoading = true
      this.diaDisable = true
      getExpress(param).then(res => {
        this.diaLoading = false
        this.diaDisable = false
        if(Array.isArray(res.data.records)) {
          if(!this.hasCompany) {
            res.data.records.forEach(item => {
              if(item.id === this.expressSelect[0].id) {
                this.hasCompany = true
                return false
              }
            })
          }
          this.expressData = this.status === 3 && !this.hasCompany ? res.data.records.concat(this.expressSelect) : res.data.records
        }
      })
    },
    remoteExpress(val) {
      // 手动查询快递公司
      this.hasCompany = true
      this.getExpress({ status: 1, pageIndex: 1, pageSize: 20, name: val })
    },
    shipping() {
      // 发货按钮事件
      this.hasCompany = true
      this.dialogType = 'new'
      this.dialogVisible = true
      this.getExpress({ status: 1, pageIndex: 1, pageSize: 20 })
    },
    editShipping() {
      // 修改物流信息
      this.hasCompany = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.getExpress({ status: 1, pageIndex: 1, pageSize: 20 })
    },
    back() {
      // 返回事件
      this.$router.push({path: '/order/sell', query:{ 
        pageIndex: this.order.pageIndex,
        createTimeBegin: this.order.createTimeBegin,
        createTimeEnd: this.order.createTimeEnd,
        orderId: this.order.orderId,
        userName: this.order.userName,
        userId: this.order.userId,
        shopId: this.order.shopId,
        status: this.order.status,
        pageSize: this.order.pageSize,
        orderStatus: this.order.orderStatus
      }})
    },
    regFun() {
      // 表单校验
      this.rule.phone[0].required = false
      this.expressData.forEach(item => {
        if(item.id === this.express.id) {
          this.express.name = item.name
          this.express.code = item.code
          if(item.code === 'shunfeng') {
            this.rule.phone[0].required = true
          }
          return false
        }
      })
      console.log(this.rule)
      this.$refs.expressForm.validate(valid => {
        if(valid) {
          this.confirm()
        }
      })
    },
    async confirm() {
      // 发货事件
      this.diaDisable = true
      this.diaLoading = true
      let expressName = ''
      let succMsg = ''
      if(this.dialogType === 'new') {
        succMsg = '发货成功！'
        await sendExpress({
          courierId: this.express.id,
          courierCompany: this.express.name,
          courierNum: this.express.num,
          orderId: this.id,
          shippingId: this.shippingId,
          shopId: this.shopId,
          senderPhone: this.express.phone
        }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        this.diaDisable = false
        this.diaLoading = false
        this.dialogVisible = false
      } else {
        succMsg = '修改成功！'
        await editExpress({
          courierId: this.express.id,
          courierCompany: this.express.name,
          courierNum: this.express.num,
          orderId: this.id,
          shippingId: this.shippingId,
          shopId: this.shopId,
          senderPhone: this.express.phone
        }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        this.diaDisable = false
        this.diaLoading = false
        this.dialogVisible = false
      }
      
      this.$notify({
        title: succMsg,
        dangerouslyUseHTMLString: true,
        type: 'success'
      })
      this.getOrderDetail()
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
  .send-box{
    text-align: center;
    padding: 50px 0;
    button{
      width: 140px;
      margin: 0 40px;
    }
  }
  .fr{
    float: right;
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