// pages/sell/sell_form/sell_form.js
var app = getApp()
Page({
  data: {
    sessionShow: null,
    ticketPrice: [],
    numberTicket: 1,
    sellTicket: {},
    winWidth: 0,
    winHeight: 0,
    sellForm: {
      "show_session_ticket": "",
      "seat_type": "",
      "price": "",
      "region": "",
      "sell_type": "",
      "ticket_count": "",
      "row": "",
      "sell_category": "0"
    },
    ticket: null,
    selectTicketPrice: "",
    sellPriceTicket: "",
    sellPrice: "",
    isEditeTicke:false
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
    if (options.ticketEdit != null) {
      var editData = JSON.parse(options.ticketEdit)
      console.log(editData)
      this.setData({
        isEditeTicke: true,
        sessionShow: editData.sessionShow,
        'sellForm.show_session_ticket': editData.ticket.original_ticket.id,
        'sellForm.sell_category': editData.ticket.sell_category,
        'sellForm.seat_type': editData.ticket.seat_type,
        'sellForm.sell_type': editData.ticket.sell_type,
        'sellForm.ticket_count': editData.ticket.remain_count,
        'sellForm.price': editData.ticket.price,
        'sellForm.region': editData.ticket.region,
        'sellForm.row': editData.ticket.row,
        "sellForm.scene_get_ticket_date": editData.ticket.scene_get_ticket_date,
        "sellForm.scene_get_ticket_address": editData.ticket.scene_get_ticket_address,
        "sellForm.scene_get_ticket_phone": editData.ticket.scene_get_ticket_phone,
        "sellForm.self_get_ticket_date": editData.ticket.self_get_ticket_date,
        "sellForm.self_get_ticket_address": editData.ticket.self_get_ticket_address,
        "sellForm.self_get_ticket_phone": editData.ticket.self_get_ticket_phone,
        "sellForm.delivery_type": editData.ticket.delivery_type,
        "sellForm.seat_type": editData.ticket.seat_type,
        "sellForm.sell_type": editData.ticket.sell_type,
        numberTicket: editData.ticket.remain_count,
        sellPrice: editData.ticket.price,
        sellPriceTicket: editData.ticket.price,
        selectTicketPrice: editData.ticket.original_ticket.id,
        ticket: editData.ticket
      })
      this.requestData()

    } else {
      this.setData({
        isEditeTicke: false,
        sessionShow: JSON.parse(options.sellShow)
      })
      this.requestData()

      console.log(this.data.sellTicket)
      console.log(this.data.sessionShow)
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  genderData: function () {
    var tempChoices = []
    var that = this
    for (var i = 0; i < this.data.sellTicket.ticket_choices.length; i++) {
      var isSelect = false
      if (that.data.selectTicketPrice != "") {
        if (that.data.selectTicketPrice == this.data.sellTicket.ticket_choices[i][0]) {
          isSelect = true
          this.data.selectTicketPrice = this.data.sellTicket.ticket_choices[i][0]
        }
      } else {
        if (i == 0) {
          isSelect = true
          this.data.selectTicketPrice = this.data.sellTicket.ticket_choices[i][0]
        }
      }

      tempChoices.push({ "id": this.data.sellTicket.ticket_choices[i][1], "name": this.data.sellTicket.ticket_choices[i][0], "price": "100", "isSelect": isSelect })
    }
    this.setData({
      ticketPrice: tempChoices
    })
  },
  requestData: function () {
    var that = this
    var url = "supplier/show/" + that.data.sessionShow.id + "/session/" + that.data.sessionShow.session.id + "/ticket/"
    app.func.requestGet(url, {}, function (res) {
      console.log(res)
      that.setData({
        sellTicket: res,

      })
      if (that.ticket != null) {
        that.setData({
          "sellTicket.id": that.data.ticket.id
        })
      }
      that.genderData()
      console.log(that.data.sellForm)
    });
  },
  ticketPriceTap: function (event) {
    console.log(event.currentTarget.dataset.ticketchoice)
    var updataChoice = []
    console.log(this.data.ticketPrice.length)
    for (var i = 0; i < this.data.ticketPrice.length; i++) {
      var tempTicketChoice = this.data.ticketPrice[i]
      if (tempTicketChoice.name != event.currentTarget.dataset.ticketchoice.name) {
        tempTicketChoice.isSelect = false
      } else {
        this.data.selectTicketPrice = tempTicketChoice.name
        tempTicketChoice.isSelect = true
      }
      updataChoice.push(tempTicketChoice)
    }
    this.setData({
      ticketPrice: updataChoice
    })
  },

  buttonSbTap: function () {

    if (this.data.numberTicket != 1) {
      this.setData({
        numberTicket: this.data.numberTicket - 1
      })
    }
  },

  buttonAddTap: function () {
    this.setData({
      numberTicket: this.data.numberTicket + 1
    })
  },
  numberInput: function (data) {
    var numberText = parseInt(data.detail.value)
    this.setData({
      numberTicket: numberText
    })
  },
  sellPriceInput: function (data) {
    var sellPrice = parseInt(data.detail.value)
    this.setData({
      sellPrice: sellPrice,
      sellPriceTicket: sellPrice == "0" ? "" : sellPrice
    })
  },
  nextTap: function () {
    var that = this
    let url = "supplier/ticket/" + that.data.selectTicketPrice + "/regions/"
    app.func.requestGet(url, {}, function (res) {
      console.log(res)
      that.setData({
        'sellTicket.region_choices': res,
      })
      that.data.sellForm.show_session_ticket = that.data.selectTicketPrice
      that.data.sellForm.ticket_count = that.data.numberTicket
      that.data.sellForm.price = that.data.sellPrice
      console.log(that.data.sellForm)
      var confirm = { "sellForm": that.data.sellForm, "sellTicket": that.data.sellTicket, "ticketSession": that.data.sessionShow, 'ticket': that.data.ticket }
      wx.navigateTo({
        url: '../sell_form_confirm/sell_form_confirm?sell_confim=' + JSON.stringify(confirm),
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
    });
  },
  showTap: function () {
    wx.showModal({
      title: "请输入售卖价格",
      showCancel: false,
      confirmText: "知道了",
      confirmColor: "#4bd4c5",
      success: function (res) {
        if (res.confirm) {
        }
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