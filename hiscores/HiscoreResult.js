// Simple class for holding hiscore results
module.exports = class HiscoreResult {
	constructor(rank = -1, level = -1, exp = -1) {
		this.rank = parseInt(rank) || -1
		this.level = parseInt(level) || -1
		this.exp = parseInt(exp) || -1
	}
}
