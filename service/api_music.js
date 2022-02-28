import xsRequest from './index'

export function getBanners(){
  return xsRequest.get("/banner",{
    type:1
  })
}

export function getRankings(idx){
  return xsRequest.get("/top/list",{
    idx
  })
}
export function getSongMenuTags(){
  return xsRequest.get("/playlist/hot")
}
// cat -> categoty类别
export function getSongMenu(cat = "全部",limit=6,offset = 0){
  return xsRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}

/**
 * 歌单详情
 * @param {} id 歌单id 
 */
export function getSongMenuDetail(id){
  return xsRequest.get("/playlist/detail/dynamic",{
    id
  })
}