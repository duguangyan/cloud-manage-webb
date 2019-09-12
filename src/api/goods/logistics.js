import request from '@/utils/request'

// 获取商品列表
export function getFreight(query) {
  return request({
    url: '/goods/postSolution/getList',
    method: 'get',
    params: query
  })
}
