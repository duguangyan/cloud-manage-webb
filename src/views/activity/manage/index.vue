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
  name: 'managePatent',
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
    if(this.$route.path === '/activity/manage') {
      console.log('栏目')
      this.showList = true
    } else {
      this.showChildren = true
      console.log('子集')
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>

</style>

