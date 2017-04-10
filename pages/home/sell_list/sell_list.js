// pages/sell/sell_list/sell_list.js
var app = getApp()
Page({
  data: {
    sellList: [],
    isHaveOrder: null,
    winWidth: 0,
    winHeight: 0,
    searchBarWidth:0,
    inputValue:"",
    isInPut:false,
    searchList:null,
    searchText:""
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          searchBarWidth : res.windowWidth - 16
        });
      }
    });
    this.requestData()
  },

  requestData: function () {
    var that = this
     wx.showToast({
      title: '加载中',
      icon: 'loading',
      suration: 10000
    })
    app.func.requestGet("show/hot_sell/", {}, function (res) {
      that.setData({
        sellList: res
      })
      setTimeout(function () {
      wx.hideToast()
    }, 500)
      console.log(that.data.sellList)
    });
  },
  showTap: function (event) {
    var that = this
    var user = wx.getStorageSync('userInfo')
    // 
    if ( user != "" && user.data.role != "supplier") {
      wx.navigateTo({
        url: '../login/login',
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
      return
    }
    var data = event.currentTarget.dataset.show
    data.cover = ""
    data.category.icon = ""
    if (event.currentTarget.dataset.show.session_count > 1) {
      var show = JSON.stringify(data)
      wx.navigateTo({
        url: '../sell_scen/sell_scen?show=' + show
      })
    } else {
      data.session.venue_map = ""
      var show = JSON.stringify(data)
      wx.navigateTo({
        url: '../sell_form/sell_form?sellShow=' + show
      })
    }
  },
  requestSearchData: function(data) {
    var that = this
    var url = "/show/search/sell/?kw="+data
    console.log(url)
    app.func.requestGet(url, {}, function (res) {
      that.setData({
        searchList: res.show_list
      })
      console.log(that.data.searchList)
    });
  },
  cancelTap: function (e) {
    this.setData({
      isInPut:false,
      searchBarWidth: this.data.winWidth - 16,
      searchText:""
    })
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value,
    })
    this.requestSearchData(this.data.inputValue)
  },
  inputFocus: function (e){
    this.setData({
      isInPut:true,
      searchBarWidth: this.data.winWidth - 75
    })
    console.log(e)
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