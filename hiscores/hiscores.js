const axios = require('axios')

const { Endpoints, getEndpointByShortName } = require('./endpoints')
const { categories, Category, getCategoryByShortName } = require('./categories')
const HiscoreResult = require('./HiscoreResult')

const getPlayer = (username, type = Endpoints.NORMAL.endpoint) => {
	return new Promise((resolve, reject) => {
		if (typeof username !== 'string') {
			return reject(new Error("Username must be a string"))
		}

		axios.get(type + username)
			.then(res => {
				const data = convertHiscoreResultToDataObject(username, res.data)
				resolve(data)
			})
			.catch(reject)
	})
}

const convertHiscoreResultToDataObject = (username, response) => {
	const obj = {username}
	const rows = response.trim().split("\n")
	for (let i = 0; i < rows.length; i++) {
		if (i > categories.length) {
			console.warn("More rows than Categories, the hiscores may have been updated")
			i = rows.length
			continue
		}

		const skill = categories[i]
		const result = rows[i].split(",")
		const data = new HiscoreResult(result[0], result[1], result[3])
		obj[skill] = data
	}

	return obj
}

module.exports = {
	Endpoints,
	getEndpointByShortName,
	Category,
	getCategoryByShortName,
	getPlayer
}
