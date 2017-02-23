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
    },
    address: {}
  },

  onLoad: function (options) {
    this.setData({
      address: JSON.parse(options.address)
    })
    if (this.data.address.isExpress) {
      this.setData({
        isExpressage: true,
        'deliveryForm.express.isSelect': true
      })
    }
    if (this.data.address.isVisite) {
      this.setData({
        isVisite: true,
        'deliveryForm.visite.isSelect': true,
        'deliveryForm.visite.location': this.data.address.scene_get_ticket_address,
        'deliveryForm.visite.time': this.data.address.scene_get_ticket_date,
        'deliveryForm.visite.phone': this.data.address.scene_get_ticket_phone
      })
    }
    if (this.data.address.isSite) {
      this.setData({
        isSite: true,
        'deliveryForm.site.isSelect': true,
        'deliveryForm.visite.isSelect': true,
        'deliveryForm.site.location': this.data.address.self_get_ticket_address,
        'deliveryForm.site.time': this.data.address.self_get_ticket_date,
        'deliveryForm.site.phone': this.data.address.self_get_ticket_phone
      })
    }
    console.log(this.data.address)
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
    if (this.data.deliveryForm.visite.isSelect) {
      if (this.data.deliveryForm.visite.time == "") {
        this.showTosk("请输入时间")
        return
      }
      if (this.data.deliveryForm.visite.phone == "") {
        this.showTosk("请输入电话")
        return
      }
      if (this.data.deliveryForm.visite.location == "") {
        this.showTosk("请输入地址")
        return
      }
    }
    if (this.data.deliveryForm.site.isSelect) {
      if (this.data.deliveryForm.site.time == "") {
        this.showTosk("请输入时间")
        return
      }
      if (this.data.deliveryForm.site.phone == "") {
        this.showTosk("请输入电话")
        return
      }
      if (this.data.deliveryForm.site.location == "") {
        this.showTosk("请输入地址")
        return
      }
    }
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.changeData(this.data.deliveryForm)
    }
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
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
  showTosk: function (str) {
    wx.showModal({
      title: str,
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