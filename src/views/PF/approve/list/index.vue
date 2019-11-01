<template>
  <div class="app-container">
    <template v-if="btnsPermission.search.auth">
      <div class="mb20 top-width">
        姓名：
        <el-input v-model="list.realName"  placeholder="请输入姓名" style="width: 200px;" class="filter-item mr20" @keyup.enter.native="handleFilter" />
        经营类目：
        <el-cascader
          v-model="list.categoryIdBox"
          :options="treeOptions"
          :props="treeProps"
          placeholder="请选择经营类目"
          style="width: 200px;" 
          class="filter-item mr20"
          @focus="focus"
          @keyup.enter.native="handleFilter">
        </el-cascader>
        审核状态：
        <el-select v-model="list.status" class="mr10" placeholder="请选择审核状态">
          <el-option
            v-for="item in statusData"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div v-if="btnsPermission.search.auth" class="mb20 top-width">
        经营地：
        <el-cascader
          ref="address"
          v-model="list.address"
          label="id"
          placeholder="请选择经营地"
          :props="addressOptions"
          style="width: 200px;"
          class="filter-item mr20"
          @keyup.enter.native="handleFilter">
        </el-cascader>
        <template>
          提交时间：
        </template>
        <el-date-picker
          v-model="list.dateValue"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right">
        </el-date-picker>
      </div>
      <div class="tc mb20">
        <el-button v-waves class="filter-item" type="primary" :disabled="disable" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
        <el-button v-waves class="filter-item" @click="resetList">重置</el-button>
      </div>
    </template>
    <el-tabs v-model="list.type" @tab-click="handleClick">
      <el-tab-pane label="货主" name="1"></el-tab-pane>
      <el-tab-pane label="代办" name="2"></el-tab-pane>
    </el-tabs>
    <div class="mb20">
      <el-radio-group v-model="list.tabStatus" @change="statusChange">
        <el-radio-button :label="0">待审核</el-radio-button>
        <el-radio-button :label="1">已通过</el-radio-button>
        <el-radio-button :label="2">未通过</el-radio-button>
      </el-radio-group>
    </div>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      border
      :data="tableData"
      :header-cell-style="{background: '#f3f3f3'}" 
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        align="center"
        prop="realName"
        label="货主姓名"
        width="120">
      </el-table-column>
      <el-table-column
        align="center"
        prop="phone"
        label="手机号码"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="categoryName"
        label="经营类目"
        width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        prop="area"
        label="经营地"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        align="center"
        label="审核状态"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">待审核</span>
          <span v-else-if="scope.row.status === 1">已通过</span>
          <span v-else-if="scope.row.status === 2">未通过</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="creatTime"
        label="提交时间"
        width="160"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-if="btnsPermission.check.auth && scope.row.status === 0" type="primary" size="small" @click="approveCheck(scope.row)">{{btnsPermission.check.name}}</el-button>
          <el-button v-else-if="btnsPermission.detail.auth" type="primary" size="small" @click="approveCheck(scope.row)">{{btnsPermission.detail.name}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="list.pageIndex" :limit.sync="list.pageSize"  @pagination="getPage" />
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getApproveList } from '@/api/PF/apply/apply'
import { getUserBtnByPId } from '@/api/upms/menu'
import { getProductTree } from '@/api/goods/product'
import { getAd } from '@/api/upms/strict'


export default {
  name: 'PFapprove',
  directives: { waves },
  data() {
    return {
      radio1: '1',
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        check: {
          name: '审核',
          auth: false
        },
        detail: {
          name: '查看',
          auth: false
        }
      },
      statusData: [
        {
          value: 0,
          label: '待审核'
        },
        {
          value: 1,
          label: '已通过'
        },
        {
          value: 2,
          label: '未通过'
        }
      ],
      disable: false,
      pageId: '',
      list: {
        categoryIdBox: null,
        pageIndex: 1,
        pageSize: 10,
        realName: '',
        status: 0,
        tabStatus: 0,
        type: '1',
        address: null,
        dateValue: null
      },
      treeOptions: [],
      treeProps: {
        label: 'name',
        value: 'id'
      },
      addressOptions: {
        lazy: true,
        lazyLoad (node, resolve) {
          getAd({ parentId: node.level === 0 ? 0 : node.data.id }).then( res => {
            if(Array.isArray(res.data)) {
              res.data.map((lazyItem) => {
                lazyItem.leaf = lazyItem.haveChild === 0 || node.level === 2
              })
              resolve(res.data);
            }
          })
        },
        value: "id",
        label: "shortName",
      },
      addressData: [],
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
      tableData: [],
      multipleSelection: [],
      total: 0
    }
  },
  components: { Pagination },
  created() {
    // if(this.$route.query.status) {
    //   this.saleType = this.$route.query.status
    //   this.listQuery.status = this.$route.query.status
    // }
    this.getApproveList()
  },
  mounted() {
    // 设置下拉按钮样式
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
      this.$router.push({path: '/product/list/release'})
    },
    getApproveList() {
      // 获取入驻列表
      let param = {
        pageIndex: this.list.pageIndex,
        pageSize: this.list.pageSize,
        status: this.list.status,
        type: this.list.type
      }
      if(this.list.realName.length > 0) {
        param.realName = this.list.realName
      }
      if(Array.isArray(this.list.categoryIdBox)) {
        if(this.list.categoryIdBox.length > 3) {
          param.categoryId = this.list.categoryIdBox[3]
        } else {
          this.$message({
            type: 'warning',
            message: '经营类目请选择到四级进行查询!'
          })
          return false
        }
      }
      if(Array.isArray(this.list.dateValue) && this.list.dateValue.length > 1) {
        param.beginTime = this.list.dateValue[0]
        param.endTime = this.list.dateValue[1]
      }
      if(Array.isArray(this.list.address)) {
        if(this.list.address.length > 2) {
          param.provinceId = this.list.address[0]
          param.cityId = this.list.address[1]
          param.regionId = this.list.address[2]
        }
      }
      this.listLoading = true
      this.disable = true
      getApproveList(param).then(res => {
        this.listLoading = false
        this.disable = false
        this.total = res.data.total
        if(Array.isArray(res.data.records)) {
          this.tableData = res.data.records
        }
      }).catch(err => {
        this.listLoading = false
        this.disable = false
      })
    },
    approveCheck(row) {
      // 审核、查看跳转详情页面
      this.$router.push({path: '/PF/approve/detail', query:{ 
        cid: row.categoryId,
        id: row.id
      }})
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
    handleFilter() {
      // 搜索
      this.list.tabStatus = this.list.status
      this.getApproveList()
    },
    resetList() {
      // 重置
      this.list = {
        categoryIdBox: null,
        pageIndex: 1,
        pageSize: 10,
        realName: '',
        status: 0,
        searchStatus: 0,
        type: '1',
        address: null,
        dateValue: null
      }
      this.getApproveList()
    },
    handleClick(tab, event) {
      // 货主、代办切换
      this.list.pageIndex = 1
      this.list = {
        categoryIdBox: null,
        pageIndex: 1,
        pageSize: 10,
        realName: '',
        type: tab.name,
        status: 0,
        tabStatus: 0,
        address: null,
        dateValue: null
      }
      this.getApproveList()
    },
    statusChange(val) {
      //  审核状态切换
      this.list.pageIndex = 1
      this.list.status = this.list.tabStatus
      this.getApproveList()
    },
    getPage(data) {
     // 分页事件
      this.list.pageIndex = data.page
      this.getApproveList()
    },
    getDetail(scope) {
      // 查看商品详情
      this.$router.push({path: '/PF/approve/detail', query:{ 
        id: scope.row.categoryId,
        eid: scope.row.id,
        pageId: this.pageId
      }})
    }
  }
}
</script>

<style lang="scss" scoped>
  .tc{
    text-align: center;
  }
  .top-width{
    min-width: 900px;
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