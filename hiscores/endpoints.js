const hiscoreBaseUrl = "https://services.runescape.com/m=hiscore_oldschool"
const createEndpoint = (section) => `${hiscoreBaseUrl}${section ? section : ""}/index_lite.ws?player=`

module.exports = {
	NORMAL: createEndpoint(),
	IRONMAN: createEndpoint("_ironman"),
	HARDCORE_IRONMAN: createEndpoint("_hardcore_ironman"),
	ULTIMATE_IRONMAN: createEndpoint("_ultimate"),
	DEADMAN: createEndpoint("_deadman"),
	SEASONAL: createEndpoint("_seasona;")
}
