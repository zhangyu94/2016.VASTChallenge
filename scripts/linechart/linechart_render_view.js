var linechart_render_view = {
	obsUpdate:function(message, data)
	{
        if (  (message == "set:selected_linechart_set")  )
        {
            var selected_linechart_set = DATA_CENTER.global_variable.selected_linechart_set;
            this.update_render("linechart-renderplace",selected_linechart_set)
        }
	},
    update_render:function(divID,new_linechart_list)
    {
        var width  = $("#"+divID).width();
        var height  = $("#"+divID).height();
        var rect_width = width;
        var rect_height = height/new_linechart_list.length-5;



        var update = d3.select("#"+divID)
            .selectAll(".HVAClinechart-span")
            .data(new_linechart_list,function(d){return d;});

        update.attr("style",function(d,i){
                return "height:"+rect_height+"px;" + "width:"+rect_width+"px;"
            })

        //update.select("div")
        //    .select("span")







        var enter = update.enter();
        var enter_spans = enter.insert("span")
                .attr("class","HVAClinechart-span")
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .attr("style",function(d,i){
                    return "height:"+rect_height+"px;" + "width:"+rect_width+"px;"
                })
                .on("click",function(d,i){
                    console.log(d,i)
                });

        var enter_spans_div = enter_spans.append("div")
                //.attr("class","btn-div")
                //.attr("id",function(d,i){
                //    return "btn-div-"+d;
                //})
                .attr("style","position:relative");

        var enter_spans_div_btnspan = enter_spans_div.append("span")
                .attr("class","HVAClinechart-btntitle-span")
                .attr("id",function(d,i){
                    return "HVAClinechart-btntitle-span-"+d;
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .text(function(d,i){
                    return "hhh"
                });
        var enter_spans_div_linechartspan = enter_spans_div.append("span")
                .attr("class","HVAClinechart-linechart-span")
                .attr("id",function(d,i){
                    return "HVAClinechart-linechart-span-"+d;
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .text(function(d,i){
                    return "ppp"
                });








        var exit = update.exit();
        exit.remove();
    },

    _get_xyAxis_data:function(yAxis_attr_name)
    {
        //使用的全局变量
        var data = DATA_CENTER.original_data["bldg-MC2.csv"];
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

    //var xyAxis_data = this._get_xyAxis_data:function(yAxis_attr_name)
    //this._plot_linechart(divID,xyAxis_data)
	_plot_linechart:function(divID,xyAxis_data)
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