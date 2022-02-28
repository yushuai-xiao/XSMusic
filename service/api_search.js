import xsRequest from './index'

export function getSearchHot(){
  return xsRequest.get("/search/hot")
}

export function getSearchSuggest(keywords){
  return xsRequest.get("/search/suggest",{
    keywords,
    type:"mobile"
  })
}

export function getSearchResult(keywords){
  return xsRequest.get("/search",{
    keywords
  })
}