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

		"trajmonitor_view":trajmonitor_view,

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
			"Supply Side Inlet Mass Flow Rate",
			"Supply Side Inlet Temperature",
			"Water Heater Tank Temperature",
			"Supply Side Outlet Temperature",
			"Loop Temp Schedule",
			"Water Heater Setpoint",
			"Water Heater Gas Rate",
			"HVAC Electric Demand Power",
			"DELI-FAN Power",
			"Pump Power",
			"Total Electric Demand Power",
			"Drybulb Temperature",
			"COOL Schedule Value",//原始数据中从来没出现过这个属性
			"Wind Direction",//原始数据中从来没出现过这个属性
			"Wind Speed",//原始数据中从来没出现过这个属性
			"HEAT Schedule Value",//原始数据中从来没出现过这个属性
		],
		floor_HVACattr_set :[
			"VAV_SYS AIR LOOP INLET Mass Flow Rate",
			"VAV_SYS AIR LOOP INLET Temperature",
			"VAV_SYS HEATING COIL Power",
			"VAV_SYS COOLING COIL Power",
			"VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate",
			"VAV_SYS SUPPLY FAN OUTLET Temperature",
			"VAV_SYS Outdoor Air Mass Flow Rate",
			"VAV_SYS Outdoor Air Flow Fraction",
			"VAV_SYS SUPPLY FAN:Fan Power",
			"BATH_EXHAUST:Fan Power",
			"VAV Availability Manager Night Cycle Control Status",
		],
		HVACzone_HVACattr_set :[
			"SUPPLY INLET Mass Flow Rate",
			"SUPPLY INLET Temperature",
			"REHEAT COIL Power",
			"Thermostat Temp",
			"Thermostat Cooling Setpoint",
			"Thermostat Heating Setpoint",
			"Lights Power",
			"Equipment Power",
			"Mechanical Ventilation Mass Flow Rate",//原始数据中,实际上只有F1_Z1有这个属性
			"VAV REHEAT Damper Position",//原始数据中,F3_Z9的这个属性名打错了
			"RETURN OUTLET CO2 Concentration",
			"Hazium Concentration",//特殊属性，只有4个有Haziumsensor的zone有
		],
		HVACzone_with_Haziumsenor_set :[
			"F_1_Z_8A",
			"F_2_Z_2",
			"F_2_Z_4",
			"F_3_Z_1"
		],
		attribute_description : {
			"BATH_EXHAUST:Fan Power":{
				abbreviation:"bath fan power",
				lv2_abbreviation:"bathfan pwr",
				type:["air","electricity"],
			},
			"VAV_SYS AIR LOOP INLET Mass Flow Rate":{
				abbreviation:"return air rate",
				lv2_abbreviation:"rtn air rate",
				type:["air"],
			},
			"VAV_SYS AIR LOOP INLET Temperature":{
				abbreviation:"return air temperature",
				lv2_abbreviation:"rtn air temp",
				type:["air","temperature"],
			},
			"VAV Availability Manager Night Cycle Control Status":{
				abbreviation:"control status",
				lv2_abbreviation:"ctrl stat",
				type:["others"],
			},
			"VAV_SYS COOLING COIL Power":{
				abbreviation:"cooling power",
				lv2_abbreviation:"cool pwr",
				type:["electricity","temperature"],
			},
			"VAV_SYS HEATING COIL Power":{
				abbreviation:"heating power",
				lv2_abbreviation:"heat pwr",
				type:["electricity","temperature"],
			},
			"VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate":{
				abbreviation:"output air rate",
				lv2_abbreviation:"Ot air rate",
				type:["air"],
			},
			"VAV_SYS SUPPLY FAN OUTLET Temperature":{
				abbreviation:"output air temperature",
				lv2_abbreviation:"Ot air temp",
				type:["air","temperature"],
			},
			"VAV_SYS SUPPLY FAN:Fan Power":{
				abbreviation:"fan power",
				lv2_abbreviation:"fan pwr",
				type:["air","electricity"],
			},
			"VAV_SYS Outdoor Air Flow Fraction":{
				abbreviation:"outdoor air percent",
				lv2_abbreviation:"outdr air pct",
				type:["air"],
			},
			"VAV_SYS Outdoor Air Mass Flow Rate":{
				abbreviation:"outdoor air rate",
				lv2_abbreviation:"outdr air temp",
				type:["air"],
			},
			"COOL Schedule Value":{
				abbreviation:"air cool setpoint",
				lv2_abbreviation:"air cool pnt",
				type:["air","temperature"],
			},
			"DELI-FAN Power":{
				abbreviation:"deli fan power",
				lv2_abbreviation:"deli fan pwr",
				type:["electricity"],
			},
			"Drybulb Temperature":{
				abbreviation:"outdoor temperature",
				lv2_abbreviation:"outdr temp",
				type:["temperature"],
			},
			"Wind Direction":{
				abbreviation:"wind direction",
				lv2_abbreviation:"wnd dir",
				type:["air"],
			},
			"Wind Speed":{
				abbreviation:"wind speed",
				lv2_abbreviation:"wnd spd",
				type:["air"],
			},
			"HEAT Schedule Value":{
				abbreviation:"air heat setpoint",
				lv2_abbreviation:"air heat pnt",
				type:["air","temperature"],
			},
			"Pump Power":{
				abbreviation:"pump power",
				lv2_abbreviation:"pmp pwr",
				type:["electricity"],
			},
			"Water Heater Setpoint":{
				abbreviation:"water heater setpoint",
				lv2_abbreviation:"wtr heat pnt",
				type:["water","temperature"],
			},
			"Water Heater Gas Rate":{
				abbreviation:"water heater power",
				lv2_abbreviation:"wtr heat pwr",
				type:["water","temperature","electricity"],
			},
			"Water Heater Tank Temperature":{
				abbreviation:"water heater temperature",
				lv2_abbreviation:"wtr heat temp",
				type:["water","temperature"],
			},
			"Loop Temp Schedule":{
				abbreviation:"water loop setpoint",
				lv2_abbreviation:"wtr loop pnt",
				type:["water","temperature"],
			},
			"Supply Side Inlet Mass Flow Rate":{
				abbreviation:"input water rate",
				lv2_abbreviation:"In wtr rate",
				type:["water"],
			},
			"Supply Side Inlet Temperature":{
				abbreviation:"input water temperature",
				lv2_abbreviation:"In wtr temp",
				type:["water","temperature"],
			},
			"Supply Side Outlet Temperature":{
				abbreviation:"output water temperature",
				lv2_abbreviation:"Ot wtr temp",
				type:["water","temperature"],
			},
			"REHEAT COIL Power":{
				abbreviation:"air reheat power",
				lv2_abbreviation:"air heat pwr",
				type:["air","temperature","electricity"],
			},
			"RETURN OUTLET CO2 Concentration":{
				abbreviation:"return CO2 concentration",
				lv2_abbreviation:"rtn CO2",
				type:["air"],
			},
			"SUPPLY INLET Mass Flow Rate":{
				abbreviation:"input air rate",
				lv2_abbreviation:"In air rate",
				type:["air"],
			},
			"SUPPLY INLET Temperature":{
				abbreviation:"input air temperature",
				lv2_abbreviation:"In air temp",
				type:["air","temperature"],
			},
			"VAV REHEAT Damper Position":{
				abbreviation:"input air damper",
				lv2_abbreviation:"In air damp",
				type:["air"],
			},
			"Equipment Power":{
				abbreviation:"total power",
				lv2_abbreviation:"all pwr",
				type:["electricity"],
			},
			"Lights Power":{
				abbreviation:"light power",
				lv2_abbreviation:"light pwr",
				type:["electricity"],
			},
			"Mechanical Ventilation Mass Flow Rate":{
				abbreviation:"Ventilation air rate",
				lv2_abbreviation:"vntlation air rate",
				type:["air"],
			},
			"Thermostat Temp":{
				abbreviation:"air temperature",
				lv2_abbreviation:"air temp",
				type:["air","temperature"],
			},
			"Thermostat Cooling Setpoint":{
				abbreviation:"air cool threshold",
				lv2_abbreviation:"air cool pnt",
				type:["air","temperature"],
			},
			"Thermostat Heating Setpoint":{
				abbreviation:"air heat threshold",
				lv2_abbreviation:"air heat pnt",
				type:["air","temperature"],
			},
			"Total Electric Demand Power":{
				abbreviation:"total power",
				lv2_abbreviation:"all pwr",
				type:["electricity"],
			},
			"HVAC Electric Demand Power":{
				abbreviation:"HVAC power",
				lv2_abbreviation:"HVAC pwr",
				type:["electricity"],
			},
			"Hazium Concentration":{
				abbreviation:"Hazium",
				lv2_abbreviation:"Hazium",
				type:["hazium"],
			},
		},
		floor_name_number_mapping : {
			"F_1":1,
			"F_2":2,
			"F_3":3,
		},
	},


	//计算派生数据填入DATA_CENTER.derived_data
	cal_person_traj: function() {
		var proxOut = DATA_CENTER.original_data["proxOut-MC2.csv"];
		console.log(proxOut);
		DATA_CENTER.derived_data['person'] = {};
		var person = DATA_CENTER.derived_data['person'];
		for(var i=0;i<proxOut.length;i++) {
			var pID = proxOut[i][' prox-id'];
			pID = pID.trim();
			if(! (pID in person)) {
				// console.log(pID);
				person[pID] = {"fixRecords":[],"mobileRecords":[]};
			}

			var records = {};
			var t = new Date(proxOut[i]['timestamp']);
			records['prox-id'] = pID;
			records['floor'] = proxOut[i][' floor'].trim();
			records['timestamp'] = t;
			records['zone'] = proxOut[i][' zone'].trim();
			records['type'] = proxOut[i][' type'].trim();
			records['day'] = t.getFullYear() + "-" + (t.getMonth() + 1) + '-' +(t.getDate());

			person[pID]['fixRecords'].push(records);
		}
		// console.log(DATA_CENTER.derived_data['person']);
		var proxMobileOut = DATA_CENTER.original_data["proxMobileOut-MC2.csv"];
		for(var i=0;i<proxMobileOut.length;i++) {
			var pID = proxOut[i][' prox-id'];
			pID = pID.trim();
			if(! (pID in person)) {
				// console.log(pID);
				person[pID] = {"fixRecords":[],"mobileRecords":[]};
			}
						var records = {};

			var t = new Date(proxOut[i]['timestamp']);
			records['prox-id'] = pID;
			records['floor'] = proxOut[i][' floor'].trim();
			records['timestamp'] = t;
			records['zone'] = proxOut[i][' zone'].trim();
			records['type'] = proxOut[i][' type'].trim();
			records['day'] = t.getFullYear() + "-" + (t.getMonth() + 1) +'-' +(t.getDate());

			person[pID]['mobileRecords'].push(records);
		}
		// console.log(DATA_CENTER.derived_data['person']);
	},
	update_traj_endtime:function() {
		var person = DATA_CENTER.derived_data['person'];
		var pIDs = Object.keys(person);
		for(var i=0;i<pIDs.length;i++) {
			var pID = pIDs[i];
			var fixR = person[pID]['fixRecords'];
			for(var j=0;j<fixR.length-1;j++) {
				if(fixR[j+1].day == fixR[j].day) {
					fixR[j].endtime = fixR[j+1].timestamp;
				}
				else
					fixR[j].endtime = fixR[j].timestamp;
			}
			fixR[fixR.length-1].endtime = fixR[fixR.length-1].timestamp;
		}
		console.log(DATA_CENTER.derived_data['person']);
	},
	cal_derive_data : function(){
		this.cal_person_traj();
		this.update_traj_endtime();
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
		var that = this;

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
													that.initStream();
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

	},
	initStream: function(){
                var v_stream = new WebSocket('ws://192.168.10.9:8888');
                this.v_stream = v_stream;
                v_stream.onopen = function(e){
                    v_stream.send(JSON.stringify({state: "start", data: null}));
                };
                v_stream.onclose = function(e){
                    console.log("Connection closed!");
                }
                v_stream.onmessage = function (e){
                    var t_d = JSON.parse(e.data);
                    switch(t_d.state){
                        case "stream":
                            console.log(t_d.state, t_d.data);
                        break;
                        case "history":
                            console.log(t_d.state, t_d.data);
                        break;
                        case "control":
                            console.log(t_d.state, t_d.data);
                        break;
                        case "chooseID":
                            var tt_d = t_d.data;
                            console.log(tt_d.msg, tt_d.streamIds, tt_d.timeleft);
                            //v_stream.send(JSON.stringify({state: "chooseID", data: tt_d.streamIds[0]}));
                        break;
                        case "error":
                            console.log(t_d.state, t_d.data);
                        break;
                        default:
                            console.log(t_d.state, t_d.data);
                        break;
                    }
                };
            },




}
