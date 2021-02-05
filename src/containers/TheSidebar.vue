<template>

	<CSidebar 
		:show="$store.state.asideShow"
		@update:show="(val) => $store.commit('set', ['asideShow', val])"
		colorScheme="light"
		overlaid
	>
		<CSidebarClose @click.native="$store.commit('toggle', 'asideShow')"/>
		<CSidebarBrand class="d-md-down-none">
			<div class="Sidebar_title">
        		<i class="iconfont icon-hanbaobao"></i>
			</div>
		</CSidebarBrand>
		<!-- <i class="iconfont icon-11111-copy"></i> -->
		<el-menu
			router
			:default-active="activeIndex" 
			class="el-menu-vertical-demo"
			:background-color="($store.state.darkMode) ? '#0C0C0C' : '#F5F5F5'"
			:text-color="($store.state.darkMode) ? '#B7B7B7' : '#7A7A7A'"
			active-text-color="#000000">
			<el-menu-item index="/Dashboard">
				<i class="iconfont icon-11111-copy"></i>
				<span slot="title">{{$t("message.left.dashboard")}}</span>
			</el-menu-item>
			<el-menu-item index="/Liveview">
				<i class="iconfont icon-shipin1"></i>
				<span slot="title">{{$t("message.live.liveview")}}</span>
			</el-menu-item>
			<el-menu-item index="/Replay/Advancepb">
				<i class="iconfont icon-bofang2"></i>
				<span slot="title">{{$t("message.left.playback")}}</span>
			</el-menu-item>
		</el-menu>

	</CSidebar>
</template>

<script>
import nav from './_nav'
export default {
	name: 'TheSidebar',
	nav,
	computed: {
		show () {
		return this.$store.state.sidebarShow 
		},
		minimize () {
		return this.$store.state.sidebarMinimize 
		}
	},
	data(){
		return {
			activeIndex:"Dashboard"
		}
	},
	mounted(){
		this.menuList();	
	},
	methods:{
		menuList(){ 
			let path = this.$route.matched[1].meta.title
			console.log(path)
            this.activeIndex = path
        }
	}
}
</script>

<style lang="scss" scoped>
.Sidebar_title{
	text-align:left;width:100%;padding-left: 20px;
	i{
		font-size: 20px;
	}
}
</style>

