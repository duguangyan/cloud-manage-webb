import request from '@/utils/request'

export function getRoutes(query) {
  return request({
    url: '/upms/resource/getResourceById',
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

// export function updateRole(id, data) {
//   return request({
//     url: `/role/${id}`,
//     method: 'put',
//     data
//   })
// }

// export function deleteRole(id) {
//   return request({
//     url: `/role/${id}`,
//     method: 'delete'
//   })
// }

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
