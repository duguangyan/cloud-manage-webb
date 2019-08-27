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
  name: 'listPatent',
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
    console.log(this.$route)
    console.log(this.$route.path === '/product/list')
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

