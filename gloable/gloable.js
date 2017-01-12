// glabble.js
//调用方法方法
// var common = require('common.js')
// Page({
//   helloMINA: function() {
//     common.sayHello('MINA')
//   },
//   goodbyeMINA: function() {
//     common.sayGoodbye('MINA')
//   }
// })
function sayHello(name) {
  console.log(`Hello ${name} !`)
}
function sayGoodbye(name) {
  console.log(`Goodbye ${name} !`)
}

module.exports.sayHello = sayHello
exports.sayGoodbye = sayGoodbye