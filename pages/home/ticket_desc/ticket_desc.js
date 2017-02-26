var app = getApp()
function getArray(a) {
 var hash = {},
     len = a.length,
     result = [];

 for (var i = 0; i < len; i++){
     if (!hash[a[i]]){
         hash[a[i]] = true;
         result.push(a[i]);
     } 
 }
 return result;
}
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
        ticketPrices: [],
        ticketChange: [],
        ticket_list: []
    },
    onLoad: function (opt) {
        if (opt.sellShow != null) {
            this.setData({
                sessionShow: JSON.parse(opt.sellShow),
                shareData: JSON.parse(opt.sellShow),
            })
            wx.setNavigationBarTitle({
                title: this.data.sessionShow.session.name,
                success: function (res) {
                    // success
                }
            })
            this.genderData(this.data.sessionShow.session.ticket_list)
        } else {
            this.requestData(opt.show)
        }
    },
    requestData: function (show) {
        var that = this;
        var userInfo = wx.getStorageInfoSync('userInfo')

        that.setData({
            shareData: JSON.parse(show),
            'shareData.lp_session_id': "userTicket",
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
            console.log(that.data)
            that.data.sessionShow.cover = imageUrl
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
            arr = getArray(arr);
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
                    deliveType = deliveType + "现场取票 "
                } else if (arr[j] == "4") {
                    deliveType = deliveType + "快递到付 "
                }
            }
            if (tickets[i].seat_type == 1) {
                deliveType = deliveType + "连坐 "
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
        that.data.sessionShow.session.ticket_list = tickets
        that.setData({
            showDesc: that.data.sessionShow.session,
            shareTitle: that.data.sessionShow.title,
            sharesubletitle: subtitle,
            ticket_list: tickets
        })
    },
    ticketTap: function (event) {
        var ticket = event.currentTarget.dataset.ticket

        var that = this;
        var userInfo = wx.getStorageSync('userInfo')
        if (that.data.shareData.lp_session_id == userInfo.data.lp_session_id || that.data.shareData.lp_session_id != "userTicket") {
            var ticketList = that.data.showDesc.ticket_list
            var tempTicket
            that.connectService(ticket)
            // for (var j = 0; j < ticketList.length; j++) {

            //     if (ticketList[j].id = ticket.id) {
            //         that.connectService(ticket)
            //         break;
            //     }
            // }

        } else {
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
        }

    },
    connectService: function (ticket) {
        var tempList = []
        if (ticket.status != 2) {
            if (ticket.status == 0) {
                tempList.push("删除")
            }
            tempList.push(ticket.status == 1 ? "下架" : "上架")
        }
        tempList.push("编辑")
        this.setData({
            ticketChange: tempList
        })
        var that = this
        wx.showActionSheet({
            itemList: that.data.ticketChange,
            success: function (res) {
                that.changeTicketStatus(that.data.ticketChange[res.tapIndex], ticket)
                console.log(res.tapIndex)
            },
            fail: function (res) {
                console.log(res.errMsg)
            }
        })
    },
    changeTicketStatus: function (data, ticket) {
        if (data == "编辑") {
            this.requestEditTicket(ticket)
        } else if (data == "上架") {
            this.requestChangeTicket(ticket)
        } else if (data == "下架") {
            this.requestChangeTicket(ticket)
        } else if (data == "删除") {
            this.requestDeleteTicket(ticket)
        }
    },
    requestChangeTicket: function (ticket) {
        var that = this
        let url = "supplier/ticket/" + ticket.id + "/"
        app.func.requestPut(url, {}, function (res) {
            console.log(res)
            var ticketList = that.data.showDesc.ticket_list
            for (var j = 0; j < ticketList.length; j++) {

                if (ticketList[j].id == ticket.id) {
                    var ticket_list = ticketList[j]
                    ticketList[j].status = ticketList[j].status == 1 ? 0 : 1;
                    ticketList[j].status_desc = ticket.status == 1 ? "已上线" : "已下线"
                    var tempTicket = ticketList
                    that.setData({
                        'that.data.showDesc.ticket_list': tempTicket,
                        ticket_list: tempTicket
                    })
                    break;
                }
            }
            if (res.errors != null) {
                wx.showModal({
                    title: res.errors[0].error[0].toString(),
                    showCancel: false,
                    confirmText: "知道了",
                    confirmColor: "#4bd4c5",
                    success: function (res) {
                        if (res.confirm) {
                        }
                    }
                })
                return
            }
        });
    },
    requestDeleteTicket: function (ticket) {
        var that = this
        let url = "supplier/ticket/" + ticket.id + "/"
        app.func.requestDelete(url, {}, function (res) {
            var ticketList = that.data.showDesc.ticket_list
            var tempTicket = []
            for (var j = 0; j < ticketList.length; j++) {

                if (ticketList[j].id != ticket.id) {
                    tempTicket.push(ticketList[j])
                }
            }
            var ticketList = that.data.showDesc.ticket_list
            that.setData({
                'that.data.showDesc.ticket_list': tempTicket,
                ticket_list: tempTicket
            })
            if (res.errors != null) {
                wx.showModal({
                    title: res.errors[0].error[0].toString(),
                    showCancel: false,
                    confirmText: "知道了",
                    confirmColor: "#4bd4c5",
                    success: function (res) {
                        if (res.confirm) {
                        }
                    }
                })
                return
            }
        });
    },
    requestEditTicket: function (ticket) {
        var that = this
        console.log(that.data)
        var ticketEdit = { "sessionShow": that.data.sessionShow, "ticket": ticket }
        wx.navigateTo({
            url: '../sell_form/sell_form?ticketEdit=' + JSON.stringify(ticketEdit),
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })
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
        var shareTitle = ""
        if (that.data.sessionShow.session.shareTitle == null) {
            shareTitle = that.data.sharesubletitle + that.data.shareName[Math.floor(Math.random() * (5 + 1))]
        } else {
            shareTitle = that.data.sessionShow.session.shareTitle + that.data.sharesubletitle + that.data.shareName[Math.floor(Math.random() * (5 + 1))]
        }
        var shareUrl = 'pages/home/ticket_desc/ticket_desc?show='
        if (that.data.shareData.lp_session_id != "userTicket") {
            shareUrl = 'pages/home/ticket_desc/ticket_desc?sellShow='
        }
        return {
            title: shareTitle,
            desc: that.data.sharesubletitle,
            path: shareUrl + JSON.stringify(that.data.shareData)
        }
    },
})