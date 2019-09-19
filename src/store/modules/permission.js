import { constantRoutes } from '@/router'
import { getRoles } from '@/api/upms/user'
import Layout from '@/layout'

// 路由资源
const moduleSource = [
  'product/classify/index',
  'product/unit/index',
  'product/list/index',
  'product/list/release/index',
  'product/list/detail/index',
  'product/list/add/index',
  'stat/analyze/index',
  'order/sellOrder/index',
  'activity/banner/index',
  'activity/column/index',
  'permission/role/index',
  'system/menu/index',
  'system/dict/index',
  'permission/user/index',
  'system/config/index',
  'system/strict/index',
  'freight/list/index',
  'freight/edit/index'
]
// 重定向路由
const redirectSource = {
  product: 'product/classify',
  stat: 'stat/analyze',
  order: 'order/sellOrder',
  acitvity: 'activity/banner',
  system: 'system/menu'
}
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
// const _import = require('@/router/_import_development') // 获取组件的方法

const httpReg = /(http|https):\/\/([\w.]+\/?)\S*/
const srcReg = /^[A-Za-z]+$/

function filterAsyncRouter(asyncRouterMap, index) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    let exsit = true
    if (route.url) {
      route.hidden = false
      if (moduleSource.indexOf(route.url) > -1) {
        route.component = _import(route.url)
        const urlArr = route.url.split('/')
        route.path = urlArr[urlArr.length - 2]
        if (route.url === moduleSource[3] || route.url === moduleSource[4] || route.url === moduleSource[5]) {
          route.hidden = true
        }
      } else if (httpReg.test(route.url)) {
        route.component = Layout
        route.path = route.url
      } else if (srcReg.test(route.url)) {
        route.component = Layout
        if (redirectSource[route.url]) {
          route.redirect = redirectSource[route.url]
        }
        if (index === 0) {
          route.path = '/' + route.url
        } else {
          route.path = route.url
        }
      } else {
        exsit = false
      }
      if (exsit) {
        route.meta = {
          title: route.name,
          icon: route.icon,
          id: route.id
        }
        route.target = route.operation === 0 ? '' : '_blank'
      }
    } else {
      return false
    }
    if (route.children && route.children.length > 0) {
      route.children = filterAsyncRouter(route.children, 1)
    } else {
      route.children = []
    }
    if (exsit) {
      return route
    }
  })
  return accessedRouters
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 生成路由表
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
