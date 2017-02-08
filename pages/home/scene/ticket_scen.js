var app = getApp()
var sessionShow;
Page({
    data: {
        showData:null,
        sessions: []
    },
    onLoad: function (opt) {
        this.requestData(opt.show)
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
        session.venue_map=""
        wx.navigateTo({
            url: '../ticket_desc/ticket_desc?show=' + JSON.stringify(that.data.sessionShow)
        })
    },
})