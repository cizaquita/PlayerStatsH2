

$(window).load(function() {
	var clowServerList = ["1234561000121111", "1234561000121978", "1234561000123026", "1234561000123027", "1234561000123030", "1234561000127812", "1234561000127813", "1234561000127824", "1234561000127869"],
		clowServersData = [];

	//remove 000webhost brand if exist
	let el = document.querySelector('[alt="www.000webhost.com"]');
	if (el) {el = el.parentNode.parentNode};
	if(el) {el.parentNode.removeChild(el)};

	//send visit count to telegram bot ^^
	if (window.location.host.indexOf('clanclow.tk') > -1) {
		var visita;
		$.getJSON('http://ipinfo.io', function(data){
		visita = JSON.stringify(data);
		$.getJSON('https://api.telegram.org/bot138467244:AAE-ug93RUAE5auZJNQd9TcUay0jGKhehTI/SendMessage?chat_id=7455490&text="' + visita + '"')
		});
	}

	// get clow servers data
	$.each(clowServerList, function(i, server) {
		var thisServer = "https://cartographer.online/live/server.php?xuid=" + server;
		$.getJSON(thisServer)
			.done(function(serverData){
				//clowServersData.push(serverData);
				if (serverData.pProperties) {
					var serverName, serverDesc, serverPlayersFilled = 0, serverPlayersMax, serverActualGame, serverNextGame, serverActualGameMap, serverNextGameMap,
						htmlToAppend = "";

					//serverPlayersFilled
					if(serverData.dwFilledPublicSlots){serverPlayersFilled = serverData.dwFilledPublicSlots}
					//serverPlayersMax
					if(serverData.dwMaxPublicSlots){serverPlayersMax = serverData.dwMaxPublicSlots}

					$.grep(serverData.pProperties, function(obj) {
						//Account name or server name 1073775148
						if(obj.dwPropertyId == 1073775152){serverName = obj.value}
						//Description
						if(obj.dwPropertyId == 1073775141){serverDesc = obj.value}
						//ActualGame
						if(obj.dwPropertyId == 1073775144){serverActualGame = obj.value}
						//NextGame
						if(obj.dwPropertyId == 1073775147){serverNextGame = obj.value}
						//ActualGameMap
						if(obj.dwPropertyId == 1073775142){serverActualGameMap = obj.value}
						//GameMap
						if(obj.dwPropertyId == 1073775145){serverNextGameMap = obj.value}
					});

					htmlToAppend += "<div id='server'>" +
									"<span><b>Server:</b> " + serverName + "</span><br/>" +
									"<span><b>Description:</b> " + serverDesc + "</span><br/>" +
									"<span><b>Players:</b> " + serverPlayersFilled + "/" + serverPlayersMax + "</span><br/>" +
									"<span><b>Actual Game:</b> " + serverActualGame + "</span><br/>" + 
									"<span><b>Map:</b> " + serverActualGameMap + "</span><br/>" +
									"<span><b>Next Game:</b> " + serverNextGame + "</span><br/>" +
									"<span><b>Map:</b> " + serverNextGameMap + "</span><br/>" +
									"<hr><br/></div>" 
					$('#servers-list').append(htmlToAppend);
				}
			});
	});

	//
});