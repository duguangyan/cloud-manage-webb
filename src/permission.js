import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.routes
      console.log('hasinfo:', hasGetUserInfo.length)
      if (hasGetUserInfo.length > 0) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          // 实际是请求用户信息后返回，这里是模拟数据，直接从store中取

          // store.dispatch('permission/GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
          //   router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
          //   router.options.routes = store.getters.routers
          //   next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          // })
          // let accessRoutes = await store.dispatch('user/getRoles', roles)
          // console.log('accessroutes:')
          // console.log(accessRoutes)
          // dynamically add accessible routes
          // accessRoutes = [
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
          // const accessRoutes = [
          //   {
          //     path: '/product',
          //     component: 'layout/Layout',
          //     name: 'Product',
          //     meta: { title: '商品管理', icon: 'lock' },
          //     children: [
          //       {
          //         path: 'classify',
          //         name: 'Classify',
          //         component: 'views/product/classify/index',
          //         meta: { title: '分类管理', icon: 'table' }
          //       },
          //       {
          //         path: 'unit',
          //         name: 'Unit',
          //         component: 'views/product/unit/index',
          //         meta: { title: '计量单位', icon: 'tree' }
          //       },
          //       {
          //         path: 'list',
          //         name: 'List',
          //         component: 'views/product/list/index',
          //         meta: { title: '商品列表', icon: 'tree'
          //         }
          //       }
          //     ]
          //   },
          //   {
          //     path: '/order',
          //     component: 'layout/Layout',
          //     name: 'Order',
          //     meta: { title: '订单管理', icon: 'example' },
          //     children: [
          //       {
          //         path: 'classify',
          //         name: 'Classify',
          //         component: 'views/order/sellOrder/index',
          //         meta: { title: '销售订单', icon: 'table' }
          //       }
          //     ]
          //   },
          //   {
          //     path: '/activity',
          //     component: 'layout/Layout',
          //     name: 'Activity',
          //     meta: { title: '活动管理', icon: 'example' },
          //     children: [
          //       {
          //         path: 'banner',
          //         name: 'Banner',
          //         component: 'views/activity/banner/index',
          //         meta: { title: 'Banner管理', icon: 'table' }
          //       },
          //       {
          //         path: 'column',
          //         name: 'Column',
          //         component: '/views/activity/column/index',
          //         meta: { title: '栏目管理', icon: 'table' }
          //       }
          //     ]
          //   },
          
          //   {
          //     path: '/stat',
          //     component: 'layout/Layout',
          //     name: 'Stat',
          //     meta: { title: '数据统计', icon: 'example' },
          //     children: [
          //       {
          //         path: 'general',
          //         name: 'General',
          //         component: 'views/stat/general/index',
          //         meta: { title: '数据概况', icon: 'table' }
          //       },
          //       {
          //         path: 'analyze',
          //         name: 'Analyze',
          //         component: 'views/stat/analyze/index',
          //         meta: { title: '商品分析', icon: 'table' }
          //       }
          //     ]
          //   },
          
          //   {
          //     path: '/permission',
          //     component: 'layout/Layout',
          //     name: 'Permission',
          //     meta: { title: '权限管理', icon: 'example' },
          //     children: [
          //       {
          //         path: 'role',
          //         name: 'Role',
          //         component: 'views/permission/role/index',
          //         meta: { title: '角色管理', icon: 'table' }
          //       },
          //       {
          //         path: 'unit',
          //         name: 'Unit',
          //         component: 'views/permission/user/index',
          //         meta: { title: '用户管理', icon: 'tree' }
          //       }
          //     ]
          //   },
          
          //   {
          //     path: '/system',
          //     component: 'layout/Layout',
          //     name: 'System',
          //     meta: { title: '系统配置', icon: 'example' },
          //     children: [
          //       {
          //         path: 'menu',
          //         name: 'Menu',
          //         component: 'views/system/menu/index',
          //         meta: { title: '菜单资源', icon: 'form' }
          //       },
          //       {
          //         path: 'dict',
          //         name: 'Dict',
          //         component: '/views/system/dict/index',
          //         meta: { title: '字典管理', icon: 'table' }
          //       },
          //       {
          //         path: 'config',
          //         name: 'Config',
          //         component: 'views/system/config/index',
          //         meta: { title: '系统管理', icon: 'form' }
          //       }
          //     ]
          //   },
          
          //   // 404 page must be placed at the end !!!
          //   { path: '*', redirect: '/404', hidden: true }
          // ]
          const x = await store.dispatch('permission/generateRoutes')
          console.log('x')
          console.log(x)
          console.log(store.getters.roles)
          router.addRoutes(store.getters.routes)
          router.options.routes = store.getters.routes
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
        } catch (error) {
          console.log('error')
          console.log(error)
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
