var trajmonitor_view = {
	trajmonitor_view_DIV_ID : "trajmonitor-renderplace",
    
    startTime : undefined,
    endTime : undefined,
    display_before : 1*60*1000,

	obsUpdate:function(message, data)
	{
		if (message == "display:trajmonitor_view")
        {
            $("#"+this.trajmonitor_view_DIV_ID).css("display","block");
            var timeRange=DATA_CENTER.global_variable.selected_filter_timerange
            this.startTime=new Date(timeRange.min)
        	this.endTime=new Date(timeRange.max)
        	this.render(this.trajmonitor_view_DIV_ID)
        }

        if (message == "hide:trajmonitor_view")
        {
            $("#"+this.trajmonitor_view_DIV_ID).css("display","none");
        }
        if (message == "set:selected_filter_timerange"){
        	var timeRange=data

        	this.startTime = new Date(timeRange.min)
        	this.endTime = new Date(timeRange.max)
        	//console.log(new Date(timeRange.min))
        	//console.log(new Date(timeRange.max))
        	this.render(this.trajmonitor_view_DIV_ID)
        }
        if (message == "stream:trajmonitor_view"){

        	this.endTime = new Date(data)
        	this.startTime = new Date(data-this.display_before)
        	this.render(this.trajmonitor_view_DIV_ID)
        }
        if (message == "set:display_before")
        {
        	console.log(data)
        	this.display_before=+data
        	console.log(this.display_before)
            this.startTime=new Date(this.endTime-this.display_before)
        	this.render(this.trajmonitor_view_DIV_ID)
            
        }
	},
	render:function(divID)
	{
		//console.log(roomsExchange(3,'proxZone_to_energyZone'))
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	   // console.log(DATA_CENTER.derived_data['person'])
	    var person=DATA_CENTER.derived_data['person']
	    var person_array=[]
	    for(var p in person){
	    	person_array.push({name:p,fixRecords:person[p].fixRecords,mobileRecords:person[p].mobileRecords})
	    }
	   // console.log(person_array)
	    
	    //console.log(person_array)
		
		//console.log(this.startTime)
		//console.log(this.endTime)
		var startTime=this.startTime
		var endTime=this.endTime
	    $('#'+divID).css('overflow','auto')
	    var spaceHeight=20
	    var pmargin={left:120,right:50,top:1,bottom:1}

	    var w=width-pmargin.left-pmargin.right
	    var h=spaceHeight-pmargin.top-pmargin.bottom
	    var xscale=d3.time.scale().domain([startTime,endTime]).range([0,w])

	    var rectHeight=(spaceHeight-pmargin.top-pmargin.bottom)/2
	    var zoneColorScale = d3.scale.category10()

	    $('#'+divID).append("<div id='axisDiv' style='border-bottom:1px solid #ccc;'></div>")
	    var xAxis = d3.svg.axis()
			       .scale(xscale)
			       .orient("bottom")
		var ticks=xscale.ticks(10)

		var ticksLoc=[]
		ticks.forEach(function(d) {
			ticksLoc.push(xscale(d))
		})

		//console.log(ticksLoc)
	    var axisSvg=d3.select('#'+'axisDiv').append('svg')
	    			  .attr('width',width)
	    			  .attr('height',spaceHeight)
	    			  .append('g')
	    			  .attr('transform',"translate("+pmargin.left+","+pmargin.top+")")
			axisSvg.append("g")
			       .attr("class", "x axis")
			       .call(xAxis);
		$('#'+divID).append("<div id='pDiv' style='position:absolute;border-bottom:1px solid #ccc;top:5%'></div>")
		//$('#'+'pDiv').css('overflow','auto')
	    for(var p in person_array){
	    	$('#'+'pDiv').append("<div class='monitor_bar' id='"+person_array[p].name+"' style='float:left;border-bottom:1px solid #ccc'></div>")
            var pdiv=$('#'+person_array[p].name)

	    	var psvg=d3.select('#'+person_array[p].name).append('svg')
	    				 .attr('width',width-20)
	    				 .attr('height',spaceHeight)
	    				 .append('g')
	    				 .attr('transform',"translate("+pmargin.left+","+pmargin.top+")")
	    	for(var i in ticksLoc){
	    		psvg.append('line')
	    			.attr('x1',ticksLoc[i])
	    			.attr('y1',0)
	    			.attr('x2',ticksLoc[i])
	    			.attr('y2',spaceHeight*2)
	    			.attr('stroke','#ccc')
	    			.attr('stroke-width',1)
	    			.attr('stroke-dasharray','1,2')
	    	}
	    	var draw_person_array=person_array[p]['fixRecords'].filter(function(d) {
	    		if(d.timestamp<endTime&&d.endtime>startTime){
	    			
	    			return true
	    		}
	    	})
	    	psvg.append('text')
	    		.text(+p+1+' '+person_array[p].name)
	    		.attr('y',spaceHeight-pmargin.bottom-pmargin.top-2)
	    		.attr('x',-pmargin.left+6)

	    	psvg.selectAll('rect')
	    		.data(draw_person_array)
	    		.enter()
	    		.append('rect')
	    		.attr('class','pBar')
	    		.attr('y',function(d) {
	    			return (3-(+d.floor))*rectHeight/2+3;
	    		})
	    		.attr('x',function(d) {
	    			if(d.timestamp>startTime){
	    				return xscale(d.timestamp)
	    			}
	    			else{
	    				return xscale(startTime)
	    			}
	    		})
	    		.attr('width',function(d){
	    			if(d.endtime<endTime&&d.timestamp>startTime)
	    				return xscale(d.endtime)-xscale(d.timestamp)
	    			if(d.endtime>endTime)
	    				return xscale(endTime)-xscale(d.timestamp)
	    			if(d.timestamp<startTime)
	    				return xscale(d.endtime)-xscale(startTime)
	    		})
	    		.attr('height',rectHeight)
	    		.attr('fill',function (d) {

	    			var fz = "f" + d.floor + "z" + d.zone;
			      	// console.log(d);
			      	return zoneColorScale(fz);
	    		})


	    }
	    $('.pBar').each(function() {
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
	        // var svg = d3.select("#"+divID).append("svg")
	        //         .attr("class","mainsvg")   
	        //         .attr("width",width)
	        //         .attr("height",height)
	   
	}
}