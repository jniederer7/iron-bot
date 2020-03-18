// Simple class for holding hiscore results
module.exports = class HiscoreResult {
	constructor(rank = -1, level = -1, exp = -1) {
		this.rank = rank
		this.level = level
		this.exp = exp
	}
}
