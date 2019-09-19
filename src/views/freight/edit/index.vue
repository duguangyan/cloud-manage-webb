<template>
  <div class="edit">
    <el-form :model="postSolution" :rules="postRules" ref="postSolution" :inline="true">
      <li>
        <el-form-item label="模板名称:" prop="name">
          <el-input class="w200" placeholder="请输入模板名称" v-model="postSolution.name" clearable></el-input>
        </el-form-item>
      </li>
      <li>
        <!-- <el-form-item prop="provinceId"></el-form-item> -->
        <!-- 省 -->
        <el-form-item label="发货地址:" prop="provinceId">
          <el-select v-model="postSolution.provinceId" placeholder="请选择省份" @change="changeProvince">
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="`${item.id}|${item.name}`"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 市 -->
        <el-form-item prop="cityId">
          <el-select v-model="postSolution.cityId" placeholder="请选择市区" @change="changeCity">
            <el-option
              v-for="item in cityList"
              :key="item.id"
              :label="item.name"
              :value="`${item.id}|${item.name}`"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 区 -->
        <el-form-item prop="regionId">
          <el-select v-model="postSolution.regionId" placeholder="请选择">
            <el-option
              v-for="item in regionList"
              :key="item.id"
              :label="item.name"
              :value="`${item.id}|${item.name}`"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 详细地址 -->
        <el-form-item prop="address">
          <el-input class="w200" placeholder="请输入详细地址" v-model="postSolution.address" clearable></el-input>
        </el-form-item>
      </li>

      <!-- <li>
      <span>运送方式:</span>
      <el-checkbox v-model="postSolution.id">备选项</el-checkbox>
      </li>-->

      <li>
        <el-form-item label="是否包邮:" prop="status">
          <el-radio v-model="postSolution.status" :label="0">自定义运费</el-radio>
          <el-radio v-model="postSolution.status" :label="1">卖家承担运费(包邮)</el-radio>
        </el-form-item>
      </li>

      <template v-if="+postSolution.status===0">
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
                type="text"
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
                  <template v-if="scope.row.areaVoList.length<1">
                    <span @click="callAreaSel(1)">选择地区</span>
                  </template>
                  <span
                    v-else
                    @click="postSolution.solutionItemList.length - 1===scope.$index?(isShowArea = true):''"
                  >
                    <span v-for="item in scope.row.areaVoList" :key="item.id">{{item.name}}&emsp;</span>
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
                    @click="delFreeItem(scope.$index, scope.row)"
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
              <el-table-column prop="areaVoList" label="运送到" width="180">
                <template slot-scope="scope">
                  <template v-if="scope.row.areaVoList.length<1">
                    <span @click="callAreaSel(2)">选择地区</span>
                  </template>
                  <span
                    v-else
                    @click="postSolution.solutionFreeItemList.length - 1===scope.$index?(isShowArea = true):''"
                  >
                    <span v-for="item in scope.row.areaVoList" :key="item.id">{{item.name}}&emsp;</span>
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

                    <el-form-item v-else-if="+solutionFreeItem.type === 2" prop="quantity">
                      满
                      <el-input
                        v-model="solutionFreeItem.quantity"
                        type="number"
                        placeholder="请输入金额"
                      />元包邮
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
                    @click="delFreeItem(scope.$index, scope.row)"
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
          <el-button size="middle" type="success" @click="submitForm('postSolution')">保存并返回</el-button>
        </el-form-item>
      </div>
    </el-form>

    <!-- 选择地区对话框 -->
    <el-dialog title="选择地区" :visible.sync="isShowArea" width="600">
      <div class="area" v-for="item in provinceList" :key="item.id">
        <el-checkbox v-model="item.checked">{{item.name}}</el-checkbox>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowArea = false">取 消</el-button>
        <el-button type="primary" @click="selAreas">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail, doInsert, doUpdate, doDelete } from "@/api/goods/freight";
import { getAd } from "@/api/upms/strict";
var vm = {
  name: "freight-edit",
  data() {
    vm = this;
    return {
      // 城市邮费表单规则
      itemRules: {
        firstVolume: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ],
        firstPrice: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ],
        continueVolume: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ],
        continuePrice: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ]
      },
      // 条件邮费表单规则
      freeRules: {
        type: { required: true, message: "请选择条件", trigger: "blur" },
        quantity: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入内容", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "范围在 1 到 9999", trigger: "blur" }
        ]
      },
      // 邮费模板表单规则
      postRules: {
        name: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { min: 1, max: 50, message: "1-50个字符", trigger: "blur" }
        ],
        provinceId: { required: true, message: "请选择省份", trigger: "blur" },
        cityId: { required: true, message: "请选择城市", trigger: "blur" },
        regionId: { required: true, message: "请选择区域", trigger: "blur" },
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
          { min: 1, max: 50, message: "1-50个字符", trigger: "blur" }
        ],
        type: { required: true, trigger: "blur" },
        "defaultPost.firstVolume": [
          { required: true, message: "请输入默认首重", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 7, message: "输入范围1-9999.99", trigger: "blur" }
        ],
        "defaultPost.firstPrice": [
          { required: true, message: "请输入默认首价", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "输入范围1-9999", trigger: "blur" }
        ],
        "defaultPost.continueVolume": [
          { required: true, message: "请输入默认续重", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "输入范围1-9999", trigger: "blur" }
        ],
        "defaultPost.continuePrice": [
          { required: true, message: "请输入默认续价", trigger: "blur" },
          {
            pattern: /^(^[1-9]\d+|^[1-9])(\.(\d{1,2}$))?$/,
            message: "请输入大于0的数字(最多保留两位小数)",
            trigger: "blur"
          },
          { min: 1, max: 4, message: "输入范围1-9999", trigger: "blur" }
        ]
      },
      isShowArea: false,
      provinceList: [],
      cityList: [],
      regionList: [],
      postSolution: {
        status: 1,
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
        defaultPost: {
          firstPrice: "",
          firstVolume: "",
          continueVolume: "",
          continuePrice: ""
        }
      },
      solutionFreeItem: {
        areaExp: "",
        areaVoList: [],
        id: "",
        postSolutionId: "",
        price: "",
        quantity: "",
        sort: 0,
        type: /* 1 包邮条件(数量) 2 包邮条件(金额) 3 包邮条件(数量+金额) */ ""
      },
      solutionItem: {
        areaExp: "",
        areaVoList: [],
        continuePrice: /* 续重价钱 */ "",
        continueVolume: /* 续重 */ "",
        firstPrice: /*首量价钱*/ "",
        firstVolume: /* 首量 */ "",
        id: "",
        postSolutionId: "",
        sort: 0
      },
      level: /* 地区选择等级 1:城市包邮；2:条件包邮 */ ""
    };
  },
  created() {
    // 插入新建项到城市邮费方案
    vm.postSolution.solutionItemList.push(
      Object.assign({}, { ...vm.solutionItem })
    );

    // 插入新建项到条件邮费方案
    vm.postSolution.solutionFreeItemList.push(
      Object.assign({}, { ...vm.solutionFreeItem })
    );
    // youID表示编辑
    vm.$route.query.id &&
      getDetail({
        id: vm.$route.query.id
      }).then(data => {
        let d = data.data;
        // 分离是否包邮
        d.type === 0 ? (d.status = 1) : (d.status = 0);

        // 分离默认邮寄城市方案
        d.defaultPost = Object.assign({}, { ...d.solutionItemList[0] });
        d.solutionItemList.pop();

        // 添加添加控制项
        d.solutionItemList.push(Object.assign({}, { ...vm.solutionItem }));
        d.solutionFreeItemList.push(
          Object.assign({}, { ...vm.solutionFreeItem })
        );

        vm.postSolution = Object.assign({}, d);
      });

    // 获取列表
    getAd({
      parentId: "0"
    }).then(data => {
      vm.dealProvinceList(data.data);
    });

    //
  },
  methods: {
    submitForm(formName) {
      vm.$refs[formName].validate(valid => {
        if (valid) {
          // 验证地区是否选择
          if (formName === "solutionItem") {
            if (vm.solutionItem.areaVoList.length < 1) {
              return vm.$message.error("要选地区哟嘿！");
            }
            vm.insertToItem();
          } else if (formName === "solutionFreeItem") {
            if (vm.solutionFreeItem.areaVoList.length < 1) {
              return vm.$message.error("要选地区哟嘿！");
            }
            vm.insertToFreeItem();
          } else {
            // 处理提交数据
            let res = { ...vm.postSolution };

            // 删除城市 & 条件包邮末项(数据填充项)
            res.solutionItemList.pop();
            res.solutionFreeItemList.pop();

            // defaultPost项插入到城市包邮列表
            res.solutionItemList.push(
              Object.assign(vm.solutionItem, { ...res.defaultPost })
            );

            // 删除defaultPost
            delete res.defaultPost;

            // 删除status
            +res.status === 1 && (res.type = 1);
            delete res.status;

            // 解构省市区ID
            let pro = res.provinceId.split("|");
            res.provinceId = pro[0];
            res.province = pro[1];

            let city = res.cityId.split("|");
            res.cityId = pro[0];
            res.city = pro[1];

            let region = res.regionId.split("|");
            res.regionId = region[0];
            res.region = region[1];

            vm.$route.query.id
              ? doUpdate(res).then(data => {
                  vm.$message.success(data.message);
                  vm.$router.go(-1);
                })
              : doInsert(res).then(data => {
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
      vm.postSolution.solutionItemList.unshift(
        Object.assign({}, { ...vm.solutionItem })
      );
      vm.postSolution.solutionItemList.pop();
      vm.solutionItem = {
        areaExp: "",
        areaVoList: [],
        continuePrice: /* 续重价钱 */ "",
        continueVolume: /* 续重 */ "",
        firstPrice: /*首量价钱*/ "",
        firstVolume: /* 首量 */ "",
        id: "",
        postSolutionId: "",
        sort: 0
      };
      vm.postSolution.solutionItemList.push(
        Object.assign({}, { ...vm.solutionItem })
      );
    },
    // 插入条件包邮列表
    insertToFreeItem() {
      vm.postSolution.solutionFreeItemList.unshift(
        Object.assign({}, { ...vm.solutionFreeItem })
      );
      vm.postSolution.solutionFreeItemList.pop();
      vm.solutionFreeItem = {
        areaExp: "",
        areaVoList: [],
        id: "",
        postSolutionId: "",
        price: "",
        quantity: "",
        sort: 0,
        type: ""
      };
      vm.postSolution.solutionFreeItemList.push(
        Object.assign({}, { ...vm.solutionFreeItem })
      );
    },
    // 删除城市包邮项
    delItem(index, item) {
      vm.postSolution.solutionItemList.splice(index, 1);
    },
    // 删除条件包邮项
    delFreeItem(index, item) {
      vm.postSolution.solutionFreeItemList.splice(index, 1);
    },
    // 处理省份列表
    dealProvinceList(data) {
      vm.provinceList = data.map(item => {
        item.checked = false;
        return item;
      });
    },
    //
    addFreightItems() {
      vm.provinceList.length < 1 &&
        getAd({
          parentId: "0"
        }).then(data => {
          vm.dealProvinceList(data.data);
        });
    },
    changeProvince(val) {
      vm.regionList = [];
      vm.postSolution.cityId = "";
      vm.postSolution.regionId = "";
      getAd({
        parentId: val.split("|")[0]
      }).then(data => {
        vm.cityList = data.data;
      });
    },
    changeCity(val) {
      vm.postSolution.regionId = "";
      getAd({
        parentId: val.split("|")[0]
      }).then(data => {
        vm.regionList = data.data;
      });
    },
    // 调用地区选择器
    callAreaSel(level) {
      vm.isShowArea = true;
      vm.level = level;
    },

    // 添加邮费方案
    selAreas() {
      if (+vm.level === 1) {
        vm.provinceList.forEach(item => {
          if (item.checked) {
            vm.solutionItem.areaVoList.push({
              id: item.id,
              name: item.name
            });
          }
          item.checked = false;
        });

        vm.postSolution.solutionItemList.splice(
          -1,
          1,
          Object.assign({}, { ...vm.solutionItem })
        );
      } else {
        vm.provinceList.forEach(item => {
          if (item.checked) {
            vm.solutionFreeItem.areaVoList.push({
              id: item.id,
              name: item.name
            });
          }
          item.checked = false;
        });

        vm.postSolution.solutionFreeItemList.splice(
          -1,
          1,
          Object.assign({}, { ...vm.solutionFreeItem })
        );
      }

      vm.isShowArea = false;
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
