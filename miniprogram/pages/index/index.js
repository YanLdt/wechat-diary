//index.js
const app = getApp()
import {
  formatTime
}from "../../utils/tool.js"

Page({
  data: {
    day:"",
    title:"",
    diaryCount:"",
    hidden:true,
    modalHidden: true,
    dayStyle: [
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' },
      { month: 'current', day: new Date().getDate(), color: 'white', background: '#AAD4F5' }
    ],
  },
  //给点击的日期设置一个背景颜色
  dayClick: function (event) {
    let clickDay = event.detail.day;
    let changeDay = `dayStyle[1].day`;
    let changeBg = `dayStyle[1].background`;
    this.setData({
      [changeDay]: clickDay,
      [changeBg]: "#84e7d0"
    })

  },

  diaryCount: function(){
    const db = wx.cloud.database()
    var diaryCount = 0;
    db.collection('diary').count().then(res => {
      console.log(res.total)
      // diaryCount = res.total;
      var total = "写了" + (res.total + 992) + "篇日记";
      this.setData({
        diaryCount: total
      })

    })
    
    wx.vibrateShort();
    this.setData({
      modalHidden: false
    })
  },
  /**
   * 点击取消
   */
  modalCancel: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },

  /**
   *  点击确认
   */
  modalConfirm: function () {
    // do something
    this.setData({
      modalHidden: true
    })
  },



  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    
    // console.log(diaryCount)
    
    
    //当前日期的时间戳
    const today = formatTime(new Date());
    const love = new Date("2018-06-25");
    // console.log(new Date(today).getTime());
    // console.log(new Date(love).getTime());
    var newTime = new Date(today).getTime();
    var oldTime = new Date(love).getTime();

    var dayCount = (newTime - oldTime) / 86400000;
    var tmp = "zy 欺负 ly 已经" + dayCount + "天了！";
    
    // console.log(dayCount);
    this.setData({
      day:dayCount,
      title:tmp
    })
    wx.cloud.callFunction({
      name: "getopenid",
      data: {
      }
    }).then(res => {
      this.openid = res.result.openid
      //用户openid
      //console.log(this.openid)
      if (this.openid == "oAXdX4znu0lp7mTtDdw3YNTBagJk" || this.openid == "oAXdX48Quv5frXY62oA5MDk6PGrw") {
        this.setData({
          hidden: false
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    wx.stopPullDownRefresh() //刷新完成后停止下拉刷新动效
  },

  onGetUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  writeDiary: function() {
    wx.navigateTo({
      url: '../editDiary/editDiary',
    })
  },

  towriteDiary: function () {
    wx.vibrateShort();
    wx.navigateTo({
      url: '../editDiary/editDiary',
    })
  },


  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  }

})
