var linechart_linebtn_view = {
	linechart_linebtn_view_DIV_ID : "linechart-line-btn",

	rendered_linechartbtn_set : [],
	HAZIUM_ATTR_NAME : "Hazium Concentration",//记录hazium的那个属性的名字

	obsUpdate:function(message, data)
	{
		/*
		if (message == "display:linechart_linebtn_view")
		{
			$("#"+this.linechart_linebtn_view_DIV_ID).css("display","block");
		}

		if (message == "hide:linechart_linebtn_view")
		{
			$("#"+this.linechart_linebtn_view_DIV_ID).css("display","none");
		}


		if ( 	(message == "set:selected_building_set") || 
				(message == "set:selected_floor_set") || 
				(message == "set:selected_HVACzone_set") ||
				(message == "set:selected_attr_set") )
		{
			var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
			var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			var selected_building_set = DATA_CENTER.global_variable.selected_building_set;

			var new_rendered_linechartbtn_set = this._cal_attrbtnset(selected_attr_set,selected_HVACzone_set,selected_floor_set,selected_building_set);
			this.rendered_linechartbtn_set = new_rendered_linechartbtn_set;

			
			//1和2步骤可交换

			//1.更新DATA_CENTER.global_variable.selected_linechart_set
			//如果update_render导致了某个之前selected_linechart不再画出来，则这个linechart也就必定取消select了
			var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
			for (var i=0;i<selected_linechart_set.length;++i)
			{
				var cur_selected_linechart = selected_linechart_set[i];
				if (this.rendered_linechartbtn_set.indexOf(cur_selected_linechart) < 0)//没找到
				{
					selected_linechart_set.splice(i,1);
					--i;//任何情况下循环做splice的时候都不要忘了--i啊啊啊!!!!!!!!!
				}
			}
			DATA_CENTER.set_global_variable("selected_linechart_set",selected_linechart_set);

			//2.更新渲染
			this.update_render("linechart-line-btn",this.rendered_linechartbtn_set);
		}

		if ( message == "set:highlight_linechart_set" )
        {
        	var highlight_linechart_set = DATA_CENTER.linechart_variable.highlight_linechart_set;
        	if (highlight_linechart_set.length >=1 )
        	{
	        	d3.selectAll(".HVAClinechartbtn-span")
	        		.classed("mouseover_hided-HVAClinechartbtn-span",function(d,i){
	        			if (DATA_CENTER.linechart_variable.highlight_linechart_set.indexOf(d) >= 0)
	        			{
	        				return false;
	        			}
	        			return true;
	        		})
        	}
        	else
        	{
        		d3.selectAll(".HVAClinechartbtn-span")
	        		.classed("mouseover_hided-HVAClinechartbtn-span",false)
        	}
        }
        */

	},

	//输入被选中的三类实体集合，返回需要画的按钮
	//return一个attrbtn_set
	_cal_attrbtnset:function(selected_attr_set,selected_HVACzone_set,selected_floor_set,selected_building_set)
	{
		var new_rendered_linechartbtn_set = [];//记录有哪些属性需要画方块

		//计算selected_attr_set * selected_HVACzone_set，push进new_rendered_linechartbtn_set
		for (var i=0;i<selected_HVACzone_set.length;++i)
		{
			var cur_selected_HVACzone = selected_HVACzone_set[i]

			var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
			for (var j=0;j<HVACzone_HVACattr_set.length;++j)
			{
				var cur_attr = HVACzone_HVACattr_set[j];
				if (selected_attr_set.indexOf(cur_attr) >= 0)
				{
					if (cur_attr != this.HAZIUM_ATTR_NAME)
					{
						var cur_linechart = cur_selected_HVACzone + " " + cur_attr;//形如F_2_Z_3 VAV REHEAT Damper Position
						new_rendered_linechartbtn_set.push(cur_linechart)
					}
					else
					{
						var HVACzone_with_Haziumsenor_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set;
						if (HVACzone_with_Haziumsenor_set.indexOf(cur_selected_HVACzone) >=0 )
						{
							var cur_linechart = cur_selected_HVACzone + " " + cur_attr;
							new_rendered_linechartbtn_set.push(cur_linechart)
						}
					}
				}
			}
		}

		//计算selected_attr_set * selected_floor_set，push进new_rendered_linechartbtn_set
		for (var i=0;i<selected_floor_set.length;++i)
		{
			var cur_selected_floor = selected_floor_set[i]

			var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
			for (var j=0;j<floor_HVACattr_set.length;++j)
			{
				var cur_attr = floor_HVACattr_set[j];
				if (selected_attr_set.indexOf(cur_attr) >= 0)
				{
					var cur_linechart = cur_selected_floor + "_" + cur_attr;//形如F_2_VAV_SYS SUPPLY
					new_rendered_linechartbtn_set.push(cur_linechart)
				}	
			}
		}

		//计算selected_attr_set * selected_building_set，push进new_rendered_linechartbtn_set
		for (var i=0;i<selected_building_set.length;++i)
		{
			var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
			for (var j=0;j<building_HVACattr_set.length;++j)
			{
				var cur_attr = building_HVACattr_set[j];
				if (selected_attr_set.indexOf(cur_attr) >= 0)
				{
					var cur_linechart = cur_attr;
					new_rendered_linechartbtn_set.push(cur_linechart)
				}	
			}
		}

		return new_rendered_linechartbtn_set;
	},

	update_render:function(divID,new_linechartbtn_list){
		var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var rect_width = width/new_linechartbtn_list.length;
	    var rect_height = height;

	    var update = d3.select("#"+divID)
			.selectAll(".HVAClinechartbtn-span")
			.data(new_linechartbtn_list,function(d){return d;})
		update.select("div")
            .select("span")
                .text(function(d,i){
                	var buttonLabel = new_linechartbtn_list[i].substring(0,Math.max(rect_width/13,1));
                    return buttonLabel;
                })

		var enter = update.enter();
		enter.insert("span")
				.attr("class","HVAClinechartbtn-span")
				.attr("value",function(d,i){
					var buttonValue = new_linechartbtn_list[i];
					return buttonValue;
				})
				.on("click",function(d,i){
					var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
					var index = selected_linechart_set.indexOf(d);
					if (index >=0 )
					{
						d3.select(this).classed("click_selected-HVAClinechartbtn-span",false);
						selected_linechart_set.splice(index,1);
						DATA_CENTER.set_global_variable("selected_linechart_set",selected_linechart_set);
					}
					else
					{
						d3.select(this).classed("click_selected-HVAClinechartbtn-span",true);			
						DATA_CENTER.set_global_variable("selected_linechart_set",selected_linechart_set.concat(d));
					}
				})
				.on("mouseover",function(d,i){
					DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
						._highlight_communication_mouseover_linebtn(d);
				})
				.on("mouseout",function(d,i){
					DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
						._highlight_communication_mouseout_linebtn();
				})
			.append("div")
                .attr("style","position:relative")
            .append("span")
                .attr("class","object_title_span")
                .attr("value",function(d,i){
                    var buttonValue = new_linechartbtn_list[i];
                    return buttonValue;
                })
                .text(function(d,i){
                	var buttonLabel = new_linechartbtn_list[i].substring(0,Math.max(rect_width/13,1));
                    return buttonLabel;
                })

        $('.HVAClinechartbtn-span').each(function() {
            $(this).tipsy({
                gravity: "s",
                html:true,
                opacity:0.75,
                delayIn: 500,
                title:function(){
                    var d = this.__data__;

                    var place_attr = linechart_linebtn_view._parse_position_attr(d);
                    var attr = place_attr.attr;
                    var place = place_attr.place;
                    var place_type = place_attr.place_type;

                    var content =   "attr: " + "<span style='color:red'>" + attr + "</span>" + "</br>"+
                                    "place: " + "<span style='color:red'>" + place + "</span>" + "</br>";
                    return content;
                },
            });
        });


		var exit = update.exit();
		exit.remove();
	},

	//输入一个linechart的名字
	//返回这个linechart对于了什么地点，对应了什么属性
	_parse_position_attr:function(linechart_name)
	{
		//引用的全局变量
		var attr_set1 = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
		var attr_set2 = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set
		var attr_set3 = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set
		//end of 全局变量

		var place_type = "";
		var attr = "";

		for (var i=0;i<attr_set1.length;++i)
		{
			if (linechart_name.indexOf(attr_set1[i]) >=0 )
			{
				place_type = "building";
				attr = attr_set1[i];
				break;
			}
		}
		for (var i=0;i<attr_set2.length;++i)
		{
			if (linechart_name.indexOf(attr_set2[i]) >=0 )
			{
				place_type = "floor";
				attr = attr_set2[i];
				break;
			}
		}
		for (var i=0;i<attr_set3.length;++i)
		{
			if (linechart_name.indexOf(attr_set3[i]) >=0 )
			{
				place_type = "HVACzone";
				attr = attr_set3[i];
				break;
			}
		}

		if (attr == "")
		{
			console.warn("invalid linechart_name:",linechart_name);
		}

		var index = linechart_name.indexOf(attr);
		var remaining = linechart_name.substring(0,index);

		var place_name;
		if (place_type == "building")
		{
			place_name = "building";
		}
		else if (place_type == "floor")
		{
			place_name = remaining.substring(0,remaining.length-1);
		}
		else if (place_type == "HVACzone")
		{
			place_name = remaining.substring(0,remaining.length-1);
		}

		var return_val = {
			place:place_name,
			place_type:place_type,
			attr:attr,
		} 
		return return_val;
	},

	_highlight_communication_mouseover_linebtn:function(attr_name)
	{
		//1. 高亮linechart
		var highlight_linechart_set = [attr_name];
		DATA_CENTER.set_linechart_variable("highlight_linechart_set",highlight_linechart_set);

		var place_attr = linechart_linebtn_view._parse_position_attr(attr_name);

		//2. 高亮attr
		var attr = place_attr.attr;
		var highlight_attr_set = [attr];
		DATA_CENTER.set_linechart_variable("highlight_attr_set",highlight_attr_set);

		//3. 高亮place
		var place = place_attr.place;
		var place_type = place_attr.place_type;
		if (place_type == "building")
		{
			DATA_CENTER.set_linechart_variable("highlight_building_set",[place]);
		}
		else if (place_type == "floor")
		{
			DATA_CENTER.set_linechart_variable("highlight_floor_set",[place]);
		}
		else if (place_type == "HVACzone")
		{
			DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",[place]);
		}
	},

	_highlight_communication_mouseout_linebtn:function()
	{
		//1. 取消高亮linechart
		DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);

		//2. 取消高亮attr
		DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);

		//3. 取消高亮place
		DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",[]);
		DATA_CENTER.set_linechart_variable("highlight_floor_set",[]);
		DATA_CENTER.set_linechart_variable("highlight_building_set",[]);
	},
}