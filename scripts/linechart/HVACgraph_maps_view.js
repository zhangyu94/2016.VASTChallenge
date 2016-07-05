var HVACgraph_maps_view = {
	FIRST_CALLED : true,
	HAZIUM_ATTR_NAME : "Hazium Concentration",//记录hazium的那个属性的名字
	
	obsUpdate:function(message, data)
	{
		if (	(message == "set:highlight_HVACzone_set")  || 
				(message == "set:highlight_floor_set")  ||
				(message == "set:highlight_building_set")  )
        {
            d3.selectAll(".HVACmap-circle")
        		.classed("mouseover_selected-HVACmap-circle",function(d,i){      			
        			var flag = (DATA_CENTER.linechart_variable.highlight_HVACzone_set.indexOf(d.name) >= 0);
        			return flag;
        		})

        	d3.selectAll(".HVACmap-rect")
        		.classed("mouseover_selected-HVACmap-rect",function(d,i){      			
        			var flag = false;
        			flag = flag | (DATA_CENTER.linechart_variable.highlight_floor_set.indexOf(d.name) >= 0);
        			flag = flag | (DATA_CENTER.linechart_variable.highlight_building_set.indexOf(d.name) >= 0);
        			return flag;
        		})
        }

        if (message == "set:current_display_time")
        {
        	
        	var timestamp = DATA_CENTER.global_variable.current_display_time;
        	if (typeof(timestamp)!="undefined")
        	{
        		/*
        		var node = d3.selectAll(".HVACmap-circle")
        			.each(function(d,i){

        				console.log($(this))
        				var height = $(this).height();
						var left = $(this).offset().left;
						var top = $(this).offset().top-height;
        				HVACgraph_maps_view._render_radarchart_glyph(d.name,d.type,left,top,timestamp)
        			})
*/
        	}
			

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

		this.FIRST_CALLED = false;


		var div = d3.select("#"+divID);
		div.selectAll("*").remove()

	    var div_width  = $("#"+divID).width();
	    var div_height  = $("#"+divID).height();

	    

	    var all_dir_padding = div_width*0.02;
	    //1.渲染building的div

		var building_div_all_width = div_width*0.1;
		var building_div_content_width = building_div_all_width - 2*all_dir_padding;
		var building_div_content_height = div_height - 2*all_dir_padding;
		var building_div_left_padding = div_width - building_div_all_width + all_dir_padding ;

		var building_div = div.append("div").attr("id","building_map_div").style("position","absolute")
	    					.style("top",all_dir_padding + 'px')
	    					.style("height",building_div_content_height + 'px')
	    					.style("left",building_div_left_padding + 'px')
	    					.style("width",building_div_content_width + 'px')	    					
	    var building_div_svg = building_div.append("svg").attr("id","mapgraph_building_div_svg")
				                .attr("height",building_div_content_height)
				                .attr("width",building_div_content_width)
		var building_div_g = building_div_svg.append("g")
		var building_rect = building_div_g.append("rect")
			.datum({name:"building"})
			.attr("class","HVACmap-rect building-HVACmap-rect")
			.attr("height",building_div_content_height)
			.attr("width",building_div_content_width)	             
			//.attr("fill","blue").attr("opacity",0.2)
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
		var building_text = building_div_g.append("text")
							.attr("dx", "0.2em").attr("dy", "1.2em")//.style("text-anchor", "middle")
						    .text("B");


		//2. 渲染floor的div
		var floor_div_all_width = div_width*0.1;
		var floor_div_content_width = floor_div_all_width - 2*all_dir_padding;
		var floor_div_content_height = (div_height - 4*all_dir_padding)/3;
		var floor_div_left_padding = div_width - building_div_all_width - floor_div_all_width + 2*all_dir_padding;

		var floor_span = div.selectAll("span")
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
						return all_dir_padding + 'px'
					}			
					else if (d.name =="F_2")
					{
						return (all_dir_padding+floor_div_content_height+all_dir_padding) + 'px'
					}
					else if (d.name =="F_1")
					{
						return (all_dir_padding+floor_div_content_height+all_dir_padding+floor_div_content_height+all_dir_padding) + 'px'
					}

				})
				.style("height",floor_div_content_height + 'px')
		    	.style("left",floor_div_left_padding + 'px')
		    	.style("width",floor_div_content_width + 'px')
		var floor_span_svg = floor_span.append("svg")
		    	.attr("id",function(d,i){
		    		return "mapgraph_"+d.name+"_div_svg";
		    	})
		    	.attr("height",floor_div_content_height)
				.attr("width",floor_div_content_width)
		var floor_span_g = floor_span_svg.append("g")
		var floor_rect = floor_span_g.append("rect")
				.attr("class","HVACmap-rect floor-HVACmap-rect")
				.attr("height",floor_div_content_height)
				.attr("width",floor_div_content_width)	
				//.attr("fill",function(d,i){
				//	if (i == 0)
				//		return "brown";
				//	else if (i == 1)
				//		return "orange";
				//	else if (i == 2)
				//		return "yellow";
				//}).attr("opacity",0.2)
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
		var floor_text = floor_span_g.append("text")
							.attr("dx", "0em").attr("dy", "1.2em")//.style("text-anchor", "middle")
						    .text(function(d,i){
						    	return linechart_render_view._compress_string(d.name);
						    });


	    //3.渲染floor的map
	    //var left_padding = (div_width-building_div_all_width-floor_div_all_width)*0.05;
	    var width = div_width-building_div_all_width-floor_div_all_width;
	    var content_width = width - 2*all_dir_padding;
	    var top_padding = all_dir_padding;
	    var height = (div_height - 4*all_dir_padding)/3;

	    var F3_map_graph_div = div.append("div")
	    					.attr("id","F3_map_graph_div")
	    					.style("top",all_dir_padding + 'px')
	    					.style("height",height + 'px')
	    					.style("left",all_dir_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F2_map_graph_div = div.append("div")
	    					.attr("id","F2_map_graph_div")
	    					.style("top",(all_dir_padding+height+all_dir_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",all_dir_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F1_map_graph_div = div.append("div")
	    					.attr("id","F1_map_graph_div")
	    					.style("top",(all_dir_padding+height+all_dir_padding+height+all_dir_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",all_dir_padding + 'px')
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

		  	var node = floor_svg.selectAll(".HVACmap-circle")
					    .data(graph.nodes)
					    .enter()
					    .append("g")
					    .attr("transform",function(d){
					    	return "translate(" + x_scale(d.x) + "," + y_scale(d.y) + ")";
					    })

			var circle = node.append("circle")
						    .attr("class", function(d,i)
						    {
						    	if ( DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.indexOf(d.name) >=0 )
						    	{
						    		return "HVACmap-circle hazium-HVACmap-circle";
						    	}
						    	else
						    	{
						    		return "HVACmap-circle ordinary-HVACmap-circle";
						    	}
						    		
						    })
					      	.attr("r", 5.5)
					      	.on("mouseover",function(d,i){

					      		_highlight_communication(d,i);
					      		function _highlight_communication(d,i)
					      		{
					      			//1. 高亮地点
					      			var highlight_place_set = [d.name];
									DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",highlight_place_set);


									//2. 高亮属性
					    			var highlight_attr_set = [];
					    			var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
					    			for (var j=0;j<HVACzone_HVACattr_set.length;++j)
					    			{
					    				var cur_HVACattr = HVACzone_HVACattr_set[j];
					    				if (cur_HVACattr != HVACgraph_maps_view.HAZIUM_ATTR_NAME)
					    				{
					    					highlight_attr_set.push(cur_HVACattr)
					    				}
					    				else if (DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.indexOf(d.name)>=0)
					    				{
					    					highlight_attr_set.push(cur_HVACattr);
					    				}
					    			}
									DATA_CENTER.set_linechart_variable("highlight_attr_set",highlight_attr_set);


									//3. 高亮linechart
									var highlight_linechart_set = linechart_linebtn_view._cal_attrbtnset(HVACzone_HVACattr_set,[d.name],[],[])
									DATA_CENTER.set_linechart_variable("highlight_linechart_set",highlight_linechart_set);
					      		}

					      		tip.show(d,i)
					      	})
					      	.on("mouseout",function(d,i){

					      		_highlight_communication(d,i);
					      		function _highlight_communication(d,i)
					      		{
					      			//1. 取消高亮地点
						      		DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",[]);

						      		//2. 取消高亮属性
						      		DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);

						      		//3. 取消高亮linechart
						      		DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);
						      	}
							
					      		tip.hide(d,i)
					      	})
					      	.on("click",function(d,i){
					      		//d.name是一个地点
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

			var text = node.append("text")
				      	.attr("dy", "1.2em")
					    .style("text-anchor", "middle")
					    .text(function(d) {
					    	var name = HVACgraph_maps_view._HVACzone_name_to_abbreviation(d.name);
					    	return name; 
					    });

    	}

	},

	_HVACzone_name_to_abbreviation:function(HVACzone_name)
	{
		var compressed_name = linechart_render_view._compress_string(HVACzone_name);
		var index = compressed_name.indexOf("Z");
		var number = compressed_name.substring(index+1,compressed_name.length);
		return number;
	},


	_render_radarchart_glyph:function(place_name,place_type,center_x,center_y,raw_timestamp)
	{
		function _cal_dataset(place_name,place_type)
		{
			var detail_attr_set = [];
			var general_attr_set;
			if (place_type == "HVAC_zone")
			{
				general_attr_set = HVACgraph_attrbtn_view._cal_attrbtnset([place_name],[],[]);
				detail_attr_set = linechart_linebtn_view._cal_attrbtnset(general_attr_set,[place_name],[],[]);
			}
			else if (place_type == "floor")
			{
				general_attr_set = HVACgraph_attrbtn_view._cal_attrbtnset([],[place_name],[]);
				detail_attr_set = linechart_linebtn_view._cal_attrbtnset(general_attr_set,[],[place_name],[]);
			}
			else if (place_type == "building")
			{
				general_attr_set = HVACgraph_attrbtn_view._cal_attrbtnset([],[],[place_name]);
				detail_attr_set = linechart_linebtn_view._cal_attrbtnset(general_attr_set,[],[],[place_name]);
			}

			var frame_full_data = HVACgraph_maps_view._binary_search("bldg-MC2.csv","Date/Time",raw_timestamp);
			
			var frame_needed_data = [];
			for (var i=0;i<detail_attr_set.length;++i)
			{
				var cur_attr = detail_attr_set[i];
				var value = frame_full_data[cur_attr];
				frame_needed_data.push({
					name:cur_attr,
					value:value,
				})
			}

			return frame_needed_data;
		}
		var dataset = _cal_dataset(place_name,place_type);

		console.log(dataset);

		function _render_radarchart(data,center_x,center_y)
		{
			var width = 50;
			var height = 50;
			var radius = Math.min(width, height) / 2;
			var innerRadius = 0;

			var pie = d3.layout.pie()
			    .sort(null)
			    .value(function(d) { return d.width; });

			var arc = d3.svg.arc()
			  	.innerRadius(innerRadius)
			  	.outerRadius(function (d) { 
			  		var value = 0;
			  		if (typeof(d.data.value)!= "undefined")
			  			value = d.data.value;
			    	return (radius - innerRadius) * (d.data.value / 100000.0) + innerRadius; 
			  	});

			var outlineArc = d3.svg.arc()
			        .innerRadius(innerRadius)
			        .outerRadius(radius);

			var div_of_radarchart_glyph = d3.select("body")//放在body上append使得他能显示出来
					.append("div")
						.attr("class","radarchart_glyph-div")
						.style("position","absolute")
						.style("top",center_y-height/2 + 'px')
				    	.style("left",center_x-width/2 + 'px');

			var svg = div_of_radarchart_glyph.append("svg")
			    .attr("width", width)
			    .attr("height", height)
			    .append("g")
			    //.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


			console.log(svg);
			/*	
			var path = svg.selectAll(".solidArc")
			      	.data(pie(data))
			    .enter().append("path")
			      	.attr("fill", function(d) { return "blue"; })
			      	.attr("class", "solidArc")
			      	.attr("stroke", "gray")
			      	.attr("d", arc)

		  	var outerPath = svg.selectAll(".outlineArc")
		      		.data(pie(data))
		    	.enter().append("path")
			      	.attr("fill", "none")
			      	.attr("stroke", "gray")
			      	.attr("class", "outlineArc")
			      	.attr("d", outlineArc);  
			      	*/
			

		}
		_render_radarchart(dataset,center_x,center_y);



	},


	//二分查找，返回小于等于键值target_value的最大的键值对应的数据
	//HVACgraph_maps_view._binary_search("bldg-MC2.csv","Date/Time",1465845339000)
	_binary_search:function(filename,sorted_attr,target_value)
	{
		if (sorted_attr != "Date/Time")
			console.warn("invalid sorted_attr",sorted_attr);
		var data = DATA_CENTER.original_data[filename];

		var start_index = 0;
		var end_index = data.length - 1;
		while (start_index != end_index)
		{
			var middle_index = Math.floor((start_index + end_index)/2);
			var middle_value = data[middle_index][sorted_attr];

			var middle_value = new Date(middle_value);
            var middle_value = middle_value.getTime();

			if (middle_value < target_value)
			{
				start_index = middle_index+1;
			}
			if (middle_value >= target_value)
			{
				end_index = middle_index;
			}

			if (start_index == end_index)
			{
				break;
			}
		}
		
		//var result_value = data[start_index][sorted_attr];
		//var result_value = new Date(result_value);
		//var result_value = result_value.getTime();
		return data[start_index];
	}

}