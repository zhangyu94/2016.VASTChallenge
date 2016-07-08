var bigmap_view = {
	bigmap_view_DIV_ID : "trajectory-bigmap",
	DISPLAYED_FLOOR_NUMBER : undefined,


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
			if (selected_floor_set.length > 1)
			{
				console.warn("more than 1 selected floor");
			}
			if (typeof(selected_floor_set[0])!=undefined)
			{
				var selected_floor_number = DATA_CENTER.GLOBAL_STATIC.floor_name_number_mapping[selected_floor_set[0]];
			}
			else
			{
				var selected_floor_number = 1;
			}
			this.DISPLAYED_FLOOR_NUMBER = selected_floor_number;
			this.render(divID, selected_floor_number);	
			/*
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			var selected_floor = DATA_CENTER.global_variable.selected_floor;
			var set_length = selected_floor_set.length;
			this.render(divID, selected_floor);	
			*/
			//this.updateView(divID, 1464685493000);
		}
	},
	render:function(divID, floorNum)
	{
		var self = this;
		var colorArray = ['#EEEEEE', '#F3E4EE', '#FFF4CF', '#F8F7EB', '#F6ECF6', '#EDF7FA', '#FFEEEE', '#D5F4EF'];
		//var colorArray = ['#cccccc', '#f1e2cc', '#fff2ae', '#e6f5c9', '#f4cae4', '#cbd5e8', '#fdcdac', '#b3e2cd'];
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
	    	var zoneClass = 'single-room-zone-' + d.proxZone;
	    	if(!d3.select(this).classed('click-highlight')){
	    		d3.selectAll('.' + zoneClass)
	    		.classed('click-highlight', true);
	    	}else{
	    		d3.selectAll('.' + zoneClass)
	    		.classed('click-highlight', false);
	    	}
	    	var zoneNodeClass = 'zone-node-' + d.proxZone;
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
			return 'single-room ' + 'single-room-zone-'+d.proxZone + ' zone-' + d.proxZone;
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
	    	var zoneClass = 'single-room-zone-' + d.proxZone;
	    	if(d3.select(this).classed('click-highlight')){
		    	d3.selectAll('.' + zoneClass)
		    	.classed('click-highlight', false);	    		
	    	}else{
	    		d3.selectAll('.' + zoneClass)
		    	.classed('click-highlight', true);	  
	    	}
	    	var zoneNodeClass = 'zone-node-' + d.proxZone;
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
		var pointSize = 3;
		var highlightR = 4.5;
		var personData = DATA_CENTER.derived_data['person.json']; 
		var personArray = $.map(personData, function(value, index) {
		    return [value];
		});
		var personInZone = DATA_CENTER.derived_data["personInZone"];
		var DURATION = 2000;
		//var floorNum = DATA_CENTER.global_variable.selected_floor;
		var floorNum = this.DISPLAYED_FLOOR_NUMBER;

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
		var svg = d3.select('#' + divID).select("#floor-svg");
		//增加node节点
		var nodeSelection = svg.selectAll('.person-label')
		.data(personInZone.filter(function(d){
			return d.zoneNum != -1 && d.zoneNum != null && d.zoneNum != d.formerZoneNum;
		}), function(d,i){
			return d.personName;
		});
		nodeSelection.each(function(d,i){
			console.log(d);
		});
		nodeSelection.each(function(d,i){
			console.log('find same robot node');
			var self = d;
			var nodeProxId = d.proxId;
			var nodeProxIdClass = 'node-id-' + nodeProxId;
			var zoneNodeSelection = d3.selectAll('.' + nodeProxIdClass);
			if(zoneNodeSelection != undefined){
				if(zoneNodeSelection[0] != undefined){
					if(zoneNodeSelection[0].length > 0){
							console.log(zoneNodeSelection);
							svg.append('line')
							.attr('class','same-id-link')
							.attr('x1', function(d,i){
								return zoneNodeSelection.attr('cx');
							})
							.attr('y1', function(d,i){
								return zoneNodeSelection.attr('cy');
							})
							.attr('x2', function(d,i){
								return xScale(self.x);
							})
							.attr('y2', function(d,i){
								return yScale(self.y);
							})
							.transition()
							.duration(1000)
							.remove();
						}
					}
				}
			console.log(zoneNodeSelection);
		});
		nodeSelection.enter()
		.append('circle')
		.attr('class',function(d,i){
			return 'person-label ' + 'node-id-' + d.personName + ' zone-node-' + d.zoneNum; 
		})
		.attr('r', pointSize)
		.attr('cx', function(d,i){
			var zoneId = +d.zoneNum;
			var nodeX = +self.randomXLocation(floorNum, zoneId);
			var scaleNodeX = xScale(nodeX);
			d.formerZoneId = zoneId;
			d.formerScaleNodeX = scaleNodeX;
			return scaleNodeX;
		})
		.attr('cy', function(d,i){
			var zoneId = +d.zoneNum;
			var nodeY = self.randomYLocation(floorNum, zoneId);
			var scaleNodeY = yScale(nodeY);
			d.formerScaleNodeY = scaleNodeY;
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
		nodeSelection
		.transition()
		.duration(DURATION)
		.attr('cx', function(d,i){
			var zoneId = +d.zoneNum;
			var nodeX = self.randomXLocation(floorNum, zoneId);
			var scaleNodeX = xScale(nodeX);
			d.afterScaleNodeX = scaleNodeX;
			d.afterZoneId = zoneId;
			return scaleNodeX;
		})
		.attr('cy', function(d,i){
			var zoneId = +d.zoneNum;
			var nodeY = self.randomYLocation(floorNum, zoneId);
			var scaleNodeY = yScale(nodeY);
			d.afterScaleNodeY = scaleNodeY;
			var linkClassName = 'begin-' + d.formerZoneId + '-end-' + d.afterZoneId;
			console.log(linkClassName);
			svg.append('line')
				.attr('class', function(d,i){
					return 'node-link-line ' + linkClassName;
				})
				.attr('x1', d.formerScaleNodeX)
				.attr('y1', d.formerScaleNodeY)
				.attr('x2', d.afterScaleNodeX)
				.attr('y2', d.afterScaleNodeY)
				.transition()
				.duration(2000)
				.remove();
			d.formerScaleNodeX = d.afterScaleNodeX;
			d.formerScaleNodeY = d.afterScaleNodeY;
			return scaleNodeY;
		})
		.each(function(d,i){
		})
		.attr('class', function(d,i){
			if(d3.select(this).classed('click-highlight')){
				return 'click-highlight person-label ' + 'node-id-' + d.personName + ' zone-node-' + d.zoneNum; 
			}else{
				return 'person-label ' + 'node-id-' + d.personName + ' zone-node-' + d.zoneNum; 
			}
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
		var robotData = DATA_CENTER.derived_data['proxMobileOut-MC2-WithProxId.json'];
		console.log(robotData); 
		var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var threshold_show = 60000;//5 mins的时间间隔
	    var DURATION = 2000;
	   	var xScale = d3.scale.linear()
			.range([0, width])
			.domain([0, 190]);
		var yScale = d3.scale.linear()
			.range([0, height])
			.domain([0, 111]);
		var floorNum = this.DISPLAYED_FLOOR_NUMBER;
		var svg = d3.select('#' + divID).select("#floor-svg");
		for(var i = 0; i < robotData.length;i++){
			robotData[i]['robotTime'] = new Date(robotData[i]['timestamp']).getTime();
		}
		var renderNodeArray = [];
		var j = 0;
		for(var i = 0;i < robotData.length;i++){
			var floorNum = robotData[i][" floor"].replace(/\s+/g,"");
			if((globalTime > (robotData[i].robotTime))&&(globalTime < (robotData[i].robotTime + threshold_show))
				&&(floorNum == 2)){
				renderNodeArray[j] = new Object();
				renderNodeArray[j].x = +robotData[i][" x"].replace(/\s+/g,"");
				renderNodeArray[j].floor = robotData[i][" floor"].replace(/\s+/g,"");
				renderNodeArray[j].y = +robotData[i][" y"].replace(/\s+/g,"");
				renderNodeArray[j].proxId = robotData[i][" prox-id"].replace(/\s+/g,"");
				if(robotData[i]['proxZone']!=undefined){
					renderNodeArray[j].proxZone = +robotData[i]['proxZone'].replace(/\s+/g,"");
				}else{
					renderNodeArray[j].proxZone = 0;
				}

				//globalTime大于robotTime才会显示出来，否则不会显示出该节点
				renderNodeArray[j].time = +robotData[i].robotTime;
				j++;
			}
		}
		var transparencyScale = d3.scale.linear()
			.range([1, 0])
			.domain([0, threshold_show]);
		var robotNodeSelection = svg.selectAll('.robot-label')
			.data(renderNodeArray, function(d,i){
				return d.proxId;
			});
		robotNodeSelection.each(function(d,i){
			console.log('find same robot node');
			var self = d;
			var nodeZoneId = +d.proxZone;
			var nodeProxId = d.proxId;
			var nodeZoneX = d.x;
			var nodeZoneY = d.y;
			console.log(d);
			//robot检测到的员工所在的位置
			console.log(nodeZoneId);
			var nodeProxIdClass = 'node-id-' + nodeProxId;
			var zoneNodeSelection = d3.selectAll('.' + nodeProxIdClass);
			if(zoneNodeSelection != undefined){
				if(zoneNodeSelection[0] != undefined){
					if(zoneNodeSelection[0].length > 0){
							console.log(zoneNodeSelection);
							var proxNodeClass = zoneNodeSelection.attr('class');
							var zoneIdArray = proxNodeClass.split(' ');
							var zoneIdArrayLength = zoneIdArray.length;
							//按照ProxCard检测到的员工所在的zone
							var zoneId = +zoneIdArray[zoneIdArrayLength - 1].split('-')[2];
							console.log(zoneId +',' + nodeZoneId);
							if(zoneId == nodeZoneId){
								//检测到的区域一致,没有异常
								d3.selectAll('.' + nodeProxIdClass)
								.transition()
								.duration(2000)
								.attr('cx', function(d,i){
									return xScale(self.x);
								})
								.attr('cy', function(d,i){
									return yScale(self.y);
								});
								svg.append('line')
								.attr('class',function(d,i){
									//检测到的区域不一致，存在异常
									return 'same-id-link';
								})
								.attr('x1', function(d,i){
									return zoneNodeSelection.attr('cx');
								})
								.attr('y1', function(d,i){
									return zoneNodeSelection.attr('cy');
								})
								.attr('x2', function(d,i){
									return xScale(self.x);
								})
								.attr('y2', function(d,i){
									return yScale(self.y);
								})
								.transition()
								.duration(1000)
								.remove();
							}else{
								svg.append('line')
								.attr('class',function(d,i){
									//检测到的区域不一致，存在异常
									return 'not-same-id-link';
								})
								.attr('x1', function(d,i){
									return zoneNodeSelection.attr('cx');
								})
								.attr('y1', function(d,i){
									return zoneNodeSelection.attr('cy');
								})
								.attr('x2', function(d,i){
									return xScale(self.x);
								})
								.attr('y2', function(d,i){
									return yScale(self.y);
								})
								.transition()
								.duration(1000)
								.remove();
							}	
						}
					}
				}
			console.log(zoneNodeSelection);
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
				return yScale(d.y);
			})
			.style("opacity", function(d,i){
				var transparency = 0;
				var timeGap = Math.abs(globalTime - d.time);
				transparency = transparencyScale(timeGap);
				console.log(transparency);
				return transparency;
			});
		robotNodeSelection.transition()
			.duration(DURATION)
			.style("opacity", function(d,i){
				var transparency = 0;
				var timeGap = Math.abs(globalTime - d.time);
				transparency = transparencyScale(timeGap);
				return transparency;
			});
		$('.robot-label').each(function() {
		    $(this).tipsy({
		        gravity: "s",
		        html:true,
		        title:function(){
		        	var d = this.__data__;
		            var content = 'Person:' + d.proxId + ",Z" +d.proxZone + ',F' + d.floor;
		            return content;
		        },
		    });
		});
		//删除node节点
		robotNodeSelection.exit().remove();

	}
}