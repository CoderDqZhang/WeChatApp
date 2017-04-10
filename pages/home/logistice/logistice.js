// pages/home/logistice/logistice.js
Page({
  data: {
    express_info: null
  },
  onLoad: function (options) {
    this.setData({
      express_info: JSON.parse(options.logistice)
    })
    var name = this.data.express_info.ShipperCode
    var temp_name = ""
    if (name == "STO") {
      temp_name = "申通"
    } else if (name == "SF") {
      temp_name = "顺丰"
    } else if (name == "EMS") {
      temp_name = "EMS"
    } else if (name == "YTO") {
      temp_name = "圆通"
    } else if (name == "ZTO") {
      temp_name = "中通"
    } else if (name == "YD") {
      temp_name = "韵达"
    } else if (name == "ZJS") {
      temp_name = "宅急送"
    }
    this.setData({
      'express_info.ShipperCode':temp_name
    })
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
  }
})