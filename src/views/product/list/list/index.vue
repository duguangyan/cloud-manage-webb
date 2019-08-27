<template>
  <div class="app-container">
    <div class="filter-container mb20">
      商品ID/标题：
      <el-input v-model="listQuery.name"  placeholder="请输入商品ID/标题" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      品种：
      <el-input v-model="listQuery.name"  placeholder="请输入品种" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetResource">重置</el-button>
      <router-link :to="{ path: 'list/release'}">
        <el-button v-if="btnsPermission.add.auth" v-waves class="filter-item">{{btnsPermission.add.name}}</el-button>
      </router-link>
    </div>
    <div class="mb20">
      上架时间：
      <el-date-picker
        v-model="value2"
        type="daterange"
        align="right"
        size="small"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已上架" name="first"></el-tab-pane>
      <el-tab-pane label="待上架" name="second"></el-tab-pane>
      <el-tab-pane label="已下架" name="third"></el-tab-pane>
    </el-tabs>
    <el-button size="small" v-waves class="filter-item mb10" @click="resetResource">批量下架</el-button>
    <el-table
      ref="multipleTable"
      @sort-change="sortChange"
      :data="tableData"
      :header-cell-style="{background: '#f3f3f3'}" 
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        sortable="custom"
        label="日期"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'

export default {
  name: 'list',
  directives: { waves },
  data() {
    return {
      btnsPermission: {
        search: {
          name: '搜索',
          auth: true
        },
        add: {
          name: '新增商品',
          auth: true
        }
      },
      listQuery: {
        name: '',
        status: '',
        type: '',
        pageIndex: 1,
        pageSize: 10
      },
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
      value2: '',
      activeName: 'second',
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: [],
      total: 50
    }
  },
  components: { Pagination },
  computed: {

  },
  created() {

  },
  methods: {
    handleFilter() {
      this.searchLoading = true
      resourceSearch({
        name: this.listQuery.name,
        type: this.typeDataN[this.listQuery.type],
        status: this.statusDataN[this.listQuery.status]
      }).then(res => {
        this.searchLoading = false
        this.meanData = []
        this.isLazy = false
        if(Array.isArray(res.data)) {
          this.searchData = this.filterData(res.data)
        }
      }).catch(err => {
        this.searchLoading = false
      })
    },
    resetResource() {
      // 重置事件
      this.isLazy = true
      this.listQuery = {
        name: ''
      }
      this.searchData = []
      this.getMeanFirstRec()
    },
    async handleAddResource() {
      this.role = Object.assign({}, defaultRole)
      this.role.operation = '--'
      this.dialogType = 'new'
      this.checkStrictly = true
      this.dialogVisible = true
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getList(data) {
      // 分页事件
      this.listQuery.pageIndex = data.page
      this.fetchData()
    },
    sortChange(column, prop, order) {
      console.log('column')
      console.log(column)
      console.log('prop')
      console.log(prop)
      console.log('order')
      console.log(order)  
    }
  }
}
</script>

<style lang="scss" scoped>
  .mb10{
    margin-bottom: 10px;
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