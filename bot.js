const Discord = require('discord.js')
const logger = require('winston')
const config = require("./config")
const commands = require("./commands")
const hiscoresApi = require('./hiscores/hiscores')
const { usersDb, hiscoresDb, removeDeprecatedUserData } = require('./common')

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
    colorize: true
})
logger.level = 'debug'

let updatingHiscores = false
let specialIronmanFlag = false
function updateHiscoreData() {
	if (updatingHiscores) {
		return
	}
	updatingHiscores = true

	const keys = usersDb.keys()
	if (keys.length <= 0) {
		updatingHiscores = false
		return
	}
	const keysLoop = (i) => {
		client.setTimeout(() => {
			if (i > keys.length) {
				i = keys.length - 1
				specialIronmanFlag = false
			}
			
			const key = keys[i]
			if (!key) {
				updatingHiscores = false
				specialIronmanFlag = false
				return
			}

			const user = usersDb.get(keys[i])
			if (!user) {
				updatingHiscores = false
				specialIronmanFlag = false
				return
			}

			// Incase some1 has just set their type we need to continue the loop early.
			if (!user.name) {
				specialIronmanFlag = false
				if (--i >= 0) {
					keysLoop(i)
				}
				return
			}
			
			let endpointObj = specialIronmanFlag ? hiscoresApi.Endpoints.IRONMAN : hiscoresApi.Endpoints[user.endpoint]
			if (user.endpoint === hiscoresApi.Endpoints.NORMAL.key) {
				endpointObj = hiscoresApi.Endpoints.NORMAL
			}
			hiscoresApi.getPlayer(user.name, endpointObj.endpoint)
				.then(resp => {
					const data = hiscoresDb.get(keys[i]) || {}
					data[endpointObj.key] = resp;
					hiscoresDb.put(keys[i], data)
					specialIronmanFlag = !specialIronmanFlag && (user.endpoint === hiscoresApi.Endpoints.HARDCORE_IRONMAN.key || user.endpoint === hiscoresApi.Endpoints.ULTIMATE_IRONMAN.key)
				})
				.catch(error => {
					if (!error.response) {
						logger.debug(`Error receiving response: ${error.message}`)
						return
					}

					const status = error.response.status
					if (status === 404) {
						logger.debug(`404 error, potentially the wrong account type? Endpoint: ${endpointObj.key} | Name: ${user.name}`)
					} else if (!error.request) {
						// Something happened in setting up the request that triggered an Error
						logger.debug(`Error setting up request ${error.message}`);
					} else {
						logger.debug(`Unknown error: ${error.message}`)
					}
				})
				// Wait for request to complete or fail to further add to delay
				.finally(() => {
					if (specialIronmanFlag || (--i >= 0)) {
						keysLoop(i)
					} else {
						updatingHiscores = false
						specialIronmanFlag = false
					}
				})
		}, 10 * 1000)
	}
	keysLoop(keys.length - 1)
}

function removeDeprecatedUsersHiscoreData() {
	for (const key of hiscoresDb.keys()) {
		removeDeprecatedUserData(key)
	}
}

// Initialize Discord Bot
const client = new Discord.Client()
client.on('ready', function (evt) {
	logger.info(`Logged in as: ${client.user.tag} - (${client.user})`)

	updateHiscoreData() // Call on startup as the interval will invoke after waiting for the initial delay
	client.setInterval(updateHiscoreData, 30 * 1000) // Every 15 minutes attempt to update hiscore data if we have stopped checking

	removeDeprecatedUsersHiscoreData()
	client.setInterval(removeDeprecatedUsersHiscoreData, 60 * 60 * 1000) // Every 60 minutes TODO: Potentially change this delay to be very big, like every 6-24hrs?
})

client.on('message', message => {
	if (message.author.bot) {
		return
	}

	if (config.channels.length > 0 && config.channels.indexOf(message.channel.name) === -1) {
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
