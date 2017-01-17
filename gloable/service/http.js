// var rootDocment = 'https://api.niceticket.cc/';//你的域名  
var rootDocment = 'https://api.liangpiao.me/'

function requestPost(url, data, cb) {
  var lp_session_id;
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      console.log("test" + res.data.data.lp_session_id)
      lp_session_id = res.data.data.lp_session_id
      wx.request({
        url: rootDocment + url,
        data: data,
        method: 'post',
        header: {
          'content-type': 'application/json',
          'Authorization':res.data.data.lp_session_id
        },
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        }
      })
    }
  })
}

function requestGet(url, data, cb) {
  var lp_session_id;
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      console.log("test" + res.data.data.lp_session_id)
      lp_session_id = res.data.data.lp_session_id
      wx.request({
        url: rootDocment + url,
        data: data,
        header: {
          'content-type': 'application/json',
          'Authorization':res.data.data.lp_session_id
        },
        method: 'get',
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        }
      })
    }
  })
}

module.exports.requestPost = requestPost
module.exports.requestGet = requestGet