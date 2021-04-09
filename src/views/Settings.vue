<template>
<div class="Setting">
	<div class="setting_all">
		<div class="setting_zuo">
			<el-menu
                router
                :default-active="activemenu" 
				class="el-menu-vertical-demo"
				:background-color="($store.state.darkMode) ? '#2D2D2D' : '#F5F5F5'"
				:text-color="($store.state.darkMode) ? '#B7B7B7' : '#7A7A7A'">
				<el-submenu index="/Settings/Client">
					<template slot="title">
						<span>{{$t("message.setting.ClientConfiguration")}}</span>
					</template>
                    <el-menu-item index="/Settings/Client">
                        <span class="Setting_tree">{{$t("message.setting.ClientConfiguration")}}</span> 
                    </el-menu-item>
				</el-submenu>
			</el-menu>
		</div>
		<div class="setting_you">
			<router-view></router-view>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'Dashboard',
	data(){
		return{
			activemenu:"2-1"
		}
	},
	methods:{
		menuList(){ 
            let path = this.$route.path
			// console.log(path,this.$route)
            this.activemenu = path
        }
		
	},
	mounted(){
		this.menuList();

		let root=this.$store.state.IPPORT;
		var url=root+'/api/cluster/v2/GetNodeList'
		this.$http.get(url).then(result=>{
			console.log(result);
		})
	},
	created(){
	}
}
</script>
<style lang="scss" scoped>
.setting_all{
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	.setting_zuo{
		width: 16%;
		height: 91vh;
		overflow-y: auto;
	}
	i{
		margin-right: 10px;
	}
	.setting_you{
		width: 84%;
		height: 91vh;
		padding: 10px 0;
		overflow-y: auto;
		// background-color: #171717;
	}
	.setting_you::-webkit-scrollbar,.setting_zuo::-webkit-scrollbar{
		display: none;
	}
}
</style>