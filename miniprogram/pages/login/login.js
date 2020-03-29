// miniprogram/pages/login/login.js
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      openid:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onGotUserInfo: function (event) {
    wx.vibrateShort();
    const db = wx.cloud.database()
    console.log(event.detail)



    wx.cloud.callFunction({
      name: "getopenid",
      data: {}
    }).then(res => {
      this.openid = res.result.openid
      wx.setStorage({
        key:"openid",
        data:res.result.openid
      })
    }).then(res => {
      
      db.collection("user").where({
        _openid: this.openid
      }).get({
        success: function (res) {
          console.log("success")
          console.log(res.data)
          console.log(event.detail.userInfo)
          if (res.leng.length == 0) {
            db.collection("user").add({
              data: {
                userInfo: e.detail.userInfo
              }
            })
          } else {
          }
          console.log(res.data)
        },
        fail:function(res){
          console.log("fail")
          db.collection("user").add({
            data:{
              userInfo: event.detail.userInfo
            }
          })
        }
      })
    })

    wx.switchTab({
      url: '../index/index',
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})