###
Custom format menu layout for InSales
###

tinymce = require 'tinymce'

defaultStyleFormats = [
  {
    title: 'Headings'
    items: [
      { title: 'Heading 1', format: 'h1' }
      { title: 'Heading 2', format: 'h2' }
      { title: 'Heading 3', format: 'h3' }
      { title: 'Heading 4', format: 'h4' }
      { title: 'Heading 5', format: 'h5' }
      { title: 'Heading 6', format: 'h6' }
    ]
  }
  {
    title: 'Inline'
    items: [
      { title: 'Bold', icon: 'bold', format: 'bold' }
      { title: 'Italic', icon: 'italic', format: 'italic' }
      { title: 'Underline', icon: 'underline', format: 'underline' }
      { title: 'Strikethrough', icon: 'strikethrough', format: 'strikethrough' }
      { title: 'Superscript', icon: 'superscript', format: 'superscript' }
      { title: 'Subscript', icon: 'subscript', format: 'subscript' }
    ]
  }
  { title: 'Font Family', items: 'fontselect' }
  { title: 'Font Sizes', items: 'fontsize' }
  { title: 'Clear formatting', cmd: 'RemoveFormat' }
]

defaultFontsFormats = [
  'Andale Mono=andale mono,times;'
  'Arial=arial,helvetica,sans-serif;'
  'Arial Black=arial black,avant garde;'
  'Book Antiqua=book antiqua,palatino;'
  'Comic Sans MS=comic sans ms,sans-serif;'
  'Courier New=courier new,courier;'
  'Georgia=georgia,palatino;'
  'Helvetica=helvetica;'
  'Impact=impact,chicago;'
  'Symbol=symbol;'
  'Tahoma=tahoma,arial,helvetica,sans-serif;'
  'Terminal=terminal,monaco;'
  'Times New Roman=times new roman,times;'
  'Trebuchet MS=trebuchet ms,geneva;'
  'Verdana=verdana,geneva;'
  'Webdings=webdings;'
  'Wingdings=wingdings,zapf dingbats';
].join('')

defaultFontsizeFormats = '8pt 10pt 12pt 14pt 18pt 24pt 36pt';

tinymce.PluginManager.add "insales_controls", (editor) ->
  createFormats = (formats) ->
    formats = formats.replace(/;$/, '').split(';')
    i = formats.length
    while i--
      formats[i] = formats[i].split('=')
    formats

  toggleFormat = (format) ->
    editor.execCommand 'mceToggleFormat', false, format

  createFormatMenu = ->
    count = 0

    createMenu = (formats) ->
      menu = []
      if !formats
        return

      tinymce.each formats, (format) ->
        menuItem =
          text: format.title
          icon: format.icon
        if format.items
          menuItem.menu = switch format.items
            when 'fontselect'
              createMenu createFontselectMenu()
            when 'fontsize'
              createMenu createFontsizeMenu()
            else
              createMenu format.items
        else
          formatName = format.format
          menuItem.format = formatName
          menuItem = tinymce.extend menuItem, { fontFamily: format.fontFamily, fontSize: format.fontSize, cmd: format.cmd, itemStyle: format.itemStyle }
        menu.push menuItem
        return

      menu

    createFontselectMenu = ->
      fonts = createFormats(editor.settings.font_formats or defaultFontsFormats)
      tinymce.map fonts, (font) ->
        style = if font[1].indexOf('dings') == -1
          "font-family: #{font[1]}; font-size: 14px;"
        else
          ''

        title: font[0]
        fontFamily: font[1]
        itemStyle: style

    createFontsizeMenu = ->
      fontsize_formats = editor.settings.fontsize_formats or defaultFontsizeFormats
      tinymce.map fontsize_formats.split(' '), (item) ->
        title = item
        value = item
        # Allow text=value font sizes.
        values = item.split('=')
        if values.length > 1
          title = values[0]
          value = values[1]

        title: title
        fontSize: value
        itemStyle: "font-size: #{value};"

    createStylesMenu = ->
      menu = undefined
      if editor.settings.style_formats_merge
        if editor.settings.style_formats
          menu = createMenu(defaultStyleFormats.concat(editor.settings.style_formats))
        else
          menu = createMenu(defaultStyleFormats)
      else
        menu = createMenu(editor.settings.style_formats or defaultStyleFormats)
      menu

    type: 'menubutton'
    text: 'Formats'
    menu:
      type: 'menu'
      items: createStylesMenu()
      onPostRender: (e) ->
        editor.fire 'renderFormatsMenu', control: e.control
        return
      itemDefaults:
        preview: true
        textStyle: ->
          if @settings.itemStyle
            return @settings.itemStyle
          else if @settings.format
            return editor.formatter.getCssText(@settings.format)
          return
        onPostRender: ->
          self = this
          self.parent().on 'show', ->
            formatName = undefined
            command = undefined
            formatName = self.settings.format
            if formatName
              self.disabled !editor.formatter.canApply(formatName)
              self.active editor.formatter.match(formatName)
            command = self.settings.cmd
            if command
              self.active editor.queryCommandState(command)
            return
          return
        onclick: ->
          if @settings.format
            toggleFormat @settings.format
          if @settings.fontFamily
            editor.execCommand 'FontName', false, @settings.fontFamily
          if @settings.fontSize
            editor.execCommand 'FontSize', false, @settings.fontSize
          if @settings.cmd
            editor.execCommand @settings.cmd

  createAlignmentMenu = ->
    menuItems = [
      { text: 'Align left', icon: 'alignleft', cmd: 'JustifyLeft', value: 'alignleft' }
      { text: 'Align center', icon: 'aligncenter', cmd: 'JustifyCenter', value: 'aligncenter' }
      { text: 'Align right', icon: 'alignright', cmd: 'JustifyRight', value: 'alignright' }
      { text: 'Justify', icon: 'alignjustify', cmd: 'JustifyFull', value: 'alignjustify' }
    ]

    addOnChangeHandler = ->
      self = this
      editor.on 'nodeChange', (e) ->
        formatter = editor.formatter
        currentItem

        for node in e.parents
          for item in menuItems
            if formatter.matchNode node, item.value
              currentItem = item
              break

        self.icon currentItem.icon if currentItem

    type: 'menubutton'
    icon: 'alignleft'
    menu: menuItems
    fixedWidth: true
    onPostRender: addOnChangeHandler
    onselect: (e) -> editor.execCommand e.control.settings.cmd

  createEditMenu = ->
    menuItems = [
      { text: 'Copy', icon: 'copy', cmd: 'copy' }
      { text: 'Cut', icon: 'cut', cmd: 'cut' }
      { text: 'Paste', icon: 'paste', cmd: 'paste' }
      { text: 'Paste as text', icon: 'pastetext', onclick: editor.menuItems['pastetext'].onclick }
    ]

    clipboardEnabled = ->
      return window.tinyMCE.clipboardEnabled if window.tinyMCE.clipboardEnabled?
      try
        enabled = editor.getDoc().execCommand('copy')
      catch
        window.tinyMCE.clipboardEnabled = false
        return false
      window.tinyMCE.clipboardEnabled = enabled

    me = null
    # editor.on 'init', ->
    #   me.show() if me? # and not clipboardEnabled()

    type: 'menubutton'
    hidden: true
    text: 'Edit'
    menu: menuItems
    onPostRender: -> window.me = this
    onselect: (e) ->
      if e.control.settings.cmd
        editor.execCommand e.control.settings.cmd

  ##################################################

  editor.addButton 'insales_format', createFormatMenu()
  editor.addButton 'insales_textalign', createAlignmentMenu()
  editor.addButton 'insales_edit', createEditMenu()
