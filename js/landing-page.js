$(function() {
	var counter = {
		$el: $('.counter'),

		refresh: function() {
			this.$el.html(this.build());
		},

		build: function() {
			var count = Math.floor((new Date("2013-11-04") - new Date()) / 1000);
			var vals = [
				Math.floor(count / 86400),
				this.pad(Math.floor(count % 86400 / 3600)),
				this.pad(Math.floor(count % 3600 / 60)),
				this.pad(count % 60),
			];

			return vals.join(':');
		},

		pad: function(str) {
			return ('0' + str).slice(-2);
		}
	}

	counter.refresh();
	setInterval(function() { counter.refresh() }, 1000);

	var wrapper = {
		$el: $('.wrapper'),

		$viewport: $(window),

		fillViewport: function() {
			this.$el.height(this.$viewport.height());
		},
	}

	wrapper.fillViewport();
	$(window).resize(function() { wrapper.fillViewport(); });
});
