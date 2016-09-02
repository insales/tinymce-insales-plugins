/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__( /*! ./plugins/insales_contextmenu_plugin */ 1);
	__webpack_require__( /*! ./plugins/insales_controls_plugin */ 3);
	__webpack_require__( /*! ./plugins/insales_image_plugin */ 4);
	__webpack_require__(/*! ./plugins/insales_table_plugin */ 5);


/***/ },
/* 1 */
/*!*******************************************************!*\
  !*** ./src/plugins/insales_contextmenu_plugin.coffee ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * plugin.js
	 *
	 * Copyright, Moxiecode Systems AB
	 * Released under LGPL License.
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/* Forked for InSales */
	var tinymce,
	  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

	tinymce = __webpack_require__(/*! tinymce */ 2);

	tinymce.PluginManager.add('insales_contextmenu', function(editor) {
	  var clipboardEnabled, contextmenuNeverUseNative, exclude, menu;
	  menu = void 0;
	  contextmenuNeverUseNative = editor.settings.contextmenu_never_use_native;
	  clipboardEnabled = function() {
	    var enabled, error;
	    if (window.tinyMCE.clipboardEnabled != null) {
	      return window.tinyMCE.clipboardEnabled;
	    }
	    try {
	      enabled = editor.getDoc().execCommand('copy');
	    } catch (error) {
	      window.tinyMCE.clipboardEnabled = false;
	      return false;
	    }
	    return window.tinyMCE.clipboardEnabled = enabled;
	  };
	  exclude = function(list, values) {
	    var item, j, len, results;
	    results = [];
	    for (j = 0, len = list.length; j < len; j++) {
	      item = list[j];
	      if (indexOf.call(values, item) < 0) {
	        results.push(item);
	      }
	    }
	    return results;
	  };
	  editor.on('contextmenu', function(e) {
	    var contextmenu, doc, i, items, pos;
	    contextmenu = void 0;
	    doc = editor.getDoc();
	    if (e.ctrlKey && !contextmenuNeverUseNative) {
	      return;
	    }
	    e.preventDefault();

	    /**
	     * WebKit/Blink on Mac has the odd behavior of selecting the target word or line this causes
	     * issues when for example inserting images see: #7022
	     */
	    if (tinymce.Env.mac && tinymce.Env.webkit) {
	      if (e.button === 2 && doc.caretRangeFromPoint) {
	        editor.selection.setRng(doc.caretRangeFromPoint(e.x, e.y));
	      }
	    }
	    contextmenu = (editor.settings.contextmenu || 'link image inserttable | cell row column deletetable').split(/[ ,]/);
	    if (!clipboardEnabled()) {
	      contextmenu = exclude(contextmenu, ['copy', 'cut', 'paste', 'pastetext']);
	    }
	    if (!menu) {
	      items = [];
	      tinymce.each(contextmenu, function(name) {
	        var item;
	        item = editor.menuItems[name];
	        if (name === '|') {
	          item = {
	            text: name
	          };
	        }
	        if (item) {
	          item.shortcut = '';
	          items.push(item);
	        }
	      });
	      i = 0;
	      while (i < items.length) {
	        if (items[i].text === '|') {
	          if (i === 0 || i === items.length - 1) {
	            items.splice(i, 1);
	          }
	        }
	        i++;
	      }
	      menu = new tinymce.ui.Menu({
	        items: items,
	        context: 'contextmenu'
	      }).addClass('contextmenu').renderTo();
	      editor.on('remove', function() {
	        menu.remove();
	        menu = null;
	      });
	    } else {
	      menu.show();
	    }
	    pos = {
	      x: e.pageX,
	      y: e.pageY
	    };
	    if (!editor.inline) {
	      pos = tinymce.DOM.getPos(editor.getContentAreaContainer());
	      pos.x += e.clientX;
	      pos.y += e.clientY;
	    }
	    menu.moveTo(pos.x, pos.y);
	  });
	});


/***/ },
/* 2 */
/*!**************************!*\
  !*** external "tinymce" ***!
  \**************************/
/***/ function(module, exports) {

	module.exports = tinymce;

/***/ },
/* 3 */
/*!****************************************************!*\
  !*** ./src/plugins/insales_controls_plugin.coffee ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	/*
	Custom format menu layout for InSales
	 */
	var defaultFontsFormats, defaultFontsizeFormats, defaultStyleFormats, tinymce;

	tinymce = __webpack_require__(/*! tinymce */ 2);

	defaultStyleFormats = [
	  {
	    title: 'Headings',
	    items: [
	      {
	        title: 'Heading 1',
	        format: 'h1'
	      }, {
	        title: 'Heading 2',
	        format: 'h2'
	      }, {
	        title: 'Heading 3',
	        format: 'h3'
	      }, {
	        title: 'Heading 4',
	        format: 'h4'
	      }, {
	        title: 'Heading 5',
	        format: 'h5'
	      }, {
	        title: 'Heading 6',
	        format: 'h6'
	      }
	    ]
	  }, {
	    title: 'Inline',
	    items: [
	      {
	        title: 'Bold',
	        icon: 'bold',
	        format: 'bold'
	      }, {
	        title: 'Italic',
	        icon: 'italic',
	        format: 'italic'
	      }, {
	        title: 'Underline',
	        icon: 'underline',
	        format: 'underline'
	      }, {
	        title: 'Strikethrough',
	        icon: 'strikethrough',
	        format: 'strikethrough'
	      }, {
	        title: 'Superscript',
	        icon: 'superscript',
	        format: 'superscript'
	      }, {
	        title: 'Subscript',
	        icon: 'subscript',
	        format: 'subscript'
	      }
	    ]
	  }, {
	    title: 'Font Family',
	    items: 'fontselect'
	  }, {
	    title: 'Font Sizes',
	    items: 'fontsize'
	  }, {
	    title: 'Clear formatting',
	    cmd: 'RemoveFormat'
	  }
	];

	defaultFontsFormats = ['Andale Mono=andale mono,times;', 'Arial=arial,helvetica,sans-serif;', 'Arial Black=arial black,avant garde;', 'Book Antiqua=book antiqua,palatino;', 'Comic Sans MS=comic sans ms,sans-serif;', 'Courier New=courier new,courier;', 'Georgia=georgia,palatino;', 'Helvetica=helvetica;', 'Impact=impact,chicago;', 'Symbol=symbol;', 'Tahoma=tahoma,arial,helvetica,sans-serif;', 'Terminal=terminal,monaco;', 'Times New Roman=times new roman,times;', 'Trebuchet MS=trebuchet ms,geneva;', 'Verdana=verdana,geneva;', 'Webdings=webdings;', 'Wingdings=wingdings,zapf dingbats'].join('');

	defaultFontsizeFormats = '8pt 10pt 12pt 14pt 18pt 24pt 36pt';

	tinymce.PluginManager.add("insales_controls", function(editor) {
	  var createAlignmentMenu, createEditMenu, createFormatMenu, createFormats, toggleFormat;
	  createFormats = function(formats) {
	    var i;
	    formats = formats.replace(/;$/, '').split(';');
	    i = formats.length;
	    while (i--) {
	      formats[i] = formats[i].split('=');
	    }
	    return formats;
	  };
	  toggleFormat = function(format) {
	    return editor.execCommand('mceToggleFormat', false, format);
	  };
	  createFormatMenu = function() {
	    var count, createFontselectMenu, createFontsizeMenu, createMenu, createStylesMenu, newFormats;
	    count = 0;
	    newFormats = [];
	    createMenu = function(formats) {
	      var menu;
	      menu = [];
	      if (!formats) {
	        return;
	      }
	      tinymce.each(formats, function(format) {
	        var formatName, menuItem;
	        menuItem = {
	          text: format.title,
	          icon: format.icon
	        };
	        if (format.items) {
	          menuItem.menu = (function() {
	            switch (format.items) {
	              case 'fontselect':
	                return createMenu(createFontselectMenu());
	              case 'fontsize':
	                return createMenu(createFontsizeMenu());
	              default:
	                return createMenu(format.items);
	            }
	          })();
	        } else {
	          formatName = format.format || 'custom' + count++;
	          if (!format.format) {
	            format.name = formatName;
	            newFormats.push(format);
	          }
	          menuItem.format = formatName;
	          menuItem = tinymce.extend(menuItem, {
	            fontFamily: format.fontFamily,
	            fontSize: format.fontSize,
	            cmd: format.cmd,
	            itemStyle: format.itemStyle
	          });
	        }
	        menu.push(menuItem);
	      });
	      return menu;
	    };
	    createFontselectMenu = function() {
	      var fonts;
	      fonts = createFormats(editor.settings.font_formats || defaultFontsFormats);
	      return tinymce.map(fonts, function(font) {
	        var style;
	        style = font[1].indexOf('dings') === -1 ? "font-family: " + font[1] + "; font-size: 14px;" : '';
	        return {
	          title: font[0],
	          fontFamily: font[1],
	          itemStyle: style
	        };
	      });
	    };
	    createFontsizeMenu = function() {
	      var fontsize_formats;
	      fontsize_formats = editor.settings.fontsize_formats || defaultFontsizeFormats;
	      return tinymce.map(fontsize_formats.split(' '), function(item) {
	        var title, value, values;
	        title = item;
	        value = item;
	        values = item.split('=');
	        if (values.length > 1) {
	          title = values[0];
	          value = values[1];
	        }
	        return {
	          title: title,
	          fontSize: value,
	          itemStyle: "font-size: " + value + ";"
	        };
	      });
	    };
	    createStylesMenu = function() {
	      var menu;
	      menu = void 0;
	      if (editor.settings.style_formats_merge) {
	        if (editor.settings.style_formats) {
	          menu = createMenu(defaultStyleFormats.concat(editor.settings.style_formats));
	        } else {
	          menu = createMenu(defaultStyleFormats);
	        }
	      } else {
	        menu = createMenu(editor.settings.style_formats || defaultStyleFormats);
	      }
	      return menu;
	    };
	    editor.on('init', function() {
	      tinymce.each(newFormats, function(format) {
	        editor.formatter.register(format.name, format);
	      });
	    });
	    return {
	      type: 'menubutton',
	      text: 'Formats',
	      menu: {
	        type: 'menu',
	        items: createStylesMenu(),
	        onPostRender: function(e) {
	          editor.fire('renderFormatsMenu', {
	            control: e.control
	          });
	        },
	        itemDefaults: {
	          preview: true,
	          textStyle: function() {
	            if (this.settings.itemStyle) {
	              return this.settings.itemStyle;
	            } else if (this.settings.format) {
	              return editor.formatter.getCssText(this.settings.format);
	            }
	          },
	          onPostRender: function() {
	            var self;
	            self = this;
	            self.parent().on('show', function() {
	              var command, formatName;
	              formatName = void 0;
	              command = void 0;
	              formatName = self.settings.format;
	              if (formatName) {
	                self.disabled(!editor.formatter.canApply(formatName));
	                self.active(editor.formatter.match(formatName));
	              }
	              command = self.settings.cmd;
	              if (command) {
	                self.active(editor.queryCommandState(command));
	              }
	            });
	          },
	          onclick: function() {
	            if (this.settings.format) {
	              toggleFormat(this.settings.format);
	            }
	            if (this.settings.fontFamily) {
	              editor.execCommand('FontName', false, this.settings.fontFamily);
	            }
	            if (this.settings.fontSize) {
	              editor.execCommand('FontSize', false, this.settings.fontSize);
	            }
	            if (this.settings.cmd) {
	              return editor.execCommand(this.settings.cmd);
	            }
	          }
	        }
	      }
	    };
	  };
	  createAlignmentMenu = function() {
	    var addOnChangeHandler, menuItems;
	    menuItems = [
	      {
	        text: 'Align left',
	        icon: 'alignleft',
	        cmd: 'JustifyLeft',
	        value: 'alignleft'
	      }, {
	        text: 'Align center',
	        icon: 'aligncenter',
	        cmd: 'JustifyCenter',
	        value: 'aligncenter'
	      }, {
	        text: 'Align right',
	        icon: 'alignright',
	        cmd: 'JustifyRight',
	        value: 'alignright'
	      }, {
	        text: 'Justify',
	        icon: 'alignjustify',
	        cmd: 'JustifyFull',
	        value: 'alignjustify'
	      }
	    ];
	    addOnChangeHandler = function() {
	      var self;
	      self = this;
	      return editor.on('nodeChange', function(e) {
	        var currentItem, formatter, item, j, k, len, len1, node, ref;
	        formatter = editor.formatter;
	        currentItem;
	        ref = e.parents;
	        for (j = 0, len = ref.length; j < len; j++) {
	          node = ref[j];
	          for (k = 0, len1 = menuItems.length; k < len1; k++) {
	            item = menuItems[k];
	            if (formatter.matchNode(node, item.value)) {
	              currentItem = item;
	              break;
	            }
	          }
	        }
	        if (currentItem) {
	          return self.icon(currentItem.icon);
	        }
	      });
	    };
	    return {
	      type: 'menubutton',
	      icon: 'alignleft',
	      menu: menuItems,
	      fixedWidth: true,
	      onPostRender: addOnChangeHandler,
	      onselect: function(e) {
	        return editor.execCommand(e.control.settings.cmd);
	      }
	    };
	  };
	  createEditMenu = function() {
	    var clipboardEnabled, me, menuItems;
	    menuItems = [
	      {
	        text: 'Copy',
	        icon: 'copy',
	        cmd: 'copy'
	      }, {
	        text: 'Cut',
	        icon: 'cut',
	        cmd: 'cut'
	      }, {
	        text: 'Paste',
	        icon: 'paste',
	        cmd: 'paste'
	      }, {
	        text: 'Paste as text',
	        icon: 'pastetext',
	        onclick: editor.menuItems['pastetext'].onclick
	      }
	    ];
	    clipboardEnabled = function() {
	      var enabled, error;
	      if (window.tinyMCE.clipboardEnabled != null) {
	        return window.tinyMCE.clipboardEnabled;
	      }
	      try {
	        enabled = editor.getDoc().execCommand('copy');
	      } catch (error) {
	        window.tinyMCE.clipboardEnabled = false;
	        return false;
	      }
	      return window.tinyMCE.clipboardEnabled = enabled;
	    };
	    me = null;
	    return {
	      type: 'menubutton',
	      hidden: true,
	      text: 'Edit',
	      menu: menuItems,
	      onPostRender: function() {
	        return window.me = this;
	      },
	      onselect: function(e) {
	        if (e.control.settings.cmd) {
	          return editor.execCommand(e.control.settings.cmd);
	        }
	      }
	    };
	  };
	  editor.addButton('insales_format', createFormatMenu());
	  editor.addButton('insales_textalign', createAlignmentMenu());
	  return editor.addButton('insales_edit', createEditMenu());
	});


/***/ },
/* 4 */
/*!*************************************************!*\
  !*** ./src/plugins/insales_image_plugin.coffee ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	
	/*
	plugin.js

	Copyright, Moxiecode Systems AB
	Released under LGPL License.

	License: http://www.tinymce.com/license
	Contributing: http://www.tinymce.com/contributing
	 */

	/*
	Forked for InSales
	 */
	var ImageDialog, addPixelSuffix, buildListItems, getImageSize, isImageNode, removePixelSuffix, tinymce,
	  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

	tinymce = __webpack_require__(/*! tinymce */ 2);

	removePixelSuffix = function(value) {
	  if (value) {
	    return value.replace(/px$/, "");
	  } else {
	    return '';
	  }
	};

	addPixelSuffix = function(value) {
	  if (value.length > 0 && /^[0-9]+$/.test(value)) {
	    return value + "px";
	  } else {
	    return value;
	  }
	};

	getImageSize = function(url, callback) {
	  var done, img, style;
	  done = function(width, height) {
	    if (img.parentNode) {
	      img.parentNode.removeChild(img);
	    }
	    return callback({
	      width: width,
	      height: height
	    });
	  };
	  img = document.createElement("img");
	  img.onload = function() {
	    return done(img.clientWidth, img.clientHeight);
	  };
	  img.onerror = function() {
	    return done();
	  };
	  style = img.style;
	  style.visibility = "hidden";
	  style.position = "fixed";
	  style.bottom = style.left = 0;
	  style.width = style.height = "auto";
	  document.body.appendChild(img);
	  return img.src = url;
	};

	buildListItems = function(inputList, itemCallback, startItems) {
	  var appendItems;
	  appendItems = function(values, output) {
	    output = output || [];
	    tinymce.each(values, function(item) {
	      var menuItem;
	      menuItem = {
	        text: item.text || item.title
	      };
	      if (item.menu) {
	        menuItem.menu = appendItems(item.menu);
	      } else {
	        menuItem.value = item.value;
	        itemCallback(menuItem);
	      }
	      return output.push(menuItem);
	    });
	    return output;
	  };
	  return appendItems(inputList, startItems || []);
	};

	isImageNode = function(e) {
	  if (e.target) {
	    e = e.target;
	  }
	  return e.nodeName === "IMG" && !e.getAttribute("data-mce-object") && !e.getAttribute("data-mce-placeholder");
	};

	ImageDialog = (function() {
	  function ImageDialog(editor1, imageList1) {
	    this.editor = editor1;
	    this.imageList = imageList1;
	    this.uploadImage = bind(this.uploadImage, this);
	    this.handleRolloverChange = bind(this.handleRolloverChange, this);
	    this.handleSrcChange = bind(this.handleSrcChange, this);
	    this.handleSubmit = bind(this.handleSubmit, this);
	    this.recalcSize = bind(this.recalcSize, this);
	    this.settings = this.editor.settings;
	    this.win = null;
	    this.imgElm = this.editor.selection.getNode();
	    this.loadImgAttribute();
	  }

	  ImageDialog.prototype.loadImgAttribute = function() {
	    if (isImageNode(this.imgElm)) {
	      this.width = this.editor.dom.getAttrib(this.imgElm, "width") || this.imgElm.width;
	      this.height = this.editor.dom.getAttrib(this.imgElm, "height") || this.imgElm.height;
	      this.data = {
	        src: this.editor.dom.getAttrib(this.imgElm, "src"),
	        alt: this.editor.dom.getAttrib(this.imgElm, "alt"),
	        "class": this.editor.dom.getAttrib(this.imgElm, "class"),
	        width: this.width,
	        height: this.height
	      };
	      if (this.editor.settings.image_adv_tab) {
	        this.data.hspace = removePixelSuffix(this.imgElm.style.marginLeft || this.imgElm.style.marginRight);
	        this.data.vspace = removePixelSuffix(this.imgElm.style.marginTop || this.imgElm.style.marginBottom);
	        this.data.border = removePixelSuffix(this.imgElm.style.borderWidth);
	        this.data.style = this.editor.dom.serializeStyle(this.editor.dom.parseStyle(this.editor.dom.getAttrib(this.imgElm, "style")));
	      }
	      if (this.editor.settings.image_rollover_tab) {
	        return this.data.rollover = this.editor.dom.getAttrib(this.imgElm, 'data-rollover') || '';
	      }
	    } else {
	      this.data = {};
	      return this.imgElm = null;
	    }
	  };

	  ImageDialog.prototype.recalcSize = function() {
	    var heightCtrl, newHeight, newWidth, widthCtrl;
	    widthCtrl = this.win.find("#width")[0];
	    heightCtrl = this.win.find("#height")[0];
	    if (!widthCtrl || !heightCtrl) {
	      return;
	    }
	    newWidth = widthCtrl.value();
	    newHeight = heightCtrl.value();
	    if (this.win.find("#constrain")[0].checked() && this.width && this.height && newWidth && newHeight) {
	      if (this.width !== newWidth) {
	        newHeight = Math.round((newWidth / this.width) * newHeight);
	        heightCtrl.value(newHeight);
	      } else {
	        newWidth = Math.round((newHeight / this.height) * newWidth);
	        widthCtrl.value(newWidth);
	      }
	    }
	    this.width = newWidth;
	    return this.height = newHeight;
	  };

	  ImageDialog.prototype.waitLoad = function(data) {
	    var selectImage;
	    selectImage = (function(_this) {
	      return function() {
	        _this.imgElm.onload = _this.imgElm.onerror = null;
	        if (_this.editor.selection) {
	          _this.editor.selection.select(_this.imgElm);
	          return _this.editor.nodeChanged();
	        }
	      };
	    })(this);
	    this.imgElm.onload = (function(_this) {
	      return function() {
	        if (!data.width && !data.height && _this.editor.settings.imageDimensions) {
	          _this.editor.dom.setAttribs(_this.imgElm, {
	            width: _this.imgElm.clientWidth,
	            height: _this.imgElm.clientHeight
	          });
	        }
	        return selectImage();
	      };
	    })(this);
	    return this.imgElm.onerror = selectImage;
	  };

	  ImageDialog.prototype.handleSubmit = function() {
	    var data, rollover;
	    this.updateStyle();
	    this.recalcSize();
	    data = tinymce.extend(this.data || {}, this.win.toJSON());
	    if (!data.alt) {
	      data.alt = "";
	    }
	    if (data.width === "") {
	      data.width = null;
	    }
	    if (data.height === "") {
	      data.height = null;
	    }
	    if (!data.style) {
	      data.style = null;
	    }
	    rollover = data.rollover;
	    data = {
	      src: data.src,
	      alt: data.alt,
	      width: data.width,
	      height: data.height,
	      style: data.style,
	      "class": data["class"],
	      onmouseover: null,
	      onmouseout: null,
	      'data-rollover': null,
	      'data-original-src': null
	    };
	    if (rollover) {
	      tinymce.extend(data, {
	        'data-rollover': rollover,
	        onmouseover: "this.setAttribute('data-original-src', this.src);this.src=this.getAttribute('data-rollover');",
	        onmouseout: "this.src=this.getAttribute('data-original-src');this.removeAttribute('data-original-src');"
	      });
	    }
	    return this.editor.undoManager.transact((function(_this) {
	      return function() {
	        if (!data.src) {
	          if (_this.imgElm) {
	            _this.editor.dom.remove(_this.imgElm);
	            _this.editor.focus();
	            _this.editor.nodeChanged();
	          }
	          return;
	        }
	        if (!_this.imgElm) {
	          data.id = "__mcenew";
	          _this.editor.focus();
	          _this.editor.selection.setContent(_this.editor.dom.createHTML("img", data));
	          _this.imgElm = _this.editor.dom.get("__mcenew");
	          _this.editor.dom.setAttrib(_this.imgElm, "id", null);
	        } else {
	          _this.editor.dom.setAttribs(_this.imgElm, data);
	        }
	        return _this.waitLoad(data);
	      };
	    })(this));
	  };

	  ImageDialog.prototype.handleSrcChange = function(e) {
	    var imageListCtrl, meta, target;
	    target = e.target instanceof tinymce.ui.Control ? e.target : this.win.getParentCtrl(e.target);
	    meta = e.meta || {};
	    tinymce.each(meta, (function(_this) {
	      return function(value, key) {
	        return _this.win.find("#" + key).value(value);
	      };
	    })(this));
	    if (!meta.width && !meta.height) {
	      getImageSize(target.value(), (function(_this) {
	        return function(data) {
	          if (data.width && data.height && _this.editor.settings.image_dimensions) {
	            _this.width = data.width;
	            _this.height = data.height;
	            _this.win.find("#width").value(_this.width);
	            return _this.win.find("#height").value(_this.height);
	          }
	        };
	      })(this));
	    }
	    imageListCtrl = this.win.find('#image_list')[0];
	    if (imageListCtrl) {
	      return imageListCtrl.value(this.editor.convertURL(e.target.value(), "src"));
	    }
	  };

	  ImageDialog.prototype.handleRolloverChange = function(e) {
	    var rolloverListCtrl, target;
	    target = e.target instanceof tinymce.ui.Control ? e.target : this.win.getParentCtrl(e.target);
	    rolloverListCtrl = this.win.find('#rollover_image_list')[0];
	    if (rolloverListCtrl) {
	      return rolloverListCtrl.value(this.editor.convertURL(target.value(), 'src'));
	    }
	  };

	  ImageDialog.prototype.uploadImage = function(e) {
	    var $input, failure, file, success;
	    $input = $(e.target);
	    file = $input.prop('files')[0];
	    if (!file) {
	      return;
	    }
	    success = (function(_this) {
	      return function(url) {
	        var alt, f, src;
	        f = _this.win.find('#file')[0];
	        f.getEl().value = '';
	        src = _this.win.find('#src');
	        src.value(url);
	        alt = _this.win.find('#alt');
	        return alt != null ? alt.value(file.file_name) : void 0;
	      };
	    })(this);
	    failure = (function(_this) {
	      return function(error) {
	        var f, pos, tt;
	        f = _this.win.find('#file')[0];
	        f.getEl().value = '';
	        tt = _this.win.find('#file_errors')[0];
	        tt.text(error);
	        pos = _this.editor.dom.getPos(f.getEl(), tt.parent().getEl());
	        tt.moveTo(pos.x, pos.y + f.layoutRect().h);
	        tt.show();
	        return setTimeout((function() {
	          return tt.hide();
	        }), 5000);
	      };
	    })(this);
	    return this.editor.settings.images_upload_handler(file, success, failure);
	  };

	  ImageDialog.prototype.updateStyle = function() {
	    var css, data;
	    if (!this.editor.settings.image_adv_tab) {
	      return;
	    }
	    data = this.win.toJSON();
	    css = this.editor.dom.parseStyle(data.style);
	    delete css.margin;
	    css["margin-top"] = css["margin-bottom"] = addPixelSuffix(data.vspace);
	    css["margin-left"] = css["margin-right"] = addPixelSuffix(data.hspace);
	    css["border-width"] = addPixelSuffix(data.border);
	    return this.win.find("#style").value(this.editor.dom.serializeStyle(this.editor.dom.parseStyle(this.editor.dom.serializeStyle(css))));
	  };

	  ImageDialog.prototype.createImageListControl = function(name, value, onSelect) {
	    if (!this.imageList) {
	      return;
	    }
	    return {
	      type: "listbox",
	      label: "Image list",
	      name: name,
	      values: buildListItems(this.imageList, (function(_this) {
	        return function(item) {
	          return item.value = _this.editor.convertURL(item.value || item.url, "src");
	        };
	      })(this), [
	        {
	          text: "None",
	          value: ""
	        }
	      ]),
	      value: value,
	      onselect: onSelect
	    };
	  };

	  ImageDialog.prototype.createClassListControl = function() {
	    if (!this.editor.settings.image_class_list) {
	      return;
	    }
	    return {
	      name: "class",
	      type: "listbox",
	      label: "Class",
	      values: buildListItems(this.editor.settings.image_class_list, (function(_this) {
	        return function(item) {
	          if (item.value) {
	            return item.textStyle = function() {
	              return _this.editor.formatter.getCssText({
	                inline: "img",
	                classes: [item.value]
	              });
	            };
	          }
	        };
	      })(this))
	    };
	  };

	  ImageDialog.prototype.createDimensionsControl = function() {
	    return {
	      type: "container",
	      label: "Dimensions",
	      layout: "flex",
	      direction: "row",
	      align: "center",
	      spacing: 5,
	      items: [
	        {
	          name: "width",
	          type: "textbox",
	          maxLength: 5,
	          size: 3,
	          onchange: this.recalcSize,
	          ariaLabel: "Width"
	        }, {
	          type: "label",
	          text: "x"
	        }, {
	          name: "height",
	          type: "textbox",
	          maxLength: 5,
	          size: 3,
	          onchange: this.recalcSize,
	          ariaLabel: "Height"
	        }, {
	          name: "constrain",
	          type: "checkbox",
	          checked: true,
	          text: "Constrain proportions"
	        }
	      ]
	    };
	  };

	  ImageDialog.prototype.generalFormItems = function() {
	    var items, onSelectImage;
	    onSelectImage = (function(_this) {
	      return function(e) {
	        var altCtrl;
	        altCtrl = _this.win.find("#alt");
	        if (!altCtrl.value() || e.lastControl && altCtrl.value() === e.lastControl.text()) {
	          altCtrl.value(e.control.text());
	        }
	        return _this.win.find("#src").value(e.control.value()).fire("change");
	      };
	    })(this);
	    items = [
	      {
	        name: "src",
	        type: "filepicker",
	        filetype: "image",
	        label: "Source",
	        autofocus: true,
	        onchange: this.handleSrcChange
	      }, this.createImageListControl('image_list', this.editor.convertURL(this.data.src, "src"), onSelectImage), {
	        name: 'file',
	        type: 'textbox',
	        subtype: 'file',
	        label: 'Upload image',
	        onchange: this.uploadImage
	      }, {
	        name: 'file_errors',
	        type: 'tooltip',
	        hidden: true
	      }
	    ];
	    if (this.editor.settings.image_description) {
	      items.push({
	        name: "alt",
	        type: "textbox",
	        label: "Image description"
	      });
	    }
	    items.push(this.createDimensionsControl());
	    items.push(this.createClassListControl());
	    return items;
	  };

	  ImageDialog.prototype.advancedFormItems = function() {
	    return [
	      {
	        label: "Style",
	        name: "style",
	        type: "textbox"
	      }, {
	        type: "form",
	        layout: "grid",
	        packV: "start",
	        columns: 2,
	        padding: 0,
	        alignH: ["left", "right"],
	        defaults: {
	          type: "textbox",
	          maxWidth: 50,
	          onchange: this.updateStyle
	        },
	        items: [
	          {
	            label: "Vertical space",
	            name: "vspace"
	          }, {
	            label: "Horizontal space",
	            name: "hspace"
	          }, {
	            label: "Border",
	            name: "border"
	          }
	        ]
	      }
	    ];
	  };

	  ImageDialog.prototype.rolloverFormItems = function() {
	    var onSelectImage;
	    onSelectImage = (function(_this) {
	      return function(e) {
	        return _this.win.find("#rollover").value(e.control.value()).fire("change");
	      };
	    })(this);
	    return [
	      {
	        label: 'Rollover image',
	        name: 'rollover',
	        type: 'filepicker',
	        onchange: this.handleRolloverChange
	      }, this.createImageListControl('rollover_image_list', this.editor.convertURL(this.data.rollover, 'src'), onSelectImage)
	    ];
	  };

	  ImageDialog.prototype.openDialog = function() {
	    var panels;
	    panels = [
	      {
	        title: "General",
	        type: "form",
	        items: this.generalFormItems()
	      }
	    ];
	    if (this.editor.settings.image_adv_tab) {
	      panels.push({
	        title: 'Advanced',
	        type: 'form',
	        pack: 'start',
	        items: this.advancedFormItems()
	      });
	    }
	    if (this.editor.settings.image_rollover_tab) {
	      panels.push({
	        title: 'Rollover',
	        type: 'form',
	        pack: 'start',
	        items: this.rolloverFormItems()
	      });
	    }
	    return this.win = this.editor.windowManager.open({
	      title: "Insert/edit image",
	      data: this.data,
	      body: panels,
	      bodyType: panels.length > 1 ? 'tabpanel' : void 0,
	      onSubmit: this.handleSubmit
	    });
	  };

	  return ImageDialog;

	})();

	tinymce.PluginManager.add("insales_image", function(editor) {
	  var showDialog, withImageList;
	  withImageList = function(callback) {
	    return function() {
	      var imageList;
	      imageList = editor.settings.image_list;
	      if (typeof imageList === "string") {
	        console.log("ImageList XHR");
	        return tinymce.util.XHR.send({
	          url: imageList,
	          success: function(text) {
	            return callback(tinymce.util.JSON.parse(text));
	          }
	        });
	      } else if (typeof imageList === "function") {
	        return imageList(callback);
	      } else {
	        return callback(imageList);
	      }
	    };
	  };
	  showDialog = function(imageList) {
	    return new ImageDialog(editor, imageList).openDialog();
	  };
	  editor.addButton("image", {
	    icon: "image",
	    tooltip: "Insert/edit image",
	    onclick: withImageList(showDialog),
	    stateSelector: "img:not([data-mce-object],[data-mce-placeholder])"
	  });
	  editor.addMenuItem("image", {
	    icon: "image",
	    text: "Insert image",
	    onclick: withImageList(showDialog),
	    context: "insert",
	    prependToContext: true
	  });
	  editor.addCommand("mceImage", withImageList(showDialog));
	  return editor.on('DblClick', function(e) {
	    if (isImageNode(e)) {
	      return editor.execCommand('mceImage');
	    }
	  });
	});


/***/ },
/* 5 */
/*!*********************************************!*\
  !*** ./src/plugins/insales_table_plugin.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./table_plugin/Plugin */ 6);


/***/ },
/* 6 */
/*!********************************************!*\
  !*** ./src/plugins/table_plugin/Plugin.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Plugin.js
	 *
	 * Released under LGPL License.
	 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/**
	 * This class contains all core logic for the table plugin.
	 *
	 * @class tinymce.tableplugin.Plugin
	 * @private
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(/*! tinymce/tableplugin/TableGrid */ 7),
	    __webpack_require__(/*! tinymce/tableplugin/Quirks */ 12),
	    __webpack_require__(/*! tinymce/tableplugin/CellSelection */ 15),
	    __webpack_require__(/*! tinymce/tableplugin/Dialogs */ 17),
	    __webpack_require__(/*! tinymce/tableplugin/ResizeBars */ 37),
	    __webpack_require__(/*! tinymce/util/Tools */ 8),
	    __webpack_require__(/*! tinymce/dom/TreeWalker */ 16),
	    __webpack_require__(/*! tinymce/Env */ 9),
	    __webpack_require__(/*! tinymce/PluginManager */ 38)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(TableGrid, Quirks, CellSelection, Dialogs, ResizeBars, Tools, TreeWalker, Env, PluginManager) {
	    var each = Tools.each;

	    function Plugin(editor) {
	        var clipboardRows, self = this, dialogs = new Dialogs(editor), resizeBars;

	        if (editor.settings.object_resizing && editor.settings.table_resize_bars !== false &&
	            (editor.settings.object_resizing === true || editor.settings.object_resizing === 'table')) {
	            resizeBars = ResizeBars(editor);
	        }

	        function cmd(command) {
	            return function() {
	                editor.execCommand(command);
	            };
	        }

	        function insertTable(cols, rows) {
	            var y, x, html, tableElm;

	            html = '<table id="__mce"><tbody>';

	            for (y = 0; y < rows; y++) {
	                html += '<tr>';

	                for (x = 0; x < cols; x++) {
	                    html += '<td>' + (Env.ie && Env.ie < 10 ? '&nbsp;' : '<br>') + '</td>';
	                }

	                html += '</tr>';
	            }

	            html += '</tbody></table>';

	            editor.undoManager.transact(function() {
	                editor.insertContent(html);

	                tableElm = editor.dom.get('__mce');
	                editor.dom.setAttrib(tableElm, 'id', null);

	                editor.$('tr', tableElm).each(function(index, row) {
	                    editor.fire('newrow', {
	                        node: row
	                    });

	                    editor.$('th,td', row).each(function(index, cell) {
	                        editor.fire('newcell', {
	                            node: cell
	                        });
	                    });
	                });

	                editor.dom.setAttribs(tableElm, editor.settings.table_default_attributes || {});
	                editor.dom.setStyles(tableElm, editor.settings.table_default_styles || {});
	            });

	            return tableElm;
	        }

	        function handleDisabledState(ctrl, selector, sameParts) {
	            function bindStateListener() {
	                var selectedElm, selectedCells, parts = {}, sum = 0, state;

	                selectedCells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]');
	                selectedElm = selectedCells[0];
	                if (!selectedElm) {
	                    selectedElm = editor.selection.getStart();
	                }

	                // Make sure that we don't have a selection inside thead and tbody at the same time
	                if (sameParts && selectedCells.length > 0) {
	                    each(selectedCells, function(cell) {
	                        return parts[cell.parentNode.parentNode.nodeName] = 1;
	                    });

	                    each(parts, function(value) {
	                        sum += value;
	                    });

	                    state = sum !== 1;
	                } else {
	                    state = !editor.dom.getParent(selectedElm, selector);
	                }

	                ctrl.disabled(state);

	                editor.selection.selectorChanged(selector, function(state) {
	                    ctrl.disabled(!state);
	                });
	            }

	            if (editor.initialized) {
	                bindStateListener();
	            } else {
	                editor.on('init', bindStateListener);
	            }
	        }

	        function postRender() {
	            /*jshint validthis:true*/
	            handleDisabledState(this, 'table');
	        }

	        function postRenderCell() {
	            /*jshint validthis:true*/
	            handleDisabledState(this, 'td,th');
	        }

	        function postRenderMergeCell() {
	            /*jshint validthis:true*/
	            handleDisabledState(this, 'td,th', true);
	        }

	        function generateTableGrid() {
	            var html = '';

	            html = '<table role="grid" class="mce-grid mce-grid-border" aria-readonly="true">';

	            for (var y = 0; y < 10; y++) {
	                html += '<tr>';

	                for (var x = 0; x < 10; x++) {
	                    html += '<td role="gridcell" tabindex="-1"><a id="mcegrid' + (y * 10 + x) + '" href="#" ' +
	                        'data-mce-x="' + x + '" data-mce-y="' + y + '"></a></td>';
	                }

	                html += '</tr>';
	            }

	            html += '</table>';

	            html += '<div class="mce-text-center" role="presentation">1 x 1</div>';

	            return html;
	        }

	        function selectGrid(tx, ty, control) {
	            var table = control.getEl().getElementsByTagName('table')[0];
	            var x, y, focusCell, cell, active;
	            var rtl = control.isRtl() || control.parent().rel == 'tl-tr';

	            table.nextSibling.innerHTML = (tx + 1) + ' x ' + (ty + 1);

	            if (rtl) {
	                tx = 9 - tx;
	            }

	            for (y = 0; y < 10; y++) {
	                for (x = 0; x < 10; x++) {
	                    cell = table.rows[y].childNodes[x].firstChild;
	                    active = (rtl ? x >= tx : x <= tx) && y <= ty;

	                    editor.dom.toggleClass(cell, 'mce-active', active);

	                    if (active) {
	                        focusCell = cell;
	                    }
	                }
	            }

	            return focusCell.parentNode;
	        }

	        if (editor.settings.table_grid === false) {
	            editor.addMenuItem('inserttable', {
	                text: 'Insert table',
	                icon: 'table',
	                context: 'table',
	                onclick: dialogs.table
	            });
	        } else {
	            editor.addMenuItem('inserttable', {
	                text: 'Insert table',
	                icon: 'table',
	                context: 'table',
	                ariaHideMenu: true,
	                onclick: function(e) {
	                    if (e.aria) {
	                        this.parent().hideAll();
	                        e.stopImmediatePropagation();
	                        dialogs.table();
	                    }
	                },
	                onshow: function() {
	                    selectGrid(0, 0, this.menu.items()[0]);
	                },
	                onhide: function() {
	                    var elements = this.menu.items()[0].getEl().getElementsByTagName('a');
	                    editor.dom.removeClass(elements, 'mce-active');
	                    editor.dom.addClass(elements[0], 'mce-active');
	                },
	                menu: [
	                    {
	                        type: 'container',
	                        html: generateTableGrid(),

	                        onPostRender: function() {
	                            this.lastX = this.lastY = 0;
	                        },

	                        onmousemove: function(e) {
	                            var target = e.target, x, y;

	                            if (target.tagName.toUpperCase() == 'A') {
	                                x = parseInt(target.getAttribute('data-mce-x'), 10);
	                                y = parseInt(target.getAttribute('data-mce-y'), 10);

	                                if (this.isRtl() || this.parent().rel == 'tl-tr') {
	                                    x = 9 - x;
	                                }

	                                if (x !== this.lastX || y !== this.lastY) {
	                                    selectGrid(x, y, e.control);

	                                    this.lastX = x;
	                                    this.lastY = y;
	                                }
	                            }
	                        },

	                        onclick: function(e) {
	                            var self = this;

	                            if (e.target.tagName.toUpperCase() == 'A') {
	                                e.preventDefault();
	                                e.stopPropagation();
	                                self.parent().cancel();

	                                editor.undoManager.transact(function() {
	                                    insertTable(self.lastX + 1, self.lastY + 1);
	                                });

	                                editor.addVisual();
	                            }
	                        }
	                    }
	                ]
	            });
	        }

	        editor.addMenuItem('tableprops', {
	            text: 'Table properties',
	            context: 'table',
	            onPostRender: postRender,
	            onclick: dialogs.tableProps
	        });

	        editor.addMenuItem('deletetable', {
	            text: 'Delete table',
	            context: 'table',
	            onPostRender: postRender,
	            cmd: 'mceTableDelete'
	        });

	        editor.addMenuItem('cell', {
	            separator: 'before',
	            text: 'Cell',
	            context: 'table',
	            menu: [
	                {text: 'Cell properties', onclick: cmd('mceTableCellProps'), onPostRender: postRenderCell},
	                {text: 'Merge cells', onclick: cmd('mceTableMergeCells'), onPostRender: postRenderMergeCell},
	                {text: 'Split cell', onclick: cmd('mceTableSplitCells'), onPostRender: postRenderCell}
	            ]
	        });

	        editor.addMenuItem('row', {
	            text: 'Row',
	            context: 'table',
	            menu: [
	                {text: 'Insert row before', onclick: cmd('mceTableInsertRowBefore'), onPostRender: postRenderCell},
	                {text: 'Insert row after', onclick: cmd('mceTableInsertRowAfter'), onPostRender: postRenderCell},
	                {text: 'Delete row', onclick: cmd('mceTableDeleteRow'), onPostRender: postRenderCell},
	                {text: 'Row properties', onclick: cmd('mceTableRowProps'), onPostRender: postRenderCell},
	                {text: '-'},
	                {text: 'Cut row', onclick: cmd('mceTableCutRow'), onPostRender: postRenderCell},
	                {text: 'Copy row', onclick: cmd('mceTableCopyRow'), onPostRender: postRenderCell},
	                {text: 'Paste row before', onclick: cmd('mceTablePasteRowBefore'), onPostRender: postRenderCell},
	                {text: 'Paste row after', onclick: cmd('mceTablePasteRowAfter'), onPostRender: postRenderCell}
	            ]
	        });

	        editor.addMenuItem('column', {
	            text: 'Column',
	            context: 'table',
	            menu: [
	                {text: 'Insert column before', onclick: cmd('mceTableInsertColBefore'), onPostRender: postRenderCell},
	                {text: 'Insert column after', onclick: cmd('mceTableInsertColAfter'), onPostRender: postRenderCell},
	                {text: 'Delete column', onclick: cmd('mceTableDeleteCol'), onPostRender: postRenderCell}
	            ]
	        });

	        var menuItems = [];
	        each("inserttable tableprops deletetable | cell row column".split(' '), function(name) {
	            if (name == '|') {
	                menuItems.push({text: '-'});
	            } else {
	                menuItems.push(editor.menuItems[name]);
	            }
	        });

	        editor.addButton("table", {
	            type: "menubutton",
	            title: "Table",
	            menu: menuItems
	        });

	        // Select whole table is a table border is clicked
	        if (!Env.isIE) {
	            editor.on('click', function(e) {
	                e = e.target;

	                if (e.nodeName === 'TABLE') {
	                    editor.selection.select(e);
	                    editor.nodeChanged();
	                }
	            });
	        }

	        self.quirks = new Quirks(editor);

	        editor.on('Init', function() {
	            self.cellSelection = new CellSelection(editor, function (selecting) {
	                if (selecting) {
	                    resizeBars.clearBars();
	                }
	            });
	            self.resizeBars = resizeBars;
	        });

	        editor.on('PreInit', function() {
	            // Remove internal data attributes
	            editor.serializer.addAttributeFilter(
	                'data-mce-cell-padding,data-mce-border,data-mce-border-color',
	                function(nodes, name) {

	                    var i = nodes.length;

	                    while (i--) {
	                        nodes[i].attr(name, null);
	                    }
	                });
	        });

	        // Register action commands
	        each({
	            mceTableSplitCells: function(grid) {
	                grid.split();
	            },

	            mceTableMergeCells: function(grid) {
	                var cell;

	                cell = editor.dom.getParent(editor.selection.getStart(), 'th,td');

	                if (!editor.dom.select('td[data-mce-selected],th[data-mce-selected]').length) {
	                    dialogs.merge(grid, cell);
	                } else {
	                    grid.merge();
	                }
	            },

	            mceTableInsertRowBefore: function(grid) {
	                grid.insertRow(true);
	            },

	            mceTableInsertRowAfter: function(grid) {
	                grid.insertRow();
	            },

	            mceTableInsertColBefore: function(grid) {
	                grid.insertCol(true);
	            },

	            mceTableInsertColAfter: function(grid) {
	                grid.insertCol();
	            },

	            mceTableDeleteCol: function(grid) {
	                grid.deleteCols();
	            },

	            mceTableDeleteRow: function(grid) {
	                grid.deleteRows();
	            },

	            mceTableCutRow: function(grid) {
	                clipboardRows = grid.cutRows();
	            },

	            mceTableCopyRow: function(grid) {
	                clipboardRows = grid.copyRows();
	            },

	            mceTablePasteRowBefore: function(grid) {
	                grid.pasteRows(clipboardRows, true);
	            },

	            mceTablePasteRowAfter: function(grid) {
	                grid.pasteRows(clipboardRows);
	            },

	            mceSplitColsBefore: function(grid) {
	                grid.splitCols(true);
	            },

	            mceSplitColsAfter: function(grid) {
	                grid.splitCols(false);
	            },

	            mceTableDelete: function(grid) {
	                if (resizeBars) {
	                    resizeBars.clearBars();
	                }
	                grid.deleteTable();
	            }
	        }, function(func, name) {
	            editor.addCommand(name, function() {
	                var grid = new TableGrid(editor);

	                if (grid) {
	                    func(grid);
	                    editor.execCommand('mceRepaint');
	                    self.cellSelection.clear();
	                }
	            });
	        });

	        // Register dialog commands
	        each({
	            mceInsertTable: dialogs.table,
	            mceTableProps: function() {
	                dialogs.table(true);
	            },
	            mceTableRowProps: dialogs.row,
	            mceTableCellProps: dialogs.cell
	        }, function(func, name) {
	            editor.addCommand(name, function(ui, val) {
	                func(val);
	            });
	        });

	        function addButtons() {
	            editor.addButton('tableprops', {
	                title: 'Table properties',
	                onclick: dialogs.tableProps,
	                icon: 'table'
	            });

	            editor.addButton('tabledelete', {
	                title: 'Delete table',
	                onclick: cmd('mceTableDelete')
	            });

	            editor.addButton('tablecellprops', {
	                title: 'Cell properties',
	                onclick: cmd('mceTableCellProps')
	            });

	            editor.addButton('tablemergecells', {
	                title: 'Merge cells',
	                onclick: cmd('mceTableMergeCells')
	            });

	            editor.addButton('tablesplitcells', {
	                title: 'Split cell',
	                onclick: cmd('mceTableSplitCells')
	            });

	            editor.addButton('tableinsertrowbefore', {
	                title: 'Insert row before',
	                onclick: cmd('mceTableInsertRowBefore')
	            });

	            editor.addButton('tableinsertrowafter', {
	                title: 'Insert row after',
	                onclick: cmd('mceTableInsertRowAfter')
	            });

	            editor.addButton('tabledeleterow', {
	                title: 'Delete row',
	                onclick: cmd('mceTableDeleteRow')
	            });

	            editor.addButton('tablerowprops', {
	                title: 'Row properties',
	                onclick: cmd('mceTableRowProps')
	            });

	            editor.addButton('tablecutrow', {
	                title: 'Cut row',
	                onclick: cmd('mceTableCutRow')
	            });

	            editor.addButton('tablecopyrow', {
	                title: 'Copy row',
	                onclick: cmd('mceTableCopyRow')
	            });

	            editor.addButton('tablepasterowbefore', {
	                title: 'Paste row before',
	                onclick: cmd('mceTablePasteRowBefore')
	            });

	            editor.addButton('tablepasterowafter', {
	                title: 'Paste row after',
	                onclick: cmd('mceTablePasteRowAfter')
	            });

	            editor.addButton('tableinsertcolbefore', {
	                title: 'Insert column before',
	                onclick: cmd('mceTableInsertColBefore')
	            });

	            editor.addButton('tableinsertcolafter', {
	                title: 'Insert column after',
	                onclick: cmd('mceTableInsertColAfter')
	            });

	            editor.addButton('tabledeletecol', {
	                title: 'Delete column',
	                onclick: cmd('mceTableDeleteCol')
	            });

	        }

	        function isTable(table) {

	            var selectorMatched = editor.dom.is(table, 'table') && editor.getBody().contains(table);

	            return selectorMatched;
	        }

	        function addToolbars() {
	            var toolbarItems = editor.settings.table_toolbar;

	            if (toolbarItems === '' || toolbarItems === false) {
	                return;
	            }

	            if (!toolbarItems) {
	                toolbarItems = 'tableprops tabledelete | ' +
	                    'tableinsertrowbefore tableinsertrowafter tabledeleterow | ' +
	                    'tableinsertcolbefore tableinsertcolafter tabledeletecol';
	            }

	            editor.addContextToolbar(
	                isTable,
	                toolbarItems
	            );
	        }

	        function getClipboardRows() {
	            return clipboardRows;
	        }

	        function setClipboardRows(rows) {
	            clipboardRows = rows;
	        }

	        addButtons();
	        addToolbars();

	        // Enable tab key cell navigation
	        if (editor.settings.table_tab_navigation !== false) {
	            editor.on('keydown', function(e) {
	                var cellElm, grid, delta;

	                if (e.keyCode == 9) {
	                    cellElm = editor.dom.getParent(editor.selection.getStart(), 'th,td');

	                    if (cellElm) {
	                        e.preventDefault();

	                        grid = new TableGrid(editor);
	                        delta = e.shiftKey ? -1 : 1;

	                        editor.undoManager.transact(function() {
	                            if (!grid.moveRelIdx(cellElm, delta) && delta > 0) {
	                                grid.insertRow();
	                                grid.refresh();
	                                grid.moveRelIdx(cellElm, delta);
	                            }
	                        });
	                    }
	                }
	            });
	        }

	        self.insertTable = insertTable;
	        self.setClipboardRows = setClipboardRows;
	        self.getClipboardRows = getClipboardRows;
	    }

	    PluginManager.add('insales_table', Plugin);
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/*!***********************************************!*\
  !*** ./src/plugins/table_plugin/TableGrid.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * TableGrid.js
	 *
	 * Released under LGPL License.
	 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/**
	 * This class creates a grid out of a table element. This
	 * makes it a whole lot easier to handle complex tables with
	 * col/row spans.
	 *
	 * @class tinymce.tableplugin.TableGrid
	 * @private
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(/*! tinymce/util/Tools */ 8),
		__webpack_require__(/*! tinymce/Env */ 9),
		__webpack_require__(/*! tinymce/tableplugin/Utils */ 10),
		__webpack_require__(/*! tinymce/tableplugin/SplitCols */ 11)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tools, Env, Utils, SplitCols) {
		var each = Tools.each, getSpanVal = Utils.getSpanVal, setSpanVal = Utils.setSpanVal;

		return function(editor, table, selectedCell) {
			var grid, gridWidth, startPos, endPos, selection = editor.selection, dom = selection.dom;

			function removeCellSelection() {
				editor.$('td[data-mce-selected],th[data-mce-selected]').removeAttr('data-mce-selected');
			}

			function isEditorBody(node) {
				return node === editor.getBody();
			}

			function getChildrenByName(node, names) {
				if (!node) {
					return [];
				}

				names = Tools.map(names.split(','), function(name) {
					return name.toLowerCase();
				});

				return Tools.grep(node.childNodes, function(node) {
					return Tools.inArray(names, node.nodeName.toLowerCase()) !== -1;
				});
			}

			function buildGrid() {
				var startY = 0;

				grid = [];
				gridWidth = 0;

				each(['thead', 'tbody', 'tfoot'], function(part) {
					var partElm = getChildrenByName(table, part)[0];
					var rows = getChildrenByName(partElm, 'tr');

					each(rows, function(tr, y) {
						y += startY;

						each(getChildrenByName(tr, 'td,th'), function(td, x) {
							var x2, y2, rowspan, colspan;

							// Skip over existing cells produced by rowspan
							if (grid[y]) {
								while (grid[y][x]) {
									x++;
								}
							}

							// Get col/rowspan from cell
							rowspan = getSpanVal(td, 'rowspan');
							colspan = getSpanVal(td, 'colspan');

							// Fill out rowspan/colspan right and down
							for (y2 = y; y2 < y + rowspan; y2++) {
								if (!grid[y2]) {
									grid[y2] = [];
								}

								for (x2 = x; x2 < x + colspan; x2++) {
									grid[y2][x2] = {
										part: part,
										real: y2 == y && x2 == x,
										elm: td,
										rowspan: rowspan,
										colspan: colspan
									};
								}
							}

							gridWidth = Math.max(gridWidth, x + 1);
						});
					});

					startY += rows.length;
				});
			}

			function fireNewRow(node) {
				editor.fire('newrow', {
					node: node
				});

				return node;
			}

			function fireNewCell(node) {
				editor.fire('newcell', {
					node: node
				});

				return node;
			}

			function cloneNode(node, children) {
				node = node.cloneNode(children);
				node.removeAttribute('id');

				return node;
			}

			function getCell(x, y) {
				var row;

				row = grid[y];
				if (row) {
					return row[x];
				}
			}

			function getRow(grid, y) {
				return grid[y] ? grid[y] : null;
			}

			function getColumn(grid, x) {
				var out = [];

				for (var y = 0; y < grid.length; y++) {
					out.push(getCell(x, y));
				}

				return out;
			}

			function isCellSelected(cell) {
				return cell && (!!dom.getAttrib(cell.elm, 'data-mce-selected') || cell == selectedCell);
			}

			function getSelectedRows() {
				var rows = [];

				each(table.rows, function(row) {
					each(row.cells, function(cell) {
						if (dom.getAttrib(cell, 'data-mce-selected') || (selectedCell && cell == selectedCell.elm)) {
							rows.push(row);
							return false;
						}
					});
				});

				return rows;
			}

			function deleteTable() {
				var rng = dom.createRng();

				if (isEditorBody(table)) {
					return;
				}

				rng.setStartAfter(table);
				rng.setEndAfter(table);

				selection.setRng(rng);

				dom.remove(table);
			}

			function cloneCell(cell) {
				var formatNode, cloneFormats = {};

				if (editor.settings.table_clone_elements !== false) {
					cloneFormats = Tools.makeMap(
						(editor.settings.table_clone_elements || 'strong em b i span font h1 h2 h3 h4 h5 h6 p div').toUpperCase(),
						/[ ,]/
					);
				}

				// Clone formats
				Tools.walk(cell, function(node) {
					var curNode;

					if (node.nodeType == 3) {
						each(dom.getParents(node.parentNode, null, cell).reverse(), function(node) {
							if (!cloneFormats[node.nodeName]) {
								return;
							}

							node = cloneNode(node, false);

							if (!formatNode) {
								formatNode = curNode = node;
							} else if (curNode) {
								curNode.appendChild(node);
							}

							curNode = node;
						});

						// Add something to the inner node
						if (curNode) {
							curNode.innerHTML = Env.ie && Env.ie < 10 ? '&nbsp;' : '<br data-mce-bogus="1" />';
						}

						return false;
					}
				}, 'childNodes');

				cell = cloneNode(cell, false);
				fireNewCell(cell);

				setSpanVal(cell, 'rowSpan', 1);
				setSpanVal(cell, 'colSpan', 1);

				if (formatNode) {
					cell.appendChild(formatNode);
				} else {
					Utils.paddCell(cell);
				}

				return cell;
			}

			function cleanup() {
				var rng = dom.createRng(), row;

				// Empty rows
				each(dom.select('tr', table), function(tr) {
					if (tr.cells.length === 0) {
						dom.remove(tr);
					}
				});

				// Empty table
				if (dom.select('tr', table).length === 0) {
					rng.setStartBefore(table);
					rng.setEndBefore(table);
					selection.setRng(rng);
					dom.remove(table);
					return;
				}

				// Empty header/body/footer
				each(dom.select('thead,tbody,tfoot', table), function(part) {
					if (part.rows.length === 0) {
						dom.remove(part);
					}
				});

				// Restore selection to start position if it still exists
				buildGrid();

				// If we have a valid startPos object
				if (startPos) {
					// Restore the selection to the closest table position
					row = grid[Math.min(grid.length - 1, startPos.y)];
					if (row) {
						selection.select(row[Math.min(row.length - 1, startPos.x)].elm, true);
						selection.collapse(true);
					}
				}
			}

			function fillLeftDown(x, y, rows, cols) {
				var tr, x2, r, c, cell;

				tr = grid[y][x].elm.parentNode;
				for (r = 1; r <= rows; r++) {
					tr = dom.getNext(tr, 'tr');

					if (tr) {
						// Loop left to find real cell
						for (x2 = x; x2 >= 0; x2--) {
							cell = grid[y + r][x2].elm;

							if (cell.parentNode == tr) {
								// Append clones after
								for (c = 1; c <= cols; c++) {
									dom.insertAfter(cloneCell(cell), cell);
								}

								break;
							}
						}

						if (x2 == -1) {
							// Insert nodes before first cell
							for (c = 1; c <= cols; c++) {
								tr.insertBefore(cloneCell(tr.cells[0]), tr.cells[0]);
							}
						}
					}
				}
			}

			function split() {
				each(grid, function(row, y) {
					each(row, function(cell, x) {
						var colSpan, rowSpan, i;

						if (isCellSelected(cell)) {
							cell = cell.elm;
							colSpan = getSpanVal(cell, 'colspan');
							rowSpan = getSpanVal(cell, 'rowspan');

							if (colSpan > 1 || rowSpan > 1) {
								setSpanVal(cell, 'rowSpan', 1);
								setSpanVal(cell, 'colSpan', 1);

								// Insert cells right
								for (i = 0; i < colSpan - 1; i++) {
									dom.insertAfter(cloneCell(cell), cell);
								}

								fillLeftDown(x, y, rowSpan - 1, colSpan);
							}
						}
					});
				});
			}

			function findItemsOutsideOfRange(items, start, end) {
				var out = [];

				for (var i = 0; i < items.length; i++) {
					if (i < start || i > end) {
						out.push(items[i]);
					}
				}

				return out;
			}

			function getFakeCells(cells) {
				return Tools.grep(cells, function (cell) {
					return cell.real === false;
				});
			}

			function getUniqueElms(cells) {
				var elms = [];

				for (var i = 0; i < cells.length; i++) {
					var elm = cells[i].elm;
					if (elms[elms.length - 1] !== elm) {
						elms.push(elm);
					}
				}

				return elms;
			}

			function reduceRowSpans(grid, startX, startY, endX, endY) {
				var count = 0;

				for (var y = startY; y <= endY; y++) {
					var allCells = findItemsOutsideOfRange(getRow(grid, y), startX, endX);
					var fakeCells = getFakeCells(allCells);

					if (allCells.length === fakeCells.length) {
						Tools.each(getUniqueElms(fakeCells), function (elm) {
							Utils.setRowSpan(elm, Utils.getRowSpan(elm) - 1);
						});

						count++;
					}
				}

				return count;
			}

			function reduceColSpans(grid, startX, startY, endX, endY) {
				var count = 0;

				for (var x = startX; x <= endX; x++) {
					var allCells = findItemsOutsideOfRange(getColumn(grid, x), startY, endY);
					var fakeCells = getFakeCells(allCells);

					if (allCells.length === fakeCells.length) {
						Tools.each(getUniqueElms(fakeCells), function (elm) {
							Utils.setColSpan(elm, Utils.getColSpan(elm) - 1);
						});

						count++;
					}
				}

				return count;
			}

			function merge(cell, cols, rows) {
				var pos, startX, startY, endX, endY, x, y, startCell, endCell, children, count, reducedRows, reducedCols;

				// Use specified cell and cols/rows
				if (cell) {
					pos = getPos(cell);
					startX = pos.x;
					startY = pos.y;
					endX = startX + (cols - 1);
					endY = startY + (rows - 1);
				} else {
					startPos = endPos = null;

					// Calculate start/end pos by checking for selected cells in grid works better with context menu
					each(grid, function(row, y) {
						each(row, function(cell, x) {
							if (isCellSelected(cell)) {
								if (!startPos) {
									startPos = {x: x, y: y};
								}

								endPos = {x: x, y: y};
							}
						});
					});

					// Use selection, but make sure startPos is valid before accessing
					if (startPos) {
						startX = startPos.x;
						startY = startPos.y;
						endX = endPos.x;
						endY = endPos.y;
					}
				}

				// Find start/end cells
				startCell = getCell(startX, startY);
				endCell = getCell(endX, endY);

				// Check if the cells exists and if they are of the same part for example tbody = tbody
				if (startCell && endCell && startCell.part == endCell.part) {
					// Split and rebuild grid
					split();
					buildGrid();

					reducedRows = reduceRowSpans(grid, startX, startY, endX, endY);
					reducedCols = reduceColSpans(grid, startX, startY, endX, endY);

					// Set row/col span to start cell
					startCell = getCell(startX, startY).elm;
					var colSpan = (endX - startX - reducedCols) + 1;
					var rowSpan = (endY - startY - reducedRows) + 1;

					// All cells in table selected then just make it a table with one cell
					if (colSpan === gridWidth && rowSpan === grid.length) {
						colSpan = 1;
						rowSpan = 1;
					}

					// Multiple whole rows selected then just make it one rowSpan
					if (colSpan === gridWidth && rowSpan > 1) {
						rowSpan = 1;
					}

					setSpanVal(startCell, 'colSpan', colSpan);
					setSpanVal(startCell, 'rowSpan', rowSpan);

					// Remove other cells and add it's contents to the start cell
					for (y = startY; y <= endY; y++) {
						for (x = startX; x <= endX; x++) {
							if (!grid[y] || !grid[y][x]) {
								continue;
							}

							cell = grid[y][x].elm;

							/*jshint loopfunc:true */
							/*eslint no-loop-func:0 */
							if (cell != startCell) {
								// Move children to startCell
								children = Tools.grep(cell.childNodes);
								each(children, function(node) {
									startCell.appendChild(node);
								});

								// Remove bogus nodes if there is children in the target cell
								if (children.length) {
									children = Tools.grep(startCell.childNodes);
									count = 0;
									each(children, function(node) {
										if (node.nodeName == 'BR' && count++ < children.length - 1) {
											startCell.removeChild(node);
										}
									});
								}

								dom.remove(cell);
							}
						}
					}

					// Remove empty rows etc and restore caret location
					cleanup();
				}
			}

			function insertRow(before) {
				var posY, cell, lastCell, x, rowElm, newRow, newCell, otherCell, rowSpan, spanValue;

				// Find first/last row
				each(grid, function(row, y) {
					each(row, function(cell) {
						if (isCellSelected(cell)) {
							cell = cell.elm;
							rowElm = cell.parentNode;
							newRow = fireNewRow(cloneNode(rowElm, false));
							posY = y;

							if (before) {
								return false;
							}
						}
					});

					if (before) {
						return !posY;
					}
				});

				// If posY is undefined there is nothing for us to do here...just return to avoid crashing below
				if (posY === undefined) {
					return;
				}

				for (x = 0, spanValue = 0; x < grid[0].length; x += spanValue) {
					// Cell not found could be because of an invalid table structure
					if (!grid[posY][x]) {
						continue;
					}

					cell = grid[posY][x].elm;
					spanValue = getSpanVal(cell, 'colspan');

					if (cell != lastCell) {
						if (!before) {
							rowSpan = getSpanVal(cell, 'rowspan');
							if (rowSpan > 1) {
								setSpanVal(cell, 'rowSpan', rowSpan + 1);
								continue;
							}
						} else {
							// Check if cell above can be expanded
							if (posY > 0 && grid[posY - 1][x]) {
								otherCell = grid[posY - 1][x].elm;
								rowSpan = getSpanVal(otherCell, 'rowSpan');
								if (rowSpan > 1) {
									setSpanVal(otherCell, 'rowSpan', rowSpan + 1);
									continue;
								}
							}
						}

						// Insert new cell into new row
						newCell = cloneCell(cell);
						setSpanVal(newCell, 'colSpan', cell.colSpan);

						newRow.appendChild(newCell);

						lastCell = cell;
					}
				}

				if (newRow.hasChildNodes()) {
					if (!before) {
						dom.insertAfter(newRow, rowElm);
					} else {
						rowElm.parentNode.insertBefore(newRow, rowElm);
					}
				}
			}

			function insertCol(before) {
				var posX, lastCell;

				// Find first/last column
				each(grid, function(row) {
					each(row, function(cell, x) {
						if (isCellSelected(cell)) {
							posX = x;

							if (before) {
								return false;
							}
						}
					});

					if (before) {
						return !posX;
					}
				});

				each(grid, function(row, y) {
					var cell, rowSpan, colSpan;

					if (!row[posX]) {
						return;
					}

					cell = row[posX].elm;
					if (cell != lastCell) {
						colSpan = getSpanVal(cell, 'colspan');
						rowSpan = getSpanVal(cell, 'rowspan');

						if (colSpan == 1) {
							if (!before) {
								dom.insertAfter(cloneCell(cell), cell);
								fillLeftDown(posX, y, rowSpan - 1, colSpan);
							} else {
								cell.parentNode.insertBefore(cloneCell(cell), cell);
								fillLeftDown(posX, y, rowSpan - 1, colSpan);
							}
						} else {
							setSpanVal(cell, 'colSpan', cell.colSpan + 1);
						}

						lastCell = cell;
					}
				});
			}

			function getSelectedCells(grid) {
				return Tools.grep(getAllCells(grid), isCellSelected);
			}

			function getAllCells(grid) {
				var cells = [];

				each(grid, function(row) {
					each(row, function(cell) {
						cells.push(cell);
					});
				});

				return cells;
			}

			function deleteCols() {
				var cols = [];

				if (isEditorBody(table)) {
					if (grid[0].length == 1) {
						return;
					}

					if (getSelectedCells(grid).length == getAllCells(grid).length) {
						return;
					}
				}

				// Get selected column indexes
				each(grid, function(row) {
					each(row, function(cell, x) {
						if (isCellSelected(cell) && Tools.inArray(cols, x) === -1) {
							each(grid, function(row) {
								var cell = row[x].elm, colSpan;

								colSpan = getSpanVal(cell, 'colSpan');

								if (colSpan > 1) {
									setSpanVal(cell, 'colSpan', colSpan - 1);
								} else {
									dom.remove(cell);
								}
							});

							cols.push(x);
						}
					});
				});

				cleanup();
			}

			function deleteRows() {
				var rows;

				function deleteRow(tr) {
					var pos, lastCell;

					// Move down row spanned cells
					each(tr.cells, function(cell) {
						var rowSpan = getSpanVal(cell, 'rowSpan');

						if (rowSpan > 1) {
							setSpanVal(cell, 'rowSpan', rowSpan - 1);
							pos = getPos(cell);
							fillLeftDown(pos.x, pos.y, 1, 1);
						}
					});

					// Delete cells
					pos = getPos(tr.cells[0]);
					each(grid[pos.y], function(cell) {
						var rowSpan;

						cell = cell.elm;

						if (cell != lastCell) {
							rowSpan = getSpanVal(cell, 'rowSpan');

							if (rowSpan <= 1) {
								dom.remove(cell);
							} else {
								setSpanVal(cell, 'rowSpan', rowSpan - 1);
							}

							lastCell = cell;
						}
					});
				}

				// Get selected rows and move selection out of scope
				rows = getSelectedRows();

				if (isEditorBody(table) && rows.length == table.rows.length) {
					return;
				}

				// Delete all selected rows
				each(rows.reverse(), function(tr) {
					deleteRow(tr);
				});

				cleanup();
			}

			function cutRows() {
				var rows = getSelectedRows();

				if (isEditorBody(table) && rows.length == table.rows.length) {
					return;
				}

				dom.remove(rows);
				cleanup();

				return rows;
			}

			function copyRows() {
				var rows = getSelectedRows();

				each(rows, function(row, i) {
					rows[i] = cloneNode(row, true);
				});

				return rows;
			}

			function pasteRows(rows, before) {
				var splitResult, targetRow, newRows;

				// Nothing to paste
				if (!rows) {
					return;
				}

				splitResult = SplitCols.splitAt(grid, startPos.x, startPos.y, before);
				targetRow = splitResult.row;
				Tools.each(splitResult.cells, fireNewCell);

				newRows = Tools.map(rows, function (row) {
					return row.cloneNode(true);
				});

				if (!before) {
					newRows.reverse();
				}

				each(newRows, function(row) {
					var i, cellCount = row.cells.length, cell;

					fireNewRow(row);

					// Remove col/rowspans
					for (i = 0; i < cellCount; i++) {
						cell = row.cells[i];

						fireNewCell(cell);
						setSpanVal(cell, 'colSpan', 1);
						setSpanVal(cell, 'rowSpan', 1);
					}

					// Needs more cells
					for (i = cellCount; i < gridWidth; i++) {
						row.appendChild(fireNewCell(cloneCell(row.cells[cellCount - 1])));
					}

					// Needs less cells
					for (i = gridWidth; i < cellCount; i++) {
						dom.remove(row.cells[i]);
					}

					// Add before/after
					if (before) {
						targetRow.parentNode.insertBefore(row, targetRow);
					} else {
						dom.insertAfter(row, targetRow);
					}
				});

				removeCellSelection();
			}

			function getPos(target) {
				var pos;

				each(grid, function(row, y) {
					each(row, function(cell, x) {
						if (cell.elm == target) {
							pos = {x: x, y: y};
							return false;
						}
					});

					return !pos;
				});

				return pos;
			}

			function setStartCell(cell) {
				startPos = getPos(cell);
			}

			function findEndPos() {
				var maxX, maxY;

				maxX = maxY = 0;

				each(grid, function(row, y) {
					each(row, function(cell, x) {
						var colSpan, rowSpan;

						if (isCellSelected(cell)) {
							cell = grid[y][x];

							if (x > maxX) {
								maxX = x;
							}

							if (y > maxY) {
								maxY = y;
							}

							if (cell.real) {
								colSpan = cell.colspan - 1;
								rowSpan = cell.rowspan - 1;

								if (colSpan) {
									if (x + colSpan > maxX) {
										maxX = x + colSpan;
									}
								}

								if (rowSpan) {
									if (y + rowSpan > maxY) {
										maxY = y + rowSpan;
									}
								}
							}
						}
					});
				});

				return {x: maxX, y: maxY};
			}

			function setEndCell(cell) {
				var startX, startY, endX, endY, maxX, maxY, colSpan, rowSpan, x, y;

				endPos = getPos(cell);

				if (startPos && endPos) {
					// Get start/end positions
					startX = Math.min(startPos.x, endPos.x);
					startY = Math.min(startPos.y, endPos.y);
					endX = Math.max(startPos.x, endPos.x);
					endY = Math.max(startPos.y, endPos.y);

					// Expand end position to include spans
					maxX = endX;
					maxY = endY;

					// This logic tried to expand the selection to always be a rectangle
					// Expand startX
					/*for (y = startY; y <= maxY; y++) {
						cell = grid[y][startX];

						if (!cell.real) {
							newX = startX - (cell.colspan - 1);
							if (newX < startX && newX >= 0) {
								startX = newX;
							}
						}
					}

					// Expand startY
					for (x = startX; x <= maxX; x++) {
						cell = grid[startY][x];

						if (!cell.real) {
							newY = startY - (cell.rowspan - 1);
							if (newY < startY && newY >= 0) {
								startY = newY;
							}
						}
					}*/

					// Find max X, Y
					for (y = startY; y <= endY; y++) {
						for (x = startX; x <= endX; x++) {
							cell = grid[y][x];

							if (cell.real) {
								colSpan = cell.colspan - 1;
								rowSpan = cell.rowspan - 1;

								if (colSpan) {
									if (x + colSpan > maxX) {
										maxX = x + colSpan;
									}
								}

								if (rowSpan) {
									if (y + rowSpan > maxY) {
										maxY = y + rowSpan;
									}
								}
							}
						}
					}

					removeCellSelection();

					// Add new selection
					for (y = startY; y <= maxY; y++) {
						for (x = startX; x <= maxX; x++) {
							if (grid[y][x]) {
								dom.setAttrib(grid[y][x].elm, 'data-mce-selected', '1');
							}
						}
					}
				}
			}

			function moveRelIdx(cellElm, delta) {
				var pos, index, cell;

				pos = getPos(cellElm);
				index = pos.y * gridWidth + pos.x;

				do {
					index += delta;
					cell = getCell(index % gridWidth, Math.floor(index / gridWidth));

					if (!cell) {
						break;
					}

					if (cell.elm != cellElm) {
						selection.select(cell.elm, true);

						if (dom.isEmpty(cell.elm)) {
							selection.collapse(true);
						}

						return true;
					}
				} while (cell.elm == cellElm);

				return false;
			}

			function splitCols(before) {
				if (startPos) {
					var splitResult = SplitCols.splitAt(grid, startPos.x, startPos.y, before);
					Tools.each(splitResult.cells, fireNewCell);
				}
			}

			table = table || dom.getParent(selection.getStart(true), 'table');

			buildGrid();

			selectedCell = selectedCell || dom.getParent(selection.getStart(true), 'th,td');

			if (selectedCell) {
				startPos = getPos(selectedCell);
				endPos = findEndPos();
				selectedCell = getCell(startPos.x, startPos.y);
			}

			Tools.extend(this, {
				deleteTable: deleteTable,
				split: split,
				merge: merge,
				insertRow: insertRow,
				insertCol: insertCol,
				splitCols: splitCols,
				deleteCols: deleteCols,
				deleteRows: deleteRows,
				cutRows: cutRows,
				copyRows: copyRows,
				pasteRows: pasteRows,
				getPos: getPos,
				setStartCell: setStartCell,
				setEndCell: setEndCell,
				moveRelIdx: moveRelIdx,
				refresh: buildGrid
			});
		};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/*!*************************************!*\
  !*** external "tinymce.util.Tools" ***!
  \*************************************/
/***/ function(module, exports) {

	module.exports = tinymce.util.Tools;

/***/ },
/* 9 */
/*!******************************!*\
  !*** external "tinymce.Env" ***!
  \******************************/
/***/ function(module, exports) {

	module.exports = tinymce.Env;

/***/ },
/* 10 */
/*!*******************************************!*\
  !*** ./src/plugins/table_plugin/Utils.js ***!
  \*******************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Utils.js
	 *
	 * Released under LGPL License.
	 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/**
	 * Various utility functions.
	 *
	 * @class tinymce.tableplugin.Utils
	 * @private
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(/*! tinymce/Env */ 9)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Env) {
		var setSpanVal = function (name) {
			return function (td, val) {
				if (td) {
					val = parseInt(val, 10);

					if (val === 1 || val === 0) {
						td.removeAttribute(name, 1);
					} else {
						td.setAttribute(name, val, 1);
					}
				}
			};
		};

		var getSpanVal = function (name) {
			return function (td) {
				return parseInt(td.getAttribute(name) || 1, 10);
			};
		};

		function paddCell(cell) {
			if (!Env.ie || Env.ie > 9) {
				if (!cell.hasChildNodes()) {
					cell.innerHTML = '<br data-mce-bogus="1" />';
				}
			}
		}

		return {
			setColSpan: setSpanVal('colSpan'),
			setRowSpan: setSpanVal('rowspan'),
			getColSpan: getSpanVal('colSpan'),
			getRowSpan: getSpanVal('rowSpan'),
			setSpanVal: function (td, name, value) {
				setSpanVal(name)(td, value);
			},
			getSpanVal: function (td, name) {
				return getSpanVal(name)(td);
			},
			paddCell: paddCell
		};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/*!***********************************************!*\
  !*** ./src/plugins/table_plugin/SplitCols.js ***!
  \***********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * SplitCols.js
	 *
	 * Released under LGPL License.
	 * Copyright (c) 1999-2016 Ephox Corp. All rights reserved
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/**
	 * Contains logic for handling splitting of merged rows.
	 *
	 * @class tinymce.tableplugin.SplitCols
	 * @private
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(/*! tinymce/util/Tools */ 8),
		__webpack_require__(/*! tinymce/tableplugin/Utils */ 10)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tools, Utils) {
		var getCellAt = function (grid, x, y) {
			return grid[y] ? grid[y][x] : null;
		};

		var getCellElmAt = function (grid, x, y) {
			var cell = getCellAt(grid, x, y);
			return cell ? cell.elm : null;
		};

		var countHoles = function (grid, x, y, delta) {
			var y2, cell, count = 0, elm = getCellElmAt(grid, x, y);

			for (y2 = y; delta > 0 ? y2 < grid.length : y2 >= 0; y2 += delta) {
				cell = getCellAt(grid, x, y2);
				if (elm !== cell.elm) {
					break;
				}

				count++;
			}

			return count;
		};

		var findRealElm = function (grid, x, y) {
			var cell, row = grid[y];

			for (var x2 = x; x2 < row.length; x2++) {
				cell = row[x2];
				if (cell.real) {
					return cell.elm;
				}
			}

			return null;
		};

		var getRowSplitInfo = function (grid, y) {
			var cell, result = [], row = grid[y];

			for (var x = 0; x < row.length; x++) {
				cell = row[x];
				result.push({
					elm: cell.elm,
					above: countHoles(grid, x, y, -1) - 1,
					below: countHoles(grid, x, y, 1) - 1
				});

				x += Utils.getColSpan(cell.elm) - 1;
			}

			return result;
		};

		var createCell = function (info, rowSpan) {
			var doc = info.elm.ownerDocument;
			var newCell = doc.createElement('td');

			Utils.setColSpan(newCell, Utils.getColSpan(info.elm));
			Utils.setRowSpan(newCell, rowSpan);
			Utils.paddCell(newCell);

			return newCell;
		};

		var insertOrAppendCell = function (grid, newCell, x, y) {
			var realCellElm = findRealElm(grid, x + 1, y);

			if (!realCellElm) {
				realCellElm = findRealElm(grid, 0, y);
				realCellElm.parentNode.appendChild(newCell);
			} else {
				realCellElm.parentNode.insertBefore(newCell, realCellElm);
			}
		};

		var splitAbove = function (grid, info, x, y) {
			if (info.above !== 0) {
				Utils.setRowSpan(info.elm, info.above);
				var cell = createCell(info, info.below + 1);
				insertOrAppendCell(grid, cell, x, y);
				return cell;
			}

			return null;
		};

		var splitBelow = function (grid, info, x, y) {
			if (info.below !== 0) {
				Utils.setRowSpan(info.elm, info.above + 1);
				var cell = createCell(info, info.below);
				insertOrAppendCell(grid, cell, x, y + 1);
				return cell;
			}

			return null;
		};

		var splitAt = function (grid, x, y, before) {
			var rowInfos = getRowSplitInfo(grid, y);
			var rowElm = getCellElmAt(grid, x, y).parentNode;
			var cells = [];

			Tools.each(rowInfos, function (info, x) {
				var cell = before ? splitAbove(grid, info, x, y) : splitBelow(grid, info, x, y);
				if (cell !== null) {
					cells.push(cells);
				}
			});

			return {
				cells: cells,
				row: rowElm
			};
		};

		return {
			splitAt: splitAt
		};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/*!********************************************!*\
  !*** ./src/plugins/table_plugin/Quirks.js ***!
  \********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Quirks.js
	 *
	 * Released under LGPL License.
	 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/**
	 * This class includes fixes for various browser quirks.
	 *
	 * @class tinymce.tableplugin.Quirks
	 * @private
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(/*! tinymce/util/VK */ 13),
		__webpack_require__(/*! tinymce/util/Delay */ 14),
		__webpack_require__(/*! tinymce/Env */ 9),
		__webpack_require__(/*! tinymce/util/Tools */ 8),
		__webpack_require__(/*! tinymce/tableplugin/Utils */ 10)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(VK, Delay, Env, Tools, Utils) {
		var each = Tools.each, getSpanVal = Utils.getSpanVal;

		return function(editor) {
			/**
			 * Fixed caret movement around tables on WebKit.
			 */
			function moveWebKitSelection() {
				function eventHandler(e) {
					var key = e.keyCode;

					function handle(upBool, sourceNode) {
						var siblingDirection = upBool ? 'previousSibling' : 'nextSibling';
						var currentRow = editor.dom.getParent(sourceNode, 'tr');
						var siblingRow = currentRow[siblingDirection];

						if (siblingRow) {
							moveCursorToRow(editor, sourceNode, siblingRow, upBool);
							e.preventDefault();
							return true;
						}

						var tableNode = editor.dom.getParent(currentRow, 'table');
						var middleNode = currentRow.parentNode;
						var parentNodeName = middleNode.nodeName.toLowerCase();
						if (parentNodeName === 'tbody' || parentNodeName === (upBool ? 'tfoot' : 'thead')) {
							var targetParent = getTargetParent(upBool, tableNode, middleNode, 'tbody');
							if (targetParent !== null) {
								return moveToRowInTarget(upBool, targetParent, sourceNode);
							}
						}

						return escapeTable(upBool, currentRow, siblingDirection, tableNode);
					}

					function getTargetParent(upBool, topNode, secondNode, nodeName) {
						var tbodies = editor.dom.select('>' + nodeName, topNode);
						var position = tbodies.indexOf(secondNode);
						if (upBool && position === 0 || !upBool && position === tbodies.length - 1) {
							return getFirstHeadOrFoot(upBool, topNode);
						} else if (position === -1) {
							var topOrBottom = secondNode.tagName.toLowerCase() === 'thead' ? 0 : tbodies.length - 1;
							return tbodies[topOrBottom];
						}

						return tbodies[position + (upBool ? -1 : 1)];
					}

					function getFirstHeadOrFoot(upBool, parent) {
						var tagName = upBool ? 'thead' : 'tfoot';
						var headOrFoot = editor.dom.select('>' + tagName, parent);
						return headOrFoot.length !== 0 ? headOrFoot[0] : null;
					}

					function moveToRowInTarget(upBool, targetParent, sourceNode) {
						var targetRow = getChildForDirection(targetParent, upBool);

						if (targetRow) {
							moveCursorToRow(editor, sourceNode, targetRow, upBool);
						}

						e.preventDefault();
						return true;
					}

					function escapeTable(upBool, currentRow, siblingDirection, table) {
						var tableSibling = table[siblingDirection];

						if (tableSibling) {
							moveCursorToStartOfElement(tableSibling);
							return true;
						}

						var parentCell = editor.dom.getParent(table, 'td,th');
						if (parentCell) {
							return handle(upBool, parentCell, e);
						}

						var backUpSibling = getChildForDirection(currentRow, !upBool);
						moveCursorToStartOfElement(backUpSibling);
						e.preventDefault();
						return false;
					}

					function getChildForDirection(parent, up) {
						var child = parent && parent[up ? 'lastChild' : 'firstChild'];
						// BR is not a valid table child to return in this case we return the table cell
						return child && child.nodeName === 'BR' ? editor.dom.getParent(child, 'td,th') : child;
					}

					function moveCursorToStartOfElement(n) {
						editor.selection.setCursorLocation(n, 0);
					}

					function isVerticalMovement() {
						return key == VK.UP || key == VK.DOWN;
					}

					function isInTable(editor) {
						var node = editor.selection.getNode();
						var currentRow = editor.dom.getParent(node, 'tr');
						return currentRow !== null;
					}

					function columnIndex(column) {
						var colIndex = 0;
						var c = column;
						while (c.previousSibling) {
							c = c.previousSibling;
							colIndex = colIndex + getSpanVal(c, "colspan");
						}
						return colIndex;
					}

					function findColumn(rowElement, columnIndex) {
						var c = 0, r = 0;

						each(rowElement.children, function(cell, i) {
							c = c + getSpanVal(cell, "colspan");
							r = i;
							if (c > columnIndex) {
								return false;
							}
						});
						return r;
					}

					function moveCursorToRow(ed, node, row, upBool) {
						var srcColumnIndex = columnIndex(editor.dom.getParent(node, 'td,th'));
						var tgtColumnIndex = findColumn(row, srcColumnIndex);
						var tgtNode = row.childNodes[tgtColumnIndex];
						var rowCellTarget = getChildForDirection(tgtNode, upBool);
						moveCursorToStartOfElement(rowCellTarget || tgtNode);
					}

					function shouldFixCaret(preBrowserNode) {
						var newNode = editor.selection.getNode();
						var newParent = editor.dom.getParent(newNode, 'td,th');
						var oldParent = editor.dom.getParent(preBrowserNode, 'td,th');

						return newParent && newParent !== oldParent && checkSameParentTable(newParent, oldParent);
					}

					function checkSameParentTable(nodeOne, NodeTwo) {
						return editor.dom.getParent(nodeOne, 'TABLE') === editor.dom.getParent(NodeTwo, 'TABLE');
					}

					if (isVerticalMovement() && isInTable(editor)) {
						var preBrowserNode = editor.selection.getNode();
						Delay.setEditorTimeout(editor, function() {
							if (shouldFixCaret(preBrowserNode)) {
								handle(!e.shiftKey && key === VK.UP, preBrowserNode, e);
							}
						}, 0);
					}
				}

				editor.on('KeyDown', function(e) {
					eventHandler(e);
				});
			}

			function fixBeforeTableCaretBug() {
				// Checks if the selection/caret is at the start of the specified block element
				function isAtStart(rng, par) {
					var doc = par.ownerDocument, rng2 = doc.createRange(), elm;

					rng2.setStartBefore(par);
					rng2.setEnd(rng.endContainer, rng.endOffset);

					elm = doc.createElement('body');
					elm.appendChild(rng2.cloneContents());

					// Check for text characters of other elements that should be treated as content
					return elm.innerHTML.replace(/<(br|img|object|embed|input|textarea)[^>]*>/gi, '-').replace(/<[^>]+>/g, '').length === 0;
				}

				// Fixes an bug where it's impossible to place the caret before a table in Gecko
				// this fix solves it by detecting when the caret is at the beginning of such a table
				// and then manually moves the caret infront of the table
				editor.on('KeyDown', function(e) {
					var rng, table, dom = editor.dom;

					// On gecko it's not possible to place the caret before a table
					if (e.keyCode == 37 || e.keyCode == 38) {
						rng = editor.selection.getRng();
						table = dom.getParent(rng.startContainer, 'table');

						if (table && editor.getBody().firstChild == table) {
							if (isAtStart(rng, table)) {
								rng = dom.createRng();

								rng.setStartBefore(table);
								rng.setEndBefore(table);

								editor.selection.setRng(rng);

								e.preventDefault();
							}
						}
					}
				});
			}

			// Fixes an issue on Gecko where it's impossible to place the caret behind a table
			// This fix will force a paragraph element after the table but only when the forced_root_block setting is enabled
			function fixTableCaretPos() {
				editor.on('KeyDown SetContent VisualAid', function() {
					var last;

					// Skip empty text nodes from the end
					for (last = editor.getBody().lastChild; last; last = last.previousSibling) {
						if (last.nodeType == 3) {
							if (last.nodeValue.length > 0) {
								break;
							}
						} else if (last.nodeType == 1 && (last.tagName == 'BR' || !last.getAttribute('data-mce-bogus'))) {
							break;
						}
					}

					if (last && last.nodeName == 'TABLE') {
						if (editor.settings.forced_root_block) {
							editor.dom.add(
								editor.getBody(),
								editor.settings.forced_root_block,
								editor.settings.forced_root_block_attrs,
								Env.ie && Env.ie < 10 ? '&nbsp;' : '<br data-mce-bogus="1" />'
							);
						} else {
							editor.dom.add(editor.getBody(), 'br', {'data-mce-bogus': '1'});
						}
					}
				});

				editor.on('PreProcess', function(o) {
					var last = o.node.lastChild;

					if (last && (last.nodeName == "BR" || (last.childNodes.length == 1 &&
						(last.firstChild.nodeName == 'BR' || last.firstChild.nodeValue == '\u00a0'))) &&
						last.previousSibling && last.previousSibling.nodeName == "TABLE") {
						editor.dom.remove(last);
					}
				});
			}

			// this nasty hack is here to work around some WebKit selection bugs.
			function fixTableCellSelection() {
				function tableCellSelected(ed, rng, n, currentCell) {
					// The decision of when a table cell is selected is somewhat involved.  The fact that this code is
					// required is actually a pointer to the root cause of this bug. A cell is selected when the start
					// and end offsets are 0, the start container is a text, and the selection node is either a TR (most cases)
					// or the parent of the table (in the case of the selection containing the last cell of a table).
					var TEXT_NODE = 3, table = ed.dom.getParent(rng.startContainer, 'TABLE');
					var tableParent, allOfCellSelected, tableCellSelection;

					if (table) {
						tableParent = table.parentNode;
					}

					allOfCellSelected = rng.startContainer.nodeType == TEXT_NODE &&
						rng.startOffset === 0 &&
						rng.endOffset === 0 &&
						currentCell &&
						(n.nodeName == "TR" || n == tableParent);

					tableCellSelection = (n.nodeName == "TD" || n.nodeName == "TH") && !currentCell;

					return allOfCellSelected || tableCellSelection;
				}

				function fixSelection() {
					var rng = editor.selection.getRng();
					var n = editor.selection.getNode();
					var currentCell = editor.dom.getParent(rng.startContainer, 'TD,TH');

					if (!tableCellSelected(editor, rng, n, currentCell)) {
						return;
					}

					if (!currentCell) {
						currentCell = n;
					}

					// Get the very last node inside the table cell
					var end = currentCell.lastChild;
					while (end.lastChild) {
						end = end.lastChild;
					}

					// Select the entire table cell. Nothing outside of the table cell should be selected.
					if (end.nodeType == 3) {
						rng.setEnd(end, end.data.length);
						editor.selection.setRng(rng);
					}
				}

				editor.on('KeyDown', function() {
					fixSelection();
				});

				editor.on('MouseDown', function(e) {
					if (e.button != 2) {
						fixSelection();
					}
				});
			}

			/**
			 * Delete table if all cells are selected.
			 */
			function deleteTable() {
				function placeCaretInCell(cell) {
					editor.selection.select(cell, true);
					editor.selection.collapse(true);
				}

				function clearCell(cell) {
					editor.$(cell).empty();
					Utils.paddCell(cell);
				}

				editor.on('keydown', function(e) {
					if ((e.keyCode == VK.DELETE || e.keyCode == VK.BACKSPACE) && !e.isDefaultPrevented()) {
						var table, tableCells, selectedTableCells, cell;

						table = editor.dom.getParent(editor.selection.getStart(), 'table');
						if (table) {
							tableCells = editor.dom.select('td,th', table);
							selectedTableCells = Tools.grep(tableCells, function(cell) {
								return !!editor.dom.getAttrib(cell, 'data-mce-selected');
							});

							if (selectedTableCells.length === 0) {
								// If caret is within an empty table cell then empty it for real
								cell = editor.dom.getParent(editor.selection.getStart(), 'td,th');
								if (editor.selection.isCollapsed() && cell && editor.dom.isEmpty(cell)) {
									e.preventDefault();
									clearCell(cell);
									placeCaretInCell(cell);
								}

								return;
							}

							e.preventDefault();

							editor.undoManager.transact(function() {
								if (tableCells.length == selectedTableCells.length) {
									editor.execCommand('mceTableDelete');
								} else {
									Tools.each(selectedTableCells, clearCell);
									placeCaretInCell(selectedTableCells[0]);
								}
							});
						}
					}
				});
			}

			deleteTable();

			if (Env.webkit) {
				moveWebKitSelection();
				fixTableCellSelection();
			}

			if (Env.gecko) {
				fixBeforeTableCaretBug();
				fixTableCaretPos();
			}

			if (Env.ie > 9) {
				fixBeforeTableCaretBug();
				fixTableCaretPos();
			}
		};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/*!**********************************!*\
  !*** external "tinymce.util.VK" ***!
  \**********************************/
/***/ function(module, exports) {

	module.exports = tinymce.util.VK;

/***/ },
/* 14 */
/*!*************************************!*\
  !*** external "tinymce.util.Delay" ***!
  \*************************************/
/***/ function(module, exports) {

	module.exports = tinymce.util.Delay;

/***/ },
/* 15 */
/*!***************************************************!*\
  !*** ./src/plugins/table_plugin/CellSelection.js ***!
  \***************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * CellSelection.js
	 *
	 * Released under LGPL License.
	 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/**
	 * This class handles table cell selection by faking it using a css class that gets applied
	 * to cells when dragging the mouse from one cell to another.
	 *
	 * @class tinymce.tableplugin.CellSelection
	 * @private
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(/*! tinymce/tableplugin/TableGrid */ 7),
		__webpack_require__(/*! tinymce/dom/TreeWalker */ 16),
		__webpack_require__(/*! tinymce/util/Tools */ 8)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(TableGrid, TreeWalker, Tools) {
		return function(editor, selectionChange) {
			var dom = editor.dom, tableGrid, startCell, startTable, lastMouseOverTarget, hasCellSelection = true, resizing, dragging;

			function clear(force) {
				// Restore selection possibilities
				editor.getBody().style.webkitUserSelect = '';

				if (force || hasCellSelection) {
					editor.$('td[data-mce-selected],th[data-mce-selected]').removeAttr('data-mce-selected');
					hasCellSelection = false;
				}
			}

			var endSelection = function () {
				startCell = tableGrid = startTable = lastMouseOverTarget = null;
				selectionChange(false);
			};

			function isCellInTable(table, cell) {
				if (!table || !cell) {
					return false;
				}

				return table === dom.getParent(cell, 'table');
			}

			function cellSelectionHandler(e) {
				var sel, target = e.target, currentCell;

				if (resizing || dragging) {
					return;
				}

				// Fake mouse enter by keeping track of last mouse over
				if (target === lastMouseOverTarget) {
					return;
				}

				lastMouseOverTarget = target;

				if (startTable && startCell) {
					currentCell = dom.getParent(target, 'td,th');

					if (!isCellInTable(startTable, currentCell)) {
						currentCell = dom.getParent(startTable, 'td,th');
					}

					// Selection inside first cell is normal until we have expanted
					if (startCell === currentCell && !hasCellSelection) {
						return;
					}

					selectionChange(true);

					if (isCellInTable(startTable, currentCell)) {
						e.preventDefault();

						if (!tableGrid) {
							tableGrid = new TableGrid(editor, startTable, startCell);
							editor.getBody().style.webkitUserSelect = 'none';
						}

						tableGrid.setEndCell(currentCell);
						hasCellSelection = true;

						// Remove current selection
						sel = editor.selection.getSel();

						try {
							if (sel.removeAllRanges) {
								sel.removeAllRanges();
							} else {
								sel.empty();
							}
						} catch (ex) {
							// IE9 might throw errors here
						}
					}
				}
			}

			editor.on('SelectionChange', function(e) {
				if (hasCellSelection) {
					e.stopImmediatePropagation();
				}
			}, true);

			// Add cell selection logic
			editor.on('MouseDown', function(e) {
				if (e.button != 2 && !resizing && !dragging) {
					clear();

					startCell = dom.getParent(e.target, 'td,th');
					startTable = dom.getParent(startCell, 'table');
				}
			});

			editor.on('mouseover', cellSelectionHandler);

			editor.on('remove', function() {
				dom.unbind(editor.getDoc(), 'mouseover', cellSelectionHandler);
				clear();
			});

			editor.on('MouseUp', function() {
				var rng, sel = editor.selection, selectedCells, walker, node, lastNode;

				function setPoint(node, start) {
					var walker = new TreeWalker(node, node);

					do {
						// Text node
						if (node.nodeType == 3 && Tools.trim(node.nodeValue).length !== 0) {
							if (start) {
								rng.setStart(node, 0);
							} else {
								rng.setEnd(node, node.nodeValue.length);
							}

							return;
						}

						// BR element
						if (node.nodeName == 'BR') {
							if (start) {
								rng.setStartBefore(node);
							} else {
								rng.setEndBefore(node);
							}

							return;
						}
					} while ((node = (start ? walker.next() : walker.prev())));
				}

				// Move selection to startCell
				if (startCell) {
					if (tableGrid) {
						editor.getBody().style.webkitUserSelect = '';
					}

					// Try to expand text selection as much as we can only Gecko supports cell selection
					selectedCells = dom.select('td[data-mce-selected],th[data-mce-selected]');
					if (selectedCells.length > 0) {
						rng = dom.createRng();
						node = selectedCells[0];
						rng.setStartBefore(node);
						rng.setEndAfter(node);

						setPoint(node, 1);
						walker = new TreeWalker(node, dom.getParent(selectedCells[0], 'table'));

						do {
							if (node.nodeName == 'TD' || node.nodeName == 'TH') {
								if (!dom.getAttrib(node, 'data-mce-selected')) {
									break;
								}

								lastNode = node;
							}
						} while ((node = walker.next()));

						setPoint(lastNode);

						sel.setRng(rng);
					}

					editor.nodeChanged();
					endSelection();
				}
			});

			editor.on('KeyUp Drop SetContent', function(e) {
				clear(e.type == 'setcontent');
				endSelection();
				resizing = false;
			});

			editor.on('ObjectResizeStart ObjectResized', function(e) {
				resizing = e.type != 'objectresized';
			});

			editor.on('dragstart', function () {
				dragging = true;
			});

			editor.on('drop dragend', function () {
				dragging = false;
			});

			return {
				clear: clear
			};
		};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 16 */
/*!*****************************************!*\
  !*** external "tinymce.dom.TreeWalker" ***!
  \*****************************************/
/***/ function(module, exports) {

	module.exports = tinymce.dom.TreeWalker;

/***/ },
/* 17 */
/*!*********************************************!*\
  !*** ./src/plugins/table_plugin/Dialogs.js ***!
  \*********************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Dialogs.js
	 *
	 * Released under LGPL License.
	 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/*eslint dot-notation:0*/

	/**
	 * ...
	 *
	 * @class tinymce.tableplugin.Dialogs
	 * @private
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(/*! tinymce/util/Tools */ 8),
	    __webpack_require__(/*! tinymce/Env */ 9)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tools, Env) {
	    var each = Tools.each;

	    return function(editor) {
	        var self = this;

	        function createColorPickAction() {
	            var colorPickerCallback = editor.settings.color_picker_callback;

	            if (colorPickerCallback) {
	                return function() {
	                    var self = this;

	                    colorPickerCallback.call(
	                        editor,
	                        function(value) {
	                            self.value(value).fire('change');
	                        },
	                        self.value()
	                    );
	                };
	            }
	        }

	        function createStyleForm(dom) {
	            return {
	                title: 'Advanced',
	                type: 'form',
	                defaults: {
	                    onchange: function() {
	                        updateStyle(dom, this.parents().reverse()[0], this.name() == "style");
	                    }
	                },
	                items: [
	                    {
	                        label: 'Style',
	                        name: 'style',
	                        type: 'textbox'
	                    },

	                    {
	                        type: 'form',
	                        padding: 0,
	                        formItemDefaults: {
	                            layout: 'grid',
	                            alignH: ['start', 'right']
	                        },
	                        defaults: {
	                            size: 7
	                        },
	                        items: [
	                            {
	                                label: 'Border color',
	                                type: 'colorbox',
	                                name: 'borderColor',
	                                onaction: createColorPickAction()
	                            },

	                            {
	                                label: 'Border width',
	                                type: 'textbox',
	                                name: 'borderWidth',
	                                size: 12
	                            },

	                            {
	                                label: 'Background color',
	                                type: 'colorbox',
	                                name: 'backgroundColor',
	                                onaction: createColorPickAction()
	                            }
	                        ]
	                    }
	                ]
	            };
	        }

	        function removePxSuffix(size) {
	            return size ? size.replace(/px$/, '') : "";
	        }

	        function addSizeSuffix(size) {
	            if (/^[0-9]+$/.test(size)) {
	                size += "px";
	            }

	            return size;
	        }

	        function unApplyAlign(elm) {
	            each('left center right'.split(' '), function(name) {
	                editor.formatter.remove('align' + name, {}, elm);
	            });
	        }

	        function unApplyVAlign(elm) {
	            each('top middle bottom'.split(' '), function(name) {
	                editor.formatter.remove('valign' + name, {}, elm);
	            });
	        }

	        function buildListItems(inputList, itemCallback, startItems) {
	            function appendItems(values, output) {
	                output = output || [];

	                Tools.each(values, function(item) {
	                    var menuItem = {text: item.text || item.title};

	                    if (item.menu) {
	                        menuItem.menu = appendItems(item.menu);
	                    } else {
	                        menuItem.value = item.value;

	                        if (itemCallback) {
	                            itemCallback(menuItem);
	                        }
	                    }

	                    output.push(menuItem);
	                });

	                return output;
	            }

	            return appendItems(inputList, startItems || []);
	        }

	        function updateStyle(dom, win, isStyleCtrl) {
	            var data = win.toJSON();
	            var css = dom.parseStyle(data.style);

	            if (css['border']) {
	                var border = __webpack_require__(/*! css-border-property */ 18).parse(css['border']);
	                for (var prop in border) {
	                    css[prop] = prop.value;
	                }
	            }

	            if (isStyleCtrl) {
	                win.find('#borderColor').value(css["border-color"] || '')[0].fire('change');
	                win.find('#borderColor').value(removePxSuffix(css["border-width"]) || '')[0].fire('change');
	                win.find('#backgroundColor').value(css["background-color"] || '')[0].fire('change');
	            } else {
	                css["border-color"] = data.borderColor;
	                css["border-width"] = addSizeSuffix(data.borderWidth);
	                if (data.borderColor || data.borderWidth) {
	                    css["border-style"] = "solid";
	                } else {
	                    css["border-style"] = "";
	                }
	                css["background-color"] = data.backgroundColor;
	            }

	            win.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
	        }

	        function appendStylesToData(dom, data, elm) {
	            var css = dom.parseStyle(dom.getAttrib(elm, 'style'));

	            if (css['border']) {
	                var border = __webpack_require__(/*! css-border-property */ 18).parse(css['border']);
	                for (var i in border) {
	                    var prop = border[i];
	                    css[prop.property] = prop.value;
	                }
	                delete(css['border']);
	            }

	            if (css["border-color"]) {
	                data.borderColor = css["border-color"];
	            }

	            if (css["border-width"]) {
	                data.borderWidth = removePxSuffix(css["border-width"]);
	            }

	            if (css["background-color"]) {
	                data.backgroundColor = css["background-color"];
	            }

	            data.style = dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css)));
	        }

	        function mergeStyles(dom, elm, styles) {
	            var css = dom.parseStyle(dom.getAttrib(elm, 'style'));

	            each(styles, function(style) {
	                css[style.name] = style.value;
	            });

	            dom.setAttrib(elm, 'style', dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
	        }

	        self.tableProps = function() {
	            self.table(true);
	        };

	        self.table = function(isProps) {
	            var dom = editor.dom, tableElm, colsCtrl, rowsCtrl, classListCtrl, data = {}, generalTableForm, stylesToMerge;

	            function onSubmitTableForm() {

	                //Explore the layers of the table till we find the first layer of tds or ths
	                function styleTDTH(elm, name, value) {
	                    if (elm.tagName === "TD" || elm.tagName === "TH") {
	                        dom.setStyle(elm, name, value);
	                    } else {
	                        if (elm.children) {
	                            for (var i = 0; i < elm.children.length; i++) {
	                                styleTDTH(elm.children[i], name, value);
	                            }
	                        }
	                    }
	                }

	                var captionElm;

	                updateStyle(dom, this);
	                data = Tools.extend(data, this.toJSON());

	                if (data["class"] === false) {
	                    delete data["class"];
	                }

	                editor.undoManager.transact(function() {
	                    if (!tableElm) {
	                        tableElm = editor.plugins.table.insertTable(data.cols || 1, data.rows || 1);
	                    }

	                    editor.dom.setAttribs(tableElm, {
	                        style: data.style,
	                        'class': data['class']
	                    });

	                    if (editor.settings.table_style_by_css) {
	                        stylesToMerge = [];
	                        stylesToMerge.push({name: 'border', value: data.border});
	                        stylesToMerge.push({name: 'border-spacing', value: addSizeSuffix(data.cellspacing)});
	                        mergeStyles(dom, tableElm, stylesToMerge);
	                        dom.setAttribs(tableElm, {
	                            'data-mce-border-color': data.borderColor,
	                            'data-mce-cell-padding': data.cellpadding,
	                            'data-mce-border': data.border
	                        });
	                        if (tableElm.children) {
	                            for (var i = 0; i < tableElm.children.length; i++) {
	                                styleTDTH(tableElm.children[i], 'border', data.border);
	                                styleTDTH(tableElm.children[i], 'padding', addSizeSuffix(data.cellpadding));
	                            }
	                        }
	                    } else {
	                        editor.dom.setAttribs(tableElm, {
	                            border: data.border,
	                            cellpadding: data.cellpadding,
	                            cellspacing: data.cellspacing
	                        });
	                    }

	                    if (dom.getAttrib(tableElm, 'width') && !editor.settings.table_style_by_css) {
	                        dom.setAttrib(tableElm, 'width', removePxSuffix(data.width));
	                    } else {
	                        dom.setStyle(tableElm, 'width', addSizeSuffix(data.width));
	                    }

	                    dom.setStyle(tableElm, 'height', addSizeSuffix(data.height));

	                    // Toggle caption on/off
	                    captionElm = dom.select('caption', tableElm)[0];

	                    if (captionElm && !data.caption) {
	                        dom.remove(captionElm);
	                    }

	                    if (!captionElm && data.caption) {
	                        captionElm = dom.create('caption');
	                        captionElm.innerHTML = !Env.ie ? '<br data-mce-bogus="1"/>' : '\u00a0';
	                        tableElm.insertBefore(captionElm, tableElm.firstChild);
	                    }
	                    unApplyAlign(tableElm);
	                    if (data.align) {
	                        editor.formatter.apply('align' + data.align, {}, tableElm);
	                    }

	                    editor.focus();
	                    editor.addVisual();
	                });
	            }

	            function getTDTHOverallStyle(elm, name) {
	                var cells = editor.dom.select("td,th", elm), firstChildStyle;

	                function checkChildren(firstChildStyle, elms) {

	                    for (var i = 0; i < elms.length; i++) {
	                        var currentStyle = dom.getStyle(elms[i], name);
	                        if (typeof firstChildStyle === "undefined") {
	                            firstChildStyle = currentStyle;
	                        }
	                        if (firstChildStyle != currentStyle) {
	                            return "";
	                        }
	                    }

	                    return firstChildStyle;

	                }

	                firstChildStyle = checkChildren(firstChildStyle, cells);

	                return firstChildStyle;
	            }

	            if (isProps === true) {
	                tableElm = dom.getParent(editor.selection.getStart(), 'table');

	                if (tableElm) {
	                    data = {
	                        width: removePxSuffix(dom.getStyle(tableElm, 'width') || dom.getAttrib(tableElm, 'width')),
	                        height: removePxSuffix(dom.getStyle(tableElm, 'height') || dom.getAttrib(tableElm, 'height')),
	                        cellspacing: removePxSuffix(dom.getStyle(tableElm, 'border-spacing') ||
	                            dom.getAttrib(tableElm, 'cellspacing')),
	                        cellpadding: dom.getAttrib(tableElm, 'data-mce-cell-padding') || dom.getAttrib(tableElm, 'cellpadding') ||
	                            getTDTHOverallStyle(tableElm, 'padding'),
	                        border: dom.getAttrib(tableElm, 'data-mce-border') || dom.getAttrib(tableElm, 'border') ||
	                            getTDTHOverallStyle(tableElm, 'border'),
	                        borderColor: dom.getAttrib(tableElm, 'data-mce-border-color'),
	                        caption: !!dom.select('caption', tableElm)[0],
	                        'class': dom.getAttrib(tableElm, 'class')
	                    };

	                    each('left center right'.split(' '), function(name) {
	                        if (editor.formatter.matchNode(tableElm, 'align' + name)) {
	                            data.align = name;
	                        }
	                    });
	                }
	            } else {
	                colsCtrl = {label: 'Cols', name: 'cols'};
	                rowsCtrl = {label: 'Rows', name: 'rows'};
	            }

	            if (editor.settings.table_class_list) {
	                if (data["class"]) {
	                    data["class"] = data["class"].replace(/\s*mce\-item\-table\s*/g, '');
	                }

	                classListCtrl = {
	                    name: 'class',
	                    type: 'listbox',
	                    label: 'Class',
	                    values: buildListItems(
	                        editor.settings.table_class_list,
	                        function(item) {
	                            if (item.value) {
	                                item.textStyle = function() {
	                                    return editor.formatter.getCssText({block: 'table', classes: [item.value]});
	                                };
	                            }
	                        }
	                    )
	                };
	            }

	            generalTableForm = {
	                type: 'form',
	                layout: 'flex',
	                direction: 'column',
	                labelGapCalc: 'children',
	                padding: 0,
	                items: [
	                    {
	                        type: 'form',
	                        labelGapCalc: false,
	                        padding: 0,
	                        layout: 'grid',
	                        columns: 2,
	                        defaults: {
	                            type: 'textbox',
	                            maxWidth: 50
	                        },
	                        items: (editor.settings.table_appearance_options !== false) ? [
	                            colsCtrl,
	                            rowsCtrl,
	                            {label: 'Width', name: 'width'},
	                            {label: 'Height', name: 'height'},
	                            {label: 'Cell spacing', name: 'cellspacing'},
	                            {label: 'Cell padding', name: 'cellpadding'},
	                            {label: 'Border', name: 'border'},
	                            {label: 'Caption', name: 'caption', type: 'checkbox'}
	                        ] : [
	                            colsCtrl,
	                            rowsCtrl,
	                            {label: 'Width', name: 'width'},
	                            {label: 'Height', name: 'height'}
	                        ]
	                    },

	                    {
	                        label: 'Alignment',
	                        name: 'align',
	                        type: 'listbox',
	                        text: 'None',
	                        values: [
	                            {text: 'None', value: ''},
	                            {text: 'Left', value: 'left'},
	                            {text: 'Center', value: 'center'},
	                            {text: 'Right', value: 'right'}
	                        ]
	                    },

	                    classListCtrl
	                ]
	            };

	            if (editor.settings.table_advtab !== false) {
	                appendStylesToData(dom, data, tableElm);

	                editor.windowManager.open({
	                    title: "Table properties",
	                    data: data,
	                    bodyType: 'tabpanel',
	                    body: [
	                        {
	                            title: 'General',
	                            type: 'form',
	                            items: generalTableForm
	                        },
	                        createStyleForm(dom)
	                    ],

	                    onsubmit: onSubmitTableForm
	                });
	            } else {
	                editor.windowManager.open({
	                    title: "Table properties",
	                    data: data,
	                    body: generalTableForm,
	                    onsubmit: onSubmitTableForm
	                });
	            }
	        };

	        self.merge = function(grid, cell) {
	            editor.windowManager.open({
	                title: "Merge cells",
	                body: [
	                    {label: 'Cols', name: 'cols', type: 'textbox', value: '1', size: 10},
	                    {label: 'Rows', name: 'rows', type: 'textbox', value: '1', size: 10}
	                ],
	                onsubmit: function() {
	                    var data = this.toJSON();

	                    editor.undoManager.transact(function() {
	                        grid.merge(cell, data.cols, data.rows);
	                    });
	                }
	            });
	        };

	        self.cell = function() {
	            var dom = editor.dom, cellElm, data, classListCtrl, cells = [];

	            function onSubmitCellForm() {
	                updateStyle(dom, this);
	                data = Tools.extend(data, this.toJSON());

	                editor.undoManager.transact(function() {
	                    each(cells, function(cellElm) {
	                        editor.dom.setAttribs(cellElm, {
	                            scope: data.scope,
	                            style: data.style,
	                            'class': data['class']
	                        });

	                        editor.dom.setStyles(cellElm, {
	                            width: addSizeSuffix(data.width),
	                            height: addSizeSuffix(data.height)
	                        });

	                        // Switch cell type
	                        if (data.type && cellElm.nodeName.toLowerCase() != data.type) {
	                            cellElm = dom.rename(cellElm, data.type);
	                        }

	                        // Apply/remove alignment
	                        unApplyAlign(cellElm);
	                        if (data.align) {
	                            editor.formatter.apply('align' + data.align, {}, cellElm);
	                        }

	                        // Apply/remove vertical alignment
	                        unApplyVAlign(cellElm);
	                        if (data.valign) {
	                            editor.formatter.apply('valign' + data.valign, {}, cellElm);
	                        }
	                    });

	                    editor.focus();
	                });
	            }

	            // Get selected cells or the current cell
	            cells = editor.dom.select('td[data-mce-selected],th[data-mce-selected]');
	            cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th');
	            if (!cells.length && cellElm) {
	                cells.push(cellElm);
	            }

	            cellElm = cellElm || cells[0];

	            if (!cellElm) {
	                // If this element is null, return now to avoid crashing.
	                return;
	            }

	            data = {
	                width: removePxSuffix(dom.getStyle(cellElm, 'width') || dom.getAttrib(cellElm, 'width')),
	                height: removePxSuffix(dom.getStyle(cellElm, 'height') || dom.getAttrib(cellElm, 'height')),
	                scope: dom.getAttrib(cellElm, 'scope'),
	                'class': dom.getAttrib(cellElm, 'class')
	            };

	            data.type = cellElm.nodeName.toLowerCase();

	            each('left center right'.split(' '), function(name) {
	                if (editor.formatter.matchNode(cellElm, 'align' + name)) {
	                    data.align = name;
	                }
	            });

	            each('top middle bottom'.split(' '), function(name) {
	                if (editor.formatter.matchNode(cellElm, 'valign' + name)) {
	                    data.valign = name;
	                }
	            });

	            if (editor.settings.table_cell_class_list) {
	                classListCtrl = {
	                    name: 'class',
	                    type: 'listbox',
	                    label: 'Class',
	                    values: buildListItems(
	                        editor.settings.table_cell_class_list,
	                        function(item) {
	                            if (item.value) {
	                                item.textStyle = function() {
	                                    return editor.formatter.getCssText({block: 'td', classes: [item.value]});
	                                };
	                            }
	                        }
	                    )
	                };
	            }

	            var generalCellForm = {
	                type: 'form',
	                layout: 'flex',
	                direction: 'column',
	                labelGapCalc: 'children',
	                padding: 0,
	                items: [
	                    {
	                        type: 'form',
	                        layout: 'grid',
	                        columns: 2,
	                        labelGapCalc: false,
	                        padding: 0,
	                        defaults: {
	                            type: 'textbox',
	                            maxWidth: 50
	                        },
	                        items: [
	                            {label: 'Width', name: 'width'},
	                            {label: 'Height', name: 'height'},
	                            {
	                                label: 'Cell type',
	                                name: 'type',
	                                type: 'listbox',
	                                text: 'None',
	                                minWidth: 90,
	                                maxWidth: null,
	                                values: [
	                                    {text: 'Cell', value: 'td'},
	                                    {text: 'Header cell', value: 'th'}
	                                ]
	                            },
	                            {
	                                label: 'Scope',
	                                name: 'scope',
	                                type: 'listbox',
	                                text: 'None',
	                                minWidth: 90,
	                                maxWidth: null,
	                                values: [
	                                    {text: 'None', value: ''},
	                                    {text: 'Row', value: 'row'},
	                                    {text: 'Column', value: 'col'},
	                                    {text: 'Row group', value: 'rowgroup'},
	                                    {text: 'Column group', value: 'colgroup'}
	                                ]
	                            },
	                            {
	                                label: 'H Align',
	                                name: 'align',
	                                type: 'listbox',
	                                text: 'None',
	                                minWidth: 90,
	                                maxWidth: null,
	                                values: [
	                                    {text: 'None', value: ''},
	                                    {text: 'Left', value: 'left'},
	                                    {text: 'Center', value: 'center'},
	                                    {text: 'Right', value: 'right'}
	                                ]
	                            },
	                            {
	                                label: 'V Align',
	                                name: 'valign',
	                                type: 'listbox',
	                                text: 'None',
	                                minWidth: 90,
	                                maxWidth: null,
	                                values: [
	                                    {text: 'None', value: ''},
	                                    {text: 'Top', value: 'top'},
	                                    {text: 'Middle', value: 'middle'},
	                                    {text: 'Bottom', value: 'bottom'}
	                                ]
	                            }
	                        ]
	                    },

	                    classListCtrl
	                ]
	            };

	            if (editor.settings.table_cell_advtab !== false) {
	                appendStylesToData(dom, data, cellElm);

	                editor.windowManager.open({
	                    title: "Cell properties",
	                    bodyType: 'tabpanel',
	                    data: data,
	                    body: [
	                        {
	                            title: 'General',
	                            type: 'form',
	                            items: generalCellForm
	                        },

	                        createStyleForm(dom)
	                    ],

	                    onsubmit: onSubmitCellForm
	                });
	            } else {
	                editor.windowManager.open({
	                    title: "Cell properties",
	                    data: data,
	                    body: generalCellForm,
	                    onsubmit: onSubmitCellForm
	                });
	            }
	        };

	        self.row = function() {
	            var dom = editor.dom, tableElm, cellElm, rowElm, classListCtrl, data, rows = [], generalRowForm;

	            function onSubmitRowForm() {
	                var tableElm, oldParentElm, parentElm;

	                updateStyle(dom, this);
	                data = Tools.extend(data, this.toJSON());

	                editor.undoManager.transact(function() {
	                    var toType = data.type;

	                    each(rows, function(rowElm) {
	                        editor.dom.setAttribs(rowElm, {
	                            scope: data.scope,
	                            style: data.style,
	                            'class': data['class']
	                        });

	                        editor.dom.setStyles(rowElm, {
	                            height: addSizeSuffix(data.height)
	                        });

	                        if (toType != rowElm.parentNode.nodeName.toLowerCase()) {
	                            tableElm = dom.getParent(rowElm, 'table');

	                            oldParentElm = rowElm.parentNode;
	                            parentElm = dom.select(toType, tableElm)[0];
	                            if (!parentElm) {
	                                parentElm = dom.create(toType);
	                                if (tableElm.firstChild) {
	                                    tableElm.insertBefore(parentElm, tableElm.firstChild);
	                                } else {
	                                    tableElm.appendChild(parentElm);
	                                }
	                            }

	                            parentElm.appendChild(rowElm);

	                            if (!oldParentElm.hasChildNodes()) {
	                                dom.remove(oldParentElm);
	                            }
	                        }

	                        // Apply/remove alignment
	                        unApplyAlign(rowElm);
	                        if (data.align) {
	                            editor.formatter.apply('align' + data.align, {}, rowElm);
	                        }
	                    });

	                    editor.focus();
	                });
	            }

	            tableElm = editor.dom.getParent(editor.selection.getStart(), 'table');
	            cellElm = editor.dom.getParent(editor.selection.getStart(), 'td,th');

	            each(tableElm.rows, function(row) {
	                each(row.cells, function(cell) {
	                    if (dom.getAttrib(cell, 'data-mce-selected') || cell == cellElm) {
	                        rows.push(row);
	                        return false;
	                    }
	                });
	            });

	            rowElm = rows[0];
	            if (!rowElm) {
	                // If this element is null, return now to avoid crashing.
	                return;
	            }

	            data = {
	                height: removePxSuffix(dom.getStyle(rowElm, 'height') || dom.getAttrib(rowElm, 'height')),
	                scope: dom.getAttrib(rowElm, 'scope'),
	                'class': dom.getAttrib(rowElm, 'class')
	            };

	            data.type = rowElm.parentNode.nodeName.toLowerCase();

	            each('left center right'.split(' '), function(name) {
	                if (editor.formatter.matchNode(rowElm, 'align' + name)) {
	                    data.align = name;
	                }
	            });

	            if (editor.settings.table_row_class_list) {
	                classListCtrl = {
	                    name: 'class',
	                    type: 'listbox',
	                    label: 'Class',
	                    values: buildListItems(
	                        editor.settings.table_row_class_list,
	                        function(item) {
	                            if (item.value) {
	                                item.textStyle = function() {
	                                    return editor.formatter.getCssText({block: 'tr', classes: [item.value]});
	                                };
	                            }
	                        }
	                    )
	                };
	            }

	            generalRowForm = {
	                type: 'form',
	                columns: 2,
	                padding: 0,
	                defaults: {
	                    type: 'textbox'
	                },
	                items: [
	                    {
	                        type: 'listbox',
	                        name: 'type',
	                        label: 'Row type',
	                        text: 'None',
	                        maxWidth: null,
	                        values: [
	                            {text: 'Header', value: 'thead'},
	                            {text: 'Body', value: 'tbody'},
	                            {text: 'Footer', value: 'tfoot'}
	                        ]
	                    },
	                    {
	                        type: 'listbox',
	                        name: 'align',
	                        label: 'Alignment',
	                        text: 'None',
	                        maxWidth: null,
	                        values: [
	                            {text: 'None', value: ''},
	                            {text: 'Left', value: 'left'},
	                            {text: 'Center', value: 'center'},
	                            {text: 'Right', value: 'right'}
	                        ]
	                    },
	                    {label: 'Height', name: 'height'},
	                    classListCtrl
	                ]
	            };

	            if (editor.settings.table_row_advtab !== false) {
	                appendStylesToData(dom, data, rowElm);

	                editor.windowManager.open({
	                    title: "Row properties",
	                    data: data,
	                    bodyType: 'tabpanel',
	                    body: [
	                        {
	                            title: 'General',
	                            type: 'form',
	                            items: generalRowForm
	                        },
	                        createStyleForm(dom)
	                    ],

	                    onsubmit: onSubmitRowForm
	                });
	            } else {
	                editor.windowManager.open({
	                    title: "Row properties",
	                    data: data,
	                    body: generalRowForm,
	                    onsubmit: onSubmitRowForm
	                });
	            }
	        };
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 18 */
/*!****************************************!*\
  !*** ./~/css-border-property/index.js ***!
  \****************************************/
/***/ function(module, exports, __webpack_require__) {

	var isColor = __webpack_require__(/*! is-color */ 19)
	var isLength = __webpack_require__(/*! is-css-length */ 35)
	var isStyle = __webpack_require__(/*! is-border-style */ 36)

	function isWidth (str) {
	  return isLength(str) || str === 'thin' || str === 'medium' || str === 'thick'
	}

	function check (val) {
	  if (isColor(val)) return 'color'
	  if (isWidth(val)) return 'width'
	  if (isStyle(val)) return 'style'

	  return null
	}

	module.exports.parse = function (str) {
	  var value = str.split(' ')
	  var ret = []
	  value.forEach(function (v) {
	    var prop = check(v)
	    if (prop) {
	      var obj = {}
	      obj.property = 'border-' + prop
	      obj.value = v
	      ret.push(obj)
	    }
	  })
	  return ret
	}

	module.exports.stringify = function (arr) {
	  var prop = []
	  arr.forEach(function (obj) {
	    Object.keys(obj).forEach(function (key) {
	      if (key === 'value') prop.push(obj[key])
	    })
	  })
	  return prop.join(' ')
	}


/***/ },
/* 19 */
/*!*****************************!*\
  !*** ./~/is-color/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var isRgb = __webpack_require__(/*! ./lib/isRgb */ 20)
	var isRgba = __webpack_require__(/*! ./lib/isRgba */ 22)
	var isHsl = __webpack_require__(/*! ./lib/isHsl */ 24)
	var isHsla = __webpack_require__(/*! ./lib/isHsla */ 26)
	var isHex = __webpack_require__(/*! ./lib/isHex */ 28)
	var isKeyword = __webpack_require__(/*! ./lib/isKeyword */ 30)
	var isInherit = __webpack_require__(/*! ./lib/isInherit */ 32)
	var isCurrentColor = __webpack_require__(/*! ./lib/isCurrentColor */ 33)
	var isTransparent = __webpack_require__(/*! ./lib/isTransparent */ 34)


	module.exports = function isColor (str) {
	  return isRgb(str) || isRgba(str) || isHsl(str) || isHsla(str) || isHex(str) || isKeyword(str) || isInherit(str) || isCurrentColor(str) || isTransparent(str)
	}

	module.exports.isRgb = isRgb
	module.exports.isRgba = isRgba
	module.exports.isHsl = isHsl
	module.exports.isHsla = isHsla
	module.exports.isHex = isHex
	module.exports.isKeyword = isKeyword
	module.exports.isInherit = isInherit
	module.exports.isCurrentColor = isCurrentColor
	module.exports.isTransparent = isTransparent


/***/ },
/* 20 */
/*!*********************************!*\
  !*** ./~/is-color/lib/isRgb.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var rgbRegex = __webpack_require__(/*! rgb-regex */ 21)

	module.exports = function (str) {
	  return rgbRegex({exact: true}).test(str)
	}


/***/ },
/* 21 */
/*!******************************!*\
  !*** ./~/rgb-regex/index.js ***!
  \******************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = function rgbRegex(options) {
	  options = options || {};

	  return options.exact ?
	    /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/ :
	    /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/ig;
	}


/***/ },
/* 22 */
/*!**********************************!*\
  !*** ./~/is-color/lib/isRgba.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var rgbaRegex = __webpack_require__(/*! rgba-regex */ 23)

	function isRgba (str) {
	  return rgbaRegex({exact: true}).test(str)
	}

	module.exports = isRgba


/***/ },
/* 23 */
/*!*******************************!*\
  !*** ./~/rgba-regex/index.js ***!
  \*******************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = function rgbaRegex(options) {
	  options = options || {};

	  return options.exact ?
	    /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)$/ :
	    /rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d*(?:\.\d+)?)\)/ig;
	}


/***/ },
/* 24 */
/*!*********************************!*\
  !*** ./~/is-color/lib/isHsl.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var hslRegex = __webpack_require__(/*! hsl-regex */ 25)

	function isHsl (str) {
	  return hslRegex({exact: true}).test(str)
	}

	module.exports = isHsl


/***/ },
/* 25 */
/*!******************************!*\
  !*** ./~/hsl-regex/index.js ***!
  \******************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = function hslRegex(options) {
	  options = options || {};

	  return options.exact ?
	    /^hsl\(\s*(\d+)\s*,\s*(\d*(?:\.\d+)?%)\s*,\s*(\d*(?:\.\d+)?%)\)$/ :
	    /hsl\(\s*(\d+)\s*,\s*(\d*(?:\.\d+)?%)\s*,\s*(\d*(?:\.\d+)?%)\)/ig;
	}


/***/ },
/* 26 */
/*!**********************************!*\
  !*** ./~/is-color/lib/isHsla.js ***!
  \**********************************/
/***/ function(module, exports, __webpack_require__) {

	var hslaRegex = __webpack_require__(/*! hsla-regex */ 27)

	function isHsla (str) {
	  return hslaRegex({exact: true}).test(str)
	}

	module.exports = isHsla


/***/ },
/* 27 */
/*!*******************************!*\
  !*** ./~/hsla-regex/index.js ***!
  \*******************************/
/***/ function(module, exports) {

	'use strict';

	module.exports = function hslaRegex(options) {
	  options = options || {};

	  return options.exact ?
	    /^hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*(?:\.\d+)?)\)$/ :
	    /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*(\d*(?:\.\d+)?)\)/ig;
	}


/***/ },
/* 28 */
/*!*********************************!*\
  !*** ./~/is-color/lib/isHex.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	var hexRegex = __webpack_require__(/*! hex-color-regex */ 29)

	function isHex (str) {
	  return hexRegex({exact: true}).test(str)
	}

	module.exports = isHex


/***/ },
/* 29 */
/*!************************************!*\
  !*** ./~/hex-color-regex/index.js ***!
  \************************************/
/***/ function(module, exports) {

	/*!
	 * hex-color-regex <https://github.com/regexps/hex-color-regex>
	 *
	 * Copyright (c) 2015 Charlike Mike Reagent <@tunnckoCore> (http://www.tunnckocore.tk)
	 * Released under the MIT license.
	 */

	'use strict'

	module.exports = function hexColorRegex (opts) {
	  opts = opts && typeof opts === 'object' ? opts : {}

	  return opts.strict ? /^#([a-f0-9]{6}|[a-f0-9]{3})\b$/i : /#([a-f0-9]{6}|[a-f0-9]{3})\b/gi
	}


/***/ },
/* 30 */
/*!*************************************!*\
  !*** ./~/is-color/lib/isKeyword.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	var keywords = __webpack_require__(/*! css-color-names */ 31)

	function isKeyword (str) {
	  return keywords[str] ? true : false
	}

	module.exports = isKeyword


/***/ },
/* 31 */
/*!************************************************!*\
  !*** ./~/css-color-names/css-color-names.json ***!
  \************************************************/
/***/ function(module, exports) {

	module.exports = {
		"aqua": "#00ffff",
		"aliceblue": "#f0f8ff",
		"antiquewhite": "#faebd7",
		"black": "#000000",
		"blue": "#0000ff",
		"cyan": "#00ffff",
		"darkblue": "#00008b",
		"darkcyan": "#008b8b",
		"darkgreen": "#006400",
		"darkturquoise": "#00ced1",
		"deepskyblue": "#00bfff",
		"green": "#008000",
		"lime": "#00ff00",
		"mediumblue": "#0000cd",
		"mediumspringgreen": "#00fa9a",
		"navy": "#000080",
		"springgreen": "#00ff7f",
		"teal": "#008080",
		"midnightblue": "#191970",
		"dodgerblue": "#1e90ff",
		"lightseagreen": "#20b2aa",
		"forestgreen": "#228b22",
		"seagreen": "#2e8b57",
		"darkslategray": "#2f4f4f",
		"darkslategrey": "#2f4f4f",
		"limegreen": "#32cd32",
		"mediumseagreen": "#3cb371",
		"turquoise": "#40e0d0",
		"royalblue": "#4169e1",
		"steelblue": "#4682b4",
		"darkslateblue": "#483d8b",
		"mediumturquoise": "#48d1cc",
		"indigo": "#4b0082",
		"darkolivegreen": "#556b2f",
		"cadetblue": "#5f9ea0",
		"cornflowerblue": "#6495ed",
		"mediumaquamarine": "#66cdaa",
		"dimgray": "#696969",
		"dimgrey": "#696969",
		"slateblue": "#6a5acd",
		"olivedrab": "#6b8e23",
		"slategray": "#708090",
		"slategrey": "#708090",
		"lightslategray": "#778899",
		"lightslategrey": "#778899",
		"mediumslateblue": "#7b68ee",
		"lawngreen": "#7cfc00",
		"aquamarine": "#7fffd4",
		"chartreuse": "#7fff00",
		"gray": "#808080",
		"grey": "#808080",
		"maroon": "#800000",
		"olive": "#808000",
		"purple": "#800080",
		"lightskyblue": "#87cefa",
		"skyblue": "#87ceeb",
		"blueviolet": "#8a2be2",
		"darkmagenta": "#8b008b",
		"darkred": "#8b0000",
		"saddlebrown": "#8b4513",
		"darkseagreen": "#8fbc8f",
		"lightgreen": "#90ee90",
		"mediumpurple": "#9370db",
		"darkviolet": "#9400d3",
		"palegreen": "#98fb98",
		"darkorchid": "#9932cc",
		"yellowgreen": "#9acd32",
		"sienna": "#a0522d",
		"brown": "#a52a2a",
		"darkgray": "#a9a9a9",
		"darkgrey": "#a9a9a9",
		"greenyellow": "#adff2f",
		"lightblue": "#add8e6",
		"paleturquoise": "#afeeee",
		"lightsteelblue": "#b0c4de",
		"powderblue": "#b0e0e6",
		"firebrick": "#b22222",
		"darkgoldenrod": "#b8860b",
		"mediumorchid": "#ba55d3",
		"rosybrown": "#bc8f8f",
		"darkkhaki": "#bdb76b",
		"silver": "#c0c0c0",
		"mediumvioletred": "#c71585",
		"indianred": "#cd5c5c",
		"peru": "#cd853f",
		"chocolate": "#d2691e",
		"tan": "#d2b48c",
		"lightgray": "#d3d3d3",
		"lightgrey": "#d3d3d3",
		"thistle": "#d8bfd8",
		"goldenrod": "#daa520",
		"orchid": "#da70d6",
		"palevioletred": "#db7093",
		"crimson": "#dc143c",
		"gainsboro": "#dcdcdc",
		"plum": "#dda0dd",
		"burlywood": "#deb887",
		"lightcyan": "#e0ffff",
		"lavender": "#e6e6fa",
		"darksalmon": "#e9967a",
		"palegoldenrod": "#eee8aa",
		"violet": "#ee82ee",
		"azure": "#f0ffff",
		"honeydew": "#f0fff0",
		"khaki": "#f0e68c",
		"lightcoral": "#f08080",
		"sandybrown": "#f4a460",
		"beige": "#f5f5dc",
		"mintcream": "#f5fffa",
		"wheat": "#f5deb3",
		"whitesmoke": "#f5f5f5",
		"ghostwhite": "#f8f8ff",
		"lightgoldenrodyellow": "#fafad2",
		"linen": "#faf0e6",
		"salmon": "#fa8072",
		"oldlace": "#fdf5e6",
		"bisque": "#ffe4c4",
		"blanchedalmond": "#ffebcd",
		"coral": "#ff7f50",
		"cornsilk": "#fff8dc",
		"darkorange": "#ff8c00",
		"deeppink": "#ff1493",
		"floralwhite": "#fffaf0",
		"fuchsia": "#ff00ff",
		"gold": "#ffd700",
		"hotpink": "#ff69b4",
		"ivory": "#fffff0",
		"lavenderblush": "#fff0f5",
		"lemonchiffon": "#fffacd",
		"lightpink": "#ffb6c1",
		"lightsalmon": "#ffa07a",
		"lightyellow": "#ffffe0",
		"magenta": "#ff00ff",
		"mistyrose": "#ffe4e1",
		"moccasin": "#ffe4b5",
		"navajowhite": "#ffdead",
		"orange": "#ffa500",
		"orangered": "#ff4500",
		"papayawhip": "#ffefd5",
		"peachpuff": "#ffdab9",
		"pink": "#ffc0cb",
		"red": "#ff0000",
		"seashell": "#fff5ee",
		"snow": "#fffafa",
		"tomato": "#ff6347",
		"white": "#ffffff",
		"yellow": "#ffff00",
		"rebeccapurple": "#663399"
	};

/***/ },
/* 32 */
/*!*************************************!*\
  !*** ./~/is-color/lib/isInherit.js ***!
  \*************************************/
/***/ function(module, exports) {

	function isInherit (str) {
	  return str === 'inherit'
	}

	module.exports = isInherit


/***/ },
/* 33 */
/*!******************************************!*\
  !*** ./~/is-color/lib/isCurrentColor.js ***!
  \******************************************/
/***/ function(module, exports) {

	function isCurrentColor (str) {
	  return str === 'currentColor'
	}

	module.exports = isCurrentColor


/***/ },
/* 34 */
/*!*****************************************!*\
  !*** ./~/is-color/lib/isTransparent.js ***!
  \*****************************************/
/***/ function(module, exports) {

	function isTransparent (str) {
	  return str === 'transparent'
	}

	module.exports = isTransparent



/***/ },
/* 35 */
/*!**********************************!*\
  !*** ./~/is-css-length/index.js ***!
  \**********************************/
/***/ function(module, exports) {

	module.exports = function (str) {
	  var length =  /^(\+|-)?([0-9]*\.)?[0-9]+(em|ex|ch|rem|vh|vw|vmin|vmax|px|mm|cm|in|pt|pc|%)$/i
	  var zero =  /^(\+|-)?(0*\.)?0+$/

	  return length.test(str) || zero.test(str)
	}


/***/ },
/* 36 */
/*!************************************!*\
  !*** ./~/is-border-style/index.js ***!
  \************************************/
/***/ function(module, exports) {

	module.exports = function (str) {
	  var value = /^(none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)$/i
	  return value.test(str)
	}


/***/ },
/* 37 */
/*!************************************************!*\
  !*** ./src/plugins/table_plugin/ResizeBars.js ***!
  \************************************************/
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * ResizeBars.js
	 *
	 * Released under LGPL License.
	 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
	 *
	 * License: http://www.tinymce.com/license
	 * Contributing: http://www.tinymce.com/contributing
	 */

	/**
	 * This class handles table column and row resizing by adding divs over the columns and rows of the table.
	 * These divs are then manipulated using mouse events to resize the underlying table.
	 *
	 * @class tinymce.tableplugin.ResizeBars
	 * @private
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(/*! tinymce/util/Tools */ 8),
		__webpack_require__(/*! tinymce/util/VK */ 13)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Tools, VK) {
		var hoverTable;

		return function(editor) {
			var RESIZE_BAR_CLASS = 'mce-resize-bar',
				RESIZE_BAR_ROW_CLASS = 'mce-resize-bar-row',
				RESIZE_BAR_ROW_CURSOR_STYLE = 'row-resize',
				RESIZE_BAR_ROW_DATA_ATTRIBUTE = 'data-row',
				RESIZE_BAR_ROW_DATA_INITIAL_TOP_ATTRIBUTE = 'data-initial-top',
				RESIZE_BAR_COL_CLASS = 'mce-resize-bar-col',
				RESIZE_BAR_COL_CURSOR_STYLE = 'col-resize',
				RESIZE_BAR_COL_DATA_ATTRIBUTE = 'data-col',
				RESIZE_BAR_COL_DATA_INITIAL_LEFT_ATTRIBUTE = 'data-initial-left',
				RESIZE_BAR_THICKNESS = 4,
				RESIZE_MINIMUM_WIDTH = 10,
				RESIZE_MINIMUM_HEIGHT = 10,
				RESIZE_BAR_DRAGGING_CLASS = 'mce-resize-bar-dragging';

			var percentageBasedSizeRegex = new RegExp(/(\d+(\.\d+)?%)/),
				pixelBasedSizeRegex = new RegExp(/px|em/);

			var delayDrop, dragging, blockerElement, dragBar, lastX, lastY;

			// Get the absolute position's top edge.
			function getTopEdge(index, row) {
				return {
					index: index,
					y: editor.dom.getPos(row).y
				};
			}

			// Get the absolute position's bottom edge.
			function getBottomEdge(index, row) {
				return {
					index: index,
					y: editor.dom.getPos(row).y + row.offsetHeight
				};
			}

			// Get the absolute position's left edge.
			function getLeftEdge(index, cell) {
				return {
					index: index,
					x: editor.dom.getPos(cell).x
				};
			}

			// Get the absolute position's right edge.
			function getRightEdge(index, cell) {
				return {
					index: index,
					x: editor.dom.getPos(cell).x + cell.offsetWidth
				};
			}

			function isRtl() {
				var dir = editor.getBody().dir;
				return dir === 'rtl';
			}

			function isInline() {
				return editor.inline;
			}

			function getBody() {
				return isInline ? editor.getBody().ownerDocument.body : editor.getBody();
			}

			function getInnerEdge(index, cell) {
				return isRtl() ? getRightEdge(index, cell) : getLeftEdge(index, cell);
			}

			function getOuterEdge(index, cell) {
				return isRtl() ? getLeftEdge(index, cell) : getRightEdge(index, cell);
			}

			function getPercentageWidthFallback(element, table) {
				return getComputedStyleSize(element, 'width') / getComputedStyleSize(table, 'width') * 100;
			}

			function getComputedStyleSize(element, property) {
				var widthString = editor.dom.getStyle(element, property, true);
				var width = parseInt(widthString, 10);
				return width;
			}

			function getCurrentTablePercentWidth(table) {
				var tableWidth = getComputedStyleSize(table, 'width');
				var tableParentWidth = getComputedStyleSize(table.parentElement, 'width');
				return tableWidth / tableParentWidth * 100;
			}

			function getCellPercentDelta(table, delta) {
				var tableWidth = getComputedStyleSize(table, 'width');
				return delta / tableWidth * 100;
			}

			function getTablePercentDelta(table, delta) {
				var tableParentWidth = getComputedStyleSize(table.parentElement, 'width');
				return delta / tableParentWidth * 100;
			}

			// Find the left/right (ltr/rtl) or top side locations of the cells to measure.
			// This is the location of the borders we need to draw over.
			function findPositions(getInner, getOuter, thingsToMeasure) {
				var tablePositions = [];

				// Skip the first item in the array = no left (LTR), right (RTL) or top bars
				for (var i = 1; i < thingsToMeasure.length; i++) {
					// Get the element from the details
					var item = thingsToMeasure[i].element;

					// We need to zero index this again
					tablePositions.push(getInner(i - 1, item));
				}

				var lastTableLineToMake = thingsToMeasure[thingsToMeasure.length - 1];
				tablePositions.push(getOuter(thingsToMeasure.length - 1, lastTableLineToMake.element));

				return tablePositions;
			}

			// Clear the bars.
			function clearBars() {
				var bars = editor.dom.select('.' + RESIZE_BAR_CLASS, getBody());
				Tools.each(bars, function(bar) {
					editor.dom.remove(bar);
				});
			}

			// Refresh the bars.
			function refreshBars(tableElement) {
				clearBars();
				drawBars(tableElement);
			}

			// Generates a resize bar object for the editor to add.
			function generateBar(classToAdd, cursor, left, top, height, width, indexAttr, index) {
				var bar = {
					'data-mce-bogus': 'all',
					'class': RESIZE_BAR_CLASS + ' ' + classToAdd,
					'unselectable': 'on',
					'data-mce-resize': false,
					style: 'cursor: ' + cursor + '; ' +
						'margin: 0; ' +
						'padding: 0; ' +
						'position: absolute; ' +
						'left: ' + left + 'px; ' +
						'top: ' + top + 'px; ' +
						'height: ' + height + 'px; ' +
						'width: ' + width + 'px; '
				};

				bar[indexAttr] = index;

				return bar;
			}

			// Draw the row bars over the row borders.
			function drawRows(rowPositions, tableWidth, tablePosition) {
				Tools.each(rowPositions, function(rowPosition) {
					var left = tablePosition.x,
						top = rowPosition.y - RESIZE_BAR_THICKNESS / 2,
						height = RESIZE_BAR_THICKNESS,
						width = tableWidth;

					editor.dom.add(getBody(), 'div',
						generateBar(RESIZE_BAR_ROW_CLASS, RESIZE_BAR_ROW_CURSOR_STYLE,
							left, top, height, width, RESIZE_BAR_ROW_DATA_ATTRIBUTE, rowPosition.index));
				});
			}

			// Draw the column bars over the column borders.
			function drawCols(cellPositions, tableHeight, tablePosition) {
				Tools.each(cellPositions, function(cellPosition) {
					var left = cellPosition.x - RESIZE_BAR_THICKNESS / 2,
						top = tablePosition.y,
						height = tableHeight,
						width = RESIZE_BAR_THICKNESS;

					editor.dom.add(getBody(), 'div',
						generateBar(RESIZE_BAR_COL_CLASS, RESIZE_BAR_COL_CURSOR_STYLE,
							left, top, height, width, RESIZE_BAR_COL_DATA_ATTRIBUTE, cellPosition.index));
				});
			}

			// Get a matrix of the cells in each row and the rows in the table.
			function getTableDetails(table) {
				return Tools.map(table.rows, function(row) {

					var cells = Tools.map(row.cells, function(cell) {

						var rowspan = cell.hasAttribute('rowspan') ? parseInt(cell.getAttribute('rowspan'), 10) : 1;
						var colspan = cell.hasAttribute('colspan') ? parseInt(cell.getAttribute('colspan'), 10) : 1;

						return {
							element: cell,
							rowspan: rowspan,
							colspan: colspan
						};
					});

					return {
						element: row,
						cells: cells
					};

				});

			}

			// Get a grid model of the table.
			function getTableGrid(tableDetails) {
				function key(rowIndex, colIndex) {
					return rowIndex + ',' + colIndex;
				}

				function getAt(rowIndex, colIndex) {
					return access[key(rowIndex, colIndex)];
				}

				function getAllCells() {
					var allCells = [];
					Tools.each(rows, function(row) {
						allCells = allCells.concat(row.cells);
					});
					return allCells;
				}

				function getAllRows() {
					return rows;
				}

				var access = {};
				var rows = [];

				var maxRows = 0;
				var maxCols = 0;

				Tools.each(tableDetails, function(row, rowIndex) {
					var currentRow = [];

					Tools.each(row.cells, function(cell) {

						var start = 0;

						while (access[key(rowIndex, start)] !== undefined) {
							start++;
						}

						var current = {
							element: cell.element,
							colspan: cell.colspan,
							rowspan: cell.rowspan,
							rowIndex: rowIndex,
							colIndex: start
						};

						for (var i = 0; i < cell.colspan; i++) {
							for (var j = 0; j < cell.rowspan; j++) {
								var cr = rowIndex + j;
								var cc = start + i;
								access[key(cr, cc)] = current;
								maxRows = Math.max(maxRows, cr + 1);
								maxCols = Math.max(maxCols, cc + 1);
							}
						}

						currentRow.push(current);
					});

					rows.push({
						element: row.element,
						cells: currentRow
					});
				});

				return {
					grid: {
						maxRows: maxRows,
						maxCols: maxCols
					},
					getAt: getAt,
					getAllCells: getAllCells,
					getAllRows: getAllRows
				};
			}

			function range(start, end) {
				var r = [];

				for (var i = start; i < end; i++) {
					r.push(i);
				}

				return r;
			}

			// Attempt to get a representative single block for this column.
			// If we can't find a single block, all blocks in this row/column are spanned
			// and we'll need to fallback to getting the first cell in the row/column.
			function decide(getBlock, isSingle, getFallback) {
				var inBlock = getBlock();
				var singleInBlock;

				for (var i = 0; i < inBlock.length; i++) {
					if (isSingle(inBlock[i])) {
						singleInBlock = inBlock[i];
					}
				}
				return singleInBlock ? singleInBlock : getFallback();
			}

			// Attempt to get representative blocks for the width of each column.
			function getColumnBlocks(tableGrid) {
				var cols = range(0, tableGrid.grid.maxCols);
				var rows = range(0, tableGrid.grid.maxRows);

				return Tools.map(cols, function(col) {
					function getBlock() {
						var details = [];
						for (var i = 0; i < rows.length; i++) {
							var detail = tableGrid.getAt(i, col);
							if (detail && detail.colIndex === col) {
								details.push(detail);
							}
						}

						return details;
					}

					function isSingle(detail) {
						return detail.colspan === 1;
					}

					function getFallback() {
						var item;

						for (var i = 0; i < rows.length; i++) {
							item = tableGrid.getAt(i, col);
							if (item) {
								return item;
							}
						}

						return null;
					}

					return decide(getBlock, isSingle, getFallback);
				});
			}

			// Attempt to get representative blocks for the height of each row.
			function getRowBlocks(tableGrid) {
				var cols = range(0, tableGrid.grid.maxCols);
				var rows = range(0, tableGrid.grid.maxRows);

				return Tools.map(rows, function(row) {
					function getBlock() {
						var details = [];
						for (var i = 0; i < cols.length; i++) {
							var detail = tableGrid.getAt(row, i);
							if (detail && detail.rowIndex === row) {
								details.push(detail);
							}
						}
						return details;
					}

					function isSingle(detail) {
						return detail.rowspan === 1;
					}

					function getFallback() {
						return tableGrid.getAt(row, 0);
					}

					return decide(getBlock, isSingle, getFallback);
				});
			}

			// Draw resize bars over the left/right (ltr/rtl) or top side locations of the cells to measure.
			// This is the location of the borders we need to draw over.
			function drawBars(table) {
				var tableDetails = getTableDetails(table);
				var tableGrid = getTableGrid(tableDetails);
				var rows = getRowBlocks(tableGrid);
				var cols = getColumnBlocks(tableGrid);

				var tablePosition = editor.dom.getPos(table);
				var rowPositions = rows.length > 0 ? findPositions(getTopEdge, getBottomEdge, rows) : [];
				var colPositions = cols.length > 0 ? findPositions(getInnerEdge, getOuterEdge, cols) : [];

				drawRows(rowPositions, table.offsetWidth, tablePosition);
				drawCols(colPositions, table.offsetHeight, tablePosition);
			}

			// Attempt to deduce the width/height of a column/row that has more than one cell spanned.
			function deduceSize(deducables, index, isPercentageBased, table) {
				if (index < 0 || index >= deducables.length - 1) {
					return "";
				}

				var current = deducables[index];

				if (current) {
					current = {
						value: current,
						delta: 0
					};
				} else {
					var reversedUpToIndex = deducables.slice(0, index).reverse();
					for (var i = 0; i < reversedUpToIndex.length; i++) {
						if (reversedUpToIndex[i]) {
							current = {
								value: reversedUpToIndex[i],
								delta: i + 1
							};
						}
					}
				}

				var next = deducables[index + 1];

				if (next) {
					next = {
						value: next,
						delta: 1
					};
				} else {
					var rest = deducables.slice(index + 1);
					for (var j = 0; j < rest.length; j++) {
						if (rest[j]) {
							next = {
								value: rest[j],
								delta: j + 1
							};
						}
					}
				}

				var extras = next.delta - current.delta;
				var pixelWidth = Math.abs(next.value - current.value) / extras;
				return isPercentageBased ? pixelWidth / getComputedStyleSize(table, 'width') * 100 : pixelWidth;
			}

			function getStyleOrAttrib(element, property) {
				var sizeString = editor.dom.getStyle(element, property);
				if (!sizeString) {
					sizeString = editor.dom.getAttrib(element, property);
				}
				if (!sizeString) {
					sizeString = editor.dom.getStyle(element, property, true);
				}
				return sizeString;
			}

			function getWidth(element, isPercentageBased, table) {
				var widthString = getStyleOrAttrib(element, 'width');

				var widthNumber = parseInt(widthString, 10);

				var getWidthFallback = isPercentageBased ? getPercentageWidthFallback(element, table) : getComputedStyleSize(element, 'width');

				// If this is percentage based table, but this cell isn't percentage based.
				// Or if this is a pixel based table, but this cell isn't pixel based.
				if (isPercentageBased && !isPercentageBasedSize(widthString) ||
				!isPercentageBased && !isPixelBasedSize(widthString)) {
					// set the widthnumber to 0
					widthNumber = 0;
				}

				return !isNaN(widthNumber) && widthNumber > 0 ?
					widthNumber : getWidthFallback;
			}

			// Attempt to get the css width from column representative cells.
			function getWidths(tableGrid, isPercentageBased, table) {

				var cols = getColumnBlocks(tableGrid);

				var backups = Tools.map(cols, function(col) {
					return getInnerEdge(col.colIndex, col.element).x;
				});

				var widths = [];

				for (var i = 0; i < cols.length; i++) {
					var span = cols[i].element.hasAttribute('colspan') ? parseInt(cols[i].element.getAttribute('colspan'), 10) : 1;
					// Deduce if the column has colspan of more than 1
					var width = span > 1 ? deduceSize(backups, i) : getWidth(cols[i].element, isPercentageBased, table);
					// If everything's failed and we still don't have a width
					width = width ? width : RESIZE_MINIMUM_WIDTH;
					widths.push(width);
				}

				return widths;
			}

			// Attempt to get the pixel height from a cell.
			function getPixelHeight(element) {

				var heightString = getStyleOrAttrib(element, 'height');

				var heightNumber = parseInt(heightString, 10);

				if (isPercentageBasedSize(heightString)) {
					heightNumber = 0;
				}

				return !isNaN(heightNumber) && heightNumber > 0 ?
								heightNumber : getComputedStyleSize(element, 'height');
			}

			// Attempt to get the css height from row representative cells.
			function getPixelHeights(tableGrid) {

				var rows = getRowBlocks(tableGrid);

				var backups = Tools.map(rows, function(row) {
					return getTopEdge(row.rowIndex, row.element).y;
				});

				var heights = [];

				for (var i = 0; i < rows.length; i++) {
					var span = rows[i].element.hasAttribute('rowspan') ? parseInt(rows[i].element.getAttribute('rowspan'), 10) : 1;

					var height = span > 1 ? deduceSize(backups, i) : getPixelHeight(rows[i].element);

					height = height ? height : RESIZE_MINIMUM_HEIGHT;
					heights.push(height);
				}

				return heights;
			}

			// Determine how much each column's css width will need to change.
			// Sizes = result = pixels widths OR percentage based widths
			function determineDeltas(sizes, column, step, min, isPercentageBased) {

				var result = sizes.slice(0);

				function generateZeros(array) {
					return Tools.map(array, function() {
						return 0;
					});
				}

				function onOneColumn() {
					var deltas;
					if (isPercentageBased) {
						// If we have one column in a percent based table, that column should be 100% of the width of the table.
						deltas = [100 - result[0]];
					} else {
						var newNext = Math.max(min, result[0] + step);
						deltas = [newNext - result[0]];
					}
					return deltas;
				}

				function onLeftOrMiddle(index, next) {

					var startZeros = generateZeros(result.slice(0, index));
					var endZeros = generateZeros(result.slice(next + 1));
					var deltas;

					if (step >= 0) {
						var newNext = Math.max(min, result[next] - step);
						deltas = startZeros.concat([step, newNext - result[next]]).concat(endZeros);
					} else {
						var newThis = Math.max(min, result[index] + step);
						var diffx = result[index] - newThis;
						deltas = startZeros.concat([newThis - result[index], diffx]).concat(endZeros);
					}

					return deltas;
				}

				function onRight(previous, index) {
					var startZeros = generateZeros(result.slice(0, index));
					var deltas;

					if (step >= 0) {
						deltas = startZeros.concat([step]);
					} else {
						var size = Math.max(min, result[index] + step);
						deltas = startZeros.concat([size - result[index]]);
					}

					return deltas;

				}

				var deltas;

				if (sizes.length === 0) { // No Columns
					deltas = [];
				} else if (sizes.length === 1) { // One Column
					deltas = onOneColumn();
				} else if (column === 0) { // Left Column
					deltas = onLeftOrMiddle(0, 1);
				} else if (column > 0 && column < sizes.length - 1) { // Middle Column
					deltas = onLeftOrMiddle(column, column + 1);
				} else if (column === sizes.length - 1) { // Right Column
					deltas = onRight(column - 1, column);
				} else {
					deltas = [];
				}

				return deltas;
			}

			function total(start, end, measures) {
				var r = 0;
				for (var i = start; i < end; i++) {
					r += measures[i];
				}
				return r;
			}

			// Combine cell's css widths to determine widths of colspan'd cells.
			function recalculateWidths(tableGrid, widths) {
				var allCells = tableGrid.getAllCells();
				return Tools.map(allCells, function(cell) {
					var width = total(cell.colIndex, cell.colIndex + cell.colspan, widths);
					return {
						element: cell.element,
						width: width,
						colspan: cell.colspan
					};
				});
			}

			// Combine cell's css heights to determine heights of rowspan'd cells.
			function recalculateCellHeights(tableGrid, heights) {
				var allCells = tableGrid.getAllCells();
				return Tools.map(allCells, function(cell) {
					var height = total(cell.rowIndex, cell.rowIndex + cell.rowspan, heights);
					return {
						element: cell.element,
						height: height,
						rowspan: cell.rowspan
					};
				});
			}

			// Calculate row heights.
			function recalculateRowHeights(tableGrid, heights) {
				var allRows = tableGrid.getAllRows();
				return Tools.map(allRows, function(row, i) {
					return {
						element: row.element,
						height: heights[i]
					};
				});
			}

			function isPercentageBasedSize(size) {
				return percentageBasedSizeRegex.test(size);
			}

			function isPixelBasedSize(size) {
				return pixelBasedSizeRegex.test(size);
			}

			// Adjust the width of the column of table at index, with delta.
			function adjustWidth(table, delta, index) {
				var tableDetails = getTableDetails(table);
				var tableGrid = getTableGrid(tableDetails);

				function setSizes(newSizes, styleExtension) {
					Tools.each(newSizes, function(cell) {
						editor.dom.setStyle(cell.element, 'width', cell.width + styleExtension);
						editor.dom.setAttrib(cell.element, 'width', null);
					});
				}

				function getNewTablePercentWidth() {
					return index < tableGrid.grid.maxCols - 1 ? getCurrentTablePercentWidth(table) :
						getCurrentTablePercentWidth(table) + getTablePercentDelta(table, delta);
				}

				function getNewTablePixelWidth() {
					return index < tableGrid.grid.maxCols - 1 ? getComputedStyleSize(table, 'width') :
						getComputedStyleSize(table, 'width') + delta;
				}

				function setTableSize(newTableWidth, styleExtension, isPercentBased) {
					if (index == tableGrid.grid.maxCols - 1 || !isPercentBased) {
						editor.dom.setStyle(table, 'width', newTableWidth + styleExtension);
						editor.dom.setAttrib(table, 'width', null);
					}
				}

				var percentageBased = isPercentageBasedSize(table.width) ||
					isPercentageBasedSize(table.style.width);

				var widths = getWidths(tableGrid, percentageBased, table);

				var step = percentageBased ? getCellPercentDelta(table, delta) : delta;
				// TODO: change the min for percentage maybe?
				var deltas = determineDeltas(widths, index, step, RESIZE_MINIMUM_WIDTH, percentageBased, table);
				var newWidths = [];

				for (var i = 0; i < deltas.length; i++) {
					newWidths.push(deltas[i] + widths[i]);
				}

				var newSizes = recalculateWidths(tableGrid, newWidths);
				var styleExtension = percentageBased ? '%' : 'px';
				var newTableWidth = percentageBased ? getNewTablePercentWidth() :
					getNewTablePixelWidth();

				editor.undoManager.transact(function() {
					setSizes(newSizes, styleExtension);
					setTableSize(newTableWidth, styleExtension, percentageBased);
				});
			}

			// Adjust the height of the row of table at index, with delta.
			function adjustHeight(table, delta, index) {
				var tableDetails = getTableDetails(table);
				var tableGrid = getTableGrid(tableDetails);

				var heights = getPixelHeights(tableGrid);

				var newHeights = [], newTotalHeight = 0;

				for (var i = 0; i < heights.length; i++) {
					newHeights.push(i === index ? delta + heights[i] : heights[i]);
					newTotalHeight += newTotalHeight[i];
				}

				var newCellSizes = recalculateCellHeights(tableGrid, newHeights);
				var newRowSizes = recalculateRowHeights(tableGrid, newHeights);

				editor.undoManager.transact(function() {

					Tools.each(newRowSizes, function(row) {
						editor.dom.setStyle(row.element, 'height', row.height + 'px');
						editor.dom.setAttrib(row.element, 'height', null);
					});

					Tools.each(newCellSizes, function(cell) {
						editor.dom.setStyle(cell.element, 'height', cell.height + 'px');
						editor.dom.setAttrib(cell.element, 'height', null);
					});

					editor.dom.setStyle(table, 'height', newTotalHeight + 'px');
					editor.dom.setAttrib(table, 'height', null);
				});
			}

			function scheduleDelayedDropEvent() {
				delayDrop = setTimeout(function() {
					drop();
				}, 200);
			}

			function cancelDelayedDropEvent() {
				clearTimeout(delayDrop);
			}

			function getBlockerElement() {
				var blocker = document.createElement('div');

				blocker.setAttribute('style', 'margin: 0; ' +
							'padding: 0; ' +
							'position: fixed; ' +
							'left: 0px; ' +
							'top: 0px; ' +
							'height: 100%; ' +
							'width: 100%;');
				blocker.setAttribute('data-mce-bogus', 'all');

				return blocker;
			}

			function bindBlockerEvents(blocker, dragHandler) {
				editor.dom.bind(blocker, 'mouseup', function() {
					drop();
				});

				editor.dom.bind(blocker, 'mousemove', function(e) {
					cancelDelayedDropEvent();

					if (dragging) {
						dragHandler(e);
					}
				});

				editor.dom.bind(blocker, 'mouseout', function() {
					scheduleDelayedDropEvent();
				});

			}

			function drop() {
				editor.dom.remove(blockerElement);

				if (dragging) {
					editor.dom.removeClass(dragBar, RESIZE_BAR_DRAGGING_CLASS);
					dragging = false;

					var index, delta;

					if (isCol(dragBar)) {
						var initialLeft = parseInt(editor.dom.getAttrib(dragBar, RESIZE_BAR_COL_DATA_INITIAL_LEFT_ATTRIBUTE), 10);
						var newLeft = editor.dom.getPos(dragBar).x;
						index = parseInt(editor.dom.getAttrib(dragBar, RESIZE_BAR_COL_DATA_ATTRIBUTE), 10);
						delta = isRtl() ? initialLeft - newLeft : newLeft - initialLeft;
						adjustWidth(hoverTable, delta, index);
					} else if (isRow(dragBar)) {
						var initialTop = parseInt(editor.dom.getAttrib(dragBar, RESIZE_BAR_ROW_DATA_INITIAL_TOP_ATTRIBUTE), 10);
						var newTop = editor.dom.getPos(dragBar).y;
						index = parseInt(editor.dom.getAttrib(dragBar, RESIZE_BAR_ROW_DATA_ATTRIBUTE), 10);
						delta = newTop - initialTop;
						adjustHeight(hoverTable, delta, index);
					}
					refreshBars(hoverTable);
					editor.nodeChanged();
				}
			}

			function setupBaseDrag(bar, dragHandler) {
				blockerElement = blockerElement ? blockerElement : getBlockerElement();
				dragging = true;
				editor.dom.addClass(bar, RESIZE_BAR_DRAGGING_CLASS);
				dragBar = bar;
				bindBlockerEvents(blockerElement, dragHandler);
				editor.dom.add(getBody(), blockerElement);
			}

			function isCol(target) {
				return editor.dom.hasClass(target, RESIZE_BAR_COL_CLASS);
			}

			function isRow(target) {
				return editor.dom.hasClass(target, RESIZE_BAR_ROW_CLASS);
			}

			function colDragHandler(event) {
				lastX = lastX !== undefined ? lastX : event.clientX; // we need a firstX
				var deltaX = event.clientX - lastX;
				lastX = event.clientX;
				var oldLeft = editor.dom.getPos(dragBar).x;
				editor.dom.setStyle(dragBar, 'left', oldLeft + deltaX + 'px');
			}

			function rowDragHandler(event) {
				lastY = lastY !== undefined ? lastY : event.clientY;
				var deltaY = event.clientY - lastY;
				lastY = event.clientY;
				var oldTop = editor.dom.getPos(dragBar).y;
				editor.dom.setStyle(dragBar, 'top', oldTop + deltaY + 'px');
			}

			function setupColDrag(bar) {
				lastX = undefined;
				setupBaseDrag(bar, colDragHandler);
			}

			function setupRowDrag(bar) {
				lastY = undefined;
				setupBaseDrag(bar, rowDragHandler);
			}

			function mouseDownHandler(e) {
				var target = e.target, body = editor.getBody();

				// Since this code is working on global events we need to work on a global hoverTable state
				// and make sure that the state is correct according to the events fired
				if (!editor.$.contains(body, hoverTable) && hoverTable !== body) {
					return;
				}

				if (isCol(target)) {
					e.preventDefault();
					var initialLeft = editor.dom.getPos(target).x;
					editor.dom.setAttrib(target, RESIZE_BAR_COL_DATA_INITIAL_LEFT_ATTRIBUTE, initialLeft);
					setupColDrag(target);
				} else if (isRow(target)) {
					e.preventDefault();
					var initialTop = editor.dom.getPos(target).y;
					editor.dom.setAttrib(target, RESIZE_BAR_ROW_DATA_INITIAL_TOP_ATTRIBUTE, initialTop);
					setupRowDrag(target);
				} else {
					clearBars();
				}
			}

			editor.on('init', function() {
				// Needs to be like this for inline mode, editor.on does not bind to elements in the document body otherwise
				editor.dom.bind(getBody(), 'mousedown', mouseDownHandler);
			});

			// If we're updating the table width via the old mechanic, we need to update the constituent cells' widths/heights too.
			editor.on('ObjectResized', function(e) {
				var table = e.target;
				if (table.nodeName === 'TABLE') {
					var newCellSizes = [];
					Tools.each(table.rows, function(row) {
						Tools.each(row.cells, function(cell) {
							var width = editor.dom.getStyle(cell, 'width', true);
							newCellSizes.push({
								cell: cell,
								width: width
							});
						});
					});
					Tools.each(newCellSizes, function(newCellSize) {
						editor.dom.setStyle(newCellSize.cell, 'width', newCellSize.width);
						editor.dom.setAttrib(newCellSize.cell, 'width', null);
					});
				}
			});

			editor.on('mouseover', function(e) {
				if (!dragging) {
					var tableElement = editor.dom.getParent(e.target, 'table');

					if (e.target.nodeName === 'TABLE' || tableElement) {
						hoverTable = tableElement;
						refreshBars(tableElement);
					}
				}
			});

			// Prevents the user from moving the caret inside the resize bars on Chrome
			// Only does it on arrow keys since clearBars might be an epxensive operation
			// since it's querying the DOM
			editor.on('keydown', function(e) {
				switch (e.keyCode) {
					case VK.LEFT:
					case VK.RIGHT:
					case VK.UP:
					case VK.DOWN:
						clearBars();
						break;
				}
			});

			editor.on('remove', function() {
				clearBars();
				editor.dom.unbind(getBody(), 'mousedown', mouseDownHandler);
			});

			return {
				adjustWidth: adjustWidth,
				adjustHeight: adjustHeight,
				clearBars: clearBars,
				drawBars: drawBars,
				determineDeltas: determineDeltas,
				getTableGrid: getTableGrid,
				getTableDetails: getTableDetails,
				getWidths: getWidths,
				getPixelHeights: getPixelHeights,
				isPercentageBasedSize: isPercentageBasedSize,
				isPixelBasedSize: isPixelBasedSize,
				recalculateWidths: recalculateWidths,
				recalculateCellHeights: recalculateCellHeights,
				recalculateRowHeights: recalculateRowHeights
			};
		};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 38 */
/*!****************************************!*\
  !*** external "tinymce.PluginManager" ***!
  \****************************************/
/***/ function(module, exports) {

	module.exports = tinymce.PluginManager;

/***/ }
/******/ ]);