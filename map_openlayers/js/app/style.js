define(['backbone','common','html2canvas','echarts'],
	function(Backbone,method,html2canvas){
	// var map_stat = true;
	var style = {
		// 地图开
		map_open:function(){
			method.clear_layer();
		if(!map_stat){
   			 $('.search-box').show();
   			 $('#select-address').show();
   			 $('#station-info').hide();
   			 style.statistic_close();
   			 style.Trend_close();
   			 map_stat = true;
   			 $('#container').show();
  			} 		
		},
		// 地图关
		map_close:function(){
		 if(map_stat){
		   $('#container').hide();
		   $('.search-box').hide();
		   $('#select-address').hide();
		   map_stat = false;
			 }
		},
		//态势图开启
		Trend_open:function(){
 		 style.map_close();
 		 style.st_period_close();
 		 style.statistic_close();
 		 $('.download-btn').show();
 		 $('.map_body').css("background-image","url('images/trend.png')");
 		 /*
 		 var kinds = $('#markermap-kinds').val();
 		 if(kinds=="热点"){
 		   Trend(wf_trend_file);
 		 }else{
 		   Trend(st_trend_file);
 		 }
 		 */
		},
		//态势图关闭
		Trend_close:function(){
		  $('.map_body').css("background-image","linear-gradient( #f9f9f9,#eee )");
		  $('.download-btn').hide();
		},
		//态势图下载
		image_download:function(){
		  var canvas = $("#usefor-download-canvas")[0];
		  canvas.height = $(".map_body").height();
		  canvas.width = $(".map_body").width();
		  html2canvas(document.querySelector(".map_body"), {canvas: canvas}).then(function(canvas) {
		    var type = 'png';
		    var imgData = new Image();
		    imgData = canvas.toDataURL("image/png");
		    imgData = imgData.replace(method._fixType(type),'image/octet-stream');
		    var filename = 'baidufe_' + (new Date()).getTime() + '.' + type;
		    method.saveFile(imgData,filename);
		  });
		},
		//基站显示表关闭
		st_period_close:function (){
		  $('#station-info').hide();
		},
		//加号展开详细信息
		format:function( d ) {
			  lacci=d.lac+'-'+d.ci;
			  return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
			    '<tr>'+
			      '<td>MCC:</td>'+'<td>'+d.mcc+'</td>'+
			      '<td>"运营商":</td>'+'<td>'+((d.mnc=="00")? "移动" : ((d.mnc=="01")?"联通":"电信"))+'</td>'+
			    '</tr>'+
			    '<tr>'+
			      '<td>LAC:</td>'+'<td>'+d.lac+'</td>'+
			      '<td>CI:</td>'+'<td>'+d.ci+'</td>'+
			    '</tr>'+
			    '<tr>'+
			      '<td>经度:</td>'+'<td>'+d.lng+'</td>'+
			      '<td>纬度:</td>'+'<td>'+d.lat+'</td>'+
			    '</tr>'+
			  '</table>'+
			  '<div class="GoToPoint">'+
			    '<td><input type="button" class="btn btn-default" value="Go"></td>'+
			  '</div>';
		},
		//地图地位到指定地点
		Map_GoTo:function(lng, lat, zoom) {
			
		  return map.setView(new ol.View({
		    center: ol.proj.transform([lng, lat],
		      'EPSG:4326', 'EPSG:3857'),
		    zoom: zoom
		  }));
		},
		//指定区域
		Goto_addr:function(messages) {
			console.log(messages)
		  if (messages.status == 1) {
		    if (messages.data[0]) {
		      var Address = messages.data[0].address;
		      var city = messages.data[0].city;
		      var lng = messages.data[0].wgs_x;
		      var lat = messages.data[0].wgs_y;
		      var zoom = messages.data[0].zoom;
		      var province = messages.data[0].province;
		      style.Map_GoTo(lng, lat, zoom);
		    } else {
		      alert("state=1,but array is empty.");
		    }
		  }
		},
		//信息数据
			// 数据统计开启
		statistics_open:function(){
		  style.map_close();
		  style.st_period_close();
		  style.Trend_close();
		  $('.statistic-map').show();
		  $('.MySwitch').show();
		  style.statistics();
		},
			//数据统计关闭
		statistic_close:function(){
 			 $('.statistic-map').hide();
  			 $('.MySwitch').hide();
		},
		statistics:function(){
			  var myChart = echarts.init(document.getElementById('statistic-map'));
			  $.get('data/statistics.json', function (statisticsData) {
			    // 指定图表的配置项和数据
			    option = {
			      tooltip : {
			        trigger: 'axis',
			        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
			          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
			        }
			      },
			      legend: {
			        data:[ '移动','联通','电信']
			      },
			      toolbox: {
			        show : true,
			        feature : {
			          mark : {show: true},
			          dataView : {show: true, readOnly: false},
			          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
			          restore : {show: true},
			          saveAsImage : {show: true}
			        }
			      },
			      calculable : true,
			      xAxis : [
			        {
			          type : 'value'
			        }
			      ],
			      yAxis : [
			        {
			          type : 'category',
			          data : ['北京市','天津市','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省','上海市','江苏省','浙江省','安徽省','福建省','山东省','江西省','河南省','湖北省','湖南省','广东省','广西壮族自治区','重庆市','四川省','贵州省','云南省','西藏自治区','陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区']
			        }
			      ],
			      series : [
			        {
			          name:'移动',
			          type:'bar',
			          stack: '总量',
			          itemStyle : { normal: {color:'rgb(143,195,31)',label : {show: true, position: 'insideRight'}}},
			          data:statisticsData.yidong
			        },
			        {
			          name:'联通',
			          type:'bar',
			          stack: '总量',
			          itemStyle : { normal: {color:'rgb(255 ,128, 0 )',label : {show: true, position: 'insideRight'}}},
			          data:statisticsData.liantong
			        },{
			          name:'电信',
			          type:'bar',
			          stack: '总量',
			          itemStyle : { normal: {color:'rgb(5,39,175)',label : {show: true, position: 'insideRight'}}},
			          data:statisticsData.dianxin
			        }
			      ]
			    };
			    // 使用刚指定的配置项和数据显示图表。
			    myChart.setOption(option);
			  });
		}		
	}
	return style;
})