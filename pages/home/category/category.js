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
        that.setData({
            categoryShow: JSON.parse(categoty)
        })
        wx.setNavigationBarTitle({
            title: JSON.parse(categoty).title
        })
        var url = "show/list/?cat_id=" + JSON.parse(categoty).id
        app.func.requestGet(url, {}, function (res) {
            for (var i = 0; i < res.show_list.length; i++) {
                var dic_count = res.show_list[i].min_discount * 10
                res.show_list[i].min_discount = dic_count.toFixed(1)
            }
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