<template>
  <div class="app-container">
    <div class="filter-container" style="padding-bottom: 10px">
      系统名：<el-input v-if="btnsPermission.search.auth" v-model="listQuery.name" maxlength="64" placeholder="请输入系统名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{btnsPermission.search.name}}
      </el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetSearch">重置</el-button>
      <el-button v-if="btnsPermission.add.auth" class="filter-item" style="margin-left: 10px;" @click="handleCreate">
        {{btnsPermission.add.name}}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      :header-cell-style="{background: '#f3f3f3'}" 
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="300">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="系统名"  width="300">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="备注" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="修改时间" width="200" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.modifyTime }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />


    <el-dialog :title="textMap[dialogStatus]" :closeOnClickModal="false" :visible.sync="dialogFormVisible">
      <el-form v-loading="diaLoading" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px">
        <el-form-item prop="name" label="系统名">
          <el-input v-model="temp.name" maxlength="64" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.remark"
            maxlength="255"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入备注内容"
          />
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="diaDisable" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserBtnByPId } from '@/api/upms/menu'
import { getSystem, updateSystem, addSystem, deleteSystem } from '@/api/upms/systemList'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive



export default {
  name: 'System',
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      total: 0,
      allPages: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      btnsPermission: {
        search: {
          name: '查询',
          auth: false
        },
        add: {
          name: '添加',
          auth: false
        }
      },
      rules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: '请填写字典名'
        }],
        value: [{
            required: true,
            trigger: 'blur',
            message: '请填写字典值'
        }]
      },
      temp: {
        id: '',
        name: '',
        remark: ''
      },
      dialogStatus: '',
      dialogFormVisible: false,
      textMap: {
        update: '编辑',
        create: '新增系统'
      },
      statusOptions: ['published', 'draft', 'deleted'],
    }
  },
  components: { Pagination },
  created() {
    this.fetchData()
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
    fetchData() {
      //获取系统数据
      this.listLoading = true
      getSystem(this.listQuery).then(res => {
        this.list = res.data.records
        this.total = res.data.total
        this.allPages = res.data.pages
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: '',
        name: '',
        remark: ''
      }
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.fetchData()
    },
    handleCreate() {
      // 添加事件
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      // 添加
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.diaDisable = true
          this.diaLoading = true
          addSystem({name: this.temp.name, remark: this.temp.remark}).then(() => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加系统成功！',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          }).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
          })
        }
      })
    },
    getList(data) {
      // 分页事件
      this.listQuery.pageIndex = data.page
      this.fetchData()
    },
    updateData() {
      // 编辑
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.diaDisable = true
          this.diaLoading = true
          updateSystem({id: this.temp.id, name: this.temp.name, remark: this.temp.remark}).then(response => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '数据修改成功！',
              type: 'success',
              duration: 2000
            })
            this.fetchData()
          }).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
          })
        }
      })
      
    },
    handleUpdate(row) {
      // 编辑事件
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(data, msg) {
      // 删除
      this.$confirm('此操作将永久删除该系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteSystem({id: data.id}).then(response => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if(this.list.length === 0 && this.allPages - 1 > 0) {
              --this.listQuery.pageIndex
            }
            this.fetchData()
          }).catch(err => {
            this.listLoading = false
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })   
        })
    },
    resetSearch() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 10
      },
      this.fetchData()
    }
  }
}
</script>
