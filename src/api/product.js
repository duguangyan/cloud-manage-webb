import request from '@/utils/request'

// 获取商品分类树
export function getProductTree() {
  return request({
    url: '/goods/category/getCategoryTreeNode',
    method: 'get'
  })
}

// 插入一级分类
export function insertRootProduct(data) {
  return request({
    url: '/goods/category/insertRoot',
    method: 'post',
    data
  })
}

// 插入分类
export function insertProduct(data) {
  return request({
    url: '/goods/category/insert',
    method: 'post',
    data
  })
}

// 修改分类
export function updateProduct(data) {
  return request({
    url: '/goods/category/update',
    method: 'post',
    data
  })
}

// 删除分类
export function deleteProduct(data) {
  return request({
    url: '/goods/category/delete',
    method: 'post',
    data
  })
}

// 获取该分类下商品数量
export function getProductNum(query) {
  return request({
    url: '/goods/category/getGoodsNum',
    method: 'get',
    params: query
  })
}

// 搜索分类
export function searchProduct(query) {
  return request({
    url: '/goods/category/search',
    method: 'get',
    params: query
  })
}

