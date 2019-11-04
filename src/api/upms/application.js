import request from '@/utils/request'

// 分页查询应用升级列表
export function getAppList(query) {
  return request({
    url: '/upms/appUpdate/selectApp',
    method: 'post',
    params: query
  })
}

// 根据id查询应用升级信息
export function getAppById(query) {
  return request({
    url: '/upms/appUpdate/getById',
    method: 'get',
    params: query
  })
}

// 新增应用升级
export function addApp(data) {
  return request({
    url: '/upms/appUpdate/insert',
    method: 'post',
    data
  })
}

// 删除应用升级
export function deleteApp(data) {
  return request({
    url: '/upms/appUpdate/delete',
    method: 'post',
    data
  })
}

// 修改应用升级
export function updateApp(data) {
  return request({
    url: '/upms/appUpdate/update',
    method: 'post',
    data
  })
}

// 上传文件
export function uploadAppPackage(data) {
  return request({
    url: '/upms/appUpdate/uploadAppPackage',
    method: 'post',
    type: 'upload',
    data
  })
}

