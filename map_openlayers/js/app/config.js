define(function(){
	var ip  = "http://127.0.0.1:8080/Map_gis/";
	var url =  {
		ip:"http://127.0.0.1:8080/Map_gis/",
		// map:"http://127.0.0.1/cgi-bin/tilecache.cgi/1.0.0/osm/{z}/{x}/{-y}.png",
		//st_htmap_url:/*ip+"getAllNode?";*/'./gis_node.json?',
		st_htmap_url:ip+"getAllNode?",
		// wf_htmap_url:/*ip+"getWifiNode?";*/'./gis_node.json?',
		wf_htmap_url:ip+"getWifiNode?",
		// mkmap_url:/*ip+"getWifiNode?";*/'./gis_node.json?',
		mkmap_url:ip+"getWifiNode?",
		url_address:ip+"getAddressList?callback=?", //依据地址（“例如 上海市”）进行搜素定位
		url_lacci:ip+"getViewInfo?callback=?",//lacci
		url1:ip+"getNodeList?callback=?",//依据省会名，直辖市，得到4G详细信息
		// st_url:/*ip+"getAllNode?";*/'./gis_node12.json?',
		st_url:ip+"getAllNode?",
		// wf_url:/*ip+"getWifiNode?";*/'./gis_node12.json?',
		wf_url:ip+"getWifiNode?",
		down_url:ip+'getDownLoadData?',
		Statstic:ip + 'getStatstic',
		url_info:ip+"getViewInfo?callback=?",//lacci
		downxls_url:ip+"getDownLoadData?&enddate="
	}
	return url;	
})