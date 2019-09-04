import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/oauth/oauth/token',
    method: 'post',
    data
  })
}

export function getInfo(query) {
  return request({
    url: '/upms/user/getUserInfo',
    method: 'get',
    params: query
  })
}

export function logout(data) {
  return request({
    url: '/oauth/deleteToken',
    method: 'post',
    data
  })
}

export function getRoles(query) {
  return request({
    url: '/upms/resource/getUserResourceTree',
    method: 'get',
    params: query
  })
}

