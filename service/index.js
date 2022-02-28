const BASE_URL = "http://123.207.32.32:9001"

// 用已经部署好的
const LOGIN_BASE_URL = "http://123.207.32.32:3000"
// 用自己的登录服务器代码,自己部署
// const LOGIN_BASE_URL = "http://localhost:3000"
class XSRequest{
  constructor(baseURL){
    this.baseURL = baseURL
  }
  request(url,method,params){
    return new Promise((resolve,reject) => {
      wx.request({
        url: this.baseURL + url,
        method:method,
        data:params,
        success:function(res){
          resolve(res.data)
        },
        fail:function(err){
          reject(err)
        }
      })
    })
  }

  get(url,params){
    return this.request(url,"GET",params)
  }

  post(url,data){
    return this.request(url,"POST",data)
  }
}

const xsRequest = new XSRequest(BASE_URL)

const xsLoginRequest = new XSRequest(LOGIN_BASE_URL)

export default xsRequest

export {
  xsLoginRequest
}