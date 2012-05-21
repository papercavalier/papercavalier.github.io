---
---
$ ->
  # Set minimum page height of the Hokusai page to the window height.
  (fillWindow = (sel) ->
    $(sel).css 'min-height', $(window).height()
  )('section')

  $(window).resize ->
    fillWindow 'section'

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
      blurb: '<i>Aaron</i> is a bit of a company everyman, having worn most of the hats during a storied tenure with Paper Cavalier. A voracious consumer of mixed media, his impressive knowledge of obscure corners of American culture well exceeds his years.'
    }
  , {
      name: 'Amanda',
      blurb: 'A native of Brooklyn, <i>Amanda</i> has been buying and selling books since 2007. When she’s not busy fantasizing about her dream library, she can be found swimming in the ocean, turning over rocks for bugs, and squeezing cats.'
    }
  , {
      name:  'Angela',
      blurb: '<i>Angela</i> has spent the last 15 years working in various bookstores and archives in New York and the Midwest. She is interested in ethnographic recordings, music/sound archives, and all forms of printed matter.'
    }
  , {
      name:  'Eric',
      blurb: '<i>Eric’s</i> mysterious background begins at an undisclosed university and ends with his evasive literary interests.'
    }
  , {
      name:  'Genis',
      blurb: 'lorem ipsum'
    }
  , {
      name:  'Genn',
      blurb: '<i>Genevieve</i> has over ten years experience working with rare books, second hand books, and special collections in the New York City area. She specializes in codicology and paleography, with an interest in unusual printing and binding.'
    }
  , {
      name:  'Naz',
      blurb: "<i>Naz</i> is a freelance graphic designer with a degree in fine arts. When he's not busy publishing new designs with Adobe's Creative Suite, Naz manages the Near Fine warehouse. Oh yeah, and he's a pretty mean tattoo artist."
    }
  , {
      name:  'Nelson',
      blurb: '<i>Nelson</i> is a founding partner in Paper Cavalier. He has worked in the sphere of book selling since 1999'
    }
  , {
      name:  'Rob',
      blurb: '<i>Robert</i> has a BFA from the School of Visual Arts in New York where he studied cartooning and bookbinding as an art form. He specializes in graphic novels and childrenʼs books.'
    }
  , {
      name:  'Stacey',
      blurb: 'An avid reader of beatnik authors, <i>Stacey loves</i> to keep it simple and has been doing so for the New York shipping office. She originally hails from the midwest.'
    }
  , {
      name:  'Dallis',
      blurb: 'Rumor has it that <i>Dallis</i> has a degree in astronomy - or graphic design. She has an uncanny penchant for finding unusual book covers which she curates for her blog, "Sandra Coppertop."'
    }
    {
       name: 'Aitor',
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
