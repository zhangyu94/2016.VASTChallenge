var DATA_CENTER = {
	original_data : [],//访问时形如DATA_CENTER.original_data["bldg-MC2.csv"]
	derived_data : [],//访问时形如DATA_CENTER.derived_data["..."]
	stream_data : [],

	//登记所有存在的view
	VIEW_COLLECTION : {
		"HVACgraph_attrbtn_view":HVACgraph_attrbtn_view,
		"linechart_linebtn_view":linechart_linebtn_view,
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


	//view之间通信需要利用的全局变量
	global_variable : {
		

		warning_list: [],
		//warning_list数据结构:
		//{
		//	time:...(一个时间点,存成数字)
		//	place:{
		//		type:...(标记这个place是一个HVACzone或者Proxzone或者具体的robot检测到的点)
		//		value:...
		//	}...
		//	attr:...(被认为是异常的属性,可以是某个sensor属性,可以是某个人的轨迹)
		//	event:{
		//		type:...(标记这个event被认为异常的原因,即异常的类型,如"impossible route","extreme value")
		//		value:...(字符串或数字,标记了异常数据的取值,可以用来标记这个event在准则下的异常度)
		//	}
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
		stream_start: new Date('2016 06 08'),
		stream_end: new Date('2016 06 13'),
		stream_window_width: 2*3600*1000,
		isstreaming: false,
		stream_display : false,
		display_interval:1000,//播放更新间隔
		display_before: 10*60*1000,
		display_rate:3000,//播放倍率
		isplaying:false,//标记是否正在播放
		isstreaming:false,
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
				lv2_abbreviation:"otdr air temp",
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
			"F_2_Z_1","F_2_Z_2","F_2_Z_3","F_2_Z_4","F_2_Z_5","F_2_Z_6","F_2_Z_7","F_2_Z_8","F_2_Z_9","F_2_Z_10","F_2_Z_11A","F_2_Z_11B","F_2_Z_11C","F_2_Z_12",
		]
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
		person[pID]['fixRecords'].sort(function(a, b){
				var keyA = a.timestamp;
				var keyB = b.timestamp;
				if(keyA < keyB) return -1;
				if(keyA > keyB) return 1;
				return 0;
		});
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

		person[pID]['mobileRecords'].sort(function(a, b){
			var keyA = a.timestamp;
			var keyB = b.timestamp;
			if(keyA < keyB) return -1;
			if(keyA > keyB) return 1;
			return 0;
		});

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
	},
	add_traj_fix_data:function(data, warning = false) {
		var person = DATA_CENTER.derived_data['person'];
		for(var i=0;i<data.length;i++) {
			var aRecord =data[i];
			var t = new Date(aRecord['datetime']);
			aRecord['timestamp'] = t;

			aRecord['day'] = t.getFullYear() + "-" + (t.getMonth() + 1) +'-' +(t.getDate());

			var pID = aRecord['proxCard'];
			if(! (pID in person)) {
				// console.log(pID);
				person[pID] = {"fixRecords":[],"mobileRecords":[]};
				if(warning) {
					console.log("New prox ID: " + pID);
				}
			}
			person[pID]['fixRecords'].push(aRecord);
			this.update_traj_endtime_signle(pID);
		}
	},
	add_traj_mobile_data:function(data, warning = false) {
		var person = DATA_CENTER.derived_data['person'];
		for(var i=0;i<data.length;i++) {
			var aRecord =data[i];
			var t = new Date(aRecord['datetime']);
			aRecord['timestamp'] = t;

			aRecord['day'] = t.getFullYear() + "-" + (t.getMonth() + 1) +'-' +(t.getDate());
			aRecord['timestamp'] = t;
			var pID = aRecord['proxCard'];
			if(! (pID in person)) {
				// console.log(pID);
				person[pID] = {"fixRecords":[],"mobileRecords":[]};
				if(warning) {
					console.log("New prox ID: " + pID);
				}
			}
			person[pID]['mobileRecords'].push(aRecord);
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

	cal_HVACzone_with_Haziumsenor_set:function(){
		var data = DATA_CENTER.original_data["bldg-MC2.csv"];
		var merged_zone_set = [];
		for (var i=0;i<data.length;++i)
		{
			var one_frame = data[i];
			var one_frame_zone_set = cal_Hazium_zone_in_one_frame(one_frame);
			for (var j=0;j<one_frame_zone_set.length;++j)
			{
				if (merged_zone_set.indexOf(one_frame_zone_set[j])<0)
				{
					merged_zone_set.push(one_frame_zone_set[j]);
					console.warn("newly add hazium zone",one_frame_zone_set[j]);
				}
			}
			function cal_Hazium_zone_in_one_frame(one_frame)
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
			}
		}
		return merged_zone_set;
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
		DATA_CENTER.derived_data["general-MC2.json"] = this._process_single_file("general-MC2.json");
	},

	cal_HVAC_Hazium:function(){
		DATA_CENTER.derived_data["f1z8a-MC2.json"] = this._process_single_file("f1z8a-MC2.json");
		DATA_CENTER.derived_data["f2z2-MC2.json"] = this._process_single_file("f2z2-MC2.json");
		DATA_CENTER.derived_data["f2z4-MC2.json"] = this._process_single_file("f2z4-MC2.json");
		DATA_CENTER.derived_data["f3z1-MC2.json"] = this._process_single_file("f3z1-MC2.json");
	},

	cal_HVAC_floor:function(){
		DATA_CENTER.derived_data["floor1-MC2.json"] = this._process_single_file("floor1-MC2.json");
		DATA_CENTER.derived_data["floor2-MC2.json"] = this._process_single_file("floor2-MC2.json");
		DATA_CENTER.derived_data["floor3-MC2.json"] = this._process_single_file("floor3-MC2.json");
	},

	_process_single_file:function(filename)
	{
		var original_data = DATA_CENTER.original_data[filename];
		var processed_data = [];
		for (var i=0;i<original_data.length;++i)
		{
			var new_element = unify_HVAC_oneframe_data(original_data[i]);
			processed_data.push(new_element);
		}
		return processed_data;

		function unify_HVAC_oneframe_data(data)
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
		}
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
																	DATA_CENTER.cal_derive_data();
																	//that.initStream();
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
                                    if(t_d.data['type'] == 'fixedprox'){
                                    	that.add_traj_fix_data(t_d.data['data']);
                        	}
                        	else if(t_d.data['type'] == 'mobileprox') {
                                    	that.add_traj_mobile_data(t_d.data['data']);
                        	}
                        	else if(t_d.data['type'] == 'HVAC') {
                                 console.log(t_d.data)
                        	}
                        	else if(t_d.data['type'] == 'bldg') {
                        		console.log(t_d.data)
                        		 var tdata=[]
                        		 for(var key in t_d.data){
                        		 	if(key == 'bldg') continue
                        		 	var keys = key.split(' ')
                        		 	keys[0] = keys[0].replace(':','')
                        		 	var nkey = keys.join(' ')
                        		 	if(nkey == 'F_3_Z_9 VAV Damper Position')
                        		 		nkey = 'F_3_Z_9 VAV REHEAT Damper Position'
                        		 	tdata[nkey]=t_d.data[key]

                        		 }
                        		 if(DATA_CENTER.stream_data['bldg'].length==0){
                        			 DATA_CENTER.stream_data['bldg'].push(tdata)
                        		 }
                        		 else {
                        		 	var len=DATA_CENTER.stream_data['bldg'].length;
                        		 	if(DATA_CENTER.stream_data['bldg'][len-1]['Date/Time']!=tdata['Date/Time']){
                        		 		DATA_CENTER.stream_data.push(tdata)
                        		 	}
                        		 	else{
                        		 		for(var key in tdata){
                        		 			if(key != 'Date/Time'){
                        		 				DATA_CENTER.stream_data['bldg'][-1][key]=tdata[key]
                        		 			}
                        		 		}
                        		 	}
                        		 }

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
                        		//console.log(t_d.data)

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
