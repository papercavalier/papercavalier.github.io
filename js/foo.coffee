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
