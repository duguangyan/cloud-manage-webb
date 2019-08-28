import request from '@/utils/request'

module.exports = {
  insertAd(params) {
    return request({
      url: '/upms/area/insert',
      method: 'post',
      params
    })
  },
  getAd(params) {
    return request({
      url: '/upms/area/getChildrenByPId',
      params
    })
  },
  editAd(params) {
    return request({
      url: '/upms/area/update',
      method: 'post',
      params
    })
  },
  delAd(params) {
    return request({
      url: '/upms/area/delete',
      method: 'post',
      params
    })
  }
}
