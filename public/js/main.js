$(function(){

	function showBlog(e) {
		console.log(e.details.id);

		var current = 0;

		function loadItem(id) {
			$.getJSON('/item', {
				id: id
			}).then(function(data) {
				$("#blog-text").html(data.text);
				$("#blog-date").html(moment(data.date).format('MM-DD-YYYY'));			
			});
		}

		function show() {
			$("#page").text((current+1) + " of " + e.details.id.length);
			loadItem(e.details.id[current]);
		}
		$("#pagePrev").unbind("click");
		$("#pagePrev").click(function(){
			if (current > 0) current--;
			show();
		});
		$("#pageNext").unbind("click");
		$("#pageNext").click(function(){
			if (e.details.id.length > current+1) current++;
			show();
		});
		show();
	}

	function reloadMarkers() {
		console.log(dateSlider.val());
		console.log(map.getBounds().getNorthEast().toJSON());
		console.log(map.getBounds().getSouthWest().toJSON());
		var dateBounds = dateSlider.val().split(',');
		$.getJSON('/list', {
			from: moment('1999-01-13').add(dateBounds[0],'days').format('YYYY-MM-DD'),
			to: moment('1999-01-13').add(dateBounds[1],'days').format('YYYY-MM-DD'),
			sw_lat: map.getBounds().getSouthWest().toJSON().lat,
			sw_lon: map.getBounds().getSouthWest().toJSON().lng,
			ne_lat: map.getBounds().getNorthEast().toJSON().lat,
			ne_lon: map.getBounds().getNorthEast().toJSON().lng
		}).then(function(data){
			$.each(map.markers, function(index, marker) {
				marker.setMap(null);
			});

			for(var i in data) {
				map.addMarker({
					lat: data[i].lat,
					lng: data[i].lon,
					details: {
						id: data[i].ids.split(',')
					},
					click: showBlog
				});
			}
		});	
	}

	var map = new GMaps({
	  div: '#map',
	  lat: 24.04271,
	  lng: 20.35447,
	  zoom: 2,
	  dragend: reloadMarkers,
	  zoom_changed: reloadMarkers
	});

	var dateSlider = $("#date-slider").slider({});
	dateSlider.on('slideStop', reloadMarkers);

	$("#blog-text").height($("#map").height());

	window.map = map;
	window.dateSlider = dateSlider;
})