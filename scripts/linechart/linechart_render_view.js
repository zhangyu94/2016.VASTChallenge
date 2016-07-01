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
        var rect_height = height/new_linechart_list.length;//-5;

        var btn_width = rect_width*0.04;
        //var btn_height = rect_height-12;

        var linechart_width = rect_width-btn_width-12;
        var linechart_height = rect_height-2;

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
                .each(function(d,i){
                    console.log("reach22")
                    var divID = this.id
                    var yAxis_attr_name = d;
                    var xyAxis_data = linechart_render_view._get_xyAxis_data(yAxis_attr_name);
                    linechart_render_view._plot_linechart(divID,xyAxis_data);
                });




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

        var enter_spans_btnspan = enter_spans.append("span")
                .attr("class","HVAClinechart-btntitle-span")
                .attr("id",function(d,i){
                    return "HVAClinechart-btntitle-span-"+i;
                })
                .attr("value",function(d,i){
                    var buttonValue = new_linechart_list[i];
                    return buttonValue;
                })
                .style("width",btn_width+"px")
                //.style("height",btn_height+"px")
                .text(function(d,i){
                    var buttonLabel = d.substring(0,btn_width/13);
                    return buttonLabel;
                });

        var enter_spans_linechartspan = enter_spans.append("span")
                .attr("class","HVAClinechart-linechart-span")
                .attr("id",function(d,i){
                    return "HVAClinechart-linechart-span-"+i;
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
                    return "HVAClinechart-linechart-span-div-"+i;
                })
                .each(function(d,i){
                    var divID = this.id
                    var yAxis_attr_name = d;
                    var xyAxis_data = linechart_render_view._get_xyAxis_data(yAxis_attr_name);
                    linechart_render_view._plot_linechart(divID,xyAxis_data);
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

	_plot_linechart:function(divID,xyAxis_data)
	{
        var div = d3.select("#"+divID);
        div.selectAll("*").remove()

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