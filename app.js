const express = require('express')
const app = express()
const path = require('path');

app.use('/public', express.static('public'))

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')))

app.get('/cliff', function(req, res) {
	var cliff = require('./modules/cliff');
	cliff.get(req, res);
});

app.post('/index', function(req, res) {
	var indexer = require('./modules/indexer');
	indexer.process(req, res);
});

app.get('/list', function(req, res) {
	var gt = require('./modules/geoTemporalSearch');
	gt.fetch(req, res);
});

app.get('/item', function(req, res) {
	var gt = require('./modules/geoTemporalSearch');
	gt.getItem(req, res);
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))

