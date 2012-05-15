---
---

$ ->
  # Sets section heights to the window height.
  (paginate = ->
    $('section').height $(window).height()
  )()

  # Reset section heights when window is resized.
  $(window).resize ->
    paginate()

  # Smooth-scroll between sections.
  $('nav a').bind 'click', (event) ->
    $('body').stop().animate
      scrollTop: $($(@).attr('href')).offset().top
    , 400

    event.preventDefault()

  $.fn.highlight = ->
    offset = $(window).scrollTop() + $(window).height() * 0.375

    @each ->
      doc    = $(@)
      top    = doc.offset().top
      bottom = top + doc.height()

      if offset > top and offset < bottom
        unless doc.css('opacity') is 1
          doc.stop().animate(opacity: 1, 100)
      else
        unless doc.css('opacity') is 0.1
          doc.stop().animate(opacity: 0.1, 100)

  

  $(window).scroll ->
    $('#two .text p').highlight()
    w = $(this).scrollTop()
    $("#splat1").css('opacity', fadeMe w, 30, 400, 600)
    $("#splat2").css('opacity', fadeMe w, 30, 500, 650)
    $("#splat3").css('opacity', fadeMe w, 30, 550, 750)


  fadeMe =(scroll, fadeSteps, startFade, startFadeOut) ->
    if scroll > startFade and scroll < startFade+fadeSteps
      o = (scroll - startFade)/fadeSteps
    else if scroll >= startFade+fadeSteps and scroll < startFadeOut
      o = 1
    else if scroll >= startFadeOut and scroll < startFadeOut+fadeSteps
      o = 1-(scroll - startFadeOut)/fadeSteps
    else
      o = 0
    # console.log(o)
    o

  

   




  
