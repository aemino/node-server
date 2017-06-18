const pgp = require('pg-promise')();
const crypto = require('crypto');
const { promisify } = require('util');
const randomBytes = promisify(crypto.randomBytes);

class DataStore {
	constructor(server) {
		this.server = server;
		this.logger = server.logger;
		const config = this.server.options.database;
		this.logger.info('Connecting to database...');
		this.pgp = pgp;
		this.db = pgp({
			host: config.host,
			port: config.port,
			database: 'crude_cards',
			user: config.username,
			password: config.password
		});

		this.tokens = new Map();
	}

	async generateToken(userID) {
		const existing = this.tokenFor(userID);
		if (existing) return existing;
		const token = `${(await randomBytes(16)).toString('hex')}-${userID}`;
		this.tokens.set(token, userID);
		return token;
	}

	tokenFor(userID) { // eslint-disable-line consistent-return
		for (const [token, id] of this.tokens.entries()) {
			if (userID === id) return token;
		}
	}
}

module.exports = DataStore;
