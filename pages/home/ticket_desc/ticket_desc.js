var app = getApp()
Page({
    data: {
        sessionShow: null,
        showDesc: null
    },
    onLoad: function (opt) {
        this.requestData(opt.show)
    },
    requestData: function (show) {
        var that = this;
        that.setData({
            sessionShow:JSON.parse(show)
        })
        var url = "show/" + JSON.parse(show).id + "/session/" + JSON.parse(show).session.id
        app.func.requestGet(url, {}, function (res) {
            that.setData({
                showDesc: res
            })
        });
    }
})