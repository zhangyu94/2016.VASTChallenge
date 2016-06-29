var DATA_CENTER = {
	original_data : [],//访问时形如DATA_CENTER.original_data["bldg-MC2.csv"]
	derived_data : [],

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

//set...函数全都是设置全局变量并调用SUBJECT的notify
	set_selected_attr_set : function(attr_set){
		selected_attr_set = attr_set;
		SUBJECT.notifyObserver("set_selected_attr_set", attr_set);
	},
	set_selected_linechart_set : function(linechart_set){
		selected_linechart_set = linechart_set;
		SUBJECT.notifyObserver("set_selected_linechart_set", linechart_set);
	},
	set_selected_HVACzone_set : function(HVACzone_set){
		selected_HVACzone_set = HVACzone_set;
		SUBJECT.notifyObserver("set_selected_HVACzone_set", HVACzone_set);
	},

	set_selected_proxzone_set : function(proxzone_set){
		selected_proxzone_set = proxzone_set;
		SUBJECT.notifyObserver("set_selected_proxzone_set", proxzone_set);
	},

	
	set_selected_room_set : function(room_set){
		selected_room_set = room_set;
		SUBJECT.notifyObserver("set_selected_room_set", room_set);
	},
	set_selected_floor_set : function(floor_set){
		selected_floor_set = floor_set;
		SUBJECT.notifyObserver("set_selected_floor_set", floor_set);
	},
	set_selected_building_set : function(building_set){
		selected_building_set = building_set;
		SUBJECT.notifyObserver("set_selected_building_set", building_set);
	},

	set_selected_timepoint_set : function(timepoint_set){
		selected_timepoint_set = timepoint_set;
		SUBJECT.notifyObserver("set_selected_timepoint_set", timepoint_set);
	},

	set_selected_card_set : function(card_set){
		selected_card_set = card_set;
		SUBJECT.notifyObserver("set_selected_card_set", card_set);
	},
	set_selected_person_set : function(person_set){
		selected_person_set = person_set;
		SUBJECT.notifyObserver("set_selected_person_set", person_set);
	},
//


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

		d3.csv(path+file_name[0],function(data0){
			d3.csv(path+file_name[1],function(data1){
				d3.csv(path+file_name[2],function(data2){
					d3.csv(path+file_name[3],function(data3){
						d3.csv(path+file_name[4],function(data4){
							d3.csv(path+file_name[5],function(data5){
								d3.csv(path+file_name[6],function(data6){

									DATA_CENTER.original_data[file_name[0]] = data0;
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