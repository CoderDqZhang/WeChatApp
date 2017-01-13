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
                var arr = data.ticket_list[i].delivery_type.split(',');
                var deliveType=""
                if (data.ticket_list[i].sell_type == 1){
                    deliveType = "打包购买 "
                }
                for (var j=0;j<arr.length;j++) {
                    if (arr[j]=="1"){
deliveType = deliveType + "快递 "
                    }else if(arr[j]=="2"){
deliveType = deliveType + "上门自取 "
                    }else if(arr[j]=="3"){
deliveType = deliveType + "自取 "
                    }
                }
                if (data.ticket_list[i].seat_type == 1){
                    deliveType = deliveType + "连坐"
                }
                data.ticket_list[i].deliveType = deliveType
                console.log(data.ticket_list[i].deliveType)
            }
            that.setData({
                showDesc: data
            })
        });
    }
})