---
---
$ ->
  # Set minimum page height of the Hokusai page to the window height.
  (fillWindow = (sel) ->
    $(sel).css 'min-height', $(window).height()
  )('#hokusai')

  $(window).resize ->
    fillWindow '#hokusai'

  # Smooth-scroll.
  smoothScroll = (target) ->
    $('body').stop().animate
      scrollTop: $(target).offset().top
    , 400
    event.preventDefault()

  $('a.smooth').bind 'click', (event) ->
    smoothScroll $(@).attr 'href'
    history.pushState { path: @path }, '', @href

  # A list of people working at Paper Cavalier.
  people = [
    {
      name: 'Aaron',
      blurb: 'lorem ipsum',
    }
  , {
      name: 'Amanda',
      blurb: 'lorem ipsum'
    }
  , {
      name:  'Angela',
      blurb: 'lorem ipsum'
    }
  , {
      name:  'Eric',
      blurb: 'lorem ipsum'
    }
  , {
      name:  'Genis',
      blurb: 'lorem ipsum'
    }
  , {
      name:  'Genn',
      blurb: 'lorem ipsum'
    }
  , {
      name:  'Nas',
      blurb: 'lorem ipsum'
    }
  , {
      name:  'Nelson',
      blurb: 'lorem ipsum'
    }
  , {
      name:  'Rob',
      blurb: 'lorem ipsum'
    }
  ]

  # Add people to the about us section.
  $blurbs = $('#blurbs')
  $images = $('#images')
  $people = $('#people')

  peopleLength = people.length
  $people.height(peopleHeight = Math.ceil(people.length / 4) * 350)

  for person in people
    $images.append "<img src='/images/portraits/#{person.name}.jpg'>"
    $blurbs.append "<div class='blurb'><p>#{person.blurb}</p></div>"

  do showBlurb = ->
    offset = $(window).scrollTop() - $people.position().top + $(window).height() * 0.6
    coefficient = offset / peopleHeight
    nth = Math.floor peopleLength * coefficient

    $blurbs.children().each (index) ->
      if index == nth
        $(@).css opacity: 1
      else
        $(@).css opacity: 0

  $(window).scroll -> showBlurb()


  # $.fn.highlight = ->
  #   offset = $(window).scrollTop() + $(window).height() * 0.375

  #   @each ->
  #     doc    = $(@)
  #     top    = doc.offset().top
  #     bottom = top + doc.height()

  #     if offset > top and offset < bottom
  #       unless doc.css('opacity') is 1
  #         doc.stop().animate(opacity: 1, 100)
  #     else
  #       unless doc.css('opacity') is 0.1
  #         doc.stop().animate(opacity: 0.1, 100)



  # $(window).scroll ->
  #   $('#two .blurb p').highlight()
  #   w = $(this).scrollTop()
  #   $("#splat1").css('opacity', fadeMe w, 30, 400, 600)
  #   $("#splat2").css('opacity', fadeMe w, 30, 500, 650)
  #   $("#splat3").css('opacity', fadeMe w, 30, 550, 750)


  # fadeMe =(scroll, fadeSteps, startFade, startFadeOut) ->
  #   if scroll > startFade and scroll < startFade+fadeSteps
  #     o = (scroll - startFade)/fadeSteps
  #   else if scroll >= startFade+fadeSteps and scroll < startFadeOut
  #     o = 1
  #   else if scroll >= startFadeOut and scroll < startFadeOut+fadeSteps
  #     o = 1-(scroll - startFadeOut)/fadeSteps
  #   else
  #     o = 0
  #   # console.log(o)
  #   o
