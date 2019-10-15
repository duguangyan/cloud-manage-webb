import request from '@/utils/request'

// 获取商品统计列表
export function getAnalyseList(query) {
  return request({
    url: '/analyse/goodsStat/listPage',
    method: 'get',
    params: query
  })
}

export function getAnaData(query) {
  return request({
    url: '/analyse/websiteStat/getByDay',
    method: 'get',
    params: query
  })
}
