// pages/sell/sell_form/sell_form.js
var app = getApp()
Page({
  data: {
    sessionShow: null,
    ticketPrice: [],
    numberTicket: 1,
    sellTicket: {},
    sellForm: {
      "show_session_ticket": "",
      "seat_type": "",
      "price": "",
      "region": "",
      "sell_type": "",
      "ticket_count": "",
      "row": ""
    },
    selectTicketPrice: "",
    sellPriceTicket: "",
    sellPrice: ""
  },
  onLoad: function (options) {
    if (options.ticketEdit != null) {
      var editData = JSON.parse(options.ticketEdit)
      console.log(editData)
      this.setData({
        sessionShow: editData.sessionShow,
        'sellForm.show_session_ticket': editData.ticket.id,
        'sellForm.seat_type': editData.ticket.seat_type,
        'sellForm.sell_type': editData.ticket.sell_type,
        'sellForm.ticket_count': editData.ticket.ticket_count,
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
        numberTicket: editData.ticket.ticket_count,
        sellPrice: editData.ticket.price,
        sellPriceTicket: editData.ticket.price,
        selectTicketPrice: editData.ticket.original_ticket.id
      })
      this.requestData()

    } else {
      this.setData({
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
        sellTicket: res
      })
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
    this.data.sellForm.show_session_ticket = this.data.selectTicketPrice
    this.data.sellForm.ticket_count = this.data.numberTicket
    this.data.sellForm.price = this.data.sellPrice
    console.log(this.data.sellForm)
    var confirm = { "sellForm": this.data.sellForm, "sellTicket": this.data.sellTicket, "ticketSession": this.data.sessionShow }
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