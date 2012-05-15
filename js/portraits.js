$(function() {
	var names= ['Aaron', 'Amanda', 'Angela','Aitor', 'Eric','Genis','Genn','Hakan','Nas','Nelson','Rob'];

	var $portraits = $('#portraits');
	var $portraitImages = $('#portrait-images');
	var $portraitCovers = $('#portrait-covers');

	for (var k in names){
		$portraitImages.append('<img class="portrait" src="images/portraits/'+names[k]+'.jpg" />');
		$portraitCovers.append('<div class="portrait-cover"><p>'+names[k]+'</p></div>');
	}
	var h = Math.ceil(names.length /4)*350;
	$portraits.css('height', h);

	
	$(window).scroll(function () {
		var screenHeight = $(window).height();
		var portraitsHeight = $portraits.height();
		var y = $portraits.position().top;
		var offset = $(window).scrollTop() - y + screenHeight/2;
		//console.log('offset: '+offset);
		var pct = offset/portraitsHeight;

		pct *=  1.2;
		//console.log('pct: '+Math.floor (pct*100));

		var emptyPortraits = 4 - names.length%4;

		var c = 0;
		$portraitCovers.children().each(function () {
			$(this).css ('opacity', fadeMe (pct, 10, c/(names.length+emptyPortraits)));
			c ++;
		});
		animate();
	});

	var fadeMe = function (pct, fadeSteps, startFade) {
		fadeSteps = fadeSteps/100;
		startFadeOut = startFade+fadeSteps;
		var o;
	    if (pct > startFade && pct < startFade+fadeSteps){
	      o = (pct - startFade)/fadeSteps;
	    } else if (pct >= startFade+fadeSteps && pct < startFadeOut) {
	      o = 1;
	    } else if (pct >= startFadeOut && pct < startFadeOut+fadeSteps) {
	      o = 1-(pct - startFadeOut)/fadeSteps;
	    } else {
	      o = 0;
	    }
	    return o;
	};
});