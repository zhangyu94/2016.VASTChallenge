//linechart_render_view.render("linechart-renderplace")
var linechart_render_view = {
	obsUpdate:function(message, data)
	{

	},
	render:function(divID)
	{
		//使用的全局
	    var data = DATA_CENTER.original_data["bldg-MC2.csv"];
	    var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
	    //end 全局变量

		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();


	    var yAxis_attr_name = " DELI-FAN Power";
        var xAxis_attr_name = "Date/Time";

        var xyAxis_data = [];
        for (var i=0;i<data.length;++i)
        {
            var y_value = +data[i][yAxis_attr_name];

            var x_value = new Date(data[i][xAxis_attr_name]);
            var x_value = x_value.getTime();

            var temp = [x_value,y_value];
            xyAxis_data.push(temp)
        }             

        this.plot_linechart(divID,xyAxis_data)
	},

	plot_linechart:function(divID,xyAxis_data)
	{
		var width  = $("#"+divID).width();
        var height  = $("#"+divID).height();
       	$("#"+divID).highcharts({
            chart: {
                width:width,
                height:height,
                renderTo: divID,// 图表加载的位置
                type: 'line',
                zoomType: 'x',
                panning: true,
                panKey: 'shift'
            },
            legend:{
                enabled:false,
            },
            title: {
                text: ''
            },
            credits:{
                enabled: false,
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats:{
                    millisecond:"%b %e, %H:00",
                    second:"%b %e, %H:00",
                    minute:"%b %e, %H:00",
                    hour:"%b %e, %H:00",
                    day:"%b %e",
                    week:"%b %e",
                    month:"%b",
                    year:"%Y"
                }
            },
            
            yAxis: {
                title:{
                    text:""
                }
            },
            
            series: [{
                data: xyAxis_data
            }]
        });
	}
}