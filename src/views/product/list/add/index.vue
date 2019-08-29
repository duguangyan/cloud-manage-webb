<template>
  <!-- <div class="app-container"> -->
  <div class="app-container">
    <el-card class="box-card">
      <div class="text item">
        当前分类： 农产品-蔬菜-红薯-烟薯25号
        <el-button type="primary" size="medium" v-waves class="filter-item">切换分类</el-button>
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
              v-model="treeValue"
              :options="item.valueSet"
              :props="treeProps"
              placeholder="请选择品种"
              style="width: 200px;" 
              class="filter-item mr20"
              @change="selectChange"
              @focus="focus"
              @keyup.enter.native="handleFilter">
            </el-cascader>
          </template>
          <template v-else-if="item.inputType === 1">
            <el-radio-group v-model="addForm.generate[index].value" size="small">
              <el-radio v-for="(radioItem, radioIndex) in item.valueSet" :key="radioIndex" :label="radioItem.id" border>{{radioItem.value}}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="item.inputType === 2">
            <el-checkbox-group v-model="addForm.generate[index].value">
              <el-checkbox v-for="(checkboxItem, checkboxIndex) in item.valueSet" :label="checkboxItem.id" :key="checkboxIndex">{{checkboxItem.value}}</el-checkbox>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="((val) => handleCheckAllChange(val, index))">全选</el-checkbox>
            </el-checkbox-group>
          </template>
          <template v-else-if="item.inputType === 3">
            <el-select v-model="addForm.generate[index].value" size="medium" maxlength="64" placeholder="请选择">
              <el-option v-for="(selectItem, selectIndex) in item.valueSet" :key="selectIndex" :label="selectItem.id" :value="selectItem.value"></el-option>
            </el-select>
          </template>
          <template v-else-if="item.inputType === 4">
            <el-input class="long-input" v-model="addForm.generate[index].value" size="medium" maxlength="64" placeholder="" />
          </template>
        </el-form-item>
        <!-- <el-form-item label="产地">
          <el-select v-model="value" size="medium" maxlength="64" placeholder="请选择">
          <el-option
            v-for="item in addForm.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="口感">
          <el-radio-group v-model="addForm.taste" size="small">
            <el-radio label="1" border>糯</el-radio>
            <el-radio label="2" border>粉</el-radio>
            <el-radio label="2" border>面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="署皮颜色">
          <el-radio-group v-model="addForm.color" size="small">
            <el-radio label="1" border>红皮</el-radio>
            <el-radio label="2" border>黄皮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="署心颜色">
          <el-radio-group v-model="addForm.heart" size="small">
            <el-radio label="1" border>红心</el-radio>
            <el-radio label="2" border>白心</el-radio>
            <el-radio label="3" border>黑心</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单个重">
          <el-input class="short-input" v-model="addForm.weight" size="medium" maxlength="30" /><span style="margin-left: 10px;">两以上</span>
        </el-form-item>
        <el-form-item label="用途">
          <el-checkbox-group 
            v-model="addForm.user"
            >
            <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </el-checkbox-group>
        </el-form-item> -->
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
        <el-form-item v-if="showStyle === '1'" label="库存">
            <el-input class="short-input" v-model="addForm.stairStore" size="medium" maxlength="30" />
        </el-form-item>
        <div v-if="showStyle === '1'">
          <div v-for="(stairItem, stairIndex) in stairArr" :key="stairIndex" class="unit-box">
            <span class="mr40">阶梯{{stairIndex + 1}}</span>
            <span class="mr5">起批数</span><el-input class="table-input mr40" v-model="addForm.stair[stairIndex].number" size="small" maxlength="30" />
            <span class="mr5">单价</span><el-input class="table-input mr5" v-model="addForm.stair[stairIndex].price" size="small" maxlength="30" /><span class="mr20">元</span><span class="mr10 unit-delete" @click="removeStair(stairIndex)">删除</span><span class="unit-add" v-show="stairIndex === stairArr.length - 1" @click="addStair(stairIndex)">新增阶梯</span>
          </div>
        </div>
        <div v-else-if="showStyle === '0'">
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
                <td><span class="mr5">每箱</span><el-input class="table-input" v-model="addForm.box[boxIndex].name" size="small" maxlength="30" /></td>
                <td><el-input class="table-input" v-model="addForm.box[boxIndex].number" size="small" maxlength="30" /></td>
                <td><el-input class="table-input mr5" v-model="addForm.box[boxIndex].price" size="small" maxlength="30" /><span>元</span></td>
                <td><el-input class="table-input" v-model="addForm.box[boxIndex].store" size="small" maxlength="30" /></td>
                <td>
                  <span class="mr10 unit-delete" @click="removeBox(boxIndex)">删除</span><span v-show="boxIndex === boxArr.length - 1" class="unit-add" @click="addBox(boxIndex)">新增规格</span>
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
import { getByCategoryId, getUnit } from '@/api/goods/list'
let id = 0;
export default {
  name: 'addProduct',
  directives: { waves },
  data() {
    return {
      baseData: [],
      sellData: [],
      addData: [],
      boxData: [],
      treeProps: {},
      treeValue: '',
      id: '',
      eid: '',
      addForm: {
        stair: [{
          number: '',
          price: ''
        }],
        stairStore: '',
        box: [{
          number: '',
          price: '',
          name: '',
          store: ''
        }],
        generate: [],
      },
      stairArr: [
        {}
      ],
      boxArr: [
        {}
      ],
      showAble: {},
      showStyle: '',
      checkboxObj: {},
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
    this.getByCategoryId(this.$route.query.id)
    this.getUnit(this.$route.query.id)
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
            console.log(item)
            if(item.inputType === 2) {
              this.checkboxObj[index] = item.valueSet.map((item) => {
                return item.id
              })
            }
            this.addForm.generate.push({
              value: item.inputType === 2 ? [] : ''
            })
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
            this.showAble[item.id] = item.showStyle
          });
          this.sellData = res.data
        }
      })
    },
    unitChange(val) {
      this.showStyle = this.showAble[val]
      console.log(this.showStyle)
    },
    addStair(index) {
      const currentNum = this.addForm.stair[index].number
      const currentPrice = this.addForm.stair[index].price
      if(currentNum && currentPrice) {
        if(index > 0) {
          const preNum = this.addForm.stair[index - 1].number
          const prePrice = this.addForm.stair[index - 1].price
          if(currentNum <= preNum || currentPrice >= prePrice) {
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
      this.addForm.stair.push({
          number: '',
          price: ''
        })
      this.stairArr.push({})
    },
    removeStair(index) {
      this.addForm.stair.splice(index, 1)
      this.stairArr.splice(index, 1)
    },
    addBox(index) {
      const currentNum = this.addForm.box[index].number
      const currentPrice = this.addForm.box[index].price
      const currentName = this.addForm.box[index].name
      const currentStore = this.addForm.box[index].store
      if(currentNum && currentPrice && currentName && currentStore) {
        this.addForm.box.push({
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
    removeBox(index) {
      this.addForm.box.splice(index, 1)
      this.boxArr.splice(index, 1)
    },
    preView() {
      this.previewDialog = true
    },
    onSale() {
      console.log(this.addForm)
    },
    selectChange() {

    },
    focus() {

    },
    handleCheckAllChange(val, index) {
      this.checkAll = val
      this.addForm.generate[index].value = val ? this.checkboxObj[index] : [];
      this.isIndeterminate = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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