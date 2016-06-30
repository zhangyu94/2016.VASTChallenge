var linechart_linebtn_view = {
	first_called : true,
	rendered_linechartbtn_set : [],
	obsUpdate:function(message, data)
	{
		if ( 	(message == "set:selected_building_set") || 
				(message == "set:selected_floor_set") || 
				(message == "set:selected_HVACzone_set") ||
				(message == "set:selected_attr_set") )
		{
			if (true)//this.first_called)
			{
				first_called = false;

				var rendered_linechartbtn_set = [];

				for (var i=0;i<DATA_CENTER.global_variable.selected_HVACzone_set.length;++i)
				{
					var HVACzone = DATA_CENTER.global_variable.selected_HVACzone_set[i]

					var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
					for (var j=0;j<HVACzone_HVACattr_set.length;++j)
					{
						var cur_attr = HVACzone_HVACattr_set[j];
						var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
						if (selected_attr_set.indexOf(cur_attr) >= 0)
						{

							var cur_linechart = HVACzone + "_" + cur_attr;//形如F_2_VAV_SYS SUPPLY
							console.log(cur_linechart)
							rendered_linechartbtn_set.push(cur_linechart)
						}
					}
				}

				for (var i=0;i<DATA_CENTER.global_variable.selected_floor_set.length;++i)
				{
					var floor = DATA_CENTER.global_variable.selected_floor_set[i]

					var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
					for (var j=0;j<floor_HVACattr_set.length;++j)
					{
						var cur_attr = floor_HVACattr_set[j];
						var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
						if (selected_attr_set.indexOf(cur_attr) >= 0)
						{
							var cur_linechart = floor + "_" + cur_attr;//形如F_2_VAV_SYS SUPPLY
							console.log(cur_linechart)
							rendered_linechartbtn_set.push(cur_linechart)
						}
						
					}
				}

				for (var i=0;i<DATA_CENTER.global_variable.selected_building_set.length;++i)
				{
					var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
					for (var j=0;j<building_HVACattr_set.length;++j)
					{
						var cur_attr = building_HVACattr_set[j];
						var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
						if (selected_attr_set.indexOf(cur_attr) >= 0)
						{
							var cur_linechart = cur_attr;
							console.log(cur_linechart)
							rendered_linechartbtn_set.push(cur_linechart)
						}
						
					}
				}

				this.rendered_linechartbtn_set = rendered_linechartbtn_set;
				
				this.render("linechart-line-btn")
			}
			else
			{

			}
			


		}
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")        

	    this.draw_linechart_panel(divID,this.rendered_linechartbtn_set)
	},
	draw_linechart_panel:function(divID,linechart_list)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var div = document.getElementById(divID)

	    var rect_width = width/linechart_list.length;
	    var rect_height = height;

	    //style=height:<%=height%>px
		var buttonhtml = 	'<span class="HVAClinechartbtn-span" id=<%=ID%> value=<%=buttonValue%>  >'+
		    					'<div style="position:relative">'+
		    						//'<i class="fa fa-times delete_icon hidden" groupid=<%=buttonValue%>></i>'+
		    						'<span class="object_title_span" value=<%=buttonValue%> > <%=buttonLabel%></span>'+
		    					'</div>'+
		    				'</span>'; 

		var compiled = _.template(buttonhtml);

		for (var i=0;i<linechart_list.length;++i)
		{
			var buttonLabel = linechart_list[i].substring(0,rect_width/9);
			var buttonValue = linechart_list[i];

			div.innerHTML = div.innerHTML + compiled({
				buttonLabel: buttonLabel,
				ID: 'HVAClinechartbtn-span-' + i,
				buttonValue: buttonValue,
				height:rect_height,
			});
		}

		d3.selectAll(".HVAClinechartbtn-span")
			.data(linechart_list)
			.on("click",function(d,i){
				var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
				var index = selected_linechart_set.indexOf(d);

				if (index >=0 )
				{
					d3.select(this).classed("selected-HVAClinechartbtn-span",false);
					selected_linechart_set.splice(index,1);
					DATA_CENTER.set_global_variable("selected_linechart_set",selected_linechart_set);
				}
				else
				{
					d3.select(this).classed("selected-HVAClinechartbtn-span",true);			
					DATA_CENTER.set_global_variable("selected_linechart_set",selected_linechart_set.concat(d));
				}
				
			})
			
			.on("mouseover",function(d,i){
				
			})
			.on("mouseout",function(d,i){
				
			})

	},
}