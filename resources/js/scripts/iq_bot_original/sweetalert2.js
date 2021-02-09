! function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Sweetalert2 = t()
}(this, function() {
    "use strict";

    function V(e) {
        return (V = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        })(e)
    }

    function a(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    }

    function r(e, t) {
        for (var n = 0; n < t.length; n++) {
            var o = t[n];
            o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, o.key, o)
        }
    }

    function s() {
        return (s = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
            }
            return e
        }).apply(this, arguments)
    }

    function c(e) {
        return (c = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
            return e.__proto__ || Object.getPrototypeOf(e)
        })(e)
    }

    function u(e, t) {
        return (u = Object.setPrototypeOf || function(e, t) {
            return e.__proto__ = t, e
        })(e, t)
    }

    function o(e, t, n) {
        return (o = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
            if (Reflect.construct.sham) return !1;
            if ("function" == typeof Proxy) return !0;
            try {
                return Date.prototype.toString.call(Reflect.construct(Date, [], function() {})), !0
            } catch (e) {
                return !1
            }
        }() ? Reflect.construct : function(e, t, n) {
            var o = [null];
            o.push.apply(o, t);
            var i = new(Function.bind.apply(e, o));
            return n && u(i, n.prototype), i
        }).apply(null, arguments)
    }

    function l(e, t) {
        return !t || "object" != typeof t && "function" != typeof t ? function(e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e
        }(e) : t
    }

    function d(e, t, n) {
        return (d = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function(e, t, n) {
            var o = function(e, t) {
                for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = c(e)););
                return e
            }(e, t);
            if (o) {
                var i = Object.getOwnPropertyDescriptor(o, t);
                return i.get ? i.get.call(n) : i.value
            }
        })(e, t, n || e)
    }
    var t = "SweetAlert2:",
        p = function(e) {
            return Array.prototype.slice.call(e)
        },
        q = function(e) {
            console.warn("".concat(t, " ").concat(e))
        },
        H = function(e) {
            console.error("".concat(t, " ").concat(e))
        },
        i = [],
        j = function(e) {
            return "function" == typeof e ? e() : e
        },
        R = function(e) {
            return e && Promise.resolve(e) === e
        },
        e = Object.freeze({
            cancel: "cancel",
            backdrop: "backdrop",
            close: "close",
            esc: "esc",
            timer: "timer"
        }),
        n = function(e) {
            var t = {};
            for (var n in e) t[e[n]] = "swal2-" + e[n];
            return t
        },
        I = n(["container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "toast", "toast-shown", "toast-column", "fade", "show", "hide", "noanimation", "close", "title", "header", "content", "actions", "confirm", "cancel", "footer", "icon", "icon-text", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "validation-message", "progresssteps", "activeprogressstep", "progresscircle", "progressline", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl"]),
        f = n(["success", "warning", "info", "question", "error"]),
        m = {
            previousBodyPadding: null
        },
        g = function(e, t) {
            return e.classList.contains(t)
        },
        N = function(e) {
            if (e.focus(), "file" !== e.type) {
                var t = e.value;
                e.value = "", e.value = t
            }
        },
        h = function(e, t, n) {
            e && t && ("string" == typeof t && (t = t.split(/\s+/).filter(Boolean)), t.forEach(function(t) {
                e.forEach ? e.forEach(function(e) {
                    n ? e.classList.add(t) : e.classList.remove(t)
                }) : n ? e.classList.add(t) : e.classList.remove(t)
            }))
        },
        D = function(e, t) {
            h(e, t, !0)
        },
        U = function(e, t) {
            h(e, t, !1)
        },
        _ = function(e, t) {
            for (var n = 0; n < e.childNodes.length; n++)
                if (g(e.childNodes[n], t)) return e.childNodes[n]
        },
        z = function(e) {
            e.style.opacity = "", e.style.display = e.id === I.content ? "block" : "flex"
        },
        W = function(e) {
            e.style.opacity = "", e.style.display = "none"
        },
        K = function(e) {
            return e && (e.offsetWidth || e.offsetHeight || e.getClientRects().length)
        },
        v = function() {
            return document.body.querySelector("." + I.container)
        },
        b = function(e) {
            var t = v();
            return t ? t.querySelector("." + e) : null
        },
        y = function() {
            return b(I.popup)
        },
        w = function() {
            var e = y();
            return p(e.querySelectorAll("." + I.icon))
        },
        C = function() {
            return b(I.title)
        },
        k = function() {
            return b(I.content)
        },
        B = function() {
            return b(I.image)
        },
        x = function() {
            return b(I.progresssteps)
        },
        A = function() {
            return b(I["validation-message"])
        },
        S = function() {
            return b(I.confirm)
        },
        P = function() {
            return b(I.cancel)
        },
        L = function() {
            return b(I.actions)
        },
        F = function() {
            return b(I.footer)
        },
        Z = function() {
            return b(I.close)
        },
        Q = function() {
            var e = p(y().querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')).sort(function(e, t) {
                    return e = parseInt(e.getAttribute("tabindex")), (t = parseInt(t.getAttribute("tabindex"))) < e ? 1 : e < t ? -1 : 0
                }),
                t = p(y().querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable], audio[controls], video[controls]')).filter(function(e) {
                    return "-1" !== e.getAttribute("tabindex")
                });
            return function(e) {
                for (var t = [], n = 0; n < e.length; n++) - 1 === t.indexOf(e[n]) && t.push(e[n]);
                return t
            }(e.concat(t)).filter(function(e) {
                return K(e)
            })
        },
        E = function() {
            return !T() && !document.body.classList.contains(I["no-backdrop"])
        },
        T = function() {
            return document.body.classList.contains(I["toast-shown"])
        },
        O = function() {
            return "undefined" == typeof window || "undefined" == typeof document
        },
        M = '\n <div aria-labelledby="'.concat(I.title, '" aria-describedby="').concat(I.content, '" class="').concat(I.popup, '" tabindex="-1">\n   <div class="').concat(I.header, '">\n     <ul class="').concat(I.progresssteps, '"></ul>\n     <div class="').concat(I.icon, " ").concat(f.error, '">\n       <span class="swal2-x-mark"><span class="swal2-x-mark-line-left"></span><span class="swal2-x-mark-line-right"></span></span>\n     </div>\n     <div class="').concat(I.icon, " ").concat(f.question, '">\n       <span class="').concat(I["icon-text"], '">?</span>\n      </div>\n     <div class="').concat(I.icon, " ").concat(f.warning, '">\n       <span class="').concat(I["icon-text"], '">!</span>\n      </div>\n     <div class="').concat(I.icon, " ").concat(f.info, '">\n       <span class="').concat(I["icon-text"], '">i</span>\n      </div>\n     <div class="').concat(I.icon, " ").concat(f.success, '">\n       <div class="swal2-success-circular-line-left"></div>\n       <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>\n       <div class="swal2-success-ring"></div> <div class="swal2-success-fix"></div>\n       <div class="swal2-success-circular-line-right"></div>\n     </div>\n     <img class="').concat(I.image, '" />\n     <h2 class="').concat(I.title, '" id="').concat(I.title, '"></h2>\n     <button type="button" class="').concat(I.close, '"><i class="fas fa-times" aria-hidden="true"></i></button>\n   </div>\n   <div class="').concat(I.content, '">\n     <div id="').concat(I.content, '"></div>\n     <input class="').concat(I.input, '" />\n     <input type="file" class="').concat(I.file, '" />\n     <div class="').concat(I.range, '">\n       <input type="range" />\n       <output></output>\n     </div>\n     <select class="').concat(I.select, '"></select>\n     <div class="').concat(I.radio, '"></div>\n     <label for="').concat(I.checkbox, '" class="').concat(I.checkbox, '">\n       <input type="checkbox" />\n       <span class="').concat(I.label, '"></span>\n     </label>\n     <textarea class="').concat(I.textarea, '"></textarea>\n     <div class="').concat(I["validation-message"], '" id="').concat(I["validation-message"], '"></div>\n   </div>\n   <div class="').concat(I.actions, '">\n     <button type="button" class="').concat(I.confirm, '">OK</button>\n     <button type="button" class="').concat(I.cancel, '">Cancel</button>\n   </div>\n   <div class="').concat(I.footer, '">\n   </div>\n </div>\n').replace(/(^|\n)\s*/g, ""),
        Y = function(e) {
            var t = v();
            if (t && (t.parentNode.removeChild(t), U([document.documentElement, document.body], [I["no-backdrop"], I["toast-shown"], I["has-column"]])), !O()) {
                var n = document.createElement("div");
                n.className = I.container, n.innerHTML = M;
                var o = "string" == typeof e.target ? document.querySelector(e.target) : e.target;
                o.appendChild(n);
                var i, r = y(),
                    a = k(),
                    s = _(a, I.input),
                    c = _(a, I.file),
                    u = a.querySelector(".".concat(I.range, " input")),
                    l = a.querySelector(".".concat(I.range, " output")),
                    d = _(a, I.select),
                    p = a.querySelector(".".concat(I.checkbox, " input")),
                    f = _(a, I.textarea);
                r.setAttribute("role", e.toast ? "alert" : "dialog"), r.setAttribute("aria-live", e.toast ? "polite" : "assertive"), e.toast || r.setAttribute("aria-modal", "true"), "rtl" === window.getComputedStyle(o).direction && D(v(), I.rtl);
                var m = function(e) {
                    Pe.isVisible() && i !== e.target.value && Pe.resetValidationMessage(), i = e.target.value
                };
                return s.oninput = m, c.onchange = m, d.onchange = m, p.onchange = m, f.oninput = m, u.oninput = function(e) {
                    m(e), l.value = u.value
                }, u.onchange = function(e) {
                    m(e), u.nextSibling.value = u.value
                }, r
            }
            H("SweetAlert2 requires document to initialize")
        },
        $ = function(e, t) {
            if (!e) return W(t);
            if (e instanceof HTMLElement) t.appendChild(e);
            else if ("object" === V(e))
                if (t.innerHTML = "", 0 in e)
                    for (var n = 0; n in e; n++) t.appendChild(e[n].cloneNode(!0));
                else t.appendChild(e.cloneNode(!0));
            else e && (t.innerHTML = e);
            z(t)
        },
        J = function() {
            if (O()) return !1;
            var e = document.createElement("div"),
                t = {
                    WebkitAnimation: "webkitAnimationEnd",
                    OAnimation: "oAnimationEnd oanimationend",
                    animation: "animationend"
                };
            for (var n in t)
                if (t.hasOwnProperty(n) && void 0 !== e.style[n]) return t[n];
            return !1
        }(),
        X = function(e) {
            var t = L(),
                n = S(),
                o = P();
            if (e.showConfirmButton || e.showCancelButton ? z(t) : W(t), e.showCancelButton ? o.style.display = "inline-block" : W(o), e.showConfirmButton ? n.style.removeProperty("display") : W(n), n.innerHTML = e.confirmButtonText, o.innerHTML = e.cancelButtonText, n.setAttribute("aria-label", e.confirmButtonAriaLabel), o.setAttribute("aria-label", e.cancelButtonAriaLabel), n.className = I.confirm, D(n, e.confirmButtonClass), o.className = I.cancel, D(o, e.cancelButtonClass), e.buttonsStyling) {
                D([n, o], I.styled), e.confirmButtonColor && (n.style.backgroundColor = e.confirmButtonColor), e.cancelButtonColor && (o.style.backgroundColor = e.cancelButtonColor);
                var i = window.getComputedStyle(n).getPropertyValue("background-color");
                n.style.borderLeftColor = i, n.style.borderRightColor = i
            } else U([n, o], I.styled), n.style.backgroundColor = n.style.borderLeftColor = n.style.borderRightColor = "", o.style.backgroundColor = o.style.borderLeftColor = o.style.borderRightColor = ""
        },
        G = function(e) {
            var t = k().querySelector("#" + I.content);
            e.html ? $(e.html, t) : e.text ? (t.textContent = e.text, z(t)) : W(t)
        },
        ee = function(e) {
            for (var t = w(), n = 0; n < t.length; n++) W(t[n]);
            if (e.type)
                if (-1 !== Object.keys(f).indexOf(e.type)) {
                    var o = Pe.getPopup().querySelector(".".concat(I.icon, ".").concat(f[e.type]));
                    z(o), e.animation && D(o, "swal2-animate-".concat(e.type, "-icon"))
                } else H('Unknown type! Expected "success", "error", "warning", "info" or "question", got "'.concat(e.type, '"'))
        },
        te = function(e) {
            var t = B();
            e.imageUrl ? (t.setAttribute("src", e.imageUrl), t.setAttribute("alt", e.imageAlt), z(t), e.imageWidth ? t.setAttribute("width", e.imageWidth) : t.removeAttribute("width"), e.imageHeight ? t.setAttribute("height", e.imageHeight) : t.removeAttribute("height"), t.className = I.image, e.imageClass && D(t, e.imageClass)) : W(t)
        },
        ne = function(i) {
            var r = x(),
                a = parseInt(null === i.currentProgressStep ? Pe.getQueueStep() : i.currentProgressStep, 10);
            i.progressSteps && i.progressSteps.length ? (z(r), r.innerHTML = "", a >= i.progressSteps.length && q("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)"), i.progressSteps.forEach(function(e, t) {
                var n = document.createElement("li");
                if (D(n, I.progresscircle), n.innerHTML = e, t === a && D(n, I.activeprogressstep), r.appendChild(n), t !== i.progressSteps.length - 1) {
                    var o = document.createElement("li");
                    D(o, I.progressline), i.progressStepsDistance && (o.style.width = i.progressStepsDistance), r.appendChild(o)
                }
            })) : W(r)
        },
        oe = function(e) {
            var t = C();
            e.titleText ? t.innerText = e.titleText : e.title && ("string" == typeof e.title && (e.title = e.title.split("\n").join("<br />")), $(e.title, t))
        };
    var ie = [],
        re = function() {
            var e = y();
            e || Pe(""), e = y();
            var t = L(),
                n = S(),
                o = P();
            z(t), z(n), D([e, t], I.loading), n.disabled = !0, o.disabled = !0, e.setAttribute("data-loading", !0), e.setAttribute("aria-busy", !0), e.focus()
        },
        ae = {},
        se = {
            title: "",
            titleText: "",
            text: "",
            html: "",
            footer: "",
            type: null,
            toast: !1,
            customClass: "",
            customContainerClass: "",
            target: "body",
            backdrop: !0,
            animation: !0,
            heightAuto: !0,
            allowOutsideClick: !0,
            allowEscapeKey: !0,
            allowEnterKey: !0,
            stopKeydownPropagation: !0,
            keydownListenerCapture: !1,
            showConfirmButton: !0,
            showCancelButton: !1,
            preConfirm: null,
            confirmButtonText: "OK",
            confirmButtonAriaLabel: "",
            confirmButtonColor: null,
            confirmButtonClass: "",
            cancelButtonText: "Cancel",
            cancelButtonAriaLabel: "",
            cancelButtonColor: null,
            cancelButtonClass: "",
            buttonsStyling: !0,
            reverseButtons: !1,
            focusConfirm: !0,
            focusCancel: !1,
            showCloseButton: !1,
            closeButtonAriaLabel: "Close this dialog",
            showLoaderOnConfirm: !1,
            imageUrl: null,
            imageWidth: null,
            imageHeight: null,
            imageAlt: "",
            imageClass: "",
            timer: null,
            width: null,
            padding: null,
            background: null,
            input: null,
            inputPlaceholder: "",
            inputValue: "",
            inputOptions: {},
            inputAutoTrim: !0,
            inputClass: "",
            inputAttributes: {},
            inputValidator: null,
            validationMessage: null,
            grow: !1,
            position: "center",
            progressSteps: [],
            currentProgressStep: null,
            progressStepsDistance: null,
            onBeforeOpen: null,
            onAfterClose: null,
            onOpen: null,
            onClose: null
        },
        ce = [],
        ue = ["allowOutsideClick", "allowEnterKey", "backdrop", "focusConfirm", "focusCancel", "heightAuto", "keydownListenerCapture"],
        le = function(e) {
            return se.hasOwnProperty(e)
        },
        de = function(e) {
            return -1 !== ce.indexOf(e)
        },
        pe = Object.freeze({
            isValidParameter: le,
            isUpdatableParameter: function(e) {
                return -1 !== ["title", "titleText", "text", "html", "type", "showConfirmButton", "showCancelButton", "confirmButtonText", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonClass", "cancelButtonText", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonClass", "buttonsStyling", "reverseButtons", "imageUrl", "imageWidth", "imageHeigth", "imageAlt", "imageClass", "progressSteps", "currentProgressStep"].indexOf(e)
            },
            isDeprecatedParameter: de,
            argsToParams: function(n) {
                var o = {};
                switch (V(n[0])) {
                    case "object":
                        s(o, n[0]);
                        break;
                    default:
                        ["title", "html", "type"].forEach(function(e, t) {
                            switch (V(n[t])) {
                                case "string":
                                    o[e] = n[t];
                                    break;
                                case "undefined":
                                    break;
                                default:
                                    H("Unexpected type of ".concat(e, '! Expected "string", got ').concat(V(n[t])))
                            }
                        })
                }
                return o
            },
            isVisible: function() {
                return !!y()
            },
            clickConfirm: function() {
                return S().click()
            },
            clickCancel: function() {
                return P().click()
            },
            getContainer: v,
            getPopup: y,
            getTitle: C,
            getContent: k,
            getImage: B,
            getIcons: w,
            getCloseButton: Z,
            getActions: L,
            getConfirmButton: S,
            getCancelButton: P,
            getFooter: F,
            getFocusableElements: Q,
            getValidationMessage: A,
            isLoading: function() {
                return y().hasAttribute("data-loading")
            },
            fire: function() {
                for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
                return o(this, t)
            },
            mixin: function(i) {
                return function(e) {
                    function t() {
                        return a(this, t), l(this, c(t).apply(this, arguments))
                    }
                    var n, o;
                    return function(e, t) {
                        if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                        e.prototype = Object.create(t && t.prototype, {
                            constructor: {
                                value: e,
                                writable: !0,
                                configurable: !0
                            }
                        }), t && u(e, t)
                    }(t, e), r((n = t).prototype, [{
                        key: "_main",
                        value: function(e) {
                            return d(c(t.prototype), "_main", this).call(this, s({}, i, e))
                        }
                    }]), o && r(n, o), t
                }(this)
            },
            queue: function(e) {
                var r = this;
                ie = e;
                var a = function() {
                        ie = [], document.body.removeAttribute("data-swal2-queue-step")
                    },
                    s = [];
                return new Promise(function(i) {
                    ! function t(n, o) {
                        n < ie.length ? (document.body.setAttribute("data-swal2-queue-step", n), r.fire(ie[n]).then(function(e) {
                            void 0 !== e.value ? (s.push(e.value), t(n + 1, o)) : (a(), i({
                                dismiss: e.dismiss
                            }))
                        })) : (a(), i({
                            value: s
                        }))
                    }(0)
                })
            },
            getQueueStep: function() {
                return document.body.getAttribute("data-swal2-queue-step")
            },
            insertQueueStep: function(e, t) {
                return t && t < ie.length ? ie.splice(t, 0, e) : ie.push(e)
            },
            deleteQueueStep: function(e) {
                void 0 !== ie[e] && ie.splice(e, 1)
            },
            showLoading: re,
            enableLoading: re,
            getTimerLeft: function() {
                return ae.timeout && ae.timeout.getTimerLeft()
            },
            stopTimer: function() {
                return ae.timeout && ae.timeout.stop()
            },
            resumeTimer: function() {
                return ae.timeout && ae.timeout.start()
            },
            toggleTimer: function() {
                var e = ae.timeout;
                return e && (e.running ? e.stop() : e.start())
            },
            increaseTimer: function(e) {
                return ae.timeout && ae.timeout.increase(e)
            },
            isTimerRunning: function() {
                return ae.timeout && ae.timeout.isRunning()
            }
        }),
        fe = {
            promise: new WeakMap,
            innerParams: new WeakMap,
            domCache: new WeakMap
        };

    function me() {
        var e = fe.innerParams.get(this),
            t = fe.domCache.get(this);
        e.showConfirmButton || (W(t.confirmButton), e.showCancelButton || W(t.actions)), U([t.popup, t.actions], I.loading), t.popup.removeAttribute("aria-busy"), t.popup.removeAttribute("data-loading"), t.confirmButton.disabled = !1, t.cancelButton.disabled = !1
    }
    var ge = function() {
            null === m.previousBodyPadding && document.body.scrollHeight > window.innerHeight && (m.previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right")), document.body.style.paddingRight = m.previousBodyPadding + function() {
                if ("ontouchstart" in window || navigator.msMaxTouchPoints) return 0;
                var e = document.createElement("div");
                e.style.width = "50px", e.style.height = "50px", e.style.overflow = "scroll", document.body.appendChild(e);
                var t = e.offsetWidth - e.clientWidth;
                return document.body.removeChild(e), t
            }() + "px")
        },
        he = function() {
            return !!window.MSInputMethodContext && !!document.documentMode
        },
        ve = function() {
            var e = v(),
                t = y();
            e.style.removeProperty("align-items"), t.offsetTop < 0 && (e.style.alignItems = "flex-start")
        },
        be = {
            swalPromiseResolve: new WeakMap
        };

    function ye(e) {
        var t = v(),
            n = y(),
            o = fe.innerParams.get(this),
            i = be.swalPromiseResolve.get(this),
            r = o.onClose,
            a = o.onAfterClose;
        if (n) {
            null !== r && "function" == typeof r && r(n), U(n, I.show), D(n, I.hide);
            var s = function() {
                T() ? we(a) : (new Promise(function(e) {
                    var t = window.scrollX,
                        n = window.scrollY;
                    ae.restoreFocusTimeout = setTimeout(function() {
                        ae.previousActiveElement && ae.previousActiveElement.focus ? (ae.previousActiveElement.focus(), ae.previousActiveElement = null) : document.body && document.body.focus(), e()
                    }, 100), void 0 !== t && void 0 !== n && window.scrollTo(t, n)
                }).then(function() {
                    return we(a)
                }), ae.keydownTarget.removeEventListener("keydown", ae.keydownHandler, {
                    capture: ae.keydownListenerCapture
                }), ae.keydownHandlerAdded = !1), t.parentNode && t.parentNode.removeChild(t), U([document.documentElement, document.body], [I.shown, I["height-auto"], I["no-backdrop"], I["toast-shown"], I["toast-column"]]), E() && (null !== m.previousBodyPadding && (document.body.style.paddingRight = m.previousBodyPadding, m.previousBodyPadding = null), function() {
                    if (g(document.body, I.iosfix)) {
                        var e = parseInt(document.body.style.top, 10);
                        U(document.body, I.iosfix), document.body.style.top = "", document.body.scrollTop = -1 * e
                    }
                }(), "undefined" != typeof window && he() && window.removeEventListener("resize", ve), p(document.body.children).forEach(function(e) {
                    e.hasAttribute("data-previous-aria-hidden") ? (e.setAttribute("aria-hidden", e.getAttribute("data-previous-aria-hidden")), e.removeAttribute("data-previous-aria-hidden")) : e.removeAttribute("aria-hidden")
                }))
            };
            J && !g(n, I.noanimation) ? n.addEventListener(J, function e() {
                n.removeEventListener(J, e), g(n, I.hide) && s()
            }) : s(), i(e || {})
        }
    }
    var we = function(e) {
        null !== e && "function" == typeof e && setTimeout(function() {
            e()
        })
    };
    var Ce = function e(t, n) {
            a(this, e);
            var o, i, r = n;
            this.running = !1, this.start = function() {
                return this.running || (this.running = !0, i = new Date, o = setTimeout(t, r)), r
            }, this.stop = function() {
                return this.running && (this.running = !1, clearTimeout(o), r -= new Date - i), r
            }, this.increase = function(e) {
                var t = this.running;
                return t && this.stop(), r += e, t && this.start(), r
            }, this.getTimerLeft = function() {
                return this.running && (this.stop(), this.start()), r
            }, this.isRunning = function() {
                return this.running
            }, this.start()
        },
        ke = {
            email: function(e, t) {
                return /^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]{2,24}$/.test(e) ? Promise.resolve() : Promise.resolve(t || "Invalid email address")
            },
            url: function(e, t) {
                return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$/.test(e) ? Promise.resolve() : Promise.resolve(t || "Invalid URL")
            }
        };
    var Be = function(e) {
        var t = v(),
            n = y();
        null !== e.onBeforeOpen && "function" == typeof e.onBeforeOpen && e.onBeforeOpen(n), e.animation ? (D(n, I.show), D(t, I.fade), U(n, I.hide)) : U(n, I.fade), z(n), t.style.overflowY = "hidden", J && !g(n, I.noanimation) ? n.addEventListener(J, function e() {
            n.removeEventListener(J, e), t.style.overflowY = "auto"
        }) : t.style.overflowY = "auto", D([document.documentElement, document.body, t], I.shown), e.heightAuto && e.backdrop && !e.toast && D([document.documentElement, document.body], I["height-auto"]), E() && (ge(), function() {
            if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && !g(document.body, I.iosfix)) {
                var e = document.body.scrollTop;
                document.body.style.top = -1 * e + "px", D(document.body, I.iosfix)
            }
        }(), "undefined" != typeof window && he() && (ve(), window.addEventListener("resize", ve)), p(document.body.children).forEach(function(e) {
            e === v() || function(e, t) {
                if ("function" == typeof e.contains) return e.contains(t)
            }(e, v()) || (e.hasAttribute("aria-hidden") && e.setAttribute("data-previous-aria-hidden", e.getAttribute("aria-hidden")), e.setAttribute("aria-hidden", "true"))
        }), setTimeout(function() {
            t.scrollTop = 0
        })), T() || ae.previousActiveElement || (ae.previousActiveElement = document.activeElement), null !== e.onOpen && "function" == typeof e.onOpen && setTimeout(function() {
            e.onOpen(n)
        })
    };
    var xe, Ae = Object.freeze({
        hideLoading: me,
        disableLoading: me,
        getInput: function(e) {
            var t = fe.innerParams.get(this),
                n = fe.domCache.get(this);
            if (!(e = e || t.input)) return null;
            switch (e) {
                case "select":
                case "textarea":
                case "file":
                    return _(n.content, I[e]);
                case "checkbox":
                    return n.popup.querySelector(".".concat(I.checkbox, " input"));
                case "radio":
                    return n.popup.querySelector(".".concat(I.radio, " input:checked")) || n.popup.querySelector(".".concat(I.radio, " input:first-child"));
                case "range":
                    return n.popup.querySelector(".".concat(I.range, " input"));
                default:
                    return _(n.content, I.input)
            }
        },
        close: ye,
        closePopup: ye,
        closeModal: ye,
        closeToast: ye,
        enableButtons: function() {
            var e = fe.domCache.get(this);
            e.confirmButton.disabled = !1, e.cancelButton.disabled = !1
        },
        disableButtons: function() {
            var e = fe.domCache.get(this);
            e.confirmButton.disabled = !0, e.cancelButton.disabled = !0
        },
        enableConfirmButton: function() {
            fe.domCache.get(this).confirmButton.disabled = !1
        },
        disableConfirmButton: function() {
            fe.domCache.get(this).confirmButton.disabled = !0
        },
        enableInput: function() {
            var e = this.getInput();
            if (!e) return !1;
            if ("radio" === e.type)
                for (var t = e.parentNode.parentNode.querySelectorAll("input"), n = 0; n < t.length; n++) t[n].disabled = !1;
            else e.disabled = !1
        },
        disableInput: function() {
            var e = this.getInput();
            if (!e) return !1;
            if (e && "radio" === e.type)
                for (var t = e.parentNode.parentNode.querySelectorAll("input"), n = 0; n < t.length; n++) t[n].disabled = !0;
            else e.disabled = !0
        },
        showValidationMessage: function(e) {
            var t = fe.domCache.get(this);
            t.validationMessage.innerHTML = e;
            var n = window.getComputedStyle(t.popup);
            t.validationMessage.style.marginLeft = "-".concat(n.getPropertyValue("padding-left")), t.validationMessage.style.marginRight = "-".concat(n.getPropertyValue("padding-right")), z(t.validationMessage);
            var o = this.getInput();
            o && (o.setAttribute("aria-invalid", !0), o.setAttribute("aria-describedBy", I["validation-message"]), N(o), D(o, I.inputerror))
        },
        resetValidationMessage: function() {
            var e = fe.domCache.get(this);
            e.validationMessage && W(e.validationMessage);
            var t = this.getInput();
            t && (t.removeAttribute("aria-invalid"), t.removeAttribute("aria-describedBy"), U(t, I.inputerror))
        },
        getProgressSteps: function() {
            return fe.innerParams.get(this).progressSteps
        },
        setProgressSteps: function(e) {
            var t = s({}, fe.innerParams.get(this), {
                progressSteps: e
            });
            fe.innerParams.set(this, t), ne(t)
        },
        showProgressSteps: function() {
            var e = fe.domCache.get(this);
            z(e.progressSteps)
        },
        hideProgressSteps: function() {
            var e = fe.domCache.get(this);
            W(e.progressSteps)
        },
        _main: function(e) {
            var E = this;
            ! function(e) {
                for (var t in e) le(t) || q('Unknown parameter "'.concat(t, '"')), e.toast && -1 !== ue.indexOf(t) && q('The parameter "'.concat(t, '" is incompatible with toasts')), de(t) && (n = 'The parameter "'.concat(t, '" is deprecated and will be removed in the next major release.'), -1 === i.indexOf(n) && (i.push(n), q(n)));
                var n
            }(e);
            var T = s({}, se, e);
            ! function(t) {
                var e;
                t.inputValidator || Object.keys(ke).forEach(function(e) {
                    t.input === e && (t.inputValidator = ke[e])
                }), (!t.target || "string" == typeof t.target && !document.querySelector(t.target) || "string" != typeof t.target && !t.target.appendChild) && (q('Target parameter is not valid, defaulting to "body"'), t.target = "body"), "function" == typeof t.animation && (t.animation = t.animation.call());
                var n = y(),
                    o = "string" == typeof t.target ? document.querySelector(t.target) : t.target;
                e = n && o && n.parentNode !== o.parentNode ? Y(t) : n || Y(t), t.width && (e.style.width = "number" == typeof t.width ? t.width + "px" : t.width), t.padding && (e.style.padding = "number" == typeof t.padding ? t.padding + "px" : t.padding), t.background && (e.style.background = t.background);
                for (var i = window.getComputedStyle(e).getPropertyValue("background-color"), r = e.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix"), a = 0; a < r.length; a++) r[a].style.backgroundColor = i;
                var s = v(),
                    c = Z(),
                    u = F();
                if (oe(t), G(t), "string" == typeof t.backdrop ? v().style.background = t.backdrop : t.backdrop || D([document.documentElement, document.body], I["no-backdrop"]), !t.backdrop && t.allowOutsideClick && q('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`'), t.position in I ? D(s, I[t.position]) : (q('The "position" parameter is not valid, defaulting to "center"'), D(s, I.center)), t.grow && "string" == typeof t.grow) {
                    var l = "grow-" + t.grow;
                    l in I && D(s, I[l])
                }
                t.showCloseButton ? (c.setAttribute("aria-label", t.closeButtonAriaLabel), z(c)) : W(c), e.className = I.popup, t.toast ? (D([document.documentElement, document.body], I["toast-shown"]), D(e, I.toast)) : D(e, I.modal), t.customClass && D(e, t.customClass), t.customContainerClass && D(s, t.customContainerClass), ne(t), ee(t), te(t), X(t), $(t.footer, u), !0 === t.animation ? U(e, I.noanimation) : D(e, I.noanimation), t.showLoaderOnConfirm && !t.preConfirm && q("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request")
            }(T), Object.freeze(T), fe.innerParams.set(this, T), ae.timeout && (ae.timeout.stop(), delete ae.timeout), clearTimeout(ae.restoreFocusTimeout);
            var O = {
                popup: y(),
                container: v(),
                content: k(),
                actions: L(),
                confirmButton: S(),
                cancelButton: P(),
                closeButton: Z(),
                validationMessage: A(),
                progressSteps: x()
            };
            fe.domCache.set(this, O);
            var M = this.constructor;
            return new Promise(function(e) {
                var n = function(e) {
                        E.closePopup({
                            value: e
                        })
                    },
                    s = function(e) {
                        E.closePopup({
                            dismiss: e
                        })
                    };
                be.swalPromiseResolve.set(E, e), T.timer && (ae.timeout = new Ce(function() {
                    s("timer"), delete ae.timeout
                }, T.timer)), T.input && setTimeout(function() {
                    var e = E.getInput();
                    e && N(e)
                }, 0);
                for (var c = function(t) {
                        T.showLoaderOnConfirm && M.showLoading(), T.preConfirm ? (E.resetValidationMessage(), Promise.resolve().then(function() {
                            return T.preConfirm(t, T.validationMessage)
                        }).then(function(e) {
                            K(O.validasha256tionMessage) || !1 === e ? E.hideLoading() : n(e || t)
                        })) : n(t)
                    }, t = function(e) {
                        var t = e.target,
                            n = O.confirmButton,
                            o = O.cancelButton,
                            i = n && (n === t || n.contains(t)),
                            r = o && (o === t || o.contains(t));
                        switch (e.type) {
                            case "click":
                                if (i && M.isVisible())
                                    if (E.disableButtons(), T.input) {
                                        var a = function() {
                                            var e = E.getInput();
                                            if (!e) return null;
                                            switch (T.input) {
                                                case "checkbox":
                                                    return e.checked ? 1 : 0;
                                                case "radio":
                                                    return e.checked ? e.value : null;
                                                case "file":
                                                    return e.files.length ? e.files[0] : null;
                                                default:
                                                    return T.inputAutoTrim ? e.value.trim() : e.value
                                            }
                                        }();
                                        T.inputValidator ? (E.disableInput(), Promise.resolve().then(function() {
                                            return T.inputValidator(a, T.validationMessage)
                                        }).then(function(e) {
                                            E.enableButtons(), E.enableInput(), e ? E.showValidationMessage(e) : c(a)
                                        })) : E.getInput().checkValidity() ? c(a) : (E.enableButtons(), E.showValidationMessage(T.validationMessage))
                                    } else c(!0);
                                else r && M.isVisible() && (E.disableButtons(), s(M.DismissReason.cancel))
                        }
                    }, o = O.popup.querySelectorAll("button"), i = 0; i < o.length; i++) o[i].onclick = t, o[i].onmouseover = t, o[i].onmouseout = t, o[i].onmousedown = t;
                if (O.closeButton.onclick = function() {
                        s(M.DismissReason.close)
                    }, T.toast) O.popup.onclick = function() {
                    T.showConfirmButton || T.showCancelButton || T.showCloseButton || T.input || s(M.DismissReason.close)
                };
                else {
                    var r = !1;
                    O.popup.onmousedown = function() {
                        O.container.onmouseup = function(e) {
                            O.container.onmouseup = void 0, e.target === O.container && (r = !0)
                        }
                    }, O.container.onmousedown = function() {
                        O.popup.onmouseup = function(e) {
                            O.popup.onmouseup = void 0, (e.target === O.popup || O.popup.contains(e.target)) && (r = !0)
                        }
                    }, O.container.onclick = function(e) {
                        r ? r = !1 : e.target === O.container && j(T.allowOutsideClick) && s(M.DismissReason.backdrop)
                    }
                }
                T.reverseButtons ? O.confirmButton.parentNode.insertBefore(O.cancelButton, O.confirmButton) : O.confirmButton.parentNode.insertBefore(O.confirmButton, O.cancelButton);
                var a = function(e, t) {
                    for (var n = Q(T.focusCancel), o = 0; o < n.length; o++) return (e += t) === n.length ? e = 0 : -1 === e && (e = n.length - 1), n[e].focus();
                    O.popup.focus()
                };
                ae.keydownHandlerAdded && (ae.keydownTarget.removeEventListener("keydown", ae.keydownHandler, {
                    capture: ae.keydownListenerCapture
                }), ae.keydownHandlerAdded = !1), T.toast || (ae.keydownHandler = function(e) {
                    return function(e, t) {
                        if (t.stopKeydownPropagation && e.stopPropagation(), "Enter" !== e.key || e.isComposing)
                            if ("Tab" === e.key) {
                                for (var n = e.target, o = Q(t.focusCancel), i = -1, r = 0; r < o.length; r++)
                                    if (n === o[r]) {
                                        i = r;
                                        break
                                    }
                                e.shiftKey ? a(i, -1) : a(i, 1), e.stopPropagation(), e.preventDefault()
                            } else -1 !== ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Left", "Right", "Up", "Down"].indexOf(e.key) ? document.activeElement === O.confirmButton && K(O.cancelButton) ? O.cancelButton.focus() : document.activeElement === O.cancelButton && K(O.confirmButton) && O.confirmButton.focus() : "Escape" !== e.key && "Esc" !== e.key || !0 !== j(t.allowEscapeKey) || (e.preventDefault(), s(M.DismissReason.esc));
                        else if (e.target && E.getInput() && e.target.outerHTML === E.getInput().outerHTML) {
                            if (-1 !== ["textarea", "file"].indexOf(t.input)) return;
                            M.clickConfirm(), e.preventDefault()
                        }
                    }(e, T)
                }, ae.keydownTarget = T.keydownListenerCapture ? window : O.popup, ae.keydownListenerCapture = T.keydownListenerCapture, ae.keydownTarget.addEventListener("keydown", ae.keydownHandler, {
                    capture: ae.keydownListenerCapture
                }), ae.keydownHandlerAdded = !0), E.enableButtons(), E.hideLoading(), E.resetValidationMessage(), T.toast && (T.input || T.footer || T.showCloseButton) ? D(document.body, I["toast-column"]) : U(document.body, I["toast-column"]);
                for (var u, l, d = ["input", "file", "range", "select", "radio", "checkbox", "textarea"], p = function(e) {
                        e.placeholder && !T.inputPlaceholder || (e.placeholder = T.inputPlaceholder)
                    }, f = 0; f < d.length; f++) {
                    var m = I[d[f]],
                        g = _(O.content, m);
                    if (u = E.getInput(d[f])) {
                        for (var h in u.attributes)
                            if (u.attributes.hasOwnProperty(h)) {
                                var v = u.attributes[h].name;
                                "type" !== v && "value" !== v && u.removeAttribute(v)
                            }
                        for (var b in T.inputAttributes) "range" === d[f] && "placeholder" === b || u.setAttribute(b, T.inputAttributes[b])
                    }
                    g.className = m, T.inputClass && D(g, T.inputClass), W(g)
                }
                switch (T.input) {
                    case "text":
                    case "email":
                    case "password":
                    case "number":
                    case "tel":
                    case "url":
                        u = _(O.content, I.input), "string" == typeof T.inputValue || "number" == typeof T.inputValue ? u.value = T.inputValue : R(T.inputValue) || q('Unexpected type of inputValue! Expected "string", "number" or "Promise", got "'.concat(V(T.inputValue), '"')), p(u), u.type = T.input, z(u);
                        break;
                    case "file":
                        p(u = _(O.content, I.file)), u.type = T.input, z(u);
                        break;
                    case "range":
                        var y = _(O.content, I.range),
                            w = y.querySelector("input"),
                            C = y.querySelector("output");
                        w.value = T.inputValue, w.type = T.input, C.value = T.inputValue, z(y);
                        break;
                    case "select":
                        var k = _(O.content, I.select);
                        if (k.innerHTML = "", T.inputPlaceholder) {
                            var B = document.createElement("option");
                            B.innerHTML = T.inputPlaceholder, B.value = "", B.disabled = !0, B.selected = !0, k.appendChild(B)
                        }
                        l = function(e) {
                            e.forEach(function(e) {
                                var t = e[0],
                                    n = e[1],
                                    o = document.createElement("option");
                                o.value = t, o.innerHTML = n, T.inputValue.toString() === t.toString() && (o.selected = !0), k.appendChild(o)
                            }), z(k), k.focus()
                        };
                        break;
                    case "radio":
                        var x = _(O.content, I.radio);
                        x.innerHTML = "", l = function(e) {
                            e.forEach(function(e) {
                                var t = e[0],
                                    n = e[1],
                                    o = document.createElement("input"),
                                    i = document.createElement("label");
                                o.type = "radio", o.name = I.radio, o.value = t, T.inputValue.toString() === t.toString() && (o.checked = !0);
                                var r = document.createElement("span");
                                r.innerHTML = n, r.className = I.label, i.appendChild(o), i.appendChild(r), x.appendChild(i)
                            }), z(x);
                            var t = x.querySelectorAll("input");
                            t.length && t[0].focus()
                        };
                        break;
                    case "checkbox":
                        var A = _(O.content, I.checkbox),
                            S = E.getInput("checkbox");
                        S.type = "checkbox", S.value = 1, S.id = I.checkbox, S.checked = Boolean(T.inputValue), A.querySelector("span").innerHTML = T.inputPlaceholder, z(A);
                        break;
                    case "textarea":
                        var P = _(O.content, I.textarea);
                        P.value = T.inputValue, p(P), z(P);
                        break;
                    case null:
                        break;
                    default:
                        H('Unexpected type of input! Expected "text", "email", "password", "number", "tel", "select", "radio", "checkbox", "textarea", "file" or "url", got "'.concat(T.input, '"'))
                }
                if ("select" === T.input || "radio" === T.input) {
                    var L = function(e) {
                        return l((t = e, n = [], "undefined" != typeof Map && t instanceof Map ? t.forEach(function(e, t) {
                            n.push([t, e])
                        }) : Object.keys(t).forEach(function(e) {
                            n.push([e, t[e]])
                        }), n));
                        var t, n
                    };
                    R(T.inputOptions) ? (M.showLoading(), T.inputOptions.then(function(e) {
                        E.hideLoading(), L(e)
                    })) : "object" === V(T.inputOptions) ? L(T.inputOptions) : H("Unexpected type of inputOptions! Expected object, Map or Promise, got ".concat(V(T.inputOptions)))
                } else -1 !== ["text", "email", "number", "tel", "textarea"].indexOf(T.input) && R(T.inputValue) && (M.showLoading(), W(u), T.inputValue.then(function(e) {
                    u.value = "number" === T.input ? parseFloat(e) || 0 : e + "", z(u), u.focus(), E.hideLoading()
                }).catch(function(e) {
                    H("Error in inputValue promise: " + e), u.value = "", z(u), u.focus(), E.hideLoading()
                }));
                Be(T), T.toast || (j(T.allowEnterKey) ? T.focusCancel && K(O.cancelButton) ? O.cancelButton.focus() : T.focusConfirm && K(O.confirmButton) ? O.confirmButton.focus() : a(-1, 1) : document.activeElement && "function" == typeof document.activeElement.blur && document.activeElement.blur()), O.container.scrollTop = 0
            })
        },
        update: function(t) {
            var n = {};
            Object.keys(t).forEach(function(e) {
                Pe.isUpdatableParameter(e) ? n[e] = t[e] : q('Invalid parameter to update: "'.concat(e, '". Updatable params are listed here: TODO (@limonte) add link'))
            });
            var e = s({}, fe.innerParams.get(this), n);
            X(e), G(e), ee(e), te(e), ne(e), oe(e), fe.innerParams.set(this, e)
        }
    });

    function Se() {
        if ("undefined" != typeof window) {
            "undefined" == typeof Promise && H("This package requires a Promise library, please include a shim to enable it in this browser (See: https://github.com/sweetalert2/sweetalert2/wiki/Migration-from-SweetAlert-to-SweetAlert2#1-ie-support)"), xe = this;
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            var o = Object.freeze(this.constructor.argsToParams(t));
            Object.defineProperties(this, {
                params: {
                    value: o,
                    writable: !1,
                    enumerable: !0
                }
            });
            var i = this._main(this.params);
            fe.promise.set(this, i)
        }
    }
    Se.prototype.then = function(e) {
        return fe.promise.get(this).then(e)
    }, Se.prototype.finally = function(e) {
        return fe.promise.get(this).finally(e)
    }, s(Se.prototype, Ae), s(Se, pe), Object.keys(Ae).forEach(function(t) {
        Se[t] = function() {
            var e;
            if (xe) return (e = xe)[t].apply(e, arguments)
        }
    }), Se.DismissReason = e;
    var Pe = Se;
    return Pe.default = Pe
}), "undefined" != typeof window && window.Sweetalert2 && (window.Sweetalert2.version = "8.0.1", window.swal = window.sweetAlert = window.Swal = window.SweetAlert = window.Sweetalert2);