define(['datetime-b','dataTables'],function(){
	// 时间选择器初始化
	   $('.form_date').datetimepicker({
   			 language:'zh-CN',//汉化
   			 format:"yyyy-mm-dd",
   			 weekStart: 1,
   			 todayBtn:  1,
   			 todayHighlight: 1,
   			 startView: 2,//4:10-year overview
   			 minView: 2,//视图到日期后自动关闭
   			 todayBtn:true,//具有今天日期快捷选项
   			 todayHighlight:false,//当前日期高亮
   			 endDate:new Date(),//使得未来时间无效
   			 autoclose: 1,//选择日期后自动关闭，或者true
   			 forceParse: 0
   			 //pickerPosition:'bottom-left'
  		});
      $.extend( true, $.fn.dataTable.defaults, {
         processing:true,
         pagingType: "full_numbers",
         language: {
         "lengthMenu": "_MENU_",
         "zeroRecords": "未检索到相关数据",
         "info": "共 _TOTAL_ 条",
         "infoEmpty": "共 0 条",
         "infoFiltered": "数据表中共为 _MAX_ 条记录",
         "infoPostFix":"",
         "emptyTable": "未检索到相关数据",
         "processing": "正在加载中...",
         "search": "搜索",
         "infoEmpty":"没有显示条目",
         "zeroRecords":"无符合数据",
         "emptyTable":"没有数据",
         "paginate": {
           "first":    "首页",
           "previous": " 上一页 ",
           "next":     " 下一页 ",
           "last":     " 末页",   
         },
         "aria":{
           sortAscending:":升序排序",
           sortDescending:":降序排序"
         }
         },
         lengthChange:false
      } );
})