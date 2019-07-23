// pages/movieIndex/movieIndex.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList:[]
  },
  // 详情跳转按钮
  jumpDetail(e) {
    var id = e.target.dataset.id;
    // 保留并且可以跳转回原页面,允许回退
    wx.navigateTo({
      url: "/pages/comment/comment?id="+id,
    })
  },
  // 加载数据，发送请求获取第一页数据
  loadMore() {
    wx.cloud.callFunction({   //调用云函数
      name: "movelistdb",     //云函数名字
      data: {                 //需要传递给云函数参数
        start: this.data.movieList.length,
        count: 10
      }
    }).then(res=> {           //调用云函数成功，返回的数据
      var row = JSON.parse(res.result).subjects;
      console.log(row);
      row = this.data.movieList.concat(row);
        this.setData({
          movieList: row
        })
    }).catch(err=> {
      console.log(err);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore();
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
      // 发送请求下载下一页数据
      this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})