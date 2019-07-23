// // 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 功能：发送ajax请求，获取豆瓣电影详情内容
// 1.引入第三方库request-promise
var requestPromise = require("request-promise");
// 2.创建main函数
exports.main = async (event, context) => {
  var url = `http://api.douban.com/v2/movie/subject/${event.id}?apikey=0df993c66c0c636e29ecbb5344252a4a`;
  return requestPromise(url).then(res => {
    return res;
    console.log(res);
  }).catch(err => {
    return err;
  })
}
// 3.向豆瓣发送请求
// 4.返回带豆瓣电影详情的内容


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