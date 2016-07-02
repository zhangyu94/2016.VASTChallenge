var HVACgraph_attrbtn_view = {
	COLOR_OF : {
		HVACzone_oridinary_attr:"#74c476",
		HVACzone_hazium:"green",
		floor_attr:"#6070FF",
		building_attr:"#AA50FF",

		highlight_color:"#FF7060"
	},
	DIV_ID : "HVACgraph-attr-btn",
	HAZIUM_ATTR_NAME : "Hazium Concentration",//记录hazium的那个属性的名字

	rendered_attrbtn_set : [],

	//输入一个属性的名字，根据这个属性的类别，以及HVACgraph_attrbtn_view.COLOR_OF，返回这个属性的颜色
	//return "#...""
	_cal_color:function(attr_name)
	{
		//引用的全局变量
		var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
		var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
		var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;

		if (HVACzone_HVACattr_set.indexOf(attr_name) >=0)
		{
			if (attr_name != this.HAZIUM_ATTR_NAME)
			{
				return this.COLOR_OF["HVACzone_oridinary_attr"];
			}
			else
			{
				return this.COLOR_OF["HVACzone_hazium"];
			}
		}
		else if (floor_HVACattr_set.indexOf(attr_name) >=0)
		{
			return this.COLOR_OF["floor_attr"];
		}
		else if (building_HVACattr_set.indexOf(attr_name) >=0)
		{
			return this.COLOR_OF["building_attr"];
		}
		else
		{
			console.log("_cal_color invalid attr name")
		}

	},

	//输入被选中的三类实体集合，返回需要画的按钮和每个按钮的颜色映射
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

        }
		
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
                })
			
		var enter = update.enter();
		var enter_span = enter.insert("span")
				.attr("class","HVACattrbtn-span")
				.attr("value",function(d,i){
					var buttonValue = new_attrbtn_list[i];
					return buttonValue;
				})
				.style("background",function(d,i){
					var background_color = HVACgraph_attrbtn_view._cal_color(d);
					return background_color;
				})
				.on("click",function(d,i){
					var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
					var index = selected_attr_set.indexOf(d);
					if (index >=0 )
					{
						d3.select(this).style("background",HVACgraph_attrbtn_view._cal_color(d));

						selected_attr_set.splice(index,1);
						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);
					}
					else
					{
						d3.select(this).style("background",HVACgraph_attrbtn_view.COLOR_OF["highlight_color"]);	

						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set.concat(d));
					}
				})
				.on("mouseover",function(d,i){
					console.log(d)

					_highlight_communication(d,i);
					function _highlight_communication(d,i)
					{

					}

				})
				.on("mouseout",function(d,i){

					_highlight_communication(d,i);
					function _highlight_communication(d,i)
					{

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
		exit.remove();
	},
}