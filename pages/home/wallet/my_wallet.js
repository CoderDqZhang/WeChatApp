// pages/home/wallet/wallet/my_wallet.js
var app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    wallet:{},
    isRuleView:false
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
    // 页面初始化 options为页面跳转所带来的参数
    that.requestData()
  },


//充值完成后更新数据
updateBlance: function (amount) {
  var that = this
  var blance = that.data.wallet.balance * 100 + amount
  that.setData({
    'wallet.balance': (blance / 100).toFixed(2)
  })
},

  requestData: function () {
    var that = this
    app.func.requestGet('account/', {}, function (res) {
      res.balance = (res.balance / 100).toFixed(2)
      res.deposit = (res.deposit / 100).toFixed(2)
      res.pending_balance = (res.pending_balance / 100).toFixed(2)
      that.setData({
        wallet:res
      })
    });
  },
  cancelRuleView: function (){
    this.setData({
      isRuleView: this.data.isRuleView == false ? true : false
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
  },
  transactionsTap: function () {
    wx.navigateTo({
      url: '../transactions/transactions',
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
  //充值按钮点击
  topUpTap: function () {
    wx.navigateTo({
      url: '../top_up/top_up',
    })
  },
  //提现按钮点击
  withdrawTap: function () {
    wx.navigateTo({
      url: '../withdraw/withdraw?balance=' + JSON.stringify(this.data.wallet),
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
})