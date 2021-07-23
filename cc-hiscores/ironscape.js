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
    const doc = new GoogleSpreadsheet('1bzcpOaVU1J8QFMxyqn5K5A-DnZP5tunjvUgF54Z3R1E');
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });
    
    await doc.loadInfo(); 
    const sheet = doc.sheetsByTitle['Members'];
    const rows = await sheet.getRows({offset: 1, limit: 500}); // Ignore header row and limit to first 500 rows after that
    for (var i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        ironscapeMembers[row["Applicant Name"].toLowerCase()] = {points: row["Points"], rank: row["Rank"]};
    }
}

async function ironscapelookup(message, cmd, args) {
    // Been 15 minutes since last lookup?
    if (ironscapeTimestamp == undefined || (Date.now() - ironscapeTimestamp) >= 900000) {
        await fetchIronscapeSheet();
    }

    let name = args.join(" ").trim().toLowerCase();
    let member = ironscapeMembers[name];

    if (member == undefined) {
        message.channel.send('${name} is not an Ironscape member');
        return;
    }

    message.channel.send(`${name} has ${member.points} points with a rank of ${member.rank}`);
}

module.exports = {
    ironscapelookup
}