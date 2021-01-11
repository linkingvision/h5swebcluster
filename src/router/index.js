import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import VueI18n from 'vue-i18n'
import LangEn from '../../static/lang/en'
import LangZhCHS from '../../static/lang/zhchs'
import LangZhCHT from '../../static/lang/zhcht'

Vue.use(VueI18n)
const i18n = new VueI18n({
  locale:"zhchs",
  messages: {
    'en': LangEn,
    'zhchs': LangZhCHS,
    'zhcht': LangZhCHT
  }
})

// Containers
const Login = () => import('@/containers/Login')
const Logout = () => import('@/containers/Logout')
const TheContainer = () => import('@/containers/TheContainer')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Event = () => import('@/views/dashboard/Event')
const Devlist = () => import('@/views/dashboard/Devlist')
const Devresources = () => import('@/views/dashboard/Devresources')
const Nodemonitoring = () => import('@/views/dashboard/Nodemonitoring')


Vue.use(Router)

export default new Router({
	mode: 'hash', // https://router.vuejs.org/api/#mode
	linkActiveClass: 'open active',
	scrollBehavior: () => ({ y: 0 }),
	routes: [
		{path:"/",redirect:'/Login'},
		{
			path: '/',
			name: 'Home',
			component: TheContainer,
			meta: {
                type: 'Administrator'  // 是否需要判断是否登录,这里是需要判断
            },
			children: [
				{
					path: 'Dashboard',
					name: 'Dashboard',
					component: Dashboard,
					meta: {
						title: 'Dashboard',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Event',
					name: 'Event',
					component: Event,
					meta: {
						title: 'Event',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Nodemonitoring',
					name: 'Nodemonitoring',
					component: Nodemonitoring,
					meta: {
						title: 'Nodemonitoring',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Devlist',
					name: 'Devlist',
					component: Devlist,
					meta: {
						title: 'Devlist',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Devresources',
					name: 'Devresources',
					component: Devresources,
					meta: {
						title: 'Devresources',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},
			]
		},{
			path: '/Login',
			name: 'Login',
			component: Login,
			meta: {
				title: 'login',
				type: '' // 不需要鉴权
			}
        },{
			path: '/Logout',
			name: 'Logout',
			component: Logout,
			meta: {
				title: 'Logout',
				type: '' // 不需要鉴权
			}
        }
	]
})

if(sessionStorage.getItem('clustertoken')){
	store.state.token=sessionStorage.getItem('clustertoken');
}

if(localStorage.getItem('Clusterthemetoggle')){
	console.log('主题',JSON.parse(localStorage.getItem('Clusterthemetoggle')))
	store.state.darkMode=JSON.parse(localStorage.getItem('Clusterthemetoggle'));
}

let root=process.env.VUE_APP_URL;
if (root == undefined){
	root = window.location.protocol + '//' + window.location.host + window.location.pathname;
}
console.log(root)
store.state.IPPORT=root

var wsroot = process.env.VUE_APP_PORT;
if (wsroot == undefined)
{
	wsroot = window.location.host;
}
console.log(wsroot)
store.state.WSROOT=wsroot
