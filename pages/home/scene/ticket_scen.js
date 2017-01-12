var app = getApp()
Page({
    data: {
        sessionShow: null,
        sessions: [{
            "other_regions": "",
            "open_regions": "剧场",
            "name": "2017.01.12 周四 19:30",
            "start_time": "2017-01-12 19:30",
            "min_discount": "",
            "min_price": 0,
            "ticket_count": 0,
            "end_time": "",
            "ticket_status": 1,
            "id": 3535217151
        },]
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
            console.log(res)
            that.setData({
                sessions: res
            })
        });
    }
})