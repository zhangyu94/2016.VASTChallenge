var HVACgraph_attrbtn_view = {
	HVACgraph_attrbtn_view_DIV_ID : "HVACgraph-attr-btn",
	FIRST_CALLED : true,

	DIV_CLASS_OF_SMALLSPANS:"HVACattrbtn-span-div_of_smallspans",
	STATIC_BTN : false,
	SMALL_SPAN_WIDTH : 4,
	rendered_attrbtn_set : [],

	obsUpdate:function(message, data)
	{
		if (message == "display:HVACgraph_attrbtn_view")
		{
			$("#"+this.HVACgraph_attrbtn_view_DIV_ID).css("display","block");
			this.show_all_smallspans();


			if (this.FIRST_CALLED)
			{
				if (HVACgraph_attrbtn_view.STATIC_BTN)
				{
					//全部画出来的版本
					var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
					var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
					var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
					this.rendered_attrbtn_set = (building_HVACattr_set.concat(floor_HVACattr_set)).concat(HVACzone_HVACattr_set);
					this.update_render(this.HVACgraph_attrbtn_view_DIV_ID,this.rendered_attrbtn_set);	
				}
				this.FIRST_CALLED = false;
			}

		}

		if (message == "hide:HVACgraph_attrbtn_view")
		{
			$("#"+this.HVACgraph_attrbtn_view_DIV_ID).css("display","none");
			this.hide_all_smallspans();
		}

		
		if ( 	(message == "set:selected_building_set") || 
				(message == "set:selected_floor_set") || 
				(message == "set:selected_HVACzone_set") )
		{
			var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			var selected_building_set = DATA_CENTER.global_variable.selected_building_set;

			var new_rendered_attrbtn_set = this.cal_attrbtnset(selected_HVACzone_set,selected_floor_set,selected_building_set);//记录有哪些属性需要画方块
			this.rendered_attrbtn_set = new_rendered_attrbtn_set;

			
			//1和2步骤可交换

			//1.更新DATA_CENTER.global_variable.selected_attr_set
			//如果update_render导致了某个之前selected_attr不再画出来，则这个attr也就必定取消select了
			var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
			for (var i=0;i<selected_attr_set.length;++i)
			{
				var cur_selected_attr = selected_attr_set[i];
				if (this.rendered_attrbtn_set.indexOf(cur_selected_attr) < 0)//没找到
				{
					selected_attr_set.splice(i,1);
					--i;//任何情况下循环做splice的时候都不要忘了--i啊啊啊!!!!!!!!!
				}
			}
			DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);

			//2.更新渲染
			if (HVACgraph_attrbtn_view.STATIC_BTN)
			{
				var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
				var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
				var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
				this.rendered_attrbtn_set = (building_HVACattr_set.concat(floor_HVACattr_set)).concat(HVACzone_HVACattr_set);
			}
			this.update_render(this.HVACgraph_attrbtn_view_DIV_ID,this.rendered_attrbtn_set);			
		}
		

		if ( message == "set:highlight_attr_set" )
        {
        	var highlight_attr_set = DATA_CENTER.linechart_variable.highlight_attr_set;
        	if (highlight_attr_set.length >=1 )
        	{
	        	d3.selectAll(".HVACattrbtn-span")
	        		.classed("mouseover_hided-HVACattrbtn-span",function(d,i){
	        			if (highlight_attr_set.indexOf(d) >= 0)
	        			{
	        				return false;
	        			}
	        			return true;
	        		})
        	}
        	else
        	{
        		d3.selectAll(".HVACattrbtn-span")
	        		.classed("mouseover_hided-HVACattrbtn-span",false)
        	}

        }
		
	},

	update_render:function(divID,new_attrbtn_list)
	{
		var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var rect_width = width/16.5;//width/new_attrbtn_list.length;
	    var rect_height = height;

		var update = d3.select("#"+divID)
			.selectAll(".HVACattrbtn-span")
			.data(DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view.
					sort_generalattr_by_priority(new_attrbtn_list),function(d){return d;})
			
			.style("background-color",function(d,i){
				var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
				if (selected_attr_set.indexOf(d)<0)
				{
					if (!d3.select(this).classed("click_selected-HVACattrbtn-span"))
						return HVACgraph_attrbtn_view.get_attr_color(d);
					return d3.rgb(d3.select(this).style("background-color"))
				}
				else
					return d3.rgb(d3.select(this).style("background-color"))	
			})
			
			//.style("width",rect_width)
		var update_div = update.select("div");
		var update_div_span = update_div.select("span")
                .text(function(d,i){
                    if (typeof(DATA_CENTER.GLOBAL_STATIC.attribute_description[d])=="undefined")
                		return d;
                	var compressed_string = DATA_CENTER.GLOBAL_STATIC.attribute_description[d].lv2_abbreviation;
                	var buttonLabel = compressed_string;
                	buttonLabel = compressed_string.substring(0,9);
                    return buttonLabel;
                });
        
		

		

		var enter = update.enter();
		var enter_span = enter.insert("span")
				//.style("width",rect_width+"px")
				.style("background-color",function(d,i){
					var color = HVACgraph_attrbtn_view.get_attr_color(d);
					return color;
				})
				.attr("class",function(d,i){
					var attr_type_class =  HVACgraph_attrbtn_view.cal_attr_type(d) + "-HVACattrbtn-span";
					return "HVACattrbtn-span" + " " +attr_type_class;
				})
				.attr("id",function(d,i){
					return "HVACattrbtn-span-" + linechart_render_view._compress_string(d);
				})
				.on("click",function(d,i){
					var attr_name = d;

					//start of set
					var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
					var index = selected_attr_set.indexOf(attr_name);
					if (index >=0 )
					{
						var new_color = d3.rgb(d3.select(this).style("background-color")).brighter(1);
						d3.select(this).style("background-color",new_color)
						d3.select(this).classed("click_selected-HVACattrbtn-span",false);

						selected_attr_set.splice(index,1);
						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);
					}
					else
					{
						var new_color = d3.rgb(d3.select(this).style("background-color")).darker(1)
						d3.select(this).style("background-color",new_color)
						d3.select(this).classed("click_selected-HVACattrbtn-span",true);

						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set.concat(attr_name));
					}


					DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view.update_selected_linechart();

					//end of set

					var compressed_attr_name = linechart_render_view._compress_string(attr_name);
					d3.select("body").selectAll("."+ compressed_attr_name + "-HVACattrbtn-span-smallspans").remove();
					if (d3.select(this).classed("click_selected-HVACattrbtn-span"))
					{
						var piece_width = HVACgraph_attrbtn_view.SMALL_SPAN_WIDTH;
						var height = $(this).height();
						var left = $(this).offset().left;
						var top = $(this).offset().top-height;

						HVACgraph_attrbtn_view._update_render_smallspans(attr_name,left,top,piece_width,height);
					}

				})
				.on("mouseover",function(d,i){
					DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view
						._highlight_communication_mouseover_attrbtn(d);
				})
				.on("mouseout",function(d,i){
					DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view
						._highlight_communication_mouseout_attrbtn();
				})
		var enter_span_div = enter_span.append("div")
                .attr("style","position:relative");
        var enter_span_div_span = enter_span_div.append("span")
                .attr("class","object_title_span")
                .text(function(d,i){
                	if (typeof(DATA_CENTER.GLOBAL_STATIC.attribute_description[d])=="undefined")
                		return d;
                	var compressed_string = DATA_CENTER.GLOBAL_STATIC.attribute_description[d].lv2_abbreviation;
                	var buttonLabel = compressed_string;
                	buttonLabel = compressed_string.substring(0,9);
                    return buttonLabel;
                })

		
		var exit = update.exit();
		//删除加上去的小span
		exit.each(function(d,i){
			var attr_name = d;
			var compressed_attr_name = linechart_render_view._compress_string(attr_name);
			d3.select("body").selectAll("."+ compressed_attr_name + "-HVACattrbtn-span-smallspans").remove();		
		})
		exit.remove();//删除本身



		//完成所有更新，大按钮的位置肯定不会动以后，再调动小span的位置
        update.each(function(d,i){
            var attr_name = d;
            var compressed_attr_name = linechart_render_view._compress_string(attr_name);
			d3.select("body").selectAll("."+ compressed_attr_name + "-HVACattrbtn-span-smallspans").remove();
			if (d3.select(this).classed("click_selected-HVACattrbtn-span"))
			{
				var piece_width = HVACgraph_attrbtn_view.SMALL_SPAN_WIDTH;
				var height = $(this).height();
				var left = $(this).offset().left;
				var top = $(this).offset().top-height;
				HVACgraph_attrbtn_view._update_render_smallspans(attr_name,left,top,piece_width,height);
			}
        });

		DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view._bind_attrbtn_tip("HVACattrbtn-span")
	},

	_bind_attrbtn_tip:function(class_label)
	{
		$('.'+class_label).each(function() {
		    $(this).tipsy({
		    	gravity: "s",
		    	html:true,
		    	title:function(){
		    		var d = this.__data__;

		    		if (typeof(DATA_CENTER.GLOBAL_STATIC.attribute_description[d])=="undefined")
                		return d;
                	var attr_zone_type = DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view
											.cal_attr_type(d);
		    		var compressed_string = DATA_CENTER.GLOBAL_STATIC.attribute_description[d].lv2_abbreviation;
		    		var content = 	"<span>" + compressed_string + "</span>";
		    		content += "</br>" + "<span>(" +  attr_zone_type + ")</span>";
		    		content += "</br>" +"type: ";
		    		var attr_type = DATA_CENTER.GLOBAL_STATIC.attribute_description[d].type;
		    		for (var i=0;i<attr_type.length;++i)
		    		{
		    			var cur_type = attr_type[i];
		    			content += "<span style='color:" + DATA_CENTER.GLOBAL_STATIC.attribute_type_color_mapping[cur_type] +
		    							"'>" + cur_type +"</span> ";
		    		}
		    		return content;
		    	},
		    });
		});
	},

	_update_render_smallspans:function(attr_name,left,top,piece_width,height)
	{
		var place_set = _cal_place_set(attr_name);
		var attr_type = HVACgraph_attrbtn_view.cal_attr_type(attr_name);
		var compressed_attr_name = linechart_render_view._compress_string(attr_name);
		function _cal_place_set(attr_name)
		{
			//可能取值是HVACzone_oridinary_attr，HVACzone_hazium，floor_attr，building_attr
			var attr_type = HVACgraph_attrbtn_view.cal_attr_type(attr_name);
			var place_set = [];
			if (attr_type == "HVACzone_oridinary_attr")
			{
				var place_set = DATA_CENTER.global_variable.selected_HVACzone_set;
			}
			else if (attr_type == "HVACzone_hazium")
			{
				var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
				for (var j=0;j < selected_HVACzone_set.length;++j)
				{
					if (DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.indexOf(selected_HVACzone_set[j])>=0)
					{
						place_set.push(selected_HVACzone_set[j]);
					}
				}
			}
			else if (attr_type == "floor_attr")
			{
				var place_set = DATA_CENTER.global_variable.selected_floor_set;
			}
			else if (attr_type == "building_attr")
			{
				var place_set = DATA_CENTER.global_variable.selected_building_set;
			}
			return place_set;
		}

		var divCLASS = this.DIV_CLASS_OF_SMALLSPANS;

		var div_of_smallspans = d3.select("body")//放在body上append使得他能显示出来
				.append("div")
					.attr("class",divCLASS)
					.style("position","absolute")
					.style("top",top + 'px')
			    	.style("left",left + 'px')
			    .selectAll(".HVACattrbtn-span-smallspans")
					.data( place_set )
					.enter()
					.append("span")
					.attr("class",function(d,i){
						var attr_type_class =  attr_type + "-HVACattrbtn-span-smallspans";
						var attr_class =  compressed_attr_name + "-HVACattrbtn-span-smallspans";
						return "HVACattrbtn-span-smallspans" + " " +attr_type_class + " " + attr_class;
					})
					.style("width",piece_width+'px')
					.style("height",height+'px')
					.style("border","solid 1px #111")
					.style("cursor","pointer")
					.style("display","inline-block")
					.style("margin","0.5px")
					.on("mouseover",function(d,i){
						
						_highlight_communication(attr_name);
						function _highlight_communication(attr_name)
						{
							//1. 高亮place
							var attr_type = HVACgraph_attrbtn_view.cal_attr_type(attr_name);
							var highlight_place_set = [d];
							if (attr_type == "HVACzone_oridinary_attr")
							{
								DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",highlight_place_set);
							}
							else if (attr_type == "HVACzone_hazium")
							{
								DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",highlight_place_set);
							}
							else if (attr_type == "floor_attr")
							{
								DATA_CENTER.set_linechart_variable("highlight_floor_set",highlight_place_set);
							}
							else if (attr_type == "building_attr")
							{
								DATA_CENTER.set_linechart_variable("highlight_building_set",highlight_place_set);
							}

							//2. 高亮linechart
							//计算得到所有被渲染出来的linechartbtn
							var highlight_linechart_set = [];
							if (attr_type == "HVACzone_oridinary_attr")
							{
								highlight_linechart_set = HVACgraph_attrbtn_view.cal_attr_x_position([attr_name],highlight_place_set,[],[])
							}
							else if (attr_type == "HVACzone_hazium")
							{
								highlight_linechart_set = HVACgraph_attrbtn_view.cal_attr_x_position([attr_name],highlight_place_set,[],[])
							}
							else if (attr_type == "floor_attr")
							{
								highlight_linechart_set = HVACgraph_attrbtn_view.cal_attr_x_position([attr_name],[],highlight_place_set,[])
							}
							else if (attr_type == "building_attr")
							{
								highlight_linechart_set = HVACgraph_attrbtn_view.cal_attr_x_position([attr_name],[],[],highlight_place_set)
							}
							//高亮所有被渲染出来的linechartbtn
							DATA_CENTER.set_linechart_variable("highlight_linechart_set",highlight_linechart_set);

						}
						
						

					})
					.on("mouseout",function(d,i){
						
						_highlight_communication(d,i);
						function _highlight_communication(d,i)
						{
							//1.取消高亮place
							DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",[]);
							DATA_CENTER.set_linechart_variable("highlight_floor_set",[]);
							DATA_CENTER.set_linechart_variable("highlight_building_set",[]);

							//2.取消高亮linechart
							DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);
						}
						

					})
		

		$('.HVACattrbtn-span-smallspans').each(function() {
		    $(this).tipsy({
		    	gravity: "s",
		    	html:true,
		    	title:function(){
		    		var d = this.__data__;
		    		var content = 	"place: " + "<span style='color:red'>" + d + "</span>";
		    		return content;
		    	},
		    });
		});
	},

	//输入被选中的三类实体集合，返回需要画的按钮
	//return一个attrbtn_set
	cal_attrbtnset:function(selected_HVACzone_set,selected_floor_set,selected_building_set)
	{
		var new_rendered_attrbtn_set = [];//记录有哪些属性需要画方块

		var flag_need_Hazium_Concentration = false;
		for (var i=0;i<selected_HVACzone_set.length;++i)//检查是否存在具有hazium传感器的zone
		{
			var HVACzone_with_Haziumsenor_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set;
			if (HVACzone_with_Haziumsenor_set.indexOf(selected_HVACzone_set[i]) >= 0 )
			{
				flag_need_Hazium_Concentration = true;
				break;
			}
		}

		//加入HVACzone的属性
		if (selected_HVACzone_set.length >= 1)//只要存在至少一个被选中的zone，就需要画zone的属性btn
		{
			var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
			for (var j=0;j<HVACzone_HVACattr_set.length;++j)
			{
				if (HVACzone_HVACattr_set[j] != DATA_CENTER.GLOBAL_STATIC.HAZIUM_ATTR_NAME)
					new_rendered_attrbtn_set.push(HVACzone_HVACattr_set[j]);
				else if (flag_need_Hazium_Concentration)
					new_rendered_attrbtn_set.push(HVACzone_HVACattr_set[j]);
			}
		}

		//加入floor的属性
		if (selected_floor_set.length >= 1)//只要存在至少一个被选中的floor，就需要画floor的属性btn
		{
			var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
			for (var j=0;j<floor_HVACattr_set.length;++j)
			{
				new_rendered_attrbtn_set.push(floor_HVACattr_set[j]);
			}
		}

		//加入building的属性
		if (selected_building_set.length >= 1)//只要存在至少一个被选中的floor，就需要画floor的属性btn
		{
			var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
			for (var j=0;j<building_HVACattr_set.length;++j)
			{
				new_rendered_attrbtn_set.push(building_HVACattr_set[j]);
			}
		}

		return new_rendered_attrbtn_set;
	},

	//输入一个属性的名字，返回这个属性的类别
	//可能的返回值是HVACzone_oridinary_attr，HVACzone_hazium，floor_attr，building_attr
	cal_attr_type:function(attr_name)
	{
		//引用的全局变量
		var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
		var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
		var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;

		if (HVACzone_HVACattr_set.indexOf(attr_name) >=0)
		{
			if (attr_name != DATA_CENTER.GLOBAL_STATIC.HAZIUM_ATTR_NAME)
				return "HVACzone_oridinary_attr";
			else
				return "HVACzone_hazium";
		}
		else if (floor_HVACattr_set.indexOf(attr_name) >=0)
			return "floor_attr";
		else if (building_HVACattr_set.indexOf(attr_name) >=0)
			return "building_attr";
		else
			console.warn("cal_attr_type invalid attr name")
	},

	sort_generalattr_by_priority:function(attr_list)
	{
		var attribute_type_priority = DATA_CENTER.GLOBAL_STATIC.attribute_type_priority;
		sorted_array = attr_list.sort(function(a,b){
			if (typeof(DATA_CENTER.GLOBAL_STATIC.attribute_description[a])=="undefined")
			{
				console.warn("new attr met",a)
				return -1;
			}
			else if (typeof(DATA_CENTER.GLOBAL_STATIC.attribute_description[b])=="undefined")
			{
				console.warn("new attr met",b)
				return -1;
			}

			var attr_type_a = DATA_CENTER.GLOBAL_STATIC.attribute_description[a].type;
			var attr_type_b = DATA_CENTER.GLOBAL_STATIC.attribute_description[b].type;
			for (var i=0;i<attribute_type_priority.length;++i)
			{
				var cur_type = attribute_type_priority[i];
				if (attr_type_a.indexOf(cur_type)>=0)
				{
					flag = -1;
					break;
				}
				else if (attr_type_b.indexOf(cur_type)>=0)
				{
					flag =  1;
					break;
				}
			}
			return flag;
		})
		return sorted_array;
	},

	hide_all_smallspans:function()
	{
		$("."+ this.DIV_CLASS_OF_SMALLSPANS).css("display","none");
	},
	show_all_smallspans:function()
	{
		$("."+ this.DIV_CLASS_OF_SMALLSPANS).css("display","block");
	},
	
	update_selected_linechart:function()
	{
		var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
		var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
		var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
		var selected_building_set = DATA_CENTER.global_variable.selected_building_set;

		var selected_linechart_set = HVACgraph_attrbtn_view.cal_attr_x_position(selected_attr_set,selected_HVACzone_set,selected_floor_set,selected_building_set);
		DATA_CENTER.set_global_variable("selected_linechart_set",selected_linechart_set);
	},

	get_attr_color:function(general_attr_name)
	{
		if (typeof(DATA_CENTER.GLOBAL_STATIC.attribute_description[general_attr_name])=="undefined")
			return "#888888";
		var attr_type = DATA_CENTER.GLOBAL_STATIC.attribute_description[general_attr_name].type;
		var color = "#888888";

		var attribute_type_priority = DATA_CENTER.GLOBAL_STATIC.attribute_type_priority
		for (var i=0;i<attribute_type_priority.length;++i)
		{
			var cur_type = attribute_type_priority[i];
			if (attr_type.indexOf(cur_type)>=0)
			{
				color = DATA_CENTER.GLOBAL_STATIC.attribute_type_color_mapping[cur_type];
				break;
			}
		}
		return color;
	},

	//输入一个linechart的名字
	//返回这个linechart对于了什么地点，对应了什么属性
	parse_position_attr:function(linechart_name)
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

	combine_place_attr:function(place,place_type,attr)
	{
		if (place_type == "HVACzone")
		{
			if (attr != DATA_CENTER.GLOBAL_STATIC.HAZIUM_ATTR_NAME)
				return place + " " + attr;
			else if (DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.indexOf(place) >=0 )
				return place + " " + attr;
			else
				return undefined;
		}
		if (place_type == "floor")
			return place + " " + attr;
		if (place_type == "building")
			return attr;
		console.warn("undefined place_type",place,place_type);
		return undefined;
	},

	//输入被选中的三类实体集合，返回需要画的按钮
	//return一个attrbtn_set
	cal_attr_x_position:function(selected_attr_set,selected_HVACzone_set,selected_floor_set,selected_building_set)
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
					var cur_linechart = HVACgraph_attrbtn_view.combine_place_attr(cur_selected_HVACzone,"HVACzone",cur_attr);
					if (typeof(cur_linechart)!="undefined")
						new_rendered_linechartbtn_set.push(cur_linechart)
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
					var cur_linechart = HVACgraph_attrbtn_view.combine_place_attr(cur_selected_floor,"floor",cur_attr);
					if (typeof(cur_linechart)!="undefined")
						new_rendered_linechartbtn_set.push(cur_linechart)
				}	
			}
		}

		//计算selected_attr_set * selected_building_set，push进new_rendered_linechartbtn_set
		for (var i=0;i<selected_building_set.length;++i)
		{
			var cur_selected_building = selected_building_set[i]

			var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
			for (var j=0;j<building_HVACattr_set.length;++j)
			{
				var cur_attr = building_HVACattr_set[j];
				if (selected_attr_set.indexOf(cur_attr) >= 0)
				{
					var cur_linechart = HVACgraph_attrbtn_view.combine_place_attr(cur_selected_building,"building",cur_attr);
					if (typeof(cur_linechart)!="undefined")					
						new_rendered_linechartbtn_set.push(cur_linechart)
				}	
			}
		}

		return new_rendered_linechartbtn_set;
	},

	_highlight_communication_mouseover_attrbtn:function(attr_name)
	{
		//1.高亮attr
		var highlight_attr_set = [attr_name];
		DATA_CENTER.set_linechart_variable("highlight_attr_set",highlight_attr_set);

		//2.高亮place
		//可能取值是HVACzone_oridinary_attr，HVACzone_hazium，floor_attr，building_attr
		var attr_type = HVACgraph_attrbtn_view.cal_attr_type(attr_name);
		if (attr_type == "HVACzone_oridinary_attr")
		{
			//高亮所有之间点选中的HVACzone结点
			var highlight_place_set = DATA_CENTER.global_variable.selected_HVACzone_set;
			DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",highlight_place_set);
		}
		else if (attr_type == "HVACzone_hazium")
		{
			var highlight_place_set = [];
			var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
			for (var j=0;j < selected_HVACzone_set.length;++j)
			{
				if (DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.indexOf(selected_HVACzone_set[j])>=0)
				{
					highlight_place_set.push(selected_HVACzone_set[j]);
				}
			}
			DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",highlight_place_set);
		}
		else if (attr_type == "floor_attr")
		{
			//高亮所有之间点选中的floor结点
			var highlight_place_set = DATA_CENTER.global_variable.selected_floor_set;
			DATA_CENTER.set_linechart_variable("highlight_floor_set",highlight_place_set);
		}
		else if (attr_type == "building_attr")
		{
			//高亮所有之间点选中的floor结点
			var highlight_place_set = DATA_CENTER.global_variable.selected_building_set;
			DATA_CENTER.set_linechart_variable("highlight_building_set",highlight_place_set);
		}


		//3.高亮linechart
		var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
		var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
		var selected_building_set = DATA_CENTER.global_variable.selected_building_set;
		//计算得到所有被渲染出来的linechartbtn
		var highlight_linechart_set = HVACgraph_attrbtn_view.cal_attr_x_position([attr_name],selected_HVACzone_set,selected_floor_set,selected_building_set)
		//高亮所有被渲染出来的linechartbtn
		DATA_CENTER.set_linechart_variable("highlight_linechart_set",highlight_linechart_set);

	},

	_highlight_communication_mouseout_attrbtn:function()
	{
		//1.取消高亮attr
		DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);

		//2.取消高亮place
		DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",[]);
		DATA_CENTER.set_linechart_variable("highlight_floor_set",[]);
		DATA_CENTER.set_linechart_variable("highlight_building_set",[]);

		//3.取消高亮linechart
		DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);
	},

}