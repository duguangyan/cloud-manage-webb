import request from '@/utils/request'

// 订单列表
export function getOrderList(query) {
  return request({
    url: '/order/order/pageSaleOrder',
    method: 'get',
    params: query
  })
}

// 订单详情
export function getOrderDetail(query) {
  return request({
    url: '/order/order/orderInfo',
    method: 'get',
    params: query
  })
}

// 导出订单
export function exportOrder(query) {
  return request({
    url: '/order/order/expSaleOrder',
    method: 'get',
    params: query
  })
}

