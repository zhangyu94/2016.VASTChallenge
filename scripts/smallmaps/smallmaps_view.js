var smallmaps_view = {
	FIRST_CALLED : true,
	smallmaps_view_DIV_ID : "smallmaps-renderplace",

	HVAC_ZONE_DOT_RADIUS :6,
	RADARCHART_GLYPH_RADIUS :25,

	DIV_CLASS_OF_RADARCHART_GLYPH:"smallmaps-radarchart_glyph-div",
	
	obsUpdate:function(message, data)
	{
		if (message == "display:smallmaps_view")
		{
			$("#"+this.smallmaps_view_DIV_ID).css("display","block");
			DATA_CENTER.VIEW_COLLECTION.smallmaps_view._display_radarchart(this.DIV_CLASS_OF_RADARCHART_GLYPH)
			if (this.FIRST_CALLED)
			{
				this.render(this.smallmaps_view_DIV_ID);
				this.FIRST_CALLED = false;
			}
		}

		if (message == "hide:smallmaps_view")
		{
			$("#"+this.smallmaps_view_DIV_ID).css("display","none");
			DATA_CENTER.VIEW_COLLECTION.smallmaps_view._hide_radarchart(this.DIV_CLASS_OF_RADARCHART_GLYPH)
		}



		if (	(message == "set:highlight_HVACzone_set")  || 
				(message == "set:highlight_floor_set")  ||
				(message == "set:highlight_building_set")  )
        {
        	var highlight_HVACzone_set = DATA_CENTER.linechart_variable.highlight_HVACzone_set;
        	var highlight_floor_set = DATA_CENTER.linechart_variable.highlight_floor_set;
        	var highlight_building_set = DATA_CENTER.linechart_variable.highlight_building_set;
            if ( (highlight_HVACzone_set.length >=1) || (highlight_floor_set.length >=1) || (highlight_building_set.length >=1) )
            {
	            d3.selectAll(".smallmaps-HVACzone-circle")
	        		.classed("mouseover_hided-smallmaps-HVACzone-circle",function(d,i){      			
	        			var flag = (DATA_CENTER.linechart_variable.highlight_HVACzone_set.indexOf(d.name) >= 0);
	        			return !flag;
	        		})
	        	d3.selectAll(".smallmaps-rect")
	        		.classed("mouseover_hided-smallmaps-rect",function(d,i){      			
	        			var flag = false;
	        			flag = flag | (DATA_CENTER.linechart_variable.highlight_floor_set.indexOf(d.name) >= 0);
	        			flag = flag | (DATA_CENTER.linechart_variable.highlight_building_set.indexOf(d.name) >= 0);
	        			return !flag;
	        		})
        	}
        	else
        	{
        		d3.selectAll(".smallmaps-HVACzone-circle")
	        		.classed("mouseover_hided-smallmaps-HVACzone-circle",false);
	        	d3.selectAll(".smallmaps-rect")
	        		.classed("mouseover_hided-smallmaps-rect",false);
        	}
        }

        if (message == "set:current_display_time")
        {	
        	var timestamp = DATA_CENTER.global_variable.current_display_time;

			var node = d3.selectAll(".smallmaps-HVACzone-circle")
        		.each(function(d,i){
        			var is_selected = d3.select(this).classed("click_selected-smallmaps-HVACzone-circle")
        			var left = $(this).offset().left+smallmaps_view.HVAC_ZONE_DOT_RADIUS;
					var top = $(this).offset().top+smallmaps_view.HVAC_ZONE_DOT_RADIUS;
        			smallmaps_view._render_radarchart_glyph(d.name,d.type,left,top,timestamp,is_selected)
        		})
			
        }

	},
	render:function(divID)
	{
		//引用的全局变量
		//F3_HVAC_GRAPH.js
		//F2_HVAC_GRAPH.js
		//F1_HVAC_GRAPH.js
		//全局变量结束

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
		var building_div_left_padding = all_dir_padding ;

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
			.attr("class","smallmaps-rect building-smallmaps-rect")
			.attr("height",building_div_content_height)
			.attr("width",building_div_content_width)	         
			.on("click",function(d,i){
				DATA_CENTER.VIEW_COLLECTION.smallmaps_view._small_maps_buildingrect_click(d,this);
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
		var floor_div_left_padding = building_div_all_width;

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
						return all_dir_padding + 'px'
					else if (d.name =="F_2")
						return (all_dir_padding+floor_div_content_height+all_dir_padding) + 'px'
					else if (d.name =="F_1")
						return (all_dir_padding+floor_div_content_height+all_dir_padding+floor_div_content_height+all_dir_padding) + 'px'
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
				.attr("class","smallmaps-rect floor-smallmaps-rect")
				.attr("height",floor_div_content_height)
				.attr("width",floor_div_content_width)	
				.on("click",function(d,i){
					DATA_CENTER.VIEW_COLLECTION.smallmaps_view._small_maps_floorrect_click(d,this);
				})     
				.on("mouseover",function(d,i){

					_highlight_communication(d);
				    function _highlight_communication(d)
				    {
				      	var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
						var linechartbtn_set = linechart_linebtn_view._cal_attrbtnset(floor_HVACattr_set,[],[d.name],[])
				      	DATA_CENTER.set_linechart_variable("highlight_floor_set",[d.name]);
						DATA_CENTER.set_linechart_variable("highlight_attr_set",floor_HVACattr_set);
						DATA_CENTER.set_linechart_variable("highlight_linechart_set",linechartbtn_set);
				    }

				})
				.on("mouseout",function(d,i){

					_highlight_communication();
				    function _highlight_communication()
				    {
				      	DATA_CENTER.set_linechart_variable("highlight_floor_set",[]);
						DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);
						DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);
				    }

				})
				.each(function(d,i){
					var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
					var index = selected_floor_set.indexOf(d.name);
					if (index >=0 )
						$(this).click();
				})

		var floor_text = floor_span_g.append("text")
							.attr("dx", "0em").attr("dy", "1.2em")//.style("text-anchor", "middle")
						    .text(function(d,i){
						    	return linechart_render_view._compress_string(d.name);
						    });


	    //3.渲染floor的map
	    var width = div_width-building_div_all_width-floor_div_all_width;
	    var content_width = width - 2*all_dir_padding;
	    var top_padding = all_dir_padding;
	    var height = (div_height - 4*all_dir_padding)/3;
	    var left_padding = building_div_all_width + floor_div_all_width - all_dir_padding;

	    var F3_map_graph_div = div.append("div")
	    					.attr("id","F3_map_graph_div")
	    					.style("top",all_dir_padding + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F2_map_graph_div = div.append("div")
	    					.attr("id","F2_map_graph_div")
	    					.style("top",(all_dir_padding+height+all_dir_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F1_map_graph_div = div.append("div")
	    					.attr("id","F1_map_graph_div")
	    					.style("top",(all_dir_padding+height+all_dir_padding+height+all_dir_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    render_mapgraph("F3_map_graph_div",F3_HVAC_GRAPH,3)
	    render_mapgraph("F2_map_graph_div",F2_HVAC_GRAPH,2)
	    render_mapgraph("F1_map_graph_div",F1_HVAC_GRAPH,1)

	    function render_mapgraph(divID,graph,floor_num)
	    {
	    	var div = d3.select("#"+divID);
			div.selectAll("*").remove()

		    var width  = $("#"+divID).width();
		    var height  = $("#"+divID).height();

		    var background_div_id = "smallmaps-mapgraph-background_div-F_"+floor_num;
		    var background_div = div.append("div")
		    	.attr("class","smallmaps-mapgraph-background_div")
		    	.attr("id",background_div_id)
		    	.style("width",width+"px")
		    	.style("height",height+"px")
		    	.style("position","absolute")

		    var graph_div_id = "smallmaps-mapgraph-graph_div-F_"+floor_num;
		    var graph_div = div.append("div")
		    	.attr("class","smallmaps-mapgraph-graph_div")
		    	.attr("id",graph_div_id)
		    	.style("width",width+"px")
		    	.style("height",height+"px")
		    	.style("position","absolute")
		    	.style("pointer-events","none")

		    DATA_CENTER.VIEW_COLLECTION.bigmap_view.render(background_div_id,floor_num,false)

		    _render_graph(graph_div_id,graph)
		    function _render_graph(divID,graph)
		    {
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
			      		.style("stroke", function(d) { return "#AAAAAA"; })
			      		.style("pointer-events","auto")

			  	var node = floor_svg.selectAll(".smallmaps-HVACzone-circle")
						.data(graph.nodes)
					.enter().append("g")
						.attr("transform",function(d){
						   	return "translate(" + x_scale(d.x) + "," + y_scale(d.y) + ")";
						})
						.style("pointer-events","auto")

				var circle = node.append("circle")
					.attr("class", function(d,i){
						if ( DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.indexOf(d.name) >=0 )
							return "smallmaps-HVACzone-circle hazium-smallmaps-HVACzone-circle";
						else
							return "smallmaps-HVACzone-circle ordinary-smallmaps-HVACzone-circle";
					})
					.attr("r", smallmaps_view.HVAC_ZONE_DOT_RADIUS)
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
								if (cur_HVACattr != DATA_CENTER.GLOBAL_STATIC.HAZIUM_ATTR_NAME)
									highlight_attr_set.push(cur_HVACattr);
								else if (DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.indexOf(d.name)>=0)
									highlight_attr_set.push(cur_HVACattr);
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
						DATA_CENTER.VIEW_COLLECTION.smallmaps_view._small_maps_circle_click(d,this);
					})

				var text = node.append("text")
					.attr("dy", "1.2em")
					.style("text-anchor", "middle")
					.text(function(d) {
						var name = smallmaps_view._HVACzone_name_to_abbreviation(d.name);
						return name; 
					});
			
		    }

    	}

	},

	_small_maps_buildingrect_click:function(d,this_ele){
		var selected_building_set = DATA_CENTER.global_variable.selected_building_set;
		var index = selected_building_set.indexOf(d.name);
		if (index >=0 )
		{
			var new_color = d3.rgb(d3.select(this_ele).style("fill")).brighter(2);
			d3.select(this_ele).style("fill",new_color)
			d3.select(this_ele).classed("click_selected-smallmaps-rect",false);
			selected_building_set.splice(index,1);
			DATA_CENTER.set_global_variable("selected_building_set",selected_building_set);
		}
		else
		{
			var new_color = d3.rgb(d3.select(this_ele).style("fill")).darker(2);
			d3.select(this_ele).style("fill",new_color)
			d3.select(this_ele).classed("click_selected-smallmaps-rect",true);			
					DATA_CENTER.set_global_variable("selected_building_set",selected_building_set.concat(d.name));
				var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
			var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
					var selected_building_set = DATA_CENTER.global_variable.selected_building_set;
				var selected_linechart_set = DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
				._cal_attrbtnset(selected_attr_set,selected_HVACzone_set,selected_floor_set,selected_building_set);
			DATA_CENTER.set_global_variable("selected_linechart_set",selected_linechart_set);
		}
		DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view._update_selected_linechart();
	},

	_small_maps_floorrect_click:function(d,this_ele){
		var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
		var index = selected_floor_set.indexOf(d.name);
		if (index >=0 )
		{
			var new_color = d3.rgb(d3.select(this_ele).style("fill")).brighter(2);
			d3.select(this_ele).style("fill",new_color)
			d3.select(this_ele).classed("click_selected-smallmaps-rect",false);
			selected_floor_set.splice(index,1);
			DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set);
		}
		else
		{
			var new_color = d3.rgb(d3.select(this_ele).style("fill")).darker(2);
			d3.select(this_ele).style("fill",new_color)
			d3.select(this_ele).classed("click_selected-smallmaps-rect",true);
			DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set.concat(d.name));
		}
		DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view._update_selected_linechart();	
	},

	_small_maps_circle_click:function(d,this_ele){
		//d.name是一个地点
		var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
		var index = selected_HVACzone_set.indexOf(d.name);
					
		if (index >=0 )
		{
			var new_color = d3.rgb(d3.select(this_ele).style("fill")).brighter(2);
			d3.select(this_ele).style("fill",new_color)
			d3.select(this_ele).classed("click_selected-smallmaps-HVACzone-circle",false);
			selected_HVACzone_set.splice(index,1);
			DATA_CENTER.set_global_variable("selected_HVACzone_set",selected_HVACzone_set);
		}
		else
		{
			var new_color = d3.rgb(d3.select(this_ele).style("fill")).darker(2);
			d3.select(this_ele).style("fill",new_color)
			d3.select(this_ele).classed("click_selected-smallmaps-HVACzone-circle",true);
			DATA_CENTER.set_global_variable("selected_HVACzone_set",selected_HVACzone_set.concat(d.name));
		}
		DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view._update_selected_linechart();
	},

	_HVACzone_name_to_abbreviation:function(HVACzone_name)
	{
		var compressed_name = linechart_render_view._compress_string(HVACzone_name);
		var index = compressed_name.indexOf("Z");
		var number = compressed_name.substring(index+1,compressed_name.length);
		return number;
	},


	_render_radarchart_glyph:function(place_name,place_type,center_x,center_y,raw_timestamp,is_selected)
	{
		var dataset = [];
		if (is_selected && (typeof(raw_timestamp)!="undefined") )
		{
			dataset = _cal_dataset(place_name,place_type,raw_timestamp);
			function _cal_dataset(place_name,place_type,raw_timestamp)
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

				var frame_full_data = smallmaps_view._binary_search("bldg-MC2.csv","Date/Time",raw_timestamp);
				
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
		}
		
		smallmaps_view._render_radarchart(dataset,place_name,raw_timestamp,smallmaps_view.DIV_CLASS_OF_RADARCHART_GLYPH,center_x,center_y,
			DATA_CENTER.VIEW_COLLECTION.smallmaps_view.RADARCHART_GLYPH_RADIUS,smallmaps_view.HVAC_ZONE_DOT_RADIUS);
	},

	//data的数据格式是一个数组，数组中每个元素的样子是{name:...,value:...}
	_render_radarchart:function(data,glyph_name,raw_timestamp,class_label,center_x,center_y,radius,innerRadius)
	{
		var width = 4.5*radius;
		var height = 4.5*radius;
		var degree = 360/data.length;

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return degree; });
		var arc = d3.svg.arc()
			.innerRadius(innerRadius)
			.outerRadius(function (d) { 
				
			  	var normalized_value = 0;
			  	if (typeof(d.data.value)!= "undefined")
			  		normalized_value = Math.abs(HVAC_STATISTIC_UTIL.normalize(d.data.name,d.data.value));
			  		
			  	//var normalized_value = DATA_CENTER.VIEW_COLLECTION.HVACmonitor_view.abnormal_degree(raw_timestamp,d.data.name,d.data.value)
			  	
			  	var rate = normalized_value / HVACmonitor_view.ABNORMAL_VALUE_THRESHOLD;
			  	if (rate > width / (2*radius))//避免扇形爆出svg范围
			  		rate = width / (2*radius)
			  	return (radius - innerRadius) * rate + innerRadius;
			});
		var outlineArc = d3.svg.arc()
			    .innerRadius(innerRadius)
			    .outerRadius(radius);

		//1. 先完成div的处理模板
		var update_div = d3.select("body")//放在body上append使得他能显示出来
					.selectAll("#"+class_label+"-"+glyph_name)
					.data([glyph_name])
		var enter_div = update_div.enter();		
		var exit_div = update_div.exit();				
		//1) div的update部分
		update_div
			.style("top",center_y-height/2 + 'px')
			.style("left",center_x-width/2 + 'px')
			.style("width",width + 'px')
			.style("height",height + 'px')
		//2) div的enter部分
		enter_div = enter_div.append("div")
				.attr("id",class_label+"-"+glyph_name)
				.attr("class",class_label)
				.style("position","absolute")
				.style("top",center_y-height/2 + 'px')
				.style("left",center_x-width/2 + 'px')
				.style("width",width + 'px')
				.style("height",height + 'px')
				.style("pointer-events","none")
		//3) div的exit部分
		exit_div.remove()

		//2. 再完成update的div中的所有内层path和外层path的处理模板
		var update_div_g = update_div
			.select("svg")
			.select("g")
		//a. update的内层path的处理模板
		var update_div_g_updatepath = update_div_g.selectAll(".solidArc")
		      	.data(pie(data))
		var update_div_g_enterpath = update_div_g_updatepath.enter();
		var update_div_g_exitpath = update_div_g_updatepath.exit();
		//a.1) update的内层path的update部分
		update_div_g_updatepath
			.transition()
				.attr("fill", function(d) { 
		      		var normalized_value = 0.;
			  		if (typeof(d.data.value)!= "undefined")
			  			normalized_value = Math.abs(HVAC_STATISTIC_UTIL.normalize(d.data.name,d.data.value));
		      		return  smallmaps_view._map_normalized_value_to_color(normalized_value)
		      	})
			   	.attr("d", arc)
			   	.each(function(d,i){
			   		smallmaps_view._bind_warning_tip(d,this,raw_timestamp);
			    })
		//a.2) update的内层path的enter部分      	
		update_div_g_enterpath
			.append("path")
				.attr("fill", function(d) { 
		      		var normalized_value = 0.;
			  		if (typeof(d.data.value)!= "undefined")
			  			normalized_value = Math.abs(HVAC_STATISTIC_UTIL.normalize(d.data.name,d.data.value));
		      		return  smallmaps_view._map_normalized_value_to_color(normalized_value)
		      	})
		      	.attr("class", "solidArc")
		      	.attr("stroke", "gray")
		      	.attr("stroke-width",0.5)
		      	.attr("d", arc)
		      	.style("pointer-events","auto")
		      	.attr("opacity", function(d,i){
		      		return 1;
		      	})
				.on("mouseover",function(d,i){		
					$(this).tipsy()
	                DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
	                	._highlight_communication_mouseover_linebtn(d.data.name);
	            })
	            .on("mouseout",function(d,i){
	                DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
	                    ._highlight_communication_mouseout_linebtn();
	            })
		      	.each(function(d,i){
		      		smallmaps_view._bind_warning_tip(d,this,raw_timestamp);
		      	})
		//a.3) update的内层path的exit部分          	
		update_div_g_exitpath.remove()
			
		//3. 再完成enter的div中的所有内层path和外层path的处理模板
		var enter_div_g = enter_div	
			.append("svg")
			    .attr("width", width)
			    .attr("height", height)
		    .append("g")
		    	.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
		//a. enter的内层path的处理模板(只需要考虑path的enter部分,因为div是新enter的,path不可能存在update和exit部分)	   
		var enter_div_g_enterpath = enter_div_g.selectAll(".solidArc")
		      	.data(pie(data))
		    .enter().append("path")
		      	.attr("fill", function(d) { 
		      		var normalized_value = 0.;
			  		if (typeof(d.data.value)!= "undefined")
			  			normalized_value = Math.abs(HVAC_STATISTIC_UTIL.normalize(d.data.name,d.data.value));
		      		return  smallmaps_view._map_normalized_value_to_color(normalized_value)
		      	})
		      	.attr("class", "solidArc")
		      	.attr("stroke", "gray")
		      	.attr("stroke-width",0.5)
		      	.attr("d", arc)
		      	.style("pointer-events","auto")
		      	.attr("opacity", function(d,i){
		      		return 1;
		      	})
				.on("mouseover",function(d,i){
                    DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
                        ._highlight_communication_mouseover_linebtn(d.data.name);
                })
                .on("mouseout",function(d,i){
                    DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
                        ._highlight_communication_mouseout_linebtn();
                })
		      	.each(function(d,i){
		      		$(this).tipsy({
						gravity: "s",
						html:true,
						title:function(){
						   	var d = this.__data__;

						   	var time=new Date(raw_timestamp)
						    var time_string = (time.getMonth()+1).toString() + "." + time.getDate().toString() + " " +
						    				time.getHours().toString() + ":" + time.getMinutes().toString() + ":" + time.getSeconds().toString();

							var signed_normalized_value = 0;
						  	if (typeof(d.data.value)!= "undefined")
						  		signed_normalized_value = HVAC_STATISTIC_UTIL.normalize(d.data.name,d.data.value);
						    var content = 	"<span>" + time_string  + "</span>"+ "</br>" +
						    				d.data.name + ": " + "<span style='color:red'>" + d.data.value  + "(" + signed_normalized_value.toFixed(1) + ")" + "</span>";
						    return content;
						},
					});
		      		smallmaps_view._bind_warning_tip(d,this,raw_timestamp);
		      	})
	},

	_bind_warning_tip:function(d,this_ele,raw_timestamp)
	{
		var that_d = d;

		var normalized_value = 0;
		if (typeof(d.data.value)!= "undefined")
	 		normalized_value = Math.abs(HVAC_STATISTIC_UTIL.normalize(d.data.name,d.data.value));
	 	
		if (normalized_value >= HVACmonitor_view.ABNORMAL_VALUE_THRESHOLD)
	 	{
	 		d3.select("body")
				.append("div")
					.style("z-index",4)
					.style("position","absolute")
					.style("left",function(){
						return $(this_ele).offset().left+"px";
					})
					.style("top",function(){
						return $(this_ele).offset().top+"px";
					})
					.style("display","inline-block")
					.style("border-radius","3px")
					.style("font-size","10px")
					.style("background","white")
					.style("border","solid 2px #111")
					.html(function(){
						//return "233"

						var time = new Date(raw_timestamp)
					    var time_string = (time.getMonth()+1).toString() + "." + time.getDate().toString() + " " +
					    				time.getHours().toString() + ":" + time.getMinutes().toString() + ":" + time.getSeconds().toString();

						var signed_normalized_value = 0;
					  	if (typeof(that_d.data.value)!= "undefined")
					  		signed_normalized_value = HVAC_STATISTIC_UTIL.normalize(that_d.data.name,that_d.data.value);
					    var content = 	"<span style='color:red'>" + time_string  + "</span>"+ "</br>" +
					    				"<span style='color:red'>" + that_d.data.name  + "</span>" + ": " + "<span>" + that_d.data.value  + "(" + signed_normalized_value.toFixed(1) + ")" + "</span>";
					    return content;
					})
					.each(function(){
						var that = this;
						
						setTimeout(function(){
							d3.select(that).remove()
						},5000)

					})
	 	}
			    
	 	
	},

	_hide_radarchart:function(class_label)
	{
		d3.selectAll("."+class_label).style("display","none")
	},

	_display_radarchart:function(class_label)
	{
		d3.selectAll("."+class_label).style("display","block")
	},

	_map_normalized_value_to_color:function(normalized_value)
	{
		var color_interpolator = d3.interpolateRgb("#00FF00","#FF0000");
		var raw_color = color_interpolator(normalized_value / HVACmonitor_view.ABNORMAL_VALUE_THRESHOLD);
		var return_color = d3.hsl(raw_color);
		return_color.l = 0.45;
		return return_color;
	},


	//二分查找，返回小于等于键值target_value的最大的键值对应的数据
	//smallmaps_view._binary_search("bldg-MC2.csv","Date/Time",1465845339000)
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
		
		return data[start_index];
	}

}