import Vue from 'vue'

Vue.filter('money', function(value) {
  return '￥' + value
})

Vue.filter('multiply', function(value) {
  return '×' + value
})
