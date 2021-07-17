const bossCategories = [
    "1 Jad Challenge",
    "6 Jad Challenge",
	"Alchemical hydra",
	"Solo Chambers of Xeric",
	"Solo Chambers of Xeric: CM",
	"Grotesque Guardians",
    "Hallowed Sepulchre",
	"Hespori",
	"Mimic",
	"Solo Nightmare",
    "Phosani's Nightmare",
	"Gauntlet",
	"Corrupted Gauntlet",
	"Tz-kal-zuk",
	"Tz-tok-jad",
	"Vorkath",
	"Zulrah"
]

bossCategoryAliases = (bossName) => {
    switch (bossName.toLowerCase().trim()) {
        case "1jad":
            return "1 Jad Challenge"
        case "6jad":
        case "6jads":
            return "6 Jad Challenge"
        case "hydra":
            return "Alchemical hydra"
        case "cox":
		case "xeric":
		case "chambers":
		case "olm":
		case "raids":
            return "Solo Chambers of Xeric"
        case "coxcm":
        case "xericcm":
        case "chamberscm":
        case "olmcm":
        case "raidscm":
        case "cm":
            return "Solo Chambers of Xeric: CM"
        case "dusk":
        case "dawn":
        case "gargs":
        case "guardians":
            case "gg":
            case "ggs":
            return "Grotesque Guardians"
        case "hs":
        case "sep":
        case "sepulchre":
            return "Hallowed Sepulchre"
        case "hesp":
        case "bank":
            return "Hespori"
        case "the nightmare":
        case "nm":
            return "Solo Nightmare"
        case "phosaninm":
        case "phosani":
        case "phsoanis":
        case "hmnm":
        case "hardnm":
            return "Phosani's Nightmare"
        case "the gauntlet":
		case "gaunt":
            return "Gauntlet"
        case "cgauntlet":
		case "cgaunt":
		case "cg":
		case "gauntletc":
		case "gauntletc":
            return "Corrupted Gauntlet"
        case "zuk":
		case "inferno":
            return "Tz-kal-zuk"
        case "jad":
		case "fightcave":
		case "firecape":
            return "Tz-tok-jad"
        case "vork":
            return "Vorkath"
        default:
            return capitalize(bossName.toLowerCase().trim())    
            
    }
}

function capitalize(string) {
	if (!string) {
		return string;
	}

	if (string.length <= 1) {
		return string.toUpperCase();
	}

	return string.substring(0, 1).toUpperCase() + string.substring(1)
}

module.exports = {
    bossCategories,
    bossCategoryAliases
}