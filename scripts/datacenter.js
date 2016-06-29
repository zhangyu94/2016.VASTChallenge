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

	//set_global_variable设置全局变量并调用SUBJECT的notify
	set_global_variable : function(variable_name,value){
		this.global_variable[variable_name] = value;
		SUBJECT.notifyObserver("set_"+variable_name, value);
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