const Discord = require('discord.js')
const {bossCategoryAliases, bossCategories } = require('./bossCategories.js');

const mysql = require('mysql')

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "boss_pbs",
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
            let page = args[1]
            let maxCount = 10;
            let pbPagination = parseInt(page * maxCount - maxCount) || 1
            if (pbPagination < 1) {
                pbPagination = 1
            }
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
			let query = `SELECT * FROM boss_kills WHERE boss = "${boss}" ORDER BY kill_time, pb_date`

            con.query(query, (err,res) =>{
				if (err) throw err
                //Sets the maximum number to players to be outputted
				
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
                        if(res[0] == undefined){
							output = 'No results for this boss yet'
							message.channel.send(output)
							return
						}
                        let paginatedResults = res[i]
                        if(pbPagination > 1){
                        paginatedResults = res[i + pbPagination]

                        if(res[0+pbPagination] == undefined){
							output = `${boss} does not have a page ${page} of results yet`
							message.channel.send(output)
							return
						}
                    }
                        // Checks to make sure results exist. return if doesn't

                        //Checks if there are < maxCount results and breaks the loop early if so
						if (paginatedResults == undefined){
							break
						}
                        //Set rankValue to empty string and uncomment code 1 line below if numbers wanted instead of emojis
						// 	rankValue += `${i+1}\n`
                        if( i < 10 && pbPagination == 1){
                            rankValue += emojiArray[i]
                        }
                        else {
                            rankValue += `${i+pbPagination+1}\n`
                        }
						playerName += `${paginatedResults.player_name}\n`
						killTime += `${paginatedResults.kill_time}\n`
                        pbValue += `${paginatedResults.pb_date}\n`
						imageValue += `[Link](${paginatedResults.image_link})\n`
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

     let query = `select * from boss_kills order by boss, kill_time, pb_date;`
     con.query(query, (err, res) => {
         if (err) throw err
        if (res[0] == undefined){
            output = `no bosses in database`
            message.channel.send(output)
            return
        }
        //sets bossArray to the first result as baseline to match against
        let bossArray = [res[0]]
        for ( let i = 1; i < res.length; i++){
            // if next boss = previous boss push the next boss into the bossArray
                if (res[i].boss == res[i-1].boss){
                    bossArray.push(res[i]);
                    
            }
            if (res[i].boss != res[i-1].boss || i == res.length - 1) {
                // if next boss != current boss, loop through bossArray searching for discord id matching the user
                for( let j = 0; j < bossArray.length; j++){
                    //if a discord id match is found add results for later output then break inner loop
                    if(bossArray[j].discord_id == User){
                        bossValue += `${bossArray[j].boss}\n`
                        rankValue += `${j+1}\n`
                        killTime += `${bossArray[j].kill_time}\n`
                        break
                }
                //reset bossArray to the first result of the next boss to be checked for matches 
            }
            bossArray = [res[i]]
        }
     }
    })
    //Sets timeout to make sure query has finished before the output is returned
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
    
    }, 1000)
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

			if (args[0] == null){
				output = 'Select a boss to remove that boss or `all` to remove all of your pb`s'
				message.channel.send(output)
				return
			}
            //query to delete an entry from the user for a specific boss
			let query = `DELETE FROM boss_kills WHERE discord_id = "${discordName}" AND boss = "${boss}"`
			let validBoss = false
            //Allows users to delete all their entries at once. changes query to delete all entries from user
			if(args[0] == 'all'){
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

function sqlQuery () {
    let query = 'SELECT 1'
    con.query(query, (err, res) =>{
        if (err) throw err
        return
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
    createEmbed,
    sqlQuery
}