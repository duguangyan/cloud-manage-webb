import Vue from 'vue'

Vue.filter('money', function(value) {
  return '￥' + value
})

Vue.filter('multiply', function(value) {
  return '×' + value
})

Vue.filter('dateFormat', function(value) {
  console.log(value)
  const time = new Date(value)
  console.log('t', time)
  function timeAdd0(str) {
    if (str < 10) {
      str = '0' + str
    }
    return str
  }
  var y = time.getFullYear()
  var m = time.getMonth() + 1
  var d = time.getDate()
  var h = time.getHours()
  var mm = time.getMinutes()
  var s = time.getSeconds()
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s)
})
