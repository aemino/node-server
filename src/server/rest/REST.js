const RESTError = require('./routes/Route').RESTError;
const ROUTES = [
	'meta',
	'authenticate_discord',
	'users'
].map(file => require(`./routes/${file}`));

class REST {
	constructor(cc_server) {
		this.cc_server = cc_server;
		this.data = this.cc_server.data;
		this.server = cc_server.server;

		for (const Route of Object.values(ROUTES)) {
			const route = new Route(this);
			for (const term of ['get', 'post', 'delete', 'patch', 'put']) {
				if (route[term]) {
					this.server[term](route.path, async (req, res, next) => {
						res.charSet('utf-8');
						try {
							await route[term](req, res, next);
						} catch (error) {
							if (error instanceof RESTError) {
								res.send(error.code, { message: error.message });
							} else {
								res.send(500, { message: 'Unexpected internal error.' });
								this.cc_server.logger.error(error);
							}
						}
						next();
					});
				}
			}
		}
	}
}

module.exports = REST;
