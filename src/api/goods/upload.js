import request from '@/utils/request'

// 上传文件
export function fileUpload(data) {
  return request({
    url: '/goods/goodImg/fileUpload',
    method: 'post',
    type: 'upload',
    data
  })
}

// 删除文件
export function fileDelete(data) {
  return request({
    url: '/goods/goodImg/delfile',
    method: 'post',
    data
  })
}
