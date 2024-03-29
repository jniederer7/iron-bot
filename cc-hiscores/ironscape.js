const Discord = require('discord.js')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../googleCredentials.json');
const pointRankups = [0,4,8,12,20,28,36,47,58,69,82]
const hiscores = require('../hiscores/hiscores.js');
const { getPlayer } = require('../hiscores/hiscores.js');
const { Category, getCategoryByShortName, categories } = require('../hiscores/categories')
const { Endpoints, getEndpointByShortName } = require('../hiscores/endpoints')

const easyTaskList = ['Firecape',
    'RFD Complete',
    'Easy Combat Tasks',
    'Beserker Ring',
    'All Medium Diaries done',
    'Imbued Slayer Helm',
    '5 Skilling outfits (All experience boosting outfits including rogues and graceful)',
    'Ranger boots or complete god book',
    'Complete barrows set']
const mediumTaskList = ['Quest Cape',
    'Trident obtained',
    'Zulrah Unique (One of: Tanzanite fang; Magic Fang; Serpentine Visage)',
    'CoX unique (NOT including the Torn Prayer Scroll and Teleport Tablet)',
    'Any slayer boss unique (cerb crystal; unsired; etc.)',
    'Ava\'s assembler',
    'Any zenyte jewelery',
    'All hard diaries done',
    '1000 Farming Contracts',
    'Medium Combat Tasks',
    '500 Collection Log Slots',
    'Dragon Pickaxe obtained']
const hardTaskList = ['Diary Cape',
    'Infernal Cape',
    '10 Pets',
    'ToB unique',
    'Nightmare or Nex unique',
    'Zulrah complete (Tanzanite Fang and Magic Fang and Serpentine Visage)',
    'Dragon hunter lance',
    'Enhanced crystal weapon seed or crystal tool seed',
    'Ring of Endurance',
    'Hard and Elite Combat Tasks',
    'ToA Unique',
    'Champions cape']
const eliteTaskList = ['Master Combat Tasks',
    'ToB Master (1k Tob kc or item completion w/ pet)',
    'CoX Master (1k CoX kc or item completion w/ pet)',
    'ToA Master (All uniques and pet)',
    '1000 Collection Log Slots',
    '20 pets',
    'All GWD uniques complete']

const ironscapeMembers = {};
const ironscapeMemberTasks = {};
let ironscapeTimestamp;


async function fetchIronscapeSheet() {
    // Clear existing ironscapeMembers
    Object.keys(ironscapeMembers).forEach(key => {
        delete ironscapeMembers[key];
    });

    Object.keys(ironscapeMemberTasks).forEach(key => {
        delete ironscapeMemberTasks[key];
    });

    // Update timestamp
    ironscapeTimestamp = Date.now();

    // Request google sheet
    const doc = new GoogleSpreadsheet('1QNBJ-bYt5lTGLrOioo80Lha330TfxqW1HgbffpkgSPk'); //Main spreadsheet
    //const doc = new GoogleSpreadsheet('1yvoCZc0fhdr9IxSZdDQQXmpL0n8b2mcNPfBl1IldVJY'); //Test spreadsheet
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });
    
    await doc.loadInfo(); 
    const sheet = doc.sheetsByTitle['Members'];
    const rows = await sheet.getRows({offset: 1, limit: 1000});
    // Ignore header row and limit to first 500 rows after that
    for (var i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        ironscapeMembers[row["Applicant Name"].toLowerCase()] = {points: row["Points"], rank: row["Rank"]};
    }

    const appSheet = doc.sheetsByTitle['Applications'];
    const appRows = await appSheet.getRows({offset: 1, limit: 500});
    // Ignore header row and limit to first 500 rows after that
    for (var i = appRows.length - 1; i >= 0; i--) {
        const appRow = appRows[i];
        ironscapeMemberTasks[appRow["Timestamp"]] = {RSN: appRow["Enter your RSN"], 
                                                  easyTasks: appRow["Select All Easy Tasks You've Completed"],
                                                  mediumTasks: appRow["Select All Medium Tasks You've Completed"],
                                                  hardTasks: appRow["Select All Hard Tasks You've Completed"],
                                                  eliteTasks: appRow["Select All Elite Tasks You've Completed"]
                                                  };
    }

    //console.log(`num  apps rows ${appRows.length}`)
}

async function ironscapelookup(message, cmd, args) {
    // Been 15 minutes since last lookup?
    if (args[0] == undefined){
        message.channel.send(`Please include a RSN to look up`)
        return
    }
    if (ironscapeTimestamp == undefined || (Date.now() - ironscapeTimestamp) >= 900000) {
        await fetchIronscapeSheet();
    }

    let name = args.join(" ").trim().toLowerCase();
    let member = ironscapeMembers[name];

    if (member == undefined) {
        message.channel.send(`${name} is not an Ironscape member. If you have changed your RSN in game please contact an IronScape mod to update your spreadsheet RSN`);
        return;
    }

    let pointsUntilRankup = ""
    for(i = 0; i < pointRankups.length; i++){
        if(member.points >= pointRankups[pointRankups.length - 1])
        {
            pointsUntilRankup = "You have reached the top rank!"
            break
        }
        if(member.points > pointRankups[i] && member.points < pointRankups[i + 1])
        {
            let pointsRemaining = pointRankups[i + 1] - member.points
            pointsUntilRankup = `You need **${pointsRemaining}** points to reach the next rank`
            break
        }
    }

    message.channel.send(`**${name}** has **${member.points}** points with a rank of **${member.rank}**. ${pointsUntilRankup}`);
}

async function ironscapeTasks(message, cmd, args){
    // Been 15 minutes since last lookup?
    if (args[0] == undefined){
        message.channel.send(`Please include a RSN to look up`)
        return
    }
    if (ironscapeTimestamp == undefined || (Date.now() - ironscapeTimestamp) >= 900000) {
        await fetchIronscapeSheet();
    }

    let name = args.join(" ").trim().toLowerCase();
    let member = ironscapeMembers[name];

    if (member == undefined) {
        message.channel.send(`${name} is not an Ironscape member. If you have changed your RSN in game please contact an IronScape mod to update your spreadsheet RSN`);
        return;
    }

    let memberKey = []
    //Get all the applications member has sent in
    Object.keys(ironscapeMemberTasks).forEach(key => {
        //console.log(ironscapeMemberTasks[key].RSN)
        let rsn = ironscapeMemberTasks[key].RSN.trim().toLowerCase()
        if(rsn == name){
            //console.log(name)
            //console.log(key)
            memberKey.push(key)
        }
    });
    
    //Get the latest application and print out tasks complete/incomplete from the sheet and the hiscore tasks
    if(memberKey.length > 0){
        let correctIndex = determineEarlisetDate(memberKey)

        let completeEasyHsTasks = []
        let incompleteEasyHsTasks = []
        let completeMediumHsTasks = []
        let incompleteMediumHsTasks = []
        let completeHardHsTasks = []
        let incompleteHardHsTasks = []
        let completeEliteHsTasks = []
        let incompleteEliteHsTasks = []
        await getHighscoreTasks(name,completeEasyHsTasks,incompleteEasyHsTasks,completeMediumHsTasks,incompleteMediumHsTasks,
                            completeHardHsTasks,incompleteHardHsTasks,completeEliteHsTasks,incompleteEliteHsTasks)

        let easyCompleteDelim = ""
        let mediumCompleteDelim = ""
        let hardCompleteDelim = ""
        let eliteCompleteDelim = ""

        if(completeEasyHsTasks.length > 0 && ironscapeMemberTasks[correctIndex].easyTasks.length > 0){
            easyCompleteDelim = ","
        }
        if(completeMediumHsTasks.length > 0 && ironscapeMemberTasks[correctIndex].mediumTasks.length > 0){
            mediumCompleteDelim = ","
        }
        if(completeHardHsTasks.length > 0 && ironscapeMemberTasks[correctIndex].hardTasks.length > 0){
            hardCompleteDelim = ","
        }
        if(completeEliteHsTasks.length > 0 && ironscapeMemberTasks[correctIndex].eliteTasks.length > 0){
            eliteCompleteDelim = ","
        }

        message.channel.send(`__**Tasks Completed**__\n\n**Easy Tasks** ${ironscapeMemberTasks[correctIndex].easyTasks}${easyCompleteDelim}${completeEasyHsTasks}
                            \n**Medium Tasks** ${ironscapeMemberTasks[correctIndex].mediumTasks}${mediumCompleteDelim}${completeMediumHsTasks}
                            \n**Hard Tasks** ${ironscapeMemberTasks[correctIndex].hardTasks}${hardCompleteDelim}${completeHardHsTasks}
                            \n**Elite Tasks** ${ironscapeMemberTasks[correctIndex].eliteTasks}${eliteCompleteDelim}${completeEliteHsTasks}\n\n`)

        let completedEasyArray = ironscapeMemberTasks[correctIndex].easyTasks.split(',').map(i=>i.trim());
        let completedMediumArray = ironscapeMemberTasks[correctIndex].mediumTasks.split(',').map(i=>i.trim());
        let completedHardArray = ironscapeMemberTasks[correctIndex].hardTasks.split(',').map(i=>i.trim());
        let completedEliteArray = ironscapeMemberTasks[correctIndex].eliteTasks.split(',').map(i=>i.trim());

        let incompleteEasyTasks = []
        for(var i = 0; i < easyTaskList.length; i++){
            if(!completedEasyArray.includes(easyTaskList[i].trim())){
                incompleteEasyTasks.push(easyTaskList[i])            
            }
        }

        let incompleteMediumTasks = []
        for(var i = 0; i < mediumTaskList.length; i++){
            if(!completedMediumArray.includes(mediumTaskList[i].trim())){
                incompleteMediumTasks.push(mediumTaskList[i])
            }
        }

        let incompleteHardTasks = []
        for(var i = 0; i < hardTaskList.length; i++){
            if(!completedHardArray.includes(hardTaskList[i].trim())){
                incompleteHardTasks.push(hardTaskList[i])
            }
        }

        let incompleteEliteTasks = []
        for(var i = 0; i < eliteTaskList.length; i++){
            if(!completedEliteArray.includes(eliteTaskList[i].trim())){
                incompleteEliteTasks.push(eliteTaskList[i])            
            }
        }

        let easyIncompleteDelim = ""
        let mediumIncompleteDelim = ""
        let hardinCompleteDelim = ""
        let eliteIncompleteDelim = ""

        if(incompleteEasyHsTasks.length > 0 && incompleteEasyTasks.length > 0){
            easyIncompleteDelim = ","
        }
        if(incompleteMediumHsTasks.length > 0 && incompleteMediumTasks.length > 0){
            mediumIncompleteDelim = ","
        }
        if(incompleteHardHsTasks.length > 0 && incompleteHardTasks.length > 0){
            hardinCompleteDelim = ","
        }
        if(incompleteEliteHsTasks.length > 0 && incompleteEliteTasks.length > 0){
            eliteIncompleteDelim = ","
        }
        message.channel.send(`__**Tasks Incomplete**__\n\n**Easy Tasks** ${incompleteEasyTasks}${easyIncompleteDelim}${incompleteEasyHsTasks} 
                            \n**Medium Tasks** ${incompleteMediumTasks}${mediumIncompleteDelim}${incompleteMediumHsTasks} 
                            \n**Hard Tasks** ${incompleteHardTasks}${hardinCompleteDelim}${incompleteHardHsTasks}
                            \n**Elite Tasks** ${incompleteEliteTasks}${eliteIncompleteDelim}${incompleteEliteHsTasks}\n\n`)    
    }
}

function determineEarlisetDate(dates){
    //Format is 5/22/2021 21:49:44
    let latestDateIndex = 0
    let latestDate = new Date()
    for (var i = 0; i < dates.length; i++){
        const splitTime1 = dates[i].split(" ")
        const day1 = splitTime1[0].split("/")
        const time1 = splitTime1[1].split(":")
    
        let newDate1 = new Date(day1[2], day1[0], day1[1], time1[0], time1[1], time1[2], 0)
        if(i > 0 && newDate1 > latestDate){
            latestDate = newDate1
            latestDateIndex = i
        }
        else if(i == 0){
            latestDate = newDate1
        }
    }

    return dates[latestDateIndex]
}

async function getHighscoreTasks(username,completeEasyHsTasks,incompleteEasyHsTasks,completeMediumHsTasks,incompleteMediumHsTasks,
                                    completeHardHsTasks,incompleteHardHsTasks,completeEliteHsTasks,incompleteEliteHsTasks){
    try{
        //console.log(`Looking up ${username}`)
        let playerData = await getPlayer(username)
        const overallHiscoreResult = playerData[Category.OVERALL] //Contains rank, level, exp. Use hiscoreResult.rank to access
        //console.log(overallHiscoreResult)

        //EASY TIER
        //1500 Total task
        if(overallHiscoreResult.level >= 1500){
            completeEasyHsTasks.push("1,500 Total")
        }
        else{
            incompleteEasyHsTasks.push("1,500 Total")
        }

        //Any 99 skill
        let any99Skill = false
        for(var i = 1; i <= 23; i++){
            const skill = playerData[categories[i]]
            if(skill.level == 99){
                completeEasyHsTasks.push("Get a level 99")
                any99Skill = true
                break
            } 
        }
        if(!any99Skill){
            incompleteEasyHsTasks.push("Get a level 99")
        }

        //100 Clues
        const overallClues = playerData[Category.CLUE_SCROLL_ALL]
        if(overallClues.level >= 100){
            completeEasyHsTasks.push("100 Clues")
        }
        else{
            incompleteEasyTasks.push("100 Clues")
        }

        //Final tier of farming guild, 85 farming and assuming they have the favor
        const farmingSkill = playerData[Category.FARMING]
        if(farmingSkill.level >= 85){
            completeEasyHsTasks.push("Farming Guild Final Tier Access")
        }
        else{
            incompleteEasyHsTasks.push("Farming Guild Final Tier Access")
        }

        //MEDIUM TASKS
        //2000 total
        if(overallHiscoreResult.level >= 2000){
            completeMediumHsTasks.push("2,000 Total")
        }
        else{
            incompleteMediumHsTasks.push("2,000 Total")
        }

        //500 clues
        if(overallClues.level >= 500){
            completeMediumHsTasks.push("500 Clues")
        }
        else{
            incompleteMediumHsTasks.push("500 Clues")
        }

        //Max POH pool, assuming 82 con and 82 herb
        const constructionSkill = playerData[Category.CONSTRUCTION]
        const herbloreSkill = playerData[Category.HERBLORE]
        if(constructionSkill.level >= 82 && herbloreSkill.level >= 82){
            completeMediumHsTasks.push("Max POH Pool")
        }
        else{
            incompleteMediumHsTasks.push("Max POH Pool")
        }

        //HARD TIER
        //2,200 Total
        if(overallHiscoreResult.level >= 2200){
            completeHardHsTasks.push("2,200 Total")
        }
        else{
            incompleteHardHsTasks.push("2,200 Total")
        }

        //1,000 Clues
        if(overallClues.level >= 1000){
            completeHardHsTasks.push("1,000 Clues")
        }
        else{
            incompleteHardHsTasks.push("1,000 Clues")
        }

        //ELITE TASKS
        //2277 Total
        if(overallHiscoreResult.level >= 2277){
            completeEliteHsTasks.push("2,277 Total")
        }
        else{
            incompleteEliteHsTasks.push("2,277 Total")
        }
        //All clue milestones
        const beginnerClues = playerData[Category.CLUE_SCROLL_BEGINNER]
        const easyClues = playerData[Category.CLUE_SCROLL_MEDIUM]
        const mediumClues = playerData[Category.CLUE_SCROLL_MEDIUM]
        const hardClues = playerData[Category.CLUE_SCROLL_HARD]
        const eliteCLues = playerData[Category.CLUE_SCROLL_ELITE]
        const masterClues = playerData[Category.CLUE_SCROLL_MASTER]

        if(beginnerClues.level >= 600 && easyClues.level >= 500 && mediumClues.level >= 400 && hardClues.level >= 300 && 
            eliteCLues.level >= 200 && masterClues.level >= 100){
            completeEliteHsTasks.push(" All clue milestones")
        }
        else{
            incompleteEliteHsTasks.push(" All clue milestones")
        }

    }
    catch(err){
        console.log(err)
    }

}
module.exports = {
    ironscapelookup,
    ironscapeTasks
}