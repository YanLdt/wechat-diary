var util = require('../../utils/util.js');
const app = getApp()

Page({
  
  data: {
    pic: {},
    openid:'',
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false
  },
  
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {

    var id = null

    // console.log(wx.getStorageSync("openid"))

    // wx.getStorage({
    //   key: "openid",
    //   success: function (res) {
    //     console.log("success")
        
    //     id=res.data
    //     // console.log(this.data.openid)
    //   }
    // })

    var that = this
    that.setData({
      openid: wx.getStorageSync("openid")
    })

    
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
    
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({ editorHeight, keyboardHeight })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        // wx.showLoading({
        //   title: '上传中',
        // })

        const filePath = res.tempFilePaths[0]
        const cloudPath = 'diaryPicture/' + util.wxuuid() + filePath.match(/\.[^.]+?$/)[0]
        console.log(cloudPath)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          name: 'test',
          success: function (res) {
            console.log("上传成功", res.fileID)
            // that.setData({
            //   pic:res.data[0]
            // })
            // pic = JSON.stringify(res)
            // console.log(pic)
            that.editorCtx.insertImage({
              src: res.fileID,
              success: function () {
                console.log('insert image success')
              }
            })
          }
        })

        // that.editorCtx.insertImage({
        //   // src: pic.fileID,
        //   data: {
        //     id: 'abcd',
        //     role: 'god'
        //   },
        //   width: '80%',
        //   success: function () {
        //     console.log('insert image success')
        //   }
        // })


      }
    })
  },

  upload(){
    // console.log(res)
    wx.vibrateShort();
    var that = this
    const db = wx.cloud.database()

    console.log(this.data.openid, "2222222222222222222222222222222")
    that.editorCtx.getContents({
      success: function (res) {
        var content = {
          time: util.formatTime(new Date()),
          html: res.html,
          text: res.text,
          delta: res.delta
        }
        console.log(content)
        //上传日记并加上时间
        db.collection("diary").add({
          data: {
            editTime: content.time,
            content: content.delta
          },
          success(res) {
            var id = res._id
            console.log(res._id)
            var diaryid = res._id
            let _ = db.command
            let myuser = db.collection("user").where({
              _openid: that.data.openid
            }).get()
            console.log(that.data.openid,"openoidddddddddddddddddd")

            //更新用户记录里的diaryArr
            var update = Promise.resolve(myuser).then(function(res){
              console.log(res.data[0].userInfo.avatarUrl)

              db.collection("diary").where({
                _id:id
              }).update({
                data:{
                  userPicUrl: res.data[0].userInfo.avatarUrl
                }
              })

              //把用户头像信息写入日记集合
              var user = res.data[0]
              let tmpArr = user.diaryArr;
              console.log(tmpArr)
              tmpArr.push(diaryid)
              console.log(tmpArr,"after")
              db.collection("user").doc(user['_id']).update({
                data:{
                  diaryArr:tmpArr
                }
              })
            })


          }
        })
        console.log("上传日记成功")
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })

    wx.showLoading({
      title: '上传日记成功',
      duration: 3000
    })

  }
})
