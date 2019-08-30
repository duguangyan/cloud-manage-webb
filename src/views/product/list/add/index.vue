<template>
  <!-- <div class="app-container"> -->
  <div class="app-container">
    <el-card class="box-card">
      <div class="text item">
        {{productTitle}}
        <el-button type="primary" size="medium" v-waves class="filter-item">切换分类</el-button>
        <!-- <el-cascader :options="addressOptions" :props="addressProps"></el-cascader> -->
      </div>
    </el-card>
    <el-form v-loading="diaLoading" ref="addData" :rules="rules" :model="addForm" label-position="right" label-width="70px" style="">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div  class="text item">
        <el-form-item label="标题">
          <el-input class="long-input" v-model="addForm.title" size="medium" maxlength="64" placeholder="请输入名称，如：品种+口感+产地+用途等" />
        </el-form-item>
        <el-form-item v-for="(item, index) in baseData" :key="index" :label="item.name" :prop="'generate.' + index + '.value'">
          <template v-if="item.inputType === 0">
            <el-cascader
              v-model="addForm.generate[index].list"
              placeholder=""
              :options="addressOptions"
              :props="addressProps"
              style="width: 200px;"
              class="filter-item mr20"
              @change="selectChange"
              @focus="focus"
              @keyup.enter.native="handleFilter">
            </el-cascader>
          </template>
          <template v-else-if="item.inputType === 1">
            <el-radio-group v-model="addForm.generate[index].list" size="small">
              <el-radio v-for="(radioItem, radioIndex) in item.valueSet" :key="radioIndex" :label="radioItem.value" border>{{radioItem.value}}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.inputType === 2">
            <el-checkbox-group v-model="addForm.generate[index].list" @change="((val) => checkChange(val, index))">
              <el-checkbox v-for="(checkboxItem, checkboxIndex) in item.valueSet" :label="checkboxItem.value" :key="checkboxIndex">{{checkboxItem.value}}</el-checkbox>
            </el-checkbox-group>
             <el-checkbox :indeterminate="isIndeterminate" v-model="addForm.generate[index].checkAll" @change="((val) => handleCheckAllChange(val, index, item.id))">全选</el-checkbox>
          </template>
          <template v-else-if="item.inputType === 3">
            <el-select v-model="addForm.generate[index].list" size="medium" maxlength="64" placeholder="请选择">
              <el-option v-for="(selectItem, selectIndex) in item.valueSet" :key="selectIndex" :label="selectItem.id" :value="selectItem.value"></el-option>
            </el-select>
          </template>
          <template v-else-if="item.inputType === 4">
            <el-input class="long-input" v-model="addForm.generate[index].list" size="medium" maxlength="64" placeholder="" />
          </template>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>销售信息</span>
      </div>
      <div  class="text item">
        <el-form-item label="计量单位">
          <el-select v-model="addForm.unit" size="medium" maxlength="64" placeholder="请选择" @change="unitChange">
            <el-option v-for="(item, index) in sellData" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="showStyle.type === '2'" label="库存">
            <el-input class="short-input" v-model="addForm.sku[showStyle.id].store" size="medium" maxlength="30" />
        </el-form-item>
        <div v-if="showStyle.type === '2'">
          <div v-for="(stairItem, stairIndex) in stairArr" :key="stairIndex" class="unit-box">
            <span class="mr40">阶梯{{stairIndex + 1}}</span>
            <span class="mr5">起批数</span><el-input class="table-input mr40" v-model="addForm.sku[showStyle.id].list[stairIndex].number" size="small" maxlength="30" />
            <span class="mr5">单价</span><el-input class="table-input mr5" v-model="addForm.sku[showStyle.id].list[stairIndex].price" size="small" maxlength="30" /><span class="mr20">元</span><span class="mr10 unit-delete" @click="removeStair(stairIndex)">删除</span><span class="unit-add" v-show="stairIndex === stairArr.length - 1" @click="addStair(stairIndex, showStyle.id)">新增阶梯</span>
          </div>
        </div>
        <div v-else-if="showStyle.type === '1'">
          <table class="table-box">
            <thead>
              <tr>
                <td>规格名称</td>
                <td>起批量</td>
                <td>单价</td>
                <td>库存</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(boxItem, boxIndex) in boxArr" :key="boxIndex">
                <td><span class="mr5">每箱</span><el-input class="table-input" v-model="addForm.sku[showStyle.id].list[boxIndex].name" size="small" maxlength="30" /></td>
                <td><el-input class="table-input" v-model="addForm.sku[showStyle.id].list[boxIndex].number" size="small" maxlength="30" /></td>
                <td><el-input class="table-input mr5" v-model="addForm.sku[showStyle.id].list[boxIndex].price" size="small" maxlength="30" /><span>元</span></td>
                <td><el-input class="table-input" v-model="addForm.sku[showStyle.id].list[boxIndex].store" size="small" maxlength="30" /></td>
                <td>
                  <span class="mr10 unit-delete" @click="removeBox(boxIndex, boxItem.id)">删除</span><span v-show="boxIndex === boxArr.length - 1" class="unit-add" @click="addBox(boxIndex, showStyle.id)">新增规格</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图文视图</span>
      </div>
      <div  class="text item">
        <el-form-item label="商品视图">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <div>
            <p>还能添加10张图片或视频；</p>
            <p>* 文件大小不能超过3MB，包括图片和视频；图片建议尺寸500*500；支持JPG、GIF、PNG格式；</p>
            <p>* 默认第一张图片为商品封面图；</p>
          </div>
        </el-form-item>
        <el-form-item label="介绍文案">
          <el-input
            class="long-input"
            v-model="addForm.remark"
            maxlength="255"
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
          <el-select v-model="value" size="medium" maxlength="64" placeholder="请选择">
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
        <el-button v-waves class="filter-item">保存待上架</el-button>
        <el-button type="primary" v-waves class="filter-item" @click="onSale">上架出售</el-button>
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
   
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getByCategoryId, getUnit, saveGoods } from '@/api/goods/list'
import { getAd } from '@/api/upms/strict'
import { fileUpload } from '@/api/goods/upload'
let id = 0;
export default {
  name: 'addProduct',
  directives: { waves },
  data() {
    return {
      categoryId: '',
      baseData: [],
      sellData: [],
      addData: [],
      boxData: [],
      treeProps: {},
      treeValue: '',
      productTitle: '',
      id: '',
      eid: '',
      addressOptions: [],
      checkboxObj: {},
      addressObj: {},
      addressProps: {
        lazy: true,
        lazyLoad (node, resolve) {
          getAd({ parentId: node.value == undefined ? 0 : node.value }).then( res => {
            if(Array.isArray(res.data)) {
              res.data.map((item) => {
                item.leaf = item.haveChild === 0
              });
              resolve(res.data);
            }
          })
        },
        value: "id",
        label: "name",
      },
      addForm: {
        sku: {},
        generate: [],
      },
      stairArr: [''],
      boxArr: [''],
      imgsBox: [],
      showAble: {},
      showStyle: {
        type: '',
        id: '',
      },
      checkedCities: [],
      checkAll: false,
      isIndeterminate: false,
      rules: {},
      value: '',
      previewDialog: false,
      diaLoading: false,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  components: {  },
  computed: {

  },
  created() {
    console.log('add page')
    console.log(this.$route)
    this.categoryId = this.$route.query.id 
    this.getByCategoryId(this.categoryId)
    this.$route.query.des.forEach((item) => {
      this.productTitle += this.productTitle.length === 0 ? item : '-' + item
    })
    this.getUnit(this.$route.query.id)
    // this.getAddress()
  },
  methods: {
    getByCategoryId(id) {
      // 通过ID获取规格模板
      this.listLoading = true
      getByCategoryId({
        categoryId : id
      }).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          res.data.forEach((item, index) => {
            let obj = {}
            if(item.inputType === 2) {
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
          });
          this.baseData = res.data
        }
      })
    },
    getUnit(id) {
      // 通过ID获取规格模板
      this.listLoading = true
      getUnit({
        categoryId : id
      }).then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          res.data.forEach(item => {
            let itemId = item.id 
            let obj = {}
            let objP = {}
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
            objP[itemId] = obj
            this.$set(this.addForm, 'sku', objP)
            this.showAble[itemId] = item.showStyle
          });
          this.sellData = res.data
        }
        console.log(this.addForm)
      })
    },
    uploadImg(file) {
      let formData = new FormData()
      formData.append('file', file.file)
      fileUpload(formData).then(res => {
        this.imgsBox.push({
          imgUrl: res.data,
          type: 1
        })
      })
    },
    getAddress() {
      // 获取产地信息
      getAd({ parentId: 0 }).then(res => {
        this.addressOptions = res.data
      })
    },
    unitChange(val) {
      // 计量单位选择
      this.showStyle.type = this.showAble[val]
      this.showStyle.id = val
      console.log('ok', val)
      console.log(this.addForm)
      console.log(this.showStyle)
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
      this.stairArr.push('')
    },
    removeStair(index, id) {
      // 删除阶梯价
      this.addForm.sku[id].list.splice(index, 1)
      this.stairArr.splice(index, 1)
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
        this.boxArr.push({})
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
      this.boxArr.splice(index, 1)
    },
    preView() {
      // 预览
      this.previewDialog = true
    },
    onSale() {
      // 上架
      let goodsVO = {}
      // 商品外部信息
      goodsVO.categoryId = this.categoryId
      goodsVO.name = this.addForm.title
      goodsVO.detail = this.addForm.remark
      goodsVO.showStyle = this.showStyle.type
      goodsVO.postPayType = 0
      goodsVO.postPrice = 0
      goodsVO.postSettingId = 'postSettingId'
      // 商品动态生成的基础信息
      goodsVO.goodsAttrList = []
      console.log(this.addForm.generate)
     
      this.addForm.generate.forEach(item => {
        let obj = {}
        obj.name = item.name
        obj.categoryAttrId = item.id
        obj.nameGroup = item.nameGroup
        obj.goodsAttrValueList = []
        if(Array.isArray(item.list)) {
          item.list.forEach(item => {
            obj.goodsAttrValueList.push({
              value: item
            })
          })
        } else {
          obj.goodsAttrValueList.push({
            value: item.list
          })
        }

        goodsVO.goodsAttrList.push(obj)
      })
      // 商品sku信息
      goodsVO.goodsSkuList = []
      goodsVO.goodsSpecList = []
      
      for(let key in this.addForm.sku) {
          this.addForm.sku[key].list.forEach((item) => {
          let first = true
          let skuObj = {}
          let speObj = {}
          skuObj.priceExpList = [] 
          speObj.goodsSpecValueList = []
          if(first) {
            first = false
            this.addForm.sku[key].list.forEach((itemIn) => {
              let itemObj = {}
              let itemObj2 = {}
              itemObj.price = itemIn.price
              itemObj.startQuantity = itemIn.number
              skuObj.priceExpList.push(itemObj)
              if (this.addForm.sku[key].showStyle == 1) {
                itemObj2 = {
                  value: item.name
                }
              } else {
                itemObj2 = {
                  value: '1'
                }
              }
              speObj.goodsSpecValueList.push(itemObj2)
            })
          }
          
          if (this.addForm.sku[key].showStyle == 1) {
            skuObj.stock = item.store
          } else {
            skuObj.stock = this.addForm.sku[key].store
          }
          skuObj.priceType = this.addForm.sku[key].showStyle
          skuObj.specValueNames = [this.addForm.sku[key].name]    
          speObj.categorySpecId = this.addForm.sku[key].id
          speObj.name = this.addForm.sku[key].name
          goodsVO.goodsSkuList.push(skuObj)
          goodsVO.goodsSpecList.push(speObj)
        })
        
      }
      // 商品图片信息
      goodsVO.goodsImgList = this.imgsBox
      console.log(goodsVO)
      saveGoods({
        goodsVO: goodsVO
      })
    },
    selectChange() {

    },
    focus() {

    },
    handleCheckAllChange(val, index, id) {
      // 全选
      // this.addForm.generate[index].checkAll = val
      this.addForm.generate[index][id] = val ? this.checkboxObj[index] : [];
      this.isIndeterminate = false;
      console.log(this.addForm.generate[index][id])
    },
    handleRemove(file, fileList) {
      // 删除图片
      console.log(file, fileList);
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
    }
  }
}
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
      max-width: 100px;
    }
    .box-card{
      margin-bottom: 10px;
    }
    .unit-box,.table-box{
      font-size: 14px;
      color: #606266;
      padding-left: 30px;
      margin-bottom: 10px;
      font-weight: bold;
      .unit-delete{
        color: #ff0000;
        cursor: pointer;
      }
      .unit-add{
        color: #409EFF;
        cursor: pointer;
      }
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
