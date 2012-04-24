---
---

$ ->
  $win = $(window)

  (paginate = ->
    $('section').height $win.height()
  )()

  $win.resize ->
    paginate()
