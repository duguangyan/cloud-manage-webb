<template>
  <div class="app-container">
    <div class="filter-container mb20">
      <template v-if="btnsPermission.search.auth">
        商品ID/标题：
        <el-input v-model="listQuery.keywords"  placeholder="请输入商品ID/标题" style="width: 200px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
        品种：
        <el-cascader
          v-model="treeValue"
          :options="treeOptions"
          :props="treeProps"
          placeholder="请选择品种"
          style="width: 200px;" 
          class="filter-item mr20"
          @change="selectChange"
          @focus="focus"
          @keyup.enter.native="handleFilter">
        </el-cascader>
        <el-button v-waves class="filter-item" type="primary" :disabled="disable" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
        <el-button v-waves class="filter-item" @click="resetList">重置</el-button>
      </template>
      <el-button v-if="btnsPermission.add.auth"  @click="jump" v-waves class="filter-item add-btn">{{btnsPermission.add.name}}</el-button>
    </div>
    <div v-if="btnsPermission.search.auth" class="mb20">
      <template v-if="saleType === '3'">
        上架时间：
      </template>
      <template v-if="saleType === '1'">
        创建时间
      </template>
      <template v-if="saleType === '4'">
        下架时间：
      </template>
      
      <el-date-picker
        v-model="dateValue"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        value-format="yyyy-MM-dd hh:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="dateChange"
        align="right">
      </el-date-picker>
    </div>
    <el-tabs v-model="saleType" @tab-click="handleClick">
      <el-tab-pane label="已上架" name="3"></el-tab-pane>
      <el-tab-pane label="待上架" name="1"></el-tab-pane>
      <el-tab-pane label="已下架" name="4"></el-tab-pane>
    </el-tabs>
    <el-button v-if="btnsPermission.onSale.auth && (saleType === '1' || saleType === '4')" type="primary" size="small" v-waves class="filter-item mb10" @click="saleChange('mul', 0, '')">批量{{btnsPermission.onSale.name}}</el-button>
    <el-button v-if="btnsPermission.offSale.auth && saleType === '3'" size="small" v-waves class="filter-item mb10" @click="saleChange('mul', 1, '')">批量{{btnsPermission.offSale.name}}</el-button>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      border
      @sort-change="sortChange"
      :data="tableData"
      :header-cell-style="{background: '#f3f3f3'}" 
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        align="center"
        prop="id"
        label="商品ID"
        width="280"
        show-overflow-tooltip>
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
        prop="name"
        label="标题"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="品种"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        sortable="custom"
        label="单价"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.minprice}}</span>
          <span v-if="scope.row.maxprice !==null">~</span> 
          <span>{{scope.row.maxprice}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        sortable="custom"
        prop="spuSalesNum"
        label="销量"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        sortable="custom"
        prop="hits"
        label="浏览量"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        sortable="custom"
        prop="totalStock"
        label="库存"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="saleType === '3'"
        align="center"
        prop="sellTime"
        label="上架时间"
        width="160">
      </el-table-column>
      <el-table-column
        v-if="saleType === '1'"
        align="center"
        prop="createTime"
        label="创建时间"
        width="160">
      </el-table-column>
      <el-table-column
        v-if="saleType === '4'"
        align="center"
        prop="downTime"
        label="下架时间"
        width="160">
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-if="btnsPermission.edit.auth && (saleType === '1' || saleType === '4')" type="primary" size="small" @click="msgEdit(scope)">{{btnsPermission.edit.name}}</el-button>
          <el-button v-if="btnsPermission.onSale.auth && (saleType === '1' || saleType === '4')" type="primary" size="small" @click="saleChange('one', 0, scope)">{{btnsPermission.onSale.name}}</el-button>
          <el-button v-if="btnsPermission.offSale.auth && saleType === '3'" type="primary" size="small" @click="saleChange('one', 1, scope)">{{btnsPermission.offSale.name}}</el-button>
          <el-button v-if="btnsPermission.detail.auth" type="primary" size="small" @click="getDetail(scope)">{{btnsPermission.detail.name}}</el-button>
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
import { getUserBtnByPId } from '@/api/upms/menu'
import { getProductTree } from '@/api/goods/product'


export default {
  name: 'list',
  directives: { waves },
  data() {
    return {
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        add: {
          name: '添加',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        },
        onSale: {
          name: '上架',
          auth: false
        },
        offSale: {
          name: '下架',
          auth: false
        },
        detail: {
          name: '查看',
          auth: false
        }
      },
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
    if(this.$route.query.status) {
      this.saleType = this.$route.query.status
      this.listQuery.status = this.$route.query.status
    }
    this.getList()
  },
  mounted() {
    this.pageId = this.$route.meta.id
    getUserBtnByPId({ parentId: this.pageId }).then(res => {
      if(Array.isArray(res.data)) {
        res.data.map((val) => {
          if(this.btnsPermission.hasOwnProperty(val.code) && val.status === 1 && val.checked === 1) {
            this.btnsPermission[val.code].auth = true
            this.btnsPermission[val.code].name = val.name
          }
        })
      }
    })
  },
  methods: {
    jump() {
      // 新增商品
      this.$router.push({path: 'list/release'})
    },
    getList() {
      // 获取商品列表
      this.listLoading = true
      this.disable = true
      getList(this.listQuery).then(res => {
        if(Array.isArray(res.data.records)) {
          this.listLoading = false
          this.disable = false
          this.total = res.data.total
          this.tableData = res.data.records
        }
      }).catch(err => {
        this.listLoading = false
        this.disable = false
      })
    },
    msgEdit(scope) {
      // 编辑商品
      this.$router.push({path: 'list/edit', query:{ 
        id: scope.row.categoryId,
        eid: scope.row.id
      }})
    },
    selectChange(val) {
      // 品种选择
      this.listQuery.categoryId = val.length === 4 ? val[3] : ''
    },
    focus(val) {
      // 获取品种树
      if(this.treeOptions.length === 0) {
        this.getProductTree()
      }
    },
    getProductTree() {
      // 品种树接口
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
      
      this.$confirm(msg, '提示', {
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
    dateChange(data) {
      // 日期选择
      if(this.saleType === '3') {
        this.listQuery.sellTimeStart = data[0]
        this.listQuery.sellTimeEnd = data[1]
      } else if(this.saleType === '1') {
        this.listQuery.createTimeStart = data[0]
        this.listQuery.createTimeEnd = data[1]
      } else if(this.saleType === '4') {
        this.listQuery.downTimeStart = data[0]
        this.listQuery.downTimeEnd = data[1]
      }
    },
    handleFilter() {
      // 搜索
      this.getList()
    },
    resetList() {
      // 重置
      this.listQuery = {
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
      }
      this.dateValue = ''
      this.treeValue = ''
      this.saleType = '3'
      this.getList()
    },
    handleClick(tab, event) {
      // 已上架、待上架、已下架切换
      this.listQuery.pageIndex = 1
      this.listQuery.status = tab.name
      if(tab.name === '3') {
        this.listQuery.sortColumn = 'sell_time'
      } else if (tab.name === '1') {
        this.listQuery.sortColumn = 'create_time'
      } else if(tab.name === '4') {
        this.listQuery.sortColumn = 'create_time'
      }
      this.listQuery.sortType = 0
      this.listQuery.sellTimeStart = ''
      this.listQuery.sellTimeEnd = ''
      this.listQuery.createTimeStart = ''
      this.listQuery.createTimeEnd = ''
      this.listQuery.downTimeStart = ''
      this.listQuery.downTimeEnd = ''
      this.dateValue = ''
      this.getList()
    },
    handleSelectionChange(val) {
      // 列表商品多选
      this.multipleSelection = val;
    },
    getPage(data) {
     // 分页事件
      this.listQuery.pageIndex = data.page
      this.getList()
    },
    sortChange(data) {
      // 排序
      if(data.prop === 'minprice') {
        this.listQuery.sortColumn = 'min_price'
      } else if(data.prop === 'spuSalesNum') {
        this.listQuery.sortColumn = 'spu_sales_num'
      } else if(data.prop === 'hits') {
        this.listQuery.sortColumn = 'hits'
      } else if(data.prop === 'totalStock') {
        this.listQuery.sortColumn = 'total_stock'
      }
      this.listQuery.pageIndex = 1
      if(data.order === 'descending') {
        this.listQuery.sortType = 0
      } else if(data.order === 'ascending') {
        this.listQuery.sortType = 1
      } else {
        if(this.saleType === '3') {
          this.listQuery.sortColumn = 'sell_time'
        } else if(this.saleType === '1') {
          this.listQuery.sortColumn = 'create_time'
        } else if(this.saleType === '4') {
          this.listQuery.sortColumn = 'sell_time'
        }
        this.listQuery.sortType = 0
      }
      this.getList()
    },
    getDetail(scope) {
      // 查看商品详情
      this.$router.push({path: 'list/detail', query:{ 
        id: scope.row.categoryId,
        eid: scope.row.id,
        pageId: this.pageId
      }})
    }
  }
}
</script>

<style lang="scss" scoped>
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