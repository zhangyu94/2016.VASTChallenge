var timeline_view = {
	FIRST_CALLED : true,
	timeline_view_DIV_ID : "timeline-renderplace",

	DISPLAY_RATE:undefined,//3600,//播放的速度是现实速度的多少倍
	DISPLAY_INTERVAL:undefined,//播放时每隔多久更新一次时间,单位ms

	SELECTED_TIMEPOINT_VALUE:1,//被标记成selected的时间点在timeline上的取值

	ROBOT_MORNING_WORKTIME_START:"9:00",
	ROBOT_MORNING_WORKTIME_END:"10:02",
	ROBOT_AFTERNOON_WORKTIME_START:"14:00",
	ROBOT_AFTERNOON_WORKTIME_END:"15:00",
	SELECTED_TIMEPOINT : true,
	intervalid_handle:undefined,//用于保存setInterval
	timeline_div_id : "timeline_div",
	fake_stream_begin_time: undefined,
	obsUpdate:function(message, data)
	{
		if (message == "display:timeline_view")
		{
			$("#"+this.timeline_view_DIV_ID).css("display","block");
			if (this.FIRST_CALLED)
			{
				
				this.render(this.timeline_view_DIV_ID);
				this.FIRST_CALLED = false;
			}
		}

		if (message == "hide:timeline_view")
		{
			$("#"+this.timeline_view_DIV_ID).css("display","none");
		}


		if (message == "set:added_timerange")
		{
			var added_timerange = DATA_CENTER.global_variable.added_timerange;
			this._add_marking_plotband(added_timerange.min,added_timerange.max);
		}

		if (message == "set:current_display_time")
		{
	        var current_display_time = DATA_CENTER.global_variable.current_display_time;
	        var chart = $("#"+this.timeline_div_id).highcharts();    // Highcharts构造函数
	        chart.xAxis[0].removePlotLine('time-tick'); //把id为time-tick的标示线删除
	        if (typeof(current_display_time)!=undefined)
	        {
	        	this._plot_tickline(chart,0,"time-tick",current_display_time,"#FF0000","solids");
	        	trajmonitor_view.obsUpdate('stream:trajmonitor_view',+current_display_time)
	        	var index = this._binary_search(chart.series[0].data,"x",current_display_time);
				chart.tooltip.refresh(chart.series[0].data[index]);
			}
		}

		if (message == "set:mouseover_time")
		{
			var mouseover_time = DATA_CENTER.timeline_variable.mouseover_time;
			var chart = $("#"+this.timeline_div_id).highcharts();    // Highcharts构造函数
			chart.xAxis[0].removePlotLine("mouseover-tick"); //把id为mouseover-tick的标示线删除
			if (typeof (mouseover_time)!="undefined")
			{
				this._plot_tickline(chart,0,"mouseover-tick",mouseover_time,"#55BB55","solid");

				var index = this._binary_search(chart.series[0].data,"x",mouseover_time);
				chart.tooltip.refresh(chart.series[0].data[index]);
			}
		}

		if (message == "set:display_rate")
		{
			this.DISPLAY_RATE = DATA_CENTER.timeline_variable.display_rate;
		}

		if (message == "set:display_interval")
		{
			if ( ! DATA_CENTER.timeline_variable.isplaying )
	      	{
	      		this.DISPLAY_INTERVAL = DATA_CENTER.timeline_variable.display_interval;
	      	}
	      	else
	      	{
	      		$("#playbtn_div").click();
	      		this.DISPLAY_INTERVAL = DATA_CENTER.timeline_variable.display_interval;
	      		$("#playbtn_div").click();
	      	}
		}

		if (message == "set:selected_timepoint_set")
        {
            var selected_timepoint_set = DATA_CENTER.global_variable.selected_timepoint_set;

            var chart = $("#"+this.timeline_div_id).highcharts();    // Highcharts构造函数
            var selected_timepoint_dict = {};
            for (var i=0;i<selected_timepoint_set.length;++i)
            {
            	selected_timepoint_dict[selected_timepoint_set[i]] = undefined;
            }
			var new_data = this._initialize_xyAxis_data();

			for (var i=0;i<new_data.length;++i)
			{
				var cur_element = new_data[i];
				var cur_element_timenumber = cur_element[0];
				if (cur_element_timenumber in selected_timepoint_dict)
				{
					cur_element[1] = this.SELECTED_TIMEPOINT_VALUE;
				}
			}
			chart.series[0].remove(false);
            chart.addSeries({
            	color: '#7cb5ec',
            	marker:{
            		enabled:false,
            		symbol:"circle",
            		radius:1,
            	},
                name: "timeline",
                data: new_data,
            },false)
            chart.redraw();

        }
        /*
        if (message == "set:stream_play"){
        	var current_display_time=DATA_CENTER.timeline_variable.stream_start.getTime();
        	//this._timeline_redraw(current_display_time);
        	DATA_CENTER.set_global_variable("current_display_time",current_display_time);


        }
        */

        if (message == "set:selected_filter_timerange")
        {
        	var selected_filter_timerange = DATA_CENTER.global_variable.selected_filter_timerange;
            console.log(selected_filter_timerange)
            var max_time = selected_filter_timerange.max;
            var min_time = selected_filter_timerange.min;


            var chart = $("#"+timeline_view.timeline_div_id).highcharts();
            if (typeof(chart)=="undefined")
            {
                console.warn("undefined timeline")
            }
            else
            {
                chart.xAxis[0].setExtremes(min_time,max_time)
            }
        }

	},
    _timeline_redraw:function(current_display_time){
    	var chart = $("#"+this.timeline_div_id).highcharts();    // Highcharts构造函数
	        chart.xAxis[0].removePlotLine('time-tick'); //把id为time-tick的标示线删除
	    var new_data=[]

	    var end = /*current_display_time*/(new Date('2016 06 16 12:00:00')).valueOf();   // 顶到最前面

        var start = end - DATA_CENTER.timeline_variable./*display_before*/stream_window_width
       

        var cnt = 10000;
        var interval= (end-start)/cnt;

        //var interval = DATA_CENTER.timeline_variable.display_interval;
        //var cnt = (end-start)/interval;


        for(var i =0 ;i<=cnt;i++){
        	new_data.push([i*interval+start,0])
        }

        chart.xAxis[0].removePlotBand('time-tick')
        chart.series[0].remove(false);
        chart.addSeries({
        	color: '#7cb5ec',
        	marker:{
        		enabled:false,
        		symbol:"circle",
        		radius:1,
        	},
            name: "timeline",
            data: new_data,
        })
    },
	_add_marking_plotband:function(min,max)
	{
		var id = "marking-PlotBand"+min+max;//有相同的id的人是一起删除的
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
	        },
	        zIndex:3,
		});
	},

	_add_robotworktime_plotband:function(min,max)
	{
		var id = "robotworktime-PlotBand"+min+max;//有相同的id的人是一起删除的
		var chart = $("#"+this.timeline_div_id).highcharts();
		var axis = chart.xAxis[0];
		axis.addPlotBand({
		   id: id,     // id 用于后续删除用
		   color: '#80a0F0',
		   from: min,
		   to: max,
		   events: {             // 事件，支持 click、mouseover、mouseout、mousemove等事件
	            click: function(e) {
	            },
	            mouseover: function(e) {
	            },
	            mouseout: function(e) {
	            },
	            mousemove: function(e) {
	            }
	        },
	        zIndex:2,
		});
	},

	_add_weekend_plotband:function(min,max)
	{
		var id = "weekend-PlotBand"+min+max;//有相同的id的人是一起删除的
		var chart = $("#"+this.timeline_div_id).highcharts();
		var axis = chart.xAxis[0];
		axis.addPlotBand({
		   id: id,     // id 用于后续删除用
		   color: '#FFFFE8',
		   from: min,
		   to: max,
		   events: {             // 事件，支持 click、mouseover、mouseout、mousemove等事件
	            click: function(e) {
	            },
	            mouseover: function(e) {
	            },
	            mouseout: function(e) {
	            },
	            mousemove: function(e) {
	            }
	        },
	        zIndex:1,
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


	    var start_time = xyAxis_data[0][0];
        var end_time = xyAxis_data[xyAxis_data.length-1][0];
        //console.log(start_time)

       // console.log(end_time)

        DATA_CENTER.set_global_variable("selected_filter_timerange",{min:start_time,max:end_time})
        //console.log(DATA_CENTER.global_variable.selected_filter_timerange)
        //console.log(xyAxis_data)
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

	      	if ( ! DATA_CENTER.timeline_variable.isplaying )//之前是非播放状态。下面要转到播放状态
	      	{
	      		timeline_view.SELECTED_TIMEPOINT=false
	      		DATA_CENTER.set_timeline_variable("isplaying",true);
	        	options = {
		          	label: "pause",
		          	icons: {
		            	primary: "ui-icon-pause"
		          	}
	        	};
	        	var chart = $("#"+timeline_view.timeline_div_id).highcharts();

	        	if (typeof(DATA_CENTER.global_variable.current_display_time) == "undefined" )
	        		DATA_CENTER.set_global_variable("current_display_time",chart.xAxis[0].min);

	        	if (typeof(timeline_view.DISPLAY_INTERVAL) == "undefined")
	        		timeline_view.DISPLAY_INTERVAL = DATA_CENTER.timeline_variable.display_interval;

	        	if (! DATA_CENTER.timeline_variable.isstreaming){
	        		//console.log('tt');
	        		timeline_view.intervalid_handle = setInterval(	function() {
	        		var chart = $("#"+timeline_view.timeline_div_id).highcharts();    // Highcharts构造函数
	        		if (typeof(DATA_CENTER.global_variable.current_display_time) == "undefined" )
						console.warn("undefined display time");

	        		if (typeof(timeline_view.DISPLAY_RATE)=="undefined")
	        			timeline_view.DISPLAY_RATE = DATA_CENTER.timeline_variable.display_rate;

	        		var current_display_time = timeline_view.DISPLAY_RATE*timeline_view.DISPLAY_INTERVAL + DATA_CENTER.global_variable.current_display_time;
                   // console.log(current_display_time)
	        		if (current_display_time <= chart.xAxis[0].max)
	        			DATA_CENTER.set_global_variable("current_display_time",current_display_time);
	        		else
	        			$("#stopbtn_div").click();

					}, timeline_view.DISPLAY_INTERVAL);
	        	}
	        	else{

	           		timeline_view.intervalid_handle = setInterval(	function() {
	        		var chart = $("#"+timeline_view.timeline_div_id).highcharts();    // Highcharts构造函数
	        		if (typeof(DATA_CENTER.global_variable.current_display_time) == "undefined" )
						console.warn("undefined display time");

	        		if (typeof(timeline_view.DISPLAY_RATE)=="undefined")
	        			timeline_view.DISPLAY_RATE = DATA_CENTER.timeline_variable.display_rate;

	        		var current_display_time = 1000*3*60+ DATA_CENTER.global_variable.current_display_time;
                    //console.log(current_display_time)
                    //timeline_view._timeline_redraw(current_display_time)
	        		if (current_display_time <= chart.xAxis[0].max)
	        			DATA_CENTER.set_global_variable("current_display_time",current_display_time);
	        		else
	        			$("#stopbtn_div").click();

					}, timeline_view.DISPLAY_INTERVAL);

	           }
	      	}
	      	else {
	      		timeline_view.SELECTED_TIMEPOINT=true
	      		DATA_CENTER.set_timeline_variable("isplaying",false);
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
	      	label: 'stream',
	      	text : false,
	      	icons: {
	        	primary: "ui-icon-grip-dotted-horizontal"
	      	}
	    })
	    .click(function() {
	    	var options
	    	if (DATA_CENTER.timeline_variable.isplaying)//如果处在播放状态中，先转到暂停，之后再stop
	    	{
	    		options = {
	          		label: "play",
	          		icons: {
	            		primary: "ui-icon-play"
	          		}
	        	};
	        	$( "#playbtn_div" ).button( "option", options );
	        	window.clearInterval(timeline_view.intervalid_handle);
	    	}
	    	//var chart = $("#"+timeline_view.timeline_div_id).highcharts();    // Highcharts构造函数
	    	//timeline_view.fake_stream_begin_time=new Date()
	    
	    	if(DATA_CENTER.timeline_variable.isstreaming==false){
	    		options = {
	          		label: "play",
	          		icons: {
	            		primary: "ui-icon-grip-solid-horizontal"
	          		}
	        	};
	        	$( "#stopbtn_div" ).button( "option", options );
	    		DATA_CENTER.timeline_variable.isstreaming=true
	    		DATA_CENTER.set_timeline_variable("stream_play",true);
	    		DATA_CENTER.set_timeline_variable("isplaying",false);



	    		var chart = $("#"+timeline_view.timeline_div_id).highcharts()
	    		var max_time = (new Date('2016 06 16 12:00:00')).valueOf();  
				var min_time = max_time - DATA_CENTER.timeline_variable.stream_window_width;
       			//chart.xAxis[0].setExtremes(min_time,max_time)
       			DATA_CENTER.set_global_variable("selected_filter_timerange",{min:min_time,max:max_time})

	    	}
	    	else{
	    		options = {
	          		label: "play",
	          		icons: {
	            		primary: "ui-icon-grip-solid-horizontal"
	          		}
	        	};
	        	$( "#stopbtn_div" ).button( "option", options );
	    		DATA_CENTER.timeline_variable.isstreaming=false
	    		timeline_view.render(timeline_view.timeline_view_DIV_ID)


	    		var chart = $("#"+timeline_view.timeline_div_id).highcharts()
	    		var min_time = chart.xAxis[0].dataMin;
	    		var max_time = chart.xAxis[0].dataMax;
	    		chart.xAxis[0].setExtremes(min_time,max_time)


	    	}
	    	$(this).button('option',options)
	    })


	},

	_initialize_xyAxis_data:function()
    {
    	
    	var time_start = Timeutil.getStartTime();

    	var xyAxis_data = [];
    	for (var i=0;i<=4896-144;++i)
    	{
    		var y_value = 0;
    		var x_value = time_start + 1000*60*5*i;
    		var temp = [x_value,y_value];
            xyAxis_data.push(temp)
    	}
    	return xyAxis_data;

    },

	_plot_linechart:function(divID,xyAxis_data)
	{
        d3.select("#"+divID).selectAll("*").remove();
        var start_time
        var end_time
       	var div = $("#"+divID);
       	Highcharts.setOptions({ global: { useUTC: false } });//使用本地时间
        div.highcharts({
        	plotOptions: {
        		line:{
        			events:{
        				mouseOver:function(e){
        					//console.log(e)
        				}
        			}
        		}
        	},

            chart: {
            	spacingTop:0,
                spacingBottom:0,//压缩掉下侧的空白
                renderTo: divID,// 图表加载的位置
                type: 'line',
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                events:{
                	click:function(e){
                		//console.log(e)
                		var clicked_time = e.xAxis[0].value;
                		var index = timeline_view._binary_search(chart.series[0].data,"x",clicked_time);
                		var aligned_time = chart.series[0].data[index].x;
                		DATA_CENTER.set_global_variable("current_display_time",aligned_time);
                	},


                    selection:function(e){
      	
               

	                    	if (typeof(e.resetSelection)!="undefined")


	                    	{
	                    		if (e.resetSelection == true)//如果是按了reset键
	                    		{
	                    			start_time = e.target.xAxis[0].dataMin;
	                        		end_time = e.target.xAxis[0].dataMax;
	                    		}
	                    		else
	                    		{
	                    			start_time = e.xAxis[0].min;
	                        	    end_time = e.xAxis[0].max;
	                    	    }


	                    	}
	                    	else
	                    	{
	                    		start_time = e.xAxis[0].min;
	                        	end_time = e.xAxis[0].max;
	                    	}
	                   		//console.log(new Date(start_time))

	                        DATA_CENTER.set_global_variable("selected_filter_timerange",{min:start_time,max:end_time})

                    },
                },
                resetZoomButton:{
                    position:{
                        align:'right',
                        verticalAlign:"bottom",
                    }
                },
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
            	tickLength:0,
            	tickPosition:"inside",
            	labels:{
            		//enabled:false
            	},
                type: 'datetime',
                dateTimeLabelFormats:{
                    millisecond:"%m.%e, %H:%M",
                    second:"%m.%e, %H:%M",
                    minute:"%m.%e, %H:%M",
                    hour:"%m.%e, %H:%M",
                    day:"%m.%e",
                    week:"%m.%e",
                    month:"%m",
                    year:"%Y",
                }
            },

            yAxis: {
            	labels:{
            		enabled:false
            	},
                title:{
                    text:""
                },
            },

            tooltip: {
            	xDateFormat: '%H:%M:%S',
	            pointFormatter: function() {
	            	//直接去掉值的显示
				    return ''
				},
			},

            series: [{
            	color: '#7cb5ec',
            	marker:{
            		enabled:false,
            		symbol:"circle",
            		radius:1,
            	},
            	name: "timeline",
                data: xyAxis_data,
            }]
        });

        var chart = div.highcharts();

        div.bind('mousemove touchmove touchstart', function (e) {
       		var event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
       		var point = chart.series[0].searchPoint(event, true); // Get the hovered point
       		if (typeof(point)!="undefined")
       		{
       			var mouseover_time = point.x;
       			DATA_CENTER.set_timeline_variable("mouseover_time",mouseover_time)
       		}
	    });


        _draw_robot_worktime();
	    function _draw_robot_worktime()
	    {
	    	//引用全局变量DATES
	    	for (var i=0;i<DATES.length;++i)
	    	{
	    		var cur_date = DATES[i];
	    		var day = (new Date(cur_date)).getDay();
	    		if ( ! ((day==6)||(day==0)) )
	    		{
					var morning_start_string = cur_date+" "+timeline_view.ROBOT_MORNING_WORKTIME_START;
					var morning_start = new Date(morning_start_string).getTime();
					var morning_end_string = cur_date+" "+timeline_view.ROBOT_MORNING_WORKTIME_END;
					var morning_end = new Date(morning_end_string).getTime();
					timeline_view._add_robotworktime_plotband(morning_start,morning_end);

					var afternoon_start_string = cur_date+" "+timeline_view.ROBOT_AFTERNOON_WORKTIME_START;
					var afternoon_start = new Date(afternoon_start_string).getTime();
					var afternoon_end_string = cur_date+" "+timeline_view.ROBOT_AFTERNOON_WORKTIME_END;
					var afternoon_end = new Date(afternoon_end_string).getTime();
					timeline_view._add_robotworktime_plotband(afternoon_start,afternoon_end);
				}
	    	}
	    }

	    _draw_weekend_time();
	    function _draw_weekend_time()
	    {
	    	//引用全局变量DATES
	    	for (var i=0;i<DATES.length;++i)
	    	{
	    		var cur_date = DATES[i];
	    		var day = (new Date(cur_date)).getDay();
	    		if ( (day==6)||(day==0) )
	    		{
	    			var weekend_day_start_time = (new Date(cur_date)).setHours(0);
	    			var weekend_day_end_time = (new Date(cur_date)).setHours(24);
					timeline_view._add_weekend_plotband(weekend_day_start_time,weekend_day_end_time);
	    		}
	    	}
	    }

	    _draw_day_starttime();
	    function _draw_day_starttime()
	    {
	    	var chart = $("#"+timeline_view.timeline_div_id).highcharts();
	    	for (var i=0;i<DATES.length;++i)
	    	{
	    		var cur_date = DATES[i];
	    		day_start_time = (new Date(cur_date)).setHours(0);
	    		timeline_view._plot_tickline(chart,0,"day-starttime-tick",day_start_time,'#80a0F0',"shortdot");
	    		chart.xAxis[0].removePlotBand('day-starttime-tick');
	    	}

	    }




        return chart;
	},

	_plot_tickline:function(chart,series_index,tick_id,x_position,color,dashStyle)
	{
		chart.xAxis[series_index].addPlotLine({           //在x轴上增加
			value:x_position,    //在值为current_display_time的地方
			width:1,                       //标示线的宽度为2px
			color: color,              //标示线的颜色
			id: tick_id,               //标示线的id，在删除该标示线的时候需要该id标示
			dashStyle:dashStyle,
			zIndex:4,//值越大，显示的优先级越高
		});
		var from = new Date(DATA_CENTER.global_variable.current_display_time-trajmonitor_view.display_before)
		var to = new Date(DATA_CENTER.global_variable.current_display_time)
		///console.log(from)
		//console.log(to)
		if(tick_id == 'time-tick'){
			chart.xAxis[0].addPlotBand({
				         //在x轴上增加
				from: from,
				to:to,
				color: '#ccc',
				id: tick_id,
				zIndex:4,//值越大，显示的优先级越高
			});
		}
		//console.log(trajmonitor_view.display_before)
		//console.log(new Date(DATA_CENTER.global_variable.current_display_time-trajmonitor_view.display_before))
		//console.log(new Date(DATA_CENTER.global_variable.current_display_time))
	},


	//二分查找，返回小于等于键值target_value的最大的键值对应的数据
	_binary_search:function(data_array,sorted_attr,target_value)
	{
		var start_index = 0;
		var end_index = data_array.length - 1;
		while (start_index != end_index)
		{
			var middle_index = Math.floor((start_index + end_index)/2);
			var middle_value = data_array[middle_index][sorted_attr];

			var middle_value = new Date(middle_value);
            var middle_value = middle_value.getTime();

			if (middle_value < target_value)
			{
				start_index = middle_index+1;
			}
			if (middle_value >= target_value)
			{
				end_index = middle_index;
			}

			if (start_index == end_index)
			{
				break;
			}
		}

		return start_index;
	}
}
