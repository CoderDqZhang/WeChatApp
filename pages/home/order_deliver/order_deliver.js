// pages/home/order_deliver/order_deliver.js
var app = getApp()
Page({
  data: {
    order: null,
    deliverArray: ["顺丰", "EMS", "圆通", "中通", "申通", "宅急送", "韵达"],
    temp_deliver: "顺丰",
    changeIndex: 0,
    winHeight: 0,
    winWidth: 0,
    form: {
      "express_name": "SF",
      "express_num": ""
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      order: JSON.parse(options.order)
    })
    this.genderData()
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth,
        })
      }
    })
    let data = app.data.deliver
    for (var i = 0; i < data.length; i++) {
      console.log(data[i].key)
    }
    console.log(data)
  },
  genderData: function () {
    var that = this
    if (this.data.order.delivery_type == 1 || this.data.order.delivery_type == 4) {
      this.setData({
        delivery_type: "配送方式：快递到付",
        name: "收货人：" + that.data.order.address.name + "      " + that.data.order.address.mobile_num,
        address: "配送地址：" + that.data.order.address.address,
        ticketStatus: that.data.order.status_desc,
        isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
      })
    } else {
      if (this.data.order.status == 3) {
        this.setData({
          nextButtonHeight: 45
        })
      }
      this.setData({
        delivery_type: "配送方式：" + that.data.order.delivery_type == 2 ? "现场取票" : "上门自取",
        name: that.data.order.name,
        address: that.data.order.phone,
        ticketStatus: that.data.order.status_desc,
        isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
      })
    }
  },
  sellTypePickerChange: function (e) {
    this.setData({
      'form.express_name': app.data.deliver[this.data.deliverArray[e.detail.value]],
      changeIndex: e.detail.value,
      isSelect: true
    })
  },
  deliverInput: function (data) {
    var numberText = data.detail.value
    this.setData({
      'form.express_num': numberText
    })
  },

  nextTap: function (e) {

    var that = this

    var urls = "supplier/order/" + that.data.order.order_id + "/express/"
    app.func.requestPost(urls, this.data.form, function (res) {
      that.data.order.express_info = res
      var url = "order/" + that.data.order.order_id + "/"

      var data = { "status": "7" }
      app.func.requestPost(url, data, function (res) {
        that.data.order.status = res.status
        that.data.order.status_desc = res.status_desc
        that.data.order.supplier_status_desc = res.supplier_status_desc
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //关键在这里
          prePage.updataOrder(that.data.order)
        }
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
          success: function(res){
            // success
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        })
      });
    });
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