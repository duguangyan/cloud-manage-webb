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

// 订单详情
export function getOrderDetail(query) {
  return request({
    url: '/order/order/orderInfo',
    method: 'get',
    params: query,
    type: 'local'
  })
}

// 获取快递公司
export function getExpress(data) {
  return request({
    url: '/order/courier/listPage',
    method: 'post',
    type: 'local',
    data
  })
}

// 快递发货
export function sendExpress(data) {
  return request({
    url: '/order/order/delivery',
    method: 'post',
    type: 'local',
    data
  })
}

// 编辑快递
export function editExpress(data) {
  return request({
    url: '/order/order/updateCourierNum',
    method: 'post',
    type: 'local',
    data
  })
}