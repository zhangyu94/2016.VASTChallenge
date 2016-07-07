var linechart_render_view = {
    FIRST_CALLED : true,
    linechart_render_view_DIV_ID : "linechart-renderplace",

    HAZIUM_DATA_FILENAME_MAPPING:{
        "F_1_Z_8A Hazium Concentration":"f1z8a-MC2.csv",
        "F_2_Z_2 Hazium Concentration":"f2z2-MC2.csv",
        "F_2_Z_4 Hazium Concentration":"f2z4-MC2.csv",
        "F_3_Z_1 Hazium Concentration":"f3z1-MC2.csv",
    },

    //为折线图的大框设置最小尺寸，避免过小看不清楚
    MINIMUM_LINECHART_RECT_HEIGHT : 27,
    EXPECTED_LINECHART_NUM: 15,


	obsUpdate:function(message, data)
	{
        if (message == "display:linechart_render_view")
        {
            $("#"+this.linechart_render_view_DIV_ID).css("display","block");

            if (this.FIRST_CALLED)
            {
                $( "#"+this.linechart_render_view_DIV_ID ).sortable({
                    handle: ".HVAClinechart-btntitle-span",//btn作为sort的时候的把手
                });
                this.FIRST_CALLED = false;
            }
        }

        if (message == "hide:linechart_render_view")
        {
            $("#"+this.linechart_render_view_DIV_ID).css("display","none");
        }


        if ( message == "set:selected_linechart_set" )
        {
            var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
            this.update_render("linechart-renderplace",selected_linechart_set)
        }

        if ( message == "set:highlight_linechart_set" )
        {
            d3.selectAll(".HVAClinechart-btntitle-span")
                .classed("mouseover_selected-HVAClinechart-btntitle-span",function(d,i){
                    if (DATA_CENTER.linechart_variable.highlight_linechart_set.indexOf(d) >= 0)
                    {
                        return true;
                    }
                    return false;
                })
        }

        if (message == "set:current_display_time")
        {
            var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
            for (var i=0;i<selected_linechart_set.length;++i)
            {
                var cur_linechart_name = selected_linechart_set[i];
                var cur_linechart_id = "HVAClinechart-linechart-span-div-"+this._compress_string(cur_linechart_name);

                var current_display_time = DATA_CENTER.global_variable.current_display_time;
                var chart = $("#"+cur_linechart_id).highcharts();    // Highcharts构造函数
                chart.xAxis[0].removePlotLine('time-tick'); //把id为time-tick的标示线删除
                if (typeof(current_display_time)!=undefined)
                {
                    this._plot_tickline(chart,0,"time-tick",current_display_time,"#FF0000","shortdot");
                }  
            }
        }

        if (message == "set:mouseover_time")
        {
            var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
            for (var i=0;i<selected_linechart_set.length;++i)
            {
                var cur_linechart_name = selected_linechart_set[i];
                var cur_linechart_id = "HVAClinechart-linechart-span-div-"+this._compress_string(cur_linechart_name);

                var mouseover_time = DATA_CENTER.timeline_variable.mouseover_time;
                var chart = $("#"+cur_linechart_id).highcharts();    // Highcharts构造函数
                chart.xAxis[0].removePlotLine('mouseover-tick'); //把id为time-tick的标示线删除
                if (typeof(mouseover_time)!=undefined)
                {
                    this._plot_tickline(chart,0,"mouseover-tick",mouseover_time,"#55BB55","solid");
                }  
            }
        }

	},
    update_render:function(divID,new_linechart_list)
    {
        var width  = $("#"+divID).width();
        var height  = $("#"+divID).height();
        var rect_width = width-20;

        var rect_height = height/this.EXPECTED_LINECHART_NUM-2;
        //var rect_height = height/new_linechart_list.length-4;
        //if (rect_height < this.MINIMUM_LINECHART_RECT_HEIGHT)//避免尺寸过小看不清楚
        //{
        //    rect_height = this.MINIMUM_LINECHART_RECT_HEIGHT;
        //}

        var btn_width = rect_width*0.14;

        var linechart_width = rect_width-btn_width-12;
        var linechart_height = rect_height-4;

        var update = d3.select("#"+divID)
            .selectAll(".HVAClinechart-span")
            .data(new_linechart_list,function(d){return d;});

        update.attr("style",function(d,i){
                return "height:"+rect_height+"px;" + "width:"+rect_width+"px;"
            })

        var update_btnspan = update.select(".HVAClinechart-btntitle-span");

        var update_linechartspan = update.select(".HVAClinechart-linechart-span")
                .style("height",linechart_height+"px");

        var update_linechartspan_div = update_linechartspan.select("div")
                .style("height",linechart_height+"px")
                //.each(function(d,i){
                //    var divID = this.id;
                //    //找到绑定好的highchart
                //    var chart = $("#"+divID).highcharts();
                //    chart.reflow();//适应新的div尺寸
                //});



        var enter = update.enter();

        var enter_spans = enter.insert("span")
                .attr("class","HVAClinechart-span")
                .attr("id",function(d,i){
                    return "HVAClinechart-span-"+linechart_render_view._compress_string(d);
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .attr("style",function(d,i){
                    return "height:"+rect_height+"px;" + "width:"+rect_width+"px;"
                })
                .on("click",function(d,i){
                    //console.log(d,i)
                })
                .on("mouseover",function(d,i){

                    _highlight_communication(d,i);
                    function _highlight_communication(d,i)
                    {
                        //1. 高亮linechart
                        var highlight_linechart_set = [d];
                        DATA_CENTER.set_linechart_variable("highlight_linechart_set",highlight_linechart_set);

                        var place_attr = linechart_linebtn_view._parse_position_attr(d);

                        //2. 高亮attr
                        var attr = place_attr.attr;
                        var highlight_attr_set = [attr];
                        DATA_CENTER.set_linechart_variable("highlight_attr_set",highlight_attr_set);

                        //3. 高亮place
                        var place = place_attr.place;
                        var place_type = place_attr.place_type;
                        if (place_type == "building")
                        {
                            DATA_CENTER.set_linechart_variable("highlight_building_set",[place]);
                        }
                        else if (place_type == "floor")
                        {
                            DATA_CENTER.set_linechart_variable("highlight_floor_set",[place]);
                        }
                        else if (place_type == "HVACzone")
                        {
                            DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",[place]);
                        }
                        
                    }

                })
                .on("mouseout",function(d,i){

                    _highlight_communication(d,i);
                    function _highlight_communication(d,i)
                    {
                        //1. 取消高亮linechart
                        DATA_CENTER.set_linechart_variable("highlight_linechart_set",[]);

                        //2. 取消高亮attr
                        DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);

                        //3. 取消高亮place
                        DATA_CENTER.set_linechart_variable("highlight_HVACzone_set",[]);
                        DATA_CENTER.set_linechart_variable("highlight_floor_set",[]);
                        DATA_CENTER.set_linechart_variable("highlight_building_set",[]);
                    }

                })

        //小按钮们
        //1). 带着名字的大框
        var enter_spans_btnspan = enter_spans.append("span")
                .attr("class","HVAClinechart-btntitle-span")
                .attr("id",function(d,i){
                    //id中不能带空格，否则后面选不中
                    return "HVAClinechart-btntitle-span-"+linechart_render_view._compress_string(d);
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .style("width",btn_width+"px")
                .text(function(d,i){
                    var attr = d;
                    var compressed_name = DATA_CENTER.VIEW_COLLECTION.linechart_render_view._compress_full_attr_name(attr);
                    var buttonLabel = compressed_name.substring(0,btn_width/9.5);
                    return buttonLabel;
                });
        $('.HVAClinechart-btntitle-span').each(function() {
            $(this).tipsy({
                gravity: "s",
                html:true,
                //delayIn: 500,
                title:function(){
                    var d = this.__data__;

                    var place_attr = linechart_linebtn_view._parse_position_attr(d);
                    var attr = place_attr.attr;
                    var place = place_attr.place;
                    var place_type = place_attr.place_type;

                    var content =   "attr: " + "<span style='color:red'>" + attr + "</span>" + "</br>"+
                                    "place: " + "<span style='color:red'>" + place + "</span>" + "</br>";
                    return content;
                },
            });
        });

        //2). 点击以后mark到timeline上
        var enter_spans_btnspan_markspan = enter_spans_btnspan.append("span") 
                .attr("class","HVAClinechart-btn-mark-span")
                .attr("id",function(d,i){
                    //id中不能带空格，否则后面选不中
                    return "HVAClinechart-btn-mark-span-"+linechart_render_view._compress_string(d);
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .text("m")    
                .on("click",function(d,i){
                    var related_linechart_div_id = "HVAClinechart-linechart-span-div-"+linechart_render_view._compress_string(d)
                    var chart = $("#"+related_linechart_div_id).highcharts();

                    var added_timerange = {
                        min:chart.xAxis[0].min,
                        max:chart.xAxis[0].max,
                    };
                    DATA_CENTER.set_global_variable("added_timerange",added_timerange);
                })
        //3). 点击以后走到最上边
        var enter_spans_btnspan_topspan = enter_spans_btnspan.append("span") 
                .attr("class","HVAClinechart-btn-top-span")
                .attr("id",function(d,i){
                    //id中不能带空格，否则后面选不中
                    return "HVAClinechart-btn-top-span-"+linechart_render_view._compress_string(d);
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .text("up")
                .on("click",function(d,i){
                    var child_id = "HVAClinechart-span-"+linechart_render_view._compress_string(d);
                    var father_id = "linechart-renderplace";
                    linechart_render_view._move_to(child_id,father_id,"top");//点击以后走到最上面
                })
        //4). 点击以后走到最下边
        var enter_spans_btnspan_bottomspan = enter_spans_btnspan.append("span") 
                .attr("class","HVAClinechart-btn-bottom-span")
                .attr("id",function(d,i){
                    //id中不能带空格，否则后面选不中
                    return "HVAClinechart-btn-bottom-span-"+linechart_render_view._compress_string(d);
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .text("dn")    
                .on("click",function(d,i){
                    var child_id = "HVAClinechart-span-"+linechart_render_view._compress_string(d);
                    var father_id = "linechart-renderplace";
                    linechart_render_view._move_to(child_id,father_id,"bottom");//点击以后走到最下面
                })
        //5). 点击以后归一化
        var enter_spans_btnspan_normalizespan = enter_spans_btnspan.append("span") 
                .attr("class","HVAClinechart-btn-normalize-span")
                .attr("id",function(d,i){
                    //id中不能带空格，否则后面选不中
                    return "HVAClinechart-btn-normalize-span-"+linechart_render_view._compress_string(d);
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .text("n")    
                .on("click",function(d,i){
                    var related_linechart_div_id = "HVAClinechart-linechart-span-div-"+linechart_render_view._compress_string(d)
                    var chart = $("#"+related_linechart_div_id).highcharts();

                    var normalize_data=[];
                    
                    var data = chart.series[0].data;
                    
                    var average = 0;
                    for (var j=0;j<data.length;++j)
                    {
                        average+=data[j].y;
                    }
                    var average = average/data.length;

                    var sigma = 0;
                    for (var j=0;j<data.length;++j)
                    {
                        sigma+=(average - data[j].y)*(average - data[j].y);
                    }
                    sigma = sigma/data.length;
                    sigma = Math.sqrt(sigma)

                    for (var j=0;j<data.length;++j)
                    {
                        var y_value = (data[j].y-average);
                        if (sigma != 0)
                        {
                            y_value = y_value/sigma;
                        }
                        var x_value = data[j].x;
                        var temp = [x_value,y_value];
                        normalize_data.push(temp)
                    }

                    chart.series[0].remove(false);
                    chart.addSeries({
                        name: d.substring(0,7),
                        data:normalize_data,
                        zones:[
                        {
                            value: -HVAC_STATISTIC_UTIL.ABNORMAL_VALUE_THRESHOLD,
                            color: "red",
                        },
                        {
                            value: HVAC_STATISTIC_UTIL.ABNORMAL_VALUE_THRESHOLD,
                            color: '#7cb5ec',
                        },
                        {
                            color: "red",
                        }
                        ]
                    },false)
                    chart.redraw();
                    
                })
        

        var enter_spans_linechartspan = enter_spans.append("span")
                .attr("class","HVAClinechart-linechart-span")
                .attr("id",function(d,i){
                    return "HVAClinechart-linechart-span-"+linechart_render_view._compress_string(d);
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .style("width",linechart_width+"px")
                .style("height",linechart_height+"px")
                .text(function(d,i){ return ""});

        var enter_spans_linechartspan_div = enter_spans_linechartspan.append("div")
                .style("width",linechart_width+"px")
                .style("height",linechart_height+"px")
                .attr("id",function(d,i){
                    return "HVAClinechart-linechart-span-div-"+linechart_render_view._compress_string(d);
                })
                .each(function(d,i){
                    var divID = this.id;
                    var yAxis_attr_name = d;
                    var xyAxis_data = linechart_render_view._get_xyAxis_data(yAxis_attr_name);

                    var compressed_name = DATA_CENTER.VIEW_COLLECTION.linechart_render_view._compress_full_attr_name(yAxis_attr_name);
                    //调用完以后，highchart就绑定到这个div上了
                    var chart = linechart_render_view._plot_linechart(divID,xyAxis_data,compressed_name);
                });



        var exit = update.exit();
        exit.remove();
    },

    _get_xyAxis_data:function(yAxis_attr_name)
    {
        //使用的全局变量
        var data;
        if (yAxis_attr_name in this.HAZIUM_DATA_FILENAME_MAPPING)
        {
            data = DATA_CENTER.original_data[this.HAZIUM_DATA_FILENAME_MAPPING[yAxis_attr_name]];
        }
        else
        {
            data = DATA_CENTER.original_data["bldg-MC2.csv"];
        }
        //end 全局变量

        var xAxis_attr_name = "Date/Time";
        var xyAxis_data = [];
        for (var i=0;i<data.length;++i)
        {
            var y_value = data[i][yAxis_attr_name];

            var x_value = new Date(data[i][xAxis_attr_name]);
            var x_value = x_value.getTime();

            var temp = [x_value,y_value];
            xyAxis_data.push(temp)
        }             
        return xyAxis_data;
    },

	_plot_linechart:function(divID,xyAxis_data,yAxis_attr_name)
	{
        d3.select("#"+divID).selectAll("*").remove();
		//var width  = $("#"+divID).width();
        //var height  = $("#"+divID).height();
        
        var div = $("#"+divID);
        Highcharts.setOptions({ global: { useUTC: false } });//使用本地时间
        div.highcharts({
            chart: {
                spacingRight:0,
                spacingLeft:0,
                spacingTop:0,
                spacingBottom:0,//压缩掉下侧的空白
                //width:width,
                //height:height,
                renderTo: divID,// 图表加载的位置
                type: 'line',//'column',
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                resetZoomButton:{
                    position:{
                        align:'right',
                        verticalAlign:"top",
                        y:-5,
                    }
                },
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
                tickPosition:"inside",
                labels:{
                    enabled:false
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
                
                labels:{
                    enabled:false
                },
                
                title:{
                    text:""
                }
            },

            tooltip:{
                useHTML: true,
                headerFormat: '',//'<small>{point.key}</small><table>',
                pointFormat: '<tr><td style="color: {series.color}">{series.name}: </td>' +
                    '<td style="text-align: right"><b>{point.y}</b></td></tr>',
                footerFormat:'',// '</table>',
                
                borderWidth:1,
                style:{
                    fontSize:"8px",

                },

            },
            
            series: [{
                name: yAxis_attr_name,//.substring(0,7),
                data: xyAxis_data,
            }]
        });

        var chart = div.highcharts()

        div.bind('mousemove touchmove touchstart', function (e) {
            var event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart   
            var point = chart.series[0].searchPoint(event, true); // Get the hovered point
            if (typeof(point)!="undefined")
            {
                var mouseover_time = point.x;
                DATA_CENTER.set_timeline_variable("mouseover_time",mouseover_time)
            }
        });
        
        return chart;
	},

    _plot_tickline:function(chart,series_index,tick_id,x_position,color,dashStyle)
    {
        chart.xAxis[series_index].addPlotLine({           //在x轴上增加
            value:x_position,    //在值为current_display_time的地方
            width:1,                       //标示线的宽度为2px
            color: color,              //标示线的颜色
            id: tick_id,               //标示线的id，在删除该标示线的时候需要该id标示
            dashStyle:dashStyle/*"shortdot"*/,
            zIndex:99,//值越大，显示的优先级越高
        });     
    },

    //只保留字符串中的数字和字母，其他全都删光
    //设id的时候调用一下这个可以确保安全
    _compress_string:function(string)
    {
        string = string.replace(/[^0-9 | ^a-z ]+/ig,"");
        string = string.replace(/\s/g, "");
        return string;
    },

    //将一个child的html移动到其father的下边的某个位置
    //形如linechart_render_view._move_to("HVAClinechart-span-F3BATHEXHAUSTFanPower","linechart-renderplace","bottom")
    _move_to:function(child_id,father_id,place)
    {
        var child=$("#"+child_id);
        child.remove();
        if (place == "top")
        {
            $("#"+father_id).prepend(child)
        }
        else if (place == "bottom")
        {
            $("#"+father_id).append(child)
        }
        else
        {
            console.warn("invalid place",place)
        }

        reset_tipsy();
        function reset_tipsy(){
            d3.selectAll(".tipsy").remove();
            $('.HVAClinechart-btntitle-span').each(function() {
                $(this).tipsy({
                    gravity: "s",
                    html:true,
                    //delayIn: 500,
                    title:function(){
                        var d = this.__data__;

                        var place_attr = linechart_linebtn_view._parse_position_attr(d);
                        var attr = place_attr.attr;
                        var place = place_attr.place;
                        var place_type = place_attr.place_type;

                        var content =   "attr: " + "<span style='color:red'>" + attr + "</span>" + "</br>"+
                                        "place: " + "<span style='color:red'>" + place + "</span>" + "</br>";
                        return content;
                    },
                });
            });
        }

    },

    //将原始数据中一个具体的带着地点和属性信息的字符串压缩成合适的新字符串
    _compress_full_attr_name:function(full_attr_name)
    {
        var place_attr = DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view._parse_position_attr(full_attr_name);
        var place = place_attr.place;
        place = (DATA_CENTER.VIEW_COLLECTION.linechart_render_view._compress_string(place)).substring(0,6);
        var attr = DATA_CENTER.VIEW_COLLECTION.linechart_render_view._map_pureattr_name_to_abbreviation(place_attr.attr);
        var return_attr_name = place + " " + attr;
        return return_attr_name;
    },

    _map_pureattr_name_to_abbreviation:function(pureattr_name)
    {
        var attr = DATA_CENTER.GLOBAL_STATIC.attribute_abbreviation[pureattr_name];
        if ( typeof(attr) =="undefined" )
        {
            console.warn("invalid attr",pureattr_name);
            return pureattr_name;
        }
        return attr;
    },


}