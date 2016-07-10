var HVACmonitor_view = {
	HVACmonitor_view_DIV_ID : "HVACmonitor-renderplace",


	obsUpdate:function(message, data)
	{
		if (message == "display:HVACmonitor_view")
        {
            $("#"+this.HVACmonitor_view_DIV_ID).css("display","block");
            this.render(this.HVACmonitor_view_DIV_ID);
        }

        if (message == "hide:HVACmonitor_view")
        {
            $("#"+this.HVACmonitor_view_DIV_ID).css("display","none");
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