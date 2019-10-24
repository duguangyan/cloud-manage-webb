import request from '@/utils/request'

// 新增客户端详情信息
export function addClient(data) {
  return request({
    url: '/oauth/clientDetails/insert',
    method: 'post',
    data
  })
}

// 删除客户端详情信息
export function deleteClient(query) {
  return request({
    url: '/oauth/clientDetails/delete',
    method: 'get',
    params: query
  })
}

// 修改客户端详情信息
export function updateClient(data) {
  return request({
    url: '/oauth/clientDetails/update',
    method: 'post',
    data
  })
}

// 获取客户端详情分页列表
export function getClientList(data) {
  return request({
    url: '/oauth/clientDetails/listPage',
    method: 'post',
    data
  })
}

// 根据ID获取客户端详情分页列表
export function getClientById(query) {
  return request({
    url: '/oauth/clientDetails/getById',
    method: 'get',
    params: query
  })
}
