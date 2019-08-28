<template>
  <div class="strict">
    <!-- 地区树 -->
    <el-tree
      :data="grandParent"
      :props="defaultProps"
      :render-content="renderContent"
      lazy
      :load="loadNode"
      :expand-on-click-node="false"
    ></el-tree>

    <!-- 编辑 -->
    <el-dialog title="地区编辑" :visible.sync="isShow" width="60%">
      <el-form
        :model="strict"
        :rules="rules"
        ref="strict"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="strict.name"></el-input>
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="strict.shortName"></el-input>
        </el-form-item>
        <el-form-item label="拼音" prop="pinyin">
          <el-input v-model="strict.pinyin"></el-input>
        </el-form-item>
        <el-form-item label="区号" prop="telCode">
          <el-input v-model="strict.telCode"></el-input>
        </el-form-item>
        <el-form-item label="邮编" prop="zipCode">
          <el-input v-model="strict.zipCode"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="strict.sort"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('strict')">确认</el-button>
          <el-button type="info" @click="resetForm('strict')">重置</el-button>
          <el-button @click="isShow = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAd, insertAd, editAd, delAd } from "@/api/upms/strict";

var vm = {
  name: "strict",
  data() {
    vm = this;
    return {
      grandParent: /* 顶级 */ [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      strict: /* 新增的地区 */ {
        name: "",
        shortName: "",
        pinyin: "",
        telCode: "",
        zipCode: "",
        sort: ""
      },
      isShow: false,
      rules: {
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        shortName: {
          required: true,
          message: "请输入简称"
        },
        pinyin: {
          message: "请输入拼音"
        },
        telCode: {
          message: "请输入区号"
        },
        zipCode: {
          message: "请输入邮编"
        },
        sort: {
          message: "请输入排序"
        }
      },
      curData: {},
      status: ""
    };
  },
  mounted() {
    getAd({
      parentId: ""
    }).then(res => {
      let data = res.data[0];
      try {
        res.data.forEach(item => {
          vm.$set(item, "children", []);
          vm.grandParent.push(data);
        });
      } catch (e) {}
    });
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (+vm.status === 0) {
            // 新增
            debugger
            insertAd(
              Object.assign(vm.strict, {
                level: ++vm.curData.level,
                parentId: vm.curData.parentId
              })
            )
            .then(res => {
              // 手动更新节点
              const newChild = Object.assign(res.data,{children: []});
              vm.curData.children.push(newChild);
              // vm.$message.success({
              //   type: 'success',
              //   message: '地区信息将会在刷新后更改'
              // });
              
            })
            .catch(res => {
              vm.$message.error(res.response.data.message);
            });
          } else {
            // 编辑
            editAd(
              Object.assign(vm.strict, {
                level: vm.curData.level,
                parentId: vm.curData.parentId,
                id: vm.curData.id
              })
            )
            .then(res => {
              // 手动更新节点
              // vm.$message.success('地区信息将会在刷新后更改');
              vm.curData = Object.assign(vm.curData,res.data);
            })
            .catch(res => {
              vm.$message.error(res.msg);
            });
          }
        } else {
          return vm.$message.error("请正确填写表单！");
        }
      });
    },

    // 重置表单
    resetForm(formName) {
      vm.$refs[formName].resetFields();
    },

    // 获取地区
    getChildren(data) {
      getAd({
        pId: data.id
      }).then(res => {
        vm.$set(data, "children", res.data.concat(data.children || []));
      });
    },

    // 加载节点
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([]);
      }
      // if (node.level > 1) return resolve([]);

      getAd({
        parentId: node.data.id
      }).then(res => {
        resolve(res.data);
      });
    },

    // 预新增地域(弹窗)
    // status 0:新增, 1:编辑
    preAppend(status) {
      vm.isShow = true;
      vm.status = status;
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node" >
          <span>{data.name}&emsp;</span>

          <el-tooltip content="编辑地域" placement="top">
            <el-button
              size="medium"
              type="text"
              on-click={() => {
                vm.curData = data;
                vm.preEdit(1);
              }}
            >
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="新增地域" placement="top">
            <el-button
              size="medium"
              type="text"
              on-click={() => {
                vm.curData = data;
                vm.preAppend(0);
              }}
            >
              <i class="el-icon-circle-plus-outline"></i>
            </el-button>
          </el-tooltip>

          <el-tooltip content="删除地域" placement="top">
            <el-button
              size="medium"
              type="text"
              on-click={() => {
                vm.curData = data;
                vm.preRemove(node, data)
              }}
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </el-tooltip>
        </span>
      );
    }
  }
};
export default vm;
</script>

<style>
</style>