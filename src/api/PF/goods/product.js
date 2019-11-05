import request from '@/utils/request'

// 获取商品分类树
export function getProductTree(query) {
  return request({
    url: '/ws/goods/category/getCategoryTreeNode',
    method: 'get',
    params: query
  })
}

// 插入一级分类
export function insertRootProduct(data) {
  return request({
    url: '/ws/goods/category/insertRoot',
    method: 'post',
    data
  })
}

// 插入分类
export function insertProduct(data) {
  return request({
    url: '/ws/goods/category/insert',
    method: 'post',
    data
  })
}

// 修改分类
export function updateProduct(data) {
  return request({
    url: '/ws/goods/category/update',
    method: 'post',
    data
  })
}

// 排序
export function moveProduct(query) {
  return request({
    url: '/ws/goods/category/move',
    method: 'get',
    params: query
  })
}

// 删除分类
export function deleteProduct(query) {
  return request({
    url: '/ws/goods/category/delete',
    method: 'get',
    params: query
  })
}

// 获取该分类下商品数量
export function getProductNum(query) {
  return request({
    url: '/ws/goods/category/getGoodsNum',
    method: 'get',
    params: query
  })
}

// 搜索分类
export function searchProduct(query) {
  return request({
    url: '/ws/goods/category/search',
    method: 'get',
    params: query
  })
}

