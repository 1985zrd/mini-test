// components/test/test.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    dis: false,
    show: true
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },
  attached: function () {
    
    setTimeout(() => {
      this.setData({
        dis: true
      })
    }, 500)
    setTimeout(() => {
      this.setData({
        show: false
      })
    }, 2000)
  },
  detached: function () {
  }
})
