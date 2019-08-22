<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name"  placeholder="请输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" @click="handAddTop">新增一级字典</el-button>
    </div>

    <el-table
      ref="treeTable"
      v-loading="listLoading"
      :data="dictData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="字典名"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="180">
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
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row, $event)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑字典':'添加字典'">
      <el-form v-loading="diaLoading" :model="role" label-width="80px" label-position="left">
        <el-form-item label="字典名">
          <el-input v-model="role.name" maxlength="64" placeholder="请输入字典名" />
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
        <el-form-item label="字典值">
          <el-input v-model="role.value" maxlength="255" placeholder="请输入字典值" />
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
        <el-button type="primary" :disabled="diaDisable" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { addDict, getDictById, getDictByPid, updateDict, deleteDict } from '@/api/upms/dict'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { deepClone } from '@/utils'
import treeTable from '@/components/TreeTable'
const defaultRole = {
  name: '',
  status: '',
  remark: ''
}

export default {
  name: 'dict',
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
      statusData: [
        {id: 0, name: '禁止'},
        {id: 1, name: '启用'}
      ],
      statusDes: ['禁用', '启用'],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      changeId: '',
      changePid: '',
      dialogType: 'new',
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      temp: {
        id: '',
        name: '',
        remark: ''
      },
      listQuery: {
        name: '',
        pageIndex: 1,
        pageSize: 10
      },
      listLoading: true,
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
      maps:new Map()
    }
  },
  created() {
    this.getDictById()
  },
  methods: {
    getDictById() {
      this.listLoading = true
      this.dictData = []
      getDictById().then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          for(let i = 0; i < res.data.length; i++) {
            let obj = {
              name: res.data[i].name,
              id: res.data[i].id,
              pid: res.data[i].pid,
              value: res.data[i].value === null? '': res.data[i].value,
              status: this.statusDes[res.data[i].status],
              remark: res.data[i].remark === null? '': res.data[i].remark,
              hasChildren: res.data[i].haveChild === 1? true: false,
              children: []
            }
            this.dictData.push(obj)
          }
         
        }
      })
    },
    load(tree, treeNode, resolve) {
      const pid = tree.id;
      this.maps.set(pid, {tree, treeNode, resolve})
      getDictByPid({
        pid: tree.id
      }).then(res => {
        let data = []
        if(Array.isArray(res.data)) {
          for(let i = 0; i < res.data.length; i++) {
            let obj = {
              name: res.data[i].name,
              id: res.data[i].id,
              pid: res.data[i].pid,
              value: res.data[i].value === null? '': res.data[i].value,
              status: this.statusDes[res.data[i].status],
              remark: res.data[i].remark === null? '': res.data[i].remark,
              hasChildren: res.data[i].haveChild === 1? true: false
            }
            data.push(obj)
          }
        }
        resolve(data)
      })
    },
    handleFilter() {

    },
    handAddTop() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
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
      this.dialogType = 'new'
      this.dialogVisible = true
      this.changeId = scope.id
      this.changePid = scope.pid
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
    handleDelete(data, e) {
      // 删除
      this.$confirm('此操作将永久删除该系统, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDict({id: data.id}).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getDictById()
            // const {tree, treeNode, resolve} = this.maps.get(data.pid)
            // this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, data.id, [])
            // this.load(tree,treeNode,resolve);
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
     this.$message({
        message: '操作成功',
        type: 'success'
      })

    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      console.log(this.role)
      if (isEdit) {
        this.diaDisable = true
        this.diaLoading = true
        await updateDict({
        id: this.role.id,
        name: this.role.name,
        status: (this.role.status === '启用'? 1: 0),
        value: this.role.value,
        remark: this.role.remark
        }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        // this.$set(this.$refs.treeTable.store.states.lazyTreeNodeMap, this.role.id, {
        //   id: this.role.id,
        //   name: this.role.name,
        //   status: this.role.status,
        //   value: this.role.value,
        //   remark: this.role.remark
        // })
        this.diaDisable = false
        this.diaLoading = false
        this.getDictById()
      } else {
        // console.log('id:', this.changeId)
        // console.log(this.maps)
        // console.log(this.maps.get(this.changeId))
        // const {tree, treeNode, resolve} = this.maps.get(this.changeId)
        // console.log('tree')
        // console.log(tree)
        // console.log(treeNode)
        // return
        this.diaDisable = true
        this.diaLoading = true
        const { data } = await addDict({
          parentId: this.changeId,
          name: this.role.name,
          value: this.role.value,
          // status: this.role.status,
          remark: this.role.remark
        }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        this.diaDisable = false
        this.diaLoading = false
        // console.log('pid:', this.changeId)
        // console.log(this.maps)
        // console.log(this.maps.get(this.changeId))
        // const {tree, treeNode, resolve} = this.maps.get(this.changeId)
        // this.load(tree, treeNode, resolve);
        this.getDictById()
      }

      const { name, remark } = this.role
      this.dialogVisible = false
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
