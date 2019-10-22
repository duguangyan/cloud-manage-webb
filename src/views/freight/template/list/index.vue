<template>
  <div class="list">
    <div class="build">
      <el-button type="primary" size="middle" @click="$router.push('/freight/template/add')">新建模板</el-button>
    </div>
    <el-table :data="list" stripe style="width: 800px;">
      <el-table-column prop="name" label="模板名称" width="180"></el-table-column>
      <el-table-column prop="type" label="计费方式" width="180">
        <template slot-scope="scope">
          <div v-if="+scope.row.type===0">包邮</div>
          <div v-else-if="+scope.row.type===1">件数</div>
          <div v-else-if="+scope.row.type===2">体积</div>
          <div v-else-if="+scope.row.type===3">重量</div>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="最后编辑时间"></el-table-column>
      <el-table-column prop label="操作" width="240">
        <template slot-scope="scope">
          <el-button size="mini" @click="doCopy(scope.row)">复制模板</el-button>
          <el-button size="mini" type="warning" @click="toEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="doDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList,copyModule,doDelete } from "@/api/goods/freight";

var vm = {
  name: "freightTemplateList",
  data() {
    vm = this;
    return {
      list: []
    };
  },
  created() {
    vm.load();
  },
  methods: {
    load() {
      getList({
        shopId: vm.$store.state.user.shop.id || localStorage.getItem('shopId')
      }).then(data => {
        vm.list = data.data;
      });
    },
    toEdit(item) {
      vm.$router.push(`/freight/template/edit?id=${item.id}`);
    },
    doDel(item) {
      vm.$confirm("确认删除该模板？")
        .then(() => {
          doDelete({
            id: item.id
          }).then(data=>{
            vm.$message.success('删除成功!')
            vm.load();
          })
        })
        .catch(() => {});
    },
    doCopy(item){
      copyModule({
        id: item.id,
      }).then(data=>{
        vm.$message.success('复制成功');
        vm.load();
      })
    }
  }
};
export default vm;
</script>

<style lang="scss" scoped>
.list {
  // text-align: center;
  padding: 15px;
  .build {
    margin-bottom: 20px;
  }
}
</style>
