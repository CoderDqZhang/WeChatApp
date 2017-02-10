// pages/home/login/login.js
var app = getApp()
function countdown(that) {
  var second
  console.log(that.data)
  if ('发送验证码' == that.data.second) {
    second = 60
  } else {
    second = that.data.second
  }

  if (second == 0) {
    that.setData({
      second: "重新获取"
    });
    return;
  }
  var time = setTimeout(function () {
    if ('发送验证码' == second || second == "重新获取") {
      second = 60
    }
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}
Page({
  data: {
    phone: "",
    second: "发送验证码"
  },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数
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
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  senderCode: function () {
    var that = this;
    var data = {
      "mobile_num": this.data.phone
    }
    wx.request({
      url: 'https://api.liangpiao.me/' + 'user/login_code/',
      data: data,
      method: 'post',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res)
        countdown(that);
      },
      fail: function () {
        console.log("登录失败")
      },
    })
  },
  formSubmit: function (e) {
    var that = this
    console.log(e.detail.value.phone.toString())
    console.log(e.detail.value.code.toString())
    var data = {
      "mobile_num": e.detail.value.phone.toString(),
      "code": e.detail.value.code.toString()
    }
    wx.request({
      url: 'https://api.liangpiao.me/' + 'user/login/',
      data: data,
      method: 'post',
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        try {
          wx.setStorageSync('userInfo', res)
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
            success: function (res) {
              // success
            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
        } catch (e) {
        }
      },
      fail: function () {
        console.log("登录失败")
      },
    })
  },
})