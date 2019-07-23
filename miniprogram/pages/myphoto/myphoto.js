// pages/myphoto/myphoto.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []                        //存储数据库中查询的所有图片
  },
  // 添加数据
  addImgId: function(fileId) {
    db.collection("myphoto").add({  //向数据库中添加数据
      data: {                       //添加的数据
        fileID: fileId
      },
      success: res => {              //添加成功的回调函数
        console.log(res);
      },
      fail: err => {                 //添加失败的回调函数
        console.log(err);
      }
    })
  },
  // 负责获取数据库中所有图片路径，并且显示到模板中
  showImage: function() {
    db.collection("myphoto").get().then(res=>{    //获取集合中的数据               
      this.setData({                //将查询结果保存，将集合中的数据存储到list中
        list: res.data
      })
    }).catch(err=>{
      console.log(err);
    })
  },
  // 此函数负责选择图片并将图片上传至云存储
  upLoadImg: function() {
    // 步骤一：选择图片
    wx.chooseImage({
      count: 9,                 //上传图片的数量
      sizeType: ["original","compressed"],  //选中图片类型
      sourceType: ["album","camera"],       //上传资源的类型
      success: function(res) {              //选中图片的回调函数
        var list = res.tempFilePaths;       //选中图片的地址
        // 步骤二：上传图片至云存储
        var file = list[0];                 //获取选中图片的地址
        var newImgPath = new Date().getTime()+"png";// 上传图片
        wx.cloud.uploadFile({
          cloudPath: newImgPath,            //上传至云存储后的新图片名称
          filePath: file,                   //选中的需要上传的图片名
          success: res => {                 //图片上传成功后的回调函数
            // 步骤三：将上传的图片的id保存到myphoto集合中
            db.collection("myphoto").add({  //向数据库中添加数据
              data: {                       //添加的数据
                fileID: res.fileID
              },
              success: res => {              //添加成功的回调函数
              },
              fail: err => {                 //添加失败的回调函数
                console.log(err);
              }
            })
          },
          fail: err => {                    //图片上传失败后的回调函数
            console.log(err);
          }
        })  
      },
      fail: err=> {                         //选中图片失败后的回调函数
        console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})