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
  data: {
    text: "",
    categoryArray: [],
    ticketShow: [],
    catagorys: [],
    userInfo: {},
    isAllowUser: false,
    winWidth: 0,
    winHeight: 0,
    searchBarWidth: 0,
    inputValue: "",
    isInPut: false,
    searchList: null,
    searchText: "",
    searchHistory: [],
    //绑定某个商家后的数据
    isUserSession: false,
    ticketSell: null,
    isNoneTicket:false,
    title: '',
    avatar:'',
    shareData: null
  },
  onLoad: function (opt) {
    console.log("首页数据")
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth,
          searchBarWidth: res.windowWidth - 16
        })
      }
    })
    //调用应用实例的方法获取全局数据
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo != "") {
      that.setData({
        isAllowUser: false
      })
    } else {
      that.setData({
        isAllowUser: true
      })
    }
    if (opt.ticketList != null) {
      var that = this
      console.log("opt.ticketList" + opt.ticketList)
      var ticketList = JSON.parse(opt.ticketList)
      console.log(ticketList)
      this.setData({
        isUserSession: true,
      })
      this.setData({
        title: ticketList.username,
        avatar: ticketList.avatar,
      })
      wx.setStorageSync("otherUserInfo", ticketList)
      this.requestSessionIDData(ticketList.id)
    } else {
      var otherUserInfo = wx.getStorageSync('otherUserInfo')
      if (otherUserInfo != null && otherUserInfo.role == "supplier") {
        wx.setNavigationBarTitle({
          title: '',
        })
        that.setData({
          title: otherUserInfo.username,
          avatar: otherUserInfo.avatar,
          isUserSession: true,
        })
        that.requestSessionIDData(otherUserInfo.id)
      } else {
        wx.setNavigationBarTitle({
          title: '良票演出',
        })
        that.requestData()
      }
    }
  },
  requestSessionIDData: function (data) {
    var that = this
    // data = '3535216720'
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

    wx.showToast({
      title: '加载中',
      icon: 'loading',
      suration: 10000
    })
    console.log("请求数据")
    var that = this;
    var tempData = [{}, {}, {}, {}, {
      name: "全部",
      title: "恋爱犀牛、仙剑",
      image: "",
      id: "0"
    }]
    app.func.requestGet('show/category/', {}, function (cres) {
      for (var j = 0; j < cres.length; j++) {
        console.log(cres[j])
        if (cres[j].name == "话剧歌剧") {
          tempData[1] = cres[j]
        }
        if (cres[j].name == "演唱会") {
          tempData[0] = cres[j]
        }
        if (cres[j].name == "音乐会") {
          tempData[2] = cres[j]
        }
        if (cres[j].name == "体育赛事") {
          tempData[3] = cres[j]
        }
      }

      that.setData({
        categoryArray: tempData,
        // isAllowUser: false
      })
    });

    if (that.data.categoryArray.lenght < 1) {
      that.requestData()
    }
    app.func.requestGet('show/hot/', {}, function (res) {
      for (var i = 0; i < res.length; i++) {
        var dic_count = res[i].min_discount * 10
        res[i].min_discount = dic_count.toFixed(1)
      }
      that.setData({
        ticketShow: res
      })
    });
    setTimeout(function () {
      wx.hideToast()
    }, 500)
    wx.stopPullDownRefresh()
  },
  showTap: function (event) {
    var that = this
    if (this.data.searchText != '') {
      var searchHistory = wx.getStorageSync('searchHistoryTicket')
      if (searchHistory != null && searchHistory != '') {
        var isHaveKey = false
        for (var i = 0; i < searchHistory.length; i++) {
          if (searchHistory[i] == this.data.searchText) {
            isHaveKey = true
          }
        }
        if (!isHaveKey) {
          searchHistory.push(this.data.searchText)
        }

      } else {
        searchHistory = [this.data.searchText]
      }
      that.setData({
        searchHistory: searchHistory
      })
      wx.setStorageSync('searchHistoryTicket', searchHistory)
    }
    var data = event.currentTarget.dataset.show
    data.cover = ""
    data.category.icon = ""
    if (event.currentTarget.dataset.show.session_count > 1) {
      var show = JSON.stringify(data)
      console.log(show)
      wx.navigateTo({
        url: '../scene/ticket_scen?show=' + show
      })
    } else {
      data.session.venue_map = ""
      var show = JSON.stringify(data)
      console.log(show)
      wx.navigateTo({
        url: '../ticket_desc/ticket_desc?show=' + show
      })
    }
  },

  categoryTap: function (event) {
    var data = event.currentTarget.dataset.category
    data.icon = ""
    wx.navigateTo({
      url: '../category/category?categoty=' + JSON.stringify(data)
    })
  },
  onPullDownRefresh: function () {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo != "") {
      that.setData({
        isAllowUser: false
      })
      console.log(userInfo.data)
      that.requestData()
    } else {
      that.setData({
        isAllowUser: true
      })
      wx.stopPullDownRefresh()
    }
  },
  requestSearchData: function (data) {
    var that = this
    that.setData({
      searchText: data
    })
    var url = "show/search/?kw=" + data
    console.log(url)
    app.func.requestGet(url, {}, function (res) {
      for (var i = 0; i < res.show_list.length; i++) {
        var dic_count = res.show_list[i].min_discount * 10
        res.show_list[i].min_discount = dic_count.toFixed(1)
      }
      that.setData({
        searchList: res.show_list
      })
      console.log(that.data.searchList)
    });
  },
  cancelTap: function (e) {
    this.setData({
      isInPut: false,
      searchBarWidth: this.data.winWidth - 16,
      searchText: ""
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
    })
    this.requestSearchData(this.data.inputValue)
  },
  inputFocus: function (e) {
    this.setData({
      searchHistory: wx.getStorageSync('searchHistoryTicket')
    })
    this.setData({
      isInPut: true,
      searchBarWidth: this.data.winWidth - 75
    })
    console.log(e)
  },

  searchHistTap: function (e) {
    console.log(e)
    var index = e.currentTarget.id
    var data = this.data.searchHistory[parseInt(index)]
    this.requestSearchData(data)
  },

  searchHistoryCancelTap: function (e) {
    var that = this
    var index = e.currentTarget.id
    var list = that.data.searchHistory.splice(parseInt(index), 1)
    list = that.data.searchHistory
    that.setData({
      searchHistory: list
    })
    wx.setStorageSync("searchHistoryTicket", that.data.searchHistory)
    console.log(e)
  },

  pullDowne: function (e) {
    this.onPullDownRefresh()
  },

  //绑定某个商家的时候点击方法
  sessionShowTap: function (event) {
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var otherUserInfo = wx.getStorageSync('otherUserInfo')
    if (otherUserInfo != null && otherUserInfo.role == "supplier") {
      wx.setNavigationBarTitle({
        title: '',
      })

    } else {
      wx.setNavigationBarTitle({
        title: '良票演出',
      })
    }
  },
  onShareAppMessage: function () {
    var that = this
    if (this.data.isUserSession) {
      this.setData({
        shareData: wx.getStorageSync('otherUserInfo')
      })
      var data = JSON.stringify(this.data.shareData)
      return {
        title: that.data.title,
        path: 'pages/home/home/home?ticketList=' + data,
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    } else {
      return {
        title: '良票演出',
        path: 'pages/home/home/home',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  }
})