var app = getApp()
Page({
    data: {
        categoryShow: null,
        shows: null
    },
    onLoad: function (opt) {
        this.requestData(opt.categoty)

    },
    requestData: function (categoty) {
        var that = this;
        console.log(JSON.parse(categoty))
        that.setData({
            categoryShow: JSON.parse(categoty)
        })
        wx.setNavigationBarTitle({
            title: JSON.parse(categoty).title
        })
        var url = "show/list/?cat_id=" + JSON.parse(categoty).id
        app.func.requestGet(url, {}, function (res) {
            console.log(res)
            that.setData({
                shows: res
            })
        });
    },
    showTap: function (event) {

        if (event.currentTarget.dataset.show.session_count > 1) {
            var data = event.currentTarget.dataset.show
            data.cover = ""
            var show = JSON.stringify(data)
            wx.navigateTo({
                url: '../scene/ticket_scen?show=' + show
            })
        } else {
            wx.navigateTo({
                url: '../ticket_desc/ticket_desc?show=' + show
            })
        }
    },
})