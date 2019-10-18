<template>
  <div>
    <template v-if="showList">
      <list></list>
    </template>
    <template v-if="showChildren">
      <router-view />
    </template>
  </div>
</template>

<script>
import list from './list'
export default {
  name: 'activityDetailParent',
  data() {
    return {
      showList: false,
      showChildren: false
    }
  },
  components: { list },
  created() {
    if(this.$route.path === '/activity/manage/detail') {
      this.showList = true
    } else {
      this.showChildren = true
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>

