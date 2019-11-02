import { login, getInfo, refreshToken } from '@/api/upms/user'
import { getShop } from '@/api/goods/shop'
import {
  setToken,
  removeToken,
  getUuid
} from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { getStore, setStore } from '@/store/store'

const user = {
  namespaced: true,
  state: {
    access_token: getStore({ name: 'access_token' }),
    refreshToken: '',
    name: '',
    avatar: '',
    userId: '',
    phone: '',
    deviceId: '',
    shopId: ''
  },
  mutations: {
    SET_SHOP: (state, id) => {
      state.shopId = id
      localStorage.setItem('shopId', id)
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      if (avatar) {
        state.avatar = avatar
      }
    },
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    },
    SET_EXPIRES_IN: (state, expires_in) => {
      state.expires_in = expires_in
      setStore({
        name: 'expires_in',
        content: expires_in,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    },
    SET_DEVICE_ID: (state, id) => {
      state.deviceId = id
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
      setStore({
        name: 'menu',
        content: state.menu,
        type: 'session'
      })
    },
    SET_MENU_ALL: (state, menuAll) => {
      state.menuAll = menuAll
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }
      state.permissions = list
    },
    SET_USERID: (state, id) => {
      if (id) {
        state.userId = id
      }
    },
    SET_PHONE: (state, p) => {
      if (p) {
        state.phone = p
      }
    }
    // SET_ROLES: (state, roles) => {
    //   state.roles = roles
    // }
  },
  actions: {
    // 刷新token
    RefreshToken({ commit, state }) {
      return new Promise((res, rej) => {
        refreshToken(state.refresh_token)
          .then(response => {
            const data = response.data
            commit('SET_ACCESS_TOKEN', data.access_token)
            commit('SET_REFRESH_TOKEN', data.refresh_token)
            commit('SET_EXPIRES_IN', data.expires_in)
            res(data.expires_in)
          })
          .catch(e => {
            rej(e)
          })
      })
    },
    // user login
    login({ commit }, userInfo) {
      const uuid = getUuid()
      const { username, password, authcode } = userInfo
      return new Promise((resolve, reject) => {
        commit('SET_DEVICE_ID', uuid)
        login({
          username: username.trim(),
          password: password,
          grant_type: 'image_code',
          imageCode: authcode,
          deviceId: uuid,
          scope: '1',
          client_id: 'cmanager',
          client_secret: 'xx',
          systemId: 1
        })
          .then(response => {
            const data = response.data
            commit('SET_ACCESS_TOKEN', data.access_token)
            commit('SET_REFRESH_TOKEN', data.refresh_token)
            commit('SET_EXPIRES_IN', data.expires_in)
            // setToken(data.access_token);
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    getInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(response => {
            const { data } = response

            if (!data) {
              reject('获取用户信息失败，请重新登陆！')
            }
            const { username, headImgUrl, id, phone } = data

            commit('SET_NAME', username)
            commit('SET_AVATAR', headImgUrl)
            commit('SET_USERID', id)
            commit('SET_PHONE', phone)
            // commit('SET_AVATAR', avatar)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 获取店铺信息
    getShop({ commit, state }) {
      return new Promise((resolve, reject) => {
        getShop()
          .then(response => {
            const { data } = response

            if (!data) {
              reject('获取店铺信息失败，请重新登陆！')
            }
            const { id } = data
            commit('SET_SHOP', id)
            resolve(data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // user logout
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_NAME', '')
        commit('SET_ACCESS_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
        // logout({ access_token: state.token }).then(() => {
        //   commit('SET_TOKEN', '')
        //   removeToken()
        //   resetRouter()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // getRoles({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getRoles({ userId: 1 }).then(response => {
    //       const { data } = response

    //       if (!data) {
    //         reject('Verification failed, please Login again.')
    //       }
    //       commit('SET_ROLES', data)
    //       commit('SET_NAME', 'admin')
    //       resolve(data)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // remove token
    resetToken({ commit }) {
      return new Promise(resolve => {
        commit('SET_ACCESS_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // dynamically modify permissions
    changeRoles({ commit, dispatch }, role) {
      return new Promise(async resolve => {
        const token = role + '-token'

        commit('SET_ACCESS_TOKEN', token)
        setToken(token)

        const { roles } = await dispatch('getInfo')

        resetRouter()

        // generate accessible routes map based on roles
        const accessRoutes = await dispatch(
          'permission/generateRoutes',
          roles,
          {
            root: true
          }
        )

        // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      })
    }
  }
}

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// };
export default user
