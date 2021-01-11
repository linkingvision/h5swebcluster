<template>

	<CSidebar 
		:show="$store.state.asideShow"
		@update:show="(val) => $store.commit('set', ['asideShow', val])"
		colorScheme="light"
		overlaid
	>
		<CSidebarClose @click.native="$store.commit('toggle', 'asideShow')"/>
		<CSidebarBrand class="d-md-down-none">
		<!-- <img 
			src="../assets/imgs/cluster_logo_red.svg"
			width="300"
			height="36"
			alt="cluster Logo"/> -->
			<div style="text-align:left;width:100%;padding-left: 20px;">
        		<i class="iconfont iconhanbaobao"></i>
			</div>
		</CSidebarBrand>
		<!-- <i class="iconfont icon-11111-copy"></i> -->
		<!-- <el-menu
			router
			:default-active="activeIndex" 
			class="el-menu-vertical-demo"
			:background-color="($store.state.darkMode) ? '#0C0C0C' : '#F5F5F5'"
			:text-color="($store.state.darkMode) ? '#B7B7B7' : '#7A7A7A'"
			active-text-color="#000000">
			<el-menu-item index="/Dashboard">
				<span slot="title">{{$t("message.left.dashboard")}}</span>
			</el-menu-item>
			<el-menu-item index="/Devresources">
				<span slot="title">监控点</span>
			</el-menu-item>
		</el-menu> -->

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
			console.log(this.$route)
            this.activeIndex = path
        }
	}
}
</script>

<style lang="scss" scoped>
</style>

