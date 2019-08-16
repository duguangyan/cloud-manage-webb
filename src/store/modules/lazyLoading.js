export default (name, index = false) => () => import(`src${name}${index ? '/index' : ''}.vue`)
// export default (name, index = false) => () => import('src' + name + '.vue')

// module.exports = file => require('@/' + file + '.vue').default
