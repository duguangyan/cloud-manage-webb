import request from '@/utils/request'

export function getRoutes(query) {
  return request({
    url: '/upms/resource/getResourceTree',
    method: 'get',
    params: query
  })
}

export function getRoles(query) {
  return request({
    url: '/upms/role/getRoleResources',
    method: 'get',
    params: query
  })
}

export function addRole(data) {
  return request({
    url: '/upms/role/insert',
    method: 'post',
    data
  })
}

export function getRoleResourceTree(query) {
  return request({
    url: '/upms/resource/getRoleResourceTree',
    method: 'get',
    params: query
  })
}

export function addResource(data) {
  return request({
    url: '/upms/role/addResource',
    method: 'post',
    data
  })
}

export function deleteResource(query) {
  return request({
    url: '/upms/role/delResource',
    method: 'get',
    params: query
  })
}

export function addResourceBatch(data) {
  return request({
    url: '/upms/role/addResourceBatch',
    method: 'post',
    data
  })
}

export function deleteRole(query) {
  return request({
    url: '/upms/role/delete',
    method: 'get',
    params: query
  })
}

export function getRoleList(query) {
  return request({
    url: '/upms/role/listPage',
    method: 'get',
    params: query
  })
}

export function updateRole(data) {
  return request({
    url: '/upms/role/update',
    method: 'post',
    data
  })
}

export function getRoleResources(query) {
  return request({
    url: '/upms/role/getRoleResources',
    method: 'get',
    params: query
  })
}

// 查询拥有该角色的用户列表
export function getUserByRole(query) {
  return request({
    url: '/upms/role/getUserByRole',
    method: 'get',
    params: query
  })
}

