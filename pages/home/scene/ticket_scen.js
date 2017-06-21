function ticketScenMinPrice(data) {
  var min_price = data.ticket_list[0].price
  for (var i = 0; i < data.ticket_list.length; i++) {
    if (data.ticket_list[i].price < min_price) {
      min_price = data.ticket_list[i].price
    }
  }
  return min_price
}

var app = getApp()
var sessionShow;
Page({
  data: {
    showData: null,
    sessions: []
  },
  onLoad: function (opt) {
    if (opt.ticketList != null) {
      console.log(opt.sellShow)
      this.setData({
        sessionShow: JSON.parse(opt.ticketList),
      })
      console.log(this.data.sessionShow)
      for (var i = 0; i < this.data.sessionShow.session_list.length; i++) {
        if (this.data.sessionShow.session_list[i].ticket_list.length > 0) {
          var minPrice = ticketScenMinPrice(this.data.sessionShow.session_list[i])
          this.data.sessionShow.session_list[i].min_price = minPrice
        }
      }
      this.setData({
        sessions: this.data.sessionShow.session_list
      })
    } else {
      if (opt.sellShow != null) {
        console.log(opt.sellShow)
        this.setData({
          sessionShow: JSON.parse(opt.sellShow),
        })
        console.log(this.data.sessionShow)
        this.setData({
          sessions: this.data.sessionShow.session_list
        })
      } else {
        this.requestData(opt.show)
      }
    }
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
    if (session.ticket_list != null) {
      // that.setData({

      // })
      that.data.sessionShow.session = session

      var sellShow = JSON.stringify(that.data.sessionShow)
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
    } else {
      wx.navigateTo({
        url: '../ticket_desc/ticket_desc?show=' + JSON.stringify(that.data.sessionShow)
      })
    }
  },
})