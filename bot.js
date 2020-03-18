const Discord = require('discord.js')
const logger = require('winston')
const config = require("./config")
const commands = require("./commands")
const hiscoresApi = require('./hiscores/hiscores')

const IRONMAN_HISCORE_ENDPOINT = 'https://secure.runescape.com/m=hiscore_oldschool_ironman/index_lite.ws?player='
const usersDb = require('./database')(config.databases.users)
const hiscoresDb = require('./database')(config.databases.hiscores)

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
    colorize: true
})
logger.level = 'debug'

let updatingHiscores = false
function updateHiscoreData() {
	if (updatingHiscores) {
		return
	}
	updatingHiscores = true

	const keys = usersDb.keys()
	const keysLoop = (i) => {
		client.setTimeout(() => {
			if (i > keys.length) {
				i = keys.length - 1
			}
			
			const key = keys[i];
			if (!key) {
				return;
			}

			const username = usersDb.get(keys[i])
			if (!username) {
				return;
			}

			hiscoresApi.getPlayer(username, hiscoresApi.Endpoints.IRONMAN)
				.then(resp => {
					hiscoresDb.put(keys[i], resp)
				})
				.catch(err => console.log(err))
				// Wait for request to complete or fail to further add to delay
				.finally(() => {
					if (--i >= 0) {
						keysLoop(i)
					} else {
						updatingHiscores = false
					}
				})
		}, 10 * 1000)
	}
	keysLoop(keys.length - 1)
}

function removeDeprecatedUsersHiscoreData() {
	for (const key of hiscoresDb.keys()) {
		if (!usersDb.get(key)) {
			hiscoresDb.put(key)
		}
	}
}

// Initialize Discord Bot
const client = new Discord.Client()
client.on('ready', function (evt) {
	logger.info(`Logged in as: ${client.user.tag} - (${client.user})`)

	updateHiscoreData() // Call on startup as the interval will invoke after waiting for the initial delay
	client.setInterval(updateHiscoreData, 15 * 60 * 100) // Every 15 minutes attempt to update hiscore data if we have stopped checking

	removeDeprecatedUsersHiscoreData();
	client.setInterval(removeDeprecatedUsersHiscoreData, 60 * 60 * 1000) // Every 60 minutes TODO: Potentially change this delay to be very big, like every 6-24hrs?
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
