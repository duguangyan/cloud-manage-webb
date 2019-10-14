<template>
  <div class="app-container">
    <div class="filter-container mb20">
      <template v-if="btnsPermission.search.auth">
        商品ID/标题：
        <el-input v-model="listQuery.keywords"  placeholder="请输入商品ID/标题,多个商品请用半角逗号隔开" style="width: 350px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
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
    </div>
    <el-button v-if="btnsPermission.add.auth" type="primary" size="small" :disabled="disable" v-waves class="filter-item mb10" @click="handleAdd(2)">批量{{btnsPermission.add.name}}</el-button>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      border
      :data="tableData"
      :row-class-name="tableRowClassName"
      :header-cell-style="{background: '#f3f3f3'}" 
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="mulSelect">
      <el-table-column
        type="selection"
        align="center"
        :selectable="selectAble"
        width="55">
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
        label="商品名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="品种"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="价格"
        width="120"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.minPrice}}</span>
          <span v-if="scope.row.maxPrice">~</span> 
          <span>{{scope.row.maxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="hits"
        label="浏览量"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-if="btnsPermission.add.auth" :disabled="scope.row.isSelect || disable" type="primary" size="small" @click="handleAdd(1, scope.row)">{{btnsPermission.add.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getPage" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getColumnGoodsList } from '@/api/goods/list'
import { getUserBtnByPId } from '@/api/upms/menu'
import { getProductTree } from '@/api/goods/product'
import { addManageDetail } from '@/api/act/manage'

export default {
  name: 'detailAdd',
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
        }
      },
      mulSelectData: [],
      disable: false,
      listQuery: {
        goodsListId: '',
        categoryId: '',
        keywords: '',
        pageIndex: 1,
        pageSize: 10
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
    if(this.$route.query.cId) {
      this.listQuery.goodsListId = this.$route.query.cId
    }
    this.getColumnGoodsList()
  },
  mounted() {
    getUserBtnByPId({ parentId: this.$route.meta.id }).then(res => {
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
    getColumnGoodsList() {
      // 获取商品列表
      this.listLoading = true
      this.disable = true
      getColumnGoodsList(this.listQuery).then(res => {
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
      if(scope.row.id.length > 0) {
        this.$router.push({path: 'list/add', query:{ 
          id: scope.row.categoryId,
          eid: scope.row.id
          }})
      }
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
    handleAdd(type, row) {
      // 上下架
      let msg = ''
      let succMsg = ''
      let ids = ''
      if(type === 1) {
        msg = '确定要' + this.btnsPermission.add.name + '该商品？'
        succMsg = this.btnsPermission.add.name + '成功'
        ids = row.id
      } else {
        if(this.mulSelectData.length === 0) {
           this.$message({
            message: '请先选中要' + this.btnsPermission.add.name + '的商品',
            type: 'warning'
          })
          return false
        }
        msg = '确定要批量' + this.btnsPermission.add.name + '该商品？'
        succMsg = '批量' + this.btnsPermission.add.name + '成功'
        this.mulSelectData.forEach(item => {
          ids += ids.length === 0 ? item.id : (',' + item.id)
        })
      }
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.disable = true
        addManageDetail({
          goodListId: this.listQuery.goodsListId,
          goodsIdList: ids
        }).then(res => {
          this.listLoading = false
          this.disable = false
          this.getColumnGoodsList()
          this.$notify({
            title: succMsg,
            dangerouslyUseHTMLString: true,
            type: 'success'
          })
        }).catch(err => {
          this.listLoading = false
          this.disable = false
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        });       
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
      this.getColumnGoodsList()
    },
    resetList() {
      // 重置
      this.listQuery = {
        categoryId: '',
        keywords: '',
        pageIndex: 1,
        pageSize: 10
      }
      this.treeValue = ''
      this.getColumnGoodsList()
    },
    mulSelect(val) {
      // 列表商品多选
      this.mulSelectData = val;
    },
    getPage(data) {
     // 分页事件
      this.listQuery.pageIndex = data.page
      this.getColumnGoodsList()
    },
    // sortChange(data) {
    //   // 排序
    //   if(data.prop === 'minPrice') {
    //     this.listQuery.sortColumn = 'price'
    //   } else if(data.prop === 'hits') {
    //     this.listQuery.sortColumn = 'hits'
    //   }
    //   this.listQuery.pageIndex = 1
    //   this.listQuery.sortType = data.order === 'descending' ? 0 : 1
    //   this.getColumnGoodsList()
    // },
    selectAble(row, index) {
      // 是否可选
      return !row.isSelect
    },
    tableRowClassName({row, rowIndex}) {
      // 不可选行置灰
      if(row.isSelect) {
        return 'cancle-row'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
<style>
  .cancle-row{
    background: #eee!important;
  }
</style>