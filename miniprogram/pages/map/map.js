// miniprogram/pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    polyline: [{
      points: [{
        longitude: 116.3972,
        latitude: 39.9096
      }, {
        longitude: 115.3972,
        latitude: 39.9096
      }],
      color:"#FF0000DD",
      width: 10
    }],
    markers: [{
      iconPath: "/images/delIcon@2x.png",
      id: 4,
      latitude: 39.9096,
      longitude: 116.3972,
      width: 30,
      height: 30
    }],
    //当前定位位置
    latitude:'',
    longitude: '',
  },

  navigate () {
    ////使用微信内置地图查看标记点位置，并进行导航
    wx.openLocation({
      latitude: this.data.markers[0].latitude,//要去的纬度-地址
      longitude: this.data.markers[0].longitude,//要去的经度-地址
    })
  },

  callPho () {
    wx.makePhoneCall({
      phoneNumber: '15811013432' //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log(res)
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
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
    // let longitude = 115.3972
    // setInterval(() => {
    //   longitude += 0.1
    //   this.setData({
    //     polyline: [{
    //       points: [{
    //         longitude: 116.3972,
    //         latitude: 39.9096
    //       }, {
    //         longitude: longitude,
    //         latitude: 39.9096
    //       }],
    //       color:"#FF0000DD",
    //       width: 10
    //     }],
    //   })
    // }, 1000)
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