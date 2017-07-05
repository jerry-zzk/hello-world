define(['backbone','map','ol','config','function'],
	function(Backbone,indexMap,ol,url,fn){
	var AppRouter = Backbone.Router.extend({
		initialize:function(){
			map_stat = true;
			flag = 0;
			function printf() {
				var as = [].slice.call(arguments),
					fmt = as.shift(),
					i = 0;
				return fmt.replace(/%(\w)?(\d)?([dfsx])/ig, function(_, a, b, c) {
					var s = b ? new Array(b - 0 + 1).join(a || '') : '';
					if (c == 'd') s += parseInt(as[i++]);
					return b ? s.slice(b * -1) : s;
				});
			}
			vector_basic = new ol.source.XYZ({
				//url:url.map
      			tileUrlFunction: function(coordinate){
   				  var tilegrid = new ol.tilegrid.createXYZ();//使用标准的平铺方案创建一个瓦格
   				  var range = tilegrid.getFullTileRange(coordinate[0]);
   				  var y = range.getHeight() + coordinate[2];
   				   return 'http://127.0.0.1/osm/' +
			 	  printf('%02d', coordinate[0]) + '/' +
			 	  printf('%03d', parseInt(coordinate[1] / 1000000)) + '/' +
			 	  printf('%03d', parseInt(coordinate[1] / 1000) % 1000) + '/' +
			 	  printf('%03d', parseInt(coordinate[1] % 1000)) + '/' +
			 	  printf('%03d', parseInt(y / 1000000)) + '/' +
			 	  printf('%03d', parseInt(y / 1000) % 1000) + '/' +
			 	  printf('%03d', parseInt(y) % 1000) + '.png';
      			}
    			});
			var app={};
  				app.Click = function() {
        			ol.interaction.Pointer.call(this, {
			          handleDownEvent: app.Click.prototype.handleDownEvent,
			          handleUpEvent: app.Click.prototype.handleUpEvent
			        });
			        this.coordinate_ = null;
			        this.cursor_ = 'pointer';
			        this.feature_ = null;
			        this.previousCursor_ = undefined;
			      };
			      ol.inherits(app.Click, ol.interaction.Pointer);
			       app.Click.prototype.handleUpEvent = function() {
			        this.coordinate_ = null;
			        this.feature_ = null;
			        return false;
			      };
			    app.Click.prototype.handleDownEvent = function(evt) {
			    var map = evt.map;
			    var feature = map.forEachFeatureAtPixel(evt.pixel,
			        function(feature) {
			          return feature;
			          console.log(feature);
			        });
			    if (feature) {
			      if(feature.get("weight") == 1){
			        console.log(feature.get("lac"));
			        console.log(feature.get("ci"));
			        $.getJSON(
			          url.url_info, {
			            "lacci": feature.get("lac")+"-"+feature.get("ci")
			          },
			          fn.show_marker_info
			        );
			      }
			    }
			    return !!feature;
			  };

			var map = new ol.Map({
				target:'container',
				interactions: ol.interaction.defaults().extend([new app.Click()]),
				layers:[new ol.layer.Tile({
					source:vector_basic 
				})],
				view: new ol.View({
         			center: ol.proj.fromLonLat([116.3,39.87575]), //设置地图中心,ol.proj.fromLonLat()用于坐标转换
          			zoom: 10   //设置地图层级
        		}),
        		controls:[] 
			});
			window.map = map;
			this.map = map;
		},
		routes:{
			"":"map",
		},
		map:function(){
			var indexView = new indexMap();
		}
	})
	return AppRouter;
})