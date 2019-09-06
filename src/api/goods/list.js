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

// 根据分类获取规格模板
export function getByCategoryId(query) {
  return request({
    url: '/goods/categoryAttr/getByCategoryId',
    method: 'get',
    params: query
  })
}

// 根据分类获取规格
export function getUnit(query) {
  return request({
    url: '/goods/categorySpec/getByCategoryId',
    method: 'get',
    params: query
  })
}

// 根据分类获取计量单位
export function getUnitList(query) {
  return request({
    url: '/goods/categoryUnit/getCategoryUnitList',
    method: 'get',
    params: query
  })
}

// 发布新商品
export function saveGoods(data) {
  return request({
    url: '/goods/goods/saveGoods',
    method: 'post',
    type: 'json',
    data
  })
}
