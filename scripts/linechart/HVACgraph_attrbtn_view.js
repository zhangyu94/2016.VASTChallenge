var HVACgraph_attrbtn_view = {
	obsUpdate:function(message, data)
	{
		console.log(message)
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    


	},
	//HVACgraph_attrbtn_view.draw_attr_panel("HVACgraph-attr-btn",["fsadf","twet","tret","ewrwe"],d3.scale.category20())
	//HVACgraph_attrbtn_view.draw_attr_panel("HVACgraph-attr-btn",["fsadf","twet","tret","ewrwe","treterte","e32","fsdd","terrt","tretre","trte","tertre","terter"],d3.scale.category20())
	draw_attr_panel:function(divID,attr_list,color_mapping)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")  
	                .attr("width",width)
	                .attr("height",height)

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
					console.log("hhhh")
					/*
					var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
					var index = selected_attr_set.indexOf(d);
					if (index >=0 )
					{
						d3.select(this).classed("selected-HVACattrbtn-rect",false);
						selected_attr_set.splice(index,1);
						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);
					}
					else
					{
						d3.select(this).classed("selected-HVACattrbtn-rect",true);			
						DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set.concat(d));
					}
					*/
				})
				
	    var rect = g.append("rect")
	    			.attr("class","HVACattrbtn-rect")
	    			.attr("width",rect_width)
	    			.attr("height",rect_height)
	    			.attr("fill",function(d,i){return color_mapping(i)});

	    var text = g.append("text")
	    			.attr("class","HVACattrbtn-text")
	    			//.attr("dy", ".3em")
	    			.attr("dy", rect_height/2+5)
	    			.attr("dx",rect_width/2)
					.style("text-anchor", "middle")
					.text(function(d,i){
					    console.log(d)
					    return d.substring(0,rect_width/8);
					});


	}
}