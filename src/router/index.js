import Vue from 'vue'
import Router from 'vue-router'
import APPShare from '@/components/APPShare'

Vue.use(Router)
export default new Router({
	routes: [{
		path: '/',
		name: 'APPShare',
		component: APPShare
	}]
})
