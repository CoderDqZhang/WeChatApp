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
            var data = res;
            var imageUrl = data.show.cover
            data.show = JSON.parse(show)
            data.show.cover =  imageUrl
            that.setData({
                showDesc: data
            })
        });
    }
})