###*
# plugin.js
#
# Copyright, Moxiecode Systems AB
# Released under LGPL License.
#
# License: http://www.tinymce.com/license
# Contributing: http://www.tinymce.com/contributing
###

### Forked for InSales ###

tinymce = require 'tinymce'

tinymce.PluginManager.add 'insales_contextmenu', (editor) ->
  menu = undefined
  contextmenuNeverUseNative = editor.settings.contextmenu_never_use_native

  clipboardEnabled = ->
    return window.tinyMCE.clipboardEnabled if window.tinyMCE.clipboardEnabled?
    try
      enabled = editor.getDoc().execCommand('copy')
    catch
      window.tinyMCE.clipboardEnabled = false
      return false
    window.tinyMCE.clipboardEnabled = enabled

  exclude = (list, values) ->
    item for item in list when item not in values

  editor.on 'contextmenu', (e) ->
    contextmenu = undefined
    doc = editor.getDoc()
    # Block TinyMCE menu on ctrlKey
    if e.ctrlKey and !contextmenuNeverUseNative
      return
    e.preventDefault()

    ###*
    # WebKit/Blink on Mac has the odd behavior of selecting the target word or line this causes
    # issues when for example inserting images see: #7022
    ###

    if tinymce.Env.mac and tinymce.Env.webkit
      if e.button == 2 and doc.caretRangeFromPoint
        editor.selection.setRng doc.caretRangeFromPoint(e.x, e.y)

    contextmenu = (editor.settings.contextmenu or 'link image inserttable | cell row column deletetable')
      .split(/[ ,]/)
    unless clipboardEnabled()
      contextmenu = exclude contextmenu, ['copy', 'cut', 'paste', 'pastetext']

    # Render menu
    if !menu
      items = []
      tinymce.each contextmenu, (name) ->
        item = editor.menuItems[name]
        if name == '|'
          item = text: name
        if item
          item.shortcut = ''
          # Hide shortcuts
          items.push item
        return
      i = 0
      while i < items.length
        if items[i].text == '|'
          if i == 0 or i == items.length - 1
            items.splice i, 1
        i++
      menu = new (tinymce.ui.Menu)(
        items: items
        context: 'contextmenu').addClass('contextmenu').renderTo()
      editor.on 'remove', ->
        menu.remove()
        menu = null
        return
    else
      menu.show()
    # Position menu
    pos =
      x: e.pageX
      y: e.pageY
    if !editor.inline
      pos = tinymce.DOM.getPos(editor.getContentAreaContainer())
      pos.x += e.clientX
      pos.y += e.clientY
    menu.moveTo pos.x, pos.y
    return
  return
