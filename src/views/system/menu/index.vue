<template>
  <div v-loading="searchLoading" class="app-container">

    <div class="filter-container">
      <template v-if="btnsPermission.search.auth">
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
      </template>
      

      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{btnsPermission.search.name}}</el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetResource">重置</el-button>
      <el-button v-if="btnsPermission.addSource.auth" v-waves class="filter-item" @click="handleAddResource">{{btnsPermission.addSource.name}}</el-button>
    </div>

    <el-table
      v-if="isLazy"
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
        <template slot-scope="{ row }">
            <svg-icon v-if="row.icon" :icon-class="row.icon" />
            <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="url"
        label="链接地址"
        align="center"
        width="250">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="60"
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
          width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button v-if="btnsPermission.add.auth" type="primary" size="mini" @click="msgAdd(row)">
            {{btnsPermission.add.name}}
          </el-button>
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="mini" @click="msgEdit(row)">
            {{btnsPermission.edit.name}}
          </el-button>
          <el-button v-if="btnsPermission.delete.auth && row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row, $event)">
            {{btnsPermission.delete.name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

     <el-table
        v-show="!isLazy"
        rel="searchTree"
        :data="searchData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
       >
      <el-table-column
        prop="name"
        label="名称"
        >
        <template slot-scope="{ row }">
            <svg-icon v-if="row.icon" :icon-class="row.icon" />
            <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="url"
        label="链接地址"
        align="center"
        width="250">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
          width="60"
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
          width="100"
        align="center">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="msgAdd(row)">
            添加
          </el-button>
          <el-button type="primary" size="mini" @click="msgEdit(row)">
            编辑
          </el-button>
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
          <el-button v-waves class="filter-item" size="small" @click="selectParent">选择父级</el-button>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="role.name" maxlength="64" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="role.sort" maxlength="11" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="role.type" placeholder="请选择" @change="typeChange">
            <el-option
              v-for="(val, key) in typeData"
              :key="key"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="role.type === '按钮'" label="按钮code">
          <el-input v-model="role.code" maxlength="11" placeholder="请输入按钮code" />
        </el-form-item>
         <el-form-item v-if="role.type === '菜单' || role.type === '接口'" label="链接地址">
          <el-input v-model="role.url" maxlength="255" placeholder="请输入链接地址" />
        </el-form-item>
        <el-form-item v-if="role.type === '菜单' || role.typ === '按钮'" label="图标">
          <svg-icon v-if="role && role.icon" :icon-class="role.icon" class="mr10" />
          <el-button v-waves class="filter-item" size="small" @click="selectIcon">选择图标</el-button>
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
        <el-form-item v-if="role.type === '菜单'" label="事件">
          <el-select v-model="role.operation" placeholder="请选择">
            <el-option
              v-for="(val, key) in operaData"
              :key="key"
              :label="val"
              :value="val">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="role.type === '接口'" label="授权">
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
            :default-expanded-keys="keyArr"
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

    <el-dialog class="icon-box" :visible.sync="iconDialogVisible" :closeOnClickModal="false" :title="'选择图标'">
      
            <div v-for="item of svgIcons" :key="item" @click="handleClipboard(item, $event)">
              <!-- <el-tooltip placement="top"> -->
                <!-- <div slot="content">
                  {{ generateIconCode(item) }}
                </div> -->
                <div class="icon-item">
                  <svg-icon :icon-class="item" class-name="disabled" />
                  <span>{{ item }}</span>
                </div>
              <!-- </el-tooltip> -->
            </div>
            <div class="clear"></div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import waves from '@/directive/waves' // waves directive
import { getMeanFirstRec, getMeanByPid, resourceDelete, updateUser, addResource, updateResource, getUserBtnByPId, resourceSearch } from '@/api/upms/menu'
import { getRoutes } from '@/api/upms/manageRole'
import { getSystem } from '@/api/upms/systemList'
import Pagination from '@/components/Pagination'
import svgIcons from './svg-icons'
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
      svgIcons,
      isLazy: true,
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      searchLoading: false,
      systemData: [],
      meanData: [],
      searchData: [],
      keyArr: [''],
      btnsPermission: {
        search: {
          name: '搜索',
          auth: false
        },
        add: {
          name: '添加',
          auth: false
        },
        addSource: {
          name: '新增资源',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        },
        delete: {
          name: '删除',
          auth: false
        }
      },
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
        '0': '--',
        '1': 'tab打开',
        '2': '窗口打开',
      },
      operaDataN: {
        '--': '',
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
      iconDialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      allPages: 0,
      listQuery: {
        name: '',
        status: '',
        type: ''
      },
      checkParentId: '',
      checkParentName: '',
      iconShow: '',
      parentShowId: '',
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
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
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
              icon: res.data[i].icon,
              url: res.data[i].url,
              sort: typeof(res.data[i].sort) === 'number'? res.data[i].sort: 0,
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
              icon: res.data[i].icon,
              url: res.data[i].url,
               sort: typeof(res.data[i].sort) === 'number'? res.data[i].sort: 0,
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
      this.routes = []
    },
    handleClipboard(text, event) {
      this.iconDialogVisible = false
      this.role.icon = text
    },
    parentCancle() {
      this.checkParentName = ''
      this.checkParentId = ''
      this.prarentDialogVisible = false
    },
    async getRoutes() {
      this.listLoading = true
      await getRoutes().then(res => {
        if(Array.isArray(res.data)) {
          // this.serviceRoutes = res.data
          this.routes = []
          const pData = [
              {
              id: '',
              name: '顶级',
              parentId: '',
              children: res.data
            }
          ]
          this.routes = this.generateRoutes(pData)
          let arr = [this.parentShowId];
          this.$refs.parentTree.setCheckedKeys(arr);
        }
        this.listLoading = false
      }).catch(err => {
        this.listLoading = false
      })
      
    },
    generateRoutes(routes) {
      // 路由生成
      const res = []
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
          data.children = this.generateRoutes(route.children)
        }
        res.push(data)
      }
      return res
    },
    handleFilter() {
      this.searchLoading = true
      resourceSearch({
        name: this.listQuery.name,
        type: this.typeDataN[this.listQuery.type],
        status: this.statusDataN[this.listQuery.status]
      }).then(res => {
        this.searchLoading = false
        this.meanData = []
        this.isLazy = false
        if(Array.isArray(res.data)) {
          this.searchData = this.filterData(res.data)
        }
      }).catch(err => {
        this.searchLoading = false
      })
    },
    filterData(data) {
      const result = data.filter(val => {
        if(val.status != null) {
          val.status = this.statusData[val.status]
        }
        if(val.type != null) {
          val.type = this.typeData[val.type]
        }
        if(val.operation != null) {
          val.operation = this.operaData[val.operation]
        }
        if(val.auth != null) {
          val.auth = this.authData[val.auth]
        }
        if(val.children && val.children.length > 0) {
          val.children = this.filterData(val.children)
        }
        return true
      })
      return result
    },
    resetResource() {
      // 重置事件
      this.isLazy = true
      this.listQuery = {
        name: ''
      }
      this.searchData = []
      this.getMeanFirstRec()
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
    async handleAddResource() {
      this.role = Object.assign({}, defaultRole)
      this.role.operation = '--'
      this.dialogType = 'new'
      this.checkStrictly = true
      this.dialogVisible = true
    },
    msgEdit(row) {
      console.log(row)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(row)
    },
    msgAdd(row) {
      const pName = row.name
      const pId = row.id
      this.role = Object.assign({}, defaultRole)
      this.role.operation = '--'
      this.role.parentName = pName
      this.role.parentId = pId
      this.checkParentId = pId
      this.dialogType = 'new'
      this.dialogVisible = true
      this.checkStrictly = true
    },
    async selectParent() {
      if(this.role && this.role.parentId) {
        this.parentShowId = this.role.parentId
      } else {
        this.parentShowId = ''
      }
      this.prarentDialogVisible = true
      await this.getRoutes()
    },
    typeChange(val) {
      if(val !== '接口') {
        this.role.auth = ''
      }
      if(val !== '事件') {
        this.role.operation = '--'
      }
    },
    selectIcon() {
      // 选择图标
      this.iconDialogVisible = true
    },
    handleCheckChange (data, checked, indeterminate) {
      /* 主要通过checked进行判断 */
      if (checked) {
        let arr = [data.id];
        this.$refs.parentTree.setCheckedKeys(arr);
        this.checkParentId = data.id
        this.checkParentName = data.title
      }
    },
    handleDelete( row, e ) {
      this.$confirm('确定要删除该资源?', 'Warning', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.listLoading = true
          await resourceDelete({id: row.id})
          this.listLoading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getMeanFirstRec()
        }).catch(err => {
            this.listLoading = false
      })
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
           sort: this.role.sort,
           icon: this.role.icon,
           code: this.role.code,
           parentId: this.checkParentName.length > 0? this.checkParentId: this.role.parentId,
           status: this.statusDataN[this.role.status],
           url: this.role.url,
           type: this.typeDataN[this.role.type],
           operation: this.operaDataN[this.role.operation],
           auth: this.role.auth === '' ? '' : this.authDataN[this.role.auth],
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
        console.log('row -------------')
        console.log(this.role)
        console.log(this.role.sort)
        const { data } = await addResource({
          name: this.role.name,
          sort: this.role.sort,
          icon: this.role.icon,
          code: this.role.code,
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
    refreshLazyTree(node, children) {
      var theChildren = node.childNodes
      theChildren.splice(0, theChildren.length)
      node.doCreateChildren(children)
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
  .icon-box{
    .clear{
      clear: both;
    }
    .icon-item {
      margin: 10px;
      height: 85px;
      text-align: center;
      width: 95px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }

    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }

    .disabled {
      pointer-events: none;
    }
  }
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
    margin: 7px 0 30px 0;
  }
}
</style>
