// pages/home/withdraw/withdraw.js
var app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    allbalance: null,
    balance: null,
    alipay_acount:"",
    alipay_name:""
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
    wx.getStorage({
      key: 'alipay_account',
      success: function(res){
        // success
        that.setData({
          alipay_acount:res.data.alipay_account,
          alipay_name:res.data.alipay_name
        })
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    this.setData({
      balance: JSON.parse(options.balance)
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  allbalanceTap: function () {
    var that = this
    this.setData({
      allbalance: that.data.balance.balance
    })
  },
  formSubmit: function (e) {
    var that = this
    // console.log(parseFloat(that.data.balance.balance))
    // console.log(parseFloat(e.detail.value.much))
    if (parseInt(e.detail.value.much) < 50) {
      wx.showModal({
        title: "单笔提现金额须大于50元哦",
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#4bd4c5",
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return
    } else if (parseFloat(e.detail.value.much) > parseFloat(that.data.balance.balance)) {
      wx.showModal({
        title: "提取超出最大金额了",
        showCancel: false,
        confirmText: "知道了",
        confirmColor: "#4bd4c5",
        success: function (res) {
          if (res.confirm) {
            this.setData({
              allbalance: that.data.balance.balance
            })
            e.detail.value.much = that.data.balance.blance
          }
        }
      })
      return
    }
    var data = {
      "alipay_account": e.detail.value.phone,
      "alipay_name": e.detail.value.name,
      "amount": e.detail.value.much
    }
    wx.setStorage({
      key: 'alipay_account',
      data: data,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
    app.func.requestPost('account/withdraw/', data, function (res) {
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
      var pages = getCurrentPages();
      if (pages.length > 1) {
        //上一个页面实例对象
        var prePage = pages[pages.length - 2];
        //关键在这里
        prePage.updateBlance(-(parseFloat(e.detail.value.much) * 100))
      }
      that.pushComplet(data)
    })
  },
  pushComplet: function (data){
    wx.navigateTo({
        url: '../withdraw/withdraw_complet?withdraw='+JSON.stringify(data),
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
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