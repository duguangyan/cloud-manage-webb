import request from '@/utils/request'

// 分页获取用户列表
export function getUserList(query) {
  return request({
    url: '/upms/user/listPage',
    method: 'get',
    params: query
  })
}

// 根据用户名获取用户
export function getByUsername(data) {
  return request({
    url: '/upms/user/getByUsername',
    method: 'post',
    data
  })
}

// 根据手机号码获取用户
export function getByPhone(query) {
  return request({
    url: '/upms/user/getByPhone',
    method: 'get',
    params: query
  })
}

// 删除用户
export function userDelete(query) {
  return request({
    url: '/upms/user/delete',
    method: 'get',
    params: query
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/upms/user/insert',
    method: 'post',
    data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/upms/user/update',
    method: 'post',
    data
  })
}

