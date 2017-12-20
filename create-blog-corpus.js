const fs = require('fs');
const readline = require('readline');
const request = require('sync-request');
var mysql      = require('sync-mysql');
var SqlString = require('sqlstring');
var connection = new mysql({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'geonames'
});


const path = "./blogs/";
const rec_tmpl = {
	gender: "",
	age: "",
	text: "",
	date: "",
	city: "",
	country: "",
	lat: 0,
	lon: 0
};
var blogCount = 0;
var rec = {};
var text = false;
fs.readdir(path, function(err, items) {
	for(var f in items) {
		console.log(path + items[f]);
		var gender = "";
		var age = 0;
		var array = fs.readFileSync(path + items[f]).toString().split("\n");
		var matches;

		if (matches = items[f].match(/([0-9]+)\.(male|female)\.([0-9]+)/)) {
			gender = matches[2];
			age = matches[3];
		}

		for(i in array) {
			var line = array[i];			
			var matches;
			if (line.match(/<Blog>/)) continue;
			if (line.match(/<\/Blog>/)) continue;
			if (matches = line.match(/<date>(.+)<\/date>/)) {
				rec = Object.assign({}, rec_tmpl);
				rec.date = matches[1];
				continue; 
			}
			if (matches = line.match(/<post>/)) {
				text = true;
				rec.text = [];
				continue;
			}
			if (line.match(/<\/post>/)) {
				rec.text = rec.text.join(" ");
				rec.gender = gender;
				rec.age = age;
				blogCount++;
				// do the thing with rec
				var geoResponse = request('GET', 'http://localhost:8999/cliff-2.3.0/parse/text', {
					qs: {
						q: rec.text
					}
				})
				geoString = geoResponse.body.toString();
				if (geoString) {
					var geo = JSON.parse(geoResponse.body.toString());
					var results = geo.results;
					if (results && results.places && results.places.focus && results.places.focus.cities && results.places.focus.cities.length > 0) {
						var city = results.places.focus.cities[0];
						rec.city = city.name;
						rec.country = city.countryCode;
						rec.lat = city.lat;
						rec.lon = city.lon;
						var dt = new Date(rec.date);
						if (dt.getFullYear()) {
							rec.date = dt.getFullYear() + "-" + (dt.getMonth()+1) + "-" + dt.getDate();
							var query = connection.query('INSERT INTO blogs(`gender`, `age`, `text`, `date`, `lat`, `lon`, `city`, `country`) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [rec.gender, rec.age, rec.text, rec.date, rec.lat, rec.lon, rec.city, rec.country]);
							console.log(rec);
						}
					}
				}
				rec = {};
				text = false;
			}
			if (text) {
				rec.text.push(line.trim());
			}
		}

	}
});