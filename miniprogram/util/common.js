import {
  SUBSCRIBE_MESSAGE
} from '../api/guided-inspection.js';
const app = getApp();
export const checkappNewsPower = () => {
  let templateOne = app.globalData.appNewsPowers['Lc8Yrj9bjjepSOvy6bI7htPSyFl3LlAtRY43t6NcApw']
  let templateTwo = app.globalData.appNewsPowers['cLMdR7BIDirSGD5VlgnOxN88vFo_ar2pnwvhYMAdqLc']
  let checkBool = templateOne === '' || templateTwo === '' ? true : false
  return checkBool
}
// 用户授权通知,若已通知则不再发送请求
export const GETNOTICEAUTH = () => {
  //  获取订阅权限
  // accept:允许，reject：拒绝
  // 选择总是保持以上选择，不再询问后不再弹窗，默认发送通过请求
  // bQrTNRBxFRQpnrOYbTgCzjJ0PjWb_oiYG1eCeBE8Ji8: "accept"
  // bQrTNRBxFRQpnrOYbTgCzp2sE1W8gXundxUzkGGHo2k: "accept"
  // errMsg: "requestSubscribeMessage:ok"
  // bQrTNRBxFRQpnrOYbTgCzjJ0PjWb_oiYG1eCeBE8Ji8: "reject"
  let templateOne = app.globalData.appNewsPowers['Lc8Yrj9bjjepSOvy6bI7htPSyFl3LlAtRY43t6NcApw']
  let templateTwo = app.globalData.appNewsPowers['cLMdR7BIDirSGD5VlgnOxN88vFo_ar2pnwvhYMAdqLc']
  if (templateOne !== '' && templateTwo !== '') return
  // console.log('入参', app.globalData.appNewsIds)
  wx.requestSubscribeMessage({
    tmplIds: app.globalData.appNewsIds,
    success: (res) => {
      app.globalData.appNewsPowers['Lc8Yrj9bjjepSOvy6bI7htPSyFl3LlAtRY43t6NcApw'] = res['Lc8Yrj9bjjepSOvy6bI7htPSyFl3LlAtRY43t6NcApw']
      app.globalData.appNewsPowers['cLMdR7BIDirSGD5VlgnOxN88vFo_ar2pnwvhYMAdqLc'] = res['cLMdR7BIDirSGD5VlgnOxN88vFo_ar2pnwvhYMAdqLc']
      // console.log(res, app.globalData.appNewsPowers)
    },
    fail: (error) => {
      wx.showToast({
        title: res.errMsg,
        icon: 'none',
        mask: true
      })
    }
  })
}

export const sleep = (time) => {
  return new Promise(resolve => 
    setTimeout(resolve, time)
  )
}

// function subMessage (info, templeteId) {
//   return new Promise((resolve, reject) => {
//     wx.request({
//       url: 'http://10.108.3.83:80/inspection/wechat/sub/message',
//       method: 'post',
//       timeout: 60000,
//       header: {
//         ...app.globalData.headParams,
//         'Content-Type': 'application/json', // 'application/x-www-form-urlencoded' 或者 'application/json'
//         'time': new Date().getTime().toString(), // Long型时间戳
//         'token': wx.getStorageSync('access_token') || '' //	统一用户Token	字符串  '75111a3fdbc8ddeece81fbc9530d9dc4'
//       },
//       data: {
//         workId: info.workNo,
//         openId: wx.getStorageSync('openId') || '',
//         messageType: templeteId,
//         lineCode: info.hospLineId,
//         examUserId: info.id,
//         hospLineName: info.hospLineName
//       },
//       dataType: 'json',
//       success: (res) => {
//         console.log('订阅发送成功', res)
//         resolve()
//       },
//       fail: function (res) {
//         console.log('fail', res)
//         reject()
//       }
//     })
//   })
// }

export const getNoticeAuth = (info, cb) => {
  async function subscribeHandler (res) {
    if (!res) {
      wx.showToast({ title: '消息订阅失败', icon: 'none', mask: true });
      await sleep(2000);
    } else {
      let acceptTemplateId = '';
      Object.keys(res).forEach(key => {
        if (res[key] === 'accept') {
          acceptTemplateId += acceptTemplateId.length ? `,${key}` : key
        }
      })
      // console.log(acceptTemplateId);
      if (acceptTemplateId) {
        try {
          // await subMessage(info, acceptTemplateId)
          await SUBSCRIBE_MESSAGE({
            data: {
              workId: info.workNo,
              openId: wx.getStorageSync('openId') || '',
              messageType: acceptTemplateId,
              lineCode: info.hospLineId,
              examUserId: info.id,
              hospLineName: info.hospLineName
            }
          })
        } catch (e) {
          console.log(e)
        }
      }
    }
    wx.setStorageSync(`${info.workNo}-subscribe`, true);
    cb(info);
  };

  if (wx.getStorageSync(`${info.workNo}-subscribe`) || info.itemCheckStatus !== 0) {
    cb(info);
  } else {
    wx.requestSubscribeMessage({
      tmplIds: app.globalData.appNewsIds,
      success: (res) => {
        subscribeHandler(res)
      },
      fail: (error) => {
        subscribeHandler()
      }
    })
  }
}

let rsAstralRange = '\\ud800-\\udfff',
    rsZWJ = '\\u200d',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
let reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');

let rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsOptVar = '[' + rsVarRange + ']?',
    rsCombo = '[' + rsComboRange + ']',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    reOptMod = rsModifier + '?',
    rsAstral = '[' + rsAstralRange + ']',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
let reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

export const hasUnicode = (val) => {
  return reHasUnicode.test(val);
}

export const unicodeToArray = (val) => {
  return val.match(reUnicode) || [];
}

export const asciiToArray = (val) => {
  return val.split('');
}

export const toArray = (val) => { // 字符串转成数组
    return hasUnicode(val)
        ? unicodeToArray(val)
        : asciiToArray(val);
}
