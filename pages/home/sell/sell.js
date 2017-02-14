// pages/home/sell/sell.js
var app = getApp()
function ticketSellManagerMinMaxPrice(data) {
  var min_price = 0
  var max_price = 0
  if (data.session_list.count != 1) {
    min_price = data.session_list[0].min_price
    max_price = data.session_list[0].min_price
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      if (session.ticket_list.count != 1) {
        for (var j = 0; j < session.ticket_list.length; j++) {
          var ticket = session.ticket_list[j]
          if (ticket.price < min_price) {
            min_price = ticket.price
          }
          if (ticket.price > max_price) {
            max_price = ticket.price
          }
        }
      } else {
        if (session.min_price < min_price) {
          min_price = session.min_price
        }
        if (session.min_price > max_price) {
          max_price = session.min_price
        }
      }
    }
  } else {
    min_price = data.min_price
    max_price = data.min_price
    if (data.session_list[0].ticket_list.count != 1) {
      for (var j = 0; j < data.session_list[0].ticket_list.length; j++) {
        var ticket = data.session_list[0].ticket_list[j]
        if (ticket.price < min_price) {
          min_price = ticket.price
        }
        if (ticket.price > max_price) {
          max_price = ticket.price
        }
      }
    } else {
      min_price = data.session_list[0].ticket_list[0].price
      max_price = data.session_list[0].ticket_list[0].price
    }
  }
  if (min_price == max_price) {
    return min_price
  }
  return min_price + "-" + max_price

}
function ticketShowModelSession(data) {
  var sessionStr = ""
  if (data.session_list.count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      sessionStr = sessionStr + session.name + " "
    }
    return sessionStr
  } else {
    sessionStr = "、" + data.session_list[0].name
    sessionStr = sessionStr.substring(1, sessionStr.length)
    return sessionStr
  }
}

function ticketSellCount(data) {
  var ticketCount = 0
  if (data.session_list.count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      for (var j = 0; j < session.ticket_list.length; j++) {
        var ticket = session.ticket_list[j]
        if (ticket.status == 1) {
          ticketCount = ticketCount + ticket.remain_count
        }
      }
    }
  } else {
    for (var k = 0; k < data.session[0].ticket_list.length; k++) {
      var ticket = data.session[0].ticket_list[k]
      if (ticket.status == 1) {
        ticketCount = ticketCount + ticket.remainCount
      }
    }
  }
  return ticketCount
}

function ticketSoldCount(data) {
  var ticketSoldCount = 0
  if (data.session_list.count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i]
      if (session.ticket_count != 1) {
        for (var j = 0; j < session.ticket_list.length; j++) {
          var ticket = session.ticket_list[j]
          ticketSoldCount = ticketSoldCount + ticket.sold_count
        }
      } else {
        ticketSoldCount = ticketSoldCount + session.ticket_list[0].sold_count
      }
    }
  } else {
    if (data.session_list[0].ticket_count != 1) {
      for (var k = 0; k < data.session_list[0].ticket_list.length; k++) {
        var ticket = data.session_list[0].ticket_list[k]
        ticketSoldCount = ticketSoldCount + ticket.sold_count
      }
    } else {
      ticketSoldCount = ticketSoldCount + data.session_list[0].ticket_list[0].sold_count
    }
  }
  return ticketSoldCount
}

function ticketShowModelTicketName(data) {
  var ticketName = ""
  if (data.session_count != 1) {
    for (var i = 0; i < data.session_list.length; i++) {
      var session = data.session_list[i];
      if (session.ticket_count != 1) {
        for (var j = 0; j < session.ticket_list.length; j++) {
          var ticket = session.ticket_list[j]
          ticketName = ticketName + "、" + ticket.original_ticket.name

        }
      } else {
        ticketName = ticketName + "、" + session.ticket_list[0].original_ticket.name
      }
    }
  } else {
    if (data.session_list[0].ticket_count != 1) {
      for (var k = 0; k < data.session_list[0].ticket_list.length; k++) {
        var ticket = data.session_list[0].ticket_list[k]
        ticketName = ticketName + "、" + ticket.original_ticket.name
      }
    } else {
      ticketName = ticketName + "、" + data.session_list[0].ticket_list[0].original_ticket.name
    }
  }
  // if (ticketName.length > 1){

  // }
  return ticketName.substring(1, ticketName.length)
}

Page({
  data: {
    ticketSell: [
      {
        "category": {
          "icon": "http://7xsatk.com1.z0.glb.clouddn.com/e4c652f19dadbac0db40cbc7dce53c16.jpg?imageMogr/v2/format/jpg/thumbnail/277x373",
          "id": 3535216728,
          "name": "话剧歌剧",
          "title": "开心麻花、孟京辉"
        },
        "city": "北京",
        "cover": "http://7xsatk.com1.z0.glb.clouddn.com/140bfd745de0ec61110c822c0b80e657.jpg?imageMogr/v2/format/jpg/thumbnail/277x373",
        "id": 3535216707,
        "min_discount": "0.22",
        "min_price": 22,
        "session_count": 2,
        "session_list": [
          {
            "end_time": "",
            "id": 3535216678,
            "min_discount": "0.40",
            "min_price": 345,
            "name": "2017.02.14 周二 19:30",
            "open_regions": "",
            "other_regions": "",
            "shareTitle": "",
            "start_time": "2017-02-14 19:30",
            "ticket_count": 100,
            "ticket_list": [
              {
                "delivery_price": 6,
                "delivery_price_sf": 13,
                "delivery_type": "1",
                "delivery_type_desc": "快递",
                "discount": "0.40",
                "id": 3535216792,
                "original_ticket": {
                  "id": 3535217793,
                  "name": "870",
                  "price": 870
                },
                "price": 345,
                "region": "",
                "remain_count": 10,
                "row": "",
                "scene_get_ticket_address": "",
                "scene_get_ticket_date": "",
                "scene_get_ticket_phone": "",
                "seat_type": 0,
                "self_get_ticket_address": "",
                "self_get_ticket_date": "",
                "self_get_ticket_phone": "",
                "sell_type": 1,
                "sold_count": 0,
                "status": 1,
                "status_desc": "已上线",
                "supplier": {
                  "id": 3535216734,
                  "mobile_num": "18363899723",
                  "username": "票务"
                },
                "ticket_count": 10
              },
              {
                "delivery_price": 6,
                "delivery_price_sf": 13,
                "delivery_type": "1",
                "delivery_type_desc": "快递",
                "discount": "1.12",
                "id": 3535216795,
                "original_ticket": {
                  "id": 3535217798,
                  "name": "980",
                  "price": 980
                },
                "price": 1111,
                "region": "",
                "remain_count": 90,
                "row": "",
                "scene_get_ticket_address": "",
                "scene_get_ticket_date": "",
                "scene_get_ticket_phone": "",
                "seat_type": 0,
                "self_get_ticket_address": "",
                "self_get_ticket_date": "",
                "self_get_ticket_phone": "",
                "sell_type": 1,
                "sold_count": 0,
                "status": 1,
                "status_desc": "已上线",
                "supplier": {
                  "id": 3535216734,
                  "mobile_num": "18363899723",
                  "username": "票务"
                },
                "ticket_count": 90
              }
            ],
            "ticket_status": 1,
            "venue_map": ""
          },
          {
            "end_time": "2017-02-22 00:00",
            "id": 3535216975,
            "min_discount": "0.22",
            "min_price": 22,
            "name": "2017.02.14 周二 19:30",
            "open_regions": "莲花池 一层 二层 三层",
            "other_regions": "",
            "shareTitle": "",
            "start_time": "2017-02-14 00:00",
            "ticket_count": 123,
            "ticket_list": [
              {
                "delivery_price": 6,
                "delivery_price_sf": 13,
                "delivery_type": "1",
                "delivery_type_desc": "快递",
                "discount": "0.22",
                "id": 3535216794,
                "original_ticket": {
                  "id": 3535217792,
                  "name": "100",
                  "price": 100
                },
                "price": 22,
                "region": "",
                "remain_count": 123,
                "row": "",
                "scene_get_ticket_address": "",
                "scene_get_ticket_date": "",
                "scene_get_ticket_phone": "",
                "seat_type": 0,
                "self_get_ticket_address": "",
                "self_get_ticket_date": "",
                "self_get_ticket_phone": "",
                "sell_type": 1,
                "sold_count": 0,
                "status": 1,
                "status_desc": "已上线",
                "supplier": {
                  "id": 3535216734,
                  "mobile_num": "18363899723",
                  "username": "票务"
                },
                "ticket_count": 123
              }
            ],
            "ticket_status": 1,
            "venue_map": ""
          }
        ],
        "show_date": "2017.02.08-2017.02.14",
        "ticket_count": 223,
        "ticket_status": 1,
        "title": "麦戏聚经典原版音乐剧《GHOST 人鬼情未了》",
        "venue": {
          "address": "北京市东城区东直门南大街14号保利大厦1层",
          "city": "北京",
          "id": 3535216729,
          "image": "",
          "name": "保利剧院",
          "phone": "010-65001188-5621/5619  65011854",
          "regions": "莲花池 一层 二层 三层",
          "venue_map": ""
        }
      },
      {
        "category": {
          "icon": "http://7xsatk.com1.z0.glb.clouddn.com/c09030a3acb61f9a290d3fff66b101ce.jpg?imageMogr/v2/format/jpg/thumbnail/277x373",
          "id": 3535216735,
          "name": "演唱会",
          "title": "梁静茹、朴树、张惠妹"
        },
        "city": "北京",
        "cover": "http://7xsatk.com1.z0.glb.clouddn.com/009dd603d08ffd8b88e5c7d5f5ca006e.jpg?imageMogr/v2/format/jpg/thumbnail/277x373",
        "id": 3535216726,
        "min_discount": "0.02",
        "min_price": 23,
        "session_count": 1,
        "session_list": [
          {
            "end_time": "",
            "id": 3535216718,
            "min_discount": "0.02",
            "min_price": 23,
            "name": "2017.02.14 周二 20:00",
            "open_regions": "",
            "other_regions": "",
            "shareTitle": "",
            "start_time": "2017-02-14 20:00",
            "ticket_count": 252,
            "ticket_list": [
              {
                "delivery_price": 6,
                "delivery_price_sf": 13,
                "delivery_type": "1",
                "delivery_type_desc": "快递",
                "discount": "0.19",
                "id": 3535216799,
                "original_ticket": {
                  "id": 3535216743,
                  "name": "双人套票520(我爱你)",
                  "price": 520
                },
                "price": 100,
                "region": "",
                "remain_count": 10,
                "row": "",
                "scene_get_ticket_address": "",
                "scene_get_ticket_date": "",
                "scene_get_ticket_phone": "",
                "seat_type": 0,
                "self_get_ticket_address": "",
                "self_get_ticket_date": "",
                "self_get_ticket_phone": "",
                "sell_type": 1,
                "sold_count": 0,
                "status": 1,
                "status_desc": "已上线",
                "supplier": {
                  "id": 3535216734,
                  "mobile_num": "18363899723",
                  "username": "票务"
                },
                "ticket_count": 10
              },
              {
                "delivery_price": 6,
                "delivery_price_sf": 13,
                "delivery_type": "1",
                "delivery_type_desc": "快递",
                "discount": "0.11",
                "id": 3535216798,
                "original_ticket": {
                  "id": 3535216741,
                  "name": "双人套票999(长长久久) ",
                  "price": 999
                },
                "price": 111,
                "region": "",
                "remain_count": 231,
                "row": "",
                "scene_get_ticket_address": "",
                "scene_get_ticket_date": "",
                "scene_get_ticket_phone": "",
                "seat_type": 0,
                "self_get_ticket_address": "",
                "self_get_ticket_date": "",
                "self_get_ticket_phone": "",
                "sell_type": 1,
                "sold_count": 0,
                "status": 1,
                "status_desc": "已上线",
                "supplier": {
                  "id": 3535216734,
                  "mobile_num": "18363899723",
                  "username": "票务"
                },
                "ticket_count": 231
              },
              {
                "delivery_price": 6,
                "delivery_price_sf": 13,
                "delivery_type": "1",
                "delivery_type_desc": "快递",
                "discount": "0.02",
                "id": 3535216793,
                "original_ticket": {
                  "id": 3535216740,
                  "name": "双人套票1314(一生一世)",
                  "price": 1314
                },
                "price": 23,
                "region": "",
                "remain_count": 11,
                "row": "",
                "scene_get_ticket_address": "",
                "scene_get_ticket_date": "",
                "scene_get_ticket_phone": "",
                "seat_type": 0,
                "self_get_ticket_address": "",
                "self_get_ticket_date": "",
                "self_get_ticket_phone": "",
                "sell_type": 1,
                "sold_count": 0,
                "status": 1,
                "status_desc": "已上线",
                "supplier": {
                  "id": 3535216734,
                  "mobile_num": "18363899723",
                  "username": "票务"
                },
                "ticket_count": 11
              }
            ],
            "ticket_status": 1,
            "venue_map": ""
          }
        ],
        "show_date": "2017.02.14 周二",
        "ticket_count": 252,
        "ticket_status": 1,
        "title": "2017「千年等一会儿」 二手玫瑰214北京演唱会",
        "venue": {
          "address": "北京市西城区西直门外大街135号北京展览馆内",
          "city": "北京",
          "id": 3535216725,
          "image": "",
          "name": "北京展览馆剧场",
          "phone": "010-68354455",
          "regions": "",
          "venue_map": ""
        }
      }
    ],
    ticketSells: [],
    ticketList: "dfss"
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.requestData()
  },
  requestData: function () {
    var that = this
    for (var i = 0; i < that.data.ticketSell.length; i++) {
      var ticketSellModel = that.data.ticketSell[i]
      ticketSellModel.sessionTitle = ticketShowModelSession(ticketSellModel)
      ticketSellModel.ticketCount = ticketSellCount(ticketSellModel)
      ticketSellModel.ticketSold = ticketSoldCount(ticketSellModel)
      ticketSellModel.ticketName = ticketShowModelTicketName(ticketSellModel)
      ticketSellModel.ticketPrice = ticketSellManagerMinMaxPrice(ticketSellModel)
    }
    that.setData({
      ticketSells: that.data.ticketSell
    })
    console.log(that.data.ticketSells)
  },
  sellTap: function (event) {
    var sellTicket = event.currentTarget.dataset.sellticket
    console.log(sellTicket)
    if (sellTicket.session_list.length > 1) {
      console.log("ddd")
      var imageUrl = sellTicket.cover
      var arr = imageUrl.split('?')
      sellTicket.cover = arr[0]
      sellTicket.cover_end = arr[1]
      sellTicket.category.icon = ""
      var show = JSON.stringify(sellTicket)

      wx.navigateTo({
        url: '../scene/ticket_scen?sellShow=' + show,
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
    } else {
      var sessionShow = event.currentTarget.dataset.sellticket
      sessionShow.session = sessionShow.session_list[0]
      var imageUrl = sessionShow.cover
      var arr = imageUrl.split('?')
      sellTicket.cover = arr[0]
      sellTicket.cover_end = arr[1]
      sessionShow.category.icon = ""
      sessionShow.venue.venue_map = ""
      console.log(sessionShow)
      // that.data.sessionShow.session = session
      var sellShow = JSON.stringify(sessionShow)
      wx.navigateTo({
        url: '../ticket_desc/ticket_desc?sellShow=' + sellShow,
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
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})