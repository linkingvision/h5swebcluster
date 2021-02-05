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
const Liveview = () => import('@/views/Liveview')
const Replay = () => import('@/views/Replay')

const Event = () => import('@/views/dashboard/Event')
const Devlist = () => import('@/views/dashboard/Devlist')
const Devresources = () => import('@/views/dashboard/Devresources')
const Nodemonitoring = () => import('@/views/dashboard/Nodemonitoring')

const Advancepb = () => import('@/views/replay/Advancepb')
const Archive = () => import('@/views/replay/Archive')


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
						title: '/Dashboard',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Liveview',
					name: 'Liveview',
					component: Liveview,
					meta: {
						title: '/Liveview',
						name:i18n.tc("message.live.liveview"),
						icon:'iconfont icon-shipin1',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					},
				},{
					path: 'Event',
					name: 'Event',
					component: Event,
					meta: {
						title: '/Event',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Nodemonitoring',
					name: 'Nodemonitoring',
					component: Nodemonitoring,
					meta: {
						title: '/Nodemonitoring',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Devlist',
					name: 'Devlist',
					component: Devlist,
					meta: {
						title: '/Devlist',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Devresources',
					name: 'Devresources',
					component: Devresources,
					meta: {
						title: '/Devresources',
						name:i18n.tc("message.left.dashboard"),
						icon:'iconfont icon-11111-copy',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					}
				},{
					path: 'Replay',
					name: 'Replay',
					component: Replay,
					meta: {
						title: '/Replay/Advancepb',
						name:i18n.tc("message.left.playback"),
						icon:'iconfont icon-bofang1',
						type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
					},
					children: [
						{
							path: 'Advancepb',
							name: 'Advancepb',
							component: Advancepb,
							meta: {
								title: 'Advancepb',
								name:i18n.tc("message.left.AdvancePB"),
								icon:'iconfont icon-bofang1',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						},{
							path: 'Archive',
							name: 'Archive',
							component: Archive,
							meta: {
								title: 'Archive',
								name:i18n.tc("message.left.AdvancePB"),
								icon:'iconfont icon-bofang1',
								type: 'Operator'  // 是否需要判断是否登录,这里是需要判断
							},
						}
					]
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
if(sessionStorage.getItem('clusterroot')){
	store.state.root=sessionStorage.getItem('clusterroot');
}
if(sessionStorage.getItem('clusteruser')){
	store.state.user=sessionStorage.getItem('clusteruser');
}

if(localStorage.getItem('clusterliveviewrtc')){
	store.state.clusterliveviewrtc=localStorage.getItem('clusterliveviewrtc');
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
