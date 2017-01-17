//app.js
var http = require('gloable/service/http.js')
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    // if (this.globalData.userInfo) {
    //   typeof cb == "function" && cb(this.globalData.userInfo)
    //   try {
    //     var value = wx.getStorageSync('userInfo')
    //     if (value) {
    //       that.globalData.userInfo = value
    //       // Do something with return value
    //     }
    //   } catch (e) {
    //     // Do something when catch error
    //   }
    // } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (resU) {
              that.globalData.userInfo = resU.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
              if (res.code) {
                console.log(resU.userInfo)
                console.log(res.code)
                wx.request({
                  url: "https://api.liangpiao.me/user/weixin_login/",
                  data: {
                    "gender": resU.userInfo.gender,
                    "nickname": resU.userInfo.nickName,
                    "avatar": resU.userInfo.avatarUrl,
                    "code": res.code
                  },
                  method: 'post',
                  success: function (res) {
                    console.log(res.lp_session_id)
                    try {
                      wx.setStorageSync('userInfo', res)
                    } catch (e) {
                    }
                    console.log(res)
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          })
        }
      })
    // }
  },
  globalData: {
    userInfo: null
  },
  func: {
    requestPost: http.requestPost,
    requestGet: http.requestGet,
  }
})
