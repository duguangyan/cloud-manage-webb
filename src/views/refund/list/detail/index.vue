<template>
  <!-- <div class="app-container"> -->
  <div v-loading="saveLoading" class="app-container">
    <el-card class="box-card">
      <div class="text item">
        <span style="#303133">审核状态：</span><span style="font-size: 20px; font-weight: 400; color: #ff6600;">待审核</span>
        <div style="float:right;font-weight:bold;" v-if="productStatus == 2">该商品审核不通过，修改为 <span @click="check(1)" style="color:#66b1ff;cursor:pointer;">通过</span></div>
      </div>
    </el-card>
    <el-form v-loading="diaLoading" ref="productForm" label-position="right" label-width="120px" style="">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>买家信息</span>
      </div>
      <div  class="text item">
        <el-form-item label="买家昵称:">
          <span>小李飞刀</span>
        </el-form-item>
        <el-form-item label="买家账号:">
         <span>XX44SKKDF99</span>
        </el-form-item>
        <el-form-item label="绑定手机号:">
          <span>13665545884</span>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单信息</span>
      </div>
      <el-form-item label="订单状态:">
        <span>待付款</span>
      </el-form-item>
      <el-form-item label="下单时间:">
        <span>2019-12-22 09:23:43</span>
      </el-form-item>
      <el-form-item label="申请退款时间:">
        <span>2019-12-25 09:23:43</span>
      </el-form-item>
      <el-form-item label="退款单号:">
        <span>125455658451210125545155</span>
      </el-form-item>
       <!-- <template v-for="(item, index) in attrData">
          <el-form-item 
          v-if="item"
          :key="index" 
          :label="item.name + ':'" >
          <template v-if="item.inputType === 0">
            <span>{{item.goodsDetailAttrValueList[0].remark}}</span>
          </template>
          <template v-else-if="item.inputType === 2">
            <span class="mr10" v-for="(vItem, vIndex) in item.goodsDetailAttrValueList" :key="vIndex">{{vItem.value}}</span>
          </template>
          <template v-else>
            <span>{{item.goodsDetailAttrValueList[0].value}}</span>
          </template>
          </el-form-item>
        </template> -->
    </el-card>
    <!-- <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>退款商品信息</span>
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
          label="库存:">
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
    </el-card> -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>退款商品信息</span>
      </div>
      <div class="product-box">
        <div class="product-box">
            <div class="product-left">
              <img src="https://xx-cloud.oss-cn-shenzhen.aliyuncs.com/4ff82bf53f154f399b8924f2da20b187.jpg" alt="">
            </div>
            <div class="product-right">
              <div class="des">福建六鳌地瓜新鲜红心甜红薯</div>
              <div>5斤/箱 10斤/箱</div>
            </div>
          </div>
      </div>
      <el-form-item label="数量:">
        <span>20</span>
      </el-form-item>
      <el-form-item label="退款金额:">
        <span>￥900.00</span>
      </el-form-item>
      <el-form-item label="货物状态:">
        <span>已收到货</span>
      </el-form-item>
      <el-form-item label="退款原因:">
        <span>不想要了</span>
      </el-form-item>
      <el-form-item label="退款说名:">
        <span>请尽快退款</span>
      </el-form-item>
      <el-form-item 
        label="凭证照片:">
          <div class="imgs-item" v-for="(item, index) in imgsBoxDetail" :key="index" @click="handlePictureCardPreview(item.imgUrl, 1)">
            <img :src="item.imgUrl" alt="">
          </div>
      </el-form-item>
    </el-card>
    <el-card v-if="productStatus == 2">
      <div slot="header" class="clearfix">
        <span>审核不通过原因</span>
      </div>
      <div  class="text item">
        <el-form-item label="原因:">
          <span>{{noPassReason}}</span>
        </el-form-item>
      </div>
    </el-card>
    <el-card v-if="productStatus == 3">
      <div slot="header" class="clearfix">
        <span>代办信息</span>
      </div>
      <div  class="text item">
        <el-form-item v-for="(item, index) in agencyList" :key="index" :label="'代办'+(index + 1)+':'">
          <span style="margin: 0 5px;">{{item.realName}}</span>
          <span>{{item.phone}}</span>
        </el-form-item>
      </div>
    </el-card>
    <el-card v-if="productStatus == 4">
      <div slot="header" class="clearfix">
        <span>下架原因</span>
      </div>
      <div  class="text item">
        <el-form-item label="原因:">
          <span>{{downReason}}</span>
        </el-form-item>
      </div>
    </el-card>
  </el-form>
    <div class="bottom-box" v-if="(btnsPermission.check.auth || btnsPermission.offSale.auth) && (productStatus == 0 || productStatus == 3 || productStatus == 4)">
       <template v-if="btnsPermission.onSale.auth && productStatus == 0">
        <el-button type="primary" v-waves class="filter-item" @click="check(1)">通过</el-button>
        <el-button type="primary" v-waves class="filter-item" @click="handleCheck">不通过</el-button>
      </template>
      <template v-else-if="btnsPermission.offSale.auth && productStatus == 3">
        <el-button v-if="btnsPermission.offSale.auth" type="primary" v-waves class="filter-item" @click="offSale()">{{btnsPermission.offSale.name}}</el-button>
      </template>
      <template v-else-if="btnsPermission.onSale.auth && productStatus == 4">
        <el-button v-if="btnsPermission.onSale.auth" type="primary" v-waves class="filter-item" @click="saleChange('one', 0)">{{btnsPermission.onSale.name}}</el-button>
      </template>
      <!-- <div>
        <el-button v-if="btnsPermission.onSale.auth && (productStatus === 1 || productStatus === 4)" type="primary" v-waves class="filter-item" @click="saleChange(0, 3)">上架</el-button>
        <el-button v-if="btnsPermission.offSale.auth && productStatus === 3" type="primary" v-waves class="filter-item" @click="saleChange(1, 4)">下架</el-button>
      </div> -->
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <template v-if="dialogType === 1">
        <div>
          <img width="100%" :src="dialogImageUrl" alt="">
        </div>
      </template>
      <template v-else-if="dialogType === 2">
        <div style="text-align: center;">
          <video  style="max-width: 100%;max-height: 800px;" :src="dialogImageUrl" controls="controls">
          您的浏览器不支持视频播放。
          </video>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="填写原因" :closeOnClickModal="false" :visible.sync="dialogCheckVisible">
      <el-form v-loading="diaLoading" ref="reasonForm" :model="reasonForm" label-position="left" label-width="100px">
        <el-form-item label="不通过原因"
        v-if="productStatus == 0"
        prop="reason"
        :rules="{
            required: true, message: '请填写不通过原因', trigger: 'blur'
        }">
          <el-input
            v-model.trim="reasonForm.reason"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            placeholder="请在此填写不通过原因一遍商家改进"
          />
        </el-form-item>
        <el-form-item label="下架原因"
        v-else-if="productStatus == 3"
        prop="offReason"
        :rules="{
            required: true, message: '请填写下架原因', trigger: 'blur'
        }">
          <el-input
            v-model.trim="reasonForm.offReason"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8}"
            type="textarea"
            placeholder="请在此填写下架原因"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="diaDisable" @click="sure">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getGoodsDetail, handlerGoods, goodsAudit } from '@/api/goods/list'
import { getUserBtnByPId } from '@/api/upms/menu'
import { getFreight } from '@/api/goods/logistics'
let id = 0;
let vm = {
  name: 'refundListDetail',
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
        },
        check: {
          name: '审核',
          auth: false
        }
      },
      categoryId: '',
      eiditId: '',
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
      imgsBoxMain: [],
      imgsBoxDetail: [
        {
          imgUrl: 'https://xx-cloud.oss-cn-shenzhen.aliyuncs.com/4ff82bf53f154f399b8924f2da20b187.jpg',
        },
        {
          imgUrl: 'https://xx-cloud.oss-cn-shenzhen.aliyuncs.com/9c0e8f9a2fdc4e22b04e01e6ff71ace4.jpg',
        }
      ],
      moreSpec: [],
      moreSpecData: [],
      combineObj: {},
      saveLoading: false,
      isCombine: false,
      diaLoading: false,
      moreLoading: false,
      dialogType: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      dialogCheckVisible: false,
      goodsSkuData: [],
      skuCounter: 0,
      userRealInfoVo: {
        realName: '',
      },
      noPassReason: '',
      downReason: '',
      agencyList: [],
      reasonForm: {
        reason: '',
        offReason: ''
      },
      diaDisable: false,
    }
  },
  created() {
    // this.categoryId = this.$route.query.id
    // this.eiditId = this.$route.query.eid
    // this.getGoodsDetail()
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
    getGoodsDetail() {
      getGoodsDetail({ goodsId: this.eiditId }).then(res => {
        // 货主信息
        if(res.data.userRealInfoVo) {
          this.userRealInfoVo.realName = res.data.userRealInfoVo.realName;
        }

        if(res.data.goods) {
          this.productStatus = res.data.goods.status
          this.unitId = res.data.goods.unit
          this.unitType = res.data.goods.showStyle
          this.remark = res.data.goods.detail
          this.title = res.data.goods.name
          this.productTitle = res.data.categoryPath
          this.freight = res.data.goods.postSettingId
          // 下架原因
          this.downReason = res.data.goods.downReason;
        }
        
        // 不通过原因
        if(res.data.goodsAuditLogVO) {
          this.noPassReason = res.data.goodsAuditLogVO.auditOpinion;
        }

        // 代办人信息
        if(res.data.agencyList) {
          this.agencyList = res.data.agencyList;
        }

        if(res.data.goodsSkuList.length > 0) {
          this.freightSize = res.data.goodsSkuList[0].volume
          this.freightWeight = res.data.goodsSkuList[0].weight
        }
        if(Array.isArray(res.data.goodsDetailAttrList)) {
          this.attrData = res.data.goodsDetailAttrList
        }
        if(Array.isArray(res.data.goodsImgVOList)) {
          // 获取主图与详情图 primaryType： 1 主图 2 详情图
          let imgArrMain = [];
          let imgArrDetail = [];
          res.data.goodsImgVOList.forEach(item => {
            if(item.type === 1) {
              if(item.primaryType === 1) {
                imgArrMain.push({
                  imgUrl: item.imgUrl,
                  source: item.imgUrl,
                  type: 1
                })
              } else {
                imgArrDetail.push({
                  imgUrl: item.imgUrl,
                  source: item.imgUrl,
                  type: 1
                })
              }
              
            } else if(item.type === 2) {
              let preUrl = ''
              res.data.goodsImgVOList.forEach(vItem => {
                if(vItem.type === 3 && vItem.sort === item.sort) {
                  preUrl = vItem.imgUrl
                  return false
                }
              })
              if(item.primaryType === 1) {
                imgArrMain.push({
                  imgUrl: preUrl,
                  source: item.imgUrl,
                  type: 2
                })
              } else {
                imgArrDetail.push({
                  imgUrl: preUrl,
                  source: item.imgUrl,
                  type: 2
                })
              }
              
            }
          })
          this.imgsBoxMain = imgArrMain;
          this.imgsBoxDetail = imgArrDetail;
        }
        if(String(res.data.goods.showStyle) === '3') {
          this.unitName = res.data.goods.unitName
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
          this.unitName = res.data.goodsDetailSpecList[0].name
          if (res.data.goods.showStyle === '1') {
            this.normalData = res.data.goodsSkuList
            this.valueSuffix = res.data.goodsDetailSpecList[0].valueSuffix
          } else if(String(res.data.goods.showStyle) === '2') {
            let skuData = JSON.parse(res.data.goodsSkuList[0].priceExp)
            this.stairStock = res.data.goodsSkuList[0].stock
            skuData.forEach(item => {
              this.normalData.push({
                price: item.price,
                number: item.startQuantity
              })
            })
          }
        }
        
      })
    },
    handlePictureCardPreview(url, type) {
      // 图片预览
      this.dialogType = type
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
    saleChange(isOne, type) {
      // 上下架
      let msg = ''
      let succMsg = ''
      if(isOne === 'one') {
        if(type === 0) {
          msg = '确定要上架该商品？'
          succMsg = '上架成功'
        } else if (type === 1) {
          msg ='确定要下架该商品？'
          succMsg = '下架成功'
        }
      } 
      // else {
      //   this.multipleSelection.forEach((item) => {
      //     ids.push(item.id)
      //   })
      //   if(type === 0) {
      //     msg = '确定要批量上架这些商品？'
      //     succMsg = '批量上架成功'
      //   } else if (type === 1) {
      //     msg ='确定要批量下架这些商品？'
      //     succMsg = '批量下架成功'
      //   }
      // }
      
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.diaLoading = true
          let param = {
            goodsIds: [this.eiditId],
            handlerType: type
          }
          if(type === 1) {
            param.reason = this.reasonForm.offReason
          }
          handlerGoods(JSON.stringify(param)).then(res => {
            this.dialogCheckVisible = false
            this.diaLoading = false
            this.$notify({
              title: succMsg,
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            this.$router.push({path: '/product/list', query:{
              status: this.productStatus
            }})
          }).catch(err => {
            this.diaLoading = false
          })
        })
    },
    offSale() {
      // 填写下架原因
      this.dialogCheckVisible = true
      this.$nextTick(() => {
        this.$refs['reasonForm'].clearValidate()
      })
    },
    sure() {
      this.$refs['reasonForm'].validate((valid) => {
        if(valid) {
          if(this.productStatus == 0) {
            this.check(2)
          } else if(this.productStatus == 3) {
            this.saleChange('one', 1)
          }
        }
      })
    },
    handleCheck() {
      this.dialogCheckVisible = true
      this.$nextTick(() => {
        this.$refs['reasonForm'].clearValidate()
      })
    },
    check(type) {
      let noticeMsg = ''
      if(type === 1) {
        noticeMsg = '确定通过审核？'
      } else {
        noticeMsg = '确定不通过审核？'
      }
      this.$confirm(noticeMsg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.diaLoading = true
        this.diaDisable = true
        let param = {
          auditUserId: this.$store.getters.userId,
          goodsId: this.eiditId,
          status: type,
          auditOpinion: this.reasonForm.reason
        }
        goodsAudit(JSON.stringify(param)).then(res => {
          this.diaLoading = false
          this.diaDisable = false
          this.dialogCheckVisible = false
          this.$notify({
            title: '成功',
            message: '审核成功！',
            type: 'success',
            duration: 2000
          })
          this.$router.push({path: '/product/list', query:{ 
            status: this.productStatus
          }})
        }).catch(err => {
          this.diaLoading = false
          this.diaDisable = false
        })
      })
    }
  }
}
export default vm;
</script>

<style lang="scss" scoped>
.product-box{
    max-width: 100%;
    height: 75px;
    color: #303133;
    font-size: 14px;
    margin-bottom: 22px;
    padding-left: 20px;
    min-width: 400px;
    .product-left{
      max-width: 20%;
      height: 75px;
      float: left;
      padding-right: 35px;
      img{
        width: 75px;
        height: 75px;
      }
    }
    .product-right{
      text-align: left;
      max-width: 80%;
      height: 75px;
      line-height: 20px;
      float: left;
      padding-top: 5px;
      .des{
        height: 40px;
        margin-bottom: 5px;
        overflow: hidden;
      }
    }
  }

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
    position: relative;
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