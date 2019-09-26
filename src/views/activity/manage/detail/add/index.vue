<template>
  <div class="app-container">
    add
    <!-- <el-table
      v-loading="listLoading"
      :data="manageData"
      :header-cell-style="{background: '#f3f3f3'}" 
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        align="center"
        label="栏目名称"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="num"
        align="center"
        label="商品数量">
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        min-width="160"
        label="最近更新时间">
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <div class="more-btn" slot-scope="scope">
          <el-button v-if="btnsPermission.manage.auth" type="primary" size="small" @click="manage(scope.row)">{{btnsPermission.manage.name}}</el-button>
        </div>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getManageList } from '@/api/act/manage'

export default {
  name: 'manageList',
  directives: { waves },
  data() {
    return {
      manageData: [],
      listQuery: {},
      btnsPermission: {
        manage: {
          auth: true,
          name: '添加商品'
        }
      },
      listLoading: false
    }
  },
  created() {
    // this.getManageList()
  },
  methods: {
    getManageList() {
      // 获取商品列表
      this.listLoading = true
      getManageList(this.listQuery).then(res => {
        if(Array.isArray(res.data)) {
          this.listLoading = false
          this.manageData = res.data
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