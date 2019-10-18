import { constantRoutes } from '@/router'
import { getRoles } from '@/api/upms/user'
import Layout from '@/layout'

// 路由资源
const routeModule = [
  {
    name: 'product',
    path: 'product',
    compare: 'product',
    source: 'product',
    isSource: false,
    hidden: false
  },
  {
    name: 'productClassify',
    path: 'classify',
    compare: 'product/classify/index',
    source: 'product/classify/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'productUnit',
    path: 'unit',
    compare: 'product/unit/index',
    source: 'product/unit/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'productListPatent',
    path: 'list',
    compare: 'product/list/index',
    source: 'product/list/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'productEdit',
    path: 'edit',
    compare: 'product/list/edit/index',
    source: 'product/list/edit/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'productEdit',
    path: 'add',
    compare: 'product/list/add/index',
    source: 'product/list/edit/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'productRelease',
    path: 'release',
    compare: 'product/list/release/index',
    source: 'product/list/release/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'productDetail',
    path: 'detail',
    compare: 'product/list/detail/index',
    source: 'product/list/detail/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'stat',
    path: 'stat',
    compare: 'stat',
    source: 'stat',
    isSource: false,
    hidden: false
  },
  {
    name: 'statGeneral',
    path: 'general',
    compare: 'stat/general/index',
    source: 'stat/general/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'statAnalyze',
    path: 'analyze',
    compare: 'stat/analyze/index',
    source: 'stat/analyze/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'order',
    path: 'order',
    compare: 'order',
    source: 'order',
    isSource: false,
    hidden: false
  },
  {
    name: 'orderSellParent',
    path: 'sell',
    compare: 'order/sell/index',
    source: 'order/sell/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'orderDetail',
    path: 'detail',
    compare: 'order/sell/detail/index',
    source: 'order/sell/detail/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'activity',
    path: 'activity',
    compare: 'activity',
    source: 'activity',
    isSource: false,
    hidden: false
  },
  {
    name: 'activityBanner',
    path: 'banner',
    compare: 'activity/banner/index',
    source: 'activity/banner/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'activityColumn',
    path: 'column',
    compare: 'activity/column/index',
    source: 'activity/column/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'activityManageParent',
    path: 'manage',
    compare: 'activity/manage/index',
    source: 'activity/manage/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'activityDetailParent',
    path: 'detail',
    compare: 'activity/manage/detail/index',
    source: 'activity/manage/detail/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'activityAdd',
    path: 'add',
    compare: 'activity/manage/detail/add/index',
    source: 'activity/manage/detail/add/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'permissionUser',
    path: 'user',
    compare: 'permission/user/index',
    source: 'permission/user/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'permissionRole',
    path: 'role',
    compare: 'permission/role/index',
    source: 'permission/role/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'system',
    path: 'system',
    compare: 'system',
    source: 'system',
    isSource: false,
    hidden: false
  },
  {
    name: 'systemMenu',
    path: 'menu',
    compare: 'system/menu/index',
    source: 'system/menu/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'systemDict',
    path: 'dict',
    compare: 'system/dict/index',
    source: 'system/dict/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'systemConfig',
    path: 'config',
    compare: 'system/config/index',
    source: 'system/config/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'systemStrict',
    path: 'strict',
    compare: 'system/strict/index',
    source: 'system/strict/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'freight',
    path: 'freight',
    compare: 'freight',
    source: 'freight',
    isSource: false,
    hidden: false
  },
  {
    name: 'freightTemplateParent',
    path: 'template',
    compare: 'freight/template/index',
    source: 'freight/template/index',
    isSource: true,
    hidden: false
  },
  {
    name: 'freightTemplateList',
    path: 'list',
    compare: 'freight/template/list/index',
    source: 'freight/template/list/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'freightTemplateEdit',
    path: 'edit',
    compare: 'freight/template/edit/index',
    source: 'freight/template/edit/index',
    isSource: true,
    hidden: true
  },
  {
    name: 'wechat',
    path: 'wechat',
    compare: 'wechat',
    source: 'wechat',
    isSource: false,
    hidden: false
  },
  {
    name: 'wechatList',
    path: 'list',
    compare: 'wechat/list/index',
    source: 'wechat/list/index',
    isSource: true,
    hidden: false
  }
]

const _import = require('@/router/_import_' + process.env.NODE_ENV) // 获取组件的方法
const httpReg = /(http|https):\/\/\S+/

// 匹配路由
function getRouteSource(r) {
  const result = {
    hasRoute: false,
    name: '',
    source: '',
    path: '',
    isSource: false,
    hidden: false
  }
  routeModule.forEach(item => {
    if (item.compare === r) {
      result.hasRoute = true
      result.name = item.name
      result.source = item.source
      result.path = item.path
      result.isSource = item.isSource
      result.hidden = item.hidden
      return false
    }
  })
  return result
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, index) {
  const accessedRouters = asyncRouterMap.filter(route => {
    let exsit = true
    if (route.url) {
      route.hidden = false
      const routeObj = getRouteSource(route.url)
      if (routeObj.hasRoute) {
        route.meta = {
          title: route.name,
          icon: route.icon,
          id: route.id,
          url: route.url
        }
        route.hidden = routeObj.hidden
        route.name = routeObj.name
        route.target = route.operation === 2 ? '_blank' : ''
        if (routeObj.isSource) {
          route.component = _import(routeObj.source)
          route.path = routeObj.path
        } else {
          route.component = Layout
          if (index === 0) {
            route.path = '/' + routeObj.path
          } else {
            route.path = routeObj.path
          }
        }
      } else if (httpReg.test(route.url)) {
        // route.component = Layout
        if (route.operation === 1) {
          if (index === 0) {
            route.path = '/iframe:' + encodeURI(route.name)
            route.component = Layout
            route.children = [
              {
                url: route.url,
                name: route.name,
                id: route.id,
                operation: route.operation,
                icon: route.icon,
                sort: route.sort,
                isHidden: true
              }
            ]
          } else {
            route.path = '/iframe:' + encodeURI(route.name)
            route.component = _import('iframe/index')
            if (route.isHidden) {
              route.hidden = true
            }
          }
        } else {
          route.path = route.url
        }
      } else {
        exsit = false
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
        location.urls = {}
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
