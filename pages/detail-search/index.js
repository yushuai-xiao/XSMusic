// pages/detail-search/index.js
import {getSearchHot , getSearchSuggest ,getSearchResult} from "../../service/api_search"
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'
import queryRect from '../../utils/query-rect'

import {playerStore} from '../../store/index'

const debounceGetSearchSuggest = debounce(getSearchSuggest,300)
Page({

  /**
   * 页面的初始数据
   */
  data: {
   hotKeywords:[],
   suggestSongs:[],
   resultSongs:[],
   suggestSongsNodes:[],
   searchValue : "",
   scrollHeight:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取页面的数据
    this.getPageData()
  },
  onReady:function(){
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    queryRect(".search").then(res => {
      const searchHeight = res[0].height
      const scrollHeight = screenHeight - statusBarHeight - navBarHeight - searchHeight
      this.setData({scrollHeight})
    })
  },
  // 网络请求
  getPageData:function(){
    getSearchHot().then(res => {
      this.setData({hotKeywords:res.result.hots})
    })
  },
  //事件处理
  handleSearchChange:function(event){
    //1.获取输入的关键字
    const searchValue = event.detail
    //2.保存关键字
    this.setData({searchValue})
    this.setData({resultSongs:[]})
    //3.判断关系字为空字符串的处理逻辑
    if(!searchValue.length){
      this.setData({suggestSongs:[]})
      this.setData({ resultSongs: [] })
      debounceGetSearchSuggest.cancel()
      return 
    }

    //4.根据关键字进行搜索
    debounceGetSearchSuggest(searchValue).then(res => {
      // this.setData({suggestSongs:res.result.allMatch})
      //1.获取建议的关键字歌曲
      const suggestSongs = res.result.allMatch
      this.setData({suggestSongs})
      if (!suggestSongs) return
      // 2.转成node节点
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for (const keyword of suggestKeywords){
        const nodes = stringToNodes(keyword,searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({suggestSongsNodes})
    })
  },
  handleSearchAction:function(){
    const searchValue = this.data.searchValue
    getSearchResult(searchValue).then(res => {
      this.setData({resultSongs:res.result.songs})
    })
  },
  handleKeywordItemClick:function(event){
    //1.获取点击的关键字
    const keyword = event.currentTarget.dataset.keyword

    //2.将关键字设置到searchValue中
    this.setData({searchValue:keyword})

    //3.发送网络请求
    this.handleSearchAction()
  },
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs",this.data.resultSongs)
    playerStore.setState("playListIndex",index)
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  }

})