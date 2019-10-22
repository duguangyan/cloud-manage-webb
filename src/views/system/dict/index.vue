<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-if="btnsPermission.search.auth" v-model.trim="listQuery.name"  placeholder="请输入搜索关键字" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetResource">重置</el-button>
      <el-button v-if="btnsPermission.add.auth" v-waves class="filter-item" @click="handAddTop">{{btnsPermission.add.name}}</el-button>
    </div>

    <el-table
      v-if="!isSearch"
      ref="treeTable"
      v-loading="listLoading"
      :data="dictData"
      style="width: 100%"
      row-key="id"
      border
      :header-cell-style="{background: '#f3f3f3'}"
      lazy
      :expand-row-keys="expandArr"
      :load="load"
      @expand-change="expandChange">
      <el-table-column
        prop="name"
        label="字典名"
        >
      </el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="编号"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">启用</span>
          <span v-else-if="scope.row.status === 0">禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="value"
        label="字典值"
        align="center"
        width="400">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="msgEdit(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="msgAdd(row)">
            添加
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-show="isSearch"
      ref="treeTableSearch"
      v-loading="listLoading"
      :data="searchData"
      style="width: 100%"
      row-key="id"
      border
      default-expand-all
      :header-cell-style="{background: '#f3f3f3'}">
      <el-table-column
        prop="name"
        label="字典名"
        >
      </el-table-column>
      <el-table-column
        prop="code"
        align="center"
        label="编号"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">启用</span>
          <span v-else-if="scope.row.status === 0">禁用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="value"
        label="字典值"
        align="center"
        width="400">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="msgEdit(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="msgAdd(row)">
            添加
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑字典':'添加字典'">
      <el-form ref="dictForm" v-loading="diaLoading" :model="role" label-width="80px" label-position="left" :rules="rules">
        <el-form-item prop="name" label="字典名">
          <el-input v-model.trim="role.name" maxlength="64" placeholder="请输入字典名" />
        </el-form-item>
        <el-form-item prop="code" label="编号">
          <el-input v-model.trim="role.code" maxlength="128" placeholder="请输入字典名" />
        </el-form-item>
        <el-form-item label="状态" v-if="dialogType==='edit'">
          <el-select v-model="role.status" placeholder="请选择">
            <el-option
              v-for="item in statusData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="value" label="字典值">
          <el-input v-model.trim="role.value" maxlength="255" placeholder="请输入字典值" />
        </el-form-item>
         <el-form-item label="备注">
          <el-input
            v-model="role.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="255"
            placeholder="请输入备注内容"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" :disabled="diaDisable" @click="regFun">确定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { getUserBtnByPId } from '@/api/upms/menu'
import { addDict, getDictById, getDictByPid, updateDict, deleteDict, searchDictByPid } from '@/api/upms/dict'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { deepClone } from '@/utils'
import treeTable from '@/components/TreeTable'
const defaultRole = {
  parentId: '',
  id: '',
  name: '',
  code: '',
  status: '',
  remark: ''
}

export default {
  name: 'systemDict',
  directives: { waves },
  components: { treeTable },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      dictData: [],
      tableData: [],
      searchData: [],
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        add: {
          name: '新增一级字典',
          auth: false
        }
      },
      statusData: [
        {id: 0, name: '禁止'},
        {id: 1, name: '启用'}
      ],
      statusDes: ['禁用', '启用'],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        code: [{
          required: true,
          trigger: 'blur',
          message: '请填写编号'
        }],
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
      expandArr: [],
      isSearch: false,
      changeId: '',
      changePid: '',
      dialogType: 'new',
      temp: {
        id: '',
        name: '',
        remark: ''
      },
      listQuery: {
        name: ''
      },
      searchQuery: {

      },
      query: {
        id: ''
      },
      treeNode: {},
      dialogVisible: false,
      checkStrictly: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      downloadLoading: false,
      loadNodeMap: new Map()
    }
  },
  created() {
    this.getDictById()
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
    getDictById() {
      this.listLoading = true
      getDictById().then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          let resData = []
          res.data.forEach(item => {
            let v = {
              name: item.name,
              code: item.code,
              hasChildren: item.haveChild === 1 ? true : false,
              id: item.id,
              parentId: item.parentId,
              remark: item.remark,
              sort: item.sort,
              status: item.status,
              value: item.value,
              createTime: item.createTime
            }
            resData.push(v)
          })
          this.dictData = resData
        }
      })
    },
    load(tree, treeNode, resolve) {
      const pid = tree.id
      this.loadNodeMap.set(pid, { tree, treeNode, resolve })
      getDictByPid({
        pid: tree.id
      }).then(res => {
        let resData = []
        if(Array.isArray(res.data)) {
          res.data.forEach(item => {
            let v = {
              name: item.name,
              code: item.code,
              hasChildren: item.haveChild === 1 ? true : false,
              id: item.id,
              parentId: item.parentId,
              remark: item.remark,
              sort: item.sort,
              status: item.status,
              value: item.value,
              createTime: item.createTime
            }
            resData.push(v)
          })
        }
        resolve(resData)
      })
    },
    expandChange(row, expanded) {
      console.log('expand')
      console.log(row)
      console.log(expanded)
    },
    handleLoad(id, pid, type) {
      // type 1:新增 2:更新 3:删除
      if(type === 1) {
        if (this.loadNodeMap.has(id)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(id);
          this.load(tree, treeNode, resolve, id)
        } else if(this.loadNodeMap.has(pid)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(pid);
          this.load(tree, treeNode, resolve, pid)
        } else {
          this.getDictById()
        }
      } else if(type === 2) {
        if (this.loadNodeMap.has(pid)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(pid);
          this.load(tree, treeNode, resolve, pid)
        } else {
          this.getDictById()
        }
      } else if(type === 3) {
        if (this.loadNodeMap.has(pid)) {
          const { tree, treeNode, resolve } = this.loadNodeMap.get(pid);
          this.load(tree, treeNode, resolve, pid)
        } else {
          this.getDictById()
        }
      }
      
    },
    handleFilter() {
      if(this.listQuery.name.length === 0) {
        this.$message({
          type: 'warning',
          message: '请输入搜索内容！'
        })
      } else {
        this.searchQuery = deepClone(this.listQuery)
        this.searchDictByPid(this.listQuery)
      }
    },
    searchDictByPid(obj) {
      searchDictByPid(obj).then(res => {
        this.isSearch = true
        if(Array.isArray(res.data)) {
          this.searchData = res.data
        }
      })
    },
    resetResource() {
      // 重置事件
      this.isSearch = false
      this.listQuery = {
        name: ''
      }
      this.searchData = []
      this.getDictById()
    },
    handAddTop() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'top'
      this.dialogVisible = true
    },
    msgEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope)
    },
    msgAdd(scope) {
      this.role = Object.assign({}, defaultRole)
      this.role.id = scope.id
      this.role.parentId = scope.parentId
      this.dialogType = 'new'
      this.dialogVisible = true
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
    handleDelete(data) {
      // 删除
      this.$confirm('此操作将永久删除该系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteDict({id: data.id}).then(response => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if(this.isSearch) {
              this.searchDictByPid(this.searchQuery)
            } else {
              this.handleLoad(data.id, data.parentId, 3)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    regFun() {
      // 输入校验
      this.$refs.dictForm.validate((valid) => {
        if (valid) {
          this.confirmRole()
        }
      });
    },
    async confirmRole() {
      this.listLoading = true
      this.dialogVisible = false
      if (this.dialogType === 'edit') {
        await updateDict({
        id: this.role.id,
        name: this.role.name,
        code: this.role.code,
        status: (this.role.status === '启用'? 1: 0),
        value: this.role.value,
        remark: this.role.remark
        })
        this.listLoading = false
        if(this.isSearch) {
          this.searchDictByPid(this.searchQuery)
        } else {
          this.handleLoad(this.role.id, this.role.parentId, 2)
        }
      } else if(this.dialogType === 'new') {
        const { data } = await addDict({
          parentId: this.role.id,
          name: this.role.name,
          code: this.role.code,
          value: this.role.value,
          remark: this.role.remark
        })
        this.listLoading = false
        if(this.isSearch) {
          this.searchDictByPid(this.searchQuery)
        } else {
          this.handleLoad(this.role.id, this.role.parentId, 1)
        }
      } else if(this.dialogType === 'top') {
        const { data } = await addDict({
          name: this.role.name,
          code: this.role.code,
          value: this.role.value,
          remark: this.role.remark
        })
        this.listLoading = false
        this.getDictById()
      }
      const { name, remark } = this.role
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>字典名: ${name}</div>
            <div>备注: ${remark}</div>
          `,
        type: 'success'
      })
    },
  }
}
</script>
<style lang="scss" scoped>
  .filter-container{
    padding-bottom: 30px;
  }
</style>
