import request from '@/utils/request'

// 分页查询字典
export function getDict(query) {
  return request({
    url: '/upms/dic/listPage',
    method: 'get',
    params: query
  })
}

// id查询字典
export function getDictById(query) {
  return request({
    url: '/upms/dic/getFirstDicList',
    method: 'get',
    params: query
  })
}

// pid查询字典
export function getDictByPid(query) {
  return request({
    url: '/upms/dic/getListByPid',
    method: 'get',
    params: query
  })
}

// 修改字典
export function updateDict(data) {
  return request({
    url: '/upms/dic/update',
    method: 'post',
    data
  })
}

// 添加字典
export function addDict(data) {
  return request({
    url: '/upms/dic/insert',
    method: 'post',
    data
  })
}

// 删除字典
export function deleteDict(query) {
  return request({
    url: '/upms/dic/delete',
    method: 'get',
    params: query
  })
}
