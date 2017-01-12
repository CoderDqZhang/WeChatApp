var rootDocment = 'https://api.niceticket.cc/';//你的域名  
function requestPost(url,data,cb){  
    wx.request({  
      url: rootDocment + url,  
      data: data,  
      method: 'post',  
      header: {'Content-Type': 'application/json'},  
      success: function(res){  
        return typeof cb == "function" && cb(res.data)  
      },  
      fail: function(){  
        return typeof cb == "function" && cb(false)  
      }  
    })  
}

function requestGet(url,data,cb){  
    wx.request({  
      url: rootDocment + url,  
      data: data,  
      method: 'get',  
      success: function(res){  
        return typeof cb == "function" && cb(res.data)  
      },  
      fail: function(){  
        return typeof cb == "function" && cb(false)  
      }  
    })  
}

module.exports.requestPost = requestPost
module.exports.requestGet = requestGet