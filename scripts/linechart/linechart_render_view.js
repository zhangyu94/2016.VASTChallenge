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
    EXPECTED_LINECHART_NUM: 5,


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
            this.update_render(this.linechart_render_view_DIV_ID,selected_linechart_set)
        }


        if ( message == "set:highlight_linechart_set" )
        {
            var highlight_linechart_set = DATA_CENTER.linechart_variable.highlight_linechart_set;
            if (highlight_linechart_set.length >=1 )
            {
                d3.selectAll(".HVAClinechart-btntitle-span")
                    .classed("mouseover_hided-HVAClinechart-btntitle-span",function(d,i){
                        if (DATA_CENTER.linechart_variable.highlight_linechart_set.indexOf(d) >= 0)
                        {
                            return false;
                        }
                        return true;
                    })
            }
            else
            {
                d3.selectAll(".HVAClinechart-btntitle-span")
                    .classed("mouseover_hided-HVAClinechart-btntitle-span",false)
            }
        }

        if (message == "set:current_display_time")
        {
            var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
            for (var i=0;i<selected_attr_set.length;++i)
            {
                var cur_attr_name = selected_attr_set[i];
                var cur_linecharts_id = "HVAClinechart-linechart-span-div-"+this._compress_string(cur_attr_name);

                var current_display_time = DATA_CENTER.global_variable.current_display_time;
                var chart = $("#"+cur_linecharts_id).highcharts();    // Highcharts构造函数
                
                if (typeof(chart)=="undefined")
                {
                    console.warn("undefined chart",cur_attr_name)
                }
                {
                    chart.xAxis[0].removePlotLine('time-tick'); //把id为time-tick的标示线删除
                    if (typeof(current_display_time)!=undefined)
                    {
                        this._plot_tickline(chart,0,"time-tick",current_display_time,"#FF0000","shortdot");
                    }  
                }
            }
        }

        
        if (message == "set:mouseover_time")
        {
            var selected_attr_set = DATA_CENTER.global_variable.selected_attr_set;
            for (var i=0;i<selected_attr_set.length;++i)
            {
                var cur_attr_name = selected_attr_set[i];
                var cur_linecharts_id = "HVAClinechart-linechart-span-div-"+this._compress_string(cur_attr_name);

                var mouseover_time = DATA_CENTER.timeline_variable.mouseover_time;
                var chart = $("#"+cur_linecharts_id).highcharts();    // Highcharts构造函数
                
                if (typeof(chart)=="undefined")
                {
                    console.warn("undefined chart",cur_attr_name)
                }
                else
                {
                    chart.xAxis[0].removePlotLine('mouseover-tick'); //把id为time-tick的标示线删除
                    if (typeof(mouseover_time)!="undefined")
                    {
                        this._plot_tickline(chart,0,"mouseover-tick",mouseover_time,"#55BB55","solid");
                    }  
                }
            }
        }
        

	},


    //将一组linechart的名字列表转换成[{name:...,linechart_set:[...]}]的形式
    //name是属性的名字，linechart_set存储了linechart_list中所有属于这个属性的linechart名字
    _divide_linechart_list:function(linechart_list)
    {
        var divide_attr_list = [];
        for (var i=0;i<linechart_list.length;++i)
        {
            var cur_linechart_name = linechart_list[i];
            var position_attr = DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view._parse_position_attr(cur_linechart_name);
            var attr = position_attr.attr;

            var index = 0;
            for (;index<divide_attr_list.length;++index)
            {
                if (divide_attr_list[index].name == attr)
                {
                    divide_attr_list[index].linechart_set[cur_linechart_name] = true;

                    break;
                }
            }
            if (index == divide_attr_list.length)
            {
                divide_attr_list.push({
                    name: attr,
                    linechart_set: [],
                });
                divide_attr_list[divide_attr_list.length-1].linechart_set[cur_linechart_name] = true;
            }
        }
        return divide_attr_list;
    },


    update_render:function(divID,new_linechart_list)
    {
        var divide_attr_list = this._divide_linechart_list(new_linechart_list);

        var width  = $("#"+divID).width();
        var height  = $("#"+divID).height();
        var rect_width = width-20;

        var rect_height = height/this.EXPECTED_LINECHART_NUM-2;
        

        var btn_width = rect_width*0.14;

        var linechart_width = rect_width-btn_width-12;
        var linechart_height = rect_height-4;

        var update = d3.select("#"+divID)
            .selectAll(".HVAClinechart-span")
            .data(divide_attr_list,function(d){return d.name;});


        update.attr("style",function(d,i){
                return "height:"+rect_height+"px;" + "width:"+rect_width+"px;"
            })

        var update_btnspan = update.select(".HVAClinechart-btntitle-span");
        var update_linechartspan = update.select(".HVAClinechart-linechart-span")
                .style("height",linechart_height+"px");
        var update_linechartspan_div = update_linechartspan.select("div")
                .style("height",linechart_height+"px")
                .each(function(d,i){
                    var attr_name_set = d.linechart_set;
                    var existing_series = $(this).highcharts().series;

                    //1. 增加选中的新序列
                    for (var attr in attr_name_set)//attr是未压缩的名字
                    {             
                        var flag_find = false;
                        for (var j=0;j<existing_series.length;++j)
                        {
                            var cur_name = existing_series[j].name;//cur_name是chart的压缩过的名字
                            if (cur_name == linechart_render_view._compress_full_attr_name(attr))
                            {
                                flag_find = true;
                                break;
                            }
                        }

                        if (!flag_find)
                        {
                            var average_sigma = HVAC_ATTR_OLD_AVERAGE_SIGMA[attr];
                            if (typeof(average_sigma)=="undefined")
                            {
                                var average = 0;
                                var sigma = 0;
                            }
                            else
                            {
                                var average = average_sigma.average;
                                var sigma = average_sigma.sigma;
                            }

                            var ysetAxis_attr_name = [attr];
                            var xysetAxis_data = linechart_render_view._get_xysetAxis_data(ysetAxis_attr_name);
                            var chart = $(this).highcharts().addSeries({
                                name: attr,
                                data: xysetAxis_data[0],
                                marker:{
                                    enabled:false,
                                    radius:1,
                                },
                                events:{
                                    mouseOver:function(){
                                        console.log("over",this.name)
                                        var name = this.name;
                                        DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
                                            ._highlight_communication_mouseover_linebtn(name);
                                    },
                                    mouseOut:function(){
                                        console.log("out",this.name)
                                        var name = this.name;
                                        DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
                                            ._highlight_communication_mouseout_linebtn();
                                    }

                                },
                                zones:[
                                {
                                    value: average-sigma*HVAC_STATISTIC_UTIL.ABNORMAL_VALUE_THRESHOLD,
                                    color: "red",
                                },
                                {
                                    value: average+sigma*HVAC_STATISTIC_UTIL.ABNORMAL_VALUE_THRESHOLD,
                                    color: '#7cb5ec',
                                },
                                {
                                    color: "red",
                                }]
                            })

                        }
                    }

                    //2. 删除不再选中的老序列
                    for (var j=0;j<existing_series.length;++j)
                    {             
                        var flag_find = false;
                        for (var attr in attr_name_set)
                        {
                            var cur_name = existing_series[j].name;
                            if (cur_name == linechart_render_view._compress_full_attr_name(attr))
                            {
                                flag_find = true;
                                break;
                            }
                        }
                        if (!flag_find)
                        {
                            $(this).highcharts().series[j].remove();
                        }
                    }



                })


        var enter = update.enter();

        var enter_spans = enter.insert("span")
                .attr("class","HVAClinechart-span")
                .attr("id",function(d,i){
                    return "HVAClinechart-span-"+linechart_render_view._compress_string(d.name);
                })
                .attr("style",function(d,i){
                    return "height:"+rect_height+"px;" + "width:"+rect_width+"px;"
                })
                .on("click",function(d,i){
                })
                .on("mouseover",function(d,i){
                    DATA_CENTER.VIEW_COLLECTION.linechart_render_view
                        ._highlight_communication_mouseover_attrlinechartspan(d.name)
                })
                .on("mouseout",function(d,i){
                    DATA_CENTER.VIEW_COLLECTION.linechart_render_view
                        ._highlight_communication_mouseover_attrlinechartspan()
                })

        //小按钮们
        //1). 带着名字的大框
        var enter_spans_btnspan = enter_spans.append("span")
                .attr("class","HVAClinechart-btntitle-span")
                .attr("id",function(d,i){
                    //id中不能带空格，否则后面选不中
                    return "HVAClinechart-btntitle-span-"+linechart_render_view._compress_string(d.name);
                })
                .style("width",btn_width+"px")
                .text(function(d,i){
                    var buttonLabel = DATA_CENTER.GLOBAL_STATIC.attribute_description[d.name].lv2_abbreviation;
                    return buttonLabel;
                });
        $('.HVAClinechart-btntitle-span').each(function() {
            $(this).tipsy({
                gravity: "s",
                html:true,
                title:function(){
                    var d = this.__data__;
                    var compressed_attr_name = DATA_CENTER.GLOBAL_STATIC.attribute_description[d.name].lv2_abbreviation;
                    return compressed_attr_name;
                },
            });
        });

        //2). 点击以后mark到timeline上
        var enter_spans_btnspan_markspan = enter_spans_btnspan.append("span") 
                .attr("class","HVAClinechart-btn-mark-span")
                .attr("id",function(d,i){
                    //id中不能带空格，否则后面选不中
                    return "HVAClinechart-btn-mark-span-"+linechart_render_view._compress_string(d.name);
                })
                .text("m")    
                .on("click",function(d,i){
                    var related_linechart_div_id = "HVAClinechart-linechart-span-div-"+linechart_render_view._compress_string(d.name)
                    
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
                    return "HVAClinechart-btn-top-span-"+linechart_render_view._compress_string(d.name);
                })
                .text("up")
                .on("click",function(d,i){
                    var child_id = "HVAClinechart-span-"+linechart_render_view._compress_string(d.name);
                    var father_id = linechart_render_view.linechart_render_view_DIV_ID;
                    linechart_render_view._move_to(child_id,father_id,"top");//点击以后走到最上面
                })
        //4). 点击以后走到最下边
        var enter_spans_btnspan_bottomspan = enter_spans_btnspan.append("span") 
                .attr("class","HVAClinechart-btn-bottom-span")
                .attr("id",function(d,i){
                    //id中不能带空格，否则后面选不中
                    return "HVAClinechart-btn-bottom-span-"+linechart_render_view._compress_string(d.name);
                })
                .text("dn")    
                .on("click",function(d,i){
                    var child_id = "HVAClinechart-span-"+linechart_render_view._compress_string(d.name);
                    var father_id = linechart_render_view.linechart_render_view_DIV_ID;
                    linechart_render_view._move_to(child_id,father_id,"bottom");//点击以后走到最下面
                })

        var enter_spans_linechartspan = enter_spans.append("span")
                .attr("class","HVAClinechart-linechart-span")
                .attr("id",function(d,i){
                    return "HVAClinechart-linechart-span-"+linechart_render_view._compress_string(d.name);
                })
                .style("width",linechart_width+"px")
                .style("height",linechart_height+"px")
                .text(function(d,i){ return ""});

        var enter_spans_linechartspan_div = enter_spans_linechartspan.append("div")
                .style("width",linechart_width+"px")
                .style("height",linechart_height+"px")
                .attr("id",function(d,i){
                    return "HVAClinechart-linechart-span-div-"+linechart_render_view._compress_string(d.name);
                })
                .each(function(d,i){
                    var divID = this.id;
                    var attr_name_set = d.linechart_set;

                    var ysetAxis_attr_name = [];
                    for (attr in attr_name_set)
                    {
                        ysetAxis_attr_name.push(attr);
                    }
                    var xysetAxis_data = linechart_render_view._get_xysetAxis_data(ysetAxis_attr_name);
                    var chart = linechart_render_view._plot_linechart(divID,xysetAxis_data,ysetAxis_attr_name);
                });

        var exit = update.exit();
        exit.remove();
    },

    _get_xysetAxis_data:function(yAxis_attr_name_set)
    {
        //使用的全局变量
        var data_set = [];
        for (i=0;i<yAxis_attr_name_set.length;++i)
        {
            var cur_yAxis_attr_name = yAxis_attr_name_set[i];
            if (cur_yAxis_attr_name in this.HAZIUM_DATA_FILENAME_MAPPING)
            {
                data_set[i] = DATA_CENTER.original_data[this.HAZIUM_DATA_FILENAME_MAPPING[yAxis_attr_name_set[i]]];
            }
            else
            {
                data_set[i] = DATA_CENTER.original_data["bldg-MC2.csv"];
            }
        }
        //end 全局变量

        var xAxis_attr_name = "Date/Time";
        var xysetAxis_data = [];
        for (var i=0;i<yAxis_attr_name_set.length;++i)
        {
            xysetAxis_data[i] = [];
            for (var j=0;j<data_set[i].length;++j)
            {
                var y_value = data_set[i][j][yAxis_attr_name_set[i]];

                var x_value = new Date(data_set[i][j][xAxis_attr_name]);
                var x_value = x_value.getTime();

                var temp = [x_value,y_value];
                xysetAxis_data[i].push(temp)
            }             
        }
        return xysetAxis_data;
    },



	_plot_linechart:function(divID,xysetAxis_data,ysetAxis_original_name)
	{
        var series_data = [];
        for (var i=0;i<xysetAxis_data.length;++i)
        {
            var attr_name = ysetAxis_original_name[i];

            var average_sigma = HVAC_ATTR_OLD_AVERAGE_SIGMA[attr_name];
            if (typeof(average_sigma)=="undefined")
            {
                var average = 0;
                var sigma = 0;
            }
            else
            {
                var average = average_sigma.average;
                var sigma = average_sigma.sigma;
            }


            var data = xysetAxis_data[i];

            data.push
            series_data.push({
                name: attr_name,
                data: data,
                id: attr_name,
                marker:{
                    enabled:false,
                    radius:1,
                },
                events:{
                    mouseOver:function(){
                        console.log("over",this.name)
                        var name = this.name;
                        DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
                            ._highlight_communication_mouseover_linebtn(name);
                    },
                    mouseOut:function(){
                        console.log("out",this.name)
                        var name = this.name;
                        DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
                            ._highlight_communication_mouseout_linebtn();
                    }

                },

                zones:[
                {
                    value: average-sigma*HVAC_STATISTIC_UTIL.ABNORMAL_VALUE_THRESHOLD,
                    color: "red",
                },
                {
                    value: average+sigma*HVAC_STATISTIC_UTIL.ABNORMAL_VALUE_THRESHOLD,
                    color: '#7cb5ec',
                },
                {
                    color: "red",
                }]

            })
        }

        d3.select("#"+divID).selectAll("*").remove();
        
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
                    click:function(e){
                        var clicked_time = e.xAxis[0].value;
                        var index = timeline_view._binary_search(chart.series[0].data,"x",clicked_time);
                        var aligned_time = chart.series[0].data[index].x;
                        DATA_CENTER.set_global_variable("current_display_time",aligned_time);
                    },
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
                headerFormat: '',
                pointFormatter: function() {
                    return linechart_render_view._compress_full_attr_name(this.series.name) +":" + this.y;
                },    
                footerFormat:'',
                
                borderWidth:1,
                style:{
                    fontSize:"8px",

                },

            },
            
            series: series_data,
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
                    title:function(){
                        var d = this.__data__;
                        var compressed_attr_name = DATA_CENTER.GLOBAL_STATIC.attribute_description[d.name].lv2_abbreviation;
                        return compressed_attr_name;
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
        var attr = DATA_CENTER.GLOBAL_STATIC.attribute_description[pureattr_name].lv2_abbreviation;
        if ( typeof(attr) =="undefined" )
        {
            console.warn("invalid attr",pureattr_name);
            return pureattr_name;
        }
        return attr;
    },

    _highlight_communication_mouseover_attrlinechartspan:function(attr_name)
    {
        //1.高亮attr
        var highlight_attr_set = [attr_name];
        DATA_CENTER.set_linechart_variable("highlight_attr_set",highlight_attr_set);

    },

    _highlight_communication_mouseout_attrlinechartspan:function()
    {
        //1.取消高亮attr
        DATA_CENTER.set_linechart_variable("highlight_attr_set",[]);

    },
}