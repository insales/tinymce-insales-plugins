###
plugin.js

Copyright, Moxiecode Systems AB
Released under LGPL License.

License: http://www.tinymce.com/license
Contributing: http://www.tinymce.com/contributing
###

###
Forked for InSales
###

tinymce = require 'tinymce'

removePixelSuffix = (value) ->
   if value then value.replace(/px$/, "") else ''

addPixelSuffix = (value) ->
  if value.length > 0 and /^[0-9]+$/.test(value)
    value + "px"
  else
    value

getImageSize = (url, callback) ->
  done = (width, height) ->
    img.parentNode.removeChild img  if img.parentNode
    callback
      width: width
      height: height

  img = document.createElement("img")
  img.onload = -> done img.clientWidth, img.clientHeight
  img.onerror = -> done()

  style = img.style
  style.visibility = "hidden"
  style.position = "fixed"
  style.bottom = style.left = 0
  style.width = style.height = "auto"
  document.body.appendChild img
  img.src = url

buildListItems = (inputList, itemCallback, startItems) ->
  appendItems = (values, output) ->
    output = output or []
    tinymce.each values, (item) ->
      menuItem = text: item.text or item.title
      if item.menu
        menuItem.menu = appendItems(item.menu)
      else
        menuItem.value = item.value
        itemCallback menuItem
      output.push menuItem
    output
  appendItems inputList, startItems or []

isImageNode = (e) ->
  e = e.target if e.target

  e.nodeName is "IMG" and
  not e.getAttribute("data-mce-object") and
  not e.getAttribute("data-mce-placeholder")


class ImageDialog
  constructor: (@editor) ->
    @settings = @editor.settings
    @win = null
    @imgElm = @editor.selection.getNode()
    @loadImgAttribute()

  loadImgAttribute: ->
    if isImageNode(@imgElm)
      @width = @editor.dom.getAttrib(@imgElm, "width") or @imgElm.width
      @height = @editor.dom.getAttrib(@imgElm, "height") or @imgElm.height
      @data =
        src: @editor.dom.getAttrib(@imgElm, "src")
        alt: @editor.dom.getAttrib(@imgElm, "alt")
        class: @editor.dom.getAttrib(@imgElm, "class")
        width: @width
        height: @height

      if @editor.settings.image_adv_tab
        @data.hspace = removePixelSuffix(@imgElm.style.marginLeft or @imgElm.style.marginRight)
        @data.vspace = removePixelSuffix(@imgElm.style.marginTop or @imgElm.style.marginBottom)
        @data.border = removePixelSuffix(@imgElm.style.borderWidth)
        @data.style = @editor.dom.serializeStyle(@editor.dom.parseStyle(@editor.dom.getAttrib(@imgElm, "style")))

      if @editor.settings.image_rollover_tab
        @data.rollover = @editor.dom.getAttrib(@imgElm, 'data-rollover') or ''

    else
      @data = {}
      @imgElm = null

  recalcSize: =>
    widthCtrl = @win.find("#width")[0]
    heightCtrl = @win.find("#height")[0]
    return  if not widthCtrl or not heightCtrl
    newWidth = widthCtrl.value()
    newHeight = heightCtrl.value()
    if @win.find("#constrain")[0].checked() and @width and @height and newWidth and newHeight
      unless @width is newWidth
        newHeight = Math.round((newWidth / @width) * newHeight)
        heightCtrl.value newHeight
      else
        newWidth = Math.round((newHeight / @height) * newWidth)
        widthCtrl.value newWidth
    @width = newWidth
    @height = newHeight

  waitLoad: (data) ->
    selectImage = =>
      @imgElm.onload = @imgElm.onerror = null
      if @editor.selection
        @editor.selection.select @imgElm
        @editor.nodeChanged()

    @imgElm.onload = =>
      if not data.width and not data.height and @editor.settings.imageDimensions
        @editor.dom.setAttribs @imgElm,
          width: @imgElm.clientWidth
          height: @imgElm.clientHeight
      selectImage()

    @imgElm.onerror = selectImage

  handleSubmit: =>
    @updateStyle()
    @recalcSize()

    data = tinymce.extend(@data || {}, @win.toJSON())
    data.alt = ""  unless data.alt
    data.width = null  if data.width is ""
    data.height = null  if data.height is ""
    data.style = null  unless data.style

    rollover = data.rollover

    # Setup new data excluding style properties
    data =
      src: data.src
      alt: data.alt
      width: data.width
      height: data.height
      style: data.style
      class: data["class"]
      onmouseover: null
      onmouseout: null
      'data-rollover': null
      'data-original-src': null

    if rollover
      tinymce.extend data,
        'data-rollover': rollover
        onmouseover: "this.setAttribute('data-original-src', this.src);this.src=this.getAttribute('data-rollover');"
        onmouseout: "this.src=this.getAttribute('data-original-src');this.removeAttribute('data-original-src');"

    @editor.undoManager.transact =>
      unless data.src
        if @imgElm
          @editor.dom.remove @imgElm
          @editor.focus()
          @editor.nodeChanged()
        return

      unless @imgElm
        data.id = "__mcenew"
        @editor.focus()
        @editor.selection.setContent @editor.dom.createHTML("img", data)
        @imgElm = @editor.dom.get("__mcenew")
        @editor.dom.setAttrib @imgElm, "id", null
      else
        @editor.dom.setAttribs @imgElm, data

      @waitLoad data

  handleSrcChange: (e) =>
    target = if e.target instanceof tinymce.ui.Control
      e.target
    else
      @win.getParentCtrl(e.target)

    meta = e.meta or {}

    tinymce.each meta, (value, key) =>
      @win.find("#" + key).value value

    if not meta.width and not meta.height
      getImageSize target.value(), (data) =>
        if data.width and data.height and @editor.settings.image_dimensions
          @width = data.width
          @height = data.height
          @win.find("#width").value @width
          @win.find("#height").value @height

  handleRolloverChange: (e) =>
    target = if e.target instanceof tinymce.ui.Control
      e.target
    else
      @win.getParentCtrl(e.target)

  uploadImage: (e) =>
    $input = $(e.target)
    file = $input.prop('files')[0]
    return unless file

    success = (url) =>
      f = @win.find('#file')[0]
      f.getEl().value = ''
      src = @win.find('#src')
      src.value url
      alt = @win.find('#alt')
      alt?.value file.file_name

    failure = (error) =>
      f = @win.find('#file')[0]
      f.getEl().value = ''
      tt = @win.find('#file_errors')[0]
      tt.text(error)
      pos = @editor.dom.getPos(f.getEl(), tt.parent().getEl())
      tt.moveTo(pos.x, pos.y + f.layoutRect().h)
      tt.show()
      setTimeout (-> tt.hide()), 5000

    @editor.settings.images_upload_handler file, success, failure

  updateStyle: ->
    return unless @editor.settings.image_adv_tab
    data = @win.toJSON()
    css = @editor.dom.parseStyle(data.style)
    delete css.margin

    css["margin-top"] = css["margin-bottom"] = addPixelSuffix(data.vspace)
    css["margin-left"] = css["margin-right"] = addPixelSuffix(data.hspace)
    css["border-width"] = addPixelSuffix(data.border)
    @win.find("#style").value @editor.dom.serializeStyle(@editor.dom.parseStyle(@editor.dom.serializeStyle(css)))

  createImageListControl: (name, value, onSelect) ->
    onAutocomplete = (e) =>
      @completionEngine.get e.control.value(), (datums) ->
        e.control.showAutoComplete(datums)

    type: "combobox"
    label: "Image list"
    name: name
    value: value
    onselectitem: onSelect
    onautocomplete: onAutocomplete
    onfocusin: onAutocomplete
    autocomplete: false

  createClassListControl: ->
    return unless @editor.settings.image_class_list

    name: "class"
    type: "listbox"
    label: "Class"
    values: buildListItems(@editor.settings.image_class_list, (item) =>
      if item.value
        item.textStyle = =>
          @editor.formatter.getCssText
            inline: "img"
            classes: [item.value]
    )

  createDimensionsControl: ->
    type: "container"
    label: "Dimensions"
    layout: "flex"
    direction: "row"
    align: "center"
    spacing: 5
    items: [
      {
        name: "width"
        type: "textbox"
        maxLength: 5
        size: 3
        onchange: @recalcSize
        ariaLabel: "Width"
      }
      {
        type: "label"
        text: "x"
      }
      {
        name: "height"
        type: "textbox"
        maxLength: 5
        size: 3
        onchange: @recalcSize
        ariaLabel: "Height"
      }
      {
        name: "constrain"
        type: "checkbox"
        checked: true
        text: "Constrain proportions"
      }
    ]


  generalFormItems: ->
    onSelectImage = (image) =>
      @win.find("#alt").value(image.title)
      @win.find("#src").value(image.value).fire "change"
      imageListCtrl = @win.find('#image_list')[0]
      imageListCtrl.value image.title if imageListCtrl

    items = [
      {
        name: "src"
        type: "filepicker"
        filetype: "image"
        label: "Source"
        autofocus: true
        onchange: @handleSrcChange
      }
      @createImageListControl('image_list', @editor.convertURL(@data.src || '', "src"), onSelectImage)
      {
        name: 'file'
        type: 'textbox'
        subtype: 'file'
        label: 'Upload image'
        onchange: @uploadImage
      }
      {
        name: 'file_errors'
        type: 'tooltip'
        hidden: true
      }
    ]

    if @editor.settings.image_description
      items.push
        name: "alt"
        type: "textbox"
        label: "Image description"

    items.push @createDimensionsControl()
    items.push @createClassListControl()

    items

  advancedFormItems: ->
    [
      {
        label: "Style"
        name: "style"
        type: "textbox"
      }
      {
        type: "form"
        layout: "grid"
        packV: "start"
        columns: 2
        padding: 0
        alignH: [
          "left"
          "right"
        ]
        defaults:
          type: "textbox"
          maxWidth: 50
          onchange: @updateStyle

        items: [
          {
            label: "Vertical space"
            name: "vspace"
          }
          {
            label: "Horizontal space"
            name: "hspace"
          }
          {
            label: "Border"
            name: "border"
          }
        ]
      }
    ]

  rolloverFormItems: ->
    onSelectImage = (image) =>
      @win.find("#rollover").value(image.value).fire "change"
      rolloverListCtrl = @win.find('#rollover_image_list')[0]
      rolloverListCtrl.value image.title if rolloverListCtrl

    [
      {
        label: 'Rollover image'
        name: 'rollover'
        type: 'filepicker'
        onchange: @handleRolloverChange
      }
      @createImageListControl('rollover_image_list', @editor.convertURL(@data.rollover, 'src'), onSelectImage)
    ]

  openDialog: ->
    panels = [
      title: "General"
      type: "form"
      items: @generalFormItems()
    ]

    if @editor.settings.image_adv_tab
      panels.push
        title: 'Advanced'
        type: 'form'
        pack: 'start'
        items: @advancedFormItems()

    if @editor.settings.image_rollover_tab
      panels.push
        title: 'Rollover'
        type: 'form'
        pack: 'start'
        items: @rolloverFormItems()

    @win = @editor.windowManager.open
      title: "Insert/edit image"
      data: @data
      body: panels
      bodyType: if panels.length > 1 then 'tabpanel'
      onSubmit: @handleSubmit

    urlSeparator = if @editor.settings.image_list.indexOf('?') == -1 then '?' else '&'

    @completionEngine = new Bloodhound
      queryTokenizer: Bloodhound.tokenizers.nonword
      datumTokenizer: Bloodhound.tokenizers.obj.nonword('title')
      remote:
        url: "#{@editor.settings.image_list}#{urlSeparator}q=%QUERY"
        wildcard: '%QUERY'
      limit: 50

    @completionEngine.initialize(true)

#global tinymce:true
tinymce.PluginManager.add "insales_image", (editor) ->
  showDialog = ->
    new ImageDialog(editor).openDialog()

  editor.addButton "image",
    icon: "image"
    tooltip: "Insert/edit image"
    onclick: showDialog
    stateSelector: "img:not([data-mce-object],[data-mce-placeholder])"

  editor.addMenuItem "image",
    icon: "image"
    text: "Insert image"
    onclick: showDialog
    context: "insert"
    prependToContext: true

  editor.addCommand "mceImage", showDialog

  editor.on 'DblClick', (e) ->
    editor.execCommand('mceImage') if isImageNode e
