var eventlist_view = {
	eventlist_view_DIV_ID : "eventlist-renderplace",


	obsUpdate:function(message, data)
	{
		if (message == "display:eventlist_view")
        {
            $("#"+this.eventlist_view_DIV_ID).css("display","block");
            this.render(this.eventlist_view_DIV_ID);
        }

        if (message == "hide:eventlist_view")
        {
            $("#"+this.eventlist_view_DIV_ID).css("display","none");
        }

        if (message == "set:warning_list")
        {
        	var warning_list = DATA_CENTER.global_variable.warning_list;
        	//console.log(warning_list)
        }
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    
	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")   
	                .attr("width",width)
	                .attr("height",height)
	                  
	}
}