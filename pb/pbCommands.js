const Discord = require('discord.js')
const {bossCategoryAliases, bossCategories } = require('./bossCategories.js');

const mysql = require('mysql')

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "boss_pbs",
    multipleStatements: true
  });

let output = '';
function pb(message, args) {
            //Checks if user selected a boss
			if(args[0]== undefined || args[0] == ''){
				output = 'Missing boss'
				message.channel.send(output)
				return
			}

			const boss = bossCategoryAliases(args[0]);
            // Checks if user selected boss has PB's that are being tracked in the database
			let validBoss = false
			for(let i = 0; i < bossCategories.length; i++){
				if (bossCategories[i] == boss){
					validBoss = true;
					break
				}
			}
			if (validBoss == false){
				output = 'invalid boss selected'
				message.channel.send(output)
				return
			}
            // Queries database for user selected boss, orders by kill time then creaes an embed as an output
			let query = `SELECT * FROM boss_kills WHERE boss = "${boss}" ORDER BY kill_time`

            con.query(query, (err,res) =>{
				if (err) throw err
                //Sets the maximum number to players to be outputted
				let maxCount = 10;
				output = createEmbed()
				.setTitle(`${boss} Personal Bests`)
				.setDescription(`Kill Time is H:MM:SS.s `)
                    //global discord emojis
                    let emojiArray = [`:first_place:\n`,`:second_place:\n`,`:third_place:\n`,`:four: \n`,`:five:\n`,`:six:\n`,`:seven:\n`,`:eight:\n`,`:nine:\n`, `:keycap_ten:`]
					let rankValue = ``
					let playerName = ``
					let killTime =``
                    let pbValue = ``
					let imageValue = ``
                    //Loops through  *maxCount* results grabbing player name, kill time, date and image link
					for (let i = 0; i < maxCount; i++){
                        // Checks to make sure results exist. return if doesn't
						if(res[0] == undefined){
							output = 'No results yet for that boss!'
							message.channel.send(output)
							return
						}
                        //Checks if there are < maxCount results and breaks the loop early if so
						if (res[i] == undefined){
							break
						}
                        //Set rankValue to empty string and uncomment code 1 line below if numbers wanted instead of emojis
						// 	rankValue += `${i+1}\n`
                        if( i < 10){
                            rankValue += emojiArray[i]
                        }
                        else {
                            rankValue += `${i+1}\n`
                        }
						playerName += `${res[i].player_name}\n`
						killTime += `${res[i].kill_time}\n`
                        pbValue += `${res[i].pb_date}\n`
						imageValue += `[Link](${res[i].image_link})\n`
					}
                        // Discord limits embeds to 3 columns per row. Rank column duplicated for better styling
						output = output.addFields(
							{name: `Rank`, value: `${rankValue}`, inline: true},
							{name: `Player Name`, value: `${playerName}`, inline: true},
							{name: `Kill Time`, value: `${killTime}`, inline: true},
                            {name: `Rank`, value: `${rankValue}`, inline: true},
							{name: 'Date', value: `${pbValue}`, inline: true},
							{name: 'Image Link', value: `${imageValue}`, inline: true}
							)					
					message.channel.send(output)
			})
			return
}

function myPBs(message) {
    //Discord ID of the user who used the command
    const User = message.member.id
    output = createEmbed()
        .setTitle(`Overall IronScape Rankings`)
        .setDescription(`All PB's for <@${User}>`)
            let bossValue = ``
            let rankValue = ``
            let killTime = ``
    //Loops through every boss
    for(let i = 0; i < bossCategories.length; i++){
            let currentBoss = bossCategories[i]
            let query = `SELECT * FROM boss_kills WHERE boss = "${currentBoss}" ORDER BY kill_time`
            //Queries kill time for each boss sorted by kill time
            con.query(query, (err, res) => {
                if (err) throw err
                //Inside loop to loop through all results for each boss
                for(let j = 0; j < res.length; j++){
                    //Checks to make sure result exists and isn't empty
                    if(res[0] == undefined || res[0] == []){
                        break
                    }
                    // Checks if user has an entry for the boss's results and adds to output variables and breaks loop early if so
                if(res[j].discord_id == User){
                    bossValue += `${currentBoss}\n`
                        rankValue += `${j+1}\n`
                        killTime += `${res[j].kill_time}\n`
                         break
                }
                }
                
                
            })
    }
    //Sets timeout to make sure queries finish before the output is returned
    setTimeout( () => {
        //checks to make sure user has at least 1 result
        if(bossValue,rankValue,killTime != ''){
        output = output.addFields(
            {name: 'Boss', value:`${bossValue}`, inline: true}, 
            {name: 'Rank', value:`${rankValue}`, inline: true},
            {name: 'Kill Time', value:`${killTime}`, inline: true},
        
            )
            message.channel.send(output)
        }
        else{
            output = `You do not have any pb's stored in the database <@${User}>`
            message.channel.send(output)
        }
    
    }, 3000)
}

function addPB(message,args) {
    const discordName = message.member.id
    //boss user is submitting a pb for, checks aliases for a match
    const boss = bossCategoryAliases(args[0])
    let killTime = args[1]
    let link = args[2]
    let playerAlias = args.length > 1 ? args.splice(3).join(" ").trim() : undefined
    //string needs to start with 0:00:00 to be valid
    const timeRegex = new RegExp("^[0-9][:][0-5][0-9][:][0-5][0-9]")
    //string needs to start http(s) or <http. (Discord uses <> to supress image previews)
    const urlRegex = new RegExp("(^[<]?http[s]?:\/{2})")

    const pbDate = new Date().toLocaleDateString()

    let output = '';
    //Checks that user included all required arguments
if (boss == null || playerAlias == '' || link == null || killTime == null){
    output = 'Missing boss, kill time of boss, screenshot link, or player nickname'
    message.channel.send(output)
    return
}
    //validates the kill time they submitted matches timeRegex
if (killTime.match(timeRegex) === null) {
    output = 'invalid time submission. please use H:MM:SS.s (hour, minutes, seconds, fractional seconds) format'
    message.channel.send(output)
return
}
    //validates user submitted link starts with http(s) or <http(s)>
if (link.match(urlRegex) == null){
    output = 'Incomplete URL. Please use a complete URL with http(s) included'
     message.channel.send(output)
return
    }
    //Checks if user submitted boss is valid
    let validBoss = false
    for(let i = 0; i < bossCategories.length; i++){
    if (bossCategories[i] == boss){
    validBoss = true;
    break
}
}
if (validBoss == false){
    output = 'invalid boss selected'
    message.channel.send(output)
return
}
//  Insert users pb for boss chosen into database. replaces old entry if it exists. This limits each user to 1 entry per boss, but still allows them to have entries for every boss
    let query = `REPLACE INTO boss_kills(discord_id,player_name,boss,kill_time,pb_date,image_link) VALUES ("${discordName}","${playerAlias}","${boss}","${killTime}","${pbDate}","${link}")`
    con.query(query, (err,res) =>{
        if (err) throw err
            output = ` **${boss}** PB added or updated for **<@${discordName}>**`
            message.channel.send(output)
})
}

function deletePB(message, args) {
            let discordName = message.member.id
			const boss = bossCategoryAliases(args[0]);

			if (requestBoss == null){
				output = 'Select a boss to remove that boss or `all` to remove all of your pb`s'
				message.channel.send(output)
				return
			}
            //query to delete an entry from the user for a specific boss
			let query = `DELETE FROM boss_kills WHERE discord_id = "${discordName}" AND boss = "${boss}"`
			let validBoss = false
            //Allows users to delete all their entries at once. changes query to delete all entries from user
			if(requestBoss == 'all'){
				validBoss = true
				query = `DELETE FROM boss_kills WHERE discord_id = "${discordName}" LIMIT 20`
			}
            //Check to make sure boss selected is valid
			for(let i = 0; i < bossCategories.length; i++){
				if (bossCategories[i] == boss){
					validBoss = true;
					break
				}
			}

			if (validBoss == false){
				output = 'invalid boss selected'
				message.channel.send(output)
				return
			}
			
			
			con.query(query, (err,res) => {
				if (err) throw err
				output = ` **${boss}** PB removed for <@${discordName}>`
				message.channel.send(output)
			})
}

function createEmbed () {
	return new Discord.MessageEmbed().setColor(0xec644b)
}

module.exports = {
    pb,
    myPBs,
    addPB,
    deletePB,
    createEmbed
}