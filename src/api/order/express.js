import request from '@/utils/request'

// 获取快递公司
export function getExpress(data) {
  return request({
    url: '/order/courier/listPage',
    method: 'post',
    data
  })
}

// 快递发货
export function sendExpress(data) {
  return request({
    url: '/order/order/delivery',
    method: 'post',
    data
  })
}

// 编辑快递
export function editExpress(data) {
  return request({
    url: '/order/order/updateCourierNum',
    method: 'post',
    data
  })
}
