// pages/sell/sell_delivery/sell_delivery.js
Page({
  data: {
    delivery_type_choices: [
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
    isVisite: false,
    isSite: false,
    isExpressage: false,
    deliveryForm: {
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
      }
    }
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  expressChange: function (e) {
    this.setData({
      isExpressage: e.detail.value,
      'deliveryForm.express.isSelect': e.detail.value
    })
  },
  siteChange: function (e) {
    this.setData({
      isSite: e.detail.value,
      'deliveryForm.site.isSelect': e.detail.value
    })
  },
  visitChange: function (e) {
    this.setData({
      isVisite: e.detail.value,
      'deliveryForm.visite.isSelect': e.detail.value
    })
  },
  visitLocation: function (e) {
    var visitLocation = e.detail.value
    this.setData({
      'deliveryForm.visite.location': visitLocation
    })
  },
  visitTime: function (e) {
    var visitTime = e.detail.value
    this.setData({
      'deliveryForm.visite.time': visitTime
    })
  },
  visitPhone: function (e) {
    var visitPhone = e.detail.value
    this.setData({
      'deliveryForm.visite.phone': visitPhone
    })
  },
  phone: function (e) {
    var phone = e.detail.value
    this.setData({
      'deliveryForm.site.phone': phone
    })
  },
  time: function (e) {
    var time = e.detail.value
    this.setData({
      'deliveryForm.site.time': time
    })
  },
  location: function (e) {
    var location = e.detail.value
    this.setData({
      'deliveryForm.site.location': location
    })
  },
  nextTap: function () {
    console.log(this.data)
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.changeData(this.data.deliveryForm)
    }
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
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
    // try {
    //   wx.setStorageSync("快递", ures)
    //   wx.navigateBack({
    //     delta: 1
    //   })
    //   wx.showToast({
    //     title: '保存成功',
    //     icon: 'success',
    //     duration: 10000
    //   })

    //   setTimeout(function () {
    //     wx.hideToast()
    //   }, 2000)
    // } catch (e) {
    //   console.log(e)
    // }
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