import request from '@/utils/request'

// 分页获取用户资源列表
export function getResource(query) {
  return request({
    url: '/upms/resource/listPage',
    method: 'get',
    params: query
  })
}

// 查询一级资源
export function getMeanFirstRec(query) {
  return request({
    url: '/upms/resource/getFirstResource',
    method: 'get',
    params: query
  })
}

// 根据pid获取资源
export function getMeanByPid(query) {
  return request({
    url: '/upms/resource/getByParentId',
    method: 'get',
    params: query
  })
}

// 删除资源
export function resourceDelete(query) {
  return request({
    url: '/upms/resource/delete',
    method: 'get',
    params: query
  })
}

// 新增资源
export function addResource(data) {
  return request({
    url: '/upms/resource/insert',
    method: 'post',
    data
  })
}

// 修改资源
export function updateResource(data) {
  return request({
    url: '/upms/resource/update',
    method: 'post',
    data
  })
}

// 根据id获取所有用户拥有的按钮权限
export function getUserBtnByPId(query) {
  return request({
    url: '/upms/resource/getUserBtnByParentId',
    method: 'get',
    params: query
  })
}

