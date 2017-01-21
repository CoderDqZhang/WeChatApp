var app = getApp()
Page({
    data: {
        sessionShow: null,
        showDesc: null,
        ticketNumber: 1,
        shareTitle: '',
        sharesubletitle: '',
        shareData:null
    },
    onLoad: function (opt) {
        this.requestData(opt.show)
    },
    requestData: function (show) {
        var that = this;
        that.setData({
            shareData:JSON.parse(show),
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
                    ticket_row = data.ticket_list[i].row != "" ? res.ticket_list[i].region + ' ' + data.ticket_list[i].row + "排" : "择优分配"
                }
                data.ticket_list[i].region = ticket_row
                var arr = data.ticket_list[i].delivery_type.split(',');
                var deliveType = ""
                if (data.ticket_list[i].sell_type == 2) {
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
                if (data.ticket_list[i].seat_type == 1) {
                    deliveType = deliveType + "连坐"
                }
                data.ticket_list[i].deliveType = deliveType
                console.log(data.ticket_list[i].deliveType)
            }
            var subtitle = ''
            for (var j = 0; j < res.ticket_list.length; j++) {
                var ticket_row = ''
                if (res.ticket_list[j].region == '') {
                    ticket_row = ''
                } else {
                    ticket_row = res.ticket_list[j].region != '择优分配' ? res.ticket_list[j].region : ''
                }
                subtitle = subtitle + res.ticket_list[j].original_ticket.price + ' ' + ticket_row + '*' + res.ticket_list[j].remain_count + '张' + '、'
            }
            console.log(subtitle)
            that.setData({
                showDesc: data,
                sessionShow: data.show,
                shareTitle: data.show.title,
                sharesubletitle: subtitle

            })
        });
    },
    btn_subtract: function () {
        var that = this
        var number_ticket = that.data.ticketNumber
        if (number_ticket > 1) {
            that.setData({
                ticketNumber: number_ticket - 1
            })
        }

    },
    btn_add: function () {
        var that = this
        var number_ticket = that.data.ticketNumber
        that.setData({
            ticketNumber: number_ticket + 1
        })
    },
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
    onShareAppMessage: function () {
        var that = this
        return {
            title: that.data.shareTitle,
            desc: that.data.sharesubletitle,
            path: 'pages/home/ticket_desc/ticket_desc?show=' + JSON.stringify(that.data.shareData)
        }
    },
})