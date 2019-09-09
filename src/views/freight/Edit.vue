<template>
  <div class="edit">
    <li>
      模板名称:
      <el-input placeholder="请输入内容" v-model="input" clearable></el-input>
    </li>
    <li>
      发货地址:
      <!-- 省 -->
      <el-select v-model="value1" multiple placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <!-- 市 -->
      <el-select v-model="value1" multiple placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <!-- 区 -->
      <el-select v-model="value1" multiple placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </li>
  </div>
</template>

<script>
var vm = {
  name: "",
  data() {
    vm = this;
    return {};
  }
};
export default vm;
</script>

<style lang="scss" scoped>
</style>
