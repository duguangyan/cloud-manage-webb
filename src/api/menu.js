import request from '@/utils/request'

// 分页获取用户资源列表
export function getResource(query) {
  return request({
    url: '/upms/resource/listPage',
    method: 'get',
    params: query
  })
}

// 根据用户名获取用户
// export function getByUsername(data) {
//   return request({
//     url: '/upms/user/getByUsername',
//     method: 'post',
//     data
//   })
// }

// 根据手机号码获取用户
// export function getByPhone(query) {
//   return request({
//     url: '/upms/user/getByPhone',
//     method: 'get',
//     params: query
//   })
// }

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

