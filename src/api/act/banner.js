import request from '@/utils/request'

// 新增广告位
export function addBanner(data) {
  return request({
    url: '/act/adPosition/insert',
    method: 'post',
    data
  })
}

// 删除广告位
export function deleteBanner(data) {
  return request({
    url: '/act/adPosition/delete',
    method: 'post',
    data
  })
}

// 修改广告位
export function updateBanner(data) {
  return request({
    url: '/act/adPosition/update',
    method: 'post',
    data
  })
}

// 查询广告位列表
export function getBannerList(data) {
  return request({
    url: '/act/adPosition/listPage',
    method: 'post',
    data
  })
}

// 新增广告
export function addAd(data) {
  return request({
    url: '/act/ad/insert',
    method: 'post',
    data
  })
}

// 删除广告
export function deleteAd(data) {
  return request({
    url: '/act/ad/delete',
    method: 'post',
    data
  })
}

// 修改广告
export function updateAd(data) {
  return request({
    url: '/act/ad/update',
    method: 'post',
    data
  })
}

// 查询广告
export function getAdList(data) {
  return request({
    url: '/act/ad/listPage',
    method: 'post',
    data
  })
}