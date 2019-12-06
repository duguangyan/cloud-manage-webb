<template>
  <div v-loading="searchLoading" class="app-container">

    <div class="filter-container">
      <el-button v-if="btnsPermission.addSource.auth" v-waves class="filter-item" @click="handleAddResource">{{btnsPermission.addSource.name}}</el-button>
    </div>
    <el-table
      :header-cell-style="{background: '#f3f3f3'}" 
      ref="treeTable"
      v-loading="listLoading"
      :data="pageData"
      style="width: 100%"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        prop="name"
        label="名称"
        >
        <template slot-scope="{ row }">
            <svg-icon v-if="row.icon" :icon-class="row.icon" />
            <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        align="center"
        width="100">
        <template slot-scope="scope">
          <div v-if="scope.row.elementType == 'td'">
            <span v-if="scope.row.componentType == 0">菜单</span>
            <span v-else-if="scope.row.componentType == 1">文字</span>
            <span v-else-if="scope.row.componentType == 2">图片</span>
            <span v-else-if="scope.row.componentType == 3">分类</span>
            <span v-else-if="scope.row.componentType == 4">商品</span>
            <span v-else-if="scope.row.componentType == 5">商品列表</span>
            <span v-else-if="scope.row.componentType == 6">广告位</span>
            <span v-else-if="scope.row.componentType == 7">搜索</span>
            <span v-else-if="scope.row.componentType == 8">URL</span>
            <span v-else-if="scope.row.componentType == 9">横幅</span>
            <span v-else>--</span>
          </div>
          <div v-else>
            <span>--</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
        width="100"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="{ row }">
          <el-button v-if="btnsPermission.add.auth && row.elementType != 'td'" type="primary" size="mini" @click="msgAdd(row)">
            {{btnsPermission.add.name}}
          </el-button>
          <el-button v-if="btnsPermission.edit.auth" type="primary" size="mini" @click="msgEdit(row)">
            {{btnsPermission.edit.name}}
          </el-button>
          <el-button v-if="btnsPermission.delete.auth && row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row)">
            {{btnsPermission.delete.name}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :closeOnClickModal="false" :title="dialogTitle">
      <el-form ref="meanForm" v-loading="diaLoading" :model="page" label-width="80px" label-position="left" :rules="rules">
        <el-form-item v-if="(dialogType == 'new' && page.elementType == 'tr') || (dialogType == 'edit' && page.elementType == 'td') " prop="componentType" label="类型">
          <el-select v-model="page.componentType" placeholder="请选择" style="width: 200px;margin-right: 20px;">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="(dialogType == 'new' && page.elementType == 'table') || (dialogType == 'edit' && page.elementType == 'tr')" prop="componentType" label="组件类型">
          <el-select v-model="page.componentType" placeholder="请选择" style="width: 200px;margin-right: 20px;">
            <el-option
              v-for="item in elementData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="page.componentType == 6 || page.componentType == 9" prop="componentId" label="广告位置">
          <el-select v-model="page.componentId" placeholder="请选择" style="width: 200px;margin-right: 20px;">
            <el-option
              v-for="item in bannerData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item v-if="page.componentType == 5" prop="componentId" label="栏目名称">
          <el-select v-model="page.componentId" placeholder="请选择" style="width: 200px;margin-right: 20px;">
            <el-option
              v-for="item in manageData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="page.componentType == 3" prop="treeValue" label="分类菜单">
          <el-cascader
            v-model="page.treeValue"
            :options="treeOptions"
            :props="treeProps"
            placeholder="请选择品种"
            style="width: 200px;" 
            class="filter-item mr20"
            @keyup.enter.native="handleFilter">
          </el-cascader>
        </el-form-item>
        <el-form-item v-if="page.componentType == 4" prop="componentId" label="商品ID">
          <el-input v-model.trim="page.componentId" maxlength="32" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item v-if="page.componentType == 8" prop="URL" label="链接地址">
          <el-input v-model.trim="page.URL" maxlength="256" placeholder="请输入URL" />
        </el-form-item>
        <el-form-item prop="name" label="名称">
          <el-input v-model.trim="page.name" maxlength="64" placeholder="请输入名称" />
        </el-form-item>
         <el-form-item prop="width" label="宽度">
          <el-input v-model.trim="page.width" maxlength="6" placeholder="请输入宽度" style="width: 80%; margin-right: 10px;" /><span>px</span>
        </el-form-item>
         <el-form-item prop="height" label="高度">
          <el-input v-model.trim="page.height" maxlength="6" placeholder="请输入高度" style="width: 80%; margin-right: 10px;" /><span>px</span>
        </el-form-item>
        <el-form-item v-if="(dialogType == 'new' && page.elementType == 'table') || (dialogType == 'edit' && page.elementType == 'tr')" label="重复次数" prop="repeats">
          <el-input v-model.trim="page.repeats" maxlength="11" placeholder="请输入重复次数" />
        </el-form-item>
        <el-form-item v-if="page.componentType == 2 || page.componentType == 3 || page.componentType == 8 || page.componentType == 9" label="菜单图片" prop="imgPath">
            <el-upload
            ref="uplodadImg"
            class="img-upload"
            action=""
            list-type="picture-card"
            :class="{disabled: uploadDisabled}"
            :http-request="uploadImg"
            :multiple="true"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :file-list="imgList"
            :before-upload="beforeImgUpload"
            :on-exceed="handleExceed"
            :on-change="handleLimit"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="有效时间">
          <el-date-picker
            v-model="page.dateValue"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model.trim="page.sort" maxlength="9" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="regFun" :disabled="diaDisable">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validInt } from "@/utils/validate"
import waves from '@/directive/waves' // waves directive
import { getProductTree, getAllCategory } from '@/api/goods/product'
import { getUserBtnByPId } from '@/api/upms/menu'
import { insertPage, updatePage, getPageByPid, getPageItemByid, deletePageByid, getPageLayoutTree } from '@/api/act/pageLayout'
import { getBannerList } from '@/api/act/banner'
import { getManageList } from '@/api/act/manage'
import { fileUpload } from '@/api/goods/upload'
const defaultPage = {
  id: '',
  name: '',
  width: '',
  height: '',
  sort: '',
  elementType: '',
  componentType: '',
  componentId: '',
  imgPath: '',
  URL: '',
  repeats: '',
  dateValue: null,
  treeValue: null,
}

export default {
  name: 'homePage',
  directives: { waves },
  data() {
    const validateSort = (rule, value, callback) => {
      if (value && !validInt(value)) {
        callback(new Error("请输入整数"));
      } else {
        callback();
      }
    }
    const validateLen = (rule, value, callback) => {
      if (!value) {
        callback(new Error(rule.notice));
      } else if (!validInt(value)) {
         callback(new Error("请输入整数"));
      } else {
        callback();
      }
    }
    return {
      pageData: [],
      pageType: '',
      type: '',
      typeData: [
        {
          value: 3,
          label: '分类'
        },
        {
          value: 8,
          label: 'URL'
        },
         {
          value: 2,
          label: '图片'
        },
         {
          value: 4,
          label: '商品'
        },
         {
          value: 5,
          label: '商品栏目'
        },
         {
          value: 6,
          label: '广告位'
        },
         {
          value: 9,
          label: '横幅'
        }
      ],
      elementData: [{
        value: '-1',
        label: '--'
      },{
        value: 5,
        label: '商品栏目'
      }],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dialogTitle: '',
      treeOptions: [],
      imgList: [],
      uploadDisabled: false,
      treeProps: {
        label: 'name',
        value: 'id'
      },
      // treeProps: {
      //   lazy: true,
      //   lazyLoad (node, resolve) {
      //     const { level } = node;
      //     setTimeout(() => {
      //       const nodes = Array.from({ length: level + 1 })
      //         .map(item => ({
      //           value: ++id,
      //           label: `选项${id}`,
      //           leaf: level >= 2
      //         }));
      //       // 通过调用resolve将子节点数据返回，通知组件数据加载完成
      //       resolve(nodes);
      //     }, 1000);
      //   },
      //   label: 'name',
      //   value: 'id'
      // },
      page: Object.assign({}, defaultPage),
      isLazy: true,
      listLoading: false,
      diaLoading: false,
      diaDisable: false,
      searchLoading: false,
      systemData: [],
      searchData: [],
      keyArr: [''],
      bannerData: [],
      btnsPermission: {
        add: {
          name: '添加',
          auth: false
        },
        addSource: {
          name: '新增模块',
          auth: false
        },
        edit: {
          name: '编辑',
          auth: false
        },
        delete: {
          name: '删除',
          auth: false
        }
      },
      rules: {
        name: [{
          required: true,
          trigger: 'blur',
          message: '请填写名称'
        }],
        repeats: [{
            required: true,
            trigger: 'blur',
            validator: validateSort
        }],
        width: [{
            required: true,
            trigger: 'blur',
            notice: '请填写宽度',
            validator: validateLen
        }],
        height: [{
            required: true,
            trigger: 'blur',
            notice: '请填写高度',
            validator: validateLen
        }],
        treeValue: [{
            required: true,
            trigger: 'blur',
            message: '请选择分类'
        }],
        componentType: [{
            required: true,
            trigger: 'blur',
            message: '请选择类型'
        }],
        repeats: [{
            required: true,
            trigger: 'blur',
            notice: '请填写重复次数',
            validator: validateLen
        }],
        componentId: [{
            required: true,
            trigger: 'blur',
            message: '请选择'
        }],
        imgPath: [{
            required: true,
            trigger: 'blur',
            message: '请选择图片'
        }],
        URL: [{
            required: true,
            trigger: 'blur',
            message: '请填写链接地址'
        }],
        sort: [{
            required: false,
            trigger: 'blur',
            validator: validateSort
        }]
      },
      statusData: [
        {
          value: 0,
          label: '禁止'
        },
        {
          value: 1,
          label: '启用'
        }
      ],
      isChangeParent: false,
      routes: [],
      rolesList: [],
      resourceData: [],
      dialogVisible: false,
      prarentDialogVisible: false,
      iconDialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      total: 0,
      allPages: 0,
      listQuery: {
        name: '',
        status: '',
        type: ''
      },
      checkParentId: '',
      checkParentName: '',
      iconShow: '',
      multipleSelection: [],
      loadNodeMap: new Map(),
      isSearch: false,
      isDeep: false,
      componentType: null,
      bannerDataLoading: false,
      bannerDataQuery: {
        pageIndex: 1,
        pageSize: 10,
        status: '',
      },
      hasTreeValue: false,
      manageData: [],
    }
  },
  created() {
    this.getPageLayoutTree();
    this.getBannerList();
    this.getManageList();
    this.getProductTree();
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
    getPageLayoutTree() {
      this.listLoading = true;
      getPageLayoutTree({ id: 1 }).then(res => {
        this.listLoading = false;
        this.pageData = res.data;
      }).catch(err => {
        this.listLoading = false;
      })
    },
    getProductTree() {
      // 品种树接口
      this.listLoading = true
      getProductTree().then(res => {
        this.listLoading = false
        if(Array.isArray(res.data)) {
          this.treeOptions = this.filterTree(res.data, -1)
        }
      }).catch(err => {
        this.listLoading = false
      })
    },
    uploadImg(file) {
      let formData = new FormData()
      formData.append('file', file.file)
      fileUpload(formData).then(res => {
        this.page.imgPath = res.data.url
        this.imgList.push({
          url: res.data.url,
          uid: file.file.uid
        })
      })
    },
    handlePictureCardPreview(file) {
      // 图片预览
      this.dialogImageUrl = file.url
      this.dialogPicVisible = true
    },
    getBannerList() {
      // 获取广告位置
      getBannerList(this.bannerDataQuery).then(res => {
        let data = [];
        if(Array.isArray(res.data.records)) {
          res.data.records.forEach(item => {
            data.push({
              value: item.code,
              label: item.name
            })
          })
          this.bannerData = data
        }
        this.bannerDataTotal = res.data.total
      })
    },
    filterTree(data, index) {
      let deep = ++index
      const fData = data.filter(item => {
        if(deep >= 2) {
          item.children = null;
        } else {
          if (Array.isArray(item.children) && item.children.length > 0) {
            this.filterTree(item.children, deep)
          }
        }
        return item;
      })
      return fData
    },
    getManageList() {
      // 获取栏目
      getManageList().then(res => {
        let data = [];
        if(Array.isArray(res.data)) {
           res.data.forEach(item => {
            data.push({
              value: item.id,
              label: item.name
            })
          })
          this.manageData = data
        }
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
      } else {
        this.$message.error('上传文件类型错误!')
        return false
      }
    },
    handleExceed(files, fileList) {
      // 图片数量提示
      this.$message({
        message: '上传图片数量不能大于1',
        type: 'warning'
      })
    },
    handleLimit(file,fileList){
      if(fileList.length>=1){
        this.uploadDisabled = true
      } else {
        this.uploadDisabled = false
      }
    },
    handleRemove(file, fileList) {
      // 删除图片
      this.page.imgPath = '';
      this.imgList = [];
      this.uploadDisabled = false;
    },
    async handleAddResource() {
      // 添加顶级资源
      this.isChangeParent = false;
      this.page = Object.assign({}, defaultPage);
      this.page.id = 1;
      this.page.elementType = 'top';
      this.dialogTitle = '新增模块';
      this.dialogType = 'new';
      this.checkStrictly = true;
      this.dialogVisible = true;
      this.checkParentId = '';
      this.checkParentName = '';
      this.$nextTick(() => {
        this.$refs['meanForm'].clearValidate()
      })
    },
    msgEdit(row) {
      // 编辑资源
      this.isChangeParent = false
      this.dialogVisible = true
      this.checkStrictly = true
      this.page = Object.assign({}, defaultPage)
      this.dialogType = 'edit'
      if (row.elementType == 'table') {
        this.dialogTitle = '编辑模块'
      } else if (row.elementType == 'tr') {
        this.dialogTitle = '编辑栏目'
      } else {
        this.dialogTitle = '编辑原件'
      }
      this.$nextTick(() => {
        this.$refs['meanForm'].clearValidate()
      })
      getPageItemByid({ id: row.id }).then(res => {
        this.page.componentType = res.data.componentType;
        this.page.elementType = res.data.elementType;
        this.page.name = res.data.name;
        this.page.id = res.data.id;
        this.page.width = res.data.width;
        this.page.height = res.data.height;
        this.page.sort = res.data.sort;
        if(res.data.beginTime && res.data.endTime) {
          this.page.dateValue = [];
          this.page.dateValue[0] = res.data.beginTime;
          this.page.dateValue[1] = res.data.endTime;
        }
        if (this.page.elementType == 'td') {
          if (this.page.componentType == 2) {
            // 图片
            this.imgList = [];
            if (res.data.imgPath) {
              this.uploadDisabled = true;
              this.imgList.push({
                url: res.data.imgPath
              });
            } else {
              this.uploadDisabled = false;
            }
            this.page.imgPath = res.data.imgPath;
          } else if (this.page.componentType == 3) {
            // 分类
            this.page.componentId = res.data.componentId;
            this.hasTreeValue = false;
            this.imgList = [];
            if (res.data.imgPath) {
              this.uploadDisabled = true;
              this.imgList.push({
                url: res.data.imgPath
              });
            } else {
              this.uploadDisabled = false;
            }
            this.page.imgPath = res.data.imgPath;
            getAllCategory({ categoryId: res.data.componentId }).then(res => {
               this.page.treeValue = [];
               res.data.forEach(item => {
                 this.page.treeValue.unshift(item.id);
               })
            })
            
            // this.page.treeValue = this.getTreeValue(this.treeOptions, res.data.componentId, [], -1);
          } else if (this.page.componentType == 4) {
            // 商品
            this.page.componentId = res.data.componentId;
          } else if (this.page.componentType == 5) {
            // 商品栏目
            this.page.componentId = res.data.componentId;
          } else if (this.page.componentType == 6) {
            // 广告位
            this.page.name = res.data.name;
            this.page.componentId = res.data.componentId;
          } else if (this.page.componentType == 8) {
            // url
            this.imgList = [];
            if (res.data.imgPath) {
              this.uploadDisabled = true;
              this.imgList.push({
                url: res.data.imgPath
              });
            } else {
              this.uploadDisabled = false;
            }
            this.page.imgPath = res.data.imgPath;
            this.page.URL = res.data.url;
          } else if (this.page.componentType == 9) {
            // 横幅
            this.imgList = [];
            if (res.data.imgPath) {
              this.uploadDisabled = true;
              this.imgList.push({
                url: res.data.imgPath
              });
            } else {
              this.uploadDisabled = false;
            }
            this.page.imgPath = res.data.imgPath;
            this.page.componentId = res.data.componentId;
          } else {

          }
        } else if (res.data.elementType == 'tr') {
          this.page.repeats = res.data.repeats;
          if (res.data.componentType == 5) {
            this.page.componentType = 5;
            this.page.componentId = res.data.componentId;
          } else {
            this.page.componentType = '-1';
          }
        } 
      })
    },
    msgAdd(row) {
      // 添加资源
      this.dialogType = 'new';
      this.dialogTitle = row.elementType == 'table' ? '新增栏目' : '新增原件';
      this.page = Object.assign({}, defaultPage);
      this.page.id = row.id;
      this.page.elementType = row.elementType;
      if (row.elementType == 'tr') {
        this.page.componentType = '';
      } else {
        this.page.componentType = row.componentType;
      }
      this.imgList = [];
      this.uploadDisabled = false;
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.$nextTick(() => {
        this.$refs['meanForm'].clearValidate()
      })
    },
    getTreeValue(data, id, value, deep) {
     
      let d = ++deep;
      for (let i = 0; i < data.length; i++) {
        if (this.hasTreeValue) {
          return value
        } else {
          if (id == data[i].id) {
            value[d] = data[i].id;
            this.hasTreeValue = true;
            return value;
          } else {
             value[d] = data[i].id;
            if (Array.isArray(data[i].children) && data[i].children.length > 0) {
              this.getTreeValue(data[i].children, id, value, d);
            }
          }
        }
        
      }
    },
    handleDelete(row) {
      // 删除资源
      this.$confirm('确定要删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
          this.listLoading = true
          deletePageByid({id: row.id}).then(res => {
            this.listLoading = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPageLayoutTree();
          }).catch(err => {
            this.listLoading = false
          })
        })
    },
    regFun() {
      // 校验表单
      this.$refs.meanForm.validate((valid) => {
        if (valid) {
          this.confirmRole()
        }
      });
    },
    confirmRole() {
      // 新增、编辑后提交表单
      const isEdit = this.dialogType === 'edit'
      this.diaDisable = true
      this.diaLoading = true
      if (isEdit) {
        let param = {
            id: this.page.id,
            name: this.page.name,
            width: this.page.width,
            height: this.page.height,
            sort: this.page.sort,
            elementType: this.page.elementType,
            componentType: this.page.componentType
          }
          if(Array.isArray(this.page.dateValue) && this.page.dateValue.length > 1) {
            param.beginTime = this.page.dateValue[0]
            param.endTime = this.page.dateValue[1]
          }
          if (this.page.componentType == 2) {
            // 图片
            param.imgPath = this.page.imgPath;
          } else if (this.page.componentType == 3) {
            // 分类
            param.imgPath = this.page.imgPath;
            if (Array.isArray(this.page.treeValue) && this.page.treeValue.length == 3) {
              param.componentId = this.page.treeValue[2];
            } else {
              this.$message({
                message: '请选择三级分类菜单',
                type: 'warning'
              });
              this.diaDisable = false
              this.diaLoading = false
              return false;
            }
          } else if (this.page.componentType == 4) {
            // 商品
            param.componentId = this.page.componentId;
          } else if (this.page.componentType == 5) {
            // 商品栏目
            param.componentId = this.page.componentId;
          } else if (this.page.componentType == 6) {
            // 广告位
            param.componentId = this.page.componentId;
          } else if (this.page.componentType == 8) {
            // URL
            param.URL = this.page.URL;
            param.imgPath = this.page.imgPath;
          } else if (this.page.componentType == 9) {
            // 横幅
            param.imgPath = this.page.imgPath;
            param.componentId = this.page.componentId;
          }
          updatePage(param).then(res => {
            this.diaDisable = false
            this.diaLoading = false
            this.dialogVisible = false;
            this.$notify({
              title: '编辑成功',
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            this.getPageLayoutTree();
          }).catch(err => {
              this.diaDisable = false
              this.diaLoading = false
          })
         
      } else {
        let param = {
          parentId: this.page.id,
          name: this.page.name,
          sort: this.page.sort,
          width: this.page.width,
          height: this.page.height
        }

        if (Array.isArray(this.page.dateValue) && this.page.dateValue.length > 1) {
            param.beginTime = this.page.dateValue[0]
            param.endTime = this.page.dateValue[1]
        }
        if (this.page.elementType == 'top') {
          param.elementType = 'table'
          param.componentType = null;
        } else if (this.page.elementType == 'table') {
          param.elementType = 'tr';
          param.repeats = this.page.repeats;
          if (this.page.componentType == 5) {
            param.componentType = 5;
            param.componentId = this.page.componentId;
          } else {
            param.componentType = null;
          }
        } else if (this.page.elementType == 'tr') {
          param.elementType = 'td';
          param.componentType = this.page.componentType;
          // 组件类型：1文字  2 图片  3 分类 4商品 5商品列表 6广告位 7搜索  8 URL 9 横幅
          if (this.page.componentType == 2) {
            // 图片
            param.imgPath = this.page.imgPath;
          } else if (this.page.componentType == 3) {
            // 分类
            param.imgPath = this.page.imgPath;
            if (Array.isArray(this.page.treeValue) && this.page.treeValue.length == 3) {
              param.componentId = this.page.treeValue[2];
            } else {
              this.$message({
                message: '请选择三级分类菜单',
                type: 'warning'
              });
              this.diaDisable = false
              this.diaLoading = false
              return false;
            }
          } else if (this.page.componentType == 4) {
            // 商品
            param.componentId = this.page.componentId;
          } else if (this.page.componentType == 5) {
            // 商品栏目
            param.componentId = this.page.componentId;
          } else if (this.page.componentType == 6) {
            // 广告位
            param.componentId = this.page.componentId;
          } else if (this.page.componentType == 8) {
            // URL
            param.URL = this.page.URL;
            param.imgPath = this.page.imgPath;
          } else if (this.page.componentType == 9) {
            // 横幅
            param.imgPath = this.page.imgPath;
            param.componentId = this.page.componentId;
          }
         
        } else {
          return false;
        }
        insertPage(param).then(res => {
          this.diaDisable = false
          this.diaLoading = false
          this.dialogVisible = false;
          this.$notify({
            title: '新增成功',
            dangerouslyUseHTMLString: true,
            type: 'success'
          })
          this.getPageLayoutTree();
        }).catch(err => {
          this.diaDisable = false
          this.diaLoading = false
        })
        // if(this.isChangeParent) {
        //   this.resetResource()
        // } else {
        //   if(this.isSearch) {
        //     if(data.parentId) {
        //       this.searchData = this.filterData(this.searchData, data, 1)
        //     } else {
        //       this.resetResource()
        //     }
        //   } else {
        //     this.handleLoad(this.page.id, this.page.parentId, 1)
        //   }
        // }
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .icon-box{
    .clear{
      clear: both;
    }
    .icon-item {
      margin: 10px;
      height: 85px;
      text-align: center;
      width: 95px;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
    }

    span {
      display: block;
      font-size: 16px;
      margin-top: 10px;
    }

    .disabled {
      pointer-events: none;
    }
  }
  .mr10{
    margin-right: 10px;
  }
  .filter-container{
    padding-bottom: 30px;
  }
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin: 7px 0 30px 0;
  }
}
</style>
