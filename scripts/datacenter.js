var DATA_CENTER = {
	original_data : [],//访问时形如DATA_CENTER.original_data["bldg-MC2.csv"]
	derived_data : [],//访问时形如DATA_CENTER.derived_data["..."]


	//登记所有存在的view
	VIEW_COLLECTION : {
		"HVACgraph_attrbtn_view":HVACgraph_attrbtn_view,
		"linechart_linebtn_view":linechart_linebtn_view,
		"linechart_render_view":linechart_render_view,

		"mdsgraph_view":mdsgraph_view,

		"relationshipgraph_view":relationshipgraph_view,

		"bigmap_view":bigmap_view,
		"ganttchart_view":ganttchart_view,
		"histogram_view":histogram_view,

		"smallmaps_view":smallmaps_view,
		"timeline_view":timeline_view,
	},
	trigger_view_display : function(view_name,value){
		SUBJECT.notifyObserver("display:"+view_name, value);
	},
	trigger_view_hide : function(view_name,value){
		SUBJECT.notifyObserver("hide:"+view_name, value);
	},


	//view之间通信需要利用的全局变量
	global_variable : {
		floors_zone_set: [],
		personInZone: [], 
		selected_attr_set:[],
		selected_linechart_set:[],
		selected_HVACzone_set:[],

		selected_proxzone_set:[],

		selected_room_set:[],
		selected_floor_set:[],
		selected_building_set:[],
		selected_timepoint_set:[],
		person_robot_detection_array:[],

		//linechart中被选中的一段时间通过设置这个全局变量传达到其他view
		selected_filter_timerange:{
			min:undefined,
			max:undefined,
		},

		//各种view中被选中的一段时间通过设置这个全局变量在linechart中添加感兴趣的时间
		added_timerange:{
			min:undefined,
			max:undefined
		},

		current_display_time:undefined,//timeline当前播放到的时间

		selected_card_set:[],
		selected_person_set:[],		
	},

	//set_global_variable设置全局变量并调用SUBJECT的notify
	//使用时形如DATA_CENTER.set_global_variable("selected_attr_set",[1,2,3])
	set_global_variable : function(variable_name,value){
		this.global_variable[variable_name] = value;
		SUBJECT.notifyObserver("set:"+variable_name, value);
	},

	timeline_variable : {
		display_interval:1000,//播放更新间隔
		display_rate:3600,//播放倍率
		isplaying:false,//标记是否正在播放
		mouseover_time:undefined,//当前mouseover的地方
	},

	set_timeline_variable : function(variable_name,value){
		this.timeline_variable[variable_name] = value;
		SUBJECT.notifyObserver("set:"+variable_name, value);
	},


	//linechart的几个子视图需要利用的全局变量
	linechart_variable : {
		highlight_attr_set:[],
		highlight_HVACzone_set:[],
		highlight_floor_set:[],
		highlight_building_set:[],
		highlight_linechart_set:[],
	},

	//set_linechart_variable设置全局变量并调用SUBJECT的notify
	//尽管是linechart内部的信息，仍然会通知所有注册了的view
	//使用时形如DATA_CENTER.set_linechart_variable("highlight_attr_set",[1,2,3])
	set_linechart_variable : function(variable_name,value){
		this.linechart_variable[variable_name] = value;
		SUBJECT.notifyObserver("set:"+variable_name, value);
	},


	//全局静态变量
	GLOBAL_STATIC : {
		building_HVACattr_set :[
			"Drybulb Temperature",
			"Water Heater Tank Temperature",
			"Water Heater Gas Rate",
			"Supply Side Inlet Mass Flow Rate",
			"Supply Side Inlet Temperature",
			"Supply Side Outlet Temperature",
			"HVAC Electric Demand Power",
			"Total Electric Demand Power",
			"Loop Temp Schedule",
			"Water Heater Setpoint",
			"DELI-FAN Power",
			"Pump Power",
			"COOL Schedule Value",//原始数据中从来没出现过这个属性
			"Wind Direction",//原始数据中从来没出现过这个属性
			"Wind Speed",//原始数据中从来没出现过这个属性
			"HEAT Schedule Value",//原始数据中从来没出现过这个属性
		],
		floor_HVACattr_set :[
			"BATH_EXHAUST:Fan Power",
			"VAV_SYS AIR LOOP INLET Mass Flow Rate",
			"VAV_SYS AIR LOOP INLET Temperature",
			"VAV Availability Manager Night Cycle Control Status",
			"VAV_SYS COOLING COIL Power",
			"VAV_SYS HEATING COIL Power",
			"VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate",
			"VAV_SYS SUPPLY FAN OUTLET Temperature",
			"VAV_SYS SUPPLY FAN:Fan Power",
			"VAV_SYS Outdoor Air Flow Fraction",
			"VAV_SYS Outdoor Air Mass Flow Rate",
		],
		HVACzone_HVACattr_set :[
			"REHEAT COIL Power",
			"RETURN OUTLET CO2 Concentration",
			"SUPPLY INLET Mass Flow Rate",
			"SUPPLY INLET Temperature",
			"VAV REHEAT Damper Position",//原始数据中,F3_Z9的这个属性名打错了
			"Equipment Power",
			"Lights Power",
			"Mechanical Ventilation Mass Flow Rate",//原始数据中,实际上只有F1_Z1有这个属性
			"Thermostat Temp",
			"Thermostat Cooling Setpoint",
			"Thermostat Heating Setpoint",
			"Hazium Concentration",//特殊属性，只有4个有Haziumsensor的zone有
		],
		HVACzone_with_Haziumsenor_set :[
			"F_1_Z_8A",
			"F_2_Z_2",
			"F_2_Z_4",
			"F_3_Z_1"
		],
		attribute_abbreviation : {
			"BATH_EXHAUST:Fan Power":"bath fan power",
			"VAV_SYS AIR LOOP INLET Mass Flow Rate":"return air rate",
			"VAV_SYS AIR LOOP INLET Temperature":"return air temperature",
			"VAV Availability Manager Night Cycle Control Status":"control status",
			"VAV_SYS COOLING COIL Power":"cooling power",
			"VAV_SYS HEATING COIL Power":"heating power",
			"VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate":"output air rate",
			"VAV_SYS SUPPLY FAN OUTLET Temperature":"output air temperature",
			"VAV_SYS SUPPLY FAN:Fan Power":"fan power",
			"VAV_SYS Outdoor Air Flow Fraction":"outdoor air percent",
			"VAV_SYS Outdoor Air Mass Flow Rate":"outdoor air rate",
			"COOL Schedule Value":"air cool setpoint",
			"DELI-FAN Power":"deli fan power",
			"Drybulb Temperature":"outdoor temperature",
			"Wind Direction":"wind direction",
			"Wind Speed":"wind speed",
			"HEAT Schedule Value":"air heat setpoint",
			"Pump Power":"pump power",
			"Water Heater Setpoint":"water heater setpoint",
			"Water Heater Gas Rate":"water heater power",
			"Water Heater Tank Temperature":"water heater temperature",
			"Loop Temp Schedule":"water loop setpoint",
			"Supply Side Inlet Mass Flow Rate":"input water rate",
			"Supply Side Inlet Temperature":"input water temperature",
			"Supply Side Outlet Temperature":"output water temperature",
			"REHEAT COIL Power":"air reheat power",
			"RETURN OUTLET CO2 Concentration":"return CO2 concentration",
			"SUPPLY INLET Mass Flow Rate":"input air rate",
			"SUPPLY INLET Temperature":"input air temperature",
			"VAV REHEAT Damper Position":"input air damper",
			"Equipment Power":"total power",
			"Lights Power":"light power",
			"Mechanical Ventilation Mass Flow Rate":"Ventilation air rate",
			"Thermostat Temp":"air temperature",
			"Thermostat Cooling Setpoint":"air cool threshold",
			"Thermostat Heating Setpoint":"air heat threshold",
			"Total Electric Demand Power":"total power",
			"HVAC Electric Demand Power":"HVAC power",
			"Hazium Concentration":"Hazium",
		},
		floor_name_number_mapping : {
			"F_1":1,
			"F_2":2,
			"F_3":3,
		},
	},

	
	//计算派生数据填入DATA_CENTER.derived_data
	cal_derive_data : function(){

	},
	initialize_loaddata:function(callback_function){
		var path = "dataset/original/";
		var file_name=[
			"bldg-MC2.csv",
			"f1z8a-MC2.csv",
			"f2z2-MC2.csv",
			"f2z4-MC2.csv",
			"f3z1-MC2.csv",
			"proxMobileOut-MC2.csv",
			"proxOut-MC2.csv"
		];

		var derived_path = "dataset/derived/";
		var d_file_name = [
			"person.json",
			"room.json",
			"singleroom.json",
			"proxMobileOut-MC2-WithProxId.json",
		];

		d3.csv(path+file_name[0],function(HVAC_data){
			//把传感器读数全部存成数字
			for (var i=0;i<HVAC_data.length;++i)
			{
				var cur_element = HVAC_data[i];
				for (var attr in cur_element)
				{
					if (attr != "Date/Time")
					{
						cur_element[attr] =+ cur_element[attr];
					}
				}
			}

			d3.csv(path+file_name[1],function(hazium_data1){
				//把传感器读数全部存成数字
				for (var i=0;i<hazium_data1.length;++i)
				{
					var cur_element = hazium_data1[i];
					for (var attr in cur_element)
					{
						if (attr != "Date/Time")
						{
							cur_element[attr] =+ cur_element[attr];
						}
					}
				}

				d3.csv(path+file_name[2],function(hazium_data2){
					//把传感器读数全部存成数字
					for (var i=0;i<hazium_data2.length;++i)
					{
						var cur_element = hazium_data2[i];
						for (var attr in cur_element)
						{
							if (attr != "Date/Time")
							{
								cur_element[attr] =+ cur_element[attr];
							}
						}
					}

					d3.csv(path+file_name[3],function(hazium_data3){
						//把传感器读数全部存成数字
						for (var i=0;i<hazium_data3.length;++i)
						{
							var cur_element = hazium_data3[i];
							for (var attr in cur_element)
							{
								if (attr != "Date/Time")
								{
									cur_element[attr] =+ cur_element[attr];
								}
							}
						}

						d3.csv(path+file_name[4],function(hazium_data4){
							//把传感器读数全部存成数字
							for (var i=0;i<hazium_data4.length;++i)
							{
								var cur_element = hazium_data4[i];
								for (var attr in cur_element)
								{
									if (attr != "Date/Time")
									{
										cur_element[attr] =+ cur_element[attr];
									}
								}
							}							

							d3.csv(path+file_name[5],function(data5){//mobile out data
								console.log(data5);
								person_robot_detection_array = DATA_CENTER.global_variable.person_robot_detection_array;
								for(var i = 0;i < data5.length;i++){
									var proxId = data5[i][' prox-id'].replace(/\s+/g,"");;
									if(person_robot_detection_array.indexOf(proxId) == -1){
										person_robot_detection_array.push(proxId);
									}
								}
								console.log(person_robot_detection_array);
								d3.csv(path+file_name[6],function(data6){
									d3.json(derived_path+d_file_name[0], function(data7) {//persondata
										//增加personData的相关数据
										var personData = data7; 
										var personInZone = new Array();
										var personArray = $.map(personData, function(value, index) {
											return [value];
										});
										for(var i = 0;i < personArray.length;i++){
											personInZone[i] = new Object();
											personInZone[i].personName = personArray[i].fixRecords[0].records[0]["prox-id"];
											personInZone[i].formerZoneNum = -1;
											personInZone[i].zoneNum = -1;
										}
										DATA_CENTER.derived_data["personInZone"] = personInZone;
										d3.json(derived_path+d_file_name[1], function(data8) {//room.json data
											//room数据处理得到每个楼层的各个zone有哪些区域
											console.log(data8);
											var floors_zone_set = DATA_CENTER.global_variable.floors_zone_set;
											var floorNum = 3;
											var proxZoneNumArray = [8, 7, 6];
											for(var i = 0;i < floorNum;i++){
												floors_zone_set[i] = new Array();
												var proxZoneNum = proxZoneNumArray[i];
												for(var j = 0;j < proxZoneNum;j++){
													floors_zone_set[i][j] = new Array();
												}
											}
											for(var i = 0;i < data8.length;i++){
												if(data8[i].proxZone != undefined){
													var floorNum = +data8[i].floor - 1;
													var proxZoneNum = +data8[i].proxZone - 1;
													floors_zone_set[floorNum][proxZoneNum].push(data8[i]);
												}
											}
											d3.json(derived_path + d_file_name[2], function(data9){
												d3.json(derived_path + d_file_name[3], function(data10){
													DATA_CENTER.original_data[file_name[0]] = HVAC_data;
													DATA_CENTER.original_data[file_name[1]] = hazium_data1;
													DATA_CENTER.original_data[file_name[2]] = hazium_data2;
													DATA_CENTER.original_data[file_name[3]] = hazium_data3;
													DATA_CENTER.original_data[file_name[4]] = hazium_data4;
													DATA_CENTER.original_data[file_name[5]] = data5;
													DATA_CENTER.original_data[file_name[6]] = data6;
													DATA_CENTER.derived_data[d_file_name[0]] = data7;
													DATA_CENTER.derived_data[d_file_name[1]] = data8;
													DATA_CENTER.derived_data[d_file_name[2]] = data9;
													DATA_CENTER.derived_data[d_file_name[3]] = data10;
													DATA_CENTER.cal_derive_data();
													callback_function();
												})
											})
										})	
									})
								})
							})
						})
					})
				})
			})
		})

	}



}
