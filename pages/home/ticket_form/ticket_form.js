// pages/home/ticket_form/ticket_form.js
var app = getApp()
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
    address: null,
    widowsWidth: 0,
    numbers: [],
    tempNumber: 1
  },

  changeData: function (data) {
    var that = this
    that.setData({
      address: data
    })
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        // success
        that.setData({
          windowWidth: res.windowWidth - 148
        })
        console.log(that.data.windowWidth)
      }
    })
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
    wx.getStorage({
      key: 'address',
      success: function(res){
        // success
        that.setData({
          address:res.data
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', this.data.numbers[e.detail.value] + 1)
    this.data.ticket.buy_number = parseInt(e.detail.value) + 1
    this.setData({
      index: e.detail.value,
      isSelect: true,
      regions: this.data.numbers[e.detail.value],
      allMuch: this.data.numbers[e.detail.value] * this.data.sessionShow.ticket.price + this.data.ticket.delivery_price,
      ticketMuch: this.data.numbers[e.detail.value] * this.data.sessionShow.ticket.price
    })
  },
  genderData: function (show) {
    var that = this;
    that.setData({
      sessionShow: JSON.parse(show),
      shareTitle: show.title
    })

    that.data.sessionShow.cover = that.data.sessionShow.cover + "?" + that.data.sessionShow.cover_end
    that.data.ticket = that.data.sessionShow.ticket
    var arr = that.data.ticket.delivery_type.split(',')
    var tempDevery = ""
    var tmpNumber = []
    console.log(that.data.sessionShow.ticket)
    if (that.data.sessionShow.ticket.sell_type == 2) {
      tmpNumber.push(that.data.sessionShow.ticket.remain_count)
      var much = that.data.sessionShow.ticket.remain_count * that.data.sessionShow.ticket.price
      that.setData({
        tempNumber: that.data.sessionShow.ticket.remain_count,
        allMuch: much,
        numbers: tmpNumber
      })
    } else {
      for (var i = 1; i <= that.data.sessionShow.ticket.remain_count; i++) {
        tmpNumber.push(i)
      }
      that.setData({
        numbers: tmpNumber,
        allMuch: that.data.sessionShow.ticket.price,
      })
    }
    console.log(that.data.allMuch)
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
      }else if (arr[i] == "4") {
        that.data.deliverys.push("快递到付")
        if (tempDevery == "") {
          tempDevery = 4
        }
      }
    }
    that.data.deliveryMuchs.push("普通快递（" + that.data.ticket.delivery_price.toString() + "）元")
    that.data.deliveryMuchs.push("顺丰快递（" + that.data.ticket.delivery_price_sf.toString() + "）元")
    var form = that.data.orderForm
    form.delivery_type = tempDevery
    form.delivery_price = that.data.ticket.delivery_price
    console.log(that.data.ticket.allMuch)
    that.setData({
      delivery_type: tempDevery,
      choosedelivery: that.data.deliverys[0],
      delivery_muchs: that.data.deliveryMuchs[0],
      allMuch: that.data.allMuch + that.data.ticket.delivery_price,
      ticketMuch: that.data.allMuch,
      // allMuch: "600"
    })
    console.log(that.data.allMuch)
  },
  chooseDelivery: function () {
    var that = this
    if (that.data.deliverys.length == 1) {
      return
    }
    wx.showActionSheet({
      itemList: that.data.deliverys,
      success: function (res) {
        if (!res.cancel) {
          if (that.data.deliverys[res.tapIndex] == "快递到付") {
          that.data.orderForm.delivery_type = 4

          } else if (that.data.deliverys[res.tapIndex] == "现场取票") {
          that.data.orderForm.delivery_type = 2

          }else if (that.data.deliverys[res.tapIndex] == "上门自取") {
          that.data.orderForm.delivery_type = 3

          }else if (that.data.deliverys[res.tapIndex] == "快递") {
          that.data.orderForm.delivery_type = 1

          }
          console.log(that.data.orderForm.delivery_type)
          that.setData({
            delivery_type: that.data.orderForm.delivery_type,
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
            allMuch: that.data.allMuch + (res.tapIndex == 0 ? that.data.ticket.delivery_price : that.data.ticket.delivery_price_sf)
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
    var data
    console.log(form)
    console.log(that.data)

    if (form.delivery_type == 1) {
      if (that.data.address == null) {
        wx.showModal({
          title: "请输入收货地址",
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
      data = {
        "ticket_id": that.data.ticket.id.toString(),
        "ticket_count": that.data.ticket.buy_number.toString(),
        "pay_type": "2",
        "address_id": that.data.address.id.toString(),
        "delivery_price": that.data.orderForm.delivery_price.toString(),
        "message": e.detail.value.message,
        "delivery_type": that.data.delivery_type.toString()
      }
    } else {
      data = {
        "ticket_id": that.data.ticket.id.toString(),
        "ticket_count": that.data.ticket.buy_number.toString(),
        "pay_type": "2",
        "delivery_type": that.data.delivery_type.toString(),
        "delivery_price": "0",
        "name": e.detail.value.name.toString(),
        "phone": e.detail.value.phone.toString(),
        "message": e.detail.value.message.toString(),
      }
    }
    console.log(data)
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 2000
    })
    app.func.requestPost('order/create/', data, function (res) {
      wx.hideToast()
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
      var wxpay = res.pay_url.wxpay
      var payData = {
        // 'appId':wxpay.appid,
        'timeStamp': wxpay.timeStamp,
        'nonceStr': wxpay.nonceStr,
        'package': wxpay.package,
        'signType': 'MD5',
        'paySign': wxpay.sign,
      }
      console.log(payData)
      wx.requestPayment({
        // 'appId':wxpay.appid,
        'timeStamp': wxpay.timeStamp,
        'nonceStr': wxpay.nonceStr,
        'package': wxpay.package,
        'signType': 'MD5',
        'paySign': wxpay.sign,
        'success': function (wres) {
          wx.switchTab({
            url: '../mine/mine'
          })
        },
        'fail': function (res) {
          wx.switchTab({
            url: '../mine/mine'
          })
          console.log(res)
        }
      })
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