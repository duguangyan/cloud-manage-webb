import request from '@/utils/request'

// 获取验证码
export function getOrderList(query) {
  return request({
    url: '/order/order/pageSaleOrder',
    method: 'get',
    params: query,
    type: 'local'
  })
}
