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

export function doDelete(data) {
  return request({
    url: '/goods/postSolution/delete',
    method: 'post',
    type: 'json',
    data
  })
}

export function doUpdate(data) {
  return request({
    url: '/goods/postSolution/update',
    method: 'post',
    type: 'json',
    data
  })
}

export function doInsert(data) {
  return request({
    url: '/goods/postSolution/insert',
    method: 'post',
    type: 'json',
    data
  })
}
