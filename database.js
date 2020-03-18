const fs = require('fs');
const p = require('path')

// Stores data in a JSON object and writes to the file on every update
module.exports = (path) => {
	path = path || './db.json';
	// Create the folder and files if necessary
	if (!fs.existsSync(path)) {
		// Ensure directory exists
		try {
			fs.mkdirSync(p.dirname(path))
		} catch (ignored) {
		}
		// Write a blank file
		fs.writeFileSync(path, "{}", null, () => {})
	}

	const db = JSON.parse(fs.readFileSync(path)) || {};

	const keys = () => Object.keys(db);
	const values = () => Object.values(db);

	const get = (k) => db[k]

	// putting just a key will delete the entry from the database
	const put = (key, value) => {
	  if (value) {
		db[key] = value
	  } else {
		delete db[key]
	  }
  
	  fs.writeFile(path, JSON.stringify(db, null, 4), null, () => {})
	  return value
	}

	return {get, put, keys, values}
}
