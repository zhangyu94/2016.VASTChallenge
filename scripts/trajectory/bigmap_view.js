var bigmap_view = {
	bigmap_view_DIV_ID : "trajectory-bigmap",
	DISPLAYED_FLOOR_NUMBER : undefined,


	obsUpdate:function(message, data)
	{
		if (message == "display:bigmap_view")
        {
            $("#"+this.bigmap_view_DIV_ID).css("display","block");
            this.render(this.bigmap_view_DIV_ID,true);
        }
        if (message == "hide:bigmap_view")
        {
            $("#"+this.bigmap_view_DIV_ID).css("display","none");
        }
		var divID = this.bigmap_view_DIV_ID;
		if (message == "set:current_display_time"){
			var global_display_time = DATA_CENTER.global_variable.current_display_time;
			this.updateView(divID, global_display_time);
			//this.updateRobotView(divID, global_display_time);
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
			this.render(divID, selected_floor_number,true);	
			/*
			var selected_floor_set = DATA_CENTER.global_variable.selected_floor_set;
			var selected_floor = DATA_CENTER.global_variable.selected_floor;
			var set_length = selected_floor_set.length;
			this.render(divID, selected_floor,true);	
			*/
			//this.updateView(divID, 1464685493000);
		}
	},
	render:function(divID, floorNum, display_text)
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
	    //只有房间的json文件
	    var roomData = DATA_CENTER.derived_data['room.json'];
	    //对于整个房间的走廊进行划分的json文件
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
	    	var zoneNodeClass = 'zone-node-' + d.proxZone;
	    	if(!d3.select(this).classed('click-highlight')){
	    		d3.selectAll('.' + zoneClass)
	    		.classed('click-highlight', true);
	    		d3.selectAll('.' + zoneNodeClass)
	    		.classed('click-highlight', true);
	    	}else{
	    		d3.selectAll('.' + zoneClass)
	    		.classed('click-highlight', false);
	    		d3.selectAll('.' + zoneNodeClass)
	    		.classed('click-highlight', false);
	    	}
	    });
	    
	    /*roomG.append('text')
	    .attr('class', 'room-num-text')
	    .text(function(d,i){
	    	return d.doornum;
	    })
	    .attr('x',function(d,i){
	    	return xScale(d.x);
	    })
	    .attr('y',function(d,i){
	    	return yScale(d.y) + 15;
	    })
	    .attr('font-size', '4px');*/
	    //在房间上面增加zone的相关的信息
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
	    	var zoneClass = 'zone-' + d.proxZone;
	    	var zoneNodeClass = 'zone-node-' + d.proxZone;
	    	if(d3.select(this).classed('click-highlight')){
		    	d3.selectAll('.' + zoneClass)
		    	.classed('click-highlight', false);	 
		    	d3.selectAll('.' + zoneNodeClass)
	    		.classed('click-highlight', false);   		
	    	}else{
	    		d3.selectAll('.' + zoneClass)
		    	.classed('click-highlight', true);	 
		    	d3.selectAll('.' + zoneNodeClass)
	    		.classed('click-highlight', true); 
	    	}
	    });
	    
	    console.log("display",display_text)
	    if (display_text || (typeof(display_text)=="undefined"))
	    {
			singleroomG.append('text')
		    .attr('class', 'doornum-text')
		    .attr('x', function(d,i){
		    	var roomX = +d.x;
		    	return xScale(roomX + 1);
		    })
		    .attr('y', function(d,i){
		    	var roomY = +d.y;
		    	return yScale(roomY + 3);
		    })
		    .text(function(d,i){
		    	var text = "";
		    	if(d.doornum != undefined){
		    		text = d.doornum;
		    	}
		    	return text; 
		    });
		    singleroomG.append('text')
		    .attr('class', 'room-name-text')
		    .attr('x', function(d,i){
		    	var roomX = +d.x;
		    	var roomLengthX = +d.xlength;
		    	return xScale(roomX);
		    })
		    .attr('y', function(d,i){
		    	var roomY = +d.y;
		    	var roomLengthY = +d.ylength;
		    	return yScale(roomY + roomLengthY / 2);
		    })
		    .text(function(d,i){
		    	var text = "";
		    	if(d.name != undefined && d.name != 'Office'){
		    		text = d.name;
		    	}
		    	return text;
		    });
		}

	}, 
	//去掉房间的label
	removeRoomLabel:function(){
		//d3.selectAll('.room-num-text').remove();
		//d3.selectAll('.room-name-text').remove();
	},
	//传递控制全局的时间变量，并且对于绘制视图进行更新
	updateView: function(divID, globalTime){
		//存储当前的人在哪一个zone里面
		var self = this;
		var globalTime = +globalTime;
		var pointSize = 4;
		var highlightR = 4.5;
		var personData = DATA_CENTER.derived_data['person']; 
		var personArray = $.map(personData, function(value, index) {
		    return [value];
		});
		personArray.sort(function(person1, person2){
			if(person1.fixRecords[0]['prox-id'] > person2.fixRecords[0]['prox-id']){
				return 1
			}else if(person1.fixRecords[0]['prox-id'] < person2.fixRecords[0]['prox-id']){
				return -1;
			}else{
				return 0;
			}
		});
		var personInZone = DATA_CENTER.derived_data["personInZone"];
		var DURATION = 2000;
		var floorNum = this.DISPLAYED_FLOOR_NUMBER;

		for(var i = 0;i < personArray.length;i++){
            var routeRocrds10Days = personArray[i].fixRecords;
            personInZone[i].floorNum = -1;
            for(var j = 0;j < routeRocrds10Days.length;j++){
                    var timestamp = +new Date(routeRocrds10Days[j].timestamp).getTime();
                    var endtime = +new Date(routeRocrds10Days[j].endtime).getTime();
                    if(globalTime > timestamp && globalTime < endtime
                        && routeRocrds10Days[j].floor == floorNum){
                        personInZone[i].floorNum = routeRocrds10Days[j].floor;
                        var zoneNum = +personArray[i].fixRecords[j]["zone"];
                        if(!isNaN(zoneNum)){
                            personInZone[i].formerZoneNum = +personInZone[i].zoneNum;
                            personInZone[i].zoneNum = +zoneNum;
                            personInZone[i].timestamp = timestamp;
                            personInZone[i].endtime = endtime;
                        }
                    break;
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
		console.log(personInZone);
		//d3.selectAll("#"+divID).selectAll("*").remove();
		var svg = d3.select('#' + divID).select("#floor-svg");
		//增加node节点
		var nodeSelectionG = svg.selectAll('.person-label')
		.data(personInZone.filter(function(d){
			return d.zoneNum != -1 && d.zoneNum != null && d.zoneNum != d.formerZoneNum;
		}), function(d,i){
			return d.personName;
		})
		.enter()
		.append('g');
		nodeSelectionG.each(function(d,i){
			//判断在这个区域内是不是存在这个员工的办公室
			var personName = d.personName;
			var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
			var zoneNum = d.zoneNum;
			var indexZoneNum = zoneNum - 1;
			var indexFloorNum = floorNum - 1;
			var personOffice = self.transformPersonToRoom(personName);
			var roomArray = floors_zone_set[indexFloorNum][indexZoneNum];
			d.exitSelfOffice = false;
			d.exitSelfOfficeButReasonable = false;
			d.personOffice = -1;
			for(var k = 0;k < roomArray.length;k++){
				if(roomArray[k]['doornum'] == personOffice){
					d.exitSelfOffice = true;
					break;
				}
			}
			if(floorNum == 1){
				if(zoneNum == 2 || zoneNum == 5 || zoneNum == 6 || zoneNum == 4 || zoneNum == 3){
					d.exitSelfOfficeButReasonable = true;
				}
			}else if(floorNum == 2){
				if(zoneNum == 1 || zoneNum == 3 || zoneNum == 4 || zoneNum == 5 || zoneNum == 6 || zoneNum == 7 ){
					d.exitSelfOfficeButReasonable = true;
				}
			}else if(floorNum == 3){
				if(zoneNum == 4 || zoneNum == 5){
					d.exitSelfOfficeButReasonable = true;
				}
			}
		})
		.attr('class', 'person-label-g')
		.attr('x', function(d,i){
			var personName = d.personName;
			var zoneId = +d.zoneNum;
			var timestamp = +d.timestamp;
			var endtime = +d.endtime;
			self.randomXLocationFromZone(d, floorNum, zoneId, personName, timestamp, endtime);
			var nodeX = +d.returnX;
			var scaleNodeX = xScale(nodeX);
			d.currentNodeX = scaleNodeX;
			d.formerZoneId = zoneId;
			d.formerScaleNodeX = scaleNodeX;
			return scaleNodeX;
		})
		.attr('y', function(d,i){
			var nodeY = d.returnY;
			var scaleNodeY = yScale(nodeY);
			d.currentNodeY = scaleNodeY;
			d.formerScaleNodeY = scaleNodeY;
			return scaleNodeY;
		});
		var nodeSelectionCircle = nodeSelectionG.append('circle')
		.attr('class',function(d,i){
			return 'person-label ' + 'node-id-' + d.personName + ' zone-node-' + d.zoneNum; 
		})
		.attr('id', function(d,i){
			return 'circle-' + d.personName;
		})
		.attr('r', pointSize)
		.attr('cx', function(d,i){
			return d.currentNodeX;
		})
		.attr('cy', function(d,i){
			return d.currentNodeY;
		})
		.attr('fill', function(d,i){
			if(d.exitSelfOffice){
				return 'black';
			}else{
				return 'red';
			}
		})
		.on('click',function(d,i){
			if(d3.select(this).classed('click-highlight')){
				d3.select(this)
				.classed('click-highlight', false);
				d3.select('#text-' + d.personName)
				.attr('visibility', 'hidden');
			}else{
				d3.select(this)
				.classed('click-highlight', true);
				d3.select('#text-' + d.personName)
				.attr('visibility','visible');
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
		nodeSelectionText = nodeSelectionG.append('text', function(d,i){
			return d.personName;
		})
		.attr('class', 'node-text')
		.attr('id', function(d,i){
			return 'text-' + d.personName;
		})
		.attr('x', function(d,i){
			return d.currentNodeX;
		})
		.attr('y', function(d,i){
			return d.currentNodeY;
		})
		.attr('visibility', 'hidden')
		.text(function(d,i){
			return d.personName;
		});
		//改变node节点
		nodeSelectionCircle.transition()
		.duration(DURATION)
		.attr('cx', function(d,i){
			var zoneId = +d.zoneNum;
			var personName = d.personName;
			var timestamp = d.timestamp;
			var endtime = d.endtime;
			self.randomXLocationFromZone(d, floorNum, zoneId, personName, timestamp, endtime);
			var nodeX = d.returnX;
			var scaleNodeX = xScale(nodeX);
			d.afterScaleNodeX = scaleNodeX;
			d.afterZoneId = zoneId;
			return scaleNodeX;
		})
		.attr('cy', function(d,i){
			var nodeY = d.returnY;
			var scaleNodeY = yScale(nodeY);
			d.afterScaleNodeY = scaleNodeY;
			var linkClassName = 'begin-' + d.formerZoneId + '-end-' + d.afterZoneId;
			d.formerScaleNodeX = d.afterScaleNodeX;
			d.formerScaleNodeY = d.afterScaleNodeY;
			d3.select('#text-' + d.personName).attr('y',scaleNodeY);
			return scaleNodeY;
		})
		.attr('fill', function(d,i){
			if(d.exitSelfOffice){
				return 'black';
			}else{
				return 'red';
			}
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
		.each('end', function(d,i){
			var scaleNodeX = d3.select(this).attr('cx');
			var scaleNodeY = d3.select(this).attr('cy');
			d3.select('#text-' + d.personName).attr('x', scaleNodeX);
			d3.select('#text-' + d.personName).attr('y', scaleNodeY);
		});
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
		var nodeTextRemove = svg.selectAll('.node-text')
		.data(personInZone.filter(function(d){
			//return d.zoneNum != -1 && d.zoneNum != null;
			return d.floorNum != -1;
		}), function(d,i){
			return d.personName;
		})
		.exit()
		.remove();
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
	randomXLocationFromZone: function(d, floorNum, zoneNum, personName, timestamp, endtime){
		var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
		var indexZoneNum = zoneNum - 1;
		var indexFloorNum = floorNum - 1;
		var roomArray = floors_zone_set[indexFloorNum][indexZoneNum];
		var length = roomArray.length;
		var officeNum = -1;
		var person2room = DATA_CENTER.derived_data["person2room.csv"];
		for(var i = 0;i < person2room.length;i++){
			if(personName == person2room[i]["prox-id"]){
				officeNum = person2room[i]["Office"];
				break;
			}
		}
		var x = 0, xLength = 0, y = 0, yLength = 0;
		var exitSelfOffice = false;
		var returnX = 0, returnY = 0;
		//
		var robotData = DATA_CENTER.original_data['proxMobileOut-MC2.csv'];
		for(var i = 0;i < robotData.length;i++){
			var robotTimeEnd = +robotData[i].robotTime;
			var robotTimeBegin = +robotData[i].robotTime - 60000;//一分钟之前的时间
			var robotFloorNum = +robotData[i].floorNum;
			var robotX = +robotData[i].x;
			var robotY = +robotData[i].y;
			var robotProxId = robotData[i].proxId;
			if((robotTimeEnd > timestamp) && (robotTimeEnd < endtime) 
				&& (floorNum == robotFloorNum) && (personName == robotProxId)){
				d.isAccurateLoc = true;
				d.returnX = robotX;
				d.returnY = robotY;
				return;
			}

		}
		//---------------------------------------------
		for(var k = 0;k < length;k++){
			if(roomArray[k]['doornum'] == officeNum){
				exitSelfOffice = true;
				break;
			}
		}
		if(exitSelfOffice){
			for(var k = 0;k < length;k++){
				if(roomArray[k]['doornum'] == officeNum){
					x = +roomArray[k].x;
					xLength = +roomArray[k].xlength;
					y = +roomArray[k].y;
					yLength = +roomArray[k].ylength;
					returnX = x + Math.floor(xLength * Math.random());
					returnY = y + Math.floor(yLength * Math.random());
				}
			}
		}else{
			if(floorNum == 2){
				if(zoneNum == 1){
					//房间2365中的任意一点
					x = 48, xLength = 30, y = 95, yLength = 16;
				}else if(zoneNum == 6){
					//房间2700中的任意一点
					x = 75, xLength = 44, y = 66, yLength = 24;
				}else if(zoneNum == 7){
					//2690
					x = 124, xLength = 26, y = 46, yLength = 20;
				}
			}else if(floorNum == 3){
				if(zoneNum == 1){
					//3300
					x = 0, xLength = 16, y = 87, yLength = 24;
				}else if(zoneNum == 2){
					//3700
					x = 75, xLength = 44, y = 66, yLength = 24;
				}
			}else{
				var randomRoomId = Math.floor(length * Math.random());
				x = +roomArray[randomRoomId].x;
				xLength = +roomArray[randomRoomId].xlength;
				y = +roomArray[randomRoomId].y;
				yLength = +roomArray[randomRoomId].ylength;
			}
			returnX = x + Math.floor(xLength * Math.random());
			returnY = y + Math.floor(yLength * Math.random());
		}
		d.returnX = returnX;
		d.returnY = returnY;
		return;
	},
	randomYLocationFromZone: function(floorNum, zoneNum, personName, timestamp, endtime){
		var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
		var indexZoneNum = zoneNum - 1;
		var indexFloorNum = floorNum - 1;
		var roomArray = floors_zone_set[indexFloorNum][indexZoneNum];
		var length = roomArray.length;
		var officeNum = -1;
		var person2room = DATA_CENTER.derived_data["person2room.csv"];
		for(var i = 0;i < person2room.length;i++){
			if(personName == person2room[i]["prox-id"]){
				officeNum = person2room[i]["Office"];
				break;
			}
		}
		var y = 0, yLength = 0;
		var exitSelfOffice = false;
		var returnY = 0;
		for(var k = 0;k < length;k++){
			if(roomArray[k]['doornum'] == officeNum){
				exitSelfOffice = true;
				break;
			}
		}
		if(exitSelfOffice){
			for(var k = 0;k < length;k++){
				if(roomArray[k]['doornum'] == officeNum){
					y = +roomArray[k].y;
					yLength = +roomArray[k].ylength;
					returnY = y + Math.floor(yLength * Math.random());
				}
			}
		}else{
			if(floorNum == 2){
				if(zoneNum == 1){
					//房间2365中的任意一点
					y = 95, yLength = 16;
				}else if(zoneNum == 6){
					//房间2700中的任意一点
					y = 66, yLength = 24;
				}else if(zoneNum == 7){
					//2690
					y = 46, yLength = 20;
				}
			}else if(floorNum == 3){
				if(zoneNum == 1){
					//3300
					y = 87, yLength = 24;
				}else if(zoneNum == 2){
					//3700
					y = 66, yLength = 24;
				}
			}else{
				var randomRoomId = Math.floor(length * Math.random());
				y = +roomArray[randomRoomId].y;
				yLength = +roomArray[randomRoomId].ylength;
			}
			returnY = y + Math.floor(yLength * Math.random());
		}
		return returnY;
	},
	/*randomXLocationFromRoom: function(indexFloorNum, indexZoneNum, officeNum){
		var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
		var roomArray = floors_zone_set[indexFloorNum][indexZoneNum];
		var returnY == 
		for(var i = 0;i < officeNum;i++){
			if(roomArray[i]['doornum'] == officeNum){
				var returnY = y + Math.floor(yLength * Math.random());
			}
		}
	},
	randomYLocationFromRoom: function(indexFloorNum, indexZoneNum, officeNum){
		var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
		var roomArray = floors_zone_set[indexFloorNum][indexZoneNum];
		for(var i = 0;i < officeNum;i++){
			if(roomArray[i]['doornum'] == officeNum){

			}
		}
	},*/
	transformPersonToRoom: function(personName){
		var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
		var person2room = DATA_CENTER.derived_data["person2room.csv"];
		var officeNum = -1;//officeNum = -1表示的是员工没有这个办公室
		for(var i = 0;i < person2room.length;i++){
			if(personName == person2room[i]["prox-id"]){
				officeNum = person2room[i]["Office"];
				break;
			}
		}
		return officeNum;
	},
	//传递控制全局的时间变量，绘制机器人进行移动的视图
	updateRobotView: function(divID, globalTime){
		var pointSize = 4;
		var robotData = DATA_CENTER.original_data['proxMobileOut-MC2.csv'];
		console.log(robotData);
		var singleroomData = DATA_CENTER.derived_data['singleroom.json'];
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
		var renderNodeArray = [];
		var j = 0;
		for(var i = 0;i < robotData.length;i++){
			var floorNumRobot = robotData[i][" floor"].replace(/\s+/g,"");
			if((globalTime > (robotData[i].robotTime))&&(globalTime < (robotData[i].robotTime + threshold_show))
				&& (floorNumRobot == floorNum)){//floorNum是从全局进行选择的层数
				renderNodeArray[j] = new Object();
				var xLoc = renderNodeArray[j].x = +robotData[i][" x"].replace(/\s+/g,"");
				renderNodeArray[j].floor = floorNumRobot;
				var yLoc = renderNodeArray[j].y = +robotData[i][" y"].replace(/\s+/g,"");
				renderNodeArray[j].proxId = robotData[i][" prox-id"].replace(/\s+/g,"");
				renderNodeArray[j].proxZone = 0;
				for(var k = 0;k < singleroomData.length;k++){
					var room = singleroomData[k];
					var roomX = +room.x;
					var roomY = +room.y;
					var lengthX = +room.xlength;
        			var lengthY = +room.ylength;
        			var roomFloor = +room.floor;
        			if((xLoc >= roomX) && (xLoc <= roomX + lengthX) && (yLoc >= roomY) && (yLoc <= roomY + lengthY) 
        				&& (roomFloor == floorNumRobot)){
        				renderNodeArray[j].proxZone = room.proxZone;
        				break;
        			}
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
			var self = d;
			var nodeZoneId = +d.proxZone;
			var nodeProxId = d.proxId;
			var nodeZoneX = d.x;
			var nodeZoneY = d.y;
			//robot检测到的员工所在的位置
			var nodeProxIdClass = 'node-id-' + nodeProxId;
			var zoneNodeSelection = d3.selectAll('.' + nodeProxIdClass);
			if(zoneNodeSelection != undefined){
				if(zoneNodeSelection[0] != undefined){
					if(zoneNodeSelection[0].length > 0){
							var proxNodeClass = zoneNodeSelection.attr('class');
							var zoneIdArray = proxNodeClass.split(' ');
							var zoneIdArrayLength = zoneIdArray.length;
							//按照ProxCard检测到的员工所在的zone
							var zoneId = +zoneIdArray[zoneIdArrayLength - 1].split('-')[2];
							if(zoneId == nodeZoneId){
								//检测到的区域一致,没有异常
								d3.selectAll('.' + nodeProxIdClass)
								.attr('class', 'robot-node')
								.attr('cx', function(d,i){
									return xScale(self.x);
								})
								.attr('cy', function(d,i){
									return yScale(self.y);
								})
								.transition()
								.duration(2000)
								.remove();
								/*svg.append('line')
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
								.remove();*/
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