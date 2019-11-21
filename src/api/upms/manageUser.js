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

// 根据用户id获取角色信息
export function getUserRoleInfo(query) {
  return request({
    url: '/upms/user/getUserRoleInfo',
    method: 'get',
    params: query
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

// 锁定用户
export function lockUser(query) {
  return request({
    url: '/upms/user/lock',
    method: 'get',
    params: query
  })
}

// 批量锁定用户
export function lockUsers(query) {
  return request({
    url: '/upms/user/lockBatch',
    method: 'get',
    params: query
  })
}

// 给用户添加多个角色
export function processUserRoleBatch(data) {
  return request({
    url: '/upms/user/processUserRoleBatch',
    method: 'post',
    data
  })
}

// 给用户添加一个角色
export function addUserRole(data) {
  return request({
    url: '/upms/user/addUserRole',
    method: 'post',
    type: 'json',
    data
  })
}

// 给用户删除一个角色
export function delUserRole(query) {
  return request({
    url: '/upms/user/delUserRole',
    method: 'get',
    params: query
  })
}
