import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false,
  darkMode: true,
  asideShow: false,
  //登录
  lang:"zhchs",
  token:null,
  user:null,
  Adswitch:"false",
  root:null,
  //session
  IPPORT:'',
  WSROOT:'',
  //实时播放
  clusterliveviewrtc:'WS',
  watermarkstring:"linkingvision",
  liveviewadd:[],
  liveplay:{
    token:null,
    streamprofile:null,
    name:null,
    label:null,
    vid:null,
    viewparameter:null
  }
}

const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  },
  toggle (state, variable) {
    state[variable] = !state[variable]
  }
}

export default new Vuex.Store({
  state,
  mutations
})