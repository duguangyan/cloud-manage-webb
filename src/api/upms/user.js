import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/oauth/oauth/token',
    method: 'post',
    data
  })
}

export const refreshToken = reToken => {
  return request({
    url: '/oauth/oauth/token',
    headers: {
      isToken: false,
      Authorization: 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    data: {
      refresh_token: reToken,
      grant_type: 'refresh_token',
      scope: 1,
      client_id: 'cmanager',
      client_secret: 'xx'
    }
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

export function updatePassword(data) {
  return request({
    url: '/upms/user/passwordModify',
    method: 'post',
    data
  })
}
