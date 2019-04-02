
var date = ""
var ServerCount = 0;
var PlayerCount = 0;
var PublicCount = 0;
var PeerCount = 0;

var d = new Date();
date = (d.getMonth()+1).toString() + '/' 
	+ d.getDate().toString() + '/' 
	+ d.getFullYear().toString() + ' '
	+ (d.getHours()<10 ? '0' : '').toString() + d.getHours().toString() + ':'
	+ (d.getMinutes()<10 ? '0' : '') + d.getMinutes().toString() + ' GMT-5';

$(window).load(function() {
  var serverList = "https://cartographer.online/live/server_list.php";
  var dediList = "https://cartographer.online/live/dedicount.php";
  var status = document.getElementById('status');
  var dateChecked = document.getElementById('dateChecked');
  /*var s3 = document.getElementById('playerCount');
  var s4 = document.getElementById('serverCount');
  var s5 = document.getElementById('publicCount');
  var s6 = document.getElementById('peerCount');
  */
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

  // get dedi/peer counts from server
  $.getJSON(dediList)
	.done(function(data)
	{
		PublicCount = data.public_count;				
		PeerCount = data.peer_count;
	})
  
  // get total server and player counts from server
  $.getJSON(serverList)
	.done(function(data) 
	{
		var promises = [];
		$.each( data.servers, function (i, server) {
			var thisServer = "https://cartographer.online/live/server.php?xuid=" + server;

			promises.push(	// pushing the getJSON data to a promise
				$.getJSON(thisServer)
				.done(function(serverData) 
				{
					console.log(JSON.stringify(serverData));
					var thisServerCount = serverData.dwFilledPublicSlots;
					PlayerCount += thisServerCount;
				})
			)

			ServerCount++;	// getting total server count
		});
		
		// resolving the json data as one giant promise
		// lets the requests run async until promises is completely populated
		$.when.apply($,promises).then(function()
		{
			status.innerHTML = "<b>En línea</b>";
			status.style.color = "green";
			dateChecked.innerHTML = date;
			/*s3.innerHTML = PlayerCount.toString();
			s4.innerHTML = ServerCount.toString();
			s5.innerHTML = PublicCount.toString();
			s6.innerHTML = PeerCount.toString();
			*/
		});
	})
	.fail(function()
	{
		status.innerHTML = "<b>Off</b>";
		status.style.color = "red";
		dateChecked.innerHTML = date;
	});

});