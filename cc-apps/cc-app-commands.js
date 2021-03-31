const Discord = require('discord.js')

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function hasPermissionsInChannel(member, channel) {
	return member && member.permissionsIn(channel).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)
}

function acceptApp (message,cmd, args) {
    const userRSN = args.length > 1 ? args.splice(2).join(" ").trim() : undefined
			let ccEndPoint = args[0];
			let userEndPoint = args[1];
			const user = message.client.users.cache.get(userEndPoint);

			if (ccEndPoint != null){
				ccEndPoint = ccEndPoint.toLowerCase();
			}

			if (!hasPermissionsInChannel(message.member, message.channel)) {
				message.channel.send(`Sorry ${message.member}, you do not have access to the \`${cmd}\` command`)
				return
			}

			if(message.channel.id != "725751906110013520" && message.channel.id != "672659118976139311") {
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
}

function denyApp (message,cmd, args){
    
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

			if(message.channel.id != "725751906110013520" && message.channel.id != "672659118976139311") {
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
}
module.exports = {
    acceptApp,
    denyApp
}