var timeline_view = {
	timeline_div_id : "timeline_div",
	obsUpdate:function(message, data)
	{
		if (message == "set:added_timerange")
		{
			var added_timerange = DATA_CENTER.global_variable.added_timerange;
			this._add_Plotband(added_timerange.min,added_timerange.max);
		}
	},

	_add_Plotband:function(min,max)
	{
		var id = "PlotBand"+min+max;
		console.log(id);
		var chart = $("#"+this.timeline_div_id).highcharts();
		var axis = chart.xAxis[0];
		axis.addPlotBand({
		   id: id,     // id 用于后续删除用
		   color: '#FF7060',
		   from: min,
		   to: max,
		   events: {             // 事件，支持 click、mouseover、mouseout、mousemove等事件
	            click: function(e) {
					axis.removePlotBand(this.id) 
	            },
	            mouseover: function(e) {
	            },
	            mouseout: function(e) {
	            },
	            mousemove: function(e) {
	            }
	        }
		}); 


	},

	_remove_Plotband:function()
	{

	},

	render:function(divID)
	{
		var div = d3.select("#"+divID);
		div.selectAll("*").remove()
		
	    var div_width  = $("#"+divID).width();
	    var div_height  = $("#"+divID).height();

	    var display_div_width = div_width*0.03;
		var display_div_height = div_height;

		var display_div = div.append("div").attr("id","display_div").style("position","absolute")
	    					.style("width",display_div_width + 'px')
	    					.style("height",display_div_height + 'px')
	    					.style("border","solid #ccc 1px")
	    					.style("border-radius","5px")
	    					.style("background-color","#f8f8f8")
	    this._render_btn("display_div");

	    var timeline_div_width = div_width - display_div_width;
		var timeline_div_height = div_height;
		var timeline_div_leftpadding = display_div_width;

		var timeline_div = div.append("div").attr("id",this.timeline_div_id).style("position","absolute")
							.style("left",timeline_div_leftpadding + 'px')
	    					.style("width",timeline_div_width + 'px')
	    					.style("height",timeline_div_height + 'px')
	    					.style("border","solid #ccc 1px")
	    					.style("border-radius","5px")
	    					.style("background-color","#f8f8f8")

	    var xyAxis_data = this._initialize_xyAxis_data();
	    var chart = this._plot_linechart(this.timeline_div_id,xyAxis_data);
     
	},

	_render_btn:function(divID)
	{
		$( "#"+divID ).button({
	      	text: false,
	      	icons: {
	        	primary: "ui-icon-play"
	      	}
	    })
	    .click(function() {

	    });
	},

	_initialize_xyAxis_data:function()
    {
        //使用的全局变量
        var data = DATA_CENTER.original_data["bldg-MC2.csv"];
        //end 全局变量

        var xAxis_attr_name = "Date/Time";
        var xyAxis_data = [];
        for (var i=0;i<data.length;++i)
        {
            var y_value = 0;

            var x_value = new Date(data[i][xAxis_attr_name]);
            var x_value = x_value.getTime();

            var temp = [x_value,y_value];
            xyAxis_data.push(temp)
        }             
        return xyAxis_data;
    },

	_plot_linechart:function(divID,xyAxis_data)
	{
        d3.select("#"+divID).selectAll("*").remove()

       	var div = $("#"+divID);
        div.highcharts({
            chart: {
                spacingBottom:0,//压缩掉下侧的空白
                renderTo: divID,// 图表加载的位置
                type: 'line',
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                events:{
                    selection:function(e){
                        console.log(e)
                    }
                }
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
            	labels:{
            		//enabled:false
            	},
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

        var chart = div.highcharts()
        return chart;
	},
}