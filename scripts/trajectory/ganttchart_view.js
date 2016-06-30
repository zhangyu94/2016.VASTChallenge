var ganttchart_view = {
	root:null,
	width:null,
	height:null,
	personData:null,
	selectPID:null,
	zoneColorScale:null,
	obsUpdate:function(message, data)
	{

	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove();
		this.root = $("#"+divID);
		this.root.append("<div id='trajectory-ganntchart-idlist'></div><div id='trajectory-ganntchart-hist'></div><div id='trajectory-ganntchart-main'></div>" );
		this.width  = $("#"+divID).width();
		this.height  = $("#"+divID).height();
		this.personData = DATA_CENTER.derived_data["person.json"];
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
			var chartData = this.personData[id]['fixRecords'];
			console.log(chartData);
			var  margin = { top: 10, right: 20, bottom: 20, left: 40 };
			d3.select("#trajectory-ganntchart-main-body").selectAll("*").remove();

			var w  = $("#trajectory-ganntchart-main-body").width() - margin.left - margin.right;
			var h  = $("#trajectory-ganntchart-main-body").height() - margin.bottom - margin.top;
			var svg = d3.select("#trajectory-ganntchart-main-body").append("svg")
			    .attr("width", w + margin.left + margin.right)
			    .attr("height", h + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform",
			          "translate(" + margin.left + "," + margin.top + ")");


			var y = d3.scale.ordinal().rangeRoundBands([0, h], .05)
				.domain(DATES);
			var x = d3.scale.linear().range([0,w]).domain([0, 24*3600*1000]);

			var xTicks = [];
			var xLabels = [];
			for(var i=0;i<24;i++) {
				xTicks.push(i* 3600*1000);
				xLabels.push(i);
			}
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom")
			    .tickValues(xTicks)
			    .tickFormat(function(d,i){ return xLabels[i]; });

			var displayDatas = DATES.map(function(d) {return d.substr(6);});
			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickValues(displayDatas);


			 svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis);


			svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + h + ")")
			      .call(xAxis);

			console.log(chartData);
			var allRecords = [];
			for(var i =0;i<chartData.length;i++) {
				var oneDayRecords = chartData[i]['records'];
				var day = chartData[i]['day'];
				for(var j=0;j<oneDayRecords.length;j++) {
					var record = oneDayRecords[j];
					record['day'] = day;
					allRecords.push(record);
				}
			}
			console.log(allRecords);

			svg.selectAll("ganttBar")
			      .data(allRecords)
			    .enter().append("rect")
			      .attr("x", function(d) { return x(Timeutil.getTimeInOneDay(d.timestamp)); })
			      .attr("height", y.rangeBand())
			      .attr("y", function(d,i) { return y(d.day); })
			      .attr("width", function(d) { return x(d.duration*1000); })
			      .attr("fill", function(d){
			      	// console.log(self);
			      	var fz = "f" + d.floor + "z" + d.zone;
			      	// console.log(d);
			      	return self.zoneColorScale(fz);
			      })
			      .attr("class","ganttBar");
			// console.log(allRecords);
			console.log(Timeutil.getStartTime());
			// console.log(chartData);
		}
	},
	updateSelectPeople:function(id){
		this.selectPID = id;
		this.zoneColorScale = d3.scale.category10();

		this.update_hist();
		this.update_ganttchart();

	}



}
