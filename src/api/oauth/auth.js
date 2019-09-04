import request from '@/utils/request'

// 获取验证码
export function getAuthCode(query) {
  return request({
    url: '/oauth/validate/code/image',
    method: 'get',
    params: query
  })
}
