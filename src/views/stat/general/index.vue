<template>
  <div class="app-container">
    <div class="uv" ref="uv"></div>
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
    var myChart = this.$echarts.init(this.$refs.uv);
    myChart.setOption({
      title: {
        text: "ECharts 入门示例"
      },
      tooltip: {},
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
</style>
