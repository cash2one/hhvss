if (!window.AW) {
    var AW = function(a, b) {
        return AW.dispatch(a, b);
    };
    AW.version = 255;
    AW.toString = function() {
        return "ActiveWidgets 2.5.5";
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
 (function() {
    AW.all = {
        id: 0
    };
    AW.docs = [document];
    AW.log = function(level, arg) {
        try {
            var i,
            s = "";
            for (i = 0; i < arg.length; i++) {
                s += arg[i] + " ";
            }
            window.status = s;
        } catch(error) {
            window.status = error.message;
        }
    };
    AW.debug = function() {
        AW.log("debug", arguments);
    };
    AW.info = function() {
        AW.log("info", arguments);
    };
    AW.warn = function() {
        AW.log("warn", arguments);
    };
    AW.error = function() {
        AW.log("error", arguments);
    };
    AW.fatal = function() {
        AW.log("fatal", arguments);
    };
    AW.forEach = function(array, handler) {
        var i,
        custom = {};
        for (i in array) {
            if (!custom[i]) {
                handler(i, array[i]);
            }
        }
    };
    AW.element = function(id) {
        if (!id || typeof(id) != "string") {
            return
        }
        var i,
        e,
        docs = AW.docs;
        for (i = 0; i < docs.length; i++) {
            e = docs[i].getElementById(id);
            if (e) {
                return e;
            }
        }
    };
    AW.object = function(id, skipContent) {
        var parts = id.split("-");
        var tag = parts[0];
        var obj = AW.all[tag];
        if (!obj) {
            return
        }
        for (var i = 1; i < parts.length; i++) {
            var name = parts[i];
            if (obj["_" + name + "Content"]) {
                if (!skipContent) {
                    for (var j = i; j < parts.length; j++) {
                        obj = obj.getContent(parts[j]);
                    }
                }
                return obj;
            }
            tag += "-" + name;
            if (AW.element(tag)) {
                obj = obj.getTemplate(name);
                continue;
            }
            var index1 = parts[++i];
            tag += "-" + index1;
            if (AW.element(tag)) {
                obj = obj.getTemplate(name, index1);
                continue;
            }
            var index2 = parts[++i];
            tag += "-" + index2;
            if (AW.element(tag)) {
                obj = obj.getTemplate(name, index1, index2);
                continue;
            }
            var index3 = parts[++i];
            tag += "-" + index3;
            if (AW.element(tag)) {
                obj = obj.getTemplate(name, index1, index2, index3);
                continue;
            }
        }
        return obj;
    };
    var events = {
        "DOMFocusIn": "focus"
    };
    AW.dispatch = function(element, event) {
        var type = "_on" + (events[event.type] || event.type) + "Event";
        var target = AW.object(element.id);
        var obj = target;
        while (obj._parent) {
            obj = obj._parent;
        }
        return target[type].call(obj, event);
    };
    AW.camelCase = function() {
        var i,
        s = arguments[0];
        for (i = 1; i < arguments.length; i++) {
            s += arguments[i].substr(0, 1).toUpperCase() + arguments[i].substr(1);
        }
        return s;
    };
    AW.textPattern = /(\"|&|<|>)/gm;
    AW.textTable = {
        "\"": "&quot;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;"
    };
    AW.textReplace = function(c) {
        return AW.textTable[c] || "";
    };
    AW.htmlPattern = /(&quot;|&amp;|&lt;|&gt;|<[^<>]*>)/gm;
    AW.htmlTable = {
        "&quot;": "\"",
        "&amp;": "&",
        "&lt;": "<",
        "&gt;": ">"
    };
    AW.htmlReplace = function(e) {
        return AW.htmlTable[e] || "";
    };
    AW.valueToText = function(v) {
        return v ? String(v).replace(AW.textPattern, AW.textReplace) : "";
    };
    AW.textToValue = function(t) {
        return t ? String(t).replace(AW.htmlPattern, AW.htmlReplace) : "";
    };
})();
 (function() {
    var ua = navigator.userAgent || "";
    AW.browser = "";
    if (document.recalc || document.documentMode) {
        AW.browser = "ie";
    }
    if (window.XULElement) {
        AW.browser = "gecko";
    }
    if (window.opera) {
        AW.browser = "opera";
    }
    if (ua.match("WebKit")) {
        AW.browser = "webkit";
    }
    if (ua.match("Konqueror")) {
        AW.browser = "konqueror";
    }
    if (AW.browser) {
        AW[AW.browser] = true;
    }
    if (AW.webkit) {
        if (ua.match("Chrome")) {
            AW.chrome = true;
        } else if (ua.match("Safari")) {
            AW.safari = true;
        }
    }
    if (AW.safari && !document.evaluate) {
        AW.safari2 = true;
    }
    if (!ua.match("Windows")) {
        AW.unix = true;
    }
    AW.theme = "classic";
    if (ua.match("Windows NT 6")) {
        AW.theme = "vista";
    }
    if (ua.match("Windows NT 5.1")) {
        AW.theme = "xp";
    }
    if (ua.match("Mac OS")) {
        AW.theme = "aqua";
    }
    AW.strict = ("" + document.compatMode).match("CSS");
    if (AW.safari2 || (AW.safari && !document.compatMode && document.doctype && (document.doctype.systemId || !("" + document.doctype.publicId).match(/(Transitional|Final)/)))) {
        AW.strict = true;
    }
    if (!AW.strict) {
        AW.quirks = true;
    }
    var htmlc = " aw-all";
    if (AW.strict) {
        htmlc += " aw-strict";
    }
    if (AW.quirks) {
        htmlc += " aw-quirks";
    }
    if (AW.browser) {
        htmlc += " aw-" + AW.browser;
    }
    if (AW.safari) {
        htmlc += " aw-safari";
    }
    if (AW.chrome) {
        htmlc += " aw-chrome";
    }
    if (AW.unix) {
        htmlc += " aw-unix";
    }
    if (AW.theme) {
        htmlc += " aw-" + AW.theme;
    }
    if (AW.theme && AW.strict) {
        htmlc += " aw-" + AW.theme + "-strict";
    }
    if (AW.ie) {
        var s = document.documentElement.currentStyle;
        if (s.outlineStyle) {
            AW.ie8 = true;
            htmlc += " aw-ie8";
        } else if (s.maxWidth) {
            AW.ie7 = true;
            htmlc += " aw-ie7";
        } else if (s.textOverflow) {
            AW.ie6 = true;
            htmlc += " aw-ie6";
        } else if (s.writingMode) {
            AW.ie5 = true;
            htmlc += " aw-ie5";
        }
        s = null;
        if (document.documentMode >= 8) {
            AW.ms8 = true;
            htmlc += " aw-ms8";
        } else if (document.documentMode == 7 || (AW.ie7 && AW.strict)) {
            AW.ms7 = true;
            htmlc += " aw-ms7";
        } else if (AW.ie6 && AW.strict) {
            AW.ms6 = true;
            htmlc += " aw-ms6";
        } else {
            AW.ms5 = true;
            htmlc += " aw-ms5";
        }
    }
    if (AW.gecko) {
        if (document.elementFromPoint) {
            AW.ff3 = true;
            htmlc += " aw-ff3";
        } else if (window.globalStorage) {
            AW.ff2 = true;
            htmlc += " aw-ff2";
        } else if (window.XPCNativeWrapper) {
            AW.ff15 = true;
            htmlc += " aw-ff15";
        } else {
            AW.ff1 = true;
            htmlc += " aw-ff1";
        }
        if (!AW.ff3) {
            AW.ffx = true;
            htmlc += " aw-ffx";
        }
    }
    if (AW.ie5 || AW.ie6) {
        htmlc += " aw-png1 aw-" + AW.theme + "-png1";
    } else {
        htmlc += " aw-png2";
    }
    AW._htmlClasses = htmlc;
    if (AW.strict) {
        AW.dx = 8;
        AW.dy = 4;
    } else {
        AW.dx = 0;
        AW.dy = 0;
    }
    AW.sx = 20;
    AW.sy = 20;
})();
 (function() {
    if (AW.ie) {
        try {
            document.execCommand("BackgroundImageCache", false, true);
        } catch(err) {}
        AW.attachEvent = function(element, name, handler) {
            return element.attachEvent(name, handler);
        };
        AW.detachEvent = function(element, name, handler) {
            return element.detachEvent(name, handler);
        };
        AW.srcElement = function(event) {
            if (event) {
                return event.srcElement;
            }
        };
        AW.toElement = function(event) {
            if (event) {
                return event.toElement;
            }
        };
        AW.setReturnValue = function(event, value) {
            if (event) {
                event.returnValue = value;
            }
        };
        AW.setCapture = function(element) {
            return element.setCapture();
        };
        AW.releaseCapture = function(element) {
            return element.releaseCapture();
        };
        AW.addRule = function(stylesheet, selector, rule) {
            return stylesheet.addRule(selector, rule);
        };
        AW.getRules = function(stylesheet) {
            return stylesheet.rules;
        };
        AW.setOuterHTML = function(element, html) {
            element.outerHTML = html;
        };
        AW.createXMLHttpRequest = function() {
            try {
                return new ActiveXObject("MSXML2.XMLHTTP");
            } catch(err) {}
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch(err) {}
            try {
                return new XMLHttpRequest;
            } catch(err) {}
        };
        AW.getLeft = function(element) {
            return element.getBoundingClientRect().left + document.documentElement.scrollLeft + document.body.scrollLeft;
        };
        AW.getTop = function(element) {
            return element.getBoundingClientRect().top + document.documentElement.scrollTop + document.body.scrollTop;
        };
        AW.contains = function(parent, child) {
            return parent && child ? parent.contains(child) : false;
        };
    }
})();
 (function() {
    if (!AW.ie) {
        var capture;
        AW.attachEvent = function(target, name, handler) {
            if (capture) {
                handler[name] = function(event) {
                    return handler.call(target, event);
                };
                window.addEventListener(name.replace(/^on/, ""), handler[name], true);
            } else {
                target.addEventListener(name.replace(/^on/, ""), handler, false);
            }
        };
        AW.detachEvent = function(target, name, handler) {
            if (capture) {
                window.removeEventListener(name.replace(/^on/, ""), handler[name], true);
                handler[name] = null;
            } else {
                target.removeEventListener(name.replace(/^on/, ""), handler, false);
            }
        };
        AW.srcElement = function(event) {
            try {
                return (event.target && event.target.nodeType == 3) ? event.target.parentNode: event.target;
            } catch(e) {
                return event.target;
            }
        };
        AW.toElement = function(event) {
            try {
                return (event.relatedTarget && event.relatedTarget.nodeType == 3) ? event.relatedTarget.parentNode: event.relatedTarget;
            } catch(e) {
                return event.relatedTarget;
            }
        };
        AW.setReturnValue = function(event, value) {
            if (event && event.preventDefault && !value) {
                event.preventDefault();
            }
        };
        AW.setCapture = function(element) {
            capture = element;
        };
        AW.releaseCapture = function(element) {
            capture = null;
        };
        AW.addRule = function(stylesheet, selector, rule) {
            var i = stylesheet.cssRules.length;
            stylesheet.insertRule(selector + "{" + rule + "}", i);
            stylesheet.cssRules[i].style.cssText = rule;
        };
        AW.getRules = function(stylesheet) {
            return stylesheet.cssRules;
        };
        AW.setOuterHTML = function(element, html) {
            var range = element.ownerDocument.createRange();
            range.setStartBefore(element);
            var fragment = range.createContextualFragment(html);
            element.parentNode.replaceChild(fragment, element);
        };
        AW.createXMLHttpRequest = function() {
            return new XMLHttpRequest;
        };
        AW.getLeft = function(element) {
            return getRectangle(element).left - getScroll(element).left;
        };
        AW.getTop = function(element) {
            return getRectangle(element).top - getScroll(element).top;
        };
        var getRectangle = function(e) {
            var t = e,
            x = 0,
            y = 0;
            function getPos(el) {
                if (!el) {
                    return {
                        x: 0,
                        y: 0
                    };
                }
                if (el == document.body.parentNode) {
                    return {
                        x: 0,
                        y: 0
                    };
                }
                if (el == document.body) {
                    return {
                        x: el.offsetLeft,
                        y: el.offsetTop
                    };
                }
                var p = el.offsetParent;
                var pp = getPos(p);
                return {
                    x: el.offsetLeft + pp.x,
                    y: el.offsetTop + pp.y
                };
            }
            var pp = getPos(e);
            return {
                left: pp.x,
                right: pp.x + e.offsetWidth,
                top: pp.y,
                bottom: pp.y + e.offsetHeight
            };
        };
        var getScroll = function(e) {
            var s = {
                left: 0,
                top: 0
            };
            if (!AW.webkit) {
                return s;
            }
            e = e.parentNode;
            while (e && e !== document.body && e !== document.documentElement) {
                s.left += e.scrollLeft;
                s.top += e.scrollTop;
                e = e.parentNode;
            }
            return s;
        };
        AW.contains = function(parent, child) {
            while (child) {
                if (parent == child) {
                    return true;
                }
                child = child.parentNode;
            }
            return false;
        };
    }
    if (AW.gecko) {
        AW.getLeft = function(element) {
            var doc = document.getBoxObjectFor(document.body);
            return document.getBoxObjectFor(element).screenX - doc.screenX + doc.x;
        };
        AW.getTop = function(element) {
            var doc = document.getBoxObjectFor(document.body);
            return document.getBoxObjectFor(element).screenY - doc.screenY + doc.y;
        };
    }
    if (document.documentElement.getBoundingClientRect) {
        AW.getLeft = function(element) {
            return element.getBoundingClientRect().left + document.documentElement.scrollLeft + document.body.scrollLeft;
        };
        AW.getTop = function(element) {
            return element.getBoundingClientRect().top + document.documentElement.scrollTop + document.body.scrollTop;
        };
    }
    if (AW.webkit || AW.opera) {
        AW.setOuterHTML = function(element, html) {
            element.outerHTML = html;
        };
    }
})();
 (function() {
    AW._addMouseEvents = function(obj, name) {
        function clear() {
            var e = this.element();
            if (e) {
                e.className = e.className.replace(/ aw-mouse(over|down)-\w+/g, "");
            }
            e = null;
        }
        if (obj.setController) {
            if (name) {
                obj.setController("highlight", {
                    onControlMouseOver: function() {
                        if (this._controlDisabled) {
                            return
                        }
                        var e = this.element();
                        if (e) {
                            e.className += " aw-mouseover-" + name;
                        }
                        e = null;
                    },
                    onControlMouseDown: function() {
                        if (this._controlDisabled) {
                            return
                        }
                        var e = this.element();
                        if (e) {
                            e.className += " aw-mousedown-" + name;
                        }
                        e = null;
                    },
                    onControlMouseOut: clear,
                    onControlMouseUp: clear
                });
            }
        } else {
            obj._raiseEvents = true;
            obj.onMouseOver = function() {
                if (this.$owner && this.$owner._controlDisabled) {
                    return
                }
                var e = this.element();
                if (e) {
                    e.className += " aw-mouseover-" + this.$name + (name ? " aw-mouseover-" + name: "");
                    if (AW.ie) {
                        var h = e.offsetHeight;
                    }
                }
                e = null;
            };
            obj.onMouseDown = function() {
                if (this.$owner && this.$owner._controlDisabled) {
                    return
                }
                var e = this.element();
                if (e) {
                    e.className += " aw-mousedown-" + this.$name + (name ? " aw-mousedown-" + name: "");
                    if (AW.ie) {
                        var h = e.offsetHeight;
                    }
                }
                e = null;
            };
            obj.onMouseOut = clear;
            obj.onMouseUp = clear;
        }
    };
    AW._startEventManager = function() {
        var keyNames = {
            8: "Backspace",
            9: "Tab",
            13: "Enter",
            27: "Escape",
            32: "Space",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            45: "Insert",
            46: "Delete",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12"
        };
        function keydown(event) {
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
                raiseKbEvent("onKey" + key, event);
            }
        }
        var excludeOperaKeys = {
            35: 1,
            36: 1,
            45: 1,
            46: 1
        };
        function keypress(event) {
            if ((AW.ie || (AW.opera && event.which && (event.keyCode > 31 || event.keyCode == 13) && !excludeOperaKeys[event.keyCode]) || (event.charCode && event.charCode < 63000)) && !(event.altKey || event.ctrlKey)) {
                raiseKbEvent("onKeyPress", event);
            }
        }
        function keyup() {
            AW._scrollWait = false;
        }
        function raiseKbEvent(name, event) {
            try {
                var target = event.srcElement || event.target;
                var obj,
                e = target;
                while (e) {
                    if (e.id && typeof(e.id) == "string") {
                        obj = AW.object(e.id, true);
                        if (obj && obj.setController) {
                            obj.raiseEvent(name, event);
                            e = obj.element();
                        }
                    }
                    e = e.parentNode;
                }
            } catch(err) {}
        }
        function raiseControlEvent(name, obj, event) {
            var name0,
            name1;
            if (obj.setController) {
                if ((AW.webkit || AW.opera || AW.konqueror) && !event.done) {
                    if (name.match("MouseDown") && event.target.tagName != "INPUT" && event.target.tagName != "SELECT" && !AW.safari2) {
                        event.preventDefault();
                    }
                    if (name == "Clicking") {
                        if (obj.getId() != AW._edit) {
                            obj.focus();
                        }
                        event.done = true;
                    }
                }
                if ((!obj.$active || AW._edit) && (name.indexOf("Click") > -1)) {
                    return
                }
                name1 = "onControl" + name;
                return obj.raiseEvent(name1, event, obj.$0, obj.$1, obj.$2);
            }
            if (obj.$name && obj.raiseEvent) {
                if ((AW.webkit || AW.opera || AW.konqueror) && !event.done) {
                    if (name.match("MouseDown") && event.target.tagName != "INPUT" && event.target.tagName != "SELECT" && !AW.safari2) {
                        event.preventDefault();
                    }
                    if (name == "Clicking") {
                        if (obj.getId() != AW._edit && obj.$owner.$name != "popup") {
                            obj.$owner.focus();
                        }
                        event.done = true;
                    }
                }
                if (!obj._raiseEvents) {
                    return
                }
                if (!AW.$popup && (!obj.$owner.$active || AW._edit) && (name.indexOf("Click") > -1)) {
                    return
                }
                name0 = "on" + name;
                if (typeof obj[name0] == "function") {
                    obj[name0](event);
                }
                name1 = AW.camelCase("on", obj.$name, name);
                return obj.$owner.raiseEvent(name1, event, obj.$0, obj.$1, obj.$2);
            }
        }
        var targets = {};
        function handleMouse(e, event) {
            try {
                if (AW.ignoreMouse) {
                    return
                }
                var i,
                obj,
                temp = {};
                while (e) {
                    if (e.id && typeof(e.id) == "string") {
                        obj = AW.object(e.id, true);
                        if (obj) {
                            e = obj.element();
                            temp[e.id] = true;
                        }
                    }
                    e = e.parentNode;
                }
                for (i in targets) {
                    if (!temp[i]) {
                        obj = AW.object(i, true);
                        if (obj) {
                            raiseControlEvent("MouseOut", obj, event);
                        }
                    }
                }
                for (i in temp) {
                    if (!targets[i]) {
                        obj = AW.object(i, true);
                        if (obj) {
                            raiseControlEvent("MouseOver", obj, event);
                        }
                    }
                }
                targets = temp;
            } catch(error) {}
        }
        function copyEvent(e, type) {
            if (AW.ie && e.type != "mousedown") {
                return document.createEventObject(e);
            } else if (AW.webkit || AW.opera || AW.konqueror || e.type == "mousedown") {
                return {
                    type: e.type,
                    ctrlKey: e.ctrlKey,
                    altKey: e.altKey,
                    shiftKey: e.shiftKey,
                    button: e.button,
                    target: e.target,
                    srcElement: e.target || e.srcElement
                };
            } else {
                var event = document.createEvent("MouseEvents");
                event.initMouseEvent(type || e.type, true, true, e.view, 1, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
                event.srcElement = e.target;
                return event;
            }
        }
        var clickingEvent = null;
        function raiseClickingEvent() {
            if (clickingEvent) {
                mouseClicks("Clicking")(clickingEvent);
                clickingEvent = null;
            }
        }
        var mouseDownId = "";
        function mouseClicks(name) {
            return function(event) {
                try {
                    if (name == "MouseUp" && clickingEvent) {
                        raiseClickingEvent();
                    }
                    var target = event.srcElement || event.target;
                    var inside = false;
                    var s = (event.ctrlKey ? "Ctrl": "") + (event.altKey ? "Alt": "") + (event.shiftKey ? "Shift": "") + name;
                    var obj,
                    e = target;
                    while (e) {
                        if (e.id && typeof(e.id) == "string") {
                            obj = AW.object(e.id, true);
                            if (obj) {
                                raiseControlEvent(s, obj, event);
                                e = obj.element();
                                inside = true;
                            }
                        }
                        e = e.parentNode;
                    }
                    if (name == "MouseDown" && inside) {
                        clickingEvent = copyEvent(event);
                        window.setTimeout(raiseClickingEvent, 10);
                    }
                    if (name == "MouseDown") {
                        mouseDownId = "";
                    }
                    if ((name == "MouseDown" || name == "Clicking") && inside && (target !== AW.element(target.id))) {
                        mouseDownId = target.id;
                    }
                    if (name == "MouseUp" && mouseDownId && (mouseDownId == target.id)) {
                        if (AW.ie) {
                            event.srcElement.fireEvent("onclick", copyEvent(event));
                        } else {
                            event.target.dispatchEvent(copyEvent(event, "click"));
                        }
                    }
                    e = null;
                    target = null;
                } catch(err) {}
            };
        }
        function focusIE(name) {
            return function(event) {
                try {
                    if (event.srcElement.document !== document) {
                        return
                    }
                    if (name == "Deactivating" && AW._edit) {
                        if (!AW._endEdit()) {
                            return false;
                        }
                    }
                    var obj,
                    e = AW.srcElement(event);
                    while (e) {
                        if (e.id && typeof(e.id) == "string") {
                            obj = AW.object(e.id, true);
                            if (obj && obj.setController) {
                                switch (name) {
                                case "Deactivating":
                                    if (!obj.element().contains(event.toElement)) {
                                        if (AW.ie5) {
                                            obj._deactivate = true;
                                        }
                                        if (raiseControlEvent(name, obj, event)) {
                                            event.returnValue = false;
                                        }
                                    } else if (AW.ie5) {
                                        obj._deactivate = false;
                                    }
                                    break;
                                case "Activating":
                                    if (!obj.$active) {
                                        if (raiseControlEvent(name, obj, event)) {
                                            event.returnValue = false;
                                        }
                                    }
                                    break;
                                case "Deactivated":
                                    if (!obj.element().contains(event.toElement)) {
                                        if (AW.ie5 && !obj._deactivate) {
                                            break;
                                        }
                                        obj.$active = false;
                                        if (raiseControlEvent(name, obj, event)) {
                                            event.returnValue = false;
                                        }
                                    }
                                    break;
                                case "Activated":
                                    if (!obj.$active) {
                                        obj.$active = true;
                                        if (raiseControlEvent(name, obj, event)) {
                                            event.returnValue = false;
                                        }
                                    }
                                    break;
                                }
                                e = obj.element();
                            }
                        }
                        e = e.parentNode;
                    }
                } catch(err) {}
            };
        }
        var handlers = {
            onkeypress: keypress,
            onkeydown: keydown,
            onkeyup: keyup,
            onmousemove: function(event) {
                handleMouse(AW.srcElement(event), event);
            },
            onmouseover: function(event) {
                handleMouse(AW.srcElement(event), event);
            },
            onmouseout: function(event) {
                handleMouse(AW.toElement(event), event);
            },
            onmousedown: mouseClicks("MouseDown"),
            onmouseup: mouseClicks("MouseUp"),
            onclick: mouseClicks("Clicked"),
            ondblclick: mouseClicks("DoubleClicked"),
            onbeforeactivate: focusIE("Activating"),
            onbeforedeactivate: focusIE("Deactivating"),
            onactivate: focusIE("Activated"),
            ondeactivate: focusIE("Deactivated")
        };
        var activeElements = {},
        blurFlag;
        function focusemu(event) {
            try {
                if (AW.opera && event.srcElement === document.body) {
                    return
                }
                if (AW.opera && event.srcElement === document) {
                    return
                }
                if (AW.gecko && event.target === document && event.type) {
                    return bluremu(event);
                }
                blurFlag = false;
                if (AW.lockFocus) {
                    return
                }
                var e = event.target;
                var prevFocus = AW._focus;
                AW._focus = e.id;
                var obj,
                a = {};
                while (e) {
                    if (e.id && typeof(e.id) == "string") {
                        obj = AW.object(e.id, true);
                        if (obj && obj.setController && !obj.getControlDisabled()) {
                            e = obj.element();
                            a[e.id] = true;
                        }
                    }
                    e = e.parentNode;
                }
                function raiseEvents(a1, a2, name, state) {
                    var i,
                    obj,
                    x = {};
                    for (i in a1) {
                        if (!a2[i] && !x[i]) {
                            obj = AW.object(i);
                            if (obj && obj.setController) {
                                if (state !== undefined) {
                                    obj.$active = state;
                                }
                                if (raiseControlEvent(name, obj, event)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
                obj = AW._focus && AW.object(AW._focus, true);
                if (AW._edit && (!obj || (obj && obj.getId() != AW._edit)) && !AW._endEdit()) {
                    AW.element(prevFocus).focus();
                    return true;
                }
                if (raiseEvents(activeElements, a, "Deactivating")) {
                    AW.element(prevFocus).focus();
                    return;
                }
                if (raiseEvents(a, activeElements, "Activating")) {
                    AW.element(AW._focus).blur();
                    return;
                }
                raiseEvents(activeElements, a, "Deactivated", false);
                raiseEvents(a, activeElements, "Activated", true);
                activeElements = a;
            } catch(err) {}
        }
        function bluremu(event) {
            if (AW.opera && event.srcElement === document.body) {
                return
            }
            if (AW.opera && event.srcElement === document) {
                return
            }
            blurFlag = true;
            window.setTimeout(function() {
                window.setTimeout(function() {
                    if (blurFlag) {
                        focusemu({
                            target: document
                        });
                    }
                },
                0);
            },
            0);
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
            } catch(err) {}
        }
        function scrollemu(event) {
            try {
                var e = event.target;
                if (e.getAttribute && e.getAttribute("onscroll")) {
                    return AW(e, event);
                }
                e = null;
            } catch(err) {}
        }
        AW.register = function(win) {
            if (win !== window) {
                win.AW = AW;
                AW.docs.push(win.document);
            }
            var target = AW.ie ? win.document.documentElement: win.document;
            AW.forEach(handlers, 
            function(name, handler) {
                AW.attachEvent(target, name, handler);
            });
            if (!AW.ie) {
                target.addEventListener("focus", focusemu, true);
            }
            if (AW.webkit || AW.opera || AW.konqueror) {
                target.addEventListener("blur", bluremu, true);
            }
            if (AW.gecko) {
                target.addEventListener("DOMMouseScroll", mousewheelemu, true);
            }
            if (AW.konqueror) {
                target.addEventListener("scroll", scrollemu, true);
            }
            function unregister() {
                AW.unregister(win);
                AW.detachEvent(win, "onunload", unregister);
                win = null;
            }
            AW.attachEvent(win, "onunload", unregister);
        };
        AW.unregister = function(win) {
            var target = AW.ie ? win.document.documentElement: win.document;
            AW.forEach(handlers, 
            function(name, handler) {
                AW.detachEvent(target, name, handler);
            });
            if (!AW.ie) {
                target.removeEventListener("focus", focusemu, true);
            }
            if (AW.webkit || AW.opera || AW.konqueror) {
                target.removeEventListener("blur", bluremu, true);
            }
            if (AW.gecko) {
                target.removeEventListener("DOMMouseScroll", mousewheelemu, true);
            }
            if (AW.konqueror) {
                target.removeEventListener("scroll", scrollemu, true);
            }
            if (win != window) {
                var i,
                docs = AW.docs;
                for (i = 0; i < docs.length; i++) {
                    if (docs[i] === win.document) {
                        docs.splice(i, 1);
                        return
                    }
                }
                win.AW = null;
            }
        };
        AW.register(window);
    };
})();
 (function() {
    var obj;
    var originalText;
    var originalNode;
    AW._startEdit = function(target, startText) {
        obj = target;
        if (!obj.element() || raiseEvent("editStarting")) {
            return false;
        }
        originalText = obj.getControlProperty("text");
        obj.element().className += " aw-edit-" + (obj.setController ? "control": obj.$name);
        var e = obj.getContent("box/text").element();
        if (!e || !e.tagName.match(/input/i)) {
            originalNode = e;
            e = document.createElement("input");
            e.setAttribute("id", originalNode ? originalNode.id: obj.getId() + "-box-edit");
            e.setAttribute("type", "text");
            e.setAttribute("class", originalNode ? originalNode.className: "aw-item-text");
            e.setAttribute("autocomplete", "off");
            e.setAttribute("value", originalText);
            e.style.width = calcWidth(originalNode);
            if (originalNode) {
                if (AW.ie) {
                    originalNode.parentNode.insertBefore(e, originalNode);
                    e.focus();
                    e.parentNode.removeChild(originalNode);
                } else {
                    originalNode.parentNode.replaceChild(e, originalNode);
                    e.focus();
                }
            } else {
                var parent = obj.element();
                parent.innerHTML = "<span class=\"aw-item-ruler\"></span>";
                parent.appendChild(e);
                e.focus();
            }
        } else {
            e.style.width = calcWidth(e);
        }
        if (AW.ie) {
            if (!AW.ms8) {
                e.setExpression("aw-value", "this.value");
            }
            e.attachEvent("oncontextmenu", nobubble);
            e.attachEvent("onselectstart", nobubble);
            e.attachEvent("onpropertychange", oninput);
            e.attachEvent("onkeydown", onkeydown);
            e.attachEvent("onbeforedeactivate", onbeforedeactivate);
        } else {
            e.addEventListener("contextmenu", nobubble, false);
            e.addEventListener("input", oninput, false);
            e.addEventListener("keydown", onkeydown, false);
            obj.element().addEventListener("mousedown", onmousedown, true);
        }
        if (obj.$owner) {
            obj.$owner.$edit = true;
        }
        AW._edit = obj.getId();
        raiseEvent("editStarted");
        if (typeof(startText) == "string") {
            obj.setControlProperty("text", startText);
            e.value = startText;
        } else {
            e.select();
        }
        e.parentNode.scrollTop = 0;
        e.parentNode.scrollLeft = 0;
        e = null;
        return true;
    };
    AW._endEdit = function() {
        if (AW._endEditFlag) {
            return false;
        }
        AW._endEditFlag = true;
        try {
            if (originalText != obj.getControlProperty("text") && !AW._commitEdit()) {
                return false;
            }
            if (raiseEvent("editEnding")) {
                return false;
            }
            if (AW.$popup) {
                AW.$popup.hidePopup();
            }
            var e = obj.element().getElementsByTagName("INPUT")[0];
            if (AW.ie) {
                if (!AW.ms8) {
                    e.removeExpression("aw-value");
                }
                e.detachEvent("onselectstart", nobubble);
                e.detachEvent("oncontextmenu", nobubble);
                e.detachEvent("onpropertychange", oninput);
                e.detachEvent("onkeydown", onkeydown);
                e.detachEvent("onbeforedeactivate", onbeforedeactivate);
            } else {
                e.removeEventListener("contextmenu", nobubble, false);
                e.removeEventListener("input", oninput, false);
                e.removeEventListener("keydown", onkeydown, false);
                obj.element().removeEventListener("mousedown", onmousedown, true);
            }
            e.parentNode.scrollLeft = 0;
            var text = obj.getControlProperty("text");
            if (originalNode) {
                originalNode.innerHTML = text;
                if (AW.ie) {
                    e.parentNode.insertBefore(originalNode, e);
                    removeElement(e);
                } else {
                    e.parentNode.replaceChild(originalNode, e);
                }
                originalNode = null;
            } else if (!obj.getContent("box/text").element()) {
                if (AW.ie) {
                    e.parentNode.removeChild(e.previousSibling);
                    e.insertAdjacentHTML("beforeBegin", text);
                    removeElement(e);
                } else {
                    e.parentNode.innerHTML = text;
                }
            }
            e = null;
            obj.element().className = obj.element().className.replace(/ aw-edit-\w+/ig, "");
            if (obj.$owner) {
                obj.$owner.$edit = false;
            }
            AW._edit = "";
            raiseEvent("editEnded");
            return true;
        } finally {
            AW._endEditFlag = false;
        }
    };
    AW._commitEdit = function() {
        if (!AW._edit) {
            return false;
        }
        if (raiseEvent("validating")) {
            return false;
        }
        originalText = obj.getControlProperty("text");
        raiseEvent("validated");
        return true;
    };
    AW._cancelEdit = function() {
        if (!AW._edit) {
            return false;
        }
        obj.setControlProperty("text", originalText);
        obj.element().getElementsByTagName("INPUT")[0].value = originalText;
        return true;
    };
    AW._updateEdit = function() {
        obj.refreshClasses();
        obj.element().className += " aw-edit-" + obj.$name;
        var e = obj.element().getElementsByTagName("INPUT")[0];
        var text = obj.getControlProperty("text");
        if (e && e.value != text) {
            if (AW.ie) {
                var r = document.selection.createRange();
                r.collapse();
                r.select();
            }
            e.value = text;
        }
        e = null;
    };
    function raiseEvent(name) {
        var item = obj.setController ? "control": obj.$name;
        var fullname = AW.camelCase("on", item, name);
        var text = obj.getControlProperty("text");
        return obj.raiseEvent(fullname, text, obj.$0, obj.$1, obj.$2);
    }
    function nobubble(event) {
        if (AW.ie) {
            event.cancelBubble = true;
        } else {
            event.stopPropagation();
        }
    }
    function oninput(event) {
        var text1 = obj.getControlProperty("text");
        var text2 = (event.srcElement || event.target).value;
        if (text2 != text1) {
            obj.setControlProperty("text", text2);
        }
        var text3 = obj.getControlProperty("text");
        if (text3 != text2) { (event.srcElement || event.target).value = text3;
        }
    }
    function onkeydown(event) {
        if (AW.ie) {
            var r = event.srcElement.createTextRange();
            var s = document.selection.createRange();
            if ((event.keyCode == 36 || event.keyCode == 37) && (r.compareEndPoints("StartToEnd", s) || r.compareEndPoints("StartToStart", s))) {
                event.cancelBubble = true;
                r = null;
                s = null;
                return
            }
            if ((event.keyCode == 35 || event.keyCode == 39) && (r.compareEndPoints("EndToEnd", s) || r.compareEndPoints("EndToStart", s))) {
                event.cancelBubble = true;
                r = null;
                s = null;
                return
            }
        } else {
            if ((event.keyCode == 36 || event.keyCode == 37) && event.target.selectionEnd > 0) {
                event.stopPropagation();
                return
            }
            if ((event.keyCode == 35 || event.keyCode == 39) && event.target.selectionStart < event.target.value.length) {
                event.stopPropagation();
                return
            }
        }
    }
    function onbeforedeactivate(event) {
        if (obj.element().contains(event.toElement)) {
            event.returnValue = false;
            event.cancelBubble = true;
        }
    }
    function onmousedown(event) {
        if (event.target && event.target.tagName != "INPUT") {
            event.preventDefault();
            return
        }
    }
    function calcWidth(e) {
        if (!e) {
            return "100%";
        }
        var w = e.offsetWidth + e.parentNode.clientWidth - 5;
        var i,
        ee = e.parentNode.childNodes;
        for (i = 0; i < ee.length; i++) {
            w -= (ee[i].offsetWidth + 1);
        }
        return w + "px";
    }
    function removeElement(node) {
        document.selection.empty();
        node.id = "aw-edit";
        window.setTimeout(function() {
            try {
                node.parentElement.removeChild(node);
            } catch(err) {}
            node = null;
        },
        0);
    }
})();
AW.System.Object = function() {};
AW.System.Object.subclass = function() {
    var create = function(cls) {
        cls.created = true;
        if (cls.superclass && !cls.superclass.created) {
            create(cls.superclass);
        }
        cls.create();
    };
    var constructor = function() {
        if (constructor.defer) {
            return
        }
        if (!constructor.created) {
            create(constructor);
        }
        if (this.init) {
            this.init.apply(this, arguments);
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
AW.System.Object.handle = function(error) {
    throw (error);
};
AW.System.Object.create = function() {
    var obj = this.prototype;
    obj.clone = function() {
        if (this._clone.prototype !== this) {
            this._clone = function() {
                this.init();
            };
            this._clone.prototype = this;
        }
        return new this._clone();
    };
    obj._clone = function() {};
    obj.init = function() {};
    obj.handle = function(error) {
        throw (error);
    };
    obj.setTimeout = function(handler, delay) {
        var self = this;
        var wrapper = function() {
            handler.call(self);
        };
        return window.setTimeout(wrapper, delay ? delay: 0);
    };
    obj.timeout = obj.setTimeout;
    obj.toString = function() {
        return "";
    };
};
AW.System.Object.create();
AW.System.Model = AW.System.Object.subclass();
AW.System.Model.create = function() {
    var obj = this.prototype;
    var join = function() {
        var i,
        s = arguments[0];
        for (i = 1; i < arguments.length; i++) {
            s += arguments[i].substr(0, 1).toUpperCase() + arguments[i].substr(1);
        }
        return s;
    };
    obj.defineProperty = function(name, value) {
        var _getProperty = join("get", name);
        var _setProperty = join("set", name);
        var _property = "_" + name;
        var getProperty = function() {
            return this[_property];
        };
        this[_setProperty] = function(value) {
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
    obj.getProperty = function(name, a, b, c) {
        if (!get[name]) {
            get[name] = join("get", name);
        }
        return this[get[name]](a, b, c);
    };
    obj.setProperty = function(name, value, a, b, c) {
        if (!set[name]) {
            set[name] = join("set", name);
        }
        return this[set[name]](value, a, b, c);
    };
    obj.isReady = function() {
        return true;
    };
};
AW.System.Format = AW.System.Object.subclass();
AW.System.Format.create = function() {
    var obj = this.prototype;
    obj.valueToText = function(value) {
        return value;
    };
    obj.dataToValue = function(data) {
        return data;
    };
    obj.dataToText = function(data) {
        var value = this.dataToValue(data);
        return this.valueToText(value);
    };
    obj.setErrorText = function(text) {
        this._textError = text;
    };
    obj.setErrorValue = function(value) {
        this._valueError = value;
    };
    obj.setErrorText("#ERR");
    obj.setErrorValue(NaN);
    obj.textToValue = function(text) {
        return text;
    };
    obj.textToData = function(text) {
        return text;
    };
    obj.valueToData = function(value) {
        return value;
    };
    obj.comparator = function(values, greater, less, equal, error) {
        return function(i, j) {
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
            } catch(e) {
                return error(i, j, e);
            }
        };
    };
};
AW.System.HTML = AW.System.Object.subclass();
AW.System.HTML.create = function() {
    var obj = this.prototype;
    obj.setTag = function(tag) {
        this._tag = tag;
        resetHTMLCache(this);
    };
    obj.getTag = function() {
        return this._tag;
    };
    obj._tag = "span";
    obj.init = function() {
        if (this.$owner) {
            return
        }
        if (this._parent) {
            return
        }
        this._id = "aw" + AW.all.id++;
        AW.all[this._id] = this;
    };
    obj.getId = function() {
        return this._id;
    };
    obj._id = "";
    obj.setId = function(id) {
        AW.all[this._id] = null;
        this._id = id;
        AW.all[this._id] = this;
        resetHTMLCache(this);
    };
    obj.element = function() {
        var i,
        docs = AW.docs,
        id = this.getId(),
        e;
        if (!id) {
            return
        }
        for (i = 0; i < docs.length; i++) {
            e = docs[i].getElementById(id);
            if (e) {
                return e;
            }
        }
    };
    obj.getClass = function(name) {
        var param = "_" + name + "Class";
        var value = this[param];
        return typeof(value) == "function" ? value.call(getParent(this)) : value;
    };
    obj.setClass = function(name, value) {
        var element = this.element();
        if (element) {
            var v = (typeof(value) == "function") ? value.call(getParent(this)) : value;
            var s = v || v === 0 || v === false ? " aw-" + name + "-" + v + " ": " ";
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
    obj.refreshClasses = function() {
        var element = this.element();
        if (!element) {
            return
        }
        var i,
        name,
        value,
        s = "";
        var classes = this._classes.split(" ");
        for (i = 1; i < classes.length; i++) {
            name = classes[i];
            value = this["_" + name + "Class"];
            if (typeof(value) == "function") {
                value = value.call(getParent(this));
            }
            if (value || value === 0 || value === false) {
                s += "aw-" + name + "-" + value + " ";
            }
        }
        element.className = s;
    };
    obj._classes = "";
    obj.getStyle = function(name) {
        var param = "_" + name + "Style";
        var value = this[param];
        return typeof(value) == "function" ? value.call(getParent(this)) : value;
    };
    obj.setStyle = function(name, value) {
        var param = "_" + name + "Style";
        if (this[param] == null) {
            this._styles += " " + name;
        }
        this[param] = value;
        resetHTMLCache(this);
        var element = this.element();
        if (element) {
            if (!styleNames[name]) {
                styleNames[name] = AW.camelCase.apply(AW, name.split("-"));
            }
            if (typeof(value) == "function") {
                value = value.call(getParent(this));
            }
            element.style[styleNames[name]] = value;
        }
    };
    obj.refreshStyles = function() {
        var element = this.element();
        if (!element) {
            return
        }
        var i,
        name,
        value;
        var styles = this._styles.split(" ");
        for (i = 1; i < styles.length; i++) {
            name = styles[i];
            value = this["_" + name + "Style"];
            if (typeof(value) == "function") {
                value = value.call(getParent(this));
                element.style[styleNames[name]] = value;
            }
        }
    };
    obj._styles = "";
    var styleNames = {};
    obj.getAttribute = function(name) {
        try {
            var param = "_" + name + "Attribute";
            var value = this[param];
            return typeof(value) == "function" ? value.call(getParent(this)) : value;
        } catch(error) {
            this.handle(error);
        }
    };
    obj.setAttribute = function(name, value) {
        try {
            var param = "_" + name + "Attribute";
            if (typeof this[param] == "undefined") {
                this._attributes += " " + name;
            }
            if (specialAttributes[name] && (typeof value == "function")) {
                this[param] = function() {
                    return value.call(this._parent ? getParent(this) : this) ? true: null;
                };
            } else {
                this[param] = value;
            }
            resetHTMLCache(this);
            var element = this.element();
            if (element) {
                if (typeof(value) == "function") {
                    value = value.call(getParent(this));
                }
                if (specialAttributes[name] && !value) {
                    element.removeAttribute(name);
                } else {
                    element.setAttribute(name, value);
                }
            }
        } catch(error) {
            this.handle(error);
        }
    };
    obj.refreshAttributes = function() {
        var element = this.element();
        if (!element) {
            return
        }
        var i,
        name,
        value;
        var attributes = this._attributes.split(" ");
        for (i = 1; i < attributes.length; i++) {
            name = attributes[i];
            value = this["_" + name + "Attribute"];
            if (typeof(value) == "function") {
                value = value.call(getParent(this));
                if (specialAttributes[name] && !value) {
                    element.removeAttribute(name);
                } else {
                    element.setAttribute(name, value);
                }
            }
        }
    };
    obj._attributes = "";
    var specialAttributes = {
        checked: true,
        disabled: true,
        hidefocus: true,
        readonly: true
    };
    obj.getEvent = function(name) {
        try {
            var param = "_" + name + "Event";
            var value = this[param];
            return value;
        } catch(error) {
            this.handle(error);
        }
    };
    obj.setEvent = function(name, value) {
        try {
            var param = "_" + name + "Event";
            if (this[param] == null) {
                this._events += " " + name;
            }
            this[param] = value;
            resetHTMLCache(this);
        } catch(error) {
            this.handle(error);
        }
    };
    obj._events = "";
    obj.getContent = function(name) {
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
                if (typeof(value) == "function") {
                    value = value.call(getParent(this));
                }
                return value;
            }
        } catch(error) {
            this.handle(error);
        }
    };
    obj.setContent = function(name, value) {
        try {
            if (arguments.length == 1) {
                this._content = "";
                if (typeof name == "object") {
                    for (var i in name) {
                        if (typeof(i) == "string") {
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
        } catch(error) {
            this.handle(error);
        }
    };
    obj.refreshContents = function() {
        try {
            var element = this.element();
            if (!element || element.tagName.match(/input|textarea/i)) {
                return
            }
            if (AW._edit && AW.contains(element, AW.element(AW._edit))) {
                return
            }
            var i,
            s = "",
            content = this._content.split(" ");
            for (i = 1; i < content.length; i++) {
                s += this.getContent(content[i]);
            }
            try {
                var focus = AW.element(AW._focus);
            } catch(err) {}
            element.innerHTML = s;
            try {
                if (focus !== AW.element(AW._focus)) {
                    AW.element(AW._focus).focus();
                }
            } catch(err) {}
        } catch(error) {
            this.handle(error);
        }
    };
    obj._content = "";
    var getParamStr = function(i) {
        return "{#" + i + "}";
    };
    var getControlFunc = function(v) {
        return function() {
            return v;
        };
    };
    obj.innerHTML = function() {
        try {
            if (this._innerHTML) {
                return this._innerHTML;
            }
            this._innerParamLength = 0;
            var i,
            j,
            name,
            value,
            param,
            param1,
            param2,
            html,
            item,
            s = "";
            var content = this._content.split(" ");
            for (i = 1; i < content.length; i++) {
                name = content[i];
                value = this["_" + name + "Content"];
                if (typeof(value) == "function") {
                    param = getParamStr(this._innerParamLength++);
                    this[param] = value;
                    s += param;
                } else if (typeof(value) == "object" && value.defineModel) {
                    param = getParamStr(this._innerParamLength++);
                    this[param] = getControlFunc(value);
                    s += param;
                } else if (typeof(value) == "object") {
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
            this._innerHTML = s;
            return s;
        } catch(error) {
            this.handle(error);
        }
    };
    obj.outerHTML = function() {
        try {
            if (this._outerHTML) {
                return this._outerHTML;
            }
            var innerHTML = this.innerHTML();
            this._outerParamLength = this._innerParamLength;
            if (!this._tag) {
                return innerHTML;
            }
            var i,
            tmp,
            name,
            value,
            param;
            var html = "<" + this._tag + " id=\"{id}\"";
            tmp = "";
            var classes = this._classes.split(" ");
            for (i = 1; i < classes.length; i++) {
                name = classes[i];
                value = this["_" + name + "Class"];
                if (typeof(value) == "function") {
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
                if (typeof(value) == "function") {
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
                if (typeof(value) == "function") {
                    param = getParamStr(this._outerParamLength++);
                    this[param] = value;
                    value = param
                } else if (specialAttributes[name] && !value) {
                    value = null
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
                if (typeof(value) == "function") {
                    value = "AW(this,event)";
                }
                tmp += " " + name + "=\"" + value + "\"";
            }
            html += tmp;
            html += ">" + innerHTML + "</" + this._tag + ">";
            this._outerHTML = html;
            return html;
        } catch(error) {
            this.handle(error);
        }
    };
    obj.toString = function() {
        try {
            var i,
            s = this._outerHTML;
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
                var value = this._parent ? this[param].call(getParent(this)) : this[param]();
                if (value === null) {
                    value = "";
                    param = specialParams[i];
                    if (!param) {
                        param = getSpecialParamStr(i);
                    }
                }
                s = s.replace(param, value);
            }
            return s
        } catch(error) {
            this.handle(error)
        }
    };
    var id_pattern = /\{id\}/g;
    var param_cache = [];
    var specialParams = [];
    function getSpecialParamStr(i) {
        return (specialParams[i] = new RegExp("[\\w\\x2D]*=?:?\\x22?\\{#" + i + "\\}[;\\x22]?"));
    }
    function getParent(obj) {
        while (obj) {
            if (!obj._parent || obj.defineModel) {
                return obj;
            }
            obj = obj._parent;
        }
    }
    obj.refresh = function() {
        try {
            var element = this.element();
            if (element) {
                if (AW._edit && AW.contains(element, AW.element(AW._edit))) {
                    return
                }
                try {
                    var focus = AW.element(AW._focus);
                } catch(err) {}
                AW.setOuterHTML(element, this.toString());
                try {
                    if (focus !== AW.element(AW._focus)) {
                        AW.element(AW._focus).focus();
                    }
                } catch(err) {}
            }
        } catch(error) {
            this.handle(error);
        }
    };
    obj.setSize = function(width, height) {
        if (typeof(width) != "undefined") {
            this.setStyle("width", width - AW.dx + "px");
        }
        if (typeof(height) != "undefined") {
            this.setStyle("height", height - AW.dy + "px");
        }
    };
    obj.setPosition = function(left, top) {
        this.setStyle("position", "absolute");
        if (typeof(left) != "undefined") {
            this.setStyle("left", left + "px");
        }
        if (typeof(top) != "undefined") {
            this.setStyle("top", top + "px");
        }
    };
    var errors = {
        101: "non-supported doctype",
        102: "non-supported browser",
        103: "non-supported browser"
    };
    function hte(i) {
        return function() {
            return "AW Error:<a href=\"http:\/\/www.activewidgets.com/error." + i + "/\">" + errors[i] + "</a>"
        }
    }
};
AW.System.Template = AW.System.HTML.subclass();
AW.System.Template.create = function() {
    var obj = this.prototype;
    obj.lock = function() {
        if (!this.$owner) {
            return
        }
        this.$owner[AW.camelCase("set", this.$name)](this, this.$0, this.$1, this.$2);
    };
    obj.getTemplate = function(name) {
        var i,
        args = [],
        get = AW.camelCase("get", name);
        for (i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
        return this[get].apply(this, args);
    };
    obj.setTemplate = function(name, template, index) {
        var set = AW.camelCase("set", name);
        this[set](template, index);
    };
    obj.raiseEvent = function(name, source, a, b, c) {
        if (typeof source == "undefined") {
            source = this;
            a = this.$0;
            b = this.$1;
            c = this.$2
        }
        var handler = this[name];
        if (typeof(handler) == "function") {
            var r = handler.call(this, source, a, b, c);
            if (r) {
                return r;
            }
        }
        if (this.$owner && this.$owner.raiseEvent) {
            return this.$owner.raiseEvent(name, source, a, b, c);
        }
    };
    obj.action = function(name, source, a, b, c) {
        this.raiseEvent(AW.camelCase("on", name), source, a, b, c);
    };
    obj.mapTemplate = function(source, target) {
        var get = AW.camelCase("get", source);
        var get1 = AW.camelCase("get", source, "template");
        if (typeof(target) == "function") {
            this[get] = target;
            this[get1] = target
        } else {
            var u,
            m = AW.camelCase("get", target);
            this[get] = function(a, b, c) {
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
            this[get1] = this[get];
        }
        this.lock();
    };
    obj.mapModel = function(source, target, target2) {
        var get = AW.camelCase("get", source, "property");
        var set = AW.camelCase("set", source, "property");
        if (typeof(target) == "function") {
            this[get] = target;
            if (typeof(target2) == "function") {
                this[set] = target2;
            } else {
                this[set] = function() {};
            }
        } else {
            var _get = AW.camelCase("get", target, "property");
            var _set = AW.camelCase("set", target, "property");
            var u;
            this[get] = function(p, a, b, c) {
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
            this[set] = function(p, v, a, b, c) {
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
AW.System.Control.create = function() {
    AW.System.Template.create.call(this);
    var obj = this.prototype;
    var templates = AW.System.Template.prototype;
    obj.setTag("span");
    obj.setClass("system", "control");
    obj.setAttribute("tabIndex", "-1");
    obj.setAttribute("hideFocus", "true");
    obj.setEvent("oncontextmenu", "return false");
    obj.setEvent("onselectstart", "return false");
    obj.clear = function() {};
    obj.mapTemplate = function() {};
    obj.mapModel = function() {};
    obj.getModel = function(name) {
        var getModel = AW.camelCase("get", name, "model");
        return this[getModel]()
    };
    obj.setModel = function(name, model) {
        var setModel = AW.camelCase("set", name, "model");
        return this[setModel](model)
    };
    obj.defineModel = function(m, z) {
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
        this[defineProperty] = function(p, v, arrayValue) {
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
            this[get] = function(a, b, c) {
                if (this[ext] && this[ext][$get]) {
                    return this[ext][$get](a, b, c);
                }
                var r;
                if (c !== undef && this[_p3] && this[_p3][c] && this[_p3][c][b] && this[_p3][c][b][a] !== undef) {
                    r = this[_p3][c][b][a]
                } else if (b !== undef && (!this[_x2] || !this[_x2][a] || this[_x2][a][b]) && this[_p2] && this[_p2][b] && this[_p2][b][a] !== undef) {
                    r = this[_p2][b][a]
                } else if (a !== undef && this[_p1] && this[_p1][a] !== undef) {
                    r = this[_p1][a]
                } else {
                    r = this[_p]
                }
                return (typeof(r) == "function") ? r.call(this, a, b, c) : r
            };
            function isArray(a) {
                return a && typeof(a) == "object" && !a.constructor.subclass && !arrayValue
            }
            var setProp = function(v, a, b, c) {
                var i;
                if (isArray(v)) {
                    for (i in v) {
                        if (typeof(v[i]) == "function") {
                            continue
                        }
                        if (isArray(v[i])) {
                            this[_p2] = v;
                            delete this[_p3];
                            delete this[_x2];
                            return
                        }
                        break
                    }
                    if (a !== undef) {
                        if (!this[_p2]) {
                            this[_p2] = {}
                        }
                        this[_p2][a] = v;
                        delete this[_p3]
                    } else {
                        this[_p1] = v;
                        delete this[_p2];
                        delete this[_p3];
                        delete this[_x2]
                    }
                    return
                }
                if (c !== undef) {
                    if (!this[_p3]) {
                        this[_p3] = {}
                    }
                    if (!this[_p3][c]) {
                        this[_p3][c] = {}
                    }
                    if (!this[_p3][c][b]) {
                        this[_p3][c][b] = {}
                    }
                    this[_p3][c][b][a] = v
                } else if (b !== undef) {
                    if (!this[_p2]) {
                        this[_p2] = {}
                    }
                    if (!this[_p2][b]) {
                        this[_p2][b] = {}
                    }
                    this[_p2][b][a] = v;
                    if (this[_x2] && this[_x2][a]) {
                        this[_x2][a][b] = true
                    }
                } else if (a !== undef) {
                    if (!this[_p1]) {
                        this[_p1] = {
                            $owner: this
                        }
                    } else if (this[_p1].$owner != this) {
                        var r = this[_p1];
                        this[_p1] = {};
                        for (i in r) {
                            this[_p1][i] = r[i]
                        }
                        this[_p1].$owner = this
                    }
                    this[_p1][a] = v;
                    if (this[_p2]) {
                        if (!this[_x2]) {
                            this[_x2] = {}
                        }
                        this[_x2][a] = {}
                    }
                } else {
                    this[_p] = v;
                    delete this[_p1];
                    delete this[_p2];
                    delete this[_p3];
                    delete this[_x2]
                }
            };
            this[set] = function(v, a, b, c) {
                if (this._groupUpdate) {
                    this._groupUpdate.push({
                        f: setProp,
                        e1: _changing,
                        e2: _changed,
                        v: v,
                        a: a,
                        b: b,
                        c: c
                    });
                    return;
                }
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
            this[clearModel] = function() {
                delete this[_x2];
                delete this[_p3];
                delete this[_p2];
                delete this[_p1];
                delete this[_p];
                clearPrevious.call(this);
                setProp.call(this, v)
            }
        };
        this[getProperty] = function(p, a, b, c) {
            try {
                if (this[ext] && this[ext][getExt[p]]) {
                    return this[ext][getExt[p]](a, b, c)
                }
                return this[getInt[p]](a, b, c)
            } catch(error) {
                return this.handle(error)
            }
        };
        this[setProperty] = function(p, v, a, b, c) {
            try {
                if (this[ext] && this[ext][setExt[p]]) {
                    return this[ext][setExt[p]](v, a, b, c)
                }
                return this[setInt[p]](v, a, b, c)
            } catch(error) {
                return this.handle(error)
            }
        };
        templates[getProperty] = function(p, a, b, c) {
            if (a === undef) {
                return this.$owner[getProperty](p, this.$0, this.$1, this.$2)
            }
            if (b === undef) {
                return this.$owner[getProperty](p, a, this.$0, this.$1)
            }
            if (c === undef) {
                return this.$owner[getProperty](p, a, b, this.$0)
            }
            return this.$owner[getProperty](p, a, b, c)
        };
        templates[setProperty] = function(p, v, a, b, c) {
            if (a === undef) {
                return this.$owner[setProperty](p, v, this.$0, this.$1, this.$2)
            }
            if (b === undef) {
                return this.$owner[setProperty](p, v, a, this.$0, this.$1)
            }
            if (c === undef) {
                return this.$owner[setProperty](p, v, a, b, this.$0)
            }
            return this.$owner[setProperty](p, v, a, b, c)
        };
        this[getModel] = function() {
            return this[ext]
        };
        this[setModel] = function(model) {
            this[ext] = model;
            if (model) {
                model.$owner = this
            }
        };
        this[clearModel] = function() {
            if (this[ext] && this[ext].$owner) {
                delete this[ext].$owner
            }
            delete this[ext]
        };
        var clear = this.clear;
        this.clear = function() {
            clear.call(this);
            this[clearModel]()
        };
        var i,
        zz = {};
        for (i in z) {
            if (!zz[i]) {
                this[defineProperty](i, z[i])
            }
        }
    };
    obj._startUpdate = function() {
        this._groupUpdate = []
    };
    obj._endUpdate = function() {
        var i,
        r,
        u = this._groupUpdate;
        this._groupUpdate = null;
        for (i = 0; i < u.length; i++) {
            r = u[i];
            this.raiseEvent(r.e1, r.v, r.a, r.b, r.c)
        }
        for (i = 0; i < u.length; i++) {
            r = u[i];
            r.f.call(this, r.v, r.a, r.b, r.c)
        }
        for (i = 0; i < u.length; i++) {
            r = u[i];
            this.raiseEvent(r.e2, r.v, r.a, r.b, r.c)
        }
    };
    obj.defineTemplate = function(name, template) {
        var ref = "_" + name + "Template";
        var ref1 = ref + "1",
        ref2 = ref + "2",
        ref3 = ref + "3";
        var get = AW.camelCase("get", name);
        var set = AW.camelCase("set", name);
        var get1 = AW.camelCase("get", name, "template");
        var set1 = AW.camelCase("set", name, "template");
        var name1 = "-" + name;
        var name2 = "-" + name + "-";
        var undef;
        this[get] = function(a, b, c) {
            var r,
            id,
            clone;
            if (a === undef) {
                id = this._id + name1;
                r = this[ref]
            } else if (b === undef) {
                id = this._id + name2 + a;
                r = this[ref1] && this[ref1][a];
                if (!r) {
                    r = this[ref];
                    clone = true
                }
            } else if (c === undef) {
                id = this._id + name2 + a + "-" + b;
                r = this[ref2] && this[ref2][a] && this[ref2][a][b];
                if (!r) {
                    r = (this[ref1] && this[ref1][a]) || this[ref];
                    clone = true
                }
            } else {
                id = this._id + name2 + a + "-" + b + "-" + c;
                r = this[ref3] && this[ref3][a] && this[ref3][a][b] && this[ref3][a][b][c];
                if (!r) {
                    r = (this[ref2] && this[ref2][a] && this[ref2][a][b]) || (this[ref1] && this[ref1][a]) || this[ref];
                    clone = true
                }
            }
            if (typeof(r) == "function") {
                return r.call(this, a, b, c)
            }
            if ((this.$clone) && (clone || r.$owner != this)) {
                r = r.clone()
            }
            r.$owner = this;
            r.$0 = a;
            r.$1 = b;
            r.$2 = c;
            r._id = id;
            return r
        };
        templates[get] = function(a, b, c) {
            if (a === undef) {
                return this.$owner[get](this.$0, this.$1, this.$2)
            }
            if (b === undef) {
                return this.$owner[get](a, this.$0, this.$1)
            }
            if (c === undef) {
                return this.$owner[get](a, b, this.$0)
            }
            return this.$owner[get](a, b, c)
        };
        this[set] = function(template, a, b, c) {
            var previous;
            if (a === undef) {
                previous = this[ref];
                this[ref] = template
            } else if (b === undef) {
                if (!this[ref1]) {
                    this[ref1] = {}
                }
                previous = this[ref1][a];
                this[ref1][a] = template
            } else if (c === undef) {
                if (!this[ref2]) {
                    this[ref2] = {}
                }
                if (!this[ref2][a]) {
                    this[ref2][a] = {}
                }
                previous = this[ref2][a][b];
                this[ref2][a][b] = template
            } else {
                if (!this[ref3]) {
                    this[ref3] = {}
                }
                if (!this[ref3][a]) {
                    this[ref3][a] = {}
                }
                if (!this[ref3][a][b]) {
                    this[ref3][a][b] = {}
                }
                previous = this[ref3][a][b][c];
                this[ref3][a][b][c] = template
            }
            if (template) {
                template.$name = name;
                template.$0 = a;
                template.$1 = b;
                template.$2 = c;
                if (template.$owner !== this && template !== previous) {
                    template.$owner = this;
                    this.raiseEvent(AW.camelCase("on", name, "templateChanged"), template, a, b, c)
                }
            }
        };
        this[set](template);
        this[get1] = this[get];
        this[set1] = this[set];
        templates[get1] = templates[get]
    };
    obj.$clone = true;
    function controlValue() {
        var text = this.getControlText();
        var format = this.getControlFormat();
        return format ? format.textToValue(text) : text
    }
    function controlData() {
        var value = this.getControlValue();
        var format = this.getControlFormat();
        return format ? format.valueToData(value) : value
    }
    obj.defineModel("tab", {
        index: 0
    });
    obj.defineModel("control", {
        text: "",
        image: "",
        link: "",
        value: controlValue,
        data: controlData,
        format: "",
        tooltip: "",
        state: "",
        visible: true,
        disabled: false
    });
    obj.setControlSize = obj.setSize;
    obj.setControlPosition = obj.setPosition;
    obj.onControlVisibleChanged = function(value) {
        this.setClass("visible", value)
    };
    obj.focus = function() {};
    obj.setName = function(name) {
        var hidden = new AW.HTML.INPUT;
        hidden.setAttribute("type", "hidden");
        hidden.setAttribute("name", name);
        hidden.setAttribute("value", 
        function() {
            return AW.valueToText(this.getControlData())
        });
        this.setContent("data", hidden)
    };
    obj.setController = function(name, controller) {
        var i,
        n = "_" + name + "Controller";
        this[n] = controller;
        for (i = 0; i < this._controllers.length; i++) {
            if (this._controllers[i] == n) {
                return
            }
        }
        this._controllers = this._controllers.concat();
        this._controllers.push(n)
    };
    obj._controllers = [];
    obj.raiseEvent = function(name, source, a, b, c) {
        var i,
        r;
        var handler = this[name];
        if (typeof(handler) == "function") {
            r = handler.call(this, source, a, b, c);
            if (r) {
                return r
            }
        }
        for (i = 0; i < this._controllers.length; i++) {
            handler = this[this._controllers[i]] ? this[this._controllers[i]][name] : null;
            if (typeof(handler) == "function") {
                r = handler.call(this, source, a, b, c);
                if (r) {
                    return r
                }
            } else if (typeof(handler) == "string" && handler != name) {
                r = this.raiseEvent(handler, source, a, b, c);
                if (r) {
                    return r
                }
            }
        }
    };
    obj.action = function(name, source, a, b, c) {
        this.raiseEvent(AW.camelCase("on", name), source, a, b, c)
    };
    obj.$active = false;
    AW._startEventManager()
};
AW.Formats.String = AW.System.Format.subclass();
AW.Formats.String.create = function() {
    var obj = this.prototype;
    obj.valueToText = function(data) {
        return data ? String(data).replace(AW.textPattern, AW.textReplace) : ""
    };
    obj.textToValue = function(text) {
        return text ? String(text).replace(AW.htmlPattern, AW.htmlReplace) : ""
    };
    obj.dataToText = obj.valueToText;
    obj.textToData = obj.textToValue;
    if ("".localeCompare) {
        obj.comparator = function(values, greater, less, equal, error) {
            return function(i, j) {
                try {
                    return greater * ("" + values[i]).localeCompare(values[j]) || equal(i, j)
                } catch(e) {
                    return error(i, j, e)
                }
            }
        }
    }
};
AW.Formats.Number = AW.System.Format.subclass();
AW.Formats.Number.create = function() {
    var obj = this.prototype;
    obj.dataToValue = function(v) {
        return Number(("" + v).replace(numPattern, ""))
    };
    obj.textToValue = function(v) {
        return Number(("" + v).replace(numPattern, ""))
    };
    var numPattern = /[^0-9.\-+]+/gm;
    var noFormat = function(value) {
        return "" + value
    };
    var doFormat = function(value) {
        var abs = (value < 0) ? -value: value;
        var rounded = value.toFixed(this._decimals);
        if (abs < 1000) {
            return rounded.replace(this.p1, this.r1)
        }
        if (abs < 1000000) {
            return rounded.replace(this.p2, this.r2)
        }
        if (abs < 1000000000) {
            return rounded.replace(this.p3, this.r3)
        }
        return rounded.replace(this.p4, this.r4)
    };
    obj.setTextFormat = function(format) {
        var pattern = /^([^0#]*)([0#]*)([ .,]?)([0#]|[0#]{3})([.,])([0#]*)([^0#]*)$/;
        var f = format.replace(/\$/g, "$$$$").match(pattern);
        if (!f) {
            this.valueToText = function(value) {
                return "" + value
            };
            this.dataToText = function(value) {
                return "" + value
            };
            return
        }
        this.valueToText = doFormat;
        this.dataToText = function(v) {
            return doFormat.call(this, Number(("" + v).replace(numPattern, "")))
        };
        var rs = f[1];
        var rg = f[3];
        var rd = f[5];
        var re = f[7];
        this._decimals = f[6].length;
        var ps = "^(-?\\d+)",
        pm = "(\\d{3})",
        pe = "\\.(\\d{" + this._decimals + "})$";
        if (!this._decimals) {
            pe = "($)";
            rd = ""
        }
        this.p1 = new RegExp(ps + pe);
        this.p2 = new RegExp(ps + pm + pe);
        this.p3 = new RegExp(ps + pm + pm + pe);
        this.p4 = new RegExp(ps + pm + pm + pm + pe);
        this.r1 = rs + "$1" + rd + "$2" + re;
        this.r2 = rs + "$1" + rg + "$2" + rd + "$3" + re;
        this.r3 = rs + "$1" + rg + "$2" + rg + "$3" + rd + "$4" + re;
        this.r4 = rs + "$1" + rg + "$2" + rg + "$3" + rg + "$4" + rd + "$5" + re
    };
    obj.setTextFormat("")
};
AW.Formats.Date = AW.System.Format.subclass();
AW.Formats.Date.create = function() {
    var obj = this.prototype;
    obj.date = new Date();
    var shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var longMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var shortWeekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var longWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (!obj.shortMonths) {
        obj.shortMonths = shortMonths
    }
    if (!obj.longMonths) {
        obj.longMonths = longMonths
    }
    if (!obj.shortWeekdays) {
        obj.shortWeekdays = shortWeekdays
    }
    if (!obj.longWeekdays) {
        obj.longWeekdays = longWeekdays
    }
    obj.digits = [];
    for (var i = 0; i < 100; i++) {
        obj.digits[i] = i < 10 ? "0" + i: "" + i
    }
    var tokens = {
        "hh": "this.digits[this.date.getUTCHours()]",
        "h": "this.date.getUTCHours()",
        ":mm": "':'+this.digits[this.date.getUTCMinutes()]",
        "mm:": "this.digits[this.date.getUTCMinutes()]+':'",
        "ss": "this.digits[this.date.getUTCSeconds()]",
        "tt": "(this.date.getUTCHours()>11?'PM':'AM')",
        "dddd": "this.longWeekdays[this.date.getUTCDay()]",
        "ddd": "this.shortWeekdays[this.date.getUTCDay()]",
        "dd": "this.digits[this.date.getUTCDate()]",
        "d": "this.date.getUTCDate()",
        "mmmm": "this.longMonths[this.date.getUTCMonth()]",
        "mmm": "this.shortMonths[this.date.getUTCMonth()]",
        "mm": "this.digits[this.date.getUTCMonth()+1]",
        "m": "(this.date.getUTCMonth()+1)",
        "yyyy": "this.date.getUTCFullYear()",
        "yy": "this.digits[this.date.getUTCFullYear()%100]"
    };
    var tokens12 = {},
    match = "";
    for (i in tokens) {
        if (typeof(i) == "string") {
            tokens12[i] = tokens[i];
            match += "|" + i
        }
    }
    tokens12.hh = "this.digits[1+(this.date.getUTCHours()+11)%12]";
    tokens12.h = "(1+(this.date.getUTCHours()+11)%12)";
    var re = new RegExp(match.replace("|", "(") + ")", "gi");
    var reverse = {
        "hh": ["(\\d{1,2})", "a[3]=", ";"],
        "h": ["(\\d{1,2})", "a[3]=", ";"],
        ":mm": [":(\\d{1,2})", "a[4]=", ";"],
        "mm:": ["(\\d{1,2}):", "a[4]=", ";"],
        "ss": ["(\\d{1,2})", "a[5]=", ";"],
        "tt": ["(AM|PM)", "a[3]=", "=='AM'?a[3]%12:a[3]%12+12;"],
        "dd": ["(\\d{1,2})", "a[2]=", ";"],
        "d": ["(\\d{1,2})", "a[2]=", ";"],
        "mmmm": ["([^\\s\\x2c-\\x2f\\x5c;]+)", "a[1]=this.rMonths[", ".toLowerCase()];"],
        "mmm": ["([^\\s\\x2c-\\x2f\\x5c;]+)", "a[1]=this.rMonths[", ".toLowerCase()];"],
        "mm": ["(\\d{1,2})", "a[1]=Number(", ")-1;"],
        "m": ["(\\d{1,2})", "a[1]=Number(", ")-1;"],
        "yyyy": ["(\\d{1,4})", "a[0]=Number(", ");if(a[0]<30){a[0]+=2000};"],
        "yy": ["(\\d{1,4})", "a[0]=Number(", ");if(a[0]<30){a[0]+=2000};"]
    };
    var delim = /[\s\x2c-\x2f\x5c;]+/g;
    obj.setTextFormat = function(format) {
        format = format.replace(/am\/pm/i, "tt");
        var tok = format.match("tt") ? tokens12: tokens;
        var code = format.replace(re, 
        function(i) {
            return "'+" + tok[i.toLowerCase()] + "+'"
        });
        code = "if(isNaN(value)||(value===this._valueError))return this._textError;" + "this.date.setTime(value+this._textTimezoneOffset);" + ("return '" + code + "'").replace(/(''\+|\+'')/g, "");
        this.valueToText = new Function("value", code);
        var num = 0;
        code = "var a=[this._year,0,1];if(String(text).match(this._t2v)){\n";
        function item(i) {
            i = i.toLowerCase();
            if (reverse[i]) {
                code += reverse[i][1] + "RegExp.$" + (++num) + reverse[i][2];
                return reverse[i][0]
            } else {
                return "\\w+"
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
            this.rMonths[this.longMonths[m].toLowerCase()] = m
        }
        this._year = (new Date).getUTCFullYear()
    };
    var xmlExpr = /(\d\d\d\d)-(\d\d)-(\d\d)[T ]?(\d\d)?(:\d\d)?(:\d\d)?(\.\d+)?Z?([+-]\d\d)?:?(\d\d)?/;
    var xmlOut = "$1/$2/$3 $4$5$6 GMT$8$9";
    var auto = function(data) {
        var value = Date.parse(data + this._dataTimezoneCode);
        return isNaN(value) ? this._valueError: value
    };
    var RFC822 = function(data) {
        var value = Date.parse(data);
        return isNaN(value) ? this._valueError: value
    };
    var ISO8601 = function(data) {
        var value = Date.parse(data.replace(xmlExpr, xmlOut));
        return isNaN(value) ? this._valueError: value
    };
    obj.setDataFormat = function(format) {
        if (format == "RFC822" || format == "rfc822") {
            this.dataToValue = RFC822
        } else if (format == "ISO8601" || format == "iso8601" || format == "ISO8061") {
            this.dataToValue = ISO8601
        } else {
            this.dataToValue = auto
        }
    };
    obj.setTextTimezone = function(value) {
        this._textTimezoneOffset = value
    };
    obj.setDataTimezone = function(value) {
        if (!value) {
            this._dataTimezoneCode = " GMT"
        } else {
            this._dataTimezoneCode = " GMT" + (value > 0 ? "+": "-") + this.digits[Math.floor(Math.abs(value / 3600000))] + this.digits[Math.abs(value / 60000) % 60]
        }
    };
    var localTimezone = -obj.date.getTimezoneOffset() * 60000;
    obj.setTextTimezone(localTimezone);
    obj.setDataTimezone(localTimezone);
    obj.setTextFormat("m/d/yyyy");
    obj.setDataFormat("default")
};
AW.Formats.HTML = AW.System.Format.subclass();
AW.Formats.HTML.create = function() {
    var obj = this.prototype;
    obj.dataToValue = function(data) {
        return data ? data.replace(AW.htmlPattern, AW.htmlReplace) : ""
    };
    obj.dataToText = function(data) {
        return data
    };
    obj.textToValue = obj.dataToValue;
    if ("".localeCompare) {
        obj.comparator = function(values, greater, less, equal, error) {
            return function(i, j) {
                try {
                    return greater * ("" + values[i]).localeCompare(values[j]) || equal(i, j)
                } catch(e) {
                    return error(i, j, e)
                }
            }
        }
    }
};
AW.HTML.define = function(name, tag, type) {
    if (!tag) {
        tag = name.toLowerCase()
    }
    AW.HTML[name] = AW.System.HTML.subclass();
    AW.HTML[name].create = function() {
        this.prototype.setTag(tag)
    }
}; (function() {
    var i,
    tags = ["DIV", "SPAN", "IMG", "INPUT", "BUTTON", "TEXTAREA", "TABLE", "TR", "TD"];
    for (i = 0; i < tags.length; i++) {
        AW.HTML.define(tags[i])
    }
})();
AW.Templates.ImageText = AW.System.Template.subclass();
AW.Templates.ImageText.create = function() {
    var obj = this.prototype;
    function _image() {
        return this.getControlProperty("image") || "none"
    }
    function _text() {
        return this.getControlProperty("text")
    }
    function _tooltip() {
        return this.getControlProperty("tooltip")
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
    obj.refresh = function() {
        this.refreshStyles();
        this.getContent("box/image").refreshClasses();
        if (AW._edit == this.getId()) {
            AW._updateEdit()
        } else {
            this.refreshClasses();
            this.getContent("box/text").refreshContents()
        }
    };
    AW._addMouseEvents(obj);
    if (AW.gecko) {
        obj.setAttribute("tabIndex", "-1")
    }
    obj.startEdit = function(text) {
        AW._startEdit(this, text)
    }
};
AW.Templates.Image = AW.Templates.ImageText.subclass();
AW.Templates.Image.create = function() {
    var obj = this.prototype;
    obj.setClass("templates", "image");
    obj.getContent("box").setTag("");
    obj.getContent("box/text").setTag("");
    obj.setContent("box/text/html", "");
    obj.startEdit = null
};
AW.Templates.Text = AW.Templates.ImageText.subclass();
AW.Templates.Text.create = function() {
    var obj = this.prototype;
    obj.setClass("templates", "text");
    obj.getContent("box").setTag("");
    obj.getContent("box/image").setTag("")
};
AW.Templates.Link = AW.Templates.ImageText.subclass();
AW.Templates.Link.create = function() {
    var obj = this.prototype;
    obj.setTag("a");
    obj.setClass("templates", "link");
    obj.setAttribute("tabIndex", "-1");
    obj.setAttribute("href", 
    function() {
        return this.getControlProperty("link") || null
    });
    obj.getContent("box").setTag("");
    obj.startEdit = null
};
AW.Templates.CheckBox = AW.Templates.ImageText.subclass();
AW.Templates.CheckBox.create = function() {
    var obj = this.prototype;
    obj.setClass("value", 
    function() {
        return this.getControlProperty("value") || false
    });
    obj.setClass("toggle", "checkbox");
    obj.setClass("templates", "checkbox");
    var marker = new AW.HTML.SPAN;
    marker.setClass("item", "marker");
    obj.setContent("box/marker", marker);
    obj.setEvent("onclick", 
    function() {
        var value = this.getControlProperty("value");
        this.setControlProperty("value", !value)
    });
    obj.startEdit = null;
    AW._addMouseEvents(obj, "toggle")
};
AW.Templates.Checkbox = AW.Templates.CheckBox;
AW.Templates.CheckedItem = AW.Templates.CheckBox.subclass();
AW.Templates.CheckedItem.create = function() {
    var obj = this.prototype;
    obj.setClass("templates", "checkeditem");
    obj.setClass("value", 
    function() {
        return this.getStateProperty("selected") || false
    });
    obj.setEvent("onclick", 
    function() {
        var selected = this.getStateProperty("selected");
        this.setStateProperty("selected", !selected)
    })
};
AW.Templates.Radio = AW.Templates.CheckedItem.subclass();
AW.Templates.Radio.create = function() {
    var obj = this.prototype;
    obj.setClass("toggle", "radio");
    obj.setClass("templates", "radio");
    obj.setEvent("onclick", "")
};
AW.Templates.Popup = AW.System.Template.subclass();
AW.Templates.Popup.create = function() {
    var obj = this.prototype;
    obj.setClass("popup", "normal");
    obj.showPopup = function() {
        unregisterPopupDoc();
        var popup = window.createPopup();
        this.$popup = popup;
        AW.$popup = this;
        var doc = popup.document;
        doc.open();
        if (AW.strict) {
            doc.write("<!DOCTYPE HTML PUBLIC \"-\/\/W3C\/\/DTD HTML 4.01\/\/EN\" \"http:\/\/www.w3.org/TR/html4/strict.dtd\">")
        }
        doc.write("<html class=\"aw-popup-window aw-system-control " + AW._htmlClasses + " aw-popup-" + AW.theme + "\"><head>");
        AW.register(doc.parentWindow);
        for (var i = 0; i < document.styleSheets.length; i++) {
            doc.write(document.styleSheets[i].owningElement.outerHTML)
        }
        doc.write("</head><body onselectstart=\"return false\" oncontextmenu=\"return false\">");
        doc.write(this.getPopup().toString());
        doc.write("</body></html>");
        doc.close();
        var ref = this.element();
        var left = 0;
        var top = ref.offsetHeight;
        var width = ref.offsetWidth;
        var height = 1;
        popup.show(left, top, width, height, ref);
        function resizePopup() {
            try {
                if (popup.isOpen) {
                    var e = doc.body.firstChild;
                    width = e.offsetWidth;
                    height = e.offsetHeight;
                    if (!width || !height) {
                        return this.setTimeout(resizePopup, 100)
                    }
                    popup.show(left, top, width, height, ref)
                }
                ref = null;
                popup = null;
                doc = null
            } catch(err) {}
        }
        this.setTimeout(resizePopup)
    };
    obj.hidePopup = function() {
        unregisterPopupDoc();
        if (this.$popup) {
            this.$popup = null
        }
        if (AW.$popup) {
            AW.$popup = null
        }
    };
    function unregisterPopupDoc() {
        try {
            if (AW.$popup) {
                var popup = AW.$popup.$popup;
                if (popup && popup.isOpen) {
                    popup.hide()
                }
                if (popup) {
                    var i,
                    docs = AW.docs;
                    for (i = 0; i < docs.length; i++) {
                        if (docs[i].body == popup.document.body) {
                            docs.splice(i, 1);
                            break
                        }
                    }
                }
            }
        } catch(err) {}
    }
    if (!AW.ie) {
        function onmousedown(event) {
            if (event.target) {
                event.preventDefault();
                return
            }
        }
        obj.showPopup = function() {
            if (this.$popup) {
                document.body.removeChild(this.$popup);
                this.$popup = null
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
            popup.innerHTML = this.getPopup().toString();
            popup.addEventListener("mousedown", onmousedown, true)
        };
        obj.hidePopup = function() {
            if (this.$popup) {
                this.$popup.removeEventListener("mousedown", onmousedown, true);
                this.setTimeout(function() {
                    if (this.$popup) {
                        document.body.removeChild(this.$popup);
                        this.$popup = null;
                        AW.$popup = null
                    }
                })
            }
        };
        obj.onControlDeactivated = function() {
            this.hidePopup()
        }
    }
};
AW.Templates.Frame = AW.System.Template.subclass();
AW.Templates.Frame.create = function() {
    var obj = this.prototype;
    obj.setClass("frame", "template");
    obj.setClass("flow", "vertical");
    obj.setClass("text", "normal");
    var box = new AW.HTML.SPAN;
    box.setClass("frame", "box");
    box.setClass("list", "box");
    if (AW.ie && AW.strict) {
        box.setStyle("width", "expression(this.parentElement.offsetWidth-4)")
    }
    box.setContent("html", 
    function() {
        return this.getLayout()
    });
    obj.setContent("box", box)
};
AW.Templates.List = AW.System.Template.subclass();
AW.Templates.List.create = function() {
    var obj = this.prototype;
    obj.setTag("span");
    obj.setClass("templates", "list");
    obj.setContent("start", "");
    obj.setContent("items", 
    function() {
        var i,
        ii,
        a = [];
        var count = this.getViewProperty("count");
        var offset = this.getViewProperty("offset");
        var indices = this.getViewProperty("indices");
        var clone = this.$owner.$clone;
        this.$owner.$clone = false;
        for (i = 0; i < count; i++) {
            ii = indices ? indices[i + offset] : i + offset;
            a[i] = this.getItem(ii).toString()
        }
        this.$owner.$clone = clone;
        return a.join("")
    });
    obj.setContent("end", "")
};
AW.Templates.Input = AW.Templates.ImageText.subclass();
AW.Templates.Input.create = function() {
    var obj = this.prototype;
    obj.setClass("templates", "input");
    obj.setClass("input", "box")
};
AW.Templates.Combo = AW.Templates.ImageText.subclass();
AW.Templates.Combo.create = function() {
    AW.Templates.Popup.create.call(this);
    var obj = this.prototype;
    obj.setClass("templates", "combo");
    obj.setClass("combo", "box");
    var button = new AW.HTML.TABLE;
    button.setClass("combo", "button");
    button.setAttribute("cellspacing", "0");
    button.setEvent("onclick", 
    function(event) {
        if ((!this.$owner && !this.$active) || (this.$owner && !this.$owner.$active)) {
            return
        }
        if (this.$owner && this.$name == "cell") {
            this.$owner.startCellEdit()
        }
        this.showPopup()
    });
    obj.setContent("box/sign", button);
    obj.setContent("box/sign/html", "<tr class=\"aw-cb-1\"><td></td></tr><tr class=\"aw-cb-2\"><td>&nbsp;</td></tr><tr class=\"aw-cb-3\"><td></td></tr>");
    AW._addMouseEvents(obj, "combo")
};
AW.Templates.Cell = AW.Templates.ImageText.subclass();
AW.Templates.Cell.create = function() {
    var obj = this.prototype;
    obj.setClass("templates", "cell");
    obj.getContent("box").setTag("");
    obj.getContent("box/image").setTag("");
    obj.getContent("box/ruler").setTag("");
    obj.getContent("box/text").setTag("");
    obj.refresh = function() {
        if (AW._edit == this.getId()) {
            AW._updateEdit()
        } else {
            this.refreshClasses();
            this.refreshContents()
        }
    }
};
AW.Templates.HTML = AW.Templates.Cell;
AW.Scroll.Bars = AW.System.Template.subclass();
AW.Scroll.Bars.create = function() {
    var obj = this.prototype;
    obj.setClass("scroll", "bars");
    obj.setClass("scrollbars", "both");
    var span = AW.HTML.SPAN;
    var box = new span;
    var spacer = new span;
    var content = new span;
    if (AW.gecko) {
        box.setAttribute("tabIndex", "-1");
        content.setAttribute("tabIndex", "-1")
    }
    box.setClass("bars", "box");
    spacer.setClass("bars", "spacer");
    content.setClass("bars", "content");
    obj.setContent("box", box);
    obj.setContent("box/spacer", spacer);
    obj.setContent("content", content);
    obj.setContent("content/html", 
    function() {
        this.lock();
        this._initialized = false;
        this.setTimeout(function() {
            this._initialized = true
        },
        1000);
        return this.getView()
    });
    var serial = 0;
    obj.setEvent("onresize", 
    function() {
        if (!this._initialized) {
            return
        }
        serial = (serial + 1) % 1000;
        var s = serial;
        this.setTimeout(function() {
            if (s == serial) {
                if (this.element()) {
                    var w = this.element().offsetWidth;
                    if (w != this.getContentProperty("width", "total")) {
                        this.setContentProperty("width", w, "total")
                    }
                    var h = this.element().offsetHeight;
                    if (h != this.getContentProperty("height", "total")) {
                        this.setContentProperty("height", h, "total")
                    }
                }
            }
        })
    });
    box.setEvent("onscroll", 
    function() {
        if (!this._initialized) {
            return
        }
        var e = this.getContent("box").element();
        var left = this.getScrollProperty("left");
        var top = this.getScrollProperty("top");
        if (e.scrollLeft != left) {
            this.setScrollProperty("left", e.scrollLeft)
        }
        if (e.scrollTop != top) {
            this.setScrollProperty("top", e.scrollTop)
        }
        e = null
    });
    if (AW.ff3) {
        box.setEvent("onmousemove", 
        function() {
            box._onscrollEvent.call(this)
        })
    }
    function mousewheel(event) {
        var top = this.getScrollProperty("top");
        top -= !AW.gecko ? event.wheelDelta / 2: event.detail * ( - 10);
        var e = this.element();
        if (e) {
            var max = this.getScrollProperty("height") - e.offsetHeight;
            var bars = this.getScrollProperty("bars");
            max += (bars == "horizontal" || bars == "both") ? 16: 0;
            top = top > max ? max: top
        }
        top = top < 0 ? 0: top;
        this.setScrollProperty("top", top);
        AW.setReturnValue(event, false)
    }
    obj.setEvent(!AW.gecko ? "onmousewheel": "onDOMMouseScroll", mousewheel);
    obj.adjustSize = function() {
        var e = this.getContent("box").element();
        var sx = e.offsetWidth - e.clientWidth;
        var sy = e.offsetHeight - e.clientHeight;
        e = null;
        if (sx > 0 && sy > 0 && sx < 50 && sy < 50) {
            AW.sx = sx;
            AW.sy = sy;
            if (AW.ie && !AW.strict) {
                this.getContent("content").setStyle("margin-right", sx + "px");
                this.setStyle("padding-bottom", sy + "px")
            } else {
                this.getContent("content").setStyle("right", sx + "px");
                this.getContent("content").setStyle("bottom", sy + "px")
            }
        }
    }
};
AW.Panels.Horizontal = AW.System.Template.subclass();
AW.Panels.Horizontal.create = function() {
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
    if (AW.ms6) {
        middle.setStyle("height", "expression(this.parentElement.clientHeight-this.previousSibling.offsetHeight-this.nextSibling.offsetHeight)")
    }
    function panel(i) {
        return function() {
            return this.getPanel(i)
        }
    }
    top.setContent("html", panel("top"));
    middle.setContent("html", panel("center"));
    bottom.setContent("html", panel("bottom"));
    box.setContent("top", top);
    box.setContent("middle", middle);
    box.setContent("bottom", bottom);
    obj.setContent("box", box);
    obj.changeScrollLeft = function(x) {
        var e1 = this.getContent("box/middle").element();
        var e2 = this.getContent("box/top").element();
        var e3 = this.getContent("box/bottom").element();
        if (AW.gecko) {
            AW.ignoreMouse = true
        }
        if (e1) {
            e1.scrollLeft = x
        }
        if (e2) {
            e2.scrollLeft = x
        }
        if (e3) {
            e3.scrollLeft = x
        }
        if (AW.gecko) {
            this.setTimeout(function() {
                AW.ignoreMouse = false
            })
        }
    };
    obj.changeScrollTop = function(y) {
        var e = this.getContent("box/middle").element();
        if (AW.gecko) {
            AW.ignoreMouse = true
        }
        if (e) {
            e.scrollTop = y
        }
        if (AW.gecko) {
            this.setTimeout(function() {
                AW.ignoreMouse = false
            })
        }
    };
    obj.changePanelWidth = function() {};
    obj.changePanelHeight = function(height, part) {
        var h = height + "px";
        if (part == "top") {
            this.getContent("box/top").setStyle("height", h);
            this.getContent("box/top").setStyle("visibility", height ? "inherit": "hidden");
            if (AW.ie && !AW.strict) {
                this.getContent("box").setStyle("padding-top", h)
            } else {
                this.getContent("box/middle").setStyle("top", h)
            }
        } else if (part == "bottom") {
            this.getContent("box/bottom").setStyle("height", h);
            this.getContent("box/bottom").setStyle("display", height ? "block": "none");
            if (AW.ie && !AW.strict) {
                this.getContent("box").setStyle("padding-bottom", h)
            } else {
                this.getContent("box/middle").setStyle("bottom", h)
            }
        }
    };
    obj.changePanelHeight(20, "top");
    obj.changePanelHeight(0, "bottom")
};
AW.Panels.Vertical = AW.System.Template.subclass();
AW.Panels.Vertical.create = function() {
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
    left.setContent("html", 
    function() {
        return this.getPanel(0)
    });
    center.setContent("html", 
    function() {
        return this.getPanel(1)
    });
    right.setContent("html", 
    function() {
        return this.getPanel(2)
    });
    box.setContent("left", left);
    box.setContent("center", center);
    box.setContent("right", right);
    obj.setContent("box", box)
};
AW.Panels.Grid = AW.System.Template.subclass();
AW.Panels.Grid.create = function() {
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
    if (AW.ms6) {
        middle.setStyle("height", "expression(this.parentElement.clientHeight-this.previousSibling.offsetHeight-this.nextSibling.offsetHeight)")
    }
    function panel(i, j) {
        return function() {
            return this.getPanel(i, j)
        }
    }
    var i,
    rows = [top, middle, bottom],
    names = ["top", "center", "bottom"];
    for (i = 0; i < 3; i++) {
        var left = new span;
        var center = new span;
        var right = new span;
        left.setClass("gpanel", "left");
        center.setClass("gpanel", "center");
        right.setClass("gpanel", "right");
        left.setContent("html", panel(names[i], "left"));
        center.setContent("html", panel(names[i], "center"));
        right.setContent("html", panel(names[i], "right"));
        if (AW.ms6) {
            center.setStyle("width", "expression(this.parentElement.clientWidth-this.previousSibling.offsetWidth-this.nextSibling.offsetWidth)")
        }
        rows[i].setContent("left", left);
        rows[i].setContent("center", center);
        rows[i].setContent("right", right)
    }
    box.setContent("top", top);
    box.setContent("middle", middle);
    box.setContent("bottom", bottom);
    obj.setContent("box", box);
    obj.changeScrollLeft = function(x) {
        var e1 = this.getContent("box/middle/center").element();
        var e2 = this.getContent("box/top/center").element();
        var e3 = this.getContent("box/bottom/center").element();
        if (AW.gecko) {
            AW.ignoreMouse = true
        }
        if (e1) {
            e1.scrollLeft = x
        }
        if (e2) {
            e2.scrollLeft = x
        }
        if (e3) {
            e3.scrollLeft = x
        }
        if (AW.gecko) {
            this.setTimeout(function() {
                AW.ignoreMouse = false
            })
        }
    };
    obj.changeScrollTop = function(y) {
        var e1 = this.getContent("box/middle/center").element();
        var e2 = this.getContent("box/middle/left").element();
        var e3 = this.getContent("box/middle/right").element();
        if (AW.gecko) {
            AW.ignoreMouse = true
        }
        if (e1) {
            e1.scrollTop = y
        }
        if (e2) {
            e2.scrollTop = y
        }
        if (e3) {
            e3.scrollTop = y
        }
        if (AW.gecko) {
            this.setTimeout(function() {
                AW.ignoreMouse = false
            })
        }
    };
    obj.changePanelWidth = function(width, part) {
        var w = width + "px";
        var i,
        r,
        parts = ["box/top", "box/middle", "box/bottom"];
        if (part == "left") {
            for (i = 0; i < 3; i++) {
                r = this.getContent(parts[i]);
                r.getContent("left").setStyle("width", w);
                r.getContent("left").setStyle("display", width ? "block": "none");
                if (AW.ie && !AW.strict) {
                    r.setStyle("padding-left", w)
                } else {
                    r.getContent("center").setStyle("left", w)
                }
            }
        } else if (part == "right") {
            for (i = 0; i < 3; i++) {
                r = this.getContent(parts[i]);
                r.getContent("right").setStyle("width", w);
                r.getContent("right").setStyle("display", width ? "block": "none");
                if (AW.ie && !AW.strict) {
                    r.setStyle("padding-right", w)
                } else {
                    r.getContent("center").setStyle("right", w)
                }
            }
        }
    };
    obj.changePanelHeight = function(height, part) {
        var h = height + "px";
        if (part == "top") {
            this.getContent("box/top").setStyle("height", h);
            this.getContent("box/top").setStyle("visibility", height ? "inherit": "hidden");
            if (AW.ie && !AW.strict) {
                this.getContent("box").setStyle("padding-top", h)
            } else {
                this.getContent("box/middle").setStyle("top", h)
            }
        } else if (part == "bottom") {
            this.getContent("box/bottom").setStyle("height", h);
            this.getContent("box/bottom").setStyle("display", height ? "block": "none");
            if (AW.ie && !AW.strict) {
                this.getContent("box").setStyle("padding-bottom", h)
            } else {
                this.getContent("box/middle").setStyle("bottom", h)
            }
        }
    };
    obj.changePanelWidth(100, "left");
    obj.changePanelWidth(0, "right");
    obj.changePanelHeight(20, "top");
    obj.changePanelHeight(0, "bottom")
};
AW.UI.Controllers.List = {
    onItemTemplateChanged: function(item) {
        item.setClass("list", "item");
        item.setClass("items", 
        function() {
            return this.getControlProperty("state") || "normal"
        });
        item.mapModel("control", "item");
        item.mapModel("state", "item")
    },
    onViewTemplateChanged: function(view) {
        view.setClass("list", "template")
    }
};
AW.UI.Controllers.Actions = (function() {
    function clicked(event, index) {
        return index
    }
    function current() {
        return this.getCurrentItem()
    }
    function first() {
        var p = this.getViewOffset();
        var a = this.getViewIndices();
        return a ? a[p] : p
    }
    function last() {
        var p = this.getViewOffset() + this.getViewCount() - 1;
        var a = this.getViewIndices();
        return a ? a[p] : p
    }
    function next() {
        var i = this.getCurrentItem();
        var p = Math.min(this.getViewPosition(i) + 1, this.getViewOffset() + this.getViewCount() - 1);
        var a = this.getViewIndices();
        return a ? a[p] : p
    }
    function previous() {
        var i = this.getCurrentItem();
        var p = Math.max(this.getViewPosition(i) - 1, this.getViewOffset());
        var a = this.getViewIndices();
        return a ? a[p] : p
    }
    function go(i) {
        this.setCurrentItem(i)
    }
    function select(i) {
        this.setSelectedItems([i]);
        this.setCurrentItem(i)
    }
    function toggle(i) {
        this.setItemSelected(!this.getItemSelected(i), i);
        if (i != this.getCurrentItem()) {
            this.setCurrentItem(i)
        }
    }
    function f(action, item) {
        return function(event, index) {
            var i = item.call(this, event, index);
            AW.setReturnValue(event, false);
            if (event && event.type == "mousedown") {
                this.setTimeout(function() {
                    if (this.$active) {
                        action.call(this, i)
                    }
                })
            } else {
                if (this.$active) {
                    action.call(this, i)
                }
            }
            event = null
        }
    }
    return {
        gotoClickedItem: f(go, clicked),
        gotoPreviousItem: f(go, previous),
        gotoNextItem: f(go, next),
        gotoFirstItem: f(go, first),
        gotoLastItem: f(go, last),
        selectClickedItem: f(select, clicked),
        selectPreviousItem: f(select, previous),
        selectNextItem: f(select, next),
        selectFirstItem: f(select, first),
        selectLastItem: f(select, last),
        toggleClickedItem: f(toggle, clicked),
        toggleCurrentItem: f(toggle, current)
    }
})();
AW.UI.Controllers.Changes = (function() {
    function item(v, i) {
        this.getItem(i).refresh()
    }
    function view(indices) {
        var pos = [];
        for (var i = 0; i < indices.length; i++) {
            pos[indices[i]] = i
        }
        this.setViewPosition(pos);
        this.refresh()
    }
    function selection(mode) {
        switch (mode) {
        case "single":
            this.setController("selection", AW.UI.Controllers.Single);
            break;
        case "multi":
            this.setController("selection", AW.UI.Controllers.Multi);
            break
        }
    }
    return {
        onItemTextChanged: item,
        onItemImageChanged: item,
        onItemValueChanged: item,
        onItemLinkChanged: item,
        onItemTooltipChanged: item,
        onItemStateChanged: item,
        onViewIndicesChanged: view,
        onSelectionModeChanged: selection
    }
})();
AW.UI.Controllers.State = (function() {
    function itemSelected(value, index) {
        this.calculateItemState(index);
        var i,
        a = this.getSelectedItems();
        for (i = 0; i < a.length; i++) {
            if (a[i] == index) {
                if (!value) {
                    a = a.concat();
                    a.splice(i, 1);
                    this.setSelectedItems(a)
                }
                return
            }
        }
        if (value) {
            a = a.concat(index);
            this.setSelectedItems(a)
        }
    }
    var select = [],
    unselect = [];
    function selectedItems1(a) {
        var b = this.getSelectedItems();
        var i,
        before = {},
        after = {};
        select = [];
        unselect = [];
        for (i = 0; i < b.length; i++) {
            before[b[i]] = true
        }
        for (i = 0; i < a.length; i++) {
            after[a[i]] = true
        }
        for (i = 0; i < b.length; i++) {
            if (!after[b[i]]) {
                unselect.push(b[i])
            }
        }
        for (i = 0; i < a.length; i++) {
            if (!before[a[i]]) {
                select.push(a[i])
            }
        }
    }
    function selectedItems2() {
        var i;
        for (i = 0; i < unselect.length; i++) {
            if (this.getItemSelected(unselect[i])) {
                this.setItemSelected(false, unselect[i])
            }
        }
        for (i = 0; i < select.length; i++) {
            if (!this.getItemSelected(select[i])) {
                this.setItemSelected(true, select[i])
            }
        }
    }
    var current;
    function currentItem1() {
        current = this.getCurrentItem()
    }
    function currentItem2(index) {
        this.calculateItemState(current);
        var e1 = this.getItem(current).getContent("box/text").element();
        if (e1 && index != current) {
            e1.tabIndex = -1
        }
        e1 = null;
        this.calculateItemState(index);
        var e2 = this.getItem(index).getContent("box/text").element();
        if (e2 && e2.focus && !AW.opera && !AW.$popup) {
            e2.tabIndex = this.getTabIndex();
            e2.focus()
        }
        e2 = null
    }
    return {
        onItemSelectedChanged: itemSelected,
        onCurrentItemChanging: currentItem1,
        onCurrentItemChanged: currentItem2,
        onSelectedItemsChanging: selectedItems1,
        onSelectedItemsChanged: selectedItems2
    }
})();
AW.UI.Controllers.Single = {
    onKeyHome: "selectFirstItem",
    onKeyEnd: "selectLastItem",
    onKeyUp: "selectPreviousItem",
    onKeyDown: "selectNextItem",
    onKeyLeft: "selectPreviousItem",
    onKeyRight: "selectNextItem",
    onKeyPageUp: "selectPreviousPage",
    onKeyPageDown: "selectNextPage",
    onItemClicked: "selectClickedItem"
};
AW.UI.Controllers.Multi = {
    onKeyHome: "selectFirstItem",
    onKeyEnd: "selectLastItem",
    onKeyUp: "selectPreviousItem",
    onKeyDown: "selectNextItem",
    onKeyPageUp: "selectPreviousPage",
    onKeyPageDown: "selectNextPage",
    onKeyCtrlHome: "gotoFirstItem",
    onKeyCtrlEnd: "gotoLastItem",
    onKeyCtrlUp: "gotoPreviousItem",
    onKeyCtrlDown: "gotoNextItem",
    onKeyCtrlPageUp: "gotoPreviousPage",
    onKeyCtrlPageDown: "gotoNextPage",
    onKeyCtrlSpace: "toggleCurrentItem",
    onKeySpace: "toggleCurrentItem",
    onItemClicked: "toggleClickedItem"
};
AW.UI.Controllers.Checked = {
    onKeyHome: "gotoFirstItem",
    onKeyEnd: "gotoLastItem",
    onKeyUp: "gotoPreviousItem",
    onKeyDown: "gotoNextItem",
    onKeySpace: "toggleCurrentItem"
};
AW.UI.ImageText = AW.System.Control.subclass();
AW.UI.ImageText.create = function() {
    AW.Templates.ImageText.create.call(this);
    var obj = this.prototype;
    var _super = this.superclass.prototype;
    obj.setClass("templates", "");
    obj.setClass("ui", "imagetext");
    obj.setClass("item", "control");
    obj.setClass("text", "expand");
    function _tabIndex() {
        return this.getTabProperty("index")
    }
    if (AW.ie || AW.gecko) {
        obj.getContent("box/text").setAttribute("tabIndex", _tabIndex)
    }
    obj.refresh = function() {
        if (this.getContent("box/text").element()) {
            this.refreshClasses();
            this.refreshStyles();
            this.refreshAttributes();
            this.getContent("box/image").refreshClasses();
            this.getContent("box/text").refreshAttributes();
            this.getContent("box/text").refreshContents();
            if (this.getContent("data")) {
                this.getContent("data").refreshAttributes()
            }
        } else {
            _super.refresh.call(this)
        }
    };
    var _refresh = function() {
        this.refresh()
    };
    var itemController = {
        onControlTextChanged: _refresh,
        onControlImageChanged: _refresh,
        onControlValueChanged: _refresh,
        onControlLinkChanged: _refresh,
        onControlTooltipChanged: _refresh,
        onControlStateChanged: _refresh
    };
    obj.setController("item", itemController);
    obj.setEvent("onactivate", 
    function(event) {
        var e = this.getContent("box/text").element();
        if (e && event.srcElement != e) {
            this.setTimeout(function() {
                if (this.$active) {
                    e.setActive()
                }
            })
        }
    });
    if (AW.webkit || AW.opera || AW.konqueror) {
        var focus = new AW.HTML.SPAN;
        focus.setTag("a");
        focus.setClass("control", "focus");
        focus.setAttribute("tabIndex", 
        function() {
            return this.getTabProperty("index")
        });
        if (AW.webkit) {
            focus.setAttribute("href", "#")
        }
        if (AW.opera) {
            focus.setContent("html", "&nbsp;")
        }
        obj.setContent("focus", focus)
    }
    obj.focus = function() {
        try {
            if (this.getControlDisabled()) {
                return
            }
            if (AW.webkit || AW.opera || AW.konqueror) {
                this.getContent("focus").element().focus();
                return
            }
            this.getContent("box/text").element().focus()
        } catch(err) {}
    };
    obj.onControlDisabledChanged = function(value) {
        this.setClass("disabled", value ? "control": null);
        this.setAttribute("disabled", value ? true: null);
        this.getContent("box/text").setAttribute("disabled", value ? true: null)
    };
    obj.setSize = function(width, height) {
        if (typeof(width) != "undefined") {
            if (AW.ms5 || AW.ms6 || this._textClass != "expand") {
                this.setStyle("width", width - AW.dx + "px")
            } else {
                if (AW.ff2 || AW.ff15 || AW.ff1) {
                    this.setStyle("min-width", width + "px")
                } else if (AW.opera && opera.version() < 9.5 && this._uiClass == "button") {
                    this.setStyle("min-width", width - 8 + "px")
                } else {
                    this.setStyle("min-width", width - AW.dx + "px")
                }
                if (AW.ms7 || AW.ms8) {
                    this.getContent("box").setStyle("min-width", width - AW.dx + "px")
                }
            }
        }
        if (typeof(height) != "undefined") {
            this.setStyle("height", height - AW.dy + "px")
        }
    }
};
AW.UI.Label = AW.UI.ImageText.subclass();
AW.UI.Label.create = function() {
    var obj = this.prototype;
    obj.setClass("ui", "label");
    obj.setTabIndex( - 1)
};
AW.UI.Group = AW.UI.ImageText.subclass();
AW.UI.Group.create = function() {
    var obj = this.prototype;
    obj.setTag("fieldset");
    obj.setClass("ui", "group");
    obj.setClass("text", "normal");
    obj.setTabIndex( - 1);
    var box = obj.getContent("box");
    box.setTag("legend");
    box.setClass("item", "legend")
};
AW.UI.Button = AW.UI.ImageText.subclass();
AW.UI.Button.create = function() {
    var obj = this.prototype;
    obj.setClass("ui", "button");
    var _click = function(event) {
        if (!this.getControlDisabled()) {
            this.raiseEvent("onClick", event)
        }
    };
    obj.setController("button", {
        onControlClicked: _click,
        onKeySpace: _click,
        onKeyEnter: _click
    });
    AW._addMouseEvents(obj, "button")
};
AW.UI.Link = AW.UI.ImageText.subclass();
AW.UI.Link.create = function() {
    AW.Templates.Link.create.call(this);
    var obj = this.prototype;
    obj.setClass("ui", "link");
    obj.getContent("box").setTag("span")
};
AW.UI.Input = AW.UI.ImageText.subclass();
AW.UI.Input.create = function() {
    var obj = this.prototype;
    obj.setClass("ui", "input");
    obj.setClass("input", "box");
    obj.setClass("text", "");
    var text = new AW.HTML.INPUT;
    text.setClass("item", "text");
    text.setAttribute("type", "text");
    text.setAttribute("value", 
    function() {
        return this.getControlProperty("text")
    });
    text.setAttribute("tabIndex", 
    function() {
        return this.getTabProperty("index")
    });
    obj.setContent("box/text", text);
    var _edit = function() {
        this.setTimeout(function() {
            if (this.$active) {
                this.startEdit()
            }
        })
    };
    var _validate = function() {
        AW._commitEdit()
    };
    var _cancel = function(event) {
        AW._cancelEdit();
        AW.setReturnValue(event, false)
    };
    var _refresh = function() {
        this.refresh()
    };
    var _text = function() {
        var e = this.getContent("box/text").element();
        var text = this.getControlProperty("text");
        if (e && e.value != text) {
            if (AW.ie) {
                var r = document.selection.createRange();
                r.collapse();
                r.select()
            }
            e.value = text
        }
        if (this.getContent("data")) {
            e = this.getContent("data").element();
            if (e) {
                e.value = this.getControlData()
            }
        }
    };
    var itemController = {
        onKeyEnter: _validate,
        onKeyEscape: _cancel,
        onControlActivated: _edit,
        onControlTextChanged: _text,
        onControlValueChanged: _text,
        onControlDataChanged: _text,
        onControlImageChanged: _refresh,
        onControlLinkChanged: _refresh,
        onControlTooltipChanged: _refresh,
        onControlStateChanged: _refresh
    };
    obj.setController("item", itemController);
    if (AW.webkit || AW.opera || AW.konqueror) {
        obj.setContent("focus", "")
    }
    obj.focus = function() {
        try {
            if (this.getControlDisabled()) {
                return
            }
            this.getContent("box/text").element().focus()
        } catch(err) {}
    }
};
AW.UI.Password = AW.UI.Input.subclass();
AW.UI.Password.create = function() {
    var obj = this.prototype;
    obj.getContent("box/text").setAttribute("type", "password")
};
AW.UI.List = AW.System.Control.subclass();
AW.UI.List.create = function() {
    var obj = this.prototype;
    var _super = this.superclass.prototype;
    obj.setClass("ui", "list");
    obj.setClass("list", "control");
    obj.setClass("flow", "vertical");
    obj.setClass("text", "normal");
    var box = new AW.HTML.SPAN;
    box.setClass("list", "box");
    if (AW.gecko) {
        box.setAttribute("tabIndex", "-1")
    }
    if (AW.ie && AW.strict) {
        box.setStyle("width", "expression(this.parentElement.offsetWidth-4)")
    }
    box.setContent("html", 
    function() {
        return this.getLayout()
    });
    obj.setContent("box", box);
    var UI = AW.UI.Controllers;
    obj.setController("list", UI.List);
    obj.setController("actions", UI.Actions);
    obj.setController("changes", UI.Changes);
    obj.setController("selection", UI.Single);
    obj.setController("state", UI.State);
    obj.defineTemplate("layout", 
    function() {
        return this.getScroll()
    });
    obj.defineTemplate("scroll", 
    function() {
        return this.getView()
    });
    obj.defineTemplate("view", new AW.Templates.List);
    obj.defineTemplate("item", new AW.Templates.ImageText);
    function value(i) {
        var text = this.getItemText(i);
        var format = this.getItemFormat(i);
        return format ? format.textToValue(text) : text
    }
    function count() {
        return this.getItemCount()
    }
    function position(i) {
        return Number(i)
    }
    var models = {
        item: {
            count: 0,
            text: "",
            image: "",
            link: "",
            value: value,
            format: "",
            tooltip: "",
            state: "",
            selected: false
        },
        view: {
            count: count,
            position: position,
            offset: 0,
            expanded: false
        },
        selection: {
            mode: "single"
        },
        current: {
            item: 0
        }
    };
    obj.defineModel("item", models.item);
    obj.defineModel("view", models.view);
    obj.defineModel("current", models.current);
    obj.defineModel("selected", {});
    obj.defineModel("selection", models.selection);
    obj.defineModel("state", {});
    obj.defineViewProperty("indices", "", true);
    obj.defineSelectedProperty("items", [], true);
    obj.calculateItemState = function(i) {
        var state = "";
        if (this.getCurrentItem() == i) {
            state = "current"
        }
        if (this.getItemSelected(i)) {
            state = "selected"
        }
        if (this.getItemState(i) != state) {
            this.setItemState(state, i)
        }
    };
    obj.toString = function() {
        if (AW.ie || AW.gecko) {
            this.setTimeout(function() {
                try {
                    var i = this.getCurrentItem();
                    var t = this.getTabIndex();
                    this.getItem(i).getContent("box/text").element().tabIndex = t
                } catch(err) {}
            })
        }
        return _super.toString.call(this)
    };
    if (AW.webkit || AW.opera || AW.konqueror) {
        var focus = new AW.HTML.SPAN;
        focus.setTag("a");
        focus.setClass("control", "focus");
        focus.setAttribute("tabIndex", 
        function() {
            return this.getTabProperty("index")
        });
        if (AW.webkit) {
            focus.setAttribute("href", "#")
        }
        if (AW.opera) {
            focus.setContent("html", "&nbsp;")
        }
        obj.setContent("focus", focus)
    }
    obj.focus = function() {
        try {
            if (this.getControlDisabled()) {
                return
            }
            if (AW.webkit || AW.opera || AW.konqueror) {
                this.getContent("focus").element().focus();
                return
            }
            var i = this.getCurrentItem();
            this.getItem(i).getContent("box/text").element().focus()
        } catch(err) {}
    };
    obj.onControlDisabledChanged = function(value) {
        this.setClass("disabled", value ? "control": null);
        this.setAttribute("disabled", value ? true: null)
    }
};
AW.UI.Tabs = AW.UI.List.subclass();
AW.UI.Tabs.create = function() {
    var obj = this.prototype;
    obj.setClass("ui", "tabs");
    obj.setClass("text", "expand");
    obj.setClass("flow", "horizontal");
    if (AW.opera) {
        obj.setController("repaint", {
            onCurrentItemChanged: function() {
                var n = document.createElement("div");
                var e = this.element();
                var p = e.parentNode;
                p.insertBefore(n, e);
                p.removeChild(n)
            }
        })
    }
};
AW.UI.Combo = AW.UI.List.subclass();
AW.UI.Combo.create = function() {
    AW.UI.ImageText.create.call(this);
    AW.UI.Input.create.call(this);
    AW.Templates.Combo.create.call(this);
    var obj = this.prototype;
    obj.setClass("ui", "combo");
    obj.setClass("input", "");
    obj.defineTemplate("popup", new AW.Templates.Frame);
    obj.onCurrentItemChanged = function(i) {
        var text = this.getItemText(i);
        this.setControlText(text);
        this.hidePopup()
    };
    obj.setController("selection", {
        onKeyUp: "selectPreviousItem",
        onKeyDown: "selectNextItem",
        onItemClicked: "selectClickedItem"
    })
};
AW.UI.CheckBox = AW.UI.ImageText.subclass();
AW.UI.CheckBox.create = function() {
    AW.Templates.CheckBox.create.call(this);
    var obj = this.prototype;
    obj.setClass("ui", "checkbox");
    obj.setControlProperty("value", false);
    obj.setEvent("onclick", "");
    var _toggle = function() {
        if (!this.getControlDisabled()) {
            this.setControlValue(!this.getControlValue())
        }
    };
    obj.setController("checkbox", {
        onKeySpace: _toggle,
        onControlClicked: _toggle
    })
};
AW.UI.Checkbox = AW.UI.CheckBox;
AW.UI.CheckedList = AW.UI.List.subclass();
AW.UI.CheckedList.create = function() {
    var obj = this.prototype;
    obj.setClass("ui", "checkedlist");
    obj.setItem(new AW.Templates.CheckedItem);
    obj.setController("selection", AW.UI.Controllers.Checked)
};
AW.UI.Radio = AW.UI.CheckedList.subclass();
AW.UI.Radio.create = function() {
    var obj = this.prototype;
    obj.setClass("ui", "radio");
    obj.setItem(new AW.Templates.Radio);
    obj.setSelectionMode("single")
};
AW.Grid.Controllers.Size = (function() {
    var initFlag = false;
    function init() {
        initFlag = true;
        try {
            var height = this.getContent("box/sample").element().offsetHeight;
            var i,
            ii,
            n = this.getColumnCount(),
            a = this.getColumnIndices();
            var hrow = this.$extended ? 0: undefined;
            var width = [];
            for (i = 0; i < n; i++) {
                ii = a ? a[i] : i;
                width[ii] = this.getHeader(ii, hrow).element().offsetWidth
            }
            var w = this.getScroll().element().offsetWidth;
            var h = this.getScroll().element().offsetHeight;
            var left = this.getScrollLeft();
            var top = this.getScrollTop();
            this.getScroll().adjustSize();
            this.getScroll().setStyle("visibility", "inherit");
            this._startUpdate();
            this.setRowHeight(height);
            this.setColumnWidth(width);
            this.setContentWidth(w, "total");
            this.setContentHeight(h, "total");
            this.setScrollLeft(left);
            this.setScrollTop(top);
            this._endUpdate()
        } catch(err) {}
        try {
            this.getScroll().setStyle("visibility", "inherit");
            this.setTimeout(function() {
                var e = this.getContent("box/block").element();
            });
            this.setTimeout(function() {
                this.getRows().refresh()
            })
        } catch(err) {}
        initFlag = false
    }
    function setStyle(selector, attribute, value) {
        try {
            if (AW.webkit && document.styleSheets.length === 0) {
                window.setTimeout(function() {
                    setStyle(selector, attribute, value)
                },
                100);
                return
            }
            var i,
            ss = document.styleSheets[document.styleSheets.length - 1];
            var rules = AW.getRules(ss);
            if (AW.webkit && AW.quirks) {
                selector = selector.toLowerCase()
            }
            for (i = rules.length - 1; i >= 0; i--) {
                if (rules[i].selectorText == selector) {
                    rules[i].style[attribute] = value;
                    return
                }
            }
            AW.addRule(ss, selector, attribute + ":" + value)
        } catch(err) {}
    }
    return {
        paint: init,
        onColumnWidthChanged: function(width, column) {
            if (initFlag) {
                return
            }
            if (typeof(width) == "object") {
                if (this.element()) {
                    this.element().innerHTML = ""
                }
                var i,
                a = [];
                for (i in width) {
                    if (!a[i]) {
                        setStyle("#" + this.getId() + " .aw-column-" + i, "width", (width[i] - AW.dx) + "px")
                    }
                }
                if (this.element()) {
                    this.refresh()
                }
                return
            }
            if (AW.ie && this.getView().element()) {
                this.getView().element().firstChild.className += ""
            }
            if (column === undefined) {
                setStyle("#" + this.getId() + " .aw-grid-cell", "width", (width - AW.dx) + "px");
                setStyle("#" + this.getId() + " .aw-grid-header", "width", (width - AW.dx) + "px");
                setStyle("#" + this.getId() + " .aw-grid-footer", "width", (width - AW.dx) + "px")
            } else {
                setStyle("#" + this.getId() + " .aw-column-" + column, "width", (width - AW.dx) + "px")
            }
        },
        onSelectorWidthChanged: function(width) {
            setStyle("#" + this.getId() + " .aw-row-selector", "width", (width - AW.dx) + "px")
        },
        onRowHeightChanged: function(height) {
            if (initFlag) {
                return
            }
            setStyle("#" + this.getId() + " .aw-grid-row", "height", (height - AW.dy) + "px");
            setStyle("#" + this.getId() + " .aw-grid-row", "lineHeight", height + "px")
        }
    }
})();
AW.Grid.Controllers.Cell = (function() {
    function refresh(value, col, row) {
        this.getCell(col, row).refresh()
    }
    function refreshClasses(value, col, row) {
        this.getCell(col, row).refreshClasses()
    }
    function cellData(val, col, row) {
        function dataToText(i, j) {
            var data = this.getCellData(i, j);
            var format = this.getCellFormat(i, j);
            return format ? format.dataToText(data) : data
        }
        function dataToValue(i, j) {
            var data = this.getCellData(i, j);
            var format = this.getCellFormat(i, j);
            return format ? format.dataToValue(data) : data
        }
        this.setCellText(dataToText, col, row);
        this.setCellValue(dataToValue, col, row);
    }
    function tooltip(event, col, row) {
        var e = this.getCell(col, row).element();
        var s = this.getCellTooltip(col, row);
        if (e) {
            e.setAttribute("title", s)
        }
        e = null
    }
    function calcState(v, i, j) {
        this.calculateCellState(i, j)
    }
    return {
        onCellMouseOver: tooltip,
        onCellSelectedChanged: calcState,
        onCellDataChanged: cellData,
        onCellTextChanged: refresh,
        onCellLinkChanged: refresh,
        onCellImageChanged: refresh,
        onCellValueChanged: refresh,
        onCellStateChanged: refreshClasses
    }
})();
AW.Grid.Controllers.Edit = (function() {
    function startEdit(event) {
        if (AW._edit) {
            return
        }
        var s;
        if (event && event.type == "keypress") {
            if (event.keyCode == 27 || event.keyCode == 13) {
                return
            }
            s = String.fromCharCode(event.keyCode || event.charCode)
        }
        if (this.startCellEdit(s)) {
            AW.setReturnValue(event, false)
        }
    }
    function startOrEnd(event) {
        if (!AW._edit) {
            this.startCellEdit()
        } else {
            this.endCellEdit()
        }
        AW.setReturnValue(event, false)
    }
    function endEdit(event) {
        this.endCellEdit();
        AW.setReturnValue(event, false)
    }
    function cancelEdit(event) {
        this.cancelCellEdit();
        this.endCellEdit();
        AW.setReturnValue(event, false)
    }
    return {
        onKeyF2: startEdit,
        onCellDoubleClicked: startEdit,
        onKeyPress: startEdit,
        onKeyEnter: startOrEnd,
        onKeyEscape: cancelEdit,
        editCurrentCell: startEdit
    }
})();
AW.Grid.Controllers.Row = (function() {
    function refresh(value, row) {
        this.getRow(row).refreshClasses()
    }
    function addRow(row) {
        var count = this.getRowCount();
        var a = this.getRowIndices();
        if (count < 2) {
            this.refresh();
            return
        }
        var prev = a[count - 2];
        var i,
        e;
        if (!this.$extended) {
            e = this.getRow(prev).element();
            if (e) {
                AW.setOuterHTML(e, this.getRow(prev).toString() + this.getRow(row).toString())
            }
            e = null
        } else {
            for (i = 0; i < 3; i++) {
                e = this.getRow(prev, i).element();
                if (e) {
                    AW.setOuterHTML(e, this.getRow(prev, i).toString() + this.getRow(row, i).toString())
                }
                e = null
            }
        }
        this.raiseEvent("adjustScrollHeight")
    }
    function removeRow(row) {
        var i,
        e;
        if (!this.$extended) {
            e = this.getRow(row).element();
            if (e) {
                AW.setOuterHTML(e, "")
            }
            e = null
        } else {
            for (i = 0; i < 3; i++) {
                e = this.getRow(row, i).element();
                if (e) {
                    AW.setOuterHTML(e, "")
                }
                e = null
            }
        }
        this.raiseEvent("adjustScrollHeight")
    }
    function calcRowState(v, i) {
        this.calculateRowState(i)
    }
    return {
        onRowAdded: addRow,
        onRowDeleted: removeRow,
        onRowSelectedChanged: calcRowState,
        onRowStateChanged: refresh
    }
})();
AW.Grid.Controllers.View = {
    onRowIndicesChanged: function(indices) {
        var positions = [];
        for (var i = 0; i < indices.length; i++) {
            positions[indices[i]] = i
        }
        this.setRowPosition(positions);
        this.refresh()
    },
    onColumnIndicesChanged: function(indices) {
        var positions = [];
        for (var i = 0; i < indices.length; i++) {
            positions[indices[i]] = i
        }
        this.setColumnPosition(positions);
        this.setColumnCount(indices.length);
        this.refresh()
    }
};
AW.Grid.Controllers.Navigation = (function() {
    var serial = 1;
    function syncSelected() {
        serial = serial % 1000 + 1;
        var s = serial;
        if (!this._columnsSelected || this._columnsSelected.$ !== this) {
            this._columnsSelected = {
                $: this
            }
        }
        if (!this._rowsSelected || this._rowsSelected.$ !== this) {
            this._rowsSelected = {
                $: this
            }
        }
        var cc = this._columnsSelected;
        var rr = this._rowsSelected;
        var mode = this.getCurrentSelection();
        var cols = this.getSelectedColumns();
        var rows = this.getSelectedRows();
        var i,
        j,
        col,
        row,
        ext = {
            $: 1
        };
        if (mode == "cell") {
            var added = [],
            unchanged = [],
            removed = [];
            for (i = 0; i < cols.length; i++) {
                col = cols[i]; (cc[col] ? unchanged: added).push(col);
                cc[col] = s
            }
            for (col in cc) {
                if (cc[col] && cc[col] !== s && !ext[col]) {
                    delete cc[col];
                    removed.push(col)
                }
            }
            for (i = 0; i < rows.length; i++) {
                row = rows[i];
                if (!rr[row]) {
                    rr[row] = s;
                    for (j = 0; j < unchanged.length; j++) {
                        col = unchanged[j];
                        this.setCellSelected(true, col, row)
                    }
                    for (j = 0; j < added.length; j++) {
                        col = added[j];
                        this.setCellSelected(true, col, row)
                    }
                } else {
                    rr[row] = s;
                    for (j = 0; j < added.length; j++) {
                        col = added[j];
                        this.setCellSelected(true, col, row)
                    }
                    for (j = 0; j < removed.length; j++) {
                        col = removed[j];
                        this.setCellSelected(false, col, row)
                    }
                }
            }
            for (row in rr) {
                if (rr[row] && rr[row] !== s && !ext[row]) {
                    delete rr[row];
                    for (j = 0; j < unchanged.length; j++) {
                        col = unchanged[j];
                        this.setCellSelected(false, col, row)
                    }
                    for (j = 0; j < removed.length; j++) {
                        col = removed[j];
                        this.setCellSelected(false, col, row)
                    }
                }
            }
        } else {
            for (i = 0; i < rows.length; i++) {
                row = rows[i];
                if (!rr[row]) {
                    rr[row] = s;
                    this.setRowSelected(true, row)
                } else {
                    rr[row] = s
                }
            }
            for (row in rr) {
                if (rr[row] && rr[row] !== s && !ext[row]) {
                    delete rr[row];
                    this.setRowSelected(false, row)
                }
            }
        }
    }
    function syncRow(value, row) {
        if (!this._rowsSelected || (!this._rowsSelected[row]) != (!value)) {
            var i,
            rows = this.getSelectedRows().concat();
            if (value) {
                rows.push(row)
            } else {
                for (i = 0; i < rows.length; i++) {
                    if (rows[i] == row) {
                        rows.splice(i--, 1)
                    }
                }
            }
            this.setSelectedRows(rows)
        }
    }
    var Grid = AW.Grid.Controllers;
    return {
        onSelectedColumnsChanged: syncSelected,
        onSelectedRowsChanged: syncSelected,
        onRowSelectedChanged: syncRow,
        onSelectionModeChanged: function(mode) {
            switch (mode) {
            case "none":
                this.setController("selection", {});
                this.setController("edit", {});
                this.setCurrentSelection("none");
                break;
            case "single-cell":
                this.setController("selection", Grid.SingleCell);
                this.setController("edit", Grid.Edit);
                this.setCurrentSelection("cell");
                break;
            case "single-row":
                this.setController("selection", Grid.SingleRow);
                this.setController("edit", {});
                this.setCurrentSelection("row");
                break;
            case "multi-cell":
                this.setController("selection", Grid.MultiCell);
                this.setController("edit", Grid.Edit);
                this.setCurrentSelection("cell");
                break;
            case "multi-row":
                this.setController("selection", Grid.MultiRow);
                this.setController("edit", {});
                this.setCurrentSelection("row");
                break;
            case "multi-row-marker":
                this.setController("selection", Grid.MultiRowMarker);
                this.setController("edit", {});
                this.setCurrentSelection("row");
                var checkbox = new AW.Templates.CheckedItem;
                this.setCell(checkbox, 0);
                break
            }
        }
    }
})();
AW.Grid.Controllers.Sort = {
    doSort: function(src, index, header) {
        if (this.$edit) {
            return
        }
        if (! (header == "0" || typeof(header) == "undefined")) {
            return
        }
        var format = this.getCellFormat(index);
        function compare(values, pos, dir) {
            var greater = 1,
            less = -1;
            if (dir == "descending") {
                greater = -1;
                less = 1
            }
            var equal = function(i, j) {
                var a = pos[i];
                var b = pos[j];
                if (a > b) {
                    return 1
                }
                if (a < b) {
                    return - 1
                }
                return 0
            };
            var error = function() {
                return 0
            };
            var types = {
                "undefined": 0,
                "boolean": 1,
                "number": 2,
                "string": 3,
                "object": 4,
                "function": 5
            };
            if (format) {
                return format.comparator(values, greater, less, equal, error)
            } else if ("".localeCompare) {
                return function(i, j) {
                    try {
                        var a = values[i],
                        b = values[j],
                        x,
                        y;
                        if (typeof(a) != typeof(b)) {
                            x = types[typeof(a)];
                            y = types[typeof(b)];
                            if (x > y) {
                                return greater
                            }
                            if (x < y) {
                                return less
                            }
                        } else if (typeof(a) == "number") {
                            if (a > b) {
                                return greater
                            }
                            if (a < b) {
                                return less
                            }
                            return equal(i, j)
                        } else {
                            return (greater * (("" + a).localeCompare(b))) || equal(i, j)
                        }
                    } catch(e) {
                        return error(i, j, e)
                    }
                }
            } else {
                return function(i, j) {
                    try {
                        var a = values[i],
                        b = values[j],
                        x,
                        y;
                        if (typeof(a) != typeof(b)) {
                            x = types[typeof(a)];
                            y = types[typeof(b)];
                            if (x > y) {
                                return greater
                            }
                            if (x < y) {
                                return less
                            }
                        } else {
                            if (a > b) {
                                return greater
                            }
                            if (a < b) {
                                return less
                            }
                        }
                        return equal(i, j)
                    } catch(e) {
                        return error(i, j, e)
                    }
                }
            }
        }
        var direction = this.getSortDirection(index);
        if (direction != "ascending") {
            direction = "ascending"
        } else {
            direction = "descending"
        }
        if (src == "ascending" || src == "descending") {
            direction = src
        }
        var i,
        value = {},
        pos = {};
        var offset = this.getRowOffset();
        var count = this.getRowCount();
        var rows = this.getRowIndices();
        if (!rows) {
            rows = [];
            for (i = 0; i < count; i++) {
                rows[i] = i + offset
            }
        } else {
            rows = rows.slice(offset, offset + count)
        }
        for (i = 0; i < rows.length; i++) {
            value[rows[i]] = this.getCellValue(index, rows[i]);
            pos[rows[i]] = i
        }
        rows.sort(compare(value, pos, direction));
        var a = [];
        for (i = 0; i < offset; i++) {
            a[i] = i
        }
        rows = a.concat(rows);
        var old = this.getSortColumn();
        if (old != -1) {
            this.setSortDirection("", old)
        }
        this.setSortColumn(index);
        this.setSortDirection(direction, index);
        this.setRowIndices(rows)
    },
    onHeaderClicked: function(src, index, header) {
        if (this.$active) {
            AW.Grid.Controllers.Sort.doSort.call(this, src, index, header)
        }
    }
};
AW.Grid.Controllers.Overflow = (function() {
    function calcWidth() {
        var i,
        a = this.getColumnIndices();
        var left = 0,
        lc = this.$extended ? this.getFixedLeft() : 0;
        var center = 0,
        cc = this.getColumnCount();
        var right = 0,
        rc = this.$extended ? this.getFixedRight() : 0;
        left = this.getSelectorVisible() ? this.getSelectorWidth() : left;
        if (!this.$extended) {
            center = left;
            left = 0
        }
        for (i = 0; i < lc; i++) {
            left += this.getColumnWidth(a ? a[i] : i)
        }
        for (i = lc; i < cc - rc; i++) {
            center += this.getColumnWidth(a ? a[i] : i)
        }
        for (i = cc - rc; i < cc; i++) {
            right += this.getColumnWidth(a ? a[i] : i)
        }
        var total = left + center + right;
        if (total != this.getScrollWidth()) {
            this.setScrollWidth(total)
        }
        if (left != this.getContentWidth("left")) {
            this.setContentWidth(left, "left")
        }
        if (right != this.getContentWidth("right")) {
            this.setContentWidth(right, "right")
        }
    }
    function calcHeight() {
        if (!this.getScrollWidth()) {
            calcWidth.call(this)
        }
        var i,
        a,
        count;
        var headers = 0;
        count = this.$extended ? this.getHeaderCount() : 1;
        a = this.getHeaderIndices();
        if (this.getHeaderVisible()) {
            for (i = 0; i < count; i++) {
                headers += this.getHeaderHeight(a ? a[i] : i)
            }
        }
        var rows = this.getRowHeight() * this.getRowCount();
        var footers = 0;
        count = this.$extended ? this.getFooterCount() : 1;
        a = this.getFooterIndices();
        if (this.getFooterVisible()) {
            for (i = 0; i < count; i++) {
                footers += this.getFooterHeight(a ? a[i] : i)
            }
        }
        var total = headers + rows + footers;
        if (total != this.getScrollHeight()) {
            this.setScrollHeight(total)
        }
        if (headers != this.getContentHeight("top")) {
            this.setContentHeight(headers, "top")
        }
        if (footers != this.getContentHeight("bottom")) {
            this.setContentHeight(footers, "bottom")
        }
    }
    function calcBars() {
        var s,
        x,
        y;
        var l = this.getScrollLeft();
        var t = this.getScrollTop();
        var w = this.getScrollWidth();
        var h = this.getScrollHeight();
        var ww = this.getContentWidth("total");
        var hh = this.getContentHeight("total");
        if (!ww || !hh) {
            return
        }
        if (w <= ww && h <= hh) {
            s = "none";
            x = 0;
            y = 0
        } else if (w <= ww - AW.sx) {
            s = "vertical";
            x = AW.sx;
            y = 0
        } else if (h <= hh - AW.sy) {
            s = "horizontal";
            x = 0;
            y = AW.sy
        } else {
            s = "both";
            x = AW.sx;
            y = AW.sy
        }
        if (this.getScrollBars() != s) {
            this.setScrollBars(s)
        }
        if (w - l < ww - x) {
            var ll = Math.max(0, w - ww + x);
            if (ll != l) {
                this.setScrollLeft(ll)
            }
        }
        if (h - t < hh - y) {
            var tt = Math.max(0, h - hh + y);
            if (tt != t) {
                this.setScrollTop(tt)
            }
        }
        var cw = ww - x - this.getContentWidth("left") - this.getContentWidth("right");
        var ch = hh - y - this.getContentHeight("top") - this.getContentHeight("bottom");
        if (cw != this.getContentWidth("center")) {
            this.setContentWidth(cw, "center")
        }
        if (ch != this.getContentHeight("center")) {
            this.setContentHeight(ch, "center")
        }
    }
    return {
        onColumnWidthChanged: calcWidth,
        onColumnCountChanged: calcWidth,
        onSelectorWidthChanged: calcWidth,
        onSelectorVisibleChanged: calcWidth,
        onRowHeightChanged: calcHeight,
        onRowCountChanged: calcHeight,
        onHeaderVisibleChanged: calcHeight,
        onHeaderHeightChanged: calcHeight,
        onHeaderCountChanged: calcHeight,
        onFooterVisibleChanged: calcHeight,
        onFooterHeightChanged: calcHeight,
        onFooterCountChanged: calcHeight,
        onScrollWidthChanged: calcBars,
        onScrollHeightChanged: calcBars,
        onContentWidthChanged: calcBars,
        onContentHeightChanged: calcBars
    }
})();
AW.Grid.Controllers.Scroll = (function() {
    return {
        onScrollLeftChanged: function(x) {
            var e = this.getScroll().getContent("box").element();
            if (e) {
                e.scrollLeft = x
            }
        },
        onScrollTopChanged: function(y) {
            var e = this.getScroll().getContent("box").element();
            if (e) {
                e.scrollTop = y
            }
        },
        onScrollWidthChanged: function(w) {
            this.getScroll().getContent("box/spacer").setStyle("width", w + "px")
        },
        onScrollHeightChanged: function(h) {
            this.getScroll().getContent("box/spacer").setStyle("height", h + "px")
        },
        onScrollBarsChanged: function(bars) {
            this.getScroll().setClass("scrollbars", bars)
        }
    }
})();
AW.Grid.Controllers.Content = {
    onScrollLeftChanged: function(x) {
        this.getView().changeScrollLeft(x)
    },
    onScrollTopChanged: function(y) {
        this.getView().changeScrollTop(y)
    },
    onContentWidthChanged: function(width, panel) {
        this.getView().changePanelWidth(width, panel)
    },
    onContentHeightChanged: function(height, panel) {
        this.getView().changePanelHeight(height, panel)
    }
};
AW.Grid.Controllers.Virtual = (function() {
    var oldScrollTop,
    oldScrollLeft,
    scrollTime = new Date();
    function calcVirtual(dir) {
        if (!this.getVirtualMode()) {
            return
        }
        dir = dir || 0;
        var scrollTop = this.getScrollTop();
        var scrollLeft = this.getScrollLeft();
        var totalHeight = this.getContentHeight("center");
        var totalWidth = this.getContentWidth("center");
        if (!totalHeight || !totalWidth) {
            return
        }
        var delta1 = dir < 0 ? 10: 1;
        var delta2 = dir > 0 ? 10: 1;
        var rowCount = this.getRowCount();
        var rowOffset = this.getRowOffset();
        var rowHeight = this.getRowHeight();
        var firstRow = Math.floor(scrollTop / rowHeight);
        var lastRow = Math.floor((scrollTop + totalHeight) / rowHeight);
        var start = Math.max(0, Math.min(rowCount - 1, firstRow - delta1));
        var end = Math.max(0, Math.min(rowCount - 1, lastRow + delta2));
        var rvScroll = start * rowHeight;
        var rvOffset = start + rowOffset;
        var rvCount = Math.min(rowCount, end - start + 1);
        var i,
        ii;
        var columnCount = this.getColumnCount();
        var columnOffset = this.getColumnOffset();
        var columnIndices = this.getColumnIndices();
        if (this.$extended) {
            columnCount -= this.getFixedLeft() + this.getFixedRight();
            columnOffset += this.getFixedLeft()
        } else if (this.getSelectorVisible()) {
            scrollLeft -= this.getSelectorWidth()
        }
        var w = 0,
        wp = 0,
        ww;
        for (i = 0; i < columnCount; i++) {
            ii = columnIndices ? columnIndices[i + columnOffset] : i + columnOffset;
            ww = this.getColumnWidth(ii);
            if (w + ww > scrollLeft) {
                break
            }
            wp = w;
            w += ww
        }
        var k = i ? i - 1: 0;
        for (i = k + 1; i < columnCount; i++) {
            ii = columnIndices ? columnIndices[i + columnOffset] : i + columnOffset;
            w += this.getColumnProperty("width", ii);
            if (w > totalWidth + scrollLeft) {
                break
            }
        }
        this._startUpdate();
        this.setRowVirtualScroll(rvScroll);
        this.setRowVirtualOffset(rvOffset);
        this.setRowVirtualCount(rvCount);
        this.setColumnVirtualScroll(wp);
        this.setColumnVirtualOffset(columnOffset + k);
        this.setColumnVirtualCount(Math.min(i + 2, columnCount) - k);
        this._endUpdate()
    }
    function startVirtual(dir) {
        var s = ++this._scrollSerial;
        scrollTime = new Date();
        var wait = function() {
            if (s == this._scrollSerial) {
                if ((new Date()) - scrollTime > 200 || !AW._scrollWait) {
                    calcVirtual.call(this, dir);
                    this.getRows().refreshVirtual()
                } else {
                    this.setTimeout(wait, 20)
                }
            }
        };
        this.setTimeout(wait, 50)
    }
    return {
        paint: function() {
            calcVirtual.call(this)
        },
        onControlRefreshing: function() {
            calcVirtual.call(this)
        },
        onScrollLeftChanging: function() {
            oldScrollLeft = this.getScrollLeft()
        },
        onScrollTopChanging: function() {
            oldScrollTop = this.getScrollTop()
        },
        onScrollLeftChanged: function(scrollLeft) {
            if (this.getVirtualMode() && scrollLeft != oldScrollLeft) {
                AW._scrollWait = true;
                startVirtual.call(this)
            }
        },
        onScrollTopChanged: function(scrollTop) {
            if (this.getVirtualMode() && scrollTop != oldScrollTop) {
                AW._scrollWait = true;
                if (Math.abs(scrollTop - oldScrollTop) > this.getScrollHeight() / 5) {
                    AW._scrollWait = false
                }
                var dir = scrollTop > oldScrollTop ? 1: -1;
                startVirtual.call(this, dir)
            }
        },
        onCurrentRowChanged: function(i) {
            var current = this.getCurrentRow();
            var scroll = this.getScrollProperty("top");
            var height = this.getRowProperty("height");
            var top = (this.getRowPosition(current) - this.getRowOffset()) * height;
            var bottom = top + height;
            var max = this.getContentHeight("center");
            if (!max) {
                return
            }
            if (top < scroll) {
                this.setScrollTop(top)
            }
            if (max + scroll < bottom) {
                this.setScrollTop(bottom - max)
            }
            if (AW.ie && this.element()) {
                var h = this.element().offsetHeight
            }
        },
        onCurrentColumnChanged: function(index) {
            var scroll = this.getScrollProperty("left");
            var col = this.getColumnPosition(index);
            var max = this.getContentWidth("center");
            if (!max) {
                return
            }
            var i,
            a = this.getColumnIndices();
            var lw = 0,
            lc = this.$extended ? this.getFixedLeft() : 0;
            var mw = 0,
            c = this.getColumnCount();
            var rw = 0,
            rc = this.$extended ? this.getFixedRight() : 0;
            lw = this.getSelectorVisible() ? this.getSelectorWidth() : lw;
            if (!this.$extended) {
                mw = lw;
                lw = 0
            }
            for (i = 0; i < lc; i++) {
                lw += this.getColumnWidth(a ? a[i] : i)
            }
            for (i = lc; i < Math.min(col, c - rc - 1); i++) {
                mw += this.getColumnWidth(a ? a[i] : i)
            }
            for (i = c - rc; i < c; i++) {
                rw += this.getColumnWidth(a ? a[i] : i)
            }
            if (!col) {
                mw = 0
            }
            if (mw < scroll) {
                this.setScrollLeft(mw);
                return
            }
            var right = mw + this.getColumnWidth(index);
            if (max + scroll < right) {
                this.setScrollLeft(right - max)
            }
        }
    }
})();
AW.Grid.Controllers.Grid = {
    onRowsTemplateChanged: function(rows) {
        rows.mapTemplate("item", "row");
        rows.mapModel("view", "row")
    },
    onRowTemplateChanged: function(row) {
        row.setClass("grid", "row");
        row.setClass("row", 
        function() {
            return this.$0
        });
        row.setClass("rows", 
        function() {
            return this.getRowProperty("state") || "normal"
        });
        row.setClass("alternate", 
        function() {
            return this.getRowProperty("position") % 2 ? "odd": "even"
        });
        row.mapTemplate("item", 
        function(i) {
            return this.$owner.getCell(i, this.$0)
        });
        row.mapTemplate("selector", 
        function() {
            return this.$owner.getSelector(this.$0)
        });
        row.mapModel("view", "column")
    },
    onCellTemplateChanged: function(cell) {
        cell.setAttribute("title", "");
        cell.setClass("grid", "cell");
        cell.setClass("column", 
        function() {
            return this.$0
        });
        cell.setClass("cells", 
        function() {
            return this.getControlProperty("state") || "normal"
        });
        cell.mapModel("control", "cell");
        cell.getStateProperty = function(p) {
            return this.$owner.getRowProperty(p, this.$1)
        };
        cell.setStateProperty = function(p, v) {
            this.$owner.setRowProperty(p, v, this.$1)
        }
    },
    onHeadersTemplateChanged: function(headers) {
        headers.setClass("grid", "headers");
        headers.setClass("header", 
        function() {
            return this.$0 || "0"
        });
        headers.setStyle("height", 
        function() {
            return this.getHeaderProperty("height") - AW.dy + "px"
        });
        headers.getContent("end").setClass("grid", "header");
        headers.mapTemplate("item", 
        function(i) {
            return this.$owner.getHeader(i, this.$0) + this.$owner.getSeparator(i, this.$0)
        });
        headers.mapTemplate("selector", 
        function() {
            return this.$owner.getTopSelector(this.$0) + (this.$owner.getSelectorResizable() && !this.$0 ? this.$owner.getSeparator("selector") : "")
        });
        headers.mapModel("view", "column");
        headers._raiseEvents = false
    },
    onFootersTemplateChanged: function(footers) {
        footers.setClass("grid", "footers");
        footers.setClass("footer", 
        function() {
            return this.$0 || "0"
        });
        footers.setStyle("height", 
        function() {
            return this.getFooterProperty("height") - AW.dy + "px"
        });
        footers.mapTemplate("item", 
        function(i) {
            return this.$owner.getFooter(i, this.$0)
        });
        footers.mapTemplate("selector", "bottomSelector");
        footers.mapModel("view", "column");
        footers._raiseEvents = false
    },
    onHeaderTemplateChanged: function(header) {
        header.setClass("grid", "header");
        header.setClass("column", 
        function() {
            return this.$0
        });
        header.mapModel("control", "header");
        header.getStateProperty = function(p) {
            return this.$owner.getColumnProperty(p, this.$0)
        };
        header.setStateProperty = function(p, v) {
            this.$owner.setColumnProperty(p, v, this.$0)
        }
    },
    onFooterTemplateChanged: function(footer) {
        footer.setClass("grid", "footer");
        footer.setClass("column", 
        function() {
            return this.$0
        });
        footer.mapModel("control", "footer")
    },
    onSelectorTemplateChanged: function(selector) {
        selector.setClass("row", "selector");
        selector.mapModel("control", "selector");
        selector.mapModel("state", "row")
    },
    onTopSelectorTemplateChanged: function(selector) {
        selector.setClass("grid", "header");
        selector.setClass("row", "selector");
        selector.mapModel("control", "top")
    },
    onBottomSelectorTemplateChanged: function(selector) {
        selector.setClass("row", "selector");
        selector.mapModel("control", "bottom")
    },
    onViewTemplateChanged: function(view) {
        view.mapModel("panel", "content");
        view.mapTemplate("panel", 
        function(i) {
            switch (i) {
            case "top":
                return this.getHeaders();
            case "center":
                return this.getRows();
            case "bottom":
                return this.getFooters()
            }
        })
    },
    onScrollTemplateChanged: function(scroll) {
        scroll.setStyle("visibility", "hidden")
    },
    onPopupTemplateChanged: function(popup) {
        popup.onItemClicked = function(event, i) {
            try {
                var s = this.getItemText(i);
                this.$owner.setCellText(s, this.$0, this.$1);
                AW.$popup.hidePopup()
            } catch(e) {}
        }
    }
};
AW.Grid.Controllers.Extended = {
    onViewTemplateChanged: function(view) {
        view.mapModel("panel", "content");
        view.mapTemplate("panel", 
        function(i, j) {
            switch (i) {
            case "top":
                return this.$owner.getTop(j);
            case "center":
                return this.$owner.getRows(j);
            case "bottom":
                return this.$owner.getBottom(j)
            }
        })
    },
    onTopTemplateChanged: function(top) {
        top.mapTemplate("item", "headers");
        top.mapModel("view", "header")
    },
    onBottomTemplateChanged: function(bottom) {
        bottom.mapTemplate("item", "footers");
        bottom.mapModel("view", "footer")
    }
};
AW.Grid.Controllers.SingleCell = (function() {
    var cc = ["getCurrentColumn", "getFirstColumn", "getPreviousColumn", "getNextColumn", "getLastColumn"];
    var rr = ["getCurrentRow", "getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];
    function kb(i, j) {
        return function(event) {
            var col = this[cc[i]]();
            var row = this[rr[j]]();
            this.selectCell(col, row);
            AW.setReturnValue(event, false)
        }
    }
    function ms() {
        return function(event, col, row) {
            this.selectCell(col, row)
        }
    }
    return {
        onKeyCtrlUp: kb(0, 1),
        onKeyUp: kb(0, 2),
        onKeyDown: kb(0, 3),
        onKeyCtrlDown: kb(0, 4),
        onKeyPageUp: kb(0, 5),
        onKeyPageDown: kb(0, 6),
        onKeyCtrlLeft: kb(1, 0),
        onKeyLeft: kb(2, 0),
        onKeyRight: kb(3, 0),
        onKeyCtrlRight: kb(4, 0),
        onKeyHome: kb(1, 0),
        onKeyEnd: kb(4, 0),
        onKeyCtrlHome: kb(1, 1),
        onKeyCtrlEnd: kb(4, 4),
        onCellClicking: ms()
    }
})();
AW.Grid.Controllers.SingleRow = (function() {
    var rr = ["getCurrentRow", "getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];
    function kb(i) {
        return function(event) {
            var row = this[rr[i]]();
            this.selectRow(row);
            AW.setReturnValue(event, false)
        }
    }
    function ms() {
        return function(event, row) {
            this.selectRow(row)
        }
    }
    return {
        onKeyHome: kb(1),
        onKeyUp: kb(2),
        onKeyDown: kb(3),
        onKeyEnd: kb(4),
        onKeyCtrlHome: kb(1),
        onKeyCtrlEnd: kb(4),
        onKeyPageUp: kb(5),
        onKeyPageDown: kb(6),
        onRowClicking: ms()
    }
})();
AW.Grid.Controllers.MultiCell = (function() {
    var cc = ["getCurrentColumn", "getFirstColumn", "getPreviousColumn", "getNextColumn", "getLastColumn"];
    var rr = ["getCurrentRow", "getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];
    function kb(i, j, mode) {
        return function(event) {
            var col = this[cc[i]]();
            var row = this[rr[j]]();
            this.selectCell(col, row, mode);
            AW.setReturnValue(event, false)
        }
    }
    function ms(mode) {
        return function(event, col, row) {
            if (event.button == 2 && this.getCellSelected(col, row)) {
                return
            }
            this.selectCell(col, row, mode);
            if (AW.gecko && mode) {
                try {
                    window.getSelection().collapseToEnd()
                } catch(err) {}
            }
        }
    }
    return {
        onKeyCtrlUp: kb(0, 1),
        onKeyUp: kb(0, 2),
        onKeyDown: kb(0, 3),
        onKeyCtrlDown: kb(0, 4),
        onKeyPageUp: kb(0, 5),
        onKeyPageDown: kb(0, 6),
        onKeyCtrlLeft: kb(1, 0),
        onKeyLeft: kb(2, 0),
        onKeyRight: kb(3, 0),
        onKeyCtrlRight: kb(4, 0),
        onKeyHome: kb(1, 0),
        onKeyEnd: kb(4, 0),
        onKeyCtrlHome: kb(1, 1),
        onKeyCtrlEnd: kb(4, 4),
        onKeyShiftUp: kb(0, 2, 1),
        onKeyShiftDown: kb(0, 3, 1),
        onKeyShiftPageUp: kb(0, 5, 1),
        onKeyShiftPageDown: kb(0, 6, 1),
        onKeyShiftLeft: kb(2, 0, 1),
        onKeyShiftRight: kb(3, 0, 1),
        onCellClicking: ms(),
        onCellShiftClicking: ms(1)
    }
})();
AW.Grid.Controllers.MultiRow = (function() {
    var rr = ["getCurrentRow", "getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];
    function kb(i, mode) {
        return function(event) {
            var row = this[rr[i]]();
            this.selectRow(row, mode);
            AW.setReturnValue(event, false)
        }
    }
    function ms(mode) {
        return function(event, row) {
            if (event.button == 2 && this.getRowSelected(row)) {
                return
            }
            this.selectRow(row, mode);
            if (AW.gecko && mode) {
                try {
                    window.getSelection().collapseToEnd()
                } catch(err) {}
            }
        }
    }
    return {
        onKeyHome: kb(1),
        onKeyUp: kb(2),
        onKeyDown: kb(3),
        onKeyEnd: kb(4),
        onKeyCtrlHome: kb(1),
        onKeyCtrlEnd: kb(4),
        onKeyPageUp: kb(5),
        onKeyPageDown: kb(6),
        onKeyShiftHome: kb(1, 1),
        onKeyShiftUp: kb(2, 1),
        onKeyShiftDown: kb(3, 1),
        onKeyShiftEnd: kb(4, 1),
        onKeyCtrlShiftHome: kb(1, 1),
        onKeyCtrlShiftEnd: kb(4, 1),
        onKeyShiftPageUp: kb(5, 1),
        onKeyShiftPageDown: kb(6, 1),
        onRowClicking: ms(),
        onRowShiftClicking: ms(1),
        onRowCtrlClicking: ms(2)
    }
})();
AW.Grid.Controllers.MultiRowMarker = (function() {
    var rr = ["getCurrentRow", "getFirstRow", "getPreviousRow", "getNextRow", "getLastRow", "getPageUpRow", "getPageDownRow"];
    function kb(i, mode) {
        return function(event) {
            var row = this[rr[i]]();
            this.selectRow(row, mode);
            AW.setReturnValue(event, false)
        }
    }
    function refresh(v, i) {
        this.getRow(i).refresh()
    }
    return {
        onKeyHome: kb(1, 3),
        onKeyUp: kb(2, 3),
        onKeyDown: kb(3, 3),
        onKeyEnd: kb(4, 3),
        onKeyPageUp: kb(5, 3),
        onKeyPageDown: kb(6, 3),
        onRowSelectedChanged: refresh
    }
})();
AW.Grid.Separator = AW.System.Template.subclass();
AW.Grid.Separator.create = function() {
    var obj = this.prototype;
    obj.setClass("grid", "separator");
    obj.setClass("resizable", 
    function() {
        return this.getColumnProperty("resizable") ? true: false
    });
    obj._raiseEvents = true;
    obj.setEvent("onmousedown", 
    function(event) {
        if (!this.getColumnProperty("resizable")) {
            return false
        }
        var start = event.screenX;
        var self = this;
        var width = self.element().previousSibling.offsetWidth;
        var scroll = self.element().parentNode.parentNode.scrollLeft;
        function doResize(event) {
            var w = width + event.screenX - start;
            w = w > 9 ? w: 9;
            self.element().previousSibling.style.width = (w - AW.dx) + "px"
        }
        function endResize(event) {
            var w = width + event.screenX - start;
            w = w > 9 ? w: 9;
            var e = AW.opera ? window: self.element();
            AW.detachEvent(e, "onmousemove", doResize);
            AW.detachEvent(e, "onmouseup", endResize);
            AW.detachEvent(e, "onlosecapture", endResize);
            AW.releaseCapture(e);
            AW.ignoreMouse = false;
            e = self.element();
            if (AW.gecko) {
                try {
                    e.parentNode.parentNode.scrollLeft = scroll;
                    e.parentNode.focus()
                } catch(err) {}
            }
            var id = e.previousSibling.id;
            if (id.match("header")) {
                self.$owner.setColumnProperty("width", w, self.$0)
            } else if (id.match("topSelector")) {
                self.$owner.setSelectorProperty("width", w)
            }
            e.previousSibling.style.width = "";
            e = null
        }
        var e = AW.opera ? window: self.element();
        AW.setCapture(e);
        AW.attachEvent(e, "onmousemove", doResize);
        AW.attachEvent(e, "onmouseup", endResize);
        AW.attachEvent(e, "onlosecapture", endResize);
        e = null;
        event.cancelBubble = true;
        AW.ignoreMouse = true;
        if (AW.opera || AW.konqueror) {
            event.preventDefault();
            return false
        }
    })
};
AW.Grid.Header = AW.Templates.ImageText.subclass();
AW.Grid.Header.create = function() {
    var obj = this.prototype;
    var _super = this.superclass.prototype;
    function _direction() {
        return this.getSortProperty("direction") || "none"
    }
    obj.setClass("sort", _direction);
    var sort = new AW.HTML.SPAN;
    sort.setClass("grid", "sort");
    obj.setContent("box/text/sort", sort);
    obj.element = function() {
        if (typeof(this.$1) == "undefined" && this.$owner && this.$owner.$extended) {
            return _super.element.call(this.$owner.getHeader(this.$0, 0))
        } else {
            return _super.element.call(this)
        }
    }
};
AW.Grid.Row = AW.System.Template.subclass();
AW.Grid.Row.create = function() {
    var obj = this.prototype;
    var _super = this.superclass.prototype;
    obj.setTag("span");
    obj.setClass("templates", "list");
    obj.setClass("text", "normal");
    if (AW.gecko) {
        obj.setAttribute("tabIndex", "-1")
    }
    obj.setContent("selector", 
    function() {
        return (!this.$1 || this.$1 == "left") && this.getSelectorProperty("visible") ? this.getSelector() : ""
    });
    var span = AW.HTML.SPAN;
    var start = new span;
    start.setClass("row", "start");
    start.setStyle("width", 
    function() {
        if ((!this.$1 || this.$1 == "center") && this.$name == "row" && this.getVirtualProperty("mode")) {
            return this.getViewProperty("virtualScroll") + "px"
        }
        return 0
    });
    obj.setContent("start", start);
    obj.setContent("items", 
    function() {
        var i,
        ii,
        a = [];
        var virtual = this.getVirtualProperty("mode");
        var indices = this.getViewProperty("indices");
        var offset,
        count;
        if (virtual && (!this.$1 || this.$1 == "center") && this.$name == "row") {
            count = this.getViewProperty("virtualCount");
            offset = this.getViewProperty("virtualOffset")
        } else {
            count = this.getViewProperty("count");
            offset = this.getViewProperty("offset")
        }
        var clone = this.$owner.$clone;
        this.$owner.$clone = false;
        for (i = 0; i < count; i++) {
            ii = indices ? indices[i + offset] : i + offset;
            a[i] = this.getItem(ii).toString()
        }
        this.$owner.$clone = clone;
        return a.join("")
    });
    var space = new span;
    var box = new span;
    space.setClass("item", "template");
    space.setClass("grid", "cell");
    space.setClass("column", "space");
    box.setClass("item", "box");
    space.setContent("box", box);
    obj.setContent("end", space);
    obj.refreshVirtual1 = function(h, a) {
        var i,
        ii;
        var se = this.getContent("start").element();
        var ee = this.getContent("end").element();
        se.style.width = this.getViewProperty("virtualScroll") + "px";
        for (i = h.start1; i < h.start2; i++) {
            se.parentNode.removeChild(se.nextSibling)
        }
        for (i = h.end1; i > h.end2; i--) {
            ee.parentNode.removeChild(ee.previousSibling)
        }
        var indices = this.getViewProperty("indices");
        var clone = this.$owner.$clone;
        this.$owner.$clone = false;
        for (i = h.start1 - 1; i >= h.start2; i--) {
            ii = indices ? indices[i] : i;
            a.push(this.getItem(ii).toString())
        }
        for (i = h.end1 + 1; i <= h.end2; i++) {
            ii = indices ? indices[i] : i;
            a.push(this.getItem(ii).toString())
        }
        this.$owner.$clone = clone;
        se = null;
        ee = null
    };
    obj.refreshVirtual2 = function(h, p) {
        var i;
        var se = this.getContent("start").element();
        var ee = this.getContent("end").element();
        for (i = h.start1 - 1; i >= h.start2; i--) {
            se.parentNode.insertBefore(p.firstChild, se.nextSibling)
        }
        for (i = h.end1 + 1; i <= h.end2; i++) {
            ee.parentNode.insertBefore(p.firstChild, ee)
        }
        se = null;
        ee = null
    };
    var rf = obj.refresh;
    obj.refresh = function() {
        if (typeof(this.$1) == "undefined" && this.$owner.$extended) {
            rf.call(this.$owner.getRow(this.$0, "left"));
            rf.call(this.$owner.getRow(this.$0, "center"));
            rf.call(this.$owner.getRow(this.$0, "right"))
        } else {
            rf.call(this)
        }
    };
    var rc = obj.refreshClasses;
    obj.refreshClasses = function() {
        if (typeof(this.$1) == "undefined" && this.$owner.$extended) {
            rc.call(this.$owner.getRow(this.$0, "left"));
            rc.call(this.$owner.getRow(this.$0, "center"));
            rc.call(this.$owner.getRow(this.$0, "right"))
        } else {
            rc.call(this)
        }
    };
    AW._addMouseEvents(obj);
    function extendEvent(name) {
        var f = obj[name];
        obj[name] = function() {
            if (this.$owner.$extended) {
                f.call(this.$owner.getRow(this.$0, "left"));
                f.call(this.$owner.getRow(this.$0, "center"));
                f.call(this.$owner.getRow(this.$0, "right"))
            } else {
                f.call(this)
            }
        }
    }
    extendEvent("onMouseOver");
    extendEvent("onMouseOut");
    extendEvent("onMouseDown");
    extendEvent("onMouseUp")
};
AW.Grid.Rows = AW.Templates.List.subclass();
AW.Grid.Rows.create = function() {
    var obj = this.prototype;
    var _super = this.superclass.prototype;
    obj.setClass("grid", "view");
    var init = new AW.System.HTML;
    init.setTag("marquee");
    init.setClass("grid", "init");
    init.setAttribute("behavior", "slide");
    init.setEvent("onstart", waitInit);
    init.setEvent("onresize", waitInit);
    obj.setContent("init", AW.ie ? init: "");
    function initialize() {
        if (AW.ie) {
            var e = this.getContent("init").element();
            if (e) {
                e.parentNode.removeChild(e);
                e = null
            }
            this.setContent("init", "")
        }
        if (this.$owner._initialized) {
            return
        }
        this.$owner._initialized = true;
        this.setTimeout(function() {
            this.raiseEvent("paint")
        })
    }
    function waitInit() {
        var e = this.element();
        if ((e && e.offsetWidth && e.offsetHeight) || this.$owner._initialized) {
            initialize.call(this)
        } else {
            this.setTimeout(waitInit, 1000)
        }
        e = null
    }
    obj.setContent("items", 
    function() {
        if (!this.$owner._initialized) {
            if (!AW.ie || AW.ie8) {
                this.setTimeout(waitInit, 100)
            }
            return ""
        }
        var i,
        ii,
        a = [];
        var virtual = this.getVirtualProperty("mode");
        var indices = this.getViewProperty("indices");
        var count,
        offset;
        if (virtual) {
            count = this.getViewProperty("virtualCount");
            offset = this.getViewProperty("virtualOffset")
        } else {
            count = this.getViewProperty("count");
            offset = this.getViewProperty("offset")
        }
        var clone = this.$owner.$clone;
        this.$owner.$clone = false;
        for (i = 0; i < count; i++) {
            ii = indices ? indices[i + offset] : i + offset;
            a[i] = this.getItem(ii).toString()
        }
        this.$owner.$clone = clone;
        return a.join("")
    });
    var span = AW.HTML.SPAN;
    var top = new span;
    top.setClass("view", "top");
    top.setStyle("height", 
    function() {
        return this.getVirtualProperty("mode") ? this.getViewProperty("virtualScroll") + "px": 0
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
    obj.refresh = function() {
        if (this.$owner && this.$owner.$active) {
            this.$owner.focus()
        }
        if (typeof(this.$0) == "undefined" && this.$owner.$extended) {
            _super.refresh.call(this.$owner.getRows("left"));
            _super.refresh.call(this.$owner.getRows("center"));
            _super.refresh.call(this.$owner.getRows("right"))
        } else {
            _super.refresh.call(this)
        }
    };
    obj.refreshVirtual = function() {
        if (this.$owner && this.$owner.$active) {
            this.$owner.focus()
        }
        var undef;
        var panel = this.$owner.$extended ? "center": undef;
        var se = this.getRows(panel).getContent("start").element();
        var ee = this.getRows(panel).getContent("end").element();
        if (!se || !ee || se.nextSibling == ee) {
            se = null;
            ee = null;
            return this.refresh()
        }
        var si = AW.object(se.nextSibling.id).$0;
        var ei = AW.object(ee.previousSibling.id).$0;
        var start1 = this.getRowProperty("position", si);
        var end1 = this.getRowProperty("position", ei);
        var start2 = this.getRowProperty("virtualOffset");
        var end2 = start2 + this.getRowProperty("virtualCount") - 1;
        var h = {};
        se = this.getRow(si, panel).getContent("start").element();
        ee = this.getRow(si, panel).getContent("end").element();
        if (!se || !ee || se.nextSibling == ee) {
            se = null;
            ee = null;
            return this.refresh()
        }
        si = AW.object(se.nextSibling.id).$0;
        ei = AW.object(ee.previousSibling.id).$0;
        h.start1 = this.getColumnProperty("position", si);
        h.end1 = this.getColumnProperty("position", ei);
        h.start2 = this.getColumnProperty("virtualOffset");
        h.end2 = h.start2 + this.getColumnProperty("virtualCount") - 1;
        if (start2 > end1 || end2 < start1 || h.start2 > h.end1 || h.end2 < h.start1) {
            se = null;
            ee = null;
            return this.refresh()
        }
        var i,
        ii,
        j;
        var indices = this.getRowProperty("indices");
        var panels = this.$owner.$extended ? ["left", "center", "right"] : [undef];
        for (j = 0; j < panels.length; j++) {
            panel = panels[j];
            se = this.getRows(panel).getContent("start").element();
            ee = this.getRows(panel).getContent("end").element();
            se.style.height = this.getRowProperty("virtualScroll") + "px";
            for (i = start1; i < start2; i++) {
                se.parentNode.removeChild(se.nextSibling)
            }
            for (i = end1; i > end2; i--) {
                ee.parentNode.removeChild(ee.previousSibling)
            }
        }
        var a = [];
        var p = document.createElement("span");
        var start3 = Math.max(start1, start2);
        var end3 = Math.min(end1, end2);
        panel = this.$owner.$extended ? "center": undef;
        if (h.start1 != h.start2 || h.end1 != h.end2) {
            for (i = start3; i <= end3; i++) {
                ii = indices ? indices[i] : i;
                this.getRow(ii, panel).refreshVirtual1(h, a)
            }
            p.innerHTML = a.join("");
            for (i = start3; i <= end3; i++) {
                ii = indices ? indices[i] : i;
                this.getRow(ii, panel).refreshVirtual2(h, p)
            }
        }
        for (j = 0; j < panels.length; j++) {
            panel = panels[j];
            se = this.getRows(panel).getContent("start").element();
            ee = this.getRows(panel).getContent("end").element();
            var k = 0;
            a = [];
            var clone = this.$owner.$clone;
            this.$owner.$clone = false;
            for (i = start1 - 1; i >= start2; i--) {
                ii = indices ? indices[i] : i;
                a[k++] = this.getRow(ii, panel).toString()
            }
            for (i = end1 + 1; i <= end2; i++) {
                ii = indices ? indices[i] : i;
                a[k++] = this.getRow(ii, panel).toString()
            }
            this.$owner.$clone = clone;
            p.innerHTML = a.join("");
            for (i = start1 - 1; i >= start2; i--) {
                se.parentNode.insertBefore(p.firstChild, se.nextSibling)
            }
            for (i = end1 + 1; i <= end2; i++) {
                ee.parentNode.insertBefore(p.firstChild, ee)
            }
            se = null;
            ee = null
        }
        p = null
    }
};
AW.Grid.Control = AW.System.Control.subclass();
AW.Grid.Control.create = function() {
    var obj = this.prototype;
    var _super = this.superclass.prototype;
    obj.setClass("grid", "control");
    obj.setClass("selectors", 
    function() {
        return this.getSelectorVisible() ? "visible": "hidden"
    });
    var focus = new AW.HTML.TEXTAREA;
    focus.setClass("control", "focus");
    focus.setAttribute("tabIndex", 
    function() {
        return this.getTabProperty("index")
    });
    var sample = new AW.HTML.SPAN;
    sample.setClass("row", "sample");
    sample.setClass("grid", "row");
    var box = new AW.HTML.SPAN;
    box.setClass("grid", "box");
    box.setContent("focus", focus);
    box.setContent("html", 
    function() {
        return this.getLayout()
    });
    box.setContent("sample", sample);
    obj.setContent("box", box);
    var Grid = AW.Grid.Controllers;
    obj.setController("size", Grid.Size);
    obj.setController("cell", Grid.Cell);
    obj.setController("edit", Grid.Edit);
    obj.setController("row", Grid.Row);
    obj.setController("view", Grid.View);
    obj.setController("navigation", Grid.Navigation);
    obj.setController("selection", Grid.SingleCell);
    obj.setController("sort", Grid.Sort);
    obj.setController("overflow", Grid.Overflow);
    obj.setController("scroll", Grid.Scroll);
    obj.setController("content", Grid.Content);
    obj.setController("virtual", Grid.Virtual);
    obj.setController("grid", Grid.Grid);
    obj.defineTemplate("layout", 
    function() {
        return this.getScrollTemplate()
    });
    obj.defineTemplate("scroll", new AW.Scroll.Bars);
    obj.defineTemplate("view", new AW.Panels.Horizontal);
    obj.defineTemplate("panel", 
    function() {
        return ""
    });
    obj.defineTemplate("rows", new AW.Grid.Rows);
    obj.defineTemplate("row", new AW.Grid.Row);
    obj.defineTemplate("cell", new AW.Templates.Cell);
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
        return format ? format.textToValue(text) : AW.textToValue(text)
    }
    function position(i) {
        return Number(i)
    }
    var models = {
        scroll: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            bars: "both"
        },
        cell: {
            text: "",
            image: "",
            link: "",
            value: value,
            data: "",
            format: "",
            tooltip: "",
            state: "",
            selected: false,
            editable: false
        },
        header: {
            text: "",
            image: "",
            link: "",
            value: value,
            data: "",
            format: "",
            tooltip: "",
            state: "",
            count: 1,
            offset: 0,
            height: 20,
            visible: true
        },
        selector: {
            text: "",
            image: "",
            link: "",
            value: value,
            data: "",
            format: "",
            tooltip: "",
            state: "",
            width: 20,
            resizable: false,
            visible: false
        },
        top: {
            text: "",
            image: "",
            link: "",
            value: value,
            data: "",
            format: "",
            tooltip: "",
            state: ""
        },
        column: {
            offset: 0,
            count: 0,
            position: position,
            state: "",
            selected: false,
            resizable: true,
            width: 100,
            virtualOffset: 0,
            virtualCount: 0,
            virtualScroll: 0
        },
        row: {
            offset: 0,
            count: 0,
            position: position,
            state: "",
            selected: false,
            height: 18,
            virtualOffset: 0,
            virtualCount: 0,
            virtualScroll: 0
        },
        current: {
            row: 0,
            column: 0,
            selection: "cell"
        },
        selected: {},
        selection: {
            mode: "rows",
            multiple: false
        },
        sort: {
            column: -1,
            direction: ""
        },
        fixed: {
            left: 1,
            right: 0
        },
        virtual: {
            mode: true,
            top: 0
        },
        content: {
            width: 0,
            height: 0
        }
    };
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
    obj.setContentWidth(100, "left");
    obj.setContentHeight(20, "top");
    obj.getFirstColumn = function() {
        var p = this.getColumnOffset();
        var a = this.getColumnIndices();
        return a ? a[p] : p
    };
    obj.getLastColumn = function() {
        var p = this.getColumnOffset() + this.getColumnCount() - 1;
        var a = this.getColumnIndices();
        return a ? a[p] : p
    };
    obj.getNextColumn = function() {
        var i = this.getCurrentColumn();
        var p = Math.min(this.getColumnPosition(i) + 1, this.getColumnOffset() + this.getColumnCount() - 1);
        var a = this.getColumnIndices();
        return a ? a[p] : p
    };
    obj.getPreviousColumn = function() {
        var i = this.getCurrentColumn();
        var p = Math.max(this.getColumnPosition(i) - 1, this.getColumnOffset());
        var a = this.getColumnIndices();
        return a ? a[p] : p
    };
    obj.getFirstRow = function() {
        var p = this.getRowOffset();
        var a = this.getRowIndices();
        return a ? a[p] : p
    };
    obj.getLastRow = function() {
        var p = this.getRowOffset() + this.getRowCount() - 1;
        var a = this.getRowIndices();
        return a ? a[p] : p
    };
    obj.getNextRow = function() {
        var i = this.getCurrentRow();
        var p = Math.min(this.getRowPosition(i) + 1, this.getRowOffset() + this.getRowCount() - 1);
        var a = this.getRowIndices();
        return a ? a[p] : p
    };
    obj.getPreviousRow = function() {
        var i = this.getCurrentRow();
        var p = Math.max(this.getRowPosition(i) - 1, this.getRowOffset());
        var a = this.getRowIndices();
        return a ? a[p] : p
    };
    obj.getPageUpRow = function() {
        var i = this.getCurrentRow();
        var p = Math.max(this.getRowPosition(i) - 10, this.getRowOffset());
        var a = this.getRowIndices();
        return a ? a[p] : p
    };
    obj.getPageDownRow = function() {
        var i = this.getCurrentRow();
        var p = Math.min(this.getRowPosition(i) + 10, this.getRowOffset() + this.getRowCount() - 1);
        var a = this.getRowIndices();
        return a ? a[p] : p
    };
    obj.selectRow = function(row, mode) {
        if (this.$edit) {
            this.focus()
        }
        if (this.$edit) {
            return
        }
        this._startUpdate();
        if (this.getCurrentSelection() != "row") {
            this.setCurrentSelection("row")
        }
        var start,
        end,
        i,
        a;
        var rr = this.getSelectedRows();
        if (!mode) {
            if (rr.length != 1 || rr[0] != row) {
                this.setSelectedRows([row])
            }
        } else if (mode == 1) {
            if (!rr.length) {
                this.setSelectedRows([row])
            } else {
                start = this.getRowPosition(rr[0]);
                end = this.getRowPosition(row);
                a = this.getRowIndices();
                rr = [];
                if (start < end) {
                    for (i = start; i <= end; i++) {
                        rr.push(a ? a[i] : i)
                    }
                } else {
                    for (i = start; i >= end; i--) {
                        rr.push(a ? a[i] : i)
                    }
                }
                this.setSelectedRows(rr)
            }
        } else if (mode == 2) {
            this.setRowSelected(!this.getRowSelected(row), row)
        }
        if (row != this.getCurrentRow()) {
            this.setCurrentRow(row)
        }
        this._endUpdate()
    };
    obj.selectCell = function(col, row, mode) {
        if (this.$edit) {
            this.focus()
        }
        if (this.$edit) {
            return
        }
        this._startUpdate();
        if (this.getCurrentSelection() != "cell") {
            this.setCurrentSelection("cell")
        }
        var start,
        end,
        i,
        a;
        var cc = this.getSelectedColumns();
        var rr = this.getSelectedRows();
        if (!mode) {
            if (cc.length != 1 || cc[0] != col) {
                this.setSelectedColumns([col])
            }
            if (rr.length != 1 || rr[0] != row) {
                this.setSelectedRows([row])
            }
        } else if (mode == 1) {
            if (!cc.length) {
                this.setSelectedColumns([col])
            } else {
                start = this.getColumnPosition(cc[0]);
                end = this.getColumnPosition(col);
                a = this.getColumnIndices();
                cc = [];
                if (start < end) {
                    for (i = start; i <= end; i++) {
                        cc.push(a ? a[i] : i)
                    }
                } else {
                    for (i = start; i >= end; i--) {
                        cc.push(a ? a[i] : i)
                    }
                }
                this.setSelectedColumns(cc)
            }
            if (!rr.length) {
                this.setSelectedRows([row])
            } else {
                start = this.getRowPosition(rr[0]);
                end = this.getRowPosition(row);
                a = this.getRowIndices();
                rr = [];
                if (start < end) {
                    for (i = start; i <= end; i++) {
                        rr.push(a ? a[i] : i)
                    }
                } else {
                    for (i = start; i >= end; i--) {
                        rr.push(a ? a[i] : i)
                    }
                }
                this.setSelectedRows(rr)
            }
        }
        if (col != this.getCurrentColumn()) {
            this.setCurrentColumn(col)
        }
        if (row != this.getCurrentRow()) {
            this.setCurrentRow(row)
        }
        this._endUpdate()
    };
    obj.calculateRowState = function(i) {
        var state = "";
        if (this.getCurrentRow() == i) {
            state = "current"
        }
        if (this.getRowSelected(i)) {
            state = "selected"
        }
        this.setRowState(state, i)
    };
    obj.calculateCellState = function(i, j) {
        var state = "";
        if (this.getCurrentColumn() == i && this.getCurrentRow() == j) {
            state = "current"
        }
        if (this.getCellSelected(i, j)) {
            state = "selected"
        }
        this.setCellState(state, i, j)
    };
    obj.startCellEdit = function(text) {
        if (this.$edit) {
            return
        }
        var c = this.getCurrentColumn();
        var r = this.getCurrentRow();
        if (!this.getCellEditable(c, r)) {
            return
        }
        var cell = this.getCell(c, r);
        return AW._startEdit(cell, text)
    };
    obj.cancelCellEdit = function() {
        AW._cancelEdit();
        this.focus();
        return ! AW._edit
    };
    obj.endCellEdit = function() {
        this.focus();
        return ! AW._edit
    };
    obj.setContent("box/block", new AW.HTML.SPAN);
    box.setEvent("onactivate", 
    function(event) {
        try {
            if (event.srcElement.tagName == "SPAN") {
                var src = AW.object(event.srcElement.id, true);
                if (src && src.setController && src !== this) {
                    return
                }
                var target = this;
                function onfocus(event) {
                    event.srcElement.detachEvent("onfocus", onfocus);
                    target.focus();
                    target = null
                }
                event.srcElement.attachEvent("onfocus", onfocus)
            }
        } catch(err) {}
    });
    focus.setEvent("onbeforedeactivate", 
    function(event) {
        try {
            if (this.getView().element().contains(event.toElement) && event.toElement.tagName == "SPAN") {
                var src = AW.object(event.toElement.id, true);
                if (src && src.setController && src !== this) {
                    return
                }
                event.returnValue = false;
                event.cancelBubble = true
            }
        } catch(err) {}
    });
    focus.setEvent("onselectstart", 
    function(event) {
        if (AW.ie) {
            event.cancelBubble = true
        } else {
            event.stopPropagation()
        }
    });
    focus.setEvent("onbeforecopy", 
    function(event) {
        if (AW.webkit) {
            expandFocus.call(this, false)
        }
    });
    obj.getSelectedText = function() {
        var c,
        r,
        a,
        text = [];
        var cols = this.getSelectedColumns();
        var rows = this.getSelectedRows();
        if (this.getCurrentSelection() == "row") {
            cols = [];
            var count = this.getColumnCount();
            var indices = this.getColumnIndices();
            for (c = 0; c < count; c++) {
                cols[c] = indices ? indices[c] : c
            }
        }
        for (r = 0; r < rows.length; r++) {
            a = [];
            for (c = 0; c < cols.length; c++) {
                a[c] = this.getCellText(cols[c], rows[r])
            }
            text[r] = a.join("\t")
        }
        return text.join("\r\n")
    };
    focus.setEvent("oncut", 
    function(event) {
        var txt = this.getSelectedText();
        if (AW.ie) {
            window.clipboardData.setData("Text", txt);
            event.returnValue = false
        } else {
            var e = this.getContent("box/focus").element();
            e.value = txt;
            e.select()
        }
        this.startCellEdit("")
    });
    focus.setEvent("oncopy", 
    function(event) {
        var txt = this.getSelectedText();
        if (AW.ie) {
            window.clipboardData.setData("Text", txt);
            event.returnValue = false
        } else {
            var e = this.getContent("box/focus").element();
            e.value = txt;
            e.select()
        }
    });
    focus.setEvent("onpaste", 
    function(event) {
        var txt;
        if (AW.ie) {
            txt = window.clipboardData.getData("Text");
            event.returnValue = false
        } else if (AW.webkit) {
            txt = event.clipboardData.getData('text/plain');
            event.preventDefault();
            event.stopPropagation()
        } else {
            return
        }
        this.startCellEdit(txt)
    });
    obj.setEvent("oncontextmenu", 
    function(event) {
        if (AW.webkit) {
            expandFocus.call(this, true)
        }
        if (AW.ffx) {
            expandFocus.call(this, false);
            return ffCopy.call(this)
        }
        this.focus()
    });
    function ffCopy() {
        if (!AW._edit) {
            var e = this.getContent("box/focus").element();
            e.value = this.getSelectedText();
            e.select();
            e.focus()
        }
    }
    if (AW.gecko) {
        obj.setController("copypaste", {
            onKeyCtrlC: AW.ffx ? ffCopy: null,
            onCellMouseUp: function(event) {
                if (event.button == 2) {
                    expandFocus.call(this, true);
                    if (AW.ff3 && !AW._edit) {
                        this.getContent("box/focus").element().select()
                    }
                    this.setTimeout(function() {
                        expandFocus.call(this, false)
                    })
                }
            }
        })
    }
    function expandFocus(on) {
        try {
            var e = this.getContent("box/focus").element();
            e.style.zIndex = on ? 1: 0;
            e.style.width = on ? "100%": "1px";
            e.style.height = on ? "100%": "1px";
            e = null
        } catch(err) {}
    }
    obj.focus = function() {
        try {
            if (this.getControlDisabled()) {
                return
            }
            var e = this.getContent("box/focus").element();
            e.value = " ";
            if (AW.opera) {
                e.focus()
            } else if (AW.webkit) {
                e.select();
                e.focus()
            } else {
                e.select()
            }
            e = null
        } catch(err) {}
    };
    obj.refresh = function() {
        var x = this.getScrollLeft();
        var y = this.getScrollTop();
        this.raiseEvent("onControlRefreshing");
        _super.refresh.call(this);
        this.getScroll().setStyle("visibility", "hidden");
        this.setScrollLeft(x);
        this.setScrollTop(y);
        this.getScroll().setStyle("visibility", "inherit");
        this.raiseEvent("onControlRefreshed")
    };
    obj.addRow = function(row) {
        if (this.raiseEvent("onRowAdding", row)) {
            return
        }
        var i,
        count = this.getRowCount();
        var a = this.getRowIndices();
        if (typeof(row) == "undefined") {
            row = count
        }
        if (this._cellModel && this._cellModel.addRow) {
            this._cellModel.addRow(row)
        }
        if (!a) {
            a = [];
            for (i = 0; i < count; i++) {
                a[i] = i
            }
        }
        a.push(row);
        var refresh = this.refresh;
        this.refresh = function() {};
        this.setRowIndices(a);
        this.setRowCount(count + 1);
        this.setCurrentRow(row);
        this.setSelectedRows([row]);
        this.refresh = refresh;
        this.raiseEvent("onRowAdded", row)
    };
    obj.deleteRow = function(row) {
        if (this.raiseEvent("onRowDeleting", row)) {
            return
        }
        if (this._cellModel && this._cellModel.deleteRow) {
            this._cellModel.deleteRow(row)
        }
        var i,
        count = this.getRowCount();
        var a = this.getRowIndices();
        if (!a) {
            a = [];
            for (i = 0; i < count; i++) {
                a[i] = i
            }
            i = row
        } else {
            i = this.getRowPosition(row)
        }
        a.splice(i, 1);
        var refresh = this.refresh;
        this.refresh = function() {};
        this.setRowIndices(a);
        this.setRowCount(count - 1);
        this.setCurrentRow(i > 0 ? a[i - 1] : -1);
        this.setSelectedRows(i > 0 ? [a[i - 1]] : []);
        this.refresh = refresh;
        this.raiseEvent("onRowDeleted", row)
    };
    obj.sort = function(column, direction) {
        this.raiseEvent("doSort", direction, column)
    };
    var setCellModel = obj.setCellModel;
    obj.setCellModel = function(model) {
        setCellModel.call(this, model);
        function dataToText(i, j) {
            var data = this.getCellData(i, j);
            var format = this.getCellFormat(i, j);
            return format ? format.dataToText(data) : data
        }
        function dataToValue(i, j) {
            var data = this.getCellData(i, j);
            var format = this.getCellFormat(i, j);
            return format ? format.dataToValue(data) : data
        }
        this.setCellText(dataToText);
        this.setCellValue(dataToValue)
    };
    obj.onControlDisabledChanged = function(value) {
        this.setClass("disabled", value ? "control": null);
        this.setAttribute("disabled", value ? true: null)
    };
    obj._scrollSerial = 0
};
AW.UI.Grid = AW.Grid.Control;
AW.Grid.Extended = AW.Grid.Control.subclass();
AW.Grid.Extended.create = function() {
    var obj = this.prototype;
    obj.$extended = true;
    obj.setController("extended", AW.Grid.Controllers.Extended);
    obj.setView(new AW.Panels.Grid);
    obj.defineTemplate("top", new AW.Templates.List);
    obj.defineTemplate("bottom", new AW.Templates.List);
    var splitColumns = function(p, j) {
        var left = this.$owner._fixedLeft,
        right = this.$owner._fixedRight;
        var i = this.$1;
        switch (p) {
        case "count":
            if (i == "left") {
                return left
            }
            if (i == "center") {
                return this.$owner.getColumnProperty("count") - left - right
            }
            if (i == "right") {
                return right
            }
            return 0;
        case "offset":
            if (i == "left") {
                return 0
            }
            if (i == "center") {
                return left
            }
            if (i == "right") {
                return this.$owner.getColumnProperty("count") - right
            }
            return 0;
        default:
            return this.$owner.getColumnProperty(p, j)
        }
    };
    obj.getHeaders().mapModel("view", splitColumns);
    obj.getFooters().mapModel("view", splitColumns);
    obj.getRow().mapModel("view", splitColumns)
};
AW.Tree.Item = AW.Templates.ImageText.subclass();
AW.Tree.Item.create = function() {
    var obj = this.prototype;
    obj.setClass("tree", 
    function() {
        return this.getViewProperty("count") ? "folder": "leaf"
    });
    obj.setClass("expanded", 
    function() {
        return this.getViewProperty("expanded") ? "true": "false"
    });
    var sign = new AW.HTML.SPAN;
    sign.setClass("tree", "sign");
    sign.setEvent("onclick", 
    function() {
        this.raiseEvent("onTreeSignClicked")
    });
    obj.setContent("box/sign", sign)
};
AW.Tree.View = AW.System.Template.subclass();
AW.Tree.View.create = function() {
    var obj = this.prototype;
    obj.setTag("span");
    obj.setClass("tree", "view");
    obj.setContent("start", 
    function() {
        return this.$0 ? this.getItem() : ""
    });
    obj.setContent("items", 
    function() {
        if (this.$0 && !this.getViewProperty("expanded")) {
            return ""
        }
        var i,
        ii,
        a = [];
        var count = this.getViewProperty("count");
        var offset = this.getViewProperty("offset");
        var indices = this.getViewProperty("indices");
        var clone = this.$owner.$clone;
        this.$owner.$clone = false;
        for (i = 0; i < count; i++) {
            ii = indices ? indices[i + offset] : i + offset;
            a[i] = this.getView(ii).toString()
        }
        this.$owner.$clone = clone;
        return a.join("")
    });
    obj.setContent("end", "")
};
AW.Tree.Group = AW.System.Template.subclass();
AW.Tree.Group.create = function() {
    var obj = this.prototype;
    obj.setTag("span");
    obj.setClass("tree", "view");
    obj.setContent("start", 
    function() {
        return this.$0 ? this.getItem() : ""
    });
    obj.setContent("items", 
    function() {
        if (this.$0 && !this.getViewProperty("expanded")) {
            return ""
        } else {
            return this.getView()
        }
    });
    obj.setContent("end", "")
};
AW.Tree.Control = AW.UI.List.subclass();
AW.Tree.Control.create = function() {
    var obj = this.prototype;
    obj.defineTemplate("group", new AW.Tree.Group);
    obj.setItem(new AW.Tree.Item);
    obj.setScroll(function() {
        return this.getGroup(0)
    });
    obj.getView().mapTemplate("item", 
    function(i) {
        return this.$owner.getGroup(i)
    });
    obj.defineViewProperty("expanded", false);
    obj.onTreeSignClicked = function(src, i) {
        if (this.getViewIndices(i)) {
            this.setViewExpanded(!this.getViewExpanded(i), i)
        }
    };
    obj.onViewExpandedChanged = function(e, i) {
        this.getGroup(i).refresh()
    }
};
AW.UI.Tree = AW.Tree.Control;
AW.HTTP.Request = AW.System.Model.subclass();
AW.HTTP.Request.create = function() {
    var obj = this.prototype;
    obj.defineProperty("URL");
    obj.defineProperty("async", true);
    obj.defineProperty("requestMethod", "GET");
    obj.defineProperty("requestData", "");
    obj.defineProperty("responseText", 
    function() {
        return this._http ? this._http.responseText: ""
    });
    obj.defineProperty("responseXML", 
    function() {
        return this._http ? this._http.responseXML: ""
    });
    obj.defineProperty("username", null);
    obj.defineProperty("password", null);
    obj.setNamespace = function(name, value) {
        this._namespaces += " xmlns:" + name + "=\"" + value + "\""
    };
    obj._namespaces = "";
    obj.setParameter = function(name, value) {
        this["_" + name + "Parameter"] = value;
        if ((this._parameters + " ").indexOf(" " + name + " ") < 0) {
            this._parameters += " " + name
        }
    };
    obj._parameters = "";
    obj.setRequestHeader = function(name, value) {
        this["_" + name + "Header"] = value;
        if ((this._headers + " ").indexOf(" " + name + " ") < 0) {
            this._headers += " " + name
        }
    };
    obj._headers = "";
    /** obj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");* */
    obj.getResponseHeader = function(name) {
        return this._http ? this._http.getResponseHeader(name) : ""
    };
    obj.request = function() {
        var self = this;
        this._ready = false;
        var i,
        j,
        name,
        value,
        data = "",
        params = this._parameters.split(" ");
        for (i = 1; i < params.length; i++) {
            name = params[i];
            value = this["_" + name + "Parameter"];
            if (typeof value == "function") {
                value = value()
            }
            if (typeof value == "object" && value.constructor == Array) {
                for (j = 0; j < value.length; j++) {
                    data += encodeURIComponent(name) + "=" + encodeURIComponent(value[j]) + "&"
                }
            } else {
                data += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&"
            }
        }
		if(this._URL.indexOf('?',0) >0){
			this._URL  +="&timestamp="+ new Date().getTime();
		}else{
			this._URL  +="?timestamp="+ new Date().getTime();
		}
        var URL = this._URL;
        if ((this._requestMethod != "POST") && data) {
            URL += data;
            data = null
        }
        this._http = AW.createXMLHttpRequest();
        this._http.open(this._requestMethod, URL, this._async, this._username, this._password);
        var headers = this._headers.split(" ");
        for (i = 1; i < headers.length; i++) {
            name = headers[i];
            value = this["_" + name + "Header"];
            if (typeof value == "function") {
                value = value()
            }
            this._http.setRequestHeader(name, value)
        }
        this._http.send(this._requestData);
        if (this._async) {
            this.setTimeout(wait, 200)
        } else {
            returnResult()
        }
        function wait() {
            if (self._http.readyState == 4) {
                self._ready = true;
                returnResult()
            } else {
                self.setTimeout(wait, 200)
            }
        }
        function returnResult() {
            var xml = self._http.responseXML;
            if (xml && xml.firstChild && xml.hasChildNodes() && !(xml.lastChild && xml.lastChild.nodeName == "parsererror") && !(xml.firstChild && xml.firstChild.nodeName == "parsererror") && !(xml.firstChild && xml.firstChild.firstChild && xml.firstChild.firstChild.firstChild && xml.firstChild.firstChild.firstChild.nodeName == "parsererror")) {
                self.response(xml);
                xml = null;
                return
            }
            xml = null;
            self.response(self._http.responseText)
        }
    };
    obj.response = function(result) {
        if (this.$owner) {
            this.$owner.refresh()
        }
    };
    obj.isReady = function() {
        return this._ready
    }
};
AW.CSV.Table = AW.HTTP.Request.subclass();
AW.CSV.Table.create = function() {
    var obj = this.prototype;
    obj.response = function(text) {
        this._rows = text.split(/\r*\n/);
        if (!this._rows[this._rows.length - 1]) {
            this._rows.pop()
        }
        this._data = [];
        if (this.$owner) {
            this.$owner.clearScrollModel();
            this.$owner.clearSelectedModel();
            this.$owner.clearSortModel();
            this.$owner.clearRowModel();
            this.$owner.setRowCount(this.getCount());
            this.$owner.refresh()
        }
    };
    obj._rows = [];
    obj._data = [];
    obj.getCount = function() {
        return this._rows.length
    };
    obj.getData = function(c, r) {
        if (!this._data[r]) {
            if (!this._rows[r]) {
                return ""
            }
            this._data[r] = this._rows[r].replace(x1, s1).replace(x2, s2).split(s3)
        }
        return this._data[r][c] || ""
    };
    var x1 = /(([^,\t\"]*)|\"(([^\"]|\"\")*)\")(,|\t|$)/g;
    var x2 = /\"\"/g;
    var s1 = "$2$3\x01";
    var s2 = "\"";
    var s3 = "\x01"
};
AW.XML.Table = AW.HTTP.Request.subclass();
AW.XML.Table.create = function() {
    var obj = this.prototype;
    obj.response = function(xml) {
        this.setXML(xml);
        if (this.$owner) {
            this.$owner.clearScrollModel();
            this.$owner.clearSelectedModel();
            this.$owner.clearSortModel();
            this.$owner.clearRowModel();
            this.$owner.setRowCount(this.getCount());
            this.$owner.refresh()
        }
    };
    obj.defineProperty("XML");
    obj.setXML = function(xml) {
        if (!xml.nodeType) {
            var s = "" + xml;
            xml = new ActiveXObject("MSXML2.DOMDocument");
            xml.loadXML(s)
        }
        xml.setProperty("SelectionLanguage", "XPath");
        if (this._namespaces) {
            xml.setProperty("SelectionNamespaces", this._namespaces)
        }
        this._xml = xml;
        this._data = this._xml.selectSingleNode(this._dataPath);
        this._items = this._data ? this._data.selectNodes(this._itemPath) : null;
        this._ready = true
    };
    if (!AW.ie) {
        obj.setXML = function(xml) {
            if (!xml.nodeType) {
                var parser = new DOMParser;
                xml = parser.parseFromString("" + xml, "text/xml")
            } else if (xml.nodeName == "XML" && xml.ownerDocument == document) {
                var node = document.evaluate("*", xml, null, 9, null).singleNodeValue;
                xml = document.implementation.createDocument("", "", null);
                xml.appendChild(node)
            }
            namespaces = {};
            var a = this._namespaces.split(" xmlns:");
            for (var i = 1; i < a.length; i++) {
                var s = a[i].split("=");
                namespaces[s[0]] = s[1].replace(/\"/g, "")
            }
            this._ns = {
                lookupNamespaceURI: function(prefix) {
                    return namespaces[prefix]
                }
            };
            this._xml = xml;
            this._data = xml.evaluate(this._dataPath, this._xml, this._ns, 9, null).singleNodeValue;
            this._items = this._data ? xml.evaluate(this._itemPath, this._data, this._ns, 7, null) : null;
            this._ready = true
        }
    }
    obj.getXML = function() {
        return this._xml
    };
    obj._dataPath = "*";
    obj._itemPath = "*";
    obj._valuePath = "*";
    obj._valuesPath = [];
    obj._formats = [];
    obj.setColumns = function(array) {
        this._valuesPath = array
    };
    obj.setRows = function(xpath) {
        this._itemPath = xpath
    };
    obj.setTable = function(xpath) {
        this._dataPath = xpath
    };
    obj.getCount = function() {
        if (!this._items) {
            return 0
        }
        return AW.ie ? this._items.length: this._items.snapshotLength
    };
    obj.getData = function(i, j) {
        var node = this.getNode(i, j);
        return node ? (AW.ie ? node.text: node.textContent) : ""
    };
    obj.getNode = function(j, i) {
        if (!this._items || !this._items[i]) {
            return null
        }
        if (this._valuesPath[j]) {
            return this._items[i].selectSingleNode(this._valuesPath[j])
        } else {
            return this._items[i].selectNodes(this._valuePath)[j]
        }
    };
    obj.getXMLNode = function(path,node) {
        if(!node){
        	if (!this._xml) {
            	return null;
        	}else{
        		node=this._xml
        	}
        }
        return node.selectSingleNode(path);
    };
    obj.getXMLText = function(path,node) {
    	if(!node){
    		node=this._xml;
    	}
        var node = this.getXMLNode(path,node);
        return node ? node.text : "";
    };
    obj.getCellSum = function(j) {
        var sum = 0;
        for (var i = 0; i < this.getCount(); i++) {
            sum += Number(this.getData(j, i));
        }
        return sum;
    };
    obj.getErrCode = function() {
        return this.getXMLText("xdoc/xerr/code");
    };
    obj.getErrNote = function() {
        var notes = this.getXMLText("xdoc/xerr/note");
        var note = "";
        var x = notes.split(":");
        if (x.length > 1 && x[0].indexOf("Exception") > -1) {
            for (var i = 1; i < x.length; i++) {
                note += x[i];
            }
        } else {
            note = notes;
        }
        return note;
    };
    obj.transformNode = function(path) {
        var xslDoc = new ActiveXObject('MSXML2.DOMDocument');
        xslDoc.async = false;
        xslDoc.load(path);
        return this._xml.transformNode(xslDoc);
    };
    obj.getXMLNodes = function(xpath) {
    	if (!this._xml) {
            return null;
        }
		return this._xml.selectNodes(xpath);
    };
    obj.getXMLContent = function(xml){
	    if(xml==null){
	    	return this._xml.xml;
	    }
    	return xml.xml;
    };
    obj.getNodeText = function(node){
    	return node?node.text:"";
    };
    if (!AW.ie) {
        obj.getNode = function(c, r) {
            if (!this._items) {
                return null
            }
            var row = this._items.snapshotItem(r);
            if (!row) {
                return null
            }
            if (this._valuesPath[c]) {
                return row.ownerDocument.evaluate(this._valuesPath[c], row, this._ns, 9, null).singleNodeValue
            } else {
                return row.ownerDocument.evaluate(this._valuePath, row, this._ns, 7, null).snapshotItem(c)
            }
        };
        obj.getXMLNode = function(xpath,node) {
        	if(!node){
            	if (!this._xml) {
                	return null;
            	}else{
            		node=this._xml
            	}
            }
            var xPathResult = this._xml.evaluate(
					xpath,
					node,
					this._xml.createNSResolver(node.documentElement),
					9, null);
			if (xPathResult && xPathResult.singleNodeValue)
				return xPathResult.singleNodeValue;
			else
				return null;
        };
        obj.getXMLText = function(xpath,node) {
        	if(!node) node=this._xml
        	var v = this.getXMLNode(xpath,node);
            return v==null?"":v.textContent;
        };
        obj.getErrCode = function() {
            return this.getXMLText("xdoc/xerr/code");
        };
        obj.getErrNote = function() {
        	return this.getXMLText("xdoc/xerr/note");
        };
        obj.transformNode = function(path) {
            var xslDoc = document.implementation.createDocument("", "", null);
            xslDoc.async = false;
            xslDoc.load(path);
            var xslProc = new XSLTProcessor();
            xslProc.importStylesheet(xslDoc);
            var result = xslProc.transformToFragment(this._xml, document);
            var xmls = new XMLSerializer();
            return xmls.serializeToString(result);
        };
        obj.getXMLNodes = function(xpath) {
			var aNodeArray = new Array();
			var xPathResult = this._xml.evaluate(
							xpath,
							this._xml,
							this._xml.createNSResolver(this._xml.documentElement),
							XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
			
			if (xPathResult) {
				var oNode = xPathResult.iterateNext();
				while (oNode) {
					aNodeArray.push(oNode);
					oNode = xPathResult.iterateNext();
				}
			}
			return aNodeArray;
        };
        obj.getXMLContent = function(xml){
		    if(xml==null){
		    	return (new XMLSerializer()).serializeToString(this._xml);
		    }
    		return (new XMLSerializer()).serializeToString(xml);
    	};
    	obj.getNodeText = function(node){
	    	return node?node.textContent:"";
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
function setLoading(_display, _text) {
	var e = $("loading");
	var m = $("overlay");
	if (e == null) {
		e = document.createElement("div");
		e.id = "loading";
		e.className = "loading";
		document.body.appendChild(e);
		m = document.createElement("div");
		m.id = "overlay";
		document.body.appendChild(m);
	}
	m.style.display = _display ? "block" : "none";
	e.style.display = _display ? "block" : "none";
	e.innerHTML = (_text == null) ? "Loading ......" : _text;
	e.style.left = (window.screen.width) * 0.4;
	e.style.top = (window.screen.height) * 0.4;
	m.style.height = document.body.clientHeight;
	m.style.width = document.body.clientWidth;
	m.innerHTML = "<iframe src=\"\" id=\"ddd\" width=\"100%\" height=\"100%\" scrolling=no align=\"middle\" border=\"0\" frameborder=\"0\"></iframe>";
}