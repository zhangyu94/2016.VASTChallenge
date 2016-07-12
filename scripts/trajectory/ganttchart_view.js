var ganttchart_view = {
	ganttchart_view_DIV_ID : "trajectory-ganttchart",


	root:null,
	width:null,
	height:null,
	personData:null,
	selectPID:null,
	zoneColorScale:null,
	obsUpdate:function(message, data)
	{
		var self = this;
		//console.log(message);
		//console.log('dataFormat')
		//console.log(data)
		if (message == "display:ganttchart_view")
		{
		    $("#"+this.ganttchart_view_DIV_ID).css("display","block");
		    this.render(this.ganttchart_view_DIV_ID);
		}

		if (message == "hide:ganttchart_view")
		{
		    $("#"+this.ganttchart_view_DIV_ID).css("display","none");
		}
		if(message == 'set:selected_card' || message == 'set:selected_card_set')
		{
			var selectedCard = DATA_CENTER.global_variable.selected_card;
			if(selectedCard != undefined){
				self.updateSelectPeople(selectedCard);
			}
		}
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove();
		this.root = $("#"+divID);
		this.root.append("<div id='trajectory-ganntchart-idlist'></div><div id='trajectory-ganntchart-hist'></div><div id='trajectory-ganntchart-main'></div>" );
		this.width  = $("#"+divID).width();
		this.height  = $("#"+divID).height();
		this.personData = DATA_CENTER.derived_data["person.json"];
		this.person = DATA_CENTER.derived_data["person"];
		console.log(this.personData);
		// console.log(width);
		this.make_IDList("trajectory-ganntchart-idlist");
		this.make_hist("trajectory-ganntchart-hist");
		this.make_ganttchart("trajectory-ganntchart-main");
		// var svg = d3.select("#"+divID).append("svg")
		//             .attr("class","mainsvg")
	},
	make_IDList:function(divID) {
		d3.select("#"+divID).selectAll("*").remove();
		var idList = $("#"+ divID);
		var ids = Object.keys(this.personData);
		var self = this;
		idList.append("<div id='trajectory-ganntchart-idlist-head'></div><div id='trajectory-ganntchart-idlist-body'></div>" );
		$("#trajectory-ganntchart-idlist-head").append("<p class=\'view-title\'>prox-id</p>");
		var body = $("#trajectory-ganntchart-idlist-body");
		// console.log(ids);
		ids.sort();

		var pIDs = d3.select("#trajectory-ganntchart-idlist-body").selectAll(".pID").data(ids)
		 .enter().append("div").attr("class","pID");

		 pIDs.html(function(d) {
		 	return d;
		 });

		 pIDs.on("click", function(d) {
		 	self.updateSelectPeople(d);
		 	d3.selectAll(".pID").classed("selected", false);
		 	d3.select(this).classed("selected",true);
		 })

		 pIDs.on("mouseover",function(d) {
		 	d3.select(this).classed("hover",true);
		 });
		 pIDs.on("mouseout",function(d) {
		 	d3.select(this).classed("hover",false);
		 });
	},
	make_hist:function(divID) {
		d3.select("#"+divID).selectAll("*").remove();
		var histDiv = $("#"+divID);
		histDiv.append("<div id='trajectory-ganntchart-hist-head'></div><div id='trajectory-ganntchart-hist-body'></div>");
		this.update_hist();
	},
	update_hist:function() {
		var self = this;
		var id = this.selectPID;

		d3.select("#trajectory-ganntchart-hist-head").selectAll("*").remove();
		if(id != null) {
			$("#trajectory-ganntchart-hist-head").append("<p class=\'view-title\'>" +  id + "</p>");
			var  margin = { top: 0, right: 20, bottom: 0, left: 40 };
			d3.select("#trajectory-ganntchart-hist-body").selectAll("*").remove();

			var w  = $("#trajectory-ganntchart-hist-body").width() - margin.left - margin.right;
			var h  = $("#trajectory-ganntchart-hist-body").height() - margin.bottom - margin.top;
			var svg = d3.select("#trajectory-ganntchart-hist-body").append("svg")
			    .attr("width", w + margin.left + margin.right)
			    .attr("height", h + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform",
			          "translate(" + margin.left + "," + margin.top + ")");

			var histData = this.personData[id]['zoneDuration'];
			// console.log(histData);
			var y = d3.scale.ordinal().rangeRoundBands([0, h], .05)
				.domain(histData.map(function(d,i){return i;}));
			var x = d3.scale.linear().range([10,w]).domain([0, d3.max(histData, function(d) { return d.duration; })]);

			var zones = histData.map(function(d) {return d.fz});
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");



			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickValues(zones);

			// svg.append("g")
			//       .attr("class", "x axis")
			//       .attr("transform", "translate(0," + h + ")")
			//       .call(xAxis);

			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis);


			svg.selectAll("histBar")
			      .data(histData)
			    .enter().append("rect")
			      .attr("x", function(d) { return 0; })
			      .attr("height", y.rangeBand())
			      .attr("y", function(d,i) { return y(i); })
			      .attr("width", function(d) { return x(d.duration); })
			      .attr("fill", function(d){
			      	// console.log(self);
			      	return self.zoneColorScale(d.fz)
			      })
			      .attr("class","histBar");

		}
	},
	make_ganttchart:function(divID) {
		d3.select("#"+divID).selectAll("*").remove();
		var ganttDiv = $("#"+divID);
		ganttDiv.append("<div id='trajectory-ganntchart-main-head'></div><div id='trajectory-ganntchart-main-body'></div>");
	},
	update_ganttchart:function() {
		var self = this;
		var id = this.selectPID;
		if(id != null) {
			var chartData = this.person[id]['fixRecords'];
			// console.log(chartData);
			// console.log(chartData);
			var  margin = { top: 10, right: 40, bottom: 20, left: 40 };
			d3.select("#trajectory-ganntchart-main-body").selectAll("*").remove();

			var w  = $("#trajectory-ganntchart-main-body").width() - margin.left - margin.right;
			var h  = $("#trajectory-ganntchart-main-body").height() - margin.bottom - margin.top;
			var svg = d3.select("#trajectory-ganntchart-main-body").append("svg")
			    .attr("width", w + margin.left + margin.right)
			    .attr("height", h + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform",
			          "translate(" + margin.left + "," + margin.top + ")");


			var y2 = d3.scale.linear().range([0, h])
				.domain([0,DATES.length]);
			var x = d3.scale.linear().range([0,w]).domain([0, 24*3600*1000]);

			var xTicks = [];
			var xLabels = [];
			for(var i=0;i<=24;i++) {
				xTicks.push(i* 3600*1000);
				xLabels.push(i);
			}
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom")
			    .tickValues(xTicks)
			    .tickFormat(function(d,i){ return xLabels[i]; });

			var displayDatas = DATES.map(function(d) {return d.substr(6);});
			var yTicks =[];
			for(var i=0;i<17;i++) {
				yTicks.push(i + 0.5);
			}
			var yAxis = d3.svg.axis()
			    .scale(y2)
			    .orient("left")
			    .tickValues(yTicks)
			    .tickFormat(function(d,i) {return displayDatas[i]});


			 svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis);


			svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + h + ")")
			      .call(xAxis);

			// console.log(chartData);
			var allRecords = chartData;
			// for(var i =0;i<chartData.length;i++) {
			// 	var oneDayRecords = chartData[i]['records'];
			// 	var day = chartData[i]['day'];
			// 	for(var j=0;j<oneDayRecords.length;j++) {
			// 		var record = oneDayRecords[j];
			// 		record['day'] = day;
			// 		allRecords.push(record);
			// 	}
			// }


			// console.log(allRecords);

			svg.selectAll("ganttBar")
			      .data(allRecords)
			    .enter().append("rect")
			      .attr("x", function(d) { return x(Timeutil.getTimeInOneDay(d.timestamp.getTime())); })
			      .attr("height", y2(1) * 0.6)
			      .attr("y", function(d,i) { return y2( Timeutil.getDayIndex(d.day)) + y2(1) * 0.2; })
			      .attr("width", function(d) { return x(d.endtime.getTime() - d.timestamp.getTime()); })
			      .attr("fill", function(d){
			      	// console.log(self);
			      	var fz = "f" + d.floor + "z" + d.zone;
			      	// console.log(d);
			      	return self.zoneColorScale(fz);
			      })
			      .attr("class","ganttBar");

			$('.ganttBar').each(function() {
		                $(this).tipsy({
		                    gravity: "s",
		                    html:true,
		                    title:function(){
		                    	var d = this.__data__;
		                        var content = "f" + d.floor + "z" + d.zone + ": "
		                        + new Date(d.timestamp).toString().substr(16,8) + "~"
		                        + new Date(d.endtime).toString().substr(16,8);
		                        return content;
		                    },
		                });
		            });
//short records
			var shortRecords = allRecords.filter(function(d) {return (d.endtime.getTime() - d.timestamp.getTime() )< 5 *60*1000;});
			shortRecords.sort(function(a, b){
				var keyA = a.timestamp;
				var keyB = b.timestamp;
				if(keyA < keyB) return -1;
				if(keyA > keyB) return 1;
				return 0;
			});

//calc offset
			shortRecords[0].cntShort = 0;
			for(var i=1;i<shortRecords.length;i++) {
				if(shortRecords[i].timestamp - shortRecords[i - 1].timestamp  < 5* 60 * 1000){
					shortRecords[i].cntShort =  shortRecords[i-1].cntShort + 1;
				}
				else
					shortRecords[i].cntShort = 0;
			}

			shortRecords[shortRecords.length-1].shortLength =  shortRecords[shortRecords.length-1].cntShort + 1;
			for(var i=shortRecords.length-1;i>0;i--) {
				if(shortRecords[i].timestamp - shortRecords[i - 1].timestamp  < 5* 60 * 1000){
					shortRecords[i - 1].shortLength =  shortRecords[i].shortLength;
				}
				else
					shortRecords[i - 1].shortLength = shortRecords[i - 1].cntShort + 1;
			}

			var shortRecordSet =[];
			for(var i=0;i<shortRecords.length;) {
				var aShortSet =[];
				var length = shortRecords[i].shortLength;
				for(var j=0;j<length;j++) {
					aShortSet.push(shortRecords[i]);
					i++;
				}


				var aSet = {}
				var firstIdx  = _.sortedIndex(allRecords, {timestamp: aShortSet[0].timestamp},"timestamp");
				// console.log(firstIdx);
				var preRecord = null;
				if(firstIdx > 0) {
					var preRecord = allRecords[firstIdx -1];
					if(preRecord.day != aShortSet[0].day)
						preRecord = null;
				}

				var lastRecord = aShortSet[aShortSet.length - 1];
				var lastIdx  = _.sortedIndex(allRecords, {timestamp: lastRecord.timestamp},"timestamp");
				var nextRecord = null;
				if(lastIdx < allRecords.length - 1) {
					var nextRecord = allRecords[lastIdx +1];
					if(nextRecord.day != lastRecord.day)
						nextRecord = null;
				}
				aSet['records'] = aShortSet;
				aSet['nextRecord'] = nextRecord;
				aSet['preRecord'] = preRecord;
				var fakeDuration, fakeStartTime, fakeEndTime;
				if(preRecord != null && nextRecord !=null) {
					if(preRecord.duration < nextRecord.duration)
						fakeDuration = preRecord.duration;
					else
						fakeDuration = nextRecord.duration;

				}
				else if(preRecord != null) {
					fakeDuration = preRecord.duration;
				}
				else {
					fakeDuration = nextRecord.duration;
				}
				aSet['fakeStartTime'] =  aShortSet[0].timestamp - fakeDuration*1000;
				aSet['fakeEndTime'] =  aShortSet[aShortSet.length - 1].endtime + fakeDuration*1000;

				shortRecordSet.push(aSet);
			}

			// console.log(shortRecordSet);

			// var shortSetG = svg.selectAll(".shortSet")
			// .data(shortRecordSet).enter()
			// .append("g").attr("class", "shortSet");

			// shortSetG.append("rect")
			// .attr("x", function(d) { return x(Timeutil.getTimeInOneDay(d.timestamp)); })
			//       .attr("height", y2(1) * 0.6)
			//       .attr("y", function(d,i) { return y2( Timeutil.getDayIndex(d.day)) + y2(1) * 0.2; })
			//       .attr("width", function(d) { return x(d.duration*1000); })
			//       .attr("fill", function(d){
			//       	// console.log(self);
			//       	var fz = "f" + d.floor + "z" + d.zone;
			//       	// console.log(d);
			//       	return self.zoneColorScale(fz);
			//       })


			// console.log(shortRecords);

			// shortRecords[shortRecords.length-1].cntOffset = ;

			var arc = d3.svg.symbol().type('triangle-down')
			.size(15);


			// svg.selectAll("ganttNode")
			//       .data(shortRecords)
			//     .enter().append("path")
			//     .attr('d',arc)
			//       .attr("fill", function(d){
			//       	// console.log(self);
			//       	var fz = "f" + d.floor + "z" + d.zone;
			//       	// console.log(d);
			//       	return self.zoneColorScale(fz);
			//       })
			//       .attr('transform',function(d,i){ return "translate("+
			//       	(x(Timeutil.getTimeInOneDay(d.timestamp)) + 6 * d.cntShort - 6 * d.shortLength / 2 + 3)
			//       	+ ","+( y2( Timeutil.getDayIndex(d.day)))+")"; })
			//       .attr("class","ganttNode");


			svg.selectAll("ganttNode")
			      .data(shortRecords)
			    .enter().append("circle")
			      .attr("cx", function(d) {
			      	return x(Timeutil.getTimeInOneDay(d.timestamp)) + 6 * d.cntShort - 6 * d.shortLength / 2 + 3;
			      })
			      .attr("cy", function(d,i) { return y2( Timeutil.getDayIndex(d.day)) ; })
			      .attr("fill", function(d){
			      	// console.log(self);
			      	var fz = "f" + d.floor + "z" + d.zone;
			      	// console.log(d);
			      	return self.zoneColorScale(fz);
			      })
			      .attr("r",3)
			      .attr("class","ganttNode");
			$('.ganttNode').each(function() {
		                $(this).tipsy({
		                    gravity: "s",
		                    html:true,
		                    title:function(){
		                    	var d = this.__data__;
		                      	var content = "f" + d.floor + "z" + d.zone + ": "
		                        + new Date(d.timestamp).toString().substr(16,8) + "~"
		                        + new Date(d.endtime).toString().substr(16,8);
		                        return content;
		                    },
		                });
		            });



//border
			svg.append("rect").attr("class","border-rect")
			.attr("x",0).attr("y", 0)
			.attr("width", w).attr("height",h);

			for(var i=1;i<DATES.length;i++) {
				svg.append("line").attr("class","border-line")
				.attr("x1", 0).attr("x2",w).attr("y1",y2(i)).attr("y2",y2(i));
			}

		}
	},
	updateSelectPeople:function(id){
		this.selectPID = id;
		this.zoneColorScale = d3.scale.category10();

		this.update_hist();
		this.update_ganttchart();

	}



}
