var app = getApp()
Page({
    data: {
        tickets: {},
        windowsHeigth: 0,
        isHaveOrder: false,
        showText:"须完成微信授权才能继续使用",
        showText1:"请删除后重新授权",
        userInfo:null
    },
    onLoad: function (opt) {
        var that = this
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowsHeigth: res.windowHeight
                })
                // success
            }
        })
        var user = wx.getStorageSync('userInfo')
        if (user != "") {
            that.setData({
                isHaveOrder: false,
                userInfo:user.data
            })
        } else {
            that.setData({
                isHaveOrder: true
            })
            return
        }

    },
    myorderTap: function(){
        wx.navigateTo({
          url: '../order_list/order',
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
    },
    mysellTap: function(){
        wx.navigateTo({
          url: '../sell/sell',
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
    },
    myWalletTap: function () {
        
    }
})