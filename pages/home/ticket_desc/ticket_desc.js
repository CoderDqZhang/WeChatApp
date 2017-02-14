var app = getApp()
function uniQueue(array) {
    var arr = [];
    var m;
    while (array.length > 0) {
        m = array[0];
        arr.push(m);
        array = $.grep(array, function (n, i) {
            return n == m;
        }, true);
    }
    return arr;
}
Page({
    data: {
        navigationTitle: "",
        sessionShow: null,
        showDesc: null,
        ticketNumber: 1,
        shareTitle: '',
        sharesubletitle: '',
        shareData: null,
        shareName: ["有票", "有票，需要的联系", "有票，欢迎各位老板", "有票，欢迎打包", "有票，便宜出", "有票便宜"],
        ticketPrices: []
    },
    onLoad: function (opt) {
        if (opt.sellShow != null) {
            console.log(opt.sellShow)
            this.setData({
                sessionShow: JSON.parse(opt.sellShow),
                shareData: JSON.parse(opt.sellShow)
            })
            wx.setNavigationBarTitle({
                title: this.data.sessionShow.session.name,
                success: function (res) {
                    // success
                }
            })
            console.log(this.data.sessionShow)
            this.genderData(this.data.sessionShow.session.ticket_list)
        } else {
            this.requestData(opt.show)
        }
    },
    requestData: function (show) {
        var that = this;
        console.log(that.data.shareName[Math.floor(Math.random() * (6 + 1))])
        that.setData({
            shareData: JSON.parse(show),
            sessionShow: JSON.parse(show)
        })

        var url = "show/" + JSON.parse(show).id + "/session/" + JSON.parse(show).session.id
        console.log(that.data.sessionShow)
        wx.setNavigationBarTitle({
            title: that.data.sessionShow.session.name,
            success: function (res) {
                // success
            }
        })
        app.func.requestGet(url, {}, function (res) {
            var data = res;
            var imageUrl = data.show.cover
            data.show = JSON.parse(show)
            data.show.cover = imageUrl
            that.genderData(data.ticket_list)
        });
    },
    genderData: function (tickets) {
        var that = this;
        for (var i = 0; i < tickets.length; i++) {
            var ticket_row = ""
            if (tickets[i].region == "") {
                ticket_row = "择优分配"
            } else {
                ticket_row = tickets[i].row != "" ? tickets[i].region + ' ' + tickets[i].row + "排" : "择优分配"
            }
            tickets[i].region = ticket_row
            var arr = tickets[i].delivery_type.split(',');
            var deliveType = ""
            if (tickets[i].sell_type == 2) {
                deliveType = "打包购买 "
            }
            for (var j = 0; j < arr.length; j++) {
                if (arr[j] == "1") {
                    deliveType = deliveType + "快递 "
                } else if (arr[j] == "2") {
                    deliveType = deliveType + "上门自取 "
                } else if (arr[j] == "3") {
                    deliveType = deliveType + "自取 "
                }
            }
            if (tickets[i].seat_type == 1) {
                deliveType = deliveType + "连坐"
            }
            tickets[i].deliveType = deliveType
            console.log(tickets[i].deliveType)
        }
        for (var j = 0; j < tickets.length; j++) {
            var ticket_row = ''
            if (tickets[j].region == '') {
                ticket_row = ''
            } else {
                ticket_row = tickets[j].region != '择优分配' ? tickets[j].region : ''
            }
            that.data.ticketPrices.push(tickets[j].original_ticket.price)
        }
        var tempList = []
        var price = 0
        for (var l = 0; l < that.data.ticketPrices.length; l++) {

            if (price != that.data.ticketPrices[l]) {
                tempList.push(that.data.ticketPrices[l])
                price = that.data.ticketPrices[l]
            }
        }
        var subtitle = ''

        for (var k = 0; k < tempList.length; k++) {
            if (k < tempList.length - 1) {
                subtitle = subtitle + tempList[k] + "、"
            } else {
                subtitle = subtitle + tempList[k]
            }
        }
        console.log(subtitle)
        console.log(that.data.sessionShow)
        that.setData({
            showDesc: that.data.sessionShow.session,
            shareTitle: that.data.sessionShow.title,
            sharesubletitle: subtitle

        })
    },

    // btn_subtract: function () {
    //     var that = this
    //     var number_ticket = that.data.ticketNumber
    //     if (number_ticket > 1) {
    //         that.setData({
    //             ticketNumber: number_ticket - 1
    //         })
    //     }

    // },
    // btn_add: function () {
    //     var that = this
    //     var number_ticket = that.data.ticketNumber
    //     that.setData({
    //         ticketNumber: number_ticket + 1
    //     })
    // },
    ticketTap: function (event) {
        var that = this;
        var ticket = event.currentTarget.dataset.ticket
        var ticket_number = that.data.ticketNumber
        if (ticket_number < ticket.remain_count && ticket.sell_type == 2) {
            wx.showModal({
                title: "必须打包" + ticket.remain_count + "张购买",
                success: function (res) {
                    if (res.confirm) {
                        that.pushConfim(ticket.remain_count, ticket)
                    }
                }
            })
        } else {
            that.pushConfim(ticket_number < ticket.remain_count ? ticket_number : ticket.remain_count, ticket)
        }
    },
    pushConfim: function (ticket_number, ticket) {
        var that = this;

        ticket.buy_number = ticket_number
        ticket.all_much = ticket_number * ticket.price
        var imageUrl = that.data.sessionShow.cover
        var arr = imageUrl.split('?')
        that.data.sessionShow.cover = arr[0]
        that.data.sessionShow.cover_end = arr[1]
        that.data.sessionShow.ticket = ticket

        wx.navigateTo({
            url: '../ticket_form/ticket_form?show=' + JSON.stringify(that.data.sessionShow)
        })
    },
    //     XXX380、580、980有票
    // XXX380、580、980有票，需要的联系
    // XXX380、580、980有票，欢迎各位老板
    // XXX380、580、980有票，欢迎打包
    // XXX380、580、980有票，便宜出，需要的联系
    // XXX380、580、980有票便宜
    onShareAppMessage: function () {
        var that = this
        var shareTitle = ""
        if (that.data.sessionShow.session.shareTitle == null) {
            shareTitle = that.data.sharesubletitle + that.data.shareName[Math.floor(Math.random() * (5 + 1))]
        } else {
            shareTitle = that.data.sessionShow.session.shareTitle + that.data.sharesubletitle + that.data.shareName[Math.floor(Math.random() * (6 + 1))]
        }
        return {
            title: shareTitle,
            // title: that.data.shareTitle,
            desc: that.data.sharesubletitle,
            path: 'pages/home/ticket_desc/ticket_desc?show=' + JSON.stringify(that.data.shareData)
        }
    },
})