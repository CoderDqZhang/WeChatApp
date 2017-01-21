var app = getApp()
Page({
    data: {
        categoryShow: null,
        shows: null,
        hase_refresh: false,
        page: 0
    },
    onLoad: function (opt) {
        this.requestData(opt.categoty, false)

    },
    requestData: function (categoty, isNext) {
        var that = this;
        var url
        if (isNext) {
            url = url = "show/list/?cat_id=0&start=" + categoty.next_start
        } else {
            that.setData({
                categoryShow: JSON.parse(categoty)
            })
            wx.setNavigationBarTitle({
                title: JSON.parse(categoty).name
            })
            url = "show/list/?cat_id=" + JSON.parse(categoty).id

        }
        app.func.requestGet(url, {}, function (res) {
            for (var i = 0; i < res.show_list.length; i++) {
                var dic_count = res.show_list[i].min_discount * 10
                res.show_list[i].min_discount = dic_count.toFixed(1)
            }
            if (isNext){
                for (var j = 0; j < res.show_list.length; j ++) {
                    categoty.show_list.push(res.show_list[j])
                }
                categoty.next_start = res.next_start
                categoty.has_next = res.has_next
            }else{
                categoty = res
                wx.stopPullDownRefresh()
                console.log(categoty)
            }
            that.setData({
                shows: categoty
            })
        });
    },
    showTap: function (event) {

        if (event.currentTarget.dataset.show.session_count > 1) {
            var data = event.currentTarget.dataset.show
            data.cover = ""
            data.category.icon = ""
            var show = JSON.stringify(data)
            console.log(show)
            wx.navigateTo({
                url: '../scene/ticket_scen?show=' + show
            })
        } else {
             var data = event.currentTarget.dataset.show
            data.cover = ""
            data.category.icon = ""
            var show = JSON.stringify(data)
            wx.navigateTo({
                url: '../ticket_desc/ticket_desc?show=' + show
            })
        }
    },
    onPullDownRefresh: function () {
        // Do something when pull down.
        var that = this
        that.setData({
            hase_refresh: true
        })
        that.data.shows.next_start = 0
        that.requestData(that.data.shows, false)
        
    },

    onReachBottom: function () {
        var that = this
        if (that.data.shows.has_next){
            that.requestData(that.data.shows, true)
        }else{
            return
        }
    },
})