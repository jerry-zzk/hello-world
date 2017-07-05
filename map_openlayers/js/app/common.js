define(['ol','config'],function(ol,url){
	console.log(ol);
	var method = {
		//清除除底层外的所有图层
		clear_layer:function (title) {
			map.getLayers().forEach(function(e, i) {
			if (e.get("title") && e.get("title") != "ground") {
				map.removeLayer(e);
									}
					});
			},
		// 清楚制定title的图层
		clear_layer_by_name:function (name) {
			map.getLayers().forEach(function(e, i) {
			if (e.get("title") == name) {
				map.removeLayer(e);
					}
				});
			},
		//判断图层是否存在
		has_layer:function (name) {
			var flag = 0;
			map.getLayers().forEach(function(e, i) {
				if (e.get("title") == name) {
					flag++;
				}
			});
			return flag;
				},
		//占位符格式化输出数字
		printf:function () {
			var as = [].slice.call(arguments),
				fmt = as.shift(),
				i = 0;
			return fmt.replace(/%(\w)?(\d)?([dfsx])/ig, function(_, a, b, c) {
				var s = b ? new Array(b - 0 + 1).join(a || '') : '';
				if (c == 'd') s += parseInt(as[i++]);
				return b ? s.slice(b * -1) : s;
			});
			},
		//文件类型修正
	    _fixType:function(type) {
			type = type.toLowerCase().replace(/jpg/i, 'jpeg');
			var r = type.match(/png|jpeg|bmp|gif/)[0];
			return 'image/' + r;
			},
		//文件保存
	    saveFile:function(data, filename) {
			var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			save_link.href = data;
			save_link.download = filename;
			var event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			save_link.dispatchEvent(event);
			},
		//是否为正整数
		isPositiveNum:function(s){
			  var re = /^[1-9][0-9]*$/;
			  return re.test(s);
			},
		//当天日期日期格式化成制定格式yyyy-mm-dd
		show_date:function(){
		  var date = new Date();
		  var now = "";
		  now = date.getFullYear()+"-";
		  now = now + ( date.getMonth()+1 ) + "-";
		  now = now + date.getDate() + "" ;
		  return now;
			},
		//数据下载
		file_load_switch:function(){
			  var href = url.down_url;
			  /*时间*/
			  var startdate = $('#date_from2').val();
			  var enddate = $('#date_to2').val();
			  if (startdate.length) {
			    href = href + "startdate=" + startdate;
			  }
			  if (enddate.length) {
			    href = href + "enddate=" + enddate;
			  }else{
			    href = href + "enddate=" + method.show_date();
			  }
			  /*类型：基站 or 热点*/
			  var nettype = $('#database-kinds').val();
			  if(nettype=="热点"){nettype=1;}else{nettype=0;}
			  href = href +'&nettype=' + nettype;
			  /*运营商*/
			  var sp=$('#database-carries').val();
			  switch(sp){
			    case "移动":
			      sp ="00";
			      break;
			    case "联通":
			      sp="01";
			      break;
			    case "电信":
			      sp="02";
			      break;
			    default:
			      sp="3";//不限，即全部
			  }
			  if(sp !=3){
			    href = href + '&sp=' + sp ;
			  }
			  $('#download-data').attr("href",href);
			}
		}

	return method;
})