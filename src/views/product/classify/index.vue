<template>
  <div class="app-container">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText">
    </el-input>

    <el-tree
      class="filter-tree"
      draggable
      @node-drop="sort"
      :data="data"
      node-key="id"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      :allow-drop="allowDrop"
      :expand-on-click-node="false"
      ref="tree">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
let id = 1000;

export default {
  name: 'CLASSIFY',
  data() {
    return {
        filterText: '',
        data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  components: {  },
  computed: {

  },
  created() {

  },
  methods: {
     filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    allowDrop(draggingNode, dropNode, type){
          if (draggingNode.data.level === dropNode.data.level) {
            if (draggingNode.data.aboveId === dropNode.data.aboveId) {
              return type === 'prev' || type === 'next'
            }
          } else {
            // 不同级进行处理
            return false
          }
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
    },
    sort(draggingNode,dropNode,type,event) {
      /* console.log('排序')
      console.log(dropNode)   //dropNode.parent.childNodes =[] 拖拽之后的重新组合的数组 */
      let obj = {
        aboveId:'',
        arr:[]
      }
      obj.aboveId = dropNode.data.aboveId
      for (let item of dropNode.parent.childNodes) {
        obj.arr.push(item.data.id)
      }
      // this.updateOrderMe(obj)
      console.log(obj)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
