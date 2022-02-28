import xsRequest from './index'

export function getSongDetail(ids){
  return xsRequest.get("/song/detail",{
    ids
  })
}

export function getSongLyric(id){
  return xsRequest.get("/lyric",{
    id
  })
}