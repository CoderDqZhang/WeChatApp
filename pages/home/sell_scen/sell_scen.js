// pages/sell/sell_scen/sell_scen.js
var app = getApp()
Page({
  data: {
    showData: null,
    sessions: []
  },
  onLoad: function (options) {
    this.requestData(options.show)
    // 页面初始化 options为页面跳转所带来的参数
  },
  requestData: function (show) {
    var that = this;
    that.setData({
      sessionShow: JSON.parse(show)
    })
    var url = "show/" + JSON.parse(show).id + "/session/"
    app.func.requestGet(url, {}, function (res) {
      that.setData({
        sessions: res,
      })
    });
  },
  showTap: function (event) {
    var that = this;
    var session = event.currentTarget.dataset.session
    that.data.sessionShow.session = session
    session.venue_map = ""
    console.log(session)
    that.data.sessionShow.session = session

            var sellShow = JSON.stringify(that.data.sessionShow)
    wx.navigateTo({
      url: '../sell_form/sell_form?sellShow=' + sellShow,
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