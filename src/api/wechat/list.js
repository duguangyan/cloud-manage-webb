import request from '@/utils/request'

// 获取微信链接
export function getWechatLink(query) {
  return request({
    url: '/upms/account/link',
    method: 'get',
    params: query
  })
}

// 获取微信账号列表
export function getWechatList(data) {
  return request({
    url: '/wechat/account/listPage',
    method: 'post',
    data
  })
}

// 新增微信账号
export function addWechat(data) {
  return request({
    url: '/wechat/account/insert',
    method: 'post',
    data
  })
}

// 根据ID获取微信账号
export function getWechatById(data) {
  return request({
    url: '/wechat/account/getById',
    method: 'post',
    data
  })
}

// 更新微信账号
export function updateWechat(data) {
  return request({
    url: '/wechat/account/update',
    method: 'post',
    data
  })
}

// 删除微信账号
export function deleteWechat(data) {
  return request({
    url: '/wechat/account/delete',
    method: 'post',
    data
  })
}
