<template>
  <div class="app-container">
     <div class="mb20">
      <el-radio-group v-model="dateValue" @change="radioChange">
        <el-radio-button label="1">昨日</el-radio-button>
        <el-radio-button label="7">七日</el-radio-button>
        <el-radio-button label="30">30日</el-radio-button>
      </el-radio-group>
    </div>
    <div class="mb20">
      <el-checkbox-group v-model="checkList">
        <!-- <el-checkbox label="statDate" disabled @change="(val) => checkChange(val, 'statDate')">停留时长</el-checkbox> -->
        <el-checkbox label="pv" @change="(val) => checkChange(val, 'pv')">浏览次数</el-checkbox>
        <el-checkbox label="uv" @change="(val) => checkChange(val, 'uv')">访客</el-checkbox>
        <el-checkbox label="starNum" @change="(val) => checkChange(val, 'starNum')">收藏人数</el-checkbox>
        <el-checkbox label="payPersonNum" @change="(val) => checkChange(val, 'payPersonNum')">支付人数</el-checkbox>
         <el-checkbox label="rebuyPersonNum" @change="(val) => checkChange(val, 'rebuyPersonNum')">复购人数</el-checkbox>
        <el-checkbox label="payNum" @change="(val) => checkChange(val, 'payNum')">支付笔数</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-table
      v-loading="listLoading"
      border
      @sort-change="sortChange"
      :data="tableData"
      :header-cell-style="{background: '#f3f3f3'}">
      <el-table-column
        prop="goodsName"
        label="商品信息">
      </el-table-column>
      <!-- <el-table-column
        v-if="showObj.statDate"
        prop="statDate"
        label="停留时长"
        align="center"
        width="180"
        show-overflow-tooltip>
      </el-table-column> -->
      <el-table-column
        v-if="showObj.pv"
        prop="pv"
        label="浏览次数"
        sortable="custom"
        align="center"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="showObj.uv"
        prop="uv"
        label="访客"
        sortable="custom"
        align="center"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="showObj.starNum"
        prop="starNum"
        align="center"
        label="收藏人数"
        sortable="custom"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="showObj.payPersonNum"
        prop="payPersonNum"
        label="支付人数"
        sortable="custom"
        align="center"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="showObj.rebuyPersonNum"
        prop="rebuyPersonNum"
        label="复购人数"
        sortable="custom"
        align="center"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        v-if="showObj.payNum"
        prop="payNum"
        label="支付笔数"
        sortable="custom"
        align="center"
        width="180"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="query.pageIndex" :limit.sync="query.pageSize"  @pagination="getPage" />
  </div>
</template>

<script>
import { getAnalyseList } from '@/api/analyse/analyse'
import Pagination from '@/components/Pagination'

export default {
  name: 'statAnalyze',
  data() {
    return {
      checkList: ['pv', 'uv', 'starNum', 'rebuyPersonNum', 'payPersonNum', 'payNum'],
      showObj: {
        'pv': true,
        'uv': true,
        'starNum': true,
        'payPersonNum': true,
        'rebuyPersonNum': true,
        'payNum': true
      },
      dateValue: 30,
      listLoading: false,
      query: {
        beginTime: '',
        endTime: '',
        orderBy: '',
        colName: '',
        pageIndex: 1,
        pageSize: 10
      },
      tableData: [],
      total: 0
    }
  },
  components: { Pagination },
  created() {
    this.setDateFun(30)
    this.getAnalyseList()
  },
  methods: {
    getAnalyseList() {
      this.listLoading = true
      let param = {
        beginTime: this.query.beginTime,
        endTime: this.query.endTime,
        pageIndex: this.query.pageIndex,
        pageSize: this.query.pageSize
      }
      if(this.query.orderBy.length > 0) {
        param.colName = this.query.colName
        param.orderBy = this.query.orderBy
      }
      getAnalyseList(param).then(res => {
        this.listLoading = false
        this.total = res.data.total
        if(Array.isArray(res.data.records)) {
          this.tableData = res.data.records
        }
      })
    },
    setDateFun(day) {
      let date = new Date()
      date.setDate(date.getDate() - 1)
      let endY = date.getFullYear()
      let endM = date.getMonth() + 1
      let endD = date.getDate()
      date.setDate(endD - day)
      let beginY = date.getFullYear()
      let beginM = date.getMonth() + 1
      let beginD = date.getDate()
      this.query.beginTime = beginY + '-' + beginM + '-' + beginD
      this.query.endTime = endY + '-' + endM + '-' + endD
    },
    getPage(data) {
     // 分页事件
      this.query.pageIndex = data.page
      this.getAnalyseList()
    },
    checkChange(val, name) {
      // 显示选择
      this.showObj[name] = val
    },
    radioChange(val) {
      // 日期选择
      this.query.pageIndex = 1
      this.setDateFun(val)
      this.getAnalyseList()
    },
    sortChange(data) {
      // 排序
      if(data.order === 'descending') {
        this.query.orderBy = 'desc'
      } else if(data.order === 'ascending') {
        this.query.orderBy = 'asc'
      } else {
        this.query.orderBy = ''
      }
      this.query.colName = data.prop
      if(data.prop === 'starNum') {
        this.query.colName = 'star_num'
      } else if(data.prop === 'payPersonNum') {
        this.query.colName = 'pay_person_num'
      } else if(data.prop === 'rebuyPersonNum') {
        this.query.colName = 'rebuy_person_num'
      } else if(data.prop === 'payNum') {
        this.query.colName = 'pay_num'
      } else {
        this.query.colName = data.prop
      }
      this.getAnalyseList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .mb20{
    margin-bottom: 20px;
  }
</style>
