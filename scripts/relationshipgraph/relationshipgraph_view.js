var relationshipgraph_view = {
	relationshipgraph_view_DIV_ID : "HVAC-relationshipgraph",

	obsUpdate:function(message, data)
	{
		if (message == "display:relationshipgraph_view")
        {
            $("#"+this.relationshipgraph_view_DIV_ID).css("display","block");
			var ori_data_array = DATA_CENTER.original_data["bldg-MC2.csv"].concat();

            var selected_linechart_set = Object.keys(ori_data_array[0]);
            selected_linechart_set.shift();
            selected_linechart_set = selected_linechart_set.slice(-80);
            console.log(selected_linechart_set)
            var selected_filter_timerange = undefined;
            //console.log(selected_filter_timerange)
            this.render(this.relationshipgraph_view_DIV_ID,selected_linechart_set, selected_filter_timerange);        

        }

        if (message == "hide:relationshipgraph_view")
        {
            $("#"+this.relationshipgraph_view_DIV_ID).css("display","none");
        }

        // if ( message == "set:selected_linechart_set" || message == "set:selected_filter_timerange")
        // {
        //     var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
        //     var selected_filter_timerange = DATA_CENTER.global_variable.selected_filter_timerange;
        //     //console.log(selected_filter_timerange)
        //     this.render(this.relationshipgraph_view_DIV_ID,selected_linechart_set, selected_filter_timerange);
        // }
	},

	render:function(divID, selectedAttr, timerange)
	{
		d3.select("#"+divID).selectAll("*").remove();

		var ori_data_array = DATA_CENTER.original_data["bldg-MC2.csv"].concat();
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var selectedData = [];
	    var parseDate = d3.time.format("%Y/%m/%d %H:%M").parse;

	    var tip = d3.tip()
		  .attr('class', 'd3-tip-relation')
		  .offset([-10, 0]) .html(function(d) {
		    return DATA_CENTER.VIEW_COLLECTION.linechart_render_view._compress_full_attr_name(d.id);
		  });

	    var nodes = [],links = [];

	    var scale_negative = d3.scale.linear()
	      .domain([-1,0])
	      .range([30,400]);

	    var scale_positive = d3.scale.linear()
	      .domain([0,1])
	      .range([400,30]);

	    if(timerange == undefined)
	    	selectedData = ori_data_array;
	    else
	    {
		    ori_data_array.forEach(function(d,i){ 
		       if(parseDate(d['Date/Time']).getTime() >= timerange.min && parseDate(d['Date/Time']).getTime() <= timerange.max)
		          selectedData.push(d);     
		    });	    	
	    }

	     //画力导向图
	     var force = d3.layout.force()
	         .nodes(nodes)
	         .links(links)
	         .charge(-300)
	         .linkDistance(function(d){
	         	if(d.weight<0)
	         		return scale_negative(d.weight);
	         	else
	         		return scale_positive(d.weight);
	         })
	         .size([width, height])
	         .on("tick", tick);

	     var svg = d3.select("#"+divID).append("svg")
	         .attr("width", width)
	         .attr("height", height);

	     svg.call(tip);

	     var node = svg.selectAll(".node"),
	         link = svg.selectAll(".link"),
	         linkText = svg.selectAll(".link-label");

//重新设置nodes表和links表
	        selectedAttr.forEach(function(a){
	           nodes.push({id: a});
	        });
	        //计算相关系数
	        for(var i=0;i<nodes.length-1;i++)
	           for(var j=i+1;j<nodes.length;j++)
	           {
	              var x_list = [], y_list = [];
	              selectedData.forEach(function(s){
	                 x_list.push(Number(s[nodes[i].id]));
	                 y_list.push(Number(s[nodes[j].id]));
	              })
	              
	              var len = x_list.length;
	              var sum_x = 0, sum_y = 0, sum_up = 0, sum_down_x = 0, sum_down_y = 0;

	              for(var k=0;k<len;k++)
	              {
	                 sum_x += x_list[k];
	                 sum_y += y_list[k];
	              }

	              var mean_x = sum_x/len, mean_y = sum_y/len;

	              for(var k=0;k<len;k++)
	              {
	                 sum_up += (x_list[k]-mean_x)*(y_list[k]-mean_y);
	                 sum_down_x += Math.pow(x_list[k]-mean_x,2);
	                 sum_down_y += Math.pow(y_list[k]-mean_y,2);
	              }

	              var result = sum_up/(Math.sqrt(sum_down_x)*Math.sqrt(sum_down_y));
 	              if(result <=1 && result >=-1)
	                links.push({source: nodes[i], target: nodes[j], weight: result});
	           }

	       link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
	       linkText = linkText.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });

	       link.enter().insert("line", ".node")
	       	.attr("class", "link-relation")
	       	.attr("stroke","silver")
	       	.attr("stroke-width",1.5)
	       	.attr("opacity",.05)
	       	.style("stroke-dasharray", function(d){
	       		if(d.weight < 0)
	       			return ("3, 3");
	       		else
	       			return ("0, 0");
	       	}); 

	      linkText.enter().append("text")
	         .attr("class", "link-label")
	         .attr("text-anchor", "middle")
	         .style('font-size','10px')
	         .style('fill','none')
	         .attr('dy','-.6em')
	         .text(function(d) { return d.weight.toFixed(3); });

	     link.exit().remove();
	     //linkText.exit().remove();

	       node = node.data(force.nodes(), function(d) { return d.id;});
	   
	        node_g = node.enter().append('g')
	           .attr("class","node-relation")
	           .call(force.drag)
	           .on('mouseover', connectedNodes) //Added code
	           .on('mouseout', showAllnodes); 

	        node_g.append("circle")
	           .attr("r",5)
	           .attr("fill",function(d){
	           		if(d.id[1] == '_')
	           		{
	           			if(d.id.indexOf("_Z_") != -1)
	           				return "green";
	           			else
	           				return "blue";
	           		}
	           		return "purple";
	           })           
		       	.on('mouseover', tip.show)
	        	.on('mouseout', tip.hide);

	        node_g.append("text")
	           .attr("transform", "translate(8,3)")
	           .style('font-size',9)
	           .attr('fill',"grey")
	           .attr('stroke-width',0)
	           .text(function(d){return DATA_CENTER.VIEW_COLLECTION.linechart_render_view._compress_full_attr_name(d.id)});

	        node.exit().remove();

	        force.start();
	        for(var i=80*80;i>0;--i)
	        	force.tick();
	        force.stop();

			//Create an array logging what is connected to what
			var linkedByIndex = {};
			for (var i = 0; i < nodes.length; i++) {
			    linkedByIndex[nodes[i].id + "," + nodes[i].id] = 1;
			};
			links.forEach(function (d) {
			    linkedByIndex[d.source.id + "," + d.target.id] = 1;
			});

			//This function looks up whether a pair are neighbours
			function neighboring(a, b) {
			    return linkedByIndex[a.id + "," + b.id];
			}
			function connectedNodes() {
			        //Reduce the opacity of all but the neighbouring nodes
			        d = d3.select(this).node().__data__;
			        node.style("opacity", function (o) {
			            return neighboring(d, o) | neighboring(o, d) ? 1 : 0;
			        });
			        link.style("opacity", function (o) {
			            return d.id==o.source.id | d.id==o.target.id ? 1 : 0;
			        });
			        linkText.style("fill",function (o) {
			            return d.id==o.source.id | d.id==o.target.id ? "grey" : "none";
			        });
			}

			function showAllnodes() {
		        node.style("opacity", 1);
		        link.style("opacity", .05);
		        linkText.style("fill", "none");
			}

	     function tick() {
	        node_g.attr('transform', function(d){
	           return 'translate(' + d.x + ', ' + d.y + ')';
	        });

	       link.attr("x1", function(d) { return d.source.x; })
	           .attr("y1", function(d) { return d.source.y; })
	           .attr("x2", function(d) { return d.target.x; })
	           .attr("y2", function(d) { return d.target.y; });

	       linkText.attr("transform", function(d) { //calcul de l'angle du label
	         var angle = Math.atan((d.source.y - d.target.y) / (d.source.x - d.target.x)) * 180 / Math.PI;
	         return 'translate(' + [((d.source.x + d.target.x) / 2), ((d.source.y + d.target.y) / 2)] + ')rotate(' + angle + ')';
	       });
	     }
	}
}