$(function() {
  var $window = $(window);
  var $logo = $('header h1');
  var stretch = function() {
    var height = $(window).height();
    $('header').css('min-height', height);
    $('header h1').css('margin-top', height * 0.25);
  }
  stretch();
  $window.resize(function() {
    stretch();
  });

  var calculateDeath = function() {
    $('#death').text('about ' + (Math.random() * 7 + 6).toFixed(1));
  }
  calculateDeath();
  setInterval(calculateDeath, 15000);
});
