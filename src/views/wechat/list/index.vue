<template>
  <div class="app-container">
    <div v-if="btnsPermission.search.auth" class="filter-container" style="padding-bottom: 10px">
      公众号名称：<el-input v-model="listQuery.name" maxlength="64" placeholder="请输入公众号名称" style="width: 200px;margin-right:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      应用ID：<el-input v-model="listQuery.appId" maxlength="64" placeholder="请输入应用ID" style="width: 200px;margin-right:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="请选择类型">
        <el-option
          v-for="item in typeData"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{btnsPermission.search.name}}
      </el-button>
      <el-button v-if="btnsPermission.search.auth" v-waves class="filter-item" @click="resetSearch">重置</el-button>
    </div>
    <div v-if="btnsPermission.add.auth" style="margin-bottom: 10px;">
      <el-button class="filter-item" type="primary" size="medium" style="margin-left: 10px;" @click="handleCreate">
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
      <el-table-column 
        prop="systemName"
        label="系统名"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="name"
        label="公众账号名称"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        label="类型"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">订阅号</span>
          <span v-else-if="scope.row.type === 2">服务号</span>
          <span v-else-if="scope.row.type === 3">小程序</span>
        </template>
      </el-table-column>
      <el-table-column 
        prop="appId"
        label="应用ID"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="appSecret"
        label="应用密钥"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="token"
        label="公众账号token"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        prop="encodingAESKey"
        label="加解密密钥"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column 
        label="加密方式"
        width="80"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.encrypt === 1">明文</span>
          <span v-else-if="scope.row.encrypt === 2">兼容</span>
          <span v-else-if="scope.row.encrypt === 3">安全</span>
        </template>
      </el-table-column>
       <el-table-column 
        prop="accessToken"
        label="凭证"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="expiresIn"
        label="凭证有效时间"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="expiresTime"
        label="凭证更新时间"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="createTime"
        label="凭证创建时间"
        width="160"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="modifyTime"
        width="160"
        label="更新时间"
        align="center">
      </el-table-column>
      <el-table-column 
        prop="remark"
        label="备注"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="mini" @click="handleUpdate(row)">
            {{btnsPermission.edit.name}}
          </el-button>
          <el-button v-if="btnsPermission.editMenu.auth" type="primary" size="mini" @click="editWechat(row)">
            {{btnsPermission.editMenu.name}}
          </el-button>
          <el-button v-if="btnsPermission.delete.auth" size="mini" type="danger" @click="handleDelete(row)">
            {{btnsPermission.delete.name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize"  @pagination="getList" />


    <el-dialog :title="textMap[dialogStatus]" :closeOnClickModal="false" :visible.sync="dialogFormVisible">
      <el-form v-loading="diaLoading" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px">
        <el-form-item prop="name" label="公众号名称">
          <el-input v-model="temp.name" maxlength="64" />
        </el-form-item>
        <el-form-item prop="systemId" label="系统名">
          <el-select v-model="temp.systemId" placeholder="请选择系统">
              <el-option
                v-for="item in systemData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="type" label="类型">
          <el-select v-model="temp.type" placeholder="请选择">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="appId" label="应用ID">
          <el-input v-model="temp.appId" maxlength="32" />
        </el-form-item>
        <el-form-item prop="appSecret" label="应用密钥">
          <el-input v-model="temp.appSecret" maxlength="32" />
        </el-form-item>
        <el-form-item prop="token" label="公众账号token">
          <el-input v-model="temp.token" maxlength="64" />
        </el-form-item>
        <el-form-item prop="encrypt" label="加密方式">
          <el-select v-model="temp.encrypt" placeholder="请选择">
            <el-option
              v-for="item in encryptData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="encodingAESKey" label="加密密钥">
          <el-input v-model="temp.encodingAESKey" maxlength="64" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="temp.remark"
            maxlength="256"
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
    
    <!-- wx -->
    <el-dialog v-loading="wechatLoading" title="自定义菜单" width="80%" :closeOnClickModal="false" :visible.sync="dialogWechatVisible">
      <div class="menu_setting_area js_editBox">
        <div class="menu_preview_area">
          <div class="mobile_menu_preview">
            <div class="mobile_hd tc">沁绿农业</div>
            <div class="mobile_bd">
              <ul class="pre_menu_list grid_line ui-sortable ui-sortable-disabled" :class="{ no_menu: menuList.length === 0 }">
                <li v-for="(item, index) in menuList" :key="index" class="jsMenu pre_menu_item grid_item jslevel1 ui-sortable ui-sortable-disabled" :class="{'size1of1': menuList.length === 0, 'size1of2': menuList.length === 1, 'size1of3': menuList.length > 1, 'current': selectMenuIndex === index}" @click="selectMenu(index, item.id)">
                  <a href="javascript:void(0);" class="pre_menu_link" draggable="false">
                    <!-- <i class="icon_menu_dot js_icon_menu_dot dn" style="display: none;"></i> -->
                    <!-- <i class="icon20_common sort_gray"></i> -->
                    <!-- <i class="icon_menu_dot js_icon_menu_dot dn"></i> -->
                    <span class="js_l1Title">{{item.name}}</span>
                  </a>
                  <div v-if="selectMenuIndex === index" class="sub_pre_menu_box js_l2TitleBox">
                    <ul class="sub_pre_menu_list">
                        <li v-for="(cItem, cIndex) in item.menuChild" :key="cIndex" id="1571119289645_subMenu_1571118069654_menu_0_0" class="jslevel2" :class="{ 'current': selectMenuChildIndex === cIndex }" @click.stop="selectMenuChild(cIndex)">
                          <a href="javascript:void(0);" class="jsSubView" draggable="false">
                            <span class="sub_pre_menu_inner js_sub_pre_menu_inner"><span class="js_l2Title">{{cItem.name}} {{cIndex}} {{selectMenuChildIndex}}</span></span>
                          </a>
                        </li>
                        <li v-if="menuChild[index].length < 5" class="js_addMenuBox" @click.stop="addMenuChild(index)">
                          <a href="javascript:void(0);" class="jsSubView js_addL2Btn" title="最多添加5个子菜单" draggable="false">
                            <span class="sub_pre_menu_inner js_sub_pre_menu_inner"><i class="icon14_menu_add"></i></span>
                          </a>
                        </li>
                    </ul>
                    <i class="arrow arrow_out"></i>
                    <i class="arrow arrow_in"></i>
                  </div>
                </li>
                <!-- <li class="jsMenu pre_menu_item grid_item jslevel1 ui-sortable ui-sortable-disabled size1of3" id="1571120101658_menu_1">
                    <a href="javascript:void(0);" class="pre_menu_link" draggable="false">
                    
                        <span class="js_l1Title">菜单名称</span>
                    </a>
                    <div class="sub_pre_menu_box js_l2TitleBox" style="">
                              <ul class="sub_pre_menu_list">
                                  
                                  <li id="1571120443883_subMenu_1571120101658_menu_1_0" class="jslevel2 selected current">
                                    <a href="javascript:void(0);" class="jsSubView" draggable="false">
                                      <span class="sub_pre_menu_inner js_sub_pre_menu_inner">
                                        <span class="js_l2Title">子菜单名称</span>
                                      </span>
                                    </a>
                                  </li>
                                  
                                  <li class="js_addMenuBox"><a href="javascript:void(0);" class="jsSubView js_addL2Btn" title="最多添加5个子菜单" draggable="false"><span class="sub_pre_menu_inner js_sub_pre_menu_inner"><i class="icon14_menu_add"></i></span></a></li>
                              </ul>
                              <i class="arrow arrow_out"></i>
                              <i class="arrow arrow_in"></i>
                          </div>
                </li> -->
                <li v-if="menu.length < 3" class="js_addMenuBox pre_menu_item grid_item no_extra" :class="menuClass[menu.length]" @click="addMenu">
                  <a href="javascript:void(0);" class="pre_menu_link js_addL1Btn" title="最多添加3个一级菜单" draggable="false">
                    <i class="icon14_menu_add"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="menu_form_area">
          <div v-if="menuList.length === 0" id="js_none" class="menu_initial_tips tips_global">点击左侧菜单进行编辑操作</div>
          <div v-else class="portable_editor to_left">
            <div class="editor_inner">
              <div class="global_mod float_layout menu_form_hd js_second_title_bar mb20">
                <h4 v-if="isMenu" class="global_info">菜单名称</h4>
                <h4 v-else class="global_info">子菜单名称</h4>
                <div class="global_extra">
                  <a v-if="isMenu" @click="deleteMenu('xxx')">删除菜单</a>
                  <a v-else @click="deleteMenuChild">删除子菜单</a>
                </div>
              </div>
              <div class="menu_form_bd">
                <div v-if="menuList[selectMenuIndex].menuChild.length > 0" class="msg_sender_tips tips_global mb20">已添加子菜单，仅可设置菜单名称。</div>
                <el-form v-loading="wechatLoading" ref="wechatForm" :rules="wechatRules" :model="wechat" label-position="left" label-width="100px">
                    <template v-if="isMenu">
                      <el-form-item prop="name" label="菜单名称">
                        <el-input class="w300" v-model="menuList[selectMenuIndex].name" maxlength="4" @blur="(event) => updateMenu(event, selectMenuIndex, menuList[selectMenuIndex].name)" />
                      </el-form-item>
                      <template v-if="menuList[selectMenuIndex].menuChild.length === 0">
                        <el-form-item prop="systemId" label="菜单内容">
                          <el-radio-group v-model="wechatType">
                            <el-radio :label="1">发送消息</el-radio>
                            <el-radio :label="2">跳转网页</el-radio>
                            <el-radio :label="3">小程序</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <template v-if="wechatType === 1">
                          <div>
                            富文本
                          </div>
                        </template>
                        <template v-else-if="wechatType === 2">
                          <div>
                            <p class="wechat-des">订阅者点击该子菜单会跳到以下链接</p>
                            <el-form-item prop="name" label="页面地址">
                              <el-input class="w300" v-model="temp.name" maxlength="64" />
                            </el-form-item>
                          </div>
                        </template>
                        <template v-else>
                          <div>
                            <p class="wechat-des">订阅者点击该子菜单会跳到以下小程序</p>
                            <el-form-item prop="name" label="小程序ID">
                              <el-input class="w300" v-model="temp.name" maxlength="64" />
                            </el-form-item>
                            <el-form-item prop="name" label="首页地址">
                              <el-input class="w300" v-model="temp.name" maxlength="64" />
                            </el-form-item>
                          </div>
                        </template>
                      </template>
                    </template>
                  <template v-else-if="menuList[selectMenuIndex].length > 0">
                    <el-form-item prop="name" label="子菜单名称">
                          <el-input class="w300" v-model="menuList[selectMenuIndex].menuChild[selectMenuChildIndex].name" maxlength="4" @blur="(event) => updateMenu(event, selectMenuIndex, menuList[selectMenuIndex].name)" />
                        </el-form-item>
                    <el-form-item prop="systemId" label="菜单内容">
                      <el-radio-group v-model="wechatType">
                        <el-radio :label="1">发送消息</el-radio>
                        <el-radio :label="2">跳转网页</el-radio>
                        <el-radio :label="3">小程序</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <template v-if="wechatType === 1">
                      <div>
                        富文本
                      </div>
                    </template>
                    <template v-else-if="wechatType === 2">
                      <div>
                        <p class="wechat-des">订阅者点击该子菜单会跳到以下链接</p>
                        <el-form-item prop="name" label="页面地址">
                          <el-input class="w300" v-model="temp.name" maxlength="64" />
                        </el-form-item>
                      </div>
                    </template>
                    <template v-else>
                      <div>
                        <p class="wechat-des">订阅者点击该子菜单会跳到以下小程序</p>
                        <el-form-item prop="name" label="小程序ID">
                          <el-input class="w300" v-model="temp.name" maxlength="64" />
                        </el-form-item>
                        <el-form-item prop="name" label="首页地址">
                          <el-input class="w300" v-model="temp.name" maxlength="64" />
                        </el-form-item>
                      </div>
                    </template>
                  </template>
                  
                </el-form>
                <!-- <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">
                    取消
                  </el-button>
                  <el-button type="primary" :disabled="diaDisable" @click="dialogStatus==='create'?createData():updateData()">
                    确定
                  </el-button>
                </div> -->
              </div>
            </div>
            <span class="editor_arrow_wrp"><i class="editor_arrow editor_arrow_out"></i><i class="editor_arrow editor_arrow_in"></i></span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserBtnByPId } from '@/api/upms/menu'
import { addWechat, deleteWechat, updateWechat, getWechatList, getWechatById, getMenuById, addMenu, updateMenu, getMenuListById, checkMenu, deleteMenu } from '@/api/wechat/list'
import { getSystem } from '@/api/upms/systemList'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive



export default {
  name: 'Wechat',
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
        pageSize: 10,
        type: '',
        appId: '',
        name: ''
      },
      systemData: [],
      btnsPermission: {
        search: {
          name: '查询',
          auth: false
        },
        add: {
          name: '添加',
          auth: false
        },
        delete: {
          name: '删除',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        },
        editMenu: {
          name: '编辑菜单',
          auth: false
        }
      },
      rules: {
        encodingAESKey: [{
          required: true,
          trigger: 'blur',
          message: '请填写加密密钥'
        }],
        systemId: [{
          required: true,
          trigger: 'blur',
          message: '请填写系统ID'
        }],
        appId: [{
          required: true,
          trigger: 'blur',
          message: '请填写appID'
        }],
        appSecret: [{
            required: true,
            trigger: 'blur',
            message: '请填写应用密钥'
        }],
        encrypt: [{
            required: true,
            trigger: 'change',
            message: '请选择加密方式'
        }],
        name: [{
            required: true,
            trigger: 'blur',
            message: '请填写公众帐号名称'
        }],
        token: [{
            required: true,
            trigger: 'blur',
            message: '请填写公众帐号TOKEN'
        }],
        type: [{
            required: true,
            trigger: 'change',
            message: '请选择类型'
        }],
      },
      temp: {
        appId : '',
        appSecret: '',
        encodingAESKey: '',
        encrypt: '',
        name: '',
        remark: '',
        systemId: '',
        token: '',
        type: ''
      },
      typeData: [
        {
          value: 1,
          label: '订阅号'
        },
        {
          value: 2,
          label: '服务号'
        },
        {
          value: 3,
          label: '小程序'
        }
      ],
      encryptData: [
        {
          value: 1,
          label: '明文'
        },
        {
          value: 2,
          label: '兼容'
        },
        {
          value: 3,
          label: '安全'
        }
      ],
      dialogStatus: '',
      dialogFormVisible: false,
      dialogWechatVisible: false,
      wechatLoading: false,
      textMap: {
        update: '编辑',
        create: '新增'
      },
      statusOptions: ['published', 'draft', 'deleted'],
      wechat: {
        appId : '',
        appSecret: '',
        encodingAESKey: '',
        encrypt: '',
        name: '',
        remark: '',
        systemId: '',
        token: '',
        type: ''
      },
      wechatType: 1,
      wechatLoading: false,
      menuClass: ['size1of1', 'size1of2', 'size1of3', 'size1of3'],
      wechatRules: {},
      menu: [],
      menuList: [
        { 
          name: '',
          menuChild: [
            {
              name: ''
            }
          ]
        }
      ],
      isMenu: true,
      selectWechatId: '',
      selectMenuId: '',
      selectMenuIndex: 0,
      selectMenuChildIndex: 0,
      menuChild: {
        0: [],
        1: [],
        2: []
      },
    }
  },
  components: { Pagination },
  created() {
    this.getWechatList()
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
    getWechatList() {
      //获取系统数据
      this.listLoading = true
      getWechatList(this.listQuery).then(res => {
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
        appId : '',
        appSecret: '',
        encodingAESKey: '',
        encrypt: '',
        name: '',
        remark: '',
        systemId: '',
        token: '',
        type: ''
      }
    },
    handleFilter() {
      this.listQuery.pageIndex = 1
      this.getWechatList()
    },
    handleCreate() {
      // 添加事件
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      if(this.systemData.length === 0) {
        this.getSystem()
      }
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
          addWechat({
            systemId: this.temp.systemId,
            appId : this.temp.appId,
            appSecret: this.temp.appSecret,
            encodingAESKey: this.temp.encodingAESKey,
            encrypt: this.temp.encrypt,
            name: this.temp.name,
            token: this.temp.token,
            type: this.temp.type,
            remark: this.temp.remark
          }).then(() => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '添加微信账号成功！',
              type: 'success',
              duration: 2000
            })
            this.getWechatList()
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
      this.getWechatList()
    },
    updateData() {
      // 编辑
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.diaDisable = true
          this.diaLoading = true
          let updateParam = {
            id: this.temp.id,
            systemId: this.temp.systemId,
            appId : this.temp.appId,
            appSecret: this.temp.appSecret,
            encrypt: this.temp.encrypt,
            name: this.temp.name,
            token: this.temp.token,
            type: this.temp.type,
            encodingAESKey: this.temp.encodingAESKey
          }
          if(this.temp.remark !== null && this.temp.remark.length > 0) {
            updateParam.remark = this.temp.remark
          }
          updateWechat(updateParam).then(response => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '数据修改成功！',
              type: 'success',
              duration: 2000
            })
            this.getWechatList()
          }).catch(err => {
            this.diaDisable = false
            this.diaLoading = false
          })
        }
      })
      
    },
    handleUpdate(row) {
      // 编辑事件
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.diaLoading = true
      this.diaDisable = true
      if(this.systemData.length === 0) {
        this.getSystem()
      }
      getWechatById({id: row.id}).then(res => {
        this.diaLoading = false
        this.diaDisable = false
        this.temp = res.data
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
      // this.temp = Object.assign({}, row) // copy obj
      
    },
    editWechat(row) {
      // 自定义菜单
      this.dialogWechatVisible = true
      this.selectWechatId = row.id
      this.getMenuListById()
    },
    getMenuListById() {
      this.wechatLoading = true
      getMenuListById({ accountId: this.selectWechatId }).then(res => {
        this.wechatLoading = false
        if(Array.isArray(res.data)) {
          let resData = []
          res.data.forEach(item => {
            let obj = {
              id: item.id,
              name: item.name,
              menuChild: []
            }
            if(Array.isArray(item.sub_button) && item.sub_button.length > 0) {

              item.sub_button.forEach(vItem => {
                obj.menuChild.push({
                  name: vItem.name,
                  id: vItem.id
                })
              })
            }
            resData.push(obj)
          })
          this.menuList = resData
        }
        this.selectMenuIndex = this.menuList.length - 1
      })
    },
    handleDelete(data) {
      // 删除
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true
          deleteWechat({id: data.id}).then(response => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            if(this.list.length === 1 && this.allPages - 1 > 0) {
              --this.listQuery.pageIndex
            }
            this.getWechatList()
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
        pageSize: 10,
        type: '',
        appId: '',
        name: ''
      }
      this.getWechatList()
    },
    getSystem() {
      this.diaLoading = true
      this.diaDisable = true
      getSystem({
        pageIndex: 1,
        pageSize: 500
      }).then(res => {
        this.diaLoading = false
        this.diaDisable = false
        if(Array.isArray(res.data.records)) {
          this.systemData = res.data.records
        }
      })
    },
    addMenu() {
      this.isMenu = true
      addMenu({ 
        accoutId: this.selectWechatId,
        name: '菜单名称',
        type: 'view'
      }).then(res => {
        this.getMenuListById()
      })
    },
    updateMenu(event, index, name) {
      console.log(event)
      console.log(index)
      console.log(name)
      // 菜单修改保存
      updateMenu({
        accoutId: this.selectMenuId,
        name: name
      }).then(res => {

      })
    },
    selectMenu(index, id) {
      // 选择主菜单
      console.log('id', id)
      this.isMenu = true
      this.selectMenuId = id
      this.selectMenuIndex = index
      this.selectMenuChildIndex = -1
    },
    addMenuChild(index) {
      // 添加子菜单
      this.isMenu = false
      // this.menuChild[index].unshift({
      //   name: '子菜单'
      // })
      addMenu({ 
        pid: this.selectMenuId,
        name: '子菜单名称',
        type: 'view'
      }).then(res => {
        this.getMenuListById()
      })
      
      // this.selectMenuChildIndex = this.menuChild[index].length - 1
    },
    selectMenuChild(index) {
      // 选择子菜单
      this.isMenu = false
      this.selectMenuChildIndex = index
    },
    deleteMenu(x) {
      // 删除主菜单
      console.log(x)
      console.log(this.selectMenuId)
      this.$confirm(`此操作将永久删除菜单“${this.menuList[this.selectMenuIndex].name}”, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteMenu({id: this.selectMenuId}).then(response => {
          this.listLoading = false
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // if(this.list.length === 1 && this.allPages - 1 > 0) {
          //   --this.listQuery.pageIndex
          // }
          this.getMenuListById()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })   
      })
    },
    deleteMenuChild() {
      // 删除子菜单
      this.menuChild[this.selectMenuIndex].splice(this.selectMenuChildIndex, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  ul,li,a,p,h1,h2,h3,h4,h5,h6{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .tc{
    text-align: center;
  }

  .menu_setting_area {
      width: 100%;
      display: table;
      font-size: 14px;
      *zoom: 1;
  }
  .menu_preview_area {
    float: left;
    margin-right: 12px;
    position: relative;
  }
  .mobile_menu_preview {
    width: 294px;
    background-size: contain;
  }
  .mobile_menu_preview {
    position: relative;
    width: 317px;
    height: 580px;
    background: transparent url('~@/assets/img/bg_mobile_head_default492dbb.png') no-repeat 0 0;
    background-position: 0 0;
    border: 1px solid #e7e7eb;
  }

  .mobile_menu_preview .mobile_hd {
    color: #fff;
    text-align: center;
    padding-top: 30px;
    font-size: 15px;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    margin: 0 30px;
  }

  .menu_preview_area .pre_menu_list {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #e7e7eb;
    background: transparent url('~@/assets/img/bg_mobile_foot_default492dbb.png') no-repeat 0 0;
    background-position: 0 0;
    background-repeat: no-repeat;
    padding-left: 43px;
  }

  .grid_line .no_extra.grid_item {
    float: none;
    width: auto;
    overflow: hidden;
    *zoom: 1;
    *overflow: visible;
  }

  .menu_preview_area .pre_menu_item {
    line-height: 50px;
  }

  .grid_item.no_extra {
    float: none;
    width: auto;
    overflow: hidden;
    *zoom: 1;
    *overflow: visible;
  }

  .pre_menu_item {
    position: relative;
    float: left;
    line-height: 38px;
    text-align: center;
  }

  .size1of1 {
    width: 100%;
  }

  .grid_item {
    float: left;
  }

  // .menu_preview_area .pre_menu_list.no_menu .pre_menu_item .pre_menu_link {
  //   border: 1px solid #44b549;
  //   color: #44b549;
  // }

  .pre_menu_item a {
    display: block;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    color: #616161;
    text-decoration: none;
  }

  .menu_preview_area .pre_menu_list.no_menu .icon14_menu_add {
    background: url('~@/assets/img/index_z492dc0.png') 0 -18px no-repeat;
  }

  .menu_preview_area .icon14_menu_add {
    background: url('~@/assets/img/index_z492dc0.png') 0 0 no-repeat;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    display: inline-block;
    margin-top: -2px;
  }

  .menu_preview_area .icon14_menu_add {
    background: url('~@/assets/img/index_z492dc0.png') 0 0 no-repeat;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    display: inline-block;
    margin-top: -2px;
  }

  // .menu_preview_area .pre_menu_list.no_menu .pre_menu_item .pre_menu_link {
  //   border: 1px solid #44b549;
  //   color: #44b549;
  // }

  .menu_preview_area .pre_menu_item {
    line-height: 50px;
  }

  .pre_menu_item {
    position: relative;
    float: left;
    line-height: 38px;
    text-align: center;
  }

  .size1of2 {
    width: 50%;
  }

  .size1of3 {
    width: 33.33%;
  }

  .mb20{
    margin-bottom: 20px;
  }

  .wechat-des{
    margin-bottom: 10px;
    color: #9a9a9a;
    font-size: 14px;
  }

  .w300{
    width: 300px;
  }

  .menu_preview_area .sub_pre_menu_list li:first-child {
    border-top: 1px solid #d0d0d0;
  }

  .menu_preview_area .sub_pre_menu_list li {
    line-height: 44px;
    border: 1px solid transparent;
    margin: 0 -1px -1px;
  }

  .menu_preview_area .sub_pre_menu_list li:first-child .sub_pre_menu_inner {
    border-top-width: 0;
  }

  .menu_preview_area .sub_pre_menu_inner {
    display: block;
    border-top: 1px solid #e7e7eb;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    cursor: pointer;
  }

  .pre_menu_link {
    border-left: 1px solid #e7e7eb;
  }

  .menu_preview_area .pre_menu_item.current .pre_menu_link {
    border: 1px solid #44b549;
    line-height: 48px;
    background-color: #fff;
    color: #44b549;
  }

  .menu_preview_area .sub_pre_menu_list li.current a {
    color: #44b549; 
  }

  .menu_preview_area .sub_pre_menu_list li.current {
    background-color: #fff;
    border: 1px solid #44b549;
    position: relative;
    z-index: 1;
    line-height: 45px;
    *zoom: 1;
  }

  .menu_preview_area .pre_menu_list.no_menu .pre_menu_item .pre_menu_link {
    border: 1px solid #44b549;
    color: #44b549;
}

.pre_menu_item .icon_menu_dot {
    background: url('~@/assets/img/index_z492dc0.png') 0 -36px no-repeat;
    width: 7px;
    height: 7px;
    vertical-align: middle;
    display: inline-block;
    margin-right: 2px;
    margin-top: -2px;
    *margin-top: 0;
  }

  .icon20_common.sort_gray {
    // background: url(~@/assets/img/base_z492dc0.png) 0 -4819px no-repeat;
  }

  .icon20_common {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    display: inline-block;
    line-height: 100px;
    overflow: hidden;
  }

  .menu_preview_area .sub_pre_menu_box {
    bottom: 60px;
    background-color: #fafafa;
    border-top-width: 0;
  }

  .sub_pre_menu_box {
    position: absolute;
    bottom: 50px;
    left: 0;
    width: 100%;
    border: 1px solid #d0d0d0;
    background-color: #fff;
  }

  .menu_form_area {
    display: table-cell;
    vertical-align: top;
    float: none;
    *display: block;
    *zoom: 1;
    width: 100%;
  }

  .menu_form_area.block{
    display: block;
  }

  .menu_initial_tips {
    text-align: center;
    padding-top: 200px;
  }

  .tips_global {
    color: #9a9a9a;
  }

  .tips_global.block{
    display: block;
  }

  .portable_editor.to_left {
    padding-left: 12px;
  }

  .portable_editor {
    position: relative;
  }

  .menu_form_area .editor_inner {
    min-height: 560px;
    padding-bottom: 20px;
  }

  .portable_editor .editor_inner {
    padding: 0 20px 5px;
    background-color: #f4f5f9;
    border: 1px solid #e7e7eb;
    border-radius: 0;
    -moz-border-radius: 0;
    -webkit-border-radius: 0;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }

  .menu_form_hd {
    padding: 9px 0;
    border-bottom: 1px solid #e7e7eb;
  }

  .menu_setting_area:after {
    content: "\200B";
    display: block;
    height: 0;
    clear: both;
  }

  .global_mod.float_layout .global_info {
    float: left;
  }

  .global_mod .global_extra {
    text-align: right;
  }

  .menu_form_hd h4 {
    font-weight: 400;
  }

  a {
    text-decoration: none;
    color: #576b95;
  }
</style>
