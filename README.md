1. Run `npm install`
2. create a `config.js` file in the root directory and add the following code:
```
module.exports = {
	// This is token used for bot to login, must be from Discord Application who has bot enabled
	token: "your bot token here",
	prefix: "$",
	databases: {
		users: './data/users.json',
		hiscores: './data/hiscore-data.json'
	},
    //If you want to limit the bot to certain channels, otherwise omit
	channels: ['clan-hiscores', 'general', 'app-log'],
}
```
3. Run `node bot.js`

This bot is a work in progress and will be updated for increased functionality over time as needed