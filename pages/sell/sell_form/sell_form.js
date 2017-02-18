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
    sellPriceTicket: 1,
    sellPrice: ""
  },
  onLoad: function (options) {
    this.setData({
      sessionShow: JSON.parse(options.sellShow)
    })
    console.log(this.data.sellTicket)
    console.log(this.data.sessionShow)
    this.requestData()
    // 页面初始化 options为页面跳转所带来的参数
  },
  genderData: function () {
    var tempChoices = []
    for (var i = 0; i < this.data.sellTicket.ticket_choices.length; i++) {
      var isSelect = false
      if (i == 0) {
        isSelect = true
        this.data.selectTicketPrice = this.data.sellTicket.ticket_choices[i][0]
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
      sellPrice: sellPrice
    })
  },
  nextTap: function () {
    this.data.sellForm.show_session_ticket = this.data.selectTicketPrice
    this.data.sellForm.ticket_count = this.data.numberTicket
    this.data.sellForm.price = this.data.sellPrice
    console.log(this.data.sellForm)
    var confirm = { "sellForm": this.data.sellForm, "sellTicket": this.data.sellTicket,"ticketSession":this.data.sessionShow}
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