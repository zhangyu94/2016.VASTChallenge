var HVACgraph_maps_view = {
	obsUpdate:function(message, data)
	{
		if (	(message == "set:highlight_HCAVzone_set")  || 
				(message == "set:highlight_floor_set")  ||
				(message == "set:highlight_building_set")  )
        {
            


            
        }


	},
	render:function(divID)
	{
		//引用的全局变量
		//F3_HVAC_GRAPH.js
		//F2_HVAC_GRAPH.js
		//F1_HVAC_GRAPH.js
		//全局变量结束

		//定义静态变量
		var F1_HVAC_IMG_SRC = "img/VAST_EnergyZones_F1.jpg";
		var F2_HVAC_IMG_SRC = "img/VAST_EnergyZones_F2.jpg";
		var F3_HVAC_IMG_SRC = "img/VAST_EnergyZones_F3.jpg";
		//静态变量定义结束


		var div = d3.select("#"+divID);
		div.selectAll("*").remove()

	    var div_width  = $("#"+divID).width();
	    var div_height  = $("#"+divID).height();

	    

	    //1.渲染building的div
		var building_div_width = div_width*0.1;
		var building_div_height = div_height;
		var building_div_left_padding = div_width - building_div_width;
		var building_div = div.append("div").attr("id","building_map_div").style("position","absolute")
	    					.style("top",0 + 'px')
	    					.style("height",building_div_height + 'px')
	    					.style("left",building_div_left_padding + 'px')
	    					.style("width",building_div_width + 'px')
	    var building_div_svg = building_div.append("svg").attr("id","mapgraph_building_div_svg")
			                .attr("height",building_div_height)
			                .attr("width",building_div_width)
		var building_rect = building_div_svg.append("rect")
			.datum({name:"building"})
			.attr("height",building_div_height)
			.attr("width",building_div_width)	             
			.attr("fill","blue").attr("opacity",0.2)
			.on("click",function(d,i){
				var selected_building_set = DATA_CENTER.global_variable.selected_building_set;
				var index = selected_building_set.indexOf(d.name);
				if (index >=0 )
				{
					d3.select(this).classed("click_selected-HVACmap-rect",false);
					selected_building_set.splice(index,1);
					DATA_CENTER.set_global_variable("selected_building_set",selected_building_set);
				}
				else
				{
					d3.select(this).classed("click_selected-HVACmap-rect",true);			
					DATA_CENTER.set_global_variable("selected_building_set",selected_building_set.concat(d.name));
				}
			})
			.on("mouseover",function(d,i){

				_highlight_communication(d,i);
				function _highlight_communication(d,i)
				{
				    var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
					var linechartbtn_set = linechart_linebtn_view._cal_attrbtnset(building_HVACattr_set,[],[],[d.name])
				    DATA_CENTER.set_linechart_variable("highlight_building_set",[d.name]);
					DATA_CENTER.set_linechart_variable("highlight_attr_set",building_HVACattr_set);
					DATA_CENTER.set_linechart_variable("highlight_linechart_set",linechartbtn_set);
				}

			})
			.on("mouseout",function(d,i){

				_highlight_communication(d,i);
				function _highlight_communication(d,i)
				{
				    DATA_CENTER.set_linechart_variable("highlight_building_set",[]);
					DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);
					DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);
				}

			})



		//2. 渲染floor的div
		var floor_div_width = div_width*0.1;
		var floor_div_height = div_height/3;
		var floor_div_left_padding = div_width - building_div_width - floor_div_width;

		div.selectAll("span")
			.data([
				{name:"F_3"},
				{name:"F_2"},
				{name:"F_1"},
			])
			.enter()
			.append("span")
				.attr("id",function(d,i){
					return d.name+"_div";
				})
				.style("position","absolute")
				.style("top",function(d,i){
					if (d.name =="F_3")
					{
						return 0 + 'px'
					}			
					else if (d.name =="F_2")
					{
						return floor_div_height + 'px'
					}
					else if (d.name =="F_1")
					{
						return (floor_div_height+floor_div_height) + 'px'
					}

				})
				.style("height",floor_div_height + 'px')
		    	.style("left",floor_div_left_padding + 'px')
		    	.style("width",floor_div_width + 'px')
		    .append("svg")
		    	.attr("id",function(d,i){
		    		return "mapgraph_"+d.name+"_div_svg";
		    	})
		    	.attr("height",floor_div_height)
				.attr("width",floor_div_width)
			.append("rect")
				.attr("height",floor_div_height)
				.attr("width",floor_div_width)	 
				.attr("fill",function(d,i){
					if (i == 0)
						return "brown";
					else if (i == 1)
						return "orange";
					else if (i == 2)
						return "yellow";
				}).attr("opacity",0.2)
				.on("click",function(d,i){
					var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
					var index = selected_floor_set.indexOf(d.name);
					if (index >=0 )
					{
						d3.select(this).classed("click_selected-HVACmap-rect",false);
						selected_floor_set.splice(index,1);
						DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set);
					}
					else
					{
						d3.select(this).classed("click_selected-HVACmap-rect",true);
						DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set.concat(d.name));
					}
				})     
				.on("mouseover",function(d,i){

					_highlight_communication(d,i);
				    function _highlight_communication(d,i)
				    {
				      	var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
						var linechartbtn_set = linechart_linebtn_view._cal_attrbtnset(floor_HVACattr_set,[],[d.name],[])
				      	DATA_CENTER.set_linechart_variable("highlight_floor_set",[d.name]);
						DATA_CENTER.set_linechart_variable("highlight_attr_set",floor_HVACattr_set);
						DATA_CENTER.set_linechart_variable("highlight_linechart_set",linechartbtn_set);
				    }

				})
				.on("mouseout",function(d,i){

					_highlight_communication(d,i);
				    function _highlight_communication(d,i)
				    {
				      	DATA_CENTER.set_linechart_variable("highlight_floor_set",[]);
						DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);
						DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);
				    }

				})


	    //3.渲染floor的map
	    var left_padding = (div_width-building_div_width-floor_div_width)*0.05;
	    var width = (div_width-building_div_width-floor_div_width) - 2*left_padding;
	    var top_padding = div_width*0.05;
	    var height = (div_height - 4*top_padding)/3;

	    var F3_map_graph_div = div.append("div")
	    					.attr("id","F3_map_graph_div")
	    					.style("top",top_padding + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F2_map_graph_div = div.append("div")
	    					.attr("id","F2_map_graph_div")
	    					.style("top",(top_padding+height+top_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F1_map_graph_div = div.append("div")
	    					.attr("id","F1_map_graph_div")
	    					.style("top",(top_padding+height+top_padding+height+top_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    render_mapgraph("F3_map_graph_div",F3_HVAC_IMG_SRC,F3_HVAC_GRAPH)
	    render_mapgraph("F2_map_graph_div",F2_HVAC_IMG_SRC,F2_HVAC_GRAPH)
	    render_mapgraph("F1_map_graph_div",F1_HVAC_IMG_SRC,F1_HVAC_GRAPH)

	    function render_mapgraph(divID,img_src,graph)
	    {
	    	var div = d3.select("#"+divID);
			div.selectAll("*").remove()

		    var width  = $("#"+divID).width();
		    var height  = $("#"+divID).height();

		    var floor_svg = d3.select("#"+divID).append("svg")
	                .attr("class","mapgraph_floor_svg")
	                .attr("height",height)
	                .attr("width",width)

	        var tip = d3.tip()
			    .attr('class', 'd3-tip')
			    .attr('id', 'mapgraph-tip')
			    .offset([0,-10])
			    .html(function(d, i) {
			        return  "floor: " + "<span style='color:red'>" + d.floor + "</span>" + " " + 
			            	"name: " + "<span style='color:red'>" + d.name + "</span>" + " ";
			    });
			floor_svg.call(tip);

			//加上背景的map
	        floor_svg.append("image")
		     	.attr("x",0).attr("y",0)
		     	.attr("width",width)
		     	.attr("height",height)
		     	.attr("preserveAspectRatio","none")//强制不保持图片的原始比例
		     	.attr("xlink:href",img_src)
		     	.attr("opacity",0.3)

		    var x_scale = d3.scale.linear()
	    					.domain([HVAC_GRAPH_MIN_X,HVAC_GRAPH_MAX_X])
	    					.range([0,width]);
	    	var y_scale = d3.scale.linear()
	    					.domain([HVAC_GRAPH_MIN_X,HVAC_GRAPH_MAX_X])
	    					.range([0,height]);

	    	if (typeof(graph.links[0].source)=="number")
	    	{
	    		var nodes = graph.nodes;
			  	var links = graph.links;
			  	for (var i=0;i<links.length;++i)
			  	{
			    	links[i].source = nodes[links[i].source];
			    	links[i].target = nodes[links[i].target];
			  	}
	    	}
	    	
		  	var link = floor_svg.selectAll(".link")
		      .data(graph.links)
		    .enter().append("line")
		      .attr("class", "link")
		      .attr("x1", function(d) { return x_scale(d.source.x); })
		      .attr("y1", function(d) { return y_scale(d.source.y); })
		      .attr("x2", function(d) { return x_scale(d.target.x); })
		      .attr("y2", function(d) { return y_scale(d.target.y); })
		      .style("stroke-width", function(d) { return 1; })
		      .style("stroke", function(d) { return "#AAAAAA"; });

		  	var node = floor_svg.selectAll(".node")
					    .data(graph.nodes)
					    .enter().append("circle")
					    .attr("class", "node")
				      	.attr("r", 6)
				      	.attr("cx", function(d) { 
				      		return x_scale(d.x); 
				      	})
				      	.attr("cy", function(d) { return y_scale(d.y); })
				      	.attr("fill", function(d) { return "blue"; })
				      	.attr("opacity",0.5)
				      	.on("mouseover",function(d,i){

				      		_highlight_communication(d,i);
				      		function _highlight_communication(d,i)
				      		{
				      			var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
								var linechartbtn_set = linechart_linebtn_view._cal_attrbtnset(HVACzone_HVACattr_set,[d.name],[],[])
				      			DATA_CENTER.set_linechart_variable("highlight_HCAVzone_set",[d.name]);
								DATA_CENTER.set_linechart_variable("highlight_attr_set",HVACzone_HVACattr_set);
								DATA_CENTER.set_linechart_variable("highlight_linechart_set",linechartbtn_set);
				      		}

				      		tip.show(d,i)
				      	})
				      	.on("mouseout",function(d,i){

				      		_highlight_communication(d,i);
				      		function _highlight_communication(d,i)
				      		{
					      		DATA_CENTER.set_linechart_variable("highlight_HCAVzone_set",[]);
					      		DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);
					      		DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);
					      	}
						
				      		tip.hide(d,i)
				      	})
				      	.on("click",function(d,i){
				      		var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
							var index = selected_HVACzone_set.indexOf(d.name);
							
							if (index >=0 )
							{
								d3.select(this).classed("click_selected-HVACmap-circle",false);
								selected_HVACzone_set.splice(index,1);
								DATA_CENTER.set_global_variable("selected_HVACzone_set",selected_HVACzone_set);
							}
							else
							{
								d3.select(this).classed("click_selected-HVACmap-circle",true);
								DATA_CENTER.set_global_variable("selected_HVACzone_set",selected_HVACzone_set.concat(d.name));
							}
							
			      		})


    	}

	}

}