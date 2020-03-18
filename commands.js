const Discord = require('discord.js')
const config = require('./config')
const usersDb = require('./database')(config.databases.users)
const hiscoresDb = require('./database')(config.databases.hiscores)

// 1-12 characters long, using letters, numbers, spaces, or hyphens
const JAGEX_USERNAME_REGEX = /^[\w\d\s-]{1,12}$/

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
			message.channel.send(result ? `${message.author} Your account is linked to \`${result}\``
				: `${message.member} You have not set a name yet. You can use the \`${config.prefix}setname\` command to do so`)
			return
		}
		case 'deletename': {
			const oldName = usersDb.get(message.member.id)
			if (!oldName) {
				message.channel.send(`${message.member} You do not have a name set with this bot.`)
				return
			}

			usersDb.put(message.member.id)
			message.channel.send(`${message.member} Your previous name \`${oldName}\` is no longer with you and this bot. You will be removed from the hiscore data within 24hours.`)
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
				message.channel.send(`Invalid username: \`${newName}\``)
				return
			}

			const oldName = usersDb.get(message.member.id)
			if (oldName && oldName === newName) {
				message.channel.send(`${message.member} You have already set you username to \`${newName}\``)
				return
			}

			usersDb.put(message.member.id, newName)

			let output = `${message.member} Your discord account is now linked to the username: \`${newName}\``
			if (oldName) {
				output += `\nYour account was previously linked to the username: \`${oldName}\``
			}
			message.channel.send(output)
			return
		}
		case 'clanhiscore':
		case 'clanhiscores':
		case 'clanhighscore':
		case 'clanhighscores': {
			if (!hasPermissionsInChannel(message.member, message.channel)) {
				message.channel.send(`Sorry ${message.member}, you do not have access to the \`${cmd}\` command`)
				return
			}

			// TODO: Add the ability to choose a specific category or do all.
			const hiscoreData = hiscoresDb.values().sort((a, b) => a.rank - b.rank)

			for (let i = 0; i < Math.min(hiscoreData.length, 25); i++) {
				const element = hiscoreData[i];
				console.log(element);
			}
			return
		}
	 }
}
