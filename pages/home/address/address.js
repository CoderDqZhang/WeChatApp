// pages/home/address/address.js
var app = getApp()
Page({
  data: {
    provice: [
      "北京市",
      "天津市",
      "上海市 ",
      "重庆市",
      "河北省",
      "山西省",
      "辽宁省 ",
      "吉林省",
      "黑龙江省 ",
      "江苏省 ",
      "浙江省 ",
      "安徽省",
      "福建省",
      "江西省",
      "山东省",
      "河南省",
      "湖北省",
      "湖南省",
      "广东省",
      "海南省",
      "四川省",
      "贵州省",
      "云南省",
      "陕西省",
      "甘肃省",
      "青海省",
      "西藏自治区",
      "广西壮族自治区",
      "内蒙古自治区",
      "宁夏回族自治区",
      "新疆维吾尔自治区",
      "香港特别行政区",
      "澳门地区"],
    regions: "地区选择",
    isSelect: false,
    windowsWidth: 0,
    windowsHeigth: 0,
    isAllowUser:false
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        // success
        that.setData({
          windowWidth: res.windowWidth - 148,
          windowsHeigth: res.windowHeight
        })
        console.log(that.data.windowWidth)
      }
    })
    var userInfo = wx.getStorageSync('userInfo')
    console.log("userInfo" + userInfo)
    if (userInfo != "") {
      that.setData({
        isAllowUser: false 
      })
    } else {
      that.setData({
        isAllowUser: true
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  formSubmit: function (e) {
    console.log(e)
    var location = this.data.regions
    console.log(location)
    wx.showToast({
      title:'保存中',
      icon: 'loading',
      duration: 2000
    })
    var data = {
          "name": e.detail.value.name,
          "id": 0,
          "default": 1,
          "mobile_num": e.detail.value.phone,
          "location": location,
          "address": e.detail.value.address,
        }
        app.func.requestPost('user/address/', data, function (ures) {
          wx.hideToast()
          if (ures.errors != null) {
            wx.showModal({
              title: ures.errors[0].error[0].toString(),
              showCancel: false,
              confirmText: "知道了",
              confirmColor: "#4bd4c5",
              success: function (uwres) {
                if (uwres.confirm) {
                }
              }
            })
            return
          }
          var pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.changeData(ures)
          }
          try {
            wx.setStorageSync(e.detail.value.phone, ures)
            wx.navigateBack({
              delta: 1
            })
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 10000
            })

            setTimeout(function () {
              wx.hideToast()
            }, 2000)
          } catch (e) {
            console.log(e)
          }
        });
    // wx.getStorage({
    //   key: 'userInfo',
    //   success: function (res) {
    //     console.log("test" + res.data.data.id)
        
    //   },
    //   fail: function () {
    //     console.log('获取用户登录态失败！')
    //     wx.login({
    //     success: function (res) {
    //       console.log('获取用户登录态失败！' + res)
    //       wx.getUserInfo({
    //         success: function (resU) {
    //          console.log('获取用户登录态失败！获取用户信息' + resU)
    //           that.globalData.userInfo = resU.userInfo
    //           typeof cb == "function" && cb(that.globalData.userInfo)
    //           if (res.code) {
    //             console.log(resU.userInfo)
    //             console.log(res.code)
    //             wx.request({
    //               url: "https://api.niceticket.cc/user/weixin_login/",
    //               data: {
    //                 "gender": resU.userInfo.gender,
    //                 "nickname": resU.userInfo.nickName,
    //                 "avatar": resU.userInfo.avatarUrl,
    //                 "code": res.code
    //               },
    //               method: 'post',
    //               success: function (res) {
    //                 console.log(res.lp_session_id)
    //                 console.log(res)
    //                 try {
    //                   wx.setStorageSync('userInfo', res)
    //                 } catch (e) {
    //                 }
    //               }
    //             })
    //             // wx.request({
    //             //   url: "https://api.liangpiao.me/user/weixin_login/",
    //             //   data: {
    //             //     "gender": resU.userInfo.gender,
    //             //     "nickname": resU.userInfo.nickName,
    //             //     "avatar": resU.userInfo.avatarUrl,
    //             //     "code": res.code
    //             //   },
    //             //   method: 'post',
    //             //   success: function (res) {
    //             //     console.log(res.lp_session_id)
    //             //     try {
    //             //       wx.setStorageSync('userInfo', res)
    //             //     } catch (e) {
    //             //     }
    //             //     console.log(res)
    //             //   }
    //             // })
    //           } else {
    //             console.log('获取用户登录态失败！')
    //             console.log('获取用户登录态失败！')
    //           }
    //         }
    //       })
    //     }
    //   })
    //     // wx.showModal({
    //     //   title: "请允许获取用户信息",
    //     //   confirmColor: "#4bd4c5",
    //     //   confirmText: "知道了",
    //     //   success: function (res) {
    //     //     console.log('用户点击确定')
    //     //   }
    //     // })
    //   }
    // })

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', this.data.provice[e.detail.value])
    this.setData({
      index: e.detail.value,
      isSelect: true,
      regions: this.data.provice[e.detail.value]
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})