import request from '@/utils/request';

module.exports = {
  insertAd(params) {
    return request({
      url: '/upms/area/insert',
      method: 'post',
      params
    });
  },
  getAd(params) {
    return request({
      url: '/upms/area/getChildrenByPId',
      params
    });
  },
}
