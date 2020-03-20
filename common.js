const config = require('./config')
const usersDb = require('./database')(config.databases.users)
const hiscoresDb = require('./database')(config.databases.hiscores)
const hiscoresApi = require('./hiscores/hiscores')

removeDeprecatedUserData = (userID) => {
	// If they deleted themselves remove their hiscore data
	const user = usersDb.get(userID)
	if (!user) {
		hiscoresDb.put(userID)
		return
	}

	// Check all hiscore results and remove any that do not match the users specified name
	const data = hiscoresDb.get(userID)
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

module.exports = {
	usersDb,
	hiscoresDb,
	removeDeprecatedUserData,
}
