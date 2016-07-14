var eventlist_view = {
	eventlist_view_DIV_ID : "eventlist-renderplace",
	FIRST_CALLED : true,

	FIXED_TIME_FILTER : true,

	warning_threshold : 5,


	obsUpdate:function(message, data)
	{
		if (message == "HVAC_streaming_get_all")
		{
			console.log("HVAC_streaming_get_all")
			this._cal_all_time_warning_list();
			this._render_linechart_warning(DATA_CENTER.global_variable.warning_list);
		}

		if (message == "display:eventlist_view")
        {
        	console.log(DATA_CENTER.original_data["bldg-MC2.csv"])
        	if (this.FIRST_CALLED)
        	{
        		
        		this.FIRST_CALLED = false;
        	}

            $("#"+this.eventlist_view_DIV_ID).css("display","block");
            //this.render(this.eventlist_view_DIV_ID);
        }

        if (message == "hide:eventlist_view")
        {
            $("#"+this.eventlist_view_DIV_ID).css("display","none");
        }

        if (message == "set:warning_list")
        {
        	
        	var warning_list = DATA_CENTER.global_variable.warning_list;
        	var new_event = warning_list[warning_list.length-1];
        	if (new_event.type == "linechart")
        	{
        		//this._render_linechart_warning(warning_list);
        	}
        }
	},

	_warning_list_timefilter:function(warning_list){
		var time_min = DATA_CENTER.global_variable.selected_filter_timerange.min;
		var time_max = DATA_CENTER.global_variable.selected_filter_timerange.max;
		var filtered_warning_list = [];
		for (var i=0;i<warning_list.length;++i)
		{
			var start_time = warning_list[i].time;
			var end_time = warning_list[i].time + timelength;

			if ( (start_time < time_max)  && (end_time > time_min))
			{
				filtered_warning_list.push(warning_list[i]);
			}
		}
		return filtered_warning_list;
	},

	_id_of_warningevent:function(warning_event){
		return warning_event.type+warning_event.time+warning_event.place.type+warning_event.place.value+warning_event.attr;
	},


	time_number_to_text:function(time_number)
	{
		var time = new Date(time_number)
		return time.getMonth()+1 + "."+ time.getDate() + " " + time.getHours() + ":" + Math.floor(time.getMinutes()/5)*5;
	},


	_cal_all_time_warning_list:function(){
		var data = DATA_CENTER.original_data["bldg-MC2.csv"];

		var warning_list = [];
		for (var i=0;i<data.length;++i)
		{
			var cur_data = data[i];
			var cur_timestamp = (new Date(cur_data["Date/Time"])).valueOf();

			if (this.FIXED_TIME_FILTER)
			{
				var fixed_time = (new Date("2016-06-14")).setHours(0);
				//console.log(cur_timestamp,fixed_time)
				if (cur_timestamp <  fixed_time)
				{
					continue;
				}
				//console.log("reach")
			}

			for (var key in cur_data)
			{
				if (key=="Date/Time")
					continue;

				if (smallmaps_view.USE_OLD_STATISTIC)
				{
					var normalized_value = 0;
					if (typeof(cur_data[key])!= "undefined")
						normalized_value = Math.abs(HVAC_STATISTIC_UTIL.normalize(key,cur_data[key]));
				}
				else
				{
					var normalized_value = DATA_CENTER.VIEW_COLLECTION.HVACmonitor_view.abnormal_degree(cur_timestamp,key,cur_data[key])
					//var normalized_value = DATA_CENTER.VIEW_COLLECTION.HVACmonitor_view.abnormal_degree(cur_timestamp,that_d.data.name,that_d.data.value)
				}
			 	
				if (normalized_value >= /*HVACmonitor_view.ABNORMAL_VALUE_THRESHOLD*/this.warning_threshold)
			 	{
			 		smallmaps_view._push_linechart_warning_list(key,cur_data[key],cur_timestamp);
			 	}
			}
		}

	},

	_render_linechart_warning:function(warning_list){

		function filter_warning_list(warning_list)
		{
			var new_list = [];
			for (var i=0;i<warning_list.length;++i)
			{
				if (warning_list[i].type=="linechart")
				{
					new_list.push(warning_list[i])
				}
			}
			return new_list;
		}
		var warning_list = filter_warning_list(warning_list);

		//按时间数字升序排
		warning_list.sort(function(a,b){
			return a.time - b.time;
		})


		var warning_list = merge_compress_sorted_warning_list(warning_list)
		function merge_compress_sorted_warning_list(sorted_warning_list)
		{
			var merge_padding = 10*60*1000;
			for (var i=0;i<sorted_warning_list.length;++i)
			{
				var base_type = sorted_warning_list[i].type;
				var base_time = sorted_warning_list[i].time;
				var base_timelength = sorted_warning_list[i].timelength;
				var base_place = sorted_warning_list[i].place.value;
				var base_attr = sorted_warning_list[i].attr;

				for (var j=i+1;j<sorted_warning_list.length;++j)
				{
					var checked_type = sorted_warning_list[j].type;
					var checked_time = sorted_warning_list[j].time;
					var checked_timelength = sorted_warning_list[j].timelength;
					var checked_place = sorted_warning_list[j].place.value;
					var checked_attr = sorted_warning_list[j].attr;

					if ( (base_type==checked_type) && (base_place==checked_place) && (base_attr==checked_attr) )
					{
						var base_time_end = base_time +base_timelength;
						var checked_time_end = checked_time + checked_timelength;
						if (checked_time <= base_time_end+merge_padding)
						{
							if (checked_time_end > base_time_end)
							{
								sorted_warning_list[i].timelength = checked_time_end-base_time;
							}
							sorted_warning_list.splice(j,1);
							--j;
						}
					}
				}
			}
			return sorted_warning_list;
		}

		//按时间数字降序排
		warning_list.sort(function(a,b){
			return -a.time + b.time;
		})

		//warning_list元素数据结构:
		//{
		//	type:...(linechart,trajectory等)
		//	time:...(一个时间点,存成数字)
		//	place:{
		//		type:...(标记这个place是一个HVACzone或者Proxzone或者具体的robot检测到的点)
		//		value:...
		//	}...
		//	attr:...(被认为是异常的属性,可以是某个sensor属性,可以是某个人的轨迹)
		//	value:...(字符串或数字,标记了异常数据的取值,可以用来标记这个event在准则下的异常度)
		//  reason:...(标记这个event被认为异常的原因,即异常的类型,如"impossible route","extreme value")
		//}


		//$("#"+father_id).prepend(child)
		var divID = this.eventlist_view_DIV_ID
		var update = d3.select("#"+divID)
            .selectAll(".warning_event-span")
            .data(warning_list,function(d){
            	return eventlist_view._id_of_warningevent(d);
            });


        var enter = update.enter();

        var enter_spans = enter.insert("span")
                .attr("class","warning_event-span")
                .attr("id",function(d,i){
                    return "warning_event-span-"+eventlist_view._id_of_warningevent(d);
                })
                .on("click",function(d,i){
                	console.log(d)
                	var this_attr = d.attr;
                	var this_place_type = d.place.type;
                	var this_place_value = d.place.value;
                	var this_time_start = d.time;
                	var this_time_length = d.timelength;


                	var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
                	if (this_place_type == "building")
                	{
                		var selected_building_set = DATA_CENTER.global_variable.selected_building_set;

                		if (selected_building_set.indexOf(this_place_value)<0)
	                	{
	                		d3.selectAll(".building-smallmaps-rect").each(function(d,i){
	                			console.log(d)
	                			if (d.name == this_place_value)
	                				DATA_CENTER.VIEW_COLLECTION.smallmaps_view._small_maps_buildingrect_click(d,this)
	                		});
	                		
	                	}
                	}
                	else if (this_place_type == "floor")
                	{
                		var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;

                		if (selected_floor_set.indexOf(this_place_value)<0)
	                	{
	                		d3.selectAll(".floor-smallmaps-rect").each(function(d,i){
	                			console.log(d)
	                			if (d.name == this_place_value)
	                				DATA_CENTER.VIEW_COLLECTION.smallmaps_view._small_maps_floorrect_click(d,this)
	                		});

	                	}

                	}
                	else if (this_place_type == "HVACzone")
                	{
                		var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;

                		if (selected_HVACzone_set.indexOf(this_place_value)<0)
	                	{
	                		d3.selectAll(".smallmaps-HVACzone-circle").each(function(d,i){
	                			//console.log(d)
	                			if (d.name == this_place_value)
	                				DATA_CENTER.VIEW_COLLECTION.smallmaps_view._small_maps_circle_click(d,this)
	                		});
	                	}
                	}

                	if (selected_attr_set.indexOf(this_attr)<0)
                	{
                		$("#HVACattrbtn-span-"+linechart_render_view._compress_string(this_attr)).click();
                	}


                	
                	var chart = $("#HVAClinechart-linechart-span-div-"+linechart_render_view._compress_string(this_attr)).highcharts();
		            if (typeof(chart)=="undefined")
		            {
		                console.warn("undefined timeline")
		            }
		            else
		            {
		                chart.xAxis[0].setExtremes(this_time_start,this_time_start+this_time_length)
		            }
		            
		            //DATA_CENTER.set_global_variable("selected_filter_timerange",{min:this_time_start,max:this_time_start+this_time_length})

                })
				.each(function(d,i){
            		$(this).tipsy({
						gravity: "e",
						html:true,
						title:function(){
							var d = this.__data__;

							//console.log(d)

							var start_time = d.time;
							var start_time_text = eventlist_view.time_number_to_text(start_time);

							var time_length = d.timelength;
							var time_length_minute = time_length/(1000*60);

							var place = linechart_render_view._compress_string(d.place.value);
							var attr = d.attr;
							var value = d.value;
									   	
							var content = 	"<span>" + start_time_text  + "</span>"+ "</br>" +
											"<span>" + place  + "</span>"+ "</br>" +
											"<span>" + attr  + "</span>"+ "</br>" +
											//"<span>" + value  + "</span>"+ "</br>" +
											"<span>" + time_length_minute + "minutes"  + "</span>";
							return content;
						},
					});    

            	})


        enter_spans.append("span")
            	.attr("class","warning_event-time-span")
            	.text(function(d,i){
            		return eventlist_view.time_number_to_text(d.time);
            		/*
            		var time = new Date(d.time)
				    var text = time.getMonth()+1 + "."+ time.getDate() + " " + time.getHours() + ":" + Math.floor(time.getMinutes()/5)*5;
            		return text;
            		*/
            	})
            	

        enter_spans.append("span")
            	.attr("class","warning_event-place-span")
            	.attr("value",function(d,i){return d.place.value})
            	.text(function(d,i){
            		return d.place.value.replace(/_/g,"")
            	})    
        enter_spans.append("span")
            	.attr("class","warning_event-attr-span")
            	.attr("value",function(d,i){return d.attr})
            	.text(function(d,i){
            		return linechart_render_view._map_pureattr_name_to_abbreviation(d.attr)/*+":"+d.value*/
            	})        

            	/*
        $(".warning_event-span").tipsy({
			gravity: "s",
			html:true,
			title:function(){
				var d = this.__data__;
				var start_time = d.time;
				var start_time_text = eventlist_view.time_number_to_text(start_time);

				var time_length = d.timelength;
				var time_length_minute = time_length/(1000*60);

				var place = linechart_render_view._compress_string(d.place.value);
				var attr = linechart_render_view._compress_string(d.attr);
				var value = linechart_render_view._compress_string(d.value);
						   	
				var content = 	"<span style='color:red'>" + start_time_text  + "</span>"+ "</br>" +
								"<span style='color:red'>" + place  + "</span>"+ "</br>" +
								"<span style='color:red'>" + attr  + "</span>"+ "</br>" +
								//"<span>" + value  + "</span>"+ "</br>" +
								"<span>" + time_length_minute + "minutes"  + "</span>";
				return content;
			},
		});    	
*/





        var exit = update.exit();
        exit.remove();
	},

	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	                  
	}
}