// pages/home/address/address.js
var app = getApp()
Page({
  data: {
    provice: [
      "北京市",
      "天津市",
      "上海市 ",
      "重庆市",
      "河北省",
      "山西省",
      "辽宁省 ",
      "吉林省",
      "黑龙江省 ",
      "江苏省 ",
      "浙江省 ",
      "安徽省",
      "福建省",
      "江西省",
      "山东省",
      "河南省",
      "湖北省",
      "湖南省",
      "广东省",
      "海南省",
      "四川省",
      "贵州省",
      "云南省",
      "陕西省",
      "甘肃省",
      "青海省",
      "西藏自治区",
      "广西壮族自治区",
      "内蒙古自治区",
      "宁夏回族自治区",
      "新疆维吾尔自治区",
      "香港特别行政区",
      "澳门地区"],
    regions: "地区选择",
    isSelect: false,
    windowsWidth:0
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        // success
        that.setData({
          windowWidth:res.windowWidth - 148
        })
        console.log(that.data.windowWidth)
      }
    })
    // 页面初始化 options为页面跳转所带来的参数
  },
  formSubmit: function (e) {
    console.log(e)
    var location = this.data.regions
    console.log(location)
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log("test" + res.data.data.id)
        var data = {
          "name": e.detail.value.name,
          "id": 0,
          "default": 1,
          "mobile_num": e.detail.value.phone,
          "location": location,
          "address": e.detail.value.address,
        }
        app.func.requestPost('user/address/', data, function (ures) {
          var pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.changeData(ures)
          }
          try {
            wx.setStorageSync(res.data.data.id.toString(), ures)
            wx.navigateBack({
              delta: 1
            })
            // wx.showToast({
            //   title: '保存成功',
            //   icon: 'success',
            //   duration: 10000
            // })

            // setTimeout(function () {
            //   wx.hideToast()
            // }, 2000)
          } catch (e) {
            console.log(e)
          }
        });
      }
    })

  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', this.data.provice[e.detail.value])
    this.setData({
      index: e.detail.value,
      isSelect: true,
      regions: this.data.provice[e.detail.value]
    })
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