<template>
  <!-- <div class="app-container"> -->
  <div v-loading="saveLoading" class="app-container">
    <el-card class="box-card">
      <div class="text item">
        <span style="#303133">当前分类：</span>{{productTitle}}
        <el-button v-if="eiditId.length === 0" type="primary" size="medium" v-waves class="filter-item" @click="changeType">切换分类</el-button>
        <!-- <el-cascader :options="addressOptions" :props="addressProps"></el-cascader> -->
      </div>
    </el-card>
    <el-form v-loading="diaLoading" ref="productForm" :model="addForm" label-position="right" label-width="165px" style="">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div  class="text item">
        <el-form-item label="标题" prop="title"
        :rules="{
            required: true, message: '标题必填', trigger: 'change'
        }">
          <el-input 
          class="long-input" 
          v-model.trim="addForm.title" 
          size="medium" 
          maxlength="100" 
          show-word-limit
          placeholder="请输入名称，如：品种+口感+产地+用途等" />
        </el-form-item>
        <template v-for="(item, index) in baseData">
          <el-form-item 
          v-if="item"
          :key="index" 
          :label="item.name" 
          :rules="{
            required: item.isRequire === 1, message: `${item.name}必填`, trigger: 'blur', type: (item.inputType === 0 || item.inputType === 2) ? 'array' : '' 
          }"
          :prop="'generate.' + index + '.list'">
            <template v-if="item.inputType === 0">
              <el-cascader
                :ref="item.id"
                v-model="addForm.generate[index].list"
                :label="item.id"
                :placeholder="item.hint"
                :options="addressOptions"
                :style="{width: item.length + 'px'}"
                :props="addressData[item.id]"
                style="width: 200px;"
                class="filter-item mr20">
              </el-cascader>
              <span v-if="item.exp !== null">{{item.exp}}</span>
            </template>
            <template v-else-if="item.inputType === 1">
              <el-radio-group v-model="addForm.generate[index].list" size="small">
                <el-radio v-for="(radioItem, radioIndex) in item.valueSet" :key="radioIndex" :label="radioItem.value" border>{{radioItem.value}}</el-radio>
              </el-radio-group>
              <span v-if="item.exp !== null">{{item.exp}}</span>
            </template>
            <template v-else-if="item.inputType === 2">
              <el-checkbox-group v-model="addForm.generate[index].list" @change="((val) => checkChange(val, index))">
                <el-checkbox v-for="(checkboxItem, checkboxIndex) in item.valueSet" :label="checkboxItem.value" :key="checkboxIndex">{{checkboxItem.value}}</el-checkbox>
              </el-checkbox-group>
              <el-checkbox :indeterminate="isIndeterminate" v-model="addForm.generate[index].checkAll" @change="((val) => handleCheckAllChange(val, index, item.id))">全选</el-checkbox>
              <span v-if="item.exp !== null">{{item.exp}}</span>
            </template>
            <template v-else-if="item.inputType === 3">
              <el-select v-model="addForm.generate[index].list" size="medium" maxlength="64" :placeholder="item.hint">
                <el-option v-for="(selectItem, selectIndex) in item.valueSet" :key="selectIndex" :label="selectItem.value" :value="selectItem.value"></el-option>
              </el-select>
              <span v-if="item.exp !== null">{{item.exp}}</span>
            </template>
            <template v-else-if="item.inputType === 4">
              <el-input class="long-input" v-model.trim="addForm.generate[index].list" size="medium" maxlength="32" :placeholder="item.hint" style="width: 200px" />
              <!-- <span v-if="item.exp !== null" style="color: #606266">{{item.exp}}</span> -->
            </template>
            <template v-else>
              <span>{{addForm.generate[index].list}}</span>
            </template>
          </el-form-item>
        
        </template>
        <el-form-item v-for="(selfItem, selfIndex) in addForm.selfProp" :key="selfIndex + 'x'" :label="addForm.selfProp[selfIndex].name">
          <span class="mr40">{{addForm.selfProp[selfIndex].list}}</span>
          <el-button type="danger" plain size="small" v-waves @click="removeSelfProp(selfIndex)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" plain @click="addSelfProp">
            新增属性
          </el-button>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>销售信息</span>
      </div>
      <el-tabs v-loading="moreLoading" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="默认报价方式" name="first">
          <div  class="text item">
            <el-form-item 
              label="规格（计量单位共用）" 
              :prop="'unit'"
              :rules="{
                required: activeName === 'first', message: '计量单位必填', trigger: 'blur'     
              }">
              <el-select v-model="addForm.unit" size="medium" maxlength="64" placeholder="请选择" @change="((val) => unitChange(val, 'auto'))">
                <el-option v-for="(item, index) in sellData" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item 
              v-if="showStyle.type === '2'" 
              :prop="'sku.'+showStyle.id+'.store'"
              :rules="{
                required: activeName === 'first', message: '库存必填，且为整数', trigger: 'blur',  pattern:/^([1-9]\d*|0)$/,
              }"
              label="库存">
                <el-input class="short-input" v-model.trim="addForm.sku[showStyle.id].store" size="medium"  maxlength="10" />
            </el-form-item>
            <el-form-item>  
              <div v-if="showStyle.type === '2'">
                 <el-table
                  :data="addForm.sku[showStyle.id].list"
                  style="width: 700px"
                  border
                  >
                  <el-table-column  label="起批量" width="220" align="center">
                    <template slot-scope="scope">
                      <span class="mr5">起批数</span><el-input class="table-input" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].number" size="small" maxlength="12" @keyup.native="numValid(addForm.sku[showStyle.id].list[scope.$index], 'number', 2)" />
                    </template>
                  </el-table-column>
                  <el-table-column label="价格(元)" width="220" align="center">
                    <template slot-scope="scope">
                      <span class="mr5">单价</span><el-input class="table-input" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].price" size="small" maxlength="12" @keyup.native="numValid(addForm.sku[showStyle.id].list[scope.$index], 'price', 1)" />
                    </template>
                  </el-table-column>
                  <el-table-column min-width="250px" label="操作" align="center">
                    <template slot-scope="scope">
                      <div style="text-align: left;padding-left: 50px;">
                        <el-button v-show="scope.$index > 0 || addForm.sku[showStyle.id].list.length > 1" size="mini" type="danger" plain @click="removeStair(scope.$index, showStyle.id)">
                          删除
                        </el-button>
                        <el-button v-show="scope.$index < 2 && scope.$index === addForm.sku[showStyle.id].list.length - 1" size="mini" type="primary" plain @click="addStair(scope.$index, showStyle.id)">
                          新增规格
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-else-if="showStyle.type === '1'">
                <el-table
                  :data="addForm.sku[showStyle.id].list"
                  style="max-width: 1140px"
                  border>
                  <el-table-column  label="规格名称" width="220" align="center">
                    <template slot-scope="scope">
                      <el-input class="table-input mr5" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].name" size="small" maxlength="12" @keyup.native="numValid(addForm.sku[showStyle.id].list[scope.$index], 'name', 1)" /><span>{{valueSuffixObj[showStyle.id]}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="起批量" width="220" align="center">
                    <template slot-scope="scope">
                      <el-input class="table-input" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].number" size="small" maxlength="12" @keyup.native="numValid(addForm.sku[showStyle.id].list[scope.$index], 'number', 1)" />
                    </template>
                  </el-table-column>
                  <el-table-column label="价格(元)" width="220" align="center">
                    <template slot-scope="scope">
                      <el-input class="table-input mr5" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].price" size="small" maxlength="12" @keyup.native="numValid(addForm.sku[showStyle.id].list[scope.$index], 'price', 1)" /><span>元</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="库存" width="220" align="center">
                    <template slot-scope="scope">
                      <el-input class="table-input" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].store" size="small" maxlength="12" @keyup.native="numValid(addForm.sku[showStyle.id].list[scope.$index],'store', 3)" />
                    </template>
                  </el-table-column>
                  <el-table-column min-width="250px" label="操作" align="center">
                    <template slot-scope="scope">
                      <div style="text-align: left;padding-left: 50px;">
                        <el-button v-show="scope.$index > 0 || addForm.sku[showStyle.id].list.length > 1" size="mini" type="danger" plain @click="removeBox(scope.$index, showStyle.id)">
                          删除
                        </el-button>
                        <el-button v-show="scope.$index === addForm.sku[showStyle.id].list.length - 1" size="mini" type="primary" plain @click="addBox(scope.$index, showStyle.id)">
                          新增规格
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-if="tableShow" class="el-form-item__error">
                请填写完整表格信息
              </div>
            </el-form-item>
          </div>
        </el-tab-pane>
        <el-tab-pane label="更多报价方式" name="second">
          <el-form-item 
            label="计量单位" 
            :prop="'unitMore'"
            :rules="{
              required: activeName === 'second', message: '计量单位必填', trigger: 'blur'     
            }">
            <el-select v-model="addForm.unitMore" size="medium" maxlength="64" placeholder="请选择" @change="((val) => unitChange(val, 'more'))">
              <el-option v-for="(item, index) in sellMoreData" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item 
            v-for="(item, pIndex) in addForm.moreSpec" :key="pIndex"
            :prop="'moreSpec.'+pIndex+'.selectValue'"
            :rules="{
              required: true, message: '规格必选', trigger: 'blur'     
            }"
            :label="'规格' + (pIndex + 1)" 
            >
            <el-select v-model="addForm.moreSpec[pIndex].selectValue" filterable allow-create size="medium" maxlength="64" placeholder="请选择" @change="((val) => unitChange(val, 'spec', pIndex))">
              <el-option v-for="(item, index) in sellSpeData" :key="index" :label="item.name" :value-key="item.id" :value="item.id"></el-option>
            </el-select>
            <el-button type="danger" plain size="small" v-waves @click="removeMoreSpec(pIndex)">删除</el-button>
            <div v-show="addForm.moreSpec[pIndex].isSpecSelect">
              <el-input
                v-for="(item, index) in addForm.moreSpec[pIndex].list" :key="index"
                placeholder="请输入规格值"
                required
                v-model="addForm.moreSpec[pIndex].list[index].value"
                size="mini"
                class="table-input mr5"
                clearable
                @clear="removeMoreSpecValue(pIndex, index)"
                @blur="(event) => specValueBlur(event, addForm.moreSpec[pIndex].list[index].value)">
              </el-input>
              <el-button type="primary" plain size="mini" v-waves @click="addMoreSpecValue(pIndex)">添加</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="addForm.moreSpec.length < 2">
            <el-button v-show="moreSpecTableShow" type="primary" plain size="medium" v-waves @click="addMoreSpec">添加规格</el-button>
          </el-form-item>
          <el-form-item>  
            <el-table
              v-if="moreSpecTableShow && addForm.moreSpec.length > 0"
              :data="addForm.moreSpecData"
              :span-method="arraySpanMethod"
              border>
              <el-table-column
                v-for="(columnItem, columnIndex) in addForm.moreSpec" :key="columnIndex"
                :label="columnItem.selectValue"
                align="center"
                >
                <template slot-scope="scope">
                  <span>{{addForm.moreSpecData[scope.$index].itemValue[columnIndex].value}}</span>
                </template>
              </el-table-column>
              
              <el-table-column
                label="起批量(相同)"
                align="center"
                >
                <template slot-scope="scope">
                  <el-input v-if="scope.$index === 0" v-model.trim="addForm.moreSpecData[0].startNum" class="table-input" size="small" maxlength="12" @keyup.native="numValid(addForm.moreSpecData[scope.$index], 'startNum', 2)" />
                  <div v-else :title="addForm.moreSpecData[0].startNum" style="display:inline-block;width: 120px;text-align:left;padding: 0 15px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{addForm.moreSpecData[0].startNum}}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="价格(元)"
                align="center"
                >
                <template slot-scope="scope">
                  <el-input v-model.trim="addForm.moreSpecData[scope.$index].price" class="table-input" size="small" maxlength="12" @keyup.native="numValid(addForm.moreSpecData[scope.$index], 'price', 1)" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="库存">
                <template slot-scope="scope">
                  <el-input v-model.trim="addForm.moreSpecData[scope.$index].store" class="table-input" size="small" maxlength="12" @keyup.native="numValid(addForm.moreSpecData[scope.$index], 'store', 3)" />
                </template>
              </el-table-column>
            </el-table>
            <div v-if="moreTableShow" class="el-form-item__error">
              请填写完整表格信息
            </div>
          </el-form-item> 
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图文描述</span>
      </div>
      <div  class="text item">
        <el-form-item 
          label="商品视图" required>
          <el-upload
            ref="uplodadImg"
            action=""
            list-type="picture-card"
            :class="{disabled: uploadDisabled}"
            :http-request="uploadImg"
            :multiple="true"
            :limit="imgLimit"
            :on-preview="handlePictureCardPreview"
            :file-list="addForm.imgsBox"
            :before-upload="beforeImgUpload"
            :on-exceed="handleExceed"
            :on-change="handleLimit"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>
            <p style="margin: 0;">还能添加<span style="color: #ff0000">{{10 - addForm.imgsBox.length}}</span>张图片或视频；</p>
            <p style="margin: 0;">* 仅支持3M以内jpg、jpeg、gif、png格式图片上传；图片建议尺寸500*500；</p>
            <p style="margin: 0;">* 仅支持10mb以内mp4视频上传；</p>
            <p style="margin: 0;">* 文件大小不能超过3MB，包括图片和视频；图片建议尺寸500*500；支持JPG、GIF、PNG格式；</p>
            <p style="margin: 0;">* 默认第一个文件为商品封面图，如果是视频则取第一帧画面作为封面图。</p>
          </div>
          <div v-if="showPackgeErr" class="el-form-item__error">
            请上传商品视图
          </div>
        </el-form-item>
        <el-form-item 
          label="介绍文案" 
          :rules="{
            required: true, message: '介绍文案必填', trigger: 'blur'
          }"
          prop="remark">
          <el-input
            class="long-input"
            v-model.trim="addForm.remark"
            maxlength="1000"
            show-word-limit
            :autosize="{ minRows: 5}"
            type="textarea"
            placeholder="请输入介绍内容"
          />
        </el-form-item>
      </div>
    </el-card>
    <el-card class="">
      <div slot="header" class="clearfix">
        <span>物流信息</span>
      </div>
      <div  class="text item">
        <el-form-item 
        label="运费设置"
        prop="freight"
        :rules="{
            required: true, message: '请选择运费方式', trigger: 'blur'
          }">
          <el-select v-model="addForm.freight" size="medium" maxlength="64" placeholder="请选择" @change="freightChange">
            <el-option
              v-for="item in freightData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-link type="primary" :underline="false" @click="createExpress">新建运费模板</el-link>
        </el-form-item>
        <el-form-item 
        v-if="addForm.freightType === 2" 
        label="物流体积"
         prop="freightSize"
        :rules="{
            required: true, message: '体积必填,且必须为数字', trigger: 'blur', pattern:/^(((0|([1-9]\d*))\.)?\d+)$/,
          }">
          <el-input v-model="addForm.freightSize" style="width:200px;" maxlength="12" /> <span class="freight-type">立方</span> <span class="freight-des">当前运费模板，按物流体积（含包装）计</span>
        </el-form-item>
        <el-form-item 
        v-if="addForm.freightType === 3"
        label="物流重量"
        prop="freightWeight"
        :rules="{
            required: true, message: '重量必填,且必须为数字', trigger: 'blur',pattern:/^(((0|[1-9]\d*)\.)?\d+)$/,
        }">
          <el-input v-model.trim="addForm.freightWeight" style="width:200px;" maxlength="12" /> <span class="freight-type">千克</span> <span class="freight-des">当前运费模板，按物流重量（含包装）计</span>
        </el-form-item>
      </div>
    </el-card>
  </el-form>
    <div class="bottom-box">
      <div>
        <el-button v-waves class="filter-item" @click="submitForm('productForm', 2)">预览</el-button>
        <el-button v-waves class="filter-item" @click="submitForm('productForm', 0)">保存待上架</el-button>
        <el-button type="primary" v-waves class="filter-item" @click="submitForm('productForm', 1)">上架出售</el-button>
      </div>
    </div>
    <div class="self-diolog" v-if="previewDialog">
      <div class="preview-box">
        <div class="preview">
          <div class="calrousel-box" :style="{ background: 'no-repeat url(' + previewUrl + ')', backgroundSize: 'cover' }">
            <div class="left-icon">
              <img :src="icons.back" alt="">
            </div>
            <div class="right-icon">
              <img :src="icons.share" alt="">
            </div>
            <div class="num">1/{{goodsVo.goodsImgList.length}}</div>
          </div>
          <div class="title-box">
            <div v-if="showStyle.type === '1'" class="title">
              <span v-if="goodsVo.goodsSkuList.length > 1" class="price">
                {{goodsVo.goodsSkuList[0].price | money}} ~ {{goodsVo.goodsSkuList[goodsVo.goodsSkuList.length - 1].price | money}}
              </span>
              <span v-else class="price">
                {{goodsVo.goodsSkuList[0].price | money}}
              </span>
              <span>/{{goodsVo.goodsSkuList[0].skuAttrValues[0].name}}</span>
              <!-- <span class="place">{{placeProduct}}</span> -->
            </div>
            <div v-else-if="showStyle.type === '2'" class="title clearfix">
              <div class="stair-title" v-for="(item, index) in goodsVo.goodsSkuList[0].priceExpList" :key="index">
                <div><span class="price">{{item.price | money}}</span>/<span>{{goodsVo.goodsSkuList[0].skuAttrValues[0].name}}</span></div>
                <div>{{item.startQuantity}}{{goodsVo.goodsSkuList[0].skuAttrValues[0].name}}起批</div>
              </div>
            </div>
            <div v-if="showStyle.type == '3'" class="title">
              <span v-if="goodsVo.goodsSkuList.length > 1" class="price">
                {{goodsVo.goodsSkuList[0].price | money}} ~ {{goodsVo.goodsSkuList[goodsVo.goodsSkuList.length - 1].price | money}}
              </span>
              <span v-else class="price">
                {{goodsVo.goodsSkuList[0].price | money}}
              </span>
              <span>/{{productUnit}}</span>
              <div class="start-num">{{goodsVo.goodsSkuList[0].startNum}}{{productUnit}}起批</div>
            </div>
            <div class="des">{{goodsVo.name}}</div>
            <div class="message-box">
              <span>0人看过</span>
              <span>订单数0</span>
              <span :title="addForm.freightName">{{addForm.freightName}}</span>
            </div>
          </div>
          <div v-if="showStyle.type === '1'" class="product-box">
            <div class="tc">
              <span class="title-des">规格</span>
            </div>
            <ul class="product-unit">
              <li class="clearfix" v-for="(item, index) in goodsVo.goodsSkuList" :key="index">
                <span>{{item.startNum}}{{item.skuAttrValues[0].name}}起批</span>
                <span class=" tc">{{item.skuAttrValues[0].value}}{{valueSuffixObj[showStyle.id]}}</span>
                <span class="tr">{{item.price | money}}/{{item.skuAttrValues[0].name}}</span>
              </li>
            </ul>
          </div>
          <div v-if="showStyle.type === '3'" class="product-box">
            <div class="tc">
              <span class="title-des">规格</span>
            </div>
            <ul class="product-unit">
              <li class="clearfix" v-for="(item, index) in goodsVo.goodsSkuList" :key="index">
                <div class="unit-name">
                  <span class="mr20" v-for="(vItem, vIndex) in item.skuAttrValues" :key="vIndex">{{vItem.name}} {{vItem.value}}</span>
                </div>
                <div class="unit-price tr">{{item.price | money}}/{{productUnit}}</div>
              </li>
            </ul>
          </div>
          <div class="product-box">
            <div class="tc">
              <span class="title-des">商品属性</span>
            </div>
            <ul class="product-prop">
              <li class="clearfix" v-for="(item, index) in goodsVo.goodsAttrList" :key="index">
                <div class="prop">{{item.name}}</div>
                <div class="value">
                  <template v-if="item.goodsAttrValueList[0].remark">
                    <span>{{item.goodsAttrValueList[0].remark}}</span>
                  </template>
                  <template v-else>
                    <span class="mr5" v-for="(vItem, vIndex) in item.goodsAttrValueList" :key="vIndex">{{vItem.value}}</span>     
                  </template>
                </div>
              </li>
            </ul>
          </div>
          <div class="product-detail">
            <div class="tc">
              <span class="title-des">商品详情</span>
            </div>
            <p>{{goodsVo.detail}}</p>
            <div v-for="(item, index) in goodsVo.goodsImgList" :key="index">
              <img class="mb10" v-if="item.type !== 2" :src="item.imgUrl" alt="">
            </div>
          </div>
        </div>
        <div class="product-buy">
            <div class="in">
              <div>
                <img :src="icons.love" alt="">
              </div>
              收藏
            </div>
            <div class="in">
              <div>
                <img :src="icons.order" alt="">
              </div>
              进货单
            </div>
            <div class="cart">加入进货单</div>
            <div class="buy">立即购买</div>
        </div>
      </div>
      <div class="self-close" @click="previewDialog = false">
        <i class="el-icon-close"></i>
      </div>
    </div>
    <el-dialog :visible.sync="dialogProp" :closeOnClickModal="false" title="添加属性">
      <el-form v-loading="diaLoading" :rules="ruuuu" ref="selfForm" :model="selfProp" label-width="100px" label-position="left">
          <el-form-item label="属性名" :prop="'name'">
            <el-input v-model.trim="selfProp.name" maxlength="20" placeholder="请输入属性名" />
          </el-form-item>
          <el-form-item label="属性值" :prop="'value'">
            <el-input v-model.trim="selfProp.value" maxlength="20" placeholder="请输入属性值" />
          </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogProp=false">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <template v-if="dialogType === 1">
        <div>
          <img width="100%" :src="dialogImageUrl" alt="">
        </div>
      </template>
      <template v-else-if="dialogType === 2">
        <div style="text-align: center;">
          <video style="max-width: 100%;max-height: 800px;" :src="dialogImageUrl" controls="controls">
          您的浏览器不支持视频播放。
          </video>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getByCategoryId, getUnit, saveGoods, editGoods, getUnitList, getSpeList, getGoodsDetail } from '@/api/goods/list'
import { getFreight } from '@/api/goods/logistics'
import { getAd } from '@/api/upms/strict'
import { fileUpload } from '@/api/goods/upload'
import loveImg from '@/assets/img/love.png'
import backImg from '@/assets/img/back.png'
import orderImg from '@/assets/img/order.png'
import shareImg from '@/assets/img/share.png'
let id = 0;
let vm = {
  name: 'productEdit',
  directives: { waves },
  data() {
    vm = this;
    let checkName = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('属性名不能为空!'))
      } else if(value === '标题') {
        return callback(new Error('属性名已存在'))
      } 
      
      this.addForm.generate.forEach(item => {
        if(item.name === value) {
          return callback(new Error('属性名已存在'))
        }
      })
      this.addForm.selfProp.forEach(item => {
        if(item.name === value) {
          return callback(new Error('属性名已存在'))
        }
      })
      callback();
    };
    return {
      categoryId: '',
      eiditId: '',
      baseData: [],
      showPackgeErr: false,
      skuId: '',
      specId: '',
      unitName: '',
      uploadDisabled: false,
      icons: {
        back: backImg,
        love: loveImg,
        share: shareImg,
        order: orderImg
      },
      goodsVo: {
        goodsAttrList: [],
        goodsImgList: [],
        goodsSkuList: [],
        name: '',
        detail: ''
      },
      baseCenterData: [],
      sellData: [],
      sellMoreData: [],
      sellSpeData: [],
      freightData: [],
      previewUrl: '',
      placeProduct: '',
      ruuuu: {
       name: [
          { required: true, validator: checkName, trigger: 'blur' }
        ],
        value: [
          { required: true, message: '属性只能不能为空', trigger: 'blur' }
        ]
      },
      selfProp: {
        name: '',
        value: ''
      },
      boxData: [],
      treeProps: {},
      treeValue: '',
      productTitle: '',
      imgLimit: 10,
      activeName: 'first',
      addressOptions: [],
      checkboxObj: {},
      addressObj: {},
      cascader: '',
      cascaderId: '',
      addressIndex: -1,
      addressData: {},
      tableShow: false,
      moreTableShow: false,
      addForm: {
        title: '',
        remark: '',
        freight: '',
        freightType: '',
        freightSize: '',
        freightWeight: '',
        freightName: '',
        sku: {},
        fileType: 1,
        generate: [],
        imgsBox: [],
        unitMore: '',
        unit: '',
        selfProp: [],
        selfRules: {
          name: [
            { required: true, validator: checkName, trigger: 'blur' }
          ],
          value: [
            { required: true, trigger: 'blur' }
          ]
        },
        moreSpec: [],
        moreSpecType: 'auto',
        moreSpecData: [{
          valueObj: [{
            name: ''
          }],
          startNum: '',
          price: '',
          store: ''
        }]
      },
      showAble: {},
      showStyle: {
        type: '',
        id: '',
      },
      role: {
        name: ''
      },
      valueSuffixObj: {},
      combineObj: {},
      saveLoading: false,
      isCombine: false,
      moreSpecTable: [],
      moreSpecTableShow: false,
      isIndeterminate: false,
      logisticsValue: '',
      previewDialog: false,
      diaLoading: false,
      moreLoading: false,
      dialogType: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      dialogProp: false,
      spanArr: [],
      goodsSkuData: [],
      skuCounter: 0,
      productUnit: ''
    }
  },
  components: {  },
  computed: {

  },
  created() {
    this.categoryId = this.$route.query.id
    if(this.$route.query.eid) {
      this.eiditId = this.$route.query.eid
    }
    this.getFreight()
    if(this.$route.query.des !== undefined) {
        this.$route.query.des.forEach((item) => {
        this.productTitle += this.productTitle.length === 0 ? item : '-' + item
      })
    }
  },
  methods: {
    getByCategoryId() {
      // 通过ID获取规格模板
      let CateParam = {
        categoryId : this.categoryId,
      }
      if(this.eiditId.length === 0) {
        CateParam.status = 1
      }
      this.listLoading = true
      getByCategoryId(CateParam).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          let adData = {}
          let generate = []
          res.data.forEach((item, index) => {
            let obj = {}
            if(item.inputType === 0) {
              this.addressIndex++
              let aObj = {
                lazy: true,
                lazyLoad (node, resolve) {
                  getAd({ parentId: node.level === 0 ? 0 : node.data.id }).then( res => {
                    if(Array.isArray(res.data)) {
                      res.data.map((lazyItem) => {
                        lazyItem.leaf = lazyItem.haveChild === 0 || item.valueSet[0].value == node.level
                      })
                      resolve(res.data);
                    }
                  })
                },
                value: "id",
                label: "shortName",
              }
              // JSON.stringify(aObj)
              adData[item.id] = aObj
              obj.list= []
              obj.isRemark = true
              this.checkboxObj[index] = item.valueSet.map((itemIn) => {
                return itemIn.value
              })
            } else if(item.inputType === 2) {
              obj.list= []
              obj.checkAll = false
              this.checkboxObj[index] = item.valueSet.map((itemIn) => {
                return itemIn.value
              })
            } else {
              obj.list = ''
            }
            obj.id = item.id
            obj.sort = item.sort
            obj.name = item.name 
            obj.nameGroup = item.nameGroup
            generate.push(obj)
          });
          this.addressData = adData
          this.addForm.generate = generate
        }
        if(this.eiditId.length === 0) {
           this.baseData = res.data
           this.getUnit()
        } else {
          this.baseCenterData = res.data
          // this.getUnitList()
          this.getGoodsDetail()
          
        }
       
      })
    },
    getGoodsDetail() {
      getGoodsDetail({ goodsId: this.eiditId }).then(res => {
        let editBaseData = []
        let generate = []
        this.addForm.title = res.data.goods.name
        this.addForm.remark = res.data.goods.detail
        this.productTitle = res.data.categoryPath
        this.addForm.freight = res.data.goods.postSettingId
        this.freightData.forEach(item => {
          if(item.id === this.addForm.freight) {
            this.addForm.freightType = item.type
            this.addForm.freightName = item.name
            return false
          }
        })
        if(res.data.goodsSkuList.length > 0) {
          this.addForm.freightSize = res.data.goodsSkuList[0].volume
          this.addForm.freightWeight = res.data.goodsSkuList[0].weight
        }
        if(Array.isArray(res.data.goodsDetailAttrList)) {
          res.data.goodsDetailAttrList.forEach((item, index) => {
            if(item.categoryAttrId === '') {
              editBaseData[index] = {
                inputType: '',
                name: item.name,
                list: item.goodsDetailAttrValueList[0].value
              }
              generate[index] = {
                id: '',
                name: item.name,
                list: item.goodsDetailAttrValueList[0].value
              }
            } else {
              this.baseCenterData.forEach((bItem, bIndex) => {
                if(item.categoryAttrId === bItem.id) {
                  let itemObj = bItem
                  let generateObj = this.addForm.generate[bIndex]
                  editBaseData[bIndex] = itemObj
                  if(bItem.inputType === 0 || bItem.inputType === 2) {
                    generateObj.list = []
                    item.goodsDetailAttrValueList.forEach((vItem, vIndex) => {
                      generateObj.list.push(vItem.value)
                    })
                    if(bItem.inputType === 2) {
                      generateObj.checkAll = this.checkboxObj[bIndex].length === item.goodsDetailAttrValueList.length ? true : false
                    }
                  } else {
                    generateObj.list = item.goodsDetailAttrValueList[0].value
                  }
                  generate[bIndex] = generateObj
                  return false
                }
              })
            }
          })
        }
        this.addForm.generate = generate
        this.baseData = editBaseData
        let imgBox = []
        res.data.goodsImgVOList.forEach(item => {
          if(item.type === 1) {
            imgBox.push({
              url: item.imgUrl,
              source: item.imgUrl,
              goodId: item.goodId,
              type: 1,
              id: item.id,
              sort: item.sort
            })
          } else if(item.type === 2) {
            let preUrl = ''
            res.data.goodsImgVOList.forEach(vItem => {
              if(vItem.type === 3 && vItem.sort === item.sort) {
                preUrl = vItem.imgUrl
                return false
              }
            })
            imgBox.push({
              url: preUrl,
              source: item.imgUrl,
              goodId: item.goodId,
              type: item.type,
              id: item.id
            })
          }
        })
        this.addForm.imgsBox = imgBox
        this.showStyle.id = res.data.goods.unit
        if(String(res.data.goods.showStyle) === '3') {
          this.unitName = res.data.goods.unitName
          this.showStyle.type = res.data.goods.showStyle
          this.addForm.unitMore = res.data.goods.unit
          this.getUnitList()
          this.getSpecList()
          // 多规格数据渲染
          this.activeName = 'second'
          this.moreSpecTableShow = true
          let specData = []
          res.data.goodsDetailSpecList.forEach(item => {
            let itemObj = {}
            itemObj.id = item.categorySpecId
            itemObj.selectValue = item.name 
            itemObj.isSpecSelect = true 
            itemObj.list = []
            item.goodsDetailSpecValueList.forEach(vItem => {
              itemObj.list.push({
                value: vItem.value
              })
            })
            specData.push(itemObj)
          })
          this.goodsSkuData = res.data.goodsSkuList
          this.addForm.moreSpec = specData
          this.specValueBlur('', 'true', true)
        } else { 
          this.addForm.unit = res.data.goods.unit
          let msgObj = {}
          msgObj.skuArr = []
          msgObj.showStyle = res.data.goods.showStyle
          msgObj.name = res.data.goodsDetailSpecList[0].name
          this.unitName = res.data.goodsDetailSpecList[0].name
          if (res.data.goods.showStyle === '1') {
            res.data.goodsSkuList.forEach(item => {
              msgObj.skuArr.push({
                name: item.attrValueList[0].value,
                price: item.price,
                number: item.startNum,
                store: item.stock,
                skuId: item.id,
                specId: item.id
              })
            })
            this.getUnit(msgObj)
          } else if(String(res.data.goods.showStyle) === '2') {
            let skuData = JSON.parse(res.data.goodsSkuList[0].priceExp)
            msgObj.stock = res.data.goodsSkuList[0].stock
            skuData.forEach(item => {
              msgObj.skuArr.push({
                price: item.price,
                number: item.startQuantity,
                skuId: res.data.goodsSkuList[0].id,
                specId: res.data.goodsDetailSpecList[0].id
              })
            })
            this.getUnit(msgObj)
          }
        }
        
      })
    },
    getFreight() {
      // 获取运费模板
      this.listLoading = true
      getFreight({ shopId: localStorage.getItem('shopId') || this.$store.state.user.shop.id }).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          this.freightData = res.data
        }
        if(this.freightData.length === 0) {
          this.$alert('运费模板为空，请先去创建运费模板', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.$message({
                type: 'info',
                message: `action: ${ action }`
              });
            }
          })
        }
        this.getByCategoryId()
      })
    },
    getUnit(msgObj) {
      // 通过ID获取规格模板
      this.moreLoading = true
       getUnit({
        categoryId: this.categoryId,
        status: 1
      }).then(res => {
        this.moreLoading = false
        if(Array.isArray(res.data)) {
          let skuInitObj = {}
          res.data.forEach(item => {
            let itemId = item.id 
            let obj = {}
            if(String(item.showStyle) === '2') {
              obj.list = []
              obj.list.push({
                price: '',
                number: ''
              })
              obj.store = ''
            } else if(String(item.showStyle) === '1') {
              obj.list = []
              obj.list.push({
                name: '',
                price: '',
                number: '',
                store: ''
              })
            }
            obj.name = item.name
            obj.id = item.id
            obj.showStyle = item.showStyle
            skuInitObj[itemId] = obj
            this.showAble[itemId] = item.showStyle
            this.valueSuffixObj[itemId] = item.valueSuffix
          });
         
          this.sellData = res.data
          if(this.eiditId.length > 0) {
            let hasChild = false
            this.sellData.forEach(item => {
              if(item.id === this.addForm.unit) {
                hasChild = true
                return false
              }
            })
            if(!hasChild) {
              this.sellData.push({
                id: this.addForm.unit,
                name: this.unitName
              })
              if(this.addForm.unit) {
                if(msgObj.showStyle === '1') {
                  skuInitObj[this.addForm.unit] = {
                  list: [{
                      name: '',
                      price: '',
                      number: '',
                      store: ''
                    }],
                  }
                } else if(msgObj.showStyle === '2') {
                  skuInitObj[this.addForm.unit] = {
                  list: [{
                      price: '',
                      number: ''
                    }],
                    store: ''
                  }
                }
              }
            }
          }
          this.$set(this.addForm, 'sku', skuInitObj)
        }
        if(msgObj !== undefined && this.showStyle.id && this.addForm.sku[this.showStyle.id]) {
          this.addForm.sku[this.showStyle.id].showStyle = msgObj.showStyle
          this.addForm.sku[this.showStyle.id].list = msgObj.skuArr
          this.addForm.sku[this.showStyle.id].name = msgObj.name
          if(msgObj.stock !== undefined) {
            this.addForm.sku[this.showStyle.id].store = msgObj.stock
          }
          this.showStyle.type = msgObj.showStyle
        }
      })
    },
    async getUnitList() {
      this.moreLoading = true
      await getUnitList({ categoryId: this.categoryId, status: 1 }).then(res => {
        this.moreLoading = false
        if(Array.isArray(res.data)) {
          this.sellMoreData = res.data
          if(this.eiditId.length > 0) {
            let hasChild = false
            this.sellMoreData.forEach(item => {
              if(item.id === this.addForm.unitMore) {
                hasChild = true
                return false
              }
            })
            if(!hasChild) {
              this.sellMoreData.push({
                id: this.addForm.unitMore,
                name: this.unitName
              })
            }
          }
        }
      }).catch(err => [
        this.moreLoading = false
      ])
    },
    getSpecList() {
      getSpeList({ categoryId: this.categoryId, status: 1 }).then(res => {
        this.moreLoading = false
        if(Array.isArray(res.data)) {
          this.sellSpeData = res.data
        }
        
      }).catch(err => {
        this.moreLoading = false
      })
    },
    uploadImg(file) {
      let formData = new FormData()
      formData.append('file', file.file)
      fileUpload(formData).then(res => {
        this.addForm.imgsBox.push({
          url: this.fileType === 1 ? res.data.url : res.data.zipUrl,
          source: res.data.url,
          type: this.fileType,
          uid: file.file.uid
        })
        file.file.status = 'success'
      })
    },
    handleClick(tab, event) {
      // 报价方式切换
      if(this.activeName === 'second') {
        if(this.sellMoreData.length === 0) {
          this.getUnitList()
        }
      } else {
        if(this.sellData.length === 0) {
          this.getUnit()
        }
      }
    },
    unitChange(val, type, pindex) {
      // 计量单位选择
      if(type === 'auto') {
        this.showStyle.type = this.showAble[val]
        this.showStyle.id = val
      } else if(type === 'more') {
        this.moreSpecTableShow = true
        this.showStyle.type = '3'
        this.showStyle.id = val
      } else if(type === 'spec') {
        this.addForm.moreSpec[pindex].isSpecSelect = true
        let hasName = true
        this.sellSpeData.forEach(item => {
          if(item.id === val) {
            this.addForm.moreSpec[pindex].selectValue = item.name
            hasName = false
            return false
          }
        })
        if(hasName) {
          this.addForm.moreSpec[pindex].selectValue = val
          this.addForm.moreSpec[pindex].id = ''
        } else {
          this.addForm.moreSpec[pindex].id = val
        }
        this.specValueBlur('', 'true')
      }
    },
    addStair(index, id) {
      // 添加阶梯价
      const currentNum = this.addForm.sku[id].list[index].number
      const currentPrice = this.addForm.sku[id].list[index].price
      if(currentNum && currentPrice) {
        if(index > 0) {
          const preNum = this.addForm.sku[id].list[index - 1].number
          const prePrice = this.addForm.sku[id].list[index - 1].price
          if(Number(currentNum) <= Number(preNum) || Number(currentPrice) >= Number(prePrice)) {
            this.$message({
              type: 'warning',
              message: `阶梯${index + 1}的起批数必须比阶梯${index}的起批数大，阶梯${index + 1}的单价必须比阶梯${index}的单价小!`
            });
            return
          }
        }
      } else {
        this.$message({
              type: 'warning',
              message: '请输入起批数和单价!'
        })
        return false
      }
      this.addForm.sku[id].list.push({
          number: '',
          price: '',
          id: ''
      })
    },
    removeStair(index, id) {
      // 删除阶梯价
      this.addForm.sku[id].list.splice(index, 1)
    },
    addBox(index, id) {
      // 添加箱
      const currentNum = this.addForm.sku[id].list[index].number
      const currentPrice = this.addForm.sku[id].list[index].price
      const currentName = this.addForm.sku[id].list[index].name
      const currentStore = this.addForm.sku[id].list[index].store
      if(currentNum && currentPrice && currentName && currentStore) {
        this.addForm.sku[id].list.push({
          number: '',
          price: '',
          name: '',
          store: ''
        })
      } else {
        this.$message({
              type: 'warning',
              message: '请输入规格名称、起批量、单价、库存!'
        });
        return
      }
    },
    removeBox(index, id) {
      // 删除箱
      this.addForm.sku[id].list.splice(index, 1)
    },
    preView() {
      // 预览
      this.previewDialog = true
    },
    addSelfProp() {
      // 添加基础属性
      this.selfProp = {
        name: '',
        value: ''
      }
      this.dialogProp = true
    },
    confirm() {
      // 确认添加属性
      this.$refs.selfForm.validate((valid) => {
        if(valid) {
          this.addForm.selfProp.push({
            name: this.selfProp.name,
            list: this.selfProp.value,
            sort: '',
            id: '',
            nameGroup: ''
          })
          this.dialogProp = false
        }
      })
      
    },
    removeSelfProp(index) {
      // 删除添加的基础属性
      this.addForm.selfProp.splice(index, 1)
    },
    submitForm(formName, type) {
      if(this.activeName === 'first') {
        console.log('first')
        this.tableShow = false
        let tableData = this.addForm.sku[this.showStyle.id] ? this.addForm.sku[this.showStyle.id].list : []
        for(let i = 0; i < tableData.length; i++) {
          if(tableData[i].number.length === 0 || tableData[i].price.length === 0 || (this.showAble[this.showStyle.id] === '1' && (tableData[i].name.length === 0 || tableData[i].store.length === 0))) {
            this.tableShow = true
            return false
          }
        }
        if(tableData.length > 1 && (tableData[tableData.length - 1].number < tableData[tableData.length - 2].number || tableData[tableData.length - 1].price > tableData[tableData.length - 2].price)) {
          this.$message({
            message: `阶梯${tableData.length}的起批数必须比阶梯${tableData.length - 1}的起批数大，阶梯${tableData.length}的单价必须比阶梯${tableData.length - 1}的单价小!`,
            type: 'warning'
          })
          return false
        }
      } else if(this.activeName === 'second') {
        this.moreTableShow = false
        let tableData = this.addForm.moreSpecData
        for(let i = 0; i < tableData.length; i++) {
          if(tableData[i].price.length === 0 || tableData[0].startNum.length === 0 || tableData[i].store.length === 0) {
            this.moreTableShow = true
            return false
          }
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.addForm.imgsBox.length > 0) {
            this.showPackgeErr = false
          } else {
            this.showPackgeErr = true
            return false
          }
          this.onSale(type)
        } else {
          return false
        }
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch('tagsView/delView', view)
    },
    onSale(type) {
      // 上架
      let goodsVO = {}
      // 商品外部信息
      goodsVO.saveType = type
      goodsVO.categoryId = this.categoryId
      goodsVO.name = this.addForm.title
      goodsVO.detail = this.addForm.remark
      goodsVO.showStyle = this.showStyle.type
      goodsVO.postPayType = 0
      goodsVO.postPrice = 0
      goodsVO.postSettingId = this.addForm.freight
      // 商品动态生成的基础信息
      goodsVO.goodsAttrList = []
      let sortList = 0
      let baseData = this.addForm.generate.concat(this.addForm.selfProp)
      if(baseData.length === 0) {
        this.$message({
          type: 'warning',
          message: '商品属性不能为空，请添加属性!'
        })
        return false
      } else {
        baseData.forEach(item => {
          if(item.list.length > 0) {
            let obj = {}
            let sortValue = 0
            obj.name = item.name
            obj.categoryAttrId = item.id
            obj.nameGroup = item.nameGroup
            obj.sort = sortList++
            obj.goodsAttrValueList = []
            if(Array.isArray(item.list)) {
              let addRemark = ''
              if(item.isRemark) {
                let err = false
                let ref = String(item.id)
                try {
                  this.$refs[ref][0].getCheckedNodes()[0].pathLabels.forEach(rItem => {
                    addRemark += addRemark.length === 0 ? rItem : ('-' + rItem)
                  })
                } catch (error) {
                  err = true
                  this.$message({
                    message: '请选择地址',
                    type: 'warning'
                  });
                }
                if(err) {
                  return false
                }
                this.placeProduct = addRemark
              }
              item.list.forEach(itemList => {
                let itemObj = {}
                if(item.isRemark) {
                  itemObj.remark = addRemark
                }
                itemObj.value = itemList
                itemObj.sort = sortValue++
                obj.goodsAttrValueList.push(itemObj)
              })
            } else {
              obj.goodsAttrValueList.push({
                value: item.list,
                sort: sortValue
              })
            }
            goodsVO.goodsAttrList.push(obj)
          }
        })
      }
      // 商品sku信息
      goodsVO.goodsSkuList = []
      goodsVO.goodsSpecList = []
      if(this.activeName === 'first') {
        let sku = this.addForm.sku
        let key = this.showStyle.id
        let speSort = 0
        let speObj = {}
        let skuSort = 0
        goodsVO.unit = this.addForm.unit
        speObj.sort = speSort++
        if (this.addForm.sku[key].showStyle === '1') {
          speObj.goodsSpecValueList = []
          let boxSort = 0
          speObj.categorySpecId = sku[key].id
          speObj.name = sku[key].name
          speObj.valueSuffix = this.valueSuffixObj[this.addForm.unit] 
          sku[key].list.forEach(item => {
            let skuObj = {}
            if(this.addForm.freightType === 2) {
              skuObj.volume = this.addForm.freightSize
            } else if(this.addForm.freightType === 3) {
              skuObj.weight = this.addForm.freightWeight
            }
            if(this.eiditId.length > 0 && !skuObj.id) {
              speObj.id = item.specId
              skuObj.id = item.skuId
            }
            if(this.eiditId.length > 0) {
              skuObj.id = item.id
            }
            skuObj.sort = skuSort++
            skuObj.priceType = sku[key].showStyle
            skuObj.skuAttrValues = [{
              name: sku[key].name,
              value: item.name
            }]
            skuObj.price = item.price
            skuObj.startNum = item.number
            skuObj.stock = item.store
            skuObj.priceExpList = []
            skuObj.priceExpList.push({
              price: item.price,
              startQuantity: item.number
            })
            speObj.goodsSpecValueList.push({
              value: item.name,
              sort: boxSort++
            })
            goodsVO.goodsSkuList.push(skuObj)
          })
          
          goodsVO.goodsSpecList.push(speObj)
        } else if (this.addForm.sku[key].showStyle === '2') {
          let skuObj = {}
          if(this.addForm.freightType === 2) {
            skuObj.volume = this.addForm.freightSize
          } else if(this.addForm.freightType === 3) {
            skuObj.weight = this.addForm.freightWeight
          }
          skuObj.priceType = sku[key].showStyle
          skuObj.sort = speSort++
          skuObj.priceExpList = []
          skuObj.stock = sku[key].store
          speObj.categorySpecId = sku[key].id
          speObj.name = sku[key].name
          speObj.goodsSpecValueList = []
          skuObj.skuAttrValues = [{
            name: sku[key].name,
            value: 1
          }]
          sku[key].list.forEach(item => {
            if(this.eiditId.length > 0 && !skuObj.id) {
              speObj.id = item.specId
              skuObj.id = item.skuId
            }
            skuObj.priceExpList.push({
              price: item.price,
              startQuantity: item.number
            })
          })
          if(this.eiditId.length > 0) {
            speObj.goodsSpecValueList.push({
              goodsSpecId: speObj.id,
              value: 1,
              sort: 1
            })
          } else {
            speObj.goodsSpecValueList.push({
              value: 1,
              sort: 1
            })
          }
          goodsVO.goodsSkuList.push(skuObj)
          goodsVO.goodsSpecList.push(speObj)
        }
      } else if(this.activeName === 'second') {
        goodsVO.unit = this.addForm.unitMore
        let skuSort = 0
        // 起批量一致
        let startNumber = 0
          this.addForm.moreSpecData.forEach((item, index) => {
            let skuObj = {}
            if(this.addForm.freightType === 2) {
              skuObj.volume = this.addForm.freightSize
            } else if(this.addForm.freightType === 3) {
              skuObj.weight = this.addForm.freightWeight
            }
            skuObj.sort = skuSort++
            skuObj.priceType = 3
            skuObj.skuAttrValues = []
            if(Array.isArray(item.itemValue)) {
              item.itemValue.forEach(itemV => {
                skuObj.skuAttrValues.push({
                  name: itemV.name,
                  value: itemV.value
                })
              })
            }
            
            if(this.eiditId.length > 0) {
              skuObj.id = item.skuId
            }
            if(index === 0) {
              startNumber = item.startNum
            }
            skuObj.price = item.price
            skuObj.startNum = startNumber
            skuObj.stock = item.store
            skuObj.priceExpList = []
            skuObj.priceExpList.push({
              price: item.price,
              startQuantity: startNumber
            })
            goodsVO.goodsSkuList.push(skuObj)
          })
          let speOutSort = 0
          if(this.addForm.moreSpec.length === 0) {
            this.$message({
              type: 'warning',
              message: '请添加规格!'
            })
            return false
          } else {
            this.addForm.moreSpec.forEach(item => {
              let speObj = {}
              let speSort = 0
              speObj.categorySpecId = item.id
              speObj.name = item.selectValue
              speObj.sort = speOutSort++
              speObj.goodsSpecValueList = []
              item.list.forEach(itemList => {
                speObj.goodsSpecValueList.push({
                  value: itemList.value,
                  sort: speSort++
                })
              })
              goodsVO.goodsSpecList.push(speObj)
            })
          }
      }
      // 商品图片信息
      goodsVO.goodsImgList = []
      let imgSort = 0
      this.addForm.imgsBox.forEach((imgItem, imgIndex) => {
        imgSort++
        if(imgIndex === 0) {
          this.previewUrl = imgItem.url
        }
        if(imgItem.type === 1) {
          goodsVO.goodsImgList.push({
            imgUrl: imgItem.source,
            type: 1,
            sort: imgSort
          })
        } else if (imgItem.type === 2) {
          goodsVO.goodsImgList.push({
            imgUrl: imgItem.source,
            type: 2,
            sort: imgSort
          })
          goodsVO.goodsImgList.push({
            imgUrl: imgItem.url,
            type: 3,
            sort: imgSort
          })
        }
      })
      if(type === 2) {
        this.goodsVo = goodsVO
        if(this.showStyle.type === '3') {
          this.sellMoreData.forEach(item => {
            if(item.id === this.showStyle.id) {
              this.productUnit = item.name
            }
          })
        }
        this.preView()
      } else {
        this.saveLoading = true
        if(this.eiditId.length === 0) {
          saveGoods(goodsVO).then(res => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: type === 0 ? '保存待上架成功!' : '上架成功!'
            })
            this.closeSelectedTag(this.$route)
            this.$router.push({
              path: '/product/list',
              query: {
                status: type === 0 ? '1' : '3'
              }
            })
          }).catch(err => {
            this.saveLoading = false
          })
        } else {
          goodsVO.goodsId = this.eiditId
          editGoods(goodsVO).then(res => {
            this.saveLoading = false
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.closeSelectedTag(this.$route)
            this.$router.push({
              path: '/product/list',
              query: {
                status: type === 0 ? '1' : '3'
              }
            })
          }).catch(err => {
            this.saveLoading = false
          })
        }
      }
      
    },
    numValid(obj, name, type) {
      if(type === 1) {
        if(!/^[0-9]+(.[0-9]*)?$/.test(obj[name])) {
          obj[name] = ''
        }
      } else if(type === 2) {
        if(!/^[1-9][0-9]*$/.test(obj[name])) {
          obj[name] = ''
        }
      } else if(type === 3) {
        if(!/^([1-9][0-9]*)|0$/.test(obj[name])) {
          obj[name] = ''
        }
      } 
    },
    handleCheckAllChange(val, index, id) {
      // 全选
      this.addForm.generate[index].list = val ? this.checkboxObj[index] : [];
      this.isIndeterminate = false
    },
    handleRemove(file, fileList) {
      // 删除图片
      this.addForm.imgsBox.forEach((item, index) => {
        if(item.uid === file.uid) {
          this.addForm.imgsBox.splice(index, 1)
          this.uploadDisabled = false
          return
        }
      })
    },
    handleExceed(files, fileList) {
      // 图片数量提示
      this.$message({
        message: '上传图片或视频数量不能大于' + this.imgLimit,
        type: 'warning'
      })
    },
    beforeImgUpload(file) {
      if(file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif') {
        this.fileType = 1
        if(file.size / 1024 / 1024 < 3) {
           return true
        } else {
          this.$message.error('上传图片大小不能超过 3MB!')
          return false
        }
      } else if(file.type === 'video/mp4') {
        this.fileType = 2
        if(file.size / 1024 / 1024 < 10) {
           return true
        } else {
          this.$message.error('上传视频大小不能超过 10MB!')
          return false
        }
      } else {
        this.$message.error('上传文件类型错误!')
        return false
      }
    },
    handleLimit(file,fileList){
      // 是否隐藏图片数量
      if(fileList.length >= this.imgLimit){
        this.uploadDisabled = true
      } else {
        this.uploadDisabled = false
      }
    },
    handlePictureCardPreview(file) {
      // 图片预览
      this.dialogType = file.type
      this.dialogImageUrl = file.source;
      this.dialogVisible = true;
    },
    checkChange(value, index) {
      let checkedCount = value.length
      this.addForm.generate[index].checkAll = checkedCount === this.checkboxObj[index].length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkboxObj[index].length
    },
    async addMoreSpec() {
      // 添加更多报价规格
      if(this.sellSpeData.length === 0) {
        this.moreLoading = true
        await getSpeList({ categoryId: this.categoryId, status: 1 }).then(res => {
          this.moreLoading = false
          if(Array.isArray(res.data)) {
            this.sellSpeData = res.data
          }
          
        }).catch(err => {
          this.moreLoading = false
        })
      }
      this.addForm.moreSpec.push({
          selectValue: '',
          isSpecSelect: false,
          list: [{
            id: '',
            value: ''
          }]
        })
        this.specValueBlur('', 'true')
      
    },
    removeMoreSpec(index) {
      // 删除更多报价规格
      this.addForm.moreSpec.splice(index, 1)
      if(this.addForm.moreSpec.length > 0) {
         this.specValueBlur('', 'true')
      }
    },
    addMoreSpecValue(pindex) {
      // 添加更多报价规格值
      this.addForm.moreSpec[pindex].list.push({
        value: ''
      })
    },
    removeMoreSpecValue(pindex, index) {
      // 删除过多报价规格值
      if(this.addForm.moreSpec[pindex].list.length <= 1) {
        this.specValueBlur('', 'true')
        return false
      } else {
        this.addForm.moreSpec[pindex].list.splice(index, 1)
        this.specValueBlur('', 'true')
      }
    },
    toTree(data, parent_id) {
        let tree = [];
        let temp;
        for (let i = 0; i < data.length; i++) {
            if (data[i].parent_id == parent_id) {
                let obj = data[i];
                temp = toTree(data, data[i].id);
                if (temp.length > 0) {
                 obj.children = temp;
                }
                tree.push(obj);
            }
        }
        return tree;
    },
    createTree(obj, deep, limit, result, arr, isInit) {
      if(deep < limit) {
        for(let i = 0; i < obj[deep].list.length; i++) {
          result[deep] = {
            name: obj[deep].selectValue,
            value: obj[deep].list[i].value 
          }
          this.createTree(obj, deep + 1, limit, result, arr, isInit)
        }
      } else {
        let item = {}
        if(this.eiditId.length === 0 || !isInit) {
          item = {
            startNum: '',
            price: '',
            store: '',
            id: ''
          }
        } else {
          item = {
            startNum: this.goodsSkuData[this.skuCounter].startNum,
            price: this.goodsSkuData[this.skuCounter].price,
            store: this.goodsSkuData[this.skuCounter].stock,
            skuId: this.goodsSkuData[this.skuCounter].id
          }
          this.skuCounter++
        }
        let [...itemV] = result
        item.itemValue = itemV
        arr.push(item)
        result = []
        return
      }
      
    },
    specValueBlur(e, val, isInit) {
      // 报价规格值在table中更新
      this.isCombine = false
      if(val.length > 0) {
        let arr = []
        let limit = this.addForm.moreSpec.length
        let result = []
        if(isInit) {
           this.createTree(this.addForm.moreSpec, 0, limit, result, arr, true)
        } else {
           this.createTree(this.addForm.moreSpec, 0, limit, result, arr, false)
        }
        let combineObj = {}
        let combineLen = 0
        let combineIndex = 0
        let len = this.addForm.moreSpec.length
        let value = ''
        for(let i = 0; i < len; i++) {
          for(let j = 0; j < arr.length; j++) {
            if(j === 0) {
              value = arr[j].itemValue[i].value
              combineLen = 1
            } else {
              if(arr[j].itemValue[i].value === value) {
                combineLen++
              } else {
                combineObj[i] = combineLen
                combineLen = 1
                value = arr[j].itemValue[i].value
              }
            }
          }
        }
        this.combineObj = combineObj
        if(this.combineObj[0] !== undefined && this.combineObj[0] > 1) {
          this.isCombine = true
        }
        this.addForm.moreSpecData = arr
      } else {
        this.isCombine = false
      }
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if(this.isCombine && this.combineObj[columnIndex] > 1) {
          if(rowIndex % this.combineObj[columnIndex] === 0) {
            return {
              rowspan: this.combineObj[columnIndex],
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
      
      }
    },
    changeType() {
      this.$confirm('切换分类后当前页面数据会清空, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({path: 'release',  })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })       
      })
    },
    freightChange(val) {
      this.freightData.forEach(item => {
        if(item.id === val) {
          this.addForm.freightType = item.type
          this.addForm.freightName = item.name
          return false
        }
      })
    },
    createExpress() {
      this.$router.push({
        path: '/freight/template/add'
      })
    }
  }
}
export default vm;
</script>

<style lang="scss" scoped>
  td{
    width: 150px;
  }
  .app-container{
    padding-bottom: 140px;
    .tr{
      text-align: right;
    }
    .pr20{
      padding-right: 20px;
    }
    .mr40{
      margin-right: 40px;
    }
    .mr5{
      margin-right: 5px;
    }
    .mr10{
      margin-right: 10px;
    }
    .mr20{
      margin-right: 20px;
    }
    .mb20{
      margin-bottom: 20px;
    }
    .long-input{
      max-width: 1000px;
    }
    .short-input{
      max-width: 200px;
    }
    .table-input{
      max-width: 120px;
    }
    .box-card{
      margin-bottom: 10px;
    }
  
    .unit-delete{
      color: #ff0000;
      cursor: pointer;
    }
    .unit-add{
      color: #409EFF;
      cursor: pointer;
    }

    .bottom-box{
      text-align: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 90;
      width: 100%;
      height: 120px;
      background: #eee;
      display: flex;
      justify-content: center;
      align-items: center;
      button{
        width: 200px;
        height: 60px;
      }
    }
    .freight-type{
      color: #606266;
      font-weight: 700;
      margin-right: 5px;
    }
    .freight-des{
      color: #666;
      font-size: 12px;
    }
    .self-diolog{
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;
      background: rgba(0, 0, 0, .3);
      overflow-y: scroll;
      .preview-box{
        position: relative;
        width: 375px;
        height: 667px;
        margin: 0 auto;
        .preview{
          width: 375px;
          height: 667px;
          background: #f5f5f5;
          position: relative;
          margin: 80px auto 0 auto;
          overflow-y: scroll;
          padding-bottom: 50px;
          font-size: 14px;
          color: #000;
          &::-webkit-scrollbar-track-piece {
            background: none;
          }

          &::-webkit-scrollbar {
            width: 0;
          }

          &::-webkit-scrollbar-thumb {
            background: none;
          }
          ul,li{
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .tc{
            text-align: center;
          }
          .calrousel-box{
            height: 375px;
            position: relative;
            .left-icon,.right-icon{
              width: 27px;
              height: 27px;
              display: flex;
              position: absolute;
              top: 10px;
              img{
                width: 100%;
                height: auto;
              }
            }
            .left-icon{
              left: 10px;
            }
            .right-icon{
              right: 10px;
            }
            .num{
              min-width: 40px;
              height: 18px;
              line-height: 18px;
              text-align: center;
              border-radius: 20px;
              position: absolute;
              right: 20px;
              bottom: 15px;
              font-size: 12px;
              color: #fff;
              background: rgba(0, 0, 0, .5)
            }
          }
          .title-box{
            padding: 15px;
            margin-bottom: 10px;
            background: #fff;
            .title{
              margin-bottom: 8px;
              .stair-title{
                width: 115px;
                height: 60px;
                float: left;
                text-align: center;
                div{
                  height: 30px;
                  line-height: 30px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
              .start-num{
                color: #999;
                font-size: 12px;
              }
              .price{
                color: #f5222d;
                font-size: 14px;
                line-height: 24px;
                margin-bottom: 15px;
                font-weight: bold;
              }
              .unit{
                font-size: 12px;
                color: #000;
                font-weight: normal;
              }
              .place{
                color: #999;
                float: right;
              }
            }
            .des{
              color: #333;
              font-size: 14px;
              line-height: 24px;
              margin-bottom: 8px;
              font-weight: bold;
            }
            .message-box{
              background: #e6faed;
              height: 36px;
              border-radius: 5px;
              color: #49c173;
              font-size: 12px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              span{
                display: inline-block;
                height: 14px;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .title-des{
            position: relative;
            &::before {
                content: '';
                width: 2px;
                height: 2px;
                display: block;
                position: absolute;
                background-color: #B3B3B3;
                top: 50%;
                left: -10px;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                -webkit-box-shadow: -6px 0 0 0 #B3B3B3, -8px 0 0 0 #B3B3B3, -10px 0 0 0 #B3B3B3, -12px 0 0 0 #B3B3B3, -14px 0 0 0 #B3B3B3, -16px 0 0 0 #B3B3B3, -18px 0 0 0 #B3B3B3, -20px 0 0 0 #B3B3B3;
                box-shadow: -6px 0 0 0 #B3B3B3, -8px 0 0 0 #B3B3B3, -10px 0 0 0 #B3B3B3, -12px 0 0 0 #B3B3B3, -14px 0 0 0 #B3B3B3, -16px 0 0 0 #B3B3B3, -18px 0 0 0 #B3B3B3, -20px 0 0 0 #B3B3B3;
            }
              &::after {
                content: '';
                width: 2px;
                height: 2px;
                display: block;
                position: absolute;
                background-color: #B3B3B3;
                top: 50%;
                right: -10px;
                -webkit-transform: translateY(-50%);
                transform: translateY(-50%);
                -webkit-box-shadow: 6px 0 0 0 #B3B3B3, 8px 0 0 0 #B3B3B3, 10px 0 0 0 #B3B3B3, 12px 0 0 0 #B3B3B3, 14px 0 0 0 #B3B3B3, 16px 0 0 0 #B3B3B3, 18px 0 0 0 #B3B3B3, 20px 0 0 0 #B3B3B3;
                box-shadow: 6px 0 0 0 #B3B3B3, 8px 0 0 0 #B3B3B3, 10px 0 0 0 #B3B3B3, 12px 0 0 0 #B3B3B3, 14px 0 0 0 #B3B3B3, 16px 0 0 0 #B3B3B3, 18px 0 0 0 #B3B3B3, 20px 0 0 0 #B3B3B3;
            }
          }
          .product-box{
            padding: 12px 15px;
            background: #fff;
            margin-bottom: 10px;
            min-height: 55px;
            .product-unit{
              li{
                min-height: 40px;
                line-height: 40px;
                color: #999;
                border-bottom: 1px dotted #f5f5f5;
                &:last-child{
                  border-bottom: none;
                }
                .unit-name{
                  width: 195px;
                  float: left;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .unit-price{
                  width: 120px;
                  float: left;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                span{
                  float: left;
                  overflow: hidden;
                  width: 115px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
              }
            }
            .product-prop{
              li{
                min-height: 40px;
                line-height: 40px;
                color: #999;
                border-bottom: 1px dotted #f5f5f5;
                &:last-child{
                  border-bottom: none;
                }
                .prop{
                  float: left;
                  width: 120px;
                  padding-right: 10px;
                }
                .value{
                  float: left;
                  max-width: 215px;
                }
              }
            }
          }
          .product-detail{
            padding-top: 12px;
            background: #fff;
            p{
              line-height: 24px;
              padding: 0 15px;
              font-size: 12px;
            }
            img{
              max-width: 100%;
              margin-bottom: 10px;
            }
          }
        }
        .product-buy{
            height: 50px;
            text-align: center;
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            .in{
              padding-top: 9px;
              font-size: 12px;
              float: left;
              width: 57px;
              height: 50px;
              &:first-child{
                width: 58px;
              }
              div{
                img{
                  width: 18px;
                  height: auto;
                }
              }
            }
            .buy,.cart{
              line-height: 50px;
              float: left;
              width: 130px;
              height: 50px;
              color: #fff;
              font-size: 15px;
              font-weight: bold;
            }
            .cart{
              background: #ffd07f;
            }
            .buy{
              background: #fc2d2d;
            }

          }
      }
      .self-close{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
        width: 70px;
        height: 70px;
        background: #fff;
        border-radius: 50%;
        margin: 20px auto 0 auto;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        color: #666;
      }
    }
  }
</style>
<style>

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type="number"]{
    -moz-appearance: textfield;
}
</style>