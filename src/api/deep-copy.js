function deepCopy(p, c) {
  c = c || {}
  for (var i in p) {
    if (typeof p[i] === 'object') {
      c[i] = p[i].constructor === Array ? [] : {}
      deepCopy(p[i], c[i])
    } else {
      c[i] = p[i]
    }
  }

  return c
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
