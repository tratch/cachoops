 var express = require('express');
 var routes = require('./routes');
 var pyramid = require('./models/pyramid');
 var http = require('http');
 var path = require('path');
 var stylus = require('stylus')
 var nib = require('nib')

 var app = express();
 var d3 = require("d3");
 var port = parseInt(process.argv[2]);


// all environments
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(stylus.middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '/public')));

var pg = require('pg');
var conString = "postgres://tratch:postgres@localhost:5432/hoops";
var DB_NAME = "matchupstats";
var LEAGE_DB_NAME = "matchupleagues";



app.get('/', function (req, res) {
	var client = new pg.Client(conString);
	client.connect();
	client.query('select * from '+LEAGE_DB_NAME+' order by name asc',function(err, result){
		var leagueList = result.rows;

		//randomly choose a league on first request
		var leagueType = leagueList[Math.floor((Math.random()*leagueList.length))].league_type;
		client.query('select distinct(player_id), player_name from '+DB_NAME+' where league_type='+leagueType+' order by player_name asc', function(err, result) {
			var playerList = result.rows;
			//randomly select two players on first request
			var leftPlayerId = playerList[Math.floor((Math.random()*playerList.length))].player_id;
			var rightPlayerId = playerList[Math.floor((Math.random()*playerList.length))].player_id;
			
			client.query('select * from '+DB_NAME
 			+' where player_id = $1'
 			+' and league_type = $2'
 				,[leftPlayerId,leagueType], 
 			function(err, result) {
 				var leftPlayerStats = result.rows[0];
 				client.query('select * from '+DB_NAME
 				+' where player_id = $1'
 				+' and league_type = $2',
 				[rightPlayerId,leagueType], 
 				function(err, result) {
 					var rightPlayerStats = result.rows[0];
 					var data = new pyramid(leftPlayerStats,rightPlayerStats);
 					res.render('index',{ 
							title : 'CAC Player Comparison',
							players : playerList,
							leagues : leagueList,
							leagueType : leagueType,
							leftPlayerId : leftPlayerId,
							rightPlayerId : rightPlayerId,
							stats: data
					});
					client.end();
 				});
			});
		});
	});
});

app.get('/league', function (req, res) {
	var leagueType = parseInt(req.query.leagueType);
	var client = new pg.Client(conString);
	client.connect();
	client.query('select * from '+LEAGE_DB_NAME+' order by name asc',function(err, result){
		var leagueList = result.rows;
		//randomly choose a league on first request
		client.query('select distinct(player_id), player_name from '+DB_NAME+' where league_type='+leagueType+' order by player_name asc', function(err, result) {
			var playerList = result.rows;
			//randomly select two players on first request
			var leftPlayerId = playerList[Math.floor((Math.random()*playerList.length))].player_id;
			var rightPlayerId = playerList[Math.floor((Math.random()*playerList.length))].player_id;
			client.query('select * from '+DB_NAME
 			+' where player_id = $1'
 			+' and league_type = $2'
 				,[leftPlayerId,leagueType], 
 			function(err, result) {
 				var leftPlayerStats = result.rows[0];
 				client.query('select * from '+DB_NAME
 				+' where player_id = $1'
 				+' and league_type = $2',
 				[rightPlayerId,leagueType], 
 				function(err, result) {
 					var rightPlayerStats = result.rows[0];
 					res.send({
							players : playerList,
							leagues : leagueList,
							leagueType : leagueType,
							leftPlayerId : leftPlayerId,
							rightPlayerId : rightPlayerId,
							stats: new pyramid(leftPlayerStats,rightPlayerStats)
					});
					client.end();
 				});
			});
		});
	});
});

 app.get('/stats', function (req, res) {
 	var leagueType = req.query.leagueType;
	var leftPlayerId = parseInt(req.query.left);
	var rightPlayerId = parseInt(req.query.right);
	var client = new pg.Client(conString);
	client.connect();
 	client.query('select * from '+DB_NAME +' where player_id = '+leftPlayerId+' and league_type ='+leagueType, function(err, result) {
 			var leftPlayerStats = result.rows[0];
 			client.query('select * from '+DB_NAME +' where player_id = '+rightPlayerId+' and league_type ='+leagueType, function(err, result) {
 					var rightPlayerStats = result.rows[0];
 					var data = new pyramid(leftPlayerStats,rightPlayerStats);
 					res.send({stats: data});
 					client.end();
 			});
	});
});

 app.get('/adraft', function (req, res) {
 	var client = new pg.Client(conString);
 	client.connect();
 	client.query('select distinct player_name from a_draft_stats order by player_name asc', function(err, result) {
 		var playerList = result.rows;
 		var leftPlayerName = playerList[Math.floor((Math.random()*playerList.length))].player_name;
 		var rightPlayerName = playerList[Math.floor((Math.random()*playerList.length))].player_name;
 		client.query('select *'
 			+'from a_draft_stats where player_name = $1',[leftPlayerName], function(err, result) {
 				var leftPlayerStats = result.rows[0];
 				client.query('select *'
 					+' from a_draft_stats where player_name = $1',[rightPlayerName], function(err, result) {
 						var rightPlayerStats = result.rows[0];
 						var data = new pyramid(leftPlayerStats,rightPlayerStats);
 						res.render('adraft',{ 
 							title : 'A Draft Player Comparison',
 							players : playerList,
 							leftPlayerName : leftPlayerName,
 							rightPlayerName : rightPlayerName,
 							stats: data
 						}); 
 						client.end();
 					});
		});
	});
});



 app.get('/adraft/adraftstats', function (req, res) {
 	var leftPlayerName = req.query.left;
 	var rightPlayerName = req.query.right;
 	var client = new pg.Client(conString);
 	client.connect();
 	client.query('select *'
 		+'from a_draft_stats where player_name = $1',[leftPlayerName], function(err, result) {
 			var leftPlayerStats = result.rows[0];
 			client.query('select *'
 				+' from a_draft_stats where player_name = $1',[rightPlayerName], function(err, result) {
 					var rightPlayerStats = result.rows[0];
 					var data = new pyramid(leftPlayerStats,rightPlayerStats);
 					res.send({stats: data});
 					client.end();
 			});
	});
});


  app.get('/fivevsfive', function (req, res) {
 	var client = new pg.Client(conString);
 	client.connect();
 	client.query('select distinct player_name from fivevsfivestats order by player_name asc', function(err, result) {
 		var playerList = result.rows;
 		var leftPlayerName = playerList[Math.floor((Math.random()*playerList.length))].player_name;
 		var rightPlayerName = playerList[Math.floor((Math.random()*playerList.length))].player_name;
 		client.query('select *'
 			+'from fivevsfivestats where player_name = $1',[leftPlayerName], function(err, result) {
 				var leftPlayerStats = result.rows[0];
 				client.query('select *'
 					+' from fivevsfivestats where player_name = $1',[rightPlayerName], function(err, result) {
 						var rightPlayerStats = result.rows[0];
 						var data = new pyramid(leftPlayerStats,rightPlayerStats);
 						res.render('fivevsfive',{ 
 							title : '5 vs 5 Draft Player Comparison',
 							players : playerList,
 							leftPlayerName : leftPlayerName,
 							rightPlayerName : rightPlayerName,
 							stats: data
 						}
 						) 
 						client.end();
 					});
		});
	});
});

app.get('/fivevsfive/fivevsfivestats', function (req, res) {
 	var leftPlayerName = req.query.left;
 	var rightPlayerName = req.query.right;
 	var client = new pg.Client(conString);
 	client.connect();
 	client.query('select *'
 		+'from fivevsfivestats where player_name = $1',[leftPlayerName], function(err, result) {
 			var leftPlayerStats = result.rows[0];
 			client.query('select *'
 				+' from fivevsfivestats where player_name = $1',[rightPlayerName], function(err, result) {
 					var rightPlayerStats = result.rows[0];
 					var data = new pyramid(leftPlayerStats,rightPlayerStats);
 					res.send({stats: data});
 					client.end();
 			});
	});
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
