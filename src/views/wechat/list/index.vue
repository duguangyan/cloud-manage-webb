<template>
  <div class="app-container">
    <div v-if="btnsPermission.search.auth" class="filter-container" style="padding-bottom: 10px">
      公众号名称：<el-input v-model="listQuery.name" maxlength="64" placeholder="请输入公众号名称" style="width: 200px;margin-right:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      应用ID：<el-input v-model="listQuery.appId" maxlength="64" placeholder="请输入应用ID" style="width: 200px;margin-right:10px;" class="filter-item" @keyup.enter.native="handleFilter" />
      类型：
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
        align="center"
        show-overflow-tooltip>
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
    <el-dialog title="自定义菜单" width="80%" :closeOnClickModal="false" :visible.sync="dialogWechatVisible">
      <div v-loading="wechatLoading" class="menu_setting_area js_editBox">
        <div class="menu_preview_area">
          <div class="mobile_menu_preview">
            <div class="mobile_hd tc">上上农夫</div>
            <div class="mobile_bd">
              <ul class="pre_menu_list grid_line ui-sortable ui-sortable-disabled" :class="{ no_menu: menuList.length === 0 }">
                <li v-for="(item, index) in menuList" :key="index" class="jsMenu pre_menu_item grid_item jslevel1 ui-sortable ui-sortable-disabled" :class="{'size1of1': menuList.length === 0, 'size1of2': menuList.length === 1, 'size1of3': menuList.length > 1, 'current': isSelectMenu && !isSelectMenuChild && selectMenuIndex === index}" @click="selectMenu(index, item.id)">
                  <a href="javascript:void(0);" class="pre_menu_link" draggable="false">
                    <!-- <i class="icon_menu_dot js_icon_menu_dot dn" style="display: none;"></i> -->
                    <!-- <i class="icon20_common sort_gray"></i> -->
                    <!-- <i class="icon_menu_dot js_icon_menu_dot dn"></i> -->
                    <span class="js_l1Title">{{item.name}}</span>
                  </a>
                  <div v-if="isSelectMenu && selectMenuIndex === index" class="sub_pre_menu_box js_l2TitleBox">
                    <ul class="sub_pre_menu_list">
                        <li v-for="(cItem, cIndex) in item.menuChild" :key="cIndex" id="1571119289645_subMenu_1571118069654_menu_0_0" class="jslevel2" :class="{ 'current': isSelectMenuChild && selectMenuChildIndex === cIndex }" @click.stop="selectMenuChild(cIndex, cItem.id)">
                          <a href="javascript:void(0);" class="jsSubView" draggable="false">
                            <span class="sub_pre_menu_inner js_sub_pre_menu_inner"><span class="js_l2Title">{{cItem.name}}</span></span>
                          </a>
                        </li>
                        <li v-if="item.menuChild.length < 5" class="js_addMenuBox" @click.stop="addMenuChild(index)">
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
                <li v-if="menuList.length < 3" class="js_addMenuBox pre_menu_item grid_item no_extra" :class="menuClass[menuList.length]" @click="addMenu">
                  <a href="javascript:void(0);" class="pre_menu_link js_addL1Btn" title="最多添加3个一级菜单" draggable="false">
                    <i class="icon14_menu_add"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="menu_form_area">
          <div v-if="!isSelectMenu || menuList.length === 0" id="js_none" class="menu_initial_tips tips_global">点击左侧菜单进行编辑操作</div>
          <div v-else class="portable_editor to_left">
            <div class="editor_inner">
              <div class="global_mod float_layout menu_form_hd js_second_title_bar mb20">
                <h4 v-if="isSelectMenu" class="global_info">菜单名称</h4>
                <h4 v-else class="global_info">子菜单名称</h4>
                <div class="global_extra">
                  <a v-if="isSelectMenuChild" @click="deleteMenu(2)">删除子菜单</a>
                  <a v-else-if="isSelectMenu" @click="deleteMenu(1)">删除菜单</a>
                </div>
              </div>
              <div class="menu_form_bd">
                <div v-if="menuList[selectMenuIndex].menuChild.length > 0" class="msg_sender_tips tips_global mb20">已添加子菜单，仅可设置菜单名称。</div>
                <el-form v-loading="wechatLoading" ref="menuRef" :rules="menuRules" :model="menuForm" label-position="left" label-width="100px">
                      <el-form-item v-if="isSelectMenuChild" prop="menuChildName" label="子菜单名称">
                        <el-input class="w300" v-model="menuForm.menuChildName" maxlength="16"/>
                      </el-form-item>
                      <el-form-item v-else prop="menuName" label="菜单名称">
                        <el-input class="w300" v-model="menuForm.menuName" maxlength="8"/>
                      </el-form-item>
                      <template v-show="(isSelectMenu && menuList[selectMenuIndex].menuChild.length === 0) || isSelectMenuChild">
                        <el-form-item prop="type" :label="isSelectMenuChild?'子菜单名称':'菜单名称'">
                          <el-radio-group v-model="menuForm.type">
                            <el-radio label="click">发送消息</el-radio>
                            <el-radio label="view">跳转网页</el-radio>
                            <el-radio label="miniprogram">小程序</el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <div v-show="menuForm.type === 'click'" class="msg_sender">
                          <div class="msg_tab">
                            <div class="tab_navs_panel">
                              <div class="tab_navs_wrp" style="width: 514px;">
                                  <ul class="tab_navs js_tab_navs" style="margin-left:0;">
                                      
                                      <li class="tab_nav tab_appmsg width5" :class="{'selected' : sendType === 'news'}" @click="sendChange('news')">
                                          <a href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">图文消息</span></a>
                                      </li>
                                      
                                      <li class="tab_nav tab_text width5" :class="{'selected' : sendType === 'word'}" @click="sendChange('word')">
                                          <a href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">文字</span></a>
                                      </li>
                                      
                                      <li class="tab_nav tab_img width5" :class="{'selected' : sendType === 'pic'}" @click="sendChange('pic')">
                                          <a href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">图片</span></a>
                                      </li>
                                      
                                      <li class="tab_nav tab_audio width5" :class="{'selected' : sendType === 'audio'}" @click="sendChange('audio')">
                                          <a href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">音频</span></a>
                                      </li>
                                      
                                      <li class="tab_nav tab_video width5 no_extra" :class="{'selected' : sendType === 'video'}" @click="sendChange('video')">
                                          <a href="javascript:void(0);" onclick="return false;">&nbsp;<i class="icon_msg_sender"></i><span class="msg_tab_title">视频</span></a>
                                      </li>
                                      
                                  </ul>
                              </div>
                            </div>
                            <div class="tab_panel">
                              <div v-show="sendType === 'news'" class="tab_content">
                                <div class="js_appmsgArea inner">
                                  <div class="tab_cont_cover create-type__list jsMsgSendTab" data-index="0">
                                    <div class="create-type__item" @click="sendSelect('news')">
                                        <a href="javascript:;" class="create-type__link jsMsgSenderPopBt" data-type="10" data-index="0">
                                            <i class="create-type__icon file"></i>
                                            <strong class="create-type__title">从素材库选择</strong>
                                        </a>
                                    </div>
                                    <!-- <div class="create-type__item">
                                        <a target="_blank" href="https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&amp;action=edit&amp;type=10&amp;isMul=1&amp;isNew=1&amp;lang=zh_CN&amp;token=269385525" class="create-type__link js_MsgSenderLinkBt js_new_appmsg" data-type="10" data-index="0">
                                            <i class="create-type__icon new"></i>
                                            <strong class="create-type__title">自建图文</strong>
                                        </a>
                                    </div>
                                    <div class="create-type__item">
                                        <a target="_blank" href="https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&amp;action=edit&amp;type=10&amp;isMul=1&amp;isNew=1&amp;share=1&amp;lang=zh_CN&amp;token=269385525" class="create-type__link js_MsgSenderLinkBt js_share_appmsg" data-type="10" data-index="0">
                                            <i class="create-type__icon share"></i>
                                            <strong class="create-type__title">转载文章</strong>
                                        </a>
                                    </div> -->
                                  </div>
                                </div>
                              </div>
                              <div v-show="sendType === 'word'" class="tab_content">
                                <div class="js_textArea inner no_extra">
                                  <div class="emotion_editor">
                                    <div class="edit_area js_editorArea" contenteditable="true" ref="sendEdit">

                                    </div>
                                    <div class="editor_toolbar">
                                      <p class="editor_tip js_editorTip">还可以输入<em>600</em>字</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div v-show="sendType === 'pic'" class="tab_content">
                                <div class="js_appmsgArea inner">
                                  <div class="tab_cont_cover create-type__list jsMsgSendTab" data-index="0">
                                    <div class="create-type__item" @click="sendSelect('image')">
                                        <a href="javascript:;" class="create-type__link jsMsgSenderPopBt" data-type="10" data-index="0">
                                            <i class="create-type__icon file"></i>
                                            <strong class="create-type__title">从素材库选择</strong>
                                        </a>
                                    </div>
                                    <!-- <div class="create-type__item">
                                        <a target="_blank" href="https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&amp;action=edit&amp;type=10&amp;isMul=1&amp;isNew=1&amp;lang=zh_CN&amp;token=269385525" class="create-type__link js_MsgSenderLinkBt js_new_appmsg" data-type="10" data-index="0">
                                            <i class="create-type__icon new"></i>
                                            <strong class="create-type__title">自建图文</strong>
                                        </a>
                                    </div>
                                    <div class="create-type__item">
                                        <a target="_blank" href="https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit&amp;action=edit&amp;type=10&amp;isMul=1&amp;isNew=1&amp;share=1&amp;lang=zh_CN&amp;token=269385525" class="create-type__link js_MsgSenderLinkBt js_share_appmsg" data-type="10" data-index="0">
                                            <i class="create-type__icon share"></i>
                                            <strong class="create-type__title">转载文章</strong>
                                        </a>
                                    </div> -->
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p class="profile_link_msg_global menu_send mini_tips warn dn js_warn"></p>
                        </div>
                        <div v-show="menuForm.type=== 'view'">
                          <p class="wechat-des">订阅者点击该子菜单会跳到以下链接</p>
                          <el-form-item prop="link" label="页面地址">
                            <el-input class="w300" v-model="menuForm.link" maxlength="64" />
                          </el-form-item>
                        </div>
                        <div v-show="menuForm.type=== 'miniprogram'">
                          <p class="wechat-des">订阅者点击该子菜单会跳到以下小程序</p>
                          <el-form-item prop="appId" label="小程序ID">
                            <el-input class="w300" v-model="menuForm.appId" maxlength="64"/>
                          </el-form-item>
                          <el-form-item prop="url" label="首页地址">
                            <el-input class="w300" v-model="menuForm.url" maxlength="64"/>
                          </el-form-item>
                          <el-form-item prop="pagePath" label="小程序路径">
                            <el-input class="w300" v-model="menuForm.pagePath" maxlength="64"/>
                          </el-form-item>
                        </div>
                      </template>
                </el-form>
                <div class="save-button">
                  <el-button type="primary" size="medium" :disabled="wechatAble" @click="saveMenu()">保存</el-button>
                </div>

              </div>
            </div>
            <span class="editor_arrow_wrp"><i class="editor_arrow editor_arrow_out"></i><i class="editor_arrow editor_arrow_in"></i></span>
          </div>
        </div>
      </div>
      <div class="create-button"><el-button type="primary" size="medium" :disabled="wechatAble" @click="createMenu()">发布</el-button></div>
    </el-dialog>

    <el-dialog title="选择素材" width="60%" :closeOnClickModal="false" :visible.sync="dialogSendVisible">
      <div v-if="sendType === 'news'" class="dialog_bd">
        <div class="dialog_media_container appmsg_media_dialog">
            <div class="sub_title_bar in_dialog">
                <div class="search_bar">
                  <el-input v-model="richInput" placeholder="搜索图文消息" size="small"></el-input>
                </div>
                <div class="appmsg_create tr">
                  <el-button type="primary" size="small">新建图文消息</el-button>
                </div>
            </div>
            <div class="dialog_media_inner">
              <div class="js_appmsg_list appmsg_list media_dialog">
                <div v-for="(item, index) in newsData" :key="index" class="appmsg_col"><div class="inner">
                  <div>
                    <div class="appmsg single has_first_cover" :class="{'selected' : newsSelect[index]}" @click="selsectMedia(1, item.id, index)">
                      <div class="appmsg_content">
                        <div class="appmsg_info">
                          <em class="appmsg_date">更新于 {{item.update_time}}</em>
                        </div>
                        <div class="appmsg_item simple_card_media">
                          <!-- 图文  -->
                          <div class="card_appmsg">
                            <div class="card_appmsg_inner">
                              <div class="weui-desktop-vm_primary card_appmsg_hd">
                                <strong class="card_appmsg_title js_title">
                                  <a href="" v-if="item.content && item.content.news_item" target="_blank" data-msgid="100000007" data-idx="0">{{item.content.news_item[0].title}}</a>
                                  
                                </strong>
                              <div class="weui-desktop-vm_default card_appmsg_bd">
                               
                                <div v-if="item.content && item.content.news_item" class="card_appmsg_thumb" :style="'background-image:url(' + item.content.news_item[0].url +')'"></div>
                              </div>
                            </div>
                          </div>   
                          <a href="" class="edit_mask preview_mask js_preview" data-msgid="100000007" data-idx="0">
                            <div class="edit_mask_content">
                              <p class="">预览文章</p>
                            </div>
                            <span class="vm_box"></span>
                          </a>
                        </div>
                      </div>
                      <div class="edit_mask appmsg_mask">
                        <!-- <i class="icon_card_selected">已选择</i> -->
                        <i class="el-icon-check icon_card_selected"></i>
                      </div>   
                    </div>
                  </div>
                </div>
              </div>
            </div>                  
          </div>
              <!-- <div class="no_media_wrp">
                  <p class="tips">暂无素材</p>
              </div>
              <span class="vm_box"></span> -->
              
          </div>
        </div>
      </div>
      <div v-else-if="sendType === 'pic'" class="weui-desktop-step__panel">
        <div class="weui-desktop-img-picker weui-desktop-grid">
          <div class="weui-desktop-grid__item weui-desktop-img-category">
            <ul class="weui-desktop-menu">
              <li class="weui-desktop-menu__item">
                <a href="javascript:;" class="weui-desktop-menu__link weui-desktop-menu__link_current">
                  <strong class="weui-desktop-img-category__title">全部图片</strong>
                  <em class="weui-desktop-img-category__size">(1)</em>
                </a>
              </li>
              <li class="weui-desktop-menu__item">
                <a href="javascript:;" class="weui-desktop-menu__link">
                  <strong class="weui-desktop-img-category__title">未分组</strong>
                  <em class="weui-desktop-img-category__size">(1)</em>
                </a>
              </li>
              <li class="weui-desktop-menu__item">
                <a href="javascript:;" class="weui-desktop-menu__link">
                  <strong class="weui-desktop-img-category__title">文章配图</strong>
                  <em class="weui-desktop-img-category__size">(0)</em>
                </a>
              </li>
            </ul>
            <div class="weui-desktop-img-category__add">
              <div class="weui-desktop-popover__wrp">
                <span class="weui-desktop-popover__target">
                  <a href="javascript:;">新建分组</a>
                </span>
                <div class="weui-desktop-popover weui-desktop-popover_pos-up-center" style="display: none;">
                  <div class="weui-desktop-popover__inner">
                    <div class="weui-desktop-popover__desc">
                      <div>
                        <form weui="true"><div class="weui-desktop-form__control-group">
                          <label class="weui-desktop-form__label">创建分组</label>
                          <div class="weui-desktop-form__controls">
                            <div class="weui-desktop-form__input-area">
                              <span class="weui-desktop-form__input-wrp">
                                <input type="text" name="group_name" placeholder="" class="weui-desktop-form__input">
                              </span>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div class="weui-desktop-popover__bar">
                      <div>
                        <button type="button" class="weui-desktop-btn weui-desktop-btn_primary">确定</button>
                        <button type="button" class="weui-desktop-btn weui-desktop-btn_default">取消</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div class="weui-desktop-grid__item">
              <div class="weui-desktop-img-picker__list__area">
                <!-- <div class="weui-desktop-global-mod weui-desktop-media-global-bar">
                  <div class="weui-desktop-global__extra">
                    <div class="weui-desktop-upload weui-desktop-upload_global-media">
                      <div class="weui-desktop-upload__tips">
                        <span class="weui-desktop-tips weui-desktop-tips_icon-after">大小不超过5M，已开启图片水印
                          <div class="weui-desktop-popover__wrp">
                            <span class="weui-desktop-popover__target">
                              <i class="icon-svg-common-ask"></i></span>
                              <div class="weui-desktop-popover weui-desktop-popover_pos-up-center img_water" style="display: none;">
                                <div class="weui-desktop-popover__inner">
                                  <div class="weui-desktop-popover__desc">
                                    <div>
                                      <p>水印类型：公众号名称</p>
                                      <p><span>已开启水印，所有上传的图片都会带有水印。</span>若需修改请前往<a target="_blank" href="/cgi-bin/settingpage?t=setting/function&amp;action=function&amp;set_water=1">公众号设置/功能设置</a>设置图片水印</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </span>
                        </div>
                        <div class="js_upload_btn_container weui-desktop-upload-input__wrp webuploader-container">
                        <div class="weui-desktop-btn weui-desktop-btn_default weui-desktop-btn_disabled" style="display: none;"><span>上传文件</span></div>
                        <a href="javascript:;" id="upload_0.5583989179968321" class="weui-desktop-btn weui-desktop-btn_default webuploader-pick"><span>上传文件</span></a>
                        <div id="rt_rt_1dsoqem12uhe1v8m1sa71k7518d918" style="position: absolute; top: 0px; left: 0px; width: 102px; height: 36px; overflow: hidden; bottom: auto; right: auto;">
                          <input type="file" multiple="multiple" accept="image/bmp, image/png, image/jpeg, image/jpg, image/gif" style="display: none;">
                          <label style="opacity: 0; width: 100%; height: 100%; display: block; cursor: pointer; background: rgb(255, 255, 255);"></label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> -->
                  <div class="weui-desktop-media-list-wrp weui-desktop-img-picker__list__wrp js_img-picker_wrapper" style="height: 790px;">
                    <div class="weui-desktop-img-picker__list">
                      <div v-for="(item, index) in imageData" :key="index" class="weui-desktop-img-picker__item" :class="{'selected' : newsSelect[index]}" @click="selsectMedia(2, item.id, index)">
                        <i role="img" aria-describedby="图片描述" title="图片描述" class="weui-desktop-img-picker__img-thumb" :style="'background-image: url(' + item.url + ')'">
                        <span class="image_dialog__checkbox" style="display: none;"></span></i>
                        <strong class="weui-desktop-img-picker__img-title">{{item.name}}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      <div class="dialog_ft">
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small" @click="dialogSendVisible = false">取消</el-button>
		  </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUserBtnByPId } from '@/api/upms/menu'
import { addWechat, deleteWechat, updateWechat, getWechatList, getWechatById, getMenuById, addMenu, updateMenu, getMenuListById, checkMenu, clearMenu, deleteMenu, createMenuById, getMediaList } from '@/api/wechat/list'
import { getSystem } from '@/api/upms/systemList'
import Pagination from '@/components/Pagination'
import waves from '@/directive/waves' // waves directive



export default {
  name: 'wechatList',
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
    const validateName = (rule, value, callback) => {
      function getLen() {
        let realLength = 0
        let charCode = -1;
        for (var i = 0; i < value.length; i++) {
            charCode = value.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
              realLength += 1;
            }
            else {
              realLength += 2;
            }
        }
        return realLength
      }
      let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/
      if (!value) {
          callback(new Error('请输入菜单名称'))
      } else if(!reg.test(value) || getLen(value) > rule.maxLen) {
        callback(new Error(rule.notice))
      } else {
          callback()
      }
    }
    const validateUrl = (rule, value, callback) => {
      let reg = /^https?:\/\/.*$/
      if (!value) {
          callback(new Error('请输入页面地址'))
      } else if(!reg.test(value)) {
        callback(new Error('请输入http://或https://开头的链接地址'))
      } else {
          callback()
      }
    }
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
        }]
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
      menuForm: {
        menuName: '',
        menuChildName: '',
        menuKey: '',
        appId: '',
        url: '',
        link: '',
        type: '',
        pagePath: ''
      },
      wechatType: 1,
      wechatLoading: false,
      wechatAble: false,
      menuClass: ['size1of1', 'size1of2', 'size1of3', 'size1of3'],
      wechatRules: {},
      menuList: [],
      menuRules: {
        menuName: [{
            required: true,
            trigger: 'blur',
            validator: validateName,
            notice: '仅支持中英文和数字，字数不超过4个汉字或8个字母',
            maxLen: 8
        }],
        menuChildName: [{
            required: true,
            trigger: 'blur',
            validator: validateName,
            notice: '仅支持中英文和数字，字数不超过8个汉字或16个字母',
            maxLen: 16
        }],
        link: [{
          required: true,
          trigger: 'blur',
          validator: validateUrl
        }],
        appId: [{
          required: true,
          trigger: 'blur',
          message: '请输入小程序ID'
        }],
        url: [{
          required: true,
          trigger: 'blur',
          validator: validateUrl
        }],
        pagePath: [{
          required: true,
          trigger: 'blur',
          message: '请输入小程序路径'
        }],
        menuKey: [{
          required: true,
          trigger: 'blur',
          message: '请填写运行代号'
        }]
      },
      isSelectMenu: false,
      isSelectMenuChild: false,
      selectWechatId: '',
      selectMenuId: '',
      selectMenuChildId: '',
      selectMenuIndex: 0,
      selectMenuChildIndex: 0,
      sendType: 'news',
      dialogSendVisible: false,
      richInput: '',
      newsData: [],
      newsSelect: [],
      newsSelectId: '',
      mediaList: {
        accessToken: '28_ETlGPkeQ8AyBEFxDAneGpqkwDjJEjjzCJ7094ygLcs9Md4yLVn3M8RJJr1k0doeneOoYJurdFhTnN-qxkQE74KJllosTNUJ2BXL-MD70fkEPnoqy-6_hgD1iLj2nmJk-4gNwLSNjksAGGDyIZOPjAFAETU',
        count: 20,
        offset: 0,
        type: ''
      },
      imageData: [],
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
        this.total = res.data.total
        this.allPages = res.data.pages
        this.listLoading = false
        if(Array.isArray(res.data.records)) {
          this.list = res.data.records
        }
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
      this.isSelectMenu = false
      this.isSelectMenuChild = false
      this.selectMenuId = ''
      this.selectMenuChildId = ''
      this.selectMenuIndex = 0
      this.selectMenuChildIndex = 0
      this.getMenuListById()
    },
    getMenuListById(type, name) {
      this.wechatLoading = true
      this.wechatAble = true
      getMenuListById({ accountId: this.selectWechatId }).then(res => {
        this.wechatLoading = false
        this.wechatAble = false
        if(Array.isArray(res.data)) {
          let resData = []
          res.data.forEach(item => {
            let obj = {
              id: item.id,
              name: item.name,
              url: item.url,
              type: item.type,
              appId: item.appId,
              pagePath: item.pagePath,
              menuChild: []
            }
            if(Array.isArray(item.menuList) && item.menuList.length > 0) {
              item.menuList.forEach(vItem => {
                obj.menuChild.push({
                  name: vItem.name,
                  id: vItem.id,
                  url: vItem.url,
                  type: vItem.type,
                  appId: vItem.appId,
                  pagePath: vItem.pagePath
                })
              })
            }
            resData.push(obj)
          })
          this.menuList = resData
        }
        if(type === 1) {
          this.isSelectMenu = true
          this.isSelectMenuChild = false
          if(name === 'add') {
            this.selectMenuIndex = this.menuList.length - 1
          }
          this.selectMenuId = this.menuList[this.selectMenuIndex].id
        } else if(type === 2) {
          this.isSelectMenuChild = true
          if(name === 'add') {
            this.selectMenuChildIndex = this.menuList[this.selectMenuIndex].menuChild.length - 1
          }
          this.selectMenuChildId = this.menuList[this.selectMenuIndex].menuChild[this.selectMenuChildIndex].id
        }
        
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
      this.addMenuPost(1)
    },
    saveMenu() {
      // 菜单修改保存
       this.$refs['menuRef'].validate((valid) => {
        if (valid) {
          let param = {}
          if(this.isSelectMenuChild) {
            param.name = this.menuForm.menuChildName
            param.id = this.selectMenuChildId
          } else {
            param.name = this.menuForm.menuName
            param.id = this.selectMenuId
          } 
          if(this.menuForm.type) {
            param.type = this.menuForm.type
          }
          if(this.menuForm.type === 'miniprogram') {
            param.appId = this.menuForm.appId
            param.url = this.menuForm.url
            param.pagePath = this.menuForm.pagePath
          } else if(this.menuForm.type === 'view') {
            param.url = this.menuForm.link
          } else if(this.menuForm.type === 'click') {
            param.menuKey = this.menuForm.menuKey
          }
          
          updateMenu(param).then(res => {
            this.$notify({
              title: '成功',
              message: '菜单保存成功！',
              type: 'success',
              duration: 2000
            })
            if(this.isSelectMenuChild) {
              this.getMenuListById(2)
            } else {
              this.getMenuListById(1)
            }
          })
        }
      })
    },
    createMenu() {
    // 发布菜单
      createMenuById({ accountId: this.selectWechatId }).then(res => {
        this.$notify({
          title: '成功',
          message: '发布成功！',
          type: 'success',
          duration: 2000
        })
        this.dialogWechatVisible = false
      })
    },
    selectMenu(index, id) {
      // 选择主菜单
      getMenuById({ id: id }).then(res => {
        this.menuForm.menuName = res.data.name 
        this.menuForm.type = res.data.type 
        this.menuForm.appId = res.data.appId 
        if(res.data.type === 'view') {
          this.menuForm.link = res.data.url
          this.menuForm.url = ''
        } else if(res.data.type === 'miniprogram') {
          this.menuForm.link = ''
          this.menuForm.url = res.data.url
          this.menuForm.pagePath = res.data.pagePath
        } else if(res.data.type === 'click') {
          this.menuForm.menuKey = res.data.menuKey
        }
      })
      this.isSelectMenu = true
      this.isSelectMenuChild = false
      this.selectMenuId = id
      this.selectMenuIndex = index
      this.selectMenuChildIndex = -1
    },
    addMenuChild(index) {
      // 添加子菜单
      if(this.menuList[index].menuChild.length > 0) {
        this.addMenuPost(2)
      } else {
        checkMenu({ id: this.selectMenuId }).then(res => {
          if(res.data) {
            this.$confirm('添加子菜单后，一级菜单的内容将被清除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              clearMenu({ id: this.selectMenuId }).then(res => {
                this.addMenuPost(2)
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })      
            })
          } else {
            this.addMenuPost(2)
          }
        })
      }
      
    },
    addMenuPost(type) {
      let param = {}
      param.accoutId = this.selectWechatId
      if(type === 1) {
        param.name = '菜单名称'
      } else {
        param.name = '子菜单名称'
        param.pId = this.selectMenuId
        type = 'view'
      }
      this.wechatLoading = true
      this.wechatAble = true
      addMenu(param).then(res => {
        this.wechatLoading = false
        this.wechatAble = false
        this.menuForm.type = ''
        this.menuForm.link = '' 
        this.menuForm.url = '' 
        this.menuForm.appId = ''
        this.menuForm.pagePath = ''
        if(type === 1) {
          this.menuForm.menuName = '菜单名称'
          this.isSelectMenu = true
          this.isSelectMenuChild = false
          this.getMenuListById(1, 'add')
        } else {
          this.menuForm.menuChildName = '子菜单名称'
          this.getMenuListById(2, 'add')
        }
      })
    },
    selectMenuChild(index, id) {
      // 选择子菜单
      this.isSelectMenuChild = true
      this.selectMenuChildId = id
      this.selectMenuChildIndex = index
      getMenuById({ id: id }).then(res => {
        this.menuForm.menuChildName = res.data.name 
        this.menuForm.type = res.data.type 
        this.menuForm.appId = res.data.appId 
        if(res.data.type === 'view') {
          this.menuForm.link = res.data.url
          this.menuForm.url = ''
        } else if(res.data.type === 'miniprogram') {
          this.menuForm.link = ''
          this.menuForm.url = res.data.url 
          this.menuForm.pagePath = res.data.pagePath
        } else if(res.data.type === 'click') {
          this.menuForm.menuKey = res.data.menuKey
        }
      })
    },
    deleteMenu(type) {
      // 删除菜单
      let dMsg = ''
      let id = ''
      let succcMsg = ''
      if(type === 1) {
        dMsg = `此操作将永久删除“${this.menuList[this.selectMenuIndex].name}”, 是否继续?`
        id = this.selectMenuId
        succcMsg = '菜单删除成功'
      } else {
        dMsg = `此操作将永久删除“${this.menuList[this.selectMenuIndex].menuChild[this.selectMenuChildIndex].name}”, 是否继续?`
        id = this.selectMenuChildId
        succcMsg = '子菜单删除成功'
      }
      this.$confirm(dMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.wechatLoading = true
        this.wechatAble = true
        deleteMenu({id: id }).then(response => {
          this.wechatLoading = false
          this.wechatAble = false
          this.isSelectMenu = false
          this.isSelectMenuChild = false
          this.selectMenuIndex = 0
          this.selectMenuChildIndex = 0
          this.$message({
            type: 'success',
            message: succcMsg
          })
          this.getMenuListById()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })   
      })
    },
    sendChange(val) {
      // 发送消息类型选择
      this.sendType = val;
      this.newsSelect = [];
      if (val === 'word') {
        this.$nextTick(() => {
          this.$refs['sendEdit'].focus();
        })
      }
    },
    sendSelect(val) {
      // 选择素材
      this.mediaList.type = val;
      this.dialogSendVisible = true;
      getMediaList(this.mediaList).then(res => {
        if (Array.isArray(res.data.item)) {
          if (this.mediaList.type === 'news') {
            this.newsData = res.data.item;
          } else if (this.mediaList.type === 'image') {
            this.imageData = res.data.item;
          }
        }
      })
    },
    selsectMedia(type, id, index) {
      this.newsSelect = [];
      this.newsSelect[index] = true;
      if (type === 1) {
        this.newsSelectId = id;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dialog{
    ul,li,a,p,h1,h2,h3,h4,h5,h6{
      list-style: none;
      margin: 0;
      padding: 0;
    }
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
    margin-bottom: 10px!important;
    color: #9a9a9a;
    font-size: 14px;
  }

  .w300{
    width: 300px;
  }

  .create-button{
    padding-top: 15px;
    text-align: right;
    width: 100%;
  }

  .save-button{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: right;
    padding: 0 15px 15px 0;
  }

  .menu_preview_area .sub_pre_menu_list li:first-child {
    border-top: 1px solid #d0d0d0;
  }

  .menu_preview_area .sub_pre_menu_list li>a:hover{
    background: #eee;
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

  .sub_pre_menu_list li a {
    padding: 0px 0.5em;
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

  .sub_pre_menu_box .arrow_out {
    bottom: -6px;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: dashed;
    border-color: transparent;
    border-bottom-width: 0;
    border-top-color: #d0d0d0;
    border-top-style: solid;
  }

  .sub_pre_menu_box .arrow {
    position: absolute;
    left: 50%;
    margin-left: -6px;
  }

  .sub_pre_menu_box .arrow_in {
    bottom: -5px;
    display: inline-block;
    width: 0;
    height: 0;
    border-width: 6px;
    border-style: dashed;
    border-color: transparent;
    border-bottom-width: 0;
    border-top-color: #fafafa;
    border-top-style: solid;
  }

  .sub_pre_menu_box .arrow {
    position: absolute;
    left: 50%;
    margin-left: -6px;
  }

  .msg_sender {
    border: 1px solid #e7e7eb;
  }

  .msg_tab {
    background-color: #fff;
  }

  .msg_sender .tab_navs_panel {
    overflow: hidden;
    *zoom: 1;
    background-color: #f6f8f9;
  }

  .msg_sender .tab_panel {
    border-bottom-left-radius: 3px;
    -moz-border-radius-bottomleft: 3px;
    -webkit-border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
    -moz-border-radius-bottomright: 3px;
    -webkit-border-bottom-right-radius: 3px;
  }

  .tab_panel {
    background-color: #fff;
    min-height: 216px;
  }

  .profile_link_msg_global.menu_send{
    margin-top: 4px;
  }

  .mini_tips.warn {
    color: #fa5151;
  }

  .menu_form_area .msg_sender .tab_navs_wrp{
      width: 384px;
  }
  
  .menu_form_area .msg_sender .tab_navs_wrp {
    width: 420px;
  }

  .msg_sender .tab_navs_wrp {
    overflow: hidden;
    *zoom: 1;
  }

  .msg_sender .tab_navs{
    background-color: #f6f8f9;
    line-height: 60px;
    height: 60px;
  }

  .msg_sender .tab_navs {
    white-space: nowrap;
    text-align: left;
    font-size: 0;
    border-bottom-width: 0;
    box-shadow: none;
  }

  .msg_sender .tab_navs {
      border-top-width: 0;
  }

  .tab_nav {
      float: left;
      font-size: 14px;
  }

  .tab_navs {
    *zoom: 1;
    text-align: center;
    line-height: 30px;
    border-bottom: 1px solid #e7e7eb;
    box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5);
    -moz-box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5);
    -webkit-box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.5);
  }

  .tab_nav.selected {
    background-color: #d4d5d5;
  }

  .msg_sender .tab_nav.selected {
    background-color: transparent;
  }

  .msg_sender .tab_nav {
    float: none;
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: top;
  }

  .tab_nav a {
    display: block;
    *height: 1%;
    text-decoration: none;
    color: #222;
    outline: 0;
    padding: 0 20px;
  }

  .tab_appmsg .icon_msg_sender {
    background-image: url(~@/assets/img/rich.svg);
  }

  .tab_appmsg.selected .icon_msg_sender, .tab_appmsg:hover .icon_msg_sender {
    background-image: url(~@/assets/img/rich_s.svg);
  }

  .tab_text .icon_msg_sender {
    background-image: url(~@/assets/img/word.svg);
  }

  .tab_text.selected .icon_msg_sender, .tab_text:hover .icon_msg_sender{
    background-image: url(~@/assets/img/word_s.svg);
  }

  .tab_img .icon_msg_sender {
    background-image: url(~@/assets/img/pic.svg);
  }

  .tab_img.selected .icon_msg_sender, .tab_img:hover .icon_msg_sender{
    background-image: url(~@/assets/img/pic_s.svg);
  }

  .tab_audio .icon_msg_sender {
    background-image: url(~@/assets/img/voice.svg);
  }

  .tab_audio.selected .icon_msg_sender, .tab_audio:hover .icon_msg_sender{
    background-image: url(~@/assets/img/voice_s.svg);
  }

  .tab_video .icon_msg_sender {
    background-image: url(~@/assets/img/video.svg);
  }

  .tab_video.selected .icon_msg_sender, .tab_video:hover .icon_msg_sender {
    background-image: url(~@/assets/img/video_s.svg);
  }

  .icon_msg_sender {
    margin-right: 3px;
    margin-top: -2px;
    *margin-top: 2px;
    display: inline-block;
    vertical-align: middle;
    width: 22px;
    height: 20px;
  }

  .msg_sender .tab_nav.selected .msg_tab_title, .msg_sender .tab_nav:hover .msg_tab_title {
    color: #44b549;
  }

  .msg_sender .tab_nav .msg_tab_title {
    color: #9a9a9a;
  }

  .msg_sender .tab_content {
    padding: 0;
  }

  .msg_sender .tab_content .inner {
    border-width: 0;
  }

  .tab_content .inner {
    border: 1px solid #c6c6c6;
    border-radius: 3px;
    padding: 20px;
  }

  .menu_form_area .msg_sender .tab_cont_cover {
    padding: 20px;
  }

  .create-type__list {
    text-align: center;
    padding: 45px 0;
  }

  .tab_cont_cover {
    overflow: hidden;
  }

  .create-type__list .create-type__item {
    display: inline-block;
    width: 130px;
    color: #9a9a9a;
    vertical-align: top;
    margin: 0 10px;
    -webkit-transition: all .3s;
    transition: all .3s;
  }

  .create-type__list .create-type__item:hover {
    text-decoration: none;
    background-color: #f6f8f9;
  }

  .create-type__list .create-type__item a {
    color: #9a9a9a;
    display: block;
    height: 100%;
    padding-top: 28px;
    padding-bottom: 34px;
    box-sizing: border-box;
  }

  .create-type__list .create-type__item .create-type__icon {
    display: inline-block;
    width: 40px;
    height: 40px;
  }

  .create-type__icon.file {
    background: url(~@/assets/img/msg_sender_z_@all49d030.png) 0 -44px no-repeat;
  }

  .create-type__list .create-type__item strong {
    font-weight: normal;
    display: block;
  }

  .tab_content .inner.no_extra {
    padding: 0;
    border-width: 0;
  }

  .msg_sender .emotion_editor {
    border-width: 0;
  }

  .emotion_editor {
    position: relative;
    z-index: 1;
    border: 1px solid #e7e7eb;
    border-radius: 0;
    -moz-border-radius: 0;
    -webkit-border-radius: 0;
  }

  .menu_form_area .msg_sender .emotion_editor .edit_area {
    height: 151px;
  }

  .emotion_editor .edit_area {
    padding: 14px 20px;
    outline: 0;
    word-wrap: break-word;
    word-break: break-all;
    border-top-left-radius: 0;
    -moz-border-radius-topleft: 0;
    -webkit-border-top-left-radius: 0;
    border-top-right-radius: 0;
    -moz-border-radius-topright: 0;
    -webkit-border-top-right-radius: 0;
    background-color: #fff;
    height: 188px;
  }

  .menu_form_area .msg_sender .editor_toolbar {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .editor_toolbar {
    *zoom: 1;
    padding: 0 20px;
    line-height: 36px;
    background-color: #fff;
    border-top: 1px solid #e7e7eb;
  }

  .msg_sender .editor_tip.opr_tips {
      display: none;
  }

  .editor_tip {
    float: right;
    color: #9a9a9a;
  }

  .appmsg_media_dialog {
      height: auto;
  }

  .dialog_media_container {
    position: relative;
    height: 498px;
  }

  .appmsg_media_dialog>.sub_title_bar {
      text-align: right;
  }

  .sub_title_bar.in_dialog {
    background-color: #fff;
    padding: 0 20px;
    border-bottom: 1px solid #e7e7eb;
  }

  .sub_title_bar {
    padding: 0 30px;
    line-height: 55px;
  }

  .appmsg_media_dialog .dialog_media_inner {
    height: 453px;
    position: relative;
  }

  .dialog_media_container .search_bar, .dialog_media_container .appmsg_create {
    display: inline-block;
    vertical-align: middle;
  }

  .dialog_media_container .search_bar .frm_input_box {
    width: 140px;
  }

  .frm_input_box.search.with_del {
    padding-right: 60px;
  }


  .appmsg_media_dialog .dialog_media_inner {
    height: 453px;
    position: relative;
  }

  .no_media_wrp {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: middle;
    text-align: center;
    width: 99%;
  }

  .vm_box {
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  .no_media_wrp .tips {
    margin-bottom: 40px;
    color: #9a9a9a;
  }

  .dialog_ft {
    margin: 0;
    padding-top: 25px;
    text-align: center;
    border-top: 1px solid transparent;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
  }

  .weui-desktop-img-picker {
    display: -ms-flexbox;
    display: flex;
  }

  .weui-desktop-img-picker > .weui-desktop-grid__item:first-child {
    width: 190px;
    margin-right: -1px;
  }

  .weui-desktop-img-category {
    border-right: 1px solid #E4E8EB;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
  }

  .weui-desktop-grid__item {
    float: left;
    width: 100%;
    box-sizing: border-box;
  }

  .weui-desktop-img-category .weui-desktop-menu {
    height: 400px;
    overflow-y: auto;
    -ms-flex-positive: 1;
    flex-grow: 1;
  }

  .weui-desktop-img-category__add {
    display: block;
    line-height: 40px;
    padding-left: 32px;
  }

  .weui-desktop-img-category .weui-desktop-menu__item .weui-desktop-menu__link_current {
    border-left-color: transparent;
    background-color: rgba(0, 0, 0, 0.03);
  }

  .weui-desktop-img-category .weui-desktop-menu__link {
    padding-left: 28px;
    line-height: 40px;
  }

  .weui-desktop-menu__item>.weui-desktop-menu__link_current {
    border-left-color: #44b549;
  }

  .weui-desktop-menu__item>.weui-desktop-menu__link {
    padding-left: 20px;
    line-height: 50px;
  }

  .weui-desktop-menu__link_current {
    color: #44b549;
  }

  .weui-desktop-menu__link {
    color: #222;
    display: block;
    border-left: 4px solid transparent;
  }

  .weui-desktop-img-category__title {
    color: #353535;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    max-width: 8em;
    font-weight: 400;
  }

  .weui-desktop-img-category__size {
    color: #9A9A9A;
    font-style: normal;
  }

  .weui-desktop-img-category .weui-desktop-popover__wrp {
    display: inline-block;
    vertical-align: top;
  }

  .weui-desktop-popover__wrp {
    display: inline;
    position: relative;
    font-size: 14px;
  }

  .weui-desktop-popover {
    width: 280px;
    position: absolute;
    z-index: 500;
    text-align: left;
    color: #353535;
    line-height: 1.6;
    white-space: normal;
    word-wrap: break-word;
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
  }

  .weui-desktop-img-picker__list__area {
    border-left: 1px solid #E4E8EB;
  }

  .weui-desktop-img-picker__list__wrp {
    position: relative;
    margin-top: 30px;
    overflow: auto;
  }

  .weui-desktop-img-picker__list {
    margin: 0 auto;
    width: 725px;
    overflow: auto;
  }

  .weui-desktop-img-picker__item {
    cursor: pointer;
    position: relative;
    float: left;
    width: 110px;
    margin: 0 13px 20px 0;
  }

  .weui-desktop-img-picker__item.selected .weui-desktop-img-picker__img-thumb::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #44B549;
    opacity: 0.1;
  }

  .weui-desktop-img-picker__item.selected .weui-desktop-img-picker__img-thumb {
    box-shadow: 0 0 0 2px #44B549 inset;
  }

  .weui-desktop-img-picker__item {
    cursor: pointer;
    position: relative;
    float: left;
    width: 110px;
    margin: 0 13px 20px 0;
  }

  .weui-desktop-img-picker__img-thumb {
    position: relative;
    display: block;
    width: 110px;
    height: 110px;
    -webkit-background-size: contain;
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    box-sizing: border-box;
    border-radius: 2px;
    overflow: hidden;
  }

  .weui-desktop-img-picker__img-title {
    margin-top: 8px;
    display: block;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: center;
  }

  .image_dialog__checkbox, .image_dialog__radio {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 20px;
    height: 20px;
    border: 1px solid #fff;
    border-radius: 1px;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .media_dialog.appmsg_list {
      position: relative;
      padding: 28px 140px;
      height: 345px;
      margin: 0;
      overflow-y: auto;
  }

  .media_dialog .appmsg_col {
    width: 48%;
  }

  .appmsg_col {
    display: inline-block;
    *display: inline;
    *zoom: 1;
    vertical-align: top;
    width: 32%;
    text-align: left;
    font-size: 14px;
    letter-spacing: normal;
  }

  .appmsg {
    position: relative;
    overflow: hidden;
    margin-bottom: 20px;
    border: 1px solid #e7e7eb;
    background-color: #fff;
    color: #9a9a9a;
  }

  .appmsg_content {
    position: relative;
    *zoom: 1;
  }

  .appmsg_info {
    -moz-text-align-last: auto;
    text-align-last: auto;
    font-size: 13px;
    line-height: 20px;
    margin: 0 14px;
    padding: 12px 0;
    border-bottom: 1px solid #e7e7eb;
  }

  .appmsg_item {
    position: relative;
    padding: 12px 14px;
  }

  .appmsg_mask {
    display: none;
    font-size: 50px;
  }

  .appmsg_date {
    font-weight: 400;
    font-style: normal;
  }

  .card_appmsg_inner {
    position: relative;
    padding-top: 56.25%;
  }

  .edit_mask.preview_mask {
    display: none;
    color: rgba(255,255,255,0.8);
  }

  .edit_mask {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6)!important;
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr='#99000000',endcolorstr = '#99000000');
    color: #fff;
    z-index: 1;
    text-align: center;
    padding: 14px;
  }

  .simple_card_media .card_appmsg_hd {
    padding: 15px;
  }

  .weui-desktop-vm_primary {
    width: 2000px;
  }

  .weui-desktop-vm_default, .weui-desktop-vm_primary {
    display: table-cell;
    vertical-align: middle;
    word-wrap: break-word;
    word-break: break-all;
  }

  .simple_card_media .card_appmsg_title {
      position: static;
      color: #353535;
  }

  .card_appmsg_title {
    position: absolute;
    left: 15px;
    right: 15px;
    bottom: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    color: #fff;
    font-weight: 400;
    z-index: 1;
  }

  .simple_card_media .card_appmsg_title a {
    color: #353535;
  }

  .card_appmsg_title a {
    color: #fff;
  }

  .simple_card_media .card_appmsg_bd {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding-top: 56.25%;
  }

  .weui-desktop-vm_default {
    white-space: nowrap;
  }

  .card_appmsg_thumb {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: auto;
    height: auto;
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-color: #f6f8f9;
  }

  .card_appmsg_thumb:before {
    content: " ";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.3);
  }

  .appmsg.selected .appmsg_mask,.appmsg:hover .appmsg_mask {
    display: block;
  }

  .appmsg .icon_card_selected {
    margin-top: 100px;
  }
</style>
