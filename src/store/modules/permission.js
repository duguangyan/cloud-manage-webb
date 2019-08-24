import { constantRoutes } from '@/router'
import { getRoles } from '@/api/upms/user'
import Layout from '@/layout'

const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
// const _import = require('@/router/_import_development') // 获取组件的方法

const httpReg = /(http|https):\/\/([\w.]+\/?)\S*/
const indexReg = /.+\/index/
function filterAsyncRouter(asyncRouterMap, index) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    // route.alwaysShow = true
    // console.log('--------------------')
    // console.log('--------------------')
    // console.log(route.name)
    // console.log(route.url)
    // console.log('---------------------')
    // console.log('--------------------')
    if (route.url) {
      route.meta = {
        title: route.name,
        icon: route.icon
      }
      route.target = route.operation === 0 ? '' : '_blank'
      if (httpReg.test(route.url)) {
        console.log('http')
        route.component = Layout
        route.path = route.url
        console.log(route)
      } else if (indexReg.test(route.url)) {
        console.log('index')
        // console.log(route.url)
        route.component = _import(route.url)
        route.path = route.url.split('/')[1]
      } else {
        console.log('layout')
        route.component = Layout
        if (index === 0) {
          route.path = '/' + route.url
        } else {
          route.path = route.url
        }
      }
      // if (route.url === 'Layout') { // Layout组件特殊处理
      //   // console.log('route Layout:', route.url)
      //   // console.log(route.name)
      //   route.component = Layout
      //   if (index === 0) {
      //     if (route.children !== null) {
      //       route.path = '/' + route.children[0].url.split('/')[0]
      //       route.name = route.children[0].url.split('/')[0]
      //       console.log('x', route.name)
      //     } else {
      //       route.path = route.url.split('/')[0]
      //     }
      //   } else {
      //     route.path = route.children[0].url.split('/')[0]
      //     route.name = route.children[0].url.split('/')[0]
      //     console.log('name', route.name)
      //   }
      // } else {
      //   // if(IsURL(route.url)) {
      //   //   console.log('route http:', route.url)
      //   //   route.path = route.url
      //   // } else {
      //   // console.log('route Component:', route.url)
      //   route.component = _import(route.url)
      //   route.target = route.operation === 0 ? '' : '_blank'
      //   route.path = route.url.split('/')[1]
      //   route.name = name
      //   // }
      // }
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children, 1)
    } else {
      route.children = []
    }
    return true
  })
  return accessedRouters
}

function IsURL(str_url){
  var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
      + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
      + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
      + "|" // 允许IP和DOMAIN（域名）
      + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
      + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
      + "[a-z]{2,6})" // first level domain- .com or .museum
      + "(:[0-9]{1,4})?" // 端口- :80
      + "((/?)|" // 如果没有文件名，则不需要斜杠
      + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  var re=new RegExp(strRegex);
  //re.test()
  if (re.test(str_url)){
      return (true);
  }else{
      return (false);
  }
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    console.log('routes')
    console.log(state.routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let accessedRouters = []
      getRoles({ userId: this.getters.userId }).then(res => {
        accessedRouters = filterAsyncRouter(res.data, 0)
        commit('SET_ROUTES', accessedRouters)
        resolve()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
