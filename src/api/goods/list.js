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

// 新增计量单位
export function insetUnitList(data) {
  return request({
    url: '/goods/categoryUnit/insert',
    method: 'post',
    data
  })
}

// 更新计量单位
export function updateUnitList(data) {
  return request({
    url: '/goods/categoryUnit/update',
    method: 'post',
    data
  })
}

// 删除计量单位
export function deleteUnitList(query) {
  return request({
    url: '/goods/categoryUnit/delete',
    method: 'get',
    params: query
  })
}

// 根据分类获取规格
export function getSpeList(query) {
  return request({
    url: '/goods/categorySpec/getByCategoryId',
    method: 'get',
    params: query
  })
}

// 新增规格
export function insetSpeList(data) {
  return request({
    url: '/goods/categorySpec/insert',
    method: 'post',
    data
  })
}

// 更新规格
export function updateSpeList(data) {
  return request({
    url: '/goods/categorySpec/update',
    method: 'post',
    data
  })
}

// 删除规格
export function deleteSpeList(query) {
  return request({
    url: '/goods/categorySpec/delete',
    method: 'get',
    params: query
  })
}

// 根据分类获取属性
export function getPropList(query) {
  return request({
    url: '/goods/categoryAttr/getByCategoryId',
    method: 'get',
    params: query
  })
}

// 新增属性
export function insetPropList(data) {
  return request({
    url: '/goods/categorySpec/insert',
    method: 'post',
    data
  })
}

// 更新属性
export function updatePropList(data) {
  return request({
    url: '/goods/categorySpec/insert',
    method: 'post',
    data
  })
}

// 删除属性
export function deletePropList(query) {
  return request({
    url: '/goods/categorySpec/delete',
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
