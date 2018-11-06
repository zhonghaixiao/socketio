var http = require('http');
var fs = require('fs');
var net = require('net');


var host = '192.168.1.24';
var port = 2000;

var observer;

net.createServer(function(sock){
	console.log('CONNECTED: ' + sock.remoteAddress +
			":" + sock.remotePort);

	var temp;
	let start = false;
	var gpllBuf = '';

	sock.on('data', function(data){

		var gps_data = data.toString('ascii');

		if(gps_data.indexOf("$GPGLL") > -1){
			start = true;
			gpllBuf = gpllBuf.concat(gps_data.slice(gps_data.indexOf("$GPGLL")));
			console.log("start = " + start + "\n--->" + gpllBuf);
		}

		if(start === true){
			if(gps_data.indexOf("A,A*") > -1){
				gpllBuf = gpllBuf.concat(
					gps_data.slice(0,gps_data.indexOf("A,A*") + 5)
				);
				start = false;
				console.log("gpllBuf: " + gpllBuf + "--end---");

				let temp = gpllBuf.split(',');
				//let gpsInfo = [temp[1],temp[2],temp[3],temp[4],temp[5]];
				let gpsInfo = [temp[1],temp[2]];
				console.log(gpsInfo);

				if(typeof observer === "function"){
					observer(gpsInfo);
				}

				/*for(var observer of observers){
					observer(gpsInfo);
				}*/

				gpllBuf = "";

			}else{
				gpllBuf = gpllBuf.concat(gps_data);
			}
		}



	});

	sock.on('close',function(data){
		console.log('CLOSEDD: ' + sock.remoteAddress + ' '
				+ sock.remotePort);
	});

}).listen(port,host);

console.log('tcp server listening on ' + host + ':' + port
			+ "  reading gps information");


const server = require('http').createServer();

const io = require('socket.io')(server);

server.listen(3000);
console.log('socket.io listen on 127.0.0.1:3000');

io.sockets.on('connection', function(socket){

   observer = function(gps){
     console.log("gps: " + gps);
     socket.emit("gpsData",JSON.stringify(gps));
   }

  console.log('user connected!');

//  setInterval(() => {
//	  let realData = [Math.random(), Math.random()];
//	  socket.emit("gps", JSON.stringify(realData));
//  }, 500);


});


























