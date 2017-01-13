var app = getApp()
Page({
    data: {
        sessionShow: null,
        showDesc: null,
    },
    onLoad: function (opt) {
        this.requestData(opt.show)
    },
    requestData: function (show) {
        var that = this;
        that.setData({
            sessionShow: JSON.parse(show)
        })
        var url = "show/" + JSON.parse(show).id + "/session/" + JSON.parse(show).session.id
        app.func.requestGet(url, {}, function (res) {
            var data = res;
            var imageUrl = data.show.cover
            data.show = JSON.parse(show)
            data.show.cover = imageUrl
            for (var i = 0; i < data.ticket_list.length; i++) {
                var ticket_row = ""
                if (data.ticket_list[i].region == "") {
                    ticket_row = "择优分配"
                } else {
                    ticket_row = data.ticket_list[i].row != "" ? data.ticket_list[i].row + "排" : "择优分配"
                }
                data.ticket_list[i].region = ticket_row
                var arr = '123,abc,xy,hi'.split(',');
                for (var i in arr) {
                    console.log(arr[i])
                }
            }
            that.setData({
                showDesc: data
            })
        });
    }
})