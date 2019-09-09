<template>
  <div class="list">
    <el-table :data="list" stripe style="width: 100%">
      <el-table-column prop="date" label="模板名称" width="180"></el-table-column>
      <el-table-column prop="name" label="计费方式" width="180"></el-table-column>
      <el-table-column prop="address" label="最后编辑时间"></el-table-column>
      <el-table-column prop="address" label="操作"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-sizes="[10, 20, 30, 40]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="total"
      :current-page="page.current"
      :page-size="page.size"
    ></el-pagination>
  </div>
</template>

<script>
var vm = {
  name: "freight/list",
  data() {
    vm = this;
    return {
      list: [],
      total: 0,
      page:{
        current: 1,
        size: 10
      }
    };
  }
};
export default vm;
</script>

<style lang="scss" scoped>
</style>
