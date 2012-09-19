$(function() {
  var $window = $(window),
      $logo   = $('header h1'),
      calculateDeathOfPrint,
      setup;

  (setup = function() {
    var height = $window.height();
    $logo.css('top', height / 2);
    $('header').css('min-height', height);
  })();
  $window.resize(function() {
    setup();
  });

  $('header a').click(function(event) {
    $('html, body').stop().animate({
        scrollTop: $($(this).attr('href')).offset().top
    }, 400);
    event.preventDefault();
  });

  (calculateDeathOfPrint = function() {
    var years = (Math.random() * 7 + 3).toFixed(1);
    $('#death').text('about ' + years);
  })();
  setInterval(calculateDeathOfPrint, 30000);

  $window.scroll(function() {
    if($window.scrollTop() > $window.height() + 90) {
      $('#eric').css({
        'transform':         'rotate(360deg)',
        '-moz-transform':    'rotate(360deg)',
        '-webkit-transform': 'rotate(360deg)'
      });
      $window.unbind('scroll');
    }
  });
});
