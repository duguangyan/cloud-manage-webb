<template>
  <div class="app-container">
    list a
    <!-- <div class="filter-container mb20">
      <el-button v-if="btnsPermission.remove.auth" v-waves :disabled="disable">批量{{btnsPermission.remove.name}}</el-button>
      <el-button v-if="btnsPermission.add.auth" v-waves type="primary">{{btnsPermission.add.name}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="detailData"
      :header-cell-style="{background: '#f3f3f3'}" 
      border
      @sort-change="sortChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        align="center"
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
        align="center"
        label="商品名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="categoryName"
        align="center"
        label="品种">
      </el-table-column>
      <el-table-column
        align="center"
        label="价格">
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
        sortable="custom"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <div class="more-btn" slot-scope="scope">
          <el-button v-if="btnsPermission.remove.auth" type="primary" size="small" @click="manage(scope.row)">{{btnsPermission.remove.name}}</el-button>
        </div>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getManageDetailList, addManageDetail, updateManageDetail } from '@/api/act/manage'

export default {
  name: 'manageDetail',
  directives: { waves },
  data() {
    return {
      detailData: [],
      listQuery: {
        goodListId: ''
      },
      btnsPermission: {
        remove: {
          auth: true,
          name: '移除'
        },
        add: {
          auth: true,
          name: '添加商品'
        }
      },
      listLoading: false
    }
  },
  created() {
    // this.listQuery.goodListId = this.$route.query.id
    // this.getManageDetailList()
  },
  methods: {
    getManageDetailList() {
      // 获取商品列表
      this.listLoading = true
      getManageDetailList(this.listQuery).then(res => {
        if(Array.isArray(res.data)) {
          this.listLoading = false
          this.detailData = res.data
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    manage(row) {
      this.$router.push({
        path: '/activity/manage/detail',
        query: { id: row.id }
      })
    },
    getPage(data) {
     // 分页事件
      this.listQuery.pageIndex = data.page
      this.getList()
    },
    sortChange(data) {
      // 排序
      console.log(data)
      // this.listQuery.sortColumn = data.prop
      // this.listQuery.pageIndex = 1
      // this.listQuery.sortType = data.order === 'descending' ? 0 : 1
      // this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .mb20{
    margin-bottom: 20px;
  }
</style>