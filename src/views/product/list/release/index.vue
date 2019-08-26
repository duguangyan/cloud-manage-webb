<template>
  <!-- <div class="app-container"> -->
  <div class="app-container">
    <el-cascader :options="options" :props="props"></el-cascader>
    <el-cascader :options="optionss" @active-item-change="getNodes" :props="propss"></el-cascader>
  </div>
</template>

<script>
let id = 0;
export default {
  name: 'release',
  data() {
    return {
      addWtdjForm: {
        zrbz: []
      },
    bzItems:[],
    zrbzProps: {
      value: 'value',
      children: 'bzs'
    },
    optionss: [],
      propss: {
        value: "id",
        label: "name",
        children: "children"
      },

      props: {
          lazy: true,
          lazyLoad (node, resolve) {
            const { level } = node;
            setTimeout(() => {
              const nodes = Array.from({ length: level + 1 })
                .map(item => ({
                  value: ++id,
                  label: `选项${id}`,
                  leaf: level >= 2
                }));
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            }, 1000);
          }
        },
      data: [],
      options: [{
          value: 1,
          label: '东南',
          children: [{
            value: 2,
            label: '上海',
            children: [
              { value: 3, label: '普陀',
                children: [
                  {
                    value: 6,
                    label: '普陀1'
                  },
                  {
                    value: 7,
                    label: '普陀2'
                  }
                ]
               },
              { value: 4, label: '黄埔' },
              { value: 5, label: '徐汇' }
            ]
          }, {
            value: 7,
            label: '江苏',
            children: [
              { value: 8, label: '南京' },
              { value: 9, label: '苏州' },
              { value: 10, label: '无锡' }
            ]
          }, {
            value: 12,
            label: '浙江',
            children: [
              { value: 13, label: '杭州' },
              { value: 14, label: '宁波' },
              { value: 15, label: '嘉兴' }
            ]
          }]
        }, {
          value: 17,
          label: '西北',
          children: [{
            value: 18,
            label: '陕西',
            children: [
              { value: 19, label: '西安' },
              { value: 20, label: '延安' }
            ]
          }, {
            value: 21,
            label: '新疆维吾尔族自治区',
            children: [
              { value: 22, label: '乌鲁木齐' },
              { value: 23, label: '克拉玛依' }
            ]
          }]
        }]
    }
  },
  components: {  },
  computed: {

  },
  created() {
    console.log(this.$route)
  },
  methods: {
    lazyLoad (node, resolve) {
      console.log(node)

      const { level } = node;
      setTimeout(() => {
        const nodes = Array.from({ length: level + 1 })
          .map(item => ({
            value: ++id,
            label: `选项${id}`,
            leaf: level >= 2
          }));
        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        resolve(nodes);
      }, 1000);
    },
    async getProviceList() {
      console.log('xxxx')
      const { data } = await getProviceList();
      data.map(item => {
        this.$set(item, "name", item.provinceName);
        this.$set(item, "children", []);
      });
      this.options = data;
    },
    // 获取城市
    async getCityList(provinceId) {
      const { data } = await getCityList({ provinceId });
      data.map(item => {
        this.$set(item, "name", item.cityName);
        this.$set(item, "children", []);
      });
      this.options.map((item, i) => {
        if (item.id === provinceId) {
          item.children = data;
        }
      });
    },
    // 获取地区
    async getAreaList(provinceId, cityId) {
      const { code, data } = await getAreaList({ cityId });
      data.map(item => {
        this.$set(item, "name", item.areaName);
        // this.$set(item, "children", []);
      });
      this.options.map((item, i) => {
        if (item.id === provinceId) {
          item.children.map((city, idx) => {
            city.children = data;
          });
        }
      });
    },
    getNodes(val) {
       console.log('val', val)
      // 获取城市（二级）
      if (val.length === 1) {
        this.getCityList(val[0]);
        // 获取地区 （三级）
      } else if (val.length === 2) {
        this.getAreaList(val[0], val[1]);
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>