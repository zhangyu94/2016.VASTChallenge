var roomsExchange=function(index, exchangeWay){
	var roomData=DATA_CENTER.derived_data['singleroom.json']
	console.log(roomData)
	if(exchangeWay=='proxZone_to_energyZone'){
		var ProxZone=roomData[index].proxZone;
		var energyZones=[]
		for(var i in roomData){
			if(roomData[i].proxZone==ProxZone){
				if(energyZones.indexOf(roomData[i].energyZone)<0){
					energyZones.push(roomData[i].energyZone)
				}
			}
		}
		return energyZones;
	}
	if(exchangeWay=='energyZone_to_proxZone'){
		var EnergyZone=roomData[index].energyZone;
		var proxZones=[]
		for(var i in roomData){
			if(roomData[i].energyZone==EnergyZone){
				if(proxZones.indexOf(roomData[i].proxZone)<0){
					proxZones.push(roomData[i].proxZone)
				}
			}
		}
		return proxZones
	}
}

