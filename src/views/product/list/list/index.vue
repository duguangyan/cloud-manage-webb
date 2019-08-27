<template>
  <div class="app-container">
    <div class="filter-container mb20">
      商品ID/标题：
      <el-input v-model="listQuery.keywords"  placeholder="请输入商品ID/标题" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      品种：
      <el-input v-model="listQuery.categoryId"  placeholder="请输入品种" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetList">重置</el-button>
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
    <el-tabs v-model="saleType" @tab-click="handleClick">
      <el-tab-pane label="已上架" name="3"></el-tab-pane>
      <el-tab-pane label="待上架" name="1"></el-tab-pane>
      <el-tab-pane label="已下架" name="4"></el-tab-pane>
    </el-tabs>
    <el-button v-if="saleType === '1' || saleType === '4'" type="primary" size="small" v-waves class="filter-item mb10" @click="saleChange('mul', 0, '')">批量上架</el-button>
    <el-button v-if="saleType === '3'" size="small" v-waves class="filter-item mb10" @click="saleChange('mul', 1, '')">批量下架</el-button>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
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
        align="center"
        prop="id"
        label="商品ID"
        width="280">
      </el-table-column>
      <el-table-column
        align="center"
        label="图片"
        width="120">
        <template slot-scope="scope">
          <el-avatar shape="square" size="large" :src="scope.row.imgUri"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="name"
        label="标题"
        width="120">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="品种"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        sortable="minprice"
        label="单价"
        width="120">
        <template slot-scope="scope">{{ scope.row.minprice }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        sortable="spuSalesNum"
        label="销量"
        width="120">
        <template slot-scope="scope">{{ scope.row.spuSalesNum }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        sortable="hits"
        label="浏览量"
        width="120">
        <template slot-scope="scope">{{ scope.row.hits }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        sortable="totalStock"
        label="库存"
        width="120">
        <template slot-scope="scope">{{ scope.row.totalStock }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="sellTime"
        label="上架时间"
        width="120">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="msgEdit(scope)">编辑</el-button>
          <el-button v-if="saleType === '1' || saleType === '4'" type="primary" size="small" @click="saleChange('one', 0, scope)">上架</el-button>
          <el-button v-if="saleType === '3'" type="primary" size="small" @click="saleChange('one', 1, scope)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getPage" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getList, handlerGoods } from '@/api/goods/list'

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
        categoryId: '',
        keywords: '',
        page: 1,
        size: 20,
        sortColumn: 'min_price',
        sortType: 0,
        status: 3
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
      saleType: "3",
      tableData: [],
      multipleSelection: [],
      total: 0
    }
  },
  components: { Pagination },
  computed: {

  },
  created() {
    console.log('cretate')
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(res => {
        if(Array.isArray(res.data.records)) {
          this.listLoading = false
          this.total = res.data.total
          this.tableData = res.data.records
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    msgEdit(scope) {
      this.$router.push({path: 'list/add', params:{ id: 5}})
    },
    handleDelete({ $index, row }) {
      this.$confirm('确定要删除该角色?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.listLoading = true
        await deleteRole({id: row.id}).catch(err => {
          this.listLoading = false
        })
        this.listLoading = false
        this.rolesData.splice($index, 1)
        this.$message({
          type: '成功',
          message: '角色删除成功!'
        })
        if(this.rolesData.length === 0 && this.allPages - 1 > 0) {
          --this.listQuery.pageIndex
        }
        this.getRoleList()
      }).catch(err => { console.error(err) })
    },
    saleChange(isOne, type, scope) {
      // 上下架
      let msg = ''
      let succMsg = ''
      let ids = ''
      if(isOne === 'one') {
        ids = scope.row.id
        if(type === 0) {
          msg = '确定要上架该商品？'
          succMsg = '上架成功'
        } else if (type === 1) {
          msg ='确定要下架该商品？'
          succMsg = '下架成功'
        }
      } else {
        this.multipleSelection.forEach((item) => {
          ids += ids.length === 0? item.id: ',' +item.id
        })
        if(type === 0) {
          msg = '确定要批量上架这些商品？'
          succMsg = '批量上架成功'
        } else if (type === 1) {
          msg ='确定要批量下架这些商品？'
          succMsg = '批量下架成功'
        }
      }
      
      this.$confirm(msg, 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.listLoading = true
          handlerGoods({ 
            goodsId: ids,
            handlerType: type
          }).then(res => {
            this.listLoading = false
            this.$notify({
              title: succMsg,
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            this.getList()
          }).catch(err => {
            this.listLoading = false
          })
        })
    },
    handleFilter() {
      this.getList()
      // this.searchLoading = true
      // resourceSearch({
      //   name: this.listQuery.name,
      //   type: this.typeDataN[this.listQuery.type],
      //   status: this.statusDataN[this.listQuery.status]
      // }).then(res => {
      //   this.searchLoading = false
      //   this.meanData = []
      //   this.isLazy = false
      //   if(Array.isArray(res.data)) {
      //     this.searchData = this.filterData(res.data)
      //   }
      // }).catch(err => {
      //   this.searchLoading = false
      // })
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
    resetList() {
      this.listQuery = {
        categoryId: '',
        keywords: '',
        page: 1,
        size: 20,
        sortColumn: 'min_price',
        sortType: 0,
        status: 1
      }
      this.getList()
    },
    async handleAddResource() {
      this.role = Object.assign({}, defaultRole)
      this.role.operation = '--'
      this.dialogType = 'new'
      this.checkStrictly = true
      this.dialogVisible = true
    },
    handleClick(tab, event) {
      this.listQuery.status = tab.name
      this.getList()
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
    getPage(data) {
      分页事件
      this.listQuery.page = data.page
      this.getList()
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