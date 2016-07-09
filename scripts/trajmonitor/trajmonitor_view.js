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

	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")   
	                .attr("width",width)
	                .attr("height",height)

	}
}