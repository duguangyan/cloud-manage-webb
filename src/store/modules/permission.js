import { asyncRoutes, constantRoutes } from '@/router'
import { getRoles } from '@/api/user'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

function addDynamicMenuRoutes(menuList = [], routes = []) {
  menuList.forEach(function(item, index) {
    if (item.component === 'Layout') {
      item.component = Layout
    } else {
      // item.component = resolve => require(item.component, resolve)
      item.component = () => import(item.component)
    }
    item.name = item.path.toUpperCase()
    item.path = '/' + item.path
    if (item.children && item.children.length > 0) {
      let mchildren = []
      mchildren = childrenPro(item.children, mchildren)
      item.children = mchildren
    } else if (item.children === null) {
      item.children = []
    }
    routes[index] = item
  })
  return routes
}
function childrenPro(childrenList = [], mychildren = []) {
  childrenList.forEach(function(item, index) {
    if (item.component) {
      // item.component = resolve => require(item.component, resolve)
      item.component = () => import(item.component)
    }
    if (item.children && item.children.length > 0) {
      const mychildrenRoute = []
      item.children = childrenPro(item.children, mychildrenRoute)
    } else if (item.children === null) {
      item.children = []
    }
    item.name = item.path.toUpperCase()
    item.path = '/' + item.path
    mychildren[index] = item
  })
  return mychildren
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    console.log(state.routes)
  }
}

const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // }

  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      let accessedRouters = []
      getRoles({ userId: 1 }).then(response => {
        accessedRouters = addDynamicMenuRoutes(response.data, accessedRouters)
        commit('SET_ROUTES', accessedRouters)
        resolve(accessedRouters)
      })
      // console.log('my roles')
      // console.log(roles)
      // accessedRouters = addDynamicMenuRoutes(roles, accessedRouters)
      // console.log(JSON.stringify(accessedRouters))
      // commit('SET_ROUTES', accessedRouters)
      // resolve(accessedRouters)
    })
  }

  // API_getMenus(userGroupTypeId).then(response => {
  //   let accessedRouters = response.data
  //   //第一层未做递归
  //   accessedRouters.map(function (item) {
  //       item.component = lazyComponentLoading(item.component)
  //       item.children.map(function (child) {
  //           child.component = lazyComponentLoading(child.component)
  //       })
  //   })
  //   commit('SET_ROUTERS', accessedRouters)
  // }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
