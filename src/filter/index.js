import Vue from 'vue'

Vue.filter('money', function(value) {
  return '￥' + value
})

Vue.filter('multiply', function(value) {
  return '×' + value
})

Vue.filter('dateFormat', function(value) {
  if (!value) {
    return value
  }
  const time = new Date(Number(value) * 1000)
  function timeAdd0(str) {
    if (str < 10) {
      str = '0' + str
    }
    return str
  }
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()
  const h = time.getHours()
  const mm = time.getMinutes()
  const s = time.getSeconds()
  return y + '-' + timeAdd0(m) + '-' + timeAdd0(d) + ' ' + timeAdd0(h) + ':' + timeAdd0(mm) + ':' + timeAdd0(s)
})
