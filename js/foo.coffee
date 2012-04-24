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
