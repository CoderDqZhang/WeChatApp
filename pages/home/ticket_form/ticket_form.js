// pages/home/ticket_form/ticket_form.js
Page({
  data: {
    sessionShow: null,
    ticket: null,
    deliverys: [],
    choosedelivery: "",
    orderForm: {},
    delivery_type: 0,
    deliveryMuchs: [],
    delivery_muchs: "",
    allMuch: 0,
    ticketMuch: 0,
    address: null
  },
  onLoad: function (options) {
    this.genderData(options.show)
    var that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        wx.getStorage({
          key: res.data.data.id.toString(),
          success: function (ures) {
            console.log(ures)
            that.setData({
              address: ures.data
            })
          }
        })
      }
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  genderData: function (show) {
    var that = this;
    that.setData({
      sessionShow: JSON.parse(show),
    })
    that.data.sessionShow.cover = that.data.sessionShow.cover + "?" + that.data.sessionShow.cover_end
    that.data.ticket = that.data.sessionShow.ticket
    that.data.ticket.delivery_type = "1,2,3"
    var arr = that.data.ticket.delivery_type.split(',')
    var tempDevery = ""
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == "1") {
        that.data.deliverys.push("快递")
        if (tempDevery == "") {
          tempDevery = 1

        }

      } else if (arr[i] == "2") {
        that.data.deliverys.push("上门自取")
        if (tempDevery == "") {
          tempDevery = 2
        }
      } else if (arr[i] == "3") {
        that.data.deliverys.push("现场取票")
        if (tempDevery == "") {
          tempDevery = 3
        }
      }
    }
    that.data.deliveryMuchs.push("普通快递（" + that.data.ticket.delivery_price.toString() + "）元")
    that.data.deliveryMuchs.push("顺丰快递（" + that.data.ticket.delivery_price_sf.toString() + "）元")
    var form = that.data.orderForm
    form.delivery_type = tempDevery
    form.delivery_price =  that.data.ticket.delivery_price
    that.setData({
      delivery_type: tempDevery,
      choosedelivery: that.data.deliverys[0],
      delivery_muchs: that.data.deliveryMuchs[0],
      allMuch: that.data.ticket.all_much + that.data.ticket.delivery_price,
      ticketMuch: that.data.ticket.all_much
    })
  },
  chooseDelivery: function () {
    var that = this
    wx.showActionSheet({
      itemList: that.data.deliverys,
      success: function (res) {
        if (!res.cancel) {
          that.data.orderForm.delivery_type = res.tapIndex + 1
          console.log(that.data.orderForm.delivery_type)
          that.setData({
            delivery_type: res.tapIndex + 1,
            choosedelivery: that.data.deliverys[res.tapIndex]
          })
        }
      }
    })
  },
  deliveryMuchTap: function () {
    var that = this
    wx.showActionSheet({
      itemList: that.data.deliveryMuchs,
      success: function (res) {
        if (!res.cancel) {
          that.data.orderForm.delivery_price = res.tapIndex == 0 ? that.data.ticket.delivery_price : that.data.ticket.delivery_price_sf
          that.setData({
            delivery_muchs: that.data.deliveryMuchs[res.tapIndex],
            allMuch: that.data.ticket.all_much + (res.tapIndex == 0 ? that.data.ticket.delivery_price : that.data.ticket.delivery_price_sf)
          })
        }
      }
    })
  },
  addressTap: function () {
    wx.navigateTo({
      url: '../address/address'
    })
  },
  formSubmit: function (e) {
    var that = this
    var form = that.data.orderForm
    console.log(form)
    var data
    if (form.delivery_type == 1) {
      data = {
        "ticket_id": that.data.ticket.id,
        "ticket_count": that.data.ticket.buy_number,
        "pay_type": "0",
        "address_id": that.data.address.id,
        "delivery_price": that.data.orderForm.delivery_price,
        "message": e.detail.value.message,
        "delevery_type": that.data.delivery_type
      }
    } else {
      data = {
        "ticket_id": that.data.ticket.id,
        "ticket_count": that.data.ticket.buy_number,
        "pay_type": "0",
        "delevery_type": that.data.delivery_type,
        "delivery_price": "0",
        "name": e.detail.value.name,
        "phone": e.detail.value.phone,
        "message": e.detail.value.message,
      }
    }

    console.log(data)
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