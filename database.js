const fs = require('fs');

// Stores data in a JSON object and writes to the file on every update
module.exports = (path) => {
	path = path || './db.json';
	const db = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};

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
