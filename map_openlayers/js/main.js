require.config({
	//根目录相对路径
	baseUrl:"./js",
	urlAgrs:"bust=" + (new Date()).getTime(),
	paths: {
		"jquery":"./lib/jquery.min",
		"underscore":"./lib/underscore",
		"backbone":"./lib/backbone",
		"ol":"./lib/ol-debug",
		"bootstrap":"./lib/bootstrap.min",
		"datetime-a":"./lib/bootstrap-datetimepicker",
		"datetime-b":"./lib/bootstrap-datetimepicker.zh-CN",
		"echarts":"./lib/echarts-all",
		"html2canvas":"./lib/html2canvas",
		"dataTables":"./lib/jquery.dataTables",
		"chajian":"./app/chajian",
		"add_switch":"./lib/add_switch",
		"config":"./app/config",
		"router":"./app/router",
		//地图视图
		"map":"./app/map",
		"common":"./app/common",
		"style":"./app/style",
		"function":"./app/function",

		
	},
	shim:{
		"underscore":{
			exports:"_"
		},
		"backbone":{
			deps:['underscore',"jquery"],
			exports:"Backbone"
		},
		"ol":{
			exports:"ol"
		},
		"bootstrap":{
			deps:['jquery']
		},
		"datetime-b":{
			deps:['datetime-a','bootstrap']
		},
		"dataTables":{
			deps:['jquery']
		},
		"html2canvas":{
			exports:"html2canvas"
		}	
	}
})
require(['jquery','bootstrap','router','chajian','add_switch'],function($,bootstrap,router){
		//城市三级联动
  		_init_area();
  		var app_router = new router();
  		Backbone.history.start();
})