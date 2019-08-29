<template>
  <!-- <div class="app-container"> -->
  <div v-loading="listLoading" class="app-container">
    <!-- <el-cascader :options="options" :props="props"></el-cascader>
    <el-cascader :options="optionss" @active-item-change="getNodes" :props="propss"></el-cascader> -->
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
  name: 'release',
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
      options2: [{
          value: 'zhinan',
          label: '指南',
          children: [{
            value: 'shejiyuanze',
            label: '设计原则',
            children: [{
              value: 'yizhi',
              label: '一致'
            }, {
              value: 'fankui',
              label: '反馈'
            }, {
              value: 'xiaolv',
              label: '效率'
            }, {
              value: 'kekong',
              label: '可控'
            }]
          }, {
            value: 'daohang',
            label: '导航',
            children: [{
              value: 'cexiangdaohang',
              label: '侧向导航'
            }, {
              value: 'dingbudaohang',
              label: '顶部导航'
            }]
          }]
        }, {
          value: 'zujian',
          label: '组件',
          children: [{
            value: 'basic',
            label: 'Basic',
            children: [{
              value: 'layout',
              label: 'Layout 布局'
            }, {
              value: 'color',
              label: 'Color 色彩'
            }, {
              value: 'typography',
              label: 'Typography 字体'
            }, {
              value: 'icon',
              label: 'Icon 图标'
            }, {
              value: 'button',
              label: 'Button 按钮'
            }]
          }, {
            value: 'form',
            label: 'Form',
            children: [{
              value: 'radio',
              label: 'Radio 单选框'
            }, {
              value: 'checkbox',
              label: 'Checkbox 多选框'
            }, {
              value: 'input',
              label: 'Input 输入框'
            }, {
              value: 'input-number',
              label: 'InputNumber 计数器'
            }, {
              value: 'select',
              label: 'Select 选择器'
            }, {
              value: 'cascader',
              label: 'Cascader 级联选择器'
            }, {
              value: 'switch',
              label: 'Switch 开关'
            }, {
              value: 'slider',
              label: 'Slider 滑块'
            }, {
              value: 'time-picker',
              label: 'TimePicker 时间选择器'
            }, {
              value: 'date-picker',
              label: 'DatePicker 日期选择器'
            }, {
              value: 'datetime-picker',
              label: 'DateTimePicker 日期时间选择器'
            }, {
              value: 'upload',
              label: 'Upload 上传'
            }, {
              value: 'rate',
              label: 'Rate 评分'
            }, {
              value: 'form',
              label: 'Form 表单'
            }]
          }, {
            value: 'data',
            label: 'Data',
            children: [{
              value: 'table',
              label: 'Table 表格'
            }, {
              value: 'tag',
              label: 'Tag 标签'
            }, {
              value: 'progress',
              label: 'Progress 进度条'
            }, {
              value: 'tree',
              label: 'Tree 树形控件'
            }, {
              value: 'pagination',
              label: 'Pagination 分页'
            }, {
              value: 'badge',
              label: 'Badge 标记'
            }]
          }, {
            value: 'notice',
            label: 'Notice',
            children: [{
              value: 'alert',
              label: 'Alert 警告'
            }, {
              value: 'loading',
              label: 'Loading 加载'
            }, {
              value: 'message',
              label: 'Message 消息提示'
            }, {
              value: 'message-box',
              label: 'MessageBox 弹框'
            }, {
              value: 'notification',
              label: 'Notification 通知'
            }]
          }, {
            value: 'navigation',
            label: 'Navigation',
            children: [{
              value: 'menu',
              label: 'NavMenu 导航菜单'
            }, {
              value: 'tabs',
              label: 'Tabs 标签页'
            }, {
              value: 'breadcrumb',
              label: 'Breadcrumb 面包屑'
            }, {
              value: 'dropdown',
              label: 'Dropdown 下拉菜单'
            }, {
              value: 'steps',
              label: 'Steps 步骤条'
            }]
          }, {
            value: 'others',
            label: 'Others',
            children: [{
              value: 'dialog',
              label: 'Dialog 对话框'
            }, {
              value: 'tooltip',
              label: 'Tooltip 文字提示'
            }, {
              value: 'popover',
              label: 'Popover 弹出框'
            }, {
              value: 'card',
              label: 'Card 卡片'
            }, {
              value: 'carousel',
              label: 'Carousel 走马灯'
            }, {
              value: 'collapse',
              label: 'Collapse 折叠面板'
            }]
          }]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [{
            value: 'axure',
            label: 'Axure Components'
          }, {
            value: 'sketch',
            label: 'Sketch Templates'
          }, {
            value: 'jiaohu',
            label: '组件交互文档'
          }]
        }],
      addWtdjForm: {
        zrbz: []
      },
    bzItems:[],
    zrbzProps: {
      value: 'value',
      children: 'bzs'
    },
    optionss: [
      {
        value: '1',
        label: '广州',
        children: []
      }
    ],
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
    this.getProductTree()
  },
  methods: {
    back() {
      // 返回
      this.$router.back(-1)
    },
    nextJump() {
      // 下一步
      if(this.chooseId.length > 0) {
        this.$router.push({path: 'add', query: {
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
        const arr = this.$refs['cascaderAddr'].getCheckedNodes()
       
        this.treeDes[3] = arr[0].label
        this.treeDes[2] = arr[0].parent.label
        this.treeDes[1] = arr[0].parent.parent.label
        this.treeDes[0] = arr[0].parent.parent.parent.label
        this.chooseId = val[3]
        this.next = true
      } else {
        this.chooseId = ''
        this.next = false
      }
    },
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
  .next-box{
    text-align: center;
    padding-top: 20px;
  }
</style>