import request from '@/utils/request'

// 获取栏目列表
export function getManageList(data) {
  return request({
    url: '/act/goodList/getList',
    method: 'post',
    data
  })
}

// 根据Id获取栏目详情列表
export function getManageDetailList(data) {
  return request({
    url: '/act/goodListDetail/listPage',
    method: 'post',
    data
  })
}

// 增加商品到商品目录
export function addManageDetail(data) {
  return request({
    url: '/act/goodListDetail/insertAll',
    method: 'post',
    data
  })
}

// 更新商品目录
export function updateManageDetail(data) {
  return request({
    url: '/act/goodListDetail/updateAll',
    method: 'post',
    data
  })
}

// 移除商品目录商品
export function deleteManageDetail(data) {
  return request({
    url: '/act/goodListDetail/delete',
    method: 'post',
    data
  })
}

