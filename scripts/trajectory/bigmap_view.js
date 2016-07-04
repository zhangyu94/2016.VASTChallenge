var bigmap_view = {
	obsUpdate:function(message, data)
	{
		var divID = "trajectory-bigmap";
		if (message == "set:current_display_time"){
			var global_display_time = DATA_CENTER.global_variable.current_display_time;
			this.updateView(divID, global_display_time);	
		}
		if (message == "set:selected_floor_set")
		{
			console.log("selected_floor_set");
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			var selected_floor = DATA_CENTER.global_variable.selected_floor;
			var set_length = selected_floor_set.length;
			this.render(divID, selected_floor);	
			this.updateView(divID, 1464685493000);
		}
	},
	render:function(divID, floorNum)
	{
		d3.selectAll("#"+divID).selectAll("*").remove();
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")
	                .attr("id", "floor-svg")
	                .attr('width', width)
	                .attr('height', height);

	    var roomData = DATA_CENTER.derived_data['room.json']; 

	    var xScale = d3.scale.linear()
			.range([0, width])
			.domain([0, 190]);

		var yScale = d3.scale.linear()
			.range([0, height])
			.domain([0, 111]);

		svg.selectAll('.zone')
		.data(roomData.filter(function(d){
			return d.floor == floorNum && d.x == null
		}));

	    var roomG = svg.selectAll('.room')
	    .data(roomData.filter(function(d){
			return d.floor == floorNum && d.x != null && d.xlength != "";
		}))
	    .enter()
	    .append('g')
	    .attr('class', 'room');

	    roomG.append('rect')
	    .attr('class','room-rect')
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

	    roomG.append('text')
	    .attr('class', 'room-num-text')
	    .attr('id', function(d,i){
	    	return 'room-' + d.doornum;
	    })
	    .text(function(d,i){
	    	return d.doornum;
	    })
	    .attr('x',function(d,i){
	    	return xScale(d.x);
	    })
	    .attr('y',function(d,i){
	    	return yScale(d.y) + 15;
	    });

	    roomG.append('text')
	    .attr('class', 'room-name-text')
	    .attr('id', function(d,i){
	    	return 'room-' + d.name;
	    })
	    .text(function(d,i){
	    	if(d.name != 'Office'){
	    		return d.name;
	    	}
	    })
	    .attr('x',function(d,i){
	    	return xScale(d.x);
	    })
	    .attr('y',function(d,i){
	    	return yScale(d.y) + 30;
	    });
	    this.removeRoomLabel();
	}, 
	//去掉房间的label
	removeRoomLabel:function(){
		d3.selectAll('.room-num-text').remove();
		d3.selectAll('.room-name-text').remove();
	},
	//传递控制全局的时间变量，并且对于绘制视图进行更新
	updateView: function(divID, globalTime){
		//存储当前的人在哪一个zone里面
		var globalTime = +globalTime;
		var zoneData = DATA_CENTER.derived_data['zone.json']; 
		var personData = DATA_CENTER.derived_data['person.json']; 
		var personArray = $.map(personData, function(value, index) {
		    return [value];
		});
		var personInZone = [];
		var floorNum = DATA_CENTER.global_variable.selected_floor;
		for(var i = 0;i < personArray.length;i++){
			personInZone[i] = new Object();
			personInZone[i].personName = personArray[i].fixRecords[0].records[0]["prox-id"];
			personInZone[i].zoneNum = -1;
			var routeRocrds10Days = personArray[i].fixRecords;
			for(var j = 0;j < routeRocrds10Days.length;j++){
				var routeRcords1Days = routeRocrds10Days[j].records;
				for(var k = 0;k < routeRcords1Days.length;k++){
					if(globalTime > routeRcords1Days[k].timestamp && globalTime < routeRcords1Days[k].endtime 
						&& routeRcords1Days[k].floor == floorNum){
						var zoneNum = +personArray[i].fixRecords[j].records[k]["zone"];
						if(!isNaN(zoneNum)){
							personInZone[i].zoneNum = +personArray[i].fixRecords[j].records[k]["zone"];
						}
						break;
					}
				}
			}
		}
		var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var DURATION = 2000;
	   	var xScale = d3.scale.linear()
			.range([0, width])
			.domain([0, 190]);

		var yScale = d3.scale.linear()
			.range([0, height])
			.domain([0, 111]);
		//d3.selectAll("#"+divID).selectAll("*").remove();
		var svg = d3.select("#floor-svg");
		//增加node节点
		var nodeSelection = svg.selectAll('.person-label')
		.data(personInZone.filter(function(d){
			return d.zoneNum != -1 && d.zoneNum != null ;
		}), function(d,i){
			return d.personName;
		});

		nodeSelection.enter()
		.append('circle')
		.attr('class','person-label')
		.attr('r', function(d,i){
			return 3;
		})
		.attr('cx', function(d,i){
			var zoneId = +d.zoneNum - 1;
			var xLength = +zoneData[zoneId].xLength;
			var centerX = +zoneData[zoneId].x;
			return xScale(+centerX - (Math.random() * 2 - 1) * xLength);//
		})
		.attr('cy', function(d,i){
			var zoneId = +d.zoneNum - 1;
			var yLength = +zoneData[zoneId].yLength;
			var centerY = +zoneData[zoneId].y;//
			return yScale(+centerY - (Math.random() * 2 - 1) * yLength);
		});
		//改变node节点
		nodeSelection.transition()
		.duration(DURATION)
		.attr('r', function(d,i){
			return 3;
		})
		.attr('cx', function(d,i){
			var zoneId = +d.zoneNum - 1;
			var xLength = +zoneData[zoneId].xLength;
			var centerX = +zoneData[zoneId].x;
			return xScale(+centerX - (Math.random() * 2 - 1) * xLength);//
		})
		.attr('cy', function(d,i){
			var zoneId = +d.zoneNum - 1;
			var yLength = +zoneData[zoneId].yLength;
			var centerY = +zoneData[zoneId].y;//
			return yScale(+centerY - (Math.random() * 2 - 1) * yLength);
		});
		//删除node节点
		nodeSelection.exit().remove();
	}
}