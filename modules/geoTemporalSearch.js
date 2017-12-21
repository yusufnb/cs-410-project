var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'geonames'
});

function fetchResults(obj, callback) {

	connection.query({
		sql: 'select group_concat(id) as ids, lat, lon from blogs where `date` between cast(? as date) and cast(? as date) and lat between ? and ? and lon between ? and ? group by lat, lon limit 500',
		values: [obj.from, obj.to, obj.sw_lat, obj.ne_lat, obj.sw_lon, obj.ne_lon]
	}, function(error, results, fields) {
		callback(JSON.parse(JSON.stringify(results)));
	});
	
}



module.exports = {
	fetch: function(req, res) {
		fetchResults(req.query, function(results) {
			res.json(results);
		});
	},
	getItem: function(req, res) {
		connection.query({
			sql: 'select text, `date` from blogs where id = ?',
			values: [req.query.id]
		}, function(error, results, fields) {
			res.json(JSON.parse(JSON.stringify(results[0])))
		});
	}
}