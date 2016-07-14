var eventlist_view = {
	eventlist_view_DIV_ID : "eventlist-renderplace",


	obsUpdate:function(message, data)
	{
		if (message == "display:eventlist_view")
        {
            $("#"+this.eventlist_view_DIV_ID).css("display","block");
            this.render(this.eventlist_view_DIV_ID);
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
        		//console.log(new_event)
        		this._render_linechart_warning(warning_list);
        	}
        	
        }
	},

	_id_of_warningevent:function(warning_event){
		return warning_event.type+warning_event.time+warning_event.place.type+warning_event.place.value+warning_event.attr;
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
		warning_list.sort(function(a,b){
			return a.time - b.time;
		})

		console.log(warning_list)

		var warning_list = merge_compress_sorted_warning_list(warning_list)
		function merge_compress_sorted_warning_list(sorted_warning_list)
		{
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
					var checked_attr = sorted_warning_list[j].place.attr;
					if ( (base_type==checked_type) && (base_place==checked_place) && (base_attr==checked_attr) )
					{
						var base_time_end = base_time +base_timelength;
						var checked_time_end = checked_time + checked_timelength;
						if (checked_time_end > base_time_end)
						{
							base_timelength = checked_time_end-base_time;
						}
						sorted_warning_list.splice(j,1);
						--j;
					}
				}
			}
			return sorted_warning_list;
		}
		console.log(warning_list)

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
        enter_spans.append("span")
            	.attr("class","warning_event-time-span")
            	.text(function(d,i){
            		var time = new Date(d.time)
				    var text = time.getMonth()+1 + "."+ time.getDate() + " " + time.getHours() + ":" + Math.floor(time.getMinutes()/5)*5;
            		return text;
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
        enter_spans.append("span")
            	.attr("class","warning_event-reason-span")
            	.text(function(d,i){
            		return ""
            	})   	
*/



                /*
                .text(function(d,i){
                	return "233"
                })

                
                .attr("style",function(d,i){
                    return "height:"+rect_height+"px;" + "width:"+rect_width+"px;"
                })

                .on("click",function(d,i){
                })
                .on("mouseover",function(d,i){

                })
                .on("mouseout",function(d,i){

                })
*/

        var exit = update.exit();
        exit.remove();
	},

	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    /*
	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")   
	                .attr("width",width)
	                .attr("height",height)
	                */
	                  
	}
}