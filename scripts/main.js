function main(){
	//1. 初始化subject，确定有效的message的范围
	INITIALIZE_SUBJECT();
	function INITIALIZE_SUBJECT()
	{
		//有效的message的取值范围
		var MESSAGE_COLLECTION = [
			"set:selected_attr_set",
			"set:selected_linechart_set",
			"set:selected_HVACzone_set",
			"set:selected_proxzone_set",
			"set:selected_room_set",
			"set:selected_floor_set",
			"set:selected_building_set",
			"set:selected_card_set",
			"set:selected_person_set",
			"set:selected_timepoint_set",
			"set:selected_filter_timerange",
			"set:added_timerange",
			"set:current_display_time",

			"set:display_interval",
			"set:display_rate",
			"set:isplaying",
			"set:mouseover_time",

			"set:highlight_attr_set",
			"set:highlight_HVACzone_set",
			"set:highlight_floor_set",
			"set:highlight_building_set",
			"set:highlight_linechart_set",


			"display:HVACgraph_attrbtn_view",
			"display:HVACgraph_maps_view",
			"display:linechart_linebtn_view",
			"display:linechart_render_view",
			"hide:HVACgraph_attrbtn_view",
			"hide:HVACgraph_maps_view",
			"hide:linechart_linebtn_view",
			"hide:linechart_render_view",

			"display:bigmap_view",
			"display:ganttchart_view",
			"display:histogram_view",
			"display:proxgraph_maps_view",
			"hide:bigmap_view",
			"hide:ganttchart_view",
			"hide:histogram_view",
			"hide:proxgraph_maps_view",

			"display:timeline_view",
			"hide:timeline_view",
			
		];
		SUBJECT.setMessageFilter(MESSAGE_COLLECTION)
	}

	//2. 注册observer
	REGISTER_VIEWS_AS_OBSERVERS()
	function REGISTER_VIEWS_AS_OBSERVERS()
	{
		//被登记到subject作为observer的视图们
		var VIEW_COLLECTION = DATA_CENTER.VIEW_COLLECTION;

		for (var view_name in VIEW_COLLECTION)
		{
			view = VIEW_COLLECTION[view_name]
			SUBJECT.registerObserver(view)
		}
	}


	//绑定调时间有关常量的menu
    $( "#displayinterval-btn" ).selectmenu({
    	width:"100%",
      	change: function( event, data ) {
      		var data = data.item.value;
      		var displayinterval = +data.slice(0,data.length-2);
      		DATA_CENTER.set_timeline_variable("display_interval",displayinterval);
      	},
    });
    $( "#displayrate-btn" ).selectmenu({
		width:"100%",
      	change: function( event, data ) {
      		var data = data.item.value
      		var displayrate = +data.slice(2,data.length);
      		DATA_CENTER.set_timeline_variable("display_rate",displayrate);
      	}
    });

	//绑定视图切换的btn的click
	$(".panelContainer>.pagination>li>a").click(function(){
		var view_collection_name = $(this).attr("id");
		$(".panelContainer>.pagination>.active").removeClass("active");
		$(".panelContainer>.pagination>"+"#" + view_collection_name + "li").attr("class", "active");


		var VIEW_COLLECTION = DATA_CENTER.VIEW_COLLECTION;
		if (view_collection_name == "trajectoryview")
		{
			var displayed_view = {
				"ganttchart_view":undefined,
				"proxgraph_maps_view":undefined,
				"bigmap_view":undefined,
				"histogram_view":undefined,

				"timeline_view":undefined,
			};
			for (view_name in VIEW_COLLECTION)
			{
				if (view_name in displayed_view)
				{
					DATA_CENTER.trigger_view_display(view_name,"");
				}
				else
				{
					DATA_CENTER.trigger_view_hide(view_name,"");
				}
			}

		}
		else if (view_collection_name == "linechartview")
		{
			var displayed_view = {
				"HVACgraph_attrbtn_view":undefined,
				"HVACgraph_maps_view":undefined,
				"linechart_linebtn_view":undefined,
				"linechart_render_view":undefined,

				"timeline_view":undefined,
			};
			for (view_name in VIEW_COLLECTION)
			{
				if (view_name in displayed_view)
				{
					DATA_CENTER.trigger_view_display(view_name,"");
				}
				else
				{
					DATA_CENTER.trigger_view_hide(view_name,"");
				}
			}
		}
		else
		{
			console.log("invalid view_collection_name");
		}

		/*
		var view_collections = $(".view-collection");
		for (var i=0;i<view_collections.length;++i)
		{
			$(view_collections[i]).css("display","none");
		}

		if (view_name == "trajectoryview")
		{
			$("#trajectoryview-collection").css("display","block");
			HVACgraph_attrbtn_view.hide_all_smallspans();
			display_trajectory_view();
		}
		else if (view_name == "linechartview")
		{
			$("#linechartview-collection").css("display","block");
			display_linechart_view();
			HVACgraph_attrbtn_view.show_all_smallspans();
		}
		else
		{
			console.log("invalid view_name");
		}
		*/
	})

	$("#linechartview").click();//先触发一下视图切换

	//timeline_view.render("timeline-renderplace")


	//linechart视图调用的地方
	function display_linechart_view()
	{
		if (HVACgraph_maps_view.FIRST_CALLED)
		{
			HVACgraph_maps_view.render("HVACgraph-maps");

			//让linechart可以sort
			$( "#linechart-renderplace" ).sortable({
				handle: ".HVAClinechart-btntitle-span",//btn作为sort的时候的把手
			});
		}
	}

	//trajectory视图调用的地方
	function display_trajectory_view()
	{
		ganttchart_view.render("trajectory-ganttchart");
		proxgraph_maps_view.render("proxgraph-maps");
		bigmap_view.render("trajectory-bigmap");
	}

}
