import xsRequest from './index'

export function getTopMV(offset,limit = 10){
  return xsRequest.get('/top/mv',{
    offset,
    limit
  })
}

/**
 * 请求MV的播放地址
 * @param {number} id MV的id
 */
export function getMVURL(id){
  return xsRequest.get("/mv/url",{
    id
  })
}

/**
 * 请求MV的详情
 * @param {number} mvid MV的id
 */
export function getMVDetail(mvid){
  return xsRequest.get("/mv/detail",{
    mvid
  })
}

/**
 * 请求MV相关的视频
 * @param {number} mid MV的id
 */

 export function getRelatedVideo(id){
   return xsRequest.get("/related/allvideo",{
    id
   })
 }