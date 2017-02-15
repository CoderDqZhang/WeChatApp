// pages/sell/sell_list/sell_list.js
var app = getApp()
Page({
  data: {
    sellList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.requestData()
  },
  requestData: function () {
    var that = this
    app.func.requestGet("show/hot_sell/", {}, function (res) {
      that.setData({
        sellList: res
      })
      console.log(that.data.sellList)
    });
  },
  showTap: function (event) {
    var data = event.currentTarget.dataset.show
    data.cover = ""
    data.category.icon = ""
    if (event.currentTarget.dataset.show.session_count > 1) {
      var show = JSON.stringify(data)
      wx.navigateTo({
        url: '../sell_scen/sell_scen?show=' + show
      })
    } else {
      data.session.venue_map = ""
      var show = JSON.stringify(data)
      wx.navigateTo({
        url: '../sell_form/sell_form?sellShow=' + show
      })
    }
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