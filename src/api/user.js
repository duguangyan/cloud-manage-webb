import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/upms/login/pwd',
    method: 'post',
    headers: { 'Authorization': 'Basic cwap: xx' },
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
