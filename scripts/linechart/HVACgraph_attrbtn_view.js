var HVACgraph_attrbtn_view = {
	DIV_ID : "HVACgraph-attr-btn",
	DIV_CLASS_OF_SMALLSPANS:"HVACattrbtn-span-div_of_smallspans",
	HAZIUM_ATTR_NAME : "Hazium Concentration",//记录hazium的那个属性的名字

	rendered_attrbtn_set : [],

	obsUpdate:function(message, data)
	{
		if ( 	(message == "set:selected_building_set") || 
				(message == "set:selected_floor_set") || 
				(message == "set:selected_HVACzone_set") )
		{
			var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			var selected_building_set = DATA_CENTER.global_variable.selected_building_set;

			var new_rendered_attrbtn_set = this._cal_attrbtnset(selected_HVACzone_set,selected_floor_set,selected_building_set);//记录有哪些属性需要画方块
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
			this.update_render(this.DIV_ID,this.rendered_attrbtn_set);			
		}

		if ( message == "set:highlight_attr_set" )
        {
        	d3.selectAll(".HVACattrbtn-span")
        		.classed("mouseover_selected-HVACattrbtn-span",function(d,i){
        			if (DATA_CENTER.linechart_variable.highlight_attr_set.indexOf(d) >= 0)
        			{
        				return true;
        			}
        			return false;
        		})
        }
		
	},

	//输入一个属性的名字，返回这个属性的类别
	//可能的返回值是HVACzone_oridinary_attr，HVACzone_hazium，floor_attr，building_attr
	_cal_attr_type:function(attr_name)
	{
		//引用的全局变量
		var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
		var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
		var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;

		if (HVACzone_HVACattr_set.indexOf(attr_name) >=0)
		{
			if (attr_name != this.HAZIUM_ATTR_NAME)
			{
				return "HVACzone_oridinary_attr";
			}
			else
			{
				return "HVACzone_hazium";
			}
		}
		else if (floor_HVACattr_set.indexOf(attr_name) >=0)
		{
			return "floor_attr";
		}
		else if (building_HVACattr_set.indexOf(attr_name) >=0)
		{
			return "building_attr";
		}
		else
		{
			console.log("_cal_attr_type invalid attr name")
		}

	},

	//输入被选中的三类实体集合，返回需要画的按钮
	//return一个attrbtn_set
	_cal_attrbtnset:function(selected_HVACzone_set,selected_floor_set,selected_building_set)
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
				if (HVACzone_HVACattr_set[j] != this.HAZIUM_ATTR_NAME)
				{
					new_rendered_attrbtn_set.push(HVACzone_HVACattr_set[j]);
				}
				else
				{
					if (flag_need_Hazium_Concentration)
					{
						new_rendered_attrbtn_set.push(HVACzone_HVACattr_set[j]);
					}
				}
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

	update_render:function(divID,new_attrbtn_list)
	{
		var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var rect_width = width/new_attrbtn_list.length;
	    var rect_height = height;

		var update = d3.select("#"+divID)
			.selectAll(".HVACattrbtn-span")
			.data(new_attrbtn_list,function(d){return d;});
		var update_div = update.select("div");
		var update_div_span = update_div.select("span")
                .text(function(d,i){
                	var buttonLabel = new_attrbtn_list[i].substring(0,rect_width/13);
                    return buttonLabel;
                });
        
			

		var enter = update.enter();
		var enter_span = enter.insert("span")
				.attr("class",function(d,i){
					var attr_type_class =  HVACgraph_attrbtn_view._cal_attr_type(d) + "-HVACattrbtn-span";
					return "HVACattrbtn-span" + " " +attr_type_class;
				})
				.attr("id",function(d,i){
					return "HVACattrbtn-span-" + linechart_render_view._compress_string(d);
				})
				.attr("value",function(d,i){
					var buttonValue = new_attrbtn_list[i];
					return buttonValue;
				})
				.on("click",function(d,i){
					var attr_name = d;

				//start of set
					var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
					var index = selected_attr_set.indexOf(attr_name);
					if (index >=0 )
					{
						d3.select(this).classed("click_selected-HVACattrbtn-span",false);

						selected_attr_set.splice(index,1);
						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);
					}
					else
					{
						d3.select(this).classed("click_selected-HVACattrbtn-span",true);

						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set.concat(attr_name));
					}
				//end of set

					var compressed_attr_name = linechart_render_view._compress_string(attr_name);
					d3.select("body").selectAll("."+ compressed_attr_name + "-HVACattrbtn-span-smallspans").remove();
					if (d3.select(this).classed("click_selected-HVACattrbtn-span"))
					{
						var piece_width = 8;
						var height = $(this).height();
						var left = $(this).offset().left;
						var top = $(this).offset().top-height;

						HVACgraph_attrbtn_view._update_render_smallspans(attr_name,left,top,piece_width,height);
					}
				})
				.on("mouseover",function(d,i){

					_highlight_communication(d,i);
					function _highlight_communication(d,i)
					{
						//1.高亮attr
						var highlight_attr_set = [d];
						DATA_CENTER.set_linechart_variable("highlight_attr_set",highlight_attr_set);


						//2.高亮place
						//可能取值是HVACzone_oridinary_attr，HVACzone_hazium，floor_attr，building_attr
						var attr_type = HVACgraph_attrbtn_view._cal_attr_type(d);
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
						var highlight_linechart_set = linechart_linebtn_view._cal_attrbtnset([d],selected_HVACzone_set,selected_floor_set,selected_building_set)
						//高亮所有被渲染出来的linechartbtn
						DATA_CENTER.set_linechart_variable("highlight_linechart_set",highlight_linechart_set);

					}

				})
				.on("mouseout",function(d,i){

					_highlight_communication(d,i);
					function _highlight_communication(d,i)
					{
						//1.取消高亮attr
						DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);

						//2.取消高亮place
						DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",[]);
						DATA_CENTER.set_linechart_variable("highlight_floor_set",[]);
						DATA_CENTER.set_linechart_variable("highlight_building_set",[]);

						//3.取消高亮linechart
						DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);
					}

				})
		var enter_span_div = enter_span.append("div")
                .attr("style","position:relative");
        var enter_span_div_span = enter_span_div.append("span")
                .attr("class","object_title_span")
                .attr("value",function(d,i){
                    var buttonValue = new_attrbtn_list[i];
                    return buttonValue;
                })
                .text(function(d,i){
                	var buttonLabel = new_attrbtn_list[i].substring(0,rect_width/13);
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
				var piece_width = 8;
				var height = $(this).height();
				var left = $(this).offset().left;
				var top = $(this).offset().top-height;
				HVACgraph_attrbtn_view._update_render_smallspans(attr_name,left,top,piece_width,height);
			}
        });



		$('.HVACattrbtn-span').each(function() {
		    $(this).tipsy({
		    	gravity: "s",
		    	html:true,
		    	title:function(){
		    		var d = this.__data__;

		    		var content = 	"attr: " + "<span style='color:red'>" + d + "</span>";
		    		return content;
		    	},
		    });
		});

	},
	hide_all_smallspans:function()
	{
		$("."+ this.DIV_CLASS_OF_SMALLSPANS).css("display","none");
	},
	show_all_smallspans:function()
	{
		$("."+ this.DIV_CLASS_OF_SMALLSPANS).css("display","block");
	},
	_update_render_smallspans:function(attr_name,left,top,piece_width,height)
	{
		var place_set = _cal_place_set(attr_name);
		var attr_type = HVACgraph_attrbtn_view._cal_attr_type(attr_name);
		var compressed_attr_name = linechart_render_view._compress_string(attr_name);
		function _cal_place_set(attr_name)
		{
			//可能取值是HVACzone_oridinary_attr，HVACzone_hazium，floor_attr，building_attr
			var attr_type = HVACgraph_attrbtn_view._cal_attr_type(attr_name);
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
					.style("margin","1px")
					.on("mouseover",function(d,i){

						_highlight_communication(attr_name);
						function _highlight_communication(attr_name)
						{
							//1. 高亮place
							var attr_type = HVACgraph_attrbtn_view._cal_attr_type(attr_name);
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
								highlight_linechart_set = linechart_linebtn_view._cal_attrbtnset([attr_name],highlight_place_set,[],[])
							}
							else if (attr_type == "HVACzone_hazium")
							{
								highlight_linechart_set = linechart_linebtn_view._cal_attrbtnset([attr_name],highlight_place_set,[],[])
							}
							else if (attr_type == "floor_attr")
							{
								highlight_linechart_set = linechart_linebtn_view._cal_attrbtnset([attr_name],[],highlight_place_set,[])
							}
							else if (attr_type == "building_attr")
							{
								highlight_linechart_set = linechart_linebtn_view._cal_attrbtnset([attr_name],[],[],highlight_place_set)
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
	}
}