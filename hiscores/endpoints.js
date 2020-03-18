const hiscoreBaseUrl = "https://services.runescape.com/m=hiscore_oldschool"
const createEndpoint = (section) => `${hiscoreBaseUrl}${section ? section : ""}/index_lite.ws?player=`

const Endpoints = {
	NORMAL: {key: "NORMAL", endpoint: createEndpoint()},
	IRONMAN: {key: "IRONMAN", endpoint: createEndpoint("_ironman")},
	HARDCORE_IRONMAN: {key: "HARDCORE_IRONMAN", endpoint: createEndpoint("_hardcore_ironman")},
	ULTIMATE_IRONMAN: {key: "ULTIMATE_IRONMAN", endpoint: createEndpoint("_ultimate")},
	DEADMAN: {key: "DEADMAN", endpoint: createEndpoint("_deadman")},
	SEASONAL: {key: "SEASONAL", endpoint: createEndpoint("_seasonal")},
}

getEndpointByShortName = (name) => {
	switch (name.toLowerCase().trim()) {
		case "normal":
		case "normie":
		case "regular":
		case "default":
			return Endpoints.NORMAL.key
		case "im":
		case "iron man":
		case "ironman":
			return Endpoints.IRONMAN.key
		case "hc im":
		case "hcim":
		case "hardcore":
		case "hard core":
		case "hardcore iron man":
		case "hardcore ironman":
		case "hard core iron man":
		case "hard core ironman":
			return Endpoints.HARDCORE_IRONMAN.key
		case "u im":
		case "uim":
		case "ult":
		case "ultimate":
			return Endpoints.ULTIMATE_IRONMAN.key
		case "dmm":
		case "deadman":
		case "dead man":
		case "deadman mode":
		case "dead man mode":
			return Endpoints.DEADMAN.key
		case "seasonal":
			return Endpoints.SEASONAL.key
		default:
			return null
	}
}

module.exports = {
	Endpoints,
	getEndpointByShortName
}
