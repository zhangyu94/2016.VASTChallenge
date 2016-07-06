var histogram_view = {
	histogram_view_DIV_ID : "trajectory-histogram",


	obsUpdate:function(message, data)
	{
		if (message == "display:histogram_view")
        {
            $("#"+this.histogram_view_DIV_ID).css("display","block");
            this.render(this.histogram_view_DIV_ID);
        }

        if (message == "hide:histogram_view")
        {
            $("#"+this.histogram_view_DIV_ID).css("display","none");
        }
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();

	    /*
	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")   
	                */     
	}
}