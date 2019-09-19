/**
 * 邮费模块
 */

import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/goods/postSolution/getList',
    method: 'get',
    params
  })
}

export function copyModule(params) {
  return request({
    url: '/goods/postSolution/copyPostSolution',
    method: 'get',
    params
  })
}

export function getDetail(params) {
  return request({
    url: '/goods/postSolution/getById',
    method: 'get',
    params
  })
}

export function doDelete(params) {
  return request({
    url: '/goods/postSolution/delete',
    method: 'get',
    type: 'json',
    params
  })
}

export function doUpdate(data) {
  return request({
    url: '/goods/postSolution/update',
    method: 'post',
    type: 'json',
    // debug: 1,
    data
  })
}

export function doInsert(data) {
  return request({
    url: '/goods/postSolution/insert',
    method: 'post',
    type: 'json',
    // debug: 1,
    data
  })
}
