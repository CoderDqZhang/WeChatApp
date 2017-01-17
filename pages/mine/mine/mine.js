var app = getApp()
Page({
    data: {
        tickets:{}
    },
    onLoad: function (opt) {
        this.requestData()
        var that = this
    },
    requestData: function () {
        var that = this;
        app.func.requestGet('order/list/', {}, function (res) {
            that.setData({
                tickets:res
            })
        });
    },
    payEventhandle: function(event) {
        console.log(event.data)
    }
})