<template>
	<div class="Cluster_dashboard">
		<div class="dashboard_left">
			<div class="dashboard_left_top">
				<div class="dashboard_title">监控点</div>
				<div class="dashboard_left_top_Monitoring">
					<div id="Monitoring_number" class="layer03-right-chart">
						<div class="layer03-right-chart-label">监控点在线</div>
						<canvas width="150" height="150"></canvas>
					</div>
					<div id="Monitoring_number1" class="layer03-right-chart">
						<div class="layer03-right-chart-label">集群节点数</div>
						<canvas width="150" height="150"></canvas>
					</div>
				</div>
			</div>
			<div class="dashboard_left_bottom">
				<div class="dashboard_title">节点监控</div>
				<div class="dashboard_content">
					<el-table
						class="dashboard_table"
						:data="NodeData"
						:header-cell-style="{background:'#19191A'}"
						height="100%"
						style="width: 100%">
						<el-table-column
						prop="strNodeId"
						label="编号">
						</el-table-column>
						<el-table-column
						prop="strNodeName"
						label="名称">
						</el-table-column>
						<el-table-column
							min-width="100">
							<template slot="header">  <!--  slot-scope="scope" -->
								<div style="width:100%;text-align: right;">
									<el-button style="" type="text" size="small">更多</el-button>
								</div>
							</template>
							<template slot-scope="scope">
								<div style="width:100%;text-align: right;" >
									<el-button type="text" size="small" @click="Nodedetails(scope.$index,scope.row)">详情</el-button>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>

			</div>
		</div>
		<div class="dashboard_center">
			<div class="dashboard_center_top">
				<!-- <div class="dashboard_content">上</div> -->
				<router-link :to="{name:'Event'}">
					<div class="center_top_event">报警统计</div>
				</router-link>
				<router-link :to="{name:'Devlist'}">
					<div class="center_top_devlist">设备列表</div>
				</router-link>
				<router-link :to="{name:'Nodemonitoring'}">
					<div class="center_top_node">节点监控</div>
				</router-link>
				<router-link :to="{name:'Devresources'}">
					<div class="center_top_devres">设备资源</div>
				</router-link>
			</div>
			<div class="dashboard_center_bottom">
				<div class="dashboard_title1">设备资源</div>
				<div class="dashboard_left_bottom_Devresources">
					<div class="containesr_sdks" v-for="(da,index) in devbucket" :key="index">
						<div class="sdk_back">
							<div class="sdk_szie">{{da.percentage}}%</div>
						</div>
						<div class="containesr_sdks_zi">
							<div>{{da.name}}</div>
							<div>共{{da.total1}}个</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="dashboard_right">
			<div class="dashboard_right_top">
				<div class="dashboard_title">设备列表</div>
				<div class="dashboard_content">
					<el-table
						class="dashboard_table"
						:data="SrcData"
						:header-cell-style="{background:'#19191A'}"
						height="100%"
						style="width: 100%">
						<el-table-column
						prop="strName"
						label="名称">
						</el-table-column>
						<el-table-column
						prop="nType"
						label="类型">
						</el-table-column>
						<el-table-column
						label="状态"
						align="right">
							<template slot-scope="scope">
								<!-- {{scope.row.bOnline}} -->
								<i :class="(scope.row.bOnline)?'color_green':'color_red'" class="iconfont icon-hanbaobao"></i>
							</template>
						</el-table-column>
						<!-- <el-table-column>
							<template slot="header">
								<div style="width:100%;text-align: right;">
									<el-button style="" type="text" size="small">更多</el-button>
								</div>
							</template>
							<template>
								<div style="width:100%;text-align: right;">
									<el-button type="text" size="small">详情</el-button>
								</div>
							</template>
						</el-table-column> -->
					</el-table>
				</div>
			</div>
			<div class="dashboard_right_bottom">
				<div class="dashboard_title">报警统计</div>
			</div>
		</div>
		<el-dialog :before-close="handleClose" class="nodepopup" width="55%" :visible.sync="nodePopup">
            <div class="nodepopup_ontent">
				<div class="nodepopup_left">
					<div class="nodepopup_left_top">
						<div id="container0" style="width: 100%;height: 100%;"></div>
					</div>
					<div class="nodepopup_left_buttom">
						<div id="nodepopup_number" class="layer03-right-chart">
							<canvas width="150" height="150"></canvas>
						</div>
						<div id="nodepopup_number1" class="layer03-right-chart">
							<canvas width="150" height="150"></canvas>
						</div>
						<div id="nodepopup_number2" class="layer03-right-chart">
							<canvas width="150" height="150"></canvas>
						</div>
					</div>
				</div>
				<div class="nodepopup_right">
					<div class="nodepopup_right_top"></div>
					<div class="nodepopup_right_buttom"></div>
				</div>
			</div>
        </el-dialog>
	</div>
</template>

<script>
var echarts = require("echarts");
export default {
	name: 'Dashboard',
	data(){
		return {
			NodeData:[],//节点表格
			SrcData:[],//设备表格
			SrcSummary:null,//节点数
			devbucket:null,//设备数据
			nodePopup:false,//节点弹窗
			nodedate:null,//定时器
			myChart:null,//波动图
			data: [],
            data1: [],
            data2: [],

			network_in:this.$t("message.dashboard.network_in"),
            network_out:this.$t("message.dashboard.network_out"),
		}
	},
	beforeDestroy(){
		clearInterval(this.nodedate)
	},
	mounted(){
		this.GetNodeList();
		this.GetsrcList();
		this.GetClusterSrcSummary();
	},
	methods:{
		//关闭弹窗
        handleClose(){
			console.log('关闭弹窗')
			this.nodePopup=false
			clearInterval(this.nodedate)
        },
		//节点详情
		Nodedetails(index,row){
			console.log(row)
			this.data= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            this.data1= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            this.data2= [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			if (this.myChart != null){
				this.myChart.dispose();
				this.myChart=null
			}
			var _this=this
			// console.log(index,row)
			this.nodePopup=true
			let root=this.$store.state.IPPORT;
			var url=root+'/api/cluster/v2/GetNodeInfo?nodeid='+row.strNodeName+''
			this.$nextTick(()=>{
				// 波动图
				_this.liunv()
				
				_this.Nodetiming(url)
				_this.nodedate=setInterval(()=>{
					_this.Nodetiming(url)
				},5000)
			})
		},
		liunv(){
			var pieId = document.getElementById('container0');
			if (!pieId){
				return false;
			}
			if (this.myChart == null){
				this.myChart = echarts.init(pieId)
			}
			//根据窗口的大小变动图表 --- 重点
            // console.log(":*****")
            // return false;
            var base = +new Date();
            var date = [];
            var _this=this;
            var oneSecond = 5000;
            for (var i = 1; i < 62; i++) {
                var now = new Date((base += oneSecond));
                date.push(
                    [('0' + now.getSeconds()).slice(-2) + 's']
				)
			}
            // return false;
            // 绘制图表
            var titlecol
            if(this.$store.state.darkMode){
                titlecol="#FFFFFF"
            }else{
                titlecol="#000000"
            }
            var Option={
                tooltip: {
                    trigger: 'axis',
                    position: function(pt) {
                        return [pt[0], '10%']
					},
					backgroundColor:"#606060",
					textStyle:{
						color:"#FFFFFF"
					},
					borderWidth:0,
					formatter:"{b0}<br />{a0}:{c0}Kbps<br />{a1}:{c1}Kbps <br />{a2}:{c2}%",
                },
                title: {
                    left: 'center',
                    text: "nvidiadata[l].strName",
                    show:false,
                },
                legend: {
                        data:[ this.network_in,this.network_out,'CPU'],
                        icon:'rect',
                        itemWidth: 35,
                        itemHeight: 2,
                        textStyle:{
                            fontSize: 12,//字体大小
                            color: titlecol//字体颜色
                        },
                    },
                xAxis: {
                    type: 'category',
					boundaryGap: false,
                    data: date,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: { //网格线
                        "show": false
                    },
                    axisLabel: {
						show: true,
						color: titlecol
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    splitLine: { //网格线
                        "show": false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
						show: true,
						color: titlecol,
                    }
                },
                series: [{
                    name: this.network_in,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#45FBDC'
                    },
                    data: this.data
                }, {
                    name: this.network_out,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#2932FF'
                    },
                    data: this.data1
                },{
                    name: "CPU",
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    sampling: 'average',
                    itemStyle: {
                        color: '#51C3FF'
                    },
                    data: this.data2
                }, ]
            }
            // myChart.clear();
			_this.myChart.setOption(Option)
			window.onresize = function(){
				_this.myChart.resize();
			}
		},
		Nodetiming(url){
			// 圆环
			var clusterid=$("#nodepopup_number canvas").get(0)
			var clusterid1=$("#nodepopup_number1 canvas").get(0)
			var clusterid2=$("#nodepopup_number2 canvas").get(0)
			if (!clusterid&&!clusterid1&&!clusterid2){
				return false;
			}
			var _this=this
			
			_this.$http.get(url).then(result=>{
				console.log(result)
				if(result.status == 200){
					var byte=result.data.runinfo
					_this.data.shift();
					_this.data.push(byte.nNetworkInK);
					_this.data1.shift();
					_this.data1.push(byte.nNetworkOutK);
					_this.data2.shift();
					_this.data2.push(byte.nCPUUsage);
					
					_this.myChart.setOption({
						series: [{
							data: this.data
						}, {
							data: this.data1
						},{
							data: this.data2
						}, ]
					})
					var nodedatafor=[{
						id:clusterid,
						name:this.$t("message.dashboard.free_space"),
						percentage:Number(((byte.nTotalSpaceByte-byte.nFreeSpaceByte)/byte.nTotalSpaceByte).toFixed(2)),
						value:((byte.nFreeSpaceByte)/1024/1024/1024).toFixed(1)+"G"
					},{
						id:clusterid1,
						name:this.$t("message.dashboard.memory"),
						percentage:Number((byte.nMemoryUsage/100).toFixed(2)),
						value:(byte.nTotalMemoryByte/1024/1024/1024).toFixed(1)+"G"
					},{
						id:clusterid2,
						name:this.$t("message.dashboard.Storage"),
						percentage:Number(((byte.nRecordTotalSpaceByte-byte.nRecordFreeSpaceByte)/byte.nRecordTotalSpaceByte).toFixed(2)),
						value:(byte.nRecordTotalSpaceByte/1024/1024/1024).toFixed(1)+"G"
					}]
					
					// console.log(nodedatafor)
					for(var i=0; i<nodedatafor.length; i++){
						_this.Monitoringdetails(nodedatafor[i].id,
						i,
						nodedatafor[i].name,
						nodedatafor[i].percentage,
						nodedatafor[i].value)
					}
				}
			}).catch(error => {
				console.log("GetNodeList",error);
			});
		},
		//监控点数
		GetClusterSrcSummary(){
			let root=this.$store.state.IPPORT;
			var url=root+'/api/cluster/v2/GetClusterSrcSummary'
			this.$http.get(url).then(result=>{
                console.log("监控点数",result)
                if(result.status == 200){
					this.SrcSummary=result.data
					console.log(this.SrcSummary)
					var clusterid=$("#Monitoring_number canvas").get(0)
					var clusterid1=$("#Monitoring_number1 canvas").get(0)

					//显示水桶
					var DevSDK="";
					var Cloud="";
                    var RTSPRx="";
                    var ONVIFx="";
                    var RTMPx="";
                    if(result.data.nCloudTotal==0){
                        Cloud=0;
                    }else{
                        Cloud=Math.round(result.data.nCloudOnline/result.data.nCloudTotal*100)
                    }
                    if(result.data.nRTSPRTMPTotal==0){
                        RTSPRx=0;
                    }else{
                        RTSPRx=Math.round(result.data.nRTSPRTMPOnline/result.data.nRTSPRTMPTotal*100)
                    }

                    if(result.data.nONVIFTotal==0){
                        ONVIFx=0;
                    }else{
                        ONVIFx=Math.round(result.data.nONVIFOnline/result.data.nONVIFTotal*100)
                    }

                    if(result.data.nRTMPPushTotal==0){
                        RTMPx=0;
                    }else{
                        RTMPx=Math.round(result.data.nRTMPPushOnline/result.data.nRTMPPushTotal*100)
					}
					if(result.data.nSdkTotal==0){
                        DevSDK=0;
                    }else{
                        DevSDK=Math.round(result.data.nSdkOnline/result.data.nSdkTotal*100)
                    }
                    this.devbucket=[{
                        name:this.$t("message.dashboard.Cloud"),
                        total1:result.data.nCloudTotal,
                        percentage:Cloud
                    },{
                        name:'RTSP/RTMP',
                        total1:result.data.nRTSPRTMPTotal,
                        percentage:RTSPRx
                    },{
                        name:'ONVIF',
                        total1:result.data.nONVIFTotal,
                        percentage:ONVIFx
                    },{
                        name:this.$t("message.dashboard.RTMP"),
                        total1:result.data.nRTMPPushTotal,
                        percentage:RTMPx
                    },{
                        name:"SDK",
                        total1:result.data.nSdkTotal,
                        percentage:DevSDK
                    }]
					
					//显示圆环
					var number=(result.data.nCameraOnline/result.data.nCameraTotal).toFixed(2)
					// for(var i = 0; i<data.length; i++){
					this.Monitoringnumber(clusterid,"1",number,result.data.nCameraTotal);
					// }
				}
			}).catch(error => {
                console.log("GetClusterSrcSummary");
            });
		},
		//节点列表
		GetNodeList(){
			let root=this.$store.state.IPPORT;
			var url=root+'/api/cluster/v2/GetNodeList'
			this.$http.get(url).then(result=>{
                console.log("节点列表",result)
                if(result.status == 200){
					if(result.data.node){
						this.NodeData=result.data.node
						var clusterid=$("#Monitoring_number1 canvas").get(0)
						this.Monitoringnumber(clusterid,"2",1,result.data.node.length);
					}
					// console.log(this.NodeData)
				}
			}).catch(error => {
                console.log("GetNodeList");
            });
		},
		//设备列表
		GetsrcList(){
			let root=this.$store.state.IPPORT;
			var url=root+'/api/cluster/v2/GetsrcList'
			this.$http.get(url).then(result=>{
                console.log("设备列表",result)
                if(result.status == 200){
					this.SrcData=result.data.src
					console.log(this.SrcData)
				}
			}).catch(error => {
                console.log("GetsrcList");
            });
		},
		//详情圆环
		Monitoringdetails(canvasObj,colorValue,name,percentage,value){
			canvasObj.height=canvasObj.height;  
			var ctx = canvasObj.getContext("2d");
			var circle = {
				x : 75,    //圆心的x轴坐标值
				y : 80,    //圆心的y轴坐标值
				r : 60      //圆的半径
			};

			//画扇形
			//ctx.sector(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI);
			//ctx.fillStyle = colorValue;
			//ctx.fill();

			ctx.beginPath();
			ctx.arc(circle.x,circle.y,circle.r,0,Math.PI*2)
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#FFFFFF';
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+percentage*2)*Math.PI)
			ctx.lineWidth = 8;
			ctx.lineCap = 'round';
			var colors=''
			if(colorValue=='0'){
				colors=ctx.createLinearGradient(0,0,170,0);
				colors.addColorStop("0","#3184E9");
				colors.addColorStop("0.5","#0FCFA8");
				colors.addColorStop("1.0","#3184E9");
			}else if(colorValue=='1'){
				colors=ctx.createLinearGradient(0,0,170,0);
				colors.addColorStop("0","#EAC344");
				colors.addColorStop("0.5","#ECE72E");
				colors.addColorStop("1.0","#EAC344");
			}else if(colorValue=='2'){
				colors=ctx.createLinearGradient(0,0,170,0);
				colors.addColorStop("0","#A63DEC");
				colors.addColorStop("0.5","#E745E9");
				colors.addColorStop("1.0","#A63DEC");
			}
			ctx.strokeStyle = colors;
			ctx.stroke();
			ctx.closePath();
			ctx.textAlign = 'center' 
			ctx.fillStyle = '#FFFFFF';
			ctx.font = '20px Calibri';
			var ratedata=Math.round(percentage*100)
			ctx.fillText(ratedata+'%',circle.x,circle.y-12);

			ctx.font = '10px Calibri';
			ctx.fillText(name,circle.x,circle.y+6);
			ctx.font = '12px Calibri';
			ctx.fillText(value,circle.x,circle.y+25);
		},
		//监控点 圆环
		Monitoringnumber(canvasObj,colorValue,rate,number){
			canvasObj.height=canvasObj.height; 
			var ctx = canvasObj.getContext("2d");
			var circle = {
				x : 75,    //圆心的x轴坐标值
				y : 80,    //圆心的y轴坐标值
				r : 60      //圆的半径
			};

			//画扇形
			//ctx.sector(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI);
			//ctx.fillStyle = colorValue;
			//ctx.fill();

			ctx.beginPath();
			ctx.arc(circle.x,circle.y,circle.r,0,Math.PI*2)
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#FFFFFF';
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI)
			ctx.lineWidth = 10;
			ctx.lineCap = 'round';
			
			var colors=''
			if(colorValue=='1'){
				colors=ctx.createLinearGradient(0,0,170,0);
				colors.addColorStop("0","#FFD36B");
				colors.addColorStop("0.5","#FFFF25");
				colors.addColorStop("1.0","#FFD36B");
			}else if(colorValue=='2'){
				colors=ctx.createLinearGradient(0,0,170,0);
				colors.addColorStop("0","#C343B6");
				colors.addColorStop("0.5","#9E40F6");
				colors.addColorStop("1.0","#FF42F7");
			}
			ctx.strokeStyle = colors;
			ctx.stroke();
			ctx.closePath();
			ctx.textAlign = 'center' 
			ctx.fillStyle = '#FFFFFF';
			ctx.font = '20px Calibri';
			var ratedata=Math.round(rate*100)
			ctx.fillText(ratedata+'%',circle.x,circle.y-5);

			ctx.font = '15px Calibri';
			ctx.fillText("（"+number+"个）",circle.x,circle.y+15);
		},
	}

}
</script>

<style lang="scss" scoped>
.Cluster_dashboard{
    width: 100%;
    height: 100%;
    background: url("~@/views/imgs/Cluster_dashboard_back.png") no-repeat center;
    background-size: cover;
    min-width: 993px;
	min-height: 870px;
	display: flex;
	float: left;
	justify-content: space-between;
	padding: 20px;
	.dashboard_left,.dashboard_center,.dashboard_right{
		height: 100%;
		display: flex;
		flex-wrap: wrap;
		align-content: space-between;
		// 内容头部标签
		.dashboard_title{
			text-align: center;
			margin-top: -10px;
			font-size: 20px;
			font-family: Source Han Sans CN;
			font-weight: 500;
			letter-spacing: 2px;
			color: #FFFFFF;
		}
		.dashboard_title1{
			text-align: center;
			margin-top: 32px;
			font-size: 20px;
			font-family: Source Han Sans CN;
			font-weight: 500;
			letter-spacing: 2px;
			color: #FFFFFF;
		}
	}
	
	.dashboard_left{
		width: 25%;
		.dashboard_left_top{
			// padding: 20px;
			width: 100%;
			height: 35%;
			// border: 1px solid #ffffff;
			background: url("~@/views/imgs/dashboard_back_img.png") no-repeat center center;
			background-size: 100% 100%;
			.dashboard_left_top_Monitoring{
				width:100%;
				height: 80%;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.layer03-right-chart{
					width:50%;
					text-align: center;
					margin-top: 40px;
					.layer03-right-chart-label{
						text-align: center;
						color: #FFFFFF;
					}
				}
			}
		}
		.dashboard_left_bottom{
			width: 100%;
			height: 63%;
			// border: 1px solid #ffffff;
			background: url("~@/views/imgs/dashboard_back_img3.png") no-repeat center center;
			background-size: 100% 100%;
			.dashboard_content{
				width: 100%;
				height: 92%;
				padding: 45px 15px 0;
				overflow: auto;
				&::-webkit-scrollbar{
					display: none;
				}
			}
		}
	}
	.dashboard_center{
		width: 48%;
		.dashboard_center_top{
			width: 100%;
			height: 66%;
			// border: 1px solid #ffffff;
			background: url("~@/views/imgs/dashboard_back_img2.png") no-repeat center center;
			background-size: 55% 75%;
			background-position-y: 100%;
			position: relative;
			font-family: Source Han Sans CN;
			font-weight: 800;
			.center_top_event,.center_top_devlist,.center_top_node,.center_top_devres{
				color: #FFF045;
			}
			.center_top_event{
				width: 97px;
				height: 106px;
				font-size: 13px;
				background: url("~@/views/imgs/dashboard_back_imgevent.png") no-repeat center center;
				background-size: 100% 100%;
				position: absolute;
				left: 25%;
				top: 10%;
				text-align: center;
				line-height: 106px;
			}
			.center_top_devlist{
				width: 97px;
				height: 106px;
				font-size: 13px;
				background: url("~@/views/imgs/dashboard_back_imgevent.png") no-repeat center center;
				background-size: 100% 100%;
				position: absolute;
				right: 28%;
				top: 5%;
				text-align: center;
				line-height: 106px;
			}
			.center_top_node{
				width: 136px;
				height: 156px;
				font-size: 16px;
				background: url("~@/views/imgs/dashboard_back_imgnode.png") no-repeat center center;
				background-size: 100% 100%;
				position: absolute;
				left: 10%;
				top: 35%;
				text-align: center;
				line-height: 156px;
			}
			.center_top_devres{
				width: 136px;
				height: 156px;
				font-size: 16px;
				background: url("~@/views/imgs/dashboard_back_imgnode.png") no-repeat center center;
				background-size: 100% 100%;
				position: absolute;
				right: 10%;
				top: 28%;
				text-align: center;
				line-height: 156px;
			}
		}
		.dashboard_center_bottom{
			width: 100%;
			height: 32%;
			// border: 1px solid #ffffff;
			background: url("~@/views/imgs/dashboard_back_img4.png") no-repeat center center;
			background-size: 100% 100%;
			.dashboard_left_bottom_Devresources{
				width: 100%;
				height: 77%;
				display: flex;
				justify-content: space-around;
				align-items: center;
				.containesr_sdks{
					width: 12%;
					height: 80%;
					text-align: center;
					color: #FFFFFF;
					.sdk_back{
						width: 100%;
						height: 78%;
						background: url("~@/views/imgs/dashboard_back_bucket.png") no-repeat center center;
						background-size: 100% 100%;
						margin-bottom: 10px;
						line-height: 130px;
						font-size: 16px;
						font-family: Source Han Sans CN;
						font-weight: 800;
					}
					.containesr_sdks_zi{
						div:nth-child(1){
							font-size: 14px;
							font-family: Source Han Sans CN;
							font-weight: 800;
						}
					}
				}
			}
		}
	}
	.dashboard_right{
		width: 25%;
		.dashboard_right_top{
			width: 100%;
			height: 38%;
			// border: 1px solid #ffffff;
			background: url("~@/views/imgs/dashboard_back_img1.png") no-repeat center center;
			background-size: 100% 100%;
			.color_red{
				color: #FF564F;
				font-size: 26px;
			}
			.color_green{
				color: #00FF6C;
				font-size: 26px;
			}
			.dashboard_content{
				width: 100%;
				height: 90%;
				padding: 45px 15px 0;
				overflow: auto;
				&::-webkit-scrollbar{
					display: none;
				}
			}
		}
		.dashboard_right_bottom{
			width: 100%;
			height: 60%;
			// border: 1px solid #ffffff;
			background: url("~@/views/imgs/dashboard_back_img3.png") no-repeat center center;
			background-size: 100% 100%;
		}
	}
	//弹窗
	.nodepopup{
		.nodepopup_ontent{
			width: 100%;
			height: 50vh;
			min-height: 50vh;
			display: flex;
			justify-content: space-between;
			.nodepopup_left{
				width: 60%;
				height: 100%;
				display: flex;
				flex-wrap: wrap;
				align-content: space-between;
				.nodepopup_left_top{
					padding-top:40px;
					width: 100%;
					height: 60%;
					background-color: #2C2C2C;
				}
				.nodepopup_left_buttom{
					width: 100%;
					height: 39%;
					background-color: #2C2C2C;
					display: flex;
					justify-content: space-around;
					align-items: center;
				}
			}
			.nodepopup_right{
				width: 39%;
				height: 100%;
				display: flex;
				flex-wrap: wrap;
				align-content: space-between;
				.nodepopup_right_top{
					width: 100%;
					height: 79%;
					background-color: #2C2C2C;
				}
				.nodepopup_right_buttom{
					width: 100%;
					height: 20%;
					background-color: #2C2C2C;
				}
			}

		}
	}
}
</style>
