module.exports = {
	// This is token used for bot to login, must be from Discord Application who has bot enabled
	token: '',
	prefix: "$",
	databases: {
		users: './data/users.json',
		hiscores: './data/hiscore-data.json'
	},
	channels: ['clan-hiscores', 'general', 'app-log'],
}
