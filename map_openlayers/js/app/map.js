define(['backbone','config','common','style','function','chajian'],
	function(Backbone,url,method,style,fn){
		// console.log(fn);
	// console.log(style.map_close());
	var indexMap = Backbone.View.extend({
		el:'container',
		initialize:function(){
			this.render();
		},
		render:function(){
			map.on('moveend', function(evt) {
    			marker_draw(flag);
    			console.log(flag);
 			 });
 			map.on('pointermove', function(evt) {
    			// console.log(evt);
    		map.getTargetElement().style.cursor =
        		map.hasFeatureAtPixel(evt.pixel) ? 'pointer' : '';
  			});
			$(document).on('click','.menu-third a',function(){
				var menuTitle = $(this).data("role");
				switch (menuTitle) {
					case "wifi-heatmap":{
						console.log(menuTitle);
						heatmap_draw("wifi");
						flag = 0;
					}
					break;
					case "wifi-marker":{
						console.log(menuTitle);
						marker_draw("wifi");
          				flag = "wifi";
					}
					break;
					case "station-heatmap":{
						console.log(menuTitle);
						heatmap_draw("station");
						flag = 0;
					}
					break;
					case "station-marker":{
						console.log(menuTitle);
						marker_draw("station");
          				flag = "station";
					}
					break;
					default:{

					}
					break;
				}
			});
			//热力图
			function heatmap_draw(type){
  		  	  	style.map_open();
				style.statistic_close();
  				style.Trend_close();
  		  	  	method.clear_layer("heat_map_layer");
				 //获取zoom,边界值
				 var zoom = map.getView().getZoom();
				 var extent = map.getView().calculateExtent(map.getSize());
				 var a1 = ol.proj.toLonLat([extent[0], extent[1]]);
				 var a2 = ol.proj.toLonLat([extent[2], extent[3]]);
				 var x1 = a1[0],
				   y1 = a1[1],
				   x2 = a2[0],
				   y2 = a2[1];
				 var condition = "zoom=" + 15 + "&x1=" + x1 + "&x2=" + x2 + "&y1=" + y1 + "&y2=" + y2;
				 var htmap_url = (type == "wifi" ? url.wf_htmap_url : url.st_htmap_url) + condition;
				 heat_map = new ol.layer.Heatmap({
				   title:"heat_map_layer",
				   source: new ol.source.Vector({
				     url: htmap_url,
				     format: new ol.format.GeoJSON()
				   }),
				   blur: parseInt(20),
				   radius: parseInt(10)
				 });

				map.setView(new ol.View({
				   center: ol.proj.transform([116.3, 39.87575],
				   // center: ol.proj.transform([116.3, 39.87575],
				     'EPSG:4326', 'EPSG:3857'),
				   zoom: 10
				 }));
				map.addLayer(heat_map);
			};
			//麻点图
			function marker_draw(type) {
				style.map_open();
				style.statistic_close();
				style.Trend_close();
				 if (type != 0) {
				    //获取zoom,边界值
			    method.clear_layer("marker_layer");
			    var zoom = map.getView().getZoom();
			    var extent = map.getView().calculateExtent(map.getSize());
			    var a1 = ol.proj.toLonLat([extent[0], extent[1]]);
			    var a2 = ol.proj.toLonLat([extent[2], extent[3]]);
			    var x1 = a1[0],
			    y1 = a1[1],
				x2 = a2[0],
				y2 = a2[1];
				var condition = "zoom=" + zoom + "&x1=" + x1 + "&x2=" + x2 + "&y1=" + y1 + "&y2=" + y2;
				mkmap_url = (type == "wifi" ? url.wf_url : url.st_url) + condition;
				console.log(type);
				var image_list = {
				    "01": "./images/CMCC2.png",
				    "02": "./images/CUNI2.png",
				    "00": "./images/TELI2.png",
				    "m0": "./images/m0.png",
				    "m1": "./images/m1.png",
				    "m2": "./images/m2.png",
				    "m3": "./images/m3.png",
				    "m4": "./images/m4.png",
				    };
			    var vector = new ol.layer.Vector({
			      	title: "marker_layer",
				    source: new ol.source.Vector({
				    	url: mkmap_url,
				    	format: new ol.format.GeoJSON(),
			      	}),
			      	style: function(feature) {
			      		// console.log(feature.get('weight'));
				        var images_url;
				        if (parseInt(feature.get("weight")) == 1) {
				          images_url = image_list[feature.get("sp")];
				        } else {
				          if (parseInt(feature.get("weight")) > 1)
				            images_url = image_list.m0;
				          if (parseInt(feature.get("weight")) > 99)
				            images_url = image_list.m1;
				          if (parseInt(feature.get("weight")) > 999)
				            images_url = image_list.m2;
				          if (parseInt(feature.get("weight")) > 4000)
				            images_url = image_list.m3;
				          if (parseInt(feature.get("weight")) > 10000)
				            images_url = image_list.m4;
				        }
		        var iconStyle = new ol.style.Style({
				        text: new ol.style.Text({
				        text: feature.get('weight').toString(),
				        fill: new ol.style.Fill({
				        color: '#fff',
				        textBaseline: "middle",
				        textAlign: "center"
				            })
				        }),
				        image: new ol.style.Icon({
				          anchor: [0.5, 0.5],
				            // anchorXUnits: 'fraction',
				            // anchorYUnits: 'pixels',
				          src: images_url,
				          }),
				        });
				        feature.setStyle(iconStyle);
				      }
				    });
				    map.addLayer(vector);
				  }
			};
			//最近发现的基站
			$("#st_one").click(function(){
				marker_draw("station");
				flag = "station";
			})
			//固定时间段的基站
		var table = 0;
			function st_period(){
 				$('#station-info').width($('.myMap').width()-30);
 				if(!$.fn.DataTable.isDataTable('#example') ){
 				  table = $('#example').DataTable( {
 				    "processing":true,
 				    "serverSide":true,
 				    "pageLength":16,
 				    "ajax": {
 				      "url":url.url_info,
 				      dataType:"jsonp",
 				      data:function(d){
 				      	console.log(d);
 				        d.startdate=$('#date_from').val()?$('#date_from').val():"";
 				        d.enddate=$('#date_to').val()?$('#date_to').val():"";
 				      }
 				    },
 				    "columns":[
 				        { "data": "area" },
 				        { "data": "person_num" },
 				        { "data": "add_time" },
 				        { "data": "is_new" },
 				        { "data": "uli" },
 				        {
 				          "className":'details-control',
 				          "orderable": false,
 				          "data": null,
 				          "defaultContent": ''
 				        }
 				    ],
 				    "order": [[3, 'asc']]
 				  } );
 				}else{
 				  table = $('#example').DataTable().ajax.reload();
 				}
			};
			$("#st_two").click(function(){
				 style.map_close();
				 style.statistic_close();
				 style.Trend_close();
				 $('#station-info').show();
				 st_period();
			});
			//基站绿色小加号
			$(document).on('click', 'td.details-control', function () {
				console.log(table);
			    var tr = $(this).closest('tr');
			    var row = table.row( tr );
			    if ( row.child.isShown() ) {
			      row.child.hide();
			      tr.removeClass('shown');
			    }
			    else {
			      row.child( style.format(row.data()) ).show();
			      tr.addClass('shown');
			      // addBtnEvent();
			    }
			  });
			function GetforLacci(lacci) {
			 style.map_open();
				 //remove_lacci(); 
				 console.log(lacci);
				if($("#lac-searchbox").val()!=""&&$("#ci-searchbox").val()!=""){
		       		var lacci = $("#lac-searchbox").val() + "-" + $("#ci-searchbox").val();
		       		 $.getJSON(url.url_info,{
				     "lacci": lacci
				   	},function(data){
			   		  fn.show_marker_info(data);
				   	}
				 	)
				}else{
					 $.getJSON(url.url_info,{
				     "lacci": lacci
				   	},function(data){
			   		  fn.show_marker_info(data);
				   	}
				 	)
				}	
		 
			}
			// function addBtnEvent(){
				console.log($(".GoToPoint"));
 			 $(document).on('click',".GoToPoint input",function() {
 			 	// console.log(lacci);
				GetforLacci(lacci);
   				 $('#btn-back').show();
  				});
			// };
			$("#btn-back").click(function(){
				 style.map_close();
			  	$('#station-info').show();
			  	$('#btn-back').hide();
			});
			//lac-ci 搜索
			$("#Mybtn").click(function(){
				GetforLacci();
			});
			//指定区域的基站
			$("#s_county").change(function(){
				GoTo_qu()
			})	
			function GoTo_qu(){
				style.map_open();
				var province = $('#s_province').val();
				var city = $('#s_city').val();
				var address = $('#s_county').val();
				$.getJSON(url.url_address,
					{'province':province,
					 'city':city,
					 'address':address},function(data){
					 	style.Goto_addr(data)
				 });
				// debugger
				marker_draw("station");
			}
			//地图搜索选择框
			 $('#select-address').change(function(){
 			   var add = $('#select-address').val();
 			   $.getJSON(
 			     url.url_address, {"address":add},
 			     function(data){
		     		style.Goto_addr(data);
 			     }
 			   );
 			 });
			//地图搜索搜索框
		  	$("#c_search").keydown(function(e) {
 				  if (e.which == "13") {
 				    search_action();
 				  }
 				});
			function search_action() {
				  var addr = $('.search-content').val();
				  //debugger
				  var nums = addr.split("-");
				  if (method.isPositiveNum(nums[0]) && method.isPositiveNum(nums[1])){
				    var lacci = addr;
				    GetforLacci(lacci);
				  } else {
				    $.getJSON(
				      url.url_address, {
				        "address": addr
				      },function(data){
			      		style.Goto_addr(data);
				      });
				  }
				};
			//数据统计
			$("#statistic_open").click(function(){
					style.statistics_open();
			});
			//态势图
			$("#trend").click(function(){
					style.Trend_open();
			});
			//态势图下载
			$("#download-btn").click(function(){
					style.image_download();
			});
			//数据下载
  			$('#download-data').attr("href",url.downxls_url+method.show_date()+"\&nettype=0");
  			$('#database-kinds').change(method.file_load_switch);	
			$('#database-carries').change(method.file_load_switch);	

		}
	});
	return indexMap;
})