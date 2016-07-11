var HVACmonitor_view = {
	FIRST_CALLED:true,
	HVACmonitor_view_DIV_ID : "HVACmonitor-renderplace",

	span_DIV_ID : "HVACmonitor-span",

	DIV_CLASS_OF_RADARCHART_GLYPH:"HVACmonitor-radarchart_glyph-div",

	ABNORMAL_VALUE_THRESHOLD:4,//归一化以后的异常阈值

	ATTRIBUTE_DOT_RADIUS :6,
	RADARCHART_GLYPH_RADIUS :25,

	COLUMN_CONTAIN_NUMBER : 5,
	ROW_CONTAIN_NUMBER : 8,

	obsUpdate:function(message, data)
	{
		if (message == "display:HVACmonitor_view")
        {
            $("#"+this.HVACmonitor_view_DIV_ID).css("display","block");
            DATA_CENTER.VIEW_COLLECTION.smallmaps_view._display_radarchart(this.DIV_CLASS_OF_RADARCHART_GLYPH)
            //this.render(this.HVACmonitor_view_DIV_ID);

            
            if (this.FIRST_CALLED)
			{
				this.render(this.HVACmonitor_view_DIV_ID);
				$( "#"+this.HVACmonitor_view_DIV_ID ).sortable();
				this.FIRST_CALLED = false;
			}
        }

        if (message == "hide:HVACmonitor_view")
        {
            $("#"+this.HVACmonitor_view_DIV_ID).css("display","none");
            DATA_CENTER.VIEW_COLLECTION.smallmaps_view._hide_radarchart(this.DIV_CLASS_OF_RADARCHART_GLYPH)
        }

        if (message == "set:current_display_time")
        {	
        	var timestamp = DATA_CENTER.global_variable.current_display_time;

			var node = d3.selectAll(".HVACmonitor-attr-circle")
        		.each(function(d,i){
        			var left = $(this).offset().left+HVACmonitor_view.ATTRIBUTE_DOT_RADIUS;
					var top = $(this).offset().top+HVACmonitor_view.ATTRIBUTE_DOT_RADIUS;

					var attr_name = d;
        			HVACmonitor_view._render_radarchart(attr_name,left,top,timestamp);
        		})
			
        }
	},

	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height();
	
		var span_width = width/HVACmonitor_view.COLUMN_CONTAIN_NUMBER-1;
		var span_height = height/HVACmonitor_view.ROW_CONTAIN_NUMBER;

	    var building_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.building_HVACattr_set;
	    var floor_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.floor_HVACattr_set;
	    var HVACzone_HVACattr_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_HVACattr_set;
	    var all_attr_set = (building_HVACattr_set.concat(floor_HVACattr_set)).concat(HVACzone_HVACattr_set);

	    var update = d3.select("#"+divID)
			.selectAll("."+HVACmonitor_view.span_DIV_ID)
			.data(DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view.
					_sort_generalattr_by_priority(all_attr_set),function(d){return d;})

		var enter = update.enter();
		var enter_span = enter.insert("span")
				.attr("class",HVACmonitor_view.span_DIV_ID)
				.attr("id",function(d,i){
					return "HVACmonitor-span-" + linechart_render_view._compress_string(d);
				})
				.style("width",span_width+"px")
				.style("height",span_height+"px")
				.on("click",function(d,i){

				})
				.on("mouseover",function(d,i){

				})
				.on("mouseout",function(d,i){

				})
		var enter_span_svg = enter_span.append("svg")
			.attr("width",span_width)
			.attr("height",span_height)
		var enter_span_circle = enter_span_svg.append("circle")
			.attr("r",HVACmonitor_view.ATTRIBUTE_DOT_RADIUS)
			.attr("cx",span_width/2)	
			.attr("cy",span_height/2)	
			.attr("class","HVACmonitor-attr-circle")
			.attr("fill",function(d,i){
				return HVACgraph_attrbtn_view._get_attr_color(d);
			})
			.on("click",function(d,i){
				
				var attr_type = DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view
										._cal_attr_type(d);

				console.log(d,attr_type)						
				//HVACzone_oridinary_attr，HVACzone_hazium，floor_attr，building_attr					
				if (attr_type == "building_attr")
				{
					if ( d3.select(this).classed("click_selected-HVACmonitor-span") )
					{
						d3.select(this).classed("click_selected-HVACmonitor-span",false);
						DATA_CENTER.set_global_variable("selected_building_set",[]);
					}
					else
					{
						d3.select(this).classed("click_selected-HVACmonitor-span",true);
						DATA_CENTER.set_global_variable("selected_building_set",DATA_CENTER.GLOBAL_STATIC.building_set);
					}
				}
				else if (attr_type == "floor_attr")
				{
					if ( d3.select(this).classed("click_selected-HVACmonitor-span") )
					{
						d3.select(this).classed("click_selected-HVACmonitor-span",false);
						DATA_CENTER.set_global_variable("selected_floor_set",[]);
					}
					else
					{
						d3.select(this).classed("click_selected-HVACmonitor-span",true);
						DATA_CENTER.set_global_variable("selected_floor_set",DATA_CENTER.GLOBAL_STATIC.floor_set);
					}
				}
				else if (attr_type == "HVACzone_oridinary_attr")
				{
					if ( d3.select(this).classed("click_selected-HVACmonitor-span") )
					{
						d3.select(this).classed("click_selected-HVACmonitor-span",false);
						DATA_CENTER.set_global_variable("selected_HVAC_set",[]);
					}
					else
					{
						d3.select(this).classed("click_selected-HVACmonitor-span",true);
						DATA_CENTER.set_global_variable("selected_HVAC_set",DATA_CENTER.GLOBAL_STATIC.HVACzone_set);
					}
				}
				else if (attr_type == "HVACzone_hazium")
				{
					if ( d3.select(this).classed("click_selected-HVACmonitor-span") )
					{
						d3.select(this).classed("click_selected-HVACmonitor-span",false);
						DATA_CENTER.set_global_variable("selected_HVAC_set",[]);
					}
					else
					{
						d3.select(this).classed("click_selected-HVACmonitor-span",true);
						DATA_CENTER.set_global_variable("selected_HVAC_set",DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set);
					}
				}
				
			})

		HVACgraph_attrbtn_view._bind_attrbtn_tip("HVACmonitor-attr-circle")

		var exit = update.exit();
		exit.remove();//删除本身

	},

	_render_radarchart:function(attr_name,left,top,raw_timestamp)
	{
		var dataset = _cal_dataset(attr_name,raw_timestamp);
		function _cal_dataset(attr_name,raw_timestamp)
		{
			var attr_type = DATA_CENTER.VIEW_COLLECTION.HVACgraph_attrbtn_view._cal_attr_type(attr_name);

			var detail_attr_set = [];
			if ( (attr_type == "HVACzone_hazium") || (attr_type == "HVACzone_oridinary_attr") )
			{
				var HVACzone_set = DATA_CENTER.GLOBAL_STATIC.HVACzone_set;
				for (var i=0;i<HVACzone_set.length;++i)
				{
					var cur_place = HVACzone_set[i]; 
					var cur_linechart = DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
						._combine_place_attr(cur_place,"HVACzone",attr_name);
					if (typeof(cur_linechart)!="undefined")
						detail_attr_set.push(cur_linechart);
				}
			}
			else if (attr_type == "floor_attr")
			{
				var floor_set = DATA_CENTER.GLOBAL_STATIC.floor_set;
				for (var i=0;i<floor_set.length;++i)
				{
					var cur_place = floor_set[i]; 
					var cur_linechart = DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
						._combine_place_attr(cur_place,"floor",attr_name);
					if (typeof(cur_linechart)!="undefined")
						detail_attr_set.push(cur_linechart);
				}
			}
			else if (attr_type == "building_attr")
			{
				var building_set = DATA_CENTER.GLOBAL_STATIC.building_set;
				for (var i=0;i<building_set.length;++i)
				{
					var cur_place = building_set[i]; 
					var cur_linechart = DATA_CENTER.VIEW_COLLECTION.linechart_linebtn_view
						._combine_place_attr(cur_place,"building",attr_name);
					if (typeof(cur_linechart)!="undefined")
						detail_attr_set.push(cur_linechart);
				}
			}


			var frame_full_data = smallmaps_view._binary_search("bldg-MC2.csv","Date/Time",raw_timestamp);
			var frame_needed_data = [];
			for (var i=0;i<detail_attr_set.length;++i)
			{
				var cur_attr = detail_attr_set[i];
				var value = frame_full_data[cur_attr];
				frame_needed_data.push({
					name:cur_attr,
					value:value,
				})
			}

			return frame_needed_data;
		}


		var glyph_name = linechart_render_view._compress_string(attr_name);
		var class_label = HVACmonitor_view.DIV_CLASS_OF_RADARCHART_GLYPH;
		var radius = HVACmonitor_view.RADARCHART_GLYPH_RADIUS;
		var innerRadius = HVACmonitor_view.ATTRIBUTE_DOT_RADIUS;

		//data的数据格式是一个数组，数组中每个元素的样子是{name:...,value:...}
		DATA_CENTER.VIEW_COLLECTION.smallmaps_view._render_radarchart(dataset,glyph_name,raw_timestamp,class_label,left,top,radius,innerRadius)

	},

	//('2016/5/31 16:40','HVAC Electric Demand Power',3)
	is_abnormal:function(time,name,value){
		var data = DATA_CENTER.derived_data["patternChange.json"];

	    //console.log(time)
	   // time='2016/5/31 16:40'
	    var temp=time.split(' ')
	    var temp=temp[0].split('/').concat(temp[1].split(':'))
	    //time=temp[0]
	    for(var i=1;i<temp.length;i++){
	        if(temp[i].length==1){
	            temp[i]="0"+temp[i]
	        }
	    }
	    time=temp[0]+"/"+temp[1]+"/"+temp[2]+" "+temp[3]+":"+temp[4]
	    date=time.substring(0,10)
	    console.log(date)
	    dataList=['2016/05/31','2016/06/01','2016/06/02','2016/06/07','2016/06/08','2016/06/09']

	    if(data[name]){
	        for(var k=0;k<dataList.length;k++){
	            if(dataList[k]==date){
	                var hour=["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
	                var minute=["00","05","10","15","20","25","30","35","40","45","50","55"]
	                
	                var timeList=[]
	                for(var i=0;i<hour.length;i++){
	                    for(var j=0;j<minute.length;j++){
	                        timeList.push(hour[i]+":"+minute[j]+":00")
	                    }
	                }

	                var nowTime=time.substring(11)+":00"

	                //console.log(nowTime)
	                //console.log(data[name][nowTime].value)

	                var index//存放当前时间节点的索引
	                for(index=0;index<timeList.length;index++){
	                    if(timeList[index]==nowTime){
	                        break
	                    }
	                }

	                var sum=0
	                if(index==0){
	                    sum=(data[name][nowTime].value+data[name][timeList[timeList.length-1]].value+data[name][timeList[index+1]].value)/3
	                }
	                else if(index=timeList.length-1){
	                    sum=(data[name][nowTime].value+data[name][timeList[0]].value+data[name][timeList[index-1]].value)/3
	                }
	                else{
	                    sum=(data[name][nowTime].value+data[name][timeList[index+1]].value+data[name][timeList[index-1]].value)/3
	                }
	                var temp=value-sum;



	                /*
	                if(Math.abs(temp)<data[name][nowTime].variance*5){
	                    return true;
	                }
	                else{
	                    return false;
	                }
	                */
	                if (data[name][nowTime].variance!=0)
	                	return Math.abs(temp)/data[name][nowTime].variance
	                else 
	                	return Math.abs(temp)
	            }
	            //return true
	            return 0;
	        }
	        
	    }
	    else{
	        //如果出现了一个没有存在过的指标则警报
	        //return false;
	        return 2*HVACmonitor_view.ABNORMAL_VALUE_THRESHOLD;
	    }
	    
	}
}