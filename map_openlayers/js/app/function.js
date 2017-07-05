define(['backbone','ol','common','style'],function(Backbone,ol,method,style){
	function show_marker_info(messages) {
  		console.log(messages);
  		if (messages.data.length) {
    // debugger1
		  var lac = parseInt(messages.data[0].lac);
		  var ci = parseInt(messages.data[0].ci);
		  var lat = parseFloat(messages.data[0].lat);
		  var lng = parseFloat(messages.data[0].lng);
		  var mnc = messages.data[0].mnc;
		  var mcc = messages.data[0].mcc;
		  var uli = messages.data[0].uli;
		  var person_num = parseInt(messages.data[0].person_num);
		  var is_new = parseInt(messages.data[0].is_new) ? "是" : "否";
		  var add_time = messages.data[0].add_time;
		  var areacode = parseInt(messages.data[0].areacode);
		  var area = messages.data[0].area;
		  var province = area; //province_abr(area);
		  var node = messages.data[0].node_list;
		  var nodes = new Array();
		  var bounds = "";
		  console.log(lng);
		  console.log(lat);
		  //地图移动到指定的级别和经纬度

		  //绘制多边形,得到边界数据，以及保留小数点后5位的边界数据一纬数组
		  //nodes:保证先经度后纬度的数据顺序
		  // 绘制多边形形状 绘制多边形形状(必须有 node_list 参数)
		  var start;
		  for (var i = 0; i < node.length; i++) { //二维数组转换成一纬数组
		    //先经度，后纬度，经度必然大于纬度
		    if (node[i][0] < node[i][1]) {
		      node[i] = node[i].reverse();
		    }
		    if (0 == i) {
		      start = ol.proj.fromLonLat(node[i]);
		    }
		    //nodes = nodes.concat(node[i]);
		    //小数点后5位精确度的边界数组，服务于麻点信息的展示
		    var lng_node = (node[0][0]).toFixed(5);
		    var lat_node = (node[0][1]).toFixed(5);
		    node[i] = ol.proj.fromLonLat(node[i]);
		    bounds += "(" + lng_node + "," + lat_node + ")";
		    if (i < node.length) {
		      bounds += ",";
		    }
		  }
		  node.push(start);
			//node.push(start);
			console.log(node);
		  var polygonFeature = new ol.Feature(
		    new ol.geom.Polygon([node]));
		  //标注基站   
		  var pointFeature = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([lng, lat])));
		  var layer = new ol.layer.Vector({
		    title:"ground",
		    source: new ol.source.Vector({
				//features 传入的参数可以是只传入一个参数  中心把poly 绘制多边形参数注释 数据中没有给node_list参数
		      //features: [pointFeature]
		      features: [pointFeature, polygonFeature]
		    }),
		    style: function(feature) {
		      var images_list = {
		        "01": "./images/CMCC2.png",
		        "02": "./images/CUNI2.png",
		        "00": "./images/TELI2.png",
		        "m0": "./images/m0.png",
		        "m1": "./images/m1.png",
		        "m2": "./images/m2.png",
		        "m3": "./images/m3.png",
		        "m4": "./images/m4.png",
		      };
	        return (new ol.style.Style({
		        image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
		          anchor: [0.5, 0.5],
		          src: images_list[mnc]
		        })),
		        stroke: new ol.style.Stroke({
		          width: 3,
		          color: [0, 0, 0, 1]
		        }),
		        fill: new ol.style.Fill({
		          color: [0, 0, 255, 0.5]
		        })
		      }));
		    }
		  });
		  if(method.has_layer("ground")){
		    method.clear_layer_by_name("ground"); 
		    map.addLayer(layer);
		  }else{
		    map.addLayer(layer);
		  }
		  var container = document.getElementById('popup');
		  var content = document.getElementById('popup-content');
		  var closer = document.getElementById('popup-closer');
		  if (!map.getOverlayById("ground_view")) {
		    var overlay = new ol.Overlay( ({
		      id: "ground_view",
		      element: container,
		      autoPan: true,
		      position: ol.proj.fromLonLat([lng, lat]),
		    }));
		    content.innerHTML = "<p>sp:" + mnc + "</p>" +
		      "<p>area:" + area + "</p>" +
		      "<p>is_new:" + is_new + "</p>" +
		      "<p>uli:" + uli + "<p>" +
		      "<p>person_num:" + person_num + "</p>";

		    closer.onclick = function() {
		      overlay.setPosition(undefined);
		      closer.blur();
		      method.clear_layer_by_name("ground"); 
		      return false;
		    };

		    map.addOverlay(overlay);
		  } else {
		    //console.log("reload");
		    // debugger
		    content.innerHTML = "<p>sp:" + mnc + "</p>" +
		      "<p>area:" + area + "</p>" +
		      "<p>is_new:" + is_new + "</p>" +
		      "<p>uli:" + uli + "<p>" +
		      "<p>person_num:" + person_num + "</p>";
		    closer.onclick = function() {
		  		map.getOverlayById("ground_view").setPosition(undefined)
		      // overlay.setPosition(undefined);
		      closer.blur();
		      method.clear_layer_by_name("ground"); 
		      return false;
		    };
	    	map.getOverlayById("ground_view").setPosition(ol.proj.fromLonLat([lng, lat]));
			map.getOverlayById("ground_view").setPosition(ol.proj.fromLonLat());
		  }
		} else {
		  alert("Error:messages.status=1,but messages.data:Empty" + messages.data);
		}
		  if (lng && lat) {
		    // debugger
		    style.Map_GoTo(lng, lat, 17);
		  } else {
		    alert("lng:" + lng + "," + "lat:" + lat);
		  }

	};

	
	return{
		show_marker_info:show_marker_info,

	}

})