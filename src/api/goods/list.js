import request from '@/utils/request'

// 获取商品列表
export function getList(query) {
  return request({
    url: '/goods/goods/pageGoods',
    method: 'get',
    params: query
  })
}

// 根据ID获取商品列表
export function getGoodsByIds(query) {
  return request({
    url: '/goods/goods/getGoodsByIds',
    method: 'get',
    params: query
  })
}

// 批量上下架商品
export function handlerGoods(query) {
  return request({
    url: '/goods/goods/handlerGoods',
    method: 'get',
    params: query
  })
}
