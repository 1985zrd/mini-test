export const getData = ({success, complete}) => {
  wx.request({
    url: 'https://uat-appweb.tijianbao.com/api/search/hotword',
    success (res) {
      success && success(res)
    },
    complete () {
      complete && complete()
    }
  })
}