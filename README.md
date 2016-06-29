# VASTChallenge2016
1. 现在有两个视图，linechart和trajectory
每个视图中的一个小视图写在scripts文件夹中对应文件夹里面对应的js；小视图的css是css文件夹中对应文件夹里对应的css

2. 原始数据在datacenter.js里面读了，访问时形如DATA_CENTER.original_data["bldg-MC2.csv"]

3. 要从原始数据派生新数据时，在DATA_CENTER中cal_derive_data函数里面计算以后，存在DATA_CENTER.derived_data[...]里面（...是derive出来的数据的名字）

4. 在视图间传递的全局变量在DATA_CENTER.global_variables里面，每次修改global_variable时通过DATA_CENTER.set...进行设置以触发message

5. 要定义message时，在main.js的MESSAGE_COLLECTION里面进行修改以设置有效message的集合

6. 要添加新的view时，在main.js的VIEW_COLLECTION里面进行修改，否则新的view不会接收到message
每一个view都做成对象的形式，有一个obsUpdate(message, data)和一个render(divID)这两个成员函数

7. 点击linechart按钮进行渲染的地方是main.js中的function display_linechart_view()里面
点击trajectory按钮进行渲染的地方是main.js中的function display_trajectory_view()里面

