// pages/home/wallet/transactions/transactions.js
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
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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