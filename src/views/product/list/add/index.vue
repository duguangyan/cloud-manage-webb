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
          <!-- <div><span>100</span>/100</div> -->
        </el-form-item>
        <el-form-item label="产地">
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
        </el-form-item>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>销售信息</span>
      </div>
      <div  class="text item">
        <el-form-item label="计量单位">
          <el-select v-model="value" size="medium" maxlength="64" placeholder="请选择">
            <el-option
              v-for="item in addForm.unit"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="库存">
            <el-input class="short-input" v-model="addForm.weight" size="medium" maxlength="30" />
        </el-form-item>
        <div class="unit-box">
          <span class="mr40">阶梯1</span>
          <span class="mr5">起批数</span><el-input class="short-input mr40" v-model="addForm.weight" size="medium" maxlength="30" />
          <span class="mr5">单价</span><el-input class="short-input mr5" v-model="addForm.weight" size="medium" maxlength="30" /><span class="mr20">元</span><span class="mr10 unit-delete">删除</span><span class="unit-add">新增阶梯</span>
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
        <el-button v-waves class="filter-item">预览</el-button>
        <el-button v-waves class="filter-item">保存待上架</el-button>
        <el-button type="primary" v-waves class="filter-item">上架出售</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
let id = 0;
export default {
  name: 'addProduct',
  directives: { waves },
  data() {
    return {
      addData: [],
      sellData: [],
      boxData: [],
      addForm: {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        unit: [{
          value: 1,
          label: '斤'
        }, {
          value: 2,
          label: '公斤'
        }, {
          value: 3,
          label: '箱'
        }, {
          value: 4,
          label: '吨'
        }],
        user: []
      },
      checkedCities: [],
      checkAll: false,
      cities: ['烤薯', '煮薯', '薯片', '鲜食', '成品'],
      isIndeterminate: false,
      rules: {},
      value: '',
      diaLoading: false,
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  components: {  },
  computed: {

  },
  created() {
    // console.log(this.$route)
  },
  methods: {
    handleCheckAllChange(val) {
      console.log(val)
      if(val) {
        this.checkAll = true
      }
      this.addData.use = val ? this.cities : [];
      console.log(this.checkedCities)
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
    .box-card{
      margin-bottom: 10px;
    }
    .unit-box{
      font-size: 14px;
      color: #606266;
      padding-left: 30px;
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
  }
</style>