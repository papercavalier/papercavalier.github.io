---
---

$ ->
  # A list of people in the company.
  people = [
    {
      name: 'Aaron',
      text: 'lorem ipsum',
    }
  , {
      name: 'Amanda',
      text: 'lorem ipsum'
    }
  , {
      name:  'Angela',
      text: 'lorem ipsum'
    }
  , {
      name:  'Eric',
      text: 'lorem ipsum'
    }
  , {
      name:  'Genis',
      text: 'lorem ipsum'
    }
  , {
      name:  'Genn',
      text: 'lorem ipsum'
    }
  , {
      name:  'Nas',
      text: 'lorem ipsum'
    }
  , {
      name:  'Nelson',
      text: 'lorem ipsum'
    }
  , {
      name:  'Rob',
      text: 'lorem ipsum'
    }
  ]

  # Add people to the page.
  $portraits = $('#portraits')
  $portraitImages = $('#portrait-images');
  $portraitCovers = $('#portrait-covers');

  for person in people
    $portraitImages.append "<img class='portrait' src='images/portraits/#{person.name}.jpg' />"
    $portraitCovers.append "<div class='portrait-cover'><p>#{person.text}</p></div>"
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
