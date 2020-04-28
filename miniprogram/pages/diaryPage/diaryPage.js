var util = require('../../utils/util.js');
const app = getApp()


Page({
  data: {
    formats: {},
    readOnly: false,
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    delta:{},
    id:""
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad(diary) {
    this.setData({
      id: diary.diaryid
    })
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS })
    const that = this
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
    // console.log(this.data.id)
    const db = wx.cloud.database()
    db.collection("diary").doc(this.data.id).get({
      success:function(res){
        // console.log(res.data.content.ops)  
        that.editorCtx.setContents({
          delta: res.data.content.ops
        })}
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

  upload() {
    var that = this;
    const db = wx.cloud.database()
    that.editorCtx.getContents({
      success: function (res) {
        var content = {
          time: util.formatTime(new Date()),
          html: res.html,
          text: res.text,
          delta: res.delta
        }
        console.log(content)

        console.log(11111111111111)
        db.collection("diary").doc(that.data.id).update({
          data: {
            editTime: content.time,
            content: content.delta
          }
        })
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
  },
})
