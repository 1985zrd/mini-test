import { serverLogin, serverLogout, WXREFRESH_TOKEN } from '../api/user-login.js'
import loading from './loading'

const APP = getApp()

const serverLoginFn = async (reslove, lastRequestInfo) => {
  let { options } = lastRequestInfo
  if (!options || !options.noLoading) loading.start()
  let res = await serverLogin()
  // console.log('serverLoginFn', res)
  if (!options || !options.noLoading) loading.end()
  // 存session,获取用户信息，跳转导检单列表
  wx.setStorageSync('set-cookie', res.header['set-cookie'] || res.header['Set-Cookie'])
  headers['content-Type'] = lastRequestInfo.options['content-Type'] || 'application/json'
  let cookie = wx.getStorageSync('set-cookie') ? wx.getStorageSync('set-cookie').toString() : ''
  headers.Cookie = cookie
  if (lastRequestInfo.params['access_token']) lastRequestInfo.params['access_token'] = wx.getStorageSync('access_token')
  if (lastRequestInfo.params['token']) lastRequestInfo.params['token'] = wx.getStorageSync('access_token')
  wx.request({
    url: lastRequestInfo.url,
    method: lastRequestInfo.method,
    header: lastRequestInfo.headers,
    data: lastRequestInfo.params,
    dataType: 'json',
    success: (res) => {
      if (res.data && res.data.code && (res.data.code === 1 || res.data.code === '1')) {
        reslove(res.data)
      } else {
        reslove(res)
        wx.showToast({ icon: 'none', title: '出错误啦，请联系我们', duration: 1500 })
      }
    },
    fail: (error) => {
      reslove(error)
      wx.showToast({ icon: 'none', title: '网络错误，请稍后再试', duration: 1500 })
    }
  })
}

const WXREFRESH_TOKENFn = async (reslove, lastRequestInfo, info) => {
  let openId = info.openId || ''
  // let codeRes = await getWechatCode()
  let code = info.code || ''
  let res = await WXREFRESH_TOKEN({ openId: openId, code: code, channel: 55 })
  if (res.code === '1' && res.results) {
    let { accessToken, expiresIn } = res.results[0];
    wx.setStorageSync('access_token', accessToken);
    wx.setStorageSync('expires_in', expiresIn);
    serverLoginFn(reslove, lastRequestInfo)
  } else {
    reslove(res)
  }
}

const headers = {
  ...APP.globalData.headParams,
  // 'content-Type': 'application/json', // 'application/x-www-form-urlencoded' 或者 'application/json'
  // 'Authorization': authorization, // 这个看起来没必要传，后面需要再加
  // 'time': new Date().getTime().toString(), // Long型时间戳
}
const loginLoseCodes = [2, 3, '3', '2']
const successResCodes = [1, '1']
// 登录失效处理
/**
 * 
 * @param lastRequestInfo
 * @param loseCode 
 */
const loginLoseHandle = async (reslove, lastRequestInfo, loseCode) => {
  // 显示加载中
  let accessToken = wx.getStorageSync('access_token')
  let openId = wx.getStorageSync('openId')
  // await serverLogout()
  if (accessToken && (loseCode === 2||loseCode === '2')) {
    serverLoginFn(reslove, lastRequestInfo)
  } else if (openId && (loseCode === 3||loseCode === '3')) {
    WXREFRESH_TOKENFn(reslove, lastRequestInfo, { openId })
  } 
  // else if (accessToken && openId && (loseCode !== 2 || loseCode !== 3)) {
  //   WXREFRESH_TOKENFn(reslove, lastRequestInfo, { openId })
  // }
  // else if (!accessToken || !openId) {
  //   wx.redirectTo({ url: '/pages/login/login' })
  // }
  // TODO: 实际联调时需考虑是否需要先登出，若换回的session掉入死循环则需要
  // 登录code2处理 换session
  // 有token时=>登出=>调用severLogin换取session
  // 无token时=>登出=>调用wx.login更新登录凭证=>调用wxlLogin更新token=>调用severLogin换取session //这两种情况可实现静默登录，先不调用
  // 登录code3处理 旧token换新token
  // 有openId =>登出=>调用wxlLogin更新token=>调用severLogin换取session
  // 无openId =>登出=>调用wx.login更新登录凭证=>调用wxlLogin更新token=>调用severLogin换取session //这两种情况可实现静默登录，先不调用
  // return回有效数据
}


const requestAll = (url, method, params, options) => {
  return new Promise((reslove, reject) => {
    // 如果不需要loading，则noLoading: true
    if (!options || !options.noLoading) { loading.start() }
    // headers同步token，cookies !important
    let accessToken = wx.getStorageSync('access_token') || ''
    let cookie = wx.getStorageSync('set-cookie') ? wx.getStorageSync('set-cookie').toString() : ''
    headers.token = accessToken
    headers['content-Type'] = options['content-Type'] || 'application/json'
    headers.Cookie = cookie
    headers.time = new Date().getTime().toString()
    Object.assign(headers, options)
    // 同步options
    wx.request({
      url: url,
      method,
      header: headers,
      data: params,
      dataType: 'json',
      success: (res) => {
        // console.log('wxres',res)
        if (res.statusCode !== 200) {
          reject(res)
          wx.showToast({ title: '网络错误，请稍后再试', icon: 'none', duration: 1500 })
          return
        }
        if (!options || !options.noLoading) { loading.end() }
        // 此处还可进行各种请求成功后的异常处理
        // console.log('requestAll',res)
        if (!res.data) return;
        let data = res.data
        if (successResCodes.includes(data.code) || (options && options.mode === 'unite')) {
          url.includes('/inspection/login') ? reslove(res) : reslove(data)
        } else if (loginLoseCodes.includes(data.code)) {
          // code===2,code===3为登录失效状态，将上一次请求的参数保存下来，换取到有效的登录状态后再发送一次有效请求，将请求后的有效数据reslove回去
          // 统一用户提示token过期，清空本地存储，跳转登录页
          if (url.includes('uniuser/getAccount') && data.code === 3) {
            wx.removeStorageSync('access_token')
            wx.removeStorageSync('set-cookie')
            wx.removeStorageSync('userId')
            wx.removeStorageSync('openId')
            wx.reLaunch({ url: '/pages/login/login' })
            wx.showToast({ title: '登录失效，请重新登录', icon: 'none', duration: 1500 })
            return
          }
          // 微信快捷登录解析失败不提示
          loginLoseHandle(reslove, { url, method, headers, params, options }, data.code)
        } else {
          reslove(res.data)
          if (url.includes('wxl/api/auth') && data.code === '0') return
          wx.showToast({ icon: 'none', title: data.message, duration: 1500 })
        }
      },
      fail: (error) => {
        reject(error)
        // 不放在complete函数里，是因为showToast不能跟showLoading共存，console里有警告
        if (!options || !options.noLoading) { loading.end() }
        wx.showToast({ icon: 'none', title: '网络错误，请稍后再试', duration: 1500 })
      }
    })
  })

}
// options内容配置 noLoading:true 接口不需要时传入
// options内容配置 请求头有特殊配置时添加即可
// server请求
const serverRequest = (url, method, params, options) => {
  return requestAll(APP.globalData.host + 'inspection/' + url, method, params, { 'content-Type': 'application/json', ...options })
}
// wxl请求
const wxlRequest = (url, method, params, options) => {
  return requestAll(APP.globalData.wxlHost + 'wxl/' + url, method, params, { 'content-Type': 'application/json', ...options })
}
// 统一用户请求
const uniteRequest = (url, method, params, options) => {
  return requestAll(APP.globalData.unifiedUserHost + url, method, params, { 'content-Type': 'application/x-www-form-urlencoded', mode: 'unite', ...options })
}

export {
  serverRequest,
  wxlRequest,
  uniteRequest
}