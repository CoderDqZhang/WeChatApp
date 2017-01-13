var app = getApp()
Page({
  data: {
    text: "",
    categoryArray: [{
      title: "话剧歌剧",
      subletitle: "开心麻花、孟金辉",
      image: "",
      id: "3535216728"
    }, {
      title: "演唱会",
      subletitle: "朴树、MMetallica",
      image: "",
      id: "3535216735"
    }, {
      title: "音乐会",
      subletitle: "冰雪奇缘、邓丽君",
      image: "",
      id: "3535216729"
    }, {
      title: "体育",
      subletitle: "CBA、中超",
      image: "",
      id: "3535216725"
    }, {
      title: "全部",
      subletitle: "恋爱犀牛、仙剑",
      image: "",
      id: "0"
    }],
    ticketShow: [],
  },
  onLoad: function (opt) {
    this.requestData()
  },
  requestData: function () {
    var that = this;
    app.func.requestGet('show/hot/', {}, function (res) {
      that.setData({
        ticketShow: res
      })
    });
  },
  showTap: function (event) {
    var data = event.currentTarget.dataset.show
    data.cover = ""
    var show = JSON.stringify(data)
    if (event.currentTarget.dataset.show.session_count > 1) {
      wx.navigateTo({
        url: '../scene/ticket_scen?show=' + show
      })
    } else {
      wx.navigateTo({
        url: '../ticket_desc/ticket_desc?show=' + show
      })
    }
  },

  categoryTap: function (event) {
    wx.navigateTo({
      url: '../category/category?categoty=' + JSON.stringify(event.currentTarget.dataset.category)
    })
  },
  // //   onLoad:function(options){
  // //     // 生命周期函数--监听页面加载
  // //     String2
  // //   },
  // //   onReady:function(){
  // //     // 生命周期函数--监听页面初次渲染完成
  // //     String3
  // //   },
  // //   onShow:function(){
  // //     // 生命周期函数--监听页面显示
  // //     String4
  // //   },
  // //   onHide:function(){
  // //     // 生命周期函数--监听页面隐藏
  // //     String5
  // //   },
  // //   onUnload:function(){
  // //     // 生命周期函数--监听页面卸载
  // //     String6
  // //   },
  // //   onPullDownRefresh: function() {
  // //     // 页面相关事件处理函数--监听用户下拉动作
  // //     String7
  // //   },
  // //   onReachBottom: function() {
  // //     // 页面上拉触底事件的处理函数
  // //     String8
  // //   },
  //   onShareAppMessage: function() {
  //     // 用户点击右上角分享
  //     return {
  //       title: 'title', // 分享标题
  //       desc: 'desc', // 分享描述
  //       path: 'path' // 分享路径
  //     }
  //   },
  //   viewTap: function (){

  //   },
  //   customData: {
  //     hi: 'MINA'
  //   }
})