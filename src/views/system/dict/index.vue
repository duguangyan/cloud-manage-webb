<template>
  <div class="app-container">
    <el-table
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
        width="180">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="msgEdit(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="msgAdd(row)">
            添加
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,'deleted')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'分配权限':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="字典名">
          <el-input v-model="role.name" placeholder="请输入字典名" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="role.status" placeholder="请选择">
            <el-option
              v-for="item in statusData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="备注">
          <el-input
            v-model="role.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入备注内容"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import { addDict, getDictById, getDictByPid, updateDict, deleteDict } from '@/api/dict'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import { deepClone } from '@/utils'
import treeTable from "@/components/TreeTable";
const defaultRole = {
  name: '',
  status: '',
  remark: ''
}

export default {
  name: 'Dict',
  components: { treeTable },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      dictData: [],
      statusData: [
        {id: 0, name: '禁止'},
        {id: 1, name: '启用'}
      ],
      statusDes: ['禁用', '启用'],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
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
      listLoading: true,
      query: {
        id: ''
      },
      dialogVisible: false,
      checkStrictly: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.listLoading = true
    this.getDictById()
  },
  methods: {
    getDictById() {
      this.dictData = []
      getDictById().then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          for(let i = 0; i < res.data.length; i++) {
            this.dictData.push({
              name: res.data[i].name,
              id: res.data[i].id,
              status: this.statusDes[res.data[i].status],
              remark: res.data[i].remark === null? '': res.data[i].remark,
              hasChildren: res.data[i].haveChild === 1? true: false
            })
          }
        }
      })
    },
    load(tree, treeNode, resolve) {
      console.log('tree')
      console.log(tree)
      console.log('treenode')
      console.log(treeNode)
      getDictByPid({
        pid: tree.id
      }).then(res => {
        let data = []
        if(Array.isArray(res.data)) {
          for(let i = 0; i < res.data.length; i++) {
            data.push({
              name: res.data[i].name,
              id: res.data[i].id,
              status: this.statusDes[res.data[i].status],
              remark: res.data[i].remark === null? '': res.data[i].remark,
              hasChildren: res.data[i].haveChild === 1? true: false
            })
          }
        }
        resolve(data)
      })
    },
    msgEdit(scope) {
      console.log(scope)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope)
    },
    msgAdd(scope) {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope)
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
          deleteDict({id: data.id}).then(response => {
            // for (const v of this.dictData) {
            //   if (v.id === data.id) {
            //     const index = this.list.indexOf(v)
            //     this.dictData.splice(index, 1)
            //     break
            //   }
            // }
            
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getDictById()
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
         await updateDict({
          id: this.role.id,
          name: this.role.name,
          status: this.role.status,
          remark: this.role.remark
         })
        for (const v of this.dictData) {
            if (v.id === this.role.id) {
              const index = this.dictData.indexOf(v)
              this.dictData.splice(index, 1, this.role)
              break
            }
        }
      } else {
        const { data } = await addDict({
          id: this.role.id,
          name: this.role.name,
          // status: this.role.status,
          remark: this.role.remark
        })
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
