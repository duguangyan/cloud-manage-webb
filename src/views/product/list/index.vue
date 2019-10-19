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
import waves from '@/directive/waves'
import list from './list'
import Pagination from '@/components/Pagination'

export default {
  name: 'productListParent',
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
  beforeCreate() {
  
  },
  created() {
    if(this.$route.path === '/product/list') {
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

