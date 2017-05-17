// pages/sell/sell_form_confirm/sell_form_confirm.js
var app = getApp()
Page({
  data: {
    temp_sell_type: "可以分开卖",
    temp_region_type: "请选择",
    temp_row_type: "请选择",
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
    isRuleView: false,
    srollerViewHeight: 45,
    isSeat: true,
    isTicketStatus: false,
    isEditeTicket: false,
    disposite:0,
    isDespositView: false,
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
  updateBlance: function (amount) {
    var that = this
    this.setData({
      'sell_confim.sellTicket.balance': ((parseFloat( that.data.sell_confim.sellTicket.balance) * 100 + amount) / 100).toFixed(2)
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
    tempSellRow.push("随机")
    for (var k = 0; k < this.data.sell_confim.sellTicket.row.length; k++) {
      tempSellRow.push(this.data.sell_confim.sellTicket.row[k])
    }

    this.setData({
      sellType: tempSellType,
      sellRegion: tempSellRgion,
      sellRow: tempSellRow,
      sellMuch: this.data.sell_confim.sellForm.price * this.data.sell_confim.sellForm.ticket_count,
      poundage: (this.data.sell_confim.sellForm.price * this.data.sell_confim.sellForm.ticket_count * 0.01).toFixed(2),
      disposite: (this.data.sell_confim.sellForm.ticket_count * 50).toFixed(2),
      'sell_confim.sellTicket.balance': parseFloat(this.data.sell_confim.sellTicket.balance / 100).toFixed(2)
    })
    if (this.data.sell_confim.sellForm.sell_type != "") {
      this.setData({
        temp_sell_type: this.data.sell_confim.sellForm.sell_type == 1 ? "可以分开卖" : "必须一起卖",
      })
    } else {
      this.data.sell_confim.sellForm.sell_type = 1
      this.setData({
        temp_sell_type: this.data.sell_confim.sellForm.sell_type == 1 ? "可以分开卖" : "必须一起卖",
      })
    }
    if (this.data.sell_confim.sellForm.region != "") {
      this.setData({
        temp_region_type: this.data.sell_confim.sellForm.region.split(' ')[0],
        "sell_confim.sellForm.region": this.data.sell_confim.sellForm.region.split(' ')[0]
      })
    } else {
      this.data.sell_confim.sellForm.region = "随机"
      this.setData({
        temp_region_type: "随机",
      })
    }
    if (this.data.sell_confim.sellForm.row != "") {
      this.setData({
        temp_row_type: this.data.sell_confim.sellForm.row,
      })
    } else {
      this.data.sell_confim.sellForm.row = ""
      this.setData({
        temp_row_type: "随机",
      })
    }
    if (this.data.sell_confim.sellForm.ticket_count == 1) {
      this.data.sell_confim.sellForm.seat_type = "1"
      this.setData({
        isSeat: false
      })
    } else {
      this.setData({
        isSeat: true
      })
      if (this.data.sell_confim.sellForm.seat_type != "") {
        this.setData({
          selectSeat: this.data.sell_confim.sellForm.seat_type == "1" ? false : true,
        })
      } else {
        this.data.sell_confim.sellForm.seat_type = "1"
        this.setData({
          selectSeat: true
        })
      }
    }
    if (this.data.sell_confim.sellForm.sell_category == "1") {
      this.setData({
        isTicketStatus: false
      })
    } else {
      this.setData({
        isTicketStatus: true
      })
    }
    if (this.data.sell_confim.sellForm.delivery_type != "" && this.data.sell_confim.sellForm.delivery_type != null) {
      var delivery = ""
      var arr = this.data.sell_confim.sellForm.delivery_type.split(',')
      for (var i = 0; i < arr.length; i++) {
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
        sellDelivery: delivery,
        isEditeTicket: true,
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
        isEditeTicket: false,
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
  ticketSeatTap: function (e) {
    this.setData({
      "sell_confim.sellForm.seat_type": e.currentTarget.id == "1" ? "1" : "2",
      selectSeat: e.currentTarget.id == "2" ? true : false
    })
  },
  ticketStatusTap: function (e) {
    var that = this
    if (e.currentTarget.id == "1") {
      wx.showModal({
        title: "现票必须保证72小时内发货，期票发货时间需与买家商议。现票快递类违约不能付票，每张赔付50元，期票违约每张赔付100元.",
        confirmColor: "#4bd4c5",
        confirmText: "确定",
        success: function (res) {
          if (res.confirm) {
            that.setData({
              "sell_confim.sellForm.sell_category": e.currentTarget.id,
              isTicketStatus: e.currentTarget.id == "1" ? false : true,
              disposite: (that.data.sell_confim.sellForm.ticket_count * 100).toFixed(2)
            })
          }
        }
      })
    } else {
      console.log(e.currentTarget.id)
      that.setData({
        "sell_confim.sellForm.sell_category": parseInt(e.currentTarget.id),
        isTicketStatus: e.currentTarget.id == "1" ? false : true,
        disposite: (that.data.sell_confim.sellForm.ticket_count * 50).toFixed(2)
      })
    }
  },
//这个兼容老版本
  bindPickerRegion: function (e) {
    this.setData({
      regionIndex: e.detail.value,
      "sell_confim.sellForm.region": this.data.sellRegion[e.detail.value] == "" ? "择优分配" : this.data.sellRegion[e.detail.value],
      selectRegion: true
    })
  },
  bindPickerRow: function (e) {
    if (this.data.sell_confim.sellForm.region == "随机") {
      this.setData({
        rowIndex: "0",
        "sell_confim.sellForm.row": "",
        selectRow: true
      })
      return
    } else {
      this.setData({
        rowIndex: e.detail.value,
        "sell_confim.sellForm.row": this.data.sellRow[e.detail.value] == "" ? "" : this.data.sellRow[e.detail.value],
        selectRow: true
      })

      if (this.data.sell_confim.sellForm.row == "随机") {
        this.setData({
          "sell_confim.sellForm.row": ""
        })
      }
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
  //交易手续费说明点击
  cancelRuleView: function () {
    this.setData({
      isRuleView: this.data.isRuleView == false ? true : false,
      srollerViewHeight: this.data.isRuleView == false ? 220 : 45
    })
    console.log(this.data.srollerViewHeight)
  },
  //押金说明点击
  cancelDespositeView: function () {
    this.setData({
      isDespositView: this.data.isDespositView == false ? true : false,
      srollerViewHeight: this.data.isDespositView == false ? 220 : 45
    })
  },
  nextTap: function () {
    if (!this.data.isEditeTicket) {
      this.requestNewTicket()
    } else {
      this.requestEditeTicket()
    }
    console.log(this.data)

  },
  requestEditeTicket: function () {
    var that = this
    var url = "supplier/ticket/" + this.data.sell_confim.ticket.id + "/"
    wx.showToast({
      title: '修改中...',
      icon: 'loading',
      duration: 2000
    })
    app.func.requestPost(url, this.data.sell_confim.sellForm, function (res) {
      wx.hideToast()
      if (res.message != null) {
        wx.showModal({
          title: res.message,
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
      wx.navigateBack({
        delta: 2, // 回退前 delta(默认为1) 页面
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
    })
  },
  requestNewTicket: function () {
    var that = this
    if (that.data.sell_confim.sellTicket.need_deposit == true && parseFloat(that.data.disposite) > that.data.sell_confim.sellTicket.balance) {
      var blance = that.data.sell_confim.sellTicket.balance
      wx.showModal({
          title: "押金不足",
          content: "本次挂票，需缴纳押金共 " + that.data.disposite + "元，当前余额 " + blance +"元不足，请充值",
          showCancel: true,
          cancelText:"稍等一会",
          confirmText: "立即充值",
          confirmColor: "#4bd4c5",
          success: function (res) {
            if (res.confirm) {
              var amount = ((parseFloat(that.data.disposite * 100) - that.data.sell_confim.sellTicket.balance * 100) / 100).toFixed(2)
              wx.navigateTo({
                url: '../top_up/top_up?amount=' + amount,
              })
            }
          }
        })
      return
    }
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
      if (that.data.sell_confim.sellTicket.need_deposit == true){
        that.setData({
          'sell_confim.sellTicket.balance': ((that.data.sell_confim.sellTicket.balance * 100 - that.data.disposite * 100)/100).toFixed(2)
        })
      }
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
        for (var j = 0; j < sessionShow.session_list.length; j++) {
          sessionShow.session_list[j].venue_map = ""
        }
        sessionShow.venue.venue_map = ""
        var show = JSON.stringify(sessionShow)

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
        sessionShow.session.venue_map = ""
        console.log(sessionShow)
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