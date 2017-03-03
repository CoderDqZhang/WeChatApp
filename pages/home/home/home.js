var app = getApp()
Page({
  data: {
    text: "",
    categoryArray: [],
    ticketShow: [],
    catagorys: [],
    userInfo: {},
    isAllowUser: false,
    windowsHeigth: 0,
  },
  onLoad: function (opt) {
    console.log("首页数据")
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowsHeigth: res.windowHeight
        })
      }
    })
    //调用应用实例的方法获取全局数据
    var userInfo = wx.getStorageSync('userInfo')
    console.log("userInfo" + userInfo)
    if (userInfo != "") {
      that.setData({
        isAllowUser: false
      })
    } else {
      that.setData({
        isAllowUser: true
      })
    }
    that.requestData()
  },
  requestData: function () {
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
    if (that.data.categoryArray.length == 0) {
      console.log("0")
    } else {
      console.log("1")
    }

    wx.stopPullDownRefresh()
  },
  showTap: function (event) {
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
})