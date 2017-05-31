// pages/sell/sell_scen/sell_scen.js
var app = getApp()
Page({
  data: {
    showData: null,
    sessions: []
  },
  onLoad: function (options) {
    this.requestData(options.show)
    // 页面初始化 options为页面跳转所带来的参数
  },
  requestData: function (show) {
    var that = this;
    that.setData({
      sessionShow: JSON.parse(show)
    })
    var url = "show/" + JSON.parse(show).id + "/session/"
    app.func.requestGet(url, {}, function (res) {
      that.setData({
        sessions: res,
      })
    });
  },
  showTap: function (event) {
    var that = this;
    var session = event.currentTarget.dataset.session
    that.data.sessionShow.session = session
    session.venue_map = ""
    console.log(session)
    that.data.sessionShow.session = session

    //         var sellShow = JSON.stringify(that.data.sessionShow)
    // wx.navigateTo({
    //   url: '../sell_form/sell_form?sellShow=' + sellShow,
    //   success: function (res) {
    //     // success
    //   },
    //   fail: function () {
    //     // fail
    //   },
    //   complete: function () {
    //     // complete
    //   }
    // })
    this.showSellTicket(that.data.sessionShow)
  },
  showSellTicket: function (data) {
    var that = this
    var url = 'supplier/show/' + data.id + '/ticket/'
    app.func.requestGet(url, {}, function (res) {
      console.log(res)
      var tempSelectSession = 0
      if (res.session_list.length != 0) {
        data.session_list = res.session_list
        for (var j = 0; j < data.session_list.length; j++) {
          if (data.session_list[j].id == that.data.sessionShow.session.id) {
            tempSelectSession = j
          }
        }
      } else {
        data.session_list.push(data.session)
      }
      var tempData = that.genderTicket(data)

      if (tempData.session_list[tempSelectSession].ticket_list.length == 0) {
        var show = JSON.stringify(tempData)
        wx.navigateTo({
          url: '../sell_form/sell_form?sellShow=' + show
        })
      } else {
        var userInfo = wx.getStorageSync('userInfo')
        var imageUrl = tempData.cover
        var arr = imageUrl.split('?')
        tempData.cover = arr[0]
        tempData.cover_end = arr[1]
        tempData.category.icon = ""
        tempData.venue.venue_map = ""
        tempData.session.venue_map = ""
        tempData.lp_session_id = userInfo.data.lp_session_id
        tempData.session_list[0] = tempData.session_list[tempSelectSession]
        console.log(tempData)
        var sellShow = JSON.stringify(tempData)
        wx.navigateTo({
          url: '../ticket_put/ticket_put?sellShow=' + sellShow,
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
    });
  },
  genderTicket: function (data) {
    var ticket_list = []
    for (var i = 0; i < data.session_list[0].ticket_list.length; i++) {
      if (data.session_list[0].ticket_list[i].remain_count != 0)
        ticket_list.push(data.session_list[0].ticket_list[i])
    }
    data.session_list[0].ticket_list = ticket_list
    return data
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