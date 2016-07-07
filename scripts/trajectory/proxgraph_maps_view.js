var proxgraph_maps_view = {
	FIRST_CALLED : true,
	proxgraph_maps_view_DIV_ID : "proxgraph-maps",

	obsUpdate:function(message, data)
	{
		if (message == "display:proxgraph_maps_view")
        {
            $("#"+this.proxgraph_maps_view_DIV_ID).css("display","block");
            if (this.FIRST_CALLED)
			{
            	this.render(this.proxgraph_maps_view_DIV_ID);
            	this.FIRST_CALLED = false;
            }
        }

        if (message == "hide:proxgraph_maps_view")
        {
            $("#"+this.proxgraph_maps_view_DIV_ID).css("display","none");
        }

	},
	render:function(divID)
	{
		var div = d3.select("#"+divID);
		div.selectAll("*").remove()
	    var div_width  = $("#"+divID).width();
	    var div_height  = $("#"+divID).height();
	
		var F1_PROX_IMG_SRC = "img/proximity_floor1_Fotor.jpg";
		var F2_PROX_IMG_SRC = "img/proximity_floor2_Fotor.jpg";
		var F3_PROX_IMG_SRC = "img/proximity_floor3_Fotor.jpg";
		//静态变量定义结束
	    
		// 渲染floor的div
		var floor_div_width = div_width*0.1;
		var floor_div_height = div_height/3;
		var floor_div_left_padding = div_width - floor_div_width;

		var F3_div = div.append("div").attr("id","pF3_div").style("position","absolute")
	    				.style("top",0 + 'px')
    					.style("height",floor_div_height + 'px')
    					.style("left",floor_div_left_padding + 'px')
    					.style("width",floor_div_width + 'px')
    	var F3_div_svg = F3_div.append("svg").attr("id","pmapgraph_F3_div_svg")
			                .attr("height",floor_div_height)
			                .attr("width",floor_div_width)
		var floor3_rect = F3_div_svg.append("rect")
			.datum({name:"F_3"})
			.attr("height",floor_div_height)
			.attr("width",floor_div_width)	             
			.attr("fill","brown").attr("opacity",0.2)
			.on("click",function(d,i){
				var current_floor = 3;
				var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
				var index = selected_floor_set.indexOf(d.name);
				DATA_CENTER.set_global_variable("selected_floor",current_floor);
				if (index >=0 )
				{
					d3.select(this).classed("selected_PROXmap_rect",false);
					selected_floor_set.splice(index,1);
					DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set);
				}
				else
				{
					d3.select(this).classed("selected_PROXmap_rect",true);
					// d3.select(this).attr("stroke","black");
					// d3.select(this).attr("stroke-width","1");
					DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set.concat(d.name));
				}
			})


	    var F2_div = div.append("div").attr("id","pF2_div").style("position","absolute")
	    					.style("top",floor_div_height + 'px')
	    					.style("height",floor_div_height + 'px')
	    					.style("left",floor_div_left_padding + 'px')
	    					.style("width",floor_div_width + 'px')
	    var F2_div_svg = F2_div.append("svg").attr("id","pmapgraph_F2_div_svg")
			                .attr("height",floor_div_height)
			                .attr("width",floor_div_width)
		var floor2_rect = F2_div_svg.append("rect")
			.datum({name:"F_2"})
			.attr("height",floor_div_height)
			.attr("width",floor_div_width)	             
			.attr("fill","orange").attr("opacity",0.2)
			.on("click",function(d,i){
				var current_floor = 2;
				var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
				var index = selected_floor_set.indexOf(d.name);
				DATA_CENTER.set_global_variable("selected_floor",current_floor);
				if (index >=0 )
				{
					d3.select(this).classed("selected_PROXmap_rect",false);
					selected_floor_set.splice(index,1);
					DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set);
				}
				else
				{
					d3.select(this).classed("selected_PROXmap_rect",true);
					DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set.concat(d.name));
				}
			})
					

	    var F1_div = div.append("div").attr("id","pF1_div").style("position","absolute")	
	    					.style("top",(floor_div_height+floor_div_height) + 'px')
	    					.style("height",floor_div_height + 'px')
	    					.style("left",floor_div_left_padding + 'px')
	    					.style("width",floor_div_width + 'px')
	    var F1_div_svg = F1_div.append("svg").attr("id","pmapgraph_F1_div_svg")
			                .attr("height",floor_div_height)
			                .attr("width",floor_div_width)
		var floor1_rect = F1_div_svg.append("rect")
			.datum({name:"F_1"})
			.attr("height",floor_div_height)
			.attr("width",floor_div_width)	             
			.attr("fill","yellow").attr("opacity",0.2)
			.on("click",function(d,i){
				var current_floor = 1;
				var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
				var index = selected_floor_set.indexOf(d.name);
				DATA_CENTER.set_global_variable("selected_floor",current_floor);
				if (index >=0 )
				{
					d3.select(this).classed("selected_PROXmap_rect",false);
					selected_floor_set.splice(index,1);
					DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set);
				}
				else
				{
					d3.select(this).classed("selected_PROXmap_rect",true);
					DATA_CENTER.set_global_variable("selected_floor_set",selected_floor_set.concat(d.name));
				}
			})									


	    //3.渲染floor的map
	    var left_padding = (div_width-floor_div_width)*0.05;
	    var width = (div_width-floor_div_width) - 2*left_padding;
	    var top_padding = div_width*0.05;
	    var height = (div_height - 4*top_padding)/3;

	    var F3_pmap_graph_div = div.append("div")
	    					.attr("id","F3_pmap_graph_div")
	    					.style("top",top_padding + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F2_pmap_graph_div = div.append("div")
	    					.attr("id","F2_pmap_graph_div")
	    					.style("top",(top_padding+height+top_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    var F1_pmap_graph_div = div.append("div")
	    					.attr("id","F1_pmap_graph_div")
	    					.style("top",(top_padding+height+top_padding+height+top_padding) + 'px')
	    					.style("height",height + 'px')
	    					.style("left",left_padding + 'px')
	    					.style("width",width + 'px')
	    					.style("position","absolute")

	    render_mapgraph("F3_pmap_graph_div",F3_PROX_IMG_SRC)
	    render_mapgraph("F2_pmap_graph_div",F2_PROX_IMG_SRC)
	    render_mapgraph("F1_pmap_graph_div",F1_PROX_IMG_SRC)

	    function render_mapgraph(divID,img_src)
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
			    .attr('id', 'pmapgraph-tip')
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
	    					.domain([0,100])
	    					.range([0,width]);
	    	var y_scale = d3.scale.linear()
	    					.domain([0,100])
	    					.range([0,height]);
}            
	}
}