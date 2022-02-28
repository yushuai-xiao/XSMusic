// pages/detail-songs/index.js
import { getSongMenuDetail } from "../../service/api_music"
import { rankingStore ,playerStore} from '../../store/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:"",
    ranking:"",
    songInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({type})

    if(type === "menu"){
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({songInfo:res.playlist})
      })
    }else if(type ==="rank"){
      const ranking = options.ranking
      this.setData({ranking})

      //获取数据
      rankingStore.onState(ranking,this.getRankingDataHandler)
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   if(this.data.ranking){
     rankingStore.offState(this.data.ranking,this.getRankingDataHandler)
   }
  },
  getRankingDataHandler:function(res){
    this.setData({songInfo:res})
  },
  handleSongItemClick:function(event){
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs",this.data.songInfo.tracks)
    playerStore.setState("playListIndex",index)
  }
})