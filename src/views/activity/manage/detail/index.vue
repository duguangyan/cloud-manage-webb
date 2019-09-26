<template>
  <div>
    ggggg
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
  name: 'detailPatent',
  directives: { waves },
  data() {
    return {
      showList: false,
      showChildren: false
    }
  },
  components: { list, Pagination },
  computed: {

  },
  created() {
    console.log('inside')
    console.log(this.$route.path)
    if(this.$route.path === '/activity/manage') {
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

