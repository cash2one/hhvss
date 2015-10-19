
if (!window.AW) {
	var AW = function (a, b) {
		return AW.dispatch(a, b);
	};
	AW.version = 202;
	AW.toString = function () {
		return "ActiveWidgets 2.0.2";
	};
}
if (!AW.System) {
	AW.System = {};
}
if (!AW.HTML) {
	AW.HTML = {};
}
if (!AW.Templates) {
	AW.Templates = {};
}
if (!AW.Scroll) {
	AW.Scroll = {};
}
if (!AW.Panels) {
	AW.Panels = {};
}
if (!AW.Formats) {
	AW.Formats = {};
}
if (!AW.HTTP) {
	AW.HTTP = {};
}
if (!AW.CSV) {
	AW.CSV = {};
}
if (!AW.XML) {
	AW.XML = {};
}
if (!AW.UI) {
	AW.UI = {};
}
if (!AW.Grid) {
	AW.Grid = {};
}
if (!AW.Tree) {
	AW.Tree = {};
}
if (!AW.UI.Controllers) {
	AW.UI.Controllers = {};
}
if (!AW.Grid.Controllers) {
	AW.Grid.Controllers = {};
}
(function () {
	AW.all = {id:0};
	AW.docs = [document];
	AW.log = function (level, arg) {
		try {
			var i, s = "";
			for (i = 0; i < arg.length; i++) {
				s += arg[i] + " ";
			}
			window.status = s;
		}
		catch (error) {
			window.status = error.message;
		}
	};
	AW.debug = function () {
		AW.log("debug", arguments);
	};
	AW.info = function () {
		AW.log("info", arguments);
	};
	AW.warn = function () {
		AW.log("warn", arguments);
	};
	AW.error = function () {
		AW.log("error", arguments);
	};
	AW.fatal = function () {
		AW.log("fatal", arguments);
	};
	AW.forEach = function (array, handler) {
		var i, custom = {};
		for (i in array) {
			if (!custom[i]) {
				handler(i, array[i]);
			}
		}
	};
	AW.element = function (id) {
		var i, e, docs = AW.docs;
		for (i = 0; i < docs.length; i++) {
			e = docs[i].getElementById(id);
			if (e) {
				return e;
			}
		}
	};
	AW.object = function (id) {
		var parts = id.split("-");
		var tag = parts[0];
		var obj = AW.all[tag];
		var target = obj;
		for (var i = 1; i < parts.length; i++) {
			if (obj["_" + parts[i] + "Content"]) {
				for (var j = i; j < parts.length; j++) {
					target = target.getContent(parts[j]);
				}
				break;
			} else {
				if (parts[i + 1] && parts[i + 1].match(/^(\d+)$/)) {
					if (parts[i + 2] && parts[i + 2].match(/^(\d+)$/)) {
						if (parts[i + 3] && parts[i + 3].match(/^(\d+)$/)) {
							obj = obj.getTemplate(parts[i], parts[i + 1], parts[i + 2], parts[i + 3]);
							i += 3;
						} else {
							obj = obj.getTemplate(parts[i], parts[i + 1], parts[i + 2]);
							i += 2;
						}
					} else {
						obj = obj.getTemplate(parts[i], parts[i + 1]);
						i += 1;
					}
				} else {
					obj = obj.getTemplate(parts[i]);
				}
			}
			target = obj;
		}
		return target;
	};
	var events = {"DOMFocusIn":"focus"};
	AW.dispatch = function (element, event) {
		var type = "_on" + (events[event.type] || event.type) + "Event";
		var target = AW.object(element.id);
		var obj = target;
		while (obj._parent) {
			obj = obj._parent;
		}
		return target[type].call(obj, event);
	};
	AW.paint = function (element) {
		if (element.$paint || !element.offsetWidth) {
			return "inherit";
		}
		element.$paint = true;
		var obj = AW.object(element.id);
		while (obj && obj._parent) {
			obj = obj._parent;
		}
		if (obj && obj.raiseEvent) {
			obj.raiseEvent("paint");
		}
		window.setTimeout(function () {
			element.style.removeExpression("visibility");
			element = null;
		}, 0);
		return "inherit";
	};
	AW.camelCase = function () {
		var i, s = arguments[0];
		for (i = 1; i < arguments.length; i++) {
			s += arguments[i].substr(0, 1).toUpperCase() + arguments[i].substr(1);
		}
		return s;
	};
	AW.textPattern = /(\"|&|<|>)/gm;
	AW.textTable = {"\"":"&quot;", "&":"&amp;", "<":"&lt;", ">":"&gt;"};
	AW.textReplace = function (c) {
		return AW.textTable[c] || "";
	};
	AW.htmlPattern = /(&quot;|&amp;|&lt;|&gt;|<[^<>]*>)/gm;
	AW.htmlTable = {"&quot;":"\"", "&amp;":"&", "&lt;":"<", "&gt;":">"};
	AW.htmlReplace = function (e) {
		return AW.htmlTable[e] || "";
	};
	AW.valueToText = function (v) {
		return v ? String(v).replace(AW.textPattern, AW.textReplace) : "";
	};
	AW.textToValue = function (t) {
		return t ? String(t).replace(AW.htmlPattern, AW.htmlReplace) : "";
	};
})();
(function () {
	AW.browser = "";
	if (document.recalc) {
		AW.browser = "ie";
	} else {
		if (window.__defineGetter__) {
			AW.browser = "gecko";
		} else {
			if (window.opera) {
				AW.browser = "opera";
			} else {
				if (navigator.userAgent.match("Safari")) {
					AW.browser = "safari";
				}
			}
		}
	}
	if (AW.browser) {
		AW[AW.browser] = true;
	}
	AW.os = "";
	if (!navigator.userAgent.match("Windows")) {
		AW.unix = true;
	}
	if (navigator.userAgent.match("Mac OS")) {
		AW.os = "mac";
	}
	if (navigator.userAgent.match("Linux")) {
		AW.os = "linux";
	}
	AW.strict = (document.compatMode && document.compatMode.match("CSS")) || AW.browser == "safari";
	var htmlc = " aw-all";
	if (AW.strict) {
		htmlc += " aw-strict";
	}
	if (AW.browser) {
		htmlc += " aw-" + AW.browser;
	}
	if (AW.unix) {
		htmlc += " aw-unix";
	}
	if (AW.os) {
		htmlc += " aw-" + AW.os;
	}
	if (AW.ie) {
		if (typeof (window.XMLHttpRequest) == "object") {
			AW.ie7 = true;
			htmlc += " aw-ie7";
		} else {
			AW.ie6 = true;
			htmlc += " aw-ie6";
		}
	}
	if (AW.gecko) {
		if (typeof (document.inputEncoding) == "string") {
			AW.ff15 = true;
			htmlc += " aw-ff15";
		} else {
			AW.ff1 = true;
			htmlc += " aw-ff1";
		}
	}
	AW._htmlClasses = htmlc;
	if (AW.strict) {
		AW.dx = 8;
		AW.dy = 4;
	} else {
		AW.dx = 0;
		AW.dy = 0;
	}
})();
(function () {
	if (AW.ie) {
		try {
			document.execCommand("BackgroundImageCache", false, true);
		}
		catch (err) {
		}
		AW.attachEvent = function (element, name, handler) {
			return element.attachEvent(name, handler);
		};
		AW.detachEvent = function (element, name, handler) {
			return element.detachEvent(name, handler);
		};
		AW.srcElement = function (event) {
			if (event) {
				return event.srcElement;
			}
		};
		AW.toElement = function (event) {
			if (event) {
				return event.toElement;
			}
		};
		AW.setReturnValue = function (event, value) {
			if (event) {
				event.returnValue = value;
			}
		};
		AW.setCapture = function (element) {
			return element.setCapture();
		};
		AW.releaseCapture = function (element) {
			return element.releaseCapture();
		};
		AW.addRule = function (stylesheet, selector, rule) {
			return stylesheet.addRule(selector, rule);
		};
		AW.getRules = function (stylesheet) {
			return stylesheet.rules;
		};
		AW.setOuterHTML = function (element, html) {
			element.outerHTML = html;
		};
		AW.createXMLHttpRequest = function () {
			try {
				return new ActiveXObject("MSXML2.XMLHTTP");
			}
			catch (err) {
			}
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (err) {
			}
			try {
				return new XMLHttpRequest;
			}
			catch (err) {
			}
		};
		AW.getLeft = function (element) {
			return element.getBoundingClientRect().left;
		};
		AW.getTop = function (element) {
			return element.getBoundingClientRect().top;
		};
	}
})();
(function () {
	if (AW.gecko) {
		var capture;
		AW.attachEvent = function (target, name, handler) {
			if (capture) {
				handler[name] = function (event) {
					return handler.call(target, event);
				};
				window.addEventListener(name.replace(/^on/, ""), handler[name], true);
			} else {
				target.addEventListener(name.replace(/^on/, ""), handler, false);
			}
		};
		AW.detachEvent = function (target, name, handler) {
			if (capture) {
				window.removeEventListener(name.replace(/^on/, ""), handler[name], true);
				handler[name] = null;
			} else {
				target.removeEventListener(name.replace(/^on/, ""), handler, false);
			}
		};
		AW.srcElement = function (event) {
			try {
				return (event.target && event.target.nodeType == 3) ? event.target.parentNode : event.target;
			}
			catch (e) {
				return event.target;
			}
		};
		AW.toElement = function (event) {
			try {
				return (event.relatedTarget && event.relatedTarget.nodeType == 3) ? event.relatedTarget.parentNode : event.relatedTarget;
			}
			catch (e) {
				return event.relatedTarget;
			}
		};
		AW.setReturnValue = function (event, value) {
			if (event && event.preventDefault && !value) {
				event.preventDefault();
			}
		};
		AW.setCapture = function (element) {
			capture = element;
		};
		AW.releaseCapture = function (element) {
			capture = null;
		};
		AW.addRule = function (stylesheet, selector, rule) {
			var i = stylesheet.cssRules.length;
			stylesheet.insertRule(selector + "{" + rule + "}", i);
			stylesheet.cssRules[i].style.cssText = rule;
		};
		AW.getRules = function (stylesheet) {
			return stylesheet.cssRules;
		};
		AW.setOuterHTML = function (element, html) {
			var range = element.ownerDocument.createRange();
			range.setStartBefore(element);
			var fragment = range.createContextualFragment(html);
			element.parentNode.replaceChild(fragment, element);
		};
		AW.createXMLHttpRequest = function () {
			return new XMLHttpRequest;
		};
		AW.getLeft = function (element) {
			var doc = document.getBoxObjectFor(document.body);
			return document.getBoxObjectFor(element).screenX - doc.screenX + doc.x;
		};
		AW.getTop = function (element) {
			var doc = document.getBoxObjectFor(document.body);
			return document.getBoxObjectFor(element).screenY - doc.screenY + doc.y;
		};
	}
})();
AW.System.Object = function () {
};
AW.System.Object.subclass = function () {
	var create = function (cls) {
		cls.created = true;
		if (cls.superclass && !cls.superclass.created) {
			create(cls.superclass);
		}
		cls.create();
	};
	var constructor = function (a, b, c) {
		if (constructor.defer) {
			return;
		}
		if (!constructor.created) {
			create(constructor);
		}
		if (this.init) {
			this.init(a, b, c);
		}
	};
	for (var i in this) {
		constructor[i] = this[i];
	}
	this.defer = true;
	constructor.prototype = new this();
	this.defer = false;
	constructor.prototype.constructor = constructor;
	constructor.superclass = this;
	constructor.created = false;
	return constructor;
};
AW.System.Object.handle = function (error) {
	throw (error);
};
AW.System.Object.create = function () {
	var obj = this.prototype;
	obj.clone = function () {
		if (this._clone.prototype !== this) {
			this._clone = function () {
				this.init();
			};
			this._clone.prototype = this;
		}
		return new this._clone();
	};
	obj._clone = function () {
	};
	obj.init = function () {
	};
	obj.handle = function (error) {
		throw (error);
	};
	obj.setTimeout = function (handler, delay) {
		var self = this;
		var wrapper = function () {
			handler.call(self);
		};
		return window.setTimeout(wrapper, delay ? delay : 0);
	};
	obj.timeout = obj.setTimeout;
	obj.toString = function () {
		return "";
	};
};
AW.System.Object.create();
AW.System.Model = AW.System.Object.subclass();
AW.System.Model.create = function () {
	var obj = this.prototype;
	var join = function () {
		var i, s = arguments[0];
		for (i = 1; i < arguments.length; i++) {
			s += arguments[i].substr(0, 1).toUpperCase() + arguments[i].substr(1);
		}
		return s;
	};
	obj.defineProperty = function (name, value) {
		var _getProperty = join("get", name);
		var _setProperty = join("set", name);
		var _property = "_" + name;
		var getProperty = function () {
			return this[_property];
		};
		this[_setProperty] = function (value) {
			if (typeof value == "function") {
				this[_getProperty] = value;
			} else {
				this[_getProperty] = getProperty;
				this[_property] = value;
			}
		};
		this[_setProperty](value);
	};
	var get = {};
	var set = {};
	obj.getProperty = function (name, a, b, c) {
		if (!get[name]) {
			get[name] = join("get", name);
		}
		return this[get[name]](a, b, c);
	};
	obj.setProperty = function (name, value, a, b, c) {
		if (!set[name]) {
			set[name] = join("set", name);
		}
		return this[set[name]](value, a, b, c);
	};
	obj.isReady = function () {
		return true;
	};
};
AW.System.Format = AW.System.Object.subclass();
AW.System.Format.create = function () {
	var obj = this.prototype;
	obj.valueToText = function (value) {
		return value;
	};
	obj.dataToValue = function (data) {
		return data;
	};
	obj.dataToText = function (data) {
		var value = this.dataToValue(data);
		return this.valueToText(value);
	};
	obj.setErrorText = function (text) {
		this._textError = text;
	};
	obj.setErrorValue = function (value) {
		this._valueError = value;
	};
	obj.setErrorText("#ERR");
	obj.setErrorValue(NaN);
	obj.textToValue = function (text) {
		return text;
	};
	obj.textToData = function (text) {
		return text;
	};
	obj.valueToData = function (value) {
		return value;
	};
	obj.comparator = function (values, greater, less, equal, error) {
		return function (i, j) {
			try {
				var a = values[i];
				var b = values[j];
				if (a > b) {
					return greater;
				}
				if (a < b) {
					return less;
				}
				return equal(i, j);
			}
			catch (e) {
				return error(i, j, e);
			}
		};
	};
};
AW.System.HTML = AW.System.Object.subclass();
AW.System.HTML.create = function () {
	var obj = this.prototype;
	obj.setTag = function (tag) {
		this._tag = tag;
		this._outerHTML = "";
	};
	obj.getTag = function () {
		return this._tag;
	};
	obj._tag = "span";
	obj.init = function () {
		if (this.$owner) {
			return;
		}
		if (this._parent) {
			return;
		}
		this._id = "aw" + AW.all.id++;
		AW.all[this._id] = this;
	};
	obj.getId = function () {
		return this._id;
	};
	obj._id = "";
	obj.setId = function (id) {
		this._id = id;
		AW.all[this._id] = this;
	};
	obj.element = function () {
		var i, docs = AW.docs, id = this.getId(), e;
		for (i = 0; i < docs.length; i++) {
			e = docs[i].getElementById(id);
			if (e) {
				return e;
			}
		}
	};
	obj.getClass = function (name) {
		var param = "_" + name + "Class";
		var value = this[param];
		return typeof (value) == "function" ? value.call(this) : value;
	};
	obj.setClass = function (name, value) {
		var element = this.element();
		if (element) {
			var v = (typeof (value) == "function") ? value.call(this) : value;
			var s = v || v === 0 || v === false ? " aw-" + name + "-" + v + " " : " ";
			element.className = element.className.replace(new RegExp("(aw-" + name + "-\\w* *| *$)", "g"), "") + s;
		}
		var param = "_" + name + "Class";
		if (this[param] == null) {
			this._classes += " " + name;
		}
		this[param] = value;
		resetHTMLCache(this);
	};
	function resetHTMLCache(obj) {
		obj._outerHTML = "";
		while (obj._parent) {
			obj = obj._parent;
			obj._innerHTML = "";
			obj._outerHTML = "";
		}
		if (obj.lock) {
			obj.lock();
		}
	}
	obj.refreshClasses = function () {
		var element = this.element();
		if (!element) {
			return;
		}
		var s = "", classes = this._classes.split(" ");
		for (var i = 1; i < classes.length; i++) {
			var name = classes[i];
			var value = this["_" + name + "Class"];
			if (typeof (value) == "function") {
				value = value.call(this);
			}
			if (value || value === 0 || value === false) {
				s += "aw-" + name + "-" + value + " ";
			}
		}
		element.className = s;
	};
	obj._classes = "";
	obj.getStyle = function (name) {
		var param = "_" + name + "Style";
		var value = this[param];
		return typeof (value) == "function" ? value.call(this) : value;
	};
	obj.setStyle = function (name, value) {
		var element = this.element();
		if (element) {
			if (!styleNames[name]) {
				styleNames[name] = AW.camelCase.apply(AW, name.split("-"));
			}
			var v = (typeof (value) == "function") ? value.call(this) : value;
			element.style[styleNames[name]] = v;
		}
		var param = "_" + name + "Style";
		if (this[param] == null) {
			this._styles += " " + name;
		}
		this[param] = value;
		resetHTMLCache(this);
	};
	obj._styles = "";
	var styleNames = {};
	obj.getAttribute = function (name) {
		try {
			var param = "_" + name + "Attribute";
			var value = this[param];
			return typeof (value) == "function" ? value.call(this) : value;
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj.setAttribute = function (name, value) {
		try {
			var element = this.element();
			if (element) {
				var v = (typeof (value) == "function") ? value.call(this) : value;
				element[name] = v;
			}
			var param = "_" + name + "Attribute";
			if (typeof this[param] == "undefined") {
				this._attributes += " " + name;
			}
			if (specialAttributes[name] && (typeof value == "function")) {
				this[param] = function () {
					return value.call(this) ? true : null;
				};
			} else {
				this[param] = value;
			}
			resetHTMLCache(this);
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj._attributes = "";
	var specialAttributes = {checked:true, disabled:true, hidefocus:true, readonly:true};
	obj.getEvent = function (name) {
		try {
			var param = "_" + name + "Event";
			var value = this[param];
			return value;
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj.setEvent = function (name, value) {
		try {
			var param = "_" + name + "Event";
			if (this[param] == null) {
				this._events += " " + name;
			}
			this[param] = value;
			resetHTMLCache(this);
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj._events = "";
	obj.getContent = function (name) {
		try {
			var split = name.match(/^(\w+)\W(.+)$/);
			if (split) {
				var ref = this.getContent(split[1]);
				return ref.getContent(split[2]);
			} else {
				var param = "_" + name + "Content";
				var value = this[param];
				if ((typeof value == "object") && (value._parent != this)) {
					value = value.clone();
					value._parent = this;
					this[param] = value;
				}
				if (value && typeof value == "object" && !value.defineModel) {
					value._id = this._id + "-" + name;
				}
				return value;
			}
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj.setContent = function (name, value) {
		try {
			if (arguments.length == 1) {
				this._content = "";
				if (typeof name == "object") {
					for (var i in name) {
						if (typeof (i) == "string") {
							this.setContent(i, name[i]);
						}
					}
				} else {
					this.setContent("html", name);
				}
			} else {
				var split = name.match(/^(\w+)\W(.+)$/);
				if (split) {
					var ref = this.getContent(split[1]);
					ref.setContent(split[2], value);
				} else {
					var param = "_" + name + "Content";
					if (this[param] == null) {
						this._content += " " + name;
					}
					if (value && typeof value == "object") {
						value._parent = this;
						if (!value.defineModel) {
							value._id = this._id + "-" + name;
						}
					}
					this[param] = value;
					this._innerHTML = "";
					resetHTMLCache(this);
				}
			}
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj._content = "";
	var getParamStr = function (i) {
		return "{#" + i + "}";
	};
	var getControlFunc = function (v) {
		return function () {
			return v;
		};
	};
	obj.innerHTML = function () {
		try {
			if (this._innerHTML) {
				return this._innerHTML;
			}
			this._innerParamLength = 0;
			var i, j, name, value, param1, param2, html, item, s = "";
			var content = this._content.split(" ");
			for (i = 1; i < content.length; i++) {
				name = content[i];
				value = this["_" + name + "Content"];
				if (typeof (value) == "function") {
					param = getParamStr(this._innerParamLength++);
					this[param] = value;
					s += param;
				} else {
					if (typeof (value) == "object" && value.defineModel) {
						param = getParamStr(this._innerParamLength++);
						this[param] = getControlFunc(value);
						s += param;
					} else {
						if (typeof (value) == "object") {
							item = value;
							html = item.outerHTML().replace(/\{id\}/g, "{id}-" + name);
							for (j = item._outerParamLength - 1; j >= 0; j--) {
								param1 = getParamStr(j);
								param2 = getParamStr(this._innerParamLength + j);
								if (param1 != param2) {
									html = html.replace(param1, param2);
								}
								this[param2] = item[param1];
							}
							this._innerParamLength += item._outerParamLength;
							s += html;
						} else {
							s += value;
						}
					}
				}
			}
			this._innerHTML = s;
			return s;
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj.outerHTML = function () {
		try {
			if (this._outerHTML) {
				return this._outerHTML;
			}
			var innerHTML = this.innerHTML();
			this._outerParamLength = this._innerParamLength;
			if (!this._tag) {
				return innerHTML;
			}
			var i, tmp, name, value, param;
			var html = "<" + this._tag + " id=\"{id}\"";
			tmp = "";
			var classes = this._classes.split(" ");
			for (i = 1; i < classes.length; i++) {
				name = classes[i];
				value = this["_" + name + "Class"];
				if (typeof (value) == "function") {
					param = getParamStr(this._outerParamLength++);
					this[param] = value;
					value = param;
				}
				if (value || value === 0 || value === false) {
					tmp += "aw-" + name + "-" + value + " ";
				}
			}
			if (tmp) {
				html += " class=\"" + tmp + "\"";
			}
			tmp = "";
			var styles = this._styles.split(" ");
			for (i = 1; i < styles.length; i++) {
				name = styles[i];
				value = this["_" + name + "Style"];
				if (typeof (value) == "function") {
					param = getParamStr(this._outerParamLength++);
					this[param] = value;
					value = param;
				}
				tmp += name + ":" + value + ";";
			}
			if (tmp) {
				html += " style=\"" + tmp + "\"";
			}
			tmp = "";
			var attributes = this._attributes.split(" ");
			for (i = 1; i < attributes.length; i++) {
				name = attributes[i];
				value = this["_" + name + "Attribute"];
				if (typeof (value) == "function") {
					param = getParamStr(this._outerParamLength++);
					this[param] = value;
					value = param;
				} else {
					if (specialAttributes[name] && !value) {
						value = null;
					}
				}
				if (value !== null) {
					tmp += " " + name + "=\"" + value + "\"";
				}
			}
			html += tmp;
			tmp = "";
			var events = this._events.split(" ");
			for (i = 1; i < events.length; i++) {
				name = events[i];
				value = this["_" + name + "Event"];
				if (typeof (value) == "function") {
					value = "AW(this,event)";
				}
				tmp += " " + name + "=\"" + value + "\"";
			}
			html += tmp;
			html += ">" + innerHTML + "</" + this._tag + ">";
			this._outerHTML = html;
			return html;
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj.toString = function () {
		try {
			var i, s = this._outerHTML;
			if (!s) {
				s = this.outerHTML();
			}
			s = s.replace(id_pattern, this._id);
			var max = this._outerParamLength;
			if (param_cache.length < max) {
				for (i = param_cache.length; i < max; i++) {
					param_cache[i] = getParamStr(i);
				}
			}
			for (i = 0; i < max; i++) {
				var param = param_cache[i];
				var value = this[param]();
				if (value === null) {
					value = "";
					param = specialParams[i];
					if (!param) {
						param = getSpecialParamStr(i);
					}
				}
				s = s.replace(param, value);
			}
			return s;
		}
		catch (error) {
			this.handle(error);
		}
	};
	var id_pattern = /\{id\}/g;
	var param_cache = [];
	var specialParams = [];
	function getSpecialParamStr(i) {
		return (specialParams[i] = new RegExp("[\\w\\x2D]*=?:?\\x22?\\{#" + i + "\\}[;\\x22]?"));
	}
	obj.refresh = function () {
		try {
			var element = this.element();
			if (element) {
				try {
					var focus = AW.element(AW._focus);
				}
				catch (err) {
				}
				AW.setOuterHTML(element, this.toString());
				try {
					if (focus !== AW.element(AW._focus)) {
						AW.element(AW._focus).focus();
					}
				}
				catch (err) {
				}
			}
		}
		catch (error) {
			this.handle(error);
		}
	};
	obj.setSize = function (width, height) {
		if (typeof (width) != "undefined") {
			this.setStyle("width", width - AW.dx + "px");
		}
		if (typeof (height) != "undefined") {
			this.setStyle("height", height - AW.dy + "px");
		}
	};
	obj.setPosition = function (left, top) {
		this.setStyle("position", "absolute");
		if (typeof (left) != "undefined") {
			this.setStyle("left", left + "px");
		}
		if (typeof (top) != "undefined") {
			this.setStyle("top", top + "px");
		}
	};
	var errors = {101:"non-supported doctype", 102:"non-supported browser", 103:"non-supported browser"};
	function hte(i) {
		return function () {
			return "AW Error:<a href=\"http://www.activewidgets.com/error." + i + "/\">" + errors[i] + "</a>";
		};
	}
	if (AW.safari) {
		obj.toString = hte(102);
	}
	if (AW.opera) {
		obj.toString = hte(103);
	}
};
AW.System.Template = AW.System.HTML.subclass();
AW.System.Template.create = function () {
	var obj = this.prototype;
	obj.lock = function () {
		if (!this.$owner) {
			return;
		}
		this.$owner[AW.camelCase("set", this.$name, "template")](this, this.$0, this.$1, this.$2);
	};
	obj.getTemplate = function (name) {
		var i, args = [], get = AW.camelCase("get", name, "template");
		for (i = 1; i < arguments.length; i++) {
			args[i - 1] = arguments[i];
		}
		return this[get].apply(this, args);
	};
	obj.setTemplate = function (name, template, index) {
		var set = AW.camelCase("set", name, "template");
		this[set](template, index);
	};
	obj.raiseEvent = function (name, source, a, b, c) {
		if (typeof source == "undefined") {
			source = this;
			a = this.$0;
			b = this.$1;
			c = this.$2;
		}
		var handler = this[name];
		if (typeof (handler) == "function") {
			var r = handler.call(this, source, a, b, c);
			if (r) {
				return r;
			}
		}
		if (this.$owner && this.$owner.raiseEvent) {
			return this.$owner.raiseEvent(name, source, a, b, c);
		}
	};
	obj.action = function (name, source, a, b, c) {
		this.raiseEvent(AW.camelCase("on", name), source, a, b, c);
	};
	obj.mapTemplate = function (source, target) {
		var get = AW.camelCase("get", source, "template");
		if (typeof (target) == "function") {
			this[get] = target;
		} else {
			var u, m = AW.camelCase("get", target, "template");
			this[get] = function (a, b, c) {
				if (a === u) {
					return this.$owner[m](this.$0, this.$1, this.$2);
				}
				if (b === u) {
					return this.$owner[m](a, this.$0, this.$1);
				}
				if (c === u) {
					return this.$owner[m](a, b, this.$0);
				}
				return this.$owner[m](a, b, c);
			};
		}
		this.lock();
	};
	obj.mapModel = function (source, target, target2) {
		var get = AW.camelCase("get", source, "property");
		var set = AW.camelCase("set", source, "property");
		if (typeof (target) == "function") {
			this[get] = target;
			if (typeof (target2) == "function") {
				this[set] = target2;
			} else {
				this[set] = function () {
				};
			}
		} else {
			var _get = AW.camelCase("get", target, "property");
			var _set = AW.camelCase("set", target, "property");
			var u;
			this[get] = function (p, a, b, c) {
				if (a === u) {
					return this.$owner[_get](p, this.$0, this.$1, this.$2);
				}
				if (b === u) {
					return this.$owner[_get](p, a, this.$0, this.$1);
				}
				if (c === u) {
					return this.$owner[_get](p, a, b, this.$0);
				}
				return this.$owner[_get](p, a, b, c);
			};
			this[set] = function (p, v, a, b, c) {
				if (a === u) {
					return this.$owner[_set](p, v, this.$0, this.$1, this.$2);
				}
				if (b === u) {
					return this.$owner[_set](p, v, a, this.$0, this.$1);
				}
				if (c === u) {
					return this.$owner[_set](p, v, a, b, this.$0);
				}
				return this.$owner[_set](p, v, a, b, c);
			};
		}
		this.lock();
	};
};
AW.System.Control = AW.System.HTML.subclass();
AW.System.Control.create = function () {
	AW.System.Template.create.call(this);
	var obj = this.prototype;
	var templates = AW.System.Template.prototype;
	obj.setTag("span");
	obj.setClass("system", "control");
	obj.setAttribute("aw", "control");
	obj.setAttribute("tabIndex", "-1");
	obj.setAttribute("hideFocus", "true");
	obj.setEvent("oncontextmenu", "return false");
	obj.setEvent("onselectstart", "return false");
	obj.clear = function () {
	};
	obj.mapTemplate = function () {
	};
	obj.mapModel = function () {
	};
	obj.getModel = function (name) {
		var getModel = AW.camelCase("get", name, "model");
		return this[getModel]();
	};
	obj.setModel = function (name, model) {
		var setModel = AW.camelCase("set", name, "model");
		return this[setModel](model);
	};
	obj.defineModel = function (m, z) {
		var ext = "_" + m + "Model";
		var defineProperty = AW.camelCase("define", m, "property");
		var getProperty = AW.camelCase("get", m, "property");
		var setProperty = AW.camelCase("set", m, "property");
		var getModel = AW.camelCase("get", m, "model");
		var setModel = AW.camelCase("set", m, "model");
		var clearModel = AW.camelCase("clear", m, "model");
		var getInt = {};
		var setInt = {};
		var getExt = {};
		var setExt = {};
		var changing = {};
		var changed = {};
		var error = {};
		var undef;
		this[defineProperty] = function (p, v, arrayValue) {
			var _p = "_" + AW.camelCase(m, p);
			var _p1 = _p + "1";
			var _p2 = _p + "2";
			var _p3 = _p + "3";
			var _x2 = _p + "2x";
			var get = (getInt[p] = AW.camelCase("get", m, p));
			var set = (setInt[p] = AW.camelCase("set", m, p));
			var $get = (getExt[p] = AW.camelCase("get", p));
			var $set = (setExt[p] = AW.camelCase("set", p));
			var _changing = (changing[p] = AW.camelCase("on", m, p, "changing"));
			var _changed = (changed[p] = AW.camelCase("on", m, p, "changed"));
			var _error = (error[p] = AW.camelCase("on", m, p, "error"));
			this[get] = function (a, b, c) {
				if (this[ext] && this[ext][$get]) {
					return this[ext][$get](a, b, c);
				}
				var r;
				if (c !== undef && this[_p3] && this[_p3][c] && this[_p3][c][b] && this[_p3][c][b][a] !== undef) {
					r = this[_p3][c][b][a];
				} else {
					if (b !== undef && (!this[_x2] || !this[_x2][a] || this[_x2][a][b]) && this[_p2] && this[_p2][b] && this[_p2][b][a] !== undef) {
						r = this[_p2][b][a];
					} else {
						if (a !== undef && this[_p1] && this[_p1][a] !== undef) {
							r = this[_p1][a];
						} else {
							r = this[_p];
						}
					}
				}
				return (typeof (r) == "function") ? r.call(this, a, b, c) : r;
			};
			function isArray(a) {
				return a && typeof (a) == "object" && !a.constructor.subclass && !arrayValue;
			}
			var setProp = function (v, a, b, c) {
				var i;
				if (isArray(v)) {
					for (i in v) {
						if (typeof (v[i]) == "function") {
							continue;
						}
						if (isArray(v[i])) {
							this[_p2] = v;
							delete this[_p3];
							delete this[_x2];
							return;
						}
						break;
					}
					if (a !== undef) {
						if (!this[_p2]) {
							this[_p2] = {};
						}
						this[_p2][a] = v;
						delete this[_p3];
					} else {
						this[_p1] = v;
						delete this[_p2];
						delete this[_p3];
						delete this[_x2];
					}
					return;
				}
				if (c !== undef) {
					if (!this[_p3]) {
						this[_p3] = {};
					}
					if (!this[_p3][c]) {
						this[_p3][c] = {};
					}
					if (!this[_p3][c][b]) {
						this[_p3][c][b] = {};
					}
					this[_p3][c][b][a] = v;
				} else {
					if (b !== undef) {
						if (!this[_p2]) {
							this[_p2] = {};
						}
						if (!this[_p2][b]) {
							this[_p2][b] = {};
						}
						this[_p2][b][a] = v;
						if (this[_x2] && this[_x2][a]) {
							this[_x2][a][b] = true;
						}
					} else {
						if (a !== undef) {
							if (!this[_p1]) {
								this[_p1] = {$owner:this};
							} else {
								if (this[_p1].$owner != this) {
									var r = this[_p1];
									this[_p1] = {};
									for (i in r) {
										this[_p1][i] = r[i];
									}
									this[_p1].$owner = this;
								}
							}
							this[_p1][a] = v;
							if (this[_p2]) {
								if (!this[_x2]) {
									this[_x2] = {};
								}
								this[_x2][a] = {};
							}
						} else {
							this[_p] = v;
							delete this[_p1];
							delete this[_p2];
							delete this[_p3];
							delete this[_x2];
						}
					}
				}
			};
			this[set] = function (v, a, b, c) {
				if (this[ext] && this[ext][$set]) {
					return this[ext][$set](v, a, b, c);
				}
				var r = this.raiseEvent(_changing, v, a, b, c);
				if (r) {
					this.raiseEvent(_error, r, a, b, c);
					return false;
				}
				setProp.call(this, v, a, b, c);
				this.raiseEvent(_changed, v, a, b, c);
				return true;
			};
			setProp.call(this, v);
			var clearPrevious = this[clearModel];
			this[clearModel] = function () {
				delete this[_x2];
				delete this[_p3];
				delete this[_p2];
				delete this[_p1];
				delete this[_p];
				clearPrevious.call(this);
				setProp.call(this, v);
			};
		};
		this[getProperty] = function (p, a, b, c) {
			try {
				if (this[ext] && this[ext][getExt[p]]) {
					return this[ext][getExt[p]](a, b, c);
				}
				return this[getInt[p]](a, b, c);
			}
			catch (error) {
				return this.handle(error);
			}
		};
		this[setProperty] = function (p, v, a, b, c) {
			try {
				if (this[ext] && this[ext][setExt[p]]) {
					return this[ext][setExt[p]](v, a, b, c);
				}
				return this[setInt[p]](v, a, b, c);
			}
			catch (error) {
				return this.handle(error);
			}
		};
		templates[getProperty] = function (p, a, b, c) {
			if (a === undef) {
				return this.$owner[getProperty](p, this.$0, this.$1, this.$2);
			}
			if (b === undef) {
				return this.$owner[getProperty](p, a, this.$0, this.$1);
			}
			if (c === undef) {
				return this.$owner[getProperty](p, a, b, this.$0);
			}
			return this.$owner[getProperty](p, a, b, c);
		};
		templates[setProperty] = function (p, v, a, b, c) {
			if (a === undef) {
				return this.$owner[setProperty](p, v, this.$0, this.$1, this.$2);
			}
			if (b === undef) {
				return this.$owner[setProperty](p, v, a, this.$0, this.$1);
			}
			if (c === undef) {
				return this.$owner[setProperty](p, v, a, b, this.$0);
			}
			return this.$owner[setProperty](p, v, a, b, c);
		};
		this[getModel] = function () {
			return this[ext];
		};
		this[setModel] = function (model) {
			this[ext] = model;
			if (model) {
				model.$owner = this;
			}
		};
		this[clearModel] = function () {
			if (this[ext] && this[ext].$owner) {
				delete this[ext].$owner;
			}
			delete this[ext];
		};
		var clear = this.clear;
		this.clear = function () {
			clear.call(this);
			this[clearModel]();
		};
		var i, zz = {};
		for (i in z) {
			if (!zz[i]) {
				this[defineProperty](i, z[i]);
			}
		}
	};
	obj.defineTemplate = function (name, template) {
		var ref = "_" + name + "Template";
		var ref1 = ref + "1", ref2 = ref + "2", ref3 = ref + "3";
		var get = AW.camelCase("get", name, "template");
		var set = AW.camelCase("set", name, "template");
		var name1 = "-" + name;
		var name2 = "-" + name + "-";
		var undef;
		this[get] = function (a, b, c) {
			if (typeof (this[ref]) == "function") {
				return this[ref](a, b, c);
			}
			var r, id, clone;
			if (a === undef) {
				id = this._id + name1;
				r = this[ref];
			} else {
				if (b === undef) {
					id = this._id + name2 + a;
					r = this[ref1] && this[ref1][a];
					if (!r) {
						r = this[ref];
						clone = true;
					}
				} else {
					if (c === undef) {
						id = this._id + name2 + a + "-" + b;
						r = this[ref2] && this[ref2][a] && this[ref2][a][b];
						if (!r) {
							r = (this[ref1] && this[ref1][a]) || this[ref];
							clone = true;
						}
					} else {
						id = this._id + name2 + a + "-" + b + "-" + c;
						r = this[ref3] && this[ref3][a] && this[ref3][a][b] && this[ref3][a][b][c];
						if (!r) {
							r = (this[ref2] && this[ref2][a] && this[ref2][a][b]) || (this[ref1] && this[ref1][a]) || this[ref];
							clone = true;
						}
					}
				}
			}
			if ((this.$clone) && (clone || r.$owner != this)) {
				r = r.clone();
			}
			r.$owner = this;
			r.$0 = a;
			r.$1 = b;
			r.$2 = c;
			r._id = id;
			return r;
		};
		templates[get] = function (a, b, c) {
			if (a === undef) {
				return this.$owner[get](this.$0, this.$1, this.$2);
			}
			if (b === undef) {
				return this.$owner[get](a, this.$0, this.$1);
			}
			if (c === undef) {
				return this.$owner[get](a, b, this.$0);
			}
			return this.$owner[get](a, b, c);
		};
		this[set] = function (template, a, b, c) {
			var previous;
			if (a === undef) {
				previous = this[ref];
				this[ref] = template;
			} else {
				if (b === undef) {
					if (!this[ref1]) {
						this[ref1] = {};
					}
					previous = this[ref1][a];
					this[ref1][a] = template;
				} else {
					if (c === undef) {
						if (!this[ref2]) {
							this[ref2] = {};
						}
						if (!this[ref2][a]) {
							this[ref2][a] = {};
						}
						previous = this[ref2][a][b];
						this[ref2][a][b] = template;
					} else {
						if (!this[ref3]) {
							this[ref3] = {};
						}
						if (!this[ref3][a]) {
							this[ref3][a] = {};
						}
						if (!this[ref3][a][b]) {
							this[ref3][a][b] = {};
						}
						previous = this[ref3][a][b][c];
						this[ref3][a][b][c] = template;
					}
				}
			}
			if (template) {
				template.$name = name;
				template.$0 = a;
				template.$1 = b;
				template.$2 = c;
				if (template.$owner != this && template != previous) {
					template.$owner = this;
					this.raiseEvent(AW.camelCase("on", name, "templateChanged"), template, a, b, c);
				}
			}
		};
		this[set](template);
	};
	obj.$clone = true;
	function controlValue() {
		var text = this.getControlText();
		var format = this.getControlFormat();
		return format ? format.textToValue(text) : text;
	}
	obj.defineModel("tab", {index:0});
	obj.defineModel("control", {text:"", image:"", link:"", value:controlValue, format:"", tooltip:"", state:"", visible:true, disabled:false});
	obj.setControlSize = obj.setSize;
	obj.setControlPosition = obj.setPosition;
	obj.onControlVisibleChanged = function (value) {
		this.setClass("visible", value);
	};
	obj.focus = function () {
	};
	obj.setController = function (name, controller) {
		var i, n = "_" + name + "Controller";
		this[n] = controller;
		for (i = 0; i < this._controllers.length; i++) {
			if (this._controllers[i] == n) {
				return;
			}
		}
		this._controllers = this._controllers.concat();
		this._controllers.push(n);
	};
	obj._controllers = [];
	obj.raiseEvent = function (name, source, a, b, c) {
		var i, r;
		var handler = this[name];
		if (typeof (handler) == "function") {
			r = handler.call(this, source, a, b, c);
			if (r) {
				return r;
			}
		}
		for (i = 0; i < this._controllers.length; i++) {
			handler = this[this._controllers[i]] ? this[this._controllers[i]][name] : null;
			if (typeof (handler) == "function") {
				r = handler.call(this, source, a, b, c);
				if (r) {
					return r;
				}
			} else {
				if (typeof (handler) == "string" && handler != name) {
					r = this.raiseEvent(handler, source, a, b, c);
					if (r) {
						return r;
					}
				}
			}
		}
	};
	obj.action = function (name, source, a, b, c) {
		this.raiseEvent(AW.camelCase("on", name), source, a, b, c);
	};
	var keyNames = {8:"Backspace", 9:"Tab", 13:"Enter", 27:"Escape", 32:"Space", 33:"PageUp", 34:"PageDown", 35:"End", 36:"Home", 37:"Left", 38:"Up", 39:"Right", 40:"Down", 45:"Insert", 46:"Delete", 112:"F1", 113:"F2", 114:"F3", 115:"F4", 116:"F5", 117:"F6", 118:"F7", 119:"F8", 120:"F9", 121:"F10", 122:"F11", 123:"F12"};
	obj.setEvent("onkeydown", function (event) {
		var key = keyNames[event.keyCode];
		if (event.keyCode >= 48 && event.keyCode <= 90) {
			key = String.fromCharCode(event.keyCode);
		}
		if (key) {
			if (event.shiftKey) {
				key = "Shift" + key;
			}
			if (event.altKey) {
				key = "Alt" + key;
			}
			if (event.ctrlKey) {
				key = "Ctrl" + key;
			}
			this.raiseEvent("onKey" + key, event);
		}
	});
	obj.setEvent("onkeypress", function (event) {
		if ((AW.ie || event.charCode) && !(event.altKey || event.ctrlKey)) {
			this.raiseEvent("onKeyPress", event);
		}
	});
	var targets = {};
	function raiseControlEvent(name, element, event, attr) {
		if (attr) {
			name = AW.camelCase("on", element.getAttribute(attr), name);
		}
		var a = ((element.id.match(/-*\d*-*\d*-*\d+$/) || ["-"]) + "").split("-");
		var target = AW.object(element.id);
		if (target && target.raiseEvent) {
			return target.raiseEvent(name, event, a[1], a[2], a[3]);
		}
	}
	function handleMouse(e, event) {
		try {
			if (AW.ignoreMouse) {
				return;
			}
			var i, h, x, y, z, t = {};
			while (e) {
				if (e.getAttribute && (e.getAttribute("aw") || e.getAttribute("awx"))) {
					t[e.id] = true;
				}
				e = e.parentNode;
			}
			for (i in targets) {
				if (!t[i]) {
					e = AW.element(i);
					if (e && e.getAttribute("aw")) {
						raiseControlEvent("mouseOut", e, event, "aw");
						if (e.getAttribute("aw") == "row" && e.id.match(/(.+-\d+-)\d+/)) {
							y = RegExp.$1;
							for (x = 0; x < 3; x++) {
								z = AW.element(y + x);
								if (z) {
									z.className = z.className.replace(/ aw-mouse(over|down)-row/g, "");
								}
							}
						} else {
							if (e.getAttribute("aw") != "control") {
								e.className = e.className.replace(/ aw-mouse(over|down)-\w+/g, "");
							}
						}
					}
					if (e && e.getAttribute("awx")) {
						e.className = e.className.replace(/ aw-mouse(over|down)-\w+/g, "");
					}
				}
			}
			for (i in t) {
				if (!targets[i]) {
					e = AW.element(i);
					if (e && e.getAttribute("aw")) {
						raiseControlEvent("mouseOver", e, event, "aw");
						if (e.getAttribute("aw") == "row" && e.id.match(/(.+-\d+-)\d+/)) {
							y = RegExp.$1;
							for (x = 0; x < 3; x++) {
								z = AW.element(y + x);
								if (z) {
									z.className += " aw-mouseover-row";
								}
							}
						} else {
							if (e.getAttribute("aw") != "control") {
								e.className += " aw-mouseover-" + e.getAttribute("aw").toLowerCase();
								if (AW.ie) {
									h = e.offsetHeight;
								}
							}
						}
					}
					if (e && e.getAttribute("awx")) {
						e.className += " aw-mouseover-" + e.getAttribute("awx").toLowerCase();
					}
				}
			}
			targets = t;
			e = null;
		}
		catch (error) {
		}
	}
	var mouseDownId = "";
	var handlers = {onmousemove:function (event) {
		handleMouse(AW.srcElement(event), event);
	}, onmouseover:function (event) {
		handleMouse(AW.srcElement(event), event);
	}, onmouseout:function (event) {
		handleMouse(AW.toElement(event), event);
	}, onmousedown:function (event) {
		try {
			var e = AW.srcElement(event);
			var x = false;
			var s = "MouseDown";
			if (event.shiftKey) {
				s = "Shift" + s;
			}
			if (event.altKey) {
				s = "Alt" + s;
			}
			if (event.ctrlKey) {
				s = "Ctrl" + s;
			}
			while (e) {
				if (e.getAttribute && e.getAttribute("aw")) {
					raiseControlEvent(s, e, event, "aw");
					e = AW.element(e.id);
					x = true;
					if (e.getAttribute("aw") != "control") {
						e.className += " aw-mousedown-" + e.getAttribute("aw").toLowerCase();
					}
				}
				if (e.getAttribute && e.getAttribute("awx")) {
					e.className += " aw-mousedown-" + e.getAttribute("awx").toLowerCase();
				}
				e = e.parentNode;
			}
			e = null;
			if (x && (AW.srcElement(event) !== AW.element(AW.srcElement(event).id))) {
				mouseDownId = AW.srcElement(event).id;
			}
		}
		catch (x) {
		}
	}, onmouseup:function (event) {
		try {
			var e = AW.srcElement(event);
			var s = "MouseUp";
			if (event.shiftKey) {
				s = "Shift" + s;
			}
			if (event.altKey) {
				s = "Alt" + s;
			}
			if (event.ctrlKey) {
				s = "Ctrl" + s;
			}
			while (e) {
				if (e.getAttribute && e.getAttribute("aw")) {
					raiseControlEvent(s, e, event, "aw");
					e = AW.element(e.id);
					if (e.getAttribute("aw") != "control") {
						e.className = e.className.replace(/ aw-mousedown-\w+/g, "");
					}
				}
				if (e.getAttribute && e.getAttribute("awx")) {
					e.className = e.className.replace(/ aw-mousedown-\w+/g, "");
				}
				e = e.parentNode;
			}
			e = null;
			var clickEvent;
			if (mouseDownId && (mouseDownId == AW.srcElement(event).id)) {
				if (AW.ie) {
					clickEvent = document.createEventObject(event);
					event.srcElement.fireEvent("onclick", clickEvent);
				} else {
					clickEvent = document.createEvent("MouseEvents");
					clickEvent.initMouseEvent("click", true, true, event.view, 1, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, null);
					event.target.dispatchEvent(clickEvent);
				}
			}
			clickEvent = null;
		}
		catch (x) {
		}
	}, onclick:function (event) {
		try {
			var e = AW.srcElement(event);
			var s = "Clicked";
			if (event.shiftKey) {
				s = "Shift" + s;
			}
			if (event.altKey) {
				s = "Alt" + s;
			}
			if (event.ctrlKey) {
				s = "Ctrl" + s;
			}
			while (e) {
				if (e.getAttribute && e.getAttribute("aw")) {
					raiseControlEvent(s, e, event, "aw");
					e = AW.element(e.id);
				}
				e = e.parentNode;
			}
			e = null;
		}
		catch (x) {
		}
	}, ondblclick:function (event) {
		try {
			var e = AW.srcElement(event);
			var s = "DoubleClicked";
			if (event.shiftKey) {
				s = "Shift" + s;
			}
			if (event.altKey) {
				s = "Alt" + s;
			}
			if (event.ctrlKey) {
				s = "Ctrl" + s;
			}
			while (e) {
				if (e.getAttribute && e.getAttribute("aw")) {
					raiseControlEvent(s, e, event, "aw");
					e = AW.element(e.id);
				}
				e = e.parentNode;
			}
			e = null;
		}
		catch (x) {
		}
	}, onbeforeactivate:function (event) {
		try {
			var e = AW.srcElement(event);
			while (e) {
				if (e.getAttribute && e.getAttribute("aw") == "control" && !AW.object(e.id).$active) {
					if (raiseControlEvent("onControlActivating", e, event)) {
						AW.setReturnValue(event, false);
					}
					e = AW.element(e.id);
				}
				e = e.parentNode;
			}
			e = null;
		}
		catch (x) {
		}
	}, onbeforedeactivate:function (event) {
		try {
			var e = AW.srcElement(event);
			while (e) {
				if (e.getAttribute && e.getAttribute("aw") == "control" && !e.contains(event.toElement)) {
					if (raiseControlEvent("onControlDeactivating", e, event)) {
						AW.setReturnValue(event, false);
					}
					e = AW.element(e.id);
				}
				e = e.parentNode;
			}
			e = null;
		}
		catch (x) {
		}
	}, onactivate:function (event) {
		try {
			var e = AW.srcElement(event);
			AW._focus = e.id;
			while (e) {
				if (e.getAttribute && e.getAttribute("aw") == "control" && !AW.object(e.id).$active) {
					AW.object(e.id).$active = true;
					raiseControlEvent("onControlActivated", e, event);
					e = AW.element(e.id);
				}
				e = e.parentNode;
			}
			e = null;
		}
		catch (x) {
		}
	}, ondeactivate:function (event) {
		try {
			var e = AW.srcElement(event);
			while (e) {
				if (e.getAttribute && e.getAttribute("aw") == "control" && !e.contains(event.toElement)) {
					AW.object(e.id).$active = false;
					raiseControlEvent("onControlDeactivated", e, event);
					e = AW.element(e.id);
				}
				e = e.parentNode;
			}
			e = null;
		}
		catch (x) {
		}
	}};
	var activeElements = {};
	function focusemu(event) {
		try {
			if (AW.lockFocus) {
				return;
			}
			var e = event.target, a = {};
			AW._focus = e.id;
			while (e) {
				if (e.getAttribute && e.getAttribute("aw") == "control" && !e.getAttribute("disabled")) {
					a[e.id] = true;
				}
				e = e.parentNode;
			}
			function raiseEvents(a1, a2, name, state) {
				var i, e, x = {};
				for (i in a1) {
					if (!a2[i] && !x[i]) {
						e = AW.element(i);
						if (e && e.getAttribute("aw") == "control") {
							if (state !== undefined) {
								AW.object(i).$active = state;
							}
							raiseControlEvent(name, e, event);
							e = AW.element(e.id);
						}
					}
				}
			}
			raiseEvents(activeElements, a, "onControlDeactivating");
			raiseEvents(a, activeElements, "onControlActivating");
			raiseEvents(activeElements, a, "onControlDeactivated", false);
			raiseEvents(a, activeElements, "onControlActivated", true);
			activeElements = a;
		}
		catch (x) {
		}
	}
	function mousewheelemu(event) {
		try {
			var e = event.target;
			while (e) {
				if (e.getAttribute && e.getAttribute("onDOMMouseScroll")) {
					return AW(e, event);
				}
				e = e.parentNode;
			}
			e = null;
		}
		catch (x) {
		}
	}
	obj.$active = false;
	AW.register = function (win) {
		if (win != window) {
			win.AW = AW;
			AW.docs.push(win.document);
		}
		var target = AW.ie ? win.document.getElementsByTagName("html")[0] : win.document;
		AW.forEach(handlers, function (name, handler) {
			AW.attachEvent(target, name, handler);
		});
		if (!AW.ie) {
			target.addEventListener("focus", focusemu, true);
			target.addEventListener("DOMMouseScroll", mousewheelemu, true);
		}
		function unregister() {
			AW.unregister(win);
			AW.detachEvent(win, "onunload", unregister);
			win = null;
		}
		AW.attachEvent(win, "onunload", unregister);
	};
	AW.unregister = function (win) {
		var target = AW.ie ? win.document.getElementsByTagName("html")[0] : win.document;
		AW.forEach(handlers, function (name, handler) {
			AW.detachEvent(target, name, handler);
		});
		if (!AW.ie) {
			target.removeEventListener("focus", focusemu, true);
			target.removeEventListener("DOMMouseScroll", mousewheelemu, true);
		}
		if (win != window) {
			var i, docs = AW.docs;
			for (i = 0; i < docs.length; i++) {
				if (docs[i] == win.document) {
					docs.splice(i, 1);
					return;
				}
			}
			win.AW = null;
		}
	};
	AW.register(window);
};
AW.Formats.String = AW.System.Format.subclass();
AW.Formats.String.create = function () {
	var obj = this.prototype;
	obj.valueToText = function (data) {
		return data ? String(data).replace(AW.textPattern, AW.textReplace) : "";
	};
	obj.textToValue = function (text) {
		return text ? String(text).replace(AW.htmlPattern, AW.htmlReplace) : "";
	};
	obj.dataToText = obj.valueToText;
	obj.textToData = obj.textToValue;
	if ("".localeCompare) {
		obj.comparator = function (values, greater, less, equal, error) {
			return function (i, j) {
				try {
					return greater * ("" + values[i]).localeCompare(values[j]) || equal(i, j);
				}
				catch (e) {
					return error(i, j, e);
				}
			};
		};
	}
};
AW.Formats.Number = AW.System.Format.subclass();
AW.Formats.Number.create = function () {
	var obj = this.prototype;
	obj.dataToValue = function (v) {
		return Number(("" + v).replace(numPattern, ""));
	};
	obj.textToValue = function (v) {
		return Number(("" + v).replace(numPattern, ""));
	};
	var numPattern = /[^0-9.\-+]+/gm;
	var noFormat = function (value) {
		return "" + value;
	};
	var doFormat = function (value) {
		var abs = (value < 0) ? -value : value;
		var rounded = value.toFixed(this._decimals);
		if (abs < 1000) {
			return rounded.replace(this.p1, this.r1);
		}
		if (abs < 1000000) {
			return rounded.replace(this.p2, this.r2);
		}
		if (abs < 1000000000) {
			return rounded.replace(this.p3, this.r3);
		}
		return rounded.replace(this.p4, this.r4);
	};
	obj.setTextFormat = function (format) {
		var pattern = /^([^0#]*)([0#]*)([ .,]?)([0#]|[0#]{3})([.,])([0#]*)([^0#]*)$/;
		var f = format.replace(/\$/g, "$$$$").match(pattern);
		if (!f) {
			this.valueToText = function (value) {
				return "" + value;
			};
			this.dataToText = function (value) {
				return "" + value;
			};
			return;
		}
		this.valueToText = doFormat;
		this.dataToText = function (v) {
			return doFormat.call(this, Number(("" + v).replace(numPattern, "")));
		};
		var rs = f[1];
		var rg = f[3];
		var rd = f[5];
		var re = f[7];
		this._decimals = f[6].length;
		var ps = "^(-?\\d+)", pm = "(\\d{3})", pe = "\\.(\\d{" + this._decimals + "})$";
		if (!this._decimals) {
			pe = "($)";
			rd = "";
		}
		this.p1 = new RegExp(ps + pe);
		this.p2 = new RegExp(ps + pm + pe);
		this.p3 = new RegExp(ps + pm + pm + pe);
		this.p4 = new RegExp(ps + pm + pm + pm + pe);
		this.r1 = rs + "$1" + rd + "$2" + re;
		this.r2 = rs + "$1" + rg + "$2" + rd + "$3" + re;
		this.r3 = rs + "$1" + rg + "$2" + rg + "$3" + rd + "$4" + re;
		this.r4 = rs + "$1" + rg + "$2" + rg + "$3" + rg + "$4" + rd + "$5" + re;
	};
	obj.setTextFormat("");
};
AW.Formats.Date = AW.System.Format.subclass();
AW.Formats.Date.create = function () {
	var obj = this.prototype;
	obj.date = new Date();
	var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var shortWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var longWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	if (!obj.shortMonths) {
		obj.shortMonths = shortMonths;
	}
	if (!obj.longMonths) {
		obj.longMonths = longMonths;
	}
	if (!obj.shortWeekdays) {
		obj.shortWeekdays = shortWeekdays;
	}
	if (!obj.longWeekdays) {
		obj.longWeekdays = longWeekdays;
	}
	obj.digits = [];
	for (var i = 0; i < 100; i++) {
		obj.digits[i] = i < 10 ? "0" + i : "" + i;
	}
	var tokens = {"hh":"this.digits[this.date.getUTCHours()]", "h":"this.date.getUTCHours()", ":mm":"':'+this.digits[this.date.getUTCMinutes()]", "mm:":"this.digits[this.date.getUTCMinutes()]+':'", "ss":"this.digits[this.date.getUTCSeconds()]", "tt":"(this.date.getUTCHours()>11?'PM':'AM')", "dddd":"this.longWeekdays[this.date.getUTCDay()]", "ddd":"this.shortWeekdays[this.date.getUTCDay()]", "dd":"this.digits[this.date.getUTCDate()]", "d":"this.date.getUTCDate()", "mmmm":"this.longMonths[this.date.getUTCMonth()]", "mmm":"this.shortMonths[this.date.getUTCMonth()]", "mm":"this.digits[this.date.getUTCMonth()+1]", "m":"(this.date.getUTCMonth()+1)", "yyyy":"this.date.getUTCFullYear()", "yy":"this.digits[this.date.getUTCFullYear()%100]"};
	var tokens12 = {}, match = "";
	for (i in tokens) {
		if (typeof (i) == "string") {
			tokens12[i] = tokens[i];
			match += "|" + i;
		}
	}
	tokens12.hh = "this.digits[1+(this.date.getUTCHours()+11)%12]";
	tokens12.h = "(1+(this.date.getUTCHours()+11)%12)";
	var re = new RegExp(match.replace("|", "(") + ")", "gi");
	var reverse = {"hh":["(\\d{1,2})", "a[3]=", ";"], "h":["(\\d{1,2})", "a[3]=", ";"], ":mm":[":(\\d{1,2})", "a[4]=", ";"], "mm:":["(\\d{1,2}):", "a[4]=", ";"], "ss":["(\\d{1,2})", "a[5]=", ";"], "tt":["(AM|PM)", "a[3]=", "=='AM'?a[3]%12:a[3]%12+12;"], "dd":["(\\d{1,2})", "a[2]=", ";"], "d":["(\\d{1,2})", "a[2]=", ";"], "mmmm":["([^\\s\\x2c-\\x2f\\x5c;]+)", "a[1]=this.rMonths[", ".toLowerCase()];"], "mmm":["([^\\s\\x2c-\\x2f\\x5c;]+)", "a[1]=this.rMonths[", ".toLowerCase()];"], "mm":["(\\d{1,2})", "a[1]=Number(", ")-1;"], "m":["(\\d{1,2})", "a[1]=Number(", ")-1;"], "yyyy":["(\\d{1,4})", "a[0]=Number(", ");if(a[0]<30){a[0]+=2000};"], "yy":["(\\d{1,4})", "a[0]=Number(", ");if(a[0]<30){a[0]+=2000};"]};
	var delim = /[\s\x2c-\x2f\x5c;]+/g;
	obj.setTextFormat = function (format) {
		format = format.replace(/am\/pm/i, "tt");
		var tok = format.match("tt") ? tokens12 : tokens;
		var code = format.replace(re, function (i) {
			return "'+" + tok[i.toLowerCase()] + "+'";
		});
		code = "if(isNaN(value)||(value===this._valueError))return this._textError;" + "this.date.setTime(value+this._textTimezoneOffset);" + ("return '" + code + "'").replace(/(''\+|\+'')/g, "");
		this.valueToText = new Function("value", code);
		var num = 0;
		code = "var a=[this._year,0,1];if(String(text).match(this._t2v)){\n";
		function item(i) {
			i = i.toLowerCase();
			if (reverse[i]) {
				code += reverse[i][1] + "RegExp.$" + (++num) + reverse[i][2];
				return reverse[i][0];
			} else {
				return "\\w+";
			}
		}
		this._t2v = new RegExp(format.replace(delim, "[\\s\\x2c-\\x2f\\x5c;]+").replace(re, item));
		code += "\n return Date.UTC.apply(this,a)- this._textTimezoneOffset}else{return this._valueError}";
		this.textToValue = new Function("text", code);
		this.rMonths = {};
		for (var m = 0; m < 12; m++) {
			this.rMonths[m + 1] = m;
			this.rMonths[this.digits[m + 1]] = m;
			this.rMonths[shortMonths[m].toLowerCase()] = m;
			this.rMonths[longMonths[m].toLowerCase()] = m;
			this.rMonths[this.shortMonths[m].toLowerCase()] = m;
			this.rMonths[this.longMonths[m].toLowerCase()] = m;
		}
		this._year = (new Date).getUTCFullYear();
	};
	var xmlExpr = /(\d\d\d\d)-(\d\d)-(\d\d)[T ]?(\d\d)?(:\d\d)?(:\d\d)?(\.\d+)?Z?([+-]\d\d)?:?(\d\d)?/;
	var xmlOut = "$1/$2/$3 $4$5$6 GMT$8$9";
	var auto = function (data) {
		var value = Date.parse(data + this._dataTimezoneCode);
		return isNaN(value) ? this._valueError : value;
	};
	var RFC822 = function (data) {
		var value = Date.parse(data);
		return isNaN(value) ? this._valueError : value;
	};
	var ISO8601 = function (data) {
		var value = Date.parse(data.replace(xmlExpr, xmlOut));
		return isNaN(value) ? this._valueError : value;
	};
	obj.setDataFormat = function (format) {
		if (format == "RFC822" || format == "rfc822") {
			this.dataToValue = RFC822;
		} else {
			if (format == "ISO8601" || format == "iso8601" || format == "ISO8061") {
				this.dataToValue = ISO8601;
			} else {
				this.dataToValue = auto;
			}
		}
	};
	obj.setTextTimezone = function (value) {
		this._textTimezoneOffset = value;
	};
	obj.setDataTimezone = function (value) {
		if (!value) {
			this._dataTimezoneCode = " GMT";
		} else {
			this._dataTimezoneCode = " GMT" + (value > 0 ? "+" : "-") + this.digits[Math.floor(Math.abs(value / 3600000))] + this.digits[Math.abs(value / 60000) % 60];
		}
	};
	var localTimezone = -obj.date.getTimezoneOffset() * 60000;
	obj.setTextTimezone(localTimezone);
	obj.setDataTimezone(localTimezone);
	obj.setTextFormat("m/d/yyyy");
	obj.setDataFormat("default");
};
AW.Formats.HTML = AW.System.Format.subclass();
AW.Formats.HTML.create = function () {
	var obj = this.prototype;
	obj.dataToValue = function (data) {
		return data ? data.replace(AW.htmlPattern, AW.htmlReplace) : "";
	};
	obj.dataToText = function (data) {
		return data;
	};
	obj.textToValue = obj.dataToValue;
	if ("".localeCompare) {
		obj.comparator = function (values, greater, less, equal, error) {
			return function (i, j) {
				try {
					return greater * ("" + values[i]).localeCompare(values[j]) || equal(i, j);
				}
				catch (e) {
					return error(i, j, e);
				}
			};
		};
	}
};
AW.HTML.define = function (name, tag, type) {
	if (!tag) {
		tag = name.toLowerCase();
	}
	AW.HTML[name] = AW.System.HTML.subclass();
	AW.HTML[name].create = function () {
		this.prototype.setTag(tag);
	};
};
(function () {
	var i, tags = ["DIV", "SPAN", "IMG", "INPUT", "BUTTON", "TEXTAREA", "TABLE", "TR", "TD"];
	for (i = 0; i < tags.length; i++) {
		AW.HTML.define(tags[i]);
	}
})();
AW.Templates.ImageText = AW.System.Template.subclass();
AW.Templates.ImageText.create = function () {
	var obj = this.prototype;
	function _image() {
		return this.getControlProperty("image") || "none";
	}
	function _text() {
		return this.getControlProperty("text");
	}
	function _tooltip() {
		return this.getControlProperty("tooltip");
	}
	var span = AW.HTML.SPAN;
	var image = new span;
	image.setClass("item", "image");
	image.setClass("image", _image);
	var ruler = new span;
	ruler.setClass("item", "ruler");
	var text = new span;
	text.setClass("item", "text");
	text.setContent("html", _text);
	var box = new span;
	box.setClass("item", "box");
	box.setContent("sign", "");
	box.setContent("marker", "");
	box.setContent("image", image);
	box.setContent("ruler", ruler);
	box.setContent("text", text);
	obj.setTag("span");
	obj.setClass("item", "template");
	obj.setClass("templates", "imagetext");
	obj.setAttribute("title", _tooltip);
	obj.setContent("box", box);
	if (AW.gecko) {
		obj.setAttribute("tabIndex", "-1");
	}
	var startEditIE = function (startText) {
		var self = this;
		var item = self.getAttribute("aw");
		var originalText = self.getControlProperty("text");
		var text = originalText;
		var valid;
		var e = self.getContent("box/text").element();
		var x = self.element();
		if (!e || !x) {
			return;
		}
		var input = (e.tagName == "input") || (e.tagName == "INPUT");
		function raiseEvent(name) {
			var text1 = self.getControlProperty("text");
			var fullname = AW.camelCase("on", item, name);
			var result = self.raiseEvent(fullname, text, self.$0, self.$1, self.$2);
			var text2 = self.getControlProperty("text");
			if (text2 != text1) {
				updateText(text2);
			}
			return result;
		}
		if (raiseEvent("editStarting")) {
			e = null;
			x = null;
			return;
		}
		function nobubble(event) {
			event.cancelBubble = true;
		}
		function updateText(text) {
			if (input) {
				e.value = text;
			} else {
				e.innerHTML = text;
			}
		}
		function onpropertychange(event) {
			var text1 = self.getControlProperty("text");
			var text2 = input ? e.value : e.innerHTML.replace(/&nbsp;/g, " ");
			if (text2 != text1) {
				self.setControlProperty("text", text2);
			}
			var text3 = self.getControlProperty("text");
			if (text3 != text2) {
				updateText(text3);
			}
		}
		function onkeydown(event) {
			if (event.keyCode == 27) {
				if (input) {
					e.value = originalText;
				} else {
					e.innerHTML = originalText;
				}
				event.returnValue = false;
				if (item == "control") {
					return;
				}
				onbeforedeactivate(event);
				if (valid) {
					ondeactivate(event);
				}
				return;
			}
			if (event.keyCode == 13) {
				text = self.getControlProperty("text");
				if (item == "control") {
					if (raiseEvent("validating")) {
						return;
					}
					raiseEvent("validated");
					return;
				}
				event.returnValue = false;
				event.cancelBubble = true;
				onbeforedeactivate(event);
				if (valid) {
					ondeactivate(event);
				}
				return;
			}
			var r;
			if (input) {
				r = e.createTextRange();
			} else {
				r = document.body.createTextRange();
				r.moveToElementText(e);
			}
			var s = document.selection.createRange();
			if ((event.keyCode == 36 || event.keyCode == 37) && r.compareEndPoints("StartToStart", s)) {
				event.cancelBubble = true;
				r = null;
				s = null;
				return;
			}
			if ((event.keyCode == 35 || event.keyCode == 39) && r.compareEndPoints("EndToEnd", s)) {
				event.cancelBubble = true;
				r = null;
				s = null;
				return;
			}
		}
		function onbeforedeactivate(event) {
			valid = false;
			text = self.getControlProperty("text");
			if (input && text != e.value) {
				text = e.value;
				self.setControlProperty("text", text);
			}
			if (!input && text != e.innerHTML.replace(/&nbsp;/g, " ")) {
				text = e.innerHTML.replace(/&nbsp;/g, " ");
				self.setControlProperty("text", text);
			}
			var text2 = self.getControlProperty("text");
			if (text2 != text) {
				updateText(text2);
				text = text2;
			}
			if (self.element().contains(event.toElement)) {
				event.returnValue = false;
				return;
			}
			if (raiseEvent("editEnding")) {
				event.cancelBubble = true;
				event.returnValue = false;
				return;
			}
			if (originalText == text) {
				valid = true;
				return;
			}
			if (raiseEvent("validating")) {
				event.cancelBubble = true;
				event.returnValue = false;
				return;
			}
			raiseEvent("validated");
			valid = true;
		}
		function ondeactivate(event) {
			text = self.getControlProperty("text");
			e.removeExpression("aw-value");
			e.detachEvent("onselectstart", nobubble);
			e.detachEvent("oncontextmenu", nobubble);
			x.detachEvent("onmousedown", nobubble);
			x.detachEvent("onmouseup", nobubble);
			x.detachEvent("onclick", nobubble);
			x.detachEvent("ondoubleclick", nobubble);
			e.detachEvent("onpropertychange", onpropertychange);
			e.detachEvent("onkeydown", onkeydown);
			e.detachEvent("onbeforedeactivate", onbeforedeactivate);
			e.detachEvent("ondeactivate", ondeactivate);
			document.selection.empty();
			if (!input) {
				e.contentEditable = false;
			}
			e.parentNode.scrollLeft = 0;
			x.className = x.className.replace(" aw-edit-" + item, "");
			if (self.$owner) {
				self.$owner.$edit = false;
			}
			raiseEvent("editEnded");
			e = null;
			x = null;
		}
		x.className = x.className.replace(/ aw-mousedown-\w+/g, "") + " aw-edit-" + item;
		if (!input) {
			e.contentEditable = true;
		}
		e.attachEvent("onselectstart", nobubble);
		e.attachEvent("oncontextmenu", nobubble);
		if (input) {
			e.select();
		} else {
			if (typeof (startText) == "string") {
				e.focus();
			} else {
				var r = document.body.createTextRange();
				r.moveToElementText(e);
				r.select();
				r = null;
			}
		}
		e.setExpression("aw-value", input ? "this.value" : "this.innerHTML");
		x.attachEvent("onmousedown", nobubble);
		x.attachEvent("onmouseup", nobubble);
		x.attachEvent("onclick", nobubble);
		x.attachEvent("ondoubleclick", nobubble);
		e.attachEvent("onpropertychange", onpropertychange);
		e.attachEvent("onkeydown", onkeydown);
		e.attachEvent("onbeforedeactivate", onbeforedeactivate);
		e.attachEvent("ondeactivate", ondeactivate);
		if (self.$owner) {
			self.$owner.$edit = true;
		}
		raiseEvent("editStarted");
		if (typeof (startText) == "string") {
			e.innerHTML = startText;
		}
	};
	var startEditGecko = function (startText) {
		var self = this;
		var item = self.getAttribute("aw");
		var originalText = self.getControlProperty("text");
		var text = originalText;
		var e = self.getContent("box/text").element();
		var x = self.element();
		if (!e || !x) {
			return;
		}
		var input = (e.tagName == "input") || (e.tagName == "INPUT");
		var updateText = function (text) {
			if (input) {
				e.value = text;
			} else {
				e.innerHTML = text;
			}
		};
		function raiseEvent(name) {
			var text1 = self.getControlProperty("text");
			var fullname = AW.camelCase("on", item, name);
			var result = self.raiseEvent(fullname, text, self.$0, self.$1, self.$2);
			var text2 = self.getControlProperty("text");
			if (text2 != text1) {
				updateText(text2);
			}
			return result;
		}
		if (raiseEvent("editStarting")) {
			e = null;
			x = null;
			return;
		}
		updateText = function (text) {
			e.value = text;
		};
		function nobubble(event) {
			event.stopPropagation();
		}
		function oninput(event) {
			var text1 = self.getControlProperty("text");
			var text2 = e.value;
			if (text2 != text1) {
				self.setControlProperty("text", text2);
			}
			var text3 = self.getControlProperty("text");
			if (text3 != text2) {
				updateText(text3);
			}
			text = text3;
		}
		function onkeydown(event) {
			if (event.keyCode == 27) {
				e.value = originalText;
				event.preventDefault();
				if (item == "control") {
					return;
				}
				try {
					self.$owner.getContent("focus").element().focus();
					return;
				}
				catch (err) {
				}
				onfocus(event);
				return;
			}
			if (event.keyCode == 13) {
				text = self.getControlProperty("text");
				if (item == "control") {
					insideFocus = true;
					if (raiseEvent("validating")) {
						insideFocus = false;
						return;
					}
					raiseEvent("validated");
					insideFocus = false;
					return;
				}
				event.preventDefault();
				event.stopPropagation();
				try {
					self.$owner.getContent("focus").element().focus();
					return;
				}
				catch (err) {
				}
				onfocus(event);
				return;
			}
			if ((event.keyCode == 36 || event.keyCode == 37) && e.selectionStart > 0) {
				event.stopPropagation();
				return;
			}
			if ((event.keyCode == 35 || event.keyCode == 39) && e.selectionStart < e.value.length) {
				event.stopPropagation();
				return;
			}
		}
		function cancelEvent(event) {
			if (event.target != document) {
				event.preventDefault();
				event.stopPropagation();
			}
		}
		var insideFocus;
		function focusBack(event) {
			event.preventDefault();
			event.stopPropagation();
			e.focus();
			window.removeEventListener("blur", cancelEvent, true);
			insideFocus = false;
		}
		var inDocFocus;
		function docFocus(event) {
			if (inDocFocus) {
				return;
			}
			inDocFocus = true;
			var e = document.createEvent("HTMLEvents");
			e.initEvent("focus", false, false);
			e.deferred = true;
			window.setTimeout(function () {
				if (inDocFocus) {
					onfocus(e);
				}
				e = null;
			});
		}
		function onfocus(event) {
			if (event.type == "focus" && event.target == document && !event.deferred) {
				return docFocus(event);
			}
			inDocFocus = false;
			if (insideFocus || (event.type == "focus" && event.target == e)) {
				return;
			}
			insideFocus = true;
			window.addEventListener("blur", cancelEvent, true);
			function isInside(parent, child) {
				try {
					var range = document.createRange();
					range.selectNode(parent);
					return child && (range.compareNode(child) == 3);
				}
				catch (err) {
					return false;
				}
			}
			if (event.type == "focus" && (isInside(x, event.target) || isInside(self.$popup, event.target))) {
				return focusBack(event);
			}
			oninput(event);
			if (raiseEvent("editEnding")) {
				return focusBack(event);
			}
			if (text != originalText) {
				if (raiseEvent("validating")) {
					return focusBack(event);
				}
				raiseEvent("validated");
			}
			window.removeEventListener("blur", cancelEvent, true);
			insideFocus = false;
			e.removeEventListener("contextmenu", nobubble, false);
			x.removeEventListener("mousedown", nobubble, false);
			x.removeEventListener("mouseup", nobubble, false);
			x.removeEventListener("click", nobubble, false);
			x.removeEventListener("doubleclick", nobubble, false);
			e.removeEventListener("input", oninput, false);
			e.removeEventListener("keydown", onkeydown, false);
			window.removeEventListener("focus", onfocus, true);
			if (!input) {
				node2.innerHTML = self.getControlProperty("text");
				e.parentNode.replaceChild(node2, e);
			}
			x.className = x.className.replace(" aw-edit-" + item, "");
			AW.lockFocus = false;
			if (self.$owner) {
				self.$owner.$edit = false;
			}
			raiseEvent("editEnded");
			e = null;
			x = null;
			node1 = null;
			node2 = null;
			if (event.type == "focus" && event.deferred) {
				document.dispatchEvent(event);
			}
		}
		x.className = x.className.replace(/ aw-mousedown-\w+/g, "") + " aw-edit-" + item;
		if (input) {
			e.select();
		} else {
			var node1 = document.createElement("input");
			node1.setAttribute("id", e.id);
			node1.setAttribute("type", "text");
			node1.setAttribute("class", e.className);
			node1.setAttribute("autocomplete", "off");
			node1.setAttribute("value", text);
			var node2 = e.parentNode.replaceChild(node1, e);
			e = node1;
			e.select();
		}
		e.addEventListener("contextmenu", nobubble, false);
		x.addEventListener("mousedown", nobubble, false);
		x.addEventListener("mouseup", nobubble, false);
		x.addEventListener("click", nobubble, false);
		x.addEventListener("doubleclick", nobubble, false);
		e.addEventListener("input", oninput, false);
		e.addEventListener("keydown", onkeydown, false);
		window.addEventListener("focus", onfocus, true);
		AW.lockFocus = true;
		if (self.$owner) {
			self.$owner.$edit = true;
		}
		raiseEvent("editStarted");
		if (typeof (startText) == "string") {
			e.value = startText;
			oninput.call(self);
		}
	};
	if (AW.ie) {
		obj.startEdit = startEditIE;
	}
	if (!AW.ie) {
		obj.startEdit = startEditGecko;
	}
};
AW.Templates.Image = AW.Templates.ImageText.subclass();
AW.Templates.Image.create = function () {
	var obj = this.prototype;
	obj.setClass("templates", "image");
	var box = obj.getContent("box");
	if (!AW.gecko) {
		box.setTag("");
	}
	box.setContent("text", "");
	obj.startEdit = null;
};
AW.Templates.Text = AW.Templates.ImageText.subclass();
AW.Templates.Text.create = function () {
	var obj = this.prototype;
	obj.setClass("templates", "text");
	var box = obj.getContent("box");
	if (!AW.gecko) {
		box.setTag("");
	}
	box.setContent("image", "");
};
AW.Templates.Link = AW.Templates.ImageText.subclass();
AW.Templates.Link.create = function () {
	var obj = this.prototype;
	obj.setTag("a");
	obj.setClass("templates", "link");
	obj.setAttribute("tabIndex", "-1");
	obj.setAttribute("href", function () {
		return this.getControlProperty("link") || null;
	});
	var box = obj.getContent("box");
	if (!AW.gecko) {
		box.setTag("");
	}
	obj.startEdit = null;
};
AW.Templates.CheckBox = AW.Templates.ImageText.subclass();
AW.Templates.CheckBox.create = function () {
	var obj = this.prototype;
	obj.setClass("value", function () {
		return this.getControlProperty("value") || false;
	});
	obj.setClass("toggle", "checkbox");
	obj.setClass("templates", "checkbox");
	obj.setAttribute("awx", "toggle");
	var marker = new AW.HTML.SPAN;
	marker.setClass("item", "marker");
	obj.setContent("box/marker", marker);
	obj.setEvent("onclick", function () {
		var value = this.getControlProperty("value");
		this.setControlProperty("value", !value);
	});
	obj.startEdit = null;
};
AW.Templates.Checkbox = AW.Templates.CheckBox;
AW.Templates.CheckedItem = AW.Templates.CheckBox.subclass();
AW.Templates.CheckedItem.create = function () {
	var obj = this.prototype;
	obj.setClass("templates", "checkeditem");
	obj.setClass("value", function () {
		return this.getStateProperty("selected") || false;
	});
	obj.setEvent("onclick", function () {
		var selected = this.getStateProperty("selected");
		this.setStateProperty("selected", !selected);
	});
};
AW.Templates.Radio = AW.Templates.CheckedItem.subclass();
AW.Templates.Radio.create = function () {
	var obj = this.prototype;
	obj.setClass("toggle", "radio");
	obj.setClass("templates", "radio");
	obj.setEvent("onclick", "");
};
AW.Templates.Popup = AW.System.Template.subclass();
AW.Templates.Popup.create = function () {
	var obj = this.prototype;
	obj.setClass("popup", "normal");
	obj.showPopup = function () {
		var popup = window.createPopup();
		this.$popup = popup;
		AW.$popup = this;
		var doc = popup.document;
		doc.open();
		if (AW.strict) {
			doc.write("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">");
		}
		doc.write("<html class=\"aw-popup-window aw-system-control " + AW._htmlClasses + "\"><head>");
		AW.register(doc.parentWindow);
		for (var i = 0; i < document.styleSheets.length; i++) {
			doc.write(document.styleSheets[i].owningElement.outerHTML);
		}
		doc.write("</head><body onselectstart=\"return false\" oncontextmenu=\"return false\">");
		doc.write(this.getPopupTemplate().toString());
		doc.write("</body></html>");
		doc.close();
		var ref = this.element();
		var left = 0;
		var top = ref.offsetHeight;
		var width = ref.offsetWidth;
		var height = 1;
		popup.show(left, top, width, height, ref);
		width = Math.max(doc.body.scrollWidth, width);
		height = Math.max(doc.body.scrollHeight + 1, 20);
		popup.show(left, top, width, height, ref);
		this.setTimeout(function () {
			try {
				width = Math.max(doc.body.scrollWidth, width);
				height = Math.max(doc.body.scrollHeight + 1, 20);
				if (popup.isOpen) {
					popup.show(left, top, width, height, ref);
				}
				popup = null;
				ref = null;
			}
			catch (err) {
			}
		}, 500);
	};
	obj.hidePopup = function () {
		if (this.$popup && this.$popup.isOpen) {
			this.$popup.hide();
		}
		if (this.$popup) {
			this.$popup = null;
		}
		if (AW.$popup) {
			AW.$popup = null;
		}
	};
	if (!AW.ie) {
		obj.showPopup = function () {
			if (this.$popup) {
				document.body.removeChild(this.$popup);
				this.$popup = null;
			}
			var ref = this.element() ? this.element() : document.body;
			var left = AW.getLeft(ref);
			var top = AW.getTop(ref) + ref.offsetHeight;
			var popup = document.createElement("div");
			this.$popup = popup;
			AW.$popup = this;
			document.body.appendChild(popup);
			popup.className = "aw-popup-window aw-system-control";
			popup.style.left = left + "px";
			popup.style.top = top + "px";
			popup.innerHTML = this.getPopupTemplate().toString();
		};
		obj.hidePopup = function () {
			if (this.$popup) {
				this.setTimeout(function () {
					document.body.removeChild(this.$popup);
					this.$popup = null;
					AW.$popup = null;
				});
			}
		};
		obj.onControlDeactivated = function () {
			this.hidePopup();
		};
	}
};
AW.Templates.Frame = AW.System.Template.subclass();
AW.Templates.Frame.create = function () {
	var obj = this.prototype;
	obj.setClass("frame", "template");
	obj.setClass("flow", "vertical");
	obj.setClass("text", "normal");
	var box = new AW.HTML.SPAN;
	box.setClass("frame", "box");
	box.setClass("list", "box");
	if (AW.ie && AW.strict) {
		box.setStyle("width", "expression(this.parentElement.offsetWidth-4)");
	}
	box.setContent("html", function () {
		return this.getLayoutTemplate();
	});
	obj.setContent("box", box);
};
AW.Templates.List = AW.System.Template.subclass();
AW.Templates.List.create = function () {
	var obj = this.prototype;
	obj.setTag("span");
	obj.setClass("templates", "list");
	obj.setContent("start", "");
	obj.setContent("items", function () {
		var i, ii, a = [];
		var count = this.getViewProperty("count");
		var offset = this.getViewProperty("offset");
		var indices = this.getViewProperty("indices");
		var clone = this.$owner.$clone;
		this.$owner.$clone = false;
		for (i = 0; i < count; i++) {
			ii = indices ? indices[i + offset] : i + offset;
			a[i] = this.getItemTemplate(ii).toString();
		}
		this.$owner.$clone = clone;
		return a.join("");
	});
	obj.setContent("end", "");
};
AW.Templates.Input = AW.Templates.ImageText.subclass();
AW.Templates.Input.create = function () {
	var obj = this.prototype;
	obj.setClass("templates", "input");
	obj.setClass("input", "box");
};
AW.Templates.Combo = AW.Templates.ImageText.subclass();
AW.Templates.Combo.create = function () {
	AW.Templates.Popup.create.call(this);
	var obj = this.prototype;
	obj.setAttribute("awx", "combo");
	obj.setClass("templates", "combo");
	obj.setClass("combo", "box");
	var button = new AW.HTML.TABLE;
	button.setClass("combo", "button");
	button.setAttribute("cellspacing", "0");
	button.setEvent("onclick", function (event) {
		if (!this.$owner && !this.$active) {
			return;
		}
		if (this.$owner && !this.$owner.$active) {
			return;
		}
		if (this.$owner && this.$owner._cellTemplate && !this.$popup) {
			this.lock();
			var combo = this;
			this.$owner.setController("popup", {onCellEditEnding:function () {
				try {
					if (AW.gecko && combo.$popup) {
						var event = combo.raiseEvent.caller.caller.arguments[0];
						var range = document.createRange();
						range.selectNode(combo.$popup);
						return event.target && (range.compareNode(event.target) == 3);
					}
				}
				catch (err) {
				}
			}, onCellEditEnded:function () {
				combo.hidePopup();
				combo = null;
				this.setController("popup", {});
			}});
			this.raiseEvent("editCurrentCell", event);
		}
		this.showPopup();
		this.getContent("box/text").element().focus();
		this.getContent("box/text").element().parentNode.scrollTop = 0;
	});
	obj.setContent("box/sign", button);
	obj.setContent("box/sign/html", "<tr class=\"aw-cb-1\"><td></td></tr><tr class=\"aw-cb-2\"><td>&nbsp;</td></tr><tr class=\"aw-cb-3\"><td></td></tr>");
};
AW.Templates.Cell = AW.Templates.ImageText.subclass();
AW.Templates.Cell.create = function () {
	var obj = this.prototype;
	obj.setClass("templates", "cell");
	var box = obj.getContent("box");
	if (!AW.gecko) {
		box.setTag("");
	}
	box.setContent("image", "");
	box.setContent("ruler", "");
	box.getContent("text").setTag("");
	obj.startEdit = null;
};
AW.Templates.HTML = AW.Templates.Cell;
AW.Scroll.Bars = AW.System.Template.subclass();
AW.Scroll.Bars.create = function () {
	var obj = this.prototype;
	obj.setClass("scroll", "bars");
	obj.setClass("scrollbars", function () {
		return this.getScrollProperty("bars");
	});
	var span = AW.HTML.SPAN;
	var box = new span;
	var spacer = new span;
	var content = new span;
	if (AW.gecko) {
		box.setAttribute("tabIndex", "-1");
		content.setAttribute("tabIndex", "-1");
	}
	box.setClass("bars", "box");
	spacer.setClass("bars", "spacer");
	content.setClass("bars", "content");
	spacer.setStyle("width", function () {
		return this.getScrollProperty("width") + "px";
	});
	spacer.setStyle("height", function () {
		return this.getScrollProperty("height") + "px";
	});
	obj.setContent("box", box);
	obj.setContent("box/spacer", spacer);
	obj.setContent("content", content);
	obj.setContent("content/html", function () {
		return this.getContentTemplate();
	});
	var serial = 0;
	obj.setEvent("onresize", function () {
		var s = ++serial;
		this.setTimeout(function () {
			if (s == serial) {
				this.raiseEvent("adjustScrollBars");
			}
		});
	});
	box.setEvent("onscroll", function () {
		var e = this.getContent("box").element();
		var left = this.getScrollProperty("left");
		var top = this.getScrollProperty("top");
		if (e.scrollLeft != left) {
			this.setScrollProperty("left", e.scrollLeft);
		}
		if (e.scrollTop != top) {
			this.setScrollProperty("top", e.scrollTop);
		}
		e = null;
	});
	function mousewheel(event) {
		var top = this.getScrollProperty("top");
		top -= AW.ie ? event.wheelDelta / 2 : event.detail * (-10);
		var e = this.element();
		if (e) {
			var max = this.getScrollProperty("height") - e.offsetHeight;
			var bars = this.getScrollProperty("bars");
			max += (bars == "horizontal" || bars == "both") ? 16 : 0;
			top = top > max ? max : top;
		}
		top = top < 0 ? 0 : top;
		this.setScrollProperty("top", top);
		AW.setReturnValue(event, false);
	}
	obj.setEvent(AW.ie ? "onmousewheel" : "onDOMMouseScroll", mousewheel);
};
AW.Panels.Horizontal = AW.System.Template.subclass();
AW.Panels.Horizontal.create = function () {
	var obj = this.prototype;
	obj.setClass("hpanel", "template");
	var span = AW.HTML.SPAN;
	var box = new span;
	var top = new span;
	var middle = new span;
	var bottom = new span;
	box.setClass("hpanel", "box");
	top.setClass("hpanel", "top");
	middle.setClass("hpanel", "middle");
	bottom.setClass("hpanel", "bottom");
	function height(i) {
		return function () {
			return this.getPanelProperty("height", i) + "px";
		};
	}
	function visibility(i) {
		return function () {
			return this.getPanelProperty("height", i) ? "inherit" : "hidden";
		};
	}
	top.setStyle("visibility", visibility(0));
	top.setStyle("height", height(0));
	bottom.setStyle("display", function () {
		return this.getPanelProperty("height", 2) ? null : "none";
	});
	bottom.setStyle("height", height(2));
	if (AW.ie) {
		box.setStyle("padding-top", height(0));
		box.setStyle("padding-bottom", height(2));
	} else {
		middle.setStyle("top", height(0));
		middle.setStyle("bottom", height(2));
	}
	if (AW.ie && AW.strict) {
		box.setStyle("height", "expression(this.parentElement.clientHeight-this.firstChild.offsetHeight-this.lastChild.offsetHeight)");
	}
	function panel(i) {
		return function () {
			return this.getPanelTemplate(i);
		};
	}
	top.setContent("html", panel(0));
	middle.setContent("html", panel(1));
	bottom.setContent("html", panel(2));
	box.setContent("top", top);
	box.setContent("middle", middle);
	box.setContent("bottom", bottom);
	obj.setContent("box", box);
};
AW.Panels.Vertical = AW.System.Template.subclass();
AW.Panels.Vertical.create = function () {
	var obj = this.prototype;
	obj.setClass("vpanel", "template");
	var span = AW.HTML.SPAN;
	var box = new span;
	var left = new span;
	var center = new span;
	var right = new span;
	box.setClass("vpanel", "box");
	left.setClass("vpanel", "left");
	center.setClass("vpanel", "center");
	right.setClass("vpanel", "right");
	left.setContent("html", function () {
		return this.getPanelTemplate(0);
	});
	center.setContent("html", function () {
		return this.getPanelTemplate(1);
	});
	right.setContent("html", function () {
		return this.getPanelTemplate(2);
	});
	box.setContent("left", left);
	box.setContent("center", center);
	box.setContent("right", right);
	obj.setContent("box", box);
};
AW.Panels.Grid = AW.System.Template.subclass();
AW.Panels.Grid.create = function () {
	var obj = this.prototype;
	obj.setClass("gpanel", "template");
	var span = AW.HTML.SPAN;
	var box = new span;
	var top = new span;
	var middle = new span;
	var bottom = new span;
	box.setClass("gpanel", "box");
	top.setClass("gpanel", "top");
	middle.setClass("gpanel", "middle");
	bottom.setClass("gpanel", "bottom");
	function height(i) {
		return function () {
			return this.getPanelProperty("height", i) + "px";
		};
	}
	function width(i) {
		return function () {
			return this.getPanelProperty("width", i) + "px";
		};
	}
	function visibility(i) {
		return function () {
			return this.getPanelProperty("height", i) ? "inherit" : "hidden";
		};
	}
	top.setStyle("visibility", visibility(0));
	top.setStyle("height", height(0));
	bottom.setStyle("display", function () {
		return this.getPanelProperty("height", 2) ? null : "none";
	});
	bottom.setStyle("height", height(2));
	if (AW.ie) {
		box.setStyle("padding-top", height(0));
		box.setStyle("padding-bottom", height(2));
	}
	if (!AW.ie) {
		middle.setStyle("top", height(0));
		middle.setStyle("bottom", height(2));
	}
	if (AW.ie && AW.strict) {
		box.setStyle("height", "expression(this.parentElement.clientHeight-this.firstChild.offsetHeight-this.lastChild.offsetHeight)");
	}
	function panel(i, j) {
		return function () {
			return this.getPanelTemplate(i, j);
		};
	}
	var i, rows = [top, middle, bottom];
	for (i = 0; i < 3; i++) {
		var left = new span;
		var center = new span;
		var right = new span;
		left.setClass("gpanel", "left");
		center.setClass("gpanel", "center");
		right.setClass("gpanel", "right");
		left.setContent("html", panel(i, 0));
		center.setContent("html", panel(i, 1));
		right.setContent("html", panel(i, 2));
		if (AW.ie && AW.strict) {
			rows[i].setStyle("width", "expression(this.parentElement.clientWidth-this.firstChild.offsetWidth-this.lastChild.offsetWidth)");
		}
		rows[i].setContent("left", left);
		rows[i].setContent("center", center);
		rows[i].setContent("right", right);
	}
	box.setContent("top", top);
	box.setContent("middle", middle);
	box.setContent("bottom", bottom);
	obj.setContent("box", box);
};
AW.UI.Controllers.List = {onItemTemplateChanged:function (item) {
	item.setClass("list", "item");
	item.setClass("items", function () {
		return this.getControlProperty("state") || "normal";
	});
	item.setAttribute("aw", "item");
	item.mapModel("control", "item");
	item.mapModel("state", "item");
}, onContentTemplateChanged:function (view) {
	view.setClass("list", "template");
}};
AW.UI.Controllers.Actions = (function () {
	function clicked(event, index) {
		return index;
	}
	function current() {
		return this.getCurrentItem();
	}
	function first() {
		var p = this.getViewOffset();
		var a = this.getViewIndices();
		return a ? a[p] : p;
	}
	function last() {
		var p = this.getViewOffset() + this.getViewCount() - 1;
		var a = this.getViewIndices();
		return a ? a[p] : p;
	}
	function next() {
		var i = this.getCurrentItem();
		var p = Math.min(this.getViewPosition(i) + 1, this.getViewOffset() + this.getViewCount() - 1);
		var a = this.getViewIndices();
		return a ? a[p] : p;
	}
	function previous() {
		var i = this.getCurrentItem();
		var p = Math.max(this.getViewPosition(i) - 1, this.getViewOffset());
		var a = this.getViewIndices();
		return a ? a[p] : p;
	}
	function go(i) {
		this.setCurrentItem(i);
	}
	function select(i) {
		this.setSelectedItems([i]);
		this.setCurrentItem(i);
	}
	function toggle(i) {
		this.setItemSelected(!this.getItemSelected(i), i);
		if (i != this.getCurrentItem()) {
			this.setCurrentItem(i);
		}
	}
	function f(action, item) {
		return function (event, index) {
			var i = item.call(this, event, index);
			AW.setReturnValue(event, false);
			if (event && event.type == "mousedown") {
				this.setTimeout(function () {
					if (this.$active) {
						action.call(this, i);
					}
				});
			} else {
				if (this.$active) {
					action.call(this, i);
				}
			}
			event = null;
		};
	}
	return {gotoClickedItem:f(go, clicked), gotoPreviousItem:f(go, previous), gotoNextItem:f(go, next), gotoFirstItem:f(go, first), gotoLastItem:f(go, last), selectClickedItem:f(select, clicked), selectPreviousItem:f(select, previous), selectNextItem:f(select, next), selectFirstItem:f(select, first), selectLastItem:f(select, last), toggleClickedItem:f(toggle, clicked), toggleCurrentItem:f(toggle, current)};
})();
AW.UI.Controllers.Changes = (function () {
	function item(v, i) {
		this.getItemTemplate(i).refresh();
	}
	function view(indices) {
		var pos = [];
		for (var i = 0; i < indices.length; i++) {
			pos[indices[i]] = i;
		}
		this.setViewPosition(pos);
		this.refresh();
	}
	function selection(mode) {
		switch (mode) {
		  case "single":
			this.setController("selection", AW.UI.Controllers.Single);
			break;
		  case "multi":
			this.setController("selection", AW.UI.Controllers.Multi);
			break;
		}
	}
	return {onItemTextChanged:item, onItemImageChanged:item, onItemValueChanged:item, onItemLinkChanged:item, onItemTooltipChanged:item, onItemStateChanged:item, onViewIndicesChanged:view, onSelectionModeChanged:selection};
})();
AW.UI.Controllers.State = (function () {
	function itemSelected(value, index) {
		this.calculateItemState(index);
		var i, a = this.getSelectedItems();
		for (i = 0; i < a.length; i++) {
			if (a[i] == index) {
				if (!value) {
					a = a.concat();
					a.splice(i, 1);
					this.setSelectedItems(a);
				}
				return;
			}
		}
		if (value) {
			a = a.concat(index);
			this.setSelectedItems(a);
		}
	}
	var select = [], unselect = [];
	function selectedItems1(a) {
		var b = this.getSelectedItems();
		var i, before = {}, after = {};
		select = [];
		unselect = [];
		for (i = 0; i < b.length; i++) {
			before[b[i]] = true;
		}
		for (i = 0; i < a.length; i++) {
			after[a[i]] = true;
		}
		for (i = 0; i < b.length; i++) {
			if (!after[b[i]]) {
				unselect.push(b[i]);
			}
		}
		for (i = 0; i < a.length; i++) {
			if (!before[a[i]]) {
				select.push(a[i]);
			}
		}
	}
	function selectedItems2() {
		var i;
		for (i = 0; i < unselect.length; i++) {
			if (this.getItemSelected(unselect[i])) {
				this.setItemSelected(false, unselect[i]);
			}
		}
		for (i = 0; i < select.length; i++) {
			if (!this.getItemSelected(select[i])) {
				this.setItemSelected(true, select[i]);
			}
		}
	}
	var current;
	function currentItem1() {
		current = this.getCurrentItem();
	}
	function currentItem2(index) {
		this.calculateItemState(current);
		var e1 = this.getItemTemplate(current).getContent("box/text").element();
		if (e1 && index != current) {
			e1.tabIndex = -1;
		}
		e1 = null;
		this.calculateItemState(index);
		var e2 = this.getItemTemplate(index).getContent("box/text").element();
		if (e2 && e2.focus) {
			e2.tabIndex = this.getTabIndex();
			e2.focus();
		}
		e2 = null;
	}
	return {onItemSelectedChanged:itemSelected, onCurrentItemChanging:currentItem1, onCurrentItemChanged:currentItem2, onSelectedItemsChanging:selectedItems1, onSelectedItemsChanged:selectedItems2};
})();
AW.UI.Controllers.Single = {onKeyHome:"selectFirstItem", onKeyEnd:"selectLastItem", onKeyUp:"selectPreviousItem", onKeyDown:"selectNextItem", onKeyLeft:"selectPreviousItem", onKeyRight:"selectNextItem", onKeyPageUp:"selectPreviousPage", onKeyPageDown:"selectNextPage", onItemClicked:"selectClickedItem"};
AW.UI.Controllers.Multi = {onKeyHome:"selectFirstItem", onKeyEnd:"selectLastItem", onKeyUp:"selectPreviousItem", onKeyDown:"selectNextItem", onKeyPageUp:"selectPreviousPage", onKeyPageDown:"selectNextPage", onKeyCtrlHome:"gotoFirstItem", onKeyCtrlEnd:"gotoLastItem", onKeyCtrlUp:"gotoPreviousItem", onKeyCtrlDown:"gotoNextItem", onKeyCtrlPageUp:"gotoPreviousPage", onKeyCtrlPageDown:"gotoNextPage", onKeyCtrlSpace:"toggleCurrentItem", onKeySpace:"toggleCurrentItem", onItemClicked:"toggleClickedItem"};
AW.UI.Controllers.Checked = {onKeyHome:"gotoFirstItem", onKeyEnd:"gotoLastItem", onKeyUp:"gotoPreviousItem", onKeyDown:"gotoNextItem", onKeySpace:"toggleCurrentItem"};
AW.UI.ImageText = AW.System.Control.subclass();
AW.UI.ImageText.create = function () {
	AW.Templates.ImageText.create.call(this);
	var obj = this.prototype;
	obj.setClass("templates", "");
	obj.setClass("ui", "imagetext");
	obj.setClass("item", "control");
	obj.setClass("text", "expand");
	function _tabIndex() {
		return this.getTabProperty("index");
	}
	obj.getContent("box/text").setAttribute("tabIndex", _tabIndex);
	var _refresh = function () {
		this.refresh();
	};
	var itemController = {onControlTextChanged:_refresh, onControlImageChanged:_refresh, onControlValueChanged:_refresh, onControlLinkChanged:_refresh, onControlTooltipChanged:_refresh, onControlStateChanged:_refresh};
	obj.setController("item", itemController);
	obj.setEvent("onactivate", function (event) {
		var e = this.getContent("box/text").element();
		if (e && event.srcElement != e) {
			this.setTimeout(function () {
				if (this.$active) {
					e.setActive();
				}
			});
		}
	});
	obj.focus = function () {
		try {
			this.getContent("box/text").element().focus();
		}
		catch (err) {
		}
	};
	obj.onControlDisabledChanged = function (value) {
		this.setClass("disabled", value ? "control" : null);
		this.setAttribute("disabled", value ? true : null);
		this.getContent("box/text").setAttribute("disabled", value ? true : null);
	};
};
AW.UI.Label = AW.UI.ImageText.subclass();
AW.UI.Label.create = function () {
	var obj = this.prototype;
	obj.setClass("ui", "label");
	obj.setTabIndex(-1);
};
AW.UI.Group = AW.UI.ImageText.subclass();
AW.UI.Group.create = function () {
	var obj = this.prototype;
	obj.setTag("fieldset");
	obj.setClass("ui", "group");
	obj.setClass("text", "normal");
	obj.setTabIndex(-1);
	var box = obj.getContent("box");
	box.setTag("legend");
	box.setClass("item", "legend");
};
AW.UI.Button = AW.UI.ImageText.subclass();
AW.UI.Button.create = function () {
	var obj = this.prototype;
	obj.setClass("ui", "button");
	obj.setAttribute("awx", "button");
	var _click = function (event) {
		if (!this.getControlDisabled()) {
			this.raiseEvent("onClick", event);
		}
	};
	obj.setController("button", {onControlClicked:_click, onKeySpace:_click, onKeyEnter:_click});
};
AW.UI.Link = AW.UI.ImageText.subclass();
AW.UI.Link.create = function () {
	AW.Templates.Link.create.call(this);
	var obj = this.prototype;
	obj.setClass("ui", "link");
};
AW.UI.Input = AW.UI.ImageText.subclass();
AW.UI.Input.create = function () {
	var obj = this.prototype;
	obj.setClass("ui", "input");
	obj.setClass("input", "box");
	obj.setClass("text", "");
	var text = new AW.HTML.INPUT;
	text.setClass("item", "text");
	text.setAttribute("type", "text");
	text.setAttribute("value", function () {
		return this.getControlProperty("text");
	});
	text.setAttribute("tabIndex", function () {
		return this.getTabProperty("index");
	});
	if (!AW.safari) {
		obj.setContent("box/text", text);
	}
	var _edit = function () {
		this.setTimeout(function () {
			if (this.$active) {
				this.startEdit();
			}
		});
	};
	var _refresh = function () {
		this.refresh();
	};
	var _text = function () {
		var e = this.getContent("box/text").element();
		var text = this.getControlProperty("text");
		var input = e && ((e.tagName == "input") || (e.tagName == "INPUT"));
		if (input) {
			if (e && e.value != text) {
				e.value = text;
			}
		} else {
			if (e && e.innerHTML != text) {
				e.innerHTML = text;
			}
		}
	};
	var itemController = {onControlActivated:_edit, onControlTextChanged:_text, onControlImageChanged:_refresh, onControlValueChanged:_text, onControlLinkChanged:_refresh, onControlTooltipChanged:_refresh, onControlStateChanged:_refresh};
	obj.setController("item", itemController);
};
AW.UI.Password = AW.UI.Input.subclass();
AW.UI.Password.create = function () {
	var obj = this.prototype;
	obj.getContent("box/text").setAttribute("type", "password");
};
AW.UI.List = AW.System.Control.subclass();
AW.UI.List.create = function () {
	var obj = this.prototype;
	var _super = this.superclass.prototype;
	obj.setClass("ui", "list");
	obj.setClass("list", "control");
	obj.setClass("flow", "vertical");
	obj.setClass("text", "normal");
	var box = new AW.HTML.SPAN;
	box.setClass("list", "box");
	if (AW.gecko) {
		box.setAttribute("tabIndex", "-1");
	}
	if (AW.ie && AW.strict) {
		box.setStyle("width", "expression(this.parentElement.offsetWidth-4)");
	}
	box.setContent("html", function () {
		return this.getLayoutTemplate();
	});
	obj.setContent("box", box);
	var UI = AW.UI.Controllers;
	obj.setController("list", UI.List);
	obj.setController("actions", UI.Actions);
	obj.setController("changes", UI.Changes);
	obj.setController("selection", UI.Single);
	obj.setController("state", UI.State);
	obj.defineTemplate("layout", function () {
		return this.getScrollTemplate();
	});
	obj.defineTemplate("scroll", function () {
		return this.getContentTemplate();
	});
	obj.defineTemplate("content", new AW.Templates.List);
	obj.defineTemplate("item", new AW.Templates.ImageText);
	function value(i) {
		var text = this.getItemText(i);
		var format = this.getItemFormat(i);
		return format ? format.textToValue(text) : text;
	}
	function count() {
		return this.getItemCount();
	}
	function position(i) {
		return Number(i);
	}
	var models = {item:{count:0, text:"", image:"", link:"", value:value, format:"", tooltip:"", state:"", selected:false}, view:{count:count, position:position, offset:0, expanded:false}, selection:{mode:"single"}, current:{item:0}};
	obj.defineModel("item", models.item);
	obj.defineModel("view", models.view);
	obj.defineModel("current", models.current);
	obj.defineModel("selected", {});
	obj.defineModel("selection", models.selection);
	obj.defineModel("state", {});
	obj.defineViewProperty("indices", "", true);
	obj.defineSelectedProperty("items", [], true);
	obj.calculateItemState = function (i) {
		var state = "";
		if (this.getCurrentItem() == i) {
			state = "current";
		}
		if (this.getItemSelected(i)) {
			state = "selected";
		}
		if (this.getItemState(i) != state) {
			this.setItemState(state, i);
		}
	};
	obj.toString = function () {
		this.setTimeout(function () {
			try {
				var i = this.getCurrentItem();
				var t = this.getTabIndex();
				this.getItemTemplate(i).getContent("box/text").element().tabIndex = t;
			}
			catch (err) {
			}
		});
		return _super.toString.call(this);
	};
	obj.focus = function () {
		try {
			var i = this.getCurrentItem();
			this.getItemTemplate(i).getContent("box/text").element().focus();
		}
		catch (err) {
		}
	};
	obj.onControlDisabledChanged = function (value) {
		this.setClass("disabled", value ? "control" : null);
		this.setAttribute("disabled", value ? true : null);
	};
};
AW.UI.Tabs = AW.UI.List.subclass();
AW.UI.Tabs.create = function () {
	var obj = this.prototype;
	obj.setClass("ui", "tabs");
	obj.setClass("text", "expand");
	obj.setClass("flow", "horizontal");
};
AW.UI.Combo = AW.UI.List.subclass();
AW.UI.Combo.create = function () {
	AW.UI.ImageText.create.call(this);
	AW.UI.Input.create.call(this);
	AW.Templates.Combo.create.call(this);
	var obj = this.prototype;
	obj.setClass("ui", "combo");
	obj.setClass("input", "");
	obj.defineTemplate("popup", new AW.Templates.Frame);
	obj.onCurrentItemChanged = function (i) {
		var text = this.getItemText(i);
		this.setControlText(text);
		this.hidePopup();
		var e = this.getContent("box/text").element();
		if (AW.safari) {
			e.innerHTML = text;
		} else {
			e.value = text;
			e.select();
		}
		e = null;
	};
	obj.setController("selection", {onKeyUp:"selectPreviousItem", onKeyDown:"selectNextItem", onItemClicked:"selectClickedItem"});
};
AW.UI.CheckBox = AW.UI.ImageText.subclass();
AW.UI.CheckBox.create = function () {
	AW.Templates.CheckBox.create.call(this);
	var obj = this.prototype;
	obj.setClass("ui", "checkbox");
	obj.setControlProperty("value", false);
	obj.setEvent("onclick", "");
	var _toggle = function () {
		if (!this.getControlDisabled()) {
			this.setControlValue(!this.getControlValue());
		}
	};
	obj.setController("checkbox", {onKeySpace:_toggle, onControlClicked:_toggle});
};
AW.UI.Checkbox = AW.UI.CheckBox;
AW.UI.CheckedList = AW.UI.List.subclass();
AW.UI.CheckedList.create = function () {
	var obj = this.prototype;
	obj.setClass("ui", "checkedlist");
	obj.setItemTemplate(new AW.Templates.CheckedItem);
	obj.setController("selection", AW.UI.Controllers.Checked);
};
AW.UI.Radio = AW.UI.CheckedList.subclass();
AW.UI.Radio.create = function () {
	var obj = this.prototype;
	obj.setClass("ui", "radio");
	obj.setItemTemplate(new AW.Templates.Radio);
	obj.setSelectionMode("single");
};
AW.Grid.Controllers.Actions = (function () {
	function arg1(event, i, j) {
		return i;
	}
	function arg2(event, i, j) {
		return j;
	}
	function sameColumn() {
		return this.getCurrentColumn();
	}
	function firstColumn() {
		var p = this.getColumnOffset();
		var a = this.getColumnIndices();
		return a ? a[p] : p;
	}
	function lastColumn() {
		var p = this.getColumnOffset() + this.getColumnCount() - 1;
		var a = this.getColumnIndices();
		return a ? a[p] : p;
	}
	function nextColumn() {
		var i = this.getCurrentColumn();
		var p = Math.min(this.getColumnPosition(i) + 1, this.getColumnOffset() + this.getColumnCount() - 1);
		var a = this.getColumnIndices();
		return a ? a[p] : p;
	}
	function previousColumn() {
		var i = this.getCurrentColumn();
		var p = Math.max(this.getColumnPosition(i) - 1, this.getColumnOffset());
		var a = this.getColumnIndices();
		return a ? a[p] : p;
	}
	function sameRow() {
		return this.getCurrentRow();
	}
	function firstRow() {
		var p = this.getRowOffset();
		var a = this.getRowIndices();
		return a ? a[p] : p;
	}
	function lastRow() {
		var p = this.getRowOffset() + this.getRowCount() - 1;
		var a = this.getRowIndices();
		return a ? a[p] : p;
	}
	function nextRow() {
		var i = this.getCurrentRow();
		var p = Math.min(this.getRowPosition(i) + 1, this.getRowOffset() + this.getRowCount() - 1);
		var a = this.getRowIndices();
		return a ? a[p] : p;
	}
	function previousRow() {
		var i = this.getCurrentRow();
		var p = Math.max(this.getRowPosition(i) - 1, this.getRowOffset());
		var a = this.getRowIndices();
		return a ? a[p] : p;
	}
	function pageUpRow() {
		var i = this.getCurrentRow();
		var p = Math.max(this.getRowPosition(i) - 10, this.getRowOffset());
		var a = this.getRowIndices();
		return a ? a[p] : p;
	}
	function pageDownRow() {
		var i = this.getCurrentRow();
		var p = Math.min(this.getRowPosition(i) + 10, this.getRowOffset() + this.getRowCount() - 1);
		var a = this.getRowIndices();
		return a ? a[p] : p;
	}
	function includeCell(c, r) {
		var start, end, i, a;
		var cc = this.getSelectedColumns();
		if (!cc.length) {
			this.setSelectedColumns([c]);
		} else {
			start = this.getColumnPosition(cc[0]);
			end = this.getColumnPosition(c);
			a = this.getColumnIndices();
			cc = [];
			if (start < end) {
				for (i = start; i <= end; i++) {
					cc.push(a ? a[i] : i);
				}
			} else {
				for (i = start; i >= end; i--) {
					cc.push(a ? a[i] : i);
				}
			}
			this.setSelectedColumns(cc);
		}
		var rr = this.getSelectedRows();
		if (!rr.length) {
			this.setSelectedRows([r]);
		} else {
			start = this.getRowPosition(rr[0]);
			end = this.getRowPosition(r);
			a = this.getRowIndices();
			rr = [];
			if (start < end) {
				for (i = start; i <= end; i++) {
					rr.push(a ? a[i] : i);
				}
			} else {
				for (i = start; i >= end; i--) {
					rr.push(a ? a[i] : i);
				}
			}
			this.setSelectedRows(rr);
		}
		if (c != this.getCurrentColumn()) {
			this.setCurrentColumn(c);
		}
		if (r != this.getCurrentRow()) {
			this.setCurrentRow(r);
		}
	}
	function selectCell(c, r) {
		var cc = this.getSelectedColumns();
		if (cc.length != 1 || cc[0] != c) {
			this.setSelectedColumns([c]);
		}
		var rr = this.getSelectedRows();
		if (rr.length != 1 || rr[0] != r) {
			this.setSelectedRows([r]);
		}
		if (c != this.getCurrentColumn()) {
			this.setCurrentColumn(c);
		}
		if (r != this.getCurrentRow()) {
			this.setCurrentRow(r);
		}
	}
	function includeRow(r) {
		var rr = this.getSelectedRows();
		if (!rr.length) {
			this.setSelectedRows([r]);
		} else {
			var start = this.getRowPosition(rr[0]);
			var end = this.getRowPosition(r);
			var i, a = this.getRowIndices();
			rr = [];
			if (start < end) {
				for (i = start; i <= end; i++) {
					rr.push(a ? a[i] : i);
				}
			} else {
				for (i = start; i >= end; i--) {
					rr.push(a ? a[i] : i);
				}
			}
			this.setSelectedRows(rr);
		}
		if (r != this.getCurrentRow()) {
			this.setCurrentRow(r);
		}
	}
	function selectRow(r) {
		var rr = this.getSelectedRows();
		if (rr.length != 1 || rr[0] != r) {
			this.setSelectedRows([r]);
		}
		if (r != this.getCurrentRow()) {
			this.setCurrentRow(r);
		}
	}
	function gotoRow(r) {
		this.setCurrentRow(r);
	}
	function toggleRow(r) {
		this.setRowSelected(!this.getRowSelected(r), r);
	}
	var todo;
	function deferred() {
		if (todo) {
			todo.call(this);
			todo = null;
		}
	}
	function f(action, column, row) {
		return function (event, i, j) {
			var undef;
			var c = column ? column.call(this, event, i, j) : undef;
			var r = row ? row.call(this, event, i, j) : undef;
			if (event && event.type == "mousedown") {
				todo = function () {
					action.call(this, c, r);
				};
				this.setTimeout(function () {
					if (this.$active && !this.$edit && todo) {
						todo.call(this);
					}
					todo = null;
					if (AW.gecko) {
						try {
							window.getSelection().collapseToEnd();
						}
						catch (err) {
						}
					}
				});
			} else {
				if (this.$edit) {
					try {
						this.getContent("focus").element().focus();
					}
					catch (err) {
					}
				}
				if (this.$active && !this.$edit) {
					action.call(this, c, r);
				}
				if (AW.gecko) {
					try {
						window.getSelection().collapseToEnd();
					}
					catch (err) {
					}
				}
				AW.setReturnValue(event, false);
			}
			event = null;
		};
	}
	return {toggleClickedRow:f(toggleRow, arg1), gotoClickedRow:f(gotoRow, arg1), gotoPreviousRow:f(gotoRow, previousRow), gotoNextRow:f(gotoRow, nextRow), gotoFirstRow:f(gotoRow, firstRow), gotoLastRow:f(gotoRow, lastRow), gotoPageUpRow:f(gotoRow, pageUpRow), gotoPageDownRow:f(gotoRow, pageDownRow), selectClickedRow:f(selectRow, arg1), selectPreviousRow:f(selectRow, previousRow), selectNextRow:f(selectRow, nextRow), selectFirstRow:f(selectRow, firstRow), selectLastRow:f(selectRow, lastRow), selectPageUpRow:f(selectRow, pageUpRow), selectPageDownRow:f(selectRow, pageDownRow), includeClickedRow:f(includeRow, arg1), includePreviousRow:f(includeRow, previousRow), includeNextRow:f(includeRow, nextRow), includeFirstRow:f(includeRow, firstRow), includeLastRow:f(includeRow, lastRow), includePageUpRow:f(includeRow, pageUpRow), includePageDownRow:f(includeRow, pageDownRow), selectClickedCell:f(selectCell, arg1, arg2), selectLowerCell:f(selectCell, sameColumn, nextRow), selectUpperCell:f(selectCell, sameColumn, previousRow), selectTopCell:f(selectCell, sameColumn, firstRow), selectBottomCell:f(selectCell, sameColumn, lastRow), selectNextCell:f(selectCell, nextColumn, sameRow), selectPreviousCell:f(selectCell, previousColumn, sameRow), selectFirstCell:f(selectCell, firstColumn, sameRow), selectLastCell:f(selectCell, lastColumn, sameRow), selectTopLeftCell:f(selectCell, firstColumn, firstRow), selectBottomRightCell:f(selectCell, lastColumn, lastRow), selectPageUpCell:f(selectCell, sameColumn, pageUpRow), selectPageDownCell:f(selectCell, sameColumn, pageDownRow), includeClickedCell:f(includeCell, arg1, arg2), includeLowerCell:f(includeCell, sameColumn, nextRow), includeUpperCell:f(includeCell, sameColumn, previousRow), includeTopCell:f(includeCell, sameColumn, firstRow), includeBottomCell:f(includeCell, sameColumn, lastRow), includeNextCell:f(includeCell, nextColumn, sameRow), includePreviousCell:f(includeCell, previousColumn, sameRow), includeFirstCell:f(includeCell, firstColumn, sameRow), includeLastCell:f(includeCell, lastColumn, sameRow), includeTopLeftCell:f(includeCell, firstColumn, firstRow), includeBottomRightCell:f(includeCell, lastColumn, lastRow), includePageUpCell:f(includeCell, sameColumn, pageUpRow), includePageDownCell:f(includeCell, sameColumn, pageDownRow), onCellMouseUp:f(deferred)};
})();
AW.Grid.Controllers.Size = (function () {
	function init() {
		this._rowHeight = this.getContent("sample").element().offsetHeight;
		if (!this._columnWidth1) {
			this._columnWidth1 = [];
		}
		var i, ii, n = this.getColumnCount(), a = this.getColumnIndices();
		var hrow = this.$extended ? 0 : undefined;
		for (i = 0; i < n; i++) {
			ii = a ? a[i] : i;
			this._columnWidth1[ii] = this.getHeaderTemplate(ii, hrow).element().offsetWidth;
		}
		var lw = 0, lc = this.$extended ? this.getFixedLeft() : 0;
		var mw = 0, c = this.getColumnCount();
		var rw = 0, rc = this.$extended ? this.getFixedRight() : 0;
		lw = this.getSelectorVisible() ? this.getSelectorWidth() : lw;
		if (!this.$extended) {
			mw = lw;
			lw = 0;
		}
		for (i = 0; i < lc; i++) {
			lw += this.getColumnWidth(a ? a[i] : i);
		}
		for (i = c - rc; i < c; i++) {
			rw += this.getColumnWidth(a ? a[i] : i);
		}
		this.setContentWidth(lw, 0);
		this.setContentWidth(rw, 2);
	}
	function footer() {
		var i, h = 0, count = this.$extended ? this.getFooterCount() : 1, a = this.getFooterIndices();
		if (this.getFooterVisible()) {
			for (i = 0; i < count; i++) {
				h += this.getFooterHeight(a ? a[i] : i);
			}
		}
		this.setContentHeight(h, 2);
	}
	function header() {
		var i, h = 0, count = this.$extended ? this.getHeaderCount() : 1, a = this.getHeaderIndices();
		if (this.getHeaderVisible()) {
			for (i = 0; i < count; i++) {
				h += this.getHeaderHeight(a ? a[i] : i);
			}
		}
		this.setContentHeight(h, 0);
	}
	return {onHeaderVisibleChanged:header, onHeaderHeightChanged:header, onHeaderCountChanged:header, onFooterVisibleChanged:footer, onFooterHeightChanged:footer, onFooterCountChanged:footer, paint:init};
})();
AW.Grid.Controllers.Cell = (function () {
	function refresh(value, col, row) {
		if (this.$edit && this.$editCol == col && this.$editRow == row) {
			return;
		}
		this.getCellTemplate(col, row).refresh();
	}
	function refreshClasses(value, col, row) {
		this.getCellTemplate(col, row).refreshClasses();
	}
	function cellData(val, col, row) {
		function dataToText(i, j) {
			var data = this.getCellData(i, j);
			var format = this.getCellFormat(i, j);
			return format ? format.dataToText(data) : data;
		}
		function dataToValue(i, j) {
			var data = this.getCellData(i, j);
			var format = this.getCellFormat(i, j);
			return format ? format.dataToValue(data) : data;
		}
		this.setCellText(dataToText, col, row);
		this.setCellValue(dataToValue, col, row);
	}
	function tooltip(event, col, row) {
		var e = this.getCellTemplate(col, row).element();
		var s = this.getCellTooltip(col, row);
		if (e) {
			e.setAttribute("title", s);
		}
		e = null;
	}
	function calcState(v, i, j) {
		this.calculateCellState(i, j);
	}
	function startEdit(event) {
		var c = this.getCurrentColumn();
		var r = this.getCurrentRow();
		if (!this.getCellEditable(c, r)) {
			return;
		}
		var t = this.getCellTemplate(c, r);
		if (t.startEdit && !this.$edit) {
			this.$editCol = c;
			this.$editRow = r;
			if (event && event.type == "keypress") {
				if (event.keyCode != 27) {
					t.startEdit(String.fromCharCode(event.keyCode || event.charCode));
				}
			} else {
				t.startEdit();
			}
			AW.setReturnValue(event, false);
		}
	}
	return {onKeyPress:startEdit, editCurrentCell:startEdit, onCellMouseOver:tooltip, onCellSelectedChanged:calcState, onCellDataChanged:cellData, onCellTextChanged:refresh, onCellLinkChanged:refresh, onCellImageChanged:refresh, onCellValueChanged:refresh, onCellStateChanged:refreshClasses};
})();
AW.Grid.Controllers.Row = (function () {
	function refresh(value, row) {
		this.getRowTemplate(row).refreshClasses();
	}
	function addRow(row) {
		var count = this.getRowCount();
		var a = this.getRowIndices();
		if (count < 2) {
			this.refresh();
			return;
		}
		var prev = a[count - 2];
		if (!this.$extended) {
			e = this.getRowTemplate(prev).element();
			if (e) {
				AW.setOuterHTML(e, this.getRowTemplate(prev).toString() + this.getRowTemplate(row).toString());
			}
			e = null;
		} else {
			for (i = 0; i < 3; i++) {
				e = this.getRowTemplate(prev, i).element();
				if (e) {
					AW.setOuterHTML(e, this.getRowTemplate(prev, i).toString() + this.getRowTemplate(row, i).toString());
				}
				e = null;
			}
		}
		this.raiseEvent("adjustScrollHeight");
	}
	function removeRow(row) {
		var i, e;
		if (!this.$extended) {
			e = this.getRowTemplate(row).element();
			if (e) {
				AW.setOuterHTML(e, "");
			}
			e = null;
		} else {
			for (i = 0; i < 3; i++) {
				e = this.getRowTemplate(row, i).element();
				if (e) {
					AW.setOuterHTML(e, "");
				}
				e = null;
			}
		}
		this.raiseEvent("adjustScrollHeight");
	}
	function calcRowState(v, i) {
		this.calculateRowState(i);
	}
	return {onRowAdded:addRow, onRowDeleted:removeRow, onRowSelectedChanged:calcRowState, onRowStateChanged:refresh};
})();
AW.Grid.Controllers.View = {onRowIndicesChanged:function (indices) {
	var positions = [];
	for (var i = 0; i < indices.length; i++) {
		positions[indices[i]] = i;
	}
	this.setRowPosition(positions);
	this.refresh();
}, onColumnIndicesChanged:function (indices) {
	var positions = [];
	for (var i = 0; i < indices.length; i++) {
		positions[indices[i]] = i;
	}
	this.setColumnPosition(positions);
	this.setColumnCount(indices.length);
	this.refresh();
}};
AW.Grid.Controllers.Navigation = (function () {
	var c1 = [], r1 = [];
	function sync1() {
		c1 = this.getSelectedColumns().concat();
		r1 = this.getSelectedRows().concat();
	}
	function sync2() {
		var mode = this.getCurrentSelection();
		var c2 = this.getSelectedColumns();
		var r2 = this.getSelectedRows();
		var i, j, x1 = {}, x2 = {};
		if (mode == "cell") {
			for (i = 0; i < c1.length; i++) {
				x1[c1[i]] = {};
				for (j = 0; j < r1.length; j++) {
					x1[c1[i]][r1[j]] = true;
				}
			}
			for (i = 0; i < c2.length; i++) {
				x2[c2[i]] = {};
				for (j = 0; j < r2.length; j++) {
					x2[c2[i]][r2[j]] = true;
				}
			}
			for (i = 0; i < c1.length; i++) {
				for (j = 0; j < r1.length; j++) {
					if ((!x2[c1[i]] || !x2[c1[i]][r1[j]]) && this.getCellSelected(c1[i], r1[j])) {
						this.setCellSelected(false, c1[i], r1[j]);
					}
				}
			}
			for (i = 0; i < c2.length; i++) {
				for (j = 0; j < r2.length; j++) {
					if ((!x1[c2[i]] || !x1[c2[i]][r2[j]]) && !this.getCellSelected(c2[i], r2[j])) {
						this.setCellSelected(true, c2[i], r2[j]);
					}
				}
			}
		} else {
			if (mode == "row") {
				for (i = 0; i < r1.length; i++) {
					x1[r1[i]] = true;
				}
				for (i = 0; i < r2.length; i++) {
					x2[r2[i]] = true;
				}
				for (i = 0; i < r1.length; i++) {
					if (!x2[r1[i]] && this.getRowSelected(r1[i])) {
						this.setRowSelected(false, r1[i]);
					}
				}
				for (i = 0; i < r2.length; i++) {
					if (!x1[r2[i]] && !this.getRowSelected(r2[i])) {
						this.setRowSelected(true, r2[i]);
					}
				}
			}
		}
	}
	function syncRows(value, index) {
		var i, a = this.getSelectedRows();
		for (i = 0; i < a.length; i++) {
			if (a[i] == index) {
				if (!value) {
					a = a.concat();
					a.splice(i, 1);
					this.setSelectedRows(a);
				}
				return;
			}
		}
		if (value) {
			a = a.concat(index);
			this.setSelectedRows(a);
		}
	}
	return {onSelectedColumnsChanging:sync1, onSelectedColumnsChanged:sync2, onSelectedRowsChanging:sync1, onSelectedRowsChanged:sync2, onRowSelectedChanged:syncRows, onSelectionModeChanged:function (mode) {
		switch (mode) {
		  case "none":
			this.setController("selection", {});
			this.setCurrentSelection("none");
			break;
		  case "single-cell":
			this.setController("selection", AW.Grid.Controllers.SingleCell);
			this.setCurrentSelection("cell");
			break;
		  case "single-row":
			this.setController("selection", AW.Grid.Controllers.SingleRow);
			this.setCurrentSelection("row");
			break;
		  case "multi-cell":
			this.setController("selection", AW.Grid.Controllers.MultiCell);
			this.setCurrentSelection("cell");
			break;
		  case "multi-row":
			this.setController("selection", AW.Grid.Controllers.MultiRow);
			this.setCurrentSelection("row");
			break;
		  case "multi-row-marker":
			this.setController("selection", AW.Grid.Controllers.MultiRowMarker);
			this.setCurrentSelection("row");
			var checkbox = new AW.Templates.CheckedItem;
			this.setCellTemplate(checkbox, 0);
			break;
		}
	}};
})();
AW.Grid.Controllers.Sort = {doSort:function (src, index, header) {
	if (this.$edit) {
		return;
	}
	if (!(header == "0" || typeof (header) == "undefined")) {
		return;
	}
	var format = this.getCellFormat(index);
	function compare(values, pos, dir) {
		var greater = 1, less = -1;
		if (dir == "descending") {
			greater = -1;
			less = 1;
		}
		var equal = function (i, j) {
			var a = pos[i];
			var b = pos[j];
			if (a > b) {
				return 1;
			}
			if (a < b) {
				return -1;
			}
			return 0;
		};
		var error = function () {
			return 0;
		};
		var types = {"undefined":0, "boolean":1, "number":2, "string":3, "object":4, "function":5};
		if (format) {
			return format.comparator(values, greater, less, equal, error);
		} else {
			if ("".localeCompare) {
				return function (i, j) {
					try {
						var a = values[i], b = values[j], x, y;
						if (typeof (a) != typeof (b)) {
							x = types[typeof (a)];
							y = types[typeof (b)];
							if (x > y) {
								return greater;
							}
							if (x < y) {
								return less;
							}
						} else {
							if (typeof (a) == "number") {
								if (a > b) {
									return greater;
								}
								if (a < b) {
									return less;
								}
								return equal(i, j);
							} else {
								return (greater * (("" + a).localeCompare(b))) || equal(i, j);
							}
						}
					}
					catch (e) {
						return error(i, j, e);
					}
				};
			} else {
				return function (i, j) {
					try {
						var a = values[i], b = values[j], x, y;
						if (typeof (a) != typeof (b)) {
							x = types[typeof (a)];
							y = types[typeof (b)];
							if (x > y) {
								return greater;
							}
							if (x < y) {
								return less;
							}
						} else {
							if (a > b) {
								return greater;
							}
							if (a < b) {
								return less;
							}
						}
						return equal(i, j);
					}
					catch (e) {
						return error(i, j, e);
					}
				};
			}
		}
	}
	var direction = this.getSortDirection(index);
	if (direction != "ascending") {
		direction = "ascending";
	} else {
		direction = "descending";
	}
	if (src == "ascending" || src == "descending") {
		direction = src;
	}
	var i, value = {}, pos = {};
	var offset = this.getRowOffset();
	var count = this.getRowCount();
	var rows = this.getRowIndices();
	if (!rows) {
		rows = [];
		for (i = 0; i < count; i++) {
			rows[i] = i + offset;
		}
	} else {
		rows = rows.slice(offset, offset + count);
	}
	for (i = 0; i < rows.length; i++) {
		value[rows[i]] = this.getCellValue(index, rows[i]);
		pos[rows[i]] = i;
	}
	rows.sort(compare(value, pos, direction));
	var a = [];
	for (i = 0; i < offset; i++) {
		a[i] = i;
	}
	rows = a.concat(rows);
	var old = this.getSortColumn();
	if (old != -1) {
		this.setSortDirection("", old);
	}
	this.setSortColumn(index);
	this.setSortDirection(direction, index);
	this.setRowIndices(rows);
}, onHeaderClicked:function (src, index, header) {
	if (this.$active) {
		AW.Grid.Controllers.Sort.doSort.call(this, src, index, header);
	}
}};
AW.Grid.Controllers.Overflow = {onScrollLeftChanged:function (x) {
	var e = this.getScrollTemplate().element();
	if (e) {
		e.firstChild.scrollLeft = x;
	}
}, onScrollTopChanged:function (y) {
	var e = this.getScrollTemplate().element();
	if (e) {
		e.firstChild.scrollTop = y;
	}
}, onScrollWidthChanged:function (w) {
	var e = this.getScrollTemplate().element();
	if (e) {
		e.firstChild.firstChild.style.width = w + "px";
		if (AW.ie) {
			e.firstChild.className += "";
		}
	}
}, onScrollHeightChanged:function (h) {
	var e = this.getScrollTemplate().element();
	if (e) {
		e.firstChild.firstChild.style.height = h + "px";
		if (AW.ie) {
			e.firstChild.className += "";
		}
	}
}, onScrollBarsChanged:function (x) {
	this.getScrollTemplate().refreshClasses();
}, adjustScrollBars:function () {
	var e = this.getScrollTemplate().element();
	if (!e) {
		return;
	}
	if (AW.gecko) {
		this.setTimeout(function () {
			try {
				e.lastChild.style.overflow = "auto";
				e = null;
			}
			catch (err) {
			}
		});
	}
	var s, x, y;
	var l = this.getScrollLeft();
	var t = this.getScrollTop();
	var w = this.getScrollWidth();
	var h = this.getScrollHeight();
	var ww = e.offsetWidth;
	var hh = e.offsetHeight;
	if (AW.ie6 && AW.strict) {
		this.setTimeout(function () {
			try {
				e.lastChild.style.width = (ww - 20) + "px";
				e.lastChild.style.height = (hh - 20) + "px";
				e = null;
			}
			catch (err) {
			}
		});
	}
	if (w < ww && h < hh) {
		s = "none";
		x = 0;
		y = 0;
	} else {
		if (w < ww - 16) {
			s = "vertical";
			x = 20;
			y = 0;
		} else {
			if (h < hh - 16) {
				s = "horizontal";
				x = 0;
				y = 20;
			} else {
				s = "both";
				x = 20;
				y = 20;
			}
		}
	}
	if (this.getScrollBars() != s) {
		this.setScrollBars(s);
	}
	if (w - l < ww - x) {
		var ll = Math.max(0, w - ww + x);
		if (ll != l) {
			this.setScrollLeft(ll);
		}
	}
	if (h - t < hh - y) {
		var tt = Math.max(0, h - hh + y);
		if (tt != t) {
			this.setScrollTop(tt);
		}
	}
	this.setContentHeight(hh - y - this.getContentHeight(0) - this.getContentHeight(2), 1);
	this.setContentWidth(ww - x - this.getContentWidth(0) - this.getContentWidth(2), 1);
}, onColumnWidthChanged:function () {
	var i, a = this.getColumnIndices();
	var lw = 0, lc = this.$extended ? this.getFixedLeft() : 0;
	var mw = 0, c = this.getColumnCount();
	var rw = 0, rc = this.$extended ? this.getFixedRight() : 0;
	lw = this.getSelectorVisible() ? this.getSelectorWidth() : lw;
	if (!this.$extended) {
		mw = lw;
		lw = 0;
	}
	for (i = 0; i < lc; i++) {
		lw += this.getColumnWidth(a ? a[i] : i);
	}
	for (i = c - rc; i < c; i++) {
		rw += this.getColumnWidth(a ? a[i] : i);
	}
	this.setContentWidth(lw, 0);
	this.setContentWidth(rw, 2);
}, paint:function () {
	this.setTimeout(function () {
		var e = this.getContent("box/block").element();
	});
	var x = this.getScrollLeft();
	var y = this.getScrollTop();
	this.raiseEvent("adjustScrollWidth");
	this.raiseEvent("adjustScrollHeight");
	if (x) {
		this.raiseEvent("onScrollLeftChanged", x);
	}
	if (y) {
		this.raiseEvent("onScrollTopChanged", y);
	}
	this.raiseEvent("adjustScrollBars");
	if (x) {
		this.setTimeout(function () {
			this.raiseEvent("onScrollLeftChanged", x);
		});
	}
	if (y) {
		this.setTimeout(function () {
			this.raiseEvent("onScrollTopChanged", y);
		});
	}
	if (AW.ie) {
		var e = this.getScrollTemplate().element();
		if (e) {
			e.className += "";
			e = null;
		}
	}
}};
AW.Grid.Controllers.Scroll = {onScrollLeftChanged:function (x) {
	var e1 = this.getRowsTemplate().element();
	var e2 = this.getHeadersTemplate().element();
	var e3 = this.getFootersTemplate().element();
	if (AW.gecko) {
		AW.ignoreMouse = true;
	}
	if (e1) {
		e1.parentNode.scrollLeft = x;
	}
	if (e2) {
		e2.parentNode.scrollLeft = x;
	}
	if (e3) {
		e3.parentNode.scrollLeft = x;
	}
	if (AW.gecko) {
		this.setTimeout(function () {
			AW.ignoreMouse = false;
		});
	}
}, onScrollTopChanged:function (y) {
	var e = this.getRowsTemplate().element();
	if (AW.gecko) {
		AW.ignoreMouse = true;
	}
	if (e) {
		e.parentNode.scrollTop = y;
	}
	if (AW.gecko) {
		this.setTimeout(function () {
			AW.ignoreMouse = false;
		});
	}
}, adjustScrollWidth:function () {
	var a = this.getColumnIndices();
	var c = this.getColumnCount();
	var w = this.getSelectorVisible() ? this.getSelectorWidth() : 0;
	for (var i = 0; i < c; i++) {
		w += this.getColumnWidth(a ? a[i] : i);
	}
	this.setScrollWidth(w + 3);
}, adjustScrollHeight:function () {
	var h = this.getRowCount() * this.getRowHeight();
	h += this.getContentHeight(0);
	h += this.getContentHeight(2);
	this.setScrollHeight(h + 3);
}};
AW.Grid.Controllers.Width = (function () {
	function adjustScrollWidth() {
		if (this.element()) {
			this.setTimeout(function () {
				this.raiseEvent("adjustScrollWidth");
				this.raiseEvent("adjustScrollBars");
				if (AW.ie && this.getScrollTemplate().element()) {
					this.getScrollTemplate().element().className += "";
				}
			});
		}
	}
	function adjustScrollHeight() {
		if (this.element()) {
			this.setTimeout(function () {
				this.raiseEvent("adjustScrollHeight");
				this.raiseEvent("adjustScrollBars");
			});
		}
	}
	function setStyle(selector, attribute, value) {
		try {
			var i, ss = document.styleSheets[document.styleSheets.length - 1];
			var rules = AW.getRules(ss);
			for (i = 0; i < rules.length; i++) {
				if (rules[i].selectorText == selector) {
					rules[i].style[attribute] = value;
					return;
				}
			}
			AW.addRule(ss, selector, attribute + ":" + value);
		}
		catch (err) {
		}
	}
	return {onColumnWidthChanged:function (width, column) {
		if (typeof (width) == "object") {
			if (this.element()) {
				this.element().innerHTML = "";
			}
			var i, a = [];
			for (i in width) {
				if (!a[i]) {
					setStyle("#" + this.getId() + " .aw-column-" + i, "width", (width[i] - AW.dx) + "px");
				}
			}
			if (this.element()) {
				this.refresh();
			}
		} else {
			if (column === undefined) {
				setStyle("#" + this.getId() + " .aw-grid-cell", "width", (width - AW.dx) + "px");
				setStyle("#" + this.getId() + " .aw-grid-header", "width", (width - AW.dx) + "px");
				setStyle("#" + this.getId() + " .aw-grid-footer", "width", (width - AW.dx) + "px");
			} else {
				setStyle("#" + this.getId() + " .aw-column-" + column, "width", (width - AW.dx) + "px");
			}
		}
		adjustScrollWidth.call(this);
	}, onSelectorWidthChanged:function (width) {
		setStyle("#" + this.getId() + " .aw-row-selector", "width", (width - AW.dx) + "px");
		adjustScrollWidth.call(this);
	}, onRowHeightChanged:function (height) {
		setStyle("#" + this.getId() + " .aw-grid-row", "height", (height - AW.dy) + "px");
		adjustScrollHeight.call(this);
	}};
})();
AW.Grid.Controllers.Virtual = (function () {
	var serial = 0;
	function virtual() {
		var s = ++serial;
		this.setTimeout(function () {
			var i = 0, ii, a = [];
			var count = this.getRowProperty("count");
			var offset = this.getRowProperty("offset");
			var indices = this.getRowProperty("indices");
			var scroll = this.getScrollProperty("top");
			var row = this.getRowProperty("height");
			var top = Math.floor(scroll / row);
			this.setVirtualTop(top);
			var client = Math.floor(this.getContentHeight(1) / row);
			if (!client) {
				client = 40;
			}
			var x1 = Math.min(count, Math.max(0, top - 20));
			var x2 = Math.min(count, top);
			var x3 = Math.min(count, top + client);
			var x4 = Math.min(count, top + client + 20);
			var i1 = x3;
			var i2 = x2 - 1;
			function rr() {
				if (s != serial || this.$edit) {
					return;
				}
				if (i1 < x4) {
					ii = indices ? indices[i1 + offset] : i1 + offset;
					this.getRowTemplate(ii).refresh();
					i1++;
				}
				if (i2 >= x1) {
					ii = indices ? indices[i2 + offset] : i2 + offset;
					this.getRowTemplate(ii).refresh();
					i2--;
				}
				if (i1 < x4 || i2 >= x1) {
					this.setTimeout(rr);
				}
			}
			rr.call(this);
		});
	}
	return {onCurrentRowChanged:function (i) {
		var current = this.getCurrentRow();
		var scroll = this.getScrollProperty("top");
		var height = this.getRowProperty("height");
		var top = (this.getRowPosition(current) - this.getRowOffset()) * height;
		var bottom = top + height;
		var max = this.getContentHeight(1);
		if (!max) {
			return;
		}
		if (top < scroll) {
			this.setScrollTop(top);
		}
		if (max + scroll < bottom) {
			this.setScrollTop(bottom - max);
		}
		if (AW.ie && this.element()) {
			var h = this.element().offsetHeight;
		}
	}, onCurrentColumnChanged:function (index) {
		var scroll = this.getScrollProperty("left");
		var col = this.getColumnPosition(index);
		var i, a = this.getColumnIndices();
		var lw = 0, lc = this.$extended ? this.getFixedLeft() : 0;
		var mw = 0, c = this.getColumnCount();
		var rw = 0, rc = this.$extended ? this.getFixedRight() : 0;
		lw = this.getSelectorVisible() ? this.getSelectorWidth() : lw;
		if (!this.$extended) {
			mw = lw;
			lw = 0;
		}
		for (i = 0; i < lc; i++) {
			lw += this.getColumnWidth(a ? a[i] : i);
		}
		for (i = lc; i < Math.min(col, c - rc - 1); i++) {
			mw += this.getColumnWidth(a ? a[i] : i);
		}
		for (i = c - rc; i < c; i++) {
			rw += this.getColumnWidth(a ? a[i] : i);
		}
		if (!col) {
			mw = 0;
		}
		if (mw < scroll) {
			this.setTimeout(function () {
				this.setScrollLeft(mw);
			});
			return;
		}
		var max = this.getContentWidth(1);
		var right = mw + this.getColumnWidth(index);
		if (max + scroll < right) {
			this.setTimeout(function () {
				this.setScrollLeft(right - max);
			});
		}
	}, onScrollTopChanging:function (scroll) {
		if (!this.getVirtualMode() || this.getScrollTop() == scroll) {
			return;
		}
		var s = ++serial;
		var row = this.getRowHeight();
		var top = Math.floor(scroll / row);
		if (Math.abs(top - this.getVirtualTop()) < 6) {
			this.setTimeout(refreshRows, 1000);
			return;
		}
		function refreshRows() {
			if (s != serial || this.$edit) {
				return;
			}
			this.getRowsTemplate().refresh();
			virtual.call(this);
		}
		this.setTimeout(refreshRows, 200);
	}, paint:function () {
		if (!this.getVirtualMode()) {
			return;
		}
		virtual.call(this);
	}};
})();
AW.Grid.Controllers.Grid = {onRowsTemplateChanged:function (rows) {
	rows.mapTemplate("item", "row");
	rows.mapModel("view", "row");
}, onRowTemplateChanged:function (row) {
	row.setAttribute("aw", "row");
	row.setClass("grid", "row");
	row.setClass("row", function () {
		return this.$0;
	});
	row.setClass("rows", function () {
		return this.getRowProperty("state") || "normal";
	});
	row.setClass("alternate", function () {
		return this.getRowProperty("position") % 2 ? "odd" : "even";
	});
	row.mapTemplate("item", function (i) {
		return this.$owner.getCellTemplate(i, this.$0);
	});
	row.mapTemplate("selector", function () {
		return this.$owner.getSelectorTemplate(this.$0);
	});
	row.mapModel("view", "column");
}, onCellTemplateChanged:function (cell) {
	cell.setAttribute("aw", "cell");
	cell.setAttribute("title", "");
	cell.setClass("grid", "cell");
	cell.setClass("column", function () {
		return this.$0;
	});
	cell.setClass("cells", function () {
		return this.getControlProperty("state") || "normal";
	});
	cell.mapModel("control", "cell");
	cell.getStateProperty = function (p) {
		return this.$owner.getRowProperty(p, this.$1);
	};
	cell.setStateProperty = function (p, v) {
		this.$owner.setRowProperty(p, v, this.$1);
	};
}, onHeadersTemplateChanged:function (headers) {
	headers.setClass("grid", "headers");
	headers.setClass("header", function () {
		return this.$0 || "0";
	});
	headers.setStyle("height", function () {
		return this.getHeaderProperty("height") - AW.dy + "px";
	});
	headers.getContent("end").setClass("grid", "header");
	headers.mapTemplate("item", function (i) {
		return this.$owner.getHeaderTemplate(i, this.$0) + this.$owner.getSeparatorTemplate(i, this.$0);
	});
	headers.mapTemplate("selector", function () {
		return this.$owner.getTopSelectorTemplate(this.$0) + (this.$owner.getSelectorResizable() && !this.$0 ? this.$owner.getSeparatorTemplate() : "");
	});
	headers.mapModel("view", "column");
}, onFootersTemplateChanged:function (footers) {
	footers.setClass("grid", "footers");
	footers.setClass("footer", function () {
		return this.$0 || "0";
	});
	footers.setStyle("height", function () {
		return this.getFooterProperty("height") - AW.dy + "px";
	});
	footers.mapTemplate("item", function (i) {
		return this.$owner.getFooterTemplate(i, this.$0);
	});
	footers.mapTemplate("selector", "bottomSelector");
	footers.mapModel("view", "column");
}, onHeaderTemplateChanged:function (header) {
	if (!header.getAttribute("aw")) {
		header.setAttribute("aw", "header");
	}
	header.setClass("grid", "header");
	header.setClass("column", function () {
		return this.$0;
	});
	header.mapModel("control", "header");
	header.getStateProperty = function (p) {
		return this.$owner.getColumnProperty(p, this.$0);
	};
	header.setStateProperty = function (p, v) {
		this.$owner.setColumnProperty(p, v, this.$0);
	};
}, onFooterTemplateChanged:function (footer) {
	if (!footer.getAttribute("aw")) {
		footer.setAttribute("aw", "footer");
	}
	footer.setClass("grid", "footer");
	footer.setClass("column", function () {
		return this.$0;
	});
	footer.mapModel("control", "footer");
}, onSelectorTemplateChanged:function (selector) {
	if (!selector.getAttribute("aw")) {
		selector.setAttribute("aw", "selector");
	}
	selector.setClass("row", "selector");
	selector.mapModel("control", "selector");
	selector.mapModel("state", "row");
}, onTopSelectorTemplateChanged:function (selector) {
	if (!selector.getAttribute("aw")) {
		selector.setAttribute("aw", "topSelector");
	}
	selector.setClass("grid", "header");
	selector.setClass("row", "selector");
	selector.mapModel("control", "top");
}, onBottomSelectorTemplateChanged:function (selector) {
	if (!selector.getAttribute("aw")) {
		selector.setAttribute("aw", "bottomSelector");
	}
	selector.setClass("row", "selector");
	selector.mapModel("control", "bottom");
}, onContentTemplateChanged:function (content) {
	content.mapModel("panel", "content");
	content.mapTemplate("panel", function (i) {
		switch (i) {
		  case 0:
			return this.getHeadersTemplate();
		  case 1:
			return this.getRowsTemplate();
		  case 2:
			return this.getFootersTemplate();
		}
	});
}, onPopupTemplateChanged:function (popup) {
	popup.onItemClicked = function (event, i) {
		try {
			var s = this.getItemText(i);
			this.$owner.setCellText(s, this.$0, this.$1);
			AW.$popup.hidePopup();
			var e = this.$owner.getCellTemplate(this.$0, this.$1).getContent("box/text").element();
			if (AW.ie) {
				e.innerHTML = s;
			} else {
				e.value = s;
			}
			e = null;
		}
		catch (e) {
		}
	};
}};
AW.Grid.Controllers.Extended = {onContentTemplateChanged:function (content) {
	content.mapModel("panel", "content");
	content.mapTemplate("panel", function (i, j) {
		switch (i) {
		  case 0:
			return this.$owner.getTopTemplate(j);
		  case 1:
			return this.$owner.getRowsTemplate(j);
		  case 2:
			return this.$owner.getBottomTemplate(j);
		}
	});
}, onTopTemplateChanged:function (top) {
	top.mapTemplate("item", "headers");
	top.mapModel("view", "header");
}, onBottomTemplateChanged:function (bottom) {
	bottom.mapTemplate("item", "footers");
	bottom.mapModel("view", "footer");
}};
AW.Grid.Controllers.SingleCell = {onKeyUp:"selectUpperCell", onKeyDown:"selectLowerCell", onKeyCtrlUp:"selectTopCell", onKeyCtrlDown:"selectBottomCell", onKeyLeft:"selectPreviousCell", onKeyRight:"selectNextCell", onKeyCtrlLeft:"selectFirstCell", onKeyCtrlRight:"selectLastCell", onKeyHome:"selectFirstCell", onKeyEnd:"selectLastCell", onKeyCtrlHome:"selectTopLeftCell", onKeyCtrlEnd:"selectBottomRightCell", onKeyPageUp:"selectPageUpCell", onKeyPageDown:"selectPageDownCell", onKeyF2:"editCurrentCell", onKeyEnter:"editCurrentCell", onCellMouseDown:"selectClickedCell", onCellDoubleClicked:"editCurrentCell"};
AW.Grid.Controllers.SingleRow = {onKeyUp:"selectPreviousRow", onKeyDown:"selectNextRow", onKeyHome:"selectFirstRow", onKeyEnd:"selectLastRow", onKeyCtrlHome:"selectFirstRow", onKeyCtrlEnd:"selectLastRow", onKeyPageUp:"selectPageUpRow", onKeyPageDown:"selectPageDownRow", onRowMouseDown:"selectClickedRow"};
AW.Grid.Controllers.MultiCell = {onKeyUp:"selectUpperCell", onKeyDown:"selectLowerCell", onKeyCtrlUp:"selectTopCell", onKeyCtrlDown:"selectBottomCell", onKeyLeft:"selectPreviousCell", onKeyRight:"selectNextCell", onKeyCtrlLeft:"selectFirstCell", onKeyCtrlRight:"selectLastCell", onKeyHome:"selectFirstCell", onKeyEnd:"selectLastCell", onKeyCtrlHome:"selectTopLeftCell", onKeyCtrlEnd:"selectBottomRightCell", onKeyPageUp:"selectPageUpCell", onKeyPageDown:"selectPageDownCell", onKeyShiftUp:"includeUpperCell", onKeyShiftDown:"includeLowerCell", onKeyShiftLeft:"includePreviousCell", onKeyShiftRight:"includeNextCell", onKeyShiftPageUp:"includePageUpCell", onKeyShiftPageDown:"includePageDownCell", onKeyF2:"editCurrentCell", onKeyEnter:"editCurrentCell", onCellShiftMouseDown:"includeClickedCell", onCellMouseDown:"selectClickedCell", onCellDoubleClicked:"editCurrentCell"};
AW.Grid.Controllers.MultiRow = {onKeyUp:"selectPreviousRow", onKeyDown:"selectNextRow", onKeyHome:"selectFirstRow", onKeyEnd:"selectLastRow", onKeyCtrlHome:"selectFirstRow", onKeyCtrlEnd:"selectLastRow", onKeyPageUp:"selectPageUpRow", onKeyPageDown:"selectPageDownRow", onKeyShiftUp:"includePreviousRow", onKeyShiftDown:"includeNextRow", onKeyShiftHome:"includeFirstRow", onKeyShiftEnd:"includeLastRow", onKeyCtrlShiftHome:"includeFirstRow", onKeyCtrlShiftEnd:"includeLastRow", onKeyShiftPageUp:"includePageUpRow", onKeyShiftPageDown:"includePageDownRow", onRowClicked:"selectClickedRow", onRowCtrlClicked:"toggleClickedRow", onRowShiftClicked:"includeClickedRow"};
AW.Grid.Controllers.MultiRowMarker = {onKeyUp:"gotoPreviousRow", onKeyDown:"gotoNextRow", onKeyHome:"gotoFirstRow", onKeyEnd:"gotoLastRow", onKeyPageUp:"gotoPageUpRow", onKeyPageDown:"gotoPageDownRow", onRowSelectedChanged:function (v, i) {
	this.getRowTemplate(i).refresh();
}};
AW.Grid.Separator = AW.System.Template.subclass();
AW.Grid.Separator.create = function () {
	var obj = this.prototype;
	obj.setClass("grid", "separator");
	obj.setClass("resizable", function () {
		return this.getColumnProperty("resizable") ? true : false;
	});
	obj.setEvent("onmousedown", function (event) {
		if (!this.getColumnProperty("resizable")) {
			return false;
		}
		var start = event.screenX;
		var self = this;
		var width = self.element().previousSibling.offsetWidth;
		var scroll = self.element().parentNode.parentNode.scrollLeft;
		function doResize(event) {
			var w = width + event.screenX - start;
			w = w > 9 ? w : 9;
			self.element().previousSibling.style.width = (w - AW.dx) + "px";
		}
		function endResize(event) {
			var w = width + event.screenX - start;
			w = w > 9 ? w : 9;
			var e = self.element();
			AW.detachEvent(e, "onmousemove", doResize);
			AW.detachEvent(e, "onmouseup", endResize);
			AW.detachEvent(e, "onlosecapture", endResize);
			AW.releaseCapture(e);
			if (AW.gecko) {
				try {
					e.parentNode.parentNode.scrollLeft = scroll;
					e.parentNode.focus();
				}
				catch (err) {
				}
			}
			var id = e.previousSibling.id;
			if (id.match("header")) {
				self.$owner.setColumnProperty("width", w, self.$0);
			} else {
				if (id.match("topSelector")) {
					self.$owner.setSelectorProperty("width", w);
				}
			}
			e.previousSibling.style.width = "";
			e = null;
		}
		var e = AW.srcElement(event);
		AW.setCapture(e);
		AW.attachEvent(e, "onmousemove", doResize);
		AW.attachEvent(e, "onmouseup", endResize);
		AW.attachEvent(e, "onlosecapture", endResize);
		e = null;
		event.cancelBubble = true;
	});
};
AW.Grid.Header = AW.Templates.ImageText.subclass();
AW.Grid.Header.create = function () {
	var obj = this.prototype;
	var _super = this.superclass.prototype;
	function _direction() {
		return this.getSortProperty("direction") || "none";
	}
	obj.setClass("sort", _direction);
	var sort = new AW.HTML.SPAN;
	sort.setClass("grid", "sort");
	obj.setContent("box/text/sort", sort);
	obj.element = function () {
		if (typeof (this.$1) == "undefined" && this.$owner && this.$owner.$extended) {
			return _super.element.call(this.$owner.getHeaderTemplate(this.$0, 0));
		} else {
			return _super.element.call(this);
		}
	};
};
AW.Grid.Row = AW.Templates.List.subclass();
AW.Grid.Row.create = function () {
	var obj = this.prototype;
	var _super = this.superclass.prototype;
	obj.setClass("text", "normal");
	if (AW.gecko) {
		obj.setAttribute("tabIndex", "-1");
	}
	var span = AW.HTML.SPAN;
	var space = new span;
	var box = new span;
	space.setClass("item", "template");
	space.setClass("grid", "cell");
	space.setClass("column", "space");
	box.setClass("item", "box");
	space.setContent("box", box);
	obj.setContent("end", space);
	obj.setContent("start", function () {
		return this.getSelectorProperty("visible") && !this.$1 ? this.getSelectorTemplate() : "";
	});
	var items = obj.getContent("items");
	obj.setContent("items", function () {
		return this.$name == "row" && this.$owner._fast ? "" : items.call(this);
	});
	var refresh = obj.refresh;
	obj.refresh = function () {
		if (typeof (this.$1) == "undefined" && this.$owner.$extended) {
			for (var i = 0; i < 3; i++) {
				refresh.call(this.$owner.getRowTemplate(this.$0, i));
			}
		} else {
			refresh.call(this);
		}
	};
	var refreshClasses = obj.refreshClasses;
	obj.refreshClasses = function () {
		if (typeof (this.$1) == "undefined" && this.$owner.$extended) {
			for (var i = 0; i < 3; i++) {
				refreshClasses.call(this.$owner.getRowTemplate(this.$0, i));
			}
		} else {
			refreshClasses.call(this);
		}
	};
};
AW.Grid.Rows = AW.Templates.List.subclass();
AW.Grid.Rows.create = function () {
	var obj = this.prototype;
	var _super = this.superclass.prototype;
	obj.setClass("grid", "view");
	obj.setContent("items", function () {
		var i, ii, a = [];
		var count = this.getViewProperty("count");
		var offset = this.getViewProperty("offset");
		var indices = this.getViewProperty("indices");
		var virtual = this.getVirtualProperty("mode");
		var clone = this.$owner.$clone;
		this.$owner.$clone = false;
		if (!virtual) {
			for (i = 0; i < count; i++) {
				ii = indices ? indices[i + offset] : i + offset;
				a[i] = this.getItemTemplate(ii).toString();
			}
		} else {
			var scroll = this.getScrollProperty("top");
			var height = this.getRowProperty("height");
			var top = Math.floor(scroll / height);
			var e = this.$owner.element();
			var client = 0;
			if (e) {
				client = Math.floor(e.offsetHeight / height);
			}
			e = null;
			if (client < 4) {
				client = 40;
			}
			var x1 = Math.min(count, Math.max(0, top - 50));
			var x2 = Math.min(count, top);
			var x3 = Math.min(count, top + client);
			var x4 = Math.min(count, top + client + 50);
			this.$owner._fast = true;
			for (i = x1; i < x2; i++) {
				ii = indices ? indices[i + offset] : i + offset;
				a[i] = this.getItemTemplate(ii).toString();
			}
			this.$owner._fast = false;
			for (i = x2; i < x3; i++) {
				ii = indices ? indices[i + offset] : i + offset;
				a[i] = this.getItemTemplate(ii).toString();
			}
			this.$owner._fast = true;
			for (i = x3; i < x4; i++) {
				ii = indices ? indices[i + offset] : i + offset;
				a[i] = this.getItemTemplate(ii).toString();
			}
			this.$owner._fast = false;
		}
		this.$owner.$clone = clone;
		return a.join("");
	});
	var span = AW.HTML.SPAN;
	var top = new span;
	top.setClass("view", "top");
	top.setStyle("height", function () {
		var virtual = this.getVirtualProperty("mode");
		if (!virtual) {
			return 0;
		}
		var scroll = this.getScrollProperty("top");
		var height = this.getRowProperty("height");
		var offset = Math.max(0, Math.floor(scroll / height) - 50) * height;
		return offset + "px";
	});
	obj.setContent("start", top);
	var space = new span;
	var box = new span;
	space.setClass("item", "template");
	space.setClass("row", "selector");
	space.setClass("selector", "space");
	box.setClass("item", "box");
	space.setContent("box", box);
	obj.setContent("end", space);
	obj.refresh = function () {
		try {
			if (this.$owner.$active) {
				var e = this.$owner.getContent("focus").element();
				if (AW.ie) {
					var r = document.body.createTextRange();
					r.moveToElementText(e);
					r.select();
					r = null;
				}
				e.focus();
				e = null;
			}
		}
		catch (err) {
		}
		if (typeof (this.$0) == "undefined" && this.$owner.$extended) {
			for (var i = 0; i < 3; i++) {
				_super.refresh.call(this.$owner.getRowsTemplate(i));
			}
		} else {
			_super.refresh.call(this);
		}
	};
};
AW.Grid.Control = AW.System.Control.subclass();
AW.Grid.Control.create = function () {
	var obj = this.prototype;
	var _super = this.superclass.prototype;
	obj.setClass("grid", "control");
	obj.setClass("selectors", function () {
		return this.getSelectorVisible() ? "visible" : "hidden";
	});
	var sample = new AW.HTML.SPAN;
	sample.setClass("row", "sample");
	sample.setClass("grid", "row");
	obj.setContent("sample", sample);
	var box = new AW.HTML.SPAN;
	box.setClass("grid", "box");
	box.setContent("html", function () {
		return this.getLayoutTemplate();
	});
	obj.setContent("box", box);
	var Grid = AW.Grid.Controllers;
	obj.setController("size", Grid.Size);
	obj.setController("cell", Grid.Cell);
	obj.setController("row", Grid.Row);
	obj.setController("view", Grid.View);
	obj.setController("actions", Grid.Actions);
	obj.setController("navigation", Grid.Navigation);
	obj.setController("selection", Grid.SingleCell);
	obj.setController("sort", Grid.Sort);
	obj.setController("overflow", Grid.Overflow);
	obj.setController("scroll", Grid.Scroll);
	obj.setController("width", Grid.Width);
	obj.setController("virtual", Grid.Virtual);
	obj.setController("grid", Grid.Grid);
	obj.defineTemplate("layout", function () {
		return this.getScrollTemplate();
	});
	obj.defineTemplate("scroll", new AW.Scroll.Bars);
	obj.defineTemplate("content", new AW.Panels.Horizontal);
	obj.defineTemplate("panel", function () {
		return "";
	});
	obj.defineTemplate("rows", new AW.Grid.Rows);
	obj.defineTemplate("row", new AW.Grid.Row);
	obj.defineTemplate("cell", new AW.Templates.Text);
	obj.defineTemplate("headers", new AW.Grid.Row);
	obj.defineTemplate("footers", new AW.Grid.Row);
	obj.defineTemplate("header", new AW.Grid.Header);
	obj.defineTemplate("footer", new AW.Templates.ImageText);
	obj.defineTemplate("separator", new AW.Grid.Separator);
	obj.defineTemplate("selector", new AW.Templates.ImageText);
	obj.defineTemplate("topSelector", new AW.Templates.ImageText);
	obj.defineTemplate("bottomSelector", new AW.Templates.ImageText);
	obj.defineTemplate("popup", new AW.System.Template);
	function value(i, j) {
		var text = this.getCellText(i, j);
		var format = this.getCellFormat(i, j);
		return format ? format.textToValue(text) : AW.textToValue(text);
	}
	function position(i) {
		return Number(i);
	}
	var models = {scroll:{left:0, top:0, width:0, height:0, bars:"both"}, cell:{text:"", image:"", link:"", value:value, data:"", format:"", tooltip:"", state:"", selected:false, editable:false}, header:{text:"", image:"", link:"", value:value, data:"", format:"", tooltip:"", state:"", count:1, offset:0, height:20, visible:true}, selector:{text:"", image:"", link:"", value:value, data:"", format:"", tooltip:"", state:"", width:20, resizable:false, visible:false}, top:{text:"", image:"", link:"", value:value, data:"", format:"", tooltip:"", state:""}, column:{offset:0, count:0, position:position, state:"", selected:false, resizable:true, width:100}, row:{offset:0, count:0, position:position, state:"", selected:false, height:18}, current:{row:0, column:0, selection:"cell"}, selected:{}, selection:{mode:"rows", multiple:false}, sort:{column:-1, direction:""}, fixed:{left:1, right:0}, virtual:{mode:true, top:0}, content:{width:0, height:0}};
	obj.defineModel("scroll", models.scroll);
	obj.defineModel("cell", models.cell);
	obj.defineModel("header", models.header);
	obj.defineModel("footer", models.header);
	obj.defineModel("selector", models.selector);
	obj.defineModel("top", models.top);
	obj.defineModel("bottom", models.top);
	obj.defineModel("column", models.column);
	obj.defineModel("row", models.row);
	obj.defineModel("current", models.current);
	obj.defineModel("selected", models.selected);
	obj.defineModel("selection", models.selection);
	obj.defineModel("sort", models.sort);
	obj.defineModel("virtual", models.virtual);
	obj.defineModel("content", models.content);
	obj.defineModel("panel", models.content);
	obj.defineModel("fixed", models.fixed);
	obj.defineColumnProperty("indices", "", true);
	obj.defineRowProperty("indices", "", true);
	obj.defineHeaderProperty("indices", "", true);
	obj.defineFooterProperty("indices", "", true);
	obj.defineSelectedProperty("rows", [], true);
	obj.defineSelectedProperty("columns", [], true);
	obj.setFooterVisible(false);
	obj.setContentWidth(100, 0);
	obj.setContentHeight(20, 0);
	obj.calculateRowState = function (i) {
		var state = "";
		if (this.getCurrentRow() == i) {
			state = "current";
		}
		if (this.getRowSelected(i)) {
			state = "selected";
		}
		this.setRowState(state, i);
	};
	obj.calculateCellState = function (i, j) {
		var state = "";
		if (this.getCurrentColumn() == i && this.getCurrentRow() == j) {
			state = "current";
		}
		if (this.getCellSelected(i, j)) {
			state = "selected";
		}
		this.setCellState(state, i, j);
	};
	obj.setContent("box/block", new AW.HTML.SPAN);
	if (AW.gecko) {
		obj.toString = function () {
			function paint() {
				if (this.element() && !this.element().offsetWidth) {
					this.setTimeout(paint, 1000);
				} else {
					this.raiseEvent("paint");
				}
			}
			this.setTimeout(paint);
			return _super.toString.call(this);
		};
	}
	var focus = new AW.HTML.SPAN;
	focus.setTag("a");
	focus.setClass("grid", "focus");
	focus.setAttribute("tabIndex", function () {
		return this.getTabProperty("index");
	});
	if (AW.ie) {
		focus.setAttribute("hidefocus", "true");
		focus.setStyle("visibility", "expression(AW.paint(this))");
	}
	obj.setContent("focus", focus);
	obj.focus = function () {
		try {
			this.getContent("focus").element().focus();
		}
		catch (err) {
		}
	};
	obj.addRow = function (row) {
		if (this.raiseEvent("onRowAdding", row)) {
			return;
		}
		var i, count = this.getRowCount();
		var a = this.getRowIndices();
		if (typeof (row) == "undefined") {
			row = count;
		}
		if (this._cellModel && this._cellModel.addRow) {
			this._cellModel.addRow(row);
		}
		if (!a) {
			a = [];
			for (i = 0; i < count; i++) {
				a[i] = i;
			}
		}
		a.push(row);
		var refresh = this.refresh;
		this.refresh = function () {
		};
		this.setRowIndices(a);
		this.setRowCount(count + 1);
		this.setCurrentRow(row);
		this.setSelectedRows([row]);
		this.refresh = refresh;
		this.raiseEvent("onRowAdded", row);
	};
	obj.deleteRow = function (row) {
		if (this.raiseEvent("onRowDeleting", row)) {
			return;
		}
		if (this._cellModel && this._cellModel.deleteRow) {
			this._cellModel.deleteRow(row);
		}
		var i, count = this.getRowCount();
		var a = this.getRowIndices();
		if (!a) {
			a = [];
			for (i = 0; i < count; i++) {
				a[i] = i;
			}
			i = row;
		} else {
			i = this.getRowPosition(row);
		}
		a.splice(i, 1);
		var refresh = this.refresh;
		this.refresh = function () {
		};
		this.setRowIndices(a);
		this.setRowCount(count - 1);
		this.setCurrentRow(i > 0 ? a[i - 1] : -1);
		this.setSelectedRows(i > 0 ? [a[i - 1]] : []);
		this.refresh = refresh;
		this.raiseEvent("onRowDeleted", row);
	};
	obj.sort = function (column, direction) {
		this.raiseEvent("doSort", direction, column);
	};
	var setCellModel = obj.setCellModel;
	obj.setCellModel = function (model) {
		setCellModel.call(this, model);
		function dataToText(i, j) {
			var data = this.getCellData(i, j);
			var format = this.getCellFormat(i, j);
			return format ? format.dataToText(data) : data;
		}
		function dataToValue(i, j) {
			var data = this.getCellData(i, j);
			var format = this.getCellFormat(i, j);
			return format ? format.dataToValue(data) : data;
		}
		this.setCellText(dataToText);
		this.setCellValue(dataToValue);
	};
	obj.onControlDisabledChanged = function (value) {
		this.setClass("disabled", value ? "control" : null);
		this.setAttribute("disabled", value ? true : null);
	};
};
AW.UI.Grid = AW.Grid.Control;
AW.Grid.Extended = AW.Grid.Control.subclass();
AW.Grid.Extended.create = function () {
	var obj = this.prototype;
	obj.$extended = true;
	obj.setController("extended", AW.Grid.Controllers.Extended);
	obj.setContentTemplate(new AW.Panels.Grid);
	obj.defineTemplate("top", new AW.Templates.List);
	obj.defineTemplate("bottom", new AW.Templates.List);
	var splitColumns = function (p, j) {
		var left = this.$owner._fixedLeft, right = this.$owner._fixedRight;
		var i = this.$1;
		switch (p) {
		  case "count":
			if (i === 0) {
				return left;
			}
			if (i == 1) {
				return this.$owner.getColumnProperty("count") - left - right;
			}
			if (i == 2) {
				return right;
			}
			return 0;
		  case "offset":
			if (i === 0) {
				return 0;
			}
			if (i == 1) {
				return left;
			}
			if (i == 2) {
				return this.$owner.getColumnProperty("count") - right;
			}
			return 0;
		  default:
			return this.$owner.getColumnProperty(p, j);
		}
	};
	obj.getHeadersTemplate().mapModel("view", splitColumns);
	obj.getFootersTemplate().mapModel("view", splitColumns);
	obj.getRowTemplate().mapModel("view", splitColumns);
	var scrollController = {onScrollLeftChanged:function (x) {
		var e1 = this.getRowsTemplate(1).element();
		var e2 = this.getTopTemplate(1).element();
		var e3 = this.getBottomTemplate(1).element();
		if (e1) {
			e1.parentNode.scrollLeft = x;
		}
		if (e2) {
			e2.parentNode.scrollLeft = x;
		}
		if (e3) {
			e3.parentNode.scrollLeft = x;
		}
	}, onScrollTopChanged:function (y) {
		var e1 = this.getRowsTemplate(1).element();
		var e2 = this.getRowsTemplate(0).element();
		var e3 = this.getRowsTemplate(2).element();
		if (e1) {
			e1.parentNode.scrollTop = y;
		}
		if (e2) {
			e2.parentNode.scrollTop = y;
		}
		if (e3) {
			e3.parentNode.scrollTop = y;
		}
	}, adjustScrollWidth:function () {
		var i, a = this.getColumnIndices();
		var lw = 0, lc = this.getFixedLeft();
		var mw = 0, c = this.getColumnCount();
		var rw = 0, rc = this.getFixedRight();
		lw = this.getSelectorVisible() ? this.getSelectorWidth() : lw;
		for (i = 0; i < lc; i++) {
			lw += this.getColumnWidth(a ? a[i] : i);
		}
		for (i = lc; i < c - rc; i++) {
			mw += this.getColumnWidth(a ? a[i] : i);
		}
		for (i = c - rc; i < c; i++) {
			rw += this.getColumnWidth(a ? a[i] : i);
		}
		this.setScrollWidth(lw + mw + rw + 3);
		lw = lw + "px";
		rw = rw + "px";
		var e1 = this.getRowsTemplate(0).element();
		var e2 = this.getTopTemplate(0).element();
		var e3 = this.getBottomTemplate(0).element();
		if (e1) {
			e1.parentNode.style.width = lw;
		}
		if (e2) {
			e2.parentNode.style.width = lw;
		}
		if (e3) {
			e3.parentNode.style.width = lw;
		}
		if (AW.ie) {
			if (e1) {
				e1.parentNode.parentNode.style.paddingLeft = lw;
			}
			if (e2) {
				e2.parentNode.parentNode.style.paddingLeft = lw;
			}
			if (e3) {
				e3.parentNode.parentNode.style.paddingLeft = lw;
			}
		}
		if (!AW.ie) {
			if (e1) {
				e1.parentNode.nextSibling.style.left = lw;
				e1.parentNode.nextSibling.style.right = rw;
			}
			if (e2) {
				e2.parentNode.nextSibling.style.left = lw;
				e2.parentNode.nextSibling.style.right = rw;
			}
			if (e3) {
				e3.parentNode.nextSibling.style.left = lw;
				e3.parentNode.nextSibling.style.right = rw;
			}
		}
		e1 = this.getRowsTemplate(2).element();
		e2 = this.getTopTemplate(2).element();
		e3 = this.getBottomTemplate(2).element();
		if (e1) {
			e1.parentNode.style.width = rw;
		}
		if (e2) {
			e2.parentNode.style.width = rw;
		}
		if (e3) {
			e3.parentNode.style.width = rw;
		}
		if (AW.ie) {
			if (e1) {
				e1.parentNode.parentNode.style.paddingRight = rw;
			}
			if (e2) {
				e2.parentNode.parentNode.style.paddingRight = rw;
			}
			if (e3) {
				e3.parentNode.parentNode.style.paddingRight = rw;
			}
		}
	}, adjustScrollHeight:function () {
		var h = this.getRowCount() * this.getRowHeight();
		h += this.getContentHeight(0);
		h += this.getContentHeight(2);
		this.setScrollHeight(h + 3);
	}};
	obj.setController("scroll", scrollController);
};
AW.Tree.Item = AW.Templates.ImageText.subclass();
AW.Tree.Item.create = function () {
	var obj = this.prototype;
	obj.setClass("tree", function () {
		return this.getViewProperty("count") ? "folder" : "leaf";
	});
	obj.setClass("expanded", function () {
		return this.getViewProperty("expanded") ? "true" : "false";
	});
	var sign = new AW.HTML.SPAN;
	sign.setClass("tree", "sign");
	sign.setEvent("onclick", function () {
		this.raiseEvent("onTreeSignClicked");
	});
	obj.setContent("box/sign", sign);
};
AW.Tree.View = AW.System.Template.subclass();
AW.Tree.View.create = function () {
	var obj = this.prototype;
	obj.setTag("span");
	obj.setClass("tree", "view");
	obj.setContent("start", function () {
		return this.$0 ? this.getItemTemplate() : "";
	});
	obj.setContent("items", function () {
		if (this.$0 && !this.getViewProperty("expanded")) {
			return "";
		}
		var i, ii, a = [];
		var count = this.getViewProperty("count");
		var offset = this.getViewProperty("offset");
		var indices = this.getViewProperty("indices");
		var clone = this.$owner.$clone;
		this.$owner.$clone = false;
		for (i = 0; i < count; i++) {
			ii = indices ? indices[i + offset] : i + offset;
			a[i] = this.getContentTemplate(ii).toString();
		}
		this.$owner.$clone = clone;
		return a.join("");
	});
	obj.setContent("end", "");
};
AW.Tree.Group = AW.System.Template.subclass();
AW.Tree.Group.create = function () {
	var obj = this.prototype;
	obj.setTag("span");
	obj.setClass("tree", "view");
	obj.setContent("start", function () {
		return this.$0 ? this.getItemTemplate() : "";
	});
	obj.setContent("items", function () {
		if (this.$0 && !this.getViewProperty("expanded")) {
			return "";
		} else {
			return this.getContentTemplate();
		}
	});
	obj.setContent("end", "");
};
AW.Tree.Control = AW.UI.List.subclass();
AW.Tree.Control.create = function () {
	var obj = this.prototype;
	obj.defineTemplate("group", new AW.Tree.Group);
	obj.setItemTemplate(new AW.Tree.Item);
	obj.setScrollTemplate(function () {
		return this.getGroupTemplate(0);
	});
	obj.getContentTemplate().mapTemplate("item", function (i) {
		return this.$owner.getGroupTemplate(i);
	});
	obj.defineViewProperty("expanded", false);
	obj.onTreeSignClicked = function (src, i) {
		if (this.getViewIndices(i)) {
			this.setViewExpanded(!this.getViewExpanded(i), i);
		}
	};
	obj.onViewExpandedChanged = function (e, i) {
		this.getGroupTemplate(i).refresh();
	};
};
AW.UI.Tree = AW.Tree.Control;
AW.HTTP.Request = AW.System.Model.subclass();
AW.HTTP.Request.create = function () {
	var obj = this.prototype;
	obj.defineProperty("URL");
	obj.defineProperty("async", true);
	obj.defineProperty("requestMethod", "GET");
	obj.defineProperty("requestData", "");
	obj.defineProperty("responseText", function () {
		return this._http ? this._http.responseText : "";
	});
	obj.defineProperty("responseXML", function () {
		return this._http ? this._http.responseXML : "";
	});
	obj.defineProperty("username", null);
	obj.defineProperty("password", null);
	obj.setNamespace = function (name, value) {
		this._namespaces += " xmlns:" + name + "=\"" + value + "\"";
	};
	obj._namespaces = "";
	obj.setParameter = function (name, value) {
		this["_" + name + "Parameter"] = value;
		if ((this._parameters + " ").indexOf(" " + name + " ") < 0) {
			this._parameters += " " + name;
		}
	};
	obj._parameters = "";
	obj.setRequestHeader = function (name, value) {
		this["_" + name + "Header"] = value;
		if ((this._headers + " ").indexOf(" " + name + " ") < 0) {
			this._headers += " " + name;
		}
	};
	obj._headers = "";
	obj.getResponseHeader = function (name) {
		return this._http ? this._http.getResponseHeader(name) : "";
	};
	obj.request = function () {
		var self = this;
		this._ready = false;
		var i, j, name, value, data = "", params = this._parameters.split(" ");
		for (i = 1; i < params.length; i++) {
			name = params[i];
			value = this["_" + name + "Parameter"];
			if (typeof value == "function") {
				value = value();
			}
			if (typeof value == "object" && value.constructor == Array) {
				for (j = 0; j < value.length; j++) {
					data += encodeURIComponent(name) + "=" + encodeURIComponent(value[j]) + "&";
				}
			} else {
				data += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
			}
		}
		var URL = this._URL;
		if ((this._requestMethod != "POST") && data) {
			URL += "?" + data;
			data = null;
		}
		if (this._requestMethod == "POST") {
			data = this._requestData;
		}
		this._http = AW.createXMLHttpRequest();
		this._http.open(this._requestMethod, URL, this._async, this._username, this._password);
		var headers = this._headers.split(" ");
		for (i = 1; i < headers.length; i++) {
			name = headers[i];
			value = this["_" + name + "Header"];
			if (typeof value == "function") {
				value = value();
			}
			this._http.setRequestHeader(name, value);
		}
		this._http.send(data);
		if (this._async) {
			this.setTimeout(wait, 200);
			setLoading(true);
		} else {
			returnResult();
		}
		function wait() {
			if (self._http.readyState == 4) {
				self._ready = true;
				returnResult();
				setLoading(false);
			} else {
				self.setTimeout(wait, 200);
			}
		}
		function returnResult() {
			var xml = self._http.responseXML;
			if (xml && xml.firstChild && xml.hasChildNodes() && !(xml.firstChild && xml.firstChild.firstChild && xml.firstChild.firstChild.firstChild && xml.firstChild.firstChild.firstChild.nodeName == "parsererror")) {
				self.response(xml);
				xml = null;
				return;
			}
			xml = null;
			self.response(self._http.responseText);
		}
	};
	obj.response = function (result) {
		if (this.$owner) {
			this.$owner.refresh();
		}
	};
	obj.isReady = function () {
		return this._ready;
	};
};
AW.CSV.Table = AW.HTTP.Request.subclass();
AW.CSV.Table.create = function () {
	var obj = this.prototype;
	obj.response = function (text) {
		this._rows = text.split(/\r*\n/);
		if (!this._rows[this._rows.length - 1]) {
			this._rows.pop();
		}
		this._data = [];
		if (this.$owner) {
			this.$owner.clearScrollModel();
			this.$owner.clearSelectedModel();
			this.$owner.clearSortModel();
			this.$owner.clearRowModel();
			this.$owner.setRowCount(this.getCount());
			this.$owner.refresh();
		}
	};
	obj._rows = [];
	obj._data = [];
	obj.getCount = function () {
		return this._rows.length;
	};
	obj.getData = function (c, r) {
		if (!this._data[r]) {
			if (!this._rows[r]) {
				return "";
			}
			this._data[r] = this._rows[r].replace(x1, s1).replace(x2, s2).split(s3);
		}
		return this._data[r][c] || "";
	};
	var x1 = /(([^,\t\"]*)|\"(([^\"]|\"\")*)\")(,|\t|$)/g;
	var x2 = /\"\"/g;
	var s1 = "$2$3\x01";
	var s2 = "\"";
	var s3 = "\x01";
};
AW.XML.Table = AW.HTTP.Request.subclass();
AW.XML.Table.create = function () {
	var obj = this.prototype;
	if (AW.gecko) {
		var xpath = new XPathEvaluator();
	}
	obj.response = function (xml) {
		this.setXML(xml);
		if (this.$owner) {
			this.$owner.clearScrollModel();
			this.$owner.clearSelectedModel();
			this.$owner.clearSortModel();
			this.$owner.clearRowModel();
			this.$owner.setRowCount(this.getCount());
			this.$owner.refresh();
		}
	};
	obj.defineProperty("XML");
	obj.setXML = function (xml) {
		if (!xml.nodeType) {
			var s = "" + xml;
			xml = new ActiveXObject("MSXML2.DOMDocument");
			xml.loadXML(s);
		}
		xml.setProperty("SelectionLanguage", "XPath");
		if (this._namespaces) {
			xml.setProperty("SelectionNamespaces", this._namespaces);
		}
		this._xml = xml;
		this._data = this._xml.selectSingleNode(this._dataPath);
		this._items = this._data ? this._data.selectNodes(this._itemPath) : null;
		this._ready = true;
	};
	if (AW.gecko) {
		obj.setXML = function (xml) {
			if (!xml.nodeType) {
				var parser = new DOMParser;
				xml = parser.parseFromString("" + xml, "text/xml");
			} else {
				if (xml.nodeName == "XML" && xml.ownerDocument == document) {
					var node = xpath.evaluate("*", xml, null, 9, null).singleNodeValue;
					xml = document.implementation.createDocument("", "", null);
					xml.appendChild(node);
				}
			}
			namespaces = {};
			var a = this._namespaces.split(" xmlns:");
			for (var i = 1; i < a.length; i++) {
				var s = a[i].split("=");
				namespaces[s[0]] = s[1].replace(/\"/g, "");
			}
			this._ns = {lookupNamespaceURI:function (prefix) {
				return namespaces[prefix];
			}};
			this._xml = xml;
			this._data = xpath.evaluate(this._dataPath, this._xml, this._ns, 9, null).singleNodeValue;
			this._items = this._data ? xpath.evaluate(this._itemPath, this._data, this._ns, 7, null) : null;
			this._ready = true;
		};
	}
	obj.getXML = function () {
		return this._xml;
	};
	obj._dataPath = "*";
	obj._itemPath = "*";
	obj._valuePath = "*";
	obj._valuesPath = [];
	obj._formats = [];
	obj.setColumns = function (array) {
		this._valuesPath = array;
	};
	obj.setRows = function (xpath) {
		this._itemPath = xpath;
	};
	obj.setTable = function (xpath) {
		this._dataPath = xpath;
	};
	obj.getCount = function () {
		if (!this._items) {
			return 0;
		}
		return AW.gecko ? this._items.snapshotLength : this._items.length;
	};
	obj.getData = function (i, j) {
		var node = this.getNode(i, j);
		return node ? (AW.ie ? node.text : node.textContent) : "";
	};
	obj.getNode = function (j, i) {
		if (!this._items || !this._items[i]) {
			return null;
		}
		if (this._valuesPath[j]) {
			return this._items[i].selectSingleNode(this._valuesPath[j]);
		} else {
			return this._items[i].selectNodes(this._valuePath)[j];
		}
	};
	obj.getXMLNode = function (path) {
		if (!this._xml) {
			return null;
		}
		return this._xml.selectSingleNode(path);
	};
	obj.getXMLText = function (path) {
		var node = this.getXMLNode(path);
		return node ? (AW.ie ? node.text : node.textContent) : "";
	};
	obj.getCellSum = function (j) {
		var sum = 0;
		for (var i = 0; i < this.getCount(); i++) {
			sum += Number(this.getData(j, i));
		}
		return sum;
	};
	obj.transformNode = function (path) {
		var xslDoc = new ActiveXObject("MSXML2.DOMDocument");
		xslDoc.async = false;
		xslDoc.load(path);
		return this._xml.transformNode(xslDoc);
	};
	if (AW.gecko) {
		obj.getNode = function (c, r) {
			if (!this._items) {
				return null;
			}
			var row = this._items.snapshotItem(r);
			if (!row) {
				return null;
			}
			if (this._valuesPath[c]) {
				return xpath.evaluate(this._valuesPath[c], row, this._ns, 9, null).singleNodeValue;
			} else {
				return xpath.evaluate(this._valuePath, row, this._ns, 7, null).snapshotItem(c);
			}
		};
		obj.getXMLNode = function (path) {
			if (!this._xml) {
				return null;
			}
			return xpath.evaluate(path, this._xml, this._ns, 9, null).singleNodeValue;
		};
		obj.transformNode = function (path) {
			var xslDoc = document.implementation.createDocument("", "", null);
			xslDoc.async = false;
			xslDoc.load(path);
			var xslProc = new XSLTProcessor();
			xslProc.importStylesheet(xslDoc);
			var result = xslProc.transformToFragment(this._xml, document);
			var xmls = new XMLSerializer();
			return xmls.serializeToString(result);
		};
	}
};
document.documentElement.className += AW._htmlClasses;
function $(emid) {
	var elements = new Array();
	for (var i = 0; i < arguments.length; i++) {
		var element = arguments[i];
		if (typeof element == "string") {
			element = document.getElementById(element);
		}
		if (arguments.length == 1) {
			return element;
		}
		elements.push(element);
	}
	return elements;
}
function $F(emid) {
	return $(emid).value;
}
function setLoading(on, text) {
	var e = $("loading");
	if (e == null) {
		e = document.createElement("div");
		e.id = "loading";
		e.className = "loading";
		document.body.appendChild(e);
	}
	e.style.display = on ? "block" : "none";
	e.innerHTML = (text == null) ? "\u6570\u636e\u8bfb\u53d6\u4e2d,\u8bf7\u7a0d\u5019\u2026\u2026" : text + ",\u8bf7\u7b49\u5019\u2026\u2026";
	e.style.left = (window.screen.width) * 0.4;
	e.style.top = (window.screen.height) * 0.4;
}

