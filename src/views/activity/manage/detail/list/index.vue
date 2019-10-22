<template>
  <div class="app-container">
    <div class="filter-container mb20">
      <el-button v-if="btnsPermission.remove.auth" v-waves :disabled="disable" @click="handleRemove(2)">批量{{btnsPermission.remove.name}}</el-button>
      <el-button v-if="btnsPermission.add.auth" v-waves type="primary" @click="add">{{btnsPermission.add.name}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="detailData"
      @selection-change="mulSelect"
      :header-cell-style="{background: '#f3f3f3'}" 
      border
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
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="操作">
        <div class="more-btn" slot-scope="scope">
          <el-button v-if="btnsPermission.remove.auth" :disabled="disable" type="primary" size="small" @click="handleRemove(1, scope.row)">{{btnsPermission.remove.name}}</el-button>
        </div>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getPage" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getManageDetailList, addManageDetail, updateManageDetail, deleteManageDetail } from '@/api/act/manage'
import { getUserBtnByPId } from '@/api/upms/menu'
import Pagination from '@/components/Pagination'

export default {
  name: 'activityManageDetailList',
  directives: { waves },
  data() {
    return {
      detailData: [],
      disable: false,
      listQuery: {
        goodListId: '',
        pageIndex: 1,
        pageSize: 10
      },
      total: 0,
      allPages: 0,
      mulSelectData: [],
      btnsPermission: {
        remove: {
          auth: false,
          name: '移除'
        },
        add: {
          auth: false,
          name: '添加商品'
        }
      },
      listLoading: false
    }
  },
  components: { Pagination },
  created() {
    this.listQuery.goodListId = this.$route.query.id
    this.getManageDetailList()
  },
  mounted() {
    getUserBtnByPId({ parentId: this.$route.meta.id }).then(res => {
      if(Array.isArray(res.data)) {
        res.data.map((val) => {
          if(this.btnsPermission.hasOwnProperty(val.code)) {
            this.btnsPermission[val.code].auth = val.checked === 1
            this.btnsPermission[val.code].name = val.name
          }
        })
      }
    })
  },
  methods: {
    getManageDetailList() {
      // 获取商品列表
      this.listLoading = true
      getManageDetailList(this.listQuery).then(res => {
        this.total = res.data.total
        this.allPages = res.data.pages
        if(Array.isArray(res.data.records)) {
          this.listLoading = false
          this.detailData = res.data.records
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleRemove(type, row) {
      // 移除与批量移除
      let noticeMsg = ''
      let succMsg = ''
      let ids = ''
      if(type === 1) {
        noticeMsg = '确认要'+ this.btnsPermission.remove.name +'该商品？'
        succMsg = this.btnsPermission.remove.name + '成功'
        ids = row.id
      } else {
        if(this.mulSelectData.length === 0) {
           this.$message({
            message: '请先选中要' + this.btnsPermission.remove.name + '的商品',
            type: 'warning'
          })
          return false
        }
        noticeMsg = '确认要批量'+ this.btnsPermission.remove.name +'该商品？'
        succMsg = '批量' + this.btnsPermission.remove.name + '成功'
        this.mulSelectData.forEach(item => {
          ids += ids.length === 0 ? item.id : (',' + item.id)
        })
      }
      this.$confirm(noticeMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        this.disable = true
        deleteManageDetail({
          goodListId: this.listQuery.goodListId,
          goodsIdList: ids
        }).then(res => {
          this.listLoading = false
          this.disable = false
          if(this.detailData.length === 1 && this.allPages  > 1) {
            --this.listQuery.pageIndex
          }
          this.getManageDetailList()
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
    mulSelect(val) {
      this.mulSelectData = val
    },
    getPage(data) {
     // 分页事件
      this.listQuery.pageIndex = data.page
      this.getManageDetailList()
    },
    add() {
      // 添加商品
      this.$router.push({
        path: '/activity/manage/detail/add',
        query: {
          cId: this.listQuery.goodListId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .mb20{
    margin-bottom: 20px;
  }
</style>