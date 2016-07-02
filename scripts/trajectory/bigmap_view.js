var bigmap_view = {
	obsUpdate:function(message, data)
	{
		if (message == "set:selected_floor_set")
		{
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			console.log(selected_floor_set);
			// this.render(this.DIV_ID,this.rendered_attrbtn_set);			
		}
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")
	                .attr('width', width)
	                .attr('height', height);

	    var roomData = DATA_CENTER.derived_data['room.json']; 

	    console.log(roomData);

	    var xScale = d3.scale.linear()
			.range([0, width])
			.domain([0, 190]);

		var yScale = d3.scale.linear()
			.range([0, height])
			.domain([0, 111]);

		var floorNum = 3;

		svg.selectAll('.zone')
		.data(roomData.filter(function(d){
			return d.floor == floorNum && d.x == null
		}))
	    svg.selectAll('.room')
	    .data(roomData.filter(function(d){
			return d.floor == floorNum && d.x != null && d.xlength != "";
		}))
	    .enter()
	    .append('rect')
	    .filter(function(d) { return d.hasOwnProperty('doornum')})
	    .attr('class','room')
	    .attr('id', function(d,i){
	    	return 'room-' + d.doornum;
	    })
	    .attr('x', function(d,i){
	    	return xScale(d.x);
	    })
	    .attr('y',function(d,i){
	    	return yScale(d.y);
	    })
	    .attr('width',function(d,i){
	    	return xScale(d.xlength);
	    })
	    .attr('height',function(d,i){
	    	return yScale(d.ylength);
	    })
	    .attr('fill','gray');
	}
}