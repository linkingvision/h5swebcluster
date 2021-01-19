<template>
	<CHeader with-subheader  class="Cluster_header">
		<CHeaderNav class="mr-auto">
			<CHeaderNavItem class="px-3">
				<button
				in-header
				class="c-header-nav-btn"
				@click="$store.commit('toggle', 'asideShow')"
				>
				<i class="iconfont iconhanbaobao" style="font-size: 24px;"></i>
				<!-- <CIcon size="lg" name="cil-applications-settings" class="mr-2"/> -->
				</button>
			</CHeaderNavItem>
		</CHeaderNav>
		<!-- cluster_logo_red -->
		<CHeaderNav class="d-md-down-none mr-auto">
			<img 
			src="../assets/imgs/cluster_logo_header.svg"
			width="300"
			height="36"
			alt="cluster Logo"/>
		</CHeaderNav>
		<!-- <CHeaderNav class="d-md-down-none">
			<CHeaderNavItem class="px-3">
				<button 
				@click="() => $store.commit('toggle', 'darkMode')" 
				class="c-header-nav-btn"
				>
				<CIcon v-if="$store.state.darkMode" name="cil-sun"/>
				<CIcon v-else name="cil-moon"/>
				</button>
			</CHeaderNavItem>
		</CHeaderNav> -->
		<CHeaderNav>
			<div class="use_user" id="rtc_togg">
				<el-tooltip content="重启" placement="bottom" effect="dark">
					<el-button @click="Rebootdialog=true" style="border: none;background: none; color:#fff;line-height: 0.9;padding-right: 10px;" >
						<i style=" font-size: 18px;color:#ea5252;font-weight: 500;" class="iconfont iconzhongqi"></i>
					</el-button>
				</el-tooltip>
			</div>
		</CHeaderNav>
		<CHeaderNav style="margin-right: 15px;">
			<router-link :to="{name:'Event'}">
				<el-badge :value="gEvvalue" :max="999" class="item" data-toggle="dropdown">
					<i style="color: #fff;" class="iconfont iconlingdang" type="primary"></i>
				</el-badge>
			</router-link>
		</CHeaderNav>
		<!-- 用户 -->
		<CHeaderNav>
			<CDropdown
				:caret="false">
				<template #toggler-content>
					<i class="iconfont iconyonghuming"></i> {{user}}
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
					<i class="iconfont icongengduo"></i>
				</template>
				<CDropdownItem >
					<div @click="centerDialogVisible=true" class="about_ab"><i class="iconfont icon-prompt"></i>关于</div>
				</CDropdownItem>
				<CDropdownItem href="doc/api.html">
					<div class="about_ab"><i class="iconfont icon-category"></i>API</div>
				</CDropdownItem>
				<CDropdownItem @click="skin">
					<div class="about_ab"><i class="iconfont icon-huanfu"></i>主题</div>
				</CDropdownItem>
				<CDropdownItem @click="Rebootdialog=true">
					<div class="about_ab"><i class="iconfont icon-zhongqi"></i>重启</div>
				</CDropdownItem>
			</CDropdown>
		</CHeaderNav>
		
		<!-- <CSubheader class="px-3 Cluster_Subheader">
			<CBreadcrumbRouter class="border-0 mb-0"/>
		</CSubheader> -->
	</CHeader>
</template>

<script>

export default {
	name: 'TheHeader',
	data(){
		return {
			user:this.$store.state.user,//neme
			centerDialogVisible:false,//关于
			Rebootdialog:false,//重启
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
		// 重启
		rtctogg(){
			$("#rtc_togg").hide();
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
