var HVACgraph_attrbtn_view = {
	obsUpdate:function(message, data)
	{
		console.log(message)

		if ( (message == "set:selected_building_set") || (message == "set:selected_floor_set") || (message == "set:selected_HVACzone_set") )
		{

			this.render("HVACgraph-attr-btn")


		}
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();


	    this.draw_attr_panel(divID,DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set,d3.scale.category20())
	},
	draw_attr_panel:function(divID,attr_list,color_mapping)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();


	    var div = document.getElementById(divID)

	    var rect_width = width/attr_list.length;
	    var rect_height = height;

	    //style=height:<%=height%>px
		var buttonhtml = 	'<span class="HVACattrbtn-span" id=<%=ID%> value=<%=buttonValue%>  >'+
		    					'<div style="position:relative">'+
		    						//'<i class="fa fa-times delete_icon hidden" groupid=<%=buttonValue%>></i>'+
		    						'<span class="object_title_span" value=<%=buttonValue%> > <%=buttonLabel%></span>'+
		    					'</div>'+
		    				'</span>'; 

		var compiled = _.template(buttonhtml);

		for (var i=0;i<attr_list.length;++i)
		{
			var buttonLabel = attr_list[i].substring(0,rect_width/9);
			var buttonValue = attr_list[i];

			div.innerHTML = div.innerHTML + compiled({
				buttonLabel: buttonLabel,
				ID: 'HVACattrbtn-span-' + i,
				buttonValue: buttonValue,
				height:rect_height,
			});
		}

		d3.selectAll(".HVACattrbtn-span")
			.data(attr_list)
			.on("click",function(d,i){
				var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
				var index = selected_attr_set.indexOf(d);
				if (index >=0 )
				{
					d3.select(this).classed("selected-HVACattrbtn-span",false);
					selected_attr_set.splice(index,1);
					DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set);
				}
				else
				{
					d3.select(this).classed("selected-HVACattrbtn-span",true);			
					DATA_CENTER.set_global_variable("selected_attr_set",selected_attr_set.concat(d));
				}
				
			})
			/*
			.on("mouseover",function(d,i){
				tip.show(d,i)
			})
			.on("mouseout",function(d,i){
				tip.hide(d,i)
			})
*/



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