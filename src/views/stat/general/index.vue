<template>
  <div class="app-container">
    <el-button type="primary" size="middle" @click="initGraphic">刷新</el-button>
    <div class="uv" ref="uv"></div>
    <div class="pay" ref="pay"></div>
    <div class="order" ref="order"></div>
    <div class="money" ref="money"></div>
  </div>
</template>

<script>
import { getAnaData } from "@/api/analyse/analyse";
export default {
  name: "statGeneral",
  data() {
    return {};
  },
  components: {},
  computed: {},
  mounted() {
    this.load()
  },
  methods: {
    load() {
      let day = new Date(Date.now() - 60 * 60 * 24 * 1000)
        .toLocaleString()
        .match(/([\d\W]+)\s/)[1]
        .replace(/\//g, "-");
      getAnaData({
        day
      }).then(data => {
        let d = {
          ip: /* 访客 */[],
          userNum: /* 成交客户 */[],
          orderNum: /* 订单数 */[],
          orderTotalAmount:/* 订单总额 */ []
        }

        data.data.forEach(item=>{
          d.ip.push(item.ip)
          d.userNum.push(item.userNum)
          d.orderNum.push(item.orderNum)
          d.orderTotalAmount.push(item.orderTotalAmount)
        })

        this.initGraphic(d);
      });
    },
    initGraphic(data) {
      console.log(data);
      let clock = ($ => {
        let res = [];
        for (let i = 0; i < 24; i++) {
          res.push(i);
        }
        return res;
      })();
      // 访客
      var uvChart = this.$echarts.init(this.$refs.uv);
      uvChart.setOption({
        title: {
          text: "访客(人)"
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: clock
        },
        yAxis: {},
        series: [
          {
            name: "访客",
            type: "line",
            data: data.ip
          }
        ]
      });

      // 成交客户
      var payChart = this.$echarts.init(this.$refs.pay);
      payChart.setOption({
        title: {
          text: "成交客户(人)"
        },
        tooltip: {},
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: clock
        },
        yAxis: {},
        series: [
          {
            name: "成交客户",
            type: "line",
            data: data.userNum
          }
        ]
      });

      // 支付订单
      var orderChart = this.$echarts.init(this.$refs.order);
      orderChart.setOption({
        title: {
          text: "支付订单(笔)"
        },
        tooltip: {},
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: clock
        },
        yAxis: {},
        series: [
          {
            name: "支付订单",
            type: "line",
            data: data.orderNum
          }
        ]
      });

      // 支付金额
      var moneyChart = this.$echarts.init(this.$refs.money);
      moneyChart.setOption({
        title: {
          text: "支付金额(元)"
        },
        tooltip: {},
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          data: clock
        },
        yAxis: {},
        series: [
          {
            name: "支付金额",
            type: "line",
            data: data.orderTotalAmount
          }
        ]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  text-align: right;

  & > div {
    margin-top: 20px;
    width: 960px;
    height: 400px;
  }
}
</style>
