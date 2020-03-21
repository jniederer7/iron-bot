
// Simple set & map based queue. The Time will prevent any entries < that period from being returned in `getSnapshot()`
module.exports = class TimedQueue {
	_queue = new Set()
	_map = new Map()
	timer
	
	constructor(milliseconds = 30000) {
		this.timer = milliseconds
	}

	setTimer(milliseconds = 30000) {
		this.timer = milliseconds
	}

	add = (userID, update = true) => {
		const has = this._queue.has(userID)
		if (!update && has) {
			return
		}

		this._queue.add(userID)
		this._map.set(userID, new Date())
	}

	remove = (userID) => {
		this._queue.delete(userID)
		this._map.delete(userID)
	}

	exists = (userID) => {
		return this._queue.has(userID)
	}

	size = (all = false) => {
		if (all) {
			return this._queue.size
		}

		return this.values().length
	}

	isOldEnough = (userID) => {
		const date = this._map.get(userID)
		if (!date) {
			return false
		}

		return (new Date() - date) >= this.timer
	}

	values = (all = false) => {
		const values = Array.from(this._queue)
		if (all) {
			return values
		}

		return values.filter((v) => this.isOldEnough(v))
	}

	getFirst = (remove = true) => {
		const user = this._queue.values().next()
		if (!user || !this.isOldEnough(user.value)) {
			return null
		}

		if (remove) {
			this.remove(user.value)
		}

		return user.value
	}
}
