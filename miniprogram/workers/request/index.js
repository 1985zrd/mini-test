const utils = require('./utils')
const { getData } = require('./utils.js')

// 在 Worker 线程执行上下文会全局暴露一个 worker 对象，直接调用 worker.onMeesage/postMessage 即可
// worker.onMessage(function (res) {
//   console.log(res)
// })
// worker.postMessage({
//   msg: 'hello worker'
// })

var i = 0;

let arr = []

function timedCount () {
  i = i + 1;
  arr.push(i)
  worker.postMessage({
    msg: arr
  })
  setTimeout(() => {
    timedCount()
  },1000);
  // getData({
  //   success (res) {
  //     worker.postMessage({
  //       msg: [...res.results, ...arr]
  //     })
  //   },
  //   complete () {
  //     setTimeout(() => {
  //       timedCount()
  //     },5000);
  //   }
  // })
}
// timedCount();
