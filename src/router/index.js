import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    },
    {
      path: '/freight/edit',
      component: () => import('@/views/freight/edit')
    }]
  }
  // {
  //   path: '/product',
  //   component: Layout,
  //   redirect: '/product',
  //   name: 'Product',
  //   meta: { title: '商品管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'classify',
  //       name: 'Classify',
  //       component: () => import('@/views/product/classify/index'),
  //       meta: { title: '分类管理', icon: 'table' }
  //     },
  //     {
  //       path: 'unit',
  //       name: 'Unit',
  //       component: () => import('@/views/product/unit/index'),
  //       meta: { title: '计量单位', icon: 'tree' }
  //     },
  //     {
  //       path: 'list',
  //       name: 'List',
  //       component: () => import('@/views/product/list/index'),
  //       meta: { title: '商品列表', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/order',
  //   component: Layout,
  //   name: 'Order',
  //   meta: { title: '订单管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'classify',
  //       name: 'Classify',
  //       component: () => import('@/views/order/sellOrder/index'),
  //       meta: { title: '销售订单', icon: 'table' }
  //     }
  //   ]
  // },

  // {
  //   path: '/activity',
  //   component: Layout,
  //   name: 'Activity',
  //   meta: { title: '活动管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'banner',
  //       name: 'Banner',
  //       component: () => import('@/views/activity/banner/index'),
  //       meta: { title: 'Banner管理', icon: 'table' }
  //     },
  //     {
  //       path: 'column',
  //       name: 'Column',
  //       component: () => import('@/views/activity/column/index'),
  //       meta: { title: '栏目管理', icon: 'table' }
  //     }
  //   ]
  // },

  // {
  //   path: '/stat',
  //   component: Layout,
  //   name: 'Stat',
  //   meta: { title: '数据统计', icon: 'example' },
  //   children: [
  //     {
  //       path: 'general',
  //       name: 'General',
  //       component: () => import('@/views/stat/general/index'),
  //       meta: { title: '数据概况', icon: 'table' }
  //     },
  //     {
  //       path: 'analyze',
  //       name: 'Analyze',
  //       component: () => import('@/views/stat/analyze/index'),
  //       meta: { title: '商品分析', icon: 'table' }
  //     }
  //   ]
  // },

  // {
  //   path: '/permission',
  //   component: Layout,
  //   name: 'Permission',
  //   meta: { title: '权限管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'role',
  //       name: 'Role',
  //       component: () => import('@/views/permission/role/index'),
  //       meta: { title: '角色管理', icon: 'table' }
  //     },
  //     {
  //       path: 'unit',
  //       name: 'Unit',
  //       component: () => import('@/views/permission/user/index'),
  //       meta: { title: '用户管理', icon: 'tree' }
  //     }
  //   ]
  // },

  // {
  //   path: '/system',
  //   component: Layout,
  //   name: 'System',
  //   meta: { title: '系统配置', icon: 'example' },
  //   children: [
  //     {
  //       path: 'menu',
  //       name: 'Menu',
  //       component: () => import('@/views/system/menu/index'),
  //       meta: { title: '菜单资源', icon: 'form' }
  //     },
  //     {
  //       path: 'dict',
  //       name: 'Dict',
  //       component: () => import('@/views/system/dict/index'),
  //       meta: { title: '字典管理', icon: 'table' }
  //     },
  //     {
  //       path: 'config',
  //       name: 'Config',
  //       component: () => import('@/views/system/config/index'),
  //       meta: { title: '系统管理', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

// export const asyncRoutes = [
//   {
//     path: '/',
//     component: Layout,
//     redirect: '/dashboard',
//     children: [{
//       path: 'dashboard',
//       name: 'Dashboard',
//       component: () => import('@/views/dashboard/index'),
//       meta: { title: '主页', icon: 'dashboard' }
//     }]
//   },
//   {
//     path: '/product',
//     name: 'Product',
//     meta: { title: '商品管理', icon: 'example' },
//     children: [
//       {
//         path: 'classify',
//         name: 'Classify',
//         component: () => import('@/views/product/classify/index'),
//         meta: { title: '分类管理', icon: 'table' }
//       },
//       {
//         path: 'unit',
//         name: 'Unit',
//         component: () => import('@/views/product/unit/index'),
//         meta: { title: '计量单位', icon: 'tree' }
//       },
//       {
//         path: 'list',
//         name: 'List',
//         component: () => import('@/views/product/list/index'),
//         meta: { title: '商品列表', icon: 'tree' }
//       }
//     ]
//   }
// ]

// https://www.cnblogs.com/llcdxh/p/9778491.html
// 文章中描述DllPlugin和DllReferencePlugin处理，适用于vue-cli2.0，cli3.0的开发是否适用后续研究。
// const _import = require('@/router/_import_' + process.env.NODE_ENV) // eslint-disable-line import/no-dynamic-require

/**
 * 通过后台数据生成动态路由
 * 遍历后台传来的路由字符串，转换为组件对象
 * @param {Array} asyncRouterMap
 * @returns {Boolean}
 * @example see @/store/modules/permission.js
 */
// export function getAsyncRouter(asyncRouterMap) {
//   const accessedRouters = asyncRouterMap.filter(route => {
//     const component = route.component
//     if (component) {
//       if (component === 'Layout') { // Layout组件特殊处理
//         route.component = Layout
//       } else {
//         route.component = resolve => require(route.component, resolve)
//       }
//     }
//     if (route.children && route.children.length > 0) {
//       route.children = getAsyncRouter(route.children)
//     }
//     return true
//   })

//   return accessedRouters
// }

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// module.exports = file => () => import('@/views/' + file + '.vue')

export default router
