import request from '@/utils/request'

// 获取入驻信息列表
export function getApproveList(query) {
  return request({
    url: '/ws/shop/apply/listPage',
    method: 'get',
    params: query,
    pf: true
  })
}

// 入驻审核
export function checkApprove(data) {
  return request({
    url: '/ws/shop/apply/checkUp',
    method: 'post',
    data
  })
}

// 根据ID获取入驻详情
export function getApproveDetail(query) {
  return request({
    url: '/ws/shop/apply/getById',
    method: 'get',
    params: query,
    pf: true
  })
}