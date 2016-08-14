var trajmonitor_view = {
	trajmonitor_view_DIV_ID : "trajmonitor-renderplace",
    FIRST_CALLED: true,

    startTime : undefined,
    endTime : undefined,
    display_before : 10*60*1000,
    person_array: [],

	obsUpdate:function(message, data)
	{
        $('.tipsy').remove();
	    if (message == "display:trajmonitor_view")
                {
                    $("#"+this.trajmonitor_view_DIV_ID).css("display","block");
                    var timeRange=DATA_CENTER.global_variable.selected_filter_timerange
                    this.startTime=new Date(timeRange.min)
                	this.endTime=new Date(timeRange.max)
                	var person = DATA_CENTER.derived_data['person']
                	this.person_array=[]
                	for(var p in person){
                		this.person_array.push({name:p,fixRecords:person[p].fixRecords,mobileRecords:person[p].mobileRecords})
                	}
                	if (this.FIRST_CALLED)
                	{
                		this.render(this.trajmonitor_view_DIV_ID)
                		this.FIRST_CALLED = false;
                	}
                }
		/*
		if (message == "display:trajmonitor_view")
        {
            $("#"+this.trajmonitor_view_DIV_ID).css("display","block");
            var timeRange=DATA_CENTER.global_variable.selected_filter_timerange
            this.startTime=new Date(timeRange.min)
        	this.endTime=new Date(timeRange.max)
        	var person = DATA_CENTER.derived_data['person']
        	this.person_array=[]
        	for(var p in person){
        		this.person_array.push({name:p,fixRecords:person[p].fixRecords,mobileRecords:person[p].mobileRecords})
        	}
        	this.render(this.trajmonitor_view_DIV_ID)
        }
        */
        //console.log(message);

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
        	//console.log(data)
        	this.display_before=+data
        	//console.log(this.display_before)
            this.startTime=new Date(this.endTime-this.display_before)
        	this.render(this.trajmonitor_view_DIV_ID)

        }
        if (message == "set:selected_card_set")
        {
        	var n_person_array=[]
        	var sps_person_id=DATA_CENTER.global_variable.selected_card_set
        	if(sps_person_id.length==0){
        		//this.render(this.trajmonitor_view_DIV_ID)
        	}
        	else{
        		for(var p in this.person_array){
        			if(sps_person_id.indexOf(this.person_array[p].name)>=0){
        				n_person_array.push(this.person_array[p])
        			}
        		}
        		this.person_array=n_person_array

        	}
        	this.render(this.trajmonitor_view_DIV_ID)

        }
        if (message == "set:selected_proxzone_set"){
        	var n_person_array=[]
        	//console.log.(DATA_CENTER.global_variable.selected_proxzone_set)
        	var sps_proxzone_set= DATA_CENTER.global_variable.selected_proxzone_set
        	var n_person_array=[]
        	if(sps_proxzone_set.length==0){

        	}
        	else {

        		this.person_array=[]
        		var person =DATA_CENTER.derived_data['person']
        		for(var p in person){
        			this.person_array.push({name:p,fixRecords:person[p].fixRecords,mobileRecords:person[p].mobileRecords})
        		}
        		for(var p in this.person_array){
        			var tag=false
        			var tmp = {}
        			var fixRecords=this.person_array[p].fixRecords
        			var mobileRecords=this.person_array[p].mobileRecords
        			tmp['name']=this.person_array[p].name
        			tmp['fixRecords']=[]
        			tmp['mobileRecords']=[]
        			for(var i in fixRecords){
        				var loc='F_'+fixRecords[i].floor+'_'+'Z_'+fixRecords[i].zone
        				if(sps_proxzone_set.indexOf(loc)>=0){
        					tmp['fixRecords'].push(fixRecords[i])
        					tag=true
        				}
        			}
        			for(var i in mobileRecords){
        				var loc='F_'+mobileRecords[i].floor+'_'+'Z_'+mobileRecords[i].zone
        				if(sps_proxzone_set.indexOf(loc)>=0){
        					tmp['mobileRecords'].push(mobileRecords[i])
        					tag=true
        				}
        			}
        			if(tag==true){
        				n_person_array.push(tmp)
        			}
        		}
        		this.person_array=n_person_array
        		//console.log(n_person_array)
        		this.render(this.trajmonitor_view_DIV_ID)

        	}

        }
        if (message == "set:click_HVACzone_set")
        {
        	var n_person_array=[]
        	var sps_hvaczone_set= DATA_CENTER.linechart_variable.highlight_HVACzone_set
        	//console.log(DATA_CENTER.linechart_variable.highlight_HVACzone_set)

        	if(sps_hvaczone_set.length==0){
        		//this.render(this.trajmonitor_view_DIV_ID)
        	}

        	else{
        		//console.log(sps_hvaczone_set)
        		this.person_array=[]
        		var person = DATA_CENTER.derived_data['person']
        		for(var p in person){
        			this.person_array.push({name:p,fixRecords:person[p].fixRecords,mobileRecords:person[p].mobileRecords})
        		}
        		//console.log(this.person_array)
        		var all_sps_proxZone=[]
        		for(var i in sps_hvaczone_set){
        			var energyZone=sps_hvaczone_set[i]
        			var proxZones= DATA_CENTER.global_variable.energyZone_to_proxZone[energyZone]
        			for(var j in proxZones){
        				if(all_sps_proxZone.indexOf(proxZones[j])<0){
        					all_sps_proxZone.push(proxZones[j])
        				}
        			}
        		}

        		for(var p in this.person_array){
        			var tag=false
        			var tmp = {}
        			var fixRecords=this.person_array[p].fixRecords
        			var mobileRecords=this.person_array[p].mobileRecords
        			tmp['name']=this.person_array[p].name
        			tmp['fixRecords']=[]
        			tmp['mobileRecords']=[]
        			for(var i in fixRecords){
        				var loc='F_'+fixRecords[i].floor+'_'+'Z_'+fixRecords[i].zone
        				if(all_sps_proxZone.indexOf(loc)>=0){
        					tmp['fixRecords'].push(fixRecords[i])
        					tag=true
        				}
        			}
        			for(var i in mobileRecords){
        				var loc='F_'+mobileRecords[i].floor+'_'+'Z_'+mobileRecords[i].zone
        				if(all_sps_proxZone.indexOf(loc)>=0){
        					tmp['mobileRecords'].push(mobileRecords[i])
        					tag=true
        				}
        			}
        			if(tag==true){
        				n_person_array.push(tmp)
        			}
        		}
        		this.person_array=n_person_array
        		//console.log(n_person_array)
        		this.render(this.trajmonitor_view_DIV_ID)
        	}

        }

	},
	render:function(divID)
	{
		//DATA_CENTER.global_variable.selected_card_set[]
		//console.log(roomsExchange(3,'proxZone_to_energyZone'))

		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    var person_array = this.person_array
	    //console.log(person_array)
	   // console.log(DATA_CENTER.derived_data['person'])
	    // var person=DATA_CENTER.derived_data['person']
	    // var person_array=[]
	    // //var sps_person_id=DATA_CENTER.global_variable.selected_card_set
	    // for(var p in person){
	    // 	if(sps_person_id.length==0){
	    // 		person_array.push({name:p,fixRecords:person[p].fixRecords,mobileRecords:person[p].mobileRecords})
	    // 	}
	    // 	else if(sps_person_id.indexOf(p)>=0){
	    // 		person_array.push({name:p,fixRecords:person[p].fixRecords,mobileRecords:person[p].mobileRecords})
	    // 	}
	    // }
	    //console.log(person_array)

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
	    var color=d3.scale.ordinal().range(d3.scale.category20().range())
	    							.domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])
	    //console.log(color.range())
	    //["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]
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
	    	var draw_person_array_mobile=person_array[p]['mobileRecords'].filter(function(d) {
	    		if(d.timestamp<endTime&&d.timestamp>startTime){

	    			return true
	    		}
	    	})

	    	psvg.append('text')
	    		.text(+p+1+' '+person_array[p].name)
	    		.attr('y',spaceHeight-pmargin.bottom-pmargin.top-2)
	    		.attr('x',-pmargin.left+6)
	    	//console.log(draw_person_array)
	    	psvg.selectAll('.pBar')
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
	    		.style('fill',function (d) {

			      	// console.log(d);
			      	return color(+d.zone)
			      	if(d.zone=="Server Room") return d3.rgb(DATA_CENTER.GLOBAL_STATIC.zone_Color_Array[0])
			      	return d3.rgb(DATA_CENTER.GLOBAL_STATIC.zone_Color_Array[(+d.zone)-1]);
	    		})

	    		// mobile bar
	    		// console.log(draw_person_array_mobile)
	    		if(endTime.getTime()-startTime.getTime()<3600*24*1000){
		    		psvg.selectAll('.pMBar')
		    		.data(draw_person_array_mobile)
		    		.enter()
		    		.append('rect')
		    		.attr('class','pMBar')
		    		.attr('y',function(d) {
		    			return (3-(+d.floor))*rectHeight/2+rectHeight*0.2;
		    		})
		    		.attr('x',function(d) {

		    				return xscale(new Date(d.timestamp.getTime()-1000*30))

		    		})
		    		.attr('width',function(d){
		    			return xscale(new Date(d.timestamp.getTime()+1000*60))-xscale(d.timestamp)
		    		})
		    		.attr('height',rectHeight*0.6)
		    		.style('fill',function (d) {

				      	// console.log(d);
				      	return color(+d.zone)
				      	if(d.zone=="Server Room") return d3.rgb(DATA_CENTER.GLOBAL_STATIC.zone_Color_Array[0])
				      	return d3.rgb(DATA_CENTER.GLOBAL_STATIC.zone_Color_Array[(+d.zone)-1]);
		    		})
		    		.attr('stroke','black')
		    		.attr('stoke-width','1px')
		    	}
	    }
	    $('.pBar').each(function() {
		                $(this).tipsy({
		                    gravity: "e",
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
