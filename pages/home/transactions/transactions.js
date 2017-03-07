// pages/home/wallet/transactions/transactions.js
var app = getApp()
Page({
  data: {
    transactions: {
      "has_next": false,
      "his_list": [
        {
          "amount": 10000,
          "balance": 89999,
          "created": "2016-12-14 14:10",
          "desc": "提现",
          "option_desc": "-"
        },
        {
          "amount": 1,
          "balance": 99999,
          "created": "2016-12-13 19:28",
          "desc": "提现",
          "option_desc": "-"
        }
      ],
      "next_page": 0,
      "total": 2
    },
    isHaveTransan: false,
    winWidth: 0,
    winHeight: 0,
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
    this.requestData(false)
    // 页面初始化 options为页面跳转所带来的参数
  },
  requestData: function (isNext) {
    var that = this;
    // that.setData({
    //     isHaveOrder: false
    // })
    var tempTicket = that.data.transactions
    var url
    if (isNext) {
      url = url = "account/history/?page=" + tempTicket.next_page
    } else {
      url = 'account/history/'
    }
    app.func.requestGet(url, {}, function (res) {
      if (isNext) {
        for (var j = 0; j < res.his_list.length; j++) {
          res.his_list[j].amount = (res.his_list[j].amount / 100).toFixed(2)
          tempTicket.his_list.push(res.his_list[j])
        }
        tempTicket.next_page = res.next_page
        tempTicket.has_next = res.has_next
      } else {
        for (var j = 0; j < res.his_list.length; j++) {
          res.his_list[j].amount = (res.his_list[j].amount / 100).toFixed(2)
        }
        tempTicket = res
        console.log(tempTicket)
        wx.stopPullDownRefresh()

      }
      that.setData({
        isHaveTransan: tempTicket.his_list.length != 0 ? false : true,
        transactions: tempTicket,
      })
    });
  },
  onPullDownRefresh: function () {
    var that = this
    that.requestData(false)
  },

  onReachBottom: function () {
    var that = this
    if (that.data.transactions.has_next) {
      that.requestData(true)
    } else {
      return
    }
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