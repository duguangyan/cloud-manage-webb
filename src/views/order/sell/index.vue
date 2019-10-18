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

export default {
  name: 'orderSellParent',
  directives: { waves },
  data() {
    return {
      showList: false,
      showChildren: false
    }
  },
  components: { list },
  computed: {

  },
  beforeCreate() {
  
  },
  created() {
    if(this.$route.path === '/order/sell') {
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

