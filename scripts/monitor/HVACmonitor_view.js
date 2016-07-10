var HVACmonitor_view = {
	FIRST_CALLED:true,
	HVACmonitor_view_DIV_ID : "HVACmonitor-renderplace",

	DIV_CLASS_OF_RADARCHART_GLYPH:"HVACmonitor-radarchart_glyph-div",

	obsUpdate:function(message, data)
	{
		if (message == "display:HVACmonitor_view")
        {
            $("#"+this.HVACmonitor_view_DIV_ID).css("display","block");
            DATA_CENTER.VIEW_COLLECTION.smallmaps_view._display_radarchart(this.DIV_CLASS_OF_RADARCHART_GLYPH)
            this.render(this.HVACmonitor_view_DIV_ID);

            //if (this.FIRST_CALLED)
			//{
			//	this.render(this.HVACmonitor_view_DIV_ID);
			//	this.FIRST_CALLED = false;
			//}
        }

        if (message == "hide:HVACmonitor_view")
        {
            $("#"+this.HVACmonitor_view_DIV_ID).css("display","none");
            DATA_CENTER.VIEW_COLLECTION.smallmaps_view._hide_radarchart(this.DIV_CLASS_OF_RADARCHART_GLYPH)
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


	    //(data,glyph_name,raw_timestamp,class_label,center_x,center_y,radius,innerRadius)
	            
	    //DATA_CENTER.VIEW_COLLECTION.smallmaps_view._render_radarchart(data,glyph_name,raw_timestamp,class_label,center_x,center_y,radius,innerRadius)
	}
}