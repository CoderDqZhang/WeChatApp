// pages/home/order/order_detail.js
Page({
  data: {
    order: {},
    delivery_type: "",
    name: "",
    address: "",
    ticketStatus: "",
    isHandel: false,
    isHaveConnect: false
  },
  onLoad: function (options) {
    console.log(options.order)
    this.setData({
      order: JSON.parse(options.order)
    })
    this.genderData()
    console.log(this.data.order)
    console.log(this.data.order.ticket.supplier)
    if (this.data.order.ticket.supplier != null && this.data.order.status != 0 && this.data.order.delivery_type != 1){
      this.setData({
        isHaveConnect: true
      })
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  genderData: function () {
    var that = this
    if (this.data.order.type == "user") {
      if (this.data.order.delivery_type == 1) {
        this.setData({
          delivery_type: "配送方式：快递到付",
          name: "收货人：" + that.data.order.address.name + "      " + that.data.order.address.mobile_num,
          address: "配送地址" + that.data.order.address.address,
          ticketStatus: that.data.order.status_desc,
          isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
        })
      } else {
        this.setData({
          delivery_type: "配送方式：" + that.data.order.delivery_type == 2 ? "现场取票" : "上门自取",
          name: that.data.order.name,
          address: that.data.order.phone,
          ticketStatus: that.data.order.status_desc,
          isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
        })
      }
    } else {
      if (this.data.order.delivery_type == 1) {
        this.setData({
          delivery_type: "配送方式：快递到付",
          name: "收货人：" + that.data.order.address.name + "      " + that.data.order.address.mobile_num,
          address: "配送地址：" + that.data.order.address.address,
          ticketStatus: that.data.order.supplier_status_desc,
          isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
        })
      } else {
        this.setData({
          delivery_type: "配送方式：" + that.data.order.delivery_type == 2 ? "现场取票" : "上门自取",
          name: that.data.order.name,
          address: that.data.order.phone,
          ticketStatus: that.data.order.supplier_status_desc,
          isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
        })
      }
    }

  },
  callPhone: function (e) {
    console.log(this.data.order)
    wx.makePhoneCall({
      phoneNumber: this.data.order.ticket.supplier.mobile_num,
      success: function (res) {
        // success
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