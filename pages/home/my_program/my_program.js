// pages/home/my_program/my_program.js
function ticketSellCount(data) {
  var ticketCount = 0
  if (data.session_list.count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      for (var j = 0; j < session.ticket_list.length; j++) {
        var ticket = session.ticket_list[j]
        if (ticket.status == 1) {
          ticketCount = ticketCount + ticket.remain_count
        }
      }
    }
  } else {
    for (var k = 0; k < data.session[0].ticket_list.length; k++) {
      var ticket = data.session[0].ticket_list[k]
      if (ticket.status == 1) {
        ticketCount = ticketCount + ticket.remainCount
      }
    }
  }
  return ticketCount
}

function ticketMinDiscount(data) {
  var min_discount = 1.00
  if (data.ticket_list.count != 1) {
    for (var j = 0; j < data.ticket_list.length; j++) {
      var discount = parseFloat(data.ticket_list[j].discount)
      if (discount < min_discount) {
        min_discount = discount
      }
    }
  } else {
    min_discount = parseFloat(data.ticket_list[0].discount)
  }
  return min_discount
}

function ticketMinDiscountShow(data) {
  var min_discount = 1.00
  if (data.session_list.count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var mindiscount = ticketMinDiscount(data.session_list[i])
      if (mindiscount < min_discount) {
        min_discount = mindiscount
      }
    }
  } else {
    min_discount = ticketMinDiscount(data.session_list[0])
  }
  return min_discount
}

function ticketSellManagerMinPrice(data) {
  var min_price = 0
  if (data.session_list.count != 1) {
    min_price = data.session_list[0].min_price
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      if (session.ticket_list.count != 1) {
        for (var j = 0; j < session.ticket_list.length; j++) {
          var ticket = session.ticket_list[j]
          if (ticket.price < min_price) {
            min_price = ticket.price
          }
        }
      } else {
        if (session.min_price < min_price) {
          min_price = session.min_price
        }
      }
    }
  } else {
    min_price = data.min_price
    if (data.session_list[0].ticket_list.count != 1) {
      for (var j = 0; j < data.session_list[0].ticket_list.length; j++) {
        var ticket = data.session_list[0].ticket_list[j]
        if (ticket.price < min_price) {
          min_price = ticket.price
        }
      }
    } else {
      min_price = data.session_list[0].ticket_list[0].price
    }
  }
  return min_price
}
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ticketSell: null,
    shareData: null,
    userInfoShow: null,
    windowsHeigth: 0,
    otherUserInfo: null,
    isOtherUserInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowsHeigth: res.windowHeight
        })
        // success
      }
    })
    if (options.show != null) {
      var shareData = JSON.parse(options.show)
      this.setData({
        isOtherUserInfo: true
      })
      this.requestSessionIDData(shareData.id)
      console.log('otherUserInfo' + shareData)
      wx.setStorageSync("otherUserInfo", shareData)
      wx.setNavigationBarTitle({
        title: '',
      })
      this.setData({
        userInfoShow: shareData
      })
    } else {
      this.requestData()
      var userInfo = wx.getStorageSync('userInfo')
      wx.setNavigationBarTitle({
        title: '',
      })
      if (userInfo != "") {
        this.setData({
          userInfoShow: userInfo.data
        })
      }
    }
  },

  requestSessionIDData: function (data) {
    var that = this
    app.func.requestGet('supplier/' + data + '/ticket/', {}, function (res) {
      console.log(res)
      for (var i = 0; i < res.length; i++) {
        var dic_count = (ticketMinDiscountShow(res[i]) * 10)
        var sellCount = ticketSellCount(res[i])
        var minPrice = ticketSellManagerMinPrice(res[i])
        res[i].min_discount = dic_count.toFixed(1)
        res[i].ticket_count = sellCount
        res[i].min_price = minPrice
      }
      that.setData({
        ticketSell: res,
        isNoneTicket: res.length == 0 ? true : false,
        isHaveSellManager: res.length == 0 ? true : false,
      })
      console.log(that.data.ticketSell)
    });
  },

  requestData: function () {
    var that = this
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading',
    //   suration: 10000
    // })
    app.func.requestGet('supplier/ticket/', {}, function (res) {
      console.log(res)
      for (var i = 0; i < res.length; i++) {
        var dic_count = (ticketMinDiscountShow(res[i]) * 10)
        var sellCount = ticketSellCount(res[i])
        var minPrice = ticketSellManagerMinPrice(res[i])
        res[i].min_discount = dic_count.toFixed(1)
        res[i].ticket_count = sellCount
        res[i].min_price = minPrice
      }
      that.setData({
        ticketSell: res,
        'shareData.ticketList': res,
        isHaveSellManager: res.length == 0 ? true : false,
      })
      console.log(that.data.ticketSell)
    });
    console.log(that.data.ticketSells)
  },
  showTap: function (event) {
    var data = event.currentTarget.dataset.show
    var imageUrl = data.cover
    var arr = imageUrl.split('?')
    data.cover = arr[0]
    data.cover_end = arr[1]
    data.category.icon = ""

    if (data.session_list.length > 1) {
      var show = JSON.stringify(data)
      console.log(show)
      wx.navigateTo({
        url: '../scene/ticket_scen?ticketList=' + show
      })
    } else {
      data.session_list[0].venue_map = ""
      data.session = data.session_list[0]
      var show = JSON.stringify(data)
      console.log(show)
      wx.navigateTo({
        url: '../ticket_desc/ticket_desc?ticketList=' + show
      })
    }
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
    var that = this
    var shareTitle = ""
    var userInfo
    if (!that.data.isOtherUserInfo) {
      userInfo = wx.getStorageSync('userInfo').data
      userInfo.avatar = userInfo.avatar.split('?')[0]
    }else{
      userInfo = wx.getStorageSync('otherUserInfo')
      userInfo.avatar = userInfo.avatar.split('?')[0]
    }
    var shareContent = JSON.stringify(userInfo)
    console.log('shareContent' + shareContent)
    var shareUrl = 'pages/home/my_program/my_program?show='
    return {
      title: userInfo.username,
      path: shareUrl + shareContent
    }
  }
})