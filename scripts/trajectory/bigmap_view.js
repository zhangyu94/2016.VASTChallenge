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
		var self = this;
		var colorArray = ['#cccccc', '#f1e2cc', '#fff2ae', '#e6f5c9', '#f4cae4', '#cbd5e8', '#fdcdac', '#b3e2cd'];
		d3.selectAll("#"+divID).selectAll("*").remove();
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")
	                .attr("id", "floor-svg")
	                .attr('width', width)
	                .attr('height', height);

	    var roomData = DATA_CENTER.derived_data['room.json'];
	    var singleroomData = DATA_CENTER.derived_data['singleroom.json'];
	    console.log(singleroomData);

	    var xScale = d3.scale.linear()
			.range([0, width])
			.domain([0, 190]);

		var yScale = d3.scale.linear()
			.range([0, height])
			.domain([0, 111]);
		//在楼层中绘制zone, zone是由多个不同的room使用相同的颜色拼接得到
	    var roomG = svg.selectAll('.room')
	    .data(roomData.filter(function(d){
			return d.floor == floorNum && d.x != null && d.xlength != "" && d.proxZone != undefined;
		}))
	    .enter()
	    .append('g')
	    .attr('class', 'room');

	    roomG.append('rect')
	    .attr('class',function(d,i){
	    	return 'room-rect ' + 'zone-'+d.proxZone; 
	    })
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
	    })
	    .on('mouseover',function(d,i){
	    	var zoneClass = 'zone-' + d.proxZone;
	    	d3.selectAll('.' + zoneClass)
	    	.classed('mouseover-highlight', true);
	    })
	    .on('mouseout', function(d,i){
	    	var zoneClass = 'zone-' + d.proxZone;
	    	d3.selectAll('.' + zoneClass)
	    	.classed('mouseover-highlight', false);
	    })
	    .on('click', function(d,i){
	    	var zoneClass = 'zone-' + d.proxZone;
	    	if(!d3.select(this).classed('click-highlight')){
	    		d3.selectAll('.' + zoneClass)
	    		.classed('click-highlight', true);
	    	}else{
	    		d3.selectAll('.' + zoneClass)
	    		.classed('click-highlight', false);
	    	}
	    	var zoneNodeClass = 'zone-node-' + d.proxZone;
	    	console.log(zoneNodeClass);
	    	d3.selectAll('.' + zoneNodeClass)
	    	.classed('click-highlight', true);
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
	    //在房间上面增加zone的相关的信息
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
	    //
	   var singleroomG = svg.selectAll('.single-room')
		.data(singleroomData.filter(function(d){
			return d.floor == floorNum && d.x != null;
		}))
		.enter()
		.append('g')
		.attr('class', 'single-room-g');

		singleroomG.append('rect')
		.attr('class', function(d,i){
			return 'single-room ' + 'zone-'+d.proxZone;
		})
		.attr('id', function(d,i){
			return 'room-' + d.doornum;
		})
		.attr('x', function(d,i){
			return xScale(d.x);
		})
		.attr('y', function(d,i){
			return yScale(d.y);
		})
		.attr('width', function(d,i){
			return xScale(d.xlength);
		})
		.attr('height', function(d,i){
			return yScale(d.ylength);
		})
		.attr('fill', function(d,i){
			var zoneNum = +d.proxZone;
			return colorArray[zoneNum - 1];
		})
		.attr('stroke', "black")
	 	.on('mouseover',function(d,i){
	    	var zoneClass = 'zone-' + d.proxZone;
	    	d3.selectAll('.' + zoneClass)
	    	.classed('mouseover-highlight', true);
	    })
	    .on('mouseout', function(d,i){
	    	var zoneClass = 'zone-' + d.proxZone;
	    	d3.selectAll('.' + zoneClass)
	    	.classed('mouseover-highlight', false);
	    })
	    .on('click', function(d,i){
	    	var zoneClass = 'zone-' + d.proxZone;
	    	if(d3.select(this).classed('click-highlight')){
		    	d3.selectAll('.' + zoneClass)
		    	.classed('click-highlight', false);	    		
	    	}else{
	    		d3.selectAll('.' + zoneClass)
		    	.classed('click-highlight', true);	  
	    	}
	    	var zoneNodeClass = 'zone-node-' + d.proxZone;
	    	console.log(zoneNodeClass);
	    	d3.selectAll('.' + zoneNodeClass)
	    	.classed('click-highlight', true);
	    });
	  	//删除zone文字
	  	d3.selectAll('.room-name-text').remove();
	}, 
	//去掉房间的label
	removeRoomLabel:function(){
		d3.selectAll('.room-num-text').remove();
		d3.selectAll('.room-name-text').remove();
	},
	//传递控制全局的时间变量，并且对于绘制视图进行更新
	updateView: function(divID, globalTime){
		//存储当前的人在哪一个zone里面
		var self = this;
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
		.attr('class',function(d,i){
			return 'person-label ' + 'zone-node-' + d.zoneNum; 
		})
		.attr('r', pointSize)
		.attr('cx', function(d,i){
			var zoneId = +d.zoneNum;
			var nodeX = +self.randomXLocation(floorNum, zoneId);
			return xScale(nodeX);
		})
		.attr('cy', function(d,i){
			var zoneId = +d.zoneNum;
			var nodeY = self.randomYLocation(floorNum, zoneId);
			return yScale(nodeY);
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
			var zoneId = +d.zoneNum;
			var nodeX = self.randomXLocation(floorNum, zoneId);
			return xScale(nodeX);
		})
		.attr('cy', function(d,i){
			var zoneId = +d.zoneNum;
			var nodeY = self.randomYLocation(floorNum, zoneId);
			return yScale(nodeY);
		})
		.attr('class', function(d,i){
			return 'person-label ' + 'zone-node-' + d.zoneNum; 
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
	randomXLocation: function(floorNum, zoneNum){
		var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
		var indexZoneNum = zoneNum - 1;
		var indexFloorNum = floorNum - 1;
		var roomArray = floors_zone_set[indexFloorNum][indexZoneNum];
		var length = roomArray.length;
		var randomRoomId = Math.floor(length * Math.random());
		var x = +roomArray[randomRoomId].x;
		var xLength = +roomArray[randomRoomId].xlength;
		var returnX = x + Math.floor(xLength * Math.random());
		return returnX;
	},
	randomYLocation: function(floorNum, zoneNum){
		var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
		var indexZoneNum = zoneNum - 1;
		var indexFloorNum = floorNum - 1;
		var roomArray = floors_zone_set[indexFloorNum][indexZoneNum];
		var length = roomArray.length;
		var randomRoomId = Math.floor(length * Math.random());
		var y = +roomArray[randomRoomId].y;
		var yLength = +roomArray[randomRoomId].ylength;
		var returnY = y + Math.floor(yLength * Math.random());
		return returnY;
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

		var robotNodeG = robotNodeSelection.enter()
			.append('g')
			.attr('x', function(d,i){
				return xScale(d.x);
			})
			.attr('y', function(d,i){
				return yScale(d.y);
			});

		robotNodeG.append('circle')
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
		robotNodeG.append('text')
			.text(function(d,i){
				return d.timestamp;
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