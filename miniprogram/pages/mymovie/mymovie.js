// pages/mymovie/mymovie.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      value: "",
      file: []
  },
  //提交功能
  submit() {
    // 1.获取上传图片
    var fileImg = this.data.file[0];
    // 2.截取文件后缀名称
    var suffix = /\.\w+$/.exec(fileImg)[0];
    // 3.创建新文件名称
    var newFile = new Date().getTime() + suffix;
    // 4.获取用户评论内容
    var content = this.data.value;
    // 5.上传文件操作
    wx.cloud.uploadFile({
      cloudPath: newFile,
      filePath: fileImg,
      success: res => {
        console.log(res);
        var fileId = res.fileID;
        db.collection("mymovie").add({
          data: {
            content: content,
            fileID: fileId
          }
        }).then(res=> {
          this.setData({
            value: "",
            file: []
          }) 
          wx.showToast({
            title: '提交成功...'
          })
        }).catch(err=> {
          console.log(err);
          wx.showToast({
            title: '提交失败...'
          })
        })
      },
      fail: err => {
        console.log(err);
      }
    })
    //  5.1如果上传成功，获取fileID
  },
  //图片上传功能
  upLoadImg() {
    wx.chooseImage({
      count:1,
      sizeType:["original","compressed"],
      sourceType: ["album", "camera"],
      success: res=> {
        console.log(res);
        var file = res.tempFilePaths;
        this.setData({
          file: file
        })
      },
      fail: err =>{
        console.log(err);
      }
    })
  },  
  //获取输入框中的值
  onChange(e) {
    this.setData({
      value: e.detail
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