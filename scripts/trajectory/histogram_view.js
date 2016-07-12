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
	    var width  = $("#"+divID).width();
	    var height  = $("#"+divID).height() ;
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
		var legendHeight = 18;
		var circleR = 4;
		var colorObjectArray = DATA_CENTER.GLOBAL_STATIC.certainty_color_array;
		var legendYStart = 30;
		var legendLabelX = 10, legendLabel1 = 5, legendLabel2 = 120, legendLabelWidth = width - 20, legendLabelHeight = 15;
		
		svg.append('rect')
		.attr('class', 'sum-legend sum-legend-label-certainty')
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
		.on('mouseover', function(d,i){
			d3.selectAll('.sum-legend-label-certainty').classed('mouseover-highlight', true);
			console.log('mouseoover');
		})
		.on('mouseout', function(d,i){
			d3.selectAll('.sum-legend-label-certainty').classed('mouseover-highlight', false);
			console.log('mouseout');
		})
		.on('click', function(d,i){
			d3.selectAll('.sum-legend').classed('click-highlight', false);
			if(d3.select(this).classed('click-highlight')){
				d3.selectAll('.sum-legend-label-certainty').classed('click-highlight', false);
			}else{
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
		.text('certainty Legend')
		.on('mouseoover', function(d,i){
			d3.select('.sum-legend-label-certainty').classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.select('.sum-legend-label-certainty').classed('mouseover-highlight', false);
		})
		.on('click', function(d,i){
			if(d3.select(this).classed('click-highlight')){
				d3.select('.sum-legend-label-certainty').classed('click-highlight', false);
			}else{
				d3.select('.sum-legend-label-certainty').classed('click-highlight', true);	
			}
		});

		svg.append('rect')
		.attr('class', 'sum-legend sum-legend-label-work')
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
		.on('mouseover', function(d,i){
			d3.selectAll('.sum-legend-label-work').classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.selectAll('.sum-legend-label-work').classed('mouseover-highlight', false);
		})
		.on('click', function(d,i){
			d3.selectAll('.sum-legend').classed('click-highlight', false);
			if(d3.select(this).classed('click-highlight')){
				d3.selectAll('.sum-legend-label-work').classed('click-highlight', false);
			}else{
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
		.text('work Legend')
		.on('mouseoover', function(d,i){
			d3.select('.sum-legend-label-work').classed('mouseover-highlight', true);
		})
		.on('mouseout', function(d,i){
			d3.select('.sum-legend-label-work').classed('mouseover-highlight', false);
		})
		.on('click', function(d,i){
			if(d3.select(this).classed('click-highlight')){
				d3.select('.sum-legend-label-work').classed('click-highlight', false);
			}else{
				d3.select('.sum-legend-label-work').classed('click-highlight', true);	
			}
		});

		var colorLegendG = svg.selectAll('.colorLegend-g')
		.data(colorObjectArray)
		.enter()
		.append('g');

		colorLegendG.append('circle')
		.attr('class', 'colorLegend')
		.attr('r', circleR)
		.attr('cx', function(d,i){
			return legendX;
		})
		.attr('cy', function(d,i){
			return legendYStart + legendHeight * i;
		})
		.attr('fill', function(d,i){
			return d.color;
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
		var alertLegendYStart = legendYStart + legendHeight * 3;
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

		var workLegendYStart = alertLegendYStart + legendHeight * 3.5;
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
	},

}