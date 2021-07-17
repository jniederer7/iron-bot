const categories = [
	"Overall",
	"Attack",
	"Defence",
	"Strength",
	"Hitpoints",
	"Ranged",
	"Prayer",
	"Magic",
	"Cooking",
	"Woodcutting",
	"Fletching",
	"Fishing",
	"Firemaking",
	"Crafting",
	"Smithing",
	"Mining",
	"Herblore",
	"Agility",
	"Thieving",
	"Slayer",
	"Farming",
	"Runecraft",
	"Hunter",
	"Construction",
	"League points",
	"Bounty hunter hunter",
	"Bounty hunter rogue",
	"Clue scroll (all)",
	"Clue scroll (beginner)",
	"Clue scroll (easy)",
	"Clue scroll (medium)",
	"Clue scroll (hard)",
	"Clue scroll (elite)",
	"Clue scroll (master)",
	"Last man standing",
	"Soul wars zeal",
	"Abyssal Sire",
	"Alchemical hydra",
	"Barrows chests",
	"Bryophyta",
	"Callisto",
	"Cerberus",
	"Chambers of xeric",
	"Chambers of xeric challenge mode",
	"Chaos elemental",
	"Chaos fanatic",
	"Commander zilyana",
	"Corporeal beast",
	"Crazy archaeologist",
	"Dagannoth prime",
	"Dagannoth rex",
	"Dagannoth supreme",
	"Deranged archaeologist",
	"General graardor",
	"Giant mole",
	"Grotesque guardians",
	"Hespori",
	"Kalphite queen",
	"King black dragon",
	"Kraken",
	"Kree'arra",
	"K'ril tsutsaroth",
	"Mimic",
	"Nightmare",
	"Phosani's Nightmare",
	"Obor",
	"Sarachnis",
	"Scorpia",
	"Skotizo",
	"Tempoross",
	"Gauntlet",
	"Corrupted gauntlet",
	"Theatre of blood",
	"Theatre of blood hard mode",
	"Thermonuclear smoke devil",
	"Tz-kal-zuk",
	"Tz-tok-jad",
	"Venenatis",
	"Vetion",
	"Vorkath",
	"Wintertodt",
	"Zalcano",
	"Zulrah",
]

const Category = {
	OVERALL: categories[0],
	ATTACK: categories[1],
	DEFENCE: categories[2],
	STRENGTH: categories[3],
	HITPOINTS: categories[4],
	RANGED: categories[5],
	PRAYER: categories[6],
	MAGIC: categories[7],
	COOKING: categories[8],
	WOODCUTTING: categories[9],
	FLETCHING: categories[10],
	FISHING: categories[11],
	FIREMAKING: categories[12],
	CRAFTING: categories[13],
	SMITHING: categories[14],
	MINING: categories[15],
	HERBLORE: categories[16],
	AGILITY: categories[17],
	THIEVING: categories[18],
	SLAYER: categories[19],
	FARMING: categories[20],
	RUNECRAFT: categories[21],
	HUNTER: categories[22],
	CONSTRUCTION: categories[23],
	LEAGUE_POINTS: categories[24],
	BOUNTY_HUNTER_HUNTER: categories[25],
	BOUNTY_HUNTER_ROGUE: categories[26],
	CLUE_SCROLL_ALL: categories[27],
	CLUE_SCROLL_BEGINNER: categories[28],
	CLUE_SCROLL_EASY: categories[29],
	CLUE_SCROLL_MEDIUM: categories[30],
	CLUE_SCROLL_HARD: categories[31],
	CLUE_SCROLL_ELITE: categories[32],
	CLUE_SCROLL_MASTER: categories[33],
	LAST_MAN_STANDING: categories[34],
	SOUL_WARS_ZEAL: categories[35],
	ABYSSAL_SIRE: categories[36],
	ALCHEMICAL_HYDRA: categories[37],
	BARROWS_CHESTS: categories[38],
	BRYOPHYTA: categories[39],
	CALLISTO: categories[40],
	CERBERUS: categories[41],
	CHAMBERS_OF_XERIC: categories[42],
	CHAMBERS_OF_XERIC_CHALLENGE_MODE: categories[43],
	CHAOS_ELEMENTAL: categories[44],
	CHAOS_FANATIC: categories[45],
	COMMANDER_ZILYANA: categories[46],
	CORPOREAL_BEAST: categories[47],
	CRAZY_ARCHAEOLOGIST: categories[48],
	DAGANNOTH_PRIME: categories[49],
	DAGANNOTH_REX: categories[45],
	DAGANNOTH_SUPREME: categories[51],
	DERANGED_ARCHAEOLOGIST: categories[52],
	GENERAL_GRAARDOR: categories[53],
	GIANT_MOLE: categories[54],
	GROTESQUE_GUARDIANS: categories[55],
	HESPORI: categories[56],
	KALPHITE_QUEEN: categories[57],
	KING_BLACK_DRAGON: categories[58],
	KRAKEN: categories[59],
	KREEARRA: categories[60],
	KRIL_TSUTSAROTH: categories[61],
	MIMIC: categories[62],
	NIGHTMARE: categories[63],
	PHOSANIS_NIGHTMARE: categories[64],
	OBOR: categories[65],
	SARACHNIS: categories[66],
	SCORPIA: categories[67],
	SKOTIZO: categories[68],
	TEMPOROSS: categories[69],
	GAUNTLET: categories[70],
	CORRUPTED_GAUNTLET: categories[71],
	THEATRE_OF_BLOOD: categories[72],
	THEATRE_OF_BLOOD_HARD_MODE: categories[73],
	THERMONUCLEAR_SMOKE_DEVIL: categories[74],
	TZ_KAL_ZUK: categories[75],
	TZ_TOK_JAD: categories[76],
	VENENATIS: categories[77],
	VETION: categories[78],
	VORKATH: categories[79],
	WINTERTODT: categories[80],
	ZALCANO: categories[81],
	ZULRAH: categories[82],
}

getCategoryByShortName = (name) => {
	switch (name.toLowerCase().trim()) {
		case "total":
		case "main":
			return "Overall"
		case "att":
		case "attk":
			return "Attack"
		case "def":
		case "defense":
			return "Defence"
		case "str":
			return "Strength"
		case "hp":
			return "Hitpoints"
		case "range":
			return "Ranged"
		case "pray":
			return "Prayer"
		case "mage":
			return "Magic"
		case "cook":
			return "Cooking"
		case "wc":
		case "wood cutting":
			return "Woodcutting"
		case "fletch":
			return "Fletching"
		case "fish":
			return "Fishing"
		case "fm":
		case "fire":
			return "Firemaking"
		case "craft":
			return "Crafting"
		case "smith":
		case "sm":
			return "Smithing"
		case "mine":
			return "Mining"
		case "herb":
			return "Herblore"
		case "agil":
			return "Agility"
		case "thieve":
		case "thief":
			return "Thieving"
		case "slay":
		case "worst skill":
			return "Slayer"
		case "farm":
			return "Farming"
		case "rc":
			return "Runecraft"
		case "hunt":
			return "Hunter"
		case "con":
			return "Construction"
		case "twisted league":
		case "league":
		case "tl":
			return "League points"
		case "bh hunter":
		case "hunter bh":
		case "bh targets":
		case "targets bh":
		case "bh":
			return "Bounty hunter hunter"
		case "bh rogue":
		case "rogue bh":
			return "Bounty hunter rogue"
		case "clues all":
		case "clues":
			return "Clue scroll (all)"
		case "clues beginner":
		case "beginner":
			return "Clue scroll (beginner)"
		case "clues easy":
		case "easy clue":
		case "easy clues":
		case "easy":
			return "Clue scroll (easy)"
		case "clues medium":
		case "medium clue":
		case "medium clues":
		case "medium":
		case "med":
		case "meds":
			return "Clue scroll (medium)"
		case "clues hard":
		case "hard clue":
		case "hard clues":
		case "hard":
		case "hards":
			return "Clue scroll (hard)"
		case "clues elite":
		case "elite clue":
		case "elite clues":
		case "elite":
		case "elites":
			return "Clue scroll (elite)"
		case "clues master":
		case "master clue":
		case "master clues":
		case "master":
		case "masters":
			return "Clue scroll (master)"
		case "lms":
			return "Last man standing"
		case "sire":
			return "Abyssal Sire"
		case "sw":
		case "soul":
				return "Soul wars zeal"
		case "hydra":
			return "Alchemical hydra"
		case "barrows":
		case "noob trap":
			return "Barrows chests"
		case "moss boss":
		case "moss giant":
		case "mossy":
		case "bryo":
			return "Bryophyta"
		case "hill giant":
			return "Obor"
		case "bear":
			return "Callisto"
		case "cerb":
		case "clifford":
			return "Cerberus"
		case "cox":
		case "xeric":
		case "chambers":
		case "olm":
		case "raids":
			return "Chambers of xeric"
		case "cox cm":
		case "xeric cm":
		case "chambers cm":
		case "olm cm":
		case "raids cm":
		case "cm":
			return "Chambers of xeric challenge mode"
		case "elemental":
		case "ele":
		case "chaos ele":
			return "Chaos elemental"
		case "fanatic":
			return "Chaos fanatic"
		case "sara":
		case "saradomin":
		case "zilyana":
		case "zily":
			return "Commander zilyana"
		case "corp":
			return "Corporeal beast"
		case "crazy arch":
		case "bellock":
			return "Crazy archaeologist"
		case "prime":
			return "Dagannoth prime"
		case "rex":
			return "Dagannoth rex"
		case "supreme":
			return "Dagannoth supreme"
		case "deranged arch":
		case "deranged":
			return "Deranged archaeologist"
		case "bandos":
		case "graardor":
			return "General graardor"
		case "mole":
			return "Giant mole"
		case "dusk":
		case "dawn":
		case "gargs":
		case "guardians":
		case "gg":
		case "ggs":
			return "Grotesque guardians"
		case "hesp":
		case "bank":
			return "Hespori"
		case "kq":
			return "Kalphite queen"
		case "kbd":
			return "King black dragon"
		case "arma":
		case "kree":
		case "kreearra":
		case "armadyl":
			return "Kree'arra"
		case "zammy":
		case "zamorak":
		case "kril":
		case "kril trutsaroth":
			return "K'ril tsutsaroth"
		case "the nightmare":
		case "nm":
			return "Nightmare"
		case "phosani nm":
		case "phosanis nm":
        case "phosani":
        case "phsoanis":
        case "hm nm":
        case "hard nm":
            return "Phosani's Nightmare"
		case "sarac":
		case "sarach":
			return "Sarachnis"
		case "skot":
			return "Skotizo"
		case "temp":
		case "fishingtodt":
		case "summertodt":
			return "Tempoross"
		case "the gauntlet":
		case "gaunt":
			return "Gauntlet"
		case "the corrupted gauntlet":
		case "corrupt gaunt":
		case "corrupted gaunt":
		case "gauntlet corrupted":
		case "gauntlet corrupt":
			return "Corrupted gauntlet"
		case "tob":
		case "theatre":
		case "verzik":
		case "verzik vitur":
		case "raids 2":
			return "Theatre of blood"
		case "tob hm":
		case "hm tob":
		case "tobhm":
		case "hmtob":
		case "tob hard mode":	
		case "tob hard":
		case "hard tob":
		case "cm tob":
		case "tob cm":
			return "Theatre of blood hard mode"
		case "thermy":
			return "Thermonuclear smoke devil"
		case "zuk":
		case "inferno":
			return "Tz-kal-zuk"
		case "jad":
		case "tzhaar fight cave":
		case "fire cape":
			return "Tz-tok-jad"
		case "vene":
			return "Venenatis"
		case "vet":
			return "Vetion"
		case "vork":
			return "Vorkath"
		case "wt":
			return "Wintertodt"
		case "zalc":
			return "Zalcano"
		case "money snek":
		case "profit python":
		case "cash cobra":
		case "money mamba":
			return "Zulrah"
		default:
			return capitalize(name.toLowerCase().trim())
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
	categories,
	Category,
	getCategoryByShortName
}
