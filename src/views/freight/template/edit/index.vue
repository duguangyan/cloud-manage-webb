<template>
  <div class="edit">
    <el-form :model="postSolution" :rules="postRules" ref="postSolution" :inline="true">
      <li>
        <el-form-item label="模板名称:" prop="name">
          <el-input class="w200" placeholder="请输入模板名称" v-model="postSolution.name" clearable></el-input>
        </el-form-item>
      </li>
      <li>
        <!-- 省 -->
        <el-form-item label="发货地址:" prop="province">
          <el-select v-model="postSolution.province" placeholder="请选择省份" @change="changeProvince">
            <el-option
              v-for="(item,index) in provinceList"
              :key="item.id + index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 市 -->
        <el-form-item prop="city">
          <el-select v-model="postSolution.city" placeholder="请选择市区" @change="changeCity">
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 区 -->
        <el-form-item prop="region">
          <el-select v-model="postSolution.region" placeholder="请选择">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 详细地址 -->
        <el-form-item prop="address">
          <el-input class="w200" placeholder="请输入详细地址" v-model="postSolution.address" clearable></el-input>
        </el-form-item>
      </li>

      <li>
        <el-form-item label="是否包邮:" prop="isPost">
          <el-radio v-model="postSolution.isPost" :label="0">自定义运费</el-radio>
          <el-radio v-model="postSolution.isPost" :label="1">卖家承担运费(包邮)</el-radio>
        </el-form-item>
      </li>

      <!-- 不包邮时显示 -->
      <template v-if="+postSolution.isPost===0">
        <li>
          <el-form-item label="计价方式:" prop="type">
            <el-radio-group v-model="postSolution.type">
              <el-radio :label="1">按件数</el-radio>
              <el-radio :label="2">按体积</el-radio>
              <el-radio :label="3">按重量</el-radio>
            </el-radio-group>
          </el-form-item>
        </li>

        <li class="w80">
          <div class="specific">操作说明:</div>
          <div>
            <el-form-item :label="'首'+accText" prop="defaultPost.firstVolume">
              <el-input
                placeholder="请输入内容"
                v-model="postSolution.defaultPost.firstVolume"
                clearable
              ></el-input>
              <span>{{unitText}}</span>
              &emsp;
            </el-form-item>

            <el-form-item label="首费:" prop="defaultPost.firstPrice">
              <el-input placeholder="请输入内容" v-model="postSolution.defaultPost.firstPrice" clearable></el-input>
              <span>元</span>
              &emsp;
            </el-form-item>

            <el-form-item :label="'续'+unitText" prop="defaultPost.continueVolume">
              <el-input
                placeholder="请输入内容"
                v-model="postSolution.defaultPost.continueVolume"
                clearable
              ></el-input>
              <span>{{unitText}}</span>
              &emsp;
            </el-form-item>

            <el-form-item label="续费:" prop="defaultPost.continuePrice">
              <el-input
                placeholder="请输入内容"
                v-model="postSolution.defaultPost.continuePrice"
                clearable
              ></el-input>
              <span>元</span>
            </el-form-item>
          </div>
        </li>

        <!-- 邮费方案表格 -->
        <template v-if="postSolution.solutionItemList.length >=8">
          <div class="specific disable">=为指定地区城市设置运费(最多只能添加8条啊)</div>
        </template>
        <div v-else class="specific" @click="callAreaSel(1,-1)">+为指定地区城市设置运费</div>

        <div class="table">
          <!-- row 1 -->
          <div class="rows table-head">
            <div class="cell">运送到</div>
            <div class="cell">首{{accText}}({{unitText}})</div>
            <div class="cell">首费(元)</div>
            <div class="cell">续{{accText}}({{unitText}})</div>
            <div class="cell">续费(元)</div>
            <div class="cell">操作</div>
          </div>

          <!-- rows -->
          <el-form
            :model="item"
            :rules="itemRules"
            class="rows"
            v-for="(item,index) in postSolution.solutionItemList"
            :key="item.id+index"
            :ref="'solutionItem'+index"
          >
            <div class="cell w1">
              <el-form-item prop="hasArea">
                <el-input class="hid-style" type="hidden" v-model="item.hasArea" />
                <el-button
                  v-if="item.areaExp.length < 1"
                  @click="callAreaSel(1,index)"
                  type="success"
                  size="mini"
                >选择地区</el-button>
                <span v-else>
                  <span v-for="item in item.areaExp" :key="item.id">{{item.name}}&emsp;</span>
                </span>
              </el-form-item>
            </div>

            <div class="cell">
              <el-form-item prop="firstVolume">
                <el-input type="number" v-model="item.firstVolume" clearable></el-input>
              </el-form-item>
            </div>

            <div class="cell">
              <el-form-item prop="firstPrice">
                <el-input type="number" v-model="item.firstPrice" clearable></el-input>
              </el-form-item>
            </div>

            <div class="cell">
              <el-form-item prop="continueVolume">
                <el-input type="number" v-model="item.continueVolume" clearable></el-input>
              </el-form-item>
            </div>

            <div class="cell">
              <el-form-item prop="continuePrice">
                <el-input type="number" v-model="item.continuePrice" clearable></el-input>
              </el-form-item>
            </div>

            <div class="cell w2">
              <el-button size="mini" type="warning" @click="callAreaSel(1,index)">修改地址</el-button>
              <el-button size="mini" type="danger" @click="delItem(index,1)">删除</el-button>
            </div>
          </el-form>
        </div>
        <div
          v-if="postSolution.solutionItemList.length > 0 && postSolution.solutionItemList.length < 8"
        >
          <el-button type="primary" size="mini" @click="callAreaSel(1,-1)">添加方案</el-button>
        </div>

        <!-- 邮费方案表格 -->
        <template v-if="postSolution.solutionFreeItemList.length >=8">
          <div class="specific disable">=指定条件包邮(最多只能添加8条啊)</div>
        </template>
        <div v-else class="specific" @click="callAreaSel(2,-1)">+指定条件包邮</div>

        <div class="table">
          <!-- row 1 -->
          <div class="rows table-head">
            <div class="cell">运送到</div>
            <div class="cell w3">设置包邮条件</div>
            <div class="cell">操作</div>
          </div>

          <!-- rows -->
          <el-form
            :model="item"
            :rules="freeRules"
            class="rows"
            v-for="(item,index) in postSolution.solutionFreeItemList"
            :key="index+item.id"
            :ref="'solutionFreeItem'+index"
          >
            <div class="cell w1">
              <el-form-item prop="hasArea">
                <el-input class="hid-style" type="hidden" v-model="item.hasArea" />
                <el-button
                  v-if="item.areaExp.length < 1"
                  @click="callAreaSel(2,index)"
                  type="success"
                  size="mini"
                >选择地区</el-button>
                <span v-else>
                  <span v-for="item in item.areaExp" :key="item.id">{{item.name}}&emsp;</span>
                </span>
              </el-form-item>
            </div>

            <div class="cell w80">
              <el-form-item prop="type">
                <el-select v-model="item.type">
                  <el-option :label="accText" value="1"></el-option>
                  <el-option label="金额" value="2"></el-option>
                  <el-option :label="`${accText}+金额`" value="3"></el-option>
                </el-select>&emsp;
              </el-form-item>

              <el-form-item v-if="+item.type === 1" prop="quantity">
                满
                <el-input v-model="item.quantity" type="number" placeholder="请输入件数" />件包邮
              </el-form-item>

              <el-form-item v-else-if="+item.type === 2" prop="price">
                满
                <el-input v-model="item.price" type="number" placeholder="请输入金额" />元包邮
              </el-form-item>

              <el-form-item v-else-if="+item.type === 3" prop="price">
                满
                <el-input v-model="item.quantity" type="number" placeholder="请输入件数" />件且满
                <el-input v-model="item.price" type="number" placeholder="请输入金额" />元包邮
              </el-form-item>
            </div>

            <div class="cell w2">
              <el-button size="mini" type="warning" @click="callAreaSel(2,index)">修改地址</el-button>
              <el-button size="mini" type="danger" @click="delItem(index,2)">删除</el-button>
            </div>
          </el-form>
        </div>
        <div
          v-if="postSolution.solutionFreeItemList.length > 0 && postSolution.solutionFreeItemList.length < 8"
        >
          <el-button type="primary" size="mini" @click="callAreaSel(2,-1)">添加方案</el-button>
        </div>
      </template>
      <div class="tc">
        <el-form-item>
          <el-button size="middle" type="text" @click="$router.go(-1)">取消</el-button>&emsp;
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            size="middle"
            type="success"
            @click="submitForm('postSolution')"
          >保存并返回</el-button>
        </el-form-item>
      </div>
    </el-form>

    <!-- 城市包邮选择地区对话框 -->
    <el-dialog title="选择地区" :visible.sync="isShowArea" width="600">
      <div class="area" v-for="(item,index) in provinceList" :key="index+item.id">
        <el-checkbox v-model="item.isChecked">
          <span :class="{hasChecked: item.hasChecked}">{{item.name}}</span>
        </el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowArea = false">取 消</el-button>
        <el-button type="primary" @click="selAreas">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 条件包邮选择地区对话框 -->
    <el-dialog title="选择地区" :visible.sync="isShowArea2" width="600">
      <div class="area" v-for="(item,index) in provinceList2" :key="item.id+index">
        <el-checkbox v-model="item.isChecked">
          <span :class="{hasChecked: item.hasChecked}">{{item.name}}</span>
        </el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowArea2 = false">取 消</el-button>
        <el-button type="primary" @click="selAreas">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail, doInsert, doUpdate, doDeletfe } from "@/api/goods/freight";
import { getAd } from "@/api/upms/strict";
import { preCopy } from "@/api/deep-copy";
var vm = {
  name: "freight-edit",
  data() {
    vm = this;
    return {
      switch: /* 更改type开关 */ true,
      accText: /* 计量文案 */ "",
      unitText: /* 单位文案 */ "",
      curIndex: /* 当前项邮费方案的序 */ -1,
      fullscreenLoading: false,
      itemRules: /*城市方案邮费表单规则*/ {
        hasArea: { required: true, message: "请选择地址", trigger: "blur" },
        firstVolume: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])$/,
            message: "请输入大于0的整数",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ],
        firstPrice: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入不小于1的整数(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 7, message: "输入范围1-9999.99", trigger: "blur" }
        ],
        continueVolume: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])$/,
            message: "请输入大于0的整数",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ],
        continuePrice: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入不小于1的整数(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 7, message: "输入范围1-9999.99", trigger: "blur" }
        ]
      },
      freeRules: /* 条件邮费表单规则 */ {
        hasArea: { required: true, message: "请选择地址", trigger: "blur" },
        type: { required: true, message: "请选择条件", trigger: "blur" },
        quantity: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])$/,
            message: "请输入大于0的整数",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入不小于1的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 7, message: "输入范围1-9999.99", trigger: "blur" }
        ]
      },
      postRules: /* 邮费模板表单规则 */ {
        name: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { min: 1, max: 50, message: "1-50个字符", trigger: "blur" }
        ],
        province: { required: true, message: "请选择省份", trigger: "blur" },
        city: { required: true, message: "请选择城市", trigger: "blur" },
        region: { required: true, message: "请选择区域", trigger: "blur" },
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { min: 1, max: 50, message: "1-50个字符", trigger: "blur" }
        ],
        type: { required: true, trigger: "blur" },
        "defaultPost.firstVolume": [
          { required: true, message: "请输入默认首重", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])$/,
            message: "请输入大于0的整数",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "输入范围1-9999", trigger: "blur" }
        ],
        "defaultPost.firstPrice": [
          { required: true, message: "请输入默认首价", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入不小于1的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 7, message: "输入范围1-9999.99", trigger: "blur" }
        ],
        "defaultPost.continueVolume": [
          { required: true, message: "请输入默认续重", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])$/,
            message: "请输入大于0的整数",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "输入范围1-9999", trigger: "blur" }
        ],
        "defaultPost.continuePrice": [
          { required: true, message: "请输入默认续价", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入不小于1的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 7, message: "输入范围1-9999.99", trigger: "blur" }
        ]
      },
      isShowArea: /* 显示城市方案的地区选择器 */ false,
      isShowArea2: /* 显示条件方案的地区选择器 */ false,
      provinceList: /* 城市方案地区列表 */ [],
      provinceList2: /* 条件方案地区列表 */ [],
      cityList: /* 城市列表 */ [],
      regionList: /* 县城列表 */ [],
      firstLoad: true,
      postSolution: {
        isPost: 1,
        address: "",
        city: "",
        cityId: "",
        id: "",
        name: "",
        province: "",
        provinceId: "",
        region: "",
        regionId: "",
        shopId: "1",
        type: 1,
        solutionFreeItemList: /* 包邮条件 */ [],
        solutionItemList: /* 邮费方案 */ [],
        defaultPost: /* 默认城市邮费方案 */ {
          firstPrice: "",
          firstVolume: "",
          continueVolume: "",
          continuePrice: ""
        }
      },
      solutionFreeItem: /* 条件邮费方案项 */ {
        areaExp: [],
        hasArea: /* 是否有选地区 */ 0,
        id: "",
        postSolutionId: "",
        price: "",
        quantity: "",
        sort: 5,
        type: /* 1 包邮条件(数量) 2 包邮条件(金额) 3 包邮条件(数量+金额) */ ""
      },
      solutionItem: /* 城市邮费方案项 */ {
        areaExp: [],
        hasArea: /* 是否有选地区 */ 0,
        continuePrice: /* 续重价钱 */ "",
        continueVolume: /* 续重 */ "",
        firstPrice: /*首量价钱*/ "",
        firstVolume: /* 首量 */ "",
        id: "",
        postSolutionId: "",
        sort: 5
      },
      level: /* 地区选择等级 1:城市包邮；2:条件包邮 */ "",
      extCityItems: /* 城市包邮已选地区 */ [],
      extCondItems: /* 条件包邮已选地区 */ []
    };
  },
  watch: {
    "postSolution.isPost"(val) {
      if (+val === 0) {
        vm.postSolution.type = vm.postSolution.type;
      }
    },
    "postSolution.type"(val, oldVal) {
      if(vm.firstLoad){
        return
      }
      vm.changeText(val);
      vm.switch && vm.changeType(val, oldVal);
      vm.switch = false;
    }
  },
  created() {
    // youID表示编辑
    if (vm.$route.query.id) {
      getDetail({
        id: vm.$route.query.id
      }).then(data => {
        let d = data.data;
        d.type = +d.type

        // 分离是否包邮
        d.isPost = d.type === 0 ? 1 : 0;

        // 抽离默认城市邮费方案
        d.defaultPost = Object.assign({ ...d.solutionItemList[0] });
        d.solutionItemList.shift();

        // parse areaExp项
        // 保存已选地区项
        d.solutionItemList = d.solutionItemList.map(item => {
          try {
            item.areaExp = JSON.parse(item.areaExp);
          } catch (e) {
            item.areaExp = [];
          }
          item.hasArea = 1;
          vm.extCityItems = vm.extCityItems.concat(item.areaExp);
          return vm.transfer(item);
        });
        d.solutionFreeItemList = d.solutionFreeItemList.map(item => {
          try {
            item.areaExp = JSON.parse(item.areaExp);
          } catch (e) {
            item.areaExp = [];
          }
          item.hasArea = 1;
          vm.extCondItems = vm.extCondItems.concat(item.areaExp);
          return vm.transfer(item);
        });

        // 默认的值转换为字符串(为了正则,我还能怎样)
        for (let k in d.defaultPost) {
          typeof d.defaultPost[k] === "number" &&
            (d.defaultPost[k] = d.defaultPost[k].toString());
          d.defaultPost[k] === null && (d.defaultPost[k] = []);
        }

        vm.postSolution = Object.assign({}, d);

        vm.changeText(d.type);

        getAd({
          parentId: "0"
        }).then(data => {
          vm.dealProvinceList(data.data);
        });

      });
    } else {
      getAd({
        parentId: "0"
      }).then(data => {
        // vm.provinceList = preCopy(data.data);
        // vm.provinceList2 = preCopy(data.data);
        vm.dealProvinceList(data.data);
      });
    }

    //
  },
  methods: {
    changeText(val) {
      vm.unitText = +val === 1 ? "件" : +val === 2 ? "立方米" : "千克";
      vm.accText = +val === 1 ? "件数:" : +val === 2 ? "体积:" : "重:";
    },
    changeType(val, oldVal) {
      vm.$confirm("切换将删除所有邮费方案,是否继续？")
        .then(_ => {
          vm.clearModule();
          vm.postSolution.type = val;
          setTimeout(() => {
            vm.switch = true;
          }, 0);
        })
        .catch(() => {
          vm.postSolution.type = oldVal;
          setTimeout(() => {
            vm.switch = true;
          }, 0);
        });
    },
    clearModule() {
      vm.postSolution = Object.assign(vm.postSolution, {
        solutionFreeItemList: /* 包邮条件 */ [],
        solutionItemList: /* 邮费方案 */ [],
        defaultPost: /* 默认城市邮费方案 */ {
          firstPrice: "",
          firstVolume: "",
          continueVolume: "",
          continuePrice: ""
        }
      });
    },
    transfer(item) {
      // 如果是对象
      if (item instanceof Object) {
        // object
        if (item.__defineGetter__) {
          for (let key in item) {
            typeof item[key] === "number" && (item[key] = item[key].toString());
          }
        }
        return item;
      }
    },
    submitForm(formName) {
      let isValid = true;
      let form;

      // 表单验证所有表单
      for (let key in vm.$refs) {
        form = vm.$refs[key];
        if (Array.isArray(form)) {
          if (form.length > 0) {
            form[0].validate(valid => {
              if (!valid) {
                isValid = false;
              }
            });
          }
        } else {
          form.validate(valid => {
            if (!valid) {
              isValid = false;
            }
          });
        }
      }

      if (isValid) {
        vm.fullscreenLoading = true;
        // 处理提交数据
        let res = { ...vm.postSolution };

        // 将邮费方案地区列表string化
        res.solutionItemList = res.solutionItemList.map(item => {
          delete item.hasArea;
          item.areaExp =
            item.areaExp.length > 0 ? JSON.stringify(item.areaExp) : "[]";
          return item;
        });
        res.solutionFreeItemList = res.solutionFreeItemList.map(item => {
          delete item.hasArea;
          item.areaExp =
            item.areaExp.length > 0 ? JSON.stringify(item.areaExp) : "[]";
          return item;
        });

        // defaultPost项插入到城市包邮列表
        // 删除defaultPost
        if (+res.isPost === 0) {
          res.defaultPost.areaExp = "[]";
          res.solutionItemList.push(
            Object.assign(vm.solutionItem, { ...res.defaultPost }, { sort: 0 })
          );
        }
        delete res.defaultPost;

        // 删除isPost
        +res.isPost === 1 ? (res.type = 0) : "";
        delete res.isPost;

        // 查找省市区的ID
        let province = res.province;
        vm.provinceList.forEach(item => {
          item.name === province && (res.provinceId = item.id);
        });
        let city = res.city;
        vm.cityList.forEach(item => {
          item.name === city && (res.cityId = item.id);
        });
        let region = res.region;
        vm.regionList.forEach(item => {
          item.name === region && (res.regionId = item.id);
        });

        // api
        vm.$route.query.id
          ? doUpdate(res).then(data => {
              vm.fullscreenLoading = false;
              vm.$message.success(data.message);
              vm.$router.go(-1);
            })
          : doInsert(res).then(data => {
              vm.fullscreenLoading = false;
              vm.$message.success(data.message);
              vm.$router.go(-1);
            });
      } else {
        console.log("error submit!!");
        return false;
      }
    },

    clearItem() {
      vm.solutionItem = {
        areaExp: [],
        continuePrice: "",
        continueVolume: "",
        firstPrice: "",
        firstVolume: "",
        id: "",
        postSolutionId: "",
        sort: 5
      };
      vm.solutionFreeItem = {
        areaExp: [],
        id: "",
        postSolutionId: "",
        price: "",
        quantity: "",
        sort: 0,
        type: ""
      };
    },
    // 删除包邮项
    delItem(index, level) {
      let areaKey,
        aimKey,
        isExist = false;

      if (+level === 1) {
        areaKey = "provinceList";
        aimKey = "solutionItemList";
      } else {
        areaKey = "provinceList2";
        aimKey = "solutionFreeItemList";
      }

      // 清除已选择列表中的对应项
      let data = vm.postSolution[aimKey].splice(index, 1)[0];
      vm[areaKey] = vm[areaKey].map(area => {
        isExist = false;
        data.areaExp.forEach(item => {
          item.id === area.id && (isExist = true);
        });
        isExist && (area.hasChecked = false);
        return area;
      });
    },

    // 处理省份列表
    // 分离已存在地区
    dealProvinceList(data) {
      let d1 = preCopy(data);
      let d2 = preCopy(data);
      d1 = d1.map(item => {
        // 城市包邮地区筛选
        item.hasChecked = false;
        item.isChecked = false;
        vm.extCityItems.forEach(val => {
          // val.id === item.id && (item.isChecked = true);

          val.id === item.id && (item.hasChecked = true);
        });

        // 条件包邮地区筛选
        return item;
      });

      d2 = d2.map(item => {
        item.hasChecked = false;
        item.isChecked = false;
        // 城市包邮地区筛选
        vm.extCondItems.forEach(val => {
          val.id === item.id && (item.hasChecked = true);
        });
        // 条件包邮地区筛选
        return item;
      });

      vm.provinceList = d1;
      vm.provinceList2 = d2;
    },
    //
    changeProvince(val) {
      vm.regionList = [];
      vm.postSolution.city = "";
      vm.postSolution.cityId = "";
      vm.postSolution.region = "";
      vm.postSolution.regionId = "";

      let id = "";
      vm.provinceList.forEach(item => {
        item.name === val && (id = item.id);
      });

      getAd({
        parentId: id
      }).then(data => {
        vm.cityList = data.data;
      });
    },
    changeCity(val) {
      vm.postSolution.region = "";
      vm.postSolution.regionId = "";

      let id = "";
      vm.cityList.forEach(item => {
        item.name === val && (id = item.id);
      });

      getAd({
        parentId: id
      }).then(data => {
        vm.regionList = data.data;
      });
    },
    // 调用地区选择器
    callAreaSel(level, index) {
      let key = "";
      if (+level === 1) {
        vm.isShowArea = true;
        key = "solutionItemList";
      } else {
        vm.isShowArea2 = true;
        key = "solutionFreeItemList";
      }
      index = +index === -1 ? vm.postSolution[key].length : index;
      vm.curIndex = index;
      vm.level = level;
    },

    // 添加邮费方案
    selAreas() {
      let souKey,
        filKey,
        aimKey,
        areaKey,
        curList = [];

      if (+vm.level === 1) {
        souKey = "solutionItem";
        filKey = "extCityItems";
        aimKey = "solutionItemList";
        areaKey = "provinceList";
      } else {
        souKey = "solutionFreeItem";
        filKey = "extCondItems";
        aimKey = "solutionFreeItemList";
        areaKey = "provinceList2";
      }
      vm[areaKey] = vm[areaKey].map(item => {
        // 插入当前选中的地区
        // 插入到已选中的列表
        item.hasChecked = false;
        if (item.isChecked) {
          item.hasChecked = true;
          curList.push(item);
          // vm[filKey].push(item);
        }
        // 重置勾选
        item.isChecked = false;
        return item;
      });

      // 清空已选地区列表
      vm[filKey] = [];

      // 合并当前编辑项以及源数据项
      vm[souKey] = Object.assign(
        vm[souKey],
        vm.postSolution[aimKey][vm.curIndex] || {}
      );
      vm[souKey].areaExp = curList;

      // 清除重复的曾经选项
      // 更新数据
      let sourList = vm.postSolution[aimKey];
      let isExist;
      // 数据未更新前遍历所有地区，如果每个地区列表和已存在列表有重复，去掉
      sourList = sourList.map((item, index) => {
        let list = [];
        item.areaExp.forEach(area => {
          isExist = false;
          // 不存在已存在列表时，
          curList.forEach(ext => {
            if (ext.id === area.id) {
              isExist = true;
            }
          });
          if (!isExist) {
            list.push(area);
          }
        });
        item.areaExp = list;
        // 如果长度为0,更新是否有选择地区的状态
        if (list.length > 0) {
          item.hasArea = 1;
        } else {
          item.hasArea = 0;
        }

        // 存储当前遍历的地区列表到已存在列表中
        if (index !== vm.curIndex) vm[filKey] = vm[filKey].concat(list);
        return item;
      });

      vm[filKey] = vm[filKey].concat(preCopy(vm[souKey]).areaExp);

      // 当前的方案项重置|插入到方案列表
      vm[souKey].hasArea = curList.length > 0 ? 1 : 0;
      sourList[vm.curIndex] = preCopy(vm[souKey]);

      // 已存在列表的去重处理
      vm[filKey] = [...new Set(vm[filKey])];

      // 高亮
      vm[areaKey] = vm[areaKey].map(item => {
        item.hasChecked = false;
        vm[filKey].forEach(fil => {
          if (fil.id === item.id) {
            item.hasChecked = true;
          }
        });
        return item;
      });

      vm.postSolution[aimKey] = sourList;

      // 重置方案项
      vm.clearItem();

      vm.isShowArea = false;
      vm.isShowArea2 = false;
    }
  }
};
export default vm;
</script>

<style lang="scss">
input[type="number"] {
  -moz-appearance: textfield;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.w200 .el-input {
  width: 200px;
}
.w80 .el-input {
  width: 120px;
}
.hid-style {
  margin-top: 0px;
  display: block;
}
</style>
<style lang="scss" scoped>
.tc {
  text-align: center;
}
.table {
  display: table;
  font-size: 14px;
}
.rows {
  display: table-row;
  line-height: 50px;
}
.cell {
  padding-left: 6px;
  &.w2 {
    width: 300px;
  }
  &.w3 {
    width: 700px;
    input {
      width: 100px;
    }
  }
  display: table-cell;
  width: 200px;
}
.table-head {
  background-color: #f0f0f0;
  color: #999;
}
.edit {
  padding-bottom: 50px;
  .hasChecked {
    color: #f5222d;
  }
  .specific {
    margin-top: 30px;
    margin-bottom: 15px;
    color: #409eff;
    font-size: 14px;
    cursor: pointer;
    display: inline-block;
    &.disable {
      color: #f5222d;
    }
  }
  .el-form-item {
    margin-bottom: 15px;
    display: inline-block;
  }
  .area {
    display: inline-block;
    margin-bottom: 15px;
    margin-right: 15px;
  }
  padding-left: 15px;
  li {
    list-style: none;
    margin-top: 20px;
  }

  .el-select {
    width: 120px;
  }
}
</style>
