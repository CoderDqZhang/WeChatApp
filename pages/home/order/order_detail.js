// pages/home/order/order_detail.js
var MD5 = require('../utils/jqueryMD5.js');
var base64 = require('../utils/base64.js');
var app = getApp()
Page({
  data: {
    order: {},
    delivery_type: "",
    name: "",
    address: "",
    ticketStatus: "",
    isHandel: false,
    isHaveConnect: false,
    winWidth: 0,
    winHeight: 0,
    nextButtonHeight: 0,
    express_name: "",
    express_num: "",
    delivery_info: null,
    accpetStatus: "",
    accpetTime: "",
    isDone: false
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth,
        })
      }
    })
    console.log(options.order)
    this.setData({
      order: JSON.parse(options.order)
    })
    this.genderData()
    console.log(this.data.order)
    console.log(this.data.order.ticket.supplier)
    if (this.data.order.ticket.supplier != null && this.data.order.status != 0 && this.data.order.delivery_type != 1) {
      this.setData({
        isHaveConnect: true
      })
    }
    if (this.data.order.status >= 7) {
      this.requestExpress()
    }
    // 页面初始化 options为页面跳转所带来的参数
  },
  updataOrder: function (order) {
    order.show = this.data.order.show
    order.session = this.data.order.session
    order.ticket = this.data.order.ticket
    this.setData({
      order: order,
      isDone: true,
      nextButtonHeight: 0
    });
    if (this.data.order.status >= 7) {
      this.requestExpress()
    }

    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.upateOrderList(res)
    }

  },
  genderData: function () {
    var that = this
    if (this.data.order.orderStatus == "user") {
      if (this.data.order.status == 0 || this.data.order.status == 7) {
        this.setData({
          nextButtonHeight: 45
        })
      }
      if (this.data.order.delivery_type == 1 || this.data.order.delivery_type == 4) {
        this.setData({
          delivery_type: "配送方式：快递到付",
          name: "收货人：" + that.data.order.address.name + "      " + that.data.order.address.mobile_num,
          address: "配送地址：" + that.data.order.address.address,
          ticketStatus: that.data.order.status_desc,
          isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
        })
      } else {
        if (this.data.order.status == 3) {
          this.setData({
            nextButtonHeight: 45
          })
        }
        this.setData({
          delivery_type: "配送方式：" + that.data.order.delivery_type == 2 ? "现场取票" : "上门自取",
          name: that.data.order.name,
          address: that.data.order.phone,
          ticketStatus: that.data.order.status_desc,
          isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
        })
      }
    } else {
      if (this.data.order.delivery_type == 1 || this.data.order.delivery_type == 4) {
        this.setData({
          delivery_type: "配送方式：快递到付",
          name: "收货人：" + that.data.order.address.name + "      " + that.data.order.address.mobile_num,
          address: "配送地址：" + that.data.order.address.address,
          ticketStatus: that.data.order.supplier_status_desc,
          isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
        })
      } else {
        this.setData({
          delivery_type: "配送方式：" + that.data.order.delivery_type == 2 ? "现场取票" : "上门自取",
          name: that.data.order.name,
          address: that.data.order.phone,
          ticketStatus: that.data.order.supplier_status_desc,
          isHandel: that.data.order.status == 1 || that.data.order.status == 2 || that.data.order.status == 5 ? false : true
        })
      }
    }

  },
  requestExpress: function (e) {
    var that = this
    var requestData = { "LogisticCode": that.data.order.express_info.express_num, "ShipperCode": that.data.order.express_info.express_name }

    var requestSigin = JSON.stringify(requestData) + app.data.expressDelivierKey
    // var dataSigin = 
    var msd5 = MD5.hexMD5(requestSigin);
    var base64Data = base64.encode(msd5);
    var data = {
      "RequestType": "1002",
      "RequestData": encodeURI(JSON.stringify(requestData)),
      "DataSign": base64Data,
      "EBusinessID": app.data.expressDelivierEBusinessID,
      "DataType": "2",
    }
    wx.request({
      url: 'https://api.liangpiao.me/ebusiness_order/',
      data: data,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "postman-token": "670bcadb-9b3e-74b1-1ea6-330c4492d1f9"
      }, // 设置请求的 header
      success: function (res) {
        // success
        if (res.data.data.Success) {
          if (res.data.data.Traces.length == 0) {
            var name = that.data.order.express_info.express_name
            var temp_name = ""
            if (name == "STO") {
              temp_name = "申通"
            } else if (name == "SF") {
              temp_name = "顺丰"
            } else if (name == "EMS") {
              temp_name = "EMS"
            } else if (name == "YTO") {
              temp_name = "YTO"
            } else if (name == "ZTO") {
              temp_name = "ZTO"
            } else if (name == "YD") {
              temp_name = "YD"
            } else if (name == "ZJS") {
              temp_name = "ZJS"
            }
            var traces = { "AcceptStation": temp_name, "AcceptTime": "快递编号：" + that.data.order.express_info.express_num }
            res.data.data.Traces.push(traces)
          }
          res.data.data.Traces = res.data.data.Traces.reverse()
          that.setData({
            delivery_info: res.data.data,
            accpetStatus: res.data.data.Traces[0].AcceptStation,
            accpetTime: res.data.data.Traces[0].AcceptTime,
          })
          console.log(that.data.delivery_info)
        }
      },
      fail: function (res) {
        // fail
        console.log(res)
      },
      complete: function (res) {
        // complete
      }
    })
  },
  callPhone: function (e) {
    console.log(this.data.order)
    wx.makePhoneCall({
      phoneNumber: this.data.order.ticket.supplier.mobile_num,
      success: function (res) {
        // success
      }
    })
  },

  logisticeTap: function (e) {
    var express_info = this.data.delivery_info
    wx.navigateTo({
      url: '../logistice/logistice?logistice=' + JSON.stringify(express_info),
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },

  nextTap: function (e) {
    var that = this
    var url = "order/" + that.data.order.order_id + "/"
    var data
    if (this.data.order.status == 7) {
      wx.showModal({
        title: "是否已经收到演出票",
        showCancel: true,
        cancelText: "取消",
        confirmText: "知道了",
        confirmColor: "#4bd4c5",
        success: function (res) {
          if (res.confirm) {
            data = { "status": "8" }
            app.func.requestPost(url, data, function (res) {
              console.log(res)
              if (res.errors != null) {
                wx.showModal({
                  title: res.errors[0].error[0].toString(),
                  showCancel: false,
                  confirmText: "知道了",
                  confirmColor: "#4bd4c5",
                  success: function (uwres) {
                    if (uwres.confirm) {
                    }
                  }
                })
                return
              }
              var orderStatus = that.data.order.orderStatus
              var tempOrder = that.data.order
              tempOrder.status = res.status
              tempOrder.status_desc = res.status_desc
              tempOrder.supplier_status_desc = res.supplier_status_desc
              that.setData({
                ticketStatus: res.status_desc,
                order: tempOrder,
                isDone: true,
                nextButtonHeight: 0
              })
              var pages = getCurrentPages();
              if (pages.length > 1) {
                //上一个页面实例对象
                var prePage = pages[pages.length - 2];
                //关键在这里
                prePage.upateOrderList(tempOrder)
              }
            });
          }
        }
      })
    } else if (this.data.order.status == 3) {
      var data = this.data.order
      var imageUrl = data.show.cover
      var arr = imageUrl.split('?')
      data.show.cover = arr[0]
      data.show.cover_end = arr[1]
      var imageS = data.session.venue_map
      var urls = imageS.split('?')
      data.session.venue_map = urls[0]
      data.session.venue_end = urls[1]
      var imageIcon = data.show.category.icon
      var iconUrls = imageIcon.split('?')
      data.show.category.icon = iconUrls[0]
      data.show.category.icon_end = iconUrls[1]
      data.orderStatus = "user"
      var order = JSON.stringify(data)
      wx.navigateTo({
        url: '../order_deliver/order_deliver?order=' + order,
        success: function (res) {
          // success
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
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