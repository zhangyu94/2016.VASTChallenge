var relationshipgraph_view = {
	relationshipgraph_view_DIV_ID : "HVAC-relationshipgraph",

//DATA_CENTER.VIEW_COLLECTION.linechart_render_view._compress_full_attr_name

	obsUpdate:function(message, data)
	{
		if (message == "display:relationshipgraph_view")
        {
            $("#"+this.relationshipgraph_view_DIV_ID).css("display","block");
            var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
            this.render(this.relationshipgraph_view_DIV_ID,selected_linechart_set);
        }

        if (message == "hide:relationshipgraph_view")
        {
            $("#"+this.relationshipgraph_view_DIV_ID).css("display","none");
        }

        if ( message == "set:selected_linechart_set" )
        {
            var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
            console.log(selected_linechart_set)
            this.render(this.relationshipgraph_view_DIV_ID,selected_linechart_set)
        }
	},
	render:function(divID, selectedAttr)
	{
		console.log(selectedAttr);
		d3.select("#"+divID).selectAll("*").remove();

		var ori_data_array = DATA_CENTER.original_data["bldg-MC2.csv"];
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

		var Time = ["2016/5/31 0:00", "2016/6/8 16:20"];
	    var selectedData = [];
	    var parseDate = d3.time.format("%Y/%m/%d %H:%M").parse;

	    var tip = d3.tip()
		  .attr('class', 'd3-tip-relation')
		  .offset([-10, 0]) .html(function(d) {
		    return d.weight.toFixed(3);
		  });

	    var nodes = [],links = [];

	    var scale = d3.scale.linear()
	      .domain([0,1])
	      .range([500,50]);

// 	    var ST = parseDate(Time[0]), ET = parseDate(Time[1]);

	     ori_data_array.forEach(function(d,i){ 
	     	console.log(d['Date/Time'])
//	        d['Date/Time'] = parseDate(d['Date/Time']);
//	        if(d['Date/Time'] >= ST && d['Date/Time'] <= ET)
	          selectedData.push(d);     
	     });
	     //画力导向图
	     var force = d3.layout.force()
	         .nodes(nodes)
	         .links(links)
	         .charge(-300)
	         .linkDistance(function(d){return scale(d.weight);})
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

	              for(var k=0;k<5;k++)
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
	              console.log(result)
	              if(result <=1 && result >=0)
	                links.push({source: nodes[i], target: nodes[j], weight: result});
	           }
	        //corre_list();

	     function corre_list() {
	        list = links.concat();//复制数组
	        list.sort(compare("weight"));//按照相关度排序
	        var list_div = d3.select("#CorrelationList").selectAll('div')
	            .data(list)
	            .enter()
	            .append('div')
	            .attr("class","list_div")
	            .html(function(d){return "<span style='color:steelblue'>"+d.source.id + "</span> " + d.target.id + " <span style='color:#880000'>" + d.weight.toFixed(3) + "</span>";});
	     }

	      function compare(propertyName) { 
	        return function (object1, object2) { 
	            var value1 = object1[propertyName]; 
	            var value2 = object2[propertyName]; 
	            if (value2 < value1) { 
	              return -1; 
	            } 
	          else if (value2 > value1) { 
	            return 1; 
	          } 
	          else { 
	            return 0; 
	          } 
	        } 
	      } 


	       link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });
	       //linkText = linkText.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; });

	       link.enter().insert("line", ".node")
	       	.attr("class", "link")
	       	.attr("stroke-width",function(d){return d.weight})
	       	.on('mouseover', tip.show)
        	.on('mouseout', tip.hide); 

	      // linkText.enter().append("text")
	      //    .attr("class", "link-label")
	      //    .attr("text-anchor", "middle")
	      //    .style('stroke-width',.1)
	      //    .style('font-size','12px')
	      //    .style('fill','grey')
	      //    .attr('dy','-.6em')
	      //    .text(function(d) { return d.weight.toFixed(3); });

	     link.exit().remove();
	     //linkText.exit().remove();

	       node = node.data(force.nodes(), function(d) { return d.id;});
	   
	        node_g = node.enter().append('g')
	           .attr("class","node")
	           .call(force.drag); 

	        node_g.append("circle")
	           .attr("r",6)
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
	           .attr("stroke","grey")
	           .attr("stroke-width",1);

	        node_g.append("text")
	           .attr("transform", "translate(8,3)")
	           .style('font-size',9)
	           .attr('fill',"grey")
	           .attr('stroke-width',0)
	           .text(function(d){return d.id});

	        node.exit().remove();

	        force.start();
	        for(var i=50;i>0;--i)
	        {
	        	force.tick();
	        }
	        force.stop();

	     function tick() {
	        node_g.attr('transform', function(d){
	           return 'translate(' + d.x + ', ' + d.y + ')';
	        });

	       link.attr("x1", function(d) { return d.source.x; })
	           .attr("y1", function(d) { return d.source.y; })
	           .attr("x2", function(d) { return d.target.x; })
	           .attr("y2", function(d) { return d.target.y; });

	       // linkText.attr("transform", function(d) { //calcul de l'angle du label
	       //   var angle = Math.atan((d.source.y - d.target.y) / (d.source.x - d.target.x)) * 180 / Math.PI;
	       //   return 'translate(' + [((d.source.x + d.target.x) / 2), ((d.source.y + d.target.y) / 2)] + ')rotate(' + angle + ')';
	       // });
	     }
	}
}