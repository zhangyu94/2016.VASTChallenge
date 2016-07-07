var mdsgraph_view = {
	mdsgraph_view_DIV_ID : "HVAC-mdsgraph",

	obsUpdate:function(message, data)
	{
		if (message == "display:mdsgraph_view")
        {
            $("#"+this.mdsgraph_view_DIV_ID).css("display","block");
            this.render(this.mdsgraph_view_DIV_ID);
        }

        if (message == "hide:mdsgraph_view")
        {
            $("#"+this.mdsgraph_view_DIV_ID).css("display","none");
        }
	},
	render:function(divID)
	{
	    var start_time_number;
	    var end_time_number;
	    var binded_data = _get_binded_data(start_time_number,end_time_number);
	    function _get_binded_data()
	    {
		    var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
		    var ori_data_array = DATA_CENTER.original_data["bldg-MC2.csv"];
		    var data_array = [];
		    for (var i=0;i<ori_data_array.length;++i)
		    {
		    	var temp_data =[];
		    	var cur_ori_data = ori_data_array[i];
		    	for (var j=0;j<selected_linechart_set.length;++j)
		    	{
		    		var cur_dim = cur_ori_data[selected_linechart_set[j]];
		    		if (typeof(cur_dim)=="undefined")
		    		{
		    			console.warn("undefined cur_dim")
		    		}
		    		temp_data.push(cur_dim);
		    	}
		    	data_array.push(temp_data);
		    }

		    var mds_dot_layout = MDS.byData(data_array);
		    
		    
			var binded_data = [];
			for (var i=0;i<mds_dot_layout.length;++i)
			{
				var temp_element = {};
				temp_element.x = mds_dot_layout[i][0];
				temp_element.y = mds_dot_layout[i][1];
				temp_element.timestring = ori_data_array[i]["Date/Time"];
				temp_element.timenumber = new Date(temp_element.timestring).getTime();

				binded_data.push(temp_element)
			}
			return binded_data;
		}


		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mdsgraph_view_svg")    
	                .attr("width",width)
	                .attr("height",height)
	                .attr("position","relative")

		
	    // Create the area where the lasso event can be triggered
		var lasso_area = svg.append("rect")
                      .attr("width",width)
                      .attr("height",height)
                      .style("z-index",0)
                      .style("opacity",0)


        // Lasso functions to execute while lassoing
		var lasso_start = function() {
		  	lasso.items()
			    .attr("r",3.5) // reset size
			    .style("fill",null) // clear all of the fills
			    .classed({"not_possible":true,"selected":false}); // style as not possible
		};

		var lasso_draw = function() {
		  	// Style the possible dots
		  	lasso.items().filter(function(d) {return d.possible===true})
		    	.classed({"not_possible":false,"possible":true});

		  	// Style the not possible dot
		  	lasso.items().filter(function(d) {return d.possible===false})
		    	.classed({"not_possible":true,"possible":false});

		};

		var lasso_end = function() {
		  	// Reset the color of all dots
		  	lasso.items()
		     	.style("fill", function(d) { return "black"; });

		  	// Style the selected dots
		  	var selected_node = lasso.items().filter(function(d) {return d.selected===true})
		    	.classed({"not_possible":false,"possible":false})
		    	.attr("r",7);

		  	// Reset the style of the not selected dots
		  	var unselected_node = lasso.items().filter(function(d) {return d.selected===false})
		    	.classed({"not_possible":false,"possible":false})
		    	.attr("r",3.5);

		   
		    var selected_timepoint_set = [];
		    selected_node.each(function(d,i){
		    	selected_timepoint_set.push(d.timenumber);
		    })
		    console.log(selected_timepoint_set.length)
		    DATA_CENTER.set_global_variable("selected_timepoint_set",selected_timepoint_set)
		   	
		};              

        // Define the lasso
		var lasso = d3.lasso()
		      .closePathDistance(75) // max distance for the lasso loop to be closed
		      .closePathSelect(true) // can items be selected by closing the path?
		      .hoverSelect(true) // can items by selected by hovering over them?
		      .area(lasso_area) // area where the lasso can be started
		      .on("start",lasso_start) // lasso start function
		      .on("draw",lasso_draw) // lasso draw function
		      .on("end",lasso_end); // lasso end function

		// Init the lasso on the svg:g that contains the dots
		svg.call(lasso);              
        
		          





		var x_array = [];
		var y_array = [];
		for (var i=0;i<binded_data.length;++i)
		{
		   	x_array.push(binded_data[i].x);
		    y_array.push(binded_data[i].y)
		}
		var render_scale = { 
			x:d3.scale.linear()
			    .domain(d3.extent(x_array))
			    .range([width*0.1,width*0.9]),
			y:d3.scale.linear()
			    .domain(d3.extent(y_array))
			    .range([height*0.1,height*0.9])
		};

		svg.selectAll(".mdsgraph_circle").remove();

	    svg.selectAll(".data")
		    .data(binded_data)
		    .enter()
		.append("circle")
			.attr("class","mdsgraph_circle")
			.attr("id",function(d, i){
		        return "mdsgraph_circle-"+d.timenumber;
		    })
		    .attr("r",5).attr("opacity",0.3).attr("fill","#000")
		    .attr("cx",function(d){
		        return render_scale.x(d.x);
		    })
		    .attr("cy",function(d){
		        return render_scale.y(d.y);
		    })
		    .style("z-index",1)
		    .on("mouseover",function(d,i){
		    	var mouseover_time = d.timenumber;
                DATA_CENTER.set_timeline_variable("mouseover_time",mouseover_time)
		    })
		    .on("mouseout",function(d,i){

		    });



		lasso.items(d3.selectAll(".mdsgraph_circle"));  



	    $('.mdsgraph_circle').each(function() {
            $(this).tipsy({
                gravity: "s",
                html:true,
                opacity:0.75,
                delayIn: 0,
                title:function(){
                    var d = this.__data__;
                    var content = "time: " + "<span style='color:red'>" + d.timestring + "</span>" + "</br>";     
                    return content;
                },
            });
        });


	}
}