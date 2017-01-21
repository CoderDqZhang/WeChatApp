var app = getApp()
Page({
    data: {
        tickets: {},
        windowsHeigth:0
    },
    onLoad: function (opt) {
        this.requestData(false)
        var that = this
        wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  windowsHeigth:res.windowHeight
              })
            // success
          }
        })
    },
    requestData: function (isNext) {
        var that = this;
        var tempTicket = that.data.tickets
        var url
        if (isNext) {
            url = url = "order/list/?page=" + tempTicket.next_page
        } else {
            url = 'order/list/'
        }
        app.func.requestGet(url, {}, function (res) {
            if (isNext) {
                for (var j = 0; j < res.order_list.length; j++) {
                    tempTicket.order_list.push(res.order_list[j])
                }
                tempTicket.next_page = res.next_page
                tempTicket.has_next = res.has_next
            } else {
                tempTicket = res
                console.log(tempTicket)
                wx.stopPullDownRefresh()

            }
            console.log(tempTicket)
            that.setData({
                tickets: tempTicket
            })
        });
    },
    payEventhandle: function (event) {
        var that = this
        var url = "order/pay_info/" + event.currentTarget.dataset.order + "/"
        console.log(event.currentTarget.dataset)

        app.func.requestGet(url, {}, function (res) {
            var wxpay = res.wxpay
            wx.requestPayment({
                // 'appId':wxpay.appid,
                'timeStamp': wxpay.timeStamp,
                'nonceStr': wxpay.nonceStr,
                'package': wxpay.package,
                'signType': 'MD5',
                'paySign': wxpay.sign,
                'success': function (wres) {
                    console.log(wres)
                    for (var j = 0; j < that.data.tickets.order_list.length; j++) {

                        if (that.data.tickets.order_list[j].order_id = event.currentTarget.dataset.order) {
                            that.data.tickets.order_list[j].status = 3;
                            that.data.tickets.order_list[j].status_desc = "待发货"
                            var tempTicket = that.data.tickets

                            that.setData({
                                tickets: tempTicket
                            })
                            break;
                        }
                    }
                },
                'fail': function (res) {
                    console.log(res)
                }
            })
        });
    },
    cancelEventhandle: function (event) {
        var that = this;
        wx.showModal({
            title: '确定要放弃本次交易吗',
            content: '',
            cancelText:'稍等一会',
            confirmText:'不买了',
            cancelColor:'#4bd4c5',
            confirmColor:'#384249',
            success: function (res) {
                if (res.confirm) {
                    var url = "order/" + event.currentTarget.dataset.order + "/"
                    app.func.requestPost(url, { "status": "1" }, function (res) {
                        console.log(res)
                        console.log(that.data.tickets.order_list)
                        for (var j = 0; j < that.data.tickets.order_list.length; j++) {

                            if (that.data.tickets.order_list[j].order_id = event.currentTarget.dataset.order) {
                                var show = that.data.tickets.order_list[j].show
                                that.data.tickets.order_list[j].status = 1;
                                that.data.tickets.order_list[j].status_desc = "交易取消"
                                var tempTicket = that.data.tickets
                                that.setData({
                                    tickets: tempTicket
                                })
                                break;
                            }
                        }
                    });
                }
            }
        })

    },


    reciveEventhandle: function (event) {
        var that = this
        var url = "order/" + event.currentTarget.dataset.order + "/"
        app.func.requestPost(url, { "status": "8" }, function (res) {
            console.log(res)
            for (var j = 0; j < that.data.tickets.order_list.length; j++) {

                if (that.data.tickets.order_list[j].order_id = event.currentTarget.dataset.order) {
                    that.data.tickets.order_list[j].status = 8;
                    that.data.tickets.order_list[j].status_desc = "已完成"
                    var tempTicket = that.data.tickets
                    that.setData({
                        tickets: tempTicket
                    })
                    break;
                }
            }
        });
    },

    onPullDownRefresh: function () {
        var that = this
        that.requestData(false)
    },

    onReachBottom: function () {
        var that = this
        if (that.data.tickets.has_next) {
            that.requestData(true)
        } else {
            return
        }
    }
})