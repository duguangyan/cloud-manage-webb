<template>
  <!-- <div class="app-container"> -->
  <div v-loading="saveLoading" class="app-container">
    <el-card class="box-card">
      <div class="text item">
        <span style="#303133">当前分类：</span>{{productTitle}}
      </div>
    </el-card>
    <el-form v-loading="diaLoading" ref="productForm" label-position="right" label-width="120px" style="">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div  class="text item">
        <el-form-item label="标题:">
        <span>{{title}}</span>
        </el-form-item>
        <template v-for="(item, index) in attrData">
          <el-form-item 
          v-if="item"
          :key="index" 
          :label="item.name + ':'" >
           <span v-if="item.inputType === 0">{{item.goodsDetailAttrValueList[0].remark}}</span>
           <span v-else>{{item.goodsDetailAttrValueList[0].value}}</span>
          </el-form-item>
        </template>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>销售信息</span>
      </div>
      <template v-if="unitType === '1' || unitType === '2'">
        <el-form-item label="报价方式:">
          <span>默认报价方式</span>
        </el-form-item>
        <el-form-item 
          label="规格:">
          <span>{{unitName}}</span>
        </el-form-item>
        <el-form-item 
          v-if="unitType === '2'"
          label="库存">
            <span>{{stairStock}}</span>
        </el-form-item>
        <el-form-item>  
          <div v-if="unitType === '2'">
              <el-table
              :data="normalData"
              border
              style="width: 440px"
              >
              <el-table-column  label="起批量" prop="number" width="220" align="center">
              </el-table-column>
              <el-table-column label="价格(元)" prop="price" align="center">
              </el-table-column>
            </el-table>
          </div>
          <div v-else-if="unitType === '1'">
            <el-table
              :data="normalData"
              style="max-width: 880px"
              border>
              <el-table-column  label="规格名称" width="220" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attrValueList[0].value}}</span><span v-if="valueSuffix.length > 0">/{{valueSuffix}}</span>
                </template>
              </el-table-column>
              <el-table-column label="起批量" prop="startNum" width="220" align="center"></el-table-column>
              <el-table-column label="价格" prop="price" width="220" align="center"></el-table-column>
              <el-table-column label="库存" prop="stock" align="center"></el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="报价方式:">
          <span>更多报价方式</span>
        </el-form-item>
        <el-form-item 
          label="计量单位:">
          <span>{{unitName}}</span>
        </el-form-item>
        <el-form-item 
          v-for="(item, pIndex) in moreSpec" :key="pIndex"
          :label="item.selectValue + ':'">
          <span v-for="(vItem, vIndex) in item.list" :key="vIndex">
            <i style="font-style: normal" v-if="vIndex !== 0">、</i>
            {{vItem.value}}
          </span>
        </el-form-item>
        <el-form-item>  
          <el-table
            :data="moreSpecData"
            :span-method="arraySpanMethod"
            border>
            <el-table-column
              v-for="(columnItem, columnIndex) in moreSpec" :key="columnIndex"
              :label="columnItem.selectValue"
              align="center"
              >
              <template slot-scope="scope">
                <span>{{moreSpecData[scope.$index].itemValue[columnIndex].value}}</span>
              </template>
            </el-table-column>
            
            <el-table-column
              label="起批量"
              align="center"
              >
              <template slot-scope="scope">
                <span>{{moreSpecData[scope.$index].startNum}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="价格"
              align="center"
              >
              <template slot-scope="scope">
                <span>{{moreSpecData[scope.$index].price}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="库存">
              <template slot-scope="scope">
                <span>{{moreSpecData[scope.$index].store}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item> 
      </template>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图文描述</span>
      </div>
      <div  class="text item">
        <el-form-item 
          label="商品视图">
            <div class="imgs-item" v-for="(item, index) in imgsBox" :key="index" @click="handlePictureCardPreview(item.imgUrl)">
              <img :src="item.imgUrl" alt="">
            </div>
        </el-form-item>
        <el-form-item label="介绍文案:">
            <span>{{remark}}</span>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="">
      <div slot="header" class="clearfix">
        <span>物流信息</span>
      </div>
      <div  class="text item">
        <el-form-item label="运费设置:">
          <span>{{freightName}}</span>
        </el-form-item>
        <el-form-item 
        v-if="freightType === 2" 
        label="物流体积:">
         {{freightSize}} <span class="freight-type">立方</span> <span class="freight-des">当前运费模板，按物流体积（含包装）计</span>
        </el-form-item>
        <el-form-item 
        v-if="freightType === 3" label="物流重量:">
          {{freightWeight}} <span class="freight-type">千克</span> <span class="freight-des">当前运费模板，按物流重量（含包装）计</span>
        </el-form-item>
      </div>
    </el-card>
  </el-form>
    <div class="bottom-box" v-if="btnsPermission.onSale.auth || btnsPermission.offSale.auth">
      <div>
        <el-button v-if="btnsPermission.onSale.auth && (productStatus === 1 || productStatus === 4)" type="primary" v-waves class="filter-item" @click="saleChange(0, 3)">上架</el-button>
        <el-button v-if="btnsPermission.offSale.auth && productStatus === 3" type="primary" v-waves class="filter-item" @click="saleChange(1, 4)">下架</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getUnit, saveGoods, editGoods, getUnitList, getSpeList, getGoodsDetail, handlerGoods } from '@/api/goods/list'
import { getUserBtnByPId } from '@/api/upms/menu'
import { getFreight } from '@/api/goods/logistics'
import { getAd } from '@/api/upms/strict'
import { fileUpload } from '@/api/goods/upload'
import { constants } from 'crypto';
let id = 0;
let vm = {
  name: 'detailProduct',
  directives: { waves },
  data() {
    vm = this;
    return {
      btnsPermission: {
        onSale: {
          name: '上架',
          auth: false
        },
        offSale: {
          name: '下架',
          auth: false
        }
      },
      categoryId: '',
      eiditId: '',
      pageId: '',
      unitType: '',
      unitId: '',
      unitName: '',
      title: '',
      productStatus: '',
      productTitle: '',
      remark: '',
      stairStock: '',
      valueSuffix: '',
      valueSuffixObj: {},
      freight: '',
      freightType: '',
      freightName: '',
      freightSize: '',
      freightWeight: '',
      attrData: [],
      normalData: [],
      imgsBox: [],
      moreSpec: [],
      moreSpecData: [],
      combineObj: {},
      saveLoading: false,
      isCombine: false,
      diaLoading: false,
      moreLoading: false,
      dialogImageUrl: '',
      dialogVisible: false,
      goodsSkuData: [],
      skuCounter: 0
    }
  },
  created() {
    this.categoryId = this.$route.query.id
    this.eiditId = this.$route.query.eid
    this.pageId = this.$route.query.pageId
    this.getFreight()
  },
  mounted() {
    getUserBtnByPId({ parentId: this.pageId }).then(res => {
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
    getGoodsDetail() {
      getGoodsDetail({ goodsId: this.eiditId }).then(res => {
        this.productStatus = res.data.goods.status
        this.unitId = res.data.goods.unit
        this.unitType = res.data.goods.showStyle
        this.remark = res.data.goods.detail
        this.title = res.data.goods.name
        this.productTitle = res.data.categoryPath
        this.freight = res.data.goods.postSettingId
        this.freightData.forEach(item => {
          if(item.id === this.freight) {
            this.freightType = item.type
            this.freightName = item.name
            return false
          }
        })
        if(res.data.goodsSkuList.length > 0) {
          this.freightSize = res.data.goodsSkuList[0].volume
          this.freightWeight = res.data.goodsSkuList[0].weight
        }
        if(Array.isArray(res.data.goodsDetailAttrList)) {
          this.attrData = res.data.goodsDetailAttrList
        }
        if(Array.isArray(res.data.goodsImgVOList)) {
          this.imgsBox = res.data.goodsImgVOList
        }
        if(String(res.data.goods.showStyle) === '3') {
          this.getUnitList()
          this.getSpecList()
          // 多规格数据渲染
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
          this.moreSpec = specData
          this.specValueBlur('', 'true', true)
        } else { 
          let msgObj = {}
          msgObj.skuArr = []
          msgObj.showStyle = res.data.goods.showStyle
          msgObj.name = res.data.goodsDetailSpecList[0].name

          this.unitName = res.data.goodsDetailSpecList[0].name
          if (res.data.goods.showStyle === '1') {
            this.normalData = res.data.goodsSkuList
            this.getUnit()
          } else if(String(res.data.goods.showStyle) === '2') {
            let skuData = JSON.parse(res.data.goodsSkuList[0].priceExp)
            this.stairStock = res.data.goodsSkuList[0].stock
            skuData.forEach(item => {
              this.normalData.push({
                price: item.price,
                number: item.startQuantity
              })
            })
            this.getUnit()
          }
        }
        
      })
    },
    getFreight() {
      // 获取运费模板
      this.listLoading = true
      getFreight({ shopId: 1 }).then(res => {
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
        this.getGoodsDetail()
      })
    },
    getUnit() {
      // 通过ID获取规格模板
      this.moreLoading = true
       getUnit({
        categoryId: this.categoryId,
        status: 1
      }).then(res => {
        this.moreLoading = false
        if(Array.isArray(res.data)) {
          res.data.forEach(item => {
            let itemId = item.id 
            this.valueSuffixObj[itemId] = item.valueSuffix
          });
          if(this.unitId !== null) {
            this.valueSuffix = this.valueSuffixObj[this.unitId]
          }
        }
      })
    },
    async getUnitList() {
      this.moreLoading = true
      await getUnitList({ categoryId: this.categoryId, status: 1 }).then(res => {
        this.moreLoading = false
        if(Array.isArray(res.data)) {
          res.data.forEach(item => {
            if(item.id === this.unitId) {
              this.unitName = item.name
            }
          })
        }
      }).catch(err => [
        this.moreLoading = false
      ])
    },
    getSpecList() {
      getSpeList({ categoryId: this.categoryId }).then(res => {
        this.moreLoading = false
        if(Array.isArray(res.data)) {
          this.sellSpeData = res.data
        }
        
      }).catch(err => {
        this.moreLoading = false
      })
    },
    handlePictureCardPreview(url) {
      // 图片预览
      this.dialogImageUrl = url;
      this.dialogVisible = true;
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
        let limit = this.moreSpec.length
        let result = []
        if(isInit) {
           this.createTree(this.moreSpec, 0, limit, result, arr, true)
        } else {
           this.createTree(this.moreSpec, 0, limit, result, arr, false)
        }
        let combineObj = {}
        let combineLen = 0
        let combineIndex = 0
        let len = this.moreSpec.length
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
        this.moreSpecData = arr
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
    saleChange(type, status) {
      // 上下架
      let msg = ''
      let succMsg = ''
      let ids = ''
      if(type === 0) {
        msg = '确定要上架该商品？'
        succMsg = '上架成功'
      } else if (type === 1) {
        msg ='确定要下架该商品？'
        succMsg = '下架成功'
      }
      
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.saveLoading = true
          handlerGoods({ 
            goodsId: this.eiditId,
            handlerType: type
          }).then(res => {
            this.saveLoading = false
            this.$notify({
              title: succMsg,
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            this.productStatus = status
          })
        })
    },
  }
}
export default vm;
</script>

<style lang="scss" scoped>
.imgs-item{
    overflow: hidden;
    background-color: #fff;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    display: inline-block;
    cursor: pointer;
    img{
      width: 100%;
      height: 100%;
    }
  }
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
  }
</style>