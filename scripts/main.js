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
			"set:selected_timepoint_set",
			"set:selected_card_set",
			"set:selected_person_set",

			"set:highlight_attr_set",
			"set:highlight_HCAVzone_set",
			"set:highlight_floor_set",
			"set:highlight_building_set",
			"set:highlight_linechart_set",

		];
		SUBJECT.setMessageFilter(MESSAGE_COLLECTION)
	}

	//2. 注册observer
	REGISTER_VIEWS_AS_OBSERVERS()
	function REGISTER_VIEWS_AS_OBSERVERS()
	{
		//被登记到subject作为observer的视图们
		var VIEW_COLLECTION = [
			HVACgraph_attrbtn_view,
			HVACgraph_maps_view,
			linechart_linebtn_view,
			linechart_render_view,

			bigmap_view,
			ganttchart_view,
			histogram_view,
			proxgraph_maps_view,
		];

		for (var i=0;i<VIEW_COLLECTION.length;++i)
		{
			SUBJECT.registerObserver(VIEW_COLLECTION[i])
		}
	}




	//绑定视图切换的btn的click
	$(".panelContainer>.typeBar>li>a").click(function(){
		var view_name = $(this).attr("id");
		$(".panelContainer>.pagination>.active").removeClass("active");
		$(".panelContainer>.pagination>"+"#" + view_name + "li").attr("class", "active");

		var view_collections = $(".view-collection");
		for (var i=0;i<view_collections.length;++i)
		{
			$(view_collections[i]).css("display","none");
		}

		if (view_name == "trajectoryview")
		{
			$("#trajectoryview-collection").css("display","block");
			display_trajectory_view();
		}
		else if (view_name == "linechartview")
		{
			$("#linechartview-collection").css("display","block");
			display_linechart_view();
		}
		else
		{
			console.log("invalid view_name");
		}
	})

	$("#linechartview").click();//先触发一下视图切换


	//linechart视图调用的地方
	function display_linechart_view()
	{
		HVACgraph_maps_view.render("HVACgraph-maps");

		//让linechart可以sort
		$( "#linechart-renderplace" ).sortable({
			handle: ".HVAClinechart-btntitle-span",//btn作为sort的时候的把手
		});
	}

	//trajectory视图调用的地方
	function display_trajectory_view()
	{
		ganttchart_view.render("trajectory-ganttchart");
		proxgraph_maps_view.render("proxgraph-maps");
	}

}
