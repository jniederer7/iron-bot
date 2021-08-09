const Discord = require('discord.js')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../googleCredentials.json');

const ironscapeMembers = {};
let ironscapeTimestamp;


async function fetchIronscapeSheet() {
    // Clear existing ironscapeMembers
    Object.keys(ironscapeMembers).forEach(key => {
        delete ironscapeMembers[key];
    });

    // Update timestamp
    ironscapeTimestamp = Date.now();

    // Request google sheet
    const doc = new GoogleSpreadsheet('1QNBJ-bYt5lTGLrOioo80Lha330TfxqW1HgbffpkgSPk');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });
    
    await doc.loadInfo(); 
    const sheet = doc.sheetsByTitle['Members'];
    const rows = await sheet.getRows({offset: 1, limit: 500});
     // Ignore header row and limit to first 500 rows after that
     console.log(`num rows ${rows.length}`)
    for (var i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        ironscapeMembers[row["Applicant Name"].toLowerCase()] = {points: row["Points"], rank: row["Rank"]};
    }
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

    message.channel.send(`**${name}** has **${member.points}** points with a rank of **${member.rank}**`);
}

module.exports = {
    ironscapelookup
}