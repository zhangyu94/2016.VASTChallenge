var trajmonitor_view = {
	trajmonitor_view_DIV_ID : "trajmonitor-renderplace",


	obsUpdate:function(message, data)
	{
		if (message == "display:trajmonitor_view")
        {
            $("#"+this.trajmonitor_view_DIV_ID).css("display","block");
            this.render(this.trajmonitor_view_DIV_ID);
        }

        if (message == "hide:trajmonitor_view")
        {
            $("#"+this.trajmonitor_view_DIV_ID).css("display","none");
        }
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	    //console.log(DATA_CENTER.derived_data['person'])
	    var person=DATA_CENTER.derived_data['person']
	    var person_array=[]
	    for(var p in person){
	    	person_array.push({name:p,fix:person[p].fix,mobile:person[p].mobile})
	    }
	   // console.log(person_array)
	    for(var p=0;p<person_array.length;p++){
	    	for(var i=0;i<person_array[p]['fix'].length-1;i++){
	    		var s=new Date(person_array[p]['fix'][i].timestamp)
	    		var e=new Date(person_array[p]['fix'][i+1].timestamp)
                person_array[p]['fix'][i].start=s
	    		if(s.getMonth()==e.getMonth())
	    			person_array[p]['fix'][i].end=e
	    		else
	    			person_array[p]['fix'][i].end=s

	    	}
	    	var last=person_array[p]['fix'][person_array[p]['fix'].length-1]
	    	last.start=new Date(last.timestamp)
	    	last.end=new Date(last.timestamp)
	    }
	    console.log(person_array)
	
	    $('#'+divID).css('overflow','auto')
	    for(var p in person_array){
	    	$('#'+divID).append("<div class='monitor_bar' id='"+person_array[p].name+"'> \
	    			<div> dfdfd</div>")
	    }
	        var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")   
	                .attr("width",width)
	                .attr("height",height)
	   
	}
}