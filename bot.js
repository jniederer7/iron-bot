const Discord = require('discord.js')
const logger = require('winston')
const config = require("./config")
const commands = require("./commands")
const { usersDb, hiscoresDb, removeDeprecatedUserData, updateUsersHiscoreData, timedQueue } = require('./common')

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
	if (keys.length <= 0) {
		updatingHiscores = false
		return
	}
	updateUsersHiscoreData(keys, client)
		.then(() => {
			updatingHiscores = false
		},
		(err) => {
			logger.debug(`Error updating all hiscore data: ${err}`)
			updatingHiscores = false
		})
}

function removeDeprecatedUsersHiscoreData() {
	for (const key of hiscoresDb.keys()) {
		removeDeprecatedUserData(key)
	}
}

let processingQueue = false;
function processTimedQueue() {
	if (updatingHiscores || processingQueue) {
		return
	}

	const queue = timedQueue.values()
	if (queue.length <= 0) {
		return
	}
	processingQueue = true

	// We grab a snapshot of the queue and filter for old responses now even though they could be old enough when we reach them in the queue
	// This is so we can have the below code be re-useable and not have to duplicate a majority of it
	// We should be attempting to process the queue frequently enough that this should be a non-issue but this can cause additional time
	// The additional time should be at most double the interval period for a single user
	// For example a 30second interval would max at 1 additional minute compared to if didn't pre-filter
	updateUsersHiscoreData(queue, client)
		.then(() => {
			processingQueue = false
		},
		(err) => {
			logger.debug(`Error processing queue data: ${err}`)
			processingQueue = false
		})
}

// Initialize Discord Bot
const client = new Discord.Client()
client.on('ready', function (evt) {
	logger.info(`Logged in as: ${client.user.tag} - (${client.user})`)

	// Call methods to run on startup as `setInterval` waits the specified delay before invoking them
	updateHiscoreData() 
	client.setInterval(updateHiscoreData, 30 * 1000) // Every 30 seconds attempt to update hiscore data

	removeDeprecatedUsersHiscoreData()
	client.setInterval(removeDeprecatedUsersHiscoreData, 60 * 60 * 1000) // Every 60 minutes TODO: Potentially change this delay to be very big, like every 6-24hrs?

	processTimedQueue() 
	client.setInterval(processTimedQueue, 30 * 1000) // Every 30 seconds
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
