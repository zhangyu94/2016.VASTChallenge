var DATA_CENTER = {
	original_data : [],//访问时形如DATA_CENTER.original_data["bldg-MC2.csv"]
	derived_data : [],

	//view之间通信需要利用的全局变量
	global_variable : {
		selected_attr_set:[],
		selected_linechart_set:[],
		selected_HVACzone_set:[],

		selected_proxzone_set:[],

		selected_room_set:[],
		selected_floor_set:[],
		selected_building_set:[],

		selected_timepoint_set:[],
		
		selected_card_set:[],
		selected_person_set:[],
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
		]
	},

	//set_global_variable设置全局变量并调用SUBJECT的notify
	//使用时形如DATA_CENTER.set_global_variable("selected_attr_set",[1,2,3])
	set_global_variable : function(variable_name,value){
		this.global_variable[variable_name] = value;
		SUBJECT.notifyObserver("set:"+variable_name, value);
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

			d3.csv(path+file_name[1],function(data1){
				d3.csv(path+file_name[2],function(data2){
					d3.csv(path+file_name[3],function(data3){
						d3.csv(path+file_name[4],function(data4){
							d3.csv(path+file_name[5],function(data5){
								d3.csv(path+file_name[6],function(data6){

									DATA_CENTER.original_data[file_name[0]] = HVAC_data;
									DATA_CENTER.original_data[file_name[1]] = data1;
									DATA_CENTER.original_data[file_name[2]] = data2;
									DATA_CENTER.original_data[file_name[3]] = data3;
									DATA_CENTER.original_data[file_name[4]] = data4;
									DATA_CENTER.original_data[file_name[5]] = data5;
									DATA_CENTER.original_data[file_name[6]] = data6;

									DATA_CENTER.cal_derive_data();



									callback_function();
								})
							})
						})
					})
				})
			})
		})

	}



}