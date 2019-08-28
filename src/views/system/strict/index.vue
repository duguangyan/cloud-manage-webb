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
      <el-form :model="strict" :rules="rules" ref="strict" label-width="100px">
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
import { debuglog } from "util";

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
          required: true,
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
      curNode: {},
      status: ""
    };
  },
  methods: {
    // 提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (+vm.status === 0) {
            // 新增
            let level = vm.curData.level;
            let data = {...vm.strict};
            delete data.id;
            insertAd(
              Object.assign(vm.strict, {
                level: ++level,
                parentId: vm.curData.id
              })
            )
              .then(res => {
                // 手动更新节点
                const newChild = Object.assign(res.data, { children: [] });
                vm.$set(vm.curData, "children", []);
                vm.curData.children.push({ ...newChild });
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
                vm.curData = Object.assign(vm.curData, vm.strict);
              })
              .catch(res => {
                vm.$message.error(res.msg);
              });
          }
          vm.isShow = false;
        } else {
          return vm.$message.error("请正确填写表单！");
        }
      });
    },

    // 重置表单
    resetForm(formName) {
      vm.$refs[formName].resetFields();
    },

    // 加载节点
    loadNode(node, resolve) {
      getAd({
        parentId: node.data.id || ""
      }).then(res => {
        if (node.level > 0) {
          vm.$set(node.data, "children", res.data);
        } else {
          res.data.map(item => {
            vm.$set(item, "children", []);
            return item;
          });
        }
        resolve(res.data);
      });
    },

    // 预新增地域(弹窗)
    // status 0:新增, 1:编辑
    preDo(node, data, status) {
      vm.isShow = true;
      vm.status = status;
      vm.curData = data;
      vm.curNode = node;
      +status === 1 && (vm.strict = { ...data });
    },

    preRemove(node, data) {
      vm.$confirm("此操作将永久删除该区域, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定删除
          delAd({
            id: data.id
          })
            .then(res => {
              vm.$message({
                type: "success",
                message: "删除成功"
              });
              const parent = node.parent;
              const children = parent.data.children || parent.data;
              const index = children.findIndex(d => d.id === data.id);
              children.splice(index, 1);
              node.parent.childNodes.splice(index, 1);
            })
            .catch(res => {
              vm.$message.error(res.response.data.msg);
            });
        })
        .catch(() => {
          return false;
        });
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{data.name}&emsp;</span>
          <el-tooltip content="编辑地域" placement="top">
            <el-button
              size="medium"
              type="text"
              on-click={() => {
                vm.preDo(node, data, 1);
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
                vm.preDo(node, data, 0);
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
                vm.preRemove(node, data);
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
