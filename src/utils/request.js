import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import QS from 'qs'

var target = '/api'
const baseURL = process.env.NODE_ENV === 'development' ? target : '/'
// create an axios instance
const service = axios.create({
  baseURL,
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 将请求类型改为普通的表单类型
    if (config.type !== 'json') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      config.headers['Content-Type'] = 'application/json'
    } 
    if (config.method === 'post') {
      if (config.type === 'upload') {
        config.headers['Content-Type'] = 'application/multipart/form-data'
      } else {
        if (config.type !== 'json') {
          config.data = QS.stringify({
            ...config.data
          })
        } else if (config.isBlob) {
          config.responseType = 'arraybuffer'
        }
      }
    }

    // do something before request is sent
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + store.getters.token
    } else {
      config.headers['Authorization'] = 'Basic Y21hbmFnZXI6eHg='
    }
    config.headers['user_id'] = store.getters.userId
    config.headers['client_id'] = 'cmanager'
    config.headers['device_id'] = store.getters.deviceId
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== '1000') {
      if (res.access_token || !res.code) {
        return response
      }
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm(
          'You have been logged out, you can cancel to stay on this page, or log in again',
          'Confirm logout',
          {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('user/resetToken').then(() => {
            // location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    Message({
      message: error.response.data.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
