<template>
  <div class="strict">
    <el-tree :data="grandParent" :props="defaultProps" @node-click="getChildren" ></el-tree>
  </div>
</template>

<script>
import { getAd, insertAd } from "@/api/upms/strict";

var vm = {
  name: "strict",
  data() {
    vm = this;
    return {
      grandParent: [],
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  mounted() {
    getAd({
      pId: ""
    }).then(res => {
      let data = res.data[0];
      vm.$set(data, 'children', []);
      vm.grandParent.push(data)
    });
  },
  methods: {
    getChildren(data) {
      getAd({
        pId: data.id
      }).then(res => {
        // let idx = vm.grandParent.indexOf(data);
        vm.$set(data, "children", res.data.concat(data.children || []));
        // data.children = res.data;
        // vm.grandParent.splice(idx, 1, data);
      });
    },

    append(data) {
      const newChild = { id: id++, label: "testtest", children: [] };
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },

    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{data.name}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(data)}
            >
              Append
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              Delete
            </el-button>
          </span>
        </span>
      );
    }
  }
};
export default vm;
</script>

<style>
</style>