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

// 根据日期查询当天统计数据
export function getStatDataByDay(query) {
  return request({
    url: '/analyse/websiteStat/getStatDataByDay',
    method: 'get',
    params: query
  })
}