<template>
  <div>
    <header>
      <div class="icon-container">
        <img src="../assets/imgs/icon1.png" alt="icon" class="icon icon1">
        <img src="../assets/imgs/icon2.png" alt="icon" class="icon icon2">
        <img src="../assets/imgs/icon3.png" alt="icon" class="icon3">
        <img src="../assets/imgs/icon4.png" alt="icon" class="icon icon4">
      </div>
      <div class="head-container">
        <img src="../assets/imgs/logo.png" alt="logo" class="logo">
        <h3>鲜面连线 by AppSo</h3>
        <p>－每日精品限免 / 促销应用－</p>
      </div>
    </header>
    <div class="container" :class="{'mb-80':!footHide}">
      <div class="app-list">
        <div class="app-item" v-for="(item,index) in appList">
          <div class="item-brief" @click="itemToggle(index)">
            <div class="item-icon">
              <img :src="item.app.icon.image" alt="icon">
            </div>
            <div class="content">
              <div>
                <div class="title">{{item.app.name}}</div>
                <div class="sub-title">
                  <span class="device">{{item.app.download_link[0].device.split(" ")[0]}}</span>
                  <span class="time">{{time}}</span>
                </div>
              </div>
              <div class="price">
                <span class="price-original">¥ {{item.discount_info[0].original_price}}</span>
                <a :href="item.app.download_link[0].link" target="_blank" class="price-discount" @click.stop>{{item.discount_info[0].discounted_price==0?'Free':item.discount_info[0].discounted_price}}</a>
              </div>
            </div>
          </div>
          <div class="item-detail" :class="{'show':item.isShow}">
            <div class="detail-container">
              <div class="detail-abstract">{{item.content}}</div>
              <div class="detail-images">
                <ul class="imageList">
                  <li v-for="img in item.imgList" class="imageItem"><img :src="img.image" alt="图片" width="100%" height="100%"></li>
                </ul>
              </div>
            </div>
            <div class="detail-foot">
              <span class="packup" @click="packUp(index)"><i>&#x5e;</i>收起</span>
            </div>
          </div>
        </div>
      </div>
      <div class="load-more" @click="loadMore">加载更多</div>
    </div>
    <footer class="hide foot" :class="{'hide-foot':footHide}">
      <div class="close-bg"></div>
      <div class="close" @click.stop="hideFoot">x</div>
      <div class="app-foot">
        <div class="foot-icon">
          <img src="../assets/imgs/logo.png" alt="logo">
        </div>
        <div class="foot-content">
          <div>
            <div class="name">AppSo</div>
            <div class="desc">又手慢了？App 第一时间通知你！</div>
          </div>
          <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ifanr.appso&ckey=CK1340330450796" target="_blank" class="fine" @click.stop>好的 !</a>
      </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "APPShare",
  data() {
    return {
      appList: [],
      time: "",
      footHide: false,
      offset: 0
    };
  },
  created() {
    this.getNowDate();
    this.getAppData(this.offset);
  },
  methods: {
    // 获取当天的年月日
    getNowDate() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let date = now.getDate();
      this.time = year + "-" + month + "-" + date;
    },
    // 展开收缩
    itemToggle(index) {
      let temp = this.appList[index];
      temp.isShow = !temp.isShow;
      // 展开的时候发送请求
      if (temp.isShow) {
        let _self = this;
        this.$http
          .get(`/api/v5/appso/app/${temp.app.id}/?platform=web`)
          .then(function(res) {
            temp.imgList = res.data.screenshot;
          })
          .catch(function(err) {
            console.log("连接失败" + err);
          });
      }
    },
    // 点x按钮关闭底部窗口
    hideFoot() {
      this.footHide = true;
    },
    // 点击收起
    packUp(index) {
      this.appList[index].isShow = false;
    },
    // 加载更多
    loadMore() {
      this.getAppData(this.offset);
    },
    // 从接口获取数据
    getAppData(offset) {
      let _self = this;
      this.$http
        .get(`/api/v5/appso/discount/?limit=10&offset=${offset}&platform=web`)
        .then(function(res) {
          // 连接成功后的回调函数
          console.log("连接成功");
          _self.offset += res.data.objects.length;
          res.data.objects.forEach(e => {
            e.isShow = false;
            e.imgList = [];
          });
          _self.appList.push(...res.data.objects);
        })
        .catch(function(err) {
          // 连接失败后的回调函数
          console.log("连接失败" + err);
        });
    }
  }
};
</script>

<style scoped>
/* header部分start */
header {
  position: relative;
}
.icon-container {
  position: relative;
  top: 0;
}
.icon {
  position: absolute;
  width: 100px;
}
.icon1 {
  top: 165px;
  left: 30px;
}
.icon2 {
  top: -35px;
  right: 0;
}
.icon3 {
  position: absolute;
  top: 95px;
  right: 0;
  width: 70px;
}
.icon4 {
  top: 15px;
  left: 0;
}
.head-container {
  margin: 35px 0;
  text-align: center;
}
.logo {
  display: block;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}
.head-container h3 {
  margin-top: 25px;
  font-size: 16px;
  font-weight: 700;
  color: rgba(10, 37, 51, 0.72);
}
.head-container p {
  font-size: 14px;
  margin-top: 10px;
  color: rgba(10, 37, 51, 0.6);
}
/* header部分end */
/* container部分start */
.mb-80 {
  margin-bottom: 80px;
}
.item-icon {
  float: left;
  margin-right: 12px;
  width: 70px;
  height: 70px;
}
.item-icon img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
}
.content {
  margin-top: 12px;
  position: relative;
}
.app-item {
  border-bottom: 1px solid #eee;
}
.app-item:first-child {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
.item-brief {
  background-color: #fff;
  padding: 20px;
  overflow: hidden;
}
.title {
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
@media screen and (max-width: 414px) {
  .title {
    width: 130px;
  }
}
.sub-title {
  margin-top: 8px;
  font-size: 13px;
  color: #999;
}
.device {
  margin-right: 15px;
  position: relative;
}
.device::after {
  content: "";
  width: 4px;
  height: 4px;
  background-color: rgba(10, 37, 51, 0.24);
  border-radius: 2px;
  position: absolute;
  right: -10px;
  top: 5px;
}
.price {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 26px;
  line-height: 26px;
  font-size: 0;
}
.price-original {
  font-size: 13px;
  color: #999;
  text-decoration: line-through;
}
.price-discount {
  display: inline-block;
  width: 60px;
  min-width: 50px;
  font-size: 13px;
  margin-left: 7px;
  background-color: #e33344;
  border-radius: 20px;
  color: #fff;
  text-align: center;
  text-decoration: none;
}
.item-detail {
  /* height: 0; */
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  transition-property: opacity, max-height;
  transition-duration: 0.35s, 0.4s;
}
.show {
  /* height: auto; */
  max-height: 800px;
  opacity: 1;
}
.detail-abstract {
  margin: 17px 20px 0;
  font-size: 15px;
  text-align: justify;
  color: rgba(10, 37, 51, 0.6);
}
.detail-foot {
  padding: 10px 20px;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 20px;
  line-height: 35px;
}
.packup {
  display: inline-block;
  float: right;
  padding: 1px 10px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.04);
  color: rgba(10, 37, 51, 0.48);
  font-size: 14px;
}
.packup i {
  display: inline-block;
  font-size: 25px;
  width: 20px;
  vertical-align: middle;
  text-align: center;
  font-style: normal;
}
.detail-images {
  margin: 15px 0 10px;
  overflow-x: scroll;
  white-space: nowrap;
}
.imageItem {
  display: inline-block;
  width: 200px;
  margin: 0 5px;
}
.imageItem:first-child {
  margin-left: 20px;
}
.imageItem:last-child {
  margin-right: 20px;
}
.load-more {
  margin: 20px 0;
  color: rgba(10, 37, 51, 0.36);
  border: 1px solid rgba(10, 37, 51, 0.04);
  border-radius: 4px;
  height: 50px;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
  background-color: #fff;
}
/* container部分end */
/* footer部分start */
.hide {
  display: none;
}
@media screen and (max-width: 414px) {
  .foot {
    display: block;
    position: fixed;
    bottom: 0;
    box-sizing: border-box;
    width: 100%;
    height: 56px;
    padding: 8px 10px;
    background-color: #f7f7f9;
    box-shadow: 0 0 2px 2px rgba(0, 0, 0, 0.1);
  }
}
.foot-icon {
  float: left;
  margin-right: 7px;
  width: 40px;
  height: 40px;
}
.foot-icon img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.foot-content {
  position: relative;
}
.name {
  color: rgba(10, 37, 51, 0.84);
  font-size: 14px;
  line-height: 20px;
}
.desc {
  color: rgba(10, 37, 51, 0.6);
  font-size: 12px;
  line-height: 20px;
}
.fine {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 70px;
  height: 30px;
  font-size: 12px;
  line-height: 30px;
  text-align: center;
  background-color: #c13a43;
  color: #fff;
  border-radius: 5px;
  box-shadow: 0 1px 1px #000;
  text-decoration: none;
}
.close-bg {
  position: absolute;
  left: -6px;
  top: -19px;
  width: 32px;
  height: 20px;
  background-color: #f7f7f9;
  box-shadow: 2px -2px 2px 0 rgba(0, 0, 0, 0.1);
  transform: skewX(25deg);
}
.close {
  position: absolute;
  left: 8px;
  top: -20px;
  font-size: 17px;
  color: #030303;
}
.hide-foot {
  display: none;
}
/* footer部分end */
</style>
