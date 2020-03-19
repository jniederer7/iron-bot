const Discord = require('discord.js')
const config = require('./config')
const { usersDb, hiscoresDb } = require('./common');
const { Category, getCategoryByShortName } = require('./hiscores/categories')
const { Endpoints, getEndpointByShortName } = require('./hiscores/endpoints')
const ImageWriter = require('./ImageWriter')

// 1-12 characters long, using letters, numbers, spaces, or hyphens
// can't start or end with hypen or space, cant have two hyphens/spaces next to each other
// Modified from https://stackoverflow.com/a/12019115/7108103
const JAGEX_USERNAME_REGEX = /^(?=.{3,12}$)(?=^[a-zA-Z\d])(?!.*[-]{2})[a-zA-Z\d- ]+$(?<![- ])/

/**
 * Checks if the member can manage messages for this channel
 * @param member the member object from message.member
 * @param channel the channel object from message.channel, if null checks globablly
 * @returns boolean
 */
function hasPermissionsInChannel(member, channel) {
	return member && member.permissionsIn(channel).has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)
}

module.exports = (message, cmd, args) => {
	switch(cmd)	{
		case 'getname': {
			const result = usersDb.get(message.member.id)

			let output = `${message.member} You have not set a name yet. You can use the \`${config.prefix}setname\` command to do so`;
			if (result) {
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
				const userObj = usersDb.get(userKey)
				if (userObj.name.toLowerCase() === newName.toLowerCase()) {
					message.channel.send(`${message.member} Sorry but the username \`${newName}\` is already taken`)
					return
				}
			}

			const oldName = data.name
			data.name = newName
			data.endpoint = data.endpoint || Endpoints.IRONMAN.key
			usersDb.put(message.member.id, data)

			let output = `${message.member} Your discord account is now linked to the username: \`${newName}\` (type \`${data.endpoint}\`)`
			if (oldName) {
				output += `\nYour account was previously linked to the username: \`${oldName}\``
			}
			message.channel.send(output)
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
			}

			if (!data.name) {
				output += `\nYour account is not currently linked with a name, use the \`${config.prefix}setname\` command to fix this`
			}
			message.channel.send(output)
			return
		}
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
				const userObj = usersDb.get(userKey)
				if (userObj.name.toLowerCase() === username.toLowerCase()) {
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
	 }
}

function createEmbed () {
	return new Discord.MessageEmbed().setColor(0xec644b)
}
