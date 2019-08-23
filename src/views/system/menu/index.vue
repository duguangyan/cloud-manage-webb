<template>
  <div class="app-container">

    <div class="filter-container">
      名称：
      <el-input v-model="listQuery.name"  placeholder="请输入用户姓名" style="width: 200px;" class="filter-item mr10" @keyup.enter.native="handleFilter" />
      状态：
      <el-select v-model="listQuery.status" class="mr10" placeholder="请选择">
        <el-option
          v-for="(val, key) in statusData"
          :key="key"
          :label="val"
          :value="val">
        </el-option>
      </el-select>
      类型：
      <el-select v-model="listQuery.type" class="mr10" placeholder="请选择">
        <el-option
          v-for="(val, key) in typeData"
          :key="key"
          :label="val"
          :value="val">
        </el-option>
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="resetResource">重置</el-button>
      <el-button v-waves class="filter-item" icon="el-icon-search" @click="handleAddResource">新增资源</el-button>
    </div>

    <el-table
      ref="treeTable"
      v-loading="listLoading"
      :data="meanData"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="名称"
        >
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="code"
        label="链接地址"
        align="center"
        width="400">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center">
      </el-table-column>
      <el-table-column
        prop="operation"
        label="事件"
        align="center">
      </el-table-column>
      <el-table-column
        prop="auth"
        label="授权"
        align="center">
      </el-table-column>
      <el-table-column
        prop="描述"
        label="remark"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="msgEdit(row)">
            编辑
          </el-button>
          <!-- <el-button type="primary" size="mini" @click="msgAdd(row)">
            添加
          </el-button> -->
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row, $event)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogType==='edit'?'编辑':'新增资源'">
      <el-form v-loading="diaLoading" :model="role" label-width="80px" label-position="left">
        <el-form-item label="父级">
          <span v-if="checkParentName.length > 0" class="mr10">{{checkParentName}}</span>
          <span v-else-if="role.parentName !== undefined && role.parentName !== ''" class="mr10">{{role.parentName}}</span>
          <span v-else class="mr10">顶级</span>
          <el-button v-waves class="filter-item" size="small" @click="selectParent">更改父级</el-button>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="role.name" maxlength="64" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="role.type" placeholder="请选择">
            <el-option
              v-for="(val, key) in typeData"
              :key="key"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="链接地址">
          <el-input v-model="role.code" maxlength="255" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="role.status" placeholder="请选择">
            <el-option
              v-for="(val, key) in statusData"
              :key="key"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="事件">
          <el-select v-model="role.operation" placeholder="请选择">
            <el-option
              v-for="(val, key) in operaData"
              :key="key"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="授权">
          <el-select v-model="role.auth" placeholder="请选择">
            <el-option
              v-for="(val, key) in authData"
              :key="key"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="描述">
          <el-input
            v-model="role.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            maxlength="255"
            placeholder="请输入描述内容"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dioCancle">取消</el-button>
        <el-button type="primary" @click="confirmRole" :disabled="diaDisable">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="prarentDialogVisible" :closeOnClickModal="false" :title="'选择父级'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="权限列表">
          <el-tree
            ref="parentTree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            @check-change="handleCheckChange"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="parentCancle">取消</el-button>
        <el-button type="primary" @click="confirmParent">确定</el-button>
      </div>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { getMeanFirstRec, getMeanByPid, getResource, resourceDelete, updateUser, addResource, updateResource } from '@/api/upms/menu'
import { getRoutes } from '@/api/upms/manageRole'
import { getSystem } from '@/api/upms/systemList'
import Pagination from '@/components/Pagination'
const defaultRole = {
  name: '',
  status: '',
  url: '',
  type: '',
  operation: '',
  auth: '',
  remark: ''
}

export default {
  name: 'User',
  directives: { waves },
  data() {
    return {
      role: Object.assign({}, defaultRole),
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      systemData: [],
      meanData: [],
      statusData: {
        '0': '禁止',
        '1': '启用',
      },
      statusDataN: {
        '禁止': 0,
        '启用': 1
      },
      typeData: {
        '0': '菜单',
        '1': '按钮',
        '2': '接口',
      },
      typeDataN: {
        '菜单': 0,
        '按钮': 1,
        '接口': 2
      },
      operaData: {
        '0': 'tab打开',
        '1': '窗口打开',
      },
      operaDataN: {
        'tab打开': 0,
        '窗口打开': 1
      },
      authData: {
        '-1': '禁止',
        '0': '不需要认证',
        '1': '已认证',
        '2': '角色',
      },
      authDataN: {
        '禁止': -1,
        '不需要认证': 0,
        '已认证': 1,
        '角色': 2
      },
      routes: [],
      rolesList: [],
      resourceData: [],
      dialogVisible: false,
      prarentDialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      allPages: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        status: '',
        type: ''
      },
      checkParentId: '',
      checkParentName: '',
      multipleSelection: []
    }
  },
  components: { Pagination },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getMeanFirstRec()
  },
  methods: {
    handleSelectionChange(val) {
      // 多选事件
    },
    getMeanFirstRec() {
      this.listLoading = true
      this.meanData = []
      getMeanFirstRec().then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          for(let i = 0; i < res.data.length; i++) {
            let obj = {
              name: res.data[i].name,
              id: res.data[i].id,
              parentId: res.data[i].parentId,
              parentName: '',
              code: res.data[i].code,
              status: this.statusData[String(res.data[i].status)],
              operation: this.operaData[String(res.data[i].operation)],
              auth: this.authData[String(res.data[i].auth)],
              type: this.typeData[String(res.data[i].type)],
              remark: res.data[i].remark === null? '': res.data[i].remark,
              hasChildren: res.data[i].haveChild === 1? true: false
            }
            this.meanData.push(obj)
          }
         
        }
      })
    },
    load(tree, treeNode, resolve) {
      // const pid = tree.id;
      // this.maps.set(pid, {tree, treeNode, resolve})
      getMeanByPid({
        parentId: tree.id
      }).then(res => {
        let data = []
        if(Array.isArray(res.data)) {
          for(let i = 0; i < res.data.length; i++) {
            let obj = {
              name: res.data[i].name,
              id: res.data[i].id,
              parentId: res.data[i].parentId,
              parentName: tree.name,
              code: res.data[i].code,
              status: this.statusData[String(res.data[i].status)],
              operation: this.operaData[String(res.data[i].operation)],
              auth: this.authData[String(res.data[i].auth)],
              type: this.typeData[String(res.data[i].type)],
              remark: res.data[i].remark === null? '': res.data[i].remark,
              hasChildren: res.data[i].haveChild === 1? true: false
            }
            data.push(obj)
          }
        }
        resolve(data)
      })
    },
    dioCancle() {
      // 取消编辑
      this.dialogVisible = false
      this.checkParentName = ''
      this.checkParentId = ''
    },
    parentCancle() {
      this.checkParentName = ''
      this.checkParentId = ''
      this.prarentDialogVisible = false
    },
    getResource() {
      this.listLoading = true
      getResource(this.listQuery).then(res => {
        this.listLoading = false
        this.resourceData = res.data.records
        this.total = res.data.total
        this.allPages = res.data.pages
      })
    },
    async getRoutes() {
      this.listLoading = true
      await getRoutes().then(res => {
        if(Array.isArray(res.data)) {
          // this.serviceRoutes = res.data
          this.routes = this.generateRoutes(res.data, true)
        }
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
      
    },
    generateRoutes(routes, type) {
      // 路由生成
      const res = []
      if(type) {
        res.push({
          id: '',
          title: '顶级'
        })
      }
      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }
        // const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)
        const onlyOneShowingChild = false
        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }
        const data = {
          id: route.id,
          title: route.name
        }
        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, false)
        }
        res.push(data)
      }
      return res
    },
    getList(data) {
      // 分页事件
      this.listQuery.pageIndex = data.page
      this.getResource()
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getResource()
    },
    resetResource() {
      // 重置事件
      this.listQuery = {
        pageIndex: 1,
        pageSize: 10,
        status: '',
        type: ''
      },
      this.getResource()
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddResource() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    msgEdit(row) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(row)
    },
    async selectParent() {
      this.prarentDialogVisible = true
      await this.getRoutes()
    },
    handleCheckChange (data, checked, indeterminate) {
      /* 主要通过checked进行判断 */
      if (checked) {
        // console.log('id:', data.id)
        // console.log('ck')
        // console.log(data.title)
        // console.log(data.id)
        let arr = [data.id];
        this.$refs.parentTree.setCheckedKeys(arr);
        this.checkParentId = data.id
        this.checkParentName = data.title
      } else {
        this.checkParentId = ''
        this.checkParentName = ''
      }
    },
    handleDelete( row, e ) {
      this.$confirm('确定要删除该资源?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          await resourceDelete({id: row.id})
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getMeanFirstRec()
        }).catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        this.diaDisable = true
        this.diaLoading = true
         await updateResource({
           id: this.role.id,
           name: this.role.name,
           parentId: this.checkParentName.length > 0? this.checkParentId: this.role.parentId,
           status: this.statusDataN[this.role.status],
           url: this.role.url,
           type: this.typeDataN[this.role.type],
           operation: this.operaDataN[this.role.operation],
           auth: this.authDataN[this.role.auth],
           remark: this.role.remark
         }).catch(err => {
           this.diaDisable = false
          this.diaLoading = false
         })
         this.diaDisable = false
         this.diaLoading = false
        // for (const v of this.resourceData) {
        //     if (v.id === this.role.id) {
        //       const index = this.resourceData.indexOf(v)
        //       this.resourceData.splice(index, 1, this.role)
        //       break
        //     }
        // }
        this.getMeanFirstRec()
      } else {
        this.diaDisable = true
        this.diaLoading = true
        const { data } = await addResource({
          name: this.role.name,
          parentId: this.checkParentId,
          url: this.role.url,
          type: this.typeDataN[this.role.type],
          operation: this.operaDataN[this.role.operation],
          auth: this.authDataN[this.role.auth],
          remark: this.role.remark
        }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        this.diaDisable = false
        this.diaLoading = false
        this.getMeanFirstRec()
      }
      this.checkParentName = ''
      this.checkParentId = ''
      const { name, url, remark } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>名称: ${name}</div>
            <div>链接: ${url}</div>
            <div>描述: ${remark}</div>
          `,
        type: 'success'
      })
    },
    confirmParent() {
      this.prarentDialogVisible = false
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .mr10{
    margin-right: 10px;
  }
  .filter-container{
    padding-bottom: 30px;
  }
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
