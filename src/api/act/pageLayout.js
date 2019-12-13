import request from '@/utils/request'

// 新增数据
export function insertPage(data) {
  return request({
    url: '/ws/act/pageLayout/insert',
    method: 'post',
    data
  })
}

// 更新数据
export function updatePage(data) {
  return request({
    url: '/ws/act/pageLayout/update',
    method: 'post',
    data
  })
}

// 根据父ID获取子集
export function getPageByPid(query) {
  return request({
    url: '/ws/act/pageLayout/getByParentId',
    method: 'get',
    params: query
  })
}

// 根据ID获取对象
export function getPageItemByid(query) {
  return request({
    url: '/ws/act/pageLayout/getById',
    method: 'get',
    params: query
  })
}

// 根据ID删除数据
export function deletePageByid(query) {
  return request({
    url: '/ws/act/pageLayout/delete',
    method: 'get',
    params: query
  })
}

// 根据父级ID获取页面组件List
export function getPageListByPid(query) {
  return request({
    url: '/ws/act/pageLayout/getListByParentId',
    method: 'get',
    params: query
  })
}

// 获取配置树
export function getPageLayoutTree(query) {
  return request({
    url: '/ws/act/pageLayout/getPageLayoutTree',
    method: 'get',
    params: query
  })
}


