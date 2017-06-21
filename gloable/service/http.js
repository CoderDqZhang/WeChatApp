var rootDocment = 'https://api.niceticket.cc/';//你的域名  
// var rootDocment = 'https://api.liangpiao.me/'

function requestPut(url, data, cb) {
  var lp_session_id;
  console.log("请求post")
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      lp_session_id = res.data.data.lp_session_id
      wx.request({
        url: rootDocment + url,
        data: data,
        method: 'put',
        header: {
          'content-type': 'application/json',
          'Authorization': res.data.data.lp_session_id
        },
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        },
      })
    },
    fail: function () {
      if (res.message != null) {
        wx.showModal({
          title: "请允许获取用户信息",
          confirmColor: "#4bd4c5",
          confirmText: "知道了",
          success: function (res) {
            console.log('用户点击确定')
          }
        })
      }
      return typeof cb == "function" && cb(false)
    }
  })
}

function requestDelete(url, data, cb) {
  var lp_session_id;
  console.log("请求delete")
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      lp_session_id = res.data.data.lp_session_id
      wx.request({
        url: rootDocment + url,
        data: data,
        method: 'delete',
        header: {
          'content-type': 'application/json',
          'Authorization': res.data.data.lp_session_id
        },
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        },
      })
    },
    fail: function () {
      if (res.message != null) {
        wx.showModal({
          title: "请允许获取用户信息",
          confirmColor: "#4bd4c5",
          confirmText: "知道了",
          success: function (res) {
            console.log('用户点击确定')
          }
        })
      }
      return typeof cb == "function" && cb(false)
    }
  })
}

function requestPost(url, data, cb) {
  var lp_session_id;
  console.log("请求post")
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      lp_session_id = res.data.data.lp_session_id
      wx.request({
        url: rootDocment + url,
        data: data,
        method: 'post',
        header: {
          'content-type': 'application/json',
          'Authorization': res.data.data.lp_session_id
        },
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        },
      })
    },
    fail: function () {
      if (res.message != null) {
        wx.showModal({
          title: "请允许获取用户信息",
          confirmColor: "#4bd4c5",
          confirmText: "知道了",
          success: function (res) {
            console.log('用户点击确定')
          }
        })
      }
      return typeof cb == "function" && cb(false)
    }
  })
}

function requestGet(url, data, cb) {
  var lp_session_id;
  console.log("请求get")
  wx.getStorage({
    key: 'userInfo',
    success: function (res) {
      console.log(res)
      lp_session_id = res.data.data.lp_session_id
      wx.request({
        url: rootDocment + url,
        data: data,
        header: {
          'content-type': 'application/json',
          'Authorization': res.data.data.lp_session_id
        },
        method: 'get',
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        },

      })
    },
    fail: function () {
      wx.request({
        url: rootDocment + url,
        data: data,
        header: {
          'content-type': 'application/json',
        },
        method: 'get',
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          return typeof cb == "function" && cb(false)
        },

      })
      console.log("用户信息获取失败")
    }
  })
}

function requestUpload(url, data, filePath, name, cb){
  var lp_session_id;
  console.log("请求Upload")
  wx.getStorage({
    key: 'userInfo',

    success: function (res) {
      lp_session_id = res.data.data.lp_session_id
      wx.uploadFile({
        url: rootDocment + url,
        filePath: filePath,
        name:name,
        formData: data,
        method: 'post',
        header: {
          "content-type": "application/json",
          "cache-control": "no-cache",
          'Authorization': res.data.data.lp_session_id
        },
        success: function (res) {
          return typeof cb == "function" && cb(res.data)
        },
        fail: function () {
          
          return typeof cb == "function" && cb(false)
        },
      })
    },
    fail: function () {
      if (res.message != null) {
        wx.showModal({
          title: "请允许获取用户信息",
          confirmColor: "#4bd4c5",
          confirmText: "知道了",
          success: function (res) {
            console.log('用户点击确定')
          }
        })
      }
      return typeof cb == "function" && cb(false)
    }
  })
}

function requestSessionIDGet(url, data,lp_session_id, cb){
  wx.request({
    url: rootDocment + url,
    data: data,
    header: {
      'content-type': 'application/json',
      'Authorization': lp_session_id
    },
    method: 'get',
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    },

  })
}



module.exports.requestPost = requestPost
module.exports.requestGet = requestGet
module.exports.requestDelete = requestDelete
module.exports.requestPut = requestPut
module.exports.requestUpload = requestUpload
module.exports.requestSessionIDGet = requestSessionIDGet