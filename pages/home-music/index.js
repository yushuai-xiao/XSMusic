// pages/home-music/index.js
import {rankingStore ,rankingMap, playerStore} from '../../store/index'

import {getBanners ,getSongMenu} from '../../service/api_music'
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"

const throttleQueryRect = throttle(queryRect,100,{leading: true, trailing: true})
// const throttleQueryRect = queryRect
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    swiperHeight:0,
    hotSongMenu:[],
    recommendSongMenu:[],
    recommendSongs:[],
    rankings:{0:{},2:{},3:{}},

    currentSong:{},
    isPlaying:false,
    playAnimState:"paused"

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取页面数据
    this.getPageData()

    //发起共享数据请求
    rankingStore.dispatch("getRankingDataAction")
    
    //从store获取共享数据
    this.setupPlayerStoreListener()
  },

  //网络请求
  getPageData:function(){
    getBanners().then(res => {
      // console.log(res.banners)
      this.setData({banners:res.banners})
    })

    getSongMenu().then(res => {
      this.setData({hotSongMenu:res.playlists})
    })

    getSongMenu("华语").then(res => {
      this.setData({recommendSongMenu:res.playlists})
    })
  },

  //事件处理
   //搜索框区域处理
  handleSearchClick:function(){
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  hanleSwiperImageLoaded:function(){
    //获取图片片的高度（如何 去获取某个组件的高度）
    throttleQueryRect(".swiper-image").then(res => {
      const rect = res[0]
      this.setData({swiperHeight:rect.height})
    })
  },
  //更多的点击事件处理
  handleMoreClick:function(){
    this.navigateToDetailSongsPage("hotRanking")
  },
  
  handleRankingItemClick:function(event){
    // console.log(event)
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },
  navigateToDetailSongsPage:function(rankingName){
    // console.log('更多点击')
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },
  //设置歌曲播放列表
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs",this.data.recommendSongs)
    playerStore.setState("playListIndex",index)
  },

  handlePlayBtnClick: function() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePlayBarClick:function(){
    wx.navigateTo({
      url: '/pages/music-player/index',
    })
  },
  // 卸载页面
  onUnload: function () {
    // rankingStore.offState("newRanking", this.getNewRankingHandler)
  },
  setupPlayerStoreListener:function(){
    // 1.排行榜监听
    rankingStore.onState("hotRanking",(res) => {
      if(!res.tracks) return
      const recommendSongs = res.tracks.slice(0,6)
      this.setData({recommendSongs:recommendSongs})
      // console.log(this.data.recommendSongs)
    })
    rankingStore.onState("newRanking",this.getRankingHandler(0))
    rankingStore.onState("originRanking",this.getRankingHandler(2))
    rankingStore.onState("upRanking",this.getRankingHandler(3))

    //2.播放器监听
    playerStore.onStates(["currentSong","isPlaying"],({
      currentSong,
      isPlaying
    }) => {
      if(currentSong) this.setData({currentSong})
      if(isPlaying !== undefined){
        this.setData({
          isPlaying,
          playAnimState: isPlaying ? "running": "paused" 
        })
      }
    })
  },
  getRankingHandler:function(idx){
    return (res) => {
      if(Object.keys(res).length ===0) return
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0,3)
      const rankingObj = {name,coverImgUrl,playCount,songList}

      const newRankings = {...this.data.rankings,[idx]:rankingObj}
      this.setData({rankings:newRankings})
    }
  }
})