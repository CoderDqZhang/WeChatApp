var app = getApp()
Page({
    data: {
        sessionShow: null,
        sessions: []
    },
    onLoad: function (opt) {
        this.requestData(opt.show)
    },
    requestData: function (show) {
        var that = this;
        that.setData({
            sessionShow:JSON.parse(show)
        })
        var url = "show/"+JSON.parse(show).id+"/session/"
        app.func.requestGet(url, {}, function (res) {
            that.setData({
                sessions: res
            })
            console.log(sessions)
        });
    }
})