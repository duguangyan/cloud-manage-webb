import request from '@/utils/request';

export function login(data) {
  return request({
    url: '/oauth/oauth/token',
    method: 'post',
    data
  })
}

export const refreshToken = refresh_token => {
  const grant_type = 'refresh_token'
  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      Authorization: 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { refresh_token, grant_type, scope }
  });
};

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
