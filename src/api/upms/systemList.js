import request from '@/utils/request'

export function getSystem(query) {
  return request({
    url: '/upms/system/listPage',
    method: 'get',
    params: query
  })
}

export function updateSystem(data) {
  return request({
    url: '/upms/system/update',
    method: 'post',
    data
  })
}

export function deleteSystem(query) {
  return request({
    url: '/upms/system/delete',
    method: 'get',
    params: query
  })
}

export function addSystem(data) {
  return request({
    url: '/upms/system/insert',
    method: 'post',
    data
  })
}