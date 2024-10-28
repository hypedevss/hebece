import * as fs from 'fs';
import moment from 'moment';
class TemporaryDb {
	path: string;
	all: () => object;
	set: (key: string, value: any) => boolean;
	get: (key: string) => any;
	remove: (key: string) => boolean;
	has: (key: string) => boolean;
	year: boolean;
	/**
	 * Generates a temporary 30mins/1 year JSON database
	 * 
	 * Store the accessToken from /api/ap in the 1 year to renew credentials.
	 * 
	 * @param path The path of the database
	 * @param year Should the database expire in a year?
	 */
	constructor(path: string, year: boolean) {
		this.path = path;
		this.year = year;
		const initialize = (y) => {
			const initialObj = {
				"_expires": Math.floor(moment().add(30, 'minutes').toDate().getTime() / 1000)

			}
			if (y) {
				initialObj['_expires'] = Math.floor(moment().add(1, 'years').toDate().getTime() / 1000);
				initialObj['_year'] = true
			}
			fs.writeFileSync(this.path, JSON.stringify(initialObj, null, 2));
		}
		if (!fs.existsSync(this.path)) initialize(this.year);
		// check if expired
		const _checkExpired = () => {
			const db = JSON.parse(fs.readFileSync(this.path, 'utf8'));;
			if (!db["_expires"]) throw new Error(`Database headers not found.`);
			if (db["_expires"] < Math.floor(moment().toDate().getTime() / 1000)) {
				initialize(db["_year"]);
			}
		};
		_checkExpired();
		const _getAll = () => {
			const db = JSON.parse(fs.readFileSync(this.path, 'utf8'));
			return db;
		}
		const _get = (key) => {
			const db = _getAll();
			return db[key];
		}
		// available for user functions
		this.all = () => {
			const db = _getAll();
			delete db.expires;
			return db;
		}
		this.has = (key: string) => {
			const db = _getAll();
			return !!db[key];
		}
		this.set = (key: string, value: any) => {
			if (!key) throw new Error("No key provided");
			if (!value) throw new Error("No value provided");
			const db = _getAll();
			db[key] = value;
			fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
			return true;
		}
		this.get = (key: string) => {
			if (!key) throw new Error("No key provided");
			const db = _getAll();
			return db[key];
		}
		this.remove = (key: string) => {
			if (!key) throw new Error("No key provided");
			const db = _getAll(); 
			if (key === "_expires") throw new Error("Cannot delete '_expires' key");
			if (key === "_year") throw new Error("Cannot delete '_year' key");
			if (!db[key]) return false;
			delete db[key];
			fs.writeFileSync(this.path, JSON.stringify(db, null, 2));
			return true;
		}
	}
}

export default TemporaryDb;