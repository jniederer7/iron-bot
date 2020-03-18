const Discord = require('discord.js')
const logger = require('winston')
const config = require("./config")
const commands = require("./commands")

const IRONMAN_HISCORE_ENDPOINT = 'https://secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player='

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
    colorize: true
})
logger.level = 'debug'

// Initialize Discord Bot
var client = new Discord.Client()
client.on('ready', function (evt) {
	logger.info(`Logged in as: ${client.user.tag} - (${client.user})`)
	// TODO: Add system to continiously loop over users database and grab data
})

client.on('message', message => {
	if (message.author.bot) {
		return
	}
	
	if (!message.content.startsWith(config.prefix)) {
		return
	}

	const args = message.content.slice(config.prefix.length).trim().split(" ")
	const cmd = args.shift().toLowerCase()
	logger.debug(`Received cmd: ${cmd} | args: ${args}`)
	commands(message, cmd, args)
})

client.on('error', logger.error)

client.login(config.token)
  .then(token => logger.info(`Successfully logged in with token: ${token}`))
  .catch(err => logger.error(`Failed to authenticate: ${err}`))
