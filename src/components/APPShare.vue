<template>
  <div>
    <header>
      <div class="icon-container">
        <img src="../assets/imgs/icon1.png" alt="icon" class="icon icon1"/>
        <img src="../assets/imgs/icon2.png" alt="icon" class="icon icon2"/>
        <img src="../assets/imgs/icon3.png" alt="icon" class="icon3"/>
        <img src="../assets/imgs/icon4.png" alt="icon" class="icon icon4"/>
      </div>
      <div class="head-container">
        <img src="../assets/imgs/logo.png" alt="logo" class="logo"/>
        <h3>鲜面连线 by AppSo</h3>
        <p>－每日精品限免 / 促销应用－</p>
      </div>
    </header>
    <div class="container" v-bind:class='{"mb-80":!footHide}'>
      <div class="app-list">
        <div class="app-item" v-for="(item,index) in appList" :key="index">
          <div class="item-brief" v-on:click='itemToggle(index)' v-bind:key='index'>
            <div class="item-icon">
              <img v-bind:src="item.app.icon.image" alt="icon"/>
            </div>
            <div class="content">
              <div>
                <div class="title">{{ item.app.name }}</div>
                <div class="sub-title">
                  <span class="device">{{item.app.download_link[0].device.split(" ")[0]}}</span>
                  <span class="time">{{time}}</span>
                </div>
              </div>
              <div class="price">
                <span class="price-original">¥ {{item.discount_info[0].original_price}}</span>
                <a :href="item.app.download_link[0].link" target="_blank" class="price-discount" v-on:click.stop>{{item.discount_info[0].discounted_price==0?'Free':item.discount_info[0].discounted_price}}</a>
              </div>
            </div>
          </div>
          <div class="item-detail" v-bind:class="{'show':item.isShow}">
            <div class="detail-container">
              <div class="detail-abstract">{{item.content}}</div>
              <div class="detail-images">
                <ul class="imageList">
                  <li v-for="(img,index) in item.imgList" :key="index" class="imageItem"><img v-bind:src="img.image" alt="图片" width="100%" height="100%"/></li>
                </ul>
              </div>
            </div>
            <div class="detail-foot">
              <span class="packup" v-on:click="packUp(index)"><i>&#x5e;</i>收起</span>
            </div>
          </div>
        </div>
      </div>
      <div class="load-more" v-on:click="loadMore">加载更多</div>
    </div>
    <footer class="hide foot" v-bind:class="{'hide-foot':footHide}">
      <div class="close-bg"></div>
      <div class="close" v-on:click.stop="hideFoot">x</div>
      <div class="app-foot">
        <div class="foot-icon">
          <img src="../assets/imgs/logo.png" alt="logo"/>
        </div>
        <div class="foot-content">
          <div>
            <div class="name">AppSo</div>
            <div class="desc">又手慢了？App 第一时间通知你！</div>
          </div>
          <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.ifanr.appso&ckey=CK1340330450796" target="_blank" class="fine" v-on:click.stop>好的 !</a>
      </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
	name: 'APPShare',
	data() {
		return {
			appList: [],
			time: '',
			footHide: false,
			offset: 0
		}
	},
	created() {
		this.getNowDate()
		this.getAppData(this.offset)
	},
	methods: {
		// 获取当天的年月日
		getNowDate() {
			let now = new Date()
			let year = now.getFullYear()
			let month = now.getMonth() + 1
			let date = now.getDate()
			this.time = year + '-' + month + '-' + date
		},
		// 展开收缩
		itemToggle(index) {
			let temp = this.appList[index]
			temp.isShow = !temp.isShow
			// 展开的时候发送请求
			if (temp.isShow) {
				this.$http
					.get(`/api/v5/appso/app/${temp.app.id}/?platform=web`)
					.then(function(res) {
						temp.imgList = res.data.screenshot
					})
					.catch(function(err) {
						console.log('连接失败' + err)
					})
			}
		},
		// 点x按钮关闭底部窗口
		hideFoot() {
			this.footHide = true
		},
		// 点击收起
		packUp(index) {
			this.appList[index].isShow = false
		},
		// 加载更多
		loadMore() {
			this.getAppData(this.offset)
		},
		// 从接口获取数据
		getAppData(offset) {
			this.$http
				.get(`/api/v5/appso/discount/?limit=10&offset=${offset}&platform=web`)
				.then((res) => {
					// 连接成功后的回调函数
					console.log('连接成功')
					this.offset += res.data.objects.length
					res.data.objects.forEach(e => {
						e.isShow = false
						e.imgList = []
					})
					this.appList.push(...res.data.objects)
				})
				.catch(function(err) {
					// 连接失败后的回调函数
					console.log('连接失败' + err)
				})
		}
	}
}
</script>

<style scoped lang='scss'>
@import '../style/appShare.scss'
</style>


// 1、scss编写样式表
// 2、箭头函数使用
// 3、查下v-for的唯一标示key
// 4、eslint的使用学习
// 5、rem
