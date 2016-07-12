
function roomsExchange(){
	var roomData=DATA_CENTER.derived_data['room.json']
	var proxZone_to_energyZone=DATA_CENTER.global_variable['proxZone_to_energyZone']
	var energyZone_to_proxZone=DATA_CENTER.global_variable['energyZone_to_proxZone']
	//console.log(roomData)
	for(var i in roomData){
		if(roomData[i].proxZone==undefined) console.log(roomData[i])
		var proxZone='F'+'_'+roomData[i].floor+'_Z'+'_'+roomData[i].proxZone
		var energyZone='F'+'_'+roomData[i].floor+'_Z'+'_'+roomData[i].energyZone
		if(proxZone in proxZone_to_energyZone){
			if(proxZone_to_energyZone[proxZone].indexOf(energyZone)<0){
				proxZone_to_energyZone[proxZone].push(energyZone)
			}
		}
		else{
			proxZone_to_energyZone[proxZone]=[]
			proxZone_to_energyZone[proxZone].push(energyZone)
		}

		if(energyZone in energyZone_to_proxZone){
			if(energyZone_to_proxZone[energyZone].indexOf(proxZone)<0){
				energyZone_to_proxZone[energyZone].push(proxZone)
			}
		}
		else{
			energyZone_to_proxZone[energyZone]=[]
			energyZone_to_proxZone[energyZone].push(proxZone)
		}

	}
	//console.log(energyZone_to_proxZone)
}


