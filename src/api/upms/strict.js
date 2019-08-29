import request from '@/utils/request'

export function insertAd(params) {
  return request({
    url: '/upms/area/insert',
    method: 'post',
    params
  })
}

export function getAd(params) {
  return request({
    url: '/upms/area/getChildrenByPId',
    params
  })
}

export function editAd(params) {
  return request({
    url: '/upms/area/update',
    method: 'post',
    params
  })
}

export function delAd(params) {
  return request({
    url: '/upms/area/delete',
    method: 'post',
    params
  })
}
