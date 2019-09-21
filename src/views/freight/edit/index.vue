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
              v-for="item in provinceList"
              :key="item.id+item.name"
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
              :key="item.id+item.name"
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
              :key="item.id+item.name"
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
            <el-radio v-model="postSolution.type" :label="1">按件数</el-radio>
            <el-radio v-model="postSolution.type" :label="2">按体积</el-radio>
            <el-radio v-model="postSolution.type" :label="3">按重量</el-radio>
          </el-form-item>
        </li>

        <li class="w80">
          <div class="specific">操作说明:</div>
          <div>
            <el-form-item
              :label="'首'+(+postSolution.type===1?'件数:':+postSolution.type===2?'体积:':'重:')"
              prop="defaultPost.firstVolume"
            >
              <el-input
                placeholder="请输入内容"
                v-model="postSolution.defaultPost.firstVolume"
                clearable
              ></el-input>
              <span>{{+postSolution.type===1?'件':+postSolution.type===2?'立方米':'千克'}}</span>
              &emsp;
            </el-form-item>

            <el-form-item label="首费:" prop="defaultPost.firstPrice">
              <el-input placeholder="请输入内容" v-model="postSolution.defaultPost.firstPrice" clearable></el-input>
              <span>元</span>
              &emsp;
            </el-form-item>

            <el-form-item
              :label="'续'+(+postSolution.type===1?'件:':+postSolution.type===2?'体积:':'重:')"
              prop="defaultPost.continueVolume"
            >
              <el-input
                placeholder="请输入内容"
                v-model="postSolution.defaultPost.continueVolume"
                clearable
              ></el-input>
              <span>{{+postSolution.type===1?'件':+postSolution.type===2?'立方米':'千克'}}</span>
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
        <div class="specific">为指定地区城市设置运费</div>
        <el-form-item prop="solutionItemList">
          <el-form :model="solutionItem" :rules="itemRules" ref="solutionItem">
            <el-table class="w80" :data="postSolution.solutionItemList" stripe style="width: auto;">
              <el-table-column prop="date" label="运送到" width="180">
                <template slot-scope="scope">
                  <template v-if="scope.row.areaExp.length<1">
                    <span @click="callAreaSel(1)">选择地区</span>
                  </template>
                  <span
                    v-else
                    @click="postSolution.solutionItemList.length - 1===scope.$index?(isShowArea = true):''"
                  >
                    <span v-for="item in scope.row.areaExp" :key="item.id">{{item.name}}&emsp;</span>
                  </span>
                </template>
              </el-table-column>

              <el-table-column prop="firstVolume" label="首重(千克)" width="150">
                <template slot-scope="scope">
                  <el-form-item
                    v-if="postSolution.solutionItemList.length - 1===scope.$index"
                    prop="firstVolume"
                  >
                    <el-input type="number" v-model="solutionItem.firstVolume" clearable></el-input>
                  </el-form-item>

                  <span v-else>{{scope.row.firstVolume}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="firstPrice" label="首费(元)" width="150">
                <template slot-scope="scope">
                  <el-form-item
                    v-if="postSolution.solutionItemList.length - 1===scope.$index"
                    prop="firstPrice"
                  >
                    <el-input type="number" v-model="solutionItem.firstPrice" clearable></el-input>
                  </el-form-item>
                  <span v-else>{{scope.row.firstPrice}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="continueVolume" label="续重(千克)" width="150">
                <template slot-scope="scope">
                  <el-form-item
                    v-if="postSolution.solutionItemList.length - 1===scope.$index"
                    prop="continueVolume"
                  >
                    <el-input type="number" v-model="solutionItem.continueVolume" clearable></el-input>
                  </el-form-item>
                  <span v-else>{{scope.row.continueVolume}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="continuePrice" label="续费(元)" width="150">
                <template slot-scope="scope">
                  <el-form-item
                    v-if="postSolution.solutionItemList.length - 1===scope.$index"
                    prop="continuePrice"
                  >
                    <el-input type="number" v-model="solutionItem.continuePrice" clearable></el-input>
                  </el-form-item>
                  <span v-else>{{scope.row.continuePrice}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="address" label="操作">
                <template slot-scope="scope">
                  <el-form-item v-if="postSolution.solutionItemList.length - 1===scope.$index">
                    <el-button size="mini" type="primary" @click="submitForm('solutionItem')">添加</el-button>
                  </el-form-item>
                  <el-button
                    v-else
                    size="mini"
                    type="danger"
                    @click="delItem(scope.$index, scope.row,1)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-form-item>

        <div class="specific">指定条件包邮</div>
        <el-form-item prop="solutionFreeItemList">
          <el-form :model="solutionFreeItem" :rules="freeRules" ref="solutionFreeItem">
            <el-table
              class="w80"
              :data="postSolution.solutionFreeItemList"
              stripe
              style="width: auto;"
            >
              <el-table-column prop="areaExp" label="运送到" width="180">
                <template slot-scope="scope">
                  <template v-if="scope.row.areaExp.length<1">
                    <span @click="callAreaSel(2)">选择地区</span>
                  </template>
                  <span
                    v-else
                    @click="postSolution.solutionFreeItemList.length - 1===scope.$index?(isShowArea2 = true):''"
                  >
                    <span v-for="item in scope.row.areaExp" :key="item.id">{{item.name}}&emsp;</span>
                  </span>
                </template>
              </el-table-column>

              <el-table-column prop="type" label="设置包邮条件" width="600">
                <template slot-scope="scope">
                  <template v-if="postSolution.solutionFreeItemList.length - 1===scope.$index">
                    <el-form-item prop="type">
                      <el-select v-model="solutionFreeItem.type">
                        <el-option label="数量" :value="1"></el-option>
                        <el-option label="金额" :value="2"></el-option>
                        <el-option label="数量+金额" :value="3"></el-option>
                      </el-select>&emsp;
                    </el-form-item>

                    <el-form-item v-if="+solutionFreeItem.type === 1" prop="quantity">
                      满
                      <el-input
                        v-model="solutionFreeItem.quantity"
                        type="number"
                        placeholder="请输入件数"
                      />件包邮
                    </el-form-item>

                    <el-form-item v-else-if="+solutionFreeItem.type === 2" prop="price">
                      满
                      <el-input v-model="solutionFreeItem.price" type="number" placeholder="请输入金额" />元包邮
                    </el-form-item>

                    <el-form-item v-else-if="+solutionFreeItem.type === 3" prop="price">
                      满
                      <el-input
                        v-model="solutionFreeItem.quantity"
                        type="number"
                        placeholder="请输入件数"
                      />件且满
                      <el-input v-model="solutionFreeItem.price" type="number" placeholder="请输入金额" />元包邮
                    </el-form-item>
                  </template>

                  <template v-else>
                    <span>{{+scope.row.type===1?'数量':+scope.row.type===2?'金额':'数量+金额'}}:</span>
                    <span v-if="+scope.row.type===1">满{{scope.row.quantity}}件包邮</span>
                    <span v-else-if="+scope.row.type===2">满{{scope.row.price}}元包邮</span>
                    <span
                      v-else-if="+scope.row.type===3"
                    >满{{scope.row.quantity}}件且满{{scope.row.price}}元包邮</span>
                  </template>
                </template>
              </el-table-column>

              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-form-item v-if="postSolution.solutionFreeItemList.length - 1===scope.$index">
                    <el-button size="mini" type="primary" @click="submitForm('solutionFreeItem')">添加</el-button>
                  </el-form-item>
                  <el-button
                    v-else
                    size="mini"
                    type="danger"
                    @click="delItem(scope.$index, scope.row,2)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </el-form-item>
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
      <div class="area" v-for="item in provinceList" :key="item.id">
        <el-checkbox v-model="item.isChecked" :disabled="item.isChecked?true:false">{{item.name}}</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowArea = false">取 消</el-button>
        <el-button type="primary" @click="selAreas">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 条件包邮选择地区对话框 -->
    <el-dialog title="选择地区" :visible.sync="isShowArea2" width="600">
      <div class="area" v-for="item in provinceList2" :key="item.id">
        <el-checkbox v-model="item.isChecked" :disabled="item.isChecked?true:false">{{item.name}}</el-checkbox>
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
      fullscreenLoading: false,
      // 城市邮费表单规则
      itemRules: {
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
      // 条件邮费表单规则
      freeRules: {
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
      // 邮费模板表单规则
      postRules: {
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
      isShowArea: false,
      isShowArea2: false,
      provinceList: /* 城市包邮地区列表 */ [],
      provinceList2: /* 条件包邮地区列表 */ [],
      cityList: [],
      regionList: [],
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
      // 条件邮费方案
      solutionFreeItem: {
        areaExp: [],
        id: "",
        postSolutionId: "",
        price: "",
        quantity: "",
        sort: 5,
        type: /* 1 包邮条件(数量) 2 包邮条件(金额) 3 包邮条件(数量+金额) */ ""
      },
      // 城市邮费方案
      solutionItem: {
        areaExp: [],
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
        vm.postSolution.type = 1;
      }
    }
  },
  created() {
    // youID表示编辑
    if (vm.$route.query.id) {
      getDetail({
        id: vm.$route.query.id
      }).then(data => {
        let d = data.data;
        // 分离是否包邮
        d.type === 0 ? (d.isPost = 1) : (d.isPost = 0);

        // 分离默认邮寄城市方案
        d.defaultPost = Object.assign({ ...d.solutionItemList[0] });
        d.solutionItemList.shift();

        // 默认的值转换为字符串(为了正则,我还能怎样)
        for (let k in d.defaultPost) {
          typeof d.defaultPost[k] === "number" &&
            (d.defaultPost[k] = d.defaultPost[k].toString());
          d.defaultPost[k] === null && (d.defaultPost[k] = []);
        }

        // parse areaExp项
        // 保存已选地区项
        d.solutionItemList = d.solutionItemList.map(item => {
          try {
            item.areaExp = JSON.parse(item.areaExp);
          } catch (e) {
            item.areaExp = [];
          }
          vm.extCityItems = vm.extCityItems.concat(item.areaExp);
          return item;
        });
        d.solutionFreeItemList = d.solutionFreeItemList.map(item => {
          try {
            item.areaExp = JSON.parse(item.areaExp);
          } catch (e) {
            item.areaExp = [];
          }
          vm.extCondItems = vm.extCondItems.concat(item.areaExp);
          return item;
        });

        // 添加添加控制项
        d.solutionItemList.push(Object.assign({}, { ...vm.solutionItem }));
        d.solutionFreeItemList.push({ ...vm.solutionFreeItem });

        // 发货地址处理地址
        vm.postSolution = Object.assign({}, d);

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
        vm.provinceList = preCopy(data.data);
        vm.provinceList2 = preCopy(data.data);
      });
      // 插入新建项到城市邮费方案
      vm.postSolution.solutionItemList.push(
        Object.assign({}, { ...vm.solutionItem })
      );

      // 插入新建项到条件邮费方案;
      vm.postSolution.solutionFreeItemList.push(
        Object.assign({}, { ...vm.solutionFreeItem })
      );
    }

    //
  },
  methods: {
    submitForm(formName) {
      vm.$refs[formName].validate(valid => {
        if (valid) {
          // 验证地区是否选择
          if (formName === "solutionItem") {
            if (vm.solutionItem.areaExp.length < 1) {
              return vm.$message.error("要选地区哟嘿！");
            }
            vm.insertToItem();
          } else if (formName === "solutionFreeItem") {
            if (vm.solutionFreeItem.areaExp.length < 1) {
              return vm.$message.error("要选地区哟嘿！");
            }
            vm.insertToFreeItem();
          } else {
            vm.fullscreenLoading = true;
            // 处理提交数据
            let res = { ...vm.postSolution };

            // 删除城市 & 条件包邮末项(数据填充项)
            res.solutionItemList.pop();
            res.solutionFreeItemList.pop();

            // 将邮费方案地区列表string化
            res.solutionItemList = res.solutionItemList.map(item => {
              item.areaExp =
                item.areaExp.length > 0 ? JSON.stringify(item.areaExp) : "[]";
              return item;
            });
            res.solutionFreeItemList = res.solutionFreeItemList.map(item => {
              item.areaExp =
                item.areaExp.length > 0 ? JSON.stringify(item.areaExp) : "[]";
              return item;
            });

            // defaultPost项插入到城市包邮列表
            if (+res.isPost === 0) {
              res.defaultPost.areaExp = "[]";
              res.solutionItemList.push(
                Object.assign(
                  vm.solutionItem,
                  { ...res.defaultPost },
                  { sort: 0 }
                )
              );
            }

            // 删除defaultPost
            delete res.defaultPost;

            // 删除isPost
            +res.isPost === 1 ? (res.type = 0) : (res.type = 1);
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
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 插入城市包邮列表
    insertToItem() {
      // 新数据插入到顶部
      vm.postSolution.solutionItemList.unshift(preCopy(vm.solutionItem));

      // 重置添加项的数据
      vm.postSolution.solutionItemList.pop();
      vm.solutionItem = {
        areaExp: [],
        continuePrice: /* 续重价钱 */ "",
        continueVolume: /* 续重 */ "",
        firstPrice: /*首量价钱*/ "",
        firstVolume: /* 首量 */ "",
        id: "",
        postSolutionId: "",
        sort: 5
      };
      vm.postSolution.solutionItemList.push(preCopy(vm.solutionItem));
    },
    // 插入条件包邮列表
    insertToFreeItem() {
      //
      vm.postSolution.solutionFreeItemList.unshift(
        preCopy(vm.solutionFreeItem)
      );

      //
      vm.postSolution.solutionFreeItemList.pop();
      vm.solutionFreeItem = {
        areaExp: [],
        id: "",
        postSolutionId: "",
        price: "",
        quantity: "",
        sort: 0,
        type: ""
      };
      vm.postSolution.solutionFreeItemList.push(preCopy(vm.solutionFreeItem));
    },

    // 删除包邮项
    delItem(index, item,level) {
      let areaKey,aimKey,isExist = false;
      if(+level===1){
        areaKey = 'provinceList';
        aimKey = 'solutionItemList';
      }else{
        areaKey = 'provinceList2';
        aimKey = 'solutionFreeItemList';
      }

      let data = vm.postSolution[aimKey].splice(index, 1)[0];
      vm[areaKey] = vm[areaKey].map(area => {
        isExist = false;
        data.areaExp.forEach(item=>{
          item.id === area.id && (isExist = true)
        })
        if(isExist){
          area.isChecked = false;
        }
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
        vm.extCityItems.forEach(val => {
          val.id === item.id && (item.isChecked = true);
        });
        // 条件包邮地区筛选
        return item;
      });

      d2 = d2.map(item => {
        // 城市包邮地区筛选
        vm.extCondItems.forEach(val => {
          val.id === item.id && (item.isChecked = true);
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
    callAreaSel(level) {
      +level === 1 ? (vm.isShowArea = true) : (vm.isShowArea2 = true);
      vm.level = level;
    },

    // 添加邮费方案
    selAreas() {
      let souKey,
        filKey,
        aimKey,
        areaKey,
        len,
        isExist = false;
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
      len = vm[filKey].length;
      vm[areaKey].forEach(item => {
        if (item.isChecked) {
          isExist = false;
          if (len > 0) {
            // 如果选中的地区已存在已用过的地区，跳过
            vm[filKey].forEach(val => {
              if (val.id === item.id) {
                isExist = true;
              }
            });
            // 否则出入当前选中项
            if (!isExist) {
              vm[filKey].push(item);
              vm[souKey].areaExp.push({
                id: item.id,
                name: item.name
              });
            }
          } else {
            vm[filKey].push(item);
            vm[souKey].areaExp.push({
              id: item.id,
              name: item.name
            });
          }
        }
      });
      vm.postSolution[aimKey].splice(-1, 1, preCopy(vm[souKey]));

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
</style>
<style lang="scss" scoped>
.tc {
  text-align: center;
}
.edit {
  padding-bottom: 50px;
  .specific {
    margin-top: 30px;
    margin-bottom: 15px;
    color: #409eff;
    font-size: 14px;
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
