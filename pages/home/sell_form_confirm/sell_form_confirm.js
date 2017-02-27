// pages/sell/sell_form_confirm/sell_form_confirm.js
var app = getApp()
Page({
  data: {
    temp_sell_type: "单卖",
    temp_region_type: "请选择",
    temp_row_type: "请选择",
    temp_seat_type: "请选择",
    temp_delivery_type: "请选择",
    isCheck: false,
    deliveryStr: "",
    address: {
      "visite": {
        "phone": "",
        "location": "",
        "time": "",
        "isSelect": false
      },
      "site": {
        "phone": "",
        "location": "",
        "time": "",
        "isSelect": false
      },
      "express": {
        "isSelect": false
      },
      "userPay": {
        "isSelect": false
      }
    },
    sellTicket: {},
    sell_confim: null,
    sellType: "",
    seatType: "",
    sellRow: "",
    delivery_type: "",
    sellRegion: "",
    sellDelivery: "",
    selectType: false,
    selectRegion: false,
    selectRow: false,
    selectDelivery: false,
    sellMuch: 0.00,
    poundage: 0.00,
    sellSeat: [],
    winWidth: 0,
    winHeight: 0,

  },
  changeData: function (res) {
    this.data.sellDelivery = ""
    this.data.delivery_type = ""
    if (res.express.isSelect) {
      this.setData({
        sellDelivery: this.data.sellDelivery + "快递 ",
        delivery_type: this.data.delivery_type + "1,",
        selectDelivery: true
      })
    } else {
      this.setData({
        'address.express.isSelect': false
      })
    }
    if (res.userPay.isSelect) {
      this.setData({
        sellDelivery: this.data.sellDelivery + "快递到付 ",
        delivery_type: this.data.delivery_type + "4,",
        selectDelivery: true
      })
    } else {
      this.setData({
        'address.userPay.isSelect': false
      })
    }
    if (res.visite.isSelect) {
      this.setData({
        sellDelivery: this.data.sellDelivery + "现场取票 ",
        delivery_type: this.data.delivery_type + "2,",
        "sell_confim.sellForm.scene_get_ticket_date": res.visite.time,
        "sell_confim.sellForm.scene_get_ticket_address": res.visite.location,
        "sell_confim.sellForm.scene_get_ticket_phone": res.visite.phone,
        selectDelivery: true

      })
    } else {
      this.setData({
        'address.visite.isSelect': false
      })
    }
    if (res.site.isSelect) {
      this.setData({
        sellDelivery: this.data.sellDelivery + "上门取票 ",
        delivery_type: this.data.delivery_type + "3,",
        "sell_confim.sellForm.self_get_ticket_date": res.site.time,
        "sell_confim.sellForm.self_get_ticket_address": res.site.location,
        "sell_confim.sellForm.self_get_ticket_phone": res.site.phone,
        selectDelivery: true
      })
    } else {
      this.setData({
        'address.site.isSelect': false
      })
    }
    this.setData({
      "sell_confim.sellForm.delivery_type": this.data.delivery_type,
      address: res
    })
  },
  onLoad: function (options) {
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }

    });
    console.log(options.sell_confim)
    this.setData({
      sell_confim: JSON.parse(options.sell_confim),
    })
    console.log(this.data)
    this.genderData()
    // 页面初始化 options为页面跳转所带来的参数
  },
  genderData: function () {
    var tempSellType = []
    for (var i = 0; i < this.data.sell_confim.sellTicket.sell_type_choices.length; i++) {
      tempSellType.push(this.data.sell_confim.sellTicket.sell_type_choices[i][1])
    }
    var tempSellRgion = []
    for (var j = 0; j < this.data.sell_confim.sellTicket.region_choices.length; j++) {
      tempSellRgion.push(this.data.sell_confim.sellTicket.region_choices[j][0])
    }
    var tempSellRow = []
    tempSellRow.push("择优分配")
    for (var k = 0; k < this.data.sell_confim.sellTicket.row.length; k++) {
      tempSellRow.push(this.data.sell_confim.sellTicket.row[k])
    }
    this.setData({
      sellType: tempSellType,
      sellRegion: tempSellRgion,
      sellRow: tempSellRow,
      sellSeat: ["连座", "不连座"],
      sellMuch: this.data.sell_confim.sellForm.price * this.data.sell_confim.sellForm.ticket_count,
      poundage: (this.data.sell_confim.sellForm.price * this.data.sell_confim.sellForm.ticket_count * 0.01).toFixed(2)
    })
    if (this.data.sell_confim.sellForm.sell_type != "") {
      this.setData({
        temp_sell_type: this.data.sell_confim.sellForm.sell_type == 1 ? "单卖" : "必须一起卖",
      })
    } else {
      this.data.sell_confim.sellForm.sell_type = 1
      this.setData({
        temp_sell_type: this.data.sell_confim.sellForm.sell_type == 1 ? "单卖" : "必须一起卖",
      })
    }
    if (this.data.sell_confim.sellForm.region != "") {
      this.setData({
        temp_region_type: this.data.sell_confim.sellForm.region.split(' ')[0],
      })
    } else {
      this.data.sell_confim.sellForm.region = "择优分配"
      this.setData({
        temp_region_type: "择优分配",
      })
    }
    if (this.data.sell_confim.sellForm.row != "") {
      this.setData({
        temp_row_type: this.data.sell_confim.sellForm.row,
      })
    } else {
      this.data.sell_confim.sellForm.row = "择优分配"
      this.setData({
        temp_row_type: "择优分配",
      })
    }
    if (this.data.sell_confim.sellForm.seat_type != "") {
      this.setData({
        isCheck: this.data.sell_confim.sellForm.seat_type == "1" ? true : false,
        selectSeat: true,
        temp_seat_type: this.data.sell_confim.sellForm.seat_type == "1" ? "连座" : "不连座"
      })
    } else {
      this.data.sell_confim.sellForm.seat_type = "1"
      this.setData({
        temp_seat_type: "不连座"
      })
    }
    if (this.data.sell_confim.sellForm.delivery_type != "" && this.data.sell_confim.sellForm.delivery_type != null) {
      var delivery = ""
      var arr = this.data.sell_confim.sellForm.delivery_type.split(',')
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "1") {
          delivery = delivery + "快递 "
          this.setData({
            'address.express.isSelect': true
          })
        }
        if (arr[i] == "4") {
          delivery = delivery + "快递到付 "
          this.setData({
            'address.userPay.isSelect': true
          })
        }
        if (arr[i] == "2") {
          delivery = delivery + "现场取票 ",
            this.setData({
              'address.visite.isSelect': true
            })
        }
        if (arr[i] == "3") {
          delivery = delivery + "上门自取 ",
            this.setData({
              'address.site.isSelect': true
            })
        }
      }
      var sellForm = this.data.sell_confim.sellForm
      this.setData({
        deliveryStr: delivery,
        'address.site.scene_get_ticket_address': sellForm.scene_get_ticket_address,
        'address.site.scene_get_ticket_date': sellForm.scene_get_ticket_date,
        'address.site.scene_get_ticket_phone': sellForm.scene_get_ticket_phone,
        'address.visite.self_get_ticket_address': sellForm.self_get_ticket_address,
        'address.visite.self_get_ticket_date': sellForm.self_get_ticket_date,
        'address.visite.self_get_ticket_phone': sellForm.self_get_ticket_phone,
        'address.visite.scene_get_ticket_address': sellForm.scene_get_ticket_address
      })
    } else {
      // delivery = delivery + "快递到付 "
      this.setData({
        deliveryStr: "快递到付 ",
        sellDelivery: "快递到付 ",
        delivery_type: this.data.delivery_type + "4,",
        selectDelivery: true,
        "sell_confim.sellForm.delivery_type": "4,",
        'address.userPay.isSelect': true
      })
    }
  },

  sellTypePickerChange: function (e) {
    this.setData({
      changeIndex: e.detail.value,
      "sell_confim.sellForm.sell_type": e.detail.value == false ? "1" : "2",
      isSelect: true
    })
  },
  bindPickerSeat: function (e) {
    this.setData({
      seatIndex: e.detail.value,
      "sell_confim.sellForm.seat_type": parseInt(e.detail.value) + 1,
      selectSeat: true
    })
  },
  bindPickerRegion: function (e) {
    this.setData({
      regionIndex: e.detail.value,
      "sell_confim.sellForm.region": this.data.sellRegion[e.detail.value] == "" ? "择优分配" : this.data.sellRegion[e.detail.value],
      selectRegion: true
    })
  },
  bindPickerRow: function (e) {
    if (this.data.sell_confim.sellForm.region == "择优分配") {
      this.setData({
        rowIndex: "0",
        "sell_confim.sellForm.row": "择优分配",
        selectRow: true
      })
      return
    } else {
      this.setData({
        rowIndex: e.detail.value,
        "sell_confim.sellForm.row": this.data.sellRow[e.detail.value] == "" ? "择优分配" : this.data.sellRow[e.detail.value],
        selectRow: true
      })
    }
  },
  deliveryTap: function (e) {
    wx.navigateTo({
      url: '../sell_delivery/sell_delivery?address=' + JSON.stringify(this.data.address),
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
  nextTap: function () {
    console.log(this.data)
    var that = this
    var url = "supplier/show/" + this.data.sell_confim.ticketSession.id + "/session/" + this.data.sell_confim.ticketSession.session.id + "/ticket/"
    wx.showToast({
      title: '挂票中...',
      icon: 'loading',
      duration: 2000
    })
    app.func.requestPost(url, this.data.sell_confim.sellForm, function (res) {
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
      wx.showToast({
        title: '保存成功',
        icon: 'success',
        duration: 10000
      })

      setTimeout(function () {
        wx.hideToast()
      }, 2000)
      that.requestOneShowTicket()
    })
  },
  requestOneShowTicket: function () {
    var url = "supplier/show/" + this.data.sell_confim.ticketSession.id + "/ticket/"
    app.func.requestGet(url, {}, function (res) {
      console.log(res)
      var sessionShow = res.show
      sessionShow.session_list = res.session_list
      var userInfo = wx.getStorageSync('userInfo')
      sessionShow.lp_session_id = userInfo.data.lp_session_id
      if (sessionShow.session_list.length > 1) {
        var imageUrl = sessionShow.cover
        var arr = imageUrl.split('?')
        sessionShow.cover = arr[0]
        sessionShow.cover_end = arr[1]
        sessionShow.category.icon = ""
        var show = JSON.stringify(sellTicket)

        wx.navigateTo({
          url: '../scene/ticket_scen?sellShow=' + show,
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
      } else {
        var sessionShow = res.show
        sessionShow.session = sessionShow.session_list[0]
        var imageUrl = sessionShow.cover
        var arr = imageUrl.split('?')
        sessionShow.cover = arr[0]
        sessionShow.cover_end = arr[1]
        sessionShow.category.icon = ""
        sessionShow.venue.venue_map = ""
        console.log(sessionShow)
        // that.data.sessionShow.session = session
        var sellShow = JSON.stringify(sessionShow)
        wx.navigateTo({
          url: '../ticket_desc/ticket_desc?sellShow=' + sellShow,
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
      }
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