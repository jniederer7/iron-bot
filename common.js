const config = require('./config')
const usersDb = require('./database')(config.databases.users)
const hiscoresDb = require('./database')(config.databases.hiscores)

module.exports = {
	usersDb,
	hiscoresDb
}
