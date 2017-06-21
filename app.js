//app.js
var http = require('gloable/service/http.js');
var TD = require('gloable/service/tdweapp.js');
var MD5 = require('gloable/service/jqueryMD5.js');
// var util = require('../../utils/util.js');

App({
  data: {
    userInfo: {},
    deliver: {
      "顺丰": "SF",
      "EMS": "EMS",
      "圆通": "YTO",
      "中通": "ZTO",
      "申通": "STO",
      "宅急送": "ZJS",
      "韵达": "YD"
    },
    expressDelivierKey: "a72a6d2f-019f-463f-8d20-a99bef74f1ce",
    expressDelivierEBusinessID: "1281351"
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
      versionName: 'v1.1.0',
      versionCode: 'v1.1.0',
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
                wx.request({
                  // url: "https://api.liangpiao.me/user/weixin_login/",
                  url: "https://api.niceticket.cc/user/weixin_login/",
                  data: {
                    "gender": resU.userInfo.gender,
                    "nickname": resU.userInfo.nickName,
                    "avatar": resU.userInfo.avatarUrl,
                    "code": res.code
                  },
                  method: 'post',
                  success: function (res) {
                    if (res.errors != null) {
                      wx.showModal({
                        title: res.errors[0].error[0].toString(),
                        showCancel: false,
                        confirmText: "知道了",
                        confirmColor: "#4bd4c5",
                        success: function (res) {
                          if (res.confirm) {
                          }
                        }
                      })
                      return
                    }
                    // wx.showModal({
                    //   title: res.data.lp_session_id,
                    //   showCancel: false,
                    //   confirmText: "知道了",
                    //   confirmColor: "#4bd4c5",
                    //   success: function (res) {
                    //     if (res.confirm) {

                    //     }
                    //   }
                    // })
                    console.log(res.data.lp_session_id)
                    console.log(res)
                    var pages = getCurrentPages();
                    console.log(pages)
                    var home = pages[0]
                    console.log(home)
                    home.setData({
                      isAllowUser: false
                    })
                    console.log(home)
                    try {
                      wx.setStorageSync('userInfo', res)
                    } catch (e) {
                      wx.showModal({
                        title: '微信保存用户信息失败',
                        showCancel: false,
                        confirmText: "知道了",
                        confirmColor: "#4bd4c5",
                        success: function (res) {
                          if (res.confirm) {

                          }
                        }
                      })
                    }
                  }
                })
              } else {
                console.log('获取用户登录态失败！' + res.errMsg)
                wx.showModal({
                  title: '微信登录失败',
                  showCancel: false,
                  confirmText: "知道了",
                  confirmColor: "#4bd4c5",
                  success: function (res) {
                    if (res.confirm) {

                    }
                  }
                })
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
    requestUpload: http.requestUpload,
    requestGet: http.requestGet,
    requestPut: http.requestPut,
    requestDelete: http.requestDelete,
    requestSessionIDGet: http.requestSessionIDGet
  }
})
