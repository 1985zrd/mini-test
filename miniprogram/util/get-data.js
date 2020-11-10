import {
  LOGIN,
  LOGOUT,
  REFRESH_TOKEN
} from '../api/user-login';

import loading from './loading';

const APP = getApp();

export const GET_DATA = async opt => {
  let result
  let accessToken = wx.getStorageSync('access_token') || '';
  let openId = wx.getStorageSync('openId') || '';
  let origin = opt.serviceType === 'wxl' ? APP.globalData.wxlHost + opt.serviceType + '/' : APP.globalData.host + 'inspection/';

  let cookie = wx.getStorageSync('set-cookie');
  cookie = cookie ? cookie.toString() : '';

  if (!opt.noLoading) {
    loading.start()
  }

  try {
    result = await new Promise((resolve, reject) => {
      wx.request({
        url: origin + opt.url,
        method: opt.method || 'post',
        timeout: 60000,
        header: {
          ...APP.globalData.headParams,
          'Content-Type': opt.contentType || 'application/json', // 'application/x-www-form-urlencoded' 或者 'application/json'
          'time': new Date().getTime().toString(), // Long型时间戳
          'token': accessToken, //	统一用户Token	字符串  '75111a3fdbc8ddeece81fbc9530d9dc4'
          Cookie: cookie
        },
        data: opt.data || {},
        dataType: 'json',
        success: (res) => {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      })
    })
  } catch (e) {
    if (!opt.noLoading) {
      loading.end(true)
    };
    wx.showToast({
      icon: 'none',
      title: '网络错误，请稍后再试',
      duration: 1500
    });
    return Promise.reject(e);
  }
  
  let code = Number(result.data.code);
  if (code == 1) {
    if (opt.url === 'login') {
      wx.setStorageSync('set-cookie', result.header['set-cookie'] || result.header['Set-Cookie'])
    }
    if (!opt.noLoading) {
      loading.end()
    }
    return Promise.resolve(result.data);
  } else if (code === 2 || code === 3) {
    let preRequestOpt = Object.assign({}, opt)
    if (!opt.noLoading) {
      loading.end(true)
    };
    try {
      await LOGOUT()
    } catch (e) {
      return Promise.reject(e);
    }
    if (code === 2 && accessToken) {
      try {
        await LOGIN({
          data: {
            token: accessToken
          }
        });
        return GET_DATA(preRequestOpt);
      } catch (e) {
        // if (!opt.noLoading) {
        //   loading.end(true)
        // };
        wx.showToast({
          icon: 'none',
          title: '网络错误，请稍后再试',
          duration: 1500
        });
        return Promise.reject(e);
      }
    } else if (code === 3 && openId) {
      try {
        let refreshResult = await REFRESH_TOKEN({
          data: {
            openId
          }
        });
        if (refreshResult && refreshResult.results[0]) {
          wx.setStorageSync('access_token', refreshResult.results[0].accessToken);
          wx.setStorageSync('openId', refreshResult.results[0].openId);
          await LOGIN({
            data: {
              token: refreshResult.results[0].accessToken
            }
          });
          return GET_DATA(preRequestOpt);
        } else {
          // if (!opt.noLoading) {
          //   loading.end(true)
          // };
          return Promise.reject();
        }
      } catch (e) {
        // if (!opt.noLoading) {
        //   loading.end(true)
        // };
        wx.showToast({
          icon: 'none',
          title: '网络错误，请稍后再试',
          duration: 1500
        });
        return Promise.reject(e);
      }
    } else {
      // if (!opt.noLoading) {
      //   loading.end(true)
      // };
      wx.redirectTo({
        url: '/pages/login/login'
      })
    }
  } else {
    if (!opt.noLoading) {
      loading.end(true)
    };
    wx.showToast({
      icon: 'none',
      title: result.data.message || '网络错误，请稍后再试',
      duration: 1500
    });
    return Promise.reject(result.data);
  }
}
