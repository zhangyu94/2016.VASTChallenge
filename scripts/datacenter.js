var DATA_CENTER = {
	original_data : [],//访问时形如DATA_CENTER.original_data["bldg-MC2.csv"]
	derived_data : [],//访问时形如DATA_CENTER.derived_data["..."]
	stream_data : [],

	//登记所有存在的view
	VIEW_COLLECTION : {
		"HVACgraph_attrbtn_view":HVACgraph_attrbtn_view,
		"linechart_render_view":linechart_render_view,
		"relationshipgraph_view":relationshipgraph_view,
		"bigmap_view":bigmap_view,
		"ganttchart_view":ganttchart_view,
		"histogram_view":histogram_view,
		"trajmonitor_view":trajmonitor_view,
		"HVACmonitor_view":HVACmonitor_view,
		"eventlist_view":eventlist_view,
		"smallmaps_view":smallmaps_view,
		"timeline_view":timeline_view,
	},
	trigger_view_display : function(view_name,value){
		SUBJECT.notifyObserver("display:"+view_name, value);
	},
	trigger_view_hide : function(view_name,value){
		SUBJECT.notifyObserver("hide:"+view_name, value);
	},


	push_new_hazium_zone :function(value)
	{
		this.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.push(value);
		SUBJECT.notifyObserver("push:new_hazium_zone", value);
	},

	//view之间通信需要利用的全局变量
	global_variable : {

		warning_list: [],
		//warning_list元素数据结构:
		//{
		//	type:...(linechart,trajectory等)
		//	time:...(一个时间点,存成数字)
		//  timelength:...(时间长度，存成数字)
		//	place:{
		//		type:...(标记这个place是一个HVACzone或者Proxzone或者具体的robot检测到的点)
		//		value:...
		//	}...
		//	attr:...(被认为是异常的属性,可以是某个sensor属性,可以是某个人的轨迹)
		//	value:...(字符串或数字,标记了异常数据的取值,可以用来标记这个event在准则下的异常度)
		//  reason:...(标记这个event被认为异常的原因,即异常的类型,如"impossible route","extreme value")
		//}

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


		proxZone_to_energyZone:{},
		energyZone_to_proxZone:{},

		latest_HVAC_merged_frame:undefined,


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

		current_display_time:1464656940000,//timeline当前播放到的时间

		selected_card_set:[
			'Earpa001', 'tseifert001', 'ibaza002', 'nbasham001', 'ostrum001', 'eklinger001', 'rmieshaber001', 'jholly001', 'mbramar001'
		],
		selected_card: 'mbramar001',
		selected_person_set:[],
		enable_alert: true,
		certainty_encode: true,
		work_encode: true, 
		selected_prox_zone: undefined
	},

	//set_global_variable设置全局变量并调用SUBJECT的notify
	//使用时形如DATA_CENTER.set_global_variable("selected_attr_set",[1,2,3])
	set_global_variable : function(variable_name,value){
		this.global_variable[variable_name] = value;
		SUBJECT.notifyObserver("set:"+variable_name, value);
	},

	timeline_variable : {
		stream_start: new Date('2016 06 14 00:00:00'),
		stream_end: new Date('2016 06 13'),
		stream_window_width: 60/*2*/*3600*1000,
		isstreaming: false,
		stream_display: false,
		display_interval: 1000,//播放更新间隔
		display_before: 10*60*1000,
		display_rate: 300,//播放倍率
		isplaying: false,//标记是否正在播放
		isstreaming: false,
		mouseover_time: undefined,//当前mouseover的地方
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
		HAZIUM_ATTR_NAME : "Hazium Concentration",//记录hazium的那个属性的名字
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

		//HVACzone_with_Haziumsenor_set已经改为由datacenter的函数动态计算

		attribute_description : {
			"BATH_EXHAUST:Fan Power":{
				abbreviation:"bath fan power",
				lv2_abbreviation:"bathfan pwr",
				type:["electricity","air"],
			},
			"VAV_SYS AIR LOOP INLET Mass Flow Rate":{
				abbreviation:"return air rate",
				lv2_abbreviation:"rtn air rate",
				type:["air"],
			},
			"VAV_SYS AIR LOOP INLET Temperature":{
				abbreviation:"return air temperature",
				lv2_abbreviation:"rtn air temp",
				type:["temperature","air"],
			},
			"VAV Availability Manager Night Cycle Control Status":{
				abbreviation:"control status",
				lv2_abbreviation:"ctrl stat",
				type:["others"],
			},
			"VAV_SYS COOLING COIL Power":{
				abbreviation:"cooling power",
				lv2_abbreviation:"cool pwr",
				type:["temperature","electricity"],
			},
			"VAV_SYS HEATING COIL Power":{
				abbreviation:"heating power",
				lv2_abbreviation:"heat pwr",
				type:["temperature","electricity"],
			},
			"VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate":{
				abbreviation:"output air rate",
				lv2_abbreviation:"Ot air rate",
				type:["air"],
			},
			"VAV_SYS SUPPLY FAN OUTLET Temperature":{
				abbreviation:"output air temperature",
				lv2_abbreviation:"Ot air temp",
				type:["temperature","air"],
			},
			"VAV_SYS SUPPLY FAN:Fan Power":{
				abbreviation:"fan power",
				lv2_abbreviation:"fan pwr",
				type:["electricity","air"],
			},
			"VAV_SYS Outdoor Air Flow Fraction":{
				abbreviation:"outdoor air percent",
				lv2_abbreviation:"otdr air pct",
				type:["air"],
			},
			"VAV_SYS Outdoor Air Mass Flow Rate":{
				abbreviation:"outdoor air rate",
				lv2_abbreviation:"otdr air rate",
				type:["air"],
			},
			"COOL Schedule Value":{
				abbreviation:"air cool setpoint",
				lv2_abbreviation:"air cool pnt",
				type:["temperature","air"],
			},
			"DELI-FAN Power":{
				abbreviation:"deli fan power",
				lv2_abbreviation:"deli fan pwr",
				type:["electricity"],
			},
			"Drybulb Temperature":{
				abbreviation:"outdoor temperature",
				lv2_abbreviation:"otdr temp",
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
				type:["temperature","air"],
			},
			"Pump Power":{
				abbreviation:"pump power",
				lv2_abbreviation:"pmp pwr",
				type:["electricity"],
			},
			"Water Heater Setpoint":{
				abbreviation:"water heater setpoint",
				lv2_abbreviation:"wtr heat pnt",
				type:["temperature","water"],
			},
			"Water Heater Gas Rate":{
				abbreviation:"water heater power",
				lv2_abbreviation:"wtr heat pwr",
				type:["temperature","electricity","water"],
			},
			"Water Heater Tank Temperature":{
				abbreviation:"water heater temperature",
				lv2_abbreviation:"wtr heat temp",
				type:["temperature","water"],
			},
			"Loop Temp Schedule":{
				abbreviation:"water loop setpoint",
				lv2_abbreviation:"wtr loop pnt",
				type:["temperature","water"],
			},
			"Supply Side Inlet Mass Flow Rate":{
				abbreviation:"input water rate",
				lv2_abbreviation:"In wtr rate",
				type:["water"],
			},
			"Supply Side Inlet Temperature":{
				abbreviation:"input water temperature",
				lv2_abbreviation:"In wtr temp",
				type:["temperature","water"],
			},
			"Supply Side Outlet Temperature":{
				abbreviation:"output water temperature",
				lv2_abbreviation:"Ot wtr temp",
				type:["temperature","water"],
			},
			"REHEAT COIL Power":{
				abbreviation:"air reheat power",
				lv2_abbreviation:"air heat pwr",
				type:["temperature","electricity","air"],
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
				type:["temperature","air"],
			},
			"VAV REHEAT Damper Position":{
				abbreviation:"input air damper",
				lv2_abbreviation:"In air damp",
				type:["air"],
			},
			"Equipment Power":{
				abbreviation:"equipment power",
				lv2_abbreviation:"equipment pwr",
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
				type:["temperature","air"],
			},
			"Thermostat Cooling Setpoint":{
				abbreviation:"air cool threshold",
				lv2_abbreviation:"air cool pnt",
				type:["temperature","air"],
			},
			"Thermostat Heating Setpoint":{
				abbreviation:"air heat threshold",
				lv2_abbreviation:"air heat pnt",
				type:["temperature","air"],
			},
			"Total Electric Demand Power":{
				abbreviation:"total power",
				lv2_abbreviation:"all pwr",
				type:["electricity"],
			},
			"HVAC Electric Demand Power":{
				abbreviation:"hvac power",
				lv2_abbreviation:"hvac pwr",
				type:["electricity"],
			},
			"Hazium Concentration":{
				abbreviation:"Hazium",
				lv2_abbreviation:"Hazium",
				type:["hazium"],
			},
		},
		attribute_type_color_mapping : {
			"hazium" : "#76E6D8",
			"temperature" : "#FF9080",
			"electricity" : "#F0F070",
			"air" : "#FFFFFF",
			"water" : "#70B0FF",
			"others" : "#D0A0E0",
		},
		attribute_type_priority : [
			"hazium",
			"temperature",
			"electricity",
			"air",
			"water",
			"others",
		],
		floor_name_number_mapping : {
			"F_1":1,
			"F_2":2,
			"F_3":3,
		},
		building_set :["building"],
		floor_set:["F_1","F_2","F_3"],
		HVACzone_set:[
			"F_1_Z_1","F_1_Z_2","F_1_Z_3","F_1_Z_4","F_1_Z_5","F_1_Z_6","F_1_Z_7","F_1_Z_8A","F_1_Z_8B",
			"F_2_Z_1","F_2_Z_2","F_2_Z_3","F_2_Z_4","F_2_Z_5","F_2_Z_6","F_2_Z_7","F_2_Z_8","F_2_Z_9","F_2_Z_10","F_2_Z_11","F_2_Z_12A","F_2_Z_12B","F_2_Z_12C","F_2_Z_13","F_2_Z_14","F_2_Z_15","F_2_Z_16",
			"F_3_Z_1","F_3_Z_2","F_3_Z_3","F_3_Z_4","F_3_Z_5","F_3_Z_6","F_3_Z_7","F_3_Z_8","F_3_Z_9","F_3_Z_10","F_3_Z_11A","F_3_Z_11B","F_3_Z_11C","F_3_Z_12",
		],
		zone_Color_Array:['#EEEEEE', '#F3E4EE', '#FFF4CF', '#F8F7EB', '#F6ECF6', '#EDF7FA', '#FFEEEE', '#D5F4EF'],
		//zone_Color_Array:['#55EEEE', '#53E4EE', '#63F4CF', '#68F7EB', '#66ECF6', '#5DF7FA', '#66EEEE', '#45F4EF'],
		certainty_color_array:[
			{
				name: 'accurate',
				color: '#08519c'
			},
			{
				name: 'in-office',
				color: '#4292c6'
			},
			{
				name: 'in-public',
				color: '#9ecae1'
			}
		],
		alert_color_array:[
			{
				name: 'warning',
				color: '#feb24c'
			},
			{
				name: 'conflict',
				color: '#e31a1c'
			}
		],
		work_color_array:[
			{
				work:'Administration',
				color: '#6a3d9a'
			},
			{
				work: 'Engineering',
				color: '#ff7f00'
			},
			{
				work: 'Executive',
				color: '#80b1d3'
			},
			{
				work: 'Facilities',
				color: '#ccbbc5'
			},
			{
				work: 'HR',
				color: '#ffed6f'
			},
			{
				work: 'Information Technology',
				color: '#fccde5'
			},
			{
				work: 'Security',
				color: '#b3de69'
			},
			{
				work: 'Not Known',
				color: 'black'
			}
		],
		proxId2work: undefined,
		work2color: undefined
	},

	//计算派生数据填入DATA_CENTER.derived_data
	cal_person_traj: function() {
		var proxOut = DATA_CENTER.original_data["proxOut-MC2.csv"];
		// console.log(proxOut);
		DATA_CENTER.derived_data['person'] = {};
		var person = DATA_CENTER.derived_data['person'];
		for(var i=0;i<proxOut.length;i++) {
			var pID = proxOut[i][' prox-id'];
			pID = pID.trim();
			if(! (pID in person)) {
				// console.log(pID);
				person[pID] = {"fixRecords":[],"mobileRecords":[],'duration':{}};
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
			if(fixR[fixR.length-1].endtime.toDateString() == "Thu Jun 16 2016") {
				console.log("!!!!!");
				fixR[fixR.length-1].endtime = new Date(2016,5,16,12);
			}

		}
		//console.log(DATA_CENTER.derived_data['person']);
	},
	update_traj_endtime_signle: function(pID) {
		var person = DATA_CENTER.derived_data['person'];
		var fixR = person[pID]['fixRecords'];
		for(var j=0;j<fixR.length-1;j++) {
			if(fixR[j+1].day == fixR[j].day) {
				fixR[j].endtime = fixR[j+1].timestamp;
			}
			else
				fixR[j].endtime = fixR[j].timestamp;
		}
		fixR[fixR.length-1].endtime = fixR[fixR.length-1].timestamp;

		if(fixR[fixR.length-1].endtime.toDateString() == "Thu Jun 16 2016") {
			// console.log("!!!!!");

			fixR[fixR.length-1].endtime = new Date(2016,5,16,12);
		}
	},
	add_traj_fix_data:function(data, warning = true) {
		var person = DATA_CENTER.derived_data['person'];
		var that = this;
		for(var i=0;i<data.length;i++) {
			var aRecord =data[i];
			var t = new Date(aRecord['datetime']);
			aRecord['timestamp'] = t;

			aRecord['day'] = t.getFullYear() + "-" + (t.getMonth() + 1) +'-' +(t.getDate());

			var pID = aRecord['proxCard'];
			if(! (pID in person)) {
				// console.log(pID);
				person[pID] = {"fixRecords":[],"mobileRecords":[],'duration':{}};
				if(warning) {
					/*
					var w = {"time": t,
					"place":"f" + aRecord['floor'] + "z" + aRecord['zone'],
					"attr":pID,
					"event" :{
						"type":"newProxID",
						"value":null
						}
					}
					that.global_variable['warning_list'].push(w);
					console.log("New prox ID: " + pID);
					*/
					var w = {
						"type": "trajectory",
						"time": (new Date(t)).valueOf(),
						"place":{
							type:"proxzone",
							value:"F_"+aRecord['floor']+"_Z_"+aRecord['zone'],
						},
						"attr": "ProxID",
						"value":pID,
						"reason":"newProxID",
					}
					that.global_variable['warning_list'].push(w);
					console.log("New prox ID: " + pID);
				}
			}
			// var fz = 'f' + aRecord['floor'] + 'z'+  aRecord['zone'];
			// if(!(fz in person[pID]['duration'])) {
			// 	var w = {
			// 		"type": "trajectory",
			// 		"time": (new Date(t)).valueOf(),
			// 		"place":{
			// 			type:"proxzone",
			// 			value:"F_"+aRecord['floor']+"_Z_"+aRecord['zone'],
			// 		},
			// 		"attr": "ProxID",
			// 		"value":pID,
			// 		"reason":"firstTimeToTheZone",
			// 	}
			// 	person[pID]['duration'][fz] = 0;
			// 	console.log(w);
			// 	that.global_variable['warning_list'].push(w);
			// }
			person[pID]['fixRecords'].push(aRecord);
			this.update_traj_endtime_signle(pID);
		}
	},
	add_traj_mobile_data:function(data, warning) {
		var person = DATA_CENTER.derived_data['person'];
		//console.log(data);
		for(var i=0;i<data.length;i++) {
			var aRecord =data[i];
			var x = aRecord.X;
			var y = aRecord.y;
			var floor = aRecord.floorNum;
			aRecord['zone'] = this.cal_zone_num(x,y,floor);
			var t = new Date(aRecord['datetime']);
			aRecord['timestamp'] = t;
			aRecord['day'] = t.getFullYear() + "-" + (t.getMonth() + 1) +'-' +(t.getDate());
			aRecord['timestamp'] = t;
			var pID = aRecord['proxCard'];
			if(! (pID in person)) {
				// console.log(pID);
				person[pID] = {"fixRecords":[],"mobileRecords":[],'duration':{}};
				if(warning) {
					/*
					var w = {"time": t,
					"place":"f" + aRecord['floor'] + ":"+aRecord['x'] +"," +aRecord['y'],
					"attr":pID,
					"event" :{
						"type":"newProxID",
						"value":null
						}
					}
					that.global_variable['warning_list'].push(w);
					console.log("New prox ID: " + pID);
					*/
					var w = {
						"type": "trajectory",
						"time": (new Date(t)).valueOf(),
						"place":{
							type:"proxzone",
							value:"F_"+aRecord['floor']+"_Z_"+aRecord['zone'],
						},
						"attr": "ProxID",
						"value":pID,
						"reason":"newProxID",
					}
					that.global_variable['warning_list'].push(w);
					console.log("New prox ID: " + pID);
				}
			}
			person[pID]['mobileRecords'].push(aRecord);
		}
	},
	cal_zone_num: function(xLoc, yLoc, floorNumRobot){
		var singleroomData = DATA_CENTER.derived_data["singleroom.json"];
			for(var k = 0;k < singleroomData.length;k++){
				var room = singleroomData[k];
				var roomX = +room.x;
				var roomY = +room.y;
				var lengthX = +room.xlength;
       			var lengthY = +room.ylength;
       			var roomFloor = +room.floor;
       			if((xLoc >= roomX) && (xLoc <= roomX + lengthX) && (yLoc >= roomY) && (yLoc <= roomY + lengthY)
       				&& (roomFloor == floorNumRobot)){
       				robotDetectionData[j].proxZone = +room.proxZone;
       				break;
       			}
			}
	},
	cal_derive_data: function(){
		this.cal_person_traj();
		this.update_traj_endtime();
		this.cal_HVAC_general();
		this.cal_HVAC_Hazium();
		this.cal_HVAC_floor();
		this.merge_HVAC_data();
		this.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set = this.cal_HVACzone_with_Haziumsenor_set();
	},

	add_HVAC_streaming_data:function(data,label){




		var processed_data = this.unify_HVAC_oneframe_data(data)
		var cur_frame_timestamp = processed_data["Date/Time"];

		var latest_HVAC_merged_frame = DATA_CENTER.global_variable.latest_HVAC_merged_frame;

		if (typeof(latest_HVAC_merged_frame)=="undefined")//第一次接受streaming时
		{
			DATA_CENTER.global_variable.latest_HVAC_merged_frame = processed_data;
			return ;
		}

		var latest_HVAC_merged_frame_timestamp = latest_HVAC_merged_frame["Date/Time"];
		if (latest_HVAC_merged_frame_timestamp == cur_frame_timestamp)
		{
			for (key in processed_data)
			{
				latest_HVAC_merged_frame[key] = processed_data[key];
			}
			DATA_CENTER.global_variable.latest_HVAC_merged_frame = DATA_CENTER.global_variable.latest_HVAC_merged_frame;
		}
		else if (latest_HVAC_merged_frame_timestamp < cur_frame_timestamp)
		{
			var verifying_data_frame = DATA_CENTER.original_data["bldg-MC2.csv"][0];
			for (key in verifying_data_frame)
			{
				if (!(key in latest_HVAC_merged_frame))
				{
					console.warn("latest stream frame lost key",key);
					latest_HVAC_merged_frame[key] = 0;
				}
			}

			DATA_CENTER.original_data["bldg-MC2.csv"].push(latest_HVAC_merged_frame)

			var Hazium_zone_in_new_frame = this.cal_Hazium_zone_in_one_frame(latest_HVAC_merged_frame);
			for (var i=0;i<Hazium_zone_in_new_frame.length;++i)
			{
				if (DATA_CENTER.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set.indexOf(Hazium_zone_in_new_frame[i])<0)
				{
					console.warn("new Hazium zone in streaming !!");
					DATA_CENTER.push_new_hazium_zone(Hazium_zone_in_new_frame[i]);
				}
			}
			DATA_CENTER.set_global_variable("latest_HVAC_merged_frame",latest_HVAC_merged_frame);

			DATA_CENTER.global_variable.latest_HVAC_merged_frame = processed_data;
		}
		else
		{
			console.warn("error:old frame comes later than new frame")
		}

		
	},


	add_HVAC_data: function(data){
		var floor1data = DATA_CENTER._process_single_file(data.floor1);
		var floor2data = DATA_CENTER._process_single_file(data.floor2);
		var floor3data = DATA_CENTER._process_single_file(data.floor3);
		var generaldata = DATA_CENTER._process_single_file(data.general);
		var haziumdata = DATA_CENTER._process_single_file(data.sensor);

		var timestamp_array = [];
		for (var i=0;i<floor1data.length;++i)
		{
			var cur_time = floor1data[i]["Date/Time"];
			if (timestamp_array.indexOf(cur_time)>=0)
				continue;
			timestamp_array.push(cur_time);
		}
		for (var i=0;i<floor2data.length;++i)
		{
			var cur_time = floor2data[i]["Date/Time"];
			if (timestamp_array.indexOf(cur_time)>=0)
				continue;
			timestamp_array.push(cur_time);
		}
		for (var i=0;i<floor3data.length;++i)
		{
			var cur_time = floor3data[i]["Date/Time"];
			if (timestamp_array.indexOf(cur_time)>=0)
				continue;
			timestamp_array.push(cur_time);
		}
		for (var i=0;i<generaldata.length;++i)
		{
			var cur_time = generaldata[i]["Date/Time"];
			if (timestamp_array.indexOf(cur_time)>=0)
				continue;
			timestamp_array.push(cur_time);
		}
		for (var i=0;i<haziumdata.length;++i)
		{
			var cur_time = haziumdata[i]["Date/Time"];
			if (timestamp_array.indexOf(cur_time)>=0)
				continue;
			timestamp_array.push(cur_time);
		}
		timestamp_array.sort();

		var test = [];
		for (var i=0;i<timestamp_array.length;++i)
		{
			var new_element = {};
			new_element["Date/Time"] = timestamp_array[i];
			for (var j=0;j<floor1data.length;++j)
			{
				if (floor1data[j]["Date/Time"] == timestamp_array[i])
				{
					for (key in floor1data[j])
						new_element[key] = floor1data[j][key];
					break;
				}
			}
			for (var j=0;j<floor2data.length;++j)
			{
				if (floor2data[j]["Date/Time"] == timestamp_array[i])
				{
					for (key in floor2data[j])
						new_element[key] = floor2data[j][key];
					break;
				}
			}
			for (var j=0;j<floor3data.length;++j)
			{
				if (floor3data[j]["Date/Time"] == timestamp_array[i])
				{
					for (key in floor3data[j])
						new_element[key] = floor3data[j][key];
					break;
				}
			}
			for (var j=0;j<generaldata.length;++j)
			{
				if (generaldata[j]["Date/Time"] == timestamp_array[i])
				{
					for (key in generaldata[j])
						new_element[key] = generaldata[j][key];
					break;
				}
			}
			for (var j=0;j<haziumdata.length;++j)
			{
				if (haziumdata[j]["Date/Time"] == timestamp_array[i])
				{
					for (key in haziumdata[j])
						new_element[key] = haziumdata[j][key];
				}
			}
			DATA_CENTER.original_data["bldg-MC2.csv"].push(new_element)
		}

		this.GLOBAL_STATIC.HVACzone_with_Haziumsenor_set = this.cal_HVACzone_with_Haziumsenor_set();
	},

	cal_HVACzone_with_Haziumsenor_set:function(){
		var data = DATA_CENTER.original_data["bldg-MC2.csv"];
		var merged_zone_set = [];
		for (var i=0;i<data.length;++i)
		{
			var one_frame = data[i];
			var one_frame_zone_set = this.cal_Hazium_zone_in_one_frame(one_frame);
			for (var j=0;j<one_frame_zone_set.length;++j)
			{
				if (merged_zone_set.indexOf(one_frame_zone_set[j])<0)
				{
					merged_zone_set.push(one_frame_zone_set[j]);
					console.warn("newly add hazium zone",one_frame_zone_set[j]);
				}
			}

		}
		return merged_zone_set;
	},

	cal_Hazium_zone_in_one_frame:function(one_frame)
			{
				var zone_set = [];
				for (key in one_frame)
				{
					if (key.indexOf("Hazium")<0)
						continue;
					var keys = key.split(' ');
					var first_part = keys[0];
					var zone_part = first_part.replace(":","");

					if (zone_set.indexOf(zone_part)>=0)
					{
						console.warn("one Hazium attr appear more than once in one frame",key)
						continue;
					}
					zone_set.push(zone_part)

				}
				return zone_set;
			},



	merge_HVAC_data:function(){
		DATA_CENTER.original_data["bldg-MC2.csv"] = [];

		for (var i=0;i<DATA_CENTER.derived_data["general-MC2.json"].length;++i)
		{
			var cur_general = DATA_CENTER.derived_data["general-MC2.json"][i];
			var cur_hazium1 = DATA_CENTER.derived_data["f1z8a-MC2.json"][i];
			var cur_hazium2 = DATA_CENTER.derived_data["f2z2-MC2.json"][i];
			var cur_hazium3 = DATA_CENTER.derived_data["f2z4-MC2.json"][i];
			var cur_hazium4 = DATA_CENTER.derived_data["f3z1-MC2.json"][i];
			var cur_floor1 = DATA_CENTER.derived_data["floor1-MC2.json"][i];
			var cur_floor2 = DATA_CENTER.derived_data["floor2-MC2.json"][i];
			var cur_floor3 = DATA_CENTER.derived_data["floor3-MC2.json"][i];

			var new_element = {};
			for (key in cur_general)
				new_element[key] = cur_general[key];
			for (key in cur_hazium1)
				new_element[key] = cur_hazium1[key];
			for (key in cur_hazium2)
				new_element[key] = cur_hazium2[key];
			for (key in cur_hazium3)
				new_element[key] = cur_hazium3[key];
			for (key in cur_hazium4)
				new_element[key] = cur_hazium4[key];
			for (key in cur_floor1)
				new_element[key] = cur_floor1[key];
			for (key in cur_floor2)
				new_element[key] = cur_floor2[key];
			for (key in cur_floor3)
				new_element[key] = cur_floor3[key];

			DATA_CENTER.original_data["bldg-MC2.csv"].push(new_element)
		}

	},

	cal_HVAC_general:function(){
		DATA_CENTER.derived_data["general-MC2.json"] = this._process_single_file(DATA_CENTER.original_data["general-MC2.json"]);
	},

	cal_HVAC_Hazium:function(){
		DATA_CENTER.derived_data["f1z8a-MC2.json"] = this._process_single_file(DATA_CENTER.original_data["f1z8a-MC2.json"]);
		DATA_CENTER.derived_data["f2z2-MC2.json"] = this._process_single_file(DATA_CENTER.original_data["f2z2-MC2.json"]);
		DATA_CENTER.derived_data["f2z4-MC2.json"] = this._process_single_file(DATA_CENTER.original_data["f2z4-MC2.json"]);
		DATA_CENTER.derived_data["f3z1-MC2.json"] = this._process_single_file(DATA_CENTER.original_data["f3z1-MC2.json"]);
	},

	cal_HVAC_floor:function(){
		DATA_CENTER.derived_data["floor1-MC2.json"] = this._process_single_file(DATA_CENTER.original_data["floor1-MC2.json"]);
		DATA_CENTER.derived_data["floor2-MC2.json"] = this._process_single_file(DATA_CENTER.original_data["floor2-MC2.json"]);
		DATA_CENTER.derived_data["floor3-MC2.json"] = this._process_single_file(DATA_CENTER.original_data["floor3-MC2.json"]);
	},

	_process_single_file:function(original_data)
	{
		var processed_data = [];
		for (var i=0;i<original_data.length;++i)
		{
			var new_element = this.unify_HVAC_oneframe_data(original_data[i]);
			processed_data.push(new_element);
		}
		return processed_data;


	},

	unify_HVAC_oneframe_data:function(data)
		{
			if (typeof (data.message)!="undefined")
				var cur_data = data.message;
			else
				var cur_data = data;
			var new_element = {};
			for (key in cur_data)
			{
				if (key == "type")
					continue;
				if (key == "floor")
					continue;
				if (key == "_id")
					continue;
				if (key == "Date/Time")
				{
					new_element[key] = cur_data[key];
					continue;
				}

				var new_key = key;
				if (key.indexOf("BATH_EXHAUST")>=0)//单独处理F_..._BATH_EXHAUST:Fan Power的情况
				{
					var end = key.indexOf("BATH_EXHAUST");
					var floor_part = key.substring(0,end-1);
					var attr_part = key.substring(end,key.length);
					new_key = floor_part + " " + attr_part;
				}
				else if (key.indexOf("_Z_")>=0)//zone的属性
				{
					var keys = key.split(' ');
					var first_part = keys[0];
					var zone_part = first_part.replace(":","");
					var attr_part = key.substring(first_part.length+1,key.length);
					new_key = zone_part + " " + attr_part;
				}
				else if (key.indexOf("F_")>=0)//floor的属性
				{
					var floor_part = key.substring(0,3)
					var attr_part = key.substring(4,key.length);
					new_key = floor_part + " " + attr_part;
				}
				if(new_key == 'F_3_Z_9 VAV Damper Position')
                	new_key = 'F_3_Z_9 VAV REHEAT Damper Position';

                new_element[new_key] =+ cur_data[key];
			}
			return new_element;
		},


	initialize_loaddata:function(callback_function){
		var path = "dataset/original/";

		//streaming data读到以后直接append到旧的file里面
		var file_name=[
			"general-MC2.json",
			"f1z8a-MC2.json",
			"f2z2-MC2.json",
			"f2z4-MC2.json",
			"f3z1-MC2.json",
			"proxMobileOut-MC2.csv",
			"proxOut-MC2.csv",
			"floor1-MC2.json",
			"floor2-MC2.json",
			"floor3-MC2.json",
		];

		var derived_path = "dataset/derived/";
		var d_file_name = [
			"person.json",
			"room.json",
			"singleroom.json",
			"person2room.csv",
			"patternChange.json",
		];
		var that = this;

		d3.json(path+file_name[0],function(HVAC_data){
			d3.json(path+file_name[1],function(hazium_data1){
				d3.json(path+file_name[2],function(hazium_data2){
					d3.json(path+file_name[3],function(hazium_data3){
						d3.json(path+file_name[4],function(hazium_data4){
							d3.csv(path+file_name[5],function(data5){//mobile out data
								person_robot_detection_array = DATA_CENTER.global_variable.person_robot_detection_array;
								for(var i = 0;i < data5.length;i++){
									var proxId = data5[i][' prox-id'].replace(/\s+/g,"");
									data5[i].proxId = proxId;
									var timestamp = data5[i].timestamp;
									data5[i].robotTime = new Date(timestamp).getTime();
									data5[i].floorNum = +data5[i][' floor'].replace(/\s+/g,"");
									data5[i].x = +data5[i][' x'].replace(/\s+/g,"");
									data5[i].y = +data5[i][' y'].replace(/\s+/g,"");
									if(person_robot_detection_array.indexOf(proxId) == -1){
										person_robot_detection_array.push(proxId);
									}
								}
								// console.log(person_robot_detection_array);
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
										personInZone.sort(function(person1,person2){
											if(person1.personName > person2.personName){
												return 1;
											}else if(person1.personName < person2.personName){
												return -1;
											}else{
												return 0;
											}
										});
										DATA_CENTER.derived_data["personInZone"] = personInZone;
										d3.json(derived_path+d_file_name[1], function(data8) {//room.json data
											//room数据处理得到每个楼层的各个zone有哪些区域
											// console.log(data8);
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
												var singleroomData = data9;
												var robotDetectionData = data5;
												for(var j = 0;j < robotDetectionData.length;j++){
													var xLoc = robotDetectionData[j].x;
													var yLoc = robotDetectionData[j].y;
													var floorNumRobot = robotDetectionData[j].floorNum;
													for(var k = 0;k < singleroomData.length;k++){
														var room = singleroomData[k];
														var roomX = +room.x;
														var roomY = +room.y;
														var lengthX = +room.xlength;
									        			var lengthY = +room.ylength;
									        			var roomFloor = +room.floor;
									        			if((xLoc >= roomX) && (xLoc <= roomX + lengthX) && (yLoc >= roomY) && (yLoc <= roomY + lengthY)
									        				&& (roomFloor == floorNumRobot)){
									        				robotDetectionData[j].proxZone = +room.proxZone;
									        				break;
									        			}
													}
												}
												//console.log(robotDetectionData);
												d3.csv(derived_path + d_file_name[3], function(data10){

													DATA_CENTER.GLOBAL_STATIC.proxId2work = new Object();
													for(var i = 0;i < data10.length;i++){
														var proxId = data10[i]['prox-id'];
														var department = data10[i]['Department'];
														DATA_CENTER.GLOBAL_STATIC.proxId2work[proxId] = department;
													}
													var work_color_array = DATA_CENTER.GLOBAL_STATIC.work_color_array;
													DATA_CENTER.GLOBAL_STATIC.work2color = new Object();
													for(var i = 0;i < work_color_array.length;i++){
														var workName = work_color_array[i].work;
														var color = work_color_array[i].color;
														DATA_CENTER.GLOBAL_STATIC.work2color[workName] = color;
													}
													d3.json(path+file_name[7],function(data11){
														d3.json(path+file_name[8],function(data12){
															d3.json(path+file_name[9],function(data13){
																d3.json(derived_path+d_file_name[4],function(data14){
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
																	DATA_CENTER.original_data[file_name[7]] = data11;
																	DATA_CENTER.original_data[file_name[8]] = data12;
																	DATA_CENTER.original_data[file_name[9]] = data13;
																	DATA_CENTER.derived_data[d_file_name[4]] = data14;
																	DATA_CENTER.stream_data['bldg']=[];
																	DATA_CENTER.stream_data['HVAC']=[];
																	DATA_CENTER.cal_derive_data();
																	that.initStream();
																	roomsExchange();
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
					})
				})
			})
		})
	},
	initStream: function(){
	    var that = this;
                var v_stream = new WebSocket('ws://192.168.10.9:1603');
                this.v_stream = v_stream;
                v_stream.onopen = function(e){
                	console.log("Web socket open!");
                    v_stream.send(JSON.stringify({state: "start", data: "pkuvis"}));
                };
                v_stream.onclose = function(e){
                    console.log("Connection closed!");
                }
                v_stream.onmessage = function (e){
                    var t_d = JSON.parse(e.data);

                    switch(t_d.state){
                        case "stream":
                            if(t_d.data['type'] == 'fixedprox'){
                                that.add_traj_fix_data(t_d.data['data']);
                        	}
                        	else if(t_d.data['type'] == 'mobileprox') {
                                that.add_traj_mobile_data(t_d.data['data']);
                        	}
                        	else if(t_d.data['type'] == 'sensor') {
                                that.add_HVAC_streaming_data(t_d.data,"sensor");
                        	}
                        	else if(t_d.data['type'] == 'bldg') {
                        		that.add_HVAC_streaming_data(t_d.data,"bldg");
                        	}


                            //console.log(t_d.state, t_d.data);
                        break;
                        case "history":
                        	console.log(t_d)
                        	if(t_d.data['type'] == 'fixedprox'){
                                that.add_traj_fix_data(t_d.data['data']);
                        	}
                        	else if(t_d.data['type'] == 'mobileprox') {
                                that.add_traj_mobile_data(t_d.data['data']);
                        	}
                        	else if(t_d.data['type'] == 'HVAC') {
                        		that.add_HVAC_data(t_d.data['data']);
                        	}

                        	if (DATA_CENTER.original_data["bldg-MC2.csv"].length == 4741)
							{
								SUBJECT.notifyObserver("HVAC_streaming_get_all");
							}

                            //console.log(t_d.state, t_d.data);
                        break;
                        case "control":
                            //console.log(t_d.state, t_d.data);
                        break;
                        case "chooseID":
                            var tt_d = t_d.data;
                           // console.log(tt_d.msg, tt_d.streamIds, tt_d.timeleft);
                            //v_stream.send(JSON.stringify({state: "chooseID", data: tt_d.streamIds[0]}));
                        break;
                        case "error":
                           // console.log(t_d.state, t_d.data);
                        break;
                        default:
                           // console.log(t_d.state, t_d.data);
                        break;
                    }
                };
            },




}
