import request from '@/utils/request'

// 获取商品统计列表
export function getAnalyseList(query) {
  return request({
    url: '/analyse/goodsStat/listPage',
    method: 'get',
    params: query
  })
}

