const logger = require('winston')
const config = require('./config')
const usersDb = require('./database')(config.databases.users)
const hiscoresDb = require('./database')(config.databases.hiscores)
const hiscoresApi = require('./hiscores/hiscores')
const TimedQueue = require('./TimedQueue')
const timedQueue = new TimedQueue()

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console, {
    colorize: true
})
logger.level = 'debug'

removeDeprecatedUserData = (userID) => {
	// If they deleted themselves remove their hiscore data
	const user = usersDb.get(userID)
	if (!user) {
		hiscoresDb.put(userID)
		return
	}

	// Check all hiscore results and remove any that do not match the users specified name
	const data = hiscoresDb.get(userID) || {}
	let change = false
	for (const endpointKey of Object.keys(data)) {
		const hiscoreResult = data[endpointKey]
		const outdatedEndpoint = endpointKey !== user.endpoint

		// Remove the hiscore result if the username doesn't match or its somehow undefined
		// Remove outdated endpoints. Accounts should keep their IRONMAN endpoint unless they have a normal endpoint
		if (!hiscoreResult 
			|| hiscoreResult.username !== user.name
			|| (outdatedEndpoint && (user.endpoint === hiscoresApi.Endpoints.NORMAL.key || endpointKey !== hiscoresApi.Endpoints.IRONMAN.key))
		) {
			change = true
			delete data[endpointKey]
		}
	}

	if (change) {
		hiscoresDb.put(userID, data)
	}
}

updateUsersHiscoreData = (keys, client) => {
	return new Promise((resolve, reject) => {
		if (keys.length <= 0) {
			resolve()
			return
		}

		let specialIronmanFlag = false
		const innerLoop = (i) => {
			setTimeout(() => {
				if (i > keys.length) {
					i = keys.length - 1
					specialIronmanFlag = false
				}
				
				const key = keys[i]
				if (!key) {
					reject(new Error(`Found a non-existent key at index: ${i}`))
					return
				}

				const user = usersDb.get(key)
				if (!user) {
					reject(new Error(`Found a non-existent user for discord id: ${key}`))
					return
				}

				// Incase some1 has just set their type we need to continue the loop early.
				if (!user.name) {
					specialIronmanFlag = false
					if (--i >= 0) {
						innerLoop(i)
					} else {
						resolve()
					}
					return
				}
				
				const endpointObj = specialIronmanFlag ? hiscoresApi.Endpoints.IRONMAN : hiscoresApi.Endpoints[user.endpoint]
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
						// Clear from queue since data has been updated
						if (timedQueue.exists(key)) {
							timedQueue.remove(key)
						}

						if (specialIronmanFlag || (--i >= 0)) {
							innerLoop(i)
						} else {
							resolve()
						}
					})
			}, 10 * 1000)
		}
		innerLoop(keys.length - 1)
	})
}

module.exports = {
	usersDb,
	hiscoresDb,
	removeDeprecatedUserData,
	updateUsersHiscoreData,
	timedQueue,
	logger
}
