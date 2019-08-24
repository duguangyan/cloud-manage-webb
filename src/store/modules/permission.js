import { constantRoutes } from '@/router'
import { getRoles } from '@/api/upms/user'
import Layout from '@/layout'

// 路由资源
const moduleSource = [
  'product/classify/index',
  'product/unit/index',
  'product/list/index',
  'stat/analyze/index',
  'order/sellOrder/index',
  'activity/banner/index',
  'activity/column/index',
  'permission/role/index',
  'system/menu/index',
  'system/dict/index',
  'permission/user/index',
  'system/config/index'
]
const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
// const _import = require('@/router/_import_development') // 获取组件的方法

const httpReg = /(http|https):\/\/([\w.]+\/?)\S*/
const srcReg = /^[A-Za-z]+$/

function filterAsyncRouter(asyncRouterMap, index) { // 遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    let exsit = true
    if (route.url) {
      // console.log(route.url)
      // console.log(moduleSource.indexOf(route.url) > -1)
      if (moduleSource.indexOf(route.url) > -1) {
        route.component = _import(route.url)
        route.path = route.url.split('/')[1]
        // console.log('vue')
        // console.log(route.url)
      } else if (httpReg.test(route.url)) {
        route.component = Layout
        route.path = route.url
        // console.log('http')
        // console.log(route.url)
      } else if (srcReg.test(route.url)) {
        route.component = Layout
        if (index === 0) {
          route.path = '/' + route.url
        } else {
          route.path = route.url
        }
        // console.log('layout')
        // console.log(route.path)
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
