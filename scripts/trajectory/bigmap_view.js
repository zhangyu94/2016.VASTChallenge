var bigmap_view = {
	obsUpdate:function(message, data)
	{
		var divID = "trajectory-bigmap";
		if (message == "set:current_display_time"){
			var global_display_time = DATA_CENTER.global_variable.current_display_time;
			this.updateView(divID, global_display_time);
			//this.updateRobotView(divID, global_display_time);
			console.log(global_display_time);	
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
		var zoneDataArray = [];
		zoneDataArray[0] = DATA_CENTER.derived_data['zone_floor1.json']; 
		zoneDataArray[1] = DATA_CENTER.derived_data['zone_floor2.json'];
		zoneDataArray[2] = DATA_CENTER.derived_data['zone_floor3.json'];
		var personData = DATA_CENTER.derived_data['person.json']; 
		var personArray = $.map(personData, function(value, index) {
		    return [value];
		});
		var personInZone = DATA_CENTER.derived_data["personInZone"];
		var floorNum = DATA_CENTER.global_variable.selected_floor;
		var zoneData = zoneDataArray[floorNum - 1];
		for(var i = 0;i < personArray.length;i++){
			var routeRocrds10Days = personArray[i].fixRecords;
			for(var j = 0;j < routeRocrds10Days.length;j++){
				var routeRcords1Days = routeRocrds10Days[j].records;
				for(var k = 0;k < routeRcords1Days.length;k++){
					if(globalTime > routeRcords1Days[k].timestamp && globalTime < routeRcords1Days[k].endtime 
						&& routeRcords1Days[k].floor == floorNum){
						var zoneNum = +personArray[i].fixRecords[j].records[k]["zone"];
						if(!isNaN(zoneNum)){
							personInZone[i].formerZoneNum = +personInZone[i].zoneNum;
							personInZone[i].zoneNum = +personArray[i].fixRecords[j].records[k]["zone"];
						}
						break;
					}
					if(k == routeRcords1Days.length){
						personInZone.zoneNum = -1;
					}
				}
			}
		}
		console.log(personInZone);
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
			return d.zoneNum != -1 && d.zoneNum != null && d.zoneNum != d.formerZoneNum;
		}), function(d,i){
			return d.personName;
		});

		nodeSelection.enter()
		.append('circle')
		.attr('class','person-label')
		.attr('r', 5)
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
		})
		.on('click',function(d,i){
			console.log('click node event'); 
		});
		//改变node节点
		nodeSelection.transition()
		.duration(DURATION)
		.attr('r', 5)
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
		$('.person-label').each(function() {
		    $(this).tipsy({
		        gravity: "s",
		        html:true,
		        title:function(){
		        	var d = this.__data__;
		            var content = d.personName;
		            return content;
		        },
		    });
		});
		//删除节点
		var nodeSelection = svg.selectAll('.person-label')
		.data(personInZone.filter(function(d){
			return d.zoneNum != -1 && d.zoneNum != null;
		}), function(d,i){
			return d.personName;
		})
		.exit().remove();;		
	},
	//传递控制全局的时间变量，绘制机器人进行移动的视图
	updateRobotView: function(divID, globalTime){
		var robotData = DATA_CENTER.original_data['proxMobileOut-MC2.csv']; 
		var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var DURATION = 2000;
	    var threshold_show = 400000;
	   	var xScale = d3.scale.linear()
			.range([0, width])
			.domain([0, 190]);
		var yScale = d3.scale.linear()
			.range([0, height])
			.domain([0, 111]);
		var floorNum = DATA_CENTER.global_variable.selected_floor;
		//console.log(robotData);
		var svg = d3.select("#floor-svg");
		for(var i = 0; i < robotData.length;i++){
			robotData[i]['robotTime'] = new Date(robotData[i]['timestamp']).getTime();
		}
		var renderNodeArray = [];
		var j = 0;
		for(var i = 0;i < robotData.length;i++){
			if(globalTime > robotData[i].robotTime && globalTime < (robotData[i].robotTime + threshold_show) ){//
				renderNodeArray[j] = new Object();
				renderNodeArray[j].x = +robotData[i][" x"].replace(/\s+/g,"");
				renderNodeArray[j].floor = robotData[i][" floor"].replace(/\s+/g,"");
				renderNodeArray[j].y = +robotData[i][" y"].replace(/\s+/g,"");
				renderNodeArray[j].proxId = robotData[i][" prox-id"].replace(/\s+/g,"");
				renderNodeArray[j].time = globalTime - robotData[i].robotTime;
				j++;
			}
		}
		var transparencyScale = d3.scale.linear()
			.range([0, threshold_show])
			.domain([1, 0]);
		var robotNodeSelection = svg.selectAll('.person-label')
			.data(renderNodeArray.filter(function(d,i){
				return d.floor == floorNum;
			}), function(d,i){
				return d.proxId;
			});
		robotNodeSelection.enter()
			.append('circle')
			.attr('class','person-label')
			.attr('r',5)
			.attr('cx', function(d,i){
				return xScale(d.x);
			})
			.attr('cy', function(d,i){
				return xScale(d.y);
			})
			.style("opacity", function(d,i){
				//return transparencyScale(d.time)
				return 0.5;
			});
		robotNodeSelection.transition()
			.duration(DURATION)
			.attr('r',5)
			.attr('cx', function(d,i){
				return xScale(d.x);
			})
			.attr('cy', function(d,i){
				return xScale(d.y);
			})
			.style("opacity", function(d,i){
				//return transparencyScale(d.time)
				return 0.5;
			});
		//删除node节点
		robotNodeSelection.exit().remove();
	}
}