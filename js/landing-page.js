$(function() {
	var counter = {
		$el: $('.counter'),

		refresh: function() {
			this.$el.html(this.build());
		},

		build: function() {
			var count = Math.floor((new Date("2014-12-01") - new Date()) / 1000);
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

    $footer: $('.site-footer'),

		fillViewport: function() {
      console.log(parseInt(this.$footer.css('height')));
			this.$el.height(this.$viewport.height() - parseInt(this.$footer.css('height')));
		},
	}

	wrapper.fillViewport();
	$(window).resize(function() { wrapper.fillViewport(); });
});
