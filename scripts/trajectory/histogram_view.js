var histogram_view = {
	histogram_view_DIV_ID : "trajectory-legend",


	obsUpdate:function(message, data)
	{
		//console.log(message);
		if (message == "display:histogram_view")
        {
            $("#"+this.histogram_view_DIV_ID).css("display","block");
            this.render(this.histogram_view_DIV_ID);
        }

        if (message == "hide:histogram_view")
        {
            $("#"+this.histogram_view_DIV_ID).css("display","none");
        }
	},
	render:function(divID)
	{
		d3.select("#"+divID).selectAll("*").remove()
	    var width  = +$("#"+divID).width();
	    var height  = +$("#"+divID).height();//517
	    console.log('legend-height', height);
	    var svg = d3.select("#"+divID).append("svg")
	                .attr("class","mainsvg")
	                .attr('id', 'legend-svg')
	                .attr('x', 0)
	                .attr('y', 10)
	                .attr('width', width)
	                .attr('height', height);
	    var accurateColor = '#08519c';
		var inOfficeColor = '#4292c6';
		var inPublicColor = '#9ecae1';
		var ErrorColor = '#e31a1c';
		var WarningColor = '#feb24c';

		var legendX = 15;
		var legendTextX = 25;
		var defaultDivHeight = 517;
		var defaultLegendHeight = 15;
		var legendHeight = height / defaultDivHeight * defaultLegendHeight;//height / defaultHeight * 10;
		var circleR = 4;
		var colorObjectArray = DATA_CENTER.GLOBAL_STATIC.certainty_color_array;
		var legendYStart = legendHeight * 2;
		var legendLabelX = 10, legendLabel1 = 5, legendLabel2 = legendHeight * 5, legendLabelWidth = width - 20, legendLabelHeight = legendHeight,
			legendLabel3 = legendHeight * 15;
		//------------------------------------------------------------------------------------
		//------------------------------------------------------------------------------------
		svg.append('rect')
		.attr('class', 'sum-legend sum-legend-rect sum-legend-label-certainty')
		.attr('id', function(d,i){
			return 'legend-label-rect-certainty';
		})
		.attr('x', function(d,i){
			return legendLabelX;
		})
		.attr('y', function(d,i){
			return legendLabel1;
		})
		.attr('width', function(d,i){
			return legendLabelWidth;
		})
		.attr('height', function(d,i){
			return legendLabelHeight;
		})
		.attr('fill', function(d,i){
			return 'white';
		})
		.attr('stroke', 'gray')
		.on('mouseover', function(d,i){
			d3.selectAll('.sum-legend-label-certainty').classed('mouseover-highlight', true);
			console.log('mouseoover');
		})
		.on('mouseout', function(d,i){
			d3.selectAll('.sum-legend-label-certainty').classed('mouseover-highlight', false);
			console.log('mouseout');
		})
		.on('click', function(d,i){
			if(d3.select('.sum-legend-label-certainty').classed('click-highlight')){
				DATA_CENTER.set_global_variable('certainty_encode', false);
				d3.selectAll('.sum-legend-label-certainty').classed('click-highlight', false);
			}else{
				DATA_CENTER.set_global_variable('certainty_encode', true);
				d3.selectAll('.sum-legend-label-certainty').classed('click-highlight', true);
			}
		});
		svg.append('text')
		.attr('class', 'sum-legend sum-legend-label-certainty')
		.attr('id', 'legend-label-text-certainty')
		.attr('x', function(d,i){
			return legendLabelX;
		})
		.attr('y', function(d,i){
			return legendLabel1 + legendHeight/2 + 2;
		})
		.text('certainty')
		.on('mouseoover', function(d,i){
			d3.select('.sum-legend-label-certainty').classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.select('.sum-legend-label-certainty').classed('mouseover-highlight', false);
		})
		.on('click', function(d,i){
			if(d3.select(this).classed('click-highlight')){
				DATA_CENTER.set_global_variable('certainty_encode', false);
				d3.selectAll('.sum-legend-label-certainty').classed('click-highlight', false);
			}else{
				DATA_CENTER.set_global_variable('certainty_encode', true);
				d3.selectAll('.sum-legend-label-certainty').classed('click-highlight', true);	
			}
		});
		//--------------------------------------------------------------
		svg.append('rect')
		.attr('class', 'sum-legend sum-legend-rect sum-legend-label-work')
		.attr('id', function(d,i){
			return 'legend-label-rect-work';
		})
		.attr('x', function(d,i){
			return legendLabelX;
		})
		.attr('y', function(d,i){
			return legendLabel2;
		})
		.attr('width', function(d,i){
			return legendLabelWidth;
		})
		.attr('height', function(d,i){
			return legendLabelHeight;
		})
		.attr('fill', function(d,i){
			return 'white';
		})
		.attr('stroke', 'gray')
		.on('mouseover', function(d,i){
			d3.selectAll('.sum-legend-label-work').classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.selectAll('.sum-legend-label-work').classed('mouseover-highlight', false);
		})
		.on('click', function(d,i){
			if(d3.select(this).classed('click-highlight')){
				DATA_CENTER.set_global_variable('work_encode', false);
				d3.selectAll('.sum-legend-label-work').classed('click-highlight', false);
			}else{
				DATA_CENTER.set_global_variable('work_encode', true);
				d3.selectAll('.sum-legend-label-work').classed('click-highlight', true);
			}
		});
		svg.append('text')
		.attr('class', 'sum-legend sum-legend-label-work')
		.attr('id', 'legend-label-text-work')
		.attr('x', function(d,i){
			return legendLabelX;
		})
		.attr('y', function(d,i){
			return legendLabel2 + legendHeight/2 + 2;
		})
		.text('department')
		.on('mouseoover', function(d,i){
			d3.select('.sum-legend-label-work').classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.select('.sum-legend-label-work').classed('mouseover-highlight', false);
		})
		.on('click', function(d,i){
			DATA_CENTER.set_global_variable('certainty_encode', false);
			if(d3.select(this).classed('click-highlight')){
				DATA_CENTER.set_global_variable('work_encode', false);
				d3.selectAll('.sum-legend-label-work').classed('click-highlight', false);
			}else{
				DATA_CENTER.set_global_variable('work_encode', true);
				d3.selectAll('.sum-legend-label-work').classed('click-highlight', true);	
			}
		});
		//-----------------------------------------------------------------
		svg.append('rect')
		.attr('class', 'alert-legend sum-legend-rect sum-legend-label-alert')
		.attr('id', function(d,i){
			return 'legend-label-rect-alert';
		})
		.attr('x', function(d,i){
			return legendLabelX;
		})
		.attr('y', function(d,i){
			return legendLabel3;
		})
		.attr('width', function(d,i){
			return legendLabelWidth;
		})
		.attr('height', function(d,i){
			return legendLabelHeight;
		})
		.attr('fill', function(d,i){
			return 'white';
		})
		.attr('stroke', 'gray')
		.on('mouseover', function(d,i){
			d3.selectAll('.sum-legend-label-alert').classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.selectAll('.sum-legend-label-alert').classed('mouseover-highlight', false);
		})
		.on('click', function(d,i){
			if(d3.select(this).classed('click-highlight')){
				d3.selectAll('.sum-legend-label-alert').classed('click-highlight', false);
				DATA_CENTER.set_global_variable('enable_alert', false);
			}else{
				d3.selectAll('.sum-legend-label-alert').classed('click-highlight', true);
				DATA_CENTER.set_global_variable('enable_alert', true);
			}
		});
		svg.append('text')
		.attr('class', 'alert-legend sum-legend-label-alert')
		.attr('id', 'legend-label-text-alert')
		.attr('x', function(d,i){
			return legendLabelX;
		})
		.attr('y', function(d,i){
			return legendLabel3 + legendHeight/2 + 2;
		})
		.text('alert')
		.on('mouseoover', function(d,i){
			d3.select('.sum-legend-label-alert').classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.select('.sum-legend-label-alert').classed('mouseover-highlight', false);
		})
		.on('click', function(d,i){
			if(d3.select(this).classed('click-highlight')){
				d3.selectAll('.sum-legend-label-alert').classed('click-highlight', false);
				DATA_CENTER.set_global_variable('enable_alert', false);
			}else{
				d3.selectAll('.sum-legend-label-alert').classed('click-highlight', true);
				DATA_CENTER.set_global_variable('enable_alert', true);
			}
		});
		//默认情况的设置
		if(DATA_CENTER.global_variable.certainty_encode){
			//如果使用位置的确定性进行编码
			d3.selectAll('.sum-legend-label-certainty').classed('click-highlight', true);
		}else{
			d3.selectAll('.sum-legend-label-certainty').classed('click-highlight', false);
		}
		if(DATA_CENTER.global_variable.work_encode){
			d3.selectAll('.sum-legend-label-work').classed('click-highlight', true);
		}else{
			d3.selectAll('.sum-legend-label-work').classed('click-highlight', false);
		}
		if(DATA_CENTER.global_variable.enable_alert){
			//如果存在alert的警报情况
			d3.selectAll('.sum-legend-label-alert').classed('click-highlight', true);
		}else{
			d3.selectAll('.sum-legend-label-alert').classed('click-highlight', false);
		}
		//--------------------------------------------------------------------------------------
		//--------------------------------------------------------------------------------------
		//**************************************************************************************
		var colorLegendG = svg.selectAll('.colorLegend-g')
		.data(colorObjectArray)
		.enter()
		.append('g');

		colorLegendG.append('circle')
		.attr('class', function(d,i){
			return 'colorLegend ' + d.name;
		})
		.attr('r', circleR)
		.attr('cx', function(d,i){
			return legendX;
		})
		.attr('cy', function(d,i){
			return legendYStart + legendHeight * i;
		});
		colorLegendG.append('text')
		 .attr('class', 'circle-type-text')
		 .attr('x', function(d,i){
		 	return legendTextX;
		 })
		 .attr('y', function(d,i){
		 	return legendYStart + legendHeight * i + circleR;
		 })
		 .text(function(d,i){
		 	return d.name;
		 })
		//************************************************************************************
		//*************************************************************************************
		var workLegendYStart = legendYStart + legendHeight * 5;
		var workCircleArray = DATA_CENTER.GLOBAL_STATIC.work_color_array;
		var workLegendG = svg.selectAll('.workLegend-g')
		.data(workCircleArray)
		.enter()
		.append('g')
		.attr('class', 'workLegend-g');

		workLegendG.append('circle')
		.attr('class', 'work-legend')
		.attr('r', circleR)
		.attr('cx', function(d,i){
			return legendX;
		})
		.attr('cy', function(d,i){
			return workLegendYStart + legendHeight * i;
		})
		.attr('fill', function(d,i){
			return d.color;
		})

		workLegendG.append('text')
		.attr('class', 'work-legend-text')
		.attr('x', function(d,i){
			return legendTextX;
		})
		.attr('y', function(d,i){
			return workLegendYStart + legendHeight * i + circleR;
		})
		.text(function(d,i){
			return d.work;
		})

		//************************************************************************************
		//增加报警标志的实际legend
		
		//增加实际的报警的颜色标识
		var alertLegendYStart = workLegendYStart + legendHeight * 10;
		var alertCircleR = 6;
		var alertCircleArray = DATA_CENTER.GLOBAL_STATIC.alert_color_array;
		var alertLegendG = svg.selectAll('.alertLegend-g')
		.data(alertCircleArray)
		.enter()
		.append('g');

		alertLegendG.append('circle')
		.attr('class', 'alertLegend')
		.attr('r', alertCircleR)
		.attr('cx', function(d,i){
			return legendX;
		})
		.attr('cy', function(d,i){
			return alertLegendYStart + legendHeight * i;
		})
		.attr('fill', function(d,i){
			return d.color;
		});

		alertLegendG.append('text')
		.attr('class', 'alertLegendText')
		.attr('x', function(d,i){
			return legendTextX;
		})
		.attr('y', function(d,i){
			return alertLegendYStart + legendHeight * i + alertCircleR;
		})
		.text(function(d,i){
			return d.name;
		})
	},

}