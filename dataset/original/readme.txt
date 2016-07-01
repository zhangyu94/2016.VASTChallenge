原始的5个有关HVACzone的文件中第一行，属性行，有2个问题，因此修改了原始数据的属性行
1. 每个属性名开头的一个空格被删掉了
2. 原始数据中,F3_Z9的属性VAV REHEAT Damper Position写错了，原来写的是VAV Damper Position
3. 统一格式为
1）zone的格式是F_x_Z_y attr
2）floor的格式是F_x_attr
3）building数据就是原来的样子

原始的bldg-MC2.csv放到真_原始数据文件夹里面了，现在的bldg-MC2.csv是处理过的了

注意：
1. HVACzone的属性Mechanical Ventilation Mass Flow Rate只有F_1_Z_1有
2. Hazium Concentration是特殊属性，只有4个有Haziumsensor的zone有
3. VAV Availability Manager Night Cycle Control Status，只有1楼和3楼有
4. COOL Schedule Value，Wind Direction，Wind Speed，HEAT Schedule Value,这四个楼的属性在数据中从来没出现过
5. 5个有关HVAC的文件的时间戳都是4033个，但是他们的时间不是完全对应的