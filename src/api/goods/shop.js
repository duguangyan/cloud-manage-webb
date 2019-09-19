import request from '@/utils/request'

export function getShop(data) {
  return request({
    url: '/goods/shop/getShop',
    method: 'get',
    data
  })
}
