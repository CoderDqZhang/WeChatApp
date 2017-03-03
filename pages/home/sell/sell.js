// pages/home/sell/sell.js
var app = getApp()
function ticketSellManagerMinMaxPrice(data) {
  var min_price = 0
  var max_price = 0
  if (data.session_list.count != 1) {
    min_price = data.session_list[0].min_price
    max_price = data.session_list[0].min_price
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      if (session.ticket_list.count != 1) {
        for (var j = 0; j < session.ticket_list.length; j++) {
          var ticket = session.ticket_list[j]
          if (ticket.price < min_price) {
            min_price = ticket.price
          }
          if (ticket.price > max_price) {
            max_price = ticket.price
          }
        }
      } else {
        if (session.min_price < min_price) {
          min_price = session.min_price
        }
        if (session.min_price > max_price) {
          max_price = session.min_price
        }
      }
    }
  } else {
    min_price = data.min_price
    max_price = data.min_price
    if (data.session_list[0].ticket_list.count != 1) {
      for (var j = 0; j < data.session_list[0].ticket_list.length; j++) {
        var ticket = data.session_list[0].ticket_list[j]
        if (ticket.price < min_price) {
          min_price = ticket.price
        }
        if (ticket.price > max_price) {
          max_price = ticket.price
        }
      }
    } else {
      min_price = data.session_list[0].ticket_list[0].price
      max_price = data.session_list[0].ticket_list[0].price
    }
  }
  if (min_price == max_price) {
    return min_price
  }
  return min_price + "-" + max_price

}
function ticketShowModelSession(data) {
  var sessionStr = ""
  if (data.session_list.count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      sessionStr = sessionStr + session.name + " "
    }
    return sessionStr
  } else {
    sessionStr = "、" + data.session_list[0].name
    sessionStr = sessionStr.substring(1, sessionStr.length)
    return sessionStr
  }
}

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

function ticketSoldCount(data) {
  var ticketSoldCount = 0
  if (data.session_list.count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      if (session.ticket_count != 1) {
        for (var j = 0; j < session.ticket_list.length; j++) {
          var ticket = session.ticket_list[j]
          ticketSoldCount = ticketSoldCount + ticket.sold_count
        }
      } else {
        ticketSoldCount = ticketSoldCount + session.ticket_list[0].sold_count
      }
    }
  } else {
    if (data.session_list[0].ticket_count != 1) {
      for (var k = 0; k < data.session_list[0].ticket_list.length; k++) {
        var ticket = data.session_list[0].ticket_list[k]
        ticketSoldCount = ticketSoldCount + ticket.sold_count
      }
    } else {
      ticketSoldCount = ticketSoldCount + data.session_list[0].ticket_list[0].sold_count
    }
  }
  return ticketSoldCount
}

function ticketShowModelTicketName(data) {
  var ticketName = ""
  if (data.session_count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i];
      if (session.ticket_count != 1) {
        for (var j = 0; j < session.ticket_list.length; j++) {
          var ticket = session.ticket_list[j]
          ticketName = ticketName + "、" + ticket.original_ticket.name

        }
      } else {
        ticketName = ticketName + "、" + session.ticket_list[0].original_ticket.name
      }
    }
  } else {
    if (data.session_list[0].ticket_count != 1) {
      for (var k = 0; k < data.session_list[0].ticket_list.length; k++) {
        var ticket = data.session_list[0].ticket_list[k]
        ticketName = ticketName + "、" + ticket.original_ticket.name
      }

    } else {
      ticketName = ticketName + "、" + data.session_list[0].ticket_list[0].original_ticket.name
    }
  }
  var arr = ticketName.split('、')
  arr = getArray(arr)
  ticketName = ""
  for (var l = 0; l < arr.length; l++) {
    ticketName = ticketName + "、" + arr[l]
  }
  // if (ticketName.length > 1){

  // }
  return ticketName.substring(2, ticketName.length)
}

function getArray(a) {
  var hash = {},
    len = a.length,
    result = [];

  for (var i = 0; i < len; i++) {
    if (!hash[a[i]]) {
      hash[a[i]] = true;
      result.push(a[i]);
    }
  }
  return result;
}

Page({
  data: {
    ticketSell: [],
    ticketSells: [],
    ticketList: "",
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    showText: "",
    showText1: "快去首页挑选喜欢的演出活动吧",
    isHaveOrder: false,
    isHaveSellManager: false,
    orders: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
    this.requestData()
    this.requestOrderData(false)
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  requestOrderData: function (isNext) {
    var that = this;
    that.setData({
      isHaveOrder: false
    })
    var tempTicket = that.data.orders
    var url
    if (isNext) {
      url = url = "supplier/order/?page=" + tempTicket.next_page
    } else {
      url = 'supplier/order/'
    }
    app.func.requestGet(url, {}, function (res) {
      console.log(res)
      if (isNext) {
        for (var j = 0; j < res.order_list.length; j++) {
          tempTicket.order_list.push(res.order_list[j])
        }
        tempTicket.next_page = res.next_page
        tempTicket.has_next = res.has_next
      } else {
        tempTicket = res
        console.log(tempTicket)
        wx.stopPullDownRefresh()
      }
      that.setData({
        isHaveOrder: tempTicket.order_list.length != 0 ? false : true,
        orders: tempTicket,
        showText: "还没有订单",
        showText1: "快去首页挑选喜欢的演出活动吧"
      })
    });
  },
  requestData: function () {
    var that = this
    app.func.requestGet('supplier/ticket/', {}, function (res) {
      console.log(res)
      that.setData({
        ticketSell: res,
        isHaveSellManager: res.length == 0 ? true : false,
      })
      console.log(that.data.ticketSell)
      that.genderData()
    });
    console.log(that.data.ticketSells)
  },
  genderData: function () {
    var that = this
    for (var i = 0; i < that.data.ticketSell.length; i++) {
      var ticketSellModel = that.data.ticketSell[i]
      ticketSellModel.sessionTitle = ticketShowModelSession(ticketSellModel)
      ticketSellModel.ticketCount = ticketSellCount(ticketSellModel)
      ticketSellModel.ticketSold = ticketSoldCount(ticketSellModel)
      ticketSellModel.ticketName = ticketShowModelTicketName(ticketSellModel)
      ticketSellModel.ticketPrice = ticketSellManagerMinMaxPrice(ticketSellModel)
    }
    that.setData({
      ticketSells: that.data.ticketSell
    })
  },
  sellTap: function (event) {
    var sellTicket = event.currentTarget.dataset.sellticket
    console.log(sellTicket)
    var userInfo = wx.getStorageSync('userInfo')
    sellTicket.lp_session_id = userInfo.data.lp_session_id

    if (sellTicket.session_list.length > 1) {
      var imageUrl = sellTicket.cover
      var arr = imageUrl.split('?')
      sellTicket.cover = arr[0]
      sellTicket.cover_end = arr[1]
      sellTicket.category.icon = ""
      for (var j = 0; j < sellTicket.session_list.length; j++) {
        sellTicket.session_list[j].venue_map = ""
      }
      sellTicket.venue.venue_map = ""
      var show = JSON.stringify(sellTicket)

      wx.navigateTo({
        url: '../scene/ticket_scen?sellShow=' + show,
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
    } else {
      var sessionShow = event.currentTarget.dataset.sellticket
      sessionShow.session = sessionShow.session_list[0]
      var imageUrl = sessionShow.cover
      var arr = imageUrl.split('?')
      sellTicket.cover = arr[0]
      sellTicket.cover_end = arr[1]
      sessionShow.category.icon = ""
      sessionShow.venue.venue_map = ""
      sessionShow.session.venue_map = ""
      console.log(sessionShow)
      // that.data.sessionShow.session = session
      var sellShow = JSON.stringify(sessionShow)
      wx.navigateTo({
        url: '../ticket_desc/ticket_desc?sellShow=' + sellShow,
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
  },
  orderTap: function (event) {
    var data = event.currentTarget.dataset.order
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
    var order = JSON.stringify(data)
    console.log(order)
    wx.navigateTo({
      url: '../order/order_detail?order=' + order
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