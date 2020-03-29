// miniprogram/pages/diary/diary.js
const db = wx.cloud.database


Page({

  /**
   * 页面的初始数据
   */
  data: {
    diaries:[],
    newDiary:"添加了一条日记",
    diaryNums:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(this.getUserPicUrl(this._openid))
    var diarys = []
    const db=wx.cloud.database()
    let temp = db.collection("diary").orderBy('editTime', 'desc').get()
    //按时间获取日记列表
    Promise.resolve(temp).then(res=>{

      var diaryList=res.data
      console.log(diaryList)
      for(var index in diaryList){
        // console.log(diaryList[index].content.ops[0].insert)
        //日记信息数组
        var diary = [{
          id:diaryList[index]._id,
          userPicUrl: diaryList[index].userPicUrl,
          content: diaryList[index].content.ops[0].insert,
          editTime: diaryList[index].editTime
        }]
        console.log(diary)
        // that.data.diaries.push(diary)
        // console.log(that.diaries)
        diarys.push(diary)
        // that.setData({
        //   diaries:that.diaries.concat(diary)
        // })
        // diaries.push(diary)
        // console.log(diarys,"diarys"+index)
      }
      console.log(diarys)
      that.setData({
        diaries: diarys
      })
      console.log(that.data.diaries)
    })

    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
    

  },

  jump2Diary(){
    wx.navigateTo({
      url: '../diaryPage/diaryPage',
    })
  },

  getUserPicUrl:function(openid){
    const db = wx.cloud.database()
    let myuser = db.collection("user").where({
      _openid: openid
    }).get()
    var update = Promise.resolve(myuser).then(function (res) {
      return res.data[0].userInfo.avatarUrl
      console.log(diary.userPicUrl)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    wx.showLoading({
      title: 'loading...',
      duration: 1000
    })
    let old_diary = this.data.diaries
    let x = old_diary.length
    console.log(x)
    

    var diarys = []
    const db = wx.cloud.database()
    let temp = db.collection("diary").orderBy('editTime', 'desc').skip(x).get()
    //按时间获取日记列表
    Promise.resolve(temp).then(res => {

      var diaryList = res.data
      console.log(diaryList)
      for (var index in diaryList) {
        console.log("123221221212222222222222222222222222")
        // console.log(diaryList[index].content.ops[0])
        //日记信息数组
        var diary = [{
          userPicUrl: diaryList[index].userPicUrl,
          content: diaryList[index].content.ops[0].insert,
          editTime: diaryList[index].editTime
        }]
        // console.log(diary)
        // that.data.diaries.push(diary)
        // console.log(that.diaries)
        diarys.push(diary)
        // that.setData({
        //   diaries:that.diaries.concat(diary)
        // })
        // diaries.push(diary)
        // console.log(diarys,"diarys"+index)
      }
      console.log(diarys.length,"length")
      this.setData({
        diaries: old_diary.concat(diarys),
        diaryNums:x
      })
      console.log(this.data.diaries)
      console.log(this.data.diaryNums)
    })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})