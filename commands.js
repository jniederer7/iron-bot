const Discord = require('discord.js')
const config = require('./config')
const { usersDb, hiscoresDb, removeDeprecatedUserData, timedQueue } = require('./common');
const { Category, getCategoryByShortName } = require('./hiscores/categories')
const { Endpoints, getEndpointByShortName } = require('./hiscores/endpoints')
const ImageWriter = require('./ImageWriter')
const {bossCategoryAliases, bossCategories } = require('./pb/bossCategories.js');
const pbFunctions = require('./pb/pbCommands.js');

// 1-12 characters long, using letters, numbers, spaces, or hyphens
// can't start or end with hypen or space, cant have two hyphens/spaces next to each other
// Modified from https://stackoverflow.com/a/12019115/7108103
const JAGEX_USERNAME_REGEX = /^(?=.{1,12}$)(?=^[a-zA-Z\d])(?!.*[-]{2})[a-zA-Z\d- ]+$(?<![- ])/

/**
 * Checks if the member can manage messages for this channel
 * @param member the member object from message.member
 * @param channel the channel object from message.channel, if null checks globablly
 * @returns boolean
 */

 const mysql = require('mysql')

 const con = mysql.createConnection({
	 host: "localhost",
	 user: "root",
	 password: "",
	 database: "boss_pbs",
	 multipleStatements: true
   });

const startConnection = () => {
	con.connect(function(err) {
	if (err) throw err;
  })};

function hasPermissionsInChannel(member, channel) {
	return member && member.permissionsIn(channel).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)
}

module.exports = (message, cmd, args) => {
	switch(cmd)	{
		case 'getname': {
			const result = usersDb.get(message.member.id)

			let output = `${message.member} You have not set a name yet. You can use the \`${config.prefix}setname\` command to do so`;
			if (result && result.name) {
				const endpointText = result.endpoint === null ? "" : ` (type \`${result.endpoint}\`)`
				output = `${message.author} Your account is linked to \`${result.name}\`${endpointText}`
			}
			
			message.channel.send(output)
			return
		}
		case 'deletename': {
			const data = usersDb.get(message.member.id)
			if (!data) {
				message.channel.send(`${message.member} You do not have a name set with this bot.`)
				return
			}

			usersDb.put(message.member.id)
			message.channel.send(`${message.member} Your previous name \`${data.name}\` (type \`${data.endpoint}\`) is no longer associated with you and this bot. You will be removed from the hiscore data within 24hours.`)
			removeDeprecatedUserData(message.member.id)
			return
		}
		case 'setname': {
			if (args == null) {
				return
			} 

			const newName = args.join(" ").trim()
			if (newName.length == 0) {
				return
			}

			if (newName.match(JAGEX_USERNAME_REGEX) === null) {
				message.channel.send(`${message.member} Invalid username: \`${newName}\``)
				return
			}

			const data = usersDb.get(message.member.id) || {}
			if (data.name === newName) {
				message.channel.send(`${message.member} You have already set you username to \`${newName}\``)
				return
			}

			for (let userKey of usersDb.keys()) {
				const userObj = usersDb.get(userKey) || {}
				if (userObj.name && userObj.name.toLowerCase() === newName.toLowerCase()) {
					message.channel.send(`${message.member} Sorry but the username \`${newName}\` is already taken`)
					return
				}
			}

			const oldName = data.name
			data.name = newName
			data.endpoint = data.endpoint || Endpoints.IRONMAN.key
			usersDb.put(message.member.id, data)

			let output = `${message.member} Your discord account is now linked to the username: \`${newName}\` (account type \`${data.endpoint}\`)`
			if (oldName) {
				output += `\nYour account was previously linked to the username: \`${oldName}\``
				removeDeprecatedUserData(message.member.id)
			}
			message.channel.send(output)
			// Add to queue of users data to be updated
			timedQueue.add(message.member.id)
			return
		}
		case 'settype': {
			if (args == null) {
				return
			} 

			const requestedEndpoint = args.join(" ").trim()
			if (requestedEndpoint.length == 0) {
				return
			}

			const endpoint = getEndpointByShortName(requestedEndpoint)
			if (endpoint === null || !Endpoints[endpoint]) {
				message.channel.send(`${message.member} Invalid endpoint supplied: \`${requestedEndpoint}\``)
				return
			}

			const data = usersDb.get(message.member.id) || {}
			if (data.endpoint === endpoint) {
				message.channel.send(`${message.member} You have already set your endpoint to \`${data.endpoint}\``)
				return
			}

			var oldEndpoint = data.endpoint
			data.endpoint = endpoint
			usersDb.put(message.member.id, data)

			let output = `${message.member} Your discord account is now linked to the \`${data.endpoint}\` hiscore endpoint`
			if (oldEndpoint) {
				output += `\nYour account was previously linked to the \`${oldEndpoint}\` hiscore endpoint`
				removeDeprecatedUserData(message.member.id)
			}

			if (!data.name) {
				output += `\nYour account is not currently linked with a name, use the \`${config.prefix}setname\` command to fix this`
			} else {
				// Add to queue of users data to be updated
				timedQueue.add(message.member.id)
			}
			message.channel.send(output)
			return
		}
		case 'hiscore':
		case 'hs':
		case 'clanhs':
		case 'clanhiscore':
		case 'clanhiscores':
		case 'clanhighscore':
		case 'clanhighscores': {
			if (false && !hasPermissionsInChannel(message.member, message.channel)) {
				message.channel.send(`Sorry ${message.member}, you do not have access to the \`${cmd}\` command`)
				return
			}

			const requestedEndpoint = args[0]
			if (!requestedEndpoint) {
				return
			}

			const endpoint = getEndpointByShortName(requestedEndpoint)
			if (endpoint === null || !Endpoints[endpoint]) {
				message.channel.send(`${message.member} Invalid endpoint supplied: \`${requestedEndpoint}\``)
				return
			}

			let category = Category.OVERALL
			const requestedCategory = args.length > 1 ? args.splice(1).join(" ").trim() : undefined
			if (requestedCategory) {
				category = getCategoryByShortName(requestedCategory)
				if (category == null || Object.values(Category).indexOf(category) === -1) {
					message.channel.send(`${message.member} Invalid category supplied: \`${requestedCategory}\``)
					return
				}
			}

			// TODO: Add the ability to select all categories
			const hiscoreData = hiscoresDb.values().filter(e => e[endpoint] && e[endpoint][category].level > -1).sort((a, b) => a[endpoint][category].rank - b[endpoint][category].rank)
			if (hiscoreData.length <= 0) {
				return
			}

			// Create a hiscore-like imageBuffer
			const buffer = ImageWriter.generateHiscoreImage(hiscoreData, endpoint, category)

			const output = createEmbed()
				.setTimestamp()
				.attachFiles([{name: "image.png", attachment: buffer}])
				.setImage('attachment://image.png')
			message.channel.send(output)			
			return
		}
		case "whois": {
			if (args == null) {
				return
			} 

			const username = args.join(" ").trim()
			if (username.length == 0) {
				return
			}

			if (username.match(JAGEX_USERNAME_REGEX) === null) {
				message.channel.send(`${message.member} Invalid username: \`${username}\``)
				return
			}

			for (let userKey of usersDb.keys()) {
				const userObj = usersDb.get(userKey) || {}
				if (userObj.name && userObj.name.toLowerCase() === username.toLowerCase()) {
					message.client.users.fetch(userKey, true)
						.then(user => {
							message.channel.send(`${message.member} The username \`${userObj.name}\` is taken by \`${user.username}#${user.discriminator}\``)
						})
						.catch(error => {
							message.channel.send(`${message.member} Sorry but there was an issue determining who owns that username`)
						})
					return
				}
			}

			message.channel.send(`${message.member} No-one is currently associated with username \`${username}\``)
			return

		}
		case "update": {
			const data = usersDb.get(message.member.id)
			if (!data || !data.name) {
				message.channel.send(`${message.member} You have not set a name yet. You can use the \`${config.prefix}setname\` command to do so`)
				return
			}
			
			// Add to queue of users data to be updated
			timedQueue.add(message.member.id, false)
			message.channel.send(`${message.member} You have been added to the update queue`)
			return
		}
		case "users": {
			const count = usersDb.values().length
			message.channel.send(`${message.member} There are currently ${count} members using this bot`)
			return
		}
		case "help": {
			// TODO: PM this to user instead of printing directly in channel?
			const output = createEmbed()
				.setTitle('Commands')
				.setDescription('This bot tracks OSRS accounts and adds them to a custom clan hiscore list. It will track one RSN per discord account and *will not* update automatically if you name change. Hiscore stats will be updated at a regular interval.')

				.addField(`${config.prefix}help`, `Displays this message.`)
				.addField(`${config.prefix}getname`, `Prints the RSN associated with your discord ID.`)
				.addField(`${config.prefix}setname <rsn>`, `Adds RSN to hiscore list. One RSN per discord account.`)
				.addField(`${config.prefix}deletename`, `Deletes RSN from hiscores and disassociates you with the bot.`)
				.addField(`${config.prefix}settype <type>`, `Set your account type so we query the correct hiscores (im, hc, ult, etc).`)
				.addField(`${config.prefix}update`, `Adds your RSN to the immediate update queue. Happens automatically after setting RSN or Iron type.`)
				.addField(`${config.prefix}whois <rsn>`, `Identifies the discord account tied to the specified RSN.`)
				.addField(`${config.prefix}hs <type> [category]`, `Shows the account type hiscore list for the specific category (skill or boss). Leaving category blank will default to the overall category`)
				.addField(`${config.prefix}pb <boss>`, `Displays a list the fastest boss kill times by IronScape members`)
				.addField(`${config.prefix}mypbs`, `displays a list of all the pb's you have tracked with the bot and overall ranks in the clan`)
				.addField(`${config.prefix}addpb <boss> <kill time> <link> <nickname>`, `adds a boss pb to the database`)
				.addField(`${config.prefix}deletepb <boss/all>`, `Deletes a specific boss entry from the database or all entries`)

			message.channel.send(output)
			return
		}
		case 'pb':{
			pbFunctions.pb()

		}

		case 'mypbs': {
			const User = message.member.id
			output = createEmbed()
				.setTitle(`Overall IronScape Rankings`)
				.setDescription(`All PB's for <@${User}>`)
					let bossValue = ``
					let rankValue = ``
					let killTime = ``
					let bossArray = []
			
			for(let i = 0; i < bossCategories.length; i++){
					let currentBoss = bossCategories[i]
					let query = `SELECT * FROM boss_kills WHERE boss = "${currentBoss}" ORDER BY kill_time`
				
					con.query(query, (err, res) => {
						if (err) throw err
						bossArray = res
						for(let j = 0; j < bossArray.length; j++){
							if(bossArray[0] == undefined || bossArray[0] == []){
								break
							}
						if(bossArray[j].discord_id == User){
							bossValue += `${currentBoss}\n`
								rankValue += `${j+1}\n`
								killTime += `${bossArray[j].kill_time}\n`
								 break
						}
						}
						
						
					})
					con.end( (err) => {
						if (err) throw err
					})
					}				
			setTimeout( () => {
				if(bossValue,rankValue,killTime != ''){
				output = output.addFields(
					{name: 'Boss', value:`${bossValue}`, inline: true}, 
					{name: 'Rank', value:`${rankValue}`, inline: true},
					{name: 'Kill Time', value:`${killTime}`, inline: true},
					
					)
					message.channel.send(output)
				}
				else{
					output = `You do not have any pb's stored in the database <@${User}>`
					message.channel.send(output)
				}
				
			}, 3000)
			return
		}
		
		case 'addpb': {
				let discordName = message.member.id
				let requestBoss = args[0]
				let killTime = args[1]
				let link = args[2]
				let playerAlias = args.length > 1 ? args.splice(3).join(" ").trim() : undefined
				const timeRegex = new RegExp("^[0-9][:][0-5][0-9][:][0-5][0-9]")
				const urlRegex = new RegExp("(^[<]?http[s]?:\/{2})")
				const boss = bossCategoryAliases(requestBoss);
				const pbDate = new Date().toLocaleDateString()

				let output = '';
    if (boss == null || playerAlias == '' || link == null || killTime == null){
        output = 'Missing boss, kill time of boss, screenshot link, or player nickname'
        message.channel.send(output)
        return
    }

    if (killTime.match(timeRegex) === null) {
        output = 'invalid time submission. please use H:MM:SS.s (hour, minutes, seconds, fractional seconds) format'
        message.channel.send(output)
        return
    }

	if (link.match(urlRegex) == null){
		output = 'Incomplete URL. Please use a complete URL with http(s) and www included'
		message.channel.send(output)
		return
	}
	let validBoss = false
	for(let i = 0; i < bossCategories.length; i++){
		if (bossCategories[i] == boss){
			validBoss = true;
			break
		}
	}
	if (validBoss == false){
		output = 'invalid boss selected'
		message.channel.send(output)
		return
	}

	let query = `REPLACE INTO boss_kills(discord_id,player_name,boss,kill_time,pb_date,image_link) VALUES ("${discordName}","${playerAlias}","${boss}","${killTime}","${pbDate}","${link}")`
	con.query(query, (err,res) =>{
		if (err) throw err
		output = ` **${boss}** PB added or updated for **<@${discordName}>**`
		message.channel.send(output)
	})
	con.end((err) => {
		if (err) throw err
	})
return
	
}
		case "deletepb":{
			let discordName = message.member.id
			let requestBoss = args[0]
			let user = message.client.users.cache.get(discordName)
			const boss = bossCategoryAliases(requestBoss);

			if (requestBoss == null){
				output = 'Select a boss to remove that boss or `all` to remove all of your pb`s'
				message.channel.send(output)
				return
			}
			let query = `DELETE FROM boss_kills WHERE discord_id = "${discordName}" AND boss = "${boss}"`
			let validBoss = false
			if(requestBoss == 'all'){
				validBoss = true
				query = `DELETE FROM boss_kills WHERE discord_id = "${discordName}" LIMIT 20`
			}
			for(let i = 0; i < bossCategories.length; i++){
				if (bossCategories[i] == boss){
					validBoss = true;
					break
				}
			}

			if (validBoss == false){
				output = 'invalid boss selected'
				message.channel.send(output)
				return
			}
			
			
			con.query(query, (err,res) => {
				if (err) throw err
				output = ` **${boss}** PB removed for <@${discordName}>`
				message.channel.send(output)
			})
			con.end( (err) => {
				if (err) throw err
			})
			return
		}

		
		case "accept": {
			function capitalizeFirstLetter(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			  }
			const requestedRSN = args.length > 1 ? args.splice(2).join(" ").trim() : undefined
			const userRSN = requestedRSN;
			let ccEndPoint = args[0];
			const userEndPoint = args[1];
			const user = message.client.users.cache.get(userEndPoint);

			if (ccEndPoint != null){
				ccEndPoint = ccEndPoint.toLowerCase();
			}

			if (!hasPermissionsInChannel(message.member, message.channel)) {
				message.channel.send(`Sorry ${message.member}, you do not have access to the \`${cmd}\` command`)
				return
			}

			if(message.channel.id != "725751906110013520") {
				message.channel.send("This command is disabled in this channel");
				return
			}


			if (userEndPoint == null) {
				message.channel.send("Please add a discord ID to send a message to");
				return
			}

			if (user == undefined) {
				message.channel.send("Incorrect Discord ID");
				return
			}
			if (ccEndPoint == "hardcore" || ccEndPoint == "ultimate"){
			user.send(`Hello! Your application to ${capitalizeFirstLetter(ccEndPoint)} CC has been accepted and you will be ranked in game within 48 hours. Please make sure to read our rules found at https://i.imgur.com/ri5GsdG.png
			
This message was sent automatically by this bot and will not reply to further messages. To discuss your application more in depth please contact a member of Leadership in the Ironscape Discord.`)
			.then( () => {
				message.channel.send(`${capitalizeFirstLetter(ccEndPoint)} CC application accepted for:
RSN: ${userRSN}
Discord: <@${userEndPoint}>`);
			}).catch( (e) => {
				message.channel.send(`${capitalizeFirstLetter(ccEndPoint)} CC application accepted for:
RSN: ${userRSN}
Discord: <@${userEndPoint}>
Message failed to send: <@${userEndPoint}> has their DM's turned off.`);

				return;
			});;
			return
			}

			if (ccEndPoint == "overflow") {
				user.send(`Hello! Your application to IronmanCC has been accepted and you will be ranked in game within 48 hours. Please make sure to read our rules found at https://i.imgur.com/ri5GsdG.png
			
This message was sent automatically by this bot and will not reply to further messages. To discuss your application more in depth please contact a member of Leadership in the Ironscape Discord.`)
			.then( () => {
				message.channel.send(`IronmanCC application accepted for:
RSN: ${userRSN}
Discord: <@${userEndPoint}>`);
			}).catch( (e) => {
				message.channel.send(`IronmanCC application accepted for:
RSN: ${userRSN}
Discord: <@${userEndPoint}>
Message failed to send: <@${userEndPoint}> has their DM's turned off.`);

				return;
			});;
			return
			};

			if (ccEndPoint == "total") {
				user.send(`Hello! Your application to IronmanCC2k has been accepted and you will be ranked in game within 48 hours. Please make sure to read our rules found at https://i.imgur.com/ri5GsdG.png
			
This message was sent automatically by this bot and will not reply to further messages. To discuss your application more in depth please contact a member of Leadership in the Ironscape Discord.`)
			.then( () => {
				message.channel.send(`IronmanCC2k application accepted for:
RSN: ${userRSN}
Discord: <@${userEndPoint}>`);
			}).catch( (e) => {
				message.channel.send(`IronmanCC2k application accepted for:
RSN: ${userRSN}
Discord: <@${userEndPoint}>
Message failed to send: <@${userEndPoint}> has their DM's turned off.`);

				return;
			});;
			return
			};

			if (ccEndPoint == "ironscape"){

			user.send(`Hello! Your application to ${capitalizeFirstLetter(ccEndPoint)} FC has been accepted and you will be ranked in game within 48 hours. Please make sure to read our rules found at https://i.imgur.com/ri5GsdG.png
			
This message was sent automatically by this bot and will not reply to further messages. To discuss your application more in depth please contact a member of Leadership in the Ironscape Discord.`)
			.then( () => {
				message.channel.send(`${capitalizeFirstLetter(ccEndPoint)} FC application accepted for:
RSN: ${userRSN}
Discord: <@${userEndPoint}>`);
			}).catch( (e) => {
				message.channel.send(`${capitalizeFirstLetter(ccEndPoint)} FC application accepted for:
RSN: ${userRSN}
Discord: <@${userEndPoint}>
Message failed to send: <@${userEndPoint}> has their DM's turned off.`);
				return;
			});
			return;
			}

			message.channel.send("incorrect or missing cc end point");
			return
		}

		case "deny":{
			function capitalizeFirstLetter(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			  }
			let ccEndPoint = args[0];
			const userEndPoint = args[1];
			const user = message.client.users.cache.get(userEndPoint);
			const reason = args.length > 1 ? args.splice(2).join(" ").trim() : undefined

			if (ccEndPoint != null){
				ccEndPoint = ccEndPoint.toLowerCase();
			}

			if (!hasPermissionsInChannel(message.member, message.channel)) {
				message.channel.send(`Sorry ${message.member}, you do not have access to the \`${cmd}\` command`)
				return
			}

			if(message.channel.id != "725751906110013520") {
				message.channel.send("This command is disabled in this channel");
				return
			}
			
			if (reason == "") {
				message.channel.send(`Please add a reason for denial`);
				return;
			}

			if (userEndPoint == null) {
				message.channel.send("Please add a discord ID to send a message to");
				return
			}

			if (user == undefined) {
				message.channel.send("Incorrect Discord ID");
				return
			}
			if (ccEndPoint == "hardcore" || ccEndPoint == "ultimate"){
			user.send(`Hello, unfortunately your application to ${capitalizeFirstLetter(ccEndPoint)} CC has been denied.

Note from Leadership: \`${reason}\`

This message was sent automatically by this bot and will not reply to further messages. To discuss your application more in depth please contact a member of Leadership in the Ironscape Discord.`)
			.then( () => {
				message.channel.send(`${capitalizeFirstLetter(ccEndPoint)} CC application denied for:
Discord: <@${userEndPoint}>
Reason: ${reason}`);
							}).catch( (e) => {
			message.channel.send(`${capitalizeFirstLetter(ccEndPoint)} CC application denied for:
Discord: <@${userEndPoint}>
Reason: ${reason}
Message failed to send: <@${userEndPoint}> has their DM's turned off.`);
				return;
			});
			return
			}

			if( ccEndPoint == "overflow"){
				user.send(`Hello, unfortunately your application to IronmanCC has been denied.

Note from Leadership: \`${reason}\`

This message was sent automatically by this bot and will not reply to further messages. To discuss your application more in depth please contact a member of Leadership in the Ironscape Discord.`)
			.then( () => {
				message.channel.send(`IronmanCC application Denied for:
Discord: <@${userEndPoint}>
Reason: ${reason}`);
							}).catch( (e) => {
			message.channel.send(`IronmanCC application denied for:
Discord: <@${userEndPoint}>
Reason: ${reason}
Message failed to send: <@${userEndPoint}> has their DM's turned off.`);
				return;
			});
			return
			};

			if( ccEndPoint == "total"){
				user.send(`Hello, unfortunately your application to IronmanCC2k has been denied.

Note from Leadership: \`${reason}\`

This message was sent automatically by this bot and will not reply to further messages. To discuss your application more in depth please contact a member of Leadership in the Ironscape Discord.`)
			.then( () => {
				message.channel.send(`IronmanCC2k application Denied for:
Discord: <@${userEndPoint}>
Reason: ${reason}`);
							}).catch( (e) => {
			message.channel.send(`IronmanCC2k application denied for:
Discord: <@${userEndPoint}>
Reason: ${reason}
Message failed to send: <@${userEndPoint}> has their DM's turned off.`);
				return;
			});
			return
			};

			if (ccEndPoint == "ironscape"){
			user.send(`Hello unfortunately your application to ${capitalizeFirstLetter(ccEndPoint)} FC has been denied.
			
Note from Leadership: \`${reason}\`

This message was sent automatically by this bot and will not reply to further messages. To discuss your application more in depth please contact a member of Leadership in the Ironscape Discord.`)
			.then( () => {
	message.channel.send(`${capitalizeFirstLetter(ccEndPoint)} FC application denied for:
Discord: <@${userEndPoint}>
Reason: ${reason}`);
				}).catch( (e) => {
message.channel.send(`${capitalizeFirstLetter(ccEndPoint)} CC application denied for:
Discord: <@${userEndPoint}>
Reason: ${reason}
Message failed to send: <@${userEndPoint}> has their DM's turned off.`);
			return;
				});
			return
			}

			message.channel.send("incorrect or missing cc end point");
			return
		}
		default: {
			message.channel.send(`${message.member} I don't know that command. Try \`$help\`.`)
			return
		}
	 }
}

function createEmbed () {
	return new Discord.MessageEmbed().setColor(0xec644b)
}
