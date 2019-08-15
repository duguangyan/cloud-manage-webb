import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/upms/oauth/token',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getRoles(query) {
  return request({
    url: '/upms/resource/getResourceMenuById',
    method: 'get',
    params: query
  })
}
