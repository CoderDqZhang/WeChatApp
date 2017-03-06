// pages/home/withdraw/withdraw_complet.js
Page({
  data:{
    withdraw:null,
  },
  onLoad:function(options){
    this.setData({
      withdraw:JSON.parse(options.withdraw)
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  completTap: function (){
    wx.navigateBack({
      delta: 2, // 回退前 delta(默认为1) 页面
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
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})