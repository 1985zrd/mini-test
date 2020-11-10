// 云函数入口文件
const cloud = require('wx-server-sdk')

const { ENV } = cloud.getWXContext()

cloud.init({
  env: ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('开始')
  function sleep (time) {
    return new Promise((resolve, reject) => setTimeout(resolve, time))
  }
  const { OPENID } = cloud.getWXContext()
  const templateId = "rPejXr77GhZbNgiJ470VlBAKpEZjAUQMH1iigXF8s4E"
  console.log('云函数')
  // await sleep(5000)
  try {
    await sleep(2000)
    const result = await cloud.openapi.subscribeMessage.send({
      touser: OPENID,
      templateId: templateId,
      miniprogramState: 'developer',
      page: 'pages/webworker/webworker',
      // 此处字段应修改为所申请模板所要求的字段
      data: {
        thing3: {
          value: '咖啡',
        },
        character_string1: {
          value: '2020-07-13 17:25',
        },
      }
    })
    
    console.log('云函数结束')
    // result 结构
    // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
    return result
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    console.log('catch error====')
    throw err
  }
}