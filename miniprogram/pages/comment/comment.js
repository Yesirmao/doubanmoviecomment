// pages/comment/comment.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",  //获取评论框中输入的内容
    id:"",  //传递过来的id的值,电影id
    score: 1, //评分
    list: [],  //调用云函数获取返回的接口的数据
    upLoadImage: [], //上传的预览图片
    fileIDS: [],   //顺序保存上传的图片的fileID
    showContent: [] //显示的评论数
  },
  // 评论提交,将选中的图片，评论，点赞提交到云存储中
  sumbit() {
    // 1.在data添加属性fileIDS
    // 2.显示加载动画提示框"正在提交中"
    wx.showLoading({
      title: "数据正在提交中......",
      mask: true
    });
    // 3.上传到云存储
    //   3.1创建安promise数组，保存promise对象
    var promise = [];
    //   3.2创建一个循环遍历选中图片
    for(var i=0; i< this.data.upLoadImage.length; i++) {
      //   3.3创建promise对象
      var newPromise = new Promise((resolve,reject) => {
        //  3.3.3获取当前图片
        var pic = this.data.upLoadImage[i];
        //  3.3.2创建正则表达式拆分文件后缀名 .jpg  .gif  .png
        // var reg = /(\.jpg|\.gif|\.png)$/;
        var suffix = /\.\w+$/.exec(pic)[0];
        // 3.3.3上传图片并且将fileID保存到数组中
        wx.cloud.uploadFile({
          //// 3.3.4为图片创建新文件名
          cloudPath: new Date().getTime() + Math.floor(Math.random()*9999) + suffix,
          filePath: pic,    //需要上传图片的文件名
          success: res => { //上传成功
          // 3.3.5上传成功拼接fileID
            var newFile = res.fileID;
            var ids = this.data.fileIDS.concat(newFile);
            this.setData({
              fileIDS: ids
            })
          // 3.3.6将当前promise任务追加到任务列表中
          resolve();
          },
          // 3.3.7上传失败输出错误消息
          fail: err => {
            console.log(err);
          }
        })
      });
      promise.push(newPromise);
    }
    // 将云存储中fileId一次性存储到云数据库中
    // 4.在云数据库中添加集合doubancomment，用于保存评论，点赞和图片id
    // 5.等待数组中所有promise任务执行结束
    Promise.all(promise).then(res=> {
    // 6.回调函数中
    // 6.1在程序最顶端初始化数据库
    db.collection("doubancomment").add({
      // 7.将评论内容  分数  电影id  上传图片多有id添加结合中
      data: {
        content: this.data.value,     //评论的内容
        score: this.data.score,       //评论的分数
        movieId: this.data.id,        //电影id
        fileIds: this.data.fileIDS    //图片fileID
      }
    }).then(res=> { 
      // 请求成功，还原各项内容
      this.setData({
        value: "",
        score: 1,
        upLoadImage: []
      })
      // 8.隐藏加载提示框
      wx.hideLoading();
    // 9.显示提示框"发表成功"
      wx.showToast({
        title: '发表成功',
      })
      // 发表成功，将评论显示出来
      db.collection("doubancomment").get().then(res=> {
        this.setData({
          showContent: res.data
        })
      }).catch(err=> {
        console.log(err);
      })
    }).catch(err=> {
      // 10.添加集合失败
       // 11.隐藏加载提示框
       wx.hideLoading();
    // 12.显示提示框“评论失败”
    wx.showToast({
      title: '评论失败',
    })
      console.log(err);
    })
    })
  },
  // 上传图片至云存储
  uploadImg() {
    // 步骤一：选择图片
    wx.chooseImage({
      count: 9,                 //上传图片的数量
      sizeType: ["original","compressed"],   //上传图片的类型，原图片，缩略图
      sourceType: ["album", "camera"], //图片上传的资源类型，相册，相机            
      success: res => {         //上传成功的回调函数
        var listImage = res.tempFilePaths;  //选择图片的地址
        this.setData({
          upLoadImage: listImage
        })
      },
      fail: err=> {
        console.log(err);
      }
    })
  },
  //获取评论框中的内容
  onContentChange(e) {
    this.setData({
      value: e.detail
    })
  },
  // 用户打分对应事件处理函数
  onScoreChange(e) {
    // 将用户输入新分数赋值操作
    this.setData({
      score: e.detail
    });
  },
  //调用云函数，获取返回的数据
  loadMore() {
    wx.showLoading({
      title: '数据加载中......',
    })
    wx.cloud.callFunction({ //调用云函数
      name: "detaildb",     //云函数名字
      data:{                
        id: this.data.id    //云函数请求id
      }
    }).then(res=> {
      this.setData({
        list: JSON.parse(res.result)  //保存请求成功后的数据
      })
      wx.hideLoading();      //隐藏加载栏
    }).catch(err => {
      console.log(err);
    })
  },
  // 评论查询功能
  search() {
    // 发表成功，将评论显示出来
    db.collection("doubancomment").get().then(res => {
      this.setData({
        showContent: res.data
      })
    }).catch(err => {
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //将电影列表的id，保存到data中的id中
    this.setData({
      id: options.id
    })
    this.loadMore();
    this.search();
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