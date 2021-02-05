<template>
<div>
	<el-dialog
		class="plugin_adout"
		:visible.sync="centerDialogVisible"
		width="25%"
		append-to-body
		center>
		<div class="about_flex">
			<div v-if="$store.state.darkMode">
				<img class="adout_img" src="../assets/imgs/cluster_logo_header.svg"/>
			</div>
			<div v-else>
				<img class="adout_img" src="../assets/imgs/cluster_logo_header.svg"/>
			</div>
			<div style="margin: 20px 0 10px 20px; text-align: center;">
				<!-- <div>{{$t("message.dashboard.version")}}: {{information.strVersion}}</div> -->
			</div>
		</div>
	</el-dialog>
	<CHeader  v-if="this.$route.matched[1].meta.icon=='iconfont icon-11111-copy'" with-subheader  class="Cluster_header">
		<CHeaderNav class="mr-auto">
			<CHeaderNavItem class="px-3">
				<button
				in-header
				class="c-header-nav-btn"
				@click="$store.commit('toggle', 'asideShow')"
				>
				<i class="iconfont icon-hanbaobao" style="font-size: 24px;"></i>
				<!-- <CIcon size="lg" name="cil-applications-settings" class="mr-2"/> -->
				</button>
			</CHeaderNavItem>
		</CHeaderNav>
		<!-- cluster_logo_red -->
		<CHeaderNav class="d-md-down-none mr-auto" style="margin-left: 75px;">
			<img 
			src="../assets/imgs/cluster_logo_header.svg"
			width="300"
			height="36"
			alt="cluster Logo"/>
		</CHeaderNav>

		<CHeaderNav style="margin-right: 15px;">
			<router-link :to="{name:'Event'}">
				<el-badge :value="gEvvalue" :max="999" class="item" data-toggle="dropdown">
					<i style="color: #fff;" class="iconfont icon-lingdang" type="primary"></i>
				</el-badge>
			</router-link>
		</CHeaderNav>
		<!-- 用户 -->
		<CHeaderNav>
			<CDropdown
				:caret="false">
				<template #toggler-content>
					<i class="iconfont icon-yonghuming"></i> {{user}}
				</template>
				<CDropdownItem @click="Logout">
					<div class="about_ab" v-if="!user"><i class="iconfont icon-shijian-"></i>{{$t("message.header.login")}}</div>
					<div class="about_ab" v-else><i class="iconfont icon-shijian-"></i>{{$t("message.header.logouts")}}</div>
				</CDropdownItem>
			</CDropdown>
		</CHeaderNav>
		<!-- api -->
		<CHeaderNav>
			<CDropdown
				:caret="false">
				<template #toggler-content>
					<i class="iconfont icon-gengduo"></i>
				</template>
				<CDropdownItem @click="centerDialogVisible=true">
					<div class="about_ab"><i class="iconfont icon-prompt"></i>关于</div>
				</CDropdownItem>
				<CDropdownItem @click="skin">
					<div class="about_ab"><i class="iconfont icon-huanfu"></i>主题</div>
				</CDropdownItem>
			</CDropdown>
		</CHeaderNav>
		
		<!-- <CSubheader class="px-3 Cluster_Subheader">
			<CBreadcrumbRouter class="border-0 mb-0"/>
		</CSubheader> -->
	</CHeader>

	<CHeader v-else with-subheader>
		<CHeaderNav>
			<CHeaderNavItem class="px-3">
				<button
				in-header
				class="c-header-nav-btn"
				@click="$store.commit('toggle', 'asideShow')"
				>
					<i class="iconfont icon-hanbaobao" style="font-size: 24px;"></i>
				</button>
			</CHeaderNavItem>
		</CHeaderNav>
		<CHeaderNav class="d-md-down-none mr-auto" >
			<img 
			src="../assets/imgs/cluster_logo_header.svg"
			width="190"
			height="26"
			alt="H5S Logo"/>
		</CHeaderNav>

		<CHeaderNav style="margin-right: 15px;">
			<router-link :to="{name:'Event'}">
				<el-badge :value="gEvvalue" :max="999" class="item" data-toggle="dropdown">
					<i style="color: #fff;" class="iconfont icon-lingdang" type="primary"></i>
				</el-badge>
			</router-link>
		</CHeaderNav>
		<CHeaderNav>
			<CDropdown
				:caret="false">
				<template #toggler-content>
					<i class="iconfont icon-yonghuming"></i> {{user}}
				</template>
				<CDropdownItem :to="{name:'Logout'}">
					<div class="about_ab" v-if="user==''||user==null"><i class="iconfont icon-shijian-"></i>{{$t("message.header.login")}}</div>
					<div class="about_ab" v-else><i class="iconfont icon-shijian-"></i>{{$t("message.header.logouts")}}</div>
				</CDropdownItem>
			</CDropdown>
		</CHeaderNav>
		<CHeaderNav>
			<CDropdown
				:caret="false">
				<template #toggler-content>
					<i class="iconfont icon-gengduo"></i>
				</template>
				<CDropdownItem @click="centerDialogVisible=true">
					<div class="about_ab"><i class="iconfont icon-prompt"></i>关于</div>
				</CDropdownItem>
				<CDropdownItem @click="skin">
					<div class="about_ab"><i class="iconfont icon-huanfu"></i>主题</div>
				</CDropdownItem>
			</CDropdown>
		</CHeaderNav>
	
		<CSubheader class="px-4">
			<!-- 修改面包屑导航 -->
			<CHeaderNav>
				<div class="header_size">
					<i :class="this.$route.matched[1].meta.icon"> </i>
					{{this.$route.matched[1].meta.name}}
				</div>
			</CHeaderNav>
		<!-- <CBreadcrumbRouter class="border-0 mb-0"/> -->
		</CSubheader>
		
	</CHeader>
</div>

</template>

<script>

export default {
	name: 'TheHeader',
	data(){
		return {
			user:this.$store.state.user,//neme
			centerDialogVisible:false,//关于
			gEvvalue: 0,//事件
			KeepaToken:null,//更新
		}
	},
	beforeDestroy() {
		clearInterval(this.KeepaToken)
    },
	mounted(){
		$("#rtc_togg").hide();
		var _this=this
		_this.$root.bus.$on('webrtc', function(token){
			$("#rtc_togg").show();
		});
		this.KeepaToken=setInterval(()=>{
			this.KeepaliveJWTToken();
		},60*1000*5)
	},
	methods:{
		//退出登录
		Logout(){
			let root=this.$store.state.IPPORT;
			var url=root+'/api/cluster/v2/RemoveJWTToken'
			this.$http.get(url).then(result=>{
                console.log("退出",result)
				if(result.status== 200){
					if(result.data.bStatus){
						clearInterval(this.KeepaToken)
						this.$router.push({
							path: 'Logout'
						})
					}
				}
			}).catch(error => {
                console.log("GetsrcList");
            });
		},
		//刷新
		KeepaliveJWTToken(){
			let root=this.$store.state.IPPORT;
			var url=root+'/api/cluster/v2/KeepaliveJWTToken'
			this.$http.get(url).then(result=>{
                console.log("更新",result)
			}).catch(error => {
                console.log("GetsrcList");
            });
		},
		//主题
		skin(){
			this.toggle=this.$store.state.darkMode
			this.$store.commit('toggle', 'darkMode')
			localStorage.Clusterthemetoggle=this.$store.state.darkMode
			console.log(JSON.parse( localStorage.getItem('themetoggle')),this.$store.state.darkMode)
		},
	}
}
</script>

<style lang="scss" scoped>
.header_size{
  font-size: 14px;
  i{
    font-size: 14px;
    margin-right: 10px;
  }
}
.c-subheader{
	display: flex;
	justify-content: space-between;
}
.about_ab i{
	margin-right: 10px;
}
.Cluster_header{
	height: 56px;
	min-height: 56px;
	// min-width: 993px;
	background: url("~@/assets/imgs/cluster_header.png") no-repeat center center #181818;
	background-size: 100%;
	background-size: cover;
	.c-header-nav{
		min-height: 56px;
	}
}
@media (max-width: 991.98px){
	.d-md-down-none {
		display: flex !important;
	}
}
@media (max-width: 414px){
	.Cluster_header{
		background-size: 200%;
		.c-header-nav{
			min-height: 45px;
		}
	}
	.d-md-down-none {
		display: flex !important;
		img{
			width: 150px;
		}
	}
}
</style>
