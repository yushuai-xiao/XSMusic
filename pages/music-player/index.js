// pages/music-player/index.js
import {
  audioContext
} from '../../store/index'
import {
  playerStore
} from '../../store/index'

const playModeNames = ["order", "repeat", "random"]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    currentSong: {},
    durationTime: 0,
    currentTime: 0,

    lyricInfos: [],
    currentLyricIndex: 0,
    currentLyricText: "",

    //是否显示歌词
    isMusicLyric: true,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0,

    isPlaying: true,
    playingName: "resume",

    playModeIndex: 0,
    playModeName: "order",
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1.获取传入的id
    const id = options.id
    this.setData({
      id
    })

    // 2.根据id获取歌曲信息
    // this.getPageData(id)
    this.setupPlayerStoreListener()

    //3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio = globalData.deviceRadio
    // console.log(deviceRadio)
    const contentHeight = screenHeight - statusBarHeight - navBarHeight

    this.setData({
      contentHeight,
      isMusicLyric: deviceRadio >= 2
    })

  },

  // ========================事件处理====================
  handleSwiperChange: function (event) {
    const current = event.detail.current
    this.setData({
      currentPage: current
    })
  },


  //拖动过程中触发的事件
  handleSliderChanging: function (event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({
      isSliderChanging: true,
      currentTime 
    })
  },
  //后退按钮监听
  handleBackBtnClick: function () {
    wx.navigateBack()
  },

  //完成一次拖动后触发的事件
  handleSlideChange: function (event) {
    //1.获取slider变化的值
    const value = event.detail.value

    //2.计算需要播放的currentTime
    const currentTime = this.data.durationTime * value / 100

    //3.设置content播放currentTime位置的音乐
    // audioContext.pause()
    audioContext.seek(currentTime / 1000)

    //4.记录最新的sliderValue,并且将isSliderChanging设置为false
    this.setData({
      sliderValue: value,
      isSliderChanging: false
    })
  },

  handleModeBtnClick:function(){
    // 计算最新的playModelIndex
    let playModeIndex = this.data.playModeIndex + 1
    if(playModeIndex === 3){
      playModeIndex = 0
    }

    //设置playStore中的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex)
  },
  handlePlayBtnClick: function() {
    playerStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
  },
  handlePrevBtnClick:function(){
    playerStore.dispatch("changeNewMusicAction", false)
  },
  handleNextBtnClick:function(){
    playerStore.dispatch("changeNewMusicAction")
  },
  //=============================数据监听========================
  setupPlayerStoreListener: function () {
    //1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({
        currentSong
      })
      if (durationTime) this.setData({
        durationTime
      })
      if (lyricInfos) this.setData({
        lyricInfos
      })
    })

    //2.监听时间改变
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricText,
      currentLyricIndex
    }) => {
      if (currentTime) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({
          sliderValue,
          currentTime
        })
      }
      if (currentLyricIndex) {
        this.setData({
          currentLyricIndex,
          lyricScrollTop: currentLyricIndex * 35
        })
      }
      if (currentLyricText){
        this.setData({
          currentLyricText
        })
      }
    })

    //3.监听播放模式相关数据
    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({ 
          playModeIndex, 
          playModeName: playModeNames[playModeIndex] 
        })
      }

      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying,
          playingName: isPlaying ? "resume": "pause" 
        })
      }
    })
  }
})