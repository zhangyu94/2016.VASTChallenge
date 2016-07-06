var bigmap_view = {
	bigmap_view_DIV_ID : "trajectory-bigmap",



	obsUpdate:function(message, data)
	{
		if (message == "display:bigmap_view")
        {
            $("#"+this.bigmap_view_DIV_ID).css("display","block");
            this.render(this.bigmap_view_DIV_ID);
        }

        if (message == "hide:bigmap_view")
        {
            $("#"+this.bigmap_view_DIV_ID).css("display","none");
        }

		var divID = this.bigmap_view_DIV_ID;

		if (message == "set:current_display_time"){
			var global_display_time = DATA_CENTER.global_variable.current_display_time;
			this.updateView(divID, global_display_time);
			this.updateRobotView(divID, global_display_time);
		}
		if (message == "set:selected_floor_set")
		{
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			var selected_floor = DATA_CENTER.global_variable.selected_floor;
			var set_length = selected_floor_set.length;
			this.render(divID, selected_floor);	
			//this.updateView(divID, 1464685493000);
		}
	},
	render:function(divID, floorNum)
	{
		var colorArray = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fbdf6f', '#ff7f00', '#cab2d6'];
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
	    .attr('fill',function(d,i){
	      var zoneNum = +d.proxZone;
	      return colorArray[zoneNum - 1];
	    });

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
		var pointSize = 3;
		var highlightR = 4.5;
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
			personInZone[i].floorNum = -1;
			for(var j = 0;j < routeRocrds10Days.length;j++){
				var routeRcords1Days = routeRocrds10Days[j].records;
				for(var k = 0;k < routeRcords1Days.length;k++){
					if(globalTime > routeRcords1Days[k].timestamp && globalTime < routeRcords1Days[k].endtime 
						&& routeRcords1Days[k].floor == floorNum){
						personInZone[i].floorNum = routeRcords1Days[k].floor;
						var zoneNum = +personArray[i].fixRecords[j].records[k]["zone"];
						if(!isNaN(zoneNum)){
							personInZone[i].formerZoneNum = +personInZone[i].zoneNum;
							personInZone[i].zoneNum = +personArray[i].fixRecords[j].records[k]["zone"];
						}
						break;
					}
				}
				/*if(k == routeRcords1Days.length){
					personInZone[i].formerZoneNum = +personInZone[i].zoneNum;
					personInZone[i].zoneNum = -1;
				}*/
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
			return d.zoneNum != -1 && d.zoneNum != null && d.zoneNum != d.formerZoneNum;
		}), function(d,i){
			return d.personName;
		});
		nodeSelection.enter()
		.append('circle')
		.attr('class','person-label')
		.attr('r', pointSize)
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
			if(d3.select(this).classed('click-highlight')){
				d3.select(this)
				.classed('click-highlight', false);
			}else{
				d3.select(this)
				.classed('click-highlight', true);
			}
		})
		.on('mouseover', function(d,i){
			d3.select(this)
			.classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.select(this)
			.classed('mouseover-highlight', false);
		});
		//改变node节点
		nodeSelection.transition()
		.duration(DURATION)
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
		.attr('stroke-width', 1)
		.attr('stroke', 'black')
		.attr('fill', 'none');
		$('.person-label').each(function() {
		    $(this).tipsy({
		        gravity: "s",
		        html:true,
		        title:function(){
		        	var d = this.__data__;
		            var content = d.personName +",f" + d.formerZoneNum + ",Z" +d.zoneNum + ',F' + d.floorNum;
		            return content;
		        },
		    });
		});
		//删除节点
		var nodeSelectionRemove = svg.selectAll('.person-label')
		.data(personInZone.filter(function(d){
			//return d.zoneNum != -1 && d.zoneNum != null;
			return d.floorNum != -1;
		}), function(d,i){
			return d.personName;
		})
		.exit()
		.remove();	
	},
	randomLocation: function(floorNum, zoonNum){
		var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
		var roomArray = floors_zone_set[floorNum][zoonNum];
		var length = roomArray.length;
		var randomRoomId = Math.floor(length * Math.random());
		var x = roomArray[randomRoomId].x;
		var y = roomArray[randomRoomId].y;
		var xLength = roomArray[randomRoomId].xLength;
		var yLength = roomArray[randomRoomId].yLength;
		var returnX = x + xLength * Math.random();
		var returnY = y + yLength * Math.random();
		return [returnX, returnY];
	},
	//传递控制全局的时间变量，绘制机器人进行移动的视图
	updateRobotView: function(divID, globalTime){
		var pointSize = 4;
		var robotData = DATA_CENTER.original_data['proxMobileOut-MC2.csv']; 
		var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var DURATION = 1000;
	    var threshold_show = 100000;
	   	var xScale = d3.scale.linear()
			.range([0, width])
			.domain([0, 190]);
		var yScale = d3.scale.linear()
			.range([0, height])
			.domain([0, 111]);
		var floorNum = DATA_CENTER.global_variable.selected_floor;
		var svg = d3.select("#floor-svg");
		for(var i = 0; i < robotData.length;i++){
			robotData[i]['robotTime'] = new Date(robotData[i]['timestamp']).getTime();
		}
		var renderNodeArray = [];
		var j = 0;
		for(var i = 0;i < robotData.length;i++){
			//if(globalTime > robotData[i].robotTime && globalTime < (robotData[i].robotTime + threshold_show) ){//
			renderNodeArray[i] = new Object();
			renderNodeArray[i].x = +robotData[i][" x"].replace(/\s+/g,"");
			renderNodeArray[i].floor = robotData[i][" floor"].replace(/\s+/g,"");
			renderNodeArray[i].y = +robotData[i][" y"].replace(/\s+/g,"");
			renderNodeArray[i].proxId = robotData[i][" prox-id"].replace(/\s+/g,"");
			//globalTime大于robotTime才会显示出来，否则不会显示出该节点
			renderNodeArray[i].time = +robotData[i].robotTime;
			//j++;
			//}
		}
		var transparencyScale = d3.scale.linear()
			.range([1, 0])
			.domain([0, threshold_show]);
		var robotNodeSelection = svg.selectAll('.robot-label')
			.data(renderNodeArray.filter(function(d,i){
				return d.floor == floorNum;
			}), function(d,i){
				return d.proxId;
			});
		robotNodeSelection.enter()
			.append('circle')
			.attr('class','robot-label')
			.attr('r',pointSize)
			.attr('cx', function(d,i){
				return xScale(d.x);
			})
			.attr('cy', function(d,i){
				return xScale(d.y);
			})
			.style("opacity", function(d,i){
				var transparency = 0;
				if(globalTime > d.time && globalTime < (d.time + threshold_show)){
					var timeGap = globalTime - d.time;
					transparency = transparencyScale(timeGap);
				}
				return transparency;
			});
		robotNodeSelection.transition()
			.duration(DURATION)
			.style("opacity", function(d,i){
				var transparency = 0;
				if(globalTime > d.time && globalTime < (d.time + threshold_show)){
					var timeGap = globalTime - d.time;
					transparency = transparencyScale(timeGap);
				}
				return transparency;
			});
		//删除node节点
		robotNodeSelection.exit().remove();
	}
}