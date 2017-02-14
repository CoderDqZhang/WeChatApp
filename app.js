//app.js
var http = require('gloable/service/http.js')
var TD = require('gloable/service/tdweapp.js');
App({
  data: {
    userInfo: {}
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    that.getUserInfo(function (userInfo) {
      //更新数据
      that.globalData.userInfo = userInfo
    })
    TD.launch({
            appkey: '949AC2A588DA47B9AA5499B5CB15250D',
            appName: '良票演出',
            versionName: 'v1.0.0',
            versionCode: 'v1.0.0',
            autoOnAppShow: true,
            autoOnAppHide: true,
            autoOnPageUnload: true,
            autoOnPullDownRefresh: true,
            autoOnReachBottom: true,
            autoOnShare: true
        });
  },
  getUserInfo: function (cb) {
    var that = this
    console.log(that)

    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
      try {
        var value = wx.getStorageSync('userInfo')
        console.log(value)

        if (value) {
          that.globalData.userInfo = value
          // Do something with return value
        }
      } catch (e) {
        // Do something when catch error
      }
    } else {
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
                  url: "https://api.niceticket.cc/user/weixin_login/",
                  data: {
                    "gender": resU.userInfo.gender,
                    "nickname": resU.userInfo.nickName,
                    "avatar": resU.userInfo.avatarUrl,
                    "code": res.code
                  },
                  method: 'post',
                  success: function (res) {
                    console.log(res.lp_session_id)
                    console.log(res)
                    var pages = getCurrentPages();
                    console.log(pages)
                    var home = pages[0]
                    console.log(home)
                    home.isAllowUser = false
                    // home.setData({
                    //   isAllowUser: false
                    // })
                    console.log(home)
                    try {
                      wx.setStorageSync('userInfo', res)

                    } catch (e) {
                    }
                  }
                })
                // wx.request({
                //   url: "https://api.liangpiao.me/user/weixin_login/",
                //   data: {
                //     "gender": resU.userInfo.gender,
                //     "nickname": resU.userInfo.nickName,
                //     "avatar": resU.userInfo.avatarUrl,
                //     "code": res.code
                //   },
                //   method: 'post',
                //   success: function (res) {
                //     console.log(res.lp_session_id)
                //     try {
                //       wx.setStorageSync('userInfo', res)
                //     } catch (e) {
                //     }
                //     console.log(res)
                //   }
                // })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
              }
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null
  },
  func: {
    requestPost: http.requestPost,
    requestGet: http.requestGet,
  }
})
