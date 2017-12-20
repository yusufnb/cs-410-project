$(function(){

	function reloadMarkers() {
		console.log(dateSlider.val());
		console.log(map.getBounds().getNorthEast().toJSON());
		console.log(map.getBounds().getSouthWest().toJSON());
	}

	var map = new GMaps({
	  div: '#map',
	  lat: -12.043333,
	  lng: -77.028333,
	  zoom: 2,
	  dragend: reloadMarkers,
	  zoom_changed: reloadMarkers
	});

	var dateSlider = $("#date-slider").slider({});
	dateSlider.on('slideStop', reloadMarkers);

	window.map = map;
	window.dateSlider = dateSlider;
})