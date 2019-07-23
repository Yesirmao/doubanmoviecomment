/*
  云函数说明：
  功能：向豆瓣网发送请求，获取最热映电影列表
*/
// 1.引入第三方ajax库request-Promise
var requestPromise = require("request-promise");
// 2.创建main函数
exports.main = async (event, context) => {
  // 3.创建变量url请求地址
  var url = `http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${event.start}&count=${event.count}`;
  // 4.请求rp函数发送请求并且将豆瓣返回电影列表返回调用者
  return requestPromise(url).then(res => {  //发送请求
    return res;                             //发送成功返回结果
  }).catch(err => {                         //请求失败，请求失败的原因
    console.log(err);
  })
}






// // 云函数入口文件
// const cloud = require('wx-server-sdk')

// cloud.init()

// // 云函数入口函数
// exports.main = async (event, context) => {
//   const wxContext = cloud.getWXContext()

//   return {
//     event,
//     openid: wxContext.OPENID,
//     appid: wxContext.APPID,
//     unionid: wxContext.UNIONID,
//   }
// }