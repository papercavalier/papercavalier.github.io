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
      name: 'Aaron'
    }
  , {
      name: 'Amanda'
    }
  , {
      name:  'Angela'
    }
  , {
      name:  'Eric'

    }
  , {
      name:  'Genis'

    }
  , {
      name:  'Genn'
      
    }
  , {
      name:  'Naz'
      
    }
  , {
      name:  'Nelson'

    }
  , {
      name:  'Rob'
     
    }
  , {
      name:  'Stacey'

    }
  , {
      name:  'Dallis'
      
    }
    {
       name: 'Aitor'
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