var HVAC_STATISTIC_UTIL = {
	ABNORMAL_VALUE_THRESHOLD:3,//归一化以后的异常阈值
	normalize:function(attr_name,value)
	{
		var average = this.get_average(attr_name);
		var sigma = this.get_sigma(attr_name);
		if (sigma != 0)
			return (value-average)/sigma;
		else
			return value-average;
	},
	get_average:function(attr_name)
	{
		if (!(attr_name in HVAC_ATTR_OLD_AVERAGE_SIGMA))
		{
			console.warn("invalid attr_name",attr_name)
			return 0;
		}
		var entry = HVAC_ATTR_OLD_AVERAGE_SIGMA[attr_name];
		var average = entry.average;
		if (typeof(average)!="number")
			console.error("invalid statistics(average) of",attr_name);
		return average;
	},
	get_sigma:function(attr_name)
	{
		if (!(attr_name in HVAC_ATTR_OLD_AVERAGE_SIGMA))
		{
			console.warn("invalid attr_name",attr_name)
			return 0;
		}
		var entry = HVAC_ATTR_OLD_AVERAGE_SIGMA[attr_name];
		var sigma = entry.sigma;
		if (typeof(sigma)!="number")
			console.error("invalid statistics(sigma) of",attr_name);
		return sigma;
	},
};

var HVAC_ATTR_OLD_AVERAGE_SIGMA = {
"Drybulb Temperature": { "average": 25.20689484, "sigma": 2.064292485 },
"Water Heater Tank Temperature": { "average": 59.12476295, "sigma": 0.582665924 },
"Water Heater Gas Rate": { "average": 7725.178544, "sigma": 22591.08721 },
"Supply Side Inlet Mass Flow Rate": { "average": 0.3179, "sigma": 0 },
"Supply Side Inlet Temperature": { "average": 54.31815635, "sigma": 5.350255901 },
"Supply Side Outlet Temperature": { "average": 59.12476295, "sigma": 0.582665924 },
"HVAC Electric Demand Power": { "average": 52555.5205, "sigma": 32495.39885 },
"Total Electric Demand Power": { "average": 142274.8905, "sigma": 41000.39522 },
"Loop Temp Schedule": { "average": 60, "sigma": 0 },
"Water Heater Setpoint": { "average": 60, "sigma": 0 },
"DELI-FAN Power": { "average": 31.07012778, "sigma": 22.36619379 },
"Pump Power": { "average": 91.3744, "sigma": 0 },
"F_1_Z_1 Lights Power": { "average": 361.7732887, "sigma": 750.7411337 },
"F_1_Z_2 Lights Power": { "average": 8.03279494, "sigma": 147.0425233 },
"F_1_Z_3 Lights Power": { "average": 3798.6195, "sigma": 0 },
"F_1_Z_4 Lights Power": { "average": 171.5249671, "sigma": 283.4346653 },
"F_1_Z_5 Lights Power": { "average": 74.87754702, "sigma": 258.5828061 },
"F_1_Z_7 Lights Power": { "average": 631.9727085, "sigma": 748.998781 },
"F_1_Z_8A Lights Power": { "average": 1967.285, "sigma": 0 },
"F_1_Z_8B Lights Power": { "average": 2542.0762, "sigma": 0 },
"F_1_Z_1 Equipment Power": { "average": 471.2953417, "sigma": 420.4150349 },
"F_1_Z_2 Equipment Power": { "average": 382.3610652, "sigma": 82.34381325 },
"F_1_Z_3 Equipment Power": { "average": 2659.0336, "sigma": 0 },
"F_1_Z_4 Equipment Power": { "average": 185.6213816, "sigma": 158.7234125 },
"F_1_Z_5 Equipment Power": { "average": 177.4022226, "sigma": 144.8063586 },
"F_1_Z_7 Equipment Power": { "average": 566.6274301, "sigma": 419.4393332 },
"F_1_Z_8A Equipment Power": { "average": 1462.6655, "sigma": 0 },
"F_1_Z_8B Equipment Power": { "average": 1890.0194, "sigma": 0 },
"F_1_Z_1 Thermostat Temp": { "average": 24.30775283, "sigma": 1.516096419 },
"F_1_Z_1 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_1_Z_1 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_1_Z_2 Thermostat Temp": { "average": 24.12033864, "sigma": 1.119774859 },
"F_1_Z_2 Thermostat Heating Setpoint": { "average": 20.27244048, "sigma": 4.076048767 },
"F_1_Z_2 Thermostat Cooling Setpoint": { "average": 24.97732143, "sigma": 2.988373397 },
"F_1_Z_3 Thermostat Temp": { "average": 25.37009018, "sigma": 1.503009925 },
"F_1_Z_3 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_1_Z_3 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_1_Z_4 Thermostat Temp": { "average": 24.02654683, "sigma": 1.600577976 },
"F_1_Z_4 Thermostat Heating Setpoint": { "average": 19.64732143, "sigma": 4.270369345 },
"F_1_Z_4 Thermostat Cooling Setpoint": { "average": 24.20892857, "sigma": 3.627833039 },
"F_1_Z_5 Thermostat Temp": { "average": 24.30037093, "sigma": 0.965938265 },
"F_1_Z_5 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_1_Z_5 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_1_Z_7 Thermostat Temp": { "average": 24.13074618, "sigma": 1.405347975 },
"F_1_Z_7 Thermostat Heating Setpoint": { "average": 19.64732143, "sigma": 4.270369345 },
"F_1_Z_7 Thermostat Cooling Setpoint": { "average": 24.20892857, "sigma": 3.627833039 },
"F_1_Z_8A Thermostat Temp": { "average": 25.43260578, "sigma": 0.945339805 },
"F_1_Z_8A Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_1_Z_8A Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_1_Z_8B Thermostat Temp": { "average": 25.11197215, "sigma": 0.976046508 },
"F_1_Z_8B Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_1_Z_8B Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_1_VAV Availability Manager Night Cycle Control Status": { "average": 0.781746032, "sigma": 0.976013046 },
"F_1_VAV_SYS SUPPLY FAN:Fan Power": { "average": 1119.293734, "sigma": 844.5969123 },
"F_1_BATH_EXHAUST:Fan Power": { "average": 42.30029444, "sigma": 14.3492667 },
"F_1_Z_1 VAV REHEAT Damper Position": { "average": 0.525375744, "sigma": 0.360126093 },
"F_1_Z_2 VAV REHEAT Damper Position": { "average": 0.396918973, "sigma": 0.333289551 },
"F_1_Z_3 VAV REHEAT Damper Position": { "average": 0.698696751, "sigma": 0.362078943 },
"F_1_Z_4 VAV REHEAT Damper Position": { "average": 0.571714807, "sigma": 0.401972706 },
"F_1_Z_5 VAV REHEAT Damper Position": { "average": 0.41889375, "sigma": 0.346686624 },
"F_1_Z_7 VAV REHEAT Damper Position": { "average": 0.504446825, "sigma": 0.368698429 },
"F_1_Z_8A VAV REHEAT Damper Position": { "average": 0.679674132, "sigma": 0.398565606 },
"F_1_Z_8B VAV REHEAT Damper Position": { "average": 0.667536706, "sigma": 0.39333011 },
"F_1_Z_1 REHEAT COIL Power": { "average": 564.1803239, "sigma": 1268.133692 },
"F_1_Z_2 REHEAT COIL Power": { "average": 540.85828, "sigma": 1001.073263 },
"F_1_Z_3 REHEAT COIL Power": { "average": 70.09990975, "sigma": 282.8005214 },
"F_1_Z_4 REHEAT COIL Power": { "average": 163.6105029, "sigma": 355.8195068 },
"F_1_Z_5 REHEAT COIL Power": { "average": 153.9617966, "sigma": 287.9856951 },
"F_1_Z_7 REHEAT COIL Power": { "average": 510.2998931, "sigma": 1084.67804 },
"F_1_Z_8A REHEAT COIL Power": { "average": 13.45045069, "sigma": 211.751835 },
"F_1_Z_8B REHEAT COIL Power": { "average": 24.33938956, "sigma": 291.9921239 },
"F_1_VAV_SYS HEATING COIL Power": { "average": 0, "sigma": 0 },
"F_1_VAV_SYS Outdoor Air Flow Fraction": { "average": 0.508715005, "sigma": 0.339822289 },
"F_1_VAV_SYS Outdoor Air Mass Flow Rate": { "average": 0.473697693, "sigma": 0.213791101 },
"F_1_VAV_SYS COOLING COIL Power": { "average": 5619.335691, "sigma": 3702.860578 },
"F_1_VAV_SYS AIR LOOP INLET Temperature": { "average": 24.46859998, "sigma": 1.31185245 },
"F_1_VAV_SYS AIR LOOP INLET Mass Flow Rate": { "average": 0.675099752, "sigma": 0.566367362 },
"F_1_VAV_SYS SUPPLY FAN OUTLET Temperature": { "average": 13.53027557, "sigma": 2.688926701 },
"F_1_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate": { "average": 1.148805258, "sigma": 0.652036837 },
"F_1_Z_1 RETURN OUTLET CO2 Concentration": { "average": 494.1606466, "sigma": 281.8260551 },
"F_1_Z_1 SUPPLY INLET Temperature": { "average": 15.05652954, "sigma": 4.084977774 },
"F_1_Z_1 SUPPLY INLET Mass Flow Rate": { "average": 0.212079117, "sigma": 0.145225056 },
"F_1_Z_2 RETURN OUTLET CO2 Concentration": { "average": 818.1211976, "sigma": 218.0075429 },
"F_1_Z_2 SUPPLY INLET Temperature": { "average": 17.83178388, "sigma": 8.298144583 },
"F_1_Z_2 SUPPLY INLET Mass Flow Rate": { "average": 0.090608333, "sigma": 0.074194218 },
"F_1_Z_3 RETURN OUTLET CO2 Concentration": { "average": 961.2473384, "sigma": 418.1458195 },
"F_1_Z_3 SUPPLY INLET Temperature": { "average": 13.69258023, "sigma": 2.763407661 },
"F_1_Z_3 SUPPLY INLET Mass Flow Rate": { "average": 0.306805828, "sigma": 0.158883062 },
"F_1_Z_4 RETURN OUTLET CO2 Concentration": { "average": 886.6675488, "sigma": 429.5245462 },
"F_1_Z_4 SUPPLY INLET Temperature": { "average": 15.6973249, "sigma": 5.642225149 },
"F_1_Z_4 SUPPLY INLET Mass Flow Rate": { "average": 0.059207143, "sigma": 0.041474644 },
"F_1_Z_5 RETURN OUTLET CO2 Concentration": { "average": 1093.046986, "sigma": 515.1756246 },
"F_1_Z_5 SUPPLY INLET Temperature": { "average": 17.25432403, "sigma": 7.978952496 },
"F_1_Z_5 SUPPLY INLET Mass Flow Rate": { "average": 0.028922247, "sigma": 0.023154642 },
"F_1_Z_7 RETURN OUTLET CO2 Concentration": { "average": 947.798344, "sigma": 408.5161519 },
"F_1_Z_7 SUPPLY INLET Temperature": { "average": 15.67748953, "sigma": 4.941852044 },
"F_1_Z_7 SUPPLY INLET Mass Flow Rate": { "average": 0.157272272, "sigma": 0.114820233 },
"F_1_Z_8A RETURN OUTLET CO2 Concentration": { "average": 260.9739557, "sigma": 134.017472 },
"F_1_Z_8A SUPPLY INLET Temperature": { "average": 13.67552386, "sigma": 3.191360736 },
"F_1_Z_8A SUPPLY INLET Mass Flow Rate": { "average": 0.129502059, "sigma": 0.075684919 },
"F_1_Z_8B RETURN OUTLET CO2 Concentration": { "average": 791.3079353, "sigma": 166.0792222 },
"F_1_Z_8B SUPPLY INLET Temperature": { "average": 13.74912522, "sigma": 3.323577515 },
"F_1_Z_8B SUPPLY INLET Mass Flow Rate": { "average": 0.164374554, "sigma": 0.096492895 },
"F_1_Z_1 Mechanical Ventilation Mass Flow Rate": { "average": 0.087844692, "sigma": 0.04841494 },
"F_2_Z_1 Lights Power": { "average": 56.01138199, "sigma": 121.5874983 },
"F_2_Z_10 Lights Power": { "average": 380.3617668, "sigma": 488.5176431 },
"F_2_Z_11 Lights Power": { "average": 62.47729911, "sigma": 116.564346 },
"F_2_Z_12A Lights Power": { "average": 719.7384, "sigma": 0 },
"F_2_Z_12B Lights Power": { "average": 1367.503, "sigma": 0 },
"F_2_Z_12C Lights Power": { "average": 1302.5266, "sigma": 0 },
"F_2_Z_14 Lights Power": { "average": 141.8353535, "sigma": 342.28428 },
"F_2_Z_15 Lights Power": { "average": 60.53356091, "sigma": 115.2485271 },
"F_2_Z_16 Lights Power": { "average": 144.9552513, "sigma": 345.3740896 },
"F_2_Z_2 Lights Power": { "average": 1017.130372, "sigma": 1212.893016 },
"F_2_Z_3 Lights Power": { "average": 56.96341682, "sigma": 122.3950697 },
"F_2_Z_4 Lights Power": { "average": 416.8128234, "sigma": 571.2632559 },
"F_2_Z_5 Lights Power": { "average": 39.43010885, "sigma": 105.1715691 },
"F_2_Z_6 Lights Power": { "average": 854.0229787, "sigma": 1172.405153 },
"F_2_Z_7 Lights Power": { "average": 56.09071823, "sigma": 121.6552853 },
"F_2_Z_8 Lights Power": { "average": 337.3774031, "sigma": 539.401956 },
"F_2_Z_9 Lights Power": { "average": 516.9113414, "sigma": 773.9379061 },
"F_2_Z_1 Equipment Power": { "average": 76.15007882, "sigma": 68.08900971 },
"F_2_Z_10 Equipment Power": { "average": 354.0713166, "sigma": 273.5699151 },
"F_2_Z_11 Equipment Power": { "average": 74.17307679, "sigma": 65.27601377 },
"F_2_Z_12A Equipment Power": { "average": 535.1215, "sigma": 0 },
"F_2_Z_12B Equipment Power": { "average": 1016.7309, "sigma": 0 },
"F_2_Z_12C Equipment Power": { "average": 968.4213, "sigma": 0 },
"F_2_Z_14 Equipment Power": { "average": 214.8985909, "sigma": 191.6791798 },
"F_2_Z_15 Equipment Power": { "average": 73.08458373, "sigma": 64.53915541 },
"F_2_Z_16 Equipment Power": { "average": 216.6457335, "sigma": 193.409473 },
"F_2_Z_2 Equipment Power": { "average": 914.42769, "sigma": 679.2200672 },
"F_2_Z_3 Equipment Power": { "average": 76.6832184, "sigma": 68.54124976 },
"F_2_Z_4 Equipment Power": { "average": 401.3541478, "sigma": 319.9073776 },
"F_2_Z_5 Equipment Power": { "average": 66.86456441, "sigma": 58.8960879 },
"F_2_Z_6 Equipment Power": { "average": 823.0875528, "sigma": 656.5468645 },
"F_2_Z_7 Equipment Power": { "average": 76.19450712, "sigma": 68.12697043 },
"F_2_Z_8 Equipment Power": { "average": 356.8703188, "sigma": 302.0650522 },
"F_2_Z_9 Equipment Power": { "average": 524.0251462, "sigma": 433.40522 },
"F_2_Z_1 Thermostat Temp": { "average": 23.97374224, "sigma": 1.476364771 },
"F_2_Z_1 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_1 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_10 Thermostat Temp": { "average": 24.70439635, "sigma": 1.458441499 },
"F_2_Z_10 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_10 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_11 Thermostat Temp": { "average": 24.58582951, "sigma": 1.216226781 },
"F_2_Z_11 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_11 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_12A Thermostat Temp": { "average": 25.1252412, "sigma": 1.392693443 },
"F_2_Z_12A Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_12A Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_12B Thermostat Temp": { "average": 25.42803237, "sigma": 1.530258811 },
"F_2_Z_12B Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_12B Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_12C Thermostat Temp": { "average": 25.20475179, "sigma": 1.448178846 },
"F_2_Z_12C Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_12C Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_14 Thermostat Temp": { "average": 24.30361808, "sigma": 1.44431185 },
"F_2_Z_14 Thermostat Heating Setpoint": { "average": 20.20232143, "sigma": 3.959683497 },
"F_2_Z_14 Thermostat Cooling Setpoint": { "average": 24.86958333, "sigma": 2.877255753 },
"F_2_Z_15 Thermostat Temp": { "average": 24.63725662, "sigma": 1.202319033 },
"F_2_Z_15 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_15 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_16 Thermostat Temp": { "average": 24.66316644, "sigma": 1.243230526 },
"F_2_Z_16 Thermostat Heating Setpoint": { "average": 20.07708333, "sigma": 3.896998269 },
"F_2_Z_16 Thermostat Cooling Setpoint": { "average": 24.78232143, "sigma": 2.858374209 },
"F_2_Z_2 Thermostat Temp": { "average": 24.67185253, "sigma": 1.779021882 },
"F_2_Z_2 Thermostat Heating Setpoint": { "average": 20.30696429, "sigma": 4.071933269 },
"F_2_Z_2 Thermostat Cooling Setpoint": { "average": 25.01303571, "sigma": 2.965270424 },
"F_2_Z_3 Thermostat Temp": { "average": 24.14361739, "sigma": 1.593927692 },
"F_2_Z_3 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_3 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_4 Thermostat Temp": { "average": 24.41751649, "sigma": 1.741757705 },
"F_2_Z_4 Thermostat Heating Setpoint": { "average": 20.30696429, "sigma": 4.071933269 },
"F_2_Z_4 Thermostat Cooling Setpoint": { "average": 25.01303571, "sigma": 2.965270424 },
"F_2_Z_5 Thermostat Temp": { "average": 24.30167187, "sigma": 1.319897501 },
"F_2_Z_5 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_5 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_6 Thermostat Temp": { "average": 24.54230652, "sigma": 1.717085132 },
"F_2_Z_6 Thermostat Heating Setpoint": { "average": 20.37446429, "sigma": 4.1294656 },
"F_2_Z_6 Thermostat Cooling Setpoint": { "average": 25.08089286, "sigma": 3.006257989 },
"F_2_Z_7 Thermostat Temp": { "average": 23.78334752, "sigma": 1.54181066 },
"F_2_Z_7 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_7 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_Z_8 Thermostat Temp": { "average": 24.20933943, "sigma": 2.132993913 },
"F_2_Z_8 Thermostat Heating Setpoint": { "average": 20.30696429, "sigma": 4.071933269 },
"F_2_Z_8 Thermostat Cooling Setpoint": { "average": 25.01303571, "sigma": 2.965270424 },
"F_2_Z_9 Thermostat Temp": { "average": 24.57690689, "sigma": 1.376771957 },
"F_2_Z_9 Thermostat Heating Setpoint": { "average": 20.10446429, "sigma": 3.88721175 },
"F_2_Z_9 Thermostat Cooling Setpoint": { "average": 24.80946429, "sigma": 2.829007716 },
"F_2_VAV_SYS SUPPLY FAN:Fan Power": { "average": 2153.325473, "sigma": 1784.578116 },
"F_2_BATH_EXHAUST:Fan Power": { "average": 43.35312257, "sigma": 12.85968524 },
"F_2_Z_1 VAV REHEAT Damper Position": { "average": 0.480021801, "sigma": 0.340237796 },
"F_2_Z_2 VAV REHEAT Damper Position": { "average": 0.570758284, "sigma": 0.382085824 },
"F_2_Z_3 VAV REHEAT Damper Position": { "average": 0.516960317, "sigma": 0.354016039 },
"F_2_Z_4 VAV REHEAT Damper Position": { "average": 0.503727108, "sigma": 0.345823366 },
"F_2_Z_5 VAV REHEAT Damper Position": { "average": 0.555608557, "sigma": 0.348562418 },
"F_2_Z_6 VAV REHEAT Damper Position": { "average": 0.517087897, "sigma": 0.366876475 },
"F_2_Z_7 VAV REHEAT Damper Position": { "average": 0.446807887, "sigma": 0.332429202 },
"F_2_Z_8 VAV REHEAT Damper Position": { "average": 0.435090154, "sigma": 0.34743069 },
"F_2_Z_9 VAV REHEAT Damper Position": { "average": 0.557426314, "sigma": 0.374521835 },
"F_2_Z_10 VAV REHEAT Damper Position": { "average": 0.580900471, "sigma": 0.378442973 },
"F_2_Z_11 VAV REHEAT Damper Position": { "average": 0.538827654, "sigma": 0.37640913 },
"F_2_Z_12A VAV REHEAT Damper Position": { "average": 0.670077654, "sigma": 0.378243808 },
"F_2_Z_12B VAV REHEAT Damper Position": { "average": 0.710714211, "sigma": 0.364123394 },
"F_2_Z_12C VAV REHEAT Damper Position": { "average": 0.689385144, "sigma": 0.369390477 },
"F_2_Z_14 VAV REHEAT Damper Position": { "average": 0.425960342, "sigma": 0.355183092 },
"F_2_Z_15 VAV REHEAT Damper Position": { "average": 0.545265303, "sigma": 0.37394658 },
"F_2_Z_16 VAV REHEAT Damper Position": { "average": 0.491804836, "sigma": 0.354680766 },
"F_2_Z_1 REHEAT COIL Power": { "average": 171.1204698, "sigma": 373.9459917 },
"F_2_Z_2 REHEAT COIL Power": { "average": 686.0906671, "sigma": 1588.875677 },
"F_2_Z_3 REHEAT COIL Power": { "average": 144.5253686, "sigma": 332.5643907 },
"F_2_Z_4 REHEAT COIL Power": { "average": 532.0879493, "sigma": 1218.78562 },
"F_2_Z_5 REHEAT COIL Power": { "average": 80.54496925, "sigma": 204.6804493 },
"F_2_Z_6 REHEAT COIL Power": { "average": 783.0299712, "sigma": 1746.470264 },
"F_2_Z_7 REHEAT COIL Power": { "average": 221.1034132, "sigma": 470.0700635 },
"F_2_Z_8 REHEAT COIL Power": { "average": 769.1013456, "sigma": 1636.909362 },
"F_2_Z_9 REHEAT COIL Power": { "average": 427.7600693, "sigma": 976.2839407 },
"F_2_Z_10 REHEAT COIL Power": { "average": 265.4029436, "sigma": 618.8486897 },
"F_2_Z_11 REHEAT COIL Power": { "average": 80.46397899, "sigma": 180.2070708 },
"F_2_Z_12A REHEAT COIL Power": { "average": 86.29194464, "sigma": 292.107149 },
"F_2_Z_12B REHEAT COIL Power": { "average": 87.39817227, "sigma": 291.7690278 },
"F_2_Z_12C REHEAT COIL Power": { "average": 83.2647182, "sigma": 318.5935371 },
"F_2_Z_14 REHEAT COIL Power": { "average": 507.205662, "sigma": 1033.801169 },
"F_2_Z_15 REHEAT COIL Power": { "average": 72.09859048, "sigma": 162.2030111 },
"F_2_Z_16 REHEAT COIL Power": { "average": 205.7604529, "sigma": 437.016539 },
"F_2_VAV_SYS HEATING COIL Power": { "average": 0, "sigma": 0 },
"F_2_VAV_SYS Outdoor Air Flow Fraction": { "average": 0.196777877, "sigma": 0.141517074 },
"F_2_VAV_SYS Outdoor Air Mass Flow Rate": { "average": 0.313153323, "sigma": 0.092889576 },
"F_2_VAV_SYS COOLING COIL Power": { "average": 7752.188774, "sigma": 4807.440582 },
"F_2_VAV_SYS AIR LOOP INLET Temperature": { "average": 24.47214241, "sigma": 1.39514226 },
"F_2_VAV_SYS AIR LOOP INLET Mass Flow Rate": { "average": 1.942016195, "sigma": 1.339926835 },
"F_2_VAV_SYS SUPPLY FAN OUTLET Temperature": { "average": 13.24412495, "sigma": 2.075246489 },
"F_2_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate": { "average": 2.255190203, "sigma": 1.361260328 },
"F_2_Z_1 RETURN OUTLET CO2 Concentration": { "average": 918.1234, "sigma": 415.6203823 },
"F_2_Z_1 SUPPLY INLET Temperature": { "average": 15.04923792, "sigma": 4.182408903 },
"F_2_Z_1 SUPPLY INLET Mass Flow Rate": { "average": 0.054884549, "sigma": 0.038871333 },
"F_2_Z_2 RETURN OUTLET CO2 Concentration": { "average": 991.3332208, "sigma": 504.6880073 },
"F_2_Z_2 SUPPLY INLET Temperature": { "average": 14.60098876, "sigma": 3.648581514 },
"F_2_Z_2 SUPPLY INLET Mass Flow Rate": { "average": 0.301838864, "sigma": 0.201779323 },
"F_2_Z_3 RETURN OUTLET CO2 Concentration": { "average": 916.1160733, "sigma": 413.8429295 },
"F_2_Z_3 SUPPLY INLET Temperature": { "average": 14.76461902, "sigma": 3.812285799 },
"F_2_Z_3 SUPPLY INLET Mass Flow Rate": { "average": 0.056366592, "sigma": 0.038579227 },
"F_2_Z_4 RETURN OUTLET CO2 Concentration": { "average": 971.4121679, "sigma": 453.7068594 },
"F_2_Z_4 SUPPLY INLET Temperature": { "average": 14.68199578, "sigma": 3.681162966 },
"F_2_Z_4 SUPPLY INLET Mass Flow Rate": { "average": 0.197381548, "sigma": 0.135453657 },
"F_2_Z_5 RETURN OUTLET CO2 Concentration": { "average": 883.4101366, "sigma": 384.4398298 },
"F_2_Z_5 SUPPLY INLET Temperature": { "average": 14.42635223, "sigma": 3.492215153 },
"F_2_Z_5 SUPPLY INLET Mass Flow Rate": { "average": 0.041236558, "sigma": 0.025871894 },
"F_2_Z_6 RETURN OUTLET CO2 Concentration": { "average": 969.6730665, "sigma": 455.7268426 },
"F_2_Z_6 SUPPLY INLET Temperature": { "average": 14.88049945, "sigma": 3.971533285 },
"F_2_Z_6 SUPPLY INLET Mass Flow Rate": { "average": 0.280805729, "sigma": 0.198790926 },
"F_2_Z_7 RETURN OUTLET CO2 Concentration": { "average": 928.7591652, "sigma": 422.0053067 },
"F_2_Z_7 SUPPLY INLET Temperature": { "average": 15.28569506, "sigma": 4.427533216 },
"F_2_Z_7 SUPPLY INLET Mass Flow Rate": { "average": 0.060644544, "sigma": 0.045040545 },
"F_2_Z_8 RETURN OUTLET CO2 Concentration": { "average": 980.807604, "sigma": 446.7735888 },
"F_2_Z_8 SUPPLY INLET Temperature": { "average": 15.25166565, "sigma": 4.349321235 },
"F_2_Z_8 SUPPLY INLET Mass Flow Rate": { "average": 0.203104985, "sigma": 0.161986583 },
"F_2_Z_9 RETURN OUTLET CO2 Concentration": { "average": 1077.998994, "sigma": 536.8469579 },
"F_2_Z_9 SUPPLY INLET Temperature": { "average": 14.70551687, "sigma": 3.787461569 },
"F_2_Z_9 SUPPLY INLET Mass Flow Rate": { "average": 0.16671441, "sigma": 0.111775159 },
"F_2_Z_10 RETURN OUTLET CO2 Concentration": { "average": 1147.992689, "sigma": 611.1025119 },
"F_2_Z_10 SUPPLY INLET Temperature": { "average": 14.67148455, "sigma": 3.782664525 },
"F_2_Z_10 SUPPLY INLET Mass Flow Rate": { "average": 0.111384325, "sigma": 0.072396156 },
"F_2_Z_11 RETURN OUTLET CO2 Concentration": { "average": 1152.085212, "sigma": 654.5986038 },
"F_2_Z_11 SUPPLY INLET Temperature": { "average": 14.77838269, "sigma": 3.883691414 },
"F_2_Z_11 SUPPLY INLET Mass Flow Rate": { "average": 0.029622793, "sigma": 0.020605325 },
"F_2_Z_12A RETURN OUTLET CO2 Concentration": { "average": 970.1176853, "sigma": 393.6245969 },
"F_2_Z_12A SUPPLY INLET Temperature": { "average": 13.87330866, "sigma": 3.299710775 },
"F_2_Z_12A SUPPLY INLET Mass Flow Rate": { "average": 0.12405687, "sigma": 0.069564121 },
"F_2_Z_12B RETURN OUTLET CO2 Concentration": { "average": 572.8796535, "sigma": 332.6597472 },
"F_2_Z_12B SUPPLY INLET Temperature": { "average": 13.56569437, "sigma": 2.388386251 },
"F_2_Z_12B SUPPLY INLET Mass Flow Rate": { "average": 0.215862227, "sigma": 0.110443551 },
"F_2_Z_12C RETURN OUTLET CO2 Concentration": { "average": 961.4167937, "sigma": 377.0069179 },
"F_2_Z_12C SUPPLY INLET Temperature": { "average": 13.66793393, "sigma": 2.889463336 },
"F_2_Z_12C SUPPLY INLET Mass Flow Rate": { "average": 0.192724603, "sigma": 0.102946134 },
"F_2_Z_14 RETURN OUTLET CO2 Concentration": { "average": 1162.525253, "sigma": 681.2230338 },
"F_2_Z_14 SUPPLY INLET Temperature": { "average": 15.57974211, "sigma": 4.945209647 },
"F_2_Z_14 SUPPLY INLET Mass Flow Rate": { "average": 0.120989534, "sigma": 0.100683246 },
"F_2_Z_15 RETURN OUTLET CO2 Concentration": { "average": 1116.178254, "sigma": 597.9860771 },
"F_2_Z_15 SUPPLY INLET Temperature": { "average": 14.71913261, "sigma": 3.81479227 },
"F_2_Z_15 SUPPLY INLET Mass Flow Rate": { "average": 0.027882168, "sigma": 0.019061261 },
"F_2_Z_16 RETURN OUTLET CO2 Concentration": { "average": 993.1010871, "sigma": 416.9884314 },
"F_2_Z_16 SUPPLY INLET Temperature": { "average": 15.30368338, "sigma": 4.826815703 },
"F_2_Z_16 SUPPLY INLET Mass Flow Rate": { "average": 0.069666146, "sigma": 0.050079842 },
"F_3_Z_1 Lights Power": { "average": 99.13063611, "sigma": 194.2881777 },
"F_3_Z_10 Lights Power": { "average": 189.6136316, "sigma": 292.1925469 },
"F_3_Z_11A Lights Power": { "average": 807.7065, "sigma": 0 },
"F_3_Z_11B Lights Power": { "average": 2079.2444, "sigma": 0 },
"F_3_Z_11C Lights Power": { "average": 1192.5666, "sigma": 0 },
"F_3_Z_2 Lights Power": { "average": 557.3688572, "sigma": 807.6417542 },
"F_3_Z_3 Lights Power": { "average": 193.8045793, "sigma": 330.045216 },
"F_3_Z_5 Lights Power": { "average": 20.63932386, "sigma": 139.8230088 },
"F_3_Z_6 Lights Power": { "average": 590.4203616, "sigma": 896.484803 },
"F_3_Z_7 Lights Power": { "average": 81.71632217, "sigma": 139.5241567 },
"F_3_Z_8 Lights Power": { "average": 382.8965766, "sigma": 559.2644925 },
"F_3_Z_9 Lights Power": { "average": 85.96874821, "sigma": 146.593679 },
"F_3_Z_9 Equipment Power": { "average": 30240.013, "sigma": 0 },
"F_3_Z_1 Equipment Power": { "average": 122.6887488, "sigma": 108.801365 },
"F_3_Z_10 Equipment Power": { "average": 195.7510337, "sigma": 163.6278263 },
"F_3_Z_11A Equipment Power": { "average": 600.5253, "sigma": 0 },
"F_3_Z_11B Equipment Power": { "average": 1545.9066, "sigma": 0 },
"F_3_Z_11C Equipment Power": { "average": 886.6666, "sigma": 0 },
"F_3_Z_2 Equipment Power": { "average": 553.958682, "sigma": 452.2794142 },
"F_3_Z_3 Equipment Power": { "average": 214.3320582, "sigma": 184.8253105 },
"F_3_Z_5 Equipment Power": { "average": 147.0288203, "sigma": 78.30087798 },
"F_3_Z_6 Equipment Power": { "average": 603.8161013, "sigma": 502.0314878 },
"F_3_Z_7 Equipment Power": { "average": 90.54484757, "sigma": 78.13353996 },
"F_3_Z_8 Equipment Power": { "average": 382.3610522, "sigma": 313.188071 },
"F_3_Z_1 Thermostat Temp": { "average": 27.43935739, "sigma": 4.714247969 },
"F_3_Z_1 Thermostat Heating Setpoint": { "average": 22.90998512, "sigma": 11.14169993 },
"F_3_Z_1 Thermostat Cooling Setpoint": { "average": 26.39937996, "sigma": 10.97680792 },
"F_3_Z_10 Thermostat Temp": { "average": 24.60110722, "sigma": 1.604740071 },
"F_3_Z_10 Thermostat Heating Setpoint": { "average": 21.028125, "sigma": 4.042207686 },
"F_3_Z_10 Thermostat Cooling Setpoint": { "average": 24.12989583, "sigma": 3.222651347 },
"F_3_Z_11A Thermostat Temp": { "average": 24.73230082, "sigma": 1.512986584 },
"F_3_Z_11A Thermostat Heating Setpoint": { "average": 21.028125, "sigma": 4.042207686 },
"F_3_Z_11A Thermostat Cooling Setpoint": { "average": 24.12989583, "sigma": 3.222651347 },
"F_3_Z_11B Thermostat Temp": { "average": 24.96755627, "sigma": 1.702426552 },
"F_3_Z_11B Thermostat Heating Setpoint": { "average": 21.028125, "sigma": 4.042207686 },
"F_3_Z_11B Thermostat Cooling Setpoint": { "average": 24.12989583, "sigma": 3.222651347 },
"F_3_Z_11C Thermostat Temp": { "average": 24.80670863, "sigma": 1.645442828 },
"F_3_Z_11C Thermostat Heating Setpoint": { "average": 20.903125, "sigma": 4.078102686 },
"F_3_Z_11C Thermostat Cooling Setpoint": { "average": 24.1700744, "sigma": 3.23758172 },
"F_3_Z_2 Thermostat Temp": { "average": 24.25650506, "sigma": 1.580202265 },
"F_3_Z_2 Thermostat Heating Setpoint": { "average": 21.028125, "sigma": 4.042207686 },
"F_3_Z_2 Thermostat Cooling Setpoint": { "average": 24.12989583, "sigma": 3.222651347 },
"F_3_Z_3 Thermostat Temp": { "average": 24.48846796, "sigma": 1.453044153 },
"F_3_Z_3 Thermostat Heating Setpoint": { "average": 21.028125, "sigma": 4.042207686 },
"F_3_Z_3 Thermostat Cooling Setpoint": { "average": 24.12989583, "sigma": 3.222651347 },
"F_3_Z_5 Thermostat Temp": { "average": 24.71903043, "sigma": 1.239315518 },
"F_3_Z_5 Thermostat Heating Setpoint": { "average": 21.095625, "sigma": 4.088264634 },
"F_3_Z_5 Thermostat Cooling Setpoint": { "average": 24.19775298, "sigma": 3.278738255 },
"F_3_Z_6 Thermostat Temp": { "average": 24.22355099, "sigma": 1.655438999 },
"F_3_Z_6 Thermostat Heating Setpoint": { "average": 21.095625, "sigma": 4.088264634 },
"F_3_Z_6 Thermostat Cooling Setpoint": { "average": 24.19775298, "sigma": 3.278738255 },
"F_3_Z_7 Thermostat Temp": { "average": 23.74114883, "sigma": 1.720462116 },
"F_3_Z_7 Thermostat Heating Setpoint": { "average": 21.028125, "sigma": 4.042207686 },
"F_3_Z_7 Thermostat Cooling Setpoint": { "average": 24.12989583, "sigma": 3.222651347 },
"F_3_Z_8 Thermostat Temp": { "average": 24.26565608, "sigma": 2.263242195 },
"F_3_Z_8 Thermostat Heating Setpoint": { "average": 21.77263393, "sigma": 4.224116348 },
"F_3_Z_8 Thermostat Cooling Setpoint": { "average": 24.87516369, "sigma": 3.419606248 },
"F_3_Z_9 Thermostat Temp": { "average": 20.99966091, "sigma": 3.07140738 },
"F_3_Z_9 Thermostat Heating Setpoint": { "average": 18.36183036, "sigma": 3.042981591 },
"F_3_Z_9 Thermostat Cooling Setpoint": { "average": 21.36084821, "sigma": 3.05723359 },
"F_3_VAV Availability Manager Night Cycle Control Status": { "average": 0, "sigma": 0 },
"F_3_VAV_SYS SUPPLY FAN:Fan Power": { "average": 5836.293391, "sigma": 2382.783377 },
"F_3_BATH_EXHAUST:Fan Power": { "average": 23.86410417, "sigma": 23.58460364 },
"F_3_Z_1 VAV REHEAT Damper Position": { "average": 0.655516791, "sigma": 0.383964208 },
"F_3_Z_2 VAV REHEAT Damper Position": { "average": 0.73498502, "sigma": 0.35132683 },
"F_3_Z_3 VAV REHEAT Damper Position": { "average": 0.719101612, "sigma": 0.346819293 },
"F_3_Z_5 VAV REHEAT Damper Position": { "average": 0.743334028, "sigma": 0.328255689 },
"F_3_Z_6 VAV REHEAT Damper Position": { "average": 0.696349058, "sigma": 0.354173949 },
"F_3_Z_7 VAV REHEAT Damper Position": { "average": 0.62988311, "sigma": 0.357800481 },
"F_3_Z_8 VAV REHEAT Damper Position": { "average": 0.605345263, "sigma": 0.357679749 },
"F_3_Z_10 VAV REHEAT Damper Position": { "average": 0.74724442, "sigma": 0.336931122 },
"F_3_Z_11A VAV REHEAT Damper Position": { "average": 0.792267237, "sigma": 0.312745488 },
"F_3_Z_11B VAV REHEAT Damper Position": { "average": 0.850853844, "sigma": 0.269576662 },
"F_3_Z_11C VAV REHEAT Damper Position": { "average": 0.823184747, "sigma": 0.285732805 },
"F_3_Z_9 VAV REHEAT Damper Position": { "average": 0.851282118, "sigma": 0.191022005 },
"F_3_Z_1 REHEAT COIL Power": { "average": 1872.229319, "sigma": 1889.582743 },
"F_3_Z_2 REHEAT COIL Power": { "average": 1042.332094, "sigma": 1475.564166 },
"F_3_Z_3 REHEAT COIL Power": { "average": 380.347601, "sigma": 519.6281187 },
"F_3_Z_5 REHEAT COIL Power": { "average": 121.8203009, "sigma": 192.281067 },
"F_3_Z_6 REHEAT COIL Power": { "average": 1360.134877, "sigma": 1871.660533 },
"F_3_Z_7 REHEAT COIL Power": { "average": 477.6315092, "sigma": 645.3297508 },
"F_3_Z_8 REHEAT COIL Power": { "average": 1694.379812, "sigma": 2180.469786 },
"F_3_Z_10 REHEAT COIL Power": { "average": 337.6281587, "sigma": 467.1478522 },
"F_3_Z_11A REHEAT COIL Power": { "average": 217.2967311, "sigma": 365.5392739 },
"F_3_Z_11B REHEAT COIL Power": { "average": 287.7903313, "sigma": 444.2068057 },
"F_3_Z_11C REHEAT COIL Power": { "average": 234.8961798, "sigma": 430.6469264 },
"F_3_Z_12 REHEAT COIL Power": { "average": 0, "sigma": 0 },
"F_3_VAV_SYS HEATING COIL Power": { "average": 0, "sigma": 0 },
"F_3_VAV_SYS Outdoor Air Flow Fraction": { "average": 0.038127108, "sigma": 0.046772478 },
"F_3_VAV_SYS Outdoor Air Mass Flow Rate": { "average": 0.172377976, "sigma": 0.170359055 },
"F_3_VAV_SYS COOLING COIL Power": { "average": 14572.58332, "sigma": 4568.528393 },
"F_3_VAV_SYS AIR LOOP INLET Temperature": { "average": 22.38715789, "sigma": 2.329395089 },
"F_3_VAV_SYS AIR LOOP INLET Mass Flow Rate": { "average": 5.5118531, "sigma": 1.602086842 },
"F_3_VAV_SYS SUPPLY FAN OUTLET Temperature": { "average": 12.88945243, "sigma": 1.274249866 },
"F_3_VAV_SYS SUPPLY FAN OUTLET Mass Flow Rate": { "average": 5.684246974, "sigma": 1.551686259 },
"F_3_Z_1 RETURN OUTLET CO2 Concentration": { "average": 589.9073134, "sigma": 229.6900431 },
"F_3_Z_1 SUPPLY INLET Temperature": { "average": 26.3923315, "sigma": 12.24797605 },
"F_3_Z_1 SUPPLY INLET Mass Flow Rate": { "average": 0.131659549, "sigma": 0.051442203 },
"F_3_Z_2 RETURN OUTLET CO2 Concentration": { "average": 604.8434973, "sigma": 252.7118802 },
"F_3_Z_2 SUPPLY INLET Temperature": { "average": 15.50057063, "sigma": 3.852258889 },
"F_3_Z_2 SUPPLY INLET Mass Flow Rate": { "average": 0.293472693, "sigma": 0.140053985 },
"F_3_Z_3 RETURN OUTLET CO2 Concentration": { "average": 614.3614245, "sigma": 263.1740678 },
"F_3_Z_3 SUPPLY INLET Temperature": { "average": 15.64347669, "sigma": 4.141328507 },
"F_3_Z_3 SUPPLY INLET Mass Flow Rate": { "average": 0.10151684, "sigma": 0.048718352 },
"F_3_Z_5 RETURN OUTLET CO2 Concentration": { "average": 585.8667356, "sigma": 211.403023 },
"F_3_Z_5 SUPPLY INLET Temperature": { "average": 14.55149, "sigma": 3.431339357 },
"F_3_Z_5 SUPPLY INLET Mass Flow Rate": { "average": 0.065967708, "sigma": 0.028921176 },
"F_3_Z_6 RETURN OUTLET CO2 Concentration": { "average": 602.7006321, "sigma": 250.388314 },
"F_3_Z_6 SUPPLY INLET Temperature": { "average": 15.8215599, "sigma": 4.214780813 },
"F_3_Z_6 SUPPLY INLET Mass Flow Rate": { "average": 0.329989955, "sigma": 0.167482895 },
"F_3_Z_7 RETURN OUTLET CO2 Concentration": { "average": 592.2648666, "sigma": 233.7893218 },
"F_3_Z_7 SUPPLY INLET Temperature": { "average": 16.3442599, "sigma": 4.681369437 },
"F_3_Z_7 SUPPLY INLET Mass Flow Rate": { "average": 0.092886533, "sigma": 0.052634957 },
"F_3_Z_8 RETURN OUTLET CO2 Concentration": { "average": 597.8740865, "sigma": 239.0415454 },
"F_3_Z_8 SUPPLY INLET Temperature": { "average": 16.99524931, "sigma": 5.796047749 },
"F_3_Z_8 SUPPLY INLET Mass Flow Rate": { "average": 0.301221701, "sigma": 0.175147778 },
"F_3_Z_9 RETURN OUTLET CO2 Concentration": { "average": 586.0892099, "sigma": 227.6989272 },
"F_3_Z_9 SUPPLY INLET Temperature": { "average": 12.88992889, "sigma": 1.274215303 },
"F_3_Z_9 SUPPLY INLET Mass Flow Rate": { "average": 3.349795635, "sigma": 0.751671499 },
"F_3_Z_10 RETURN OUTLET CO2 Concentration": { "average": 628.7844445, "sigma": 282.5041394 },
"F_3_Z_10 SUPPLY INLET Temperature": { "average": 15.3266813, "sigma": 3.676347732 },
"F_3_Z_10 SUPPLY INLET Mass Flow Rate": { "average": 0.10405129, "sigma": 0.046793164 },
"F_3_Z_11A RETURN OUTLET CO2 Concentration": { "average": 579.0615526, "sigma": 209.9614567 },
"F_3_Z_11A SUPPLY INLET Temperature": { "average": 13.90361815, "sigma": 2.554892458 },
"F_3_Z_11A SUPPLY INLET Mass Flow Rate": { "average": 0.192985764, "sigma": 0.075883113 },
"F_3_Z_11B RETURN OUTLET CO2 Concentration": { "average": 523.6190617, "sigma": 141.2936446 },
"F_3_Z_11B SUPPLY INLET Temperature": { "average": 13.50637403, "sigma": 1.56451766 },
"F_3_Z_11B SUPPLY INLET Mass Flow Rate": { "average": 0.393174876, "sigma": 0.124576759 },
"F_3_Z_11C RETURN OUTLET CO2 Concentration": { "average": 578.8251325, "sigma": 211.9892157 },
"F_3_Z_11C SUPPLY INLET Temperature": { "average": 13.50476538, "sigma": 1.78409034 },
"F_3_Z_11C SUPPLY INLET Mass Flow Rate": { "average": 0.327561186, "sigma": 0.113471684 },
"F_3_Z_1 Hazium Concentration": { "average": 1.053808532, "sigma": 1.46732015 },
"F_2_Z_2 Hazium Concentration": { "average": 0.653390129, "sigma": 1.255280826 },
"F_2_Z_4 Hazium Concentration": { "average": 0.711752976, "sigma": 1.405095053 },
"F_1_Z_8A Hazium Concentration": { "average": 0.172875, "sigma": 0.436917914 },
}
