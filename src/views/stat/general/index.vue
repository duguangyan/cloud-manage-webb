<template>
  <div class="app-container">
    <el-button type="primary" size="middle" @click="refresh">刷新 </el-button>
    <div class="uv" ref="uv"></div>
    <div class="pay" ref="pay"></div>
    <div class="order" ref="order"></div>
    <div class="money" ref="money"></div>
  </div>
</template>

<script>
export default {
  name: "General",
  data() {
    return {};
  },
  components: {},
  computed: {},
  mounted() {
    let clock = ($ => {
      let res = [];
      for (let i = 0; i < 24; i++) {
        res.push(i)
      }
      return res
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
          data: [5, 20, 36, 10, 10, 20]
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
          data: [5, 20, 36, 10, 10, 20]
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
          data: [5, 20, 36, 10, 10, 20]
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
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });
  },
  methods: {}
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
