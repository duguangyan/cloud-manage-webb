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
          await store.dispatch('permission/generateRoutes')
          router.options.routes = store.getters.routes
          router.addRoutes(store.getters.routes)
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
