var rp = require('request-promise');

module.exports = {
	get: function(req, res) {
		res.json({hello: "world"});
	}
}