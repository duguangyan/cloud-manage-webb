<template>
  <!-- <div class="app-container"> -->
  <div v-loading="saveLoading" class="app-container">
    <el-card class="box-card">
      <div class="text item">
        {{productTitle}}
        <el-button type="primary" size="medium" v-waves class="filter-item" @click="changeType">切换分类</el-button>
        <!-- <el-cascader :options="addressOptions" :props="addressProps"></el-cascader> -->
      </div>
    </el-card>
    <el-form v-loading="diaLoading" ref="productForm" :model="addForm" label-position="right" label-width="120px" style="">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div  class="text item">
        <el-form-item label="标题" prop="title"
        :rules="{
            required: true, message: '标题必填', trigger: 'blur'
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
          :key="index" 
          :label="item.name" 
          :rules="{
            required: item.isRequire === 1, message: `${item.name}必填`, trigger: 'blur', type: (item.inputType === 0 || item.inputType === 2) ? 'array' : '' 
          }"
          :prop="'generate.' + index + '.list'">
            <template v-if="item.inputType === 0">
              <el-cascader
                v-model="addForm.generate[index].list"
                :label="item.id"
                :placeholder="item.hint"
                @focus="((val) => focus(val, item.id))"
                :options="addressOptions"
                :style="{width: item.length + 'px'}"
                :props="addressProps"
                style="width: 200px;"
                class="filter-item mr20"
                @keyup.enter.native="handleFilter">
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
              <el-select v-model="addForm.generate[index].list" size="medium" maxlength="64" placeholder="请选择">
                <el-option v-for="(selectItem, selectIndex) in item.valueSet" :key="selectIndex" :label="selectItem.id" :value="selectItem.value"></el-option>
              </el-select>
              <span v-if="item.exp !== null">{{item.exp}}</span>
            </template>
            <template v-else-if="item.inputType === 4">
              <el-input class="long-input" v-model.trim="addForm.generate[index].list" size="medium" maxlength="64" :placeholder="item.hint" :style="{width: item.length + 'px'}" />
              <span v-if="item.exp !== null">{{item.exp}}</span>
            </template>
          </el-form-item>         
        </template>
        <el-form-item v-for="(selfItem, selfIndex) in addForm.selfProp" :key="selfIndex + 'x'" :label="addForm.selfProp[selfIndex].name">
          <span class="mr40">{{addForm.selfProp[selfIndex].list}}</span>
          <el-button type="danger" plain size="small" v-waves @click="removeSelfProp(selfIndex)">删除</el-button>
        </el-form-item>
        <el-form-item label="" required prop="title">
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
              label="计量单位" 
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
                required: activeName === 'first', message: '库存必填，且为数字', trigger: 'blur', pattern:/^\d+$/,
              }"
              label="库存">
                <el-input class="short-input" v-model.trim="addForm.sku[showStyle.id].store" size="medium" maxlength="30" />
            </el-form-item>
            <el-form-item>  
              <div v-if="showStyle.type === '2'">
                 <el-table
                  :data="addForm.sku[showStyle.id].list"
                  border
                  >
                  <el-table-column  label="起批量" width="220" align="center">
                    <template slot-scope="scope">
                      <span class="mr5">起批数</span><el-input class="table-input" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].number" size="small" maxlength="12" />
          
                    </template>
                  </el-table-column>
                  <el-table-column label="价格" width="220" align="center">
                    <template slot-scope="scope">
                      <span class="mr5">单价</span><el-input class="table-input" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].price" size="small" maxlength="12" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <div style="text-align: left;padding-left: 50px;">
                        <el-button v-show="scope.$index > 0 || addForm.sku[showStyle.id].list.length > 1" size="mini" type="danger" plain @click="removeStair(scope.$index, showStyle.id)">
                          删除
                        </el-button>
                        <el-button v-show="scope.$index === addForm.sku[showStyle.id].list.length - 1" size="mini" type="primary" plain @click="addStair(scope.$index, showStyle.id)">
                          新增规格
                        </el-button>
                        <!-- <span v-show="scope.$index > 0 || stairArr.length > 1" class="mr10 unit-delete" @click="removeStair(scope.$index, showStyle.id)">删除</span><span v-show="scope.$index === stairArr.length - 1" class="unit-add" @click="addStair(scope.$index, showStyle.id)">新增规格</span> -->
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
                      <el-input class="table-input mr5" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].name" size="small" maxlength="12" /><span>{{showAble[showStyle.id].valueSuffix}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="起批量" width="220" align="center">
                    <template slot-scope="scope">
                      <el-input class="table-input" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].number" size="small" maxlength="12" />
                    </template>
                  </el-table-column>
                  <el-table-column label="价格" width="220" align="center">
                    <template slot-scope="scope">
                      <el-input class="table-input mr5" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].price" size="small" maxlength="12" /><span>元</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="库存" width="220" align="center">
                    <template slot-scope="scope">
                      <el-input class="table-input" v-model.trim="addForm.sku[showStyle.id].list[scope.$index].store" size="small" maxlength="12" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <div style="text-align: left;padding-left: 50px;">
                        <el-button v-show="scope.$index > 0 || addForm.sku[showStyle.id].list.length > 1" size="mini" type="danger" plain @click="removeBox(scope.$index, showStyle.id)">
                          删除
                        </el-button>
                        <el-button v-show="scope.$index === addForm.sku[showStyle.id].list.length - 1" size="mini" type="primary" plain @click="addBox(scope.$index, showStyle.id)">
                          新增规格
                        </el-button>
                        <!-- <span v-show="scope.$index > 0 || boxArr.length > 1" class="mr10 unit-delete" @click="removeBox(scope.$index, showStyle.id)">删除</span><span v-show="scope.$index === boxArr.length - 1" class="unit-add" @click="addBox(scope.$index, showStyle.id)">新增规格</span> -->
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
            :label="'规格' + (pIndex + 1)" 
            :prop="'unitMore'"
            >
            <el-select v-model="addForm.moreSpec[pIndex].selectValue" filterable allow-create size="medium" maxlength="64" placeholder="请选择" @change="((val) => unitChange(val, 'spec', pIndex))">
              <el-option v-for="(item, index) in sellSpeData" :key="index" :label="item.name" :value-key="item.id" :value="item.id"></el-option>
            </el-select>
            <el-button type="danger" plain size="small" v-waves @click="removeMoreSpec(pIndex)">删除</el-button>
            <div v-show="addForm.moreSpec[pIndex].isSpecSelect">
              <el-input
                v-for="(item, index) in addForm.moreSpec[pIndex].list" :key="index"
                placeholder="请输入规格值"
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
          <el-form-item>
            <el-button v-show="moreSpecTableShow" type="primary" plain size="medium" v-waves @click="addMoreSpec">添加规格</el-button>
          </el-form-item>
          <el-form-item>  
            <el-table
              v-if="moreSpecTableShow"
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
                label="起批量"
                align="center"
                >
                <template slot-scope="scope">
                  <el-input v-model.trim="addForm.moreSpecData[scope.$index].startNum" class="table-input" size="small" maxlength="12" />
                </template>
              </el-table-column>
              <el-table-column
                label="价格"
                align="center"
                >
                <template slot-scope="scope">
                  <el-input v-model.trim="addForm.moreSpecData[scope.$index].price" class="table-input" size="small" maxlength="12" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="库存">
                <template slot-scope="scope">
                  <el-input v-model.trim="addForm.moreSpecData[scope.$index].store" class="table-input" size="small" maxlength="12" />
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
        <span>图文视图</span>
      </div>
      <div  class="text item">
        <el-form-item 
          label="商品视图" required>
          <el-upload
            ref="uplodadImg"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :http-request="uploadImg"
            v-model="addForm.imgBox"
            :limit="imgLimit"
            :on-preview="handlePictureCardPreview"
            :file-list="imgsList"
            :before-upload="beforeImgUpload"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>
            <p>还能添加{{imgLimit}}张图片或视频；</p>
            <p>* 仅支持3M以内jpg、jpeg、gif、png格式图片上传；图片建议尺寸500*500；</p>
            <p>* 文件大小不能超过3MB，包括图片和视频；图片建议尺寸500*500；支持JPG、GIF、PNG格式；</p>
            <p>* 默认第一个文件为商品封面图，如果是视频则取第一帧画面作为封面图。</p>
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
        <el-form-item label="物流信息">
          <el-select v-model="logisticsValue" size="medium" maxlength="64" placeholder="请选择">
            <el-option
              v-for="item in addForm.unit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-card>
  </el-form>
    <div class="bottom-box">
      <div>
        <el-button v-waves class="filter-item" @click="preView">预览</el-button>
        <el-button v-waves class="filter-item" @click="submitForm('productForm', 0)">保存待上架</el-button>
        <el-button type="primary" v-waves class="filter-item" @click="submitForm('productForm', 1)">上架出售</el-button>
      </div>
    </div>
    <div class="self-diolog" v-if="previewDialog">
      <div class="preview-box">
        <div class="preview">
          <div class="calrousel-box" style="background: #eee">
            <div class="left-icon"></div>
            <div class="right-icon"></div>
            <div class="num">1/10</div>
          </div>
          <div class="title-box">
            <div class="title">
              ￥9.99~￥24.00 <span>/箱</span>
              <span class="place">山东济南</span>
            </div>
            <div class="des">标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题</div>
            <div class="message-box">
              <span>12200人看过</span>
              <span>订单数0</span>
              <span>全国包邮</span>
            </div>
          </div>
          <div class="product-prop">
            <div class="tc">商品属性</div>
            <ul>
              <li>
                <span class="prop">皮颜色</span>
                <span>红</span>
              </li>
              <li>
                <span class="prop">口感</span>
                <span>甜</span>
              </li>
              <li>
                <span class="prop">口感</span>
                <span>甜</span>
              </li>
            </ul>
          </div>
          <div class="product-detail">
            <div class="tc">商品详情</div>
            <p>烟薯25号作为烤薯专用品种，在市场上很受欢迎。烤熟烟薯金黄带有蜜感，口感绵软香甜，甜度比一般红薯都要甜。当然，喜欢的也可以生吃或者蒸煮。此款红薯产自山东荣成，无公害种植</p>
            <img src="@/assets/img/bg.jpg" alt="">
          </div>
        </div>
        <div class="product-buy">
            <div class="in">收藏</div>
            <div class="in">进货单</div>
            <div class="cart">加入进货单</div>
            <div class="buy">立即购买</div>
        </div>
      </div>
      <div class="self-close" @click="previewDialog = false">×</div>
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
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getByCategoryId, getUnit, saveGoods, getUnitList, getSpeList, getGoodsDetail } from '@/api/goods/list'
import { getAd } from '@/api/upms/strict'
import { fileUpload } from '@/api/goods/upload'
let id = 0;
let vm = {
  name: 'addProduct',
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
      baseCenterData: [],
      sellData: [],
      sellMoreData: [],
      sellSpeData: [],
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
      cascader: {},
      cascaderId: '',
      addressProps: {
        lazy: true,
        lazyLoad (node, resolve) {
          getAd({ parentId: node.level === 0 ? 0 : node.data.id }).then( res => {
            if(Array.isArray(res.data)) {
              let deep = 0
              res.data.map((item) => {
                item.leaf = item.haveChild === 0 || parseInt(vm.cascader[vm.cascaderId] - 1) <= node.level
              });
              resolve(res.data);
            }
          })
        },
        value: "shortName",
        id: "",
        label: "shortName",
      },
      tableShow: false,
        moreTableShow: false,
      addForm: {
        title: '',
        remark: '',
        sku: {},
        generate: [],
        imgsBox: [],
        unitMore: '',
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
      dialogImageUrl: '',
      dialogVisible: false,
      dialogProp: false,
      imgsList: [],
      spanArr: []
    }
  },
  components: {  },
  computed: {

  },
  created() {
    console.log(this.$route.query)
    this.categoryId = this.$route.query.id
    if(this.$route.query.eid) {
      this.eiditId = this.$route.query.eid
    }
    this.getByCategoryId()
    
    // this.$route.query.des.forEach((item) => {
    //   this.productTitle += this.productTitle.length === 0 ? item : '-' + item
    // })
    // this.getAddress()
  },
  methods: {
    getByCategoryId() {
      // 通过ID获取规格模板
      this.listLoading = true
      getByCategoryId({
        categoryId : this.categoryId
      }).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          res.data.forEach((item, index) => {
            let obj = {}
            if(item.inputType === 0 || item.inputType === 2) {
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
            this.addForm.generate.push(obj)
            if(item.inputType === 0) {
              this.cascader[item.id] = item.valueSet[0].value
              // this.$set(this.cascader, item.id, item.valueSet[0].value)
            }
          });
        }
        if(this.eiditId.length === 0) {
           this.baseData = res.data
          this.getUnit()
        } else {
          this.baseCenterData = res.data
          this.getGoodsDetail()
          this.getUnitList()
        }
      })
    },
    getGoodsDetail() {
      getGoodsDetail({ goodsId: this.eiditId }).then(res => {
        let editBaseData = []
        let generate = []
        this.addForm.title = res.data.goods.name
        this.addForm.remark = res.data.goods.detail
        this.addForm.unitMore = res.data.goods.unit
        this.showStyle.type = res.data.goods.showStyle
        if(res.data.goods.showStyle === '3') {
          this.activeName = 'second'
          this.moreSpecTableShow = true
        }
        if(Array.isArray(res.data.goodsDetailAttrList)) {
          res.data.goodsDetailAttrList.forEach((item, index) => {
            this.baseCenterData.forEach((bItem, bIndex) => {
              if(item.categoryAttrId === bItem.id) {
                let itemObj = bItem
                let generateObj = this.addForm.generate[bIndex]
                editBaseData.push(itemObj)
                if(bItem.inputType === 0 || bItem.inputType === 2) {
                  generateObj.list = []
                  item.goodsDetailAttrValueList.forEach((vItem, vIndex) => {
                    generateObj.list.push(vItem.value)
                  })
                } else {
                  generateObj.list = item.goodsDetailAttrValueList[0].value
                }
                generate.push(generateObj)
                return false
              }
            })
          });
        }
        this.addForm.generate = generate
        this.baseData = editBaseData
        console.log('eidt')
        console.log(this.addForm)
        console.log(editBaseData)
      })
    },
    getUnit() {
      // 通过ID获取规格模板
      this.listLoading = true
      getUnit({
        categoryId: this.categoryId
      }).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          let skuInitObj = {}
          res.data.forEach(item => {
            let itemId = item.id 
            let obj = {}
            if(item.showStyle == 2) {
              obj.list = []
              obj.list.push({
                price: '',
                number: ''
              })
              obj.store = ''
            } else if(item.showStyle == 1) {
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
          });
          this.$set(this.addForm, 'sku', skuInitObj)
          this.sellData = res.data
        }
      })
    },
    getUnitList() {
      this.moreLoading = true
      getUnitList({ categoryId: this.categoryId }).then(res => {
        this.moreLoading = false
        if(Array.isArray(res.data)) {
          this.sellMoreData = res.data
        }
      }).catch(err => [
        this.moreLoading = false
      ])
    },
    uploadImg(file) {
      let formData = new FormData()
      formData.append('file', file.file)
      fileUpload(formData).then(res => {
        this.addForm.imgsBox.push({
          imgUrl: res.data,
          type: 1,
          uid: file.file.uid
        })
        this.imgLimit = 10 - this.addForm.imgsBox.length
        file.file.status = 'success'
      })
    },
    handleClick(tab, event) {
      // 报价方式切换
      if(this.activeName === 'second') {
        this.getUnitList()
      }
      
    },
    getAddress() {
      // 获取产地信息
      getAd({ parentId: 0 }).then(res => {
        this.addressOptions = res.data
      })
    },
    unitChange(val, type, pindex) {
      // 计量单位选择
      if(type === 'auto') {
        this.showStyle.type = this.showAble[val]
        this.showStyle.id = val
      } else if(type === 'more') {
        this.moreSpecTableShow = true
        this.addForm.unit = this.unitMore
      } else if(type === 'spec') {
        this.addForm.moreSpec[pindex].isSpecSelect = true
        let hasName = true
        this.sellSpeData.forEach(item => {
          if(item.id === val) {
            this.addForm.moreSpec[pindex].selectValue = item.name
            hasName = false
            return
          }
        })
        if(hasName) {
          this.addForm.moreSpec[pindex].selectValue = val
          this.addForm.moreSpec[pindex].id = ''
        } else {
          this.addForm.moreSpec[pindex].id = val
        }
        
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
        });
        return
      }
      this.addForm.sku[id].list.push({
          number: '',
          price: ''
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
        this.tableShow = false
        let tableData = this.addForm.sku[this.showStyle.id] ? this.addForm.sku[this.showStyle.id].list : []
        for(let i = 0; i < tableData.length; i++) {
          if(tableData[i].number.length === 0 || tableData[i].price.length === 0 || (this.showAble[this.showStyle.id] === '1' && (tableData[i].name.length === 0 || tableData[i].store.length === 0))) {
            this.tableShow = true
            return false
          }
        }
      } else if(this.activeName === 'second') {
        this.moreTableShow = false
        let tableData = this.addForm.moreSpecData
        for(let i = 0; i < tableData.length; i++) {
          if(tableData[i].price.length === 0 || tableData[i].startNum.length === 0 || tableData[i].store.length === 0) {
            this.moreTableShow = true
            return false
          }
        }
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.onSale(type)
        } else {
          return false
        }
      });
    },
    onSale(type) {
      // 上架
      let goodsVO = {}
      // 商品外部信息
      goodsVO.saveType = type
      goodsVO.categoryId = this.categoryId
      goodsVO.name = this.addForm.title
      goodsVO.detail = this.addForm.remark
      goodsVO.showStyle = this.showStyle.type === '' ? 3 : this.showStyle.type
      goodsVO.postPayType = 0
      goodsVO.postPrice = 0
      goodsVO.postSettingId = 'postSettingId'
      // 商品动态生成的基础信息
      goodsVO.goodsAttrList = []
      let sortList = 0
      let baseData = this.addForm.generate.concat(this.addForm.selfProp)
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
            item.list.forEach(itemList => {
              sortValue++
              obj.goodsAttrValueList.push({
                value: itemList,
                sort: sortValue
              })
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
      // 商品sku信息
      goodsVO.goodsSkuList = []
      goodsVO.goodsSpecList = []
      if(this.activeName === 'first') {
        let sku = this.addForm.sku
        let key = this.showStyle.id
        let speSort = 0
        // for(let key in sku) {
          
          let speObj = {}
          let skuSort = 0
          speObj.sort = speSort++
          if (this.addForm.sku[key].showStyle === '1') {
            speObj.goodsSpecValueList = []
            let boxSort = 0
            speObj.categorySpecId = sku[key].id
            speObj.name = sku[key].name
            sku[key].list.forEach(item => {
              let skuObj = {}
              skuObj.sort = skuSort++
              skuObj.priceType = sku[key].showStyle
              skuObj.skuAttrValues = [{
                name: sku[key].name + this.showAble[this.showStyle],
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
            skuObj.priceType = sku[key].showStyle
            skuObj.sort = speSort++
            skuObj.priceExpList = []
            skuObj.stock = sku[key].store
            speObj.categorySpecId = sku[key].id
            speObj.name = sku[key].name
            speObj.goodsSpecValueList = []
            speObj.goodsSpecValueList.push({
              value: 1,
              sort: 1
            })
            skuObj.skuAttrValues = [{
              name: sku[key].name,
              value: 1
            }]
            sku[key].list.forEach(item => {
              skuObj.priceExpList.push({
                price: item.price,
                startQuantity: item.number
              })
            })
            goodsVO.goodsSkuList.push(skuObj)
            goodsVO.goodsSpecList.push(speObj)
          }
        // }
      } else if(this.activeName === 'second') {
        goodsVO.unit = this.addForm.unitMore
        let skuSort = 0
          this.addForm.moreSpecData.forEach(item => {
            let skuObj = {}
            skuObj.sort = skuSort++
            skuObj.priceType = 3
            skuObj.skuAttrValues = []

            item.itemValue.forEach(itemV => {
              skuObj.skuAttrValues.push({
                name: itemV.name,
                value: itemV.value
              })
            })
            skuObj.price = item.price
            skuObj.startNum = item.startNum
            skuObj.stock = item.store
            skuObj.priceExpList = []
            skuObj.priceExpList.push({
              price: item.price,
              startQuantity: item.startNum
            })
            goodsVO.goodsSkuList.push(skuObj)
          })
          let speOutSort = 0
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
      
      // 商品图片信息
      goodsVO.goodsImgList = this.addForm.imgsBox
      this.saveLoading = true
      saveGoods(goodsVO).then(res => {
        this.saveLoading = false
        this.$message({
              type: 'success',
              message: type === 0 ? '保存待上架成功!' : '上架成功!'
            });
      }).catch(err => {
        this.saveLoading = false
      })
    },
    focus(val, id) {
      // this.addressProps.id = id
      this.cascaderId = id
    },
    handleCheckAllChange(val, index, id) {
      // 全选
      this.addForm.generate[index].list = val ? this.checkboxObj[index] : [];
      this.isIndeterminate = false;
    },
    handleRemove(file, fileList) {
      // 删除图片
      this.addForm.imgsBox.forEach((item, index) => {
        if(item.uid === file.uid) {
          this.addForm.imgsBox.splice(index, 1)
          return
        }
      })
    },
    beforeImgUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif'
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpg、jpeg、gif、png 格式!');
      }
      if (!isLt3M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt3M;
    },
    handlePictureCardPreview(file) {
      // 图片预览
      this.dialogImageUrl = file.url;
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
        await getSpeList({ categoryId: this.categoryId }).then(res => {
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
    createTree(obj, deep, limit, result, arr) {
      if(deep < limit) {
        for(let i = 0; i < obj[deep].list.length; i++) {
          result[deep] = {
            name: obj[deep].selectValue,
            value: obj[deep].list[i].value 
          }
          this.createTree(obj, deep + 1, limit, result, arr)
        }
      } else {
        let item = {
          startNum: '',
          price: '',
          store: ''
        }
        let [...itemV] = result
        item.itemValue = itemV
        arr.push(item)
        result = []
        return
      }
      
    },
    specValueBlur(e, val) {
      // 报价规格值在table中更新
      this.isCombine = false
      if(val.length > 0) {
        let arr = []
        let limit = this.addForm.moreSpec.length
        let result = []
        this.createTree(this.addForm.moreSpec, 0, limit, result, arr)
        
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
          message: '已取消删除'
        })       
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
        width: 580px;
        height: 1000px;
        margin: 0 auto;
        .preview{
          width: 580px;
          height: 1000px;
          background: #f5f5f5;
          position: relative;
          margin: 80px auto 0 auto;
          overflow-y: scroll;
          padding-bottom: 80px;
          font-size: 18px;
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
            margin-bottom: 20px;
          }
          .calrousel-box{
            height: 580px;
            position: relative;
            .left-icon,.right-icon{
              width: 40px;
              height: 40px;
              position: absolute;
              top: 45px;
              border-radius: 50%;
              background: rgba(0, 0, 0, .5)
            }
            .left-icon{
              left: 20px;
            }
            .right-icon{
              right: 20px;
            }
            .num{
              width: 60px;
              height: 20px;
              line-height: 20px;
              text-align: center;
              border-radius: 20px;
              position: absolute;
              right: 20px;
              bottom: 15px;
              font-size: 18px;
              color: #fff;
              background: rgba(0, 0, 0, .5)
            }
          }
          .title-box{
            padding: 25px 20px 15px 25px;
            margin-bottom: 15px;
            background: #fff;
            .title{
              color: #f5222d;
              font-size: 24px;
              margin-bottom: 15px;
              font-weight: bold;
              span{
                font-size: 18px;
                color: #000;
                font-weight: normal;
              }
              .place{
                color: #999;
                float: right;
              }
            }
            .des{
              color: #000;
              font-size: 22px;
              line-height: 32px;
              margin-bottom: 15px;
              font-weight: bold;
            }
            .message-box{
              background: #e6faed;
              height: 56px;
              border-radius: 5px;
              color: #49c173;
              font-size: 14px;
              display: flex;
              justify-content: space-around;
              align-items: center;
            }
          }
          .product-prop{
            padding-top: 30px;
            background: #fff;
            margin-bottom: 15px;
            ul{
              li{
                height: 65px;
                line-height: 65px;
                color: #999;
                border-bottom: 1px dotted #f5f5f5;
                padding-left: 20px;
                &:last-child{
                  border-bottom: none;
                }
                span{
                  display: inline-block;
                }
                .prop{
                  width: 125px;
                }
              }
            }
          }
          .product-detail{
            padding-top: 30px;
            background: #fff;
            p{
              line-height: 36px;
              padding: 0 20px;
            }
            img{
              max-width: 100%;
              margin: 20px 0;
            }
          }
        }
        .product-buy{
            height: 78px;
            line-height: 78px;
            text-align: center;
            background: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            .in{
              float: left;
              width: 90px;
              height: 78px;
            }
            .buy,.cart{
              float: left;
              width: 200px;
              height: 78px;
              color: #fff;
              font-size: 23px;
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
        width: 70px;
        height: 70px;
        background: #fff;
        border-radius: 50%;
        margin: 20px auto 0 auto;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
      }
    }
  }
</style>
