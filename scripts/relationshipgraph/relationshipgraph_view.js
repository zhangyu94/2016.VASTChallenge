var relationshipgraph_view = {
	relationshipgraph_view_DIV_ID : "HVAC-relationshipgraph",

	obsUpdate:function(message, data)
	{
		if (message == "display:relationshipgraph_view")
        {
            $("#"+this.relationshipgraph_view_DIV_ID).css("display","block");
        }

        if (message == "hide:relationshipgraph_view")
        {
            $("#"+this.relationshipgraph_view_DIV_ID).css("display","none");
        }

        if ( message == "set:selected_filter_timerange" || message == "set:selected_attr_set" || message == "set:selected_HVACzone_set" || message == "set:selected_floor_set" || message == "set:selected_building_set")
        {
            var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
            var selected_HVACzone_set = DATA_CENTER.global_variable.selected_HVACzone_set;
            var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
            var selected_building_set = DATA_CENTER.global_variable.selected_building_set;
            var selected_filter_timerange = DATA_CENTER.global_variable.selected_filter_timerange;
            
            var selectedAttr = linechart_linebtn_view._cal_attrbtnset(selected_attr_set, selected_HVACzone_set, selected_floor_set, selected_building_set);
            this.render(this.relationshipgraph_view_DIV_ID, selectedAttr, selected_filter_timerange);
        }
	},

	render:function(divID, selectedAttr, timerange)
	{
		console.log(selectedAttr);
		d3.select("#"+divID).selectAll("*").remove();
	
		var ori_data_array = DATA_CENTER.original_data["bldg-MC2.csv"].concat();//全部的data
	    var nodes = [],links = [], linkByIndex = [], node_index = [];
	    var selectedData = [];//符合时间范围的data
	    var All_attr_array = Object.keys(ori_data_array[0]);//全部属性的表
        var index = All_attr_array.indexOf("Date/Time");
    	All_attr_array.splice(index,1);

	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
 	    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

 	    var tip = d3.tip()
		  .attr('class', 'd3-tip-relation')
		  .offset([-10, 0]) .html(function(d) {
		    return d.id;
		  });

	    var scale_negative = d3.scale.linear()
	      .domain([-1,-0.9])
	      .range([50,200]);

	    var scale_positive = d3.scale.linear()
	      .domain([0.8,0.6])
	      .range([50,200]);			

	    //if(timerange == undefined)//是否设置了时间范围，如果没有就默认是全部时间
	    	selectedData = ori_data_array;
	    // else
	    // {
		   //  ori_data_array.forEach(function(d,i){ 
		   //    if(parseDate(d['Date/Time']).getTime() >= timerange.min && parseDate(d['Date/Time']).getTime() <= timerange.max)
		   //        selectedData.push(d);     
		   //  });	    	
	    // }

	     var force = d3.layout.force()//力图的力设置
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

	     var svg = d3.select("#"+divID).append("svg")//画svg
	         .attr("width", width)
	         .attr("height", height);

	     svg.call(tip);

	     var node = svg.selectAll(".node"),
	         link = svg.selectAll(".link");

	        All_attr_array.forEach(function(a){
	           nodes.push({id: a});
	        });

	        var A_array = [], total_array = [];

	        All_attr_array.forEach(function(EachAttr){//创建计算相关系数时要用到的数组
	        	A_array = [];
		        selectedData.forEach(function(item){
		        	A_array.push(item[EachAttr]);	        	
		        }); 
	        	total_array.push(A_array);		               	
	        })

	        var correlationMatrix = MDS.correlationMatrix(total_array);//相关系数结果数组
	        var arr_len = correlationMatrix.length;

	        console.log(correlationMatrix)

	        for(var i=0;i<arr_len-1;i++)
        	for(var j=i+1;j<arr_len;j++)
        	{
        		if((correlationMatrix[i][j] >= 0.6 && correlationMatrix[i][j] <=0.8) || (correlationMatrix[i][j] >= -1 && correlationMatrix[i][j] <= -0.9))//link的阈值
        			linkByIndex.push({source: nodes[i], target: nodes[j], weight: correlationMatrix[i][j]});//创建link的查询表，存入全部属性的link
        	}

        	linkByIndex.forEach(function(l){
        		var selectLinks = 0;
        		selectedAttr.forEach(function(s){
        			if(s == l.source.id || s == l.target.id)
        				{selectLinks = 1;return;}
        		})
        		if(selectLinks == 1) links.push(l);
        	})

        	links.forEach(function(l){
        		node_index.push(l.source.id);
        		node_index.push(l.target.id);        		
        	})


	    	console.log(links)
	    	force_start();

	    function force_start() {
	       
	       link = link.data(force.links(), function(d) { 
	       		//console.log(d)
	       		return d.source.id + "-" + d.target.id; 
	       });

	       link.enter().insert("line", ".node")//画link
	       	.attr("class", "link-relation")
	       	.attr("stroke","silver")
	       	.attr("stroke-width",1.5)
	       	.attr("opacity",1)
	       	.style("stroke-dasharray", function(d){//负相关使用虚线
	       		if(d.weight < 0)
	       			return ("3, 3");
	       		else
	       			return ("0, 0");
	       	}); 

	     link.exit().remove();

	     node = node.data(force.nodes(), function(d) { 
	     		return d.id;
	     });//画node
	   
	     node_g = node.enter().append('g')
	           .attr("class","node-relation")
	           .call(force.drag);
 
         node_g.append("circle")
           .attr("r",4)
           .attr("fill",function(d){//根据不同类型进行上色
           		if(d.id[1] == '_')
           		{
           			if(d.id.indexOf("_Z_") != -1)
           				return "green";
           			else
           				return "blue";
           		}
           		return "purple";
           })
           .style("opacity",function(d){//只显示选中的
           		var IsInAttrSet = node_index.indexOf(d.id);
           		if(IsInAttrSet != -1)
           			return 1;
           		else
           			return 0.2;
           })
           .on('mouseover', tip.show)
	       .on('mouseout', tip.hide);

         node_g.append("text")
           .attr("transform", "translate(8,3)")
           .style('font-size',10)
           .attr('fill',"grey")
           .attr('stroke-width',0)
           .style("opacity",function(d){//只显示选中的
           		var IsInAttrSet = node_index.indexOf(d.id);
           		if(IsInAttrSet != -1)
           			return 1;
           		else
           			return 0.2;
           })
           .text(function(d){
           		return DATA_CENTER.VIEW_COLLECTION.linechart_render_view._compress_full_attr_name(d.id);
           		//return d.id;
           });

         node.exit().remove();

         force.start();

		} 

		function position_x() {//映射x的位置
			var min_x = Math.min.apply(Math, nodes.map(function(d){return d.x;}));
			var max_x = Math.max.apply(Math, nodes.map(function(d){return d.x;}));

		    var scale_position_x = d3.scale.linear()
		      .domain([min_x,max_x])
		      .range([0,width]);

		    return scale_position_x;
		}

		function position_y() {//映射y的位置
			var min_y = Math.min.apply(Math, nodes.map(function(d){return d.y;}));
			var max_y = Math.max.apply(Math, nodes.map(function(d){return d.y;}));

		    var scale_position_y = d3.scale.linear()
		      .domain([min_y,max_y])
		      .range([height,0]);

		    return scale_position_y;
		}
	    
	    function tick() {
	     	var scale_x = position_x();
	     	var scale_y = position_y();

 	     	if(force.alpha()<0.05) {
		        node_g.attr('transform', function(d){
		           return 'translate(' + scale_x(d.x) + ', ' + scale_y(d.y) + ')';
		           //return 'translate(' + Math.max(radius, Math.min(width - radius, d.x)) + ', ' + Math.max(radius, Math.min(height - radius, d.y)) + ')';
		        });

		       link.attr("x1", function(d) { return scale_x(d.source.x); })
		           .attr("y1", function(d) { return scale_y(d.source.y); })
		           .attr("x2", function(d) { return scale_x(d.target.x); })
		           .attr("y2", function(d) { return scale_y(d.target.y); });
		    }
	     }
	}
}