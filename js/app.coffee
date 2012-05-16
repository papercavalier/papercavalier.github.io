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
  $('a.smooth').bind 'click', (event) ->
    $('body').stop().animate
      scrollTop: $($(@).attr('href')).offset().top
    , 400
    event.preventDefault()

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

  # Add people to the page.
  $portraits = $('#people')
  $portraitImages = $('#images');
  $portraitCovers = $('#blurbs');

  for person in people
    $portraitImages.append "<img class='image' src='images/portraits/#{person.name}.jpg' />"
    $portraitCovers.append "<div class='blurb'><p>#{person.blurb}</p></div>"
    h = Math.ceil(people.length / 4) * 350
    $portraits.css 'height', h

  $(window).scroll ->
    portraitsHeight = $portraits.height()
    y = $portraits.position().top
    offset = $(window).scrollTop() - y + $(window).height() / 2
    portraitsPct = offset / portraitsHeight
    portraitsPct *=  1.2

    emptyPortraits = 4 - people.length % 4

    c = 0
    $portraitCovers.children().each ->
      console.log fadeMe(portraitsPct, 2, c / (people.length + emptyPortraits))
      $(this).css 'opacity', fadeMe(portraitsPct, 2, c / (people.length + emptyPortraits))
      c++

  fadeMe = (pct, fadeSteps, startFade) ->
    fadeSteps = fadeSteps/100
    startFadeOut = startFade+fadeSteps
    o = nil
    if (pct > startFade && pct < startFade+fadeSteps)
      o = (pct - startFade)/fadeSteps
    else if (pct >= startFade+fadeSteps && pct < startFadeOut)
      o = 1
    else if (pct >= startFadeOut && pct < startFadeOut+fadeSteps)
      o = 1-(pct - startFadeOut)/fadeSteps;
    else
      o = 0
    return o




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
