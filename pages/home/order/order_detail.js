// pages/home/order/order_detail.js
Page({
  data:{
    order:{}
  },
  onLoad:function(options){
    console.log(options.order)
    this.setData({
      order:JSON.parse(options.order)
    })
    
    console.log(this.data.order)
    // 页面初始化 options为页面跳转所带来的参数
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