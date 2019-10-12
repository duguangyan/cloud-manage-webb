<template>
  <div class="app-container">
     <div class="mb20">
      <el-radio-group v-model="radio1">
        <el-radio-button label="昨日"></el-radio-button>
        <el-radio-button label="七日"></el-radio-button>
        <el-radio-button label="30日"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="mb20">
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="禁用" disabled></el-checkbox>
        <el-checkbox label="选中且禁用" disabled></el-checkbox>
      </el-checkbox-group>
    </div>
    <el-table
      border
      :data="tableData"
      :header-cell-style="{background: '#f3f3f3'}">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="list.pageIndex" :limit.sync="list.pageSize"  @pagination="getPage" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'Analyze',
  data() {
    return {
      checkList: ['选中且禁用','复选框 A'],
      radio1: '',
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }],
      list: {
     
        pageIndex: 1,
        pageSize: 10
      },
      total: 10
    }
  },
  components: { Pagination },
  computed: {

  },
  created() {

  },
  methods: {
    getPage(data) {
     // 分页事件
      this.listQuery.pageIndex = data.page
      this.getList()
    },
  }
}
</script>

<style lang="scss" scoped>
  .mr10{
    margin-right: 10px;
  }
  .mb20{
    margin-bottom: 20px;
  }
</style>
