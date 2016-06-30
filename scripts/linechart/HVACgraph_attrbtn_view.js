var HVACgraph_attrbtn_view = {
	COLOR_OF : {
		"HVACzone_oridinary_attr":"#74c476",
		"HVACzone_hazium":"green",
		"floor_attr":"#6070FF",
		"building_attr":"#AA50FF",

		"highlight_color":"#FF7060"
	},
	FIRST_CALLED : true,
	DIV_ID : "HVACgraph-attr-btn",

	rendered_attrbtn_set : [],
	color_mapping : [],

	obsUpdate:function(message, data)
	{
		if ( 	(message == "set:selected_building_set") || 
				(message == "set:selected_floor_set") || 
				(message == "set:selected_HVACzone_set") )
		{
			
			var new_rendered_attrbtn_set = [];//记录有哪些属性需要画方块
			var new_color_mapping = [];//记录new_rendered_attrbtn_set对应的颜色映射

			var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;

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
					if (HVACzone_HVACattr_set[j] != "Hazium Concentration")
					{
						new_rendered_attrbtn_set.push(HVACzone_HVACattr_set[j]);
						new_color_mapping.push(this.COLOR_OF["HVACzone_oridinary_attr"]);
					}
					else
					{
						if (flag_need_Hazium_Concentration)
						{
							new_rendered_attrbtn_set.push(HVACzone_HVACattr_set[j]);
							new_color_mapping.push(this.COLOR_OF["HVACzone_hazium"]);
						}
					}
				}
			}

			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			//加入floor的属性
			if (selected_floor_set.length >= 1)//只要存在至少一个被选中的floor，就需要画floor的属性btn
			{
				var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
				for (var j=0;j<floor_HVACattr_set.length;++j)
				{
					new_rendered_attrbtn_set.push(floor_HVACattr_set[j]);
					new_color_mapping.push(this.COLOR_OF["floor_attr"]);
				}
			}

			var selected_building_set = DATA_CENTER.global_variable.selected_building_set;
			//加入building的属性
			if (selected_building_set.length >= 1)//只要存在至少一个被选中的floor，就需要画floor的属性btn
			{
				var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
				for (var j=0;j<building_HVACattr_set.length;++j)
				{
					new_rendered_attrbtn_set.push(building_HVACattr_set[j]);
					new_color_mapping.push(this.COLOR_OF["building_attr"]);
				}
			}

			if (this.FIRST_CALLED)
			{
				this.rendered_attrbtn_set = new_rendered_attrbtn_set;
				this.color_mapping = new_color_mapping;
				
				this.draw_attr_panel(this.DIV_ID,this.rendered_attrbtn_set,this.color_mapping)

				//this.FIRST_CALLED = false;
			}
			else
			{
				this.rendered_attrbtn_set = new_rendered_attrbtn_set;
				this.color_mapping = new_color_mapping;

				this.update_render(this.DIV_ID,this.rendered_attrbtn_set,new_rendered_attrbtn_set,new_color_mapping)

				
			}

		}
	},
	update_render:function(divID,old_attr_list,new_attr_list,new_color_mapping)
	{

		var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var rect_width = width/new_attr_list.length;
	    var rect_height = height;



		d3.select("#"+divID)
			.selectAll(".HVACattrbtn-span")
			.data(new_attr_list)
			.enter()
			.append("span")
			.attr("class","HVACattrbtn-span")
			.attr("id",function(d,i){
				var ID = 'HVACattrbtn-span-' + i;
				return ID;
			})
			.attr("value",function(d,i){
				var buttonValue = new_attr_list[i];
				return buttonValue;
			})
			.style("background",function(d,i){
				var background_color = new_color_mapping[i];
				return background_color;
			})
			.html(function(d,i){
				var buttonLabel = new_attr_list[i].substring(0,rect_width/9);
				var buttonValue = new_attr_list[i];
				
				var height = rect_height;
				var background_color = new_color_mapping[i];

				var buttonhtml = 	'<div style="position:relative">'+//'<i class="fa fa-times delete_icon hidden" groupid=<%=buttonValue%>></i>'+
				    					'<span class="object_title_span" value=' + buttonValue + ' > ' + buttonLabel + '</span>'+
				    				'</div>'; 
				return buttonhtml;
			})
			.on("click",function(d,i){
				var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
				var index = selected_attr_set.indexOf(d);
				if (index >=0 )
				{
					d3.select(this).style("background",HVACgraph_attrbtn_view.color_mapping[i]);
					//d3.select(this).classed("selected-HVACattrbtn-span",false);

					selected_attr_set.splice(index,1);
					DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);
				}
				else
				{
					d3.select(this).style("background",HVACgraph_attrbtn_view.COLOR_OF["highlight_color"]);
					//d3.select(this).classed("selected-HVACattrbtn-span",true);		

					DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set.concat(d));
				}
			})
			.on("mouseover",function(d,i){
				
			})
			.on("mouseout",function(d,i){
				
			})


		d3.select("#"+divID)
			.selectAll(".HVACattrbtn-span")
			.exit()
			.remove();
	},
	/*
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();


	    this.draw_attr_panel(divID,DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set,d3.scale.category20())
	},
	*/
	draw_attr_panel:function(divID,attr_list,color_mapping)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var div = document.getElementById(divID)

	    var rect_width = width/attr_list.length;
	    var rect_height = height;

		d3.select("#"+divID)
			.selectAll(".HVACattrbtn-span")
			.data(attr_list).enter().append("span")
			.attr("class","HVACattrbtn-span")
			.attr("id",function(d,i){
				var ID = 'HVACattrbtn-span-' + i;
				return ID;
			})
			.attr("value",function(d,i){
				var buttonValue = attr_list[i];
				return buttonValue;
			})
			.style("background",function(d,i){
				var background_color = color_mapping[i];
				return background_color;
			})
			.html(function(d,i){
				var buttonLabel = attr_list[i].substring(0,rect_width/9);
				var buttonValue = attr_list[i];
				
				var height = rect_height;
				var background_color = color_mapping[i];

				var buttonhtml = 	'<div style="position:relative">'+//'<i class="fa fa-times delete_icon hidden" groupid=<%=buttonValue%>></i>'+
				    					'<span class="object_title_span" value=' + buttonValue + ' > ' + buttonLabel + '</span>'+
				    				'</div>'; 
				return buttonhtml;
			})
			.on("click",function(d,i){
				var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
				var index = selected_attr_set.indexOf(d);
				if (index >=0 )
				{
					d3.select(this).style("background",HVACgraph_attrbtn_view.color_mapping[i]);
					//d3.select(this).classed("selected-HVACattrbtn-span",false);

					selected_attr_set.splice(index,1);
					DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);
				}
				else
				{
					d3.select(this).style("background",HVACgraph_attrbtn_view.COLOR_OF["highlight_color"]);
					//d3.select(this).classed("selected-HVACattrbtn-span",true);		

					DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set.concat(d));
				}
			})
			.on("mouseover",function(d,i){
				
			})
			.on("mouseout",function(d,i){
				
			})

	},


/*
	draw_attr_panel:function(divID,attr_list,color_mapping)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var tip = d3.tip()
			    .attr('class', 'd3-tip')
			    .attr('id', 'mapgraph-tip')
			    .offset([0,-10])
			    .html(function(d, i) {
			        return  "" + "<span style='color:red'>" + d + "</span>" + " ";
			    });

	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")  
	                .attr("width",width)
	                .attr("height",height)
	    svg.call(tip)

	    var rect_width = width/attr_list.length;
	    var rect_height = height;


	    //.style("display","inline-block")
	    var g = svg.selectAll("g")
	    		.data(attr_list).enter()
				.append("g")
				.attr("class","HVACattrbtn")
				.attr("transform",function(d,i){
					return "translate("+ i*rect_width +","+ 0 +")";
				})
				.on("click",function(d,i){
					var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
					var index = selected_attr_set.indexOf(d);
					if (index >=0 )
					{
						d3.select(this).classed("selected-HVACattrbtn",false);
						selected_attr_set.splice(index,1);
						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);
					}
					else
					{
						d3.select(this).classed("selected-HVACattrbtn",true);			
						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set.concat(d));
					}
					
				})
				.on("mouseover",function(d,i){
					tip.show(d,i)
				})
				.on("mouseout",function(d,i){
					tip.hide(d,i)
				})
				
	    var rect = g.append("rect")
	    			.attr("class","HVACattrbtn-rect")
	    			.attr("width",rect_width)
	    			.attr("height",rect_height)
	    			.attr("fill",function(d,i){
	    				//return "purple";
	    				return color_mapping(i);
	    			});

	    var text = g.append("text")
	    			.attr("class","HVACattrbtn-text")
	    			.attr("dy", rect_height/2+5)
	    			.attr("dx",rect_width/2)
					.style("text-anchor", "middle")
					.text(function(d,i){
					    return d.substring(0,rect_width/8);
					});
		


	}
*/	
}