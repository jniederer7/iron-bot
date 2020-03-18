var Discord = require('discord.io');
var logger = require('winston');
var auth = require("./auth.json");
var axios = require('axios');
var createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require('fs');
const csvWriter = createCsvWriter({
	path: 'players.csv',
	header: [
		{id: 'totalrank', title:" Rank"},
		{id: 'name', title:" Name"},
		{id: 'totallvl', title:" Total Lvl"},
		{id: 'totalxp', title: " Total Xp"}
	],
  encoding: 'ascii',
  append: true
});

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '$') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       var player = args[1];
        args = args.splice(1);
        var apiCall = axios.get('https://secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player=' + player);

        switch(cmd) {
            case 'hiscore':
            	apiCall.then(response => {
            		bot.sendMessage({
            			to: channelID,
            			message: response.data.split(/[\s,]+/)
            		});
            		
            	})
            	break;
            case 'addplayer':
            	apiCall.then( response => {
            		var playerData = response.data.split(/[\s,]+/);
            		 const playerLog = [
						 {
						 	totalrank:playerData[0],
						 	name: player,
						 	totallvl: playerData[1],
						 	totalxp:playerData[2],
						 }
						 ]
            		csvWriter.writeRecords(playerLog);
            		bot.sendMessage({
            			to:channelID,
            			message: "Player added"
            		})
            	})

            	break;
            case 'clanhighscore':
            	fs.readFile('players.csv', 'ascii', function(err,data) {
            		if (err) throw err;
                    output= data.split("\n");

            		 for (var i = 0; i < output.length; i++){
            			output[i] = output[i].split(",");
            			}
                        output.sort((a,b) => a[0] - b[0]); 
                       for (var j=0; j < output.length; j++){
                        output[j].split(",");
                        output[j] = output[j] + "\n"; 
                       }            
					bot.sendMessage({
            			to: channelID,
            			message: output
            			});
            	});
            	

            	break;

         }
     }
});
