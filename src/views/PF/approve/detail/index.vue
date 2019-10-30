<template>
  <div class="app-container">
    审核详情页面

  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getList, handlerGoods } from '@/api/goods/list'
import { getUserBtnByPId } from '@/api/upms/menu'
import { getProductTree } from '@/api/goods/product'


export default {
  name: 'PFapproveDetail',
  directives: { waves },
  data() {
    return {
      btnsPermission: {
        search: {
          name: '搜索',
          auth: true
        },
        add: {
          name: '添加',
          auth: true
        },
        edit: {
          name: '编辑',
          auth: true
        },
        onSale: {
          name: '上架',
          auth: true
        },
        offSale: {
          name: '下架',
          auth: true
        },
        detail: {
          name: '查看',
          auth: true
        }
      },
      filtersStatus: [
        {
          text: '待审核',
          value: 1
        },{
          text: '未审核',
          value: 2
        }
      ],
      statusData: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '待审核'
        },
        {
          value: 2,
          label: '未通过'
        },
        {
          value: 3,
          label: '已入驻'
        }
      ],
      disable: false,
      pageId: '',
      listQuery: {
        createTimeStart: '',
        createTimeEnd: '',
        downTimeStart: '',
        downTimeEnd: '',
        sellTimeStart: '',
        sellTimeEnd: '',
        categoryId: '',
        keywords: '',
        pageIndex: 1,
        pageSize: 10,
        sortColumn: 'sell_time',
        sortType: 0,
        status: 3
      },
      treeOptions: [],
      treeProps: {
        label: 'name',
        value: 'id'
      },
      treeValue: '',
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
      dateValue: '',
      saleType: "3",
      tableData: [],
      multipleSelection: [],
      total: 0
    }
  },
  components: { Pagination },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .tc{
    text-align: center;
  }
  .add-btn{
    color: #ff9933;
    border-color: #ff9933;
    &:hover{
      color: #fff;
      background-color: #ff9933;
    }
  }
  .mb10{
    margin-bottom: 10px;
  }
  .mr20{
    margin-right: 20px;
  }
  .mb20{
    margin-bottom: 20px;
  }
</style>
<style lang="scss">
  .el-date-editor .el-range-separator{
    width: auto;
  }
</style>