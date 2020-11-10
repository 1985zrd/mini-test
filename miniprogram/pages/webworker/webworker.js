// miniprogram/pages/webworker/webworker.js
const crypto = require('../../util/crypto.js');
const worker = wx.createWorker('workers/request/index.js')
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    visible: true,
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success: (res) => {
        console.log('res.code: ', res.code);
        this.data.code = res.code
        // this.setData({
        //   'code': res.code
        // })
      }
    })
    
    
    wx.requestSubscribeMessage({
      tmplIds: ['rPejXr77GhZbNgiJ470VlBAKpEZjAUQMH1iigXF8s4E'],
      success (res) {
        console.log('成功：', res)
        // db.collection('subscribe').add({
        //   data: {
        //     subMsg: {
        //       thing1: {
        //         value: "通知来了。。。"
        //       },
        //       time5: {
        //         value: "测试"
        //       }
        //     }
        //   }
        // })
        openapi.templateMessage.send
      },
      fail (res) {
        console.log('fail: ', res)
      }
    })
    // var worker = new Worker('http://10.108.2.90:8080/webworker.js');
    
    // this.setData({
    //   worker
    // })
  },
  handleClose () {
    this.setData({
      visible: false
    })
  },
  handleOk () {
    this.handleClose()
    wx.requestSubscribeMessage({
      tmplIds: ['rPejXr77GhZbNgiJ470VlBAKpEZjAUQMH1iigXF8s4E'],
      success (res) {
        console.log('成功：', res)
        
      },
      fail (res) {
        console.log('fail: ', res)
      }
    })
  },
  open() {
    wx.openSetting({
      success (res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
      }
    })
  },
  subscribeMessage () {
    wx.requestSubscribeMessage({
      tmplIds: ['rPejXr77GhZbNgiJ470VlBAKpEZjAUQMH1iigXF8s4E'],
      success (res) {
        console.log('成功：', res)
        
      },
      fail (res) {
        console.log('fail: ', res)
      }
    })
  },
  sendMessage () {
    wx.cloud.callFunction({
      name: "subscrubeMessage",
      success: res => {
        console.warn('[云函数] [openapi] subscribeMessage.send 调用成功：', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '调用失败',
        })
        console.error('[云函数] [openapi] subscribeMessage.send 调用失败：', err)
      }
    })
  },
  getPhoneNumber(e) {
    let {
      iv,
      encryptedData
    } = e.detail
    console.log(iv)
    console.log(encryptedData)
  },
  doSomething (data) {
    this.setData({
      list: data
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toIndex () {
    if (!this.data.code) {
      return
    }
    wx.requestSubscribeMessage({
      tmplIds: ['rPejXr77GhZbNgiJ470VlBAKpEZjAUQMH1iigXF8s4E'],
      success (res) {
        console.log('成功：', res)
        wx.navigateTo({
          url: '/pages/index/index'
        })
        
      },
      fail (res) {
        console.log('fail: ', res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // let _this = this
    // worker.onMessage(function (res) {
    //   console.log(res)
    //   _this.setData({
    //     list: res.msg
    //   })
    // })
    let e = crypto.Encrypt('123', '123123')
    console.log(e)
    let decrypt = crypto.Decrypt(e, '123123')
    console.log('decrypt: ', decrypt)
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
    worker.terminate()
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