$(function(){
	if(window.location.hash === "#clock") {
		startClock();
		$('p.start').remove();
	} else {
		$('#start').click(function() { 
			startClock();
			$('p.start').remove();
		});
	}
	
	function startClock() {
		var angle = 360/60,
			date = new Date(),
			hour = (function() {
				var h = date.getHours();
				if(h > 12) {
					h = h - 12;
				}
				return h
			})(),
			minute = date.getMinutes(),
			second = date.getSeconds(),
			hourAngle = (360/12) * hour + (360/(12*60)) * minute;
			
		$('#minute')[0].style.webkitTransform = 'rotate('+angle * minute+'deg)';
		$('#second')[0].style.webkitTransform = 'rotate('+angle * second+'deg)';
		$('#hour')[0].style.WebkitTransform = 'rotate('+hourAngle+'deg)';
	}
});