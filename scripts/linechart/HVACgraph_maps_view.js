var HVACgraph_maps_view = {
	obsUpdate:function(message, data)
	{

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

	    var building_svg = div.append("svg")
	    					.attr("class","mapgraph_building_svg")
			                .attr("height",div_height)
			                .attr("width",div_width)
		var building_rect = building_svg.append("rect")
			.datum([{name:"building"}])
			.attr("height",div_height)
			.attr("width",div_width)	             
			.attr("fill","blue")
			.attr("opacity",0.05)
			.on("click",function(d,i){

			})

	    var left_padding = div_width*0.05;
	    var width = div_width - 2*left_padding;
	    var top_padding = div_width*0.05;
	    var height = (div_height - 4*top_padding)/3;

	    var F3_map_div = div.append("div")
	    					.attr("id","F3_map_div")
	    					.style("top",top_padding + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F2_map_div = div.append("div")
	    					.attr("id","F2_map_div")
	    					.style("top",(top_padding+height+top_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F1_map_div = div.append("div")
	    					.attr("id","F1_map_div")
	    					.style("top",(top_padding+height+top_padding+height+top_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    render_mapgraph("F3_map_div",F3_HVAC_IMG_SRC,F3_HVAC_GRAPH)
	    render_mapgraph("F2_map_div",F2_HVAC_IMG_SRC,F2_HVAC_GRAPH)
	    render_mapgraph("F1_map_div",F1_HVAC_IMG_SRC,F1_HVAC_GRAPH)

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
		     	.attr("x",0)
		     	.attr("y",0)
		     	.attr("width",width)
		     	.attr("height",height)
		     	.attr("preserveAspectRatio","none")//强制不保持图片的原始比例
		     	.attr("xlink:href",img_src)
		     	.attr("opacity",0.3)
		     	.on("mouseover",function(d,i){
		     		//console.log("2333")
		     	})

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
					      .attr("r", 8)
					      .attr("cx", function(d) { 
					      	return x_scale(d.x); 
					      })
					      .attr("cy", function(d) { return y_scale(d.y); })
					      .style("fill", function(d) { return "blue"; })
					      .attr("opacity",0.5)
					      .on("mouseover",function(d,i){
					      	tip.show(d,i)
					      })
					      .on("mouseout",function(d,i){
					      	tip.hide(d,i)
					      })
					      .on("click",function(d,i){

					      });

	    }

	}

}