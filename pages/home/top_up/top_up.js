// pages/home/top_up/top_up.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topUpPrice:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      topUpPrice: options.amount,
    })
  },
  //充值的Input
  topUpPriceInput: function (data) {
    this.setData({
      topUpPrice: data.detail.value,
    })
  },
  formSubmit: function (e){
    var that = this
    var form = that.data.orderForm
    var data = { "amount": that.data.topUpPrice, "pay_type": "3"}
    app.func.requestPost('account/recharge/', data, function (res) {
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
      var wxpay = res.wxpay
      var payData = {
        // 'appId':wxpay.appid,
        'timeStamp': wxpay.timeStamp,
        'nonceStr': wxpay.nonceStr,
        'package': wxpay.package,
        'signType': 'MD5',
        'paySign': wxpay.sign,
      }
      wx.requestPayment({
        // 'appId':wxpay.appid,
        'timeStamp': wxpay.timeStamp,
        'nonceStr': wxpay.nonceStr,
        'package': wxpay.package,
        'signType': 'MD5',
        'paySign': wxpay.sign,
        'success': function (wres) {
          console.log(wres)
          //更新上一个页面的数据
          var pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.updateBlance((parseFloat(that.data.topUpPrice) * 100))
          }
          wx.navigateBack({
            
          })
        },
        'fail': function (res) {
          
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  }
})