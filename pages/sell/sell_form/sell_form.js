// pages/sell/sell_form/sell_form.js
var app = getApp()
Page({
  data: {
    sessionShow: null,
    ticketPrice: [],
    numberTicket: 1,
    sellTicket: {
      "delivery_type_choices": [
        [
          "1",
          "快递"
        ],
        [
          "2",
          "现场自取"
        ],
        [
          "3",
          "上门自取"
        ]
      ],
      "sell_type_choices": [
        [
          "1",
          "单卖"
        ],
        [
          "2",
          "必须一起卖"
        ]
      ],
      "region_choices": [
        [
          "择优分配",
          "择优分配"
        ]
      ],
      "ticket_choices": [
        [
          "3535223114",
          "380"
        ],
        [
          "3535223109",
          "480"
        ],
        [
          "3535223108",
          "680"
        ],
        [
          "3535223111",
          "880"
        ],
        [
          "3535223110",
          "1280"
        ],
        [
          "3535223105",
          "1680"
        ]
      ],
      "seat_type_choices": [
        [
          "0",
          "默认"
        ],
        [
          "1",
          "连坐"
        ],
        [
          "2",
          "散座"
        ]
      ],
      "row": [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        48,
        49,
        50
      ]
    },
    sellForm: null
  },
  onLoad: function (options) {
    this.setData({
      sessionShow: JSON.parse(options.sellShow)
    })
    this.genderData()
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
      that.setData({
        sellForm: res
      })
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
        tempTicketChoice.isSelect = true
      }
      updataChoice.push(tempTicketChoice)
    }
    this.setData({
      ticketPrice: updataChoice
    })
    console.log()
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