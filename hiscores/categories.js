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
	"Obor",
	"Sarachnis",
	"Scorpia",
	"Skotizo",
	"Gauntlet",
	"Corrupted gauntlet",
	"Theatre of blood",
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
	ABYSSAL_SIRE: categories[35],
	ALCHEMICAL_HYDRA: categories[36],
	BARROWS_CHESTS: categories[37],
	BRYOPHYTA: categories[38],
	CALLISTO: categories[39],
	CERBERUS: categories[40],
	CHAMBERS_OF_XERIC: categories[41],
	CHAMBERS_OF_XERIC_CHALLENGE_MODE: categories[42],
	CHAOS_ELEMENTAL: categories[43],
	CHAOS_FANATIC: categories[44],
	COMMANDER_ZILYANA: categories[45],
	CORPOREAL_BEAST: categories[46],
	CRAZY_ARCHAEOLOGIST: categories[47],
	DAGANNOTH_PRIME: categories[48],
	DAGANNOTH_REX: categories[49],
	DAGANNOTH_SUPREME: categories[50],
	DERANGED_ARCHAEOLOGIST: categories[51],
	GENERAL_GRAARDOR: categories[52],
	GIANT_MOLE: categories[53],
	GROTESQUE_GUARDIANS: categories[54],
	HESPORI: categories[55],
	KALPHITE_QUEEN: categories[56],
	KING_BLACK_DRAGON: categories[57],
	KRAKEN: categories[58],
	KREEARRA: categories[59],
	KRIL_TSUTSAROTH: categories[60],
	MIMIC: categories[61],
	NIGHTMARE: categories[62],
	OBOR: categories[63],
	SARACHNIS: categories[64],
	SCORPIA: categories[65],
	SKOTIZO: categories[66],
	GAUNTLET: categories[67],
	CORRUPTED_GAUNTLET: categories[68],
	THEATRE_OF_BLOOD: categories[69],
	THERMONUCLEAR_SMOKE_DEVIL: categories[70],
	TZ_KAL_ZUK: categories[71],
	TZ_TOK_JAD: categories[72],
	VENENATIS: categories[73],
	VETION: categories[74],
	VORKATH: categories[75],
	WINTERTODT: categories[76],
	ZALCANO: categories[77],
	ZULRAH: categories[78],
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
		case "ranging":
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
		case"fire":
			return "Firemaking"
		case "craft":
			return "Crafting"
		case "smith":
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
			return "Bounty hunter hunter"
		case "bh rogue":
		case "rogue bh":
			return "Bounty hunter rogue"
		case "clues all":
			return "Clue scroll (all)"
		case "clues beginner":
		case "beginner":
			return "Clue scroll (beginner)"
		case "clues easy":
		case "easy":
			return "Clue scroll (easy)"
		case "clues medium":
		case "medium":
		case "med":
		case "meds":
			return "Clue scroll (medium)"
		case "clues hard":
		case "hard":
		case "hards":
			return "Clue scroll (hard)"
		case "clues elite":
		case "elite":
		case "elites":
			return "Clue scroll (elite)"
		case "clues master":
		case "master":
		case "masters":
			return "Clue scroll (master)"
		case "lms":
			return "Last man standing"
		case "sire":
			return "Abyssal Sire"
		case "hydra":
			return "Alchemical hydra"
		case "barrows":
			return "Barrows chests"
		case "moss boss":
		case "moss giant":
		case "mossy":
			return "Bryophyta"
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
			return "Crazy archaeologist"
		case "prime":
			return "Dagannoth prime"
		case "rex":
			return "Dagannoth rex"
		case "supreme":
			return "Dagannoth supreme"
		case "deranged arch":
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
			return "Grotesque guardians"
		case "hesp":
			return "Hespori"
		case "kq":
			return "Kalphite queen"
		case "kbd":
			return "King black dragon"
		//	return "Kraken"
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
		//	return "Mimic"
		case "the nightmare":
			return "Nightmare"
		//	return "Obor"
		case "sarac":
		case "sarach":
			return "Sarachnis"
		//	return "Scorpia"
		case "skot":
			return "Skotizo"
		case "the gauntlet":
		case "guant":
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
		case "thermy":
			return "Thermonuclear smoke devil"
		case "zuk":
		case "where is score":
		case "inferno":
			return "Tz-kal-zuk"
		case "jad":
		case "tzhaar fight cave":
			return "Tz-tok-jad"
		case "vene":
			return "Venenatis"
		//	return "Vetion"
		case "vork":
			return "Vorkath"
		case "wt":
			return "Wintertodt"
		case "zalc":
			return "Zalcano"
		case "money snek":
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
