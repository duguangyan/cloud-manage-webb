<template>
  <!-- <div class="app-container"> -->
  <div v-loading="listLoading" class="app-container">
    <el-cascader-panel ref="cascaderAddr" :props="treeProps" :options="treeOptions" @change="selectChange"></el-cascader-panel>
    <div class="next-box">
      <el-button v-waves @click="back" class="filter-item">返回</el-button>
      <el-button v-if="!next" type="info" disabled="" v-waves class="filter-item">下一步</el-button>
      <el-button v-if="next" @click="nextJump" type="primary" v-waves class="filter-item">下一步</el-button>
  
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getProductTree } from '@/api/goods/product'
let id = 0;
export default {
  name: 'productRelease',
  directives: { waves },
  data() {
    return {
      treeOptions: [],
      treeProps: {
        label: 'name',
        value: 'id'
      },
      treeDes: [],
      listLoading: false,
      next: false,
      chooseId: '',
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
      options: []
    }
  },
  components: {  },
  computed: {

  },
  created() {
    this.getProductTree()
  },
  mounted() {
    let dom = document.querySelector('.el-cascader-panel')
    let selfClass = dom.getAttribute('class') + ' self-height'
    dom.setAttribute('class', selfClass)
  },
  methods: {
    back() {
      // 返回
      this.$router.back(-1)
    },
    nextJump() {
      // 下一步
      if(this.chooseId.length > 0) {
        this.$router.push({path: '/product/list/add', query: {
          id: this.chooseId,
          des: this.treeDes
        }})
      }
    },
    getProductTree() {
      // 商品树接口
      this.listLoading = true
      getProductTree().then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          this.treeOptions = res.data
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    selectChange(val) {
      // 商品类型选择
      if (val.length === 4) {
        const arr = this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels
        for(let i = 0; i < arr.length; i++) {
          this.treeDes[i] = arr[i]
        }
        this.chooseId = val[3]
        this.next = true
      } else {
        this.chooseId = ''
        this.next = false
      }
    },
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
    },
    async getProviceList() {
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
  .next-box{
    text-align: center;
    padding-top: 20px;
  }
</style>
<style>
  .self-height .el-cascader-menu__wrap{
    height: 800px;
  }
</style>