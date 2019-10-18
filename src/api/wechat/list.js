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

// 根据父id创建自定义菜单
export function createMenuById(query) {
  return request({
    url: '/wechat/menu/createMenu',
    method: 'get',
    params: query
  })
}

// (后台)自定义菜单新增
export function addMenu(data) {
  return request({
    url: '/wechat/menu/insert',
    method: 'post',
    data
  })
}

// (后台)自定义菜单更新
export function updateMenu(data) {
  return request({
    url: '/wechat/menu/update',
    method: 'post',
    data
  })
}

// 根据微信账号id获取菜单列表
export function getMenuListById(query) {
  return request({
    url: '/wechat/menu/listByAccountId',
    method: 'get',
    params: query
  })
}

// 判断菜单type是否有资源
export function checkMenu(query) {
  return request({
    url: '/wechat/menu/checkById',
    method: 'get',
    params: query
  })
}

// (后台)根据id删除菜单信息
export function deleteMenu(data) {
  return request({
    url: '/wechat/menu/deleteById',
    method: 'post',
    data
  })
}

// 根据id获取菜单信息
export function getMenuById(query) {
  return request({
    url: '/wechat/menu/getById',
    method: 'get',
    params: query
  })
}

// 根据id清空数据
export function clearMenu(query) {
  return request({
    url: '/wechat/menu/clearById',
    method: 'get',
    params: query
  })
}
