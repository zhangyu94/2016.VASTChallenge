var timeline_view = {
	DISPLAY_RATE:3600,//播放的速度是现实速度的多少倍，单位ms
	UPDATE_RATE:1000,//播放时每隔多久更新一次时间,单位ms

	intervalid_handle:undefined,//用于保存setInterval
	timeline_div_id : "timeline_div",
	obsUpdate:function(message, data)
	{
		if (message == "set:added_timerange")
		{
			var added_timerange = DATA_CENTER.global_variable.added_timerange;
			this._add_Plotband(added_timerange.min,added_timerange.max);
		}

		if (message == "set:current_display_time")
		{
	        var current_display_time = DATA_CENTER.global_variable.current_display_time;
	        var chart = $("#"+this.timeline_div_id).highcharts();    // Highcharts构造函数
			
	        chart.xAxis[0].removePlotLine('time-tick'); //把id为time-tick的标示线删除
			chart.xAxis[0].addPlotLine({           //在x轴上增加
				    value:current_display_time,    //在值为current_display_time的地方
				    width:1,                       //标示线的宽度为2px
				    color: '#FF0000',              //标示线的颜色
				    id: 'time-tick',               //标示线的id，在删除该标示线的时候需要该id标示
					dashStyle:"shortdot",

					zIndex:99,//值越大，显示的优先级越高
				});		
		}
	},

	_add_Plotband:function(min,max)
	{
		var id = "PlotBand"+min+max;//有相同的id的人是一起删除的
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
	    this._render_btngroup("display_div");

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
	    console.log(xyAxis_data)
	    var chart = this._plot_linechart(this.timeline_div_id,xyAxis_data);
     
	},

	_render_btngroup:function(divID)
	{
		var div = d3.select("#"+divID);
		div.selectAll("*").remove()
		
	    var div_width  = $("#"+divID).width();
	    var div_height  = $("#"+divID).height();

	    var playbtn_div_width = div_width;
		var playbtn_div_height = div_height*0.5;

		var playbtn_div = div.append("div").attr("id","playbtn_div").style("position","absolute")
	    					.style("width",playbtn_div_width + 'px')
	    					.style("height",playbtn_div_height + 'px')
	    					.style("border","solid #ccc 1px")
	    					.style("border-radius","5px")
	    					.style("background-color","#f8f8f8")


	    var stopbtn_div_width = div_width;
	    var stopbtn_div_toppadding = div_height*0.5;
		var stopbtn_div_height = div_height*0.5;

		var stopbtn_div = div.append("div").attr("id","stopbtn_div").style("position","absolute")
	    					.style("top",stopbtn_div_toppadding + 'px')
	    					.style("width",stopbtn_div_width + 'px')
	    					.style("height",stopbtn_div_height + 'px')
	    					.style("border","solid #ccc 1px")
	    					.style("border-radius","5px")
	    					.style("background-color","#f8f8f8")
	    console.log(playbtn_div)

	    //注意: $("#playbtn_div")和$(playbtn_div)在这里效果是不一样的!!!
		$("#playbtn_div").button({
	      	label: "play",
	      	text: false,
	      	icons: {
	        	primary: "ui-icon-play"
	      	}
	    })
	    .click(function() {
	    	var options;
	      	if ( $( this ).text() === "play" ) {
	        	options = {
		          	label: "pause",
		          	icons: {
		            	primary: "ui-icon-pause"
		          	}
	        	};
	        	var chart = $("#"+timeline_view.timeline_div_id).highcharts();
	        	DATA_CENTER.set_global_variable("current_display_time",chart.xAxis[0].min);

	        	timeline_view.intervalid_handle = setInterval(function() {
	        		var chart = $("#"+timeline_view.timeline_div_id).highcharts();    // Highcharts构造函数
	        		if (typeof(DATA_CENTER.global_variable.current_display_time) == "undefined" )
	        		{
	        			console.warn("undefined display time");
	        		}
	        		var current_display_time = timeline_view.DISPLAY_RATE*timeline_view.UPDATE_RATE + DATA_CENTER.global_variable.current_display_time;

	        		if (current_display_time <= chart.xAxis[0].max)
	        		{
	        			DATA_CENTER.set_global_variable("current_display_time",current_display_time);
	        		}
	        		else
	        		{
	        			$("#stopbtn_div").click();
	        		}
				}, timeline_view.UPDATE_RATE);
	      	} 
	      	else {
	        	options = {
	          		label: "play",
	          		icons: {
	            		primary: "ui-icon-play"
	          		}
	        	};
	        	window.clearInterval(timeline_view.intervalid_handle);
	      	}
	      	$( this ).button( "option", options );
	    });


		$("#stopbtn_div").button({
	      	text: false,
	      	icons: {
	        	primary: "ui-icon-stop"
	      	}
	    })
	    .click(function() {
	    	if ($( "#playbtn_div" ).text() === "pause")//如果处在播放状态中，先转到暂停，之后再stop
	    	{
	    		$( "#playbtn_div" ).click();
	    	}
	    	var chart = $("#"+timeline_view.timeline_div_id).highcharts();    // Highcharts构造函数
	    	DATA_CENTER.set_global_variable("current_display_time",chart.xAxis[0].min);
	    	window.clearInterval(timeline_view.intervalid_handle);
	    })

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