function deepCopy(data, shadow) {
  shadow = shadow || {}
  for (var key in data) {
    // 如果是对象，递归
    if (typeof data[key] === 'object') {
      shadow[key] = Array.isArray(data[key]) ? [] : {}
      deepCopy(data[key], shadow[key])
    } else {
      shadow[key] = data[key]
    }
  }
  return shadow
}

export function preCopy(data) {
  if (data instanceof Array) {
    data = data.map(function(item) {
      item = deepCopy(item)
      return item
    })
  } else {
    data = deepCopy(data)
  }
  return data
}
