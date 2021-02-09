var app = function() {
    "use strict";
    var e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function t(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e
    }

    function n(e, t) {
        return e(t = {
            exports: {}
        }, t.exports), t.exports
    }
    var r, i, o, a = "object",
        s = function(e) {
            return e && e.Math == Math && e
        },
        c = s(typeof globalThis == a && globalThis) || s(typeof window == a && window) || s(typeof self == a && self) || s(typeof e == a && e) || Function("return this")(),
        u = function(e) {
            try {
                return !!e()
            } catch (e) {
                return !0
            }
        },
        l = !u(function() {
            return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7
                }
            }).a
        }),
        d = {}.propertyIsEnumerable,
        h = Object.getOwnPropertyDescriptor,
        p = {
            f: h && !d.call({
                1: 2
            }, 1) ? function(e) {
                var t = h(this, e);
                return !!t && t.enumerable
            } : d
        },
        g = function(e, t) {
            return {
                enumerable: !(1 & e),
                configurable: !(2 & e),
                writable: !(4 & e),
                value: t
            }
        },
        v = {}.toString,
        m = function(e) {
            return v.call(e).slice(8, -1)
        },
        y = "".split,
        b = u(function() {
            return !Object("z").propertyIsEnumerable(0)
        }) ? function(e) {
            return "String" == m(e) ? y.call(e, "") : Object(e)
        } : Object,
        w = function(e) {
            if (null == e) throw TypeError("Can't call method on " + e);
            return e
        },
        x = function(e) {
            return b(w(e))
        },
        T = function(e) {
            return "object" == typeof e ? null !== e : "function" == typeof e
        },
        S = function(e, t) {
            if (!T(e)) return e;
            var n, r;
            if (t && "function" == typeof(n = e.toString) && !T(r = n.call(e))) return r;
            if ("function" == typeof(n = e.valueOf) && !T(r = n.call(e))) return r;
            if (!t && "function" == typeof(n = e.toString) && !T(r = n.call(e))) return r;
            throw TypeError("Can't convert object to primitive value")
        },
        E = {}.hasOwnProperty,
        A = function(e, t) {
            return E.call(e, t)
        },
        C = c.document,
        k = T(C) && T(C.createElement),
        L = function(e) {
            return k ? C.createElement(e) : {}
        },
        _ = !l && !u(function() {
            return 7 != Object.defineProperty(L("div"), "a", {
                get: function() {
                    return 7
                }
            }).a
        }),
        O = Object.getOwnPropertyDescriptor,
        D = {
            f: l ? O : function(e, t) {
                if (e = x(e), t = S(t, !0), _) try {
                    return O(e, t)
                } catch (e) {}
                if (A(e, t)) return g(!p.f.call(e, t), e[t])
            }
        },
        P = function(e) {
            if (!T(e)) throw TypeError(String(e) + " is not an object");
            return e
        },
        R = Object.defineProperty,
        I = {
            f: l ? R : function(e, t, n) {
                if (P(e), t = S(t, !0), P(n), _) try {
                    return R(e, t, n)
                } catch (e) {}
                if ("get" in n || "set" in n) throw TypeError("Accessors not supported");
                return "value" in n && (e[t] = n.value), e
            }
        },
        M = l ? function(e, t, n) {
            return I.f(e, t, g(1, n))
        } : function(e, t, n) {
            return e[t] = n, e
        },
        N = function(e, t) {
            try {
                M(c, e, t)
            } catch (n) {
                c[e] = t
            }
            return t
        },
        B = n(function(e) {
            var t = c["__core-js_shared__"] || N("__core-js_shared__", {});
            (e.exports = function(e, n) {
                return t[e] || (t[e] = void 0 !== n ? n : {})
            })("versions", []).push({
                version: "3.2.1",
                mode: "global",
                copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
            })
        }),
        j = B("native-function-to-string", Function.toString),
        F = c.WeakMap,
        U = "function" == typeof F && /native code/.test(j.call(F)),
        H = 0,
        G = Math.random(),
        W = function(e) {
            return "Symbol(" + String(void 0 === e ? "" : e) + ")_" + (++H + G).toString(36)
        },
        z = B("keys"),
        q = function(e) {
            return z[e] || (z[e] = W(e))
        },
        V = {},
        $ = c.WeakMap;
    if (U) {
        var K = new $,
            X = K.get,
            Y = K.has,
            J = K.set;
        r = function(e, t) {
            return J.call(K, e, t), t
        }, i = function(e) {
            return X.call(K, e) || {}
        }, o = function(e) {
            return Y.call(K, e)
        }
    } else {
        var Z = q("state");
        V[Z] = !0, r = function(e, t) {
            return M(e, Z, t), t
        }, i = function(e) {
            return A(e, Z) ? e[Z] : {}
        }, o = function(e) {
            return A(e, Z)
        }
    }
    var Q = {
            set: r,
            get: i,
            has: o,
            enforce: function(e) {
                return o(e) ? i(e) : r(e, {})
            },
            getterFor: function(e) {
                return function(t) {
                    var n;
                    if (!T(t) || (n = i(t)).type !== e) throw TypeError("Incompatible receiver, " + e + " required");
                    return n
                }
            }
        },
        ee = n(function(e) {
            var t = Q.get,
                n = Q.enforce,
                r = String(j).split("toString");
            B("inspectSource", function(e) {
                return j.call(e)
            }), (e.exports = function(e, t, i, o) {
                var a = !!o && !!o.unsafe,
                    s = !!o && !!o.enumerable,
                    u = !!o && !!o.noTargetGet;
                "function" == typeof i && ("string" != typeof t || A(i, "name") || M(i, "name", t), n(i).source = r.join("string" == typeof t ? t : "")), e !== c ? (a ? !u && e[t] && (s = !0) : delete e[t], s ? e[t] = i : M(e, t, i)) : s ? e[t] = i : N(t, i)
            })(Function.prototype, "toString", function() {
                return "function" == typeof this && t(this).source || j.call(this)
            })
        }),
        te = c,
        ne = function(e) {
            return "function" == typeof e ? e : void 0
        },
        re = function(e, t) {
            return arguments.length < 2 ? ne(te[e]) || ne(c[e]) : te[e] && te[e][t] || c[e] && c[e][t]
        },
        ie = Math.ceil,
        oe = Math.floor,
        ae = function(e) {
            return isNaN(e = +e) ? 0 : (e > 0 ? oe : ie)(e)
        },
        se = Math.min,
        ce = function(e) {
            return e > 0 ? se(ae(e), 9007199254740991) : 0
        },
        ue = Math.max,
        le = Math.min,
        fe = function(e, t) {
            var n = ae(e);
            return n < 0 ? ue(n + t, 0) : le(n, t)
        },
        de = function(e) {
            return function(t, n, r) {
                var i, o = x(t),
                    a = ce(o.length),
                    s = fe(r, a);
                if (e && n != n) {
                    for (; a > s;)
                        if ((i = o[s++]) != i) return !0
                } else
                    for (; a > s; s++)
                        if ((e || s in o) && o[s] === n) return e || s || 0; return !e && -1
            }
        },
        he = {
            includes: de(!0),
            indexOf: de(!1)
        },
        pe = he.indexOf,
        ge = function(e, t) {
            var n, r = x(e),
                i = 0,
                o = [];
            for (n in r) !A(V, n) && A(r, n) && o.push(n);
            for (; t.length > i;) A(r, n = t[i++]) && (~pe(o, n) || o.push(n));
            return o
        },
        ve = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
        me = ve.concat("length", "prototype"),
        ye = {
            f: Object.getOwnPropertyNames || function(e) {
                return ge(e, me)
            }
        },
        be = {
            f: Object.getOwnPropertySymbols
        },
        we = re("Reflect", "ownKeys") || function(e) {
            var t = ye.f(P(e)),
                n = be.f;
            return n ? t.concat(n(e)) : t
        },
        xe = function(e, t) {
            for (var n = we(t), r = I.f, i = D.f, o = 0; o < n.length; o++) {
                var a = n[o];
                A(e, a) || r(e, a, i(t, a))
            }
        },
        Te = /#|\.prototype\./,
        Se = function(e, t) {
            var n = Ae[Ee(e)];
            return n == ke || n != Ce && ("function" == typeof t ? u(t) : !!t)
        },
        Ee = Se.normalize = function(e) {
            return String(e).replace(Te, ".").toLowerCase()
        },
        Ae = Se.data = {},
        Ce = Se.NATIVE = "N",
        ke = Se.POLYFILL = "P",
        Le = Se,
        _e = D.f,
        Oe = function(e, t) {
            var n, r, i, o, a, s = e.target,
                u = e.global,
                l = e.stat;
            if (n = u ? c : l ? c[s] || N(s, {}) : (c[s] || {}).prototype)
                for (r in t) {
                    if (o = t[r], i = e.noTargetGet ? (a = _e(n, r)) && a.value : n[r], !Le(u ? r : s + (l ? "." : "#") + r, e.forced) && void 0 !== i) {
                        if (typeof o == typeof i) continue;
                        xe(o, i)
                    }(e.sham || i && i.sham) && M(o, "sham", !0), ee(n, r, o, e)
                }
        },
        De = function(e) {
            if ("function" != typeof e) throw TypeError(String(e) + " is not a function");
            return e
        },
        Pe = function(e, t, n) {
            if (De(e), void 0 === t) return e;
            switch (n) {
                case 0:
                    return function() {
                        return e.call(t)
                    };
                case 1:
                    return function(n) {
                        return e.call(t, n)
                    };
                case 2:
                    return function(n, r) {
                        return e.call(t, n, r)
                    };
                case 3:
                    return function(n, r, i) {
                        return e.call(t, n, r, i)
                    }
            }
            return function() {
                return e.apply(t, arguments)
            }
        },
        Re = function(e) {
            return Object(w(e))
        },
        Ie = Array.isArray || function(e) {
            return "Array" == m(e)
        },
        Me = !!Object.getOwnPropertySymbols && !u(function() {
            return !String(Symbol())
        }),
        Ne = c.Symbol,
        Be = B("wks"),
        je = function(e) {
            return Be[e] || (Be[e] = Me && Ne[e] || (Me ? Ne : W)("Symbol." + e))
        },
        Fe = je("species"),
        Ue = function(e, t) {
            var n;
            return Ie(e) && ("function" != typeof(n = e.constructor) || n !== Array && !Ie(n.prototype) ? T(n) && null === (n = n[Fe]) && (n = void 0) : n = void 0), new(void 0 === n ? Array : n)(0 === t ? 0 : t)
        },
        He = [].push,
        Ge = function(e) {
            var t = 1 == e,
                n = 2 == e,
                r = 3 == e,
                i = 4 == e,
                o = 6 == e,
                a = 5 == e || o;
            return function(s, c, u, l) {
                for (var f, d, h = Re(s), p = b(h), g = Pe(c, u, 3), v = ce(p.length), m = 0, y = l || Ue, w = t ? y(s, v) : n ? y(s, 0) : void 0; v > m; m++)
                    if ((a || m in p) && (d = g(f = p[m], m, h), e))
                        if (t) w[m] = d;
                        else if (d) switch (e) {
                    case 3:
                        return !0;
                    case 5:
                        return f;
                    case 6:
                        return m;
                    case 2:
                        He.call(w, f)
                } else if (i) return !1;
                return o ? -1 : r || i ? i : w
            }
        },
        We = {
            forEach: Ge(0),
            map: Ge(1),
            filter: Ge(2),
            some: Ge(3),
            every: Ge(4),
            find: Ge(5),
            findIndex: Ge(6)
        },
        ze = function(e, t) {
            var n = [][e];
            return !n || !u(function() {
                n.call(null, t || function() {
                    throw 1
                }, 1)
            })
        },
        qe = We.forEach,
        Ve = ze("forEach") ? function(e) {
            return qe(this, e, arguments.length > 1 ? arguments[1] : void 0)
        } : [].forEach;
    Oe({
        target: "Array",
        proto: !0,
        forced: [].forEach != Ve
    }, {
        forEach: Ve
    });
    var $e = he.indexOf,
        Ke = [].indexOf,
        Xe = !!Ke && 1 / [1].indexOf(1, -0) < 0,
        Ye = ze("indexOf");
    Oe({
        target: "Array",
        proto: !0,
        forced: Xe || Ye
    }, {
        indexOf: function(e) {
            return Xe ? Ke.apply(this, arguments) || 0 : $e(this, e, arguments.length > 1 ? arguments[1] : void 0)
        }
    });
    var Je = Date.prototype,
        Ze = Je.toString,
        Qe = Je.getTime;
    new Date(NaN) + "" != "Invalid Date" && ee(Je, "toString", function() {
        var e = Qe.call(this);
        return e == e ? Ze.call(this) : "Invalid Date"
    });
    var et = je("toStringTag"),
        tt = "Arguments" == m(function() {
            return arguments
        }()),
        nt = function(e) {
            var t, n, r;
            return void 0 === e ? "Undefined" : null === e ? "Null" : "string" == typeof(n = function(e, t) {
                try {
                    return e[t]
                } catch (e) {}
            }(t = Object(e), et)) ? n : tt ? m(t) : "Object" == (r = m(t)) && "function" == typeof t.callee ? "Arguments" : r
        },
        rt = {};
    rt[je("toStringTag")] = "z";
    var it = "[object z]" !== String(rt) ? function() {
            return "[object " + nt(this) + "]"
        } : rt.toString,
        ot = Object.prototype;
    it !== ot.toString && ee(ot, "toString", it, {
        unsafe: !0
    });
    var at = c.Promise,
        st = function(e, t, n) {
            for (var r in t) ee(e, r, t[r], n);
            return e
        },
        ct = I.f,
        ut = je("toStringTag"),
        lt = function(e, t, n) {
            e && !A(e = n ? e : e.prototype, ut) && ct(e, ut, {
                configurable: !0,
                value: t
            })
        },
        ft = je("species"),
        dt = function(e) {
            var t = re(e),
                n = I.f;
            l && t && !t[ft] && n(t, ft, {
                configurable: !0,
                get: function() {
                    return this
                }
            })
        },
        ht = function(e, t, n) {
            if (!(e instanceof t)) throw TypeError("Incorrect " + (n ? n + " " : "") + "invocation");
            return e
        },
        pt = {},
        gt = je("iterator"),
        vt = Array.prototype,
        mt = function(e) {
            return void 0 !== e && (pt.Array === e || vt[gt] === e)
        },
        yt = je("iterator"),
        bt = function(e) {
            if (null != e) return e[yt] || e["@@iterator"] || pt[nt(e)]
        },
        wt = function(e, t, n, r) {
            try {
                return r ? t(P(n)[0], n[1]) : t(n)
            } catch (t) {
                var i = e.return;
                throw void 0 !== i && P(i.call(e)), t
            }
        },
        xt = n(function(e) {
            var t = function(e, t) {
                this.stopped = e, this.result = t
            };
            (e.exports = function(e, n, r, i, o) {
                var a, s, c, u, l, f, d = Pe(n, r, i ? 2 : 1);
                if (o) a = e;
                else {
                    if ("function" != typeof(s = bt(e))) throw TypeError("Target is not iterable");
                    if (mt(s)) {
                        for (c = 0, u = ce(e.length); u > c; c++)
                            if ((l = i ? d(P(f = e[c])[0], f[1]) : d(e[c])) && l instanceof t) return l;
                        return new t(!1)
                    }
                    a = s.call(e)
                }
                for (; !(f = a.next()).done;)
                    if ((l = wt(a, d, f.value, i)) && l instanceof t) return l;
                return new t(!1)
            }).stop = function(e) {
                return new t(!0, e)
            }
        }),
        Tt = je("iterator"),
        St = !1;
    try {
        var Et = 0,
            At = {
                next: function() {
                    return {
                        done: !!Et++
                    }
                },
                return: function() {
                    St = !0
                }
            };
        At[Tt] = function() {
            return this
        }, Array.from(At, function() {
            throw 2
        })
    } catch (e) {}
    var Ct, kt, Lt, _t = function(e, t) {
            if (!t && !St) return !1;
            var n = !1;
            try {
                var r = {};
                r[Tt] = function() {
                    return {
                        next: function() {
                            return {
                                done: n = !0
                            }
                        }
                    }
                }, e(r)
            } catch (e) {}
            return n
        },
        Ot = je("species"),
        Dt = function(e, t) {
            var n, r = P(e).constructor;
            return void 0 === r || null == (n = P(r)[Ot]) ? t : De(n)
        },
        Pt = re("document", "documentElement"),
        Rt = c.location,
        It = c.setImmediate,
        Mt = c.clearImmediate,
        Nt = c.process,
        Bt = c.MessageChannel,
        jt = c.Dispatch,
        Ft = 0,
        Ut = {},
        Ht = function(e) {
            if (Ut.hasOwnProperty(e)) {
                var t = Ut[e];
                delete Ut[e], t()
            }
        },
        Gt = function(e) {
            return function() {
                Ht(e)
            }
        },
        Wt = function(e) {
            Ht(e.data)
        },
        zt = function(e) {
            c.postMessage(e + "", Rt.protocol + "//" + Rt.host)
        };
    It && Mt || (It = function(e) {
        for (var t = arguments, n = [], r = 1; arguments.length > r;) n.push(t[r++]);
        return Ut[++Ft] = function() {
            ("function" == typeof e ? e : Function(e)).apply(void 0, n)
        }, Ct(Ft), Ft
    }, Mt = function(e) {
        delete Ut[e]
    }, "process" == m(Nt) ? Ct = function(e) {
        Nt.nextTick(Gt(e))
    } : jt && jt.now ? Ct = function(e) {
        jt.now(Gt(e))
    } : Bt ? (Lt = (kt = new Bt).port2, kt.port1.onmessage = Wt, Ct = Pe(Lt.postMessage, Lt, 1)) : !c.addEventListener || "function" != typeof postMessage || c.importScripts || u(zt) ? Ct = "onreadystatechange" in L("script") ? function(e) {
        Pt.appendChild(L("script")).onreadystatechange = function() {
            Pt.removeChild(this), Ht(e)
        }
    } : function(e) {
        setTimeout(Gt(e), 0)
    } : (Ct = zt, c.addEventListener("message", Wt, !1)));
    var qt, Vt, $t, Kt, Xt, Yt, Jt, Zt, Qt = {
            set: It,
            clear: Mt
        },
        en = re("navigator", "userAgent") || "",
        tn = D.f,
        nn = Qt.set,
        rn = c.MutationObserver || c.WebKitMutationObserver,
        on = c.process,
        an = c.Promise,
        sn = "process" == m(on),
        cn = tn(c, "queueMicrotask"),
        un = cn && cn.value;
    un || (qt = function() {
        var e, t;
        for (sn && (e = on.domain) && e.exit(); Vt;) {
            t = Vt.fn, Vt = Vt.next;
            try {
                t()
            } catch (e) {
                throw Vt ? Kt() : $t = void 0, e
            }
        }
        $t = void 0, e && e.enter()
    }, sn ? Kt = function() {
        on.nextTick(qt)
    } : rn && !/(iphone|ipod|ipad).*applewebkit/i.test(en) ? (Xt = !0, Yt = document.createTextNode(""), new rn(qt).observe(Yt, {
        characterData: !0
    }), Kt = function() {
        Yt.data = Xt = !Xt
    }) : an && an.resolve ? (Jt = an.resolve(void 0), Zt = Jt.then, Kt = function() {
        Zt.call(Jt, qt)
    }) : Kt = function() {
        nn.call(c, qt)
    });
    var ln, fn, dn, hn, pn = un || function(e) {
            var t = {
                fn: e,
                next: void 0
            };
            $t && ($t.next = t), Vt || (Vt = t, Kt()), $t = t
        },
        gn = function(e) {
            var t, n;
            this.promise = new e(function(e, r) {
                if (void 0 !== t || void 0 !== n) throw TypeError("Bad Promise constructor");
                t = e, n = r
            }), this.resolve = De(t), this.reject = De(n)
        },
        vn = {
            f: function(e) {
                return new gn(e)
            }
        },
        mn = function(e, t) {
            if (P(e), T(t) && t.constructor === e) return t;
            var n = vn.f(e);
            return (0, n.resolve)(t), n.promise
        },
        yn = function(e) {
            try {
                return {
                    error: !1,
                    value: e()
                }
            } catch (e) {
                return {
                    error: !0,
                    value: e
                }
            }
        },
        bn = Qt.set,
        wn = je("species"),
        xn = "Promise",
        Tn = Q.get,
        Sn = Q.set,
        En = Q.getterFor(xn),
        An = at,
        Cn = c.TypeError,
        kn = c.document,
        Ln = c.process,
        _n = c.fetch,
        On = Ln && Ln.versions,
        Dn = On && On.v8 || "",
        Pn = vn.f,
        Rn = Pn,
        In = "process" == m(Ln),
        Mn = !!(kn && kn.createEvent && c.dispatchEvent),
        Nn = Le(xn, function() {
            var e = An.resolve(1),
                t = function() {},
                n = (e.constructor = {})[wn] = function(e) {
                    e(t, t)
                };
            return !((In || "function" == typeof PromiseRejectionEvent) && e.then(t) instanceof n && 0 !== Dn.indexOf("6.6") && -1 === en.indexOf("Chrome/66"))
        }),
        Bn = Nn || !_t(function(e) {
            An.all(e).catch(function() {})
        }),
        jn = function(e) {
            var t;
            return !(!T(e) || "function" != typeof(t = e.then)) && t
        },
        Fn = function(e, t, n) {
            if (!t.notified) {
                t.notified = !0;
                var r = t.reactions;
                pn(function() {
                    for (var i = t.value, o = 1 == t.state, a = 0; r.length > a;) {
                        var s, c, u, l = r[a++],
                            f = o ? l.ok : l.fail,
                            d = l.resolve,
                            h = l.reject,
                            p = l.domain;
                        try {
                            f ? (o || (2 === t.rejection && Wn(e, t), t.rejection = 1), !0 === f ? s = i : (p && p.enter(), s = f(i), p && (p.exit(), u = !0)), s === l.promise ? h(Cn("Promise-chain cycle")) : (c = jn(s)) ? c.call(s, d, h) : d(s)) : h(i)
                        } catch (e) {
                            p && !u && p.exit(), h(e)
                        }
                    }
                    t.reactions = [], t.notified = !1, n && !t.rejection && Hn(e, t)
                })
            }
        },
        Un = function(e, t, n) {
            var r, i;
            Mn ? ((r = kn.createEvent("Event")).promise = t, r.reason = n, r.initEvent(e, !1, !0), c.dispatchEvent(r)) : r = {
                promise: t,
                reason: n
            }, (i = c["on" + e]) ? i(r) : "unhandledrejection" === e && function(e, t) {
                var n = c.console;
                n && n.error && (1 === arguments.length ? n.error(e) : n.error(e, t))
            }("Unhandled promise rejection", n)
        },
        Hn = function(e, t) {
            bn.call(c, function() {
                var n, r = t.value;
                if (Gn(t) && (n = yn(function() {
                        In ? Ln.emit("unhandledRejection", r, e) : Un("unhandledrejection", e, r)
                    }), t.rejection = In || Gn(t) ? 2 : 1, n.error)) throw n.value
            })
        },
        Gn = function(e) {
            return 1 !== e.rejection && !e.parent
        },
        Wn = function(e, t) {
            bn.call(c, function() {
                In ? Ln.emit("rejectionHandled", e) : Un("rejectionhandled", e, t.value)
            })
        },
        zn = function(e, t, n, r) {
            return function(i) {
                e(t, n, i, r)
            }
        },
        qn = function(e, t, n, r) {
            t.done || (t.done = !0, r && (t = r), t.value = n, t.state = 2, Fn(e, t, !0))
        },
        Vn = function(e, t, n, r) {
            if (!t.done) {
                t.done = !0, r && (t = r);
                try {
                    if (e === n) throw Cn("Promise can't be resolved itself");
                    var i = jn(n);
                    i ? pn(function() {
                        var r = {
                            done: !1
                        };
                        try {
                            i.call(n, zn(Vn, e, r, t), zn(qn, e, r, t))
                        } catch (n) {
                            qn(e, r, n, t)
                        }
                    }) : (t.value = n, t.state = 1, Fn(e, t, !1))
                } catch (n) {
                    qn(e, {
                        done: !1
                    }, n, t)
                }
            }
        };
    Nn && (An = function(e) {
        ht(this, An, xn), De(e), ln.call(this);
        var t = Tn(this);
        try {
            e(zn(Vn, this, t), zn(qn, this, t))
        } catch (e) {
            qn(this, t, e)
        }
    }, (ln = function(e) {
        Sn(this, {
            type: xn,
            done: !1,
            notified: !1,
            parent: !1,
            reactions: [],
            rejection: !1,
            state: 0,
            value: void 0
        })
    }).prototype = st(An.prototype, {
        then: function(e, t) {
            var n = En(this),
                r = Pn(Dt(this, An));
            return r.ok = "function" != typeof e || e, r.fail = "function" == typeof t && t, r.domain = In ? Ln.domain : void 0, n.parent = !0, n.reactions.push(r), 0 != n.state && Fn(this, n, !1), r.promise
        },
        catch: function(e) {
            return this.then(void 0, e)
        }
    }), fn = function() {
        var e = new ln,
            t = Tn(e);
        this.promise = e, this.resolve = zn(Vn, e, t), this.reject = zn(qn, e, t)
    }, vn.f = Pn = function(e) {
        return e === An || e === dn ? new fn(e) : Rn(e)
    }, "function" == typeof at && (hn = at.prototype.then, ee(at.prototype, "then", function(e, t) {
        var n = this;
        return new An(function(e, t) {
            hn.call(n, e, t)
        }).then(e, t)
    }), "function" == typeof _n && Oe({
        global: !0,
        enumerable: !0,
        forced: !0
    }, {
        fetch: function(e) {
            return mn(An, _n.apply(c, arguments))
        }
    }))), Oe({
        global: !0,
        wrap: !0,
        forced: Nn
    }, {
        Promise: An
    }), lt(An, xn, !1), dt(xn), dn = te.Promise, Oe({
        target: xn,
        stat: !0,
        forced: Nn
    }, {
        reject: function(e) {
            var t = Pn(this);
            return t.reject.call(void 0, e), t.promise
        }
    }), Oe({
        target: xn,
        stat: !0,
        forced: Nn
    }, {
        resolve: function(e) {
            return mn(this, e)
        }
    }), Oe({
        target: xn,
        stat: !0,
        forced: Bn
    }, {
        all: function(e) {
            var t = this,
                n = Pn(t),
                r = n.resolve,
                i = n.reject,
                o = yn(function() {
                    var n = De(t.resolve),
                        o = [],
                        a = 0,
                        s = 1;
                    xt(e, function(e) {
                        var c = a++,
                            u = !1;
                        o.push(void 0), s++, n.call(t, e).then(function(e) {
                            u || (u = !0, o[c] = e, --s || r(o))
                        }, i)
                    }), --s || r(o)
                });
            return o.error && i(o.value), n.promise
        },
        race: function(e) {
            var t = this,
                n = Pn(t),
                r = n.reject,
                i = yn(function() {
                    var i = De(t.resolve);
                    xt(e, function(e) {
                        i.call(t, e).then(n.resolve, r)
                    })
                });
            return i.error && r(i.value), n.promise
        }
    });
    var $n = function() {
            var e = P(this),
                t = "";
            return e.global && (t += "g"), e.ignoreCase && (t += "i"), e.multiline && (t += "m"), e.dotAll && (t += "s"), e.unicode && (t += "u"), e.sticky && (t += "y"), t
        },
        Kn = RegExp.prototype.exec,
        Xn = String.prototype.replace,
        Yn = Kn,
        Jn = function() {
            var e = /a/,
                t = /b*/g;
            return Kn.call(e, "a"), Kn.call(t, "a"), 0 !== e.lastIndex || 0 !== t.lastIndex
        }(),
        Zn = void 0 !== /()??/.exec("")[1];
    (Jn || Zn) && (Yn = function(e) {
        var t, n, r, i, o = this;
        return Zn && (n = new RegExp("^" + o.source + "$(?!\\s)", $n.call(o))), Jn && (t = o.lastIndex), r = Kn.call(o, e), Jn && r && (o.lastIndex = o.global ? r.index + r[0].length : t), Zn && r && r.length > 1 && Xn.call(r[0], n, function() {
            var e = arguments;
            for (i = 1; i < arguments.length - 2; i++) void 0 === e[i] && (r[i] = void 0)
        }), r
    });
    var Qn = Yn;
    Oe({
        target: "RegExp",
        proto: !0,
        forced: /./.exec !== Qn
    }, {
        exec: Qn
    });
    var er = je("species"),
        tr = !u(function() {
            var e = /./;
            return e.exec = function() {
                var e = [];
                return e.groups = {
                    a: "7"
                }, e
            }, "7" !== "".replace(e, "$<a>")
        }),
        nr = !u(function() {
            var e = /(?:)/,
                t = e.exec;
            e.exec = function() {
                return t.apply(this, arguments)
            };
            var n = "ab".split(e);
            return 2 !== n.length || "a" !== n[0] || "b" !== n[1]
        }),
        rr = function(e, t, n, r) {
            var i = je(e),
                o = !u(function() {
                    var t = {};
                    return t[i] = function() {
                        return 7
                    }, 7 != "" [e](t)
                }),
                a = o && !u(function() {
                    var t = !1,
                        n = /a/;
                    return n.exec = function() {
                        return t = !0, null
                    }, "split" === e && (n.constructor = {}, n.constructor[er] = function() {
                        return n
                    }), n[i](""), !t
                });
            if (!o || !a || "replace" === e && !tr || "split" === e && !nr) {
                var s = /./ [i],
                    c = n(i, "" [e], function(e, t, n, r, i) {
                        return t.exec === Qn ? o && !i ? {
                            done: !0,
                            value: s.call(t, n, r)
                        } : {
                            done: !0,
                            value: e.call(n, t, r)
                        } : {
                            done: !1
                        }
                    }),
                    l = c[0],
                    f = c[1];
                ee(String.prototype, e, l), ee(RegExp.prototype, i, 2 == t ? function(e, t) {
                    return f.call(e, this, t)
                } : function(e) {
                    return f.call(e, this)
                }), r && M(RegExp.prototype[i], "sham", !0)
            }
        },
        ir = Object.is || function(e, t) {
            return e === t ? 0 !== e || 1 / e == 1 / t : e != e && t != t
        },
        or = function(e, t) {
            var n = e.exec;
            if ("function" == typeof n) {
                var r = n.call(e, t);
                if ("object" != typeof r) throw TypeError("RegExp exec method returned something other than an Object or null");
                return r
            }
            if ("RegExp" !== m(e)) throw TypeError("RegExp#exec called on incompatible receiver");
            return Qn.call(e, t)
        };
    rr("search", 1, function(e, t, n) {
        return [function(t) {
            var n = w(this),
                r = null == t ? void 0 : t[e];
            return void 0 !== r ? r.call(t, n) : new RegExp(t)[e](String(n))
        }, function(e) {
            var r = n(t, e, this);
            if (r.done) return r.value;
            var i = P(e),
                o = String(this),
                a = i.lastIndex;
            ir(a, 0) || (i.lastIndex = 0);
            var s = or(i, o);
            return ir(i.lastIndex, a) || (i.lastIndex = a), null === s ? -1 : s.index
        }]
    });
    var ar = je("match"),
        sr = function(e) {
            var t;
            return T(e) && (void 0 !== (t = e[ar]) ? !!t : "RegExp" == m(e))
        },
        cr = function(e) {
            return function(t, n) {
                var r, i, o = String(w(t)),
                    a = ae(n),
                    s = o.length;
                return a < 0 || a >= s ? e ? "" : void 0 : (r = o.charCodeAt(a)) < 55296 || r > 56319 || a + 1 === s || (i = o.charCodeAt(a + 1)) < 56320 || i > 57343 ? e ? o.charAt(a) : r : e ? o.slice(a, a + 2) : i - 56320 + (r - 55296 << 10) + 65536
            }
        },
        ur = {
            codeAt: cr(!1),
            charAt: cr(!0)
        },
        lr = ur.charAt,
        fr = function(e, t, n) {
            return t + (n ? lr(e, t).length : 1)
        },
        dr = [].push,
        hr = Math.min,
        pr = !u(function() {
            return !RegExp(4294967295, "y")
        });
    rr("split", 2, function(e, t, n) {
        var r;
        return r = "c" == "abbc".split(/(b)*/)[1] || 4 != "test".split(/(?:)/, -1).length || 2 != "ab".split(/(?:ab)*/).length || 4 != ".".split(/(.?)(.?)/).length || ".".split(/()()/).length > 1 || "".split(/.?/).length ? function(e, n) {
            var r = String(w(this)),
                i = void 0 === n ? 4294967295 : n >>> 0;
            if (0 === i) return [];
            if (void 0 === e) return [r];
            if (!sr(e)) return t.call(r, e, i);
            for (var o, a, s, c = [], u = (e.ignoreCase ? "i" : "") + (e.multiline ? "m" : "") + (e.unicode ? "u" : "") + (e.sticky ? "y" : ""), l = 0, f = new RegExp(e.source, u + "g");
                (o = Qn.call(f, r)) && !((a = f.lastIndex) > l && (c.push(r.slice(l, o.index)), o.length > 1 && o.index < r.length && dr.apply(c, o.slice(1)), s = o[0].length, l = a, c.length >= i));) f.lastIndex === o.index && f.lastIndex++;
            return l === r.length ? !s && f.test("") || c.push("") : c.push(r.slice(l)), c.length > i ? c.slice(0, i) : c
        } : "0".split(void 0, 0).length ? function(e, n) {
            return void 0 === e && 0 === n ? [] : t.call(this, e, n)
        } : t, [function(t, n) {
            var i = w(this),
                o = null == t ? void 0 : t[e];
            return void 0 !== o ? o.call(t, i, n) : r.call(String(i), t, n)
        }, function(e, i) {
            var o = n(r, e, this, i, r !== t);
            if (o.done) return o.value;
            var a = P(e),
                s = String(this),
                c = Dt(a, RegExp),
                u = a.unicode,
                l = (a.ignoreCase ? "i" : "") + (a.multiline ? "m" : "") + (a.unicode ? "u" : "") + (pr ? "y" : "g"),
                f = new c(pr ? a : "^(?:" + a.source + ")", l),
                d = void 0 === i ? 4294967295 : i >>> 0;
            if (0 === d) return [];
            if (0 === s.length) return null === or(f, s) ? [s] : [];
            for (var h = 0, p = 0, g = []; p < s.length;) {
                f.lastIndex = pr ? p : 0;
                var v, m = or(f, pr ? s : s.slice(p));
                if (null === m || (v = hr(ce(f.lastIndex + (pr ? 0 : p)), s.length)) === h) p = fr(s, p, u);
                else {
                    if (g.push(s.slice(h, p)), g.length === d) return g;
                    for (var y = 1; y <= m.length - 1; y++)
                        if (g.push(m[y]), g.length === d) return g;
                    p = h = v
                }
            }
            return g.push(s.slice(h)), g
        }]
    }, !pr);
    var gr = function(e) {
            if (sr(e)) throw TypeError("The method doesn't accept regular expressions");
            return e
        },
        vr = je("match"),
        mr = function(e) {
            var t = /./;
            try {
                "/./" [e](t)
            } catch (n) {
                try {
                    return t[vr] = !1, "/./" [e](t)
                } catch (e) {}
            }
            return !1
        },
        yr = "".startsWith,
        br = Math.min;
    Oe({
        target: "String",
        proto: !0,
        forced: !mr("startsWith")
    }, {
        startsWith: function(e) {
            var t = String(w(this));
            gr(e);
            var n = ce(br(arguments.length > 1 ? arguments[1] : void 0, t.length)),
                r = String(e);
            return yr ? yr.call(t, r, n) : t.slice(n, n + r.length) === r
        }
    });
    var wr = "\t\n\v\f\r                　\u2028\u2029\ufeff",
        xr = "[" + wr + "]",
        Tr = RegExp("^" + xr + xr + "*"),
        Sr = RegExp(xr + xr + "*$"),
        Er = function(e) {
            return function(t) {
                var n = String(w(t));
                return 1 & e && (n = n.replace(Tr, "")), 2 & e && (n = n.replace(Sr, "")), n
            }
        },
        Ar = {
            start: Er(1),
            end: Er(2),
            trim: Er(3)
        },
        Cr = Ar.trim;
    Oe({
        target: "String",
        proto: !0,
        forced: function(e) {
            return u(function() {
                return !!wr[e]() || "​᠎" != "​᠎" [e]() || wr[e].name !== e
            })
        }("trim")
    }, {
        trim: function() {
            return Cr(this)
        }
    });
    var kr = {
        CSSRuleList: 0,
        CSSStyleDeclaration: 0,
        CSSValueList: 0,
        ClientRectList: 0,
        DOMRectList: 0,
        DOMStringList: 0,
        DOMTokenList: 1,
        DataTransferItemList: 0,
        FileList: 0,
        HTMLAllCollection: 0,
        HTMLCollection: 0,
        HTMLFormElement: 0,
        HTMLSelectElement: 0,
        MediaList: 0,
        MimeTypeArray: 0,
        NamedNodeMap: 0,
        NodeList: 1,
        PaintRequestList: 0,
        Plugin: 0,
        PluginArray: 0,
        SVGLengthList: 0,
        SVGNumberList: 0,
        SVGPathSegList: 0,
        SVGPointList: 0,
        SVGStringList: 0,
        SVGTransformList: 0,
        SourceBufferList: 0,
        StyleSheetList: 0,
        TextTrackCueList: 0,
        TextTrackList: 0,
        TouchList: 0
    };
    for (var Lr in kr) {
        var _r = c[Lr],
            Or = _r && _r.prototype;
        if (Or && Or.forEach !== Ve) try {
            M(Or, "forEach", Ve)
        } catch (e) {
            Or.forEach = Ve
        }
    }
    var Dr = function(e, t, n) {
            var r = S(t);
            r in e ? I.f(e, r, g(0, n)) : e[r] = n
        },
        Pr = je("species"),
        Rr = function(e) {
            return !u(function() {
                var t = [];
                return (t.constructor = {})[Pr] = function() {
                    return {
                        foo: 1
                    }
                }, 1 !== t[e](Boolean).foo
            })
        },
        Ir = je("isConcatSpreadable"),
        Mr = !u(function() {
            var e = [];
            return e[Ir] = !1, e.concat()[0] !== e
        }),
        Nr = Rr("concat"),
        Br = function(e) {
            if (!T(e)) return !1;
            var t = e[Ir];
            return void 0 !== t ? !!t : Ie(e)
        };
    Oe({
        target: "Array",
        proto: !0,
        forced: !Mr || !Nr
    }, {
        concat: function(e) {
            var t, n, r, i, o, a = arguments,
                s = Re(this),
                c = Ue(s, 0),
                u = 0;
            for (t = -1, r = arguments.length; t < r; t++)
                if (o = -1 === t ? s : a[t], Br(o)) {
                    if (u + (i = ce(o.length)) > 9007199254740991) throw TypeError("Maximum allowed index exceeded");
                    for (n = 0; n < i; n++, u++) n in o && Dr(c, u, o[n])
                } else {
                    if (u >= 9007199254740991) throw TypeError("Maximum allowed index exceeded");
                    Dr(c, u++, o)
                }
            return c.length = u, c
        }
    });
    var jr = function(e) {
            for (var t = Re(this), n = ce(t.length), r = arguments.length, i = fe(r > 1 ? arguments[1] : void 0, n), o = r > 2 ? arguments[2] : void 0, a = void 0 === o ? n : fe(o, n); a > i;) t[i++] = e;
            return t
        },
        Fr = Object.keys || function(e) {
            return ge(e, ve)
        },
        Ur = l ? Object.defineProperties : function(e, t) {
            P(e);
            for (var n, r = Fr(t), i = r.length, o = 0; i > o;) I.f(e, n = r[o++], t[n]);
            return e
        },
        Hr = q("IE_PROTO"),
        Gr = function() {},
        Wr = function() {
            var e, t = L("iframe"),
                n = ve.length;
            for (t.style.display = "none", Pt.appendChild(t), t.src = String("javascript:"), (e = t.contentWindow.document).open(), e.write("<script>document.F=Object<\/script>"), e.close(), Wr = e.F; n--;) delete Wr.prototype[ve[n]];
            return Wr()
        },
        zr = Object.create || function(e, t) {
            var n;
            return null !== e ? (Gr.prototype = P(e), n = new Gr, Gr.prototype = null, n[Hr] = e) : n = Wr(), void 0 === t ? n : Ur(n, t)
        };
    V[Hr] = !0;
    var qr = je("unscopables"),
        Vr = Array.prototype;
    null == Vr[qr] && M(Vr, qr, zr(null));
    var $r = function(e) {
        Vr[qr][e] = !0
    };
    Oe({
        target: "Array",
        proto: !0
    }, {
        fill: jr
    }), $r("fill");
    var Kr = We.filter;
    Oe({
        target: "Array",
        proto: !0,
        forced: !Rr("filter")
    }, {
        filter: function(e) {
            return Kr(this, e, arguments.length > 1 ? arguments[1] : void 0)
        }
    });
    var Xr = function(e) {
            var t, n, r, i, o = Re(e),
                a = "function" == typeof this ? this : Array,
                s = arguments.length,
                c = s > 1 ? arguments[1] : void 0,
                u = void 0 !== c,
                l = 0,
                f = bt(o);
            if (u && (c = Pe(c, s > 2 ? arguments[2] : void 0, 2)), null == f || a == Array && mt(f))
                for (n = new a(t = ce(o.length)); t > l; l++) Dr(n, l, u ? c(o[l], l) : o[l]);
            else
                for (i = f.call(o), n = new a; !(r = i.next()).done; l++) Dr(n, l, u ? wt(i, c, [r.value, l], !0) : r.value);
            return n.length = l, n
        },
        Yr = !_t(function(e) {
            Array.from(e)
        });
    Oe({
        target: "Array",
        stat: !0,
        forced: Yr
    }, {
        from: Xr
    });
    var Jr, Zr, Qr, ei = !u(function() {
            function e() {}
            return e.prototype.constructor = null, Object.getPrototypeOf(new e) !== e.prototype
        }),
        ti = q("IE_PROTO"),
        ni = Object.prototype,
        ri = ei ? Object.getPrototypeOf : function(e) {
            return e = Re(e), A(e, ti) ? e[ti] : "function" == typeof e.constructor && e instanceof e.constructor ? e.constructor.prototype : e instanceof Object ? ni : null
        },
        ii = je("iterator"),
        oi = !1;
    [].keys && ("next" in (Qr = [].keys()) ? (Zr = ri(ri(Qr))) !== Object.prototype && (Jr = Zr) : oi = !0), null == Jr && (Jr = {}), A(Jr, ii) || M(Jr, ii, function() {
        return this
    });
    var ai = {
            IteratorPrototype: Jr,
            BUGGY_SAFARI_ITERATORS: oi
        },
        si = ai.IteratorPrototype,
        ci = function() {
            return this
        },
        ui = function(e, t, n) {
            var r = t + " Iterator";
            return e.prototype = zr(si, {
                next: g(1, n)
            }), lt(e, r, !1), pt[r] = ci, e
        },
        li = Object.setPrototypeOf || ("__proto__" in {} ? function() {
            var e, t = !1,
                n = {};
            try {
                (e = Object.getOwnPropertyDescriptor(Object.prototype, "__proto__").set).call(n, []), t = n instanceof Array
            } catch (e) {}
            return function(n, r) {
                return P(n),
                    function(e) {
                        if (!T(e) && null !== e) throw TypeError("Can't set " + String(e) + " as a prototype")
                    }(r), t ? e.call(n, r) : n.__proto__ = r, n
            }
        }() : void 0),
        fi = ai.IteratorPrototype,
        di = ai.BUGGY_SAFARI_ITERATORS,
        hi = je("iterator"),
        pi = function() {
            return this
        },
        gi = function(e, t, n, r, i, o, a) {
            ui(n, t, r);
            var s, c, u, l = function(e) {
                    if (e === i && g) return g;
                    if (!di && e in h) return h[e];
                    switch (e) {
                        case "keys":
                        case "values":
                        case "entries":
                            return function() {
                                return new n(this, e)
                            }
                    }
                    return function() {
                        return new n(this)
                    }
                },
                f = t + " Iterator",
                d = !1,
                h = e.prototype,
                p = h[hi] || h["@@iterator"] || i && h[i],
                g = !di && p || l(i),
                v = "Array" == t && h.entries || p;
            if (v && (s = ri(v.call(new e)), fi !== Object.prototype && s.next && (ri(s) !== fi && (li ? li(s, fi) : "function" != typeof s[hi] && M(s, hi, pi)), lt(s, f, !0))), "values" == i && p && "values" !== p.name && (d = !0, g = function() {
                    return p.call(this)
                }), h[hi] !== g && M(h, hi, g), pt[t] = g, i)
                if (c = {
                        values: l("values"),
                        keys: o ? g : l("keys"),
                        entries: l("entries")
                    }, a)
                    for (u in c) !di && !d && u in h || ee(h, u, c[u]);
                else Oe({
                    target: t,
                    proto: !0,
                    forced: di || d
                }, c);
            return c
        },
        vi = Q.set,
        mi = Q.getterFor("Array Iterator"),
        yi = gi(Array, "Array", function(e, t) {
            vi(this, {
                type: "Array Iterator",
                target: x(e),
                index: 0,
                kind: t
            })
        }, function() {
            var e = mi(this),
                t = e.target,
                n = e.kind,
                r = e.index++;
            return !t || r >= t.length ? (e.target = void 0, {
                value: void 0,
                done: !0
            }) : "keys" == n ? {
                value: r,
                done: !1
            } : "values" == n ? {
                value: t[r],
                done: !1
            } : {
                value: [r, t[r]],
                done: !1
            }
        }, "values");
    pt.Arguments = pt.Array, $r("keys"), $r("values"), $r("entries");
    var bi = [].join,
        wi = b != Object,
        xi = ze("join", ",");
    Oe({
        target: "Array",
        proto: !0,
        forced: wi || xi
    }, {
        join: function(e) {
            return bi.call(x(this), void 0 === e ? "," : e)
        }
    });
    var Ti = We.map;
    Oe({
        target: "Array",
        proto: !0,
        forced: !Rr("map")
    }, {
        map: function(e) {
            return Ti(this, e, arguments.length > 1 ? arguments[1] : void 0)
        }
    });
    var Si = je("species"),
        Ei = [].slice,
        Ai = Math.max;
    Oe({
        target: "Array",
        proto: !0,
        forced: !Rr("slice")
    }, {
        slice: function(e, t) {
            var n, r, i, o = x(this),
                a = ce(o.length),
                s = fe(e, a),
                c = fe(void 0 === t ? a : t, a);
            if (Ie(o) && ("function" != typeof(n = o.constructor) || n !== Array && !Ie(n.prototype) ? T(n) && null === (n = n[Si]) && (n = void 0) : n = void 0, n === Array || void 0 === n)) return Ei.call(o, s, c);
            for (r = new(void 0 === n ? Array : n)(Ai(c - s, 0)), i = 0; s < c; s++, i++) s in o && Dr(r, i, o[s]);
            return r.length = i, r
        }
    });
    var Ci = Math.max,
        ki = Math.min;
    Oe({
        target: "Array",
        proto: !0,
        forced: !Rr("splice")
    }, {
        splice: function(e, t) {
            var n, r, i, o, a, s, c = arguments,
                u = Re(this),
                l = ce(u.length),
                f = fe(e, l),
                d = arguments.length;
            if (0 === d ? n = r = 0 : 1 === d ? (n = 0, r = l - f) : (n = d - 2, r = ki(Ci(ae(t), 0), l - f)), l + n - r > 9007199254740991) throw TypeError("Maximum allowed length exceeded");
            for (i = Ue(u, r), o = 0; o < r; o++)(a = f + o) in u && Dr(i, o, u[a]);
            if (i.length = r, n < r) {
                for (o = f; o < l - r; o++) s = o + n, (a = o + r) in u ? u[s] = u[a] : delete u[s];
                for (o = l; o > l - r + n; o--) delete u[o - 1]
            } else if (n > r)
                for (o = l - r; o > f; o--) s = o + n - 1, (a = o + r - 1) in u ? u[s] = u[a] : delete u[s];
            for (o = 0; o < n; o++) u[o + f] = c[o + 2];
            return u.length = l - r + n, i
        }
    });
    var Li = I.f,
        _i = Function.prototype,
        Oi = _i.toString,
        Di = /^\s*function ([^ (]*)/;
    !l || "name" in _i || Li(_i, "name", {
        configurable: !0,
        get: function() {
            try {
                return Oi.call(this).match(Di)[1]
            } catch (e) {
                return ""
            }
        }
    });
    var Pi = !u(function() {
            return Object.isExtensible(Object.preventExtensions({}))
        }),
        Ri = n(function(e) {
            var t = I.f,
                n = W("meta"),
                r = 0,
                i = Object.isExtensible || function() {
                    return !0
                },
                o = function(e) {
                    t(e, n, {
                        value: {
                            objectID: "O" + ++r,
                            weakData: {}
                        }
                    })
                },
                a = e.exports = {
                    REQUIRED: !1,
                    fastKey: function(e, t) {
                        if (!T(e)) return "symbol" == typeof e ? e : ("string" == typeof e ? "S" : "P") + e;
                        if (!A(e, n)) {
                            if (!i(e)) return "F";
                            if (!t) return "E";
                            o(e)
                        }
                        return e[n].objectID
                    },
                    getWeakData: function(e, t) {
                        if (!A(e, n)) {
                            if (!i(e)) return !0;
                            if (!t) return !1;
                            o(e)
                        }
                        return e[n].weakData
                    },
                    onFreeze: function(e) {
                        return Pi && a.REQUIRED && i(e) && !A(e, n) && o(e), e
                    }
                };
            V[n] = !0
        }),
        Ii = (Ri.REQUIRED, Ri.fastKey, Ri.getWeakData, Ri.onFreeze, function(e, t, n) {
            var r, i;
            return li && "function" == typeof(r = t.constructor) && r !== n && T(i = r.prototype) && i !== n.prototype && li(e, i), e
        }),
        Mi = function(e, t, n, r, i) {
            var o = c[e],
                a = o && o.prototype,
                s = o,
                l = r ? "set" : "add",
                f = {},
                d = function(e) {
                    var t = a[e];
                    ee(a, e, "add" == e ? function(e) {
                        return t.call(this, 0 === e ? 0 : e), this
                    } : "delete" == e ? function(e) {
                        return !(i && !T(e)) && t.call(this, 0 === e ? 0 : e)
                    } : "get" == e ? function(e) {
                        return i && !T(e) ? void 0 : t.call(this, 0 === e ? 0 : e)
                    } : "has" == e ? function(e) {
                        return !(i && !T(e)) && t.call(this, 0 === e ? 0 : e)
                    } : function(e, n) {
                        return t.call(this, 0 === e ? 0 : e, n), this
                    })
                };
            if (Le(e, "function" != typeof o || !(i || a.forEach && !u(function() {
                    (new o).entries().next()
                })))) s = n.getConstructor(t, e, r, l), Ri.REQUIRED = !0;
            else if (Le(e, !0)) {
                var h = new s,
                    p = h[l](i ? {} : -0, 1) != h,
                    g = u(function() {
                        h.has(1)
                    }),
                    v = _t(function(e) {
                        new o(e)
                    }),
                    m = !i && u(function() {
                        for (var e = new o, t = 5; t--;) e[l](t, t);
                        return !e.has(-0)
                    });
                v || ((s = t(function(t, n) {
                    ht(t, s, e);
                    var i = Ii(new o, t, s);
                    return null != n && xt(n, i[l], i, r), i
                })).prototype = a, a.constructor = s), (g || m) && (d("delete"), d("has"), r && d("get")), (m || p) && d(l), i && a.clear && delete a.clear
            }
            return f[e] = s, Oe({
                global: !0,
                forced: s != o
            }, f), lt(s, e), i || n.setStrong(s, e, r), s
        },
        Ni = I.f,
        Bi = Ri.fastKey,
        ji = Q.set,
        Fi = Q.getterFor,
        Ui = {
            getConstructor: function(e, t, n, r) {
                var i = e(function(e, o) {
                        ht(e, i, t), ji(e, {
                            type: t,
                            index: zr(null),
                            first: void 0,
                            last: void 0,
                            size: 0
                        }), l || (e.size = 0), null != o && xt(o, e[r], e, n)
                    }),
                    o = Fi(t),
                    a = function(e, t, n) {
                        var r, i, a = o(e),
                            c = s(e, t);
                        return c ? c.value = n : (a.last = c = {
                            index: i = Bi(t, !0),
                            key: t,
                            value: n,
                            previous: r = a.last,
                            next: void 0,
                            removed: !1
                        }, a.first || (a.first = c), r && (r.next = c), l ? a.size++ : e.size++, "F" !== i && (a.index[i] = c)), e
                    },
                    s = function(e, t) {
                        var n, r = o(e),
                            i = Bi(t);
                        if ("F" !== i) return r.index[i];
                        for (n = r.first; n; n = n.next)
                            if (n.key == t) return n
                    };
                return st(i.prototype, {
                    clear: function() {
                        for (var e = o(this), t = e.index, n = e.first; n;) n.removed = !0, n.previous && (n.previous = n.previous.next = void 0), delete t[n.index], n = n.next;
                        e.first = e.last = void 0, l ? e.size = 0 : this.size = 0
                    },
                    delete: function(e) {
                        var t = o(this),
                            n = s(this, e);
                        if (n) {
                            var r = n.next,
                                i = n.previous;
                            delete t.index[n.index], n.removed = !0, i && (i.next = r), r && (r.previous = i), t.first == n && (t.first = r), t.last == n && (t.last = i), l ? t.size-- : this.size--
                        }
                        return !!n
                    },
                    forEach: function(e) {
                        for (var t, n = o(this), r = Pe(e, arguments.length > 1 ? arguments[1] : void 0, 3); t = t ? t.next : n.first;)
                            for (r(t.value, t.key, this); t && t.removed;) t = t.previous
                    },
                    has: function(e) {
                        return !!s(this, e)
                    }
                }), st(i.prototype, n ? {
                    get: function(e) {
                        var t = s(this, e);
                        return t && t.value
                    },
                    set: function(e, t) {
                        return a(this, 0 === e ? 0 : e, t)
                    }
                } : {
                    add: function(e) {
                        return a(this, e = 0 === e ? 0 : e, e)
                    }
                }), l && Ni(i.prototype, "size", {
                    get: function() {
                        return o(this).size
                    }
                }), i
            },
            setStrong: function(e, t, n) {
                var r = t + " Iterator",
                    i = Fi(t),
                    o = Fi(r);
                gi(e, t, function(e, t) {
                    ji(this, {
                        type: r,
                        target: e,
                        state: i(e),
                        kind: t,
                        last: void 0
                    })
                }, function() {
                    for (var e = o(this), t = e.kind, n = e.last; n && n.removed;) n = n.previous;
                    return e.target && (e.last = n = n ? n.next : e.state.first) ? "keys" == t ? {
                        value: n.key,
                        done: !1
                    } : "values" == t ? {
                        value: n.value,
                        done: !1
                    } : {
                        value: [n.key, n.value],
                        done: !1
                    } : (e.target = void 0, {
                        value: void 0,
                        done: !0
                    })
                }, n ? "entries" : "values", !n, !0), dt(t)
            }
        },
        Hi = (Mi("Map", function(e) {
            return function() {
                return e(this, arguments.length ? arguments[0] : void 0)
            }
        }, Ui, !0), Object.assign),
        Gi = !Hi || u(function() {
            var e = {},
                t = {},
                n = Symbol();
            return e[n] = 7, "abcdefghijklmnopqrst".split("").forEach(function(e) {
                t[e] = e
            }), 7 != Hi({}, e)[n] || "abcdefghijklmnopqrst" != Fr(Hi({}, t)).join("")
        }) ? function(e, t) {
            for (var n = arguments, r = Re(e), i = arguments.length, o = 1, a = be.f, s = p.f; i > o;)
                for (var c, u = b(n[o++]), f = a ? Fr(u).concat(a(u)) : Fr(u), d = f.length, h = 0; d > h;) c = f[h++], l && !s.call(u, c) || (r[c] = u[c]);
            return r
        } : Hi;
    Oe({
        target: "Object",
        stat: !0,
        forced: Object.assign !== Gi
    }, {
        assign: Gi
    }), Oe({
        target: "Object",
        stat: !0,
        sham: !l
    }, {
        getOwnPropertyDescriptors: function(e) {
            for (var t, n, r = x(e), i = D.f, o = we(r), a = {}, s = 0; o.length > s;) void 0 !== (n = i(r, t = o[s++])) && Dr(a, t, n);
            return a
        }
    });
    var Wi = u(function() {
        Fr(1)
    });
    Oe({
        target: "Object",
        stat: !0,
        forced: Wi
    }, {
        keys: function(e) {
            return Fr(Re(e))
        }
    });
    Mi("Set", function(e) {
        return function() {
            return e(this, arguments.length ? arguments[0] : void 0)
        }
    }, Ui);
    var zi = ur.charAt,
        qi = Q.set,
        Vi = Q.getterFor("String Iterator");
    gi(String, "String", function(e) {
        qi(this, {
            type: "String Iterator",
            string: String(e),
            index: 0
        })
    }, function() {
        var e, t = Vi(this),
            n = t.string,
            r = t.index;
        return r >= n.length ? {
            value: void 0,
            done: !0
        } : (e = zi(n, r), t.index += e.length, {
            value: e,
            done: !1
        })
    });
    var $i = Math.max,
        Ki = Math.min,
        Xi = Math.floor,
        Yi = /\$([$&'`]|\d\d?|<[^>]*>)/g,
        Ji = /\$([$&'`]|\d\d?)/g;
    rr("replace", 2, function(e, t, n) {
        return [function(n, r) {
            var i = w(this),
                o = null == n ? void 0 : n[e];
            return void 0 !== o ? o.call(n, i, r) : t.call(String(i), n, r)
        }, function(e, i) {
            var o = n(t, e, this, i);
            if (o.done) return o.value;
            var a = P(e),
                s = String(this),
                c = "function" == typeof i;
            c || (i = String(i));
            var u = a.global;
            if (u) {
                var l = a.unicode;
                a.lastIndex = 0
            }
            for (var f = [];;) {
                var d = or(a, s);
                if (null === d) break;
                if (f.push(d), !u) break;
                "" === String(d[0]) && (a.lastIndex = fr(s, ce(a.lastIndex), l))
            }
            for (var h, p = "", g = 0, v = 0; v < f.length; v++) {
                d = f[v];
                for (var m = String(d[0]), y = $i(Ki(ae(d.index), s.length), 0), b = [], w = 1; w < d.length; w++) b.push(void 0 === (h = d[w]) ? h : String(h));
                var x = d.groups;
                if (c) {
                    var T = [m].concat(b, y, s);
                    void 0 !== x && T.push(x);
                    var S = String(i.apply(void 0, T))
                } else S = r(m, s, y, b, x, i);
                y >= g && (p += s.slice(g, y) + S, g = y + m.length)
            }
            return p + s.slice(g)
        }];

        function r(e, n, r, i, o, a) {
            var s = r + e.length,
                c = i.length,
                u = Ji;
            return void 0 !== o && (o = Re(o), u = Yi), t.call(a, u, function(t, a) {
                var u;
                switch (a.charAt(0)) {
                    case "$":
                        return "$";
                    case "&":
                        return e;
                    case "`":
                        return n.slice(0, r);
                    case "'":
                        return n.slice(s);
                    case "<":
                        u = o[a.slice(1, -1)];
                        break;
                    default:
                        var l = +a;
                        if (0 === l) return t;
                        if (l > c) {
                            var f = Xi(l / 10);
                            return 0 === f ? t : f <= c ? void 0 === i[f - 1] ? a.charAt(1) : i[f - 1] + a.charAt(1) : t
                        }
                        u = i[l - 1]
                }
                return void 0 === u ? "" : u
            })
        }
    });
    var Zi = /"/g,
        Qi = function(e, t, n, r) {
            var i = String(w(e)),
                o = "<" + t;
            return "" !== n && (o += " " + n + '="' + String(r).replace(Zi, "&quot;") + '"'), o + ">" + i + "</" + t + ">"
        },
        eo = function(e) {
            return u(function() {
                var t = "" [e]('"');
                return t !== t.toLowerCase() || t.split('"').length > 3
            })
        };
    Oe({
        target: "String",
        proto: !0,
        forced: eo("anchor")
    }, {
        anchor: function(e) {
            return Qi(this, "a", "name", e)
        }
    });
    var to, no = je("iterator"),
        ro = je("toStringTag"),
        io = yi.values;
    for (var oo in kr) {
        var ao = c[oo],
            so = ao && ao.prototype;
        if (so) {
            if (so[no] !== io) try {
                M(so, no, io)
            } catch (e) {
                so[no] = io
            }
            if (so[ro] || M(so, ro, oo), kr[oo])
                for (var co in yi)
                    if (so[co] !== yi[co]) try {
                        M(so, co, yi[co])
                    } catch (e) {
                        so[co] = yi[co]
                    }
        }
    }

    function uo(e) {
        return (uo = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        })(e)
    }

    function lo(e) {
        return (lo = "function" == typeof Symbol && "symbol" === uo(Symbol.iterator) ? function(e) {
            return uo(e)
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : uo(e)
        })(e)
    }

    function fo() {}

    function ho(e) {
        return e()
    }

    function po() {
        return Object.create(null)
    }

    function go(e) {
        e.forEach(ho)
    }

    function vo(e) {
        return "function" == typeof e
    }

    function mo(e, t) {
        return e != e ? t == t : e !== t || e && "object" === lo(e) || "function" == typeof e
    }

    function yo(e, t) {
        e.appendChild(t)
    }

    function bo(e, t, n) {
        e.insertBefore(t, n || null)
    }

    function wo(e) {
        e.parentNode.removeChild(e)
    }

    function xo(e) {
        return document.createElement(e)
    }

    function To(e) {
        return document.createElementNS("http://www.w3.org/2000/svg", e)
    }

    function So(e) {
        return document.createTextNode(e)
    }

    function Eo() {
        return So(" ")
    }

    function Ao(e, t, n, r) {
        return e.addEventListener(t, n, r),
            function() {
                return e.removeEventListener(t, n, r)
            }
    }

    function Co(e, t, n) {
        null == n ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n)
    }

    function ko(e, t) {
        t = "" + t, e.data !== t && (e.data = t)
    }

    function Lo(e, t, n, r) {
        e.style.setProperty(t, n, r ? "important" : "")
    }

    function _o(e, t, n) {
        e.classList[n ? "add" : "remove"](t)
    }

    function Oo(e) {
        to = e
    }

    function Do(e) {
        (function() {
            if (!to) throw new Error("Function called outside component initialization");
            return to
        })().$$.on_mount.push(e)
    }
    var Po = [],
        Ro = [],
        Io = [],
        Mo = [],
        No = Promise.resolve(),
        Bo = !1;

    function jo(e) {
        Io.push(e)
    }

    function Fo() {
        var e = new Set;
        do {
            for (; Po.length;) {
                var t = Po.shift();
                Oo(t), Uo(t.$$)
            }
            for (; Ro.length;) Ro.pop()();
            for (var n = 0; n < Io.length; n += 1) {
                var r = Io[n];
                e.has(r) || (r(), e.add(r))
            }
            Io.length = 0
        } while (Po.length);
        for (; Mo.length;) Mo.pop()();
        Bo = !1
    }

    function Uo(e) {
        null !== e.fragment && (e.update(), go(e.before_update), e.fragment && e.fragment.p(e.ctx, e.dirty), e.dirty = [-1], e.after_update.forEach(jo))
    }
    var Ho, Go = new Set;

    function Wo() {
        Ho = {
            r: 0,
            c: [],
            p: Ho
        }
    }

    function zo() {
        Ho.r || go(Ho.c), Ho = Ho.p
    }

    function qo(e, t) {
        e && e.i && (Go.delete(e), e.i(t))
    }

    function Vo(e, t, n, r) {
        if (e && e.o) {
            if (Go.has(e)) return;
            Go.add(e), Ho.c.push(function() {
                Go.delete(e), r && (n && e.d(1), r())
            }), e.o(t)
        }
    }
    var $o = "undefined" != typeof window ? window : global;

    function Ko(e) {
        e && e.c()
    }

    function Xo(e, t, n) {
        var r = e.$$,
            i = r.fragment,
            o = r.on_mount,
            a = r.on_destroy,
            s = r.after_update;
        i && i.m(t, n), jo(function() {
            var t = o.map(ho).filter(vo);
            a ? a.push.apply(a, t) : go(t), e.$$.on_mount = []
        }), s.forEach(jo)
    }

    function Yo(e, t) {
        var n = e.$$;
        null !== n.fragment && (go(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = [])
    }

    function Jo(e, t) {
        -1 === e.$$.dirty[0] && (Po.push(e), Bo || (Bo = !0, No.then(Fo)), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31
    }

    function Zo(e, t, n, r, i, o, a) {
        void 0 === a && (a = [-1]);
        var s = to;
        Oo(e);
        var c, u = t.props || {},
            l = e.$$ = {
                fragment: null,
                ctx: null,
                props: o,
                update: fo,
                not_equal: i,
                bound: po(),
                on_mount: [],
                on_destroy: [],
                before_update: [],
                after_update: [],
                context: new Map(s ? s.$$.context : []),
                callbacks: po(),
                dirty: a
            },
            f = !1;
        l.ctx = n ? n(e, u, function(t, n, r) {
            return void 0 === r && (r = n), l.ctx && i(l.ctx[t], l.ctx[t] = r) && (l.bound[t] && l.bound[t](r), f && Jo(e, t)), n
        }) : [], l.update(), f = !0, go(l.before_update), l.fragment = !!r && r(l.ctx), t.target && (t.hydrate ? l.fragment && l.fragment.l((c = t.target, Array.from(c.childNodes))) : l.fragment && l.fragment.c(), t.intro && qo(e.$$.fragment), Xo(e, t.target, t.anchor), Fo()), Oo(s)
    }
    var Qo = function() {};
    Qo.prototype.$destroy = function() {
        Yo(this, 1), this.$destroy = fo
    }, Qo.prototype.$on = function(e, t) {
        var n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
        return n.push(t),
            function() {
                var e = n.indexOf(t); - 1 !== e && n.splice(e, 1)
            }
    }, Qo.prototype.$set = function() {};
    var ea = ye.f,
        ta = {}.toString,
        na = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],
        ra = {
            f: function(e) {
                return na && "[object Window]" == ta.call(e) ? function(e) {
                    try {
                        return ea(e)
                    } catch (e) {
                        return na.slice()
                    }
                }(e) : ea(x(e))
            }
        },
        ia = {
            f: je
        },
        oa = I.f,
        aa = function(e) {
            var t = te.Symbol || (te.Symbol = {});
            A(t, e) || oa(t, e, {
                value: ia.f(e)
            })
        },
        sa = We.forEach,
        ca = q("hidden"),
        ua = je("toPrimitive"),
        la = Q.set,
        fa = Q.getterFor("Symbol"),
        da = Object.prototype,
        ha = c.Symbol,
        pa = c.JSON,
        ga = pa && pa.stringify,
        va = D.f,
        ma = I.f,
        ya = ra.f,
        ba = p.f,
        wa = B("symbols"),
        xa = B("op-symbols"),
        Ta = B("string-to-symbol-registry"),
        Sa = B("symbol-to-string-registry"),
        Ea = B("wks"),
        Aa = c.QObject,
        Ca = !Aa || !Aa.prototype || !Aa.prototype.findChild,
        ka = l && u(function() {
            return 7 != zr(ma({}, "a", {
                get: function() {
                    return ma(this, "a", {
                        value: 7
                    }).a
                }
            })).a
        }) ? function(e, t, n) {
            var r = va(da, t);
            r && delete da[t], ma(e, t, n), r && e !== da && ma(da, t, r)
        } : ma,
        La = function(e, t) {
            var n = wa[e] = zr(ha.prototype);
            return la(n, {
                type: "Symbol",
                tag: e,
                description: t
            }), l || (n.description = t), n
        },
        _a = Me && "symbol" == typeof ha.iterator ? function(e) {
            return "symbol" == typeof e
        } : function(e) {
            return Object(e) instanceof ha
        },
        Oa = function(e, t, n) {
            e === da && Oa(xa, t, n), P(e);
            var r = S(t, !0);
            return P(n), A(wa, r) ? (n.enumerable ? (A(e, ca) && e[ca][r] && (e[ca][r] = !1), n = zr(n, {
                enumerable: g(0, !1)
            })) : (A(e, ca) || ma(e, ca, g(1, {})), e[ca][r] = !0), ka(e, r, n)) : ma(e, r, n)
        },
        Da = function(e, t) {
            P(e);
            var n = x(t),
                r = Fr(n).concat(Ma(n));
            return sa(r, function(t) {
                l && !Pa.call(n, t) || Oa(e, t, n[t])
            }), e
        },
        Pa = function(e) {
            var t = S(e, !0),
                n = ba.call(this, t);
            return !(this === da && A(wa, t) && !A(xa, t)) && (!(n || !A(this, t) || !A(wa, t) || A(this, ca) && this[ca][t]) || n)
        },
        Ra = function(e, t) {
            var n = x(e),
                r = S(t, !0);
            if (n !== da || !A(wa, r) || A(xa, r)) {
                var i = va(n, r);
                return !i || !A(wa, r) || A(n, ca) && n[ca][r] || (i.enumerable = !0), i
            }
        },
        Ia = function(e) {
            var t = ya(x(e)),
                n = [];
            return sa(t, function(e) {
                A(wa, e) || A(V, e) || n.push(e)
            }), n
        },
        Ma = function(e) {
            var t = e === da,
                n = ya(t ? xa : x(e)),
                r = [];
            return sa(n, function(e) {
                !A(wa, e) || t && !A(da, e) || r.push(wa[e])
            }), r
        };
    Me || (ee((ha = function() {
        if (this instanceof ha) throw TypeError("Symbol is not a constructor");
        var e = arguments.length && void 0 !== arguments[0] ? String(arguments[0]) : void 0,
            t = W(e),
            n = function(e) {
                this === da && n.call(xa, e), A(this, ca) && A(this[ca], t) && (this[ca][t] = !1), ka(this, t, g(1, e))
            };
        return l && Ca && ka(da, t, {
            configurable: !0,
            set: n
        }), La(t, e)
    }).prototype, "toString", function() {
        return fa(this).tag
    }), p.f = Pa, I.f = Oa, D.f = Ra, ye.f = ra.f = Ia, be.f = Ma, l && (ma(ha.prototype, "description", {
        configurable: !0,
        get: function() {
            return fa(this).description
        }
    }), ee(da, "propertyIsEnumerable", Pa, {
        unsafe: !0
    })), ia.f = function(e) {
        return La(je(e), e)
    }), Oe({
        global: !0,
        wrap: !0,
        forced: !Me,
        sham: !Me
    }, {
        Symbol: ha
    }), sa(Fr(Ea), function(e) {
        aa(e)
    }), Oe({
        target: "Symbol",
        stat: !0,
        forced: !Me
    }, {
        for: function(e) {
            var t = String(e);
            if (A(Ta, t)) return Ta[t];
            var n = ha(t);
            return Ta[t] = n, Sa[n] = t, n
        },
        keyFor: function(e) {
            if (!_a(e)) throw TypeError(e + " is not a symbol");
            if (A(Sa, e)) return Sa[e]
        },
        useSetter: function() {
            Ca = !0
        },
        useSimple: function() {
            Ca = !1
        }
    }), Oe({
        target: "Object",
        stat: !0,
        forced: !Me,
        sham: !l
    }, {
        create: function(e, t) {
            return void 0 === t ? zr(e) : Da(zr(e), t)
        },
        defineProperty: Oa,
        defineProperties: Da,
        getOwnPropertyDescriptor: Ra
    }), Oe({
        target: "Object",
        stat: !0,
        forced: !Me
    }, {
        getOwnPropertyNames: Ia,
        getOwnPropertySymbols: Ma
    }), Oe({
        target: "Object",
        stat: !0,
        forced: u(function() {
            be.f(1)
        })
    }, {
        getOwnPropertySymbols: function(e) {
            return be.f(Re(e))
        }
    }), pa && Oe({
        target: "JSON",
        stat: !0,
        forced: !Me || u(function() {
            var e = ha();
            return "[null]" != ga([e]) || "{}" != ga({
                a: e
            }) || "{}" != ga(Object(e))
        })
    }, {
        stringify: function(e) {
            for (var t, n, r = arguments, i = [e], o = 1; arguments.length > o;) i.push(r[o++]);
            if (n = t = i[1], (T(t) || void 0 !== e) && !_a(e)) return Ie(t) || (t = function(e, t) {
                if ("function" == typeof n && (t = n.call(this, e, t)), !_a(t)) return t
            }), i[1] = t, ga.apply(pa, i)
        }
    }), ha.prototype[ua] || M(ha.prototype, ua, ha.prototype.valueOf), lt(ha, "Symbol"), V[ca] = !0;
    var Na = I.f,
        Ba = c.Symbol;
    if (l && "function" == typeof Ba && (!("description" in Ba.prototype) || void 0 !== Ba().description)) {
        var ja = {},
            Fa = function() {
                var e = arguments.length < 1 || void 0 === arguments[0] ? void 0 : String(arguments[0]),
                    t = this instanceof Fa ? new Ba(e) : void 0 === e ? Ba() : Ba(e);
                return "" === e && (ja[t] = !0), t
            };
        xe(Fa, Ba);
        var Ua = Fa.prototype = Ba.prototype;
        Ua.constructor = Fa;
        var Ha = Ua.toString,
            Ga = "Symbol(test)" == String(Ba("test")),
            Wa = /^Symbol\((.*)\)[^)]+$/;
        Na(Ua, "description", {
            configurable: !0,
            get: function() {
                var e = T(this) ? this.valueOf() : this,
                    t = Ha.call(e);
                if (A(ja, e)) return "";
                var n = Ga ? t.slice(7, -1) : t.replace(Wa, "$1");
                return "" === n ? void 0 : n
            }
        }), Oe({
            global: !0,
            forced: !0
        }, {
            Symbol: Fa
        })
    }
    aa("iterator");
    var za = I.f,
        qa = ye.f,
        Va = je("match"),
        $a = c.RegExp,
        Ka = $a.prototype,
        Xa = /a/g,
        Ya = /a/g,
        Ja = new $a(Xa) !== Xa;
    if (l && Le("RegExp", !Ja || u(function() {
            return Ya[Va] = !1, $a(Xa) != Xa || $a(Ya) == Ya || "/a/i" != $a(Xa, "i")
        }))) {
        for (var Za = function(e, t) {
                var n = this instanceof Za,
                    r = sr(e),
                    i = void 0 === t;
                return !n && r && e.constructor === Za && i ? e : Ii(Ja ? new $a(r && !i ? e.source : e, t) : $a((r = e instanceof Za) ? e.source : e, r && i ? $n.call(e) : t), n ? this : Ka, Za)
            }, Qa = function(e) {
                e in Za || za(Za, e, {
                    configurable: !0,
                    get: function() {
                        return $a[e]
                    },
                    set: function(t) {
                        $a[e] = t
                    }
                })
            }, es = qa($a), ts = 0; es.length > ts;) Qa(es[ts++]);
        Ka.constructor = Za, Za.prototype = Ka, ee(c, "RegExp", Za)
    }
    dt("RegExp");
    var ns = RegExp.prototype,
        rs = ns.toString,
        is = u(function() {
            return "/a/b" != rs.call({
                source: "a",
                flags: "b"
            })
        }),
        os = "toString" != rs.name;
    (is || os) && ee(RegExp.prototype, "toString", function() {
        var e = P(this),
            t = String(e.source),
            n = e.flags;
        return "/" + t + "/" + String(void 0 === n && e instanceof RegExp && !("flags" in ns) ? $n.call(e) : n)
    }, {
        unsafe: !0
    }), rr("match", 1, function(e, t, n) {
        return [function(t) {
            var n = w(this),
                r = null == t ? void 0 : t[e];
            return void 0 !== r ? r.call(t, n) : new RegExp(t)[e](String(n))
        }, function(e) {
            var r = n(t, e, this);
            if (r.done) return r.value;
            var i = P(e),
                o = String(this);
            if (!i.global) return or(i, o);
            var a = i.unicode;
            i.lastIndex = 0;
            for (var s, c = [], u = 0; null !== (s = or(i, o));) {
                var l = String(s[0]);
                c[u] = l, "" === l && (i.lastIndex = fr(o, ce(i.lastIndex), a)), u++
            }
            return 0 === u ? null : c
        }]
    });
    var as = "function" == typeof Symbol && "symbol" === lo(Symbol.iterator) ? function(e) {
            return lo(e)
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : lo(e)
        },
        ss = window.device,
        cs = {},
        us = [];
    window.device = cs;
    var ls = window.document.documentElement,
        fs = window.navigator.userAgent.toLowerCase(),
        ds = ["googletv", "viera", "smarttv", "internet.tv", "netcast", "nettv", "appletv", "boxee", "kylo", "roku", "dlnadoc", "pov_tv", "hbbtv", "ce-html"];

    function hs(e, t) {
        return -1 !== e.indexOf(t)
    }

    function ps(e) {
        return hs(fs, e)
    }

    function gs(e) {
        return ls.className.match(new RegExp(e, "i"))
    }

    function vs(e) {
        var t = null;
        gs(e) || (t = ls.className.replace(/^\s+|\s+$/g, ""), ls.className = t + " " + e)
    }

    function ms(e) {
        gs(e) && (ls.className = ls.className.replace(" " + e, ""))
    }

    function ys() {
        cs.landscape() ? (ms("portrait"), vs("landscape"), bs("landscape")) : (ms("landscape"), vs("portrait"), bs("portrait")), Ts()
    }

    function bs(e) {
        for (var t in us) us[t](e)
    }
    cs.macos = function() {
        return ps("mac")
    }, cs.ios = function() {
        return cs.iphone() || cs.ipod() || cs.ipad()
    }, cs.iphone = function() {
        return !cs.windows() && ps("iphone")
    }, cs.ipod = function() {
        return ps("ipod")
    }, cs.ipad = function() {
        return ps("ipad")
    }, cs.android = function() {
        return !cs.windows() && ps("android")
    }, cs.androidPhone = function() {
        return cs.android() && ps("mobile")
    }, cs.androidTablet = function() {
        return cs.android() && !ps("mobile")
    }, cs.blackberry = function() {
        return ps("blackberry") || ps("bb10") || ps("rim")
    }, cs.blackberryPhone = function() {
        return cs.blackberry() && !ps("tablet")
    }, cs.blackberryTablet = function() {
        return cs.blackberry() && ps("tablet")
    }, cs.windows = function() {
        return ps("windows")
    }, cs.windowsPhone = function() {
        return cs.windows() && ps("phone")
    }, cs.windowsTablet = function() {
        return cs.windows() && ps("touch") && !cs.windowsPhone()
    }, cs.fxos = function() {
        return (ps("(mobile") || ps("(tablet")) && ps(" rv:")
    }, cs.fxosPhone = function() {
        return cs.fxos() && ps("mobile")
    }, cs.fxosTablet = function() {
        return cs.fxos() && ps("tablet")
    }, cs.meego = function() {
        return ps("meego")
    }, cs.cordova = function() {
        return window.cordova && "file:" === location.protocol
    }, cs.nodeWebkit = function() {
        return "object" === as(window.process)
    }, cs.mobile = function() {
        return cs.androidPhone() || cs.iphone() || cs.ipod() || cs.windowsPhone() || cs.blackberryPhone() || cs.fxosPhone() || cs.meego()
    }, cs.tablet = function() {
        return cs.ipad() || cs.androidTablet() || cs.blackberryTablet() || cs.windowsTablet() || cs.fxosTablet()
    }, cs.desktop = function() {
        return !cs.tablet() && !cs.mobile()
    }, cs.television = function() {
        for (var e = 0; e < ds.length;) {
            if (ps(ds[e])) return !0;
            e++
        }
        return !1
    }, cs.portrait = function() {
        return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? hs(screen.orientation.type, "portrait") : window.innerHeight / window.innerWidth > 1
    }, cs.landscape = function() {
        return screen.orientation && Object.prototype.hasOwnProperty.call(window, "onorientationchange") ? hs(screen.orientation.type, "landscape") : window.innerHeight / window.innerWidth < 1
    }, cs.noConflict = function() {
        return window.device = ss, this
    }, cs.ios() ? cs.ipad() ? vs("ios ipad tablet") : cs.iphone() ? vs("ios iphone mobile") : cs.ipod() && vs("ios ipod mobile") : cs.macos() ? vs("macos desktop") : cs.android() ? cs.androidTablet() ? vs("android tablet") : vs("android mobile") : cs.blackberry() ? cs.blackberryTablet() ? vs("blackberry tablet") : vs("blackberry mobile") : cs.windows() ? cs.windowsTablet() ? vs("windows tablet") : cs.windowsPhone() ? vs("windows mobile") : vs("windows desktop") : cs.fxos() ? cs.fxosTablet() ? vs("fxos tablet") : vs("fxos mobile") : cs.meego() ? vs("meego mobile") : cs.nodeWebkit() ? vs("node-webkit") : cs.television() ? vs("television") : cs.desktop() && vs("desktop"), cs.cordova() && vs("cordova"), cs.onChangeOrientation = function(e) {
        "function" == typeof e && us.push(e)
    };
    var ws = "resize";

    function xs(e) {
        for (var t = 0; t < e.length; t++)
            if (cs[e[t]]()) return e[t];
        return "unknown"
    }

    function Ts() {
        cs.orientation = xs(["portrait", "landscape"])
    }
    Object.prototype.hasOwnProperty.call(window, "onorientationchange") && (ws = "orientationchange"), window.addEventListener ? window.addEventListener(ws, ys, !1) : window.attachEvent ? window.attachEvent(ws, ys) : window[ws] = ys, ys(), cs.type = xs(["mobile", "tablet", "desktop"]), cs.os = xs(["ios", "iphone", "ipad", "ipod", "android", "blackberry", "macos", "windows", "fxos", "meego", "television"]), Ts();
    var Ss = {
            Undef: 1,
            Windows: 2,
            Mac: 3,
            IOS: 4,
            Android: 5
        },
        Es = {
            Undef: 1,
            Safari: 2,
            Chrome: 3,
            Firefox: 4
        },
        As = {
            Undef: 1,
            Desktop: 2,
            Mobile: 3,
            Tablet: 4
        },
        Cs = Ss.Undef,
        ks = Es.Undef,
        Ls = As.Undef;

    function _s() {
        var e;
        switch (function() {
            switch (!0) {
                case cs.desktop():
                    Ls = As.Desktop;
                    break;
                case cs.mobile():
                    Ls = As.Mobile;
                    break;
                case cs.tablet():
                    Ls = As.Tablet
            }
        }(), e = navigator.userAgent.toLowerCase(), window.chrome && "Yandex" != navigator.vendor ? ks = Es.Chrome : -1 !== e.indexOf("safari") && -1 === e.indexOf("chrome") ? ks = Es.Safari : "undefined" != typeof InstallTrigger && (ks = Es.Firefox), !0) {
            case cs.ios():
                Cs = Ss.IOS;
                break;
            case cs.android():
                Cs = Ss.Android;
                break;
            case cs.windows():
                Cs = Ss.Windows;
                break;
            case cs.macos():
                Cs = Ss.Mac
        }
    }
    var Os = Ar.trim,
        Ds = c.parseInt,
        Ps = /^[+-]?0[Xx]/,
        Rs = 8 !== Ds(wr + "08") || 22 !== Ds(wr + "0x16") ? function(e, t) {
            var n = Os(String(e));
            return Ds(n, t >>> 0 || (Ps.test(n) ? 16 : 10))
        } : Ds;
    Oe({
        global: !0,
        forced: parseInt != Rs
    }, {
        parseInt: Rs
    });
    var Is = je("iterator"),
        Ms = !u(function() {
            var e = new URL("b?e=1", "http://a"),
                t = e.searchParams;
            return e.pathname = "c%20d", !t.sort || "http://a/c%20d?e=1" !== e.href || "1" !== t.get("e") || "a=1" !== String(new URLSearchParams("?a=1")) || !t[Is] || "a" !== new URL("https://a@b").username || "b" !== new URLSearchParams(new URLSearchParams("a=b")).get("a") || "xn--e1aybc" !== new URL("http://тест").host || "#%D0%B1" !== new URL("http://a#б").hash
        }),
        Ns = /[^\0-\u007E]/,
        Bs = /[.\u3002\uFF0E\uFF61]/g,
        js = "Overflow: input needs wider integers to process",
        Fs = Math.floor,
        Us = String.fromCharCode,
        Hs = function(e) {
            return e + 22 + 75 * (e < 26)
        },
        Gs = function(e, t, n) {
            var r = 0;
            for (e = n ? Fs(e / 700) : e >> 1, e += Fs(e / t); e > 455; r += 36) e = Fs(e / 35);
            return Fs(r + 36 * e / (e + 38))
        },
        Ws = function(e) {
            var t, n, r = [],
                i = (e = function(e) {
                    for (var t = [], n = 0, r = e.length; n < r;) {
                        var i = e.charCodeAt(n++);
                        if (i >= 55296 && i <= 56319 && n < r) {
                            var o = e.charCodeAt(n++);
                            56320 == (64512 & o) ? t.push(((1023 & i) << 10) + (1023 & o) + 65536) : (t.push(i), n--)
                        } else t.push(i)
                    }
                    return t
                }(e)).length,
                o = 128,
                a = 0,
                s = 72;
            for (t = 0; t < e.length; t++)(n = e[t]) < 128 && r.push(Us(n));
            var c = r.length,
                u = c;
            for (c && r.push("-"); u < i;) {
                var l = 2147483647;
                for (t = 0; t < e.length; t++)(n = e[t]) >= o && n < l && (l = n);
                var f = u + 1;
                if (l - o > Fs((2147483647 - a) / f)) throw RangeError(js);
                for (a += (l - o) * f, o = l, t = 0; t < e.length; t++) {
                    if ((n = e[t]) < o && ++a > 2147483647) throw RangeError(js);
                    if (n == o) {
                        for (var d = a, h = 36;; h += 36) {
                            var p = h <= s ? 1 : h >= s + 26 ? 26 : h - s;
                            if (d < p) break;
                            var g = d - p,
                                v = 36 - p;
                            r.push(Us(Hs(p + g % v))), d = Fs(g / v)
                        }
                        r.push(Us(Hs(d))), s = Gs(a, f, u == c), a = 0, ++u
                    }
                }++a, ++o
            }
            return r.join("")
        },
        zs = function(e) {
            var t = bt(e);
            if ("function" != typeof t) throw TypeError(String(e) + " is not iterable");
            return P(t.call(e))
        },
        qs = je("iterator"),
        Vs = Q.set,
        $s = Q.getterFor("URLSearchParams"),
        Ks = Q.getterFor("URLSearchParamsIterator"),
        Xs = /\+/g,
        Ys = Array(4),
        Js = function(e) {
            return Ys[e - 1] || (Ys[e - 1] = RegExp("((?:%[\\da-f]{2}){" + e + "})", "gi"))
        },
        Zs = function(e) {
            try {
                return decodeURIComponent(e)
            } catch (t) {
                return e
            }
        },
        Qs = function(e) {
            var t = e.replace(Xs, " "),
                n = 4;
            try {
                return decodeURIComponent(t)
            } catch (e) {
                for (; n;) t = t.replace(Js(n--), Zs);
                return t
            }
        },
        ec = /[!'()~]|%20/g,
        tc = {
            "!": "%21",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "~": "%7E",
            "%20": "+"
        },
        nc = function(e) {
            return tc[e]
        },
        rc = function(e) {
            return encodeURIComponent(e).replace(ec, nc)
        },
        ic = function(e, t) {
            if (t)
                for (var n, r, i = t.split("&"), o = 0; o < i.length;)(n = i[o++]).length && (r = n.split("="), e.push({
                    key: Qs(r.shift()),
                    value: Qs(r.join("="))
                }))
        },
        oc = function(e) {
            this.entries.length = 0, ic(this.entries, e)
        },
        ac = function(e, t) {
            if (e < t) throw TypeError("Not enough arguments")
        },
        sc = ui(function(e, t) {
            Vs(this, {
                type: "URLSearchParamsIterator",
                iterator: zs($s(e).entries),
                kind: t
            })
        }, "Iterator", function() {
            var e = Ks(this),
                t = e.kind,
                n = e.iterator.next(),
                r = n.value;
            return n.done || (n.value = "keys" === t ? r.key : "values" === t ? r.value : [r.key, r.value]), n
        }),
        cc = function() {
            ht(this, cc, "URLSearchParams");
            var e, t, n, r, i, o, a, s = arguments.length > 0 ? arguments[0] : void 0,
                c = [];
            if (Vs(this, {
                    type: "URLSearchParams",
                    entries: c,
                    updateURL: function() {},
                    updateSearchParams: oc
                }), void 0 !== s)
                if (T(s))
                    if ("function" == typeof(e = bt(s)))
                        for (t = e.call(s); !(n = t.next()).done;) {
                            if ((i = (r = zs(P(n.value))).next()).done || (o = r.next()).done || !r.next().done) throw TypeError("Expected sequence with length 2");
                            c.push({
                                key: i.value + "",
                                value: o.value + ""
                            })
                        } else
                            for (a in s) A(s, a) && c.push({
                                key: a,
                                value: s[a] + ""
                            });
                    else ic(c, "string" == typeof s ? "?" === s.charAt(0) ? s.slice(1) : s : s + "")
        },
        uc = cc.prototype;
    st(uc, {
        append: function(e, t) {
            ac(arguments.length, 2);
            var n = $s(this);
            n.entries.push({
                key: e + "",
                value: t + ""
            }), n.updateURL()
        },
        delete: function(e) {
            ac(arguments.length, 1);
            for (var t = $s(this), n = t.entries, r = e + "", i = 0; i < n.length;) n[i].key === r ? n.splice(i, 1) : i++;
            t.updateURL()
        },
        get: function(e) {
            ac(arguments.length, 1);
            for (var t = $s(this).entries, n = e + "", r = 0; r < t.length; r++)
                if (t[r].key === n) return t[r].value;
            return null
        },
        getAll: function(e) {
            ac(arguments.length, 1);
            for (var t = $s(this).entries, n = e + "", r = [], i = 0; i < t.length; i++) t[i].key === n && r.push(t[i].value);
            return r
        },
        has: function(e) {
            ac(arguments.length, 1);
            for (var t = $s(this).entries, n = e + "", r = 0; r < t.length;)
                if (t[r++].key === n) return !0;
            return !1
        },
        set: function(e, t) {
            ac(arguments.length, 1);
            for (var n, r = $s(this), i = r.entries, o = !1, a = e + "", s = t + "", c = 0; c < i.length; c++)(n = i[c]).key === a && (o ? i.splice(c--, 1) : (o = !0, n.value = s));
            o || i.push({
                key: a,
                value: s
            }), r.updateURL()
        },
        sort: function() {
            var e, t, n, r = $s(this),
                i = r.entries,
                o = i.slice();
            for (i.length = 0, n = 0; n < o.length; n++) {
                for (e = o[n], t = 0; t < n; t++)
                    if (i[t].key > e.key) {
                        i.splice(t, 0, e);
                        break
                    }
                t === n && i.push(e)
            }
            r.updateURL()
        },
        forEach: function(e) {
            for (var t, n = $s(this).entries, r = Pe(e, arguments.length > 1 ? arguments[1] : void 0, 3), i = 0; i < n.length;) r((t = n[i++]).value, t.key, this)
        },
        keys: function() {
            return new sc(this, "keys")
        },
        values: function() {
            return new sc(this, "values")
        },
        entries: function() {
            return new sc(this, "entries")
        }
    }, {
        enumerable: !0
    }), ee(uc, qs, uc.entries), ee(uc, "toString", function() {
        for (var e, t = $s(this).entries, n = [], r = 0; r < t.length;) e = t[r++], n.push(rc(e.key) + "=" + rc(e.value));
        return n.join("&")
    }, {
        enumerable: !0
    }), lt(cc, "URLSearchParams"), Oe({
        global: !0,
        forced: !Ms
    }, {
        URLSearchParams: cc
    });
    var lc, fc = {
            URLSearchParams: cc,
            getState: $s
        },
        dc = ur.codeAt,
        hc = c.URL,
        pc = fc.URLSearchParams,
        gc = fc.getState,
        vc = Q.set,
        mc = Q.getterFor("URL"),
        yc = Math.floor,
        bc = Math.pow,
        wc = /[A-Za-z]/,
        xc = /[\d+\-.A-Za-z]/,
        Tc = /\d/,
        Sc = /^(0x|0X)/,
        Ec = /^[0-7]+$/,
        Ac = /^\d+$/,
        Cc = /^[\dA-Fa-f]+$/,
        kc = /[\u0000\u0009\u000A\u000D #%\/:?@[\\]]/,
        Lc = /[\u0000\u0009\u000A\u000D #\/:?@[\\]]/,
        _c = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,
        Oc = /[\u0009\u000A\u000D]/g,
        Dc = function(e, t) {
            var n, r, i;
            if ("[" == t.charAt(0)) {
                if ("]" != t.charAt(t.length - 1)) return "Invalid host";
                if (!(n = Rc(t.slice(1, -1)))) return "Invalid host";
                e.host = n
            } else if (Hc(e)) {
                if (t = function(e) {
                        var t, n, r = [],
                            i = e.toLowerCase().replace(Bs, ".").split(".");
                        for (t = 0; t < i.length; t++) n = i[t], r.push(Ns.test(n) ? "xn--" + Ws(n) : n);
                        return r.join(".")
                    }(t), kc.test(t)) return "Invalid host";
                if (null === (n = Pc(t))) return "Invalid host";
                e.host = n
            } else {
                if (Lc.test(t)) return "Invalid host";
                for (n = "", r = Xr(t), i = 0; i < r.length; i++) n += Fc(r[i], Mc);
                e.host = n
            }
        },
        Pc = function(e) {
            var t, n, r, i, o, a, s, c = e.split(".");
            if (c.length && "" == c[c.length - 1] && c.pop(), (t = c.length) > 4) return e;
            for (n = [], r = 0; r < t; r++) {
                if ("" == (i = c[r])) return e;
                if (o = 10, i.length > 1 && "0" == i.charAt(0) && (o = Sc.test(i) ? 16 : 8, i = i.slice(8 == o ? 1 : 2)), "" === i) a = 0;
                else {
                    if (!(10 == o ? Ac : 8 == o ? Ec : Cc).test(i)) return e;
                    a = parseInt(i, o)
                }
                n.push(a)
            }
            for (r = 0; r < t; r++)
                if (a = n[r], r == t - 1) {
                    if (a >= bc(256, 5 - t)) return null
                } else if (a > 255) return null;
            for (s = n.pop(), r = 0; r < n.length; r++) s += n[r] * bc(256, 3 - r);
            return s
        },
        Rc = function(e) {
            var t, n, r, i, o, a, s, c = [0, 0, 0, 0, 0, 0, 0, 0],
                u = 0,
                l = null,
                f = 0,
                d = function() {
                    return e.charAt(f)
                };
            if (":" == d()) {
                if (":" != e.charAt(1)) return;
                f += 2, l = ++u
            }
            for (; d();) {
                if (8 == u) return;
                if (":" != d()) {
                    for (t = n = 0; n < 4 && Cc.test(d());) t = 16 * t + parseInt(d(), 16), f++, n++;
                    if ("." == d()) {
                        if (0 == n) return;
                        if (f -= n, u > 6) return;
                        for (r = 0; d();) {
                            if (i = null, r > 0) {
                                if (!("." == d() && r < 4)) return;
                                f++
                            }
                            if (!Tc.test(d())) return;
                            for (; Tc.test(d());) {
                                if (o = parseInt(d(), 10), null === i) i = o;
                                else {
                                    if (0 == i) return;
                                    i = 10 * i + o
                                }
                                if (i > 255) return;
                                f++
                            }
                            c[u] = 256 * c[u] + i, 2 != ++r && 4 != r || u++
                        }
                        if (4 != r) return;
                        break
                    }
                    if (":" == d()) {
                        if (f++, !d()) return
                    } else if (d()) return;
                    c[u++] = t
                } else {
                    if (null !== l) return;
                    f++, l = ++u
                }
            }
            if (null !== l)
                for (a = u - l, u = 7; 0 != u && a > 0;) s = c[u], c[u--] = c[l + a - 1], c[l + --a] = s;
            else if (8 != u) return;
            return c
        },
        Ic = function(e) {
            var t, n, r, i;
            if ("number" == typeof e) {
                for (t = [], n = 0; n < 4; n++) t.unshift(e % 256), e = yc(e / 256);
                return t.join(".")
            }
            if ("object" == typeof e) {
                for (t = "", r = function(e) {
                        for (var t = null, n = 1, r = null, i = 0, o = 0; o < 8; o++) 0 !== e[o] ? (i > n && (t = r, n = i), r = null, i = 0) : (null === r && (r = o), ++i);
                        return i > n && (t = r, n = i), t
                    }(e), n = 0; n < 8; n++) i && 0 === e[n] || (i && (i = !1), r === n ? (t += n ? ":" : "::", i = !0) : (t += e[n].toString(16), n < 7 && (t += ":")));
                return "[" + t + "]"
            }
            return e
        },
        Mc = {},
        Nc = Gi({}, Mc, {
            " ": 1,
            '"': 1,
            "<": 1,
            ">": 1,
            "`": 1
        }),
        Bc = Gi({}, Nc, {
            "#": 1,
            "?": 1,
            "{": 1,
            "}": 1
        }),
        jc = Gi({}, Bc, {
            "/": 1,
            ":": 1,
            ";": 1,
            "=": 1,
            "@": 1,
            "[": 1,
            "\\": 1,
            "]": 1,
            "^": 1,
            "|": 1
        }),
        Fc = function(e, t) {
            var n = dc(e, 0);
            return n > 32 && n < 127 && !A(t, e) ? e : encodeURIComponent(e)
        },
        Uc = {
            ftp: 21,
            file: null,
            gopher: 70,
            http: 80,
            https: 443,
            ws: 80,
            wss: 443
        },
        Hc = function(e) {
            return A(Uc, e.scheme)
        },
        Gc = function(e) {
            return "" != e.username || "" != e.password
        },
        Wc = function(e) {
            return !e.host || e.cannotBeABaseURL || "file" == e.scheme
        },
        zc = function(e, t) {
            var n;
            return 2 == e.length && wc.test(e.charAt(0)) && (":" == (n = e.charAt(1)) || !t && "|" == n)
        },
        qc = function(e) {
            var t;
            return e.length > 1 && zc(e.slice(0, 2)) && (2 == e.length || "/" === (t = e.charAt(2)) || "\\" === t || "?" === t || "#" === t)
        },
        Vc = function(e) {
            var t = e.path,
                n = t.length;
            !n || "file" == e.scheme && 1 == n && zc(t[0], !0) || t.pop()
        },
        $c = function(e) {
            return "." === e || "%2e" === e.toLowerCase()
        },
        Kc = {},
        Xc = {},
        Yc = {},
        Jc = {},
        Zc = {},
        Qc = {},
        eu = {},
        tu = {},
        nu = {},
        ru = {},
        iu = {},
        ou = {},
        au = {},
        su = {},
        cu = {},
        uu = {},
        lu = {},
        fu = {},
        du = {},
        hu = {},
        pu = {},
        gu = function(e, t, n, r) {
            var i, o, a, s, c, u = n || Kc,
                l = 0,
                f = "",
                d = !1,
                h = !1,
                p = !1;
            for (n || (e.scheme = "", e.username = "", e.password = "", e.host = null, e.port = null, e.path = [], e.query = null, e.fragment = null, e.cannotBeABaseURL = !1, t = t.replace(_c, "")), t = t.replace(Oc, ""), i = Xr(t); l <= i.length;) {
                switch (o = i[l], u) {
                    case Kc:
                        if (!o || !wc.test(o)) {
                            if (n) return "Invalid scheme";
                            u = Yc;
                            continue
                        }
                        f += o.toLowerCase(), u = Xc;
                        break;
                    case Xc:
                        if (o && (xc.test(o) || "+" == o || "-" == o || "." == o)) f += o.toLowerCase();
                        else {
                            if (":" != o) {
                                if (n) return "Invalid scheme";
                                f = "", u = Yc, l = 0;
                                continue
                            }
                            if (n && (Hc(e) != A(Uc, f) || "file" == f && (Gc(e) || null !== e.port) || "file" == e.scheme && !e.host)) return;
                            if (e.scheme = f, n) return void(Hc(e) && Uc[e.scheme] == e.port && (e.port = null));
                            f = "", "file" == e.scheme ? u = su : Hc(e) && r && r.scheme == e.scheme ? u = Jc : Hc(e) ? u = tu : "/" == i[l + 1] ? (u = Zc, l++) : (e.cannotBeABaseURL = !0, e.path.push(""), u = du)
                        }
                        break;
                    case Yc:
                        if (!r || r.cannotBeABaseURL && "#" != o) return "Invalid scheme";
                        if (r.cannotBeABaseURL && "#" == o) {
                            e.scheme = r.scheme, e.path = r.path.slice(), e.query = r.query, e.fragment = "", e.cannotBeABaseURL = !0, u = pu;
                            break
                        }
                        u = "file" == r.scheme ? su : Qc;
                        continue;
                    case Jc:
                        if ("/" != o || "/" != i[l + 1]) {
                            u = Qc;
                            continue
                        }
                        u = nu, l++;
                        break;
                    case Zc:
                        if ("/" == o) {
                            u = ru;
                            break
                        }
                        u = fu;
                        continue;
                    case Qc:
                        if (e.scheme = r.scheme, o == lc) e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, e.path = r.path.slice(), e.query = r.query;
                        else if ("/" == o || "\\" == o && Hc(e)) u = eu;
                        else if ("?" == o) e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, e.path = r.path.slice(), e.query = "", u = hu;
                        else {
                            if ("#" != o) {
                                e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, e.path = r.path.slice(), e.path.pop(), u = fu;
                                continue
                            }
                            e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, e.path = r.path.slice(), e.query = r.query, e.fragment = "", u = pu
                        }
                        break;
                    case eu:
                        if (!Hc(e) || "/" != o && "\\" != o) {
                            if ("/" != o) {
                                e.username = r.username, e.password = r.password, e.host = r.host, e.port = r.port, u = fu;
                                continue
                            }
                            u = ru
                        } else u = nu;
                        break;
                    case tu:
                        if (u = nu, "/" != o || "/" != f.charAt(l + 1)) continue;
                        l++;
                        break;
                    case nu:
                        if ("/" != o && "\\" != o) {
                            u = ru;
                            continue
                        }
                        break;
                    case ru:
                        if ("@" == o) {
                            d && (f = "%40" + f), d = !0, a = Xr(f);
                            for (var g = 0; g < a.length; g++) {
                                var v = a[g];
                                if (":" != v || p) {
                                    var m = Fc(v, jc);
                                    p ? e.password += m : e.username += m
                                } else p = !0
                            }
                            f = ""
                        } else if (o == lc || "/" == o || "?" == o || "#" == o || "\\" == o && Hc(e)) {
                            if (d && "" == f) return "Invalid authority";
                            l -= Xr(f).length + 1, f = "", u = iu
                        } else f += o;
                        break;
                    case iu:
                    case ou:
                        if (n && "file" == e.scheme) {
                            u = uu;
                            continue
                        }
                        if (":" != o || h) {
                            if (o == lc || "/" == o || "?" == o || "#" == o || "\\" == o && Hc(e)) {
                                if (Hc(e) && "" == f) return "Invalid host";
                                if (n && "" == f && (Gc(e) || null !== e.port)) return;
                                if (s = Dc(e, f)) return s;
                                if (f = "", u = lu, n) return;
                                continue
                            }
                            "[" == o ? h = !0 : "]" == o && (h = !1), f += o
                        } else {
                            if ("" == f) return "Invalid host";
                            if (s = Dc(e, f)) return s;
                            if (f = "", u = au, n == ou) return
                        }
                        break;
                    case au:
                        if (!Tc.test(o)) {
                            if (o == lc || "/" == o || "?" == o || "#" == o || "\\" == o && Hc(e) || n) {
                                if ("" != f) {
                                    var y = parseInt(f, 10);
                                    if (y > 65535) return "Invalid port";
                                    e.port = Hc(e) && y === Uc[e.scheme] ? null : y, f = ""
                                }
                                if (n) return;
                                u = lu;
                                continue
                            }
                            return "Invalid port"
                        }
                        f += o;
                        break;
                    case su:
                        if (e.scheme = "file", "/" == o || "\\" == o) u = cu;
                        else {
                            if (!r || "file" != r.scheme) {
                                u = fu;
                                continue
                            }
                            if (o == lc) e.host = r.host, e.path = r.path.slice(), e.query = r.query;
                            else if ("?" == o) e.host = r.host, e.path = r.path.slice(), e.query = "", u = hu;
                            else {
                                if ("#" != o) {
                                    qc(i.slice(l).join("")) || (e.host = r.host, e.path = r.path.slice(), Vc(e)), u = fu;
                                    continue
                                }
                                e.host = r.host, e.path = r.path.slice(), e.query = r.query, e.fragment = "", u = pu
                            }
                        }
                        break;
                    case cu:
                        if ("/" == o || "\\" == o) {
                            u = uu;
                            break
                        }
                        r && "file" == r.scheme && !qc(i.slice(l).join("")) && (zc(r.path[0], !0) ? e.path.push(r.path[0]) : e.host = r.host), u = fu;
                        continue;
                    case uu:
                        if (o == lc || "/" == o || "\\" == o || "?" == o || "#" == o) {
                            if (!n && zc(f)) u = fu;
                            else if ("" == f) {
                                if (e.host = "", n) return;
                                u = lu
                            } else {
                                if (s = Dc(e, f)) return s;
                                if ("localhost" == e.host && (e.host = ""), n) return;
                                f = "", u = lu
                            }
                            continue
                        }
                        f += o;
                        break;
                    case lu:
                        if (Hc(e)) {
                            if (u = fu, "/" != o && "\\" != o) continue
                        } else if (n || "?" != o)
                            if (n || "#" != o) {
                                if (o != lc && (u = fu, "/" != o)) continue
                            } else e.fragment = "", u = pu;
                        else e.query = "", u = hu;
                        break;
                    case fu:
                        if (o == lc || "/" == o || "\\" == o && Hc(e) || !n && ("?" == o || "#" == o)) {
                            if (".." === (c = (c = f).toLowerCase()) || "%2e." === c || ".%2e" === c || "%2e%2e" === c ? (Vc(e), "/" == o || "\\" == o && Hc(e) || e.path.push("")) : $c(f) ? "/" == o || "\\" == o && Hc(e) || e.path.push("") : ("file" == e.scheme && !e.path.length && zc(f) && (e.host && (e.host = ""), f = f.charAt(0) + ":"), e.path.push(f)), f = "", "file" == e.scheme && (o == lc || "?" == o || "#" == o))
                                for (; e.path.length > 1 && "" === e.path[0];) e.path.shift();
                            "?" == o ? (e.query = "", u = hu) : "#" == o && (e.fragment = "", u = pu)
                        } else f += Fc(o, Bc);
                        break;
                    case du:
                        "?" == o ? (e.query = "", u = hu) : "#" == o ? (e.fragment = "", u = pu) : o != lc && (e.path[0] += Fc(o, Mc));
                        break;
                    case hu:
                        n || "#" != o ? o != lc && ("'" == o && Hc(e) ? e.query += "%27" : e.query += "#" == o ? "%23" : Fc(o, Mc)) : (e.fragment = "", u = pu);
                        break;
                    case pu:
                        o != lc && (e.fragment += Fc(o, Nc))
                }
                l++
            }
        },
        vu = function(e) {
            var t, n, r = ht(this, vu, "URL"),
                i = arguments.length > 1 ? arguments[1] : void 0,
                o = String(e),
                a = vc(r, {
                    type: "URL"
                });
            if (void 0 !== i)
                if (i instanceof vu) t = mc(i);
                else if (n = gu(t = {}, String(i))) throw TypeError(n);
            if (n = gu(a, o, null, t)) throw TypeError(n);
            var s = a.searchParams = new pc,
                c = gc(s);
            c.updateSearchParams(a.query), c.updateURL = function() {
                a.query = String(s) || null
            }, l || (r.href = yu.call(r), r.origin = bu.call(r), r.protocol = wu.call(r), r.username = xu.call(r), r.password = Tu.call(r), r.host = Su.call(r), r.hostname = Eu.call(r), r.port = Au.call(r), r.pathname = Cu.call(r), r.search = ku.call(r), r.searchParams = Lu.call(r), r.hash = _u.call(r))
        },
        mu = vu.prototype,
        yu = function() {
            var e = mc(this),
                t = e.scheme,
                n = e.username,
                r = e.password,
                i = e.host,
                o = e.port,
                a = e.path,
                s = e.query,
                c = e.fragment,
                u = t + ":";
            return null !== i ? (u += "//", Gc(e) && (u += n + (r ? ":" + r : "") + "@"), u += Ic(i), null !== o && (u += ":" + o)) : "file" == t && (u += "//"), u += e.cannotBeABaseURL ? a[0] : a.length ? "/" + a.join("/") : "", null !== s && (u += "?" + s), null !== c && (u += "#" + c), u
        },
        bu = function() {
            var e = mc(this),
                t = e.scheme,
                n = e.port;
            if ("blob" == t) try {
                return new URL(t.path[0]).origin
            } catch (e) {
                return "null"
            }
            return "file" != t && Hc(e) ? t + "://" + Ic(e.host) + (null !== n ? ":" + n : "") : "null"
        },
        wu = function() {
            return mc(this).scheme + ":"
        },
        xu = function() {
            return mc(this).username
        },
        Tu = function() {
            return mc(this).password
        },
        Su = function() {
            var e = mc(this),
                t = e.host,
                n = e.port;
            return null === t ? "" : null === n ? Ic(t) : Ic(t) + ":" + n
        },
        Eu = function() {
            var e = mc(this).host;
            return null === e ? "" : Ic(e)
        },
        Au = function() {
            var e = mc(this).port;
            return null === e ? "" : String(e)
        },
        Cu = function() {
            var e = mc(this),
                t = e.path;
            return e.cannotBeABaseURL ? t[0] : t.length ? "/" + t.join("/") : ""
        },
        ku = function() {
            var e = mc(this).query;
            return e ? "?" + e : ""
        },
        Lu = function() {
            return mc(this).searchParams
        },
        _u = function() {
            var e = mc(this).fragment;
            return e ? "#" + e : ""
        },
        Ou = function(e, t) {
            return {
                get: e,
                set: t,
                configurable: !0,
                enumerable: !0
            }
        };
    if (l && Ur(mu, {
            href: Ou(yu, function(e) {
                var t = mc(this),
                    n = String(e),
                    r = gu(t, n);
                if (r) throw TypeError(r);
                gc(t.searchParams).updateSearchParams(t.query)
            }),
            origin: Ou(bu),
            protocol: Ou(wu, function(e) {
                var t = mc(this);
                gu(t, String(e) + ":", Kc)
            }),
            username: Ou(xu, function(e) {
                var t = mc(this),
                    n = Xr(String(e));
                if (!Wc(t)) {
                    t.username = "";
                    for (var r = 0; r < n.length; r++) t.username += Fc(n[r], jc)
                }
            }),
            password: Ou(Tu, function(e) {
                var t = mc(this),
                    n = Xr(String(e));
                if (!Wc(t)) {
                    t.password = "";
                    for (var r = 0; r < n.length; r++) t.password += Fc(n[r], jc)
                }
            }),
            host: Ou(Su, function(e) {
                var t = mc(this);
                t.cannotBeABaseURL || gu(t, String(e), iu)
            }),
            hostname: Ou(Eu, function(e) {
                var t = mc(this);
                t.cannotBeABaseURL || gu(t, String(e), ou)
            }),
            port: Ou(Au, function(e) {
                var t = mc(this);
                Wc(t) || ("" == (e = String(e)) ? t.port = null : gu(t, e, au))
            }),
            pathname: Ou(Cu, function(e) {
                var t = mc(this);
                t.cannotBeABaseURL || (t.path = [], gu(t, e + "", lu))
            }),
            search: Ou(ku, function(e) {
                var t = mc(this);
                "" == (e = String(e)) ? t.query = null: ("?" == e.charAt(0) && (e = e.slice(1)), t.query = "", gu(t, e, hu)), gc(t.searchParams).updateSearchParams(t.query)
            }),
            searchParams: Ou(Lu),
            hash: Ou(_u, function(e) {
                var t = mc(this);
                "" != (e = String(e)) ? ("#" == e.charAt(0) && (e = e.slice(1)), t.fragment = "", gu(t, e, pu)) : t.fragment = null
            })
        }), ee(mu, "toJSON", function() {
            return yu.call(this)
        }, {
            enumerable: !0
        }), ee(mu, "toString", function() {
            return yu.call(this)
        }, {
            enumerable: !0
        }), hc) {
        var Du = hc.createObjectURL,
            Pu = hc.revokeObjectURL;
        Du && ee(vu, "createObjectURL", function(e) {
            return Du.apply(hc, arguments)
        }), Pu && ee(vu, "revokeObjectURL", function(e) {
            return Pu.apply(hc, arguments)
        })
    }
    lt(vu, "URL"), Oe({
        global: !0,
        forced: !Ms,
        sham: !l
    }, {
        URL: vu
    });
    var Ru = {
        debug: !1,
        asm: !1,
        lang: "en",
        logLevel: 1,
        ssid: "",
        noMobileCheck: !1,
        showfps: !1,
        vsync: -1,
        crashMode: !1,
        redirectNoAuth: "",
        preload: []
    };
    var Iu = {
        regular: !0,
        title: "IQ Option",
        resourceHost: "https://static.cdnpub.info/traderoom",
        contactUrl: "",
        iosAppLink: "",
        androidAppLink: "",
        version: "1632.5.2413.release",
        firebase: {
            prod: {
                apiKey: "AIzaSyBjatIMOVD9Vq5ELiStrceql9p9KhE48bw",
                authDomain: "forward-ellipse-586.firebaseapp.com",
                databaseURL: "https://forward-ellipse-586.firebaseio.com",
                projectId: "forward-ellipse-586",
                storageBucket: "forward-ellipse-586.appspot.com",
                messagingSenderId: "45352563960"
            },
            int: {
                apiKey: "AIzaSyAsrFR7eUaHpyauZU-Kw3g5NJ-UCGqwxcM",
                authDomain: "iq-option-dev-974fd.firebaseapp.com",
                databaseURL: "https://iq-option-dev-974fd.firebaseio.com",
                projectId: "iq-option-dev-974fd",
                storageBucket: "iq-option-dev-974fd.appspot.com",
                messagingSenderId: "553547855105"
            }
        },
        workers: {
            prod: "/traderoom/service-worker.js",
            int: "/traderoom/service-worker-int.js"
        },
        platform: {
            web: 9,
            webMobile: 18,
            android: 85,
            iphone: 86
        }
    };
    var Mu = n(function(e, t) {
            var n;
            n = function() {
                function e() {
                    for (var e = arguments, t = 0, n = {}; t < arguments.length; t++) {
                        var r = e[t];
                        for (var i in r) n[i] = r[i]
                    }
                    return n
                }

                function t(e) {
                    return e.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent)
                }
                return function n(r) {
                    function i() {}

                    function o(t, n, o) {
                        if ("undefined" != typeof document) {
                            "number" == typeof(o = e({
                                path: "/"
                            }, i.defaults, o)).expires && (o.expires = new Date(1 * new Date + 864e5 * o.expires)), o.expires = o.expires ? o.expires.toUTCString() : "";
                            try {
                                var a = JSON.stringify(n);
                                /^[\{\[]/.test(a) && (n = a)
                            } catch (e) {}
                            n = r.write ? r.write(n, t) : encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), t = encodeURIComponent(String(t)).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent).replace(/[\(\)]/g, escape);
                            var s = "";
                            for (var c in o) o[c] && (s += "; " + c, !0 !== o[c] && (s += "=" + o[c].split(";")[0]));
                            return document.cookie = t + "=" + n + s
                        }
                    }

                    function a(e, n) {
                        if ("undefined" != typeof document) {
                            for (var i = {}, o = document.cookie ? document.cookie.split("; ") : [], a = 0; a < o.length; a++) {
                                var s = o[a].split("="),
                                    c = s.slice(1).join("=");
                                n || '"' !== c.charAt(0) || (c = c.slice(1, -1));
                                try {
                                    var u = t(s[0]);
                                    if (c = (r.read || r)(c, u) || t(c), n) try {
                                        c = JSON.parse(c)
                                    } catch (e) {}
                                    if (i[u] = c, e === u) break
                                } catch (e) {}
                            }
                            return e ? i[e] : i
                        }
                    }
                    return i.set = o, i.get = function(e) {
                        return a(e, !1)
                    }, i.getJSON = function(e) {
                        return a(e, !0)
                    }, i.remove = function(t, n) {
                        o(t, "", e(n, {
                            expires: -1
                        }))
                    }, i.defaults = {}, i.withConverter = n, i
                }(function() {})
            }, e.exports = n()
        }),
        Nu = [];

    function Bu(e, t) {
        var n;
        void 0 === t && (t = fo);
        var r = [];

        function i(t) {
            if (mo(e, t) && (e = t, n)) {
                for (var i = !Nu.length, o = 0; o < r.length; o += 1) {
                    var a = r[o];
                    a[1](), Nu.push(a, e)
                }
                if (i) {
                    for (var s = 0; s < Nu.length; s += 2) Nu[s][0](Nu[s + 1]);
                    Nu.length = 0
                }
            }
        }
        return {
            set: i,
            update: function(t) {
                i(t(e))
            },
            subscribe: function(o, a) {
                void 0 === a && (a = fo);
                var s = [o, a];
                return r.push(s), 1 === r.length && (n = t(i) || fo), o(e),
                    function() {
                        var e = r.indexOf(s); - 1 !== e && r.splice(e, 1), 0 === r.length && (n(), n = null)
                    }
            }
        }
    }
    var ju = Bu(0),
        Fu = Bu(14),
        Uu = Bu(!1),
        Hu = Bu("Downloading..."),
        Gu = Bu(!1);

    function Wu(e) {
        var t = window.location.hostname,
            n = "single",
            r = {
                "eu.iqoption.com": "iqoption.com"
            };
        r.hasOwnProperty(t) && (t = r[t]), Array.isArray(e) && (n = "bulk"), fetch("https://event." + t + "/api/v1/events", {
            method: "POST",
            body: JSON.stringify(e),
            headers: {
                "X-Action": n,
                "Content-Type": "application/json"
            }
        }).catch(function(e) {
            console.error("Failed to send event", e)
        })
    }
    var zu, qu = I.f,
        Vu = c.DataView,
        $u = Vu && Vu.prototype,
        Ku = c.Int8Array,
        Xu = Ku && Ku.prototype,
        Yu = c.Uint8ClampedArray,
        Ju = Yu && Yu.prototype,
        Zu = Ku && ri(Ku),
        Qu = Xu && ri(Xu),
        el = Object.prototype,
        tl = el.isPrototypeOf,
        nl = je("toStringTag"),
        rl = W("TYPED_ARRAY_TAG"),
        il = !(!c.ArrayBuffer || !Vu),
        ol = il && !!li && "Opera" !== nt(c.opera),
        al = !1,
        sl = {
            Int8Array: 1,
            Uint8Array: 1,
            Uint8ClampedArray: 1,
            Int16Array: 2,
            Uint16Array: 2,
            Int32Array: 4,
            Uint32Array: 4,
            Float32Array: 4,
            Float64Array: 8
        },
        cl = function(e) {
            return T(e) && A(sl, nt(e))
        };
    for (zu in sl) c[zu] || (ol = !1);
    if ((!ol || "function" != typeof Zu || Zu === Function.prototype) && (Zu = function() {
            throw TypeError("Incorrect invocation")
        }, ol))
        for (zu in sl) c[zu] && li(c[zu], Zu);
    if ((!ol || !Qu || Qu === el) && (Qu = Zu.prototype, ol))
        for (zu in sl) c[zu] && li(c[zu].prototype, Qu);
    if (ol && ri(Ju) !== Qu && li(Ju, Qu), l && !A(Qu, nl))
        for (zu in al = !0, qu(Qu, nl, {
                get: function() {
                    return T(this) ? this[rl] : void 0
                }
            }), sl) c[zu] && M(c[zu], rl, zu);
    il && li && ri($u) !== el && li($u, el);
    var ul = {
            NATIVE_ARRAY_BUFFER: il,
            NATIVE_ARRAY_BUFFER_VIEWS: ol,
            TYPED_ARRAY_TAG: al && rl,
            aTypedArray: function(e) {
                if (cl(e)) return e;
                throw TypeError("Target is not a typed array")
            },
            aTypedArrayConstructor: function(e) {
                if (li) {
                    if (tl.call(Zu, e)) return e
                } else
                    for (var t in sl)
                        if (A(sl, zu)) {
                            var n = c[t];
                            if (n && (e === n || tl.call(n, e))) return e
                        } throw TypeError("Target is not a typed array constructor")
            },
            exportProto: function(e, t, n) {
                if (l) {
                    if (n)
                        for (var r in sl) {
                            var i = c[r];
                            i && A(i.prototype, e) && delete i.prototype[e]
                        }
                    Qu[e] && !n || ee(Qu, e, n ? t : ol && Xu[e] || t)
                }
            },
            exportStatic: function(e, t, n) {
                var r, i;
                if (l) {
                    if (li) {
                        if (n)
                            for (r in sl)(i = c[r]) && A(i, e) && delete i[e];
                        if (Zu[e] && !n) return;
                        try {
                            return ee(Zu, e, n ? t : ol && Ku[e] || t)
                        } catch (e) {}
                    }
                    for (r in sl) !(i = c[r]) || i[e] && !n || ee(i, e, t)
                }
            },
            isView: function(e) {
                var t = nt(e);
                return "DataView" === t || A(sl, t)
            },
            isTypedArray: cl,
            TypedArray: Zu,
            TypedArrayPrototype: Qu
        },
        ll = function(e) {
            if (void 0 === e) return 0;
            var t = ae(e),
                n = ce(t);
            if (t !== n) throw RangeError("Wrong length or index");
            return n
        },
        fl = n(function(e, t) {
            var n = ul.NATIVE_ARRAY_BUFFER,
                r = ye.f,
                i = I.f,
                o = Q.get,
                a = Q.set,
                s = c.ArrayBuffer,
                f = s,
                d = c.DataView,
                h = c.Math,
                p = c.RangeError,
                g = h.abs,
                v = h.pow,
                m = h.floor,
                y = h.log,
                b = h.LN2,
                w = function(e, t, n) {
                    var r, i, o, a = new Array(n),
                        s = 8 * n - t - 1,
                        c = (1 << s) - 1,
                        u = c >> 1,
                        l = 23 === t ? v(2, -24) - v(2, -77) : 0,
                        f = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0,
                        d = 0;
                    for ((e = g(e)) != e || e === 1 / 0 ? (i = e != e ? 1 : 0, r = c) : (r = m(y(e) / b), e * (o = v(2, -r)) < 1 && (r--, o *= 2), (e += r + u >= 1 ? l / o : l * v(2, 1 - u)) * o >= 2 && (r++, o /= 2), r + u >= c ? (i = 0, r = c) : r + u >= 1 ? (i = (e * o - 1) * v(2, t), r += u) : (i = e * v(2, u - 1) * v(2, t), r = 0)); t >= 8; a[d++] = 255 & i, i /= 256, t -= 8);
                    for (r = r << t | i, s += t; s > 0; a[d++] = 255 & r, r /= 256, s -= 8);
                    return a[--d] |= 128 * f, a
                },
                x = function(e, t) {
                    var n, r = e.length,
                        i = 8 * r - t - 1,
                        o = (1 << i) - 1,
                        a = o >> 1,
                        s = i - 7,
                        c = r - 1,
                        u = e[c--],
                        l = 127 & u;
                    for (u >>= 7; s > 0; l = 256 * l + e[c], c--, s -= 8);
                    for (n = l & (1 << -s) - 1, l >>= -s, s += t; s > 0; n = 256 * n + e[c], c--, s -= 8);
                    if (0 === l) l = 1 - a;
                    else {
                        if (l === o) return n ? NaN : u ? -1 / 0 : 1 / 0;
                        n += v(2, t), l -= a
                    }
                    return (u ? -1 : 1) * n * v(2, l - t)
                },
                T = function(e) {
                    return e[3] << 24 | e[2] << 16 | e[1] << 8 | e[0]
                },
                S = function(e) {
                    return [255 & e]
                },
                E = function(e) {
                    return [255 & e, e >> 8 & 255]
                },
                A = function(e) {
                    return [255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255]
                },
                C = function(e) {
                    return w(e, 23, 4)
                },
                k = function(e) {
                    return w(e, 52, 8)
                },
                L = function(e, t) {
                    i(e.prototype, t, {
                        get: function() {
                            return o(this)[t]
                        }
                    })
                },
                _ = function(e, t, n, r) {
                    var i = ll(+n),
                        a = o(e);
                    if (i + t > a.byteLength) throw p("Wrong index");
                    var s = o(a.buffer).bytes,
                        c = i + a.byteOffset,
                        u = s.slice(c, c + t);
                    return r ? u : u.reverse()
                },
                O = function(e, t, n, r, i, a) {
                    var s = ll(+n),
                        c = o(e);
                    if (s + t > c.byteLength) throw p("Wrong index");
                    for (var u = o(c.buffer).bytes, l = s + c.byteOffset, f = r(+i), d = 0; d < t; d++) u[l + d] = f[a ? d : t - d - 1]
                };
            if (n) {
                if (!u(function() {
                        s(1)
                    }) || !u(function() {
                        new s(-1)
                    }) || u(function() {
                        return new s, new s(1.5), new s(NaN), "ArrayBuffer" != s.name
                    })) {
                    for (var D, P = (f = function(e) {
                            return ht(this, f), new s(ll(e))
                        }).prototype = s.prototype, R = r(s), N = 0; R.length > N;)(D = R[N++]) in f || M(f, D, s[D]);
                    P.constructor = f
                }
                var B = new d(new f(2)),
                    j = d.prototype.setInt8;
                B.setInt8(0, 2147483648), B.setInt8(1, 2147483649), !B.getInt8(0) && B.getInt8(1) || st(d.prototype, {
                    setInt8: function(e, t) {
                        j.call(this, e, t << 24 >> 24)
                    },
                    setUint8: function(e, t) {
                        j.call(this, e, t << 24 >> 24)
                    }
                }, {
                    unsafe: !0
                })
            } else f = function(e) {
                ht(this, f, "ArrayBuffer");
                var t = ll(e);
                a(this, {
                    bytes: jr.call(new Array(t), 0),
                    byteLength: t
                }), l || (this.byteLength = t)
            }, d = function(e, t, n) {
                ht(this, d, "DataView"), ht(e, f, "DataView");
                var r = o(e).byteLength,
                    i = ae(t);
                if (i < 0 || i > r) throw p("Wrong offset");
                if (i + (n = void 0 === n ? r - i : ce(n)) > r) throw p("Wrong length");
                a(this, {
                    buffer: e,
                    byteLength: n,
                    byteOffset: i
                }), l || (this.buffer = e, this.byteLength = n, this.byteOffset = i)
            }, l && (L(f, "byteLength"), L(d, "buffer"), L(d, "byteLength"), L(d, "byteOffset")), st(d.prototype, {
                getInt8: function(e) {
                    return _(this, 1, e)[0] << 24 >> 24
                },
                getUint8: function(e) {
                    return _(this, 1, e)[0]
                },
                getInt16: function(e) {
                    var t = _(this, 2, e, arguments.length > 1 ? arguments[1] : void 0);
                    return (t[1] << 8 | t[0]) << 16 >> 16
                },
                getUint16: function(e) {
                    var t = _(this, 2, e, arguments.length > 1 ? arguments[1] : void 0);
                    return t[1] << 8 | t[0]
                },
                getInt32: function(e) {
                    return T(_(this, 4, e, arguments.length > 1 ? arguments[1] : void 0))
                },
                getUint32: function(e) {
                    return T(_(this, 4, e, arguments.length > 1 ? arguments[1] : void 0)) >>> 0
                },
                getFloat32: function(e) {
                    return x(_(this, 4, e, arguments.length > 1 ? arguments[1] : void 0), 23)
                },
                getFloat64: function(e) {
                    return x(_(this, 8, e, arguments.length > 1 ? arguments[1] : void 0), 52)
                },
                setInt8: function(e, t) {
                    O(this, 1, e, S, t)
                },
                setUint8: function(e, t) {
                    O(this, 1, e, S, t)
                },
                setInt16: function(e, t) {
                    O(this, 2, e, E, t, arguments.length > 2 ? arguments[2] : void 0)
                },
                setUint16: function(e, t) {
                    O(this, 2, e, E, t, arguments.length > 2 ? arguments[2] : void 0)
                },
                setInt32: function(e, t) {
                    O(this, 4, e, A, t, arguments.length > 2 ? arguments[2] : void 0)
                },
                setUint32: function(e, t) {
                    O(this, 4, e, A, t, arguments.length > 2 ? arguments[2] : void 0)
                },
                setFloat32: function(e, t) {
                    O(this, 4, e, C, t, arguments.length > 2 ? arguments[2] : void 0)
                },
                setFloat64: function(e, t) {
                    O(this, 8, e, k, t, arguments.length > 2 ? arguments[2] : void 0)
                }
            });
            lt(f, "ArrayBuffer"), lt(d, "DataView"), t.ArrayBuffer = f, t.DataView = d
        }),
        dl = fl.ArrayBuffer,
        hl = fl.DataView,
        pl = dl.prototype.slice,
        gl = u(function() {
            return !new dl(2).slice(1, void 0).byteLength
        });
    Oe({
        target: "ArrayBuffer",
        proto: !0,
        unsafe: !0,
        forced: gl
    }, {
        slice: function(e, t) {
            if (void 0 !== pl && void 0 === t) return pl.call(P(this), e);
            for (var n = P(this).byteLength, r = fe(e, n), i = fe(void 0 === t ? n : t, n), o = new(Dt(this, dl))(ce(i - r)), a = new hl(this), s = new hl(o), c = 0; r < i;) s.setUint8(c++, a.getUint8(r++));
            return o
        }
    });
    var vl = ul.NATIVE_ARRAY_BUFFER_VIEWS,
        ml = c.ArrayBuffer,
        yl = c.Int8Array,
        bl = !vl || !u(function() {
            yl(1)
        }) || !u(function() {
            new yl(-1)
        }) || !_t(function(e) {
            new yl, new yl(null), new yl(1.5), new yl(e)
        }, !0) || u(function() {
            return 1 !== new yl(new ml(2), 1, void 0).length
        }),
        wl = function(e, t) {
            var n = ae(e);
            if (n < 0 || n % t) throw RangeError("Wrong offset");
            return n
        },
        xl = ul.aTypedArrayConstructor,
        Tl = function(e) {
            var t, n, r, i, o, a = Re(e),
                s = arguments.length,
                c = s > 1 ? arguments[1] : void 0,
                u = void 0 !== c,
                l = bt(a);
            if (null != l && !mt(l))
                for (o = l.call(a), a = []; !(i = o.next()).done;) a.push(i.value);
            for (u && s > 2 && (c = Pe(c, arguments[2], 2)), n = ce(a.length), r = new(xl(this))(n), t = 0; n > t; t++) r[t] = u ? c(a[t], t) : a[t];
            return r
        },
        Sl = n(function(e) {
            var t = ye.f,
                n = We.forEach,
                r = Q.get,
                i = Q.set,
                o = I.f,
                a = D.f,
                s = Math.round,
                u = c.RangeError,
                f = fl.ArrayBuffer,
                d = fl.DataView,
                h = ul.NATIVE_ARRAY_BUFFER_VIEWS,
                p = ul.TYPED_ARRAY_TAG,
                v = ul.TypedArray,
                m = ul.TypedArrayPrototype,
                y = ul.aTypedArrayConstructor,
                b = ul.isTypedArray,
                w = function(e, t) {
                    for (var n = 0, r = t.length, i = new(y(e))(r); r > n;) i[n] = t[n++];
                    return i
                },
                x = function(e, t) {
                    o(e, t, {
                        get: function() {
                            return r(this)[t]
                        }
                    })
                },
                E = function(e) {
                    var t;
                    return e instanceof f || "ArrayBuffer" == (t = nt(e)) || "SharedArrayBuffer" == t
                },
                C = function(e, t) {
                    return b(e) && "symbol" != typeof t && t in e && String(+t) == String(t)
                },
                k = function(e, t) {
                    return C(e, t = S(t, !0)) ? g(2, e[t]) : a(e, t)
                },
                L = function(e, t, n) {
                    return !(C(e, t = S(t, !0)) && T(n) && A(n, "value")) || A(n, "get") || A(n, "set") || n.configurable || A(n, "writable") && !n.writable || A(n, "enumerable") && !n.enumerable ? o(e, t, n) : (e[t] = n.value, e)
                };
            l ? (h || (D.f = k, I.f = L, x(m, "buffer"), x(m, "byteOffset"), x(m, "byteLength"), x(m, "length")), Oe({
                target: "Object",
                stat: !0,
                forced: !h
            }, {
                getOwnPropertyDescriptor: k,
                defineProperty: L
            }), e.exports = function(e, a, l, g) {
                var y = e + (g ? "Clamped" : "") + "Array",
                    x = "get" + e,
                    S = "set" + e,
                    A = c[y],
                    C = A,
                    k = C && C.prototype,
                    L = {},
                    _ = function(e, t) {
                        o(e, t, {
                            get: function() {
                                return function(e, t) {
                                    var n = r(e);
                                    return n.view[x](t * a + n.byteOffset, !0)
                                }(this, t)
                            },
                            set: function(e) {
                                return function(e, t, n) {
                                    var i = r(e);
                                    g && (n = (n = s(n)) < 0 ? 0 : n > 255 ? 255 : 255 & n), i.view[S](t * a + i.byteOffset, n, !0)
                                }(this, t, e)
                            },
                            enumerable: !0
                        })
                    };
                h ? bl && (C = l(function(e, t, n, r) {
                    return ht(e, C, y), T(t) ? E(t) ? void 0 !== r ? new A(t, wl(n, a), r) : void 0 !== n ? new A(t, wl(n, a)) : new A(t) : b(t) ? w(C, t) : Tl.call(C, t) : new A(ll(t))
                }), li && li(C, v), n(t(A), function(e) {
                    e in C || M(C, e, A[e])
                }), C.prototype = k) : (C = l(function(e, t, n, r) {
                    ht(e, C, y);
                    var o, s, c, l = 0,
                        h = 0;
                    if (T(t)) {
                        if (!E(t)) return b(t) ? w(C, t) : Tl.call(C, t);
                        o = t, h = wl(n, a);
                        var p = t.byteLength;
                        if (void 0 === r) {
                            if (p % a) throw u("Wrong length");
                            if ((s = p - h) < 0) throw u("Wrong length")
                        } else if ((s = ce(r) * a) + h > p) throw u("Wrong length");
                        c = s / a
                    } else c = ll(t), o = new f(s = c * a);
                    for (i(e, {
                            buffer: o,
                            byteOffset: h,
                            byteLength: s,
                            length: c,
                            view: new d(o)
                        }); l < c;) _(e, l++)
                }), li && li(C, v), k = C.prototype = zr(m)), k.constructor !== C && M(k, "constructor", C), p && M(k, p, y), L[y] = C, Oe({
                    global: !0,
                    forced: C != A,
                    sham: !h
                }, L), "BYTES_PER_ELEMENT" in C || M(C, "BYTES_PER_ELEMENT", a), "BYTES_PER_ELEMENT" in k || M(k, "BYTES_PER_ELEMENT", a), dt(y)
            }) : e.exports = function() {}
        });
    Sl("Uint8", 1, function(e) {
        return function(t, n, r) {
            return e(this, t, n, r)
        }
    });
    var El = Math.min,
        Al = [].copyWithin || function(e, t) {
            var n = Re(this),
                r = ce(n.length),
                i = fe(e, r),
                o = fe(t, r),
                a = arguments.length > 2 ? arguments[2] : void 0,
                s = El((void 0 === a ? r : fe(a, r)) - o, r - i),
                c = 1;
            for (o < i && i < o + s && (c = -1, o += s - 1, i += s - 1); s-- > 0;) o in n ? n[i] = n[o] : delete n[i], i += c, o += c;
            return n
        },
        Cl = ul.aTypedArray;
    ul.exportProto("copyWithin", function(e, t) {
        return Al.call(Cl(this), e, t, arguments.length > 2 ? arguments[2] : void 0)
    });
    var kl = We.every,
        Ll = ul.aTypedArray;
    ul.exportProto("every", function(e) {
        return kl(Ll(this), e, arguments.length > 1 ? arguments[1] : void 0)
    });
    var _l = ul.aTypedArray;
    ul.exportProto("fill", function(e) {
        return jr.apply(_l(this), arguments)
    });
    var Ol = We.filter,
        Dl = ul.aTypedArray,
        Pl = ul.aTypedArrayConstructor;
    ul.exportProto("filter", function(e) {
        for (var t = Ol(Dl(this), e, arguments.length > 1 ? arguments[1] : void 0), n = Dt(this, this.constructor), r = 0, i = t.length, o = new(Pl(n))(i); i > r;) o[r] = t[r++];
        return o
    });
    var Rl = We.find,
        Il = ul.aTypedArray;
    ul.exportProto("find", function(e) {
        return Rl(Il(this), e, arguments.length > 1 ? arguments[1] : void 0)
    });
    var Ml = We.findIndex,
        Nl = ul.aTypedArray;
    ul.exportProto("findIndex", function(e) {
        return Ml(Nl(this), e, arguments.length > 1 ? arguments[1] : void 0)
    });
    var Bl = We.forEach,
        jl = ul.aTypedArray;
    ul.exportProto("forEach", function(e) {
        Bl(jl(this), e, arguments.length > 1 ? arguments[1] : void 0)
    });
    var Fl = he.includes,
        Ul = ul.aTypedArray;
    ul.exportProto("includes", function(e) {
        return Fl(Ul(this), e, arguments.length > 1 ? arguments[1] : void 0)
    });
    var Hl = he.indexOf,
        Gl = ul.aTypedArray;
    ul.exportProto("indexOf", function(e) {
        return Hl(Gl(this), e, arguments.length > 1 ? arguments[1] : void 0)
    });
    var Wl = je("iterator"),
        zl = c.Uint8Array,
        ql = yi.values,
        Vl = yi.keys,
        $l = yi.entries,
        Kl = ul.aTypedArray,
        Xl = ul.exportProto,
        Yl = zl && zl.prototype[Wl],
        Jl = !!Yl && ("values" == Yl.name || null == Yl.name),
        Zl = function() {
            return ql.call(Kl(this))
        };
    Xl("entries", function() {
        return $l.call(Kl(this))
    }), Xl("keys", function() {
        return Vl.call(Kl(this))
    }), Xl("values", Zl, !Jl), Xl(Wl, Zl, !Jl);
    var Ql = ul.aTypedArray,
        ef = [].join;
    ul.exportProto("join", function(e) {
        return ef.apply(Ql(this), arguments)
    });
    var tf = Math.min,
        nf = [].lastIndexOf,
        rf = !!nf && 1 / [1].lastIndexOf(1, -0) < 0,
        of = ze("lastIndexOf"),
        af = rf || of ? function(e) {
            if (rf) return nf.apply(this, arguments) || 0;
            var t = x(this),
                n = ce(t.length),
                r = n - 1;
            for (arguments.length > 1 && (r = tf(r, ae(arguments[1]))), r < 0 && (r = n + r); r >= 0; r--)
                if (r in t && t[r] === e) return r || 0;
            return -1
        } : nf,
        sf = ul.aTypedArray;
    ul.exportProto("lastIndexOf", function(e) {
        return af.apply(sf(this), arguments)
    });
    var cf = We.map,
        uf = ul.aTypedArray,
        lf = ul.aTypedArrayConstructor;
    ul.exportProto("map", function(e) {
        return cf(uf(this), e, arguments.length > 1 ? arguments[1] : void 0, function(e, t) {
            return new(lf(Dt(e, e.constructor)))(t)
        })
    });
    var ff = function(e) {
            return function(t, n, r, i) {
                De(n);
                var o = Re(t),
                    a = b(o),
                    s = ce(o.length),
                    c = e ? s - 1 : 0,
                    u = e ? -1 : 1;
                if (r < 2)
                    for (;;) {
                        if (c in a) {
                            i = a[c], c += u;
                            break
                        }
                        if (c += u, e ? c < 0 : s <= c) throw TypeError("Reduce of empty array with no initial value")
                    }
                for (; e ? c >= 0 : s > c; c += u) c in a && (i = n(i, a[c], c, o));
                return i
            }
        },
        df = {
            left: ff(!1),
            right: ff(!0)
        },
        hf = df.left,
        pf = ul.aTypedArray;
    ul.exportProto("reduce", function(e) {
        return hf(pf(this), e, arguments.length, arguments.length > 1 ? arguments[1] : void 0)
    });
    var gf = df.right,
        vf = ul.aTypedArray;
    ul.exportProto("reduceRight", function(e) {
        return gf(vf(this), e, arguments.length, arguments.length > 1 ? arguments[1] : void 0)
    });
    var mf = ul.aTypedArray,
        yf = Math.floor;
    ul.exportProto("reverse", function() {
        for (var e, t = mf(this).length, n = yf(t / 2), r = 0; r < n;) e = this[r], this[r++] = this[--t], this[t] = e;
        return this
    });
    var bf = ul.aTypedArray,
        wf = u(function() {
            new Int8Array(1).set({})
        });
    ul.exportProto("set", function(e) {
        bf(this);
        var t = wl(arguments.length > 1 ? arguments[1] : void 0, 1),
            n = this.length,
            r = Re(e),
            i = ce(r.length),
            o = 0;
        if (i + t > n) throw RangeError("Wrong length");
        for (; o < i;) this[t + o] = r[o++]
    }, wf);
    var xf = ul.aTypedArray,
        Tf = ul.aTypedArrayConstructor,
        Sf = [].slice,
        Ef = u(function() {
            new Int8Array(1).slice()
        });
    ul.exportProto("slice", function(e, t) {
        for (var n = Sf.call(xf(this), e, t), r = Dt(this, this.constructor), i = 0, o = n.length, a = new(Tf(r))(o); o > i;) a[i] = n[i++];
        return a
    }, Ef);
    var Af = We.some,
        Cf = ul.aTypedArray;
    ul.exportProto("some", function(e) {
        return Af(Cf(this), e, arguments.length > 1 ? arguments[1] : void 0)
    });
    var kf = ul.aTypedArray,
        Lf = [].sort;
    ul.exportProto("sort", function(e) {
        return Lf.call(kf(this), e)
    });
    var _f = ul.aTypedArray;
    ul.exportProto("subarray", function(e, t) {
        var n = _f(this),
            r = n.length,
            i = fe(e, r);
        return new(Dt(n, n.constructor))(n.buffer, n.byteOffset + i * n.BYTES_PER_ELEMENT, ce((void 0 === t ? r : fe(t, r)) - i))
    });
    var Of = c.Int8Array,
        Df = ul.aTypedArray,
        Pf = [].toLocaleString,
        Rf = [].slice,
        If = !!Of && u(function() {
            Pf.call(new Of(1))
        }),
        Mf = u(function() {
            return [1, 2].toLocaleString() != new Of([1, 2]).toLocaleString()
        }) || !u(function() {
            Of.prototype.toLocaleString.call([1, 2])
        });
    ul.exportProto("toLocaleString", function() {
        return Pf.apply(If ? Rf.call(Df(this)) : Df(this), arguments)
    }, Mf);
    var Nf = c.Uint8Array,
        Bf = Nf && Nf.prototype,
        jf = [].toString,
        Ff = [].join;
    u(function() {
        jf.call({})
    }) && (jf = function() {
        return Ff.call(this)
    }), ul.exportProto("toString", jf, (Bf || {}).toString != jf);
    var Uf = We.find,
        Hf = !0;
    "find" in [] && Array(1).find(function() {
        Hf = !1
    }), Oe({
        target: "Array",
        proto: !0,
        forced: Hf
    }, {
        find: function(e) {
            return Uf(this, e, arguments.length > 1 ? arguments[1] : void 0)
        }
    }), $r("find");
    var Gf = [].reverse,
        Wf = [1, 2];
    Oe({
        target: "Array",
        proto: !0,
        forced: String(Wf) === String(Wf.reverse())
    }, {
        reverse: function() {
            return Ie(this) && (this.length = this.length), Gf.call(this)
        }
    });
    var zf = [].sort,
        qf = [1, 2, 3],
        Vf = u(function() {
            qf.sort(void 0)
        }),
        $f = u(function() {
            qf.sort(null)
        }),
        Kf = ze("sort");
    Oe({
        target: "Array",
        proto: !0,
        forced: Vf || !$f || Kf
    }, {
        sort: function(e) {
            return void 0 === e ? zf.call(Re(this)) : zf.call(Re(this), De(e))
        }
    }), Oe({
        target: "Object",
        stat: !0,
        forced: !l,
        sham: !l
    }, {
        defineProperty: I.f
    });
    var Xf = u(function() {
        ri(1)
    });
    Oe({
        target: "Object",
        stat: !0,
        forced: Xf,
        sham: !ei
    }, {
        getPrototypeOf: function(e) {
            return ri(Re(e))
        }
    });
    var Yf = Ar.trim,
        Jf = c.parseFloat,
        Zf = 1 / Jf(wr + "-0") != -1 / 0 ? function(e) {
            var t = Yf(String(e)),
                n = Jf(t);
            return 0 === n && "-" == t.charAt(0) ? -0 : n
        } : Jf;
    Oe({
        global: !0,
        forced: parseFloat != Zf
    }, {
        parseFloat: Zf
    });
    var Qf = n(function(t) {
            var n, r;
            n = "undefined" != typeof window ? window : e, r = function(e, t) {
                var n = [],
                    r = e.document,
                    i = Object.getPrototypeOf,
                    o = n.slice,
                    a = n.concat,
                    s = n.push,
                    c = n.indexOf,
                    u = {},
                    l = u.toString,
                    f = u.hasOwnProperty,
                    d = f.toString,
                    h = d.call(Object),
                    p = {},
                    g = function(e) {
                        return "function" == typeof e && "number" != typeof e.nodeType
                    },
                    v = function(e) {
                        return null != e && e === e.window
                    },
                    m = {
                        type: !0,
                        src: !0,
                        nonce: !0,
                        noModule: !0
                    };

                function y(e, t, n) {
                    var i, o, a = (n = n || r).createElement("script");
                    if (a.text = e, t)
                        for (i in m)(o = t[i] || t.getAttribute && t.getAttribute(i)) && a.setAttribute(i, o);
                    n.head.appendChild(a).parentNode.removeChild(a)
                }

                function b(e) {
                    return null == e ? e + "" : "object" === lo(e) || "function" == typeof e ? u[l.call(e)] || "object" : lo(e)
                }
                var w = function e(t, n) {
                        return new e.fn.init(t, n)
                    },
                    x = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

                function T(e) {
                    var t = !!e && "length" in e && e.length,
                        n = b(e);
                    return !g(e) && !v(e) && ("array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e)
                }
                w.fn = w.prototype = {
                    jquery: "3.4.1",
                    constructor: w,
                    length: 0,
                    toArray: function() {
                        return o.call(this)
                    },
                    get: function(e) {
                        return null == e ? o.call(this) : e < 0 ? this[e + this.length] : this[e]
                    },
                    pushStack: function(e) {
                        var t = w.merge(this.constructor(), e);
                        return t.prevObject = this, t
                    },
                    each: function(e) {
                        return w.each(this, e)
                    },
                    map: function(e) {
                        return this.pushStack(w.map(this, function(t, n) {
                            return e.call(t, n, t)
                        }))
                    },
                    slice: function() {
                        return this.pushStack(o.apply(this, arguments))
                    },
                    first: function() {
                        return this.eq(0)
                    },
                    last: function() {
                        return this.eq(-1)
                    },
                    eq: function(e) {
                        var t = this.length,
                            n = +e + (e < 0 ? t : 0);
                        return this.pushStack(n >= 0 && n < t ? [this[n]] : [])
                    },
                    end: function() {
                        return this.prevObject || this.constructor()
                    },
                    push: s,
                    sort: n.sort,
                    splice: n.splice
                }, w.extend = w.fn.extend = function() {
                    var e, t, n, r, i, o, a = arguments,
                        s = arguments[0] || {},
                        c = 1,
                        u = arguments.length,
                        l = !1;
                    for ("boolean" == typeof s && (l = s, s = arguments[c] || {}, c++), "object" === lo(s) || g(s) || (s = {}), c === u && (s = this, c--); c < u; c++)
                        if (null != (e = a[c]))
                            for (t in e) r = e[t], "__proto__" !== t && s !== r && (l && r && (w.isPlainObject(r) || (i = Array.isArray(r))) ? (n = s[t], o = i && !Array.isArray(n) ? [] : i || w.isPlainObject(n) ? n : {}, i = !1, s[t] = w.extend(l, o, r)) : void 0 !== r && (s[t] = r));
                    return s
                }, w.extend({
                    expando: "jQuery" + ("3.4.1" + Math.random()).replace(/\D/g, ""),
                    isReady: !0,
                    error: function(e) {
                        throw new Error(e)
                    },
                    noop: function() {},
                    isPlainObject: function(e) {
                        var t, n;
                        return !(!e || "[object Object]" !== l.call(e)) && (!(t = i(e)) || "function" == typeof(n = f.call(t, "constructor") && t.constructor) && d.call(n) === h)
                    },
                    isEmptyObject: function(e) {
                        var t;
                        for (t in e) return !1;
                        return !0
                    },
                    globalEval: function(e, t) {
                        y(e, {
                            nonce: t && t.nonce
                        })
                    },
                    each: function(e, t) {
                        var n, r = 0;
                        if (T(e))
                            for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++);
                        else
                            for (r in e)
                                if (!1 === t.call(e[r], r, e[r])) break; return e
                    },
                    trim: function(e) {
                        return null == e ? "" : (e + "").replace(x, "")
                    },
                    makeArray: function(e, t) {
                        var n = t || [];
                        return null != e && (T(Object(e)) ? w.merge(n, "string" == typeof e ? [e] : e) : s.call(n, e)), n
                    },
                    inArray: function(e, t, n) {
                        return null == t ? -1 : c.call(t, e, n)
                    },
                    merge: function(e, t) {
                        for (var n = +t.length, r = 0, i = e.length; r < n; r++) e[i++] = t[r];
                        return e.length = i, e
                    },
                    grep: function(e, t, n) {
                        for (var r = [], i = 0, o = e.length, a = !n; i < o; i++) !t(e[i], i) !== a && r.push(e[i]);
                        return r
                    },
                    map: function(e, t, n) {
                        var r, i, o = 0,
                            s = [];
                        if (T(e))
                            for (r = e.length; o < r; o++) null != (i = t(e[o], o, n)) && s.push(i);
                        else
                            for (o in e) null != (i = t(e[o], o, n)) && s.push(i);
                        return a.apply([], s)
                    },
                    guid: 1,
                    support: p
                }), "function" == typeof Symbol && (w.fn[Symbol.iterator] = n[Symbol.iterator]), w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
                    u["[object " + t + "]"] = t.toLowerCase()
                });
                var S = function(e) {
                    var t, n, r, i, o, a, s, c, u, l, f, d, h, p, g, v, m, y, b, w = "sizzle" + 1 * new Date,
                        x = e.document,
                        T = 0,
                        S = 0,
                        E = ce(),
                        A = ce(),
                        C = ce(),
                        k = ce(),
                        L = function(e, t) {
                            return e === t && (f = !0), 0
                        },
                        _ = {}.hasOwnProperty,
                        O = [],
                        D = O.pop,
                        P = O.push,
                        R = O.push,
                        I = O.slice,
                        M = function(e, t) {
                            for (var n = 0, r = e.length; n < r; n++)
                                if (e[n] === t) return n;
                            return -1
                        },
                        N = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                        B = "[\\x20\\t\\r\\n\\f]",
                        j = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
                        F = "\\[" + B + "*(" + j + ")(?:" + B + "*([*^$|!~]?=)" + B + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + j + "))|)" + B + "*\\]",
                        U = ":(" + j + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + F + ")*)|.*)\\)|)",
                        H = new RegExp(B + "+", "g"),
                        G = new RegExp("^" + B + "+|((?:^|[^\\\\])(?:\\\\.)*)" + B + "+$", "g"),
                        W = new RegExp("^" + B + "*," + B + "*"),
                        z = new RegExp("^" + B + "*([>+~]|" + B + ")" + B + "*"),
                        q = new RegExp(B + "|>"),
                        V = new RegExp(U),
                        $ = new RegExp("^" + j + "$"),
                        K = {
                            ID: new RegExp("^#(" + j + ")"),
                            CLASS: new RegExp("^\\.(" + j + ")"),
                            TAG: new RegExp("^(" + j + "|[*])"),
                            ATTR: new RegExp("^" + F),
                            PSEUDO: new RegExp("^" + U),
                            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + B + "*(even|odd|(([+-]|)(\\d*)n|)" + B + "*(?:([+-]|)" + B + "*(\\d+)|))" + B + "*\\)|)", "i"),
                            bool: new RegExp("^(?:" + N + ")$", "i"),
                            needsContext: new RegExp("^" + B + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + B + "*((?:-\\d)?\\d*)" + B + "*\\)|)(?=[^-]|$)", "i")
                        },
                        X = /HTML$/i,
                        Y = /^(?:input|select|textarea|button)$/i,
                        J = /^h\d$/i,
                        Z = /^[^{]+\{\s*\[native \w/,
                        Q = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                        ee = /[+~]/,
                        te = new RegExp("\\\\([\\da-f]{1,6}" + B + "?|(" + B + ")|.)", "ig"),
                        ne = function(e, t, n) {
                            var r = "0x" + t - 65536;
                            return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
                        },
                        re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
                        ie = function(e, t) {
                            return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
                        },
                        oe = function() {
                            d()
                        },
                        ae = we(function(e) {
                            return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
                        }, {
                            dir: "parentNode",
                            next: "legend"
                        });
                    try {
                        R.apply(O = I.call(x.childNodes), x.childNodes), O[x.childNodes.length].nodeType
                    } catch (e) {
                        R = {
                            apply: O.length ? function(e, t) {
                                P.apply(e, I.call(t))
                            } : function(e, t) {
                                for (var n = e.length, r = 0; e[n++] = t[r++];);
                                e.length = n - 1
                            }
                        }
                    }

                    function se(e, t, r, i) {
                        var o, s, u, l, f, p, m, y = t && t.ownerDocument,
                            T = t ? t.nodeType : 9;
                        if (r = r || [], "string" != typeof e || !e || 1 !== T && 9 !== T && 11 !== T) return r;
                        if (!i && ((t ? t.ownerDocument || t : x) !== h && d(t), t = t || h, g)) {
                            if (11 !== T && (f = Q.exec(e)))
                                if (o = f[1]) {
                                    if (9 === T) {
                                        if (!(u = t.getElementById(o))) return r;
                                        if (u.id === o) return r.push(u), r
                                    } else if (y && (u = y.getElementById(o)) && b(t, u) && u.id === o) return r.push(u), r
                                } else {
                                    if (f[2]) return R.apply(r, t.getElementsByTagName(e)), r;
                                    if ((o = f[3]) && n.getElementsByClassName && t.getElementsByClassName) return R.apply(r, t.getElementsByClassName(o)), r
                                }
                            if (n.qsa && !k[e + " "] && (!v || !v.test(e)) && (1 !== T || "object" !== t.nodeName.toLowerCase())) {
                                if (m = e, y = t, 1 === T && q.test(e)) {
                                    for ((l = t.getAttribute("id")) ? l = l.replace(re, ie) : t.setAttribute("id", l = w), s = (p = a(e)).length; s--;) p[s] = "#" + l + " " + be(p[s]);
                                    m = p.join(","), y = ee.test(e) && me(t.parentNode) || t
                                }
                                try {
                                    return R.apply(r, y.querySelectorAll(m)), r
                                } catch (t) {
                                    k(e, !0)
                                } finally {
                                    l === w && t.removeAttribute("id")
                                }
                            }
                        }
                        return c(e.replace(G, "$1"), t, r, i)
                    }

                    function ce() {
                        var e = [];
                        return function t(n, i) {
                            return e.push(n + " ") > r.cacheLength && delete t[e.shift()], t[n + " "] = i
                        }
                    }

                    function ue(e) {
                        return e[w] = !0, e
                    }

                    function le(e) {
                        var t = h.createElement("fieldset");
                        try {
                            return !!e(t)
                        } catch (e) {
                            return !1
                        } finally {
                            t.parentNode && t.parentNode.removeChild(t), t = null
                        }
                    }

                    function fe(e, t) {
                        for (var n = e.split("|"), i = n.length; i--;) r.attrHandle[n[i]] = t
                    }

                    function de(e, t) {
                        var n = t && e,
                            r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
                        if (r) return r;
                        if (n)
                            for (; n = n.nextSibling;)
                                if (n === t) return -1;
                        return e ? 1 : -1
                    }

                    function he(e) {
                        return function(t) {
                            return "input" === t.nodeName.toLowerCase() && t.type === e
                        }
                    }

                    function pe(e) {
                        return function(t) {
                            var n = t.nodeName.toLowerCase();
                            return ("input" === n || "button" === n) && t.type === e
                        }
                    }

                    function ge(e) {
                        return function(t) {
                            return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && ae(t) === e : t.disabled === e : "label" in t && t.disabled === e
                        }
                    }

                    function ve(e) {
                        return ue(function(t) {
                            return t = +t, ue(function(n, r) {
                                for (var i, o = e([], n.length, t), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                            })
                        })
                    }

                    function me(e) {
                        return e && void 0 !== e.getElementsByTagName && e
                    }
                    for (t in n = se.support = {}, o = se.isXML = function(e) {
                            var t = e.namespaceURI,
                                n = (e.ownerDocument || e).documentElement;
                            return !X.test(t || n && n.nodeName || "HTML")
                        }, d = se.setDocument = function(e) {
                            var t, i, a = e ? e.ownerDocument || e : x;
                            return a !== h && 9 === a.nodeType && a.documentElement ? (p = (h = a).documentElement, g = !o(h), x !== h && (i = h.defaultView) && i.top !== i && (i.addEventListener ? i.addEventListener("unload", oe, !1) : i.attachEvent && i.attachEvent("onunload", oe)), n.attributes = le(function(e) {
                                return e.className = "i", !e.getAttribute("className")
                            }), n.getElementsByTagName = le(function(e) {
                                return e.appendChild(h.createComment("")), !e.getElementsByTagName("*").length
                            }), n.getElementsByClassName = Z.test(h.getElementsByClassName), n.getById = le(function(e) {
                                return p.appendChild(e).id = w, !h.getElementsByName || !h.getElementsByName(w).length
                            }), n.getById ? (r.filter.ID = function(e) {
                                var t = e.replace(te, ne);
                                return function(e) {
                                    return e.getAttribute("id") === t
                                }
                            }, r.find.ID = function(e, t) {
                                if (void 0 !== t.getElementById && g) {
                                    var n = t.getElementById(e);
                                    return n ? [n] : []
                                }
                            }) : (r.filter.ID = function(e) {
                                var t = e.replace(te, ne);
                                return function(e) {
                                    var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                                    return n && n.value === t
                                }
                            }, r.find.ID = function(e, t) {
                                if (void 0 !== t.getElementById && g) {
                                    var n, r, i, o = t.getElementById(e);
                                    if (o) {
                                        if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
                                        for (i = t.getElementsByName(e), r = 0; o = i[r++];)
                                            if ((n = o.getAttributeNode("id")) && n.value === e) return [o]
                                    }
                                    return []
                                }
                            }), r.find.TAG = n.getElementsByTagName ? function(e, t) {
                                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : n.qsa ? t.querySelectorAll(e) : void 0
                            } : function(e, t) {
                                var n, r = [],
                                    i = 0,
                                    o = t.getElementsByTagName(e);
                                if ("*" === e) {
                                    for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                                    return r
                                }
                                return o
                            }, r.find.CLASS = n.getElementsByClassName && function(e, t) {
                                if (void 0 !== t.getElementsByClassName && g) return t.getElementsByClassName(e)
                            }, m = [], v = [], (n.qsa = Z.test(h.querySelectorAll)) && (le(function(e) {
                                p.appendChild(e).innerHTML = "<a id='" + w + "'></a><select id='" + w + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + B + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || v.push("\\[" + B + "*(?:value|" + N + ")"), e.querySelectorAll("[id~=" + w + "-]").length || v.push("~="), e.querySelectorAll(":checked").length || v.push(":checked"), e.querySelectorAll("a#" + w + "+*").length || v.push(".#.+[+~]")
                            }), le(function(e) {
                                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                                var t = h.createElement("input");
                                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && v.push("name" + B + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"), p.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), v.push(",.*:")
                            })), (n.matchesSelector = Z.test(y = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.oMatchesSelector || p.msMatchesSelector)) && le(function(e) {
                                n.disconnectedMatch = y.call(e, "*"), y.call(e, "[s!='']:x"), m.push("!=", U)
                            }), v = v.length && new RegExp(v.join("|")), m = m.length && new RegExp(m.join("|")), t = Z.test(p.compareDocumentPosition), b = t || Z.test(p.contains) ? function(e, t) {
                                var n = 9 === e.nodeType ? e.documentElement : e,
                                    r = t && t.parentNode;
                                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                            } : function(e, t) {
                                if (t)
                                    for (; t = t.parentNode;)
                                        if (t === e) return !0;
                                return !1
                            }, L = t ? function(e, t) {
                                if (e === t) return f = !0, 0;
                                var r = !e.compareDocumentPosition - !t.compareDocumentPosition;
                                return r || (1 & (r = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !n.sortDetached && t.compareDocumentPosition(e) === r ? e === h || e.ownerDocument === x && b(x, e) ? -1 : t === h || t.ownerDocument === x && b(x, t) ? 1 : l ? M(l, e) - M(l, t) : 0 : 4 & r ? -1 : 1)
                            } : function(e, t) {
                                if (e === t) return f = !0, 0;
                                var n, r = 0,
                                    i = e.parentNode,
                                    o = t.parentNode,
                                    a = [e],
                                    s = [t];
                                if (!i || !o) return e === h ? -1 : t === h ? 1 : i ? -1 : o ? 1 : l ? M(l, e) - M(l, t) : 0;
                                if (i === o) return de(e, t);
                                for (n = e; n = n.parentNode;) a.unshift(n);
                                for (n = t; n = n.parentNode;) s.unshift(n);
                                for (; a[r] === s[r];) r++;
                                return r ? de(a[r], s[r]) : a[r] === x ? -1 : s[r] === x ? 1 : 0
                            }, h) : h
                        }, se.matches = function(e, t) {
                            return se(e, null, null, t)
                        }, se.matchesSelector = function(e, t) {
                            if ((e.ownerDocument || e) !== h && d(e), n.matchesSelector && g && !k[t + " "] && (!m || !m.test(t)) && (!v || !v.test(t))) try {
                                var r = y.call(e, t);
                                if (r || n.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
                            } catch (e) {
                                k(t, !0)
                            }
                            return se(t, h, null, [e]).length > 0
                        }, se.contains = function(e, t) {
                            return (e.ownerDocument || e) !== h && d(e), b(e, t)
                        }, se.attr = function(e, t) {
                            (e.ownerDocument || e) !== h && d(e);
                            var i = r.attrHandle[t.toLowerCase()],
                                o = i && _.call(r.attrHandle, t.toLowerCase()) ? i(e, t, !g) : void 0;
                            return void 0 !== o ? o : n.attributes || !g ? e.getAttribute(t) : (o = e.getAttributeNode(t)) && o.specified ? o.value : null
                        }, se.escape = function(e) {
                            return (e + "").replace(re, ie)
                        }, se.error = function(e) {
                            throw new Error("Syntax error, unrecognized expression: " + e)
                        }, se.uniqueSort = function(e) {
                            var t, r = [],
                                i = 0,
                                o = 0;
                            if (f = !n.detectDuplicates, l = !n.sortStable && e.slice(0), e.sort(L), f) {
                                for (; t = e[o++];) t === e[o] && (i = r.push(o));
                                for (; i--;) e.splice(r[i], 1)
                            }
                            return l = null, e
                        }, i = se.getText = function(e) {
                            var t, n = "",
                                r = 0,
                                o = e.nodeType;
                            if (o) {
                                if (1 === o || 9 === o || 11 === o) {
                                    if ("string" == typeof e.textContent) return e.textContent;
                                    for (e = e.firstChild; e; e = e.nextSibling) n += i(e)
                                } else if (3 === o || 4 === o) return e.nodeValue
                            } else
                                for (; t = e[r++];) n += i(t);
                            return n
                        }, (r = se.selectors = {
                            cacheLength: 50,
                            createPseudo: ue,
                            match: K,
                            attrHandle: {},
                            find: {},
                            relative: {
                                ">": {
                                    dir: "parentNode",
                                    first: !0
                                },
                                " ": {
                                    dir: "parentNode"
                                },
                                "+": {
                                    dir: "previousSibling",
                                    first: !0
                                },
                                "~": {
                                    dir: "previousSibling"
                                }
                            },
                            preFilter: {
                                ATTR: function(e) {
                                    return e[1] = e[1].replace(te, ne), e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                                },
                                CHILD: function(e) {
                                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || se.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && se.error(e[0]), e
                                },
                                PSEUDO: function(e) {
                                    var t, n = !e[6] && e[2];
                                    return K.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && V.test(n) && (t = a(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                                }
                            },
                            filter: {
                                TAG: function(e) {
                                    var t = e.replace(te, ne).toLowerCase();
                                    return "*" === e ? function() {
                                        return !0
                                    } : function(e) {
                                        return e.nodeName && e.nodeName.toLowerCase() === t
                                    }
                                },
                                CLASS: function(e) {
                                    var t = E[e + " "];
                                    return t || (t = new RegExp("(^|" + B + ")" + e + "(" + B + "|$)")) && E(e, function(e) {
                                        return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                                    })
                                },
                                ATTR: function(e, t, n) {
                                    return function(r) {
                                        var i = se.attr(r, e);
                                        return null == i ? "!=" === t : !t || (i += "", "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i.replace(H, " ") + " ").indexOf(n) > -1 : "|=" === t && (i === n || i.slice(0, n.length + 1) === n + "-"))
                                    }
                                },
                                CHILD: function(e, t, n, r, i) {
                                    var o = "nth" !== e.slice(0, 3),
                                        a = "last" !== e.slice(-4),
                                        s = "of-type" === t;
                                    return 1 === r && 0 === i ? function(e) {
                                        return !!e.parentNode
                                    } : function(t, n, c) {
                                        var u, l, f, d, h, p, g = o !== a ? "nextSibling" : "previousSibling",
                                            v = t.parentNode,
                                            m = s && t.nodeName.toLowerCase(),
                                            y = !c && !s,
                                            b = !1;
                                        if (v) {
                                            if (o) {
                                                for (; g;) {
                                                    for (d = t; d = d[g];)
                                                        if (s ? d.nodeName.toLowerCase() === m : 1 === d.nodeType) return !1;
                                                    p = g = "only" === e && !p && "nextSibling"
                                                }
                                                return !0
                                            }
                                            if (p = [a ? v.firstChild : v.lastChild], a && y) {
                                                for (b = (h = (u = (l = (f = (d = v)[w] || (d[w] = {}))[d.uniqueID] || (f[d.uniqueID] = {}))[e] || [])[0] === T && u[1]) && u[2], d = h && v.childNodes[h]; d = ++h && d && d[g] || (b = h = 0) || p.pop();)
                                                    if (1 === d.nodeType && ++b && d === t) {
                                                        l[e] = [T, h, b];
                                                        break
                                                    }
                                            } else if (y && (b = h = (u = (l = (f = (d = t)[w] || (d[w] = {}))[d.uniqueID] || (f[d.uniqueID] = {}))[e] || [])[0] === T && u[1]), !1 === b)
                                                for (;
                                                    (d = ++h && d && d[g] || (b = h = 0) || p.pop()) && ((s ? d.nodeName.toLowerCase() !== m : 1 !== d.nodeType) || !++b || (y && ((l = (f = d[w] || (d[w] = {}))[d.uniqueID] || (f[d.uniqueID] = {}))[e] = [T, b]), d !== t)););
                                            return (b -= i) === r || b % r == 0 && b / r >= 0
                                        }
                                    }
                                },
                                PSEUDO: function(e, t) {
                                    var n, i = r.pseudos[e] || r.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
                                    return i[w] ? i(t) : i.length > 1 ? (n = [e, e, "", t], r.setFilters.hasOwnProperty(e.toLowerCase()) ? ue(function(e, n) {
                                        for (var r, o = i(e, t), a = o.length; a--;) e[r = M(e, o[a])] = !(n[r] = o[a])
                                    }) : function(e) {
                                        return i(e, 0, n)
                                    }) : i
                                }
                            },
                            pseudos: {
                                not: ue(function(e) {
                                    var t = [],
                                        n = [],
                                        r = s(e.replace(G, "$1"));
                                    return r[w] ? ue(function(e, t, n, i) {
                                        for (var o, a = r(e, null, i, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                                    }) : function(e, i, o) {
                                        return t[0] = e, r(t, null, o, n), t[0] = null, !n.pop()
                                    }
                                }),
                                has: ue(function(e) {
                                    return function(t) {
                                        return se(e, t).length > 0
                                    }
                                }),
                                contains: ue(function(e) {
                                    return e = e.replace(te, ne),
                                        function(t) {
                                            return (t.textContent || i(t)).indexOf(e) > -1
                                        }
                                }),
                                lang: ue(function(e) {
                                    return $.test(e || "") || se.error("unsupported lang: " + e), e = e.replace(te, ne).toLowerCase(),
                                        function(t) {
                                            var n;
                                            do {
                                                if (n = g ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                                            } while ((t = t.parentNode) && 1 === t.nodeType);
                                            return !1
                                        }
                                }),
                                target: function(t) {
                                    var n = e.location && e.location.hash;
                                    return n && n.slice(1) === t.id
                                },
                                root: function(e) {
                                    return e === p
                                },
                                focus: function(e) {
                                    return e === h.activeElement && (!h.hasFocus || h.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                                },
                                enabled: ge(!1),
                                disabled: ge(!0),
                                checked: function(e) {
                                    var t = e.nodeName.toLowerCase();
                                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                                },
                                selected: function(e) {
                                    return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
                                },
                                empty: function(e) {
                                    for (e = e.firstChild; e; e = e.nextSibling)
                                        if (e.nodeType < 6) return !1;
                                    return !0
                                },
                                parent: function(e) {
                                    return !r.pseudos.empty(e)
                                },
                                header: function(e) {
                                    return J.test(e.nodeName)
                                },
                                input: function(e) {
                                    return Y.test(e.nodeName)
                                },
                                button: function(e) {
                                    var t = e.nodeName.toLowerCase();
                                    return "input" === t && "button" === e.type || "button" === t
                                },
                                text: function(e) {
                                    var t;
                                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                                },
                                first: ve(function() {
                                    return [0]
                                }),
                                last: ve(function(e, t) {
                                    return [t - 1]
                                }),
                                eq: ve(function(e, t, n) {
                                    return [n < 0 ? n + t : n]
                                }),
                                even: ve(function(e, t) {
                                    for (var n = 0; n < t; n += 2) e.push(n);
                                    return e
                                }),
                                odd: ve(function(e, t) {
                                    for (var n = 1; n < t; n += 2) e.push(n);
                                    return e
                                }),
                                lt: ve(function(e, t, n) {
                                    for (var r = n < 0 ? n + t : n > t ? t : n; --r >= 0;) e.push(r);
                                    return e
                                }),
                                gt: ve(function(e, t, n) {
                                    for (var r = n < 0 ? n + t : n; ++r < t;) e.push(r);
                                    return e
                                })
                            }
                        }).pseudos.nth = r.pseudos.eq, {
                            radio: !0,
                            checkbox: !0,
                            file: !0,
                            password: !0,
                            image: !0
                        }) r.pseudos[t] = he(t);
                    for (t in {
                            submit: !0,
                            reset: !0
                        }) r.pseudos[t] = pe(t);

                    function ye() {}

                    function be(e) {
                        for (var t = 0, n = e.length, r = ""; t < n; t++) r += e[t].value;
                        return r
                    }

                    function we(e, t, n) {
                        var r = t.dir,
                            i = t.next,
                            o = i || r,
                            a = n && "parentNode" === o,
                            s = S++;
                        return t.first ? function(t, n, i) {
                            for (; t = t[r];)
                                if (1 === t.nodeType || a) return e(t, n, i);
                            return !1
                        } : function(t, n, c) {
                            var u, l, f, d = [T, s];
                            if (c) {
                                for (; t = t[r];)
                                    if ((1 === t.nodeType || a) && e(t, n, c)) return !0
                            } else
                                for (; t = t[r];)
                                    if (1 === t.nodeType || a)
                                        if (l = (f = t[w] || (t[w] = {}))[t.uniqueID] || (f[t.uniqueID] = {}), i && i === t.nodeName.toLowerCase()) t = t[r] || t;
                                        else {
                                            if ((u = l[o]) && u[0] === T && u[1] === s) return d[2] = u[2];
                                            if (l[o] = d, d[2] = e(t, n, c)) return !0
                                        } return !1
                        }
                    }

                    function xe(e) {
                        return e.length > 1 ? function(t, n, r) {
                            for (var i = e.length; i--;)
                                if (!e[i](t, n, r)) return !1;
                            return !0
                        } : e[0]
                    }

                    function Te(e, t, n, r, i) {
                        for (var o, a = [], s = 0, c = e.length, u = null != t; s < c; s++)(o = e[s]) && (n && !n(o, r, i) || (a.push(o), u && t.push(s)));
                        return a
                    }

                    function Se(e, t, n, r, i, o) {
                        return r && !r[w] && (r = Se(r)), i && !i[w] && (i = Se(i, o)), ue(function(o, a, s, c) {
                            var u, l, f, d = [],
                                h = [],
                                p = a.length,
                                g = o || function(e, t, n) {
                                    for (var r = 0, i = t.length; r < i; r++) se(e, t[r], n);
                                    return n
                                }(t || "*", s.nodeType ? [s] : s, []),
                                v = !e || !o && t ? g : Te(g, d, e, s, c),
                                m = n ? i || (o ? e : p || r) ? [] : a : v;
                            if (n && n(v, m, s, c), r)
                                for (u = Te(m, h), r(u, [], s, c), l = u.length; l--;)(f = u[l]) && (m[h[l]] = !(v[h[l]] = f));
                            if (o) {
                                if (i || e) {
                                    if (i) {
                                        for (u = [], l = m.length; l--;)(f = m[l]) && u.push(v[l] = f);
                                        i(null, m = [], u, c)
                                    }
                                    for (l = m.length; l--;)(f = m[l]) && (u = i ? M(o, f) : d[l]) > -1 && (o[u] = !(a[u] = f))
                                }
                            } else m = Te(m === a ? m.splice(p, m.length) : m), i ? i(null, a, m, c) : R.apply(a, m)
                        })
                    }

                    function Ee(e) {
                        for (var t, n, i, o = e.length, a = r.relative[e[0].type], s = a || r.relative[" "], c = a ? 1 : 0, l = we(function(e) {
                                return e === t
                            }, s, !0), f = we(function(e) {
                                return M(t, e) > -1
                            }, s, !0), d = [function(e, n, r) {
                                var i = !a && (r || n !== u) || ((t = n).nodeType ? l(e, n, r) : f(e, n, r));
                                return t = null, i
                            }]; c < o; c++)
                            if (n = r.relative[e[c].type]) d = [we(xe(d), n)];
                            else {
                                if ((n = r.filter[e[c].type].apply(null, e[c].matches))[w]) {
                                    for (i = ++c; i < o && !r.relative[e[i].type]; i++);
                                    return Se(c > 1 && xe(d), c > 1 && be(e.slice(0, c - 1).concat({
                                        value: " " === e[c - 2].type ? "*" : ""
                                    })).replace(G, "$1"), n, c < i && Ee(e.slice(c, i)), i < o && Ee(e = e.slice(i)), i < o && be(e))
                                }
                                d.push(n)
                            }
                        return xe(d)
                    }
                    return ye.prototype = r.filters = r.pseudos, r.setFilters = new ye, a = se.tokenize = function(e, t) {
                        var n, i, o, a, s, c, u, l = A[e + " "];
                        if (l) return t ? 0 : l.slice(0);
                        for (s = e, c = [], u = r.preFilter; s;) {
                            for (a in n && !(i = W.exec(s)) || (i && (s = s.slice(i[0].length) || s), c.push(o = [])), n = !1, (i = z.exec(s)) && (n = i.shift(), o.push({
                                    value: n,
                                    type: i[0].replace(G, " ")
                                }), s = s.slice(n.length)), r.filter) !(i = K[a].exec(s)) || u[a] && !(i = u[a](i)) || (n = i.shift(), o.push({
                                value: n,
                                type: a,
                                matches: i
                            }), s = s.slice(n.length));
                            if (!n) break
                        }
                        return t ? s.length : s ? se.error(e) : A(e, c).slice(0)
                    }, s = se.compile = function(e, t) {
                        var n, i = [],
                            o = [],
                            s = C[e + " "];
                        if (!s) {
                            for (t || (t = a(e)), n = t.length; n--;)(s = Ee(t[n]))[w] ? i.push(s) : o.push(s);
                            (s = C(e, function(e, t) {
                                var n = t.length > 0,
                                    i = e.length > 0,
                                    o = function(o, a, s, c, l) {
                                        var f, p, v, m = 0,
                                            y = "0",
                                            b = o && [],
                                            w = [],
                                            x = u,
                                            S = o || i && r.find.TAG("*", l),
                                            E = T += null == x ? 1 : Math.random() || .1,
                                            A = S.length;
                                        for (l && (u = a === h || a || l); y !== A && null != (f = S[y]); y++) {
                                            if (i && f) {
                                                for (p = 0, a || f.ownerDocument === h || (d(f), s = !g); v = e[p++];)
                                                    if (v(f, a || h, s)) {
                                                        c.push(f);
                                                        break
                                                    }
                                                l && (T = E)
                                            }
                                            n && ((f = !v && f) && m--, o && b.push(f))
                                        }
                                        if (m += y, n && y !== m) {
                                            for (p = 0; v = t[p++];) v(b, w, a, s);
                                            if (o) {
                                                if (m > 0)
                                                    for (; y--;) b[y] || w[y] || (w[y] = D.call(c));
                                                w = Te(w)
                                            }
                                            R.apply(c, w), l && !o && w.length > 0 && m + t.length > 1 && se.uniqueSort(c)
                                        }
                                        return l && (T = E, u = x), b
                                    };
                                return n ? ue(o) : o
                            }(o, i))).selector = e
                        }
                        return s
                    }, c = se.select = function(e, t, n, i) {
                        var o, c, u, l, f, d = "function" == typeof e && e,
                            h = !i && a(e = d.selector || e);
                        if (n = n || [], 1 === h.length) {
                            if ((c = h[0] = h[0].slice(0)).length > 2 && "ID" === (u = c[0]).type && 9 === t.nodeType && g && r.relative[c[1].type]) {
                                if (!(t = (r.find.ID(u.matches[0].replace(te, ne), t) || [])[0])) return n;
                                d && (t = t.parentNode), e = e.slice(c.shift().value.length)
                            }
                            for (o = K.needsContext.test(e) ? 0 : c.length; o-- && (u = c[o], !r.relative[l = u.type]);)
                                if ((f = r.find[l]) && (i = f(u.matches[0].replace(te, ne), ee.test(c[0].type) && me(t.parentNode) || t))) {
                                    if (c.splice(o, 1), !(e = i.length && be(c))) return R.apply(n, i), n;
                                    break
                                }
                        }
                        return (d || s(e, h))(i, t, !g, n, !t || ee.test(e) && me(t.parentNode) || t), n
                    }, n.sortStable = w.split("").sort(L).join("") === w, n.detectDuplicates = !!f, d(), n.sortDetached = le(function(e) {
                        return 1 & e.compareDocumentPosition(h.createElement("fieldset"))
                    }), le(function(e) {
                        return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
                    }) || fe("type|href|height|width", function(e, t, n) {
                        if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                    }), n.attributes && le(function(e) {
                        return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
                    }) || fe("value", function(e, t, n) {
                        if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue
                    }), le(function(e) {
                        return null == e.getAttribute("disabled")
                    }) || fe(N, function(e, t, n) {
                        var r;
                        if (!n) return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
                    }), se
                }(e);
                w.find = S, w.expr = S.selectors, w.expr[":"] = w.expr.pseudos, w.uniqueSort = w.unique = S.uniqueSort, w.text = S.getText, w.isXMLDoc = S.isXML, w.contains = S.contains, w.escapeSelector = S.escape;
                var E = function(e, t, n) {
                        for (var r = [], i = void 0 !== n;
                            (e = e[t]) && 9 !== e.nodeType;)
                            if (1 === e.nodeType) {
                                if (i && w(e).is(n)) break;
                                r.push(e)
                            }
                        return r
                    },
                    A = function(e, t) {
                        for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                        return n
                    },
                    C = w.expr.match.needsContext;

                function k(e, t) {
                    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
                }
                var L = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

                function _(e, t, n) {
                    return g(t) ? w.grep(e, function(e, r) {
                        return !!t.call(e, r, e) !== n
                    }) : t.nodeType ? w.grep(e, function(e) {
                        return e === t !== n
                    }) : "string" != typeof t ? w.grep(e, function(e) {
                        return c.call(t, e) > -1 !== n
                    }) : w.filter(t, e, n)
                }
                w.filter = function(e, t, n) {
                    var r = t[0];
                    return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? w.find.matchesSelector(r, e) ? [r] : [] : w.find.matches(e, w.grep(t, function(e) {
                        return 1 === e.nodeType
                    }))
                }, w.fn.extend({
                    find: function(e) {
                        var t, n, r = this.length,
                            i = this;
                        if ("string" != typeof e) return this.pushStack(w(e).filter(function() {
                            for (t = 0; t < r; t++)
                                if (w.contains(i[t], this)) return !0
                        }));
                        for (n = this.pushStack([]), t = 0; t < r; t++) w.find(e, i[t], n);
                        return r > 1 ? w.uniqueSort(n) : n
                    },
                    filter: function(e) {
                        return this.pushStack(_(this, e || [], !1))
                    },
                    not: function(e) {
                        return this.pushStack(_(this, e || [], !0))
                    },
                    is: function(e) {
                        return !!_(this, "string" == typeof e && C.test(e) ? w(e) : e || [], !1).length
                    }
                });
                var O, D = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
                (w.fn.init = function(e, t, n) {
                    var i, o;
                    if (!e) return this;
                    if (n = n || O, "string" == typeof e) {
                        if (!(i = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : D.exec(e)) || !i[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
                        if (i[1]) {
                            if (t = t instanceof w ? t[0] : t, w.merge(this, w.parseHTML(i[1], t && t.nodeType ? t.ownerDocument || t : r, !0)), L.test(i[1]) && w.isPlainObject(t))
                                for (i in t) g(this[i]) ? this[i](t[i]) : this.attr(i, t[i]);
                            return this
                        }
                        return (o = r.getElementById(i[2])) && (this[0] = o, this.length = 1), this
                    }
                    return e.nodeType ? (this[0] = e, this.length = 1, this) : g(e) ? void 0 !== n.ready ? n.ready(e) : e(w) : w.makeArray(e, this)
                }).prototype = w.fn, O = w(r);
                var P = /^(?:parents|prev(?:Until|All))/,
                    R = {
                        children: !0,
                        contents: !0,
                        next: !0,
                        prev: !0
                    };

                function I(e, t) {
                    for (;
                        (e = e[t]) && 1 !== e.nodeType;);
                    return e
                }
                w.fn.extend({
                    has: function(e) {
                        var t = w(e, this),
                            n = t.length;
                        return this.filter(function() {
                            for (var e = 0; e < n; e++)
                                if (w.contains(this, t[e])) return !0
                        })
                    },
                    closest: function(e, t) {
                        var n, r = 0,
                            i = this.length,
                            o = [],
                            a = "string" != typeof e && w(e);
                        if (!C.test(e))
                            for (; r < i; r++)
                                for (n = this[r]; n && n !== t; n = n.parentNode)
                                    if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && w.find.matchesSelector(n, e))) {
                                        o.push(n);
                                        break
                                    }
                        return this.pushStack(o.length > 1 ? w.uniqueSort(o) : o)
                    },
                    index: function(e) {
                        return e ? "string" == typeof e ? c.call(w(e), this[0]) : c.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
                    },
                    add: function(e, t) {
                        return this.pushStack(w.uniqueSort(w.merge(this.get(), w(e, t))))
                    },
                    addBack: function(e) {
                        return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
                    }
                }), w.each({
                    parent: function(e) {
                        var t = e.parentNode;
                        return t && 11 !== t.nodeType ? t : null
                    },
                    parents: function(e) {
                        return E(e, "parentNode")
                    },
                    parentsUntil: function(e, t, n) {
                        return E(e, "parentNode", n)
                    },
                    next: function(e) {
                        return I(e, "nextSibling")
                    },
                    prev: function(e) {
                        return I(e, "previousSibling")
                    },
                    nextAll: function(e) {
                        return E(e, "nextSibling")
                    },
                    prevAll: function(e) {
                        return E(e, "previousSibling")
                    },
                    nextUntil: function(e, t, n) {
                        return E(e, "nextSibling", n)
                    },
                    prevUntil: function(e, t, n) {
                        return E(e, "previousSibling", n)
                    },
                    siblings: function(e) {
                        return A((e.parentNode || {}).firstChild, e)
                    },
                    children: function(e) {
                        return A(e.firstChild)
                    },
                    contents: function(e) {
                        return void 0 !== e.contentDocument ? e.contentDocument : (k(e, "template") && (e = e.content || e), w.merge([], e.childNodes))
                    }
                }, function(e, t) {
                    w.fn[e] = function(n, r) {
                        var i = w.map(this, t, n);
                        return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = w.filter(r, i)), this.length > 1 && (R[e] || w.uniqueSort(i), P.test(e) && i.reverse()), this.pushStack(i)
                    }
                });
                var M = /[^\x20\t\r\n\f]+/g;

                function N(e) {
                    return e
                }

                function B(e) {
                    throw e
                }

                function j(e, t, n, r) {
                    var i;
                    try {
                        e && g(i = e.promise) ? i.call(e).done(t).fail(n) : e && g(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
                    } catch (e) {
                        n.apply(void 0, [e])
                    }
                }
                w.Callbacks = function(e) {
                    e = "string" == typeof e ? function(e) {
                        var t = {};
                        return w.each(e.match(M) || [], function(e, n) {
                            t[n] = !0
                        }), t
                    }(e) : w.extend({}, e);
                    var t, n, r, i, o = [],
                        a = [],
                        s = -1,
                        c = function() {
                            for (i = i || e.once, r = t = !0; a.length; s = -1)
                                for (n = a.shift(); ++s < o.length;) !1 === o[s].apply(n[0], n[1]) && e.stopOnFalse && (s = o.length, n = !1);
                            e.memory || (n = !1), t = !1, i && (o = n ? [] : "")
                        },
                        u = {
                            add: function() {
                                return o && (n && !t && (s = o.length - 1, a.push(n)), function t(n) {
                                    w.each(n, function(n, r) {
                                        g(r) ? e.unique && u.has(r) || o.push(r) : r && r.length && "string" !== b(r) && t(r)
                                    })
                                }(arguments), n && !t && c()), this
                            },
                            remove: function() {
                                return w.each(arguments, function(e, t) {
                                    for (var n;
                                        (n = w.inArray(t, o, n)) > -1;) o.splice(n, 1), n <= s && s--
                                }), this
                            },
                            has: function(e) {
                                return e ? w.inArray(e, o) > -1 : o.length > 0
                            },
                            empty: function() {
                                return o && (o = []), this
                            },
                            disable: function() {
                                return i = a = [], o = n = "", this
                            },
                            disabled: function() {
                                return !o
                            },
                            lock: function() {
                                return i = a = [], n || t || (o = n = ""), this
                            },
                            locked: function() {
                                return !!i
                            },
                            fireWith: function(e, n) {
                                return i || (n = [e, (n = n || []).slice ? n.slice() : n], a.push(n), t || c()), this
                            },
                            fire: function() {
                                return u.fireWith(this, arguments), this
                            },
                            fired: function() {
                                return !!r
                            }
                        };
                    return u
                }, w.extend({
                    Deferred: function(t) {
                        var n = [
                                ["notify", "progress", w.Callbacks("memory"), w.Callbacks("memory"), 2],
                                ["resolve", "done", w.Callbacks("once memory"), w.Callbacks("once memory"), 0, "resolved"],
                                ["reject", "fail", w.Callbacks("once memory"), w.Callbacks("once memory"), 1, "rejected"]
                            ],
                            r = "pending",
                            i = {
                                state: function() {
                                    return r
                                },
                                always: function() {
                                    return o.done(arguments).fail(arguments), this
                                },
                                catch: function(e) {
                                    return i.then(null, e)
                                },
                                pipe: function() {
                                    var e = arguments;
                                    return w.Deferred(function(t) {
                                        w.each(n, function(n, r) {
                                            var i = g(e[r[4]]) && e[r[4]];
                                            o[r[1]](function() {
                                                var e = i && i.apply(this, arguments);
                                                e && g(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[r[0] + "With"](this, i ? [e] : arguments)
                                            })
                                        }), e = null
                                    }).promise()
                                },
                                then: function(t, r, i) {
                                    var o = 0;

                                    function a(t, n, r, i) {
                                        return function() {
                                            var s = this,
                                                c = arguments,
                                                u = function() {
                                                    var e, u;
                                                    if (!(t < o)) {
                                                        if ((e = r.apply(s, c)) === n.promise()) throw new TypeError("Thenable self-resolution");
                                                        u = e && ("object" === lo(e) || "function" == typeof e) && e.then, g(u) ? i ? u.call(e, a(o, n, N, i), a(o, n, B, i)) : (o++, u.call(e, a(o, n, N, i), a(o, n, B, i), a(o, n, N, n.notifyWith))) : (r !== N && (s = void 0, c = [e]), (i || n.resolveWith)(s, c))
                                                    }
                                                },
                                                l = i ? u : function() {
                                                    try {
                                                        u()
                                                    } catch (e) {
                                                        w.Deferred.exceptionHook && w.Deferred.exceptionHook(e, l.stackTrace), t + 1 >= o && (r !== B && (s = void 0, c = [e]), n.rejectWith(s, c))
                                                    }
                                                };
                                            t ? l() : (w.Deferred.getStackHook && (l.stackTrace = w.Deferred.getStackHook()), e.setTimeout(l))
                                        }
                                    }
                                    return w.Deferred(function(e) {
                                        n[0][3].add(a(0, e, g(i) ? i : N, e.notifyWith)), n[1][3].add(a(0, e, g(t) ? t : N)), n[2][3].add(a(0, e, g(r) ? r : B))
                                    }).promise()
                                },
                                promise: function(e) {
                                    return null != e ? w.extend(e, i) : i
                                }
                            },
                            o = {};
                        return w.each(n, function(e, t) {
                            var a = t[2],
                                s = t[5];
                            i[t[1]] = a.add, s && a.add(function() {
                                r = s
                            }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock), a.add(t[3].fire), o[t[0]] = function() {
                                return o[t[0] + "With"](this === o ? void 0 : this, arguments), this
                            }, o[t[0] + "With"] = a.fireWith
                        }), i.promise(o), t && t.call(o, o), o
                    },
                    when: function(e) {
                        var t = arguments.length,
                            n = t,
                            r = Array(n),
                            i = o.call(arguments),
                            a = w.Deferred(),
                            s = function(e) {
                                return function(n) {
                                    r[e] = this, i[e] = arguments.length > 1 ? o.call(arguments) : n, --t || a.resolveWith(r, i)
                                }
                            };
                        if (t <= 1 && (j(e, a.done(s(n)).resolve, a.reject, !t), "pending" === a.state() || g(i[n] && i[n].then))) return a.then();
                        for (; n--;) j(i[n], s(n), a.reject);
                        return a.promise()
                    }
                });
                var F = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
                w.Deferred.exceptionHook = function(t, n) {
                    e.console && e.console.warn && t && F.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
                }, w.readyException = function(t) {
                    e.setTimeout(function() {
                        throw t
                    })
                };
                var U = w.Deferred();

                function H() {
                    r.removeEventListener("DOMContentLoaded", H), e.removeEventListener("load", H), w.ready()
                }
                w.fn.ready = function(e) {
                    return U.then(e).catch(function(e) {
                        w.readyException(e)
                    }), this
                }, w.extend({
                    isReady: !1,
                    readyWait: 1,
                    ready: function(e) {
                        (!0 === e ? --w.readyWait : w.isReady) || (w.isReady = !0, !0 !== e && --w.readyWait > 0 || U.resolveWith(r, [w]))
                    }
                }), w.ready.then = U.then, "complete" === r.readyState || "loading" !== r.readyState && !r.documentElement.doScroll ? e.setTimeout(w.ready) : (r.addEventListener("DOMContentLoaded", H), e.addEventListener("load", H));
                var G = function e(t, n, r, i, o, a, s) {
                        var c = 0,
                            u = t.length,
                            l = null == r;
                        if ("object" === b(r))
                            for (c in o = !0, r) e(t, n, c, r[c], !0, a, s);
                        else if (void 0 !== i && (o = !0, g(i) || (s = !0), l && (s ? (n.call(t, i), n = null) : (l = n, n = function(e, t, n) {
                                return l.call(w(e), n)
                            })), n))
                            for (; c < u; c++) n(t[c], r, s ? i : i.call(t[c], c, n(t[c], r)));
                        return o ? t : l ? n.call(t) : u ? n(t[0], r) : a
                    },
                    W = /^-ms-/,
                    z = /-([a-z])/g;

                function q(e, t) {
                    return t.toUpperCase()
                }

                function V(e) {
                    return e.replace(W, "ms-").replace(z, q)
                }
                var $ = function(e) {
                    return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
                };

                function K() {
                    this.expando = w.expando + K.uid++
                }
                K.uid = 1, K.prototype = {
                    cache: function(e) {
                        var t = e[this.expando];
                        return t || (t = {}, $(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                            value: t,
                            configurable: !0
                        }))), t
                    },
                    set: function(e, t, n) {
                        var r, i = this.cache(e);
                        if ("string" == typeof t) i[V(t)] = n;
                        else
                            for (r in t) i[V(r)] = t[r];
                        return i
                    },
                    get: function(e, t) {
                        return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][V(t)]
                    },
                    access: function(e, t, n) {
                        return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t)
                    },
                    remove: function(e, t) {
                        var n, r = e[this.expando];
                        if (void 0 !== r) {
                            if (void 0 !== t) {
                                n = (t = Array.isArray(t) ? t.map(V) : (t = V(t)) in r ? [t] : t.match(M) || []).length;
                                for (; n--;) delete r[t[n]]
                            }(void 0 === t || w.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
                        }
                    },
                    hasData: function(e) {
                        var t = e[this.expando];
                        return void 0 !== t && !w.isEmptyObject(t)
                    }
                };
                var X = new K,
                    Y = new K,
                    J = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                    Z = /[A-Z]/g;

                function Q(e, t, n) {
                    var r;
                    if (void 0 === n && 1 === e.nodeType)
                        if (r = "data-" + t.replace(Z, "-$&").toLowerCase(), "string" == typeof(n = e.getAttribute(r))) {
                            try {
                                n = function(e) {
                                    return "true" === e || "false" !== e && ("null" === e ? null : e === +e + "" ? +e : J.test(e) ? JSON.parse(e) : e)
                                }(n)
                            } catch (e) {}
                            Y.set(e, t, n)
                        } else n = void 0;
                    return n
                }
                w.extend({
                    hasData: function(e) {
                        return Y.hasData(e) || X.hasData(e)
                    },
                    data: function(e, t, n) {
                        return Y.access(e, t, n)
                    },
                    removeData: function(e, t) {
                        Y.remove(e, t)
                    },
                    _data: function(e, t, n) {
                        return X.access(e, t, n)
                    },
                    _removeData: function(e, t) {
                        X.remove(e, t)
                    }
                }), w.fn.extend({
                    data: function(e, t) {
                        var n, r, i, o = this[0],
                            a = o && o.attributes;
                        if (void 0 === e) {
                            if (this.length && (i = Y.get(o), 1 === o.nodeType && !X.get(o, "hasDataAttrs"))) {
                                for (n = a.length; n--;) a[n] && 0 === (r = a[n].name).indexOf("data-") && (r = V(r.slice(5)), Q(o, r, i[r]));
                                X.set(o, "hasDataAttrs", !0)
                            }
                            return i
                        }
                        return "object" === lo(e) ? this.each(function() {
                            Y.set(this, e)
                        }) : G(this, function(t) {
                            var n;
                            if (o && void 0 === t) return void 0 !== (n = Y.get(o, e)) ? n : void 0 !== (n = Q(o, e)) ? n : void 0;
                            this.each(function() {
                                Y.set(this, e, t)
                            })
                        }, null, t, arguments.length > 1, null, !0)
                    },
                    removeData: function(e) {
                        return this.each(function() {
                            Y.remove(this, e)
                        })
                    }
                }), w.extend({
                    queue: function(e, t, n) {
                        var r;
                        if (e) return t = (t || "fx") + "queue", r = X.get(e, t), n && (!r || Array.isArray(n) ? r = X.access(e, t, w.makeArray(n)) : r.push(n)), r || []
                    },
                    dequeue: function(e, t) {
                        t = t || "fx";
                        var n = w.queue(e, t),
                            r = n.length,
                            i = n.shift(),
                            o = w._queueHooks(e, t);
                        "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, function() {
                            w.dequeue(e, t)
                        }, o)), !r && o && o.empty.fire()
                    },
                    _queueHooks: function(e, t) {
                        var n = t + "queueHooks";
                        return X.get(e, n) || X.access(e, n, {
                            empty: w.Callbacks("once memory").add(function() {
                                X.remove(e, [t + "queue", n])
                            })
                        })
                    }
                }), w.fn.extend({
                    queue: function(e, t) {
                        var n = 2;
                        return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? w.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                            var n = w.queue(this, e, t);
                            w._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && w.dequeue(this, e)
                        })
                    },
                    dequeue: function(e) {
                        return this.each(function() {
                            w.dequeue(this, e)
                        })
                    },
                    clearQueue: function(e) {
                        return this.queue(e || "fx", [])
                    },
                    promise: function(e, t) {
                        var n, r = 1,
                            i = w.Deferred(),
                            o = this,
                            a = this.length,
                            s = function() {
                                --r || i.resolveWith(o, [o])
                            };
                        for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;)(n = X.get(o[a], e + "queueHooks")) && n.empty && (r++, n.empty.add(s));
                        return s(), i.promise(t)
                    }
                });
                var ee = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                    te = new RegExp("^(?:([+-])=|)(" + ee + ")([a-z%]*)$", "i"),
                    ne = ["Top", "Right", "Bottom", "Left"],
                    re = r.documentElement,
                    ie = function(e) {
                        return w.contains(e.ownerDocument, e)
                    },
                    oe = {
                        composed: !0
                    };
                re.getRootNode && (ie = function(e) {
                    return w.contains(e.ownerDocument, e) || e.getRootNode(oe) === e.ownerDocument
                });
                var ae = function(e, t) {
                        return "none" === (e = t || e).style.display || "" === e.style.display && ie(e) && "none" === w.css(e, "display")
                    },
                    se = function(e, t, n, r) {
                        var i, o, a = {};
                        for (o in t) a[o] = e.style[o], e.style[o] = t[o];
                        for (o in i = n.apply(e, r || []), t) e.style[o] = a[o];
                        return i
                    };

                function ce(e, t, n, r) {
                    var i, o, a = 20,
                        s = r ? function() {
                            return r.cur()
                        } : function() {
                            return w.css(e, t, "")
                        },
                        c = s(),
                        u = n && n[3] || (w.cssNumber[t] ? "" : "px"),
                        l = e.nodeType && (w.cssNumber[t] || "px" !== u && +c) && te.exec(w.css(e, t));
                    if (l && l[3] !== u) {
                        for (c /= 2, u = u || l[3], l = +c || 1; a--;) w.style(e, t, l + u), (1 - o) * (1 - (o = s() / c || .5)) <= 0 && (a = 0), l /= o;
                        l *= 2, w.style(e, t, l + u), n = n || []
                    }
                    return n && (l = +l || +c || 0, i = n[1] ? l + (n[1] + 1) * n[2] : +n[2], r && (r.unit = u, r.start = l, r.end = i)), i
                }
                var ue = {};

                function le(e) {
                    var t, n = e.ownerDocument,
                        r = e.nodeName,
                        i = ue[r];
                    return i || (t = n.body.appendChild(n.createElement(r)), i = w.css(t, "display"), t.parentNode.removeChild(t), "none" === i && (i = "block"), ue[r] = i, i)
                }

                function fe(e, t) {
                    for (var n, r, i = [], o = 0, a = e.length; o < a; o++)(r = e[o]).style && (n = r.style.display, t ? ("none" === n && (i[o] = X.get(r, "display") || null, i[o] || (r.style.display = "")), "" === r.style.display && ae(r) && (i[o] = le(r))) : "none" !== n && (i[o] = "none", X.set(r, "display", n)));
                    for (o = 0; o < a; o++) null != i[o] && (e[o].style.display = i[o]);
                    return e
                }
                w.fn.extend({
                    show: function() {
                        return fe(this, !0)
                    },
                    hide: function() {
                        return fe(this)
                    },
                    toggle: function(e) {
                        return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                            ae(this) ? w(this).show() : w(this).hide()
                        })
                    }
                });
                var de = /^(?:checkbox|radio)$/i,
                    he = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
                    pe = /^$|^module$|\/(?:java|ecma)script/i,
                    ge = {
                        option: [1, "<select multiple='multiple'>", "</select>"],
                        thead: [1, "<table>", "</table>"],
                        col: [2, "<table><colgroup>", "</colgroup></table>"],
                        tr: [2, "<table><tbody>", "</tbody></table>"],
                        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                        _default: [0, "", ""]
                    };

                function ve(e, t) {
                    var n;
                    return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && k(e, t) ? w.merge([e], n) : n
                }

                function me(e, t) {
                    for (var n = 0, r = e.length; n < r; n++) X.set(e[n], "globalEval", !t || X.get(t[n], "globalEval"))
                }
                ge.optgroup = ge.option, ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead, ge.th = ge.td;
                var ye, be, we = /<|&#?\w+;/;

                function xe(e, t, n, r, i) {
                    for (var o, a, s, c, u, l, f = t.createDocumentFragment(), d = [], h = 0, p = e.length; h < p; h++)
                        if ((o = e[h]) || 0 === o)
                            if ("object" === b(o)) w.merge(d, o.nodeType ? [o] : o);
                            else if (we.test(o)) {
                        for (a = a || f.appendChild(t.createElement("div")), s = (he.exec(o) || ["", ""])[1].toLowerCase(), c = ge[s] || ge._default, a.innerHTML = c[1] + w.htmlPrefilter(o) + c[2], l = c[0]; l--;) a = a.lastChild;
                        w.merge(d, a.childNodes), (a = f.firstChild).textContent = ""
                    } else d.push(t.createTextNode(o));
                    for (f.textContent = "", h = 0; o = d[h++];)
                        if (r && w.inArray(o, r) > -1) i && i.push(o);
                        else if (u = ie(o), a = ve(f.appendChild(o), "script"), u && me(a), n)
                        for (l = 0; o = a[l++];) pe.test(o.type || "") && n.push(o);
                    return f
                }
                ye = r.createDocumentFragment().appendChild(r.createElement("div")), (be = r.createElement("input")).setAttribute("type", "radio"), be.setAttribute("checked", "checked"), be.setAttribute("name", "t"), ye.appendChild(be), p.checkClone = ye.cloneNode(!0).cloneNode(!0).lastChild.checked, ye.innerHTML = "<textarea>x</textarea>", p.noCloneChecked = !!ye.cloneNode(!0).lastChild.defaultValue;
                var Te = /^key/,
                    Se = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
                    Ee = /^([^.]*)(?:\.(.+)|)/;

                function Ae() {
                    return !0
                }

                function Ce() {
                    return !1
                }

                function ke(e, t) {
                    return e === function() {
                        try {
                            return r.activeElement
                        } catch (e) {}
                    }() == ("focus" === t)
                }

                function Le(e, t, n, r, i, o) {
                    var a, s;
                    if ("object" === lo(t)) {
                        for (s in "string" != typeof n && (r = r || n, n = void 0), t) Le(e, s, n, r, t[s], o);
                        return e
                    }
                    if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), !1 === i) i = Ce;
                    else if (!i) return e;
                    return 1 === o && (a = i, (i = function(e) {
                        return w().off(e), a.apply(this, arguments)
                    }).guid = a.guid || (a.guid = w.guid++)), e.each(function() {
                        w.event.add(this, t, i, r, n)
                    })
                }

                function _e(e, t, n) {
                    n ? (X.set(e, t, !1), w.event.add(e, t, {
                        namespace: !1,
                        handler: function(e) {
                            var r, i, a = X.get(this, t);
                            if (1 & e.isTrigger && this[t]) {
                                if (a.length)(w.event.special[t] || {}).delegateType && e.stopPropagation();
                                else if (a = o.call(arguments), X.set(this, t, a), r = n(this, t), this[t](), a !== (i = X.get(this, t)) || r ? X.set(this, t, !1) : i = {}, a !== i) return e.stopImmediatePropagation(), e.preventDefault(), i.value
                            } else a.length && (X.set(this, t, {
                                value: w.event.trigger(w.extend(a[0], w.Event.prototype), a.slice(1), this)
                            }), e.stopImmediatePropagation())
                        }
                    })) : void 0 === X.get(e, t) && w.event.add(e, t, Ae)
                }
                w.event = {
                    global: {},
                    add: function(e, t, n, r, i) {
                        var o, a, s, c, u, l, f, d, h, p, g, v = X.get(e);
                        if (v)
                            for (n.handler && (n = (o = n).handler, i = o.selector), i && w.find.matchesSelector(re, i), n.guid || (n.guid = w.guid++), (c = v.events) || (c = v.events = {}), (a = v.handle) || (a = v.handle = function(t) {
                                    return void 0 !== w && w.event.triggered !== t.type ? w.event.dispatch.apply(e, arguments) : void 0
                                }), u = (t = (t || "").match(M) || [""]).length; u--;) h = g = (s = Ee.exec(t[u]) || [])[1], p = (s[2] || "").split(".").sort(), h && (f = w.event.special[h] || {}, h = (i ? f.delegateType : f.bindType) || h, f = w.event.special[h] || {}, l = w.extend({
                                type: h,
                                origType: g,
                                data: r,
                                handler: n,
                                guid: n.guid,
                                selector: i,
                                needsContext: i && w.expr.match.needsContext.test(i),
                                namespace: p.join(".")
                            }, o), (d = c[h]) || ((d = c[h] = []).delegateCount = 0, f.setup && !1 !== f.setup.call(e, r, p, a) || e.addEventListener && e.addEventListener(h, a)), f.add && (f.add.call(e, l), l.handler.guid || (l.handler.guid = n.guid)), i ? d.splice(d.delegateCount++, 0, l) : d.push(l), w.event.global[h] = !0)
                    },
                    remove: function(e, t, n, r, i) {
                        var o, a, s, c, u, l, f, d, h, p, g, v = X.hasData(e) && X.get(e);
                        if (v && (c = v.events)) {
                            for (u = (t = (t || "").match(M) || [""]).length; u--;)
                                if (h = g = (s = Ee.exec(t[u]) || [])[1], p = (s[2] || "").split(".").sort(), h) {
                                    for (f = w.event.special[h] || {}, d = c[h = (r ? f.delegateType : f.bindType) || h] || [], s = s[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = d.length; o--;) l = d[o], !i && g !== l.origType || n && n.guid !== l.guid || s && !s.test(l.namespace) || r && r !== l.selector && ("**" !== r || !l.selector) || (d.splice(o, 1), l.selector && d.delegateCount--, f.remove && f.remove.call(e, l));
                                    a && !d.length && (f.teardown && !1 !== f.teardown.call(e, p, v.handle) || w.removeEvent(e, h, v.handle), delete c[h])
                                } else
                                    for (h in c) w.event.remove(e, h + t[u], n, r, !0);
                            w.isEmptyObject(c) && X.remove(e, "handle events")
                        }
                    },
                    dispatch: function(e) {
                        var t, n, r, i, o, a, s = arguments,
                            c = w.event.fix(e),
                            u = new Array(arguments.length),
                            l = (X.get(this, "events") || {})[c.type] || [],
                            f = w.event.special[c.type] || {};
                        for (u[0] = c, t = 1; t < arguments.length; t++) u[t] = s[t];
                        if (c.delegateTarget = this, !f.preDispatch || !1 !== f.preDispatch.call(this, c)) {
                            for (a = w.event.handlers.call(this, c, l), t = 0;
                                (i = a[t++]) && !c.isPropagationStopped();)
                                for (c.currentTarget = i.elem, n = 0;
                                    (o = i.handlers[n++]) && !c.isImmediatePropagationStopped();) c.rnamespace && !1 !== o.namespace && !c.rnamespace.test(o.namespace) || (c.handleObj = o, c.data = o.data, void 0 !== (r = ((w.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, u)) && !1 === (c.result = r) && (c.preventDefault(), c.stopPropagation()));
                            return f.postDispatch && f.postDispatch.call(this, c), c.result
                        }
                    },
                    handlers: function(e, t) {
                        var n, r, i, o, a, s = [],
                            c = t.delegateCount,
                            u = e.target;
                        if (c && u.nodeType && !("click" === e.type && e.button >= 1))
                            for (; u !== this; u = u.parentNode || this)
                                if (1 === u.nodeType && ("click" !== e.type || !0 !== u.disabled)) {
                                    for (o = [], a = {}, n = 0; n < c; n++) void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? w(i, this).index(u) > -1 : w.find(i, this, null, [u]).length), a[i] && o.push(r);
                                    o.length && s.push({
                                        elem: u,
                                        handlers: o
                                    })
                                }
                        return u = this, c < t.length && s.push({
                            elem: u,
                            handlers: t.slice(c)
                        }), s
                    },
                    addProp: function(e, t) {
                        Object.defineProperty(w.Event.prototype, e, {
                            enumerable: !0,
                            configurable: !0,
                            get: g(t) ? function() {
                                if (this.originalEvent) return t(this.originalEvent)
                            } : function() {
                                if (this.originalEvent) return this.originalEvent[e]
                            },
                            set: function(t) {
                                Object.defineProperty(this, e, {
                                    enumerable: !0,
                                    configurable: !0,
                                    writable: !0,
                                    value: t
                                })
                            }
                        })
                    },
                    fix: function(e) {
                        return e[w.expando] ? e : new w.Event(e)
                    },
                    special: {
                        load: {
                            noBubble: !0
                        },
                        click: {
                            setup: function(e) {
                                var t = this || e;
                                return de.test(t.type) && t.click && k(t, "input") && _e(t, "click", Ae), !1
                            },
                            trigger: function(e) {
                                var t = this || e;
                                return de.test(t.type) && t.click && k(t, "input") && _e(t, "click"), !0
                            },
                            _default: function(e) {
                                var t = e.target;
                                return de.test(t.type) && t.click && k(t, "input") && X.get(t, "click") || k(t, "a")
                            }
                        },
                        beforeunload: {
                            postDispatch: function(e) {
                                void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                            }
                        }
                    }
                }, w.removeEvent = function(e, t, n) {
                    e.removeEventListener && e.removeEventListener(t, n)
                }, w.Event = function(e, t) {
                    if (!(this instanceof w.Event)) return new w.Event(e, t);
                    e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? Ae : Ce, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && w.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[w.expando] = !0
                }, w.Event.prototype = {
                    constructor: w.Event,
                    isDefaultPrevented: Ce,
                    isPropagationStopped: Ce,
                    isImmediatePropagationStopped: Ce,
                    isSimulated: !1,
                    preventDefault: function() {
                        var e = this.originalEvent;
                        this.isDefaultPrevented = Ae, e && !this.isSimulated && e.preventDefault()
                    },
                    stopPropagation: function() {
                        var e = this.originalEvent;
                        this.isPropagationStopped = Ae, e && !this.isSimulated && e.stopPropagation()
                    },
                    stopImmediatePropagation: function() {
                        var e = this.originalEvent;
                        this.isImmediatePropagationStopped = Ae, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation()
                    }
                }, w.each({
                    altKey: !0,
                    bubbles: !0,
                    cancelable: !0,
                    changedTouches: !0,
                    ctrlKey: !0,
                    detail: !0,
                    eventPhase: !0,
                    metaKey: !0,
                    pageX: !0,
                    pageY: !0,
                    shiftKey: !0,
                    view: !0,
                    char: !0,
                    code: !0,
                    charCode: !0,
                    key: !0,
                    keyCode: !0,
                    button: !0,
                    buttons: !0,
                    clientX: !0,
                    clientY: !0,
                    offsetX: !0,
                    offsetY: !0,
                    pointerId: !0,
                    pointerType: !0,
                    screenX: !0,
                    screenY: !0,
                    targetTouches: !0,
                    toElement: !0,
                    touches: !0,
                    which: function(e) {
                        var t = e.button;
                        return null == e.which && Te.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Se.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which
                    }
                }, w.event.addProp), w.each({
                    focus: "focusin",
                    blur: "focusout"
                }, function(e, t) {
                    w.event.special[e] = {
                        setup: function() {
                            return _e(this, e, ke), !1
                        },
                        trigger: function() {
                            return _e(this, e), !0
                        },
                        delegateType: t
                    }
                }), w.each({
                    mouseenter: "mouseover",
                    mouseleave: "mouseout",
                    pointerenter: "pointerover",
                    pointerleave: "pointerout"
                }, function(e, t) {
                    w.event.special[e] = {
                        delegateType: t,
                        bindType: t,
                        handle: function(e) {
                            var n, r = e.relatedTarget,
                                i = e.handleObj;
                            return r && (r === this || w.contains(this, r)) || (e.type = i.origType, n = i.handler.apply(this, arguments), e.type = t), n
                        }
                    }
                }), w.fn.extend({
                    on: function(e, t, n, r) {
                        return Le(this, e, t, n, r)
                    },
                    one: function(e, t, n, r) {
                        return Le(this, e, t, n, r, 1)
                    },
                    off: function(e, t, n) {
                        var r, i;
                        if (e && e.preventDefault && e.handleObj) return r = e.handleObj, w(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                        if ("object" === lo(e)) {
                            for (i in e) this.off(i, t, e[i]);
                            return this
                        }
                        return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = Ce), this.each(function() {
                            w.event.remove(this, e, n, t)
                        })
                    }
                });
                var Oe = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
                    De = /<script|<style|<link/i,
                    Pe = /checked\s*(?:[^=]|=\s*.checked.)/i,
                    Re = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

                function Ie(e, t) {
                    return k(e, "table") && k(11 !== t.nodeType ? t : t.firstChild, "tr") && w(e).children("tbody")[0] || e
                }

                function Me(e) {
                    return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
                }

                function Ne(e) {
                    return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e
                }

                function Be(e, t) {
                    var n, r, i, o, a, s, c, u;
                    if (1 === t.nodeType) {
                        if (X.hasData(e) && (o = X.access(e), a = X.set(t, o), u = o.events))
                            for (i in delete a.handle, a.events = {}, u)
                                for (n = 0, r = u[i].length; n < r; n++) w.event.add(t, i, u[i][n]);
                        Y.hasData(e) && (s = Y.access(e), c = w.extend({}, s), Y.set(t, c))
                    }
                }

                function je(e, t, n, r) {
                    t = a.apply([], t);
                    var i, o, s, c, u, l, f = 0,
                        d = e.length,
                        h = d - 1,
                        v = t[0],
                        m = g(v);
                    if (m || d > 1 && "string" == typeof v && !p.checkClone && Pe.test(v)) return e.each(function(i) {
                        var o = e.eq(i);
                        m && (t[0] = v.call(this, i, o.html())), je(o, t, n, r)
                    });
                    if (d && (o = (i = xe(t, e[0].ownerDocument, !1, e, r)).firstChild, 1 === i.childNodes.length && (i = o), o || r)) {
                        for (c = (s = w.map(ve(i, "script"), Me)).length; f < d; f++) u = i, f !== h && (u = w.clone(u, !0, !0), c && w.merge(s, ve(u, "script"))), n.call(e[f], u, f);
                        if (c)
                            for (l = s[s.length - 1].ownerDocument, w.map(s, Ne), f = 0; f < c; f++) u = s[f], pe.test(u.type || "") && !X.access(u, "globalEval") && w.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? w._evalUrl && !u.noModule && w._evalUrl(u.src, {
                                nonce: u.nonce || u.getAttribute("nonce")
                            }) : y(u.textContent.replace(Re, ""), u, l))
                    }
                    return e
                }

                function Fe(e, t, n) {
                    for (var r, i = t ? w.filter(t, e) : e, o = 0; null != (r = i[o]); o++) n || 1 !== r.nodeType || w.cleanData(ve(r)), r.parentNode && (n && ie(r) && me(ve(r, "script")), r.parentNode.removeChild(r));
                    return e
                }
                w.extend({
                    htmlPrefilter: function(e) {
                        return e.replace(Oe, "<$1></$2>")
                    },
                    clone: function(e, t, n) {
                        var r, i, o, a, s, c, u, l = e.cloneNode(!0),
                            f = ie(e);
                        if (!(p.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || w.isXMLDoc(e)))
                            for (a = ve(l), r = 0, i = (o = ve(e)).length; r < i; r++) s = o[r], c = a[r], u = void 0, "input" === (u = c.nodeName.toLowerCase()) && de.test(s.type) ? c.checked = s.checked : "input" !== u && "textarea" !== u || (c.defaultValue = s.defaultValue);
                        if (t)
                            if (n)
                                for (o = o || ve(e), a = a || ve(l), r = 0, i = o.length; r < i; r++) Be(o[r], a[r]);
                            else Be(e, l);
                        return (a = ve(l, "script")).length > 0 && me(a, !f && ve(e, "script")), l
                    },
                    cleanData: function(e) {
                        for (var t, n, r, i = w.event.special, o = 0; void 0 !== (n = e[o]); o++)
                            if ($(n)) {
                                if (t = n[X.expando]) {
                                    if (t.events)
                                        for (r in t.events) i[r] ? w.event.remove(n, r) : w.removeEvent(n, r, t.handle);
                                    n[X.expando] = void 0
                                }
                                n[Y.expando] && (n[Y.expando] = void 0)
                            }
                    }
                }), w.fn.extend({
                    detach: function(e) {
                        return Fe(this, e, !0)
                    },
                    remove: function(e) {
                        return Fe(this, e)
                    },
                    text: function(e) {
                        return G(this, function(e) {
                            return void 0 === e ? w.text(this) : this.empty().each(function() {
                                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                            })
                        }, null, e, arguments.length)
                    },
                    append: function() {
                        return je(this, arguments, function(e) {
                            1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || Ie(this, e).appendChild(e)
                        })
                    },
                    prepend: function() {
                        return je(this, arguments, function(e) {
                            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                                var t = Ie(this, e);
                                t.insertBefore(e, t.firstChild)
                            }
                        })
                    },
                    before: function() {
                        return je(this, arguments, function(e) {
                            this.parentNode && this.parentNode.insertBefore(e, this)
                        })
                    },
                    after: function() {
                        return je(this, arguments, function(e) {
                            this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                        })
                    },
                    empty: function() {
                        for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (w.cleanData(ve(e, !1)), e.textContent = "");
                        return this
                    },
                    clone: function(e, t) {
                        return e = null != e && e, t = null == t ? e : t, this.map(function() {
                            return w.clone(this, e, t)
                        })
                    },
                    html: function(e) {
                        return G(this, function(e) {
                            var t = this[0] || {},
                                n = 0,
                                r = this.length;
                            if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                            if ("string" == typeof e && !De.test(e) && !ge[(he.exec(e) || ["", ""])[1].toLowerCase()]) {
                                e = w.htmlPrefilter(e);
                                try {
                                    for (; n < r; n++) 1 === (t = this[n] || {}).nodeType && (w.cleanData(ve(t, !1)), t.innerHTML = e);
                                    t = 0
                                } catch (e) {}
                            }
                            t && this.empty().append(e)
                        }, null, e, arguments.length)
                    },
                    replaceWith: function() {
                        var e = [];
                        return je(this, arguments, function(t) {
                            var n = this.parentNode;
                            w.inArray(this, e) < 0 && (w.cleanData(ve(this)), n && n.replaceChild(t, this))
                        }, e)
                    }
                }), w.each({
                    appendTo: "append",
                    prependTo: "prepend",
                    insertBefore: "before",
                    insertAfter: "after",
                    replaceAll: "replaceWith"
                }, function(e, t) {
                    w.fn[e] = function(e) {
                        for (var n, r = [], i = w(e), o = i.length - 1, a = 0; a <= o; a++) n = a === o ? this : this.clone(!0), w(i[a])[t](n), s.apply(r, n.get());
                        return this.pushStack(r)
                    }
                });
                var Ue = new RegExp("^(" + ee + ")(?!px)[a-z%]+$", "i"),
                    He = function(t) {
                        var n = t.ownerDocument.defaultView;
                        return n && n.opener || (n = e), n.getComputedStyle(t)
                    },
                    Ge = new RegExp(ne.join("|"), "i");

                function We(e, t, n) {
                    var r, i, o, a, s = e.style;
                    return (n = n || He(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || ie(e) || (a = w.style(e, t)), !p.pixelBoxStyles() && Ue.test(a) && Ge.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + "" : a
                }

                function ze(e, t) {
                    return {
                        get: function() {
                            if (!e()) return (this.get = t).apply(this, arguments);
                            delete this.get
                        }
                    }
                }! function() {
                    function t() {
                        if (l) {
                            u.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", l.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", re.appendChild(u).appendChild(l);
                            var t = e.getComputedStyle(l);
                            i = "1%" !== t.top, c = 12 === n(t.marginLeft), l.style.right = "60%", s = 36 === n(t.right), o = 36 === n(t.width), l.style.position = "absolute", a = 12 === n(l.offsetWidth / 3), re.removeChild(u), l = null
                        }
                    }

                    function n(e) {
                        return Math.round(parseFloat(e))
                    }
                    var i, o, a, s, c, u = r.createElement("div"),
                        l = r.createElement("div");
                    l.style && (l.style.backgroundClip = "content-box", l.cloneNode(!0).style.backgroundClip = "", p.clearCloneStyle = "content-box" === l.style.backgroundClip, w.extend(p, {
                        boxSizingReliable: function() {
                            return t(), o
                        },
                        pixelBoxStyles: function() {
                            return t(), s
                        },
                        pixelPosition: function() {
                            return t(), i
                        },
                        reliableMarginLeft: function() {
                            return t(), c
                        },
                        scrollboxSize: function() {
                            return t(), a
                        }
                    }))
                }();
                var qe = ["Webkit", "Moz", "ms"],
                    Ve = r.createElement("div").style,
                    $e = {};

                function Ke(e) {
                    var t = w.cssProps[e] || $e[e];
                    return t || (e in Ve ? e : $e[e] = function(e) {
                        for (var t = e[0].toUpperCase() + e.slice(1), n = qe.length; n--;)
                            if ((e = qe[n] + t) in Ve) return e
                    }(e) || e)
                }
                var Xe = /^(none|table(?!-c[ea]).+)/,
                    Ye = /^--/,
                    Je = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    },
                    Ze = {
                        letterSpacing: "0",
                        fontWeight: "400"
                    };

                function Qe(e, t, n) {
                    var r = te.exec(t);
                    return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
                }

                function et(e, t, n, r, i, o) {
                    var a = "width" === t ? 1 : 0,
                        s = 0,
                        c = 0;
                    if (n === (r ? "border" : "content")) return 0;
                    for (; a < 4; a += 2) "margin" === n && (c += w.css(e, n + ne[a], !0, i)), r ? ("content" === n && (c -= w.css(e, "padding" + ne[a], !0, i)), "margin" !== n && (c -= w.css(e, "border" + ne[a] + "Width", !0, i))) : (c += w.css(e, "padding" + ne[a], !0, i), "padding" !== n ? c += w.css(e, "border" + ne[a] + "Width", !0, i) : s += w.css(e, "border" + ne[a] + "Width", !0, i));
                    return !r && o >= 0 && (c += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - c - s - .5)) || 0), c
                }

                function tt(e, t, n) {
                    var r = He(e),
                        i = (!p.boxSizingReliable() || n) && "border-box" === w.css(e, "boxSizing", !1, r),
                        o = i,
                        a = We(e, t, r),
                        s = "offset" + t[0].toUpperCase() + t.slice(1);
                    if (Ue.test(a)) {
                        if (!n) return a;
                        a = "auto"
                    }
                    return (!p.boxSizingReliable() && i || "auto" === a || !parseFloat(a) && "inline" === w.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === w.css(e, "boxSizing", !1, r), (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + et(e, t, n || (i ? "border" : "content"), o, r, a) + "px"
                }

                function nt(e, t, n, r, i) {
                    return new nt.prototype.init(e, t, n, r, i)
                }
                w.extend({
                    cssHooks: {
                        opacity: {
                            get: function(e, t) {
                                if (t) {
                                    var n = We(e, "opacity");
                                    return "" === n ? "1" : n
                                }
                            }
                        }
                    },
                    cssNumber: {
                        animationIterationCount: !0,
                        columnCount: !0,
                        fillOpacity: !0,
                        flexGrow: !0,
                        flexShrink: !0,
                        fontWeight: !0,
                        gridArea: !0,
                        gridColumn: !0,
                        gridColumnEnd: !0,
                        gridColumnStart: !0,
                        gridRow: !0,
                        gridRowEnd: !0,
                        gridRowStart: !0,
                        lineHeight: !0,
                        opacity: !0,
                        order: !0,
                        orphans: !0,
                        widows: !0,
                        zIndex: !0,
                        zoom: !0
                    },
                    cssProps: {},
                    style: function(e, t, n, r) {
                        if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                            var i, o, a, s = V(t),
                                c = Ye.test(t),
                                u = e.style;
                            if (c || (t = Ke(s)), a = w.cssHooks[t] || w.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : u[t];
                            "string" === (o = lo(n)) && (i = te.exec(n)) && i[1] && (n = ce(e, t, i), o = "number"), null != n && n == n && ("number" !== o || c || (n += i && i[3] || (w.cssNumber[s] ? "" : "px")), p.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (u[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (c ? u.setProperty(t, n) : u[t] = n))
                        }
                    },
                    css: function(e, t, n, r) {
                        var i, o, a, s = V(t);
                        return Ye.test(t) || (t = Ke(s)), (a = w.cssHooks[t] || w.cssHooks[s]) && "get" in a && (i = a.get(e, !0, n)), void 0 === i && (i = We(e, t, r)), "normal" === i && t in Ze && (i = Ze[t]), "" === n || n ? (o = parseFloat(i), !0 === n || isFinite(o) ? o || 0 : i) : i
                    }
                }), w.each(["height", "width"], function(e, t) {
                    w.cssHooks[t] = {
                        get: function(e, n, r) {
                            if (n) return !Xe.test(w.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? tt(e, t, r) : se(e, Je, function() {
                                return tt(e, t, r)
                            })
                        },
                        set: function(e, n, r) {
                            var i, o = He(e),
                                a = !p.scrollboxSize() && "absolute" === o.position,
                                s = (a || r) && "border-box" === w.css(e, "boxSizing", !1, o),
                                c = r ? et(e, t, r, s, o) : 0;
                            return s && a && (c -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - et(e, t, "border", !1, o) - .5)), c && (i = te.exec(n)) && "px" !== (i[3] || "px") && (e.style[t] = n, n = w.css(e, t)), Qe(0, n, c)
                        }
                    }
                }), w.cssHooks.marginLeft = ze(p.reliableMarginLeft, function(e, t) {
                    if (t) return (parseFloat(We(e, "marginLeft")) || e.getBoundingClientRect().left - se(e, {
                        marginLeft: 0
                    }, function() {
                        return e.getBoundingClientRect().left
                    })) + "px"
                }), w.each({
                    margin: "",
                    padding: "",
                    border: "Width"
                }, function(e, t) {
                    w.cssHooks[e + t] = {
                        expand: function(n) {
                            for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++) i[e + ne[r] + t] = o[r] || o[r - 2] || o[0];
                            return i
                        }
                    }, "margin" !== e && (w.cssHooks[e + t].set = Qe)
                }), w.fn.extend({
                    css: function(e, t) {
                        return G(this, function(e, t, n) {
                            var r, i, o = {},
                                a = 0;
                            if (Array.isArray(t)) {
                                for (r = He(e), i = t.length; a < i; a++) o[t[a]] = w.css(e, t[a], !1, r);
                                return o
                            }
                            return void 0 !== n ? w.style(e, t, n) : w.css(e, t)
                        }, e, t, arguments.length > 1)
                    }
                }), w.Tween = nt, nt.prototype = {
                    constructor: nt,
                    init: function(e, t, n, r, i, o) {
                        this.elem = e, this.prop = n, this.easing = i || w.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (w.cssNumber[n] ? "" : "px")
                    },
                    cur: function() {
                        var e = nt.propHooks[this.prop];
                        return e && e.get ? e.get(this) : nt.propHooks._default.get(this)
                    },
                    run: function(e) {
                        var t, n = nt.propHooks[this.prop];
                        return this.options.duration ? this.pos = t = w.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : nt.propHooks._default.set(this), this
                    }
                }, nt.prototype.init.prototype = nt.prototype, nt.propHooks = {
                    _default: {
                        get: function(e) {
                            var t;
                            return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = w.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
                        },
                        set: function(e) {
                            w.fx.step[e.prop] ? w.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !w.cssHooks[e.prop] && null == e.elem.style[Ke(e.prop)] ? e.elem[e.prop] = e.now : w.style(e.elem, e.prop, e.now + e.unit)
                        }
                    }
                }, nt.propHooks.scrollTop = nt.propHooks.scrollLeft = {
                    set: function(e) {
                        e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
                    }
                }, w.easing = {
                    linear: function(e) {
                        return e
                    },
                    swing: function(e) {
                        return .5 - Math.cos(e * Math.PI) / 2
                    },
                    _default: "swing"
                }, w.fx = nt.prototype.init, w.fx.step = {};
                var rt, it, ot = /^(?:toggle|show|hide)$/,
                    at = /queueHooks$/;

                function st() {
                    it && (!1 === r.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(st) : e.setTimeout(st, w.fx.interval), w.fx.tick())
                }

                function ct() {
                    return e.setTimeout(function() {
                        rt = void 0
                    }), rt = Date.now()
                }

                function ut(e, t) {
                    var n, r = 0,
                        i = {
                            height: e
                        };
                    for (t = t ? 1 : 0; r < 4; r += 2 - t) i["margin" + (n = ne[r])] = i["padding" + n] = e;
                    return t && (i.opacity = i.width = e), i
                }

                function lt(e, t, n) {
                    for (var r, i = (ft.tweeners[t] || []).concat(ft.tweeners["*"]), o = 0, a = i.length; o < a; o++)
                        if (r = i[o].call(n, t, e)) return r
                }

                function ft(e, t, n) {
                    var r, i, o = 0,
                        a = ft.prefilters.length,
                        s = w.Deferred().always(function() {
                            delete c.elem
                        }),
                        c = function() {
                            if (i) return !1;
                            for (var t = rt || ct(), n = Math.max(0, u.startTime + u.duration - t), r = 1 - (n / u.duration || 0), o = 0, a = u.tweens.length; o < a; o++) u.tweens[o].run(r);
                            return s.notifyWith(e, [u, r, n]), r < 1 && a ? n : (a || s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u]), !1)
                        },
                        u = s.promise({
                            elem: e,
                            props: w.extend({}, t),
                            opts: w.extend(!0, {
                                specialEasing: {},
                                easing: w.easing._default
                            }, n),
                            originalProperties: t,
                            originalOptions: n,
                            startTime: rt || ct(),
                            duration: n.duration,
                            tweens: [],
                            createTween: function(t, n) {
                                var r = w.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                                return u.tweens.push(r), r
                            },
                            stop: function(t) {
                                var n = 0,
                                    r = t ? u.tweens.length : 0;
                                if (i) return this;
                                for (i = !0; n < r; n++) u.tweens[n].run(1);
                                return t ? (s.notifyWith(e, [u, 1, 0]), s.resolveWith(e, [u, t])) : s.rejectWith(e, [u, t]), this
                            }
                        }),
                        l = u.props;
                    for (! function(e, t) {
                            var n, r, i, o, a;
                            for (n in e)
                                if (i = t[r = V(n)], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = w.cssHooks[r]) && "expand" in a)
                                    for (n in o = a.expand(o), delete e[r], o) n in e || (e[n] = o[n], t[n] = i);
                                else t[r] = i
                        }(l, u.opts.specialEasing); o < a; o++)
                        if (r = ft.prefilters[o].call(u, e, l, u.opts)) return g(r.stop) && (w._queueHooks(u.elem, u.opts.queue).stop = r.stop.bind(r)), r;
                    return w.map(l, lt, u), g(u.opts.start) && u.opts.start.call(e, u), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always), w.fx.timer(w.extend(c, {
                        elem: e,
                        anim: u,
                        queue: u.opts.queue
                    })), u
                }
                w.Animation = w.extend(ft, {
                        tweeners: {
                            "*": [function(e, t) {
                                var n = this.createTween(e, t);
                                return ce(n.elem, e, te.exec(t), n), n
                            }]
                        },
                        tweener: function(e, t) {
                            g(e) ? (t = e, e = ["*"]) : e = e.match(M);
                            for (var n, r = 0, i = e.length; r < i; r++) n = e[r], ft.tweeners[n] = ft.tweeners[n] || [], ft.tweeners[n].unshift(t)
                        },
                        prefilters: [function(e, t, n) {
                            var r, i, o, a, s, c, u, l, f = "width" in t || "height" in t,
                                d = this,
                                h = {},
                                p = e.style,
                                g = e.nodeType && ae(e),
                                v = X.get(e, "fxshow");
                            for (r in n.queue || (null == (a = w._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function() {
                                    a.unqueued || s()
                                }), a.unqueued++, d.always(function() {
                                    d.always(function() {
                                        a.unqueued--, w.queue(e, "fx").length || a.empty.fire()
                                    })
                                })), t)
                                if (i = t[r], ot.test(i)) {
                                    if (delete t[r], o = o || "toggle" === i, i === (g ? "hide" : "show")) {
                                        if ("show" !== i || !v || void 0 === v[r]) continue;
                                        g = !0
                                    }
                                    h[r] = v && v[r] || w.style(e, r)
                                }
                            if ((c = !w.isEmptyObject(t)) || !w.isEmptyObject(h))
                                for (r in f && 1 === e.nodeType && (n.overflow = [p.overflow, p.overflowX, p.overflowY], null == (u = v && v.display) && (u = X.get(e, "display")), "none" === (l = w.css(e, "display")) && (u ? l = u : (fe([e], !0), u = e.style.display || u, l = w.css(e, "display"), fe([e]))), ("inline" === l || "inline-block" === l && null != u) && "none" === w.css(e, "float") && (c || (d.done(function() {
                                        p.display = u
                                    }), null == u && (l = p.display, u = "none" === l ? "" : l)), p.display = "inline-block")), n.overflow && (p.overflow = "hidden", d.always(function() {
                                        p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
                                    })), c = !1, h) c || (v ? "hidden" in v && (g = v.hidden) : v = X.access(e, "fxshow", {
                                    display: u
                                }), o && (v.hidden = !g), g && fe([e], !0), d.done(function() {
                                    for (r in g || fe([e]), X.remove(e, "fxshow"), h) w.style(e, r, h[r])
                                })), c = lt(g ? v[r] : 0, r, d), r in v || (v[r] = c.start, g && (c.end = c.start, c.start = 0))
                        }],
                        prefilter: function(e, t) {
                            t ? ft.prefilters.unshift(e) : ft.prefilters.push(e)
                        }
                    }), w.speed = function(e, t, n) {
                        var r = e && "object" === lo(e) ? w.extend({}, e) : {
                            complete: n || !n && t || g(e) && e,
                            duration: e,
                            easing: n && t || t && !g(t) && t
                        };
                        return w.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in w.fx.speeds ? r.duration = w.fx.speeds[r.duration] : r.duration = w.fx.speeds._default), null != r.queue && !0 !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function() {
                            g(r.old) && r.old.call(this), r.queue && w.dequeue(this, r.queue)
                        }, r
                    }, w.fn.extend({
                        fadeTo: function(e, t, n, r) {
                            return this.filter(ae).css("opacity", 0).show().end().animate({
                                opacity: t
                            }, e, n, r)
                        },
                        animate: function(e, t, n, r) {
                            var i = w.isEmptyObject(e),
                                o = w.speed(t, n, r),
                                a = function() {
                                    var t = ft(this, w.extend({}, e), o);
                                    (i || X.get(this, "finish")) && t.stop(!0)
                                };
                            return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
                        },
                        stop: function(e, t, n) {
                            var r = function(e) {
                                var t = e.stop;
                                delete e.stop, t(n)
                            };
                            return "string" != typeof e && (n = t, t = e, e = void 0), t && !1 !== e && this.queue(e || "fx", []), this.each(function() {
                                var t = !0,
                                    i = null != e && e + "queueHooks",
                                    o = w.timers,
                                    a = X.get(this);
                                if (i) a[i] && a[i].stop && r(a[i]);
                                else
                                    for (i in a) a[i] && a[i].stop && at.test(i) && r(a[i]);
                                for (i = o.length; i--;) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n), t = !1, o.splice(i, 1));
                                !t && n || w.dequeue(this, e)
                            })
                        },
                        finish: function(e) {
                            return !1 !== e && (e = e || "fx"), this.each(function() {
                                var t, n = X.get(this),
                                    r = n[e + "queue"],
                                    i = n[e + "queueHooks"],
                                    o = w.timers,
                                    a = r ? r.length : 0;
                                for (n.finish = !0, w.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                                for (t = 0; t < a; t++) r[t] && r[t].finish && r[t].finish.call(this);
                                delete n.finish
                            })
                        }
                    }), w.each(["toggle", "show", "hide"], function(e, t) {
                        var n = w.fn[t];
                        w.fn[t] = function(e, r, i) {
                            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(ut(t, !0), e, r, i)
                        }
                    }), w.each({
                        slideDown: ut("show"),
                        slideUp: ut("hide"),
                        slideToggle: ut("toggle"),
                        fadeIn: {
                            opacity: "show"
                        },
                        fadeOut: {
                            opacity: "hide"
                        },
                        fadeToggle: {
                            opacity: "toggle"
                        }
                    }, function(e, t) {
                        w.fn[e] = function(e, n, r) {
                            return this.animate(t, e, n, r)
                        }
                    }), w.timers = [], w.fx.tick = function() {
                        var e, t = 0,
                            n = w.timers;
                        for (rt = Date.now(); t < n.length; t++)(e = n[t])() || n[t] !== e || n.splice(t--, 1);
                        n.length || w.fx.stop(), rt = void 0
                    }, w.fx.timer = function(e) {
                        w.timers.push(e), w.fx.start()
                    }, w.fx.interval = 13, w.fx.start = function() {
                        it || (it = !0, st())
                    }, w.fx.stop = function() {
                        it = null
                    }, w.fx.speeds = {
                        slow: 600,
                        fast: 200,
                        _default: 400
                    }, w.fn.delay = function(t, n) {
                        return t = w.fx && w.fx.speeds[t] || t, n = n || "fx", this.queue(n, function(n, r) {
                            var i = e.setTimeout(n, t);
                            r.stop = function() {
                                e.clearTimeout(i)
                            }
                        })
                    },
                    function() {
                        var e = r.createElement("input"),
                            t = r.createElement("select").appendChild(r.createElement("option"));
                        e.type = "checkbox", p.checkOn = "" !== e.value, p.optSelected = t.selected, (e = r.createElement("input")).value = "t", e.type = "radio", p.radioValue = "t" === e.value
                    }();
                var dt, ht = w.expr.attrHandle;
                w.fn.extend({
                    attr: function(e, t) {
                        return G(this, w.attr, e, t, arguments.length > 1)
                    },
                    removeAttr: function(e) {
                        return this.each(function() {
                            w.removeAttr(this, e)
                        })
                    }
                }), w.extend({
                    attr: function(e, t, n) {
                        var r, i, o = e.nodeType;
                        if (3 !== o && 8 !== o && 2 !== o) return void 0 === e.getAttribute ? w.prop(e, t, n) : (1 === o && w.isXMLDoc(e) || (i = w.attrHooks[t.toLowerCase()] || (w.expr.match.bool.test(t) ? dt : void 0)), void 0 !== n ? null === n ? void w.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (r = i.get(e, t)) ? r : null == (r = w.find.attr(e, t)) ? void 0 : r)
                    },
                    attrHooks: {
                        type: {
                            set: function(e, t) {
                                if (!p.radioValue && "radio" === t && k(e, "input")) {
                                    var n = e.value;
                                    return e.setAttribute("type", t), n && (e.value = n), t
                                }
                            }
                        }
                    },
                    removeAttr: function(e, t) {
                        var n, r = 0,
                            i = t && t.match(M);
                        if (i && 1 === e.nodeType)
                            for (; n = i[r++];) e.removeAttribute(n)
                    }
                }), dt = {
                    set: function(e, t, n) {
                        return !1 === t ? w.removeAttr(e, n) : e.setAttribute(n, n), n
                    }
                }, w.each(w.expr.match.bool.source.match(/\w+/g), function(e, t) {
                    var n = ht[t] || w.find.attr;
                    ht[t] = function(e, t, r) {
                        var i, o, a = t.toLowerCase();
                        return r || (o = ht[a], ht[a] = i, i = null != n(e, t, r) ? a : null, ht[a] = o), i
                    }
                });
                var pt = /^(?:input|select|textarea|button)$/i,
                    gt = /^(?:a|area)$/i;

                function vt(e) {
                    return (e.match(M) || []).join(" ")
                }

                function mt(e) {
                    return e.getAttribute && e.getAttribute("class") || ""
                }

                function yt(e) {
                    return Array.isArray(e) ? e : "string" == typeof e && e.match(M) || []
                }
                w.fn.extend({
                    prop: function(e, t) {
                        return G(this, w.prop, e, t, arguments.length > 1)
                    },
                    removeProp: function(e) {
                        return this.each(function() {
                            delete this[w.propFix[e] || e]
                        })
                    }
                }), w.extend({
                    prop: function(e, t, n) {
                        var r, i, o = e.nodeType;
                        if (3 !== o && 8 !== o && 2 !== o) return 1 === o && w.isXMLDoc(e) || (t = w.propFix[t] || t, i = w.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
                    },
                    propHooks: {
                        tabIndex: {
                            get: function(e) {
                                var t = w.find.attr(e, "tabindex");
                                return t ? parseInt(t, 10) : pt.test(e.nodeName) || gt.test(e.nodeName) && e.href ? 0 : -1
                            }
                        }
                    },
                    propFix: {
                        for: "htmlFor",
                        class: "className"
                    }
                }), p.optSelected || (w.propHooks.selected = {
                    get: function(e) {
                        var t = e.parentNode;
                        return t && t.parentNode && t.parentNode.selectedIndex, null
                    },
                    set: function(e) {
                        var t = e.parentNode;
                        t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
                    }
                }), w.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                    w.propFix[this.toLowerCase()] = this
                }), w.fn.extend({
                    addClass: function(e) {
                        var t, n, r, i, o, a, s, c = 0;
                        if (g(e)) return this.each(function(t) {
                            w(this).addClass(e.call(this, t, mt(this)))
                        });
                        if ((t = yt(e)).length)
                            for (; n = this[c++];)
                                if (i = mt(n), r = 1 === n.nodeType && " " + vt(i) + " ") {
                                    for (a = 0; o = t[a++];) r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                                    i !== (s = vt(r)) && n.setAttribute("class", s)
                                }
                        return this
                    },
                    removeClass: function(e) {
                        var t, n, r, i, o, a, s, c = 0;
                        if (g(e)) return this.each(function(t) {
                            w(this).removeClass(e.call(this, t, mt(this)))
                        });
                        if (!arguments.length) return this.attr("class", "");
                        if ((t = yt(e)).length)
                            for (; n = this[c++];)
                                if (i = mt(n), r = 1 === n.nodeType && " " + vt(i) + " ") {
                                    for (a = 0; o = t[a++];)
                                        for (; r.indexOf(" " + o + " ") > -1;) r = r.replace(" " + o + " ", " ");
                                    i !== (s = vt(r)) && n.setAttribute("class", s)
                                }
                        return this
                    },
                    toggleClass: function(e, t) {
                        var n = lo(e),
                            r = "string" === n || Array.isArray(e);
                        return "boolean" == typeof t && r ? t ? this.addClass(e) : this.removeClass(e) : g(e) ? this.each(function(n) {
                            w(this).toggleClass(e.call(this, n, mt(this), t), t)
                        }) : this.each(function() {
                            var t, i, o, a;
                            if (r)
                                for (i = 0, o = w(this), a = yt(e); t = a[i++];) o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                            else void 0 !== e && "boolean" !== n || ((t = mt(this)) && X.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : X.get(this, "__className__") || ""))
                        })
                    },
                    hasClass: function(e) {
                        var t, n, r = 0;
                        for (t = " " + e + " "; n = this[r++];)
                            if (1 === n.nodeType && (" " + vt(mt(n)) + " ").indexOf(t) > -1) return !0;
                        return !1
                    }
                });
                var bt = /\r/g;
                w.fn.extend({
                    val: function(e) {
                        var t, n, r, i = this[0];
                        return arguments.length ? (r = g(e), this.each(function(n) {
                            var i;
                            1 === this.nodeType && (null == (i = r ? e.call(this, n, w(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = w.map(i, function(e) {
                                return null == e ? "" : e + ""
                            })), (t = w.valHooks[this.type] || w.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                        })) : i ? (t = w.valHooks[i.type] || w.valHooks[i.nodeName.toLowerCase()]) && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : "string" == typeof(n = i.value) ? n.replace(bt, "") : null == n ? "" : n : void 0
                    }
                }), w.extend({
                    valHooks: {
                        option: {
                            get: function(e) {
                                var t = w.find.attr(e, "value");
                                return null != t ? t : vt(w.text(e))
                            }
                        },
                        select: {
                            get: function(e) {
                                var t, n, r, i = e.options,
                                    o = e.selectedIndex,
                                    a = "select-one" === e.type,
                                    s = a ? null : [],
                                    c = a ? o + 1 : i.length;
                                for (r = o < 0 ? c : a ? o : 0; r < c; r++)
                                    if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !k(n.parentNode, "optgroup"))) {
                                        if (t = w(n).val(), a) return t;
                                        s.push(t)
                                    }
                                return s
                            },
                            set: function(e, t) {
                                for (var n, r, i = e.options, o = w.makeArray(t), a = i.length; a--;)((r = i[a]).selected = w.inArray(w.valHooks.option.get(r), o) > -1) && (n = !0);
                                return n || (e.selectedIndex = -1), o
                            }
                        }
                    }
                }), w.each(["radio", "checkbox"], function() {
                    w.valHooks[this] = {
                        set: function(e, t) {
                            if (Array.isArray(t)) return e.checked = w.inArray(w(e).val(), t) > -1
                        }
                    }, p.checkOn || (w.valHooks[this].get = function(e) {
                        return null === e.getAttribute("value") ? "on" : e.value
                    })
                }), p.focusin = "onfocusin" in e;
                var wt = /^(?:focusinfocus|focusoutblur)$/,
                    xt = function(e) {
                        e.stopPropagation()
                    };
                w.extend(w.event, {
                    trigger: function(t, n, i, o) {
                        var a, s, c, u, l, d, h, p, m = [i || r],
                            y = f.call(t, "type") ? t.type : t,
                            b = f.call(t, "namespace") ? t.namespace.split(".") : [];
                        if (s = p = c = i = i || r, 3 !== i.nodeType && 8 !== i.nodeType && !wt.test(y + w.event.triggered) && (y.indexOf(".") > -1 && (b = y.split("."), y = b.shift(), b.sort()), l = y.indexOf(":") < 0 && "on" + y, (t = t[w.expando] ? t : new w.Event(y, "object" === lo(t) && t)).isTrigger = o ? 2 : 3, t.namespace = b.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : w.makeArray(n, [t]), h = w.event.special[y] || {}, o || !h.trigger || !1 !== h.trigger.apply(i, n))) {
                            if (!o && !h.noBubble && !v(i)) {
                                for (u = h.delegateType || y, wt.test(u + y) || (s = s.parentNode); s; s = s.parentNode) m.push(s), c = s;
                                c === (i.ownerDocument || r) && m.push(c.defaultView || c.parentWindow || e)
                            }
                            for (a = 0;
                                (s = m[a++]) && !t.isPropagationStopped();) p = s, t.type = a > 1 ? u : h.bindType || y, (d = (X.get(s, "events") || {})[t.type] && X.get(s, "handle")) && d.apply(s, n), (d = l && s[l]) && d.apply && $(s) && (t.result = d.apply(s, n), !1 === t.result && t.preventDefault());
                            return t.type = y, o || t.isDefaultPrevented() || h._default && !1 !== h._default.apply(m.pop(), n) || !$(i) || l && g(i[y]) && !v(i) && ((c = i[l]) && (i[l] = null), w.event.triggered = y, t.isPropagationStopped() && p.addEventListener(y, xt), i[y](), t.isPropagationStopped() && p.removeEventListener(y, xt), w.event.triggered = void 0, c && (i[l] = c)), t.result
                        }
                    },
                    simulate: function(e, t, n) {
                        var r = w.extend(new w.Event, n, {
                            type: e,
                            isSimulated: !0
                        });
                        w.event.trigger(r, null, t)
                    }
                }), w.fn.extend({
                    trigger: function(e, t) {
                        return this.each(function() {
                            w.event.trigger(e, t, this)
                        })
                    },
                    triggerHandler: function(e, t) {
                        var n = this[0];
                        if (n) return w.event.trigger(e, t, n, !0)
                    }
                }), p.focusin || w.each({
                    focus: "focusin",
                    blur: "focusout"
                }, function(e, t) {
                    var n = function(e) {
                        w.event.simulate(t, e.target, w.event.fix(e))
                    };
                    w.event.special[t] = {
                        setup: function() {
                            var r = this.ownerDocument || this,
                                i = X.access(r, t);
                            i || r.addEventListener(e, n, !0), X.access(r, t, (i || 0) + 1)
                        },
                        teardown: function() {
                            var r = this.ownerDocument || this,
                                i = X.access(r, t) - 1;
                            i ? X.access(r, t, i) : (r.removeEventListener(e, n, !0), X.remove(r, t))
                        }
                    }
                });
                var Tt = e.location,
                    St = Date.now(),
                    Et = /\?/;
                w.parseXML = function(t) {
                    var n;
                    if (!t || "string" != typeof t) return null;
                    try {
                        n = (new e.DOMParser).parseFromString(t, "text/xml")
                    } catch (e) {
                        n = void 0
                    }
                    return n && !n.getElementsByTagName("parsererror").length || w.error("Invalid XML: " + t), n
                };
                var At = /\[\]$/,
                    Ct = /\r?\n/g,
                    kt = /^(?:submit|button|image|reset|file)$/i,
                    Lt = /^(?:input|select|textarea|keygen)/i;

                function _t(e, t, n, r) {
                    var i;
                    if (Array.isArray(t)) w.each(t, function(t, i) {
                        n || At.test(e) ? r(e, i) : _t(e + "[" + ("object" === lo(i) && null != i ? t : "") + "]", i, n, r)
                    });
                    else if (n || "object" !== b(t)) r(e, t);
                    else
                        for (i in t) _t(e + "[" + i + "]", t[i], n, r)
                }
                w.param = function(e, t) {
                    var n, r = [],
                        i = function(e, t) {
                            var n = g(t) ? t() : t;
                            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
                        };
                    if (null == e) return "";
                    if (Array.isArray(e) || e.jquery && !w.isPlainObject(e)) w.each(e, function() {
                        i(this.name, this.value)
                    });
                    else
                        for (n in e) _t(n, e[n], t, i);
                    return r.join("&")
                }, w.fn.extend({
                    serialize: function() {
                        return w.param(this.serializeArray())
                    },
                    serializeArray: function() {
                        return this.map(function() {
                            var e = w.prop(this, "elements");
                            return e ? w.makeArray(e) : this
                        }).filter(function() {
                            var e = this.type;
                            return this.name && !w(this).is(":disabled") && Lt.test(this.nodeName) && !kt.test(e) && (this.checked || !de.test(e))
                        }).map(function(e, t) {
                            var n = w(this).val();
                            return null == n ? null : Array.isArray(n) ? w.map(n, function(e) {
                                return {
                                    name: t.name,
                                    value: e.replace(Ct, "\r\n")
                                }
                            }) : {
                                name: t.name,
                                value: n.replace(Ct, "\r\n")
                            }
                        }).get()
                    }
                });
                var Ot = /%20/g,
                    Dt = /#.*$/,
                    Pt = /([?&])_=[^&]*/,
                    Rt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
                    It = /^(?:GET|HEAD)$/,
                    Mt = /^\/\//,
                    Nt = {},
                    Bt = {},
                    jt = "*/".concat("*"),
                    Ft = r.createElement("a");

                function Ut(e) {
                    return function(t, n) {
                        "string" != typeof t && (n = t, t = "*");
                        var r, i = 0,
                            o = t.toLowerCase().match(M) || [];
                        if (g(n))
                            for (; r = o[i++];) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
                    }
                }

                function Ht(e, t, n, r) {
                    var i = {},
                        o = e === Bt;

                    function a(s) {
                        var c;
                        return i[s] = !0, w.each(e[s] || [], function(e, s) {
                            var u = s(t, n, r);
                            return "string" != typeof u || o || i[u] ? o ? !(c = u) : void 0 : (t.dataTypes.unshift(u), a(u), !1)
                        }), c
                    }
                    return a(t.dataTypes[0]) || !i["*"] && a("*")
                }

                function Gt(e, t) {
                    var n, r, i = w.ajaxSettings.flatOptions || {};
                    for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
                    return r && w.extend(!0, e, r), e
                }
                Ft.href = Tt.href, w.extend({
                    active: 0,
                    lastModified: {},
                    etag: {},
                    ajaxSettings: {
                        url: Tt.href,
                        type: "GET",
                        isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Tt.protocol),
                        global: !0,
                        processData: !0,
                        async: !0,
                        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                        accepts: {
                            "*": jt,
                            text: "text/plain",
                            html: "text/html",
                            xml: "application/xml, text/xml",
                            json: "application/json, text/javascript"
                        },
                        contents: {
                            xml: /\bxml\b/,
                            html: /\bhtml/,
                            json: /\bjson\b/
                        },
                        responseFields: {
                            xml: "responseXML",
                            text: "responseText",
                            json: "responseJSON"
                        },
                        converters: {
                            "* text": String,
                            "text html": !0,
                            "text json": JSON.parse,
                            "text xml": w.parseXML
                        },
                        flatOptions: {
                            url: !0,
                            context: !0
                        }
                    },
                    ajaxSetup: function(e, t) {
                        return t ? Gt(Gt(e, w.ajaxSettings), t) : Gt(w.ajaxSettings, e)
                    },
                    ajaxPrefilter: Ut(Nt),
                    ajaxTransport: Ut(Bt),
                    ajax: function(t, n) {
                        "object" === lo(t) && (n = t, t = void 0), n = n || {};
                        var i, o, a, s, c, u, l, f, d, h, p = w.ajaxSetup({}, n),
                            g = p.context || p,
                            v = p.context && (g.nodeType || g.jquery) ? w(g) : w.event,
                            m = w.Deferred(),
                            y = w.Callbacks("once memory"),
                            b = p.statusCode || {},
                            x = {},
                            T = {},
                            S = "canceled",
                            E = {
                                readyState: 0,
                                getResponseHeader: function(e) {
                                    var t;
                                    if (l) {
                                        if (!s)
                                            for (s = {}; t = Rt.exec(a);) s[t[1].toLowerCase() + " "] = (s[t[1].toLowerCase() + " "] || []).concat(t[2]);
                                        t = s[e.toLowerCase() + " "]
                                    }
                                    return null == t ? null : t.join(", ")
                                },
                                getAllResponseHeaders: function() {
                                    return l ? a : null
                                },
                                setRequestHeader: function(e, t) {
                                    return null == l && (e = T[e.toLowerCase()] = T[e.toLowerCase()] || e, x[e] = t), this
                                },
                                overrideMimeType: function(e) {
                                    return null == l && (p.mimeType = e), this
                                },
                                statusCode: function(e) {
                                    var t;
                                    if (e)
                                        if (l) E.always(e[E.status]);
                                        else
                                            for (t in e) b[t] = [b[t], e[t]];
                                    return this
                                },
                                abort: function(e) {
                                    var t = e || S;
                                    return i && i.abort(t), A(0, t), this
                                }
                            };
                        if (m.promise(E), p.url = ((t || p.url || Tt.href) + "").replace(Mt, Tt.protocol + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = (p.dataType || "*").toLowerCase().match(M) || [""], null == p.crossDomain) {
                            u = r.createElement("a");
                            try {
                                u.href = p.url, u.href = u.href, p.crossDomain = Ft.protocol + "//" + Ft.host != u.protocol + "//" + u.host
                            } catch (e) {
                                p.crossDomain = !0
                            }
                        }
                        if (p.data && p.processData && "string" != typeof p.data && (p.data = w.param(p.data, p.traditional)), Ht(Nt, p, n, E), l) return E;
                        for (d in (f = w.event && p.global) && 0 == w.active++ && w.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !It.test(p.type), o = p.url.replace(Dt, ""), p.hasContent ? p.data && p.processData && 0 === (p.contentType || "").indexOf("application/x-www-form-urlencoded") && (p.data = p.data.replace(Ot, "+")) : (h = p.url.slice(o.length), p.data && (p.processData || "string" == typeof p.data) && (o += (Et.test(o) ? "&" : "?") + p.data, delete p.data), !1 === p.cache && (o = o.replace(Pt, "$1"), h = (Et.test(o) ? "&" : "?") + "_=" + St++ + h), p.url = o + h), p.ifModified && (w.lastModified[o] && E.setRequestHeader("If-Modified-Since", w.lastModified[o]), w.etag[o] && E.setRequestHeader("If-None-Match", w.etag[o])), (p.data && p.hasContent && !1 !== p.contentType || n.contentType) && E.setRequestHeader("Content-Type", p.contentType), E.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + jt + "; q=0.01" : "") : p.accepts["*"]), p.headers) E.setRequestHeader(d, p.headers[d]);
                        if (p.beforeSend && (!1 === p.beforeSend.call(g, E, p) || l)) return E.abort();
                        if (S = "abort", y.add(p.complete), E.done(p.success), E.fail(p.error), i = Ht(Bt, p, n, E)) {
                            if (E.readyState = 1, f && v.trigger("ajaxSend", [E, p]), l) return E;
                            p.async && p.timeout > 0 && (c = e.setTimeout(function() {
                                E.abort("timeout")
                            }, p.timeout));
                            try {
                                l = !1, i.send(x, A)
                            } catch (e) {
                                if (l) throw e;
                                A(-1, e)
                            }
                        } else A(-1, "No Transport");

                        function A(t, n, r, s) {
                            var u, d, h, x, T, S = n;
                            l || (l = !0, c && e.clearTimeout(c), i = void 0, a = s || "", E.readyState = t > 0 ? 4 : 0, u = t >= 200 && t < 300 || 304 === t, r && (x = function(e, t, n) {
                                for (var r, i, o, a, s = e.contents, c = e.dataTypes;
                                    "*" === c[0];) c.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                                if (r)
                                    for (i in s)
                                        if (s[i] && s[i].test(r)) {
                                            c.unshift(i);
                                            break
                                        }
                                if (c[0] in n) o = c[0];
                                else {
                                    for (i in n) {
                                        if (!c[0] || e.converters[i + " " + c[0]]) {
                                            o = i;
                                            break
                                        }
                                        a || (a = i)
                                    }
                                    o = o || a
                                }
                                if (o) return o !== c[0] && c.unshift(o), n[o]
                            }(p, E, r)), x = function(e, t, n, r) {
                                var i, o, a, s, c, u = {},
                                    l = e.dataTypes.slice();
                                if (l[1])
                                    for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
                                for (o = l.shift(); o;)
                                    if (e.responseFields[o] && (n[e.responseFields[o]] = t), !c && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), c = o, o = l.shift())
                                        if ("*" === o) o = c;
                                        else if ("*" !== c && c !== o) {
                                    if (!(a = u[c + " " + o] || u["* " + o]))
                                        for (i in u)
                                            if ((s = i.split(" "))[1] === o && (a = u[c + " " + s[0]] || u["* " + s[0]])) {
                                                !0 === a ? a = u[i] : !0 !== u[i] && (o = s[0], l.unshift(s[1]));
                                                break
                                            }
                                    if (!0 !== a)
                                        if (a && e.throws) t = a(t);
                                        else try {
                                            t = a(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: a ? e : "No conversion from " + c + " to " + o
                                            }
                                        }
                                }
                                return {
                                    state: "success",
                                    data: t
                                }
                            }(p, x, E, u), u ? (p.ifModified && ((T = E.getResponseHeader("Last-Modified")) && (w.lastModified[o] = T), (T = E.getResponseHeader("etag")) && (w.etag[o] = T)), 204 === t || "HEAD" === p.type ? S = "nocontent" : 304 === t ? S = "notmodified" : (S = x.state, d = x.data, u = !(h = x.error))) : (h = S, !t && S || (S = "error", t < 0 && (t = 0))), E.status = t, E.statusText = (n || S) + "", u ? m.resolveWith(g, [d, S, E]) : m.rejectWith(g, [E, S, h]), E.statusCode(b), b = void 0, f && v.trigger(u ? "ajaxSuccess" : "ajaxError", [E, p, u ? d : h]), y.fireWith(g, [E, S]), f && (v.trigger("ajaxComplete", [E, p]), --w.active || w.event.trigger("ajaxStop")))
                        }
                        return E
                    },
                    getJSON: function(e, t, n) {
                        return w.get(e, t, n, "json")
                    },
                    getScript: function(e, t) {
                        return w.get(e, void 0, t, "script")
                    }
                }), w.each(["get", "post"], function(e, t) {
                    w[t] = function(e, n, r, i) {
                        return g(n) && (i = i || r, r = n, n = void 0), w.ajax(w.extend({
                            url: e,
                            type: t,
                            dataType: i,
                            data: n,
                            success: r
                        }, w.isPlainObject(e) && e))
                    }
                }), w._evalUrl = function(e, t) {
                    return w.ajax({
                        url: e,
                        type: "GET",
                        dataType: "script",
                        cache: !0,
                        async: !1,
                        global: !1,
                        converters: {
                            "text script": function() {}
                        },
                        dataFilter: function(e) {
                            w.globalEval(e, t)
                        }
                    })
                }, w.fn.extend({
                    wrapAll: function(e) {
                        var t;
                        return this[0] && (g(e) && (e = e.call(this[0])), t = w(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                            for (var e = this; e.firstElementChild;) e = e.firstElementChild;
                            return e
                        }).append(this)), this
                    },
                    wrapInner: function(e) {
                        return g(e) ? this.each(function(t) {
                            w(this).wrapInner(e.call(this, t))
                        }) : this.each(function() {
                            var t = w(this),
                                n = t.contents();
                            n.length ? n.wrapAll(e) : t.append(e)
                        })
                    },
                    wrap: function(e) {
                        var t = g(e);
                        return this.each(function(n) {
                            w(this).wrapAll(t ? e.call(this, n) : e)
                        })
                    },
                    unwrap: function(e) {
                        return this.parent(e).not("body").each(function() {
                            w(this).replaceWith(this.childNodes)
                        }), this
                    }
                }), w.expr.pseudos.hidden = function(e) {
                    return !w.expr.pseudos.visible(e)
                }, w.expr.pseudos.visible = function(e) {
                    return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
                }, w.ajaxSettings.xhr = function() {
                    try {
                        return new e.XMLHttpRequest
                    } catch (e) {}
                };
                var Wt = {
                        0: 200,
                        1223: 204
                    },
                    zt = w.ajaxSettings.xhr();
                p.cors = !!zt && "withCredentials" in zt, p.ajax = zt = !!zt, w.ajaxTransport(function(t) {
                    var n, r;
                    if (p.cors || zt && !t.crossDomain) return {
                        send: function(i, o) {
                            var a, s = t.xhr();
                            if (s.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                                for (a in t.xhrFields) s[a] = t.xhrFields[a];
                            for (a in t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType), t.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"), i) s.setRequestHeader(a, i[a]);
                            n = function(e) {
                                return function() {
                                    n && (n = r = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null, "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? o(0, "error") : o(s.status, s.statusText) : o(Wt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                                        binary: s.response
                                    } : {
                                        text: s.responseText
                                    }, s.getAllResponseHeaders()))
                                }
                            }, s.onload = n(), r = s.onerror = s.ontimeout = n("error"), void 0 !== s.onabort ? s.onabort = r : s.onreadystatechange = function() {
                                4 === s.readyState && e.setTimeout(function() {
                                    n && r()
                                })
                            }, n = n("abort");
                            try {
                                s.send(t.hasContent && t.data || null)
                            } catch (e) {
                                if (n) throw e
                            }
                        },
                        abort: function() {
                            n && n()
                        }
                    }
                }), w.ajaxPrefilter(function(e) {
                    e.crossDomain && (e.contents.script = !1)
                }), w.ajaxSetup({
                    accepts: {
                        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
                    },
                    contents: {
                        script: /\b(?:java|ecma)script\b/
                    },
                    converters: {
                        "text script": function(e) {
                            return w.globalEval(e), e
                        }
                    }
                }), w.ajaxPrefilter("script", function(e) {
                    void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
                }), w.ajaxTransport("script", function(e) {
                    var t, n;
                    if (e.crossDomain || e.scriptAttrs) return {
                        send: function(i, o) {
                            t = w("<script>").attr(e.scriptAttrs || {}).prop({
                                charset: e.scriptCharset,
                                src: e.url
                            }).on("load error", n = function(e) {
                                t.remove(), n = null, e && o("error" === e.type ? 404 : 200, e.type)
                            }), r.head.appendChild(t[0])
                        },
                        abort: function() {
                            n && n()
                        }
                    }
                });
                var qt, Vt = [],
                    $t = /(=)\?(?=&|$)|\?\?/;
                w.ajaxSetup({
                    jsonp: "callback",
                    jsonpCallback: function() {
                        var e = Vt.pop() || w.expando + "_" + St++;
                        return this[e] = !0, e
                    }
                }), w.ajaxPrefilter("json jsonp", function(t, n, r) {
                    var i, o, a, s = !1 !== t.jsonp && ($t.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && $t.test(t.data) && "data");
                    if (s || "jsonp" === t.dataTypes[0]) return i = t.jsonpCallback = g(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, s ? t[s] = t[s].replace($t, "$1" + i) : !1 !== t.jsonp && (t.url += (Et.test(t.url) ? "&" : "?") + t.jsonp + "=" + i), t.converters["script json"] = function() {
                        return a || w.error(i + " was not called"), a[0]
                    }, t.dataTypes[0] = "json", o = e[i], e[i] = function() {
                        a = arguments
                    }, r.always(function() {
                        void 0 === o ? w(e).removeProp(i) : e[i] = o, t[i] && (t.jsonpCallback = n.jsonpCallback, Vt.push(i)), a && g(o) && o(a[0]), a = o = void 0
                    }), "script"
                }), p.createHTMLDocument = ((qt = r.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === qt.childNodes.length), w.parseHTML = function(e, t, n) {
                    return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (p.createHTMLDocument ? ((i = (t = r.implementation.createHTMLDocument("")).createElement("base")).href = r.location.href, t.head.appendChild(i)) : t = r), a = !n && [], (o = L.exec(e)) ? [t.createElement(o[1])] : (o = xe([e], t, a), a && a.length && w(a).remove(), w.merge([], o.childNodes)));
                    var i, o, a
                }, w.fn.load = function(e, t, n) {
                    var r, i, o, a = this,
                        s = e.indexOf(" ");
                    return s > -1 && (r = vt(e.slice(s)), e = e.slice(0, s)), g(t) ? (n = t, t = void 0) : t && "object" === lo(t) && (i = "POST"), a.length > 0 && w.ajax({
                        url: e,
                        type: i || "GET",
                        dataType: "html",
                        data: t
                    }).done(function(e) {
                        o = arguments, a.html(r ? w("<div>").append(w.parseHTML(e)).find(r) : e)
                    }).always(n && function(e, t) {
                        a.each(function() {
                            n.apply(this, o || [e.responseText, t, e])
                        })
                    }), this
                }, w.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
                    w.fn[t] = function(e) {
                        return this.on(t, e)
                    }
                }), w.expr.pseudos.animated = function(e) {
                    return w.grep(w.timers, function(t) {
                        return e === t.elem
                    }).length
                }, w.offset = {
                    setOffset: function(e, t, n) {
                        var r, i, o, a, s, c, u = w.css(e, "position"),
                            l = w(e),
                            f = {};
                        "static" === u && (e.style.position = "relative"), s = l.offset(), o = w.css(e, "top"), c = w.css(e, "left"), ("absolute" === u || "fixed" === u) && (o + c).indexOf("auto") > -1 ? (a = (r = l.position()).top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(c) || 0), g(t) && (t = t.call(e, n, w.extend({}, s))), null != t.top && (f.top = t.top - s.top + a), null != t.left && (f.left = t.left - s.left + i), "using" in t ? t.using.call(e, f) : l.css(f)
                    }
                }, w.fn.extend({
                    offset: function(e) {
                        if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                            w.offset.setOffset(this, e, t)
                        });
                        var t, n, r = this[0];
                        return r ? r.getClientRects().length ? (t = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, {
                            top: t.top + n.pageYOffset,
                            left: t.left + n.pageXOffset
                        }) : {
                            top: 0,
                            left: 0
                        } : void 0
                    },
                    position: function() {
                        if (this[0]) {
                            var e, t, n, r = this[0],
                                i = {
                                    top: 0,
                                    left: 0
                                };
                            if ("fixed" === w.css(r, "position")) t = r.getBoundingClientRect();
                            else {
                                for (t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === w.css(e, "position");) e = e.parentNode;
                                e && e !== r && 1 === e.nodeType && ((i = w(e).offset()).top += w.css(e, "borderTopWidth", !0), i.left += w.css(e, "borderLeftWidth", !0))
                            }
                            return {
                                top: t.top - i.top - w.css(r, "marginTop", !0),
                                left: t.left - i.left - w.css(r, "marginLeft", !0)
                            }
                        }
                    },
                    offsetParent: function() {
                        return this.map(function() {
                            for (var e = this.offsetParent; e && "static" === w.css(e, "position");) e = e.offsetParent;
                            return e || re
                        })
                    }
                }), w.each({
                    scrollLeft: "pageXOffset",
                    scrollTop: "pageYOffset"
                }, function(e, t) {
                    var n = "pageYOffset" === t;
                    w.fn[e] = function(r) {
                        return G(this, function(e, r, i) {
                            var o;
                            if (v(e) ? o = e : 9 === e.nodeType && (o = e.defaultView), void 0 === i) return o ? o[t] : e[r];
                            o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : e[r] = i
                        }, e, r, arguments.length)
                    }
                }), w.each(["top", "left"], function(e, t) {
                    w.cssHooks[t] = ze(p.pixelPosition, function(e, n) {
                        if (n) return n = We(e, t), Ue.test(n) ? w(e).position()[t] + "px" : n
                    })
                }), w.each({
                    Height: "height",
                    Width: "width"
                }, function(e, t) {
                    w.each({
                        padding: "inner" + e,
                        content: t,
                        "": "outer" + e
                    }, function(n, r) {
                        w.fn[r] = function(i, o) {
                            var a = arguments.length && (n || "boolean" != typeof i),
                                s = n || (!0 === i || !0 === o ? "margin" : "border");
                            return G(this, function(t, n, i) {
                                var o;
                                return v(t) ? 0 === r.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement, Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? w.css(t, n, s) : w.style(t, n, i, s)
                            }, t, a ? i : void 0, a)
                        }
                    })
                }), w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
                    w.fn[t] = function(e, n) {
                        return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
                    }
                }), w.fn.extend({
                    hover: function(e, t) {
                        return this.mouseenter(e).mouseleave(t || e)
                    }
                }), w.fn.extend({
                    bind: function(e, t, n) {
                        return this.on(e, null, t, n)
                    },
                    unbind: function(e, t) {
                        return this.off(e, null, t)
                    },
                    delegate: function(e, t, n, r) {
                        return this.on(t, e, n, r)
                    },
                    undelegate: function(e, t, n) {
                        return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
                    }
                }), w.proxy = function(e, t) {
                    var n, r, i;
                    if ("string" == typeof t && (n = e[t], t = e, e = n), g(e)) return r = o.call(arguments, 2), (i = function() {
                        return e.apply(t || this, r.concat(o.call(arguments)))
                    }).guid = e.guid = e.guid || w.guid++, i
                }, w.holdReady = function(e) {
                    e ? w.readyWait++ : w.ready(!0)
                }, w.isArray = Array.isArray, w.parseJSON = JSON.parse, w.nodeName = k, w.isFunction = g, w.isWindow = v, w.camelCase = V, w.type = b, w.now = Date.now, w.isNumeric = function(e) {
                    var t = w.type(e);
                    return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
                };
                var Kt = e.jQuery,
                    Xt = e.$;
                return w.noConflict = function(t) {
                    return e.$ === w && (e.$ = Xt), t && e.jQuery === w && (e.jQuery = Kt), w
                }, t || (e.jQuery = e.$ = w), w
            }, t.exports = n.document ? r(n, !0) : function(e) {
                if (!e.document) throw new Error("jQuery requires a window with a document");
                return r(e)
            }
        }),
        ed = function() {
            this.fontConfig = {
                default: {
                    weight: "normal",
                    name: '"platformdefault"',
                    fallback: '"Microsoft YaHei", "Helvetica Neue", "Helvetica", "sans-serif"',
                    "line-height": [0, 1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 79, 80, 81, 82, 83]
                },
                robotobold: {
                    weight: "bold",
                    name: '"robotobold"',
                    fallback: '"Microsoft YaHei", "Helvetica Neue", "Helvetica", "sans-serif"',
                    "line-height": [0, 1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 79, 80, 81, 82, 83]
                },
                robotothin: {
                    weight: "lighter",
                    name: '"robotothin"',
                    fallback: '"Microsoft YaHei", "Helvetica Neue", "Helvetica", "sans-serif"',
                    "line-height": [0, 1, 2, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 52, 53, 54, 55, 56, 57, 59, 60, 61, 62, 63, 64, 66, 67, 68, 69, 70, 71, 73, 74, 75, 76, 77, 79, 80, 81, 82, 83]
                }
            }
        };
    ed.prototype.config = function(e) {
        return this.fontConfig.hasOwnProperty(e) ? this.fontConfig[e] : this.fontConfig.default
    }, ed.prototype.family = function(e) {
        var t = this.config(e);
        return t.name + ", " + t.fallback
    }, ed.prototype.weight = function(e) {
        return this.config(e).weight
    }, ed.prototype.lineHeight = function(e, t) {
        var n = this.config(e)["line-height"],
            r = n.length;
        if (t < r) return n[t] + "px";
        var i = n[r - 1] / (r - 1);
        return Math.ceil(t * i) + "px"
    }, ed.prototype.cssString = function(e, t) {
        var n = this.lineHeight(e, t);
        return this.weight(e) + " " + t + "px/" + n + " " + this.family(e)
    }, ed.prototype.textHeight = function(e, t) {
        var n = Qf("<div>Hg</div>").css({
                "font-family": this.family(e),
                "font-size": t + "px",
                "font-weight": this.weight(e),
                display: "inline-block",
                "line-height": this.lineHeight(e, t),
                padding: 0,
                margin: 0,
                "border-width": 0
            }),
            r = Qf('<div style="display: inline-block; width: 1px; height: 0px; padding: 0; margin: 0; border-width: 0"></div>'),
            i = Qf("<div></div>");
        i.append(n, r), Qf("body").append(i);
        var o = {};
        try {
            r.css({
                verticalAlign: "baseline"
            }), o.ascent = r.offset().top - n.offset().top, o.height = n.height(), o.descent = o.height - o.ascent
        } finally {
            i.remove()
        }
        return o
    };
    var td = n(function(t) {
            ! function(e) {
                function n() {
                    if (!(this instanceof n)) return arguments.length > 1 || "number" != typeof arguments[0] ? n.apply(new n(arguments.length), arguments) : new n(arguments[0]);
                    if (0 === arguments.length) throw new Error("Missing Argument: You must pass a valid buffer size");
                    return this.length = this.start = 0, this.overflow = null, arguments.length > 1 || "number" != typeof arguments[0] ? (this.data = new Array(arguments.length), this.end = (this.size = arguments.length) - 1, this.push.apply(this, arguments)) : (this.data = new Array(arguments[0]), this.end = (this.size = arguments[0]) - 1), this
                }

                function r(e, t) {
                    return e == t ? 0 : e > t ? 1 : -1
                }
                n.prototype = {
                    constructor: n,
                    pop: function() {
                        var e;
                        if (0 !== this.length) return e = this.data[this.end], delete this.data[this.end], this.end = (this.end - 1 + this.size) % this.size, this.length--, e
                    },
                    push: function() {
                        var e = arguments,
                            t = 0;
                        if (this.overflow && this.length + arguments.length > this.size)
                            for (; t < this.length + arguments.length - this.size; t++) this.overflow(this.data[(this.end + t + 1) % this.size], this);
                        for (t = 0; t < arguments.length; t++) this.data[(this.end + t + 1) % this.size] = e[t];
                        return this.length < this.size && (this.length + t > this.size ? this.length = this.size : this.length += t), this.end = (this.end + t) % this.size, this.start = (this.size + this.end - this.length + 1) % this.size, this.length
                    },
                    reverse: function() {
                        for (var e, t = 0; t < ~~(this.length / 2); t++) e = this.data[(this.start + t) % this.size], this.data[(this.start + t) % this.size] = this.data[(this.start + (this.length - t - 1)) % this.size], this.data[(this.start + (this.length - t - 1)) % this.size] = e;
                        return this
                    },
                    rotateLeft: function(e) {
                        if (void 0 === e && (e = 1), "number" != typeof e) throw new Error("Argument must be a number");
                        for (; --e >= 0;) this.push(this.shift());
                        return this
                    },
                    rotateRight: function(e) {
                        if (void 0 === e && (e = 1), "number" != typeof e) throw new Error("Argument must be a number");
                        for (; --e >= 0;) this.unshift(this.pop());
                        return this
                    },
                    shift: function() {
                        var e;
                        if (0 !== this.length) return e = this.data[this.start], this.start = (this.start + 1) % this.size, this.length--, e
                    },
                    sort: function(e) {
                        return this.data.sort(e || r), this.start = 0, this.end = this.length - 1, this
                    },
                    unshift: function() {
                        var e = arguments,
                            t = 0;
                        if (this.overflow && this.length + arguments.length > this.size)
                            for (; t < this.length + arguments.length - this.size; t++) this.overflow(this.data[this.end - t % this.size], this);
                        for (t = 0; t < arguments.length; t++) this.data[(this.size + this.start - t % this.size - 1) % this.size] = e[t];
                        return this.size - this.length - t < 0 && (this.end += this.size - this.length - t, this.end < 0 && (this.end = this.size + this.end % this.size)), this.length < this.size && (this.length + t > this.size ? this.length = this.size : this.length += t), this.start -= arguments.length, this.start < 0 && (this.start = this.size + this.start % this.size), this.length
                    },
                    indexOf: function(e, t) {
                        for (t || (t = 0); t < this.length; t++)
                            if (this.data[(this.start + t) % this.size] === e) return t;
                        return -1
                    },
                    lastIndexOf: function(e, t) {
                        for (t || (t = this.length - 1); t >= 0; t--)
                            if (this.data[(this.start + t) % this.size] === e) return t;
                        return -1
                    },
                    sortedIndex: function(e, t, n) {
                        t = t || r;
                        var i = this.length === this.size,
                            o = this.start,
                            a = i ? this.length - 1 : this.length;
                        for (o && t.call(n, e, this.data[a]) > 0 && (o = 0, a = this.end); o < a;) {
                            var s = o + a >>> 1;
                            t.call(n, e, this.data[s]) > 0 ? o = s + 1 : a = s
                        }
                        return i ? ((o - this.start) % this.length + this.length) % this.length : o
                    },
                    every: function(e, t) {
                        for (var n = 0; n < this.length; n++)
                            if (!e.call(t, this.data[(this.start + n) % this.size], n, this)) return !1;
                        return !0
                    },
                    forEach: function(e, t) {
                        for (var n = 0; n < this.length; n++) e.call(t, this.data[(this.start + n) % this.size], n, this)
                    },
                    some: function(e, t) {
                        for (var n = 0; n < this.length; n++)
                            if (e.call(t, this.data[(this.start + n) % this.size], n, this)) return !0;
                        return !1
                    },
                    avg: function() {
                        return 0 == this.length ? 0 : this.sum() / this.length
                    },
                    sum: function() {
                        for (var e = this.length, t = 0; e--;) t += this.data[e];
                        return t
                    },
                    median: function() {
                        if (0 === this.length) return 0;
                        var e = this.slice().sort(r),
                            t = Math.floor(e.length / 2);
                        return e.length % 2 ? e[t] : (e[t - 1] + e[t]) / 2
                    },
                    empty: function() {
                        return this.length = this.start = 0, this.end = this.size - 1, this
                    },
                    fill: function(e) {
                        var t = 0;
                        if ("function" == typeof e)
                            for (; this.data[t] = e(), ++t < this.size;);
                        else
                            for (; this.data[t] = e, ++t < this.size;);
                        return this.start = 0, this.end = this.size - 1, this.length = this.size, this
                    },
                    first: function() {
                        return this.data[this.start]
                    },
                    last: function() {
                        return this.data[this.end]
                    },
                    get: function(e) {
                        return this.data[(this.start + e) % this.size]
                    },
                    isFull: function(e) {
                        return this.size === this.length
                    },
                    set: function(e, t) {
                        return this.data[(this.start + e) % this.size] = t
                    },
                    toArray: function() {
                        return this.slice()
                    },
                    slice: function(e, t) {
                        var n = this.length;
                        if ((e = +e || 0) < 0) {
                            if (e >= t) return [];
                            e = -e > n ? 0 : n + e
                        }
                        null == t || t > n ? t = n : t < 0 ? t += n : t = +t || 0, n = e < t ? t - e : 0;
                        for (var r = Array(n), i = 0; i < n; i++) r[i] = this.data[(this.start + e + i) % this.size];
                        return r
                    }
                }, t.exports ? t.exports = n : e.CBuffer = n
            }(e)
        }),
        nd = n(function(e, t) {
            e.exports = function(e) {
                var t, n, r = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
                    i = "onwheel" in document || document.documentMode >= 9 ? ["wheel"] : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
                    o = Array.prototype.slice;
                if (e.event.fixHooks)
                    for (var a = r.length; a;) e.event.fixHooks[r[--a]] = e.event.mouseHooks;
                var s = e.event.special.mousewheel = {
                    version: "3.1.12",
                    setup: function() {
                        if (this.addEventListener)
                            for (var t = i.length; t;) this.addEventListener(i[--t], c, !1);
                        else this.onmousewheel = c;
                        e.data(this, "mousewheel-line-height", s.getLineHeight(this)), e.data(this, "mousewheel-page-height", s.getPageHeight(this))
                    },
                    teardown: function() {
                        if (this.removeEventListener)
                            for (var t = i.length; t;) this.removeEventListener(i[--t], c, !1);
                        else this.onmousewheel = null;
                        e.removeData(this, "mousewheel-line-height"), e.removeData(this, "mousewheel-page-height")
                    },
                    getLineHeight: function(t) {
                        var n = e(t),
                            r = n["offsetParent" in e.fn ? "offsetParent" : "parent"]();
                        return r.length || (r = e("body")), parseInt(r.css("fontSize"), 10) || parseInt(n.css("fontSize"), 10) || 16
                    },
                    getPageHeight: function(t) {
                        return e(t).height()
                    },
                    settings: {
                        adjustOldDeltas: !0,
                        normalizeOffset: !0
                    }
                };

                function c(r) {
                    var i = r || window.event,
                        a = o.call(arguments, 1),
                        c = 0,
                        f = 0,
                        d = 0,
                        h = 0,
                        p = 0,
                        g = 0;
                    if ((r = e.event.fix(i)).type = "mousewheel", "detail" in i && (d = -1 * i.detail), "wheelDelta" in i && (d = i.wheelDelta), "wheelDeltaY" in i && (d = i.wheelDeltaY), "wheelDeltaX" in i && (f = -1 * i.wheelDeltaX), "axis" in i && i.axis === i.HORIZONTAL_AXIS && (f = -1 * d, d = 0), c = 0 === d ? f : d, "deltaY" in i && (d = -1 * i.deltaY, c = d), "deltaX" in i && (f = i.deltaX, 0 === d && (c = -1 * f)), 0 !== d || 0 !== f) {
                        if (1 === i.deltaMode) {
                            var v = e.data(this, "mousewheel-line-height");
                            c *= v, d *= v, f *= v
                        } else if (2 === i.deltaMode) {
                            var m = e.data(this, "mousewheel-page-height");
                            c *= m, d *= m, f *= m
                        }
                        if (h = Math.max(Math.abs(d), Math.abs(f)), (!n || h < n) && (n = h, l(i, h) && (n /= 40)), l(i, h) && (c /= 40, f /= 40, d /= 40), c = Math[c >= 1 ? "floor" : "ceil"](c / n), f = Math[f >= 1 ? "floor" : "ceil"](f / n), d = Math[d >= 1 ? "floor" : "ceil"](d / n), s.settings.normalizeOffset && this.getBoundingClientRect) {
                            var y = this.getBoundingClientRect();
                            p = r.clientX - y.left, g = r.clientY - y.top
                        }
                        return r.deltaX = f, r.deltaY = d, r.deltaFactor = n, r.offsetX = p, r.offsetY = g, r.deltaMode = 0, a.unshift(r, c, f, d), t && clearTimeout(t), t = setTimeout(u, 200), (e.event.dispatch || e.event.handle).apply(this, a)
                    }
                }

                function u() {
                    n = null
                }

                function l(e, t) {
                    return s.settings.adjustOldDeltas && "mousewheel" === e.type && t % 120 == 0
                }
                e.fn.extend({
                    mousewheel: function(e) {
                        return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
                    },
                    unmousewheel: function(e) {
                        return this.unbind("mousewheel", e)
                    }
                })
            }
        }),
        rd = function() {
            this.image = null, this.buffer = null, this.loading = !1
        };
    rd.prototype.makeScreenshot = function(e, t, n, r) {
        var i = this;
        if (!this.loading)
            if (Module.canvas) {
                this.loading = !0;
                var o = new Image;
                o.onload = function() {
                    var a = document.createElement("canvas");
                    a.width = n, a.height = r;
                    var s = a.getContext("2d"),
                        c = t,
                        u = r;
                    ks == Es.Safari && (s.scale(1, -1), c = t / window.devicePixelRatio, u = -r), s.drawImage(o, e, c, n, r, 0, 0, n, u);
                    var l = s.getImageData(0, 0, a.width, a.height);
                    l.complete = !0, l.naturalWidth = l.width, l.naturalHeight = l.height;
                    var f = a.toDataURL("png").split(",")[1];
                    if (ks == Es.Safari) {
                        for (var d = [], h = 0; h < f.length; h++) d.push(f.charCodeAt(h));
                        f = d
                    }
                    i.image = l, i.buffer = f, i.loading = !1, window.GLEngineModule.onScreenshotReadyCallback()
                }, o.src = Module.canvas.toDataURL("png")
            } else console.error("Can't get canvas!")
    }, Sl("Int8", 1, function(e) {
        return function(t, n, r) {
            return e(this, t, n, r)
        }
    });
    var id = function() {
        this.RequestData = {}
    };
    id.prototype.CreateXHRRequest = function(e, t) {
        var n = this,
            r = new XMLHttpRequest,
            i = function(t) {
                return function(r) {
                    n.hasOwnProperty(e) && window.GLEngineModule.XHRResponse_HandleXHREvent(t, e, r.loaded, r.total, r.lengthComputable)
                }
            };
        r.onloadstart = i(window.GLEngineModule.XHREventType.LoadStart), r.upload.onprogress = i(window.GLEngineModule.XHREventType.UploadProgress), r.onprogress = i(window.GLEngineModule.XHREventType.DownloadProgress), r.onabort = i(window.GLEngineModule.XHREventType.Abort), r.onerror = i(window.GLEngineModule.XHREventType.Error), r.onload = i(window.GLEngineModule.XHREventType.Load), r.ontimeout = i(window.GLEngineModule.XHREventType.Timeout), r.onloadend = i(window.GLEngineModule.XHREventType.LoadEnd), r.responseType = "arraybuffer", r.withCredentials = !t, r.onreadystatechange = function() {
            if (n.hasOwnProperty(e))
                if (r.readyState == r.HEADERS_RECEIVED)
                    for (var t = r.getAllResponseHeaders().split("\r\n"), i = 0; i < t.length; i++) {
                        var o = t[i],
                            a = o.indexOf(": ");
                        if (a > 0) {
                            var s = o.substring(0, a),
                                c = lengthBytesUTF8(s) + 1,
                                u = window.GLEngineModule._malloc(c);
                            stringToUTF8(s, u, c);
                            var l = o.substring(a + 2),
                                f = lengthBytesUTF8(l) + 1,
                                d = window.GLEngineModule._malloc(f);
                            stringToUTF8(l, d, f), window.GLEngineModule.XHRResponse_AddResponseHeader(e, u, d), window.GLEngineModule._free(u), window.GLEngineModule._free(d)
                        }
                    } else r.readyState == r.DONE && n.RequestData.hasOwnProperty(e) && delete n.RequestData[e];
            window.GLEngineModule.XHRResponse_HandleReadyStateChange(e, r.readyState)
        }, this[e] = r
    }, id.prototype.DestroyXHRRequest = function(e) {
        if (this.hasOwnProperty(e)) {
            var t = this[e];
            t.readyState != t.DONE && (t.onloadstart = function() {}, t.upload.onprogress = function() {}, t.onprogress = function() {}, t.onabort = function() {}, t.onerror = function() {}, t.onload = function() {}, t.ontimeout = function() {}, t.onloadend = function() {}, t.abort()), delete this[e]
        }
    }, id.prototype.GetStatusMessage = function(e) {
        return this.hasOwnProperty(e) ? this[e].statusText : ""
    }, id.prototype.GetStatus = function(e) {
        return this.hasOwnProperty(e) ? this[e].status : 0
    }, id.prototype.GetStatusMessageLength = function(e) {
        return this.hasOwnProperty(e) ? lengthBytesUTF8(this[e].statusText) : 0
    }, id.prototype.Abort = function(e) {
        this.hasOwnProperty(e) && this[e].abort()
    }, id.prototype.GetResponseSize = function(e) {
        if (!this.hasOwnProperty(e)) return 0;
        var t = this[e];
        return t.response ? t.response.byteLength : 0
    }, id.prototype.PeekData = function(e, t, n, r) {
        if (0 == this.GetResponseSize(e)) return 0;
        var i = this[e],
            o = new Int8Array(i.response, t, r);
        return writeArrayToMemory(o, n), o.byteLength
    }, id.prototype.Open = function(e, t, n) {
        this.hasOwnProperty(e) && this[e].open(["head", "get", "post", "put"][t], n)
    }, id.prototype.Send = function(e) {
        this.hasOwnProperty(e) && this[e].send(this.RequestData.hasOwnProperty(e) ? this.RequestData[e] : null)
    }, id.prototype.SetRequestHeader = function(e, t, n) {
        this.hasOwnProperty(e) && this[e].setRequestHeader(t, n)
    }, id.prototype.SetPostData = function(e, t, n) {
        this.hasOwnProperty(e) && (this.RequestData[e] = HEAP8.subarray(t, t + n))
    };
    var od = [
            [3840, 2160],
            [1920, 1080],
            [1600, 1200],
            [1280, 1024],
            [1280, 720],
            [1024, 768],
            [800, 600],
            [800, 480],
            [640, 480],
            [0, 0]
        ],
        ad = function() {
            this.camera = null, this.canvas = null, this.initialized = 0, this.resolutionNum = 0
        };
    ad.prototype.init = function() {
        void 0 === navigator.mediaDevices && (navigator.mediaDevices = {}), void 0 === navigator.mediaDevices.getUserMedia && (navigator.mediaDevices.getUserMedia = function(e) {
            var t = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            return t ? new Promise(function(n, r) {
                t.call(navigator, e, n, r)
            }) : Promise.reject(new Error("getUserMedia is not implemented in this browser"))
        });
        var e = od[this.resolutionNum][0],
            t = od[this.resolutionNum][1];
        0 == e || 0 == t ? navigator.mediaDevices.getUserMedia({
            video: !0
        }).then(this.setStream).catch(this.handleError) : navigator.mediaDevices.getUserMedia({
            video: {
                width: {
                    min: e
                },
                height: {
                    min: t
                }
            }
        }).then(this.setStream).catch(this.handleError)
    }, ad.prototype.setStream = function(e) {
        "srcObject" in this.camera ? this.camera.srcObject = e : (window.URL = window.URL || window.webkitURL, window.URL ? this.camera.src = window.URL.createObjectURL(e) : this.camera.src = e), this.camera.videoStream = e, this.camera.onerror = this.handleError, this.camera.onended = this.handleError, this.initialized = 1, 1 == this.camera.autoStart && this.camera.play(), null != this.camera.initializedHandler && this.camera.initializedHandler(1)
    }, ad.prototype.handleError = function(e) {
        if ("name" in e) return "NotAllowedError" == e.name || "PermissionDeniedError" == e.name ? (this.initialized = -1, void(null != this.camera.initializedHandler && this.camera.initializedHandler(-1))) : this.resolutionNum < od.length - 1 ? (this.resolutionNum++, void this.init()) : void(null != this.camera.initializedHandler && this.camera.initializedHandler(0))
    }, ad.prototype.initialize = function(e, t) {
        return -1 == this.initialized ? -1 : 1 == this.initialized ? (1 == e && this.camera.play(), 1) : (this.camera = document.createElement("video"), this.camera.autoStart = e, this.camera.initializedHandler = t, this.canvas = document.createElement("canvas"), this.init(), 0)
    }, ad.prototype.destroy = function() {
        return 1 != this.initialized ? this.initialized : (this.camera.pause(), this.camera.videoStream.getTracks().forEach(function(e) {
            e.stop()
        }), delete this.camera, delete this.canvas, this.initialized = 0, 1)
    }, ad.prototype.getWidth = function() {
        return 1 != this.initialized ? 0 : this.camera.videoWidth
    }, ad.prototype.getHeight = function() {
        return 1 != this.initialized ? 0 : this.camera.videoHeight
    }, ad.prototype.getFrame = function(e) {
        if (1 != this.initialized) return this.initialized;
        if (0 == this.camera.videoWidth || 0 == this.camera.videoHeight) return 0;
        this.canvas.width = this.camera.videoWidth, this.canvas.height = this.camera.videoHeight;
        var t = this.canvas.getContext("2d");
        return t.drawImage(this.camera, 0, 0, this.camera.videoWidth, this.camera.videoHeight), new Uint8Array(Module.HEAPU8.buffer, e, this.camera.videoWidth * this.camera.videoHeight * 4).set(t.getImageData(0, 0, this.camera.videoWidth, this.camera.videoHeight).data), 1
    }, ad.prototype.renderFrame = function(e) {
        if (1 != this.initialized) return this.initialized;
        if (null == e || 0 == this.camera.videoWidth || 0 == this.camera.videoHeight) return 0;
        var t = GLctx.getParameter(GLctx.TEXTURE_BINDING_2D);
        GLctx.bindTexture(GLctx.TEXTURE_2D, GL.textures[e]);
        var n = GLctx.getParameter(GLctx.UNPACK_ALIGNMENT);
        return GLctx.pixelStorei(GLctx.UNPACK_ALIGNMENT, 1), ks === Es.Safari ? GLctx.texSubImage2D(GLctx.TEXTURE_2D, 0, 0, 0, GLctx.RGB, Module.ctx.UNSIGNED_BYTE, this.camera) : GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGB, GLctx.RGB, Module.ctx.UNSIGNED_BYTE, this.camera), GLctx.pixelStorei(GLctx.UNPACK_ALIGNMENT, n), GLctx.bindTexture(GLctx.TEXTURE_2D, t), 1
    }, Oe({
        target: "Object",
        stat: !0,
        forced: !l,
        sham: !l
    }, {
        defineProperties: Ur
    });
    var sd = n(function(e) {
        var t, n, r, i, o, a;
        t = "undefined" != typeof window && void 0 !== window.document ? window.document : {}, n = e.exports, r = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element, i = function() {
            for (var e, n = [
                    ["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"],
                    ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"],
                    ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"],
                    ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"],
                    ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]
                ], r = 0, i = n.length, o = {}; r < i; r++)
                if ((e = n[r]) && e[1] in t) {
                    for (r = 0; r < e.length; r++) o[n[0][r]] = e[r];
                    return o
                }
            return !1
        }(), o = {
            change: i.fullscreenchange,
            error: i.fullscreenerror
        }, a = {
            request: function(e) {
                return new Promise(function(n, o) {
                    var a, s = i.requestFullscreen,
                        c = function() {
                            this.off("change", c), n()
                        }.bind(this);
                    this.on("change", c), e = e || t.documentElement, a = / Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent) ? e[s]() : e[s](r ? Element.ALLOW_KEYBOARD_INPUT : {}), Promise.resolve(a).catch(o)
                }.bind(this))
            },
            exit: function() {
                return new Promise(function(e) {
                    if (this.isFullscreen) {
                        var n = function() {
                            this.off("change", n), e()
                        }.bind(this);
                        t[i.exitFullscreen](), this.on("change", n)
                    } else e()
                }.bind(this))
            },
            toggle: function(e) {
                return this.isFullscreen ? this.exit() : this.request(e)
            },
            onchange: function(e) {
                this.on("change", e)
            },
            onerror: function(e) {
                this.on("error", e)
            },
            on: function(e, n) {
                var r = o[e];
                r && t.addEventListener(r, n, !1)
            },
            off: function(e, n) {
                var r = o[e];
                r && t.removeEventListener(r, n, !1)
            },
            raw: i
        }, i ? (Object.defineProperties(a, {
            isFullscreen: {
                get: function() {
                    return Boolean(t[i.fullscreenElement])
                }
            },
            element: {
                enumerable: !0,
                get: function() {
                    return t[i.fullscreenElement]
                }
            },
            enabled: {
                enumerable: !0,
                get: function() {
                    return Boolean(t[i.fullscreenEnabled])
                }
            }
        }), n ? (e.exports = a, e.exports.default = a) : window.screenfull = a) : n ? e.exports = !1 : window.screenfull = !1
    });
    aa("asyncIterator");
    var cd = D.f,
        ud = u(function() {
            cd(1)
        });
    Oe({
        target: "Object",
        stat: !0,
        forced: !l || ud,
        sham: !l
    }, {
        getOwnPropertyDescriptor: function(e, t) {
            return cd(x(e), t)
        }
    }), Oe({
        target: "Object",
        stat: !0
    }, {
        setPrototypeOf: li
    });
    var ld = function(e, t) {
        return (ld = Object.setPrototypeOf || {
                __proto__: []
            }
            instanceof Array && function(e, t) {
                e.__proto__ = t
            } || function(e, t) {
                for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
            })(e, t)
    };

    function fd(e, t) {
        function n() {
            this.constructor = e
        }
        ld(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
    }
    var dd = function() {
        return (dd = Object.assign || function(e) {
            for (var t, n = arguments, r = 1, i = arguments.length; r < i; r++)
                for (var o in t = n[r]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
            return e
        }).apply(this, arguments)
    };

    function hd(e, t, n, r) {
        return new(n || (n = Promise))(function(i, o) {
            function a(e) {
                try {
                    c(r.next(e))
                } catch (e) {
                    o(e)
                }
            }

            function s(e) {
                try {
                    c(r.throw(e))
                } catch (e) {
                    o(e)
                }
            }

            function c(e) {
                e.done ? i(e.value) : new n(function(t) {
                    t(e.value)
                }).then(a, s)
            }
            c((r = r.apply(e, t || [])).next())
        })
    }

    function pd(e, t) {
        var n, r, i, o, a = {
            label: 0,
            sent: function() {
                if (1 & i[0]) throw i[1];
                return i[1]
            },
            trys: [],
            ops: []
        };
        return o = {
            next: s(0),
            throw: s(1),
            return: s(2)
        }, "function" == typeof Symbol && (o[Symbol.iterator] = function() {
            return this
        }), o;

        function s(o) {
            return function(s) {
                return function(o) {
                    if (n) throw new TypeError("Generator is already executing.");
                    for (; a;) try {
                        if (n = 1, r && (i = 2 & o[0] ? r.return : o[0] ? r.throw || ((i = r.return) && i.call(r), 0) : r.next) && !(i = i.call(r, o[1])).done) return i;
                        switch (r = 0, i && (o = [2 & o[0], i.value]), o[0]) {
                            case 0:
                            case 1:
                                i = o;
                                break;
                            case 4:
                                return a.label++, {
                                    value: o[1],
                                    done: !1
                                };
                            case 5:
                                a.label++, r = o[1], o = [0];
                                continue;
                            case 7:
                                o = a.ops.pop(), a.trys.pop();
                                continue;
                            default:
                                if (!(i = (i = a.trys).length > 0 && i[i.length - 1]) && (6 === o[0] || 2 === o[0])) {
                                    a = 0;
                                    continue
                                }
                                if (3 === o[0] && (!i || o[1] > i[0] && o[1] < i[3])) {
                                    a.label = o[1];
                                    break
                                }
                                if (6 === o[0] && a.label < i[1]) {
                                    a.label = i[1], i = o;
                                    break
                                }
                                if (i && a.label < i[2]) {
                                    a.label = i[2], a.ops.push(o);
                                    break
                                }
                                i[2] && a.ops.pop(), a.trys.pop();
                                continue
                        }
                        o = t.call(e, a)
                    } catch (e) {
                        o = [6, e], r = 0
                    } finally {
                        n = i = 0
                    }
                    if (5 & o[0]) throw o[1];
                    return {
                        value: o[0] ? o[1] : void 0,
                        done: !0
                    }
                }([o, s])
            }
        }
    }

    function gd(e) {
        var t = "function" == typeof Symbol && e[Symbol.iterator],
            n = 0;
        return t ? t.call(e) : {
            next: function() {
                return e && n >= e.length && (e = void 0), {
                    value: e && e[n++],
                    done: !e
                }
            }
        }
    }

    function vd(e, t) {
        var n = "function" == typeof Symbol && e[Symbol.iterator];
        if (!n) return e;
        var r, i, o = n.call(e),
            a = [];
        try {
            for (;
                (void 0 === t || t-- > 0) && !(r = o.next()).done;) a.push(r.value)
        } catch (e) {
            i = {
                error: e
            }
        } finally {
            try {
                r && !r.done && (n = o.return) && n.call(o)
            } finally {
                if (i) throw i.error
            }
        }
        return a
    }

    function md() {
        for (var e = arguments, t = [], n = 0; n < arguments.length; n++) t = t.concat(vd(e[n]));
        return t
    }

    function yd(e) {
        return this instanceof yd ? (this.v = e, this) : new yd(e)
    }
    var bd = Object.freeze({
            __proto__: null,
            __extends: fd,
            get __assign() {
                return dd
            },
            __rest: function(e, t) {
                var n = {};
                for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
                if (null != e && "function" == typeof Object.getOwnPropertySymbols) {
                    var i = 0;
                    for (r = Object.getOwnPropertySymbols(e); i < r.length; i++) t.indexOf(r[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, r[i]) && (n[r[i]] = e[r[i]])
                }
                return n
            },
            __decorate: function(e, t, n, r) {
                var i, o = arguments.length,
                    a = o < 3 ? t : null === r ? r = Object.getOwnPropertyDescriptor(t, n) : r;
                if ("object" === ("undefined" == typeof Reflect ? "undefined" : lo(Reflect)) && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, r);
                else
                    for (var s = e.length - 1; s >= 0; s--)(i = e[s]) && (a = (o < 3 ? i(a) : o > 3 ? i(t, n, a) : i(t, n)) || a);
                return o > 3 && a && Object.defineProperty(t, n, a), a
            },
            __param: function(e, t) {
                return function(n, r) {
                    t(n, r, e)
                }
            },
            __metadata: function(e, t) {
                if ("object" === ("undefined" == typeof Reflect ? "undefined" : lo(Reflect)) && "function" == typeof Reflect.metadata) return Reflect.metadata(e, t)
            },
            __awaiter: hd,
            __generator: pd,
            __exportStar: function(e, t) {
                for (var n in e) t.hasOwnProperty(n) || (t[n] = e[n])
            },
            __values: gd,
            __read: vd,
            __spread: md,
            __spreadArrays: function() {
                for (var e = arguments, t = 0, n = 0, r = arguments.length; n < r; n++) t += e[n].length;
                var i = Array(t),
                    o = 0;
                for (n = 0; n < r; n++)
                    for (var a = arguments[n], s = 0, c = a.length; s < c; s++, o++) i[o] = a[s];
                return i
            },
            __await: yd,
            __asyncGenerator: function(e, t, n) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var r, i = n.apply(e, t || []),
                    o = [];
                return r = {}, a("next"), a("throw"), a("return"), r[Symbol.asyncIterator] = function() {
                    return this
                }, r;

                function a(e) {
                    i[e] && (r[e] = function(t) {
                        return new Promise(function(n, r) {
                            o.push([e, t, n, r]) > 1 || s(e, t)
                        })
                    })
                }

                function s(e, t) {
                    try {
                        (n = i[e](t)).value instanceof yd ? Promise.resolve(n.value.v).then(c, u) : l(o[0][2], n)
                    } catch (e) {
                        l(o[0][3], e)
                    }
                    var n
                }

                function c(e) {
                    s("next", e)
                }

                function u(e) {
                    s("throw", e)
                }

                function l(e, t) {
                    e(t), o.shift(), o.length && s(o[0][0], o[0][1])
                }
            },
            __asyncDelegator: function(e) {
                var t, n;
                return t = {}, r("next"), r("throw", function(e) {
                    throw e
                }), r("return"), t[Symbol.iterator] = function() {
                    return this
                }, t;

                function r(r, i) {
                    t[r] = e[r] ? function(t) {
                        return (n = !n) ? {
                            value: yd(e[r](t)),
                            done: "return" === r
                        } : i ? i(t) : t
                    } : i
                }
            },
            __asyncValues: function(e) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var t, n = e[Symbol.asyncIterator];
                return n ? n.call(e) : (e = gd(e), t = {}, r("next"), r("throw"), r("return"), t[Symbol.asyncIterator] = function() {
                    return this
                }, t);

                function r(n) {
                    t[n] = e[n] && function(t) {
                        return new Promise(function(r, i) {
                            ! function(e, t, n, r) {
                                Promise.resolve(r).then(function(t) {
                                    e({
                                        value: t,
                                        done: n
                                    })
                                }, t)
                            }(r, i, (t = e[n](t)).done, t.value)
                        })
                    }
                }
            },
            __makeTemplateObject: function(e, t) {
                return Object.defineProperty ? Object.defineProperty(e, "raw", {
                    value: t
                }) : e.raw = t, e
            },
            __importStar: function(e) {
                if (e && e.__esModule) return e;
                var t = {};
                if (null != e)
                    for (var n in e) Object.hasOwnProperty.call(e, n) && (t[n] = e[n]);
                return t.default = e, t
            },
            __importDefault: function(e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
        }),
        wd = p.f,
        xd = function(e) {
            return function(t) {
                for (var n, r = x(t), i = Fr(r), o = i.length, a = 0, s = []; o > a;) n = i[a++], l && !wd.call(r, n) || s.push(e ? [n, r[n]] : r[n]);
                return s
            }
        },
        Td = {
            entries: xd(!0),
            values: xd(!1)
        }.entries;
    Oe({
        target: "Object",
        stat: !0
    }, {
        entries: function(e) {
            return Td(e)
        }
    });
    var Sd = n(function(t, n) {
        Object.defineProperty(n, "__esModule", {
            value: !0
        });
        var r = {
                NODE_CLIENT: !1,
                NODE_ADMIN: !1,
                SDK_VERSION: "${JSCORE_VERSION}"
            },
            i = function(e, t) {
                if (!e) throw o(t)
            },
            o = function(e) {
                return new Error("Firebase Database (" + r.SDK_VERSION + ") INTERNAL ASSERT FAILED: " + e)
            },
            a = function(e) {
                for (var t = [], n = 0, r = 0; r < e.length; r++) {
                    var i = e.charCodeAt(r);
                    i < 128 ? t[n++] = i : i < 2048 ? (t[n++] = i >> 6 | 192, t[n++] = 63 & i | 128) : 55296 == (64512 & i) && r + 1 < e.length && 56320 == (64512 & e.charCodeAt(r + 1)) ? (i = 65536 + ((1023 & i) << 10) + (1023 & e.charCodeAt(++r)), t[n++] = i >> 18 | 240, t[n++] = i >> 12 & 63 | 128, t[n++] = i >> 6 & 63 | 128, t[n++] = 63 & i | 128) : (t[n++] = i >> 12 | 224, t[n++] = i >> 6 & 63 | 128, t[n++] = 63 & i | 128)
                }
                return t
            },
            s = {
                byteToCharMap_: null,
                charToByteMap_: null,
                byteToCharMapWebSafe_: null,
                charToByteMapWebSafe_: null,
                ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
                get ENCODED_VALS() {
                    return this.ENCODED_VALS_BASE + "+/="
                },
                get ENCODED_VALS_WEBSAFE() {
                    return this.ENCODED_VALS_BASE + "-_."
                },
                HAS_NATIVE_SUPPORT: "function" == typeof atob,
                encodeByteArray: function(e, t) {
                    if (!Array.isArray(e)) throw Error("encodeByteArray takes an array as a parameter");
                    this.init_();
                    for (var n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_, r = [], i = 0; i < e.length; i += 3) {
                        var o = e[i],
                            a = i + 1 < e.length,
                            s = a ? e[i + 1] : 0,
                            c = i + 2 < e.length,
                            u = c ? e[i + 2] : 0,
                            l = o >> 2,
                            f = (3 & o) << 4 | s >> 4,
                            d = (15 & s) << 2 | u >> 6,
                            h = 63 & u;
                        c || (h = 64, a || (d = 64)), r.push(n[l], n[f], n[d], n[h])
                    }
                    return r.join("")
                },
                encodeString: function(e, t) {
                    return this.HAS_NATIVE_SUPPORT && !t ? btoa(e) : this.encodeByteArray(a(e), t)
                },
                decodeString: function(e, t) {
                    return this.HAS_NATIVE_SUPPORT && !t ? atob(e) : function(e) {
                        for (var t = [], n = 0, r = 0; n < e.length;) {
                            var i = e[n++];
                            if (i < 128) t[r++] = String.fromCharCode(i);
                            else if (i > 191 && i < 224) {
                                var o = e[n++];
                                t[r++] = String.fromCharCode((31 & i) << 6 | 63 & o)
                            } else if (i > 239 && i < 365) {
                                var a = ((7 & i) << 18 | (63 & (o = e[n++])) << 12 | (63 & (s = e[n++])) << 6 | 63 & e[n++]) - 65536;
                                t[r++] = String.fromCharCode(55296 + (a >> 10)), t[r++] = String.fromCharCode(56320 + (1023 & a))
                            } else {
                                o = e[n++];
                                var s = e[n++];
                                t[r++] = String.fromCharCode((15 & i) << 12 | (63 & o) << 6 | 63 & s)
                            }
                        }
                        return t.join("")
                    }(this.decodeStringToByteArray(e, t))
                },
                decodeStringToByteArray: function(e, t) {
                    this.init_();
                    for (var n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_, r = [], i = 0; i < e.length;) {
                        var o = n[e.charAt(i++)],
                            a = i < e.length ? n[e.charAt(i)] : 0,
                            s = ++i < e.length ? n[e.charAt(i)] : 64,
                            c = ++i < e.length ? n[e.charAt(i)] : 64;
                        if (++i, null == o || null == a || null == s || null == c) throw Error();
                        var u = o << 2 | a >> 4;
                        if (r.push(u), 64 !== s) {
                            var l = a << 4 & 240 | s >> 2;
                            if (r.push(l), 64 !== c) {
                                var f = s << 6 & 192 | c;
                                r.push(f)
                            }
                        }
                    }
                    return r
                },
                init_: function() {
                    if (!this.byteToCharMap_) {
                        this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
                        for (var e = 0; e < this.ENCODED_VALS.length; e++) this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e), this.charToByteMap_[this.byteToCharMap_[e]] = e, this.byteToCharMapWebSafe_[e] = this.ENCODED_VALS_WEBSAFE.charAt(e), this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e, e >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e)
                    }
                }
            },
            c = function(e) {
                try {
                    return s.decodeString(e, !0)
                } catch (e) {
                    console.error("base64Decode failed: ", e)
                }
                return null
            };

        function u(e, t) {
            if (!(t instanceof Object)) return t;
            switch (t.constructor) {
                case Date:
                    return new Date(t.getTime());
                case Object:
                    void 0 === e && (e = {});
                    break;
                case Array:
                    e = [];
                    break;
                default:
                    return t
            }
            for (var n in t) t.hasOwnProperty(n) && (e[n] = u(e[n], t[n]));
            return e
        }
        var l = function() {
            function e() {
                var e = this;
                this.reject = function() {}, this.resolve = function() {}, this.promise = new Promise(function(t, n) {
                    e.resolve = t, e.reject = n
                })
            }
            return e.prototype.wrapCallback = function(e) {
                var t = this;
                return function(n, r) {
                    n ? t.reject(n) : t.resolve(r), "function" == typeof e && (t.promise.catch(function() {}), 1 === e.length ? e(n) : e(n, r))
                }
            }, e
        }();

        function f() {
            return "undefined" != typeof navigator && "string" == typeof navigator.userAgent ? navigator.userAgent : ""
        }
        var d = "FirebaseError",
            h = function(e) {
                function t(n, r) {
                    var i = e.call(this, r) || this;
                    return i.code = n, i.name = d, Object.setPrototypeOf(i, t.prototype), Error.captureStackTrace && Error.captureStackTrace(i, p.prototype.create), i
                }
                return bd.__extends(t, e), t
            }(Error),
            p = function() {
                function e(e, t, n) {
                    this.service = e, this.serviceName = t, this.errors = n
                }
                return e.prototype.create = function(e) {
                    for (var t = arguments, n = [], r = 1; r < arguments.length; r++) n[r - 1] = t[r];
                    for (var i = n[0] || {}, o = this.service + "/" + e, a = this.errors[e], s = a ? function(e, t) {
                            return e.replace(g, function(e, n) {
                                var r = t[n];
                                return null != r ? r.toString() : "<" + n + "?>"
                            })
                        }(a, i) : "Error", c = this.serviceName + ": " + s + " (" + o + ").", u = new h(o, c), l = 0, f = Object.keys(i); l < f.length; l++) {
                        var d = f[l];
                        "_" !== d.slice(-1) && (d in u && console.warn('Overwriting FirebaseError base field "' + d + '" can cause unexpected behavior.'), u[d] = i[d])
                    }
                    return u
                }, e
            }();
        var g = /\{\$([^}]+)}/g;

        function v(e) {
            return JSON.parse(e)
        }
        var m = function(e) {
            var t = {},
                n = {},
                r = {},
                i = "";
            try {
                var o = e.split(".");
                t = v(c(o[0]) || ""), n = v(c(o[1]) || ""), i = o[2], r = n.d || {}, delete n.d
            } catch (e) {}
            return {
                header: t,
                claims: n,
                data: r,
                signature: i
            }
        };
        var y = function() {
            function e() {
                this.chain_ = [], this.buf_ = [], this.W_ = [], this.pad_ = [], this.inbuf_ = 0, this.total_ = 0, this.blockSize = 64, this.pad_[0] = 128;
                for (var e = 1; e < this.blockSize; ++e) this.pad_[e] = 0;
                this.reset()
            }
            return e.prototype.reset = function() {
                this.chain_[0] = 1732584193, this.chain_[1] = 4023233417, this.chain_[2] = 2562383102, this.chain_[3] = 271733878, this.chain_[4] = 3285377520, this.inbuf_ = 0, this.total_ = 0
            }, e.prototype.compress_ = function(e, t) {
                t || (t = 0);
                var n = this.W_;
                if ("string" == typeof e)
                    for (var r = 0; r < 16; r++) n[r] = e.charCodeAt(t) << 24 | e.charCodeAt(t + 1) << 16 | e.charCodeAt(t + 2) << 8 | e.charCodeAt(t + 3), t += 4;
                else
                    for (r = 0; r < 16; r++) n[r] = e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3], t += 4;
                for (r = 16; r < 80; r++) {
                    var i = n[r - 3] ^ n[r - 8] ^ n[r - 14] ^ n[r - 16];
                    n[r] = 4294967295 & (i << 1 | i >>> 31)
                }
                var o, a, s = this.chain_[0],
                    c = this.chain_[1],
                    u = this.chain_[2],
                    l = this.chain_[3],
                    f = this.chain_[4];
                for (r = 0; r < 80; r++) {
                    r < 40 ? r < 20 ? (o = l ^ c & (u ^ l), a = 1518500249) : (o = c ^ u ^ l, a = 1859775393) : r < 60 ? (o = c & u | l & (c | u), a = 2400959708) : (o = c ^ u ^ l, a = 3395469782);
                    i = (s << 5 | s >>> 27) + o + f + a + n[r] & 4294967295;
                    f = l, l = u, u = 4294967295 & (c << 30 | c >>> 2), c = s, s = i
                }
                this.chain_[0] = this.chain_[0] + s & 4294967295, this.chain_[1] = this.chain_[1] + c & 4294967295, this.chain_[2] = this.chain_[2] + u & 4294967295, this.chain_[3] = this.chain_[3] + l & 4294967295, this.chain_[4] = this.chain_[4] + f & 4294967295
            }, e.prototype.update = function(e, t) {
                if (null != e) {
                    void 0 === t && (t = e.length);
                    for (var n = t - this.blockSize, r = 0, i = this.buf_, o = this.inbuf_; r < t;) {
                        if (0 === o)
                            for (; r <= n;) this.compress_(e, r), r += this.blockSize;
                        if ("string" == typeof e) {
                            for (; r < t;)
                                if (i[o] = e.charCodeAt(r), ++r, ++o === this.blockSize) {
                                    this.compress_(i), o = 0;
                                    break
                                }
                        } else
                            for (; r < t;)
                                if (i[o] = e[r], ++r, ++o === this.blockSize) {
                                    this.compress_(i), o = 0;
                                    break
                                }
                    }
                    this.inbuf_ = o, this.total_ += t
                }
            }, e.prototype.digest = function() {
                var e = [],
                    t = 8 * this.total_;
                this.inbuf_ < 56 ? this.update(this.pad_, 56 - this.inbuf_) : this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
                for (var n = this.blockSize - 1; n >= 56; n--) this.buf_[n] = 255 & t, t /= 256;
                this.compress_(this.buf_);
                var r = 0;
                for (n = 0; n < 5; n++)
                    for (var i = 24; i >= 0; i -= 8) e[r] = this.chain_[n] >> i & 255, ++r;
                return e
            }, e
        }();
        var b = function() {
            function e(e, t) {
                var n = this;
                this.observers = [], this.unsubscribes = [], this.observerCount = 0, this.task = Promise.resolve(), this.finalized = !1, this.onNoObservers = t, this.task.then(function() {
                    e(n)
                }).catch(function(e) {
                    n.error(e)
                })
            }
            return e.prototype.next = function(e) {
                this.forEachObserver(function(t) {
                    t.next(e)
                })
            }, e.prototype.error = function(e) {
                this.forEachObserver(function(t) {
                    t.error(e)
                }), this.close(e)
            }, e.prototype.complete = function() {
                this.forEachObserver(function(e) {
                    e.complete()
                }), this.close()
            }, e.prototype.subscribe = function(e, t, n) {
                var r, i = this;
                if (void 0 === e && void 0 === t && void 0 === n) throw new Error("Missing Observer.");
                void 0 === (r = function(e, t) {
                    if ("object" !== lo(e) || null === e) return !1;
                    for (var n = 0, r = t; n < r.length; n++) {
                        var i = r[n];
                        if (i in e && "function" == typeof e[i]) return !0
                    }
                    return !1
                }(e, ["next", "error", "complete"]) ? e : {
                    next: e,
                    error: t,
                    complete: n
                }).next && (r.next = w), void 0 === r.error && (r.error = w), void 0 === r.complete && (r.complete = w);
                var o = this.unsubscribeOne.bind(this, this.observers.length);
                return this.finalized && this.task.then(function() {
                    try {
                        i.finalError ? r.error(i.finalError) : r.complete()
                    } catch (e) {}
                }), this.observers.push(r), o
            }, e.prototype.unsubscribeOne = function(e) {
                void 0 !== this.observers && void 0 !== this.observers[e] && (delete this.observers[e], this.observerCount -= 1, 0 === this.observerCount && void 0 !== this.onNoObservers && this.onNoObservers(this))
            }, e.prototype.forEachObserver = function(e) {
                if (!this.finalized)
                    for (var t = 0; t < this.observers.length; t++) this.sendOne(t, e)
            }, e.prototype.sendOne = function(e, t) {
                var n = this;
                this.task.then(function() {
                    if (void 0 !== n.observers && void 0 !== n.observers[e]) try {
                        t(n.observers[e])
                    } catch (e) {
                        "undefined" != typeof console && console.error && console.error(e)
                    }
                })
            }, e.prototype.close = function(e) {
                var t = this;
                this.finalized || (this.finalized = !0, void 0 !== e && (this.finalError = e), this.task.then(function() {
                    t.observers = void 0, t.onNoObservers = void 0
                }))
            }, e
        }();

        function w() {}

        function x(e, t, n) {
            var r = "";
            switch (t) {
                case 1:
                    r = n ? "first" : "First";
                    break;
                case 2:
                    r = n ? "second" : "Second";
                    break;
                case 3:
                    r = n ? "third" : "Third";
                    break;
                case 4:
                    r = n ? "fourth" : "Fourth";
                    break;
                default:
                    throw new Error("errorPrefix called with argumentNumber > 4.  Need to update it?")
            }
            var i = e + " failed: ";
            return i += r + " argument "
        }
        n.CONSTANTS = r, n.Deferred = l, n.ErrorFactory = p, n.FirebaseError = h, n.Sha1 = y, n.assert = i, n.assertionError = o, n.async = function(e, t) {
            return function() {
                for (var n = arguments, r = [], i = 0; i < arguments.length; i++) r[i] = n[i];
                Promise.resolve(!0).then(function() {
                    e.apply(void 0, r)
                }).catch(function(e) {
                    t && t(e)
                })
            }
        }, n.base64 = s, n.base64Decode = c, n.base64Encode = function(e) {
            var t = a(e);
            return s.encodeByteArray(t, !0)
        }, n.contains = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t)
        }, n.createSubscribe = function(e, t) {
            var n = new b(e, t);
            return n.subscribe.bind(n)
        }, n.decode = m, n.deepCopy = function(e) {
            return u(void 0, e)
        }, n.deepExtend = u, n.errorPrefix = x, n.getUA = f, n.isAdmin = function(e) {
            var t = m(e).claims;
            return "object" === lo(t) && !0 === t.admin
        }, n.isBrowser = function() {
            return "object" === ("undefined" == typeof self ? "undefined" : lo(self)) && self.self === self
        }, n.isEmpty = function(e) {
            for (var t in e)
                if (Object.prototype.hasOwnProperty.call(e, t)) return !1;
            return !0
        }, n.isMobileCordova = function() {
            return "undefined" != typeof window && !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(f())
        }, n.isNode = function() {
            try {
                return "[object process]" === Object.prototype.toString.call(e.process)
            } catch (e) {
                return !1
            }
        }, n.isNodeSdk = function() {
            return !0 === r.NODE_CLIENT || !0 === r.NODE_ADMIN
        }, n.isReactNative = function() {
            return "object" === ("undefined" == typeof navigator ? "undefined" : lo(navigator)) && "ReactNative" === navigator.product
        }, n.isValidFormat = function(e) {
            var t = m(e).claims;
            return !!t && "object" === lo(t) && t.hasOwnProperty("iat")
        }, n.isValidTimestamp = function(e) {
            var t = m(e).claims,
                n = Math.floor((new Date).getTime() / 1e3),
                r = 0,
                i = 0;
            return "object" === lo(t) && (t.hasOwnProperty("nbf") ? r = t.nbf : t.hasOwnProperty("iat") && (r = t.iat), i = t.hasOwnProperty("exp") ? t.exp : r + 86400), !!n && !!r && !!i && n >= r && n <= i
        }, n.issuedAtTime = function(e) {
            var t = m(e).claims;
            return "object" === lo(t) && t.hasOwnProperty("iat") ? t.iat : null
        }, n.jsonEval = v, n.map = function(e, t, n) {
            var r = {};
            for (var i in e) Object.prototype.hasOwnProperty.call(e, i) && (r[i] = t.call(n, e[i], i, e));
            return r
        }, n.querystring = function(e) {
            for (var t = [], n = function(e, n) {
                    Array.isArray(n) ? n.forEach(function(n) {
                        t.push(encodeURIComponent(e) + "=" + encodeURIComponent(n))
                    }) : t.push(encodeURIComponent(e) + "=" + encodeURIComponent(n))
                }, r = 0, i = Object.entries(e); r < i.length; r++) {
                var o = i[r];
                n(o[0], o[1])
            }
            return t.length ? "&" + t.join("&") : ""
        }, n.querystringDecode = function(e) {
            var t = {};
            return e.replace(/^\?/, "").split("&").forEach(function(e) {
                if (e) {
                    var n = e.split("=");
                    t[n[0]] = n[1]
                }
            }), t
        }, n.safeGet = function(e, t) {
            return Object.prototype.hasOwnProperty.call(e, t) ? e[t] : void 0
        }, n.stringLength = function(e) {
            for (var t = 0, n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                r < 128 ? t++ : r < 2048 ? t += 2 : r >= 55296 && r <= 56319 ? (t += 4, n++) : t += 3
            }
            return t
        }, n.stringToByteArray = function(e) {
            for (var t = [], n = 0, r = 0; r < e.length; r++) {
                var o = e.charCodeAt(r);
                if (o >= 55296 && o <= 56319) {
                    var a = o - 55296;
                    i(++r < e.length, "Surrogate pair missing trail surrogate."), o = 65536 + (a << 10) + (e.charCodeAt(r) - 56320)
                }
                o < 128 ? t[n++] = o : o < 2048 ? (t[n++] = o >> 6 | 192, t[n++] = 63 & o | 128) : o < 65536 ? (t[n++] = o >> 12 | 224, t[n++] = o >> 6 & 63 | 128, t[n++] = 63 & o | 128) : (t[n++] = o >> 18 | 240, t[n++] = o >> 12 & 63 | 128, t[n++] = o >> 6 & 63 | 128, t[n++] = 63 & o | 128)
            }
            return t
        }, n.stringify = function(e) {
            return JSON.stringify(e)
        }, n.validateArgCount = function(e, t, n, r) {
            var i;
            if (r < t ? i = "at least " + t : r > n && (i = 0 === n ? "none" : "no more than " + n), i) throw new Error(e + " failed: Was called with " + r + (1 === r ? " argument." : " arguments.") + " Expects " + i + ".")
        }, n.validateCallback = function(e, t, n, r) {
            if ((!r || n) && "function" != typeof n) throw new Error(x(e, t, r) + "must be a valid function.")
        }, n.validateContextObject = function(e, t, n, r) {
            if ((!r || n) && ("object" !== lo(n) || null === n)) throw new Error(x(e, t, r) + "must be a valid context object.")
        }, n.validateNamespace = function(e, t, n, r) {
            if ((!r || n) && "string" != typeof n) throw new Error(x(e, t, r) + "must be a valid firebase namespace.")
        }
    });
    t(Sd);
    Sd.CONSTANTS, Sd.Deferred;
    var Ed = Sd.ErrorFactory,
        Ad = (Sd.FirebaseError, Sd.Sha1, Sd.assert, Sd.assertionError, Sd.async, Sd.base64, Sd.base64Decode, Sd.base64Encode, Sd.contains, Sd.createSubscribe),
        Cd = (Sd.decode, Sd.deepCopy, Sd.deepExtend, Sd.errorPrefix, Sd.getUA, Sd.isAdmin, Sd.isBrowser, Sd.isEmpty, Sd.isMobileCordova, Sd.isNode, Sd.isNodeSdk, Sd.isReactNative, Sd.isValidFormat, Sd.isValidTimestamp, Sd.issuedAtTime, Sd.jsonEval, Sd.map, Sd.querystring, Sd.querystringDecode, Sd.safeGet, Sd.stringLength, Sd.stringToByteArray, Sd.stringify, Sd.validateArgCount, Sd.validateCallback, Sd.validateContextObject, Sd.validateNamespace, "".repeat || function(e) {
            var t = String(w(this)),
                n = "",
                r = ae(e);
            if (r < 0 || r == 1 / 0) throw RangeError("Wrong number of repetitions");
            for (; r > 0;
                (r >>>= 1) && (t += t)) 1 & r && (n += t);
            return n
        }),
        kd = Math.ceil,
        Ld = function(e) {
            return function(t, n, r) {
                var i, o, a = String(w(t)),
                    s = a.length,
                    c = void 0 === r ? " " : String(r),
                    u = ce(n);
                return u <= s || "" == c ? a : (i = u - s, (o = Cd.call(c, kd(i / c.length))).length > i && (o = o.slice(0, i)), e ? a + o : o + a)
            }
        },
        _d = {
            start: Ld(!1),
            end: Ld(!0)
        }.start,
        Od = Math.abs,
        Dd = Date.prototype,
        Pd = Dd.getTime,
        Rd = Dd.toISOString,
        Id = u(function() {
            return "0385-07-25T07:06:39.999Z" != Rd.call(new Date(-5e13 - 1))
        }) || !u(function() {
            Rd.call(new Date(NaN))
        }) ? function() {
            if (!isFinite(Pd.call(this))) throw RangeError("Invalid time value");
            var e = this.getUTCFullYear(),
                t = this.getUTCMilliseconds(),
                n = e < 0 ? "-" : e > 9999 ? "+" : "";
            return n + _d(Od(e), n ? 6 : 4, 0) + "-" + _d(this.getUTCMonth() + 1, 2, 0) + "-" + _d(this.getUTCDate(), 2, 0) + "T" + _d(this.getUTCHours(), 2, 0) + ":" + _d(this.getUTCMinutes(), 2, 0) + ":" + _d(this.getUTCSeconds(), 2, 0) + "." + _d(t, 3, 0) + "Z"
        } : Rd;
    Oe({
        target: "Date",
        proto: !0,
        forced: Date.prototype.toISOString !== Id
    }, {
        toISOString: Id
    });
    var Md, Nd = [];
    ! function(e) {
        e[e.DEBUG = 0] = "DEBUG", e[e.VERBOSE = 1] = "VERBOSE", e[e.INFO = 2] = "INFO", e[e.WARN = 3] = "WARN", e[e.ERROR = 4] = "ERROR", e[e.SILENT = 5] = "SILENT"
    }(Md || (Md = {}));
    var Bd = Md.INFO,
        jd = function(e, t) {
            for (var n = arguments, r = [], i = 2; i < arguments.length; i++) r[i - 2] = n[i];
            if (!(t < e.logLevel)) {
                var o = (new Date).toISOString();
                switch (t) {
                    case Md.DEBUG:
                    case Md.VERBOSE:
                        console.log.apply(console, ["[" + o + "]  " + e.name + ":"].concat(r));
                        break;
                    case Md.INFO:
                        console.info.apply(console, ["[" + o + "]  " + e.name + ":"].concat(r));
                        break;
                    case Md.WARN:
                        console.warn.apply(console, ["[" + o + "]  " + e.name + ":"].concat(r));
                        break;
                    case Md.ERROR:
                        console.error.apply(console, ["[" + o + "]  " + e.name + ":"].concat(r));
                        break;
                    default:
                        throw new Error("Attempted to log a message with an invalid logType (value: " + t + ")")
                }
            }
        },
        Fd = function() {
            function e(e) {
                this.name = e, this._logLevel = Bd, this._logHandler = jd, Nd.push(this)
            }
            return Object.defineProperty(e.prototype, "logLevel", {
                get: function() {
                    return this._logLevel
                },
                set: function(e) {
                    if (!(e in Md)) throw new TypeError("Invalid value assigned to `logLevel`");
                    this._logLevel = e
                },
                enumerable: !0,
                configurable: !0
            }), Object.defineProperty(e.prototype, "logHandler", {
                get: function() {
                    return this._logHandler
                },
                set: function(e) {
                    if ("function" != typeof e) throw new TypeError("Value assigned to `logHandler` must be a function");
                    this._logHandler = e
                },
                enumerable: !0,
                configurable: !0
            }), e.prototype.debug = function() {
                for (var e = arguments, t = [], n = 0; n < arguments.length; n++) t[n] = e[n];
                this._logHandler.apply(this, [this, Md.DEBUG].concat(t))
            }, e.prototype.log = function() {
                for (var e = arguments, t = [], n = 0; n < arguments.length; n++) t[n] = e[n];
                this._logHandler.apply(this, [this, Md.VERBOSE].concat(t))
            }, e.prototype.info = function() {
                for (var e = arguments, t = [], n = 0; n < arguments.length; n++) t[n] = e[n];
                this._logHandler.apply(this, [this, Md.INFO].concat(t))
            }, e.prototype.warn = function() {
                for (var e = arguments, t = [], n = 0; n < arguments.length; n++) t[n] = e[n];
                this._logHandler.apply(this, [this, Md.WARN].concat(t))
            }, e.prototype.error = function() {
                for (var e = arguments, t = [], n = 0; n < arguments.length; n++) t[n] = e[n];
                this._logHandler.apply(this, [this, Md.ERROR].concat(t))
            }, e
        }();
    var Ud = Object.freeze({
            __proto__: null,
            get LogLevel() {
                return Md
            },
            Logger: Fd,
            setLogLevel: function(e) {
                Nd.forEach(function(t) {
                    t.logLevel = e
                })
            }
        }),
        Hd = n(function(e, t) {
            var n;
            Object.defineProperty(t, "__esModule", {
                value: !0
            });
            var r = ((n = {})["no-app"] = "No Firebase App '{$appName}' has been created - call Firebase App.initializeApp()", n["bad-app-name"] = "Illegal App name: '{$appName}", n["duplicate-app"] = "Firebase App named '{$appName}' already exists", n["app-deleted"] = "Firebase App named '{$appName}' already deleted", n["invalid-app-argument"] = "firebase.{$appName}() takes either no argument or a Firebase App instance.", n),
                i = new Sd.ErrorFactory("app", "Firebase", r),
                o = "[DEFAULT]",
                a = [],
                s = function() {
                    function e(e, t, n) {
                        this.firebase_ = n, this.isDeleted_ = !1, this.services_ = {}, this.name_ = t.name, this.automaticDataCollectionEnabled_ = t.automaticDataCollectionEnabled || !1, this.options_ = Sd.deepCopy(e), this.INTERNAL = {
                            getUid: function() {
                                return null
                            },
                            getToken: function() {
                                return Promise.resolve(null)
                            },
                            addAuthTokenListener: function(e) {
                                a.push(e), setTimeout(function() {
                                    return e(null)
                                }, 0)
                            },
                            removeAuthTokenListener: function(e) {
                                a = a.filter(function(t) {
                                    return t !== e
                                })
                            }
                        }
                    }
                    return Object.defineProperty(e.prototype, "automaticDataCollectionEnabled", {
                        get: function() {
                            return this.checkDestroyed_(), this.automaticDataCollectionEnabled_
                        },
                        set: function(e) {
                            this.checkDestroyed_(), this.automaticDataCollectionEnabled_ = e
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "name", {
                        get: function() {
                            return this.checkDestroyed_(), this.name_
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "options", {
                        get: function() {
                            return this.checkDestroyed_(), this.options_
                        },
                        enumerable: !0,
                        configurable: !0
                    }), e.prototype.delete = function() {
                        var e = this;
                        return new Promise(function(t) {
                            e.checkDestroyed_(), t()
                        }).then(function() {
                            e.firebase_.INTERNAL.removeApp(e.name_);
                            for (var t = [], n = 0, r = Object.keys(e.services_); n < r.length; n++)
                                for (var i = r[n], o = 0, a = Object.keys(e.services_[i]); o < a.length; o++) {
                                    var s = a[o];
                                    t.push(e.services_[i][s])
                                }
                            return Promise.all(t.filter(function(e) {
                                return "INTERNAL" in e
                            }).map(function(e) {
                                return e.INTERNAL.delete()
                            }))
                        }).then(function() {
                            e.isDeleted_ = !0, e.services_ = {}
                        })
                    }, e.prototype._getService = function(e, t) {
                        if (void 0 === t && (t = o), this.checkDestroyed_(), this.services_[e] || (this.services_[e] = {}), !this.services_[e][t]) {
                            var n = t !== o ? t : void 0,
                                r = this.firebase_.INTERNAL.factories[e](this, this.extendApp.bind(this), n);
                            this.services_[e][t] = r
                        }
                        return this.services_[e][t]
                    }, e.prototype._removeServiceInstance = function(e, t) {
                        void 0 === t && (t = o), this.services_[e] && this.services_[e][t] && delete this.services_[e][t]
                    }, e.prototype.extendApp = function(e) {
                        var t = this;
                        Sd.deepExtend(this, e), e.INTERNAL && e.INTERNAL.addAuthTokenListener && (a.forEach(function(e) {
                            t.INTERNAL.addAuthTokenListener(e)
                        }), a = [])
                    }, e.prototype.checkDestroyed_ = function() {
                        if (this.isDeleted_) throw i.create("app-deleted", {
                            appName: this.name_
                        })
                    }, e
                }();
            s.prototype.name && s.prototype.options || s.prototype.delete || console.log("dc");
            var c = "6.6.2",
                u = new Ud.Logger("@firebase/app");
            if (Sd.isBrowser() && void 0 !== self.firebase) {
                u.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
                var l = self.firebase.SDK_VERSION;
                l && l.indexOf("LITE") >= 0 && u.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ")
            }
            var f = function e() {
                    var t = function(e) {
                        var t = {},
                            n = {},
                            r = {},
                            a = {
                                __esModule: !0,
                                initializeApp: function(n, r) {
                                    if (void 0 === r && (r = {}), "object" !== lo(r) || null === r) {
                                        var s = r;
                                        r = {
                                            name: s
                                        }
                                    }
                                    var c = r;
                                    void 0 === c.name && (c.name = o);
                                    var u = c.name;
                                    if ("string" != typeof u || !u) throw i.create("bad-app-name", {
                                        appName: String(u)
                                    });
                                    if (Sd.contains(t, u)) throw i.create("duplicate-app", {
                                        appName: u
                                    });
                                    var l = new e(n, c, a);
                                    return t[u] = l, f(l, "create"), l
                                },
                                app: s,
                                apps: null,
                                SDK_VERSION: c,
                                INTERNAL: {
                                    registerService: function(t, o, c, f, d) {
                                        if (void 0 === d && (d = !1), n[t]) return u.debug("There were multiple attempts to register service " + t + "."), a[t];

                                        function h(e) {
                                            if (void 0 === e && (e = s()), "function" != typeof e[t]) throw i.create("invalid-app-argument", {
                                                appName: t
                                            });
                                            return e[t]()
                                        }
                                        return n[t] = o, f && (r[t] = f, l().forEach(function(e) {
                                            f("create", e)
                                        })), void 0 !== c && Sd.deepExtend(h, c), a[t] = h, e.prototype[t] = function() {
                                            for (var e = arguments, n = [], r = 0; r < arguments.length; r++) n[r] = e[r];
                                            return this._getService.bind(this, t).apply(this, d ? n : [])
                                        }, h
                                    },
                                    removeApp: function(e) {
                                        f(t[e], "delete"), delete t[e]
                                    },
                                    factories: n,
                                    useAsService: d
                                }
                            };

                        function s(e) {
                            if (e = e || o, !Sd.contains(t, e)) throw i.create("no-app", {
                                appName: e
                            });
                            return t[e]
                        }

                        function l() {
                            return Object.keys(t).map(function(e) {
                                return t[e]
                            })
                        }

                        function f(e, t) {
                            for (var i = 0, o = Object.keys(n); i < o.length; i++) {
                                var a = d(0, o[i]);
                                if (null === a) return;
                                r[a] && r[a](t, e)
                            }
                        }

                        function d(e, t) {
                            return "serverAuth" === t ? null : t
                        }
                        return a.default = a, Object.defineProperty(a, "apps", {
                            get: l
                        }), s.App = e, a
                    }(s);
                    return t.INTERNAL = bd.__assign({}, t.INTERNAL, {
                        createFirebaseNamespace: e,
                        extendNamespace: function(e) {
                            Sd.deepExtend(t, e)
                        },
                        createSubscribe: Sd.createSubscribe,
                        ErrorFactory: Sd.ErrorFactory,
                        deepExtend: Sd.deepExtend
                    }), t
                }(),
                d = f.initializeApp;
            f.initializeApp = function() {
                for (var e = arguments, t = [], n = 0; n < arguments.length; n++) t[n] = e[n];
                return Sd.isNode() && u.warn('\n      Warning: This is a browser-targeted Firebase bundle but it appears it is being\n      run in a Node environment.  If running in a Node environment, make sure you\n      are using the bundle specified by the "main" field in package.json.\n      \n      If you are using Webpack, you can specify "main" as the first item in\n      "resolve.mainFields":\n      https://webpack.js.org/configuration/resolve/#resolvemainfields\n      \n      If using Rollup, use the rollup-plugin-node-resolve plugin and specify "main"\n      as the first item in "mainFields", e.g. [\'main\', \'module\'].\n      https://github.com/rollup/rollup-plugin-node-resolve\n      '), d.apply(void 0, t)
            };
            var h = f;
            t.default = h, t.firebase = h
        }),
        Gd = t(Hd);
    Hd.firebase;
    var Wd, zd = (Wd = Hd) && "object" === lo(Wd) && "default" in Wd ? Wd.default : Wd,
        qd = We.some;
    Oe({
        target: "Array",
        proto: !0,
        forced: ze("some")
    }, {
        some: function(e) {
            return qd(this, e, arguments.length > 1 ? arguments[1] : void 0)
        }
    });
    var Vd, $d = fl.ArrayBuffer,
        Kd = c.ArrayBuffer;
    Oe({
        global: !0,
        forced: Kd !== $d
    }, {
        ArrayBuffer: $d
    }), dt("ArrayBuffer"), Oe({
        global: !0,
        forced: !ul.NATIVE_ARRAY_BUFFER
    }, {
        DataView: fl.DataView
    }), Oe({
        target: "String",
        proto: !0
    }, {
        repeat: Cd
    }), Oe({
        target: "String",
        proto: !0,
        forced: eo("link")
    }, {
        link: function(e) {
            return Qi(this, "a", "href", e)
        }
    });
    var Xd, Yd, Jd = new Ed("messaging", "Messaging", ((Vd = {})["only-available-in-window"] = "This method is available in a Window context.", Vd["only-available-in-sw"] = "This method is available in a service worker context.", Vd["should-be-overriden"] = "This method should be overriden by extended classes.", Vd["bad-sender-id"] = "Please ensure that 'messagingSenderId' is set correctly in the options passed into firebase.initializeApp().", Vd["permission-default"] = "The required permissions were not granted and dismissed instead.", Vd["permission-blocked"] = "The required permissions were not granted and blocked instead.", Vd["unsupported-browser"] = "This browser doesn't support the API's required to use the firebase SDK.", Vd["notifications-blocked"] = "Notifications have been blocked.", Vd["failed-serviceworker-registration"] = "We are unable to register the default service worker. {$browserErrorMessage}", Vd["sw-registration-expected"] = "A service worker registration was the expected input.", Vd["get-subscription-failed"] = "There was an error when trying to get any existing Push Subscriptions.", Vd["invalid-saved-token"] = "Unable to access details of the saved token.", Vd["sw-reg-redundant"] = "The service worker being used for push was made redundant.", Vd["token-subscribe-failed"] = "A problem occured while subscribing the user to FCM: {$errorInfo}", Vd["token-subscribe-no-token"] = "FCM returned no token when subscribing the user to push.", Vd["token-subscribe-no-push-set"] = "FCM returned an invalid response when getting an FCM token.", Vd["token-unsubscribe-failed"] = "A problem occured while unsubscribing the user from FCM: {$errorInfo}", Vd["token-update-failed"] = "A problem occured while updating the user from FCM: {$errorInfo}", Vd["token-update-no-token"] = "FCM returned no token when updating the user to push.", Vd["use-sw-before-get-token"] = "The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.", Vd["invalid-delete-token"] = "You must pass a valid token into deleteToken(), i.e. the token from getToken().", Vd["delete-token-not-found"] = "The deletion attempt for token could not be performed as the token was not found.", Vd["delete-scope-not-found"] = "The deletion attempt for service worker scope could not be performed as the scope was not found.", Vd["bg-handler-function-expected"] = "The input to setBackgroundMessageHandler() must be a function.", Vd["no-window-client-to-msg"] = "An attempt was made to message a non-existant window client.", Vd["unable-to-resubscribe"] = "There was an error while re-subscribing the FCM token for push messaging. Will have to resubscribe the user on next visit. {$errorInfo}", Vd["no-fcm-token-for-resubscribe"] = "Could not find an FCM token and as a result, unable to resubscribe. Will have to resubscribe the user on next visit.", Vd["failed-to-delete-token"] = "Unable to delete the currently saved token.", Vd["no-sw-in-reg"] = "Even though the service worker registration was successful, there was a problem accessing the service worker itself.", Vd["bad-scope"] = "The service worker scope must be a string with at least one character.", Vd["bad-vapid-key"] = "The public VAPID key is not a Uint8Array with 65 bytes.", Vd["bad-subscription"] = "The subscription must be a valid PushSubscription.", Vd["bad-token"] = "The FCM Token used for storage / lookup was not a valid token string.", Vd["bad-push-set"] = "The FCM push set used for storage / lookup was not not a valid push set string.", Vd["failed-delete-vapid-key"] = "The VAPID key could not be deleted.", Vd["invalid-public-vapid-key"] = "The public VAPID key must be a string.", Vd["use-public-key-before-get-token"] = "The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.", Vd["public-vapid-key-decryption-failed"] = "The public VAPID key did not equal 65 bytes when decrypted.", Vd)),
        Zd = new Uint8Array([4, 51, 148, 247, 223, 161, 235, 177, 220, 3, 162, 94, 21, 113, 219, 72, 211, 46, 237, 237, 178, 52, 219, 183, 71, 58, 12, 143, 196, 204, 225, 111, 60, 140, 132, 223, 171, 182, 102, 62, 242, 12, 212, 139, 254, 227, 249, 118, 47, 20, 28, 99, 8, 106, 111, 45, 177, 26, 149, 176, 206, 55, 192, 156, 110]),
        Qd = "https://fcm.googleapis.com";

    function eh(e, t) {
        if (null == e || null == t) return !1;
        if (e === t) return !0;
        if (e.byteLength !== t.byteLength) return !1;
        for (var n = new DataView(e), r = new DataView(t), i = 0; i < e.byteLength; i++)
            if (n.getUint8(i) !== r.getUint8(i)) return !1;
        return !0
    }

    function th(e) {
        return function(e) {
            var t = new Uint8Array(e);
            return btoa(String.fromCharCode.apply(String, md(t)))
        }(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
    }! function(e) {
        e.TYPE_OF_MSG = "firebase-messaging-msg-type", e.DATA = "firebase-messaging-msg-data"
    }(Xd || (Xd = {})),
    function(e) {
        e.PUSH_MSG_RECEIVED = "push-msg-received", e.NOTIFICATION_CLICKED = "notification-clicked"
    }(Yd || (Yd = {}));
    var nh = function() {
        function e() {}
        return e.prototype.getToken = function(e, t, n) {
            return hd(this, void 0, void 0, function() {
                var r, i, o, a, s, c, u, l, f;
                return pd(this, function(d) {
                    switch (d.label) {
                        case 0:
                            r = th(t.getKey("p256dh")), i = th(t.getKey("auth")), o = "authorized_entity=" + e + "&endpoint=" + t.endpoint + "&encryption_key=" + r + "&encryption_auth=" + i, eh(n.buffer, Zd.buffer) || (a = th(n), o += "&application_pub_key=" + a), (s = new Headers).append("Content-Type", "application/x-www-form-urlencoded"), c = {
                                method: "POST",
                                headers: s,
                                body: o
                            }, d.label = 1;
                        case 1:
                            return d.trys.push([1, 4, , 5]), [4, fetch(Qd + "/fcm/connect/subscribe", c)];
                        case 2:
                            return [4, d.sent().json()];
                        case 3:
                            return u = d.sent(), [3, 5];
                        case 4:
                            throw l = d.sent(), Jd.create("token-subscribe-failed", {
                                errorInfo: l
                            });
                        case 5:
                            if (u.error) throw f = u.error.message, Jd.create("token-subscribe-failed", {
                                errorInfo: f
                            });
                            if (!u.token) throw Jd.create("token-subscribe-no-token");
                            if (!u.pushSet) throw Jd.create("token-subscribe-no-push-set");
                            return [2, {
                                token: u.token,
                                pushSet: u.pushSet
                            }]
                    }
                })
            })
        }, e.prototype.updateToken = function(e, t, n, r, i) {
            return hd(this, void 0, void 0, function() {
                var o, a, s, c, u, l, f, d, h;
                return pd(this, function(p) {
                    switch (p.label) {
                        case 0:
                            o = th(r.getKey("p256dh")), a = th(r.getKey("auth")), s = "push_set=" + n + "&token=" + t + "&authorized_entity=" + e + "&endpoint=" + r.endpoint + "&encryption_key=" + o + "&encryption_auth=" + a, eh(i.buffer, Zd.buffer) || (c = th(i), s += "&application_pub_key=" + c), (u = new Headers).append("Content-Type", "application/x-www-form-urlencoded"), l = {
                                method: "POST",
                                headers: u,
                                body: s
                            }, p.label = 1;
                        case 1:
                            return p.trys.push([1, 4, , 5]), [4, fetch(Qd + "/fcm/connect/subscribe", l)];
                        case 2:
                            return [4, p.sent().json()];
                        case 3:
                            return f = p.sent(), [3, 5];
                        case 4:
                            throw d = p.sent(), Jd.create("token-update-failed", {
                                errorInfo: d
                            });
                        case 5:
                            if (f.error) throw h = f.error.message, Jd.create("token-update-failed", {
                                errorInfo: h
                            });
                            if (!f.token) throw Jd.create("token-update-no-token");
                            return [2, f.token]
                    }
                })
            })
        }, e.prototype.deleteToken = function(e, t, n) {
            return hd(this, void 0, void 0, function() {
                var r, i, o, a, s, c;
                return pd(this, function(u) {
                    switch (u.label) {
                        case 0:
                            r = "authorized_entity=" + e + "&token=" + t + "&pushSet=" + n, (i = new Headers).append("Content-Type", "application/x-www-form-urlencoded"), o = {
                                method: "POST",
                                headers: i,
                                body: r
                            }, u.label = 1;
                        case 1:
                            return u.trys.push([1, 4, , 5]), [4, fetch(Qd + "/fcm/connect/unsubscribe", o)];
                        case 2:
                            return [4, u.sent().json()];
                        case 3:
                            if ((a = u.sent()).error) throw s = a.error.message, Jd.create("token-unsubscribe-failed", {
                                errorInfo: s
                            });
                            return [3, 5];
                        case 4:
                            throw c = u.sent(), Jd.create("token-unsubscribe-failed", {
                                errorInfo: c
                            });
                        case 5:
                            return [2]
                    }
                })
            })
        }, e
    }();

    function rh(e) {
        for (var t = (e + "=".repeat((4 - e.length % 4) % 4)).replace(/\-/g, "+").replace(/_/g, "/"), n = atob(t), r = new Uint8Array(n.length), i = 0; i < n.length; ++i) r[i] = n.charCodeAt(i);
        return r
    }
    var ih = "undefined",
        oh = "fcm_token_object_Store";

    function ah() {
        var e = indexedDB.open(ih);
        e.onerror = function(e) {}, e.onsuccess = function(t) {
            ! function(e) {
                if (e.objectStoreNames.contains(oh)) {
                    var t = e.transaction(oh).objectStore(oh),
                        n = new nh,
                        r = t.openCursor();
                    r.onerror = function(e) {
                        console.warn("Unable to cleanup old IDB.", e)
                    }, r.onsuccess = function() {
                        var t = r.result;
                        if (t) {
                            var i = t.value;
                            n.deleteToken(i.fcmSenderId, i.fcmToken, i.fcmPushSet), t.continue()
                        } else e.close(), indexedDB.deleteDatabase(ih)
                    }
                }
            }(e.result)
        }
    }
    var sh = function() {
        function e() {
            this.dbPromise = null
        }
        return e.prototype.get = function(e) {
            return this.createTransaction(function(t) {
                return t.get(e)
            })
        }, e.prototype.getIndex = function(e, t) {
            return this.createTransaction(function(n) {
                return n.index(e).get(t)
            })
        }, e.prototype.put = function(e) {
            return this.createTransaction(function(t) {
                return t.put(e)
            }, "readwrite")
        }, e.prototype.delete = function(e) {
            return this.createTransaction(function(t) {
                return t.delete(e)
            }, "readwrite")
        }, e.prototype.closeDatabase = function() {
            return hd(this, void 0, void 0, function() {
                return pd(this, function(e) {
                    switch (e.label) {
                        case 0:
                            return this.dbPromise ? [4, this.dbPromise] : [3, 2];
                        case 1:
                            e.sent().close(), this.dbPromise = null, e.label = 2;
                        case 2:
                            return [2]
                    }
                })
            })
        }, e.prototype.createTransaction = function(e, t) {
            return void 0 === t && (t = "readonly"), hd(this, void 0, void 0, function() {
                var n, r, i, o;
                return pd(this, function(a) {
                    switch (a.label) {
                        case 0:
                            return [4, this.getDb()];
                        case 1:
                            return n = a.sent(), r = n.transaction(this.objectStoreName, t), i = r.objectStore(this.objectStoreName), [4, ch(e(i))];
                        case 2:
                            return o = a.sent(), [2, new Promise(function(e, t) {
                                r.oncomplete = function() {
                                    e(o)
                                }, r.onerror = function() {
                                    t(r.error)
                                }
                            })]
                    }
                })
            })
        }, e.prototype.getDb = function() {
            var e = this;
            return this.dbPromise || (this.dbPromise = new Promise(function(t, n) {
                var r = indexedDB.open(e.dbName, e.dbVersion);
                r.onsuccess = function() {
                    t(r.result)
                }, r.onerror = function() {
                    e.dbPromise = null, n(r.error)
                }, r.onupgradeneeded = function(t) {
                    return e.onDbUpgrade(r, t)
                }
            })), this.dbPromise
        }, e
    }();

    function ch(e) {
        return new Promise(function(t, n) {
            e.onsuccess = function() {
                t(e.result)
            }, e.onerror = function() {
                n(e.error)
            }
        })
    }
    var uh = function(e) {
        function t() {
            var t = null !== e && e.apply(this, arguments) || this;
            return t.dbName = "fcm_token_details_db", t.dbVersion = 3, t.objectStoreName = "fcm_token_object_Store", t
        }
        return fd(t, e), t.prototype.onDbUpgrade = function(e, t) {
            var n = e.result;
            switch (t.oldVersion) {
                case 0:
                    (r = n.createObjectStore(this.objectStoreName, {
                        keyPath: "swScope"
                    })).createIndex("fcmSenderId", "fcmSenderId", {
                        unique: !1
                    }), r.createIndex("fcmToken", "fcmToken", {
                        unique: !0
                    });
                case 1:
                    ah();
                case 2:
                    var r, i = (r = e.transaction.objectStore(this.objectStoreName)).openCursor();
                    i.onsuccess = function() {
                        var e = i.result;
                        if (e) {
                            var t = e.value,
                                n = dd({}, t);
                            t.createTime || (n.createTime = Date.now()), "string" == typeof t.vapidKey && (n.vapidKey = rh(t.vapidKey)), "string" == typeof t.auth && (n.auth = rh(t.auth).buffer), "string" == typeof t.auth && (n.p256dh = rh(t.p256dh).buffer), e.update(n), e.continue()
                        }
                    }
            }
        }, t.prototype.getTokenDetailsFromToken = function(e) {
            return hd(this, void 0, void 0, function() {
                return pd(this, function(t) {
                    if (!e) throw Jd.create("bad-token");
                    return lh({
                        fcmToken: e
                    }), [2, this.getIndex("fcmToken", e)]
                })
            })
        }, t.prototype.getTokenDetailsFromSWScope = function(e) {
            return hd(this, void 0, void 0, function() {
                return pd(this, function(t) {
                    if (!e) throw Jd.create("bad-scope");
                    return lh({
                        swScope: e
                    }), [2, this.get(e)]
                })
            })
        }, t.prototype.saveTokenDetails = function(e) {
            return hd(this, void 0, void 0, function() {
                return pd(this, function(t) {
                    if (!e.swScope) throw Jd.create("bad-scope");
                    if (!e.vapidKey) throw Jd.create("bad-vapid-key");
                    if (!e.endpoint || !e.auth || !e.p256dh) throw Jd.create("bad-subscription");
                    if (!e.fcmSenderId) throw Jd.create("bad-sender-id");
                    if (!e.fcmToken) throw Jd.create("bad-token");
                    if (!e.fcmPushSet) throw Jd.create("bad-push-set");
                    return lh(e), [2, this.put(e)]
                })
            })
        }, t.prototype.deleteToken = function(e) {
            return hd(this, void 0, void 0, function() {
                var t;
                return pd(this, function(n) {
                    switch (n.label) {
                        case 0:
                            return "string" != typeof e || 0 === e.length ? [2, Promise.reject(Jd.create("invalid-delete-token"))] : [4, this.getTokenDetailsFromToken(e)];
                        case 1:
                            if (!(t = n.sent())) throw Jd.create("delete-token-not-found");
                            return [4, this.delete(t.swScope)];
                        case 2:
                            return n.sent(), [2, t]
                    }
                })
            })
        }, t
    }(sh);

    function lh(e) {
        if (e.fcmToken && ("string" != typeof e.fcmToken || 0 === e.fcmToken.length)) throw Jd.create("bad-token");
        if (e.swScope && ("string" != typeof e.swScope || 0 === e.swScope.length)) throw Jd.create("bad-scope");
        if (e.vapidKey && (!(e.vapidKey instanceof Uint8Array) || 65 !== e.vapidKey.length)) throw Jd.create("bad-vapid-key");
        if (e.endpoint && ("string" != typeof e.endpoint || 0 === e.endpoint.length)) throw Jd.create("bad-subscription");
        if (e.auth && !(e.auth instanceof ArrayBuffer)) throw Jd.create("bad-subscription");
        if (e.p256dh && !(e.p256dh instanceof ArrayBuffer)) throw Jd.create("bad-subscription");
        if (e.fcmSenderId && ("string" != typeof e.fcmSenderId || 0 === e.fcmSenderId.length)) throw Jd.create("bad-sender-id");
        if (e.fcmPushSet && ("string" != typeof e.fcmPushSet || 0 === e.fcmPushSet.length)) throw Jd.create("bad-push-set")
    }
    var fh = function(e) {
            function t() {
                var t = null !== e && e.apply(this, arguments) || this;
                return t.dbName = "fcm_vapid_details_db", t.dbVersion = 1, t.objectStoreName = "fcm_vapid_object_Store", t
            }
            return fd(t, e), t.prototype.onDbUpgrade = function(e) {
                e.result.createObjectStore(this.objectStoreName, {
                    keyPath: "swScope"
                })
            }, t.prototype.getVapidFromSWScope = function(e) {
                return hd(this, void 0, void 0, function() {
                    var t;
                    return pd(this, function(n) {
                        switch (n.label) {
                            case 0:
                                if ("string" != typeof e || 0 === e.length) throw Jd.create("bad-scope");
                                return [4, this.get(e)];
                            case 1:
                                return [2, (t = n.sent()) ? t.vapidKey : void 0]
                        }
                    })
                })
            }, t.prototype.saveVapidDetails = function(e, t) {
                return hd(this, void 0, void 0, function() {
                    var n;
                    return pd(this, function(r) {
                        if ("string" != typeof e || 0 === e.length) throw Jd.create("bad-scope");
                        if (null === t || 65 !== t.length) throw Jd.create("bad-vapid-key");
                        return n = {
                            swScope: e,
                            vapidKey: t
                        }, [2, this.put(n)]
                    })
                })
            }, t.prototype.deleteVapidDetails = function(e) {
                return hd(this, void 0, void 0, function() {
                    var t;
                    return pd(this, function(n) {
                        switch (n.label) {
                            case 0:
                                return [4, this.getVapidFromSWScope(e)];
                            case 1:
                                if (!(t = n.sent())) throw Jd.create("delete-scope-not-found");
                                return [4, this.delete(e)];
                            case 2:
                                return n.sent(), [2, t]
                        }
                    })
                })
            }, t
        }(sh),
        dh = "messagingSenderId",
        hh = function() {
            function e(e) {
                var t = this;
                if (!e.options[dh] || "string" != typeof e.options[dh]) throw Jd.create("bad-sender-id");
                this.messagingSenderId = e.options[dh], this.tokenDetailsModel = new uh, this.vapidDetailsModel = new fh, this.iidModel = new nh, this.app = e, this.INTERNAL = {
                    delete: function() {
                        return t.delete()
                    }
                }
            }
            return e.prototype.getToken = function() {
                return hd(this, void 0, void 0, function() {
                    var e, t, n, r, i;
                    return pd(this, function(o) {
                        switch (o.label) {
                            case 0:
                                if ("denied" === (e = this.getNotificationPermission_())) throw Jd.create("notifications-blocked");
                                return "granted" !== e ? [2, null] : [4, this.getSWRegistration_()];
                            case 1:
                                return t = o.sent(), [4, this.getPublicVapidKey_()];
                            case 2:
                                return n = o.sent(), [4, this.getPushSubscription(t, n)];
                            case 3:
                                return r = o.sent(), [4, this.tokenDetailsModel.getTokenDetailsFromSWScope(t.scope)];
                            case 4:
                                return (i = o.sent()) ? [2, this.manageExistingToken(t, r, n, i)] : [2, this.getNewToken(t, r, n)]
                        }
                    })
                })
            }, e.prototype.manageExistingToken = function(e, t, n, r) {
                return hd(this, void 0, void 0, function() {
                    return pd(this, function(i) {
                        switch (i.label) {
                            case 0:
                                return function(e, t, n) {
                                    if (!n.vapidKey || !eh(t.buffer, n.vapidKey.buffer)) return !1;
                                    var r = e.endpoint === n.endpoint,
                                        i = eh(e.getKey("auth"), n.auth),
                                        o = eh(e.getKey("p256dh"), n.p256dh);
                                    return r && i && o
                                }(t, n, r) ? Date.now() < r.createTime + 6048e5 ? [2, r.fcmToken] : [2, this.updateToken(e, t, n, r)] : [4, this.deleteTokenFromDB(r.fcmToken)];
                            case 1:
                                return i.sent(), [2, this.getNewToken(e, t, n)]
                        }
                    })
                })
            }, e.prototype.updateToken = function(e, t, n, r) {
                return hd(this, void 0, void 0, function() {
                    var i, o, a;
                    return pd(this, function(s) {
                        switch (s.label) {
                            case 0:
                                return s.trys.push([0, 4, , 6]), [4, this.iidModel.updateToken(this.messagingSenderId, r.fcmToken, r.fcmPushSet, t, n)];
                            case 1:
                                return i = s.sent(), o = {
                                    swScope: e.scope,
                                    vapidKey: n,
                                    fcmSenderId: this.messagingSenderId,
                                    fcmToken: i,
                                    fcmPushSet: r.fcmPushSet,
                                    createTime: Date.now(),
                                    endpoint: t.endpoint,
                                    auth: t.getKey("auth"),
                                    p256dh: t.getKey("p256dh")
                                }, [4, this.tokenDetailsModel.saveTokenDetails(o)];
                            case 2:
                                return s.sent(), [4, this.vapidDetailsModel.saveVapidDetails(e.scope, n)];
                            case 3:
                                return s.sent(), [2, i];
                            case 4:
                                return a = s.sent(), [4, this.deleteToken(r.fcmToken)];
                            case 5:
                                throw s.sent(), a;
                            case 6:
                                return [2]
                        }
                    })
                })
            }, e.prototype.getNewToken = function(e, t, n) {
                return hd(this, void 0, void 0, function() {
                    var r, i;
                    return pd(this, function(o) {
                        switch (o.label) {
                            case 0:
                                return [4, this.iidModel.getToken(this.messagingSenderId, t, n)];
                            case 1:
                                return r = o.sent(), i = {
                                    swScope: e.scope,
                                    vapidKey: n,
                                    fcmSenderId: this.messagingSenderId,
                                    fcmToken: r.token,
                                    fcmPushSet: r.pushSet,
                                    createTime: Date.now(),
                                    endpoint: t.endpoint,
                                    auth: t.getKey("auth"),
                                    p256dh: t.getKey("p256dh")
                                }, [4, this.tokenDetailsModel.saveTokenDetails(i)];
                            case 2:
                                return o.sent(), [4, this.vapidDetailsModel.saveVapidDetails(e.scope, n)];
                            case 3:
                                return o.sent(), [2, r.token]
                        }
                    })
                })
            }, e.prototype.deleteToken = function(e) {
                return hd(this, void 0, void 0, function() {
                    var t, n;
                    return pd(this, function(r) {
                        switch (r.label) {
                            case 0:
                                return [4, this.deleteTokenFromDB(e)];
                            case 1:
                                return r.sent(), [4, this.getSWRegistration_()];
                            case 2:
                                return (t = r.sent()) ? [4, t.pushManager.getSubscription()] : [3, 4];
                            case 3:
                                if (n = r.sent()) return [2, n.unsubscribe()];
                                r.label = 4;
                            case 4:
                                return [2, !0]
                        }
                    })
                })
            }, e.prototype.deleteTokenFromDB = function(e) {
                return hd(this, void 0, void 0, function() {
                    var t;
                    return pd(this, function(n) {
                        switch (n.label) {
                            case 0:
                                return [4, this.tokenDetailsModel.deleteToken(e)];
                            case 1:
                                return t = n.sent(), [4, this.iidModel.deleteToken(t.fcmSenderId, t.fcmToken, t.fcmPushSet)];
                            case 2:
                                return n.sent(), [2]
                        }
                    })
                })
            }, e.prototype.getPushSubscription = function(e, t) {
                return e.pushManager.getSubscription().then(function(n) {
                    return n || e.pushManager.subscribe({
                        userVisibleOnly: !0,
                        applicationServerKey: t
                    })
                })
            }, e.prototype.requestPermission = function() {
                throw Jd.create("only-available-in-window")
            }, e.prototype.useServiceWorker = function(e) {
                throw Jd.create("only-available-in-window")
            }, e.prototype.usePublicVapidKey = function(e) {
                throw Jd.create("only-available-in-window")
            }, e.prototype.onMessage = function(e, t, n) {
                throw Jd.create("only-available-in-window")
            }, e.prototype.onTokenRefresh = function(e, t, n) {
                throw Jd.create("only-available-in-window")
            }, e.prototype.setBackgroundMessageHandler = function(e) {
                throw Jd.create("only-available-in-sw")
            }, e.prototype.delete = function() {
                return hd(this, void 0, void 0, function() {
                    return pd(this, function(e) {
                        switch (e.label) {
                            case 0:
                                return [4, Promise.all([this.tokenDetailsModel.closeDatabase(), this.vapidDetailsModel.closeDatabase()])];
                            case 1:
                                return e.sent(), [2]
                        }
                    })
                })
            }, e.prototype.getNotificationPermission_ = function() {
                return Notification.permission
            }, e.prototype.getTokenDetailsModel = function() {
                return this.tokenDetailsModel
            }, e.prototype.getVapidDetailsModel = function() {
                return this.vapidDetailsModel
            }, e.prototype.getIidModel = function() {
                return this.iidModel
            }, e
        }();
    var ph = function(e) {
        function t(t) {
            var n = e.call(this, t) || this;
            return n.bgMessageHandler = null, self.addEventListener("push", function(e) {
                n.onPush(e)
            }), self.addEventListener("pushsubscriptionchange", function(e) {
                n.onSubChange(e)
            }), self.addEventListener("notificationclick", function(e) {
                n.onNotificationClick(e)
            }), n
        }
        return fd(t, e), t.prototype.onPush = function(e) {
            e.waitUntil(this.onPush_(e))
        }, t.prototype.onSubChange = function(e) {
            e.waitUntil(this.onSubChange_(e))
        }, t.prototype.onNotificationClick = function(e) {
            e.waitUntil(this.onNotificationClick_(e))
        }, t.prototype.onPush_ = function(e) {
            return hd(this, void 0, void 0, function() {
                var t, n, r, i, o, a;
                return pd(this, function(s) {
                    switch (s.label) {
                        case 0:
                            if (!e.data) return [2];
                            try {
                                t = e.data.json()
                            } catch (e) {
                                return [2]
                            }
                            return [4, this.hasVisibleClients_()];
                        case 1:
                            return s.sent() ? [2, this.sendMessageToWindowClients_(t)] : (n = this.getNotificationData_(t)) ? (r = n.title || "", [4, this.getSWRegistration_()]) : [3, 3];
                        case 2:
                            return i = s.sent(), o = n.actions, a = Notification.maxActions, o && a && o.length > a && console.warn("This browser only supports " + a + " actions.The remaining actions will not be displayed."), [2, i.showNotification(r, n)];
                        case 3:
                            return this.bgMessageHandler ? [4, this.bgMessageHandler(t)] : [3, 5];
                        case 4:
                            return s.sent(), [2];
                        case 5:
                            return [2]
                    }
                })
            })
        }, t.prototype.onSubChange_ = function(e) {
            return hd(this, void 0, void 0, function() {
                var e, t, n, r;
                return pd(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return i.trys.push([0, 2, , 3]), [4, this.getSWRegistration_()];
                        case 1:
                            return e = i.sent(), [3, 3];
                        case 2:
                            throw t = i.sent(), Jd.create("unable-to-resubscribe", {
                                errorInfo: t
                            });
                        case 3:
                            return i.trys.push([3, 5, , 8]), [4, e.pushManager.getSubscription()];
                        case 4:
                            return i.sent(), [3, 8];
                        case 5:
                            return n = i.sent(), [4, this.getTokenDetailsModel().getTokenDetailsFromSWScope(e.scope)];
                        case 6:
                            if (!(r = i.sent())) throw n;
                            return [4, this.deleteToken(r.fcmToken)];
                        case 7:
                            throw i.sent(), n;
                        case 8:
                            return [2]
                    }
                })
            })
        }, t.prototype.onNotificationClick_ = function(e) {
            return hd(this, void 0, void 0, function() {
                var t, n, r, i;
                return pd(this, function(o) {
                    switch (o.label) {
                        case 0:
                            return e.notification && e.notification.data && e.notification.data.FCM_MSG ? e.action ? [2] : (e.stopImmediatePropagation(), e.notification.close(), (t = e.notification.data.FCM_MSG).notification && (n = t.fcmOptions && t.fcmOptions.link || t.notification.click_action) ? [4, this.getWindowClient_(n)] : [2]) : [2];
                        case 1:
                            return (r = o.sent()) ? [3, 3] : [4, self.clients.openWindow(n)];
                        case 2:
                            return r = o.sent(), [3, 5];
                        case 3:
                            return [4, r.focus()];
                        case 4:
                            r = o.sent(), o.label = 5;
                        case 5:
                            return r ? (delete t.notification, delete t.fcmOptions, i = vh(Yd.NOTIFICATION_CLICKED, t), [2, this.attemptToMessageClient_(r, i)]) : [2]
                    }
                })
            })
        }, t.prototype.getNotificationData_ = function(e) {
            var t;
            if (e && "object" === lo(e.notification)) {
                var n = dd({}, e.notification);
                return n.data = dd({}, e.notification.data, ((t = {}).FCM_MSG = e, t)), n
            }
        }, t.prototype.setBackgroundMessageHandler = function(e) {
            if (!e || "function" != typeof e) throw Jd.create("bg-handler-function-expected");
            this.bgMessageHandler = e
        }, t.prototype.getWindowClient_ = function(e) {
            return hd(this, void 0, void 0, function() {
                var t, n, r, i;
                return pd(this, function(o) {
                    switch (o.label) {
                        case 0:
                            return t = new URL(e, self.location.href).href, [4, gh()];
                        case 1:
                            for (n = o.sent(), r = null, i = 0; i < n.length; i++)
                                if (new URL(n[i].url, self.location.href).href === t) {
                                    r = n[i];
                                    break
                                }
                            return [2, r]
                    }
                })
            })
        }, t.prototype.attemptToMessageClient_ = function(e, t) {
            return hd(this, void 0, void 0, function() {
                return pd(this, function(n) {
                    if (!e) throw Jd.create("no-window-client-to-msg");
                    return e.postMessage(t), [2]
                })
            })
        }, t.prototype.hasVisibleClients_ = function() {
            return hd(this, void 0, void 0, function() {
                return pd(this, function(e) {
                    switch (e.label) {
                        case 0:
                            return [4, gh()];
                        case 1:
                            return [2, e.sent().some(function(e) {
                                return "visible" === e.visibilityState && !e.url.startsWith("chrome-extension://")
                            })]
                    }
                })
            })
        }, t.prototype.sendMessageToWindowClients_ = function(e) {
            return hd(this, void 0, void 0, function() {
                var t, n, r = this;
                return pd(this, function(i) {
                    switch (i.label) {
                        case 0:
                            return [4, gh()];
                        case 1:
                            return t = i.sent(), n = vh(Yd.PUSH_MSG_RECEIVED, e), [4, Promise.all(t.map(function(e) {
                                return r.attemptToMessageClient_(e, n)
                            }))];
                        case 2:
                            return i.sent(), [2]
                    }
                })
            })
        }, t.prototype.getSWRegistration_ = function() {
            return hd(this, void 0, void 0, function() {
                return pd(this, function(e) {
                    return [2, self.registration]
                })
            })
        }, t.prototype.getPublicVapidKey_ = function() {
            return hd(this, void 0, void 0, function() {
                var e, t;
                return pd(this, function(n) {
                    switch (n.label) {
                        case 0:
                            return [4, this.getSWRegistration_()];
                        case 1:
                            if (!(e = n.sent())) throw Jd.create("sw-registration-expected");
                            return [4, this.getVapidDetailsModel().getVapidFromSWScope(e.scope)];
                        case 2:
                            return null == (t = n.sent()) ? [2, Zd] : [2, t]
                    }
                })
            })
        }, t
    }(hh);

    function gh() {
        return self.clients.matchAll({
            type: "window",
            includeUncontrolled: !0
        })
    }

    function vh(e, t) {
        var n;
        return (n = {})[Xd.TYPE_OF_MSG] = e, n[Xd.DATA] = t, n
    }
    var mh = function(e) {
        function t(t) {
            var n = e.call(this, t) || this;
            return n.registrationToUse = null, n.publicVapidKeyToUse = null, n.messageObserver = null, n.tokenRefreshObserver = null, n.onMessageInternal = Ad(function(e) {
                n.messageObserver = e
            }), n.onTokenRefreshInternal = Ad(function(e) {
                n.tokenRefreshObserver = e
            }), n.setupSWMessageListener_(), n
        }
        return fd(t, e), t.prototype.requestPermission = function() {
            return hd(this, void 0, void 0, function() {
                var e;
                return pd(this, function(t) {
                    switch (t.label) {
                        case 0:
                            return "granted" === this.getNotificationPermission_() ? [2] : [4, Notification.requestPermission()];
                        case 1:
                            if ("granted" === (e = t.sent())) return [2];
                            throw "denied" === e ? Jd.create("permission-blocked") : Jd.create("permission-default")
                    }
                })
            })
        }, t.prototype.useServiceWorker = function(e) {
            if (!(e instanceof ServiceWorkerRegistration)) throw Jd.create("sw-registration-expected");
            if (null != this.registrationToUse) throw Jd.create("use-sw-before-get-token");
            this.registrationToUse = e
        }, t.prototype.usePublicVapidKey = function(e) {
            if ("string" != typeof e) throw Jd.create("invalid-public-vapid-key");
            if (null != this.publicVapidKeyToUse) throw Jd.create("use-public-key-before-get-token");
            var t = rh(e);
            if (65 !== t.length) throw Jd.create("public-vapid-key-decryption-failed");
            this.publicVapidKeyToUse = t
        }, t.prototype.onMessage = function(e, t, n) {
            return "function" == typeof e ? this.onMessageInternal(e, t, n) : this.onMessageInternal(e)
        }, t.prototype.onTokenRefresh = function(e, t, n) {
            return "function" == typeof e ? this.onTokenRefreshInternal(e, t, n) : this.onTokenRefreshInternal(e)
        }, t.prototype.waitForRegistrationToActivate_ = function(e) {
            var t = e.installing || e.waiting || e.active;
            return new Promise(function(n, r) {
                if (t)
                    if ("activated" !== t.state)
                        if ("redundant" !== t.state) {
                            t.addEventListener("statechange", function i() {
                                if ("activated" === t.state) n(e);
                                else {
                                    if ("redundant" !== t.state) return;
                                    r(Jd.create("sw-reg-redundant"))
                                }
                                t.removeEventListener("statechange", i)
                            })
                        } else r(Jd.create("sw-reg-redundant"));
                else n(e);
                else r(Jd.create("no-sw-in-reg"))
            })
        }, t.prototype.getSWRegistration_ = function() {
            var e = this;
            return this.registrationToUse ? this.waitForRegistrationToActivate_(this.registrationToUse) : (this.registrationToUse = null, navigator.serviceWorker.register("/firebase-messaging-sw.js", {
                scope: "/firebase-cloud-messaging-push-scope"
            }).catch(function(e) {
                throw Jd.create("failed-serviceworker-registration", {
                    browserErrorMessage: e.message
                })
            }).then(function(t) {
                return e.waitForRegistrationToActivate_(t).then(function() {
                    return e.registrationToUse = t, t.update(), t
                })
            }))
        }, t.prototype.getPublicVapidKey_ = function() {
            return hd(this, void 0, void 0, function() {
                return pd(this, function(e) {
                    return this.publicVapidKeyToUse ? [2, this.publicVapidKeyToUse] : [2, Zd]
                })
            })
        }, t.prototype.setupSWMessageListener_ = function() {
            var e = this;
            navigator.serviceWorker.addEventListener("message", function(t) {
                if (t.data && t.data[Xd.TYPE_OF_MSG]) {
                    var n = t.data;
                    switch (n[Xd.TYPE_OF_MSG]) {
                        case Yd.PUSH_MSG_RECEIVED:
                        case Yd.NOTIFICATION_CLICKED:
                            var r = n[Xd.DATA];
                            e.messageObserver && e.messageObserver.next(r)
                    }
                }
            }, !1)
        }, t
    }(hh);

    function yh() {
        return self && "ServiceWorkerGlobalScope" in self ? "PushManager" in self && "Notification" in self && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey") : navigator.cookieEnabled && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && "fetch" in window && ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification") && PushSubscription.prototype.hasOwnProperty("getKey")
    }! function(e) {
        var t = {
            isSupported: yh
        };
        e.INTERNAL.registerService("messaging", function(e) {
            if (!yh()) throw Jd.create("unsupported-browser");
            return self && "ServiceWorkerGlobalScope" in self ? new ph(e) : new mh(e)
        }, t)
    }(Gd);
    var bh = function() {
        var e = this;
        this.firebaseInitialized = !1, this.firebaseRegistration = !1, window.firebaseCheckPermissions = function() {
            return e.checkPermissions()
        }, window.firebaseInitializeListeners = function(t) {
            e.initializeListeners(t)
        }, window.firebaseRequestPermission = function(t) {
            e.requestPermission(t)
        }, window.firebaseInitialize = function(t) {
            e.initialize(t)
        }
    };

    function wh(e) {
        var t, n, r, i;
        for (t = "", r = e.length, n = 0; n < r; n++)(i = e.charCodeAt(n)) >= 1 && i <= 127 ? t += e.charAt(n) : i > 2047 ? (t += String.fromCharCode(224 | i >> 12 & 15), t += String.fromCharCode(128 | i >> 6 & 63), t += String.fromCharCode(128 | i >> 0 & 63)) : (t += String.fromCharCode(192 | i >> 6 & 31), t += String.fromCharCode(128 | i >> 0 & 63));
        return t
    }
    bh.prototype.checkPermissions = function() {
        try {
            return "granted" === Notification.permission ? 1 : "denied" !== Notification.permission || "default" === Notification.permission ? 0 : -1
        } catch (e) {}
        return -2
    }, bh.prototype.initializeListeners = function(e) {
        window.GLEngineModule.registerPushNotificationToken(e), navigator.serviceWorker.addEventListener("message", function(e) {
            "platform_data" in e.data && Module.processPushNotification(wh(JSON.stringify(e.data.platform_data)), !1)
        })
    }, bh.prototype.requestPermission = function(e) {
        e.requestPermission().then(function() {
            e.getToken().then(function(e) {
                firebaseInitializeListeners(e)
            }).catch(function(e) {
                console.log("An error occurred while retrieving token. ", e)
            }), e.onTokenRefresh(function() {
                var t = this;
                e.getToken().then(function(e) {
                    t.initializeListeners(e)
                }).catch(function(e) {
                    console.log("Unable to retrieve refreshed token ", e)
                })
            }), e.onMessage(function(e) {
                window.GLEngineModule.processPushNotification(wh(JSON.stringify(e)), !0)
            })
        }).catch(function(e) {
            window.GLEngineModule.registerPushNotificationToken("")
        })
    }, bh.prototype.initialize = function(e) {
        var t = this;
        try {
            if (this.checkPermissions() < 0 || 0 == e && 1 !== this.checkPermissions()) return;
            if ("serviceWorker" in navigator) {
                var n = Iu.workers.prod,
                    r = Iu.firebase.prod;
                self.location.hostname.startsWith("int.") && (Iu.workers.int && (n = Iu.workers.int), Iu.firebase.int && (r = Iu.firebase.int)), this.firebaseInitialized || (this.firebaseInitialized = !0, this.app = zd.initializeApp(r));
                var i = zd.messaging();
                this.firebaseRegistration ? this.requestPermission(i) : (this.firebaseRegistration = !0, navigator.serviceWorker.register(self.location.origin + n).then(function(e) {
                    i.useServiceWorker(e), t.requestPermission(i)
                }).catch(function(e) {
                    this.requestPermission(i), console.log("Service worker registration failed. ", e)
                }))
            }
        } catch (e) {
            console.log("Firebase initialization failed.")
        }
    };
    var xh = function() {};

    function Th(e) {
        return null == e
    }
    xh.prototype.CreateMediaPlayer = function(e, t, n) {
        var r = this,
            i = {};
        i.video = document.createElement("video"), i.texture = null, n && console.warn("Creating player for " + e), i.video.crossOrigin = "anonymous", i.video.onerror = function() {
            if (!Th(i.video)) {
                var e = "",
                    o = i.video.error;
                switch (o.code) {
                    case MediaError.MEDIA_ERR_ABORTED:
                        e += "The user canceled the media.";
                        break;
                    case MediaError.MEDIA_ERR_NETWORK:
                        e += "A network error occurred while fetching the media.";
                        break;
                    case MediaError.MEDIA_ERR_DECODE:
                        e += "An error occurred while decoding the media.";
                        break;
                    case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                        e += "The media is missing or is in a format not supported by your browser.";
                        break;
                    default:
                        e += "An unknown error occurred."
                }
                var a = o.message;
                a && a.length && (e += " " + a), n && console.error("Error " + o.code + ":" + e + " @ " + t), r.hasOwnProperty(t) && Module.MediaPlayer_StatusChanged(t, Module.MediaPlayerStatus.BadContainer)
            }
        };
        var o = function(e) {
            r.hasOwnProperty(t) && Module.MediaPlayer_StatusChanged(t, e)
        };
        i.video.addEventListener("play", function() {
            o(Module.MediaPlayerStatus.Playing)
        }), i.video.addEventListener("playing", function() {
            o(Module.MediaPlayerStatus.Playing)
        }), i.video.addEventListener("waiting", function() {
            o(Module.MediaPlayerStatus.Buffering)
        }), i.video.addEventListener("ended", function() {
            o(Module.MediaPlayerStatus.Stopped)
        }), i.video.addEventListener("pause", function() {
            o(Module.MediaPlayerStatus.Paused)
        }), i.video.addEventListener("stalled", function() {
            o(Module.MediaPlayerStatus.BadContainer)
        }), i.video.addEventListener("canplay", function() {
            var e = r[t];
            Th(e) || (e.texture = GL.textures[Module.MediaPlayer_CreateTexture(t, e.video.videoWidth, e.video.videoHeight)], r.RenderFrame(t))
        }), i.video.src = e, this[t] = i
    }, xh.prototype.DestroyMediaPlayer = function(e) {
        this.hasOwnProperty(e) && (Th(this[e].video) || (this[e].video.pause(), this[e].video.src = "", delete this[e].video), this[e].texture = null, delete this[e])
    }, xh.prototype.RenderFrame = function(e) {
        var t = this[e];
        if (!Th(t) && null != t.texture) {
            var n = GLctx.getParameter(GLctx.TEXTURE_BINDING_2D);
            GLctx.bindTexture(GLctx.TEXTURE_2D, t.texture);
            var r = GLctx.getParameter(GLctx.UNPACK_ALIGNMENT);
            GLctx.pixelStorei(GLctx.UNPACK_ALIGNMENT, 1), ks === Es.Safari ? GLctx.texSubImage2D(GLctx.TEXTURE_2D, 0, 0, 0, GLctx.RGB, Module.ctx.UNSIGNED_BYTE, t.video) : GLctx.texImage2D(GLctx.TEXTURE_2D, 0, GLctx.RGB, GLctx.RGB, Module.ctx.UNSIGNED_BYTE, t.video), GLctx.pixelStorei(GLctx.UNPACK_ALIGNMENT, r), GLctx.bindTexture(GLctx.TEXTURE_2D, n)
        }
    }, xh.prototype.SeekTo = function(e, t) {
        var n = this[e];
        return Th(n) || !n.video.seekable ? 0 : (n.video.currentTime = t, 1)
    };
    var Sh = new ed,
        Eh = window.resV,
        Ah = window.devicePixelRatio || 1,
        Ch = {
            doNotCaptureKeybord: !0,
            noExitRuntime: !0,
            locateFile: function(e) {
                var t = Iu.resourceHost + "/" + e + "?v=" + Eh;
                return console.warn(e + " -> " + t), t
            },
            preRun: [],
            postRun: [function() {
                var e = Ch.getHostVersion();
                Ch.ModuleVersion = e, console.warn(Iu.title + " " + e)
            }],
            totalProgress: 14,
            baseTitle: document.title,
            notificationDeals: [],
            initializingTime: 0,
            startTime: new Date,
            downloadingTime: 0,
            countOfDisconnects: 0,
            currentPixelRatio: 0,
            isMac: 0,
            runtimeReady: !1,
            canvas: null,
            currentLoadImg: {},
            progress: 0,
            currentPermission: "default",
            windowFocus: 1,
            logBuffer: td(32),
            imgs: {},
            images: {},
            sounds: {},
            JSWebSockets: {},
            Screenshot: new rd,
            XHRRequests: new id,
            WebCameras: new ad,
            pushes: new bh,
            MediaPlayers: new xh,
            jsAlignCanvas: function() {
                var e = window.devicePixelRatio || 1,
                    t = Qf("#glcanvas").parent();
                Ch.canvas.width = t.innerWidth() * e, Ch.canvas.height = t.innerHeight() * e, Ah = e;
                var n = Ch.ctx || null;
                null != n && n.drawingBufferWidth > 0 && n.drawingBufferHeight > 0 && (t.innerWidth() * e > n.drawingBufferWidth && (Ah = n.drawingBufferWidth / t.innerWidth()), t.innerHeight() * e > n.drawingBufferHeight && (Ah = Math.min(n.drawingBufferHeight / t.innerHeight(), Ah))), Ch.canvas.width = t.innerWidth() * Ah, Ch.canvas.height = t.innerHeight() * Ah, Ch.canvas.style.width = t.innerWidth() + "px", Ch.canvas.style.height = t.innerHeight() + "px"
            },
            checkPixelRatio: function() {
                var e = window.devicePixelRatio || 1;
                Ch.currentPixelRatio !== e && (Ch.currentPixelRatio = e, Ch.jsResizeWebGlView())
            },
            selfHostname: function() {
                return self.location.hostname
            },
            selfHostnameLength: function() {
                return lengthBytesUTF8(self.location.hostname)
            },
            printErr: function() {
                console.warn("error:", arguments)
            },
            playSound: function(e) {
                var t = Ch.sounds[e];
                t && (t.isPlaying() || t.play())
            },
            stopSound: function() {
                for (var e in Ch.sounds) Ch.sounds[e].stop()
            },
            openLink: function(e) {
                var t = new RegExp(location.origin + "(:[0-9]+)?", "ig");
                e = e.replace(t, ""), location.href = e
            },
            openLinkEx: function(e, t, n) {
                var r = new RegExp(location.origin + "(:[0-9]+)?", "ig");
                if (e = e.replace(r, ""), Cs === Ss.IOS) location.href = e;
                else if (n) {
                    var i = window.open(e, t, n);
                    isNullOrUndefined(i) || i.focus()
                } else window.open(e, t, "noopener,menubar=yes,scrollbars=yes,status=yes,toolbar=yes")
            },
            showKeyboard: function() {
                console.error("showKeyboard")
            },
            setCanvasCursor: function(e) {
                if ("grab" === e || "grabbing" === e) {
                    var t = navigator.userAgent.toLowerCase(); - 1 === t.indexOf("chrome") && -1 === t.indexOf("safari") || (e = "-webkit-" + e)
                }
                Qf("#glcanvas").css("cursor", e)
            },
            setBackgroundColor: function(e) {
                document.body.style.backgroundColor = e
            },
            resetSetTimeout: function() {
                console.log("resetSetTimeout")
            },
            setTotalProgress: function(e) {
                Ch.totalProgress = 1 * e
            },
            preloadImage: function(e, t) {
                /.*\.(png|jpg|jpeg)$/.test(e) || (e += ".png"), Ch.imgs[e] = new Image, (/http/.test(e) || /https/.test(e)) && (imgs[e].crossOrigin = "Anonymous"), Ch.imgs[e].onload = t, Ch.imgs[e].src = e
            }
        };
    Ch.ImageLoader_Load = function(e, t, n, r, i, o) {
        Ch.imgs[i] = new Image, Ch.imgs[i].crossOrigin = "anonymous";
        var a = Ch.imgs[i];
        Ch.imgs[i].onload = function() {
            if (0 != n || 0 != r) {
                var e = a.width,
                    s = a.height;
                if (function(e, t, n, r, i) {
                        if (i == kh.None) return !0;
                        if (i & kh.PreventUpsampling && (!n && t < r || !r && e < n || n && r && (t < r || e < n))) return !1;
                        if (i & kh.PreventDownsampling && (!n && t > r || !r && e > n || n && r && (t > r || e > n))) return !1;
                        return !0
                    }(e, s, n, r, o) && n != e && r != s) {
                    0 == r ? 0 != e && (r = Math.max(1, s * n / e)) : 0 == n && 0 != s && (n = Math.max(1, e * r / s));
                    var c = document.createElement("canvas");
                    c.width = n, c.height = r, c.getContext("2d").drawImage(a, 0, 0, n, r), Ch.imgs[i] = c, Ch.imgs[i].naturalWidth = c.width, Ch.imgs[i].naturalHeight = c.height, Ch.imgs[i].src = a.src, Ch.imgs[i].complete = a.complete, Ch.imgs[i].failed = !1
                }
            }
            Ch.ImageLoader_Loaded(t)
        }, Ch.imgs[i].onerror = function() {
            var n, r, o;
            console.error("Failed to load image from " + e), n = e, r = function(e) {
                e ? Ch.imgs[i] = void 0 : Ch.imgs[i].failed = !0, Ch.ImageLoader_Failed(t, e)
            }, (o = new XMLHttpRequest).open("HEAD", n, !0), o.onreadystatechange = function() {
                o.readyState === this.DONE && r(404 !== o.status)
            }, o.send()
        }, Ch.imgs[i].src = e
    }, Ch.callJsWithCallback = function(e, t) {
        e(function() {
            Ch.executeCallback(t)
        })
    }, Ch.setCurrentLoadImg = function(e) {
        /.*\.(png|jpg|jpeg)$/.test(e) || (e += ".png"), Ch.currentLoadImg = Ch.imgs[e] || {}
    }, Ch.getImageWidth = function(e) {
        return Ch.currentLoadImg.naturalWidth || 0
    }, Ch.getImageHeight = function(e) {
        return Ch.currentLoadImg.naturalHeight || 0
    }, Ch.isFullscreen = function() {
        return sd.isFullscreen ? 1 : 0
    }, Ch.switchFullscreen = function(e) {
        return sd.enabled ? (e != sd.isFullscreen && sd.toggle(document.body), 1) : 0
    }, Ch.createTexture = function() {
        var e = Ch.currentLoadImg;
        if (e.crossOrigin) {
            for (var t, n, r = 2;
                (t = r) < e.naturalWidth;) r *= 2;
            for (r = 2;
                (n = r) < e.naturalHeight;) r *= 2;
            if (t != e.naturalWidth || n != e.naturalHeight) {
                var i = document.createElement("canvas");
                i.width = t, i.height = n;
                var o = i.getContext("2d");
                o.clearRect(0, 0, i.width, i.height), o.drawImage(e, 0, 0), Ch.ctx.texImage2D(Ch.ctx.TEXTURE_2D, 0, Ch.ctx.RGBA, Ch.ctx.RGBA, Ch.ctx.UNSIGNED_BYTE, i)
            } else Ch.ctx.texImage2D(Ch.ctx.TEXTURE_2D, 0, Ch.ctx.RGBA, Ch.ctx.RGBA, Ch.ctx.UNSIGNED_BYTE, e)
        }
    }, Ch.createSubTexture = function(e, t) {
        for (var n, r, i = Ch.currentLoadImg, o = 2;
            (n = o) < i.naturalWidth;) o *= 2;
        for (o = 2;
            (r = o) < i.naturalHeight;) o *= 2;
        if (n != i.naturalWidth || r != i.naturalHeight) {
            var a = document.createElement("canvas");
            a.width = n, a.height = r;
            var s = a.getContext("2d");
            s.clearRect(0, 0, a.width, a.height), s.drawImage(i, 0, 0), Ch.ctx.texSubImage2D(Ch.ctx.TEXTURE_2D, 0, e, t, Ch.ctx.RGBA, Ch.ctx.UNSIGNED_BYTE, a)
        } else Ch.ctx.texSubImage2D(Ch.ctx.TEXTURE_2D, 0, e, t, Ch.ctx.RGBA, Ch.ctx.UNSIGNED_BYTE, i)
    }, Ch.showNotification = function(e, t, n, r) {
        if ("Notification" in window && "denied" != Notification.permission.toLowerCase()) {
            Notification.requestPermission(function(e) {
                Ch.currentPermission = e
            });
            try {
                new Notification(e, {
                    tag: r,
                    body: t,
                    icon: "https://" + Ch.currentHost + "/traderoom/logo.png"
                })
            } catch (e) {
                "TypeError" === e.name && console.log("Pushes unsupported.")
            }
        }
    }, Ch.isWindowFocused = function() {
        return Ch.windowFocus
    }, Ch.jsFirstPreloadIsCompleted = function() {
        console.warn("preload is completed"), Ch.initGLContext(Ch.canvas.width, Ch.canvas.height, Ah), Ch.setLoadProgress(), Ch.setupMainLoop()
    }, Ch.jsResizeWebGlView = function() {
        Ch.jsAlignCanvas(), Ch.initGLContext(Ch.canvas.width, Ch.canvas.height, Ah)
    }, Ch.textCanvas = document.createElement("canvas"), Ch.textContext = Ch.textCanvas.getContext("2d"), Ch.getTextMetrics = function(e, t, n, r, i, o) {
        var a = Sh.textHeight(e, t);
        Ch.setValue(n, a.height, "float"), Ch.setValue(r, a.ascent, "float"), Ch.setValue(i, a.descent, "float"), Ch.setValue(o, 0, "float")
    }, Ch.getCharWidth = function(e, t, n) {
        var r = Ch.textCanvas,
            i = Ch.textContext,
            o = String.fromCharCode(n);
        return r.width = 2 * t, r.height = 2 * t, i.font = Sh.cssString(e, t), i.measureText(o).width
    }, Ch.getKerning = function(e, t, n, r) {
        var i = Ch.textCanvas,
            o = Ch.textContext;
        i.width = 2 * t, i.height = 2 * t;
        var a = String.fromCharCode(n),
            s = String.fromCharCode(r);
        return o.font = Sh.cssString(e, t), o.measureText(a + s).width - o.measureText(a).width - o.measureText(s).width
    }, Ch.getChar = function(e, t, n, r, i, o, a, s, c) {
        var u = Ch.textCanvas,
            l = Ch.textContext,
            f = String.fromCharCode(n);
        u.width = o, u.height = a, l.clearRect(0, 0, u.width, u.height);
        var d = Sh.cssString(e, t);
        l.font = d, l.textAlign = "left", l.fillStyle = "black", l.textBaseline = "baseline", l.scale(2, 2), l.fillText(f, 0, s);
        var h = l.getImageData(0, 0, o, a).data;
        Ch.writeArrayToMemory(h, c)
    }, Ch.getChar = function(e, t, n, r, i, o, a, s, c) {
        var u = Ch.textCanvas,
            l = Ch.textContext,
            f = String.fromCharCode(n);
        u.width = o, u.height = a, l.clearRect(0, 0, u.width, u.height);
        var d = Sh.cssString(e, t);
        l.font = d, l.textAlign = "left", l.fillStyle = "black", l.textBaseline = "baseline", l.scale(2, 2), l.fillText(f, 0, s);
        var h = l.getImageData(0, 0, o, a).data;
        Ch.writeArrayToMemory(h, c)
    }, Ch.dumpCurrentTexture = function(e, t) {
        var n = Ch.ctx,
            r = n.getParameter(n.FRAMEBUFFER_BINDING),
            i = n.createFramebuffer();
        n.bindFramebuffer(n.FRAMEBUFFER, i);
        var o = n.getParameter(n.TEXTURE_BINDING_2D);
        if (n.framebufferTexture2D(n.FRAMEBUFFER, n.COLOR_ATTACHMENT0, n.TEXTURE_2D, o, 0), n.checkFramebufferStatus(n.FRAMEBUFFER) == n.FRAMEBUFFER_COMPLETE) {
            var a = new Uint8Array(e * t * 4);
            n.readPixels(0, 0, e, t, n.RGBA, n.UNSIGNED_BYTE, a);
            var s = document.createElement("canvas");
            s.width = e, s.height = t;
            for (var c = Ch.textCanvas.getContext("2d"), u = c.createImageData(s.width, s.height), l = 0; l < e * t * 4; ++l) u.data[l] = a[l];
            return c.putImageData(u, 0, 0), n.bindFramebuffer(n.FRAMEBUFFER, r), Ch.dumpCanvas = s, s.toDataURL()
        }
        n.bindFramebuffer(n.FRAMEBUFFER, r)
    }, Ch.images.loadImage = Ch.preloadImage, Ch.images.exists = function(e) {
        return void 0 !== Ch.imgs[e]
    }, Ch.images.isLoaded = function(e) {
        var t = Ch.imgs[e];
        return void 0 !== t && t.complete && !0 !== t.failed
    }, Ch.images.getImageWidth = function(e) {
        var t = Ch.imgs[e];
        return void 0 !== t && t.complete ? t.naturalWidth : 0
    }, Ch.images.getImageHeight = function(e) {
        var t = Ch.imgs[e];
        return void 0 !== t && t.complete ? t.naturalHeight : 0
    }, Ch.images.updateBoundTexture = function(e, t, n, r) {
        var i = Ch.imgs[t];
        if (void 0 === i || !i.complete) return !1;
        var o = GLctx.getParameter(GLctx.TEXTURE_BINDING_2D);
        GLctx.bindTexture(GLctx.TEXTURE_2D, GL.textures[e]);
        var a = GLctx.getParameter(GLctx.UNPACK_ALIGNMENT);
        return GLctx.pixelStorei(GLctx.UNPACK_ALIGNMENT, 1), GLctx.texSubImage2D(GLctx.TEXTURE_2D, 0, n, r, Ch.ctx.RGBA, Ch.ctx.UNSIGNED_BYTE, i), GLctx.pixelStorei(GLctx.UNPACK_ALIGNMENT, a), GLctx.bindTexture(GLctx.TEXTURE_2D, o), !0
    }, Ch.makeScreenshot = function(e, t, n, r) {
        Ch.Screenshot.makeScreenshot(e, t, n, r)
    }, Ch.UpdateCookie = function(e, t, n, r, i) {
        var o = Mu.get(e);
        return (!o || o != t) && Mu.set(e, t, {
            expires: 0 == i.length ? void 0 : new Date(i),
            path: 0 == n.length ? void 0 : n,
            domain: 0 == r.length ? void 0 : r
        })
    }, Ch.RemoveCookie = function(e, t, n) {
        return Mu.remove(e, {
            path: 0 === t.length ? void 0 : t,
            domain: 0 === n.length ? void 0 : n
        })
    }, Ch.GetCookie = function(e) {
        return Mu.get(e)
    }, Ch.setClipboard = function(e) {
        document.removeEventListener("copy", Lh, !0), document.addEventListener("copy", function t(n) {
            n.clipboardData.setData("text/plain", e), n.stopPropagation(), n.preventDefault(), document.removeEventListener("copy", t, !0), document.addEventListener("copy", Lh, !0)
        }, !0);
        var t = document.createElement("input");
        t.width = 0, t.height = 0, t.value = "data", document.body.appendChild(t), t.select(), t.focus(), document.execCommand("copy"), t.remove(), Ch.canvas.focus()
    }, Ch.ga = function(e, t, n, r) {
        window.ga && (window.ga("send", "event", e, t, n), window.ga("tracker.send", "event", e, t, n))
    }, Ch.gaSetUser = function(e) {
        window.ga && (window.ga("set", "userId", e), window.ga("tracker.set", "userId", e))
    }, Ch.isIOS = function() {
        return Cs === Ss.IOS
    }, Ch.loadScript = function(e) {
        Qf.getScript(e)
    }, Ch.setTitleNotificationMsg = function(e, t) {
        !Ch.windowFocus && e && (document.title = "(" + e + ") " + t + " - " + Ch.baseTitle)
    }, Ch.setTitleNotificationDeals = function(e, t) {
        Ch.windowFocus || -1 == Ch.notificationDeals.indexOf(e) && (Ch.notificationDeals.push(e), document.title = "(" + Ch.notificationDeals.length + ") " + t + " - " + Ch.baseTitle)
    };
    var kh = {
        None: 0,
        PreventUpsampling: 1,
        PreventDownsampling: 2
    };

    function Lh(e) {
        e.clipboardData.setData("text/plain", unescape(Ch.copyToClipboard())), e.stopPropagation(), e.preventDefault()
    }

    function _h(e) {
        var t, n, r, i, o, a, s, c, u, l, f, d, h, p;
        return {
            c: function() {
                t = xo("a"), n = xo("img"), i = Eo(), o = xo("img"), s = Eo(), c = xo("img"), l = Eo(), f = xo("div"), d = xo("div"), h = Eo(), p = xo("div"), n.src !== (r = Iu.resourceHost + "/traderoom/windows.svg") && Co(n, "src", r), Co(n, "width", "32px"), Co(n, "class", "crash-img-app svelte-1bimup9"), Co(n, "alt", ""), o.src !== (a = Iu.resourceHost + "/traderoom/ios.svg") && Co(o, "src", a), Co(o, "width", "32px"), Co(o, "class", "crash-img-app svelte-1bimup9"), Co(o, "alt", ""), c.src !== (u = Iu.resourceHost + "/traderoom/linux.svg") && Co(c, "src", u), Co(c, "width", "32px"), Co(c, "class", "crash-img-app svelte-1bimup9"), Co(c, "alt", ""), Co(d, "id", "crash_desktop_app"), Co(d, "class", "crash-download-text-title svelte-1bimup9"), Co(p, "id", "crash_desktop_info"), Co(p, "class", "crash-download-text-descr svelte-1bimup9"), Co(f, "class", "crash-download-text svelte-1bimup9"), Co(t, "id", "desktop_download"), Co(t, "class", "crash-download svelte-1bimup9"), Co(t, "href", e[5])
            },
            m: function(r, a) {
                bo(r, t, a), yo(t, n), yo(t, i), yo(t, o), yo(t, s), yo(t, c), yo(t, l), yo(t, f), yo(f, d), d.innerHTML = e[3], yo(f, h), yo(f, p), p.innerHTML = e[4]
            },
            p: function(e, n) {
                8 & n && (d.innerHTML = e[3]), 16 & n && (p.innerHTML = e[4]), 32 & n && Co(t, "href", e[5])
            },
            d: function(e) {
                e && wo(t)
            }
        }
    }

    function Oh(e) {
        var t, n, r, i, o, a, s, c;
        return {
            c: function() {
                t = xo("a"), n = xo("img"), i = Eo(), o = xo("div"), a = xo("div"), s = Eo(), c = xo("div"), n.src !== (r = Iu.resourceHost + "/traderoom/android.png") && Co(n, "src", r), Co(n, "width", "40px"), Co(n, "class", "crash-img-app svelte-1bimup9"), Co(n, "alt", ""), Co(a, "id", "crash_android_app"), Co(a, "class", "crash-download-text-title svelte-1bimup9"), Co(c, "id", "crash_android_info"), Co(c, "class", "crash-download-text-descr svelte-1bimup9"), Co(o, "class", "crash-download-text svelte-1bimup9"), Co(t, "id", "android_download"), Co(t, "class", "crash-download svelte-1bimup9"), Co(t, "href", e[5])
            },
            m: function(r, u) {
                bo(r, t, u), yo(t, n), yo(t, i), yo(t, o), yo(o, a), a.innerHTML = e[3], yo(o, s), yo(o, c), c.innerHTML = e[4]
            },
            p: function(e, n) {
                8 & n && (a.innerHTML = e[3]), 16 & n && (c.innerHTML = e[4]), 32 & n && Co(t, "href", e[5])
            },
            d: function(e) {
                e && wo(t)
            }
        }
    }

    function Dh(e) {
        var t, n, r, i, o, a, s, c;
        return {
            c: function() {
                t = xo("a"), n = xo("img"), i = Eo(), o = xo("div"), a = xo("div"), s = Eo(), c = xo("div"), n.src !== (r = Iu.resourceHost + "/traderoom/ios.svg") && Co(n, "src", r), Co(n, "width", "35px"), Co(n, "class", "crash-img-app svelte-1bimup9"), Co(n, "alt", ""), Co(a, "id", "crash_ios_app_horizontal"), Co(a, "class", "crash-download-text-title svelte-1bimup9"), Co(c, "id", "crash_ios_info_horizontal"), Co(c, "class", "crash-download-text-descr svelte-1bimup9"), Co(o, "class", "crash-download-text svelte-1bimup9"), Co(t, "id", "ios_download"), Co(t, "class", "crash-download svelte-1bimup9"), Co(t, "href", e[5])
            },
            m: function(r, u) {
                bo(r, t, u), yo(t, n), yo(t, i), yo(t, o), yo(o, a), a.innerHTML = e[3], yo(o, s), yo(o, c), c.innerHTML = e[4]
            },
            p: function(e, n) {
                8 & n && (a.innerHTML = e[3]), 16 & n && (c.innerHTML = e[4]), 32 & n && Co(t, "href", e[5])
            },
            d: function(e) {
                e && wo(t)
            }
        }
    }

    function Ph(e) {
        var t, n, r, i, o, a, s, c, u, l, f, d, h, p, g, v, m, y, b;
        var w = (Cs === Ss.IOS ? Dh : Cs === Ss.Android ? Oh : _h)(e);
        return {
            c: function() {
                t = xo("div"), n = xo("div"), r = xo("div"), i = xo("div"), o = xo("img"), s = Eo(), c = xo("br"), u = Eo(), l = xo("div"), f = xo("div"), d = Eo(), h = xo("div"), p = Eo(), g = xo("br"), v = Eo(), m = xo("div"), y = xo("a"), b = Eo(), w.c(), o.src !== (a = Iu.resourceHost + "/traderoom/appcrash.svg") && Co(o, "src", a), Co(o, "alt", ""), Co(o, "id", "crash-img-block-src"), Co(o, "class", "svelte-1bimup9"), Co(i, "class", "crash-img-block svelte-1bimup9"), Co(c, "class", "shadowItem svelte-1bimup9"), Co(f, "id", "crash_title"), Co(f, "class", "crash-header svelte-1bimup9"), Co(h, "id", "crash_maininfo"), Co(h, "class", "crash-info svelte-1bimup9"), Co(l, "class", "crash-info-block svelte-1bimup9"), Co(g, "class", "shadowItem svelte-1bimup9"), Co(y, "id", "crash_support"), Co(y, "href", Iu.contactUrl), Co(y, "class", "crash-support-link svelte-1bimup9"), Co(m, "class", "crash-apps-container svelte-1bimup9"), Co(r, "class", "crash-center-block-item svelte-1bimup9"), Co(n, "class", "crash-center-block svelte-1bimup9"), Co(t, "id", "crashblock"), Co(t, "class", "crash-block svelte-1bimup9")
            },
            m: function(a, x) {
                bo(a, t, x), yo(t, n), yo(n, r), yo(r, i), yo(i, o), yo(r, s), yo(r, c), yo(r, u), yo(r, l), yo(l, f), f.innerHTML = e[0], yo(l, d), yo(l, h), h.innerHTML = e[1], yo(r, p), yo(r, g), yo(r, v), yo(r, m), yo(m, y), y.innerHTML = e[2], yo(m, b), w.m(m, null)
            },
            p: function(e, t) {
                var n = t[0];
                1 & n && (f.innerHTML = e[0]), 2 & n && (h.innerHTML = e[1]), 4 & n && (y.innerHTML = e[2]), w.p(e, n)
            },
            i: fo,
            o: fo,
            d: function(e) {
                e && wo(t), w.d()
            }
        }
    }

    function Rh(e, t, n) {
        var r = "You Need to Restart Browser",
            i = "The most common problem associated with the opening of our trading platform is the possible lack of memory on your device. If this happens, restart your browser to fix the issue.<br><br>Close your browser by removing it from the recent applications and open IQ Option again.",
            o = "CONTACT SUPPORT",
            a = "DOWNLOAD",
            s = "Crypto, Forex, Digital<br>and Binary Options",
            c = "/",
            u = window.location.hostname;
        switch (u.startsWith("eu.") && (u = u.substr(3)), Cs) {
            case Ss.Mac:
            case Ss.Windows:
                n(5, c = "https://" + u + "/download");
                break;
            case Ss.Android:
                n(5, c = Iu.androidAppLink);
                break;
            case Ss.IOS:
                n(5, c = Iu.iosAppLink)
        }
        var l = Mu.get("lang");
        l = l && l.length > 2 ? l.substr(0, 2) : "en";
        var f = Iu.resourceHost + "crashlocalisation.json";
        return fetch(f).then(function(e) {
            return e.json()
        }).then(function(e) {
            switch (Ru.debug && (l = Ru.lang), void 0 === e[l] && (console.warn("Unsupported language: ", l), l = "en"), n(0, r = e[l].title), n(1, i = e[l].maininfo), n(2, o = e[l].support), Cs) {
                case Ss.Mac:
                case Ss.Windows:
                    n(3, a = e[l].desktop_.app), n(4, s = e[l].desktop_.info);
                    break;
                case Ss.Android:
                    n(3, a = e[l].android_.app), n(4, s = e[l].android_.info);
                    break;
                case Ss.IOS:
                    n(3, a = e[l].ios_.app), n(4, s = e[l].ios_.info)
            }
        }).catch(function(e) {
            console.log(e)
        }), [r, i, o, a, s, c]
    }
    var Ih = function(e) {
            function t(t) {
                e.call(this), Zo(this, t, Rh, Ph, mo, {})
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
        }(Qo),
        Mh = "".endsWith,
        Nh = Math.min;
    Oe({
        target: "String",
        proto: !0,
        forced: !mr("endsWith")
    }, {
        endsWith: function(e) {
            var t = String(w(this));
            gr(e);
            var n = arguments.length > 1 ? arguments[1] : void 0,
                r = ce(t.length),
                i = void 0 === n ? r : Nh(ce(n), r),
                o = String(e);
            return Mh ? Mh.call(t, o, i) : t.slice(i - o.length, i) === o
        }
    });
    var Bh = df.left;
    Oe({
        target: "Array",
        proto: !0,
        forced: ze("reduce")
    }, {
        reduce: function(e) {
            return Bh(this, e, arguments.length, arguments.length > 1 ? arguments[1] : void 0)
        }
    }), Sl("Float32", 4, function(e) {
        return function(t, n, r) {
            return e(this, t, n, r)
        }
    });
    var jh = n(function(t) {
            var n, r;
            n = e, r = function() {
                var e = function(e, t) {
                        e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
                        var n = [0, 0, 0, 0];
                        return n[3] += e[3] + t[3], n[2] += n[3] >>> 16, n[3] &= 65535, n[2] += e[2] + t[2], n[1] += n[2] >>> 16, n[2] &= 65535, n[1] += e[1] + t[1], n[0] += n[1] >>> 16, n[1] &= 65535, n[0] += e[0] + t[0], n[0] &= 65535, [n[0] << 16 | n[1], n[2] << 16 | n[3]]
                    },
                    t = function(e, t) {
                        e = [e[0] >>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>> 16, 65535 & t[1]];
                        var n = [0, 0, 0, 0];
                        return n[3] += e[3] * t[3], n[2] += n[3] >>> 16, n[3] &= 65535, n[2] += e[2] * t[3], n[1] += n[2] >>> 16, n[2] &= 65535, n[2] += e[3] * t[2], n[1] += n[2] >>> 16, n[2] &= 65535, n[1] += e[1] * t[3], n[0] += n[1] >>> 16, n[1] &= 65535, n[1] += e[2] * t[2], n[0] += n[1] >>> 16, n[1] &= 65535, n[1] += e[3] * t[1], n[0] += n[1] >>> 16, n[1] &= 65535, n[0] += e[0] * t[3] + e[1] * t[2] + e[2] * t[1] + e[3] * t[0], n[0] &= 65535, [n[0] << 16 | n[1], n[2] << 16 | n[3]]
                    },
                    n = function(e, t) {
                        return 32 === (t %= 64) ? [e[1], e[0]] : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t | e[0] >>> 32 - t] : (t -= 32, [e[1] << t | e[0] >>> 32 - t, e[0] << t | e[1] >>> 32 - t])
                    },
                    r = function(e, t) {
                        return 0 === (t %= 64) ? e : t < 32 ? [e[0] << t | e[1] >>> 32 - t, e[1] << t] : [e[1] << t - 32, 0]
                    },
                    i = function(e, t) {
                        return [e[0] ^ t[0], e[1] ^ t[1]]
                    },
                    o = function(e) {
                        return e = i(e, [0, e[0] >>> 1]), e = t(e, [4283543511, 3981806797]), e = i(e, [0, e[0] >>> 1]), e = t(e, [3301882366, 444984403]), e = i(e, [0, e[0] >>> 1])
                    },
                    a = function(a, s) {
                        s = s || 0;
                        for (var c = (a = a || "").length % 16, u = a.length - c, l = [0, s], f = [0, s], d = [0, 0], h = [0, 0], p = [2277735313, 289559509], g = [1291169091, 658871167], v = 0; v < u; v += 16) d = [255 & a.charCodeAt(v + 4) | (255 & a.charCodeAt(v + 5)) << 8 | (255 & a.charCodeAt(v + 6)) << 16 | (255 & a.charCodeAt(v + 7)) << 24, 255 & a.charCodeAt(v) | (255 & a.charCodeAt(v + 1)) << 8 | (255 & a.charCodeAt(v + 2)) << 16 | (255 & a.charCodeAt(v + 3)) << 24], h = [255 & a.charCodeAt(v + 12) | (255 & a.charCodeAt(v + 13)) << 8 | (255 & a.charCodeAt(v + 14)) << 16 | (255 & a.charCodeAt(v + 15)) << 24, 255 & a.charCodeAt(v + 8) | (255 & a.charCodeAt(v + 9)) << 8 | (255 & a.charCodeAt(v + 10)) << 16 | (255 & a.charCodeAt(v + 11)) << 24], d = t(d, p), d = n(d, 31), d = t(d, g), l = i(l, d), l = n(l, 27), l = e(l, f), l = e(t(l, [0, 5]), [0, 1390208809]), h = t(h, g), h = n(h, 33), h = t(h, p), f = i(f, h), f = n(f, 31), f = e(f, l), f = e(t(f, [0, 5]), [0, 944331445]);
                        switch (d = [0, 0], h = [0, 0], c) {
                            case 15:
                                h = i(h, r([0, a.charCodeAt(v + 14)], 48));
                            case 14:
                                h = i(h, r([0, a.charCodeAt(v + 13)], 40));
                            case 13:
                                h = i(h, r([0, a.charCodeAt(v + 12)], 32));
                            case 12:
                                h = i(h, r([0, a.charCodeAt(v + 11)], 24));
                            case 11:
                                h = i(h, r([0, a.charCodeAt(v + 10)], 16));
                            case 10:
                                h = i(h, r([0, a.charCodeAt(v + 9)], 8));
                            case 9:
                                h = i(h, [0, a.charCodeAt(v + 8)]), h = t(h, g), h = n(h, 33), h = t(h, p), f = i(f, h);
                            case 8:
                                d = i(d, r([0, a.charCodeAt(v + 7)], 56));
                            case 7:
                                d = i(d, r([0, a.charCodeAt(v + 6)], 48));
                            case 6:
                                d = i(d, r([0, a.charCodeAt(v + 5)], 40));
                            case 5:
                                d = i(d, r([0, a.charCodeAt(v + 4)], 32));
                            case 4:
                                d = i(d, r([0, a.charCodeAt(v + 3)], 24));
                            case 3:
                                d = i(d, r([0, a.charCodeAt(v + 2)], 16));
                            case 2:
                                d = i(d, r([0, a.charCodeAt(v + 1)], 8));
                            case 1:
                                d = i(d, [0, a.charCodeAt(v)]), d = t(d, p), d = n(d, 31), d = t(d, g), l = i(l, d)
                        }
                        return l = i(l, [0, a.length]), f = i(f, [0, a.length]), l = e(l, f), f = e(f, l), l = o(l), f = o(f), l = e(l, f), f = e(f, l), ("00000000" + (l[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (l[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (f[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (f[1] >>> 0).toString(16)).slice(-8)
                    },
                    s = {
                        preprocessor: null,
                        audio: {
                            timeout: 1e3,
                            excludeIOS11: !0
                        },
                        fonts: {
                            swfContainerId: "fingerprintjs2",
                            swfPath: "flash/compiled/FontList.swf",
                            userDefinedFonts: [],
                            extendedJsFonts: !1
                        },
                        screen: {
                            detectScreenOrientation: !0
                        },
                        plugins: {
                            sortPluginsFor: [/palemoon/i],
                            excludeIE: !1
                        },
                        extraComponents: [],
                        excludes: {
                            enumerateDevices: !0,
                            pixelRatio: !0,
                            doNotTrack: !0,
                            fontsFlash: !0
                        },
                        NOT_AVAILABLE: "not available",
                        ERROR: "error",
                        EXCLUDED: "excluded"
                    },
                    c = function(e, t) {
                        if (Array.prototype.forEach && e.forEach === Array.prototype.forEach) e.forEach(t);
                        else if (e.length === +e.length)
                            for (var n = 0, r = e.length; n < r; n++) t(e[n], n, e);
                        else
                            for (var i in e) e.hasOwnProperty(i) && t(e[i], i, e)
                    },
                    u = function(e, t) {
                        var n = [];
                        return null == e ? n : Array.prototype.map && e.map === Array.prototype.map ? e.map(t) : (c(e, function(e, r, i) {
                            n.push(t(e, r, i))
                        }), n)
                    },
                    l = function() {
                        return navigator.mediaDevices && navigator.mediaDevices.enumerateDevices
                    },
                    f = function(e) {
                        var t = [window.screen.width, window.screen.height];
                        return e.screen.detectScreenOrientation && t.sort().reverse(), t
                    },
                    d = function(e) {
                        if (window.screen.availWidth && window.screen.availHeight) {
                            var t = [window.screen.availHeight, window.screen.availWidth];
                            return e.screen.detectScreenOrientation && t.sort().reverse(), t
                        }
                        return e.NOT_AVAILABLE
                    },
                    h = function(e) {
                        if (null == navigator.plugins) return e.NOT_AVAILABLE;
                        for (var t = [], n = 0, r = navigator.plugins.length; n < r; n++) navigator.plugins[n] && t.push(navigator.plugins[n]);
                        return g(e) && (t = t.sort(function(e, t) {
                            return e.name > t.name ? 1 : e.name < t.name ? -1 : 0
                        })), u(t, function(e) {
                            var t = u(e, function(e) {
                                return [e.type, e.suffixes]
                            });
                            return [e.name, e.description, t]
                        })
                    },
                    p = function(e) {
                        var t = [];
                        if (Object.getOwnPropertyDescriptor && Object.getOwnPropertyDescriptor(window, "ActiveXObject") || "ActiveXObject" in window) {
                            t = u(["AcroPDF.PDF", "Adodb.Stream", "AgControl.AgControl", "DevalVRXCtrl.DevalVRXCtrl.1", "MacromediaFlashPaper.MacromediaFlashPaper", "Msxml2.DOMDocument", "Msxml2.XMLHTTP", "PDF.PdfCtrl", "QuickTime.QuickTime", "QuickTimeCheckObject.QuickTimeCheck.1", "RealPlayer", "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)", "RealVideo.RealVideo(tm) ActiveX Control (32-bit)", "Scripting.Dictionary", "SWCtl.SWCtl", "Shell.UIHelper", "ShockwaveFlash.ShockwaveFlash", "Skype.Detection", "TDCCtl.TDCCtl", "WMPlayer.OCX", "rmocx.RealPlayer G2 Control", "rmocx.RealPlayer G2 Control.1"], function(t) {
                                try {
                                    return new window.ActiveXObject(t), t
                                } catch (t) {
                                    return e.ERROR
                                }
                            })
                        } else t.push(e.NOT_AVAILABLE);
                        return navigator.plugins && (t = t.concat(h(e))), t
                    },
                    g = function(e) {
                        for (var t = !1, n = 0, r = e.plugins.sortPluginsFor.length; n < r; n++) {
                            var i = e.plugins.sortPluginsFor[n];
                            if (navigator.userAgent.match(i)) {
                                t = !0;
                                break
                            }
                        }
                        return t
                    },
                    v = function(e) {
                        try {
                            return !!window.sessionStorage
                        } catch (t) {
                            return e.ERROR
                        }
                    },
                    m = function(e) {
                        try {
                            return !!window.localStorage
                        } catch (t) {
                            return e.ERROR
                        }
                    },
                    y = function(e) {
                        try {
                            return !!window.indexedDB
                        } catch (t) {
                            return e.ERROR
                        }
                    },
                    b = function(e) {
                        return navigator.hardwareConcurrency ? navigator.hardwareConcurrency : e.NOT_AVAILABLE
                    },
                    w = function(e) {
                        return navigator.cpuClass || e.NOT_AVAILABLE
                    },
                    x = function(e) {
                        return navigator.platform ? navigator.platform : e.NOT_AVAILABLE
                    },
                    T = function(e) {
                        return navigator.doNotTrack ? navigator.doNotTrack : navigator.msDoNotTrack ? navigator.msDoNotTrack : window.doNotTrack ? window.doNotTrack : e.NOT_AVAILABLE
                    },
                    S = function() {
                        var e, t = 0;
                        void 0 !== navigator.maxTouchPoints ? t = navigator.maxTouchPoints : void 0 !== navigator.msMaxTouchPoints && (t = navigator.msMaxTouchPoints);
                        try {
                            document.createEvent("TouchEvent"), e = !0
                        } catch (t) {
                            e = !1
                        }
                        return [t, e, "ontouchstart" in window]
                    },
                    E = function(e) {
                        var t = [],
                            n = document.createElement("canvas");
                        n.width = 2e3, n.height = 200, n.style.display = "inline";
                        var r = n.getContext("2d");
                        return r.rect(0, 0, 10, 10), r.rect(2, 2, 6, 6), t.push("canvas winding:" + (!1 === r.isPointInPath(5, 5, "evenodd") ? "yes" : "no")), r.textBaseline = "alphabetic", r.fillStyle = "#f60", r.fillRect(125, 1, 62, 20), r.fillStyle = "#069", e.dontUseFakeFontInCanvas ? r.font = "11pt Arial" : r.font = "11pt no-real-font-123", r.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15), r.fillStyle = "rgba(102, 204, 0, 0.2)", r.font = "18pt Arial", r.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4, 45), r.globalCompositeOperation = "multiply", r.fillStyle = "rgb(255,0,255)", r.beginPath(), r.arc(50, 50, 50, 0, 2 * Math.PI, !0), r.closePath(), r.fill(), r.fillStyle = "rgb(0,255,255)", r.beginPath(), r.arc(100, 50, 50, 0, 2 * Math.PI, !0), r.closePath(), r.fill(), r.fillStyle = "rgb(255,255,0)", r.beginPath(), r.arc(75, 100, 50, 0, 2 * Math.PI, !0), r.closePath(), r.fill(), r.fillStyle = "rgb(255,0,255)", r.arc(75, 75, 75, 0, 2 * Math.PI, !0), r.arc(75, 75, 25, 0, 2 * Math.PI, !0), r.fill("evenodd"), n.toDataURL && t.push("canvas fp:" + n.toDataURL()), t
                    },
                    A = function() {
                        var e, t = function(t) {
                            return e.clearColor(0, 0, 0, 1), e.enable(e.DEPTH_TEST), e.depthFunc(e.LEQUAL), e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT), "[" + t[0] + ", " + t[1] + "]"
                        };
                        if (!(e = j())) return null;
                        var n = [],
                            r = e.createBuffer();
                        e.bindBuffer(e.ARRAY_BUFFER, r);
                        var i = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
                        e.bufferData(e.ARRAY_BUFFER, i, e.STATIC_DRAW), r.itemSize = 3, r.numItems = 3;
                        var o = e.createProgram(),
                            a = e.createShader(e.VERTEX_SHADER);
                        e.shaderSource(a, "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"), e.compileShader(a);
                        var s = e.createShader(e.FRAGMENT_SHADER);
                        e.shaderSource(s, "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"), e.compileShader(s), e.attachShader(o, a), e.attachShader(o, s), e.linkProgram(o), e.useProgram(o), o.vertexPosAttrib = e.getAttribLocation(o, "attrVertex"), o.offsetUniform = e.getUniformLocation(o, "uniformOffset"), e.enableVertexAttribArray(o.vertexPosArray), e.vertexAttribPointer(o.vertexPosAttrib, r.itemSize, e.FLOAT, !1, 0, 0), e.uniform2f(o.offsetUniform, 1, 1), e.drawArrays(e.TRIANGLE_STRIP, 0, r.numItems);
                        try {
                            n.push(e.canvas.toDataURL())
                        } catch (e) {}
                        n.push("extensions:" + (e.getSupportedExtensions() || []).join(";")), n.push("webgl aliased line width range:" + t(e.getParameter(e.ALIASED_LINE_WIDTH_RANGE))), n.push("webgl aliased point size range:" + t(e.getParameter(e.ALIASED_POINT_SIZE_RANGE))), n.push("webgl alpha bits:" + e.getParameter(e.ALPHA_BITS)), n.push("webgl antialiasing:" + (e.getContextAttributes().antialias ? "yes" : "no")), n.push("webgl blue bits:" + e.getParameter(e.BLUE_BITS)), n.push("webgl depth bits:" + e.getParameter(e.DEPTH_BITS)), n.push("webgl green bits:" + e.getParameter(e.GREEN_BITS)), n.push("webgl max anisotropy:" + function(e) {
                            var t = e.getExtension("EXT_texture_filter_anisotropic") || e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || e.getExtension("MOZ_EXT_texture_filter_anisotropic");
                            if (t) {
                                var n = e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                                return 0 === n && (n = 2), n
                            }
                            return null
                        }(e)), n.push("webgl max combined texture image units:" + e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS)), n.push("webgl max cube map texture size:" + e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE)), n.push("webgl max fragment uniform vectors:" + e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS)), n.push("webgl max render buffer size:" + e.getParameter(e.MAX_RENDERBUFFER_SIZE)), n.push("webgl max texture image units:" + e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS)), n.push("webgl max texture size:" + e.getParameter(e.MAX_TEXTURE_SIZE)), n.push("webgl max varying vectors:" + e.getParameter(e.MAX_VARYING_VECTORS)), n.push("webgl max vertex attribs:" + e.getParameter(e.MAX_VERTEX_ATTRIBS)), n.push("webgl max vertex texture image units:" + e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)), n.push("webgl max vertex uniform vectors:" + e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS)), n.push("webgl max viewport dims:" + t(e.getParameter(e.MAX_VIEWPORT_DIMS))), n.push("webgl red bits:" + e.getParameter(e.RED_BITS)), n.push("webgl renderer:" + e.getParameter(e.RENDERER)), n.push("webgl shading language version:" + e.getParameter(e.SHADING_LANGUAGE_VERSION)), n.push("webgl stencil bits:" + e.getParameter(e.STENCIL_BITS)), n.push("webgl vendor:" + e.getParameter(e.VENDOR)), n.push("webgl version:" + e.getParameter(e.VERSION));
                        try {
                            var u = e.getExtension("WEBGL_debug_renderer_info");
                            u && (n.push("webgl unmasked vendor:" + e.getParameter(u.UNMASKED_VENDOR_WEBGL)), n.push("webgl unmasked renderer:" + e.getParameter(u.UNMASKED_RENDERER_WEBGL)))
                        } catch (e) {}
                        return e.getShaderPrecisionFormat ? (c(["FLOAT", "INT"], function(t) {
                            c(["VERTEX", "FRAGMENT"], function(r) {
                                c(["HIGH", "MEDIUM", "LOW"], function(i) {
                                    c(["precision", "rangeMin", "rangeMax"], function(o) {
                                        var a = e.getShaderPrecisionFormat(e[r + "_SHADER"], e[i + "_" + t])[o];
                                        "precision" !== o && (o = "precision " + o);
                                        var s = ["webgl ", r.toLowerCase(), " shader ", i.toLowerCase(), " ", t.toLowerCase(), " ", o, ":", a].join("");
                                        n.push(s)
                                    })
                                })
                            })
                        }), n) : n
                    },
                    C = function() {
                        try {
                            var e = j(),
                                t = e.getExtension("WEBGL_debug_renderer_info");
                            return e.getParameter(t.UNMASKED_VENDOR_WEBGL) + "~" + e.getParameter(t.UNMASKED_RENDERER_WEBGL)
                        } catch (e) {
                            return null
                        }
                    },
                    k = function() {
                        var e = document.createElement("div");
                        e.innerHTML = "&nbsp;", e.className = "adsbox";
                        var t = !1;
                        try {
                            document.body.appendChild(e), t = 0 === document.getElementsByClassName("adsbox")[0].offsetHeight, document.body.removeChild(e)
                        } catch (e) {
                            t = !1
                        }
                        return t
                    },
                    L = function() {
                        if (void 0 !== navigator.languages) try {
                            if (navigator.languages[0].substr(0, 2) !== navigator.language.substr(0, 2)) return !0
                        } catch (e) {
                            return !0
                        }
                        return !1
                    },
                    _ = function() {
                        return window.screen.width < window.screen.availWidth || window.screen.height < window.screen.availHeight
                    },
                    O = function() {
                        var e, t = navigator.userAgent.toLowerCase(),
                            n = navigator.oscpu,
                            r = navigator.platform.toLowerCase();
                        if (e = t.indexOf("windows phone") >= 0 ? "Windows Phone" : t.indexOf("win") >= 0 ? "Windows" : t.indexOf("android") >= 0 ? "Android" : t.indexOf("linux") >= 0 || t.indexOf("cros") >= 0 ? "Linux" : t.indexOf("iphone") >= 0 || t.indexOf("ipad") >= 0 ? "iOS" : t.indexOf("mac") >= 0 ? "Mac" : "Other", ("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) && "Windows Phone" !== e && "Android" !== e && "iOS" !== e && "Other" !== e) return !0;
                        if (void 0 !== n) {
                            if ((n = n.toLowerCase()).indexOf("win") >= 0 && "Windows" !== e && "Windows Phone" !== e) return !0;
                            if (n.indexOf("linux") >= 0 && "Linux" !== e && "Android" !== e) return !0;
                            if (n.indexOf("mac") >= 0 && "Mac" !== e && "iOS" !== e) return !0;
                            if ((-1 === n.indexOf("win") && -1 === n.indexOf("linux") && -1 === n.indexOf("mac")) != ("Other" === e)) return !0
                        }
                        return r.indexOf("win") >= 0 && "Windows" !== e && "Windows Phone" !== e || ((r.indexOf("linux") >= 0 || r.indexOf("android") >= 0 || r.indexOf("pike") >= 0) && "Linux" !== e && "Android" !== e || ((r.indexOf("mac") >= 0 || r.indexOf("ipad") >= 0 || r.indexOf("ipod") >= 0 || r.indexOf("iphone") >= 0) && "Mac" !== e && "iOS" !== e || ((r.indexOf("win") < 0 && r.indexOf("linux") < 0 && r.indexOf("mac") < 0 && r.indexOf("iphone") < 0 && r.indexOf("ipad") < 0) !== ("Other" === e) || void 0 === navigator.plugins && "Windows" !== e && "Windows Phone" !== e)))
                    },
                    D = function() {
                        var e, t = navigator.userAgent.toLowerCase(),
                            n = navigator.productSub;
                        if (("Chrome" === (e = t.indexOf("firefox") >= 0 ? "Firefox" : t.indexOf("opera") >= 0 || t.indexOf("opr") >= 0 ? "Opera" : t.indexOf("chrome") >= 0 ? "Chrome" : t.indexOf("safari") >= 0 ? "Safari" : t.indexOf("trident") >= 0 ? "Internet Explorer" : "Other") || "Safari" === e || "Opera" === e) && "20030107" !== n) return !0;
                        var r, i = eval.toString().length;
                        if (37 === i && "Safari" !== e && "Firefox" !== e && "Other" !== e) return !0;
                        if (39 === i && "Internet Explorer" !== e && "Other" !== e) return !0;
                        if (33 === i && "Chrome" !== e && "Opera" !== e && "Other" !== e) return !0;
                        try {
                            throw "a"
                        } catch (e) {
                            try {
                                e.toSource(), r = !0
                            } catch (e) {
                                r = !1
                            }
                        }
                        return r && "Firefox" !== e && "Other" !== e
                    },
                    P = function() {
                        var e = document.createElement("canvas");
                        return !(!e.getContext || !e.getContext("2d"))
                    },
                    R = function() {
                        if (!P()) return !1;
                        var e = j();
                        return !!window.WebGLRenderingContext && !!e
                    },
                    I = function() {
                        return "Microsoft Internet Explorer" === navigator.appName || !("Netscape" !== navigator.appName || !/Trident/.test(navigator.userAgent))
                    },
                    M = function() {
                        return void 0 !== window.swfobject
                    },
                    N = function() {
                        return window.swfobject.hasFlashPlayerVersion("9.0.0")
                    },
                    B = function(e, t) {
                        window.___fp_swf_loaded = function(t) {
                            e(t)
                        };
                        var n = t.fonts.swfContainerId;
                        ! function(e) {
                            var t = document.createElement("div");
                            t.setAttribute("id", e.fonts.swfContainerId), document.body.appendChild(t)
                        }();
                        var r = {
                            onReady: "___fp_swf_loaded"
                        };
                        window.swfobject.embedSWF(t.fonts.swfPath, n, "1", "1", "9.0.0", !1, r, {
                            allowScriptAccess: "always",
                            menu: "false"
                        }, {})
                    },
                    j = function() {
                        var e = document.createElement("canvas"),
                            t = null;
                        try {
                            t = e.getContext("webgl") || e.getContext("experimental-webgl")
                        } catch (e) {}
                        return t || (t = null), t
                    },
                    F = [{
                        key: "userAgent",
                        getData: function(e) {
                            e(navigator.userAgent)
                        }
                    }, {
                        key: "webdriver",
                        getData: function(e, t) {
                            e(null == navigator.webdriver ? t.NOT_AVAILABLE : navigator.webdriver)
                        }
                    }, {
                        key: "language",
                        getData: function(e, t) {
                            e(navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || t.NOT_AVAILABLE)
                        }
                    }, {
                        key: "colorDepth",
                        getData: function(e, t) {
                            e(window.screen.colorDepth || t.NOT_AVAILABLE)
                        }
                    }, {
                        key: "deviceMemory",
                        getData: function(e, t) {
                            e(navigator.deviceMemory || t.NOT_AVAILABLE)
                        }
                    }, {
                        key: "pixelRatio",
                        getData: function(e, t) {
                            e(window.devicePixelRatio || t.NOT_AVAILABLE)
                        }
                    }, {
                        key: "hardwareConcurrency",
                        getData: function(e, t) {
                            e(b(t))
                        }
                    }, {
                        key: "screenResolution",
                        getData: function(e, t) {
                            e(f(t))
                        }
                    }, {
                        key: "availableScreenResolution",
                        getData: function(e, t) {
                            e(d(t))
                        }
                    }, {
                        key: "timezoneOffset",
                        getData: function(e) {
                            e((new Date).getTimezoneOffset())
                        }
                    }, {
                        key: "timezone",
                        getData: function(e, t) {
                            window.Intl && window.Intl.DateTimeFormat ? e((new window.Intl.DateTimeFormat).resolvedOptions().timeZone) : e(t.NOT_AVAILABLE)
                        }
                    }, {
                        key: "sessionStorage",
                        getData: function(e, t) {
                            e(v(t))
                        }
                    }, {
                        key: "localStorage",
                        getData: function(e, t) {
                            e(m(t))
                        }
                    }, {
                        key: "indexedDb",
                        getData: function(e, t) {
                            e(y(t))
                        }
                    }, {
                        key: "addBehavior",
                        getData: function(e) {
                            e(!(!document.body || !document.body.addBehavior))
                        }
                    }, {
                        key: "openDatabase",
                        getData: function(e) {
                            e(!!window.openDatabase)
                        }
                    }, {
                        key: "cpuClass",
                        getData: function(e, t) {
                            e(w(t))
                        }
                    }, {
                        key: "platform",
                        getData: function(e, t) {
                            e(x(t))
                        }
                    }, {
                        key: "doNotTrack",
                        getData: function(e, t) {
                            e(T(t))
                        }
                    }, {
                        key: "plugins",
                        getData: function(e, t) {
                            I() ? t.plugins.excludeIE ? e(t.EXCLUDED) : e(p(t)) : e(h(t))
                        }
                    }, {
                        key: "canvas",
                        getData: function(e, t) {
                            P() ? e(E(t)) : e(t.NOT_AVAILABLE)
                        }
                    }, {
                        key: "webgl",
                        getData: function(e, t) {
                            R() ? e(A()) : e(t.NOT_AVAILABLE)
                        }
                    }, {
                        key: "webglVendorAndRenderer",
                        getData: function(e) {
                            R() ? e(C()) : e()
                        }
                    }, {
                        key: "adBlock",
                        getData: function(e) {
                            e(k())
                        }
                    }, {
                        key: "hasLiedLanguages",
                        getData: function(e) {
                            e(L())
                        }
                    }, {
                        key: "hasLiedResolution",
                        getData: function(e) {
                            e(_())
                        }
                    }, {
                        key: "hasLiedOs",
                        getData: function(e) {
                            e(O())
                        }
                    }, {
                        key: "hasLiedBrowser",
                        getData: function(e) {
                            e(D())
                        }
                    }, {
                        key: "touchSupport",
                        getData: function(e) {
                            e(S())
                        }
                    }, {
                        key: "fonts",
                        getData: function(e, t) {
                            var n = ["monospace", "sans-serif", "serif"],
                                r = ["Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style", "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New", "Geneva", "Georgia", "Helvetica", "Helvetica Neue", "Impact", "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "Palatino", "Palatino Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol", "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"];
                            t.fonts.extendedJsFonts && (r = r.concat(["Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter", "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER", "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville", "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD", "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara", "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer", "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold", "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark", "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte", "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER", "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT", "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD", "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV", "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT", "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN", "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island", "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti", "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli", "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN", "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla", "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood", "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket", "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC", "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin", "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"]));
                            r = (r = r.concat(t.fonts.userDefinedFonts)).filter(function(e, t) {
                                return r.indexOf(e) === t
                            });
                            var i = document.getElementsByTagName("body")[0],
                                o = document.createElement("div"),
                                a = document.createElement("div"),
                                s = {},
                                c = {},
                                u = function() {
                                    var e = document.createElement("span");
                                    return e.style.position = "absolute", e.style.left = "-9999px", e.style.fontSize = "72px", e.style.fontStyle = "normal", e.style.fontWeight = "normal", e.style.letterSpacing = "normal", e.style.lineBreak = "auto", e.style.lineHeight = "normal", e.style.textTransform = "none", e.style.textAlign = "left", e.style.textDecoration = "none", e.style.textShadow = "none", e.style.whiteSpace = "normal", e.style.wordBreak = "normal", e.style.wordSpacing = "normal", e.innerHTML = "mmmmmmmmmmlli", e
                                },
                                l = function(e, t) {
                                    var n = u();
                                    return n.style.fontFamily = "'" + e + "'," + t, n
                                },
                                f = function(e) {
                                    for (var t = !1, r = 0; r < n.length; r++)
                                        if (t = e[r].offsetWidth !== s[n[r]] || e[r].offsetHeight !== c[n[r]]) return t;
                                    return t
                                },
                                d = function() {
                                    for (var e = [], t = 0, r = n.length; t < r; t++) {
                                        var i = u();
                                        i.style.fontFamily = n[t], o.appendChild(i), e.push(i)
                                    }
                                    return e
                                }();
                            i.appendChild(o);
                            for (var h = 0, p = n.length; h < p; h++) s[n[h]] = d[h].offsetWidth, c[n[h]] = d[h].offsetHeight;
                            var g = function() {
                                for (var e = {}, t = 0, i = r.length; t < i; t++) {
                                    for (var o = [], s = 0, c = n.length; s < c; s++) {
                                        var u = l(r[t], n[s]);
                                        a.appendChild(u), o.push(u)
                                    }
                                    e[r[t]] = o
                                }
                                return e
                            }();
                            i.appendChild(a);
                            for (var v = [], m = 0, y = r.length; m < y; m++) f(g[r[m]]) && v.push(r[m]);
                            i.removeChild(a), i.removeChild(o), e(v)
                        },
                        pauseBefore: !0
                    }, {
                        key: "fontsFlash",
                        getData: function(e, t) {
                            return M() ? N() ? t.fonts.swfPath ? void B(function(t) {
                                e(t)
                            }, t) : e("missing options.fonts.swfPath") : e("flash not installed") : e("swf object not loaded")
                        },
                        pauseBefore: !0
                    }, {
                        key: "audio",
                        getData: function(e, t) {
                            var n = t.audio;
                            if (n.excludeIOS11 && navigator.userAgent.match(/OS 11.+Version\/11.+Safari/)) return e(t.EXCLUDED);
                            var r = window.OfflineAudioContext || window.webkitOfflineAudioContext;
                            if (null == r) return e(t.NOT_AVAILABLE);
                            var i = new r(1, 44100, 44100),
                                o = i.createOscillator();
                            o.type = "triangle", o.frequency.setValueAtTime(1e4, i.currentTime);
                            var a = i.createDynamicsCompressor();
                            c([
                                ["threshold", -50],
                                ["knee", 40],
                                ["ratio", 12],
                                ["reduction", -20],
                                ["attack", 0],
                                ["release", .25]
                            ], function(e) {
                                void 0 !== a[e[0]] && "function" == typeof a[e[0]].setValueAtTime && a[e[0]].setValueAtTime(e[1], i.currentTime)
                            }), o.connect(a), a.connect(i.destination), o.start(0), i.startRendering();
                            var s = setTimeout(function() {
                                return console.warn('Audio fingerprint timed out. Please report bug at https://github.com/Valve/fingerprintjs2 with your user agent: "' + navigator.userAgent + '".'), i.oncomplete = function() {}, i = null, e("audioTimeout")
                            }, n.timeout);
                            i.oncomplete = function(t) {
                                var n;
                                try {
                                    clearTimeout(s), n = t.renderedBuffer.getChannelData(0).slice(4500, 5e3).reduce(function(e, t) {
                                        return e + Math.abs(t)
                                    }, 0).toString(), o.disconnect(), a.disconnect()
                                } catch (t) {
                                    return void e(t)
                                }
                                e(n)
                            }
                        }
                    }, {
                        key: "enumerateDevices",
                        getData: function(e, t) {
                            if (!l()) return e(t.NOT_AVAILABLE);
                            navigator.mediaDevices.enumerateDevices().then(function(t) {
                                e(t.map(function(e) {
                                    return "id=" + e.deviceId + ";gid=" + e.groupId + ";" + e.kind + ";" + e.label
                                }))
                            }).catch(function(t) {
                                e(t)
                            })
                        }
                    }],
                    U = function(e) {
                        throw new Error("'new Fingerprint()' is deprecated, see https://github.com/Valve/fingerprintjs2#upgrade-guide-from-182-to-200")
                    };
                return U.get = function(e, t) {
                    t ? e || (e = {}) : (t = e, e = {}),
                        function(e, t) {
                            if (null == t) return e;
                            var n, r;
                            for (r in t) null == (n = t[r]) || Object.prototype.hasOwnProperty.call(e, r) || (e[r] = n)
                        }(e, s), e.components = e.extraComponents.concat(F);
                    var n = {
                            data: [],
                            addPreprocessedComponent: function(t, r) {
                                "function" == typeof e.preprocessor && (r = e.preprocessor(t, r)), n.data.push({
                                    key: t,
                                    value: r
                                })
                            }
                        },
                        r = -1;
                    ! function i(o) {
                        if ((r += 1) >= e.components.length) t(n.data);
                        else {
                            var a = e.components[r];
                            if (e.excludes[a.key]) i(!1);
                            else {
                                if (!o && a.pauseBefore) return r -= 1, void setTimeout(function() {
                                    i(!0)
                                }, 1);
                                try {
                                    a.getData(function(e) {
                                        n.addPreprocessedComponent(a.key, e), i(!1)
                                    }, e)
                                } catch (e) {
                                    n.addPreprocessedComponent(a.key, String(e)), i(!1)
                                }
                            }
                        }
                    }(!1)
                }, U.getPromise = function(e) {
                    return new Promise(function(t, n) {
                        U.get(e, t)
                    })
                }, U.getV18 = function(e, t) {
                    return null == t && (t = e, e = {}), U.get(e, function(n) {
                        for (var r = [], i = 0; i < n.length; i++) {
                            var o = n[i];
                            if (o.value === (e.NOT_AVAILABLE || "not available")) r.push({
                                key: o.key,
                                value: "unknown"
                            });
                            else if ("plugins" === o.key) r.push({
                                key: "plugins",
                                value: u(o.value, function(e) {
                                    var t = u(e[2], function(e) {
                                        return e.join ? e.join("~") : e
                                    }).join(",");
                                    return [e[0], e[1], t].join("::")
                                })
                            });
                            else if (-1 !== ["canvas", "webgl"].indexOf(o.key)) r.push({
                                key: o.key,
                                value: o.value.join("~")
                            });
                            else if (-1 !== ["sessionStorage", "localStorage", "indexedDb", "addBehavior", "openDatabase"].indexOf(o.key)) {
                                if (!o.value) continue;
                                r.push({
                                    key: o.key,
                                    value: 1
                                })
                            } else o.value ? r.push(o.value.join ? {
                                key: o.key,
                                value: o.value.join(";")
                            } : o) : r.push({
                                key: o.key,
                                value: o.value
                            })
                        }
                        var s = a(u(r, function(e) {
                            return e.value
                        }).join("~~~"), 31);
                        t(s, r)
                    })
                }, U.x64hash128 = a, U.VERSION = "2.1.0", U
            }, t.exports ? t.exports = r() : n.exports ? n.exports = r() : n.Fingerprint2 = r()
        }),
        Fh = Bu({}),
        Uh = null,
        Hh = function(e, t, n, r) {
            this.url = e, this.formats = t, this.formatIdx = -1, this.autoplay = r, this.forcestop = !1, this.finishtime = 0, !0 === n && this.load()
        };
    Hh.prototype.isInitialized = function() {
        return this.url && this.url.length > 0 && Array.isArray(this.formats)
    }, Hh.prototype.load = function() {
        if (this.isInitialized() && void 0 === this.Buffer && (this.formatIdx++, !(this.formatIdx >= this.formats.length))) {
            var e = this.url + "." + this.formats[this.formatIdx],
                t = this;
            fetch(e).then(function(e) {
                if (e.ok) return e.arrayBuffer()
            }).then(function(e) {
                if (void 0 !== e) {
                    if (null === Uh) {
                        var n = window.AudioContext || window.webkitAudioContext;
                        Uh = new n
                    }
                    Uh.decodeAudioData(e, function(e) {
                        t.Buffer = e, t.formatIdx = t.formats.length, !0 === t.autoplay && t.play()
                    }, function(e) {
                        t.load()
                    })
                } else t.load()
            }).catch(function(e) {})
        }
    }, Hh.prototype.play = function() {
        if (this.isInitialized())
            if (void 0 !== this.Buffer) {
                var e = Uh.createBufferSource();
                e.buffer = this.Buffer, e.connect(Uh.destination), e.start(0), this.forcestop && e.stop(), this.finishtime = Date.now() + 1e3 * this.Buffer.duration, this.sourceNode = e, this.forcestop = !1
            } else -1 == this.formatIdx && (this.autoplay = !0, this.load())
    }, Hh.prototype.stop = function() {
        this.isInitialized() && (this.isPlaying() ? this.sourceNode.stop() : this.formatIdx > -1 && this.formatIdx < this.formats.length && (this.forcestop = !0))
    }, Hh.prototype.isPlaying = function() {
        return !(!this.isInitialized() || void 0 === Uh || void 0 === this.sourceNode) && this.finishtime > Date.now()
    };
    var Gh = $o.window;

    function Wh(e) {
        var t, n, r, i;
        return {
            c: function() {
                t = xo("canvas"), n = Eo(), r = xo("input"), Co(t, "class", "topleft svelte-79e7lf"), Co(t, "id", "glcanvas"), Co(t, "tabindex", "1"), Co(t, "width", "1000px"), Co(t, "height", "1000px"), Lo(t, "cursor", "default"), _o(t, "inactive", e[0]), _o(t, "active", !e[0]), Co(r, "type", "text"), Co(r, "id", "input"), i = [Ao(Gh, "resize", e[1]), Ao(Gh, "focus", e[2]), Ao(Gh, "blur", e[3])]
            },
            m: function(i, o) {
                bo(i, t, o), e[28](t), bo(i, n, o), bo(i, r, o)
            },
            p: function(e, n) {
                var r = n[0];
                1 & r && _o(t, "inactive", e[0]), 1 & r && _o(t, "active", !e[0])
            },
            i: fo,
            o: fo,
            d: function(o) {
                o && wo(t), e[28](null), o && wo(n), o && wo(r), go(i)
            }
        }
    }
    var zh = 2;

    function qh(e, t) {
        Ru.debug && Fh.set({
            msg: e,
            level: t
        })
    }

    function Vh(e) {
        var t = {
            renderer: "",
            vendor: ""
        };
        if (void 0 === e) return t;
        var n = e.getExtension("WEBGL_debug_renderer_info");
        return null != n && (t.renderer = e.getParameter(n.UNMASKED_RENDERER_WEBGL), t.vendor = e.getParameter(n.UNMASKED_VENDOR_WEBGL)), t
    }

    function $h(e) {
        return e && "object" === lo(e) ? JSON.stringify(e) : e
    }

    function Kh(e, t, n) {
        var r = window.resV,
            i = 0,
            o = "object" === ("undefined" == typeof WebAssembly ? "undefined" : lo(WebAssembly)),
            a = !0,
            s = console.log,
            c = console.error,
            u = console.warn,
            l = Ru.logLevel,
            d = new Map;
        switch (Ch.currentHost = location.host, window.glcanvas = null, window.GLEngineModule = Ch, window.isMobile = Ls !== As.Desktop, window.isWeb32 = function() {
            for (var e = ["x86_64", "x86-64", "win64", "x64;", "amd64", "x64_64", "ia64", "sparc64", "ppc64", "irix64"], t = navigator.userAgent.toLowerCase(), n = 0; n < e.length; n++)
                if (-1 != t.indexOf(e[n])) return !1;
            return !0
        }(), window.showFps = Ru.showfps, window.vsync = Ru.vsync, window.asm = Ru.asm, window.crashMode = Ru.crashMode, window.deviceName = "default", window.deviceId = "undefined", window.launchedFromHomescreen = void 0 !== window.navigator.standalone && window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches, window.isMac = Cs === Ss.Mac, window.isWin = Cs === Ss.Windows, window.url = location.pathname, window.params = location.search, window.firebaseInitialized = !1, window.firebaseRegistration = !1, Cs) {
            case Ss.Android:
                window.deviceName = "android";
                break;
            case Ss.IOS:
                switch (Ls) {
                    case As.Tablet:
                        window.deviceName = "ipad";
                        break;
                    case As.Mobile:
                        window.deviceName = "iphone"
                }
        }
        Ch.appendLogMessage = function(e) {
            e.indexOf("[error]") > -1 && qh(e, "error"), Ch.logBuffer.push(e)
        }, Ch.onAbort = function() {
            if (!Ch.runtimeReady && !Ru.asm) {
                var e = location.href = "/traderoom/";
                location.search.length > 0 ? e += location.search + "&asm=1" : e += "?asm=1", location.href = e
            }
        }, Ch.setStatus = function(e) {
            "Running..." === e ? (Ch.downloadingTime = +(new Date - Ch.startTime), Hu.set("Initializing...")) : "" !== e && Hu.set("Downloading...")
        }, Ch.setLoadProgress = function() {
            Ch.progress++, ju.update(function(e) {
                return e + 1
            }), Ch.progress > 19 && (Ch.initializingTime = +(new Date - Ch.startTime - Ch.downloadingTime), Hu.set("Connecting..."), console.log("Connecting..."))
        }, Ch.removePreloader = function() {
            Ch.initTests(), setTimeout(function() {
                Uu.set(!1), n(0, a = !1)
            }, 700), setTimeout(function() {
                Ch.canvas.focus()
            }, 800), setInterval(function() {
                Ch.windowFocus || Ch.renderFrame()
            }, 1e3)
        }, Ch.onRuntimeInitialized = function() {
            Ch.runtimeReady = !0
        }, Ch.setClipboard = function(e) {
            document.removeEventListener("copy", A, !0), document.addEventListener("copy", function t(n) {
                n.clipboardData.setData("text/plain", e), n.stopPropagation(), n.preventDefault(), document.removeEventListener("copy", t, !0), document.addEventListener("copy", A, !0)
            }, !0);
            var t = document.createElement("input");
            t.width = 0, t.height = 0, t.value = "data", document.body.appendChild(t), t.select(), t.focus(), document.execCommand("copy"), t.remove(), Ch.canvas.focus()
        };
        var h = function() {
            for (var e = {}, t = window.location.search.substring(1).split("&"), n = 0; n < t.length; n++) {
                var r = t[n].split("=");
                if (void 0 === e[r[0]]) e[r[0]] = decodeURIComponent(r[1]);
                else if ("string" == typeof e[r[0]]) {
                    var i = [e[r[0]], decodeURIComponent(r[1])];
                    e[r[0]] = i
                } else e[r[0]].push(decodeURIComponent(r[1]))
            }
            return e
        }();

        function p(e, t) {
            if (-1 !== e.indexOf("\n") && !d.has(e)) {
                d.set(e, !0);
                var n = new FormData;
                n.append("uploaded", e), n.append("info", JSON.stringify(g(t))), n.append("log", JSON.stringify(Ch.logBuffer.toArray()));
                var r = "https://glcb." + Ch.currentHost + "/submit/web";
                fetch(r, {
                    method: "POST",
                    body: n
                })
            }(-1 !== e.indexOf("abort") || -1 !== e.indexOf("RuntimeError:") && -1 !== e.indexOf("wasm")) && v()
        }

        function g(e) {
            var t = Ch.canvas,
                n = t ? t.getContext("experimental-webgl") : void 0,
                r = -1;
            return void 0 !== window.Module && void 0 !== window.GLEngineModule.userId && (r = window.GLEngineModule.userId), {
                version: Iu.version,
                browser: navigator.userAgent.toLowerCase(),
                platform: navigator.platform.toLowerCase(),
                userid: r.toString(),
                deviceid: window.deviceId,
                gpu: {
                    vendor: Vh(n).vendor,
                    renderer: Vh(n).renderer
                },
                level: e
            }
        }

        function v() {
            Gu.set(!0), n(0, a = !0)
        }

        function m(e, t, n, r, i) {
            var o = e; - 1 === o.indexOf("\n") && null != i && i.stack && -1 !== i.stack.search(/wasm/i) && (o = e + "\n" + i.stack), qh(o, "error"), p(o, "error")
        }

        function y() {
            var e = window.cacheImagesList.filter(function(e) {
                    return window.webPSupported ? e.endsWith(".webp") : e.endsWith(".png")
                }),
                t = 0;
            Fu.set(e.length);
            for (var n = function(n) {
                    var i = new Image;
                    Ch.imgs[e[n]] = i, i.crossOrigin = "use-credentials", i.onload = function() {
                        ju.update(function(e) {
                            return e + 1
                        }), t++, e.length == t && x()
                    }, i.onerror = function(n) {
                        return function() {
                            console.error("TEXTURE LOAD ERROR: " + this.src), this.src == location.origin + "/traderoom/" + e[n] + "?v=" + r && (ju.update(function(e) {
                                return e + 1
                            }), t++, i.onerror = null), this.src = location.origin + "/traderoom/" + e[n] + "?v=" + r, e.length == t && x()
                        }
                    }(n), i.src = Iu.resourceHost + "/" + e[n] + "?v=" + r, i.async = !0
                }, i = 0; i < e.length; i++) n(i)
        }

        function b() {
            var e = ks === Es.Safari ? ["mp3"] : ["ogg", "mp3"];
            window.soundNames.forEach(function(t) {
                Ch.sounds[t] = new Hh(Iu.resourceHost + "/" + t, e, !1, !1)
            })
        }

        function w() {
            y(), b()
        }

        function x() {
            ju.set(0), Fu.set(14), window.asm || !o ? S() : T()
        }

        function T() {
            console.log("Loading wasm...");
            var e = document.createElement("script");
            e.crossOrigin = "use-credentials", e.src = Iu.resourceHost + "/glenginew8154ae62.js?v=" + r, document.body.appendChild(e)
        }

        function S() {
            console.log("Loading asm..."), window.Module = Ch;
            var e = document.createElement("script");
            e.type = "text/javascript", e.crossOrigin = "use-credentials", e.src = Iu.resourceHost + "/glengine.asm8154ae62.js?v=" + r, e.onload = function() {
                setTimeout(function() {
                    var e = document.createElement("script");
                    e.crossOrigin = "use-credentials", e.src = Iu.resourceHost + "/glengine8154ae62.js?v=" + r, document.body.appendChild(e)
                }, 1)
            }, document.body.appendChild(e)
        }

        function E() {
            var e = function(e) {
                var t = !e.altKey && (window.isMac && e.metaKey && !e.ctrlKey || !window.isMac && e.ctrlKey);
                (("KeyV" == e.code || "KeyC" == e.code || "KeyX" == e.code || "KeyZ" == e.code || "KeyA" == e.code) && t || e.shiftKey && "Delete" == e.code || (e.shiftKey || e.ctrlKey) && "Insert" == e.code) && e.stopPropagation()
            };
            document.addEventListener("keydown", function(t) {
                e(t), !t.altKey && (window.isMac && t.metaKey && !t.ctrlKey || !isMac && t.ctrlKey) && (t.shiftKey && "KeyZ" == t.code ? Ch.editCommandsHandler("redo") : t.shiftKey || "KeyZ" != t.code ? t.shiftKey || "KeyA" != t.code || Ch.editCommandsHandler("selectall") : Ch.editCommandsHandler("undo"))
            }, !0), document.addEventListener("keyup", e, !0), document.addEventListener("keypress", e, !0), document.addEventListener("paste", function(e) {
                var t = escape(e.clipboardData.getData("text/plain"));
                if (0 !== t.length) Ch.pasteFromClipboard(t);
                else {
                    for (var n = null, r = (e.clipboardData || e.originalEvent.clipboardData).items, i = 0; i < r.length; i++) 0 === r[i].type.indexOf("image") && (n = r[i].getAsFile());
                    if (null !== n) {
                        var o = new FileReader;
                        o.onload = function(e) {
                            e.target.result.startsWith("data:image/png;base64,") && Ch.pasteFromClipboard(e.target.result)
                        }, o.readAsDataURL(n)
                    }
                }
                e.stopPropagation(), e.preventDefault()
            }, !0), document.addEventListener("copy", A, !0), document.addEventListener("cut", function(e) {
                e.clipboardData.setData("text/plain", unescape(Ch.cutToClipboard())), e.stopPropagation(), e.preventDefault()
            }, !0), window.addEventListener("keydown", function(e) {
                8 !== e.keyCode && 9 !== e.keyCode || e.preventDefault()
            })
        }

        function A(e) {
            e.clipboardData.setData("text/plain", unescape(Ch.copyToClipboard())), e.stopPropagation(), e.preventDefault()
        }

        function C() {
            Ru.preload.forEach(function(e) {
                Ch.loadScript(e)
            })
        }

        function k() {
            if (ks !== Es.Safari) {
                var e = function(e) {
                        var t, n, i;
                        t = Iu.resourceHost + "/" + e.file + "?v=" + r, n = e.as, (i = document.createElement("link")).rel = "preload", i.as = n, i.href = t, i.crossOrigin = "anonymous", i.referrerpolicy = "same-origin", "script" === n && (i.crossOrigin = "use-credentials"), document.head.appendChild(i)
                    },
                    t = [],
                    n = [];
                Ru.asm || !o ? (t = [{
                    file: "glengine.asm8154ae62.js",
                    as: "script"
                }, {
                    file: "glengine8154ae62.js",
                    as: "script"
                }], n = [{
                    file: "glengine8154ae62.data",
                    as: "fetch"
                }]) : (t = [{
                    file: "glenginew8154ae62.js",
                    as: "script"
                }], n = [{
                    file: "glenginew8154ae62.data",
                    as: "fetch"
                }, {
                    file: "glenginew8154ae62.wasm",
                    as: "fetch"
                }]), n.forEach(e), t.forEach(e)
            }
        }
        return window.autotestsJson = JSON.stringify(h), Do(function() {
            k(), C(), Uu.set(!0), window.onerror = m, setTimeout(function() {
                jh.get(function(e) {
                    window.deviceId = jh.x64hash128(e.map(function(e) {
                        return e.value
                    }).join(), 31)
                })
            }, 500), E(), nd(Qf), Qf(window).on("mousewheel", {
                mousewheel: {
                    debounce: {
                        delay: !0
                    },
                    throttle: {
                        delay: !0
                    }
                }
            }, function(e) {
                var t = e.originalEvent,
                    n = ks === Es.Firefox ? t.deltaY : t.detail,
                    r = t.wheelDelta;
                n = (n = n ? r && (f = r / n) ? n / f : -n / 1.35 : r / 120) < 1 ? n < -1 ? (-Math.pow(n, 2) - 224) / 225 : n : (Math.pow(n, 2) + 224) / 225, e.delta = Math.min(Math.max(n / 2, -1), 1), isNaN(e.delta) || Ch.onWheelEventJS(6 * e.delta)
            }), window.glcanvas = Ch.canvas, Ch.jsAlignCanvas(), w()
        }), [a, function() {
            clearTimeout(i), i = setTimeout(Ch.jsResizeWebGlView, 500)
        }, function() {
            Ch.canvas.focus(), Ch.windowFocus = 1, Ch.notificationDeals = [], document.title = Ch.baseTitle, Ch.resetKeys && Ch.resetKeys()
        }, function() {
            Ch.windowFocus = 0
        }, i, s, c, u, r, o, l, d, h, p, g, v, m, y, b, w, x, T, S, E, A, function() {
            var e = arguments;
            Ru.debug && (s = console.log, c = console.error, u = console.warn, console.log = function(t) {
                l === zh && qh($h(e), "log"), s.apply(console, e)
            }, console.error = function(t) {
                qh($h(e), "error"), c.apply(console, e)
            }, console.warn = function(t) {
                qh($h(e), "warning"), u.apply(console, e)
            })
        }, C, k, function(e) {
            Ro[e ? "unshift" : "push"](function() {
                Ch.canvas = e
            })
        }]
    }
    var Xh = function(e) {
            function t(t) {
                e.call(this), Zo(this, t, Kh, Wh, mo, {})
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
        }(Qo),
        Yh = 1..toFixed,
        Jh = Math.floor,
        Zh = function(e, t, n) {
            return 0 === t ? n : t % 2 == 1 ? Zh(e, t - 1, n * e) : Zh(e * e, t / 2, n)
        },
        Qh = Yh && ("0.000" !== 8e-5.toFixed(3) || "1" !== .9. toFixed(0) || "1.25" !== 1.255.toFixed(2) || "1000000000000000128" !== (0xde0b6b3a7640080).toFixed(0)) || !u(function() {
            Yh.call({})
        });

    function ep(e) {
        var t, n, r, i, o, a, s, c, u, l, f, d, h, p, g, v, m, y;
        return {
            c: function() {
                t = xo("div"), n = To("svg"), r = To("title"), i = So("windows"), o = To("desc"), a = So("Created with Sketch."), s = To("defs"), c = To("g"), u = To("g"), l = To("path"), f = Eo(), (d = xo("strong")).textContent = "DOWNLOAD APP", h = Eo(), p = xo("br"), g = So("for Windows .msi, "), v = xo("div"), m = So(e[0]), y = So(" Mb"), Co(l, "d", "M101,77.5306696 L114.037091,75.7551527 L114.04279,88.3304823 L101.011909,88.4046893 L101,77.5306696 Z M114.030881,89.7794052 L114.041,102.365694 L101.010119,100.57414 L101.009389,89.6949803 L114.030881,89.7794052 Z M115.611281,75.5228837 L132.897382,73 L132.897382,88.1705463 L115.611281,88.3077778 L115.611281,75.5228837 Z M132.901401,89.8977681 L132.897346,105 L115.611245,102.560263 L115.587024,89.8694926 L132.901401,89.8977681 Z"), Co(l, "id", "windows"), Co(u, "id", "sprite-downloadbanner"), Co(u, "transform", "translate(-101.000000, -73.000000)"), Co(u, "fill-rule", "nonzero"), Co(u, "fill", "#FFF"), Co(u, "class", "svelte-1i67hg2"), Co(c, "id", "Page-1"), Co(c, "stroke", "none"), Co(c, "stroke-width", "1"), Co(c, "fill", "none"), Co(c, "fill-rule", "evenodd"), Co(c, "class", "svelte-1i67hg2"), Co(n, "width", "32px"), Co(n, "height", "38px"), Co(n, "viewBox", "0 0 32 32"), Co(n, "version", "1.1"), Co(n, "xmlns", "http://www.w3.org/2000/svg"), Co(n, "xmlns:xlink", "http://www.w3.org/1999/xlink"), Co(n, "class", "svelte-1i67hg2"), Co(d, "class", "svelte-1i67hg2"), Co(v, "id", "winSize"), Co(v, "class", "svelte-1i67hg2"), Co(t, "class", "os svelte-1i67hg2"), Co(t, "id", "win")
            },
            m: function(e, b) {
                bo(e, t, b), yo(t, n), yo(n, r), yo(r, i), yo(n, o), yo(o, a), yo(n, s), yo(n, c), yo(c, u), yo(u, l), yo(t, f), yo(t, d), yo(t, h), yo(t, p), yo(t, g), yo(t, v), yo(v, m), yo(t, y)
            },
            p: function(e, t) {
                1 & t && ko(m, e[0])
            },
            d: function(e) {
                e && wo(t)
            }
        }
    }

    function tp(e) {
        var t, n, r, i, o, a, s, c, u, l, f, d, h, p, g, v, m, y, b;
        return {
            c: function() {
                t = xo("div"), n = To("svg"), r = To("title"), i = So("apple"), o = To("desc"), a = So("Created with Sketch."), s = To("defs"), c = To("g"), u = To("g"), l = To("path"), f = Eo(), (d = xo("strong")).textContent = "DOWNLOAD APP", h = Eo(), p = xo("br"), g = So("for macOS .dmg, "), v = xo("div"), m = So(e[0]), y = Eo(), b = So("Mb"), Co(l, "d", "M22.5504641,17.534198 C22.5086273,13.3549969 25.9751269,11.3507 26.129975,11.25112 C24.1822304,8.41454073 21.148088,8.02595321 20.0668712,7.98102942 C17.4847091,7.72083241 15.0284461,9.49400062 13.7179686,9.49400062 C12.410794,9.49400062 10.388572,8.0195079 8.24705681,8.05824419 C5.43259016,8.09988087 2.8374755,9.68690864 1.38827581,12.1954863 C-1.53589921,17.2453838 0.639422256,24.7264508 3.4895085,28.8219918 C4.88217017,30.8267398 6.54282077,33.0783431 8.72319374,32.9979057 C10.8228721,32.9145035 11.6168654,31.6457449 14.1553773,31.6457449 C16.6938244,31.6457449 17.4074469,32.9979057 19.6293977,32.956398 C21.8888462,32.9146324 23.3203008,30.9133003 24.7033776,28.9024292 C26.302633,26.5767049 26.9611423,24.3250371 27,24.2094728 C26.9498087,24.1866564 22.5941143,22.5260232 22.5504641,17.534198 Z M18.3753287,5.26974688 C19.5325772,3.87246893 20.3136826,1.93391415 20.1006127,0 C18.4336801,0.06754681 16.413142,1.10504776 15.2171653,2.49916752 C14.1440438,3.73589289 13.2046577,5.70976794 13.4563912,7.60501026 C15.3172887,7.74951402 17.2168497,6.66386663 18.3753287,5.26974688 Z"), Co(l, "id", "apple"), Co(u, "id", "sprite-downloadbanner"), Co(u, "fill-rule", "nonzero"), Co(u, "fill", "#FFF"), Co(u, "class", "svelte-1i67hg2"), Co(c, "id", "Page-1"), Co(c, "stroke", "none"), Co(c, "stroke-width", "1"), Co(c, "fill", "none"), Co(c, "fill-rule", "evenodd"), Co(c, "class", "svelte-1i67hg2"), Co(n, "width", "27px"), Co(n, "height", "33px"), Co(n, "viewBox", "0 0 27 33"), Co(n, "version", "1.1"), Co(n, "xmlns", "http://www.w3.org/2000/svg"), Co(n, "xmlns:xlink", "http://www.w3.org/1999/xlink"), Co(n, "class", "svelte-1i67hg2"), Co(d, "class", "svelte-1i67hg2"), Co(v, "id", "macSize"), Co(v, "class", "svelte-1i67hg2"), Co(t, "class", "os svelte-1i67hg2"), Co(t, "id", "ios")
            },
            m: function(e, w) {
                bo(e, t, w), yo(t, n), yo(n, r), yo(r, i), yo(n, o), yo(o, a), yo(n, s), yo(n, c), yo(c, u), yo(u, l), yo(t, f), yo(t, d), yo(t, h), yo(t, p), yo(t, g), yo(t, v), yo(v, m), yo(v, y), yo(t, b)
            },
            p: function(e, t) {
                1 & t && ko(m, e[0])
            },
            d: function(e) {
                e && wo(t)
            }
        }
    }

    function np(e) {
        var t, n, r, i, o;
        var a = Cs === Ss.Mac ? tp : Cs === Ss.Windows ? ep : void 0,
            s = a && a(e);
        return {
            c: function() {
                t = xo("div"), n = xo("a"), r = xo("div"), s && s.c(), i = Eo(), (o = xo("div")).textContent = "Even smoother and faster experience in our desktop trading app", Co(r, "class", "svelte-1i67hg2"), Co(o, "class", "svelte-1i67hg2"), Co(n, "class", "download svelte-1i67hg2"), Co(n, "id", "download-standalone"), Co(n, "href", e[1]), Co(n, "target", "_blank"), Co(t, "class", "download-wrap svelte-1i67hg2")
            },
            m: function(e, a) {
                bo(e, t, a), yo(t, n), yo(n, r), s && s.m(r, null), yo(n, i), yo(n, o)
            },
            p: function(e, t) {
                var r = t[0];
                s.p(e, r), 2 & r && Co(n, "href", e[1])
            },
            i: fo,
            o: fo,
            d: function(e) {
                e && wo(t), s && s.d()
            }
        }
    }

    function rp(e) {
        var t = window.location.hostname;
        return t.startsWith("eu.") && (t = t.substr(3)), "https://updates." + t + e
    }

    function ip(e, t, n) {
        var r = 18,
            i = "/";
        return Cs === Ss.Windows && n(1, i = rp("/api/v1/build/current/pkg/WinGL")), Cs === Ss.Mac && n(1, i = rp("/api/v1/build/current/pkg/MacGL")), i.length > 1 && fetch(i, {
            method: "HEAD"
        }).then(function(e) {
            n(0, r = parseInt(e.headers.get("Content-Length"), 10) / 1024 / 1024), n(0, r = r.toFixed(0))
        }).catch(function(e) {
            console.error("Failed to get distributive size:", e)
        }), [r, i]
    }
    Oe({
        target: "Number",
        proto: !0,
        forced: Qh
    }, {
        toFixed: function(e) {
            var t, n, r, i, o = function(e) {
                    if ("number" != typeof e && "Number" != m(e)) throw TypeError("Incorrect invocation");
                    return +e
                }(this),
                a = ae(e),
                s = [0, 0, 0, 0, 0, 0],
                c = "",
                u = "0",
                l = function(e, t) {
                    for (var n = -1, r = t; ++n < 6;) r += e * s[n], s[n] = r % 1e7, r = Jh(r / 1e7)
                },
                f = function(e) {
                    for (var t = 6, n = 0; --t >= 0;) n += s[t], s[t] = Jh(n / e), n = n % e * 1e7
                },
                d = function() {
                    for (var e = 6, t = ""; --e >= 0;)
                        if ("" !== t || 0 === e || 0 !== s[e]) {
                            var n = String(s[e]);
                            t = "" === t ? n : t + Cd.call("0", 7 - n.length) + n
                        }
                    return t
                };
            if (a < 0 || a > 20) throw RangeError("Incorrect fraction digits");
            if (o != o) return "NaN";
            if (o <= -1e21 || o >= 1e21) return String(o);
            if (o < 0 && (c = "-", o = -o), o > 1e-21)
                if (n = (t = function(e) {
                        for (var t = 0, n = e; n >= 4096;) t += 12, n /= 4096;
                        for (; n >= 2;) t += 1, n /= 2;
                        return t
                    }(o * Zh(2, 69, 1)) - 69) < 0 ? o * Zh(2, -t, 1) : o / Zh(2, t, 1), n *= 4503599627370496, (t = 52 - t) > 0) {
                    for (l(0, n), r = a; r >= 7;) l(1e7, 0), r -= 7;
                    for (l(Zh(10, r, 1), 0), r = t - 1; r >= 23;) f(1 << 23), r -= 23;
                    f(1 << r), l(1, 1), f(2), u = d()
                } else l(0, n), l(1 << -t, 0), u = d() + Cd.call("0", a);
            return u = a > 0 ? c + ((i = u.length) <= a ? "0." + Cd.call("0", a - i) + u : u.slice(0, i - a) + "." + u.slice(i - a)) : c + u
        }
    });
    var op = function(e) {
        function t(t) {
            e.call(this), Zo(this, t, ip, np, mo, {})
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
    }(Qo);

    function ap(e) {
        var t;
        return {
            c: function() {
                (t = xo("div")).innerHTML = '<a target="_blank" href="http://www.cysec.gov.cy/en-GB/entities/investment-firms/cypriot/40647/" class="regulation"><svg width="81px" height="26px" viewBox="0 0 81 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>New_CySEC</title><desc>Created with Sketch.</desc><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" opacity="0.35"><g id="New_CySEC-Copy" fill="#FFFFFF"><path d="M75.8637539,4.2072969 C75.2542496,3.63172617 74.326709,3.34472283 73.0780065,3.34472283 C71.7199058,3.34472283 70.7103166,3.83192468 70.0359548,4.80711042 C69.3600301,5.77916805 69.008393,7.29004121 69.008393,9.33738382 L69.008393,10.8333985 C69.008393,12.9714561 69.3209593,14.537071 69.9671902,15.5255512 C70.6142025,16.5124673 71.6237917,17.0090534 73.0170561,17.0090534 C74.2751355,17.0090534 75.2128345,16.7275243 75.8340601,16.1519536 C76.4537228,15.5763828 76.809267,14.6449905 76.8999112,13.493067 L80.9710876,13.493067 C80.8179301,15.5943694 80.0333886,17.2858905 78.6166818,18.5089783 C77.2007563,19.7328481 75.333954,20.3326616 73.0170561,20.3326616 C70.4829246,20.3326616 68.4989099,19.4786898 67.0470393,17.7707462 C65.5936059,16.0635847 64.8770476,13.7198544 64.8770476,10.7379914 L64.8770476,9.52898006 C64.8770476,7.62709417 65.2021166,5.95043162 65.8717899,4.50055644 C66.5414633,3.05146329 67.4893207,1.93864108 68.7333346,1.16443589 C69.9773486,0.389448672 71.4229678,0 73.0701924,0 C75.3519265,0 77.1882537,0.612325924 78.5830809,1.8346317 C79.9771267,3.05850152 80.7827664,4.74767648 81,6.98426926 L76.9264794,6.98426926 C76.8272396,5.69705537 76.474821,4.78286763 75.8637539,4.20807892 L75.8637539,4.2072969 Z M49.8426074,0.273708906 L63.0485346,0.273708906 L63.0485346,3.59497097 L53.9059696,3.59497097 L53.9059696,8.27148314 L61.694341,8.27148314 L61.694341,11.4590189 L53.9059696,11.4590189 L53.9059696,16.8135471 L63.0485346,16.8135471 L63.0485346,20.068337 L49.8426074,20.068337 L49.8426074,0.273708906 L49.8426074,0.273708906 Z M40.4070115,8.38644088 C42.7239094,9.08478961 44.4117675,9.95049177 45.470586,10.9827654 C46.5294044,12.015039 47.0592043,13.3022528 47.0592043,14.8420609 C47.0592043,16.5546967 46.412192,17.8966523 45.1181674,18.871056 C43.8233614,19.8454597 42.0808042,20.3326616 39.8897143,20.3326616 C38.3706419,20.3326616 36.9851917,20.0526965 35.7364892,19.4958944 C34.4885682,18.9383102 33.5352409,18.1742714 32.879633,17.2045598 C32.2232437,16.2348483 31.8950491,15.11968 31.8950491,13.8316841 L35.9818538,13.8316841 C35.9818538,16.0010226 37.2852554,17.1083707 39.8912771,17.1083707 C40.8602327,17.1083707 41.6158618,16.9144284 42.1589458,16.5218516 C42.7012483,16.1269287 42.9716182,15.5756008 42.9716182,14.8694318 C42.9716182,14.0999188 42.7012483,13.5087076 42.1589458,13.0957981 C41.6150804,12.6836707 40.6375292,12.2488646 39.2255108,11.7913797 C37.8134924,11.3338948 36.6960678,10.8826661 35.873237,10.4384757 C33.627448,9.22477216 32.5053349,7.58955695 32.5053349,5.53283003 C32.5053349,4.46380125 32.8061799,3.5097302 33.4078701,2.67218095 C34.0095603,1.83384967 34.875369,1.17851235 36.0021706,0.707733029 C37.1281908,0.23695371 38.3925216,0 39.7959444,0 C41.2079627,0 42.4652608,0.25415827 43.5701827,0.766384937 C44.6743233,1.27782958 45.5315364,1.99729299 46.1426036,2.93024935 C46.7536707,3.8632057 47.0592043,4.95022107 47.0592043,6.10292658 L42.9872465,6.10292658 C42.9872465,5.2215839 42.7012483,4.49977442 42.1308148,3.99693205 C41.5603813,3.49487172 40.75943,3.25087978 39.7279612,3.25087978 C38.731656,3.25087978 37.957273,3.46202665 37.4055934,3.88275634 C36.8531324,4.30505008 36.5772926,4.8587241 36.5772926,5.54847054 C36.5772926,6.1897314 36.9007988,6.72932896 37.5478111,7.16413511 C38.1948234,7.59972328 39.1473692,8.00715854 40.4062301,8.38800493 L40.4070115,8.38644088 Z M24.6903953,23.1190183 C23.812084,25.0396728 22.3695904,26 20.3504119,26 C19.7815412,26 19.1650041,25.9139772 18.623483,25.7419316 L18.623483,22.7647607 L19.2111077,22.7788372 C19.9534527,22.7788372 20.4980995,22.6654435 20.8645835,22.4394381 C21.231849,22.2126508 21.5186286,21.8372786 21.7264852,21.3109754 L22.1890833,20.1027461 L17.0418974,5.3568743 L21.263887,5.3568743 L23.992591,14.5034439 L26.708011,5.3568743 L30.9167165,5.3568743 L25.0146829,22.3455951 L24.6903953,23.1198003 L24.6903953,23.1190183 Z M10.9835806,4.2072969 C10.3725135,3.63172617 9.44575431,3.34472283 8.19705184,3.34472283 C6.83895117,3.34472283 5.82936194,3.83192468 5.15578151,4.80711042 C4.48141967,5.77995007 4.12978255,7.29082323 4.12978255,9.33816585 L4.12978255,10.8341805 C4.12978255,12.9722381 4.44000463,14.537853 5.08779834,15.5263332 C5.73402921,16.5132493 6.74127419,17.0098355 8.13531999,17.0098355 C9.39339945,17.0098355 10.3310984,16.7283063 10.952324,16.1527356 C11.5719867,15.5771649 11.9275309,14.6457726 12.0181752,13.4938491 L16.0893515,13.4938491 C15.936194,15.5951514 15.1516525,17.2866725 13.7341643,18.5097603 C12.3198017,19.7328481 10.4537807,20.3326616 8.13610141,20.3326616 C5.60196994,20.3326616 3.61951803,19.4786898 2.16608462,17.7707462 C0.714995466,16.0628027 0,13.7198544 0,10.7372094 L0,9.52819803 C0,7.62631215 0.323506145,5.94964959 0.992398078,4.49977442 C1.66285284,3.05068126 2.6099288,1.93785905 3.85237994,1.16365386 C5.09795674,0.389448672 6.54357599,0 8.19080052,0 C10.4709718,0 12.3088618,0.612325924 13.7021262,1.8346317 C15.096172,3.05850152 15.9018117,4.74767648 16.1190453,6.98426926 L12.0455247,6.98426926 C11.9462849,5.69705537 11.5946478,4.78286763 10.9827992,4.20807892 L10.9835806,4.2072969 Z" id="New_CySEC"></path></g></g></svg> \n                <div class="regulation-text">License no. 247/14 by CySEC, an independent public oversight agency <br>responsible for regulating the investment services market in Cyprus.</div></a>', Co(t, "class", "regulation-wrap")
            },
            m: function(e, n) {
                bo(e, t, n)
            },
            d: function(e) {
                e && wo(t)
            }
        }
    }

    function sp(e) {
        var t, n, r, i, o, a, s, c, u, l, f, d, h, p, g, v, m = e[4] && function(e) {
                var t, n = new op({});
                return {
                    c: function() {
                        Ko(n.$$.fragment)
                    },
                    m: function(e, r) {
                        Xo(n, e, r), t = !0
                    },
                    i: function(e) {
                        t || (qo(n.$$.fragment, e), t = !0)
                    },
                    o: function(e) {
                        Vo(n.$$.fragment, e), t = !1
                    },
                    d: function(e) {
                        Yo(n, e)
                    }
                }
            }(),
            y = e[0] && ap();
        return {
            c: function() {
                t = xo("div"), n = xo("img"), i = Eo(), o = xo("img"), s = Eo(), c = xo("div"), u = xo("div"), l = So(e[3]), f = Eo(), d = xo("div"), h = xo("progress"), p = Eo(), m && m.c(), g = Eo(), y && y.c(), n.src !== (r = Iu.resourceHost + "/map.png") && Co(n, "src", r), Co(n, "width", "100%"), Co(n, "height", "auto"), Co(n, "class", "map svelte-1dkn74e"), Lo(n, "opacity", "0.25"), Co(n, "alt", "map"), o.src !== (a = Iu.resourceHost + "/preloader_blue.gif") && Co(o, "src", a), Co(o, "id", "gif-preloader"), Co(o, "alt", "preloader"), Co(u, "id", "textProgress"), Co(u, "class", "svelte-1dkn74e"), Co(h, "max", e[2]), h.value = e[1], Co(h, "id", "progress"), Co(h, "class", "svelte-1dkn74e"), Co(d, "id", "progressWrap"), Co(d, "class", "svelte-1dkn74e"), Co(c, "class", "logo-svg-container"), Co(t, "class", "loader-page loader-page_background main-loader-wrap svelte-1dkn74e"), Lo(t, "position", "absolute"), Lo(t, "width", "100%"), Lo(t, "height", "100%"), Lo(t, "left", "0"), Lo(t, "top", "0"), Co(t, "id", "preloader")
            },
            m: function(e, r) {
                bo(e, t, r), yo(t, n), yo(t, i), yo(t, o), yo(t, s), yo(t, c), yo(c, u), yo(u, l), yo(c, f), yo(c, d), yo(d, h), yo(c, p), m && m.m(c, null), yo(c, g), y && y.m(c, null), v = !0
            },
            p: function(e, t) {
                var n = t[0];
                (!v || 8 & n) && ko(l, e[3]), (!v || 4 & n) && Co(h, "max", e[2]), (!v || 2 & n) && (h.value = e[1]), e[0] ? y || ((y = ap()).c(), y.m(c, null)) : y && (y.d(1), y = null)
            },
            i: function(e) {
                v || (qo(m), v = !0)
            },
            o: function(e) {
                Vo(m), v = !1
            },
            d: function(e) {
                e && wo(t), m && m.d(), y && y.d()
            }
        }
    }

    function cp(e, t, n) {
        var r = t.isRegular,
            i = Cs === Ss.Windows || Cs === Ss.Mac,
            o = 0,
            a = 0,
            s = "";
        return Hu.subscribe(function(e) {
            n(3, s = e)
        }), Fu.subscribe(function(e) {
            n(2, a = e)
        }), ju.subscribe(function(e) {
            n(1, o = e)
        }), e.$set = function(e) {
            "isRegular" in e && n(0, r = e.isRegular)
        }, [r, o, a, s, i]
    }
    var up = function(e) {
        function t(t) {
            e.call(this), Zo(this, t, cp, sp, mo, {
                isRegular: 0
            })
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
    }(Qo);

    function lp(e) {
        var t, n, r, i, o, a;
        return {
            c: function() {
                t = xo("div"), n = xo("div"), r = So(e[0]), i = Eo(), o = xo("div"), Co(n, "id", "debug_log_switch"), Co(n, "class", "svelte-1a7dli"), Co(o, "id", "debug_log_messages"), Co(o, "class", "svelte-1a7dli"), _o(o, "active", e[2]), _o(o, "inactive", !e[2]), Co(t, "id", "debug_log_container"), Co(t, "class", "svelte-1a7dli"), a = Ao(n, "click", e[3])
            },
            m: function(a, s) {
                bo(a, t, s), yo(t, n), yo(n, r), yo(t, i), yo(t, o), e[5](o)
            },
            p: function(e, t) {
                var n = t[0];
                1 & n && ko(r, e[0]), 4 & n && _o(o, "active", e[2]), 4 & n && _o(o, "inactive", !e[2])
            },
            i: fo,
            o: fo,
            d: function(n) {
                n && wo(t), e[5](null), a()
            }
        }
    }

    function fp(e, t, n) {
        var r, i = "Open Log",
            o = !1;

        function a() {
            n(2, o = !o), n(0, i = o ? "Hide Log" : "Open Log")
        }

        function s(e) {
            e.level && (r.insertAdjacentHTML("afterbegin", e.level + ": " + e.msg + "<br>"), o || "log" === e.level || a())
        }
        return Do(function() {
            Fh.subscribe(s)
        }), [i, r, o, a, s, function(e) {
            Ro[e ? "unshift" : "push"](function() {
                n(1, r = e)
            })
        }]
    }
    var dp = function(e) {
        function t(t) {
            e.call(this), Zo(this, t, fp, lp, mo, {})
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
    }(Qo);

    function hp(e) {
        var t;
        return {
            c: function() {
                (t = xo("div")).innerHTML = '<p class="label svelte-1odg4gi">Sorry. Your browser is no longer supported.</p>', Co(t, "class", "horizontal-block svelte-1odg4gi")
            },
            m: function(e, n) {
                bo(e, t, n)
            },
            p: fo,
            i: fo,
            o: fo,
            d: function(e) {
                e && wo(t)
            }
        }
    }
    var pp = function(e) {
            function t(t) {
                e.call(this), Zo(this, t, null, hp, mo, {})
            }
            return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
        }(Qo),
        gp = $o.document;

    function vp(e) {
        var t, n = new Xh({});
        return {
            c: function() {
                Ko(n.$$.fragment)
            },
            m: function(e, r) {
                Xo(n, e, r), t = !0
            },
            i: function(e) {
                t || (qo(n.$$.fragment, e), t = !0)
            },
            o: function(e) {
                Vo(n.$$.fragment, e), t = !1
            },
            d: function(e) {
                Yo(n, e)
            }
        }
    }

    function mp(e) {
        var t, n = new up({
            props: {
                isRegular: e[2]
            }
        });
        return {
            c: function() {
                Ko(n.$$.fragment)
            },
            m: function(e, r) {
                Xo(n, e, r), t = !0
            },
            p: function(e, t) {
                var r = {};
                4 & t && (r.isRegular = e[2]), n.$set(r)
            },
            i: function(e) {
                t || (qo(n.$$.fragment, e), t = !0)
            },
            o: function(e) {
                Vo(n.$$.fragment, e), t = !1
            },
            d: function(e) {
                Yo(n, e)
            }
        }
    }

    function yp(e) {
        var t, n = new Ih({});
        return {
            c: function() {
                Ko(n.$$.fragment)
            },
            m: function(e, r) {
                Xo(n, e, r), t = !0
            },
            i: function(e) {
                t || (qo(n.$$.fragment, e), t = !0)
            },
            o: function(e) {
                Vo(n.$$.fragment, e), t = !1
            },
            d: function(e) {
                Yo(n, e)
            }
        }
    }

    function bp(e) {
        var t, n = new pp({});
        return {
            c: function() {
                Ko(n.$$.fragment)
            },
            m: function(e, r) {
                Xo(n, e, r), t = !0
            },
            i: function(e) {
                t || (qo(n.$$.fragment, e), t = !0)
            },
            o: function(e) {
                Vo(n.$$.fragment, e), t = !1
            },
            d: function(e) {
                Yo(n, e)
            }
        }
    }

    function wp(e) {
        var t, n, r, i, o, a, s, c, u, l, f, d, h, p, g, v;
        gp.title = n = Iu.title;
        var m = e[1] && vp(),
            y = e[4] && mp(e),
            b = e[0] && yp(),
            w = e[3] && bp(),
            x = Ru.debug && function(e) {
                var t, n = new dp({});
                return {
                    c: function() {
                        Ko(n.$$.fragment)
                    },
                    m: function(e, r) {
                        Xo(n, e, r), t = !0
                    },
                    i: function(e) {
                        t || (qo(n.$$.fragment, e), t = !0)
                    },
                    o: function(e) {
                        Vo(n.$$.fragment, e), t = !1
                    },
                    d: function(e) {
                        Yo(n, e)
                    }
                }
            }();
        return {
            c: function() {
                t = xo("meta"), r = xo("meta"), i = xo("meta"), o = xo("meta"), a = xo("meta"), s = xo("meta"), c = xo("meta"), u = xo("meta"), l = Eo(), m && m.c(), f = Eo(), y && y.c(), d = Eo(), b && b.c(), h = Eo(), w && w.c(), p = Eo(), x && x.c(), g = So(""), Co(t, "http-equiv", "X-UA-Compatible"), Co(t, "content", "IE=edge"), Co(r, "name", "description"), Co(r, "content", ""), Co(i, "name", "mobile-web-app-capable"), Co(i, "content", "yes"), Co(o, "name", "apple-mobile-web-app-capable"), Co(o, "content", "yes"), Co(a, "name", "application-name"), Co(a, "content", Iu.title), Co(s, "name", "apple-mobile-web-app-title"), Co(s, "content", Iu.title), Co(c, "name", "msapplication-starturl"), Co(c, "content", "/traderoom/"), Co(u, "name", "viewport"), Co(u, "content", "width=device-width, initial-scale=1, shrink-to-fit=no")
            },
            m: function(e, n) {
                yo(gp.head, t), yo(gp.head, r), yo(gp.head, i), yo(gp.head, o), yo(gp.head, a), yo(gp.head, s), yo(gp.head, c), yo(gp.head, u), bo(e, l, n), m && m.m(e, n), bo(e, f, n), y && y.m(e, n), bo(e, d, n), b && b.m(e, n), bo(e, h, n), w && w.m(e, n), bo(e, p, n), x && x.m(e, n), bo(e, g, n), v = !0
            },
            p: function(e, t) {
                var r = t[0];
                (!v || 0 & r) && n !== (n = Iu.title) && (gp.title = n), e[1] ? m ? qo(m, 1) : ((m = vp()).c(), qo(m, 1), m.m(f.parentNode, f)) : m && (Wo(), Vo(m, 1, 1, function() {
                    m = null
                }), zo()), e[4] ? y ? (y.p(e, r), qo(y, 1)) : ((y = mp(e)).c(), qo(y, 1), y.m(d.parentNode, d)) : y && (Wo(), Vo(y, 1, 1, function() {
                    y = null
                }), zo()), e[0] ? b ? qo(b, 1) : ((b = yp()).c(), qo(b, 1), b.m(h.parentNode, h)) : b && (Wo(), Vo(b, 1, 1, function() {
                    b = null
                }), zo()), e[3] ? w ? qo(w, 1) : ((w = bp()).c(), qo(w, 1), w.m(p.parentNode, p)) : w && (Wo(), Vo(w, 1, 1, function() {
                    w = null
                }), zo())
            },
            i: function(e) {
                v || (qo(m), qo(y), qo(b), qo(w), qo(x), v = !0)
            },
            o: function(e) {
                Vo(m), Vo(y), Vo(b), Vo(w), Vo(x), v = !1
            },
            d: function(e) {
                wo(t), wo(r), wo(i), wo(o), wo(a), wo(s), wo(c), wo(u), e && wo(l), m && m.d(e), e && wo(f), y && y.d(e), e && wo(d), b && b.d(e), e && wo(h), w && w.d(e), e && wo(p), x && x.d(e), e && wo(g)
            }
        }
    }

    function xp(e, t) {
        return {
            time: Date.now(),
            device_id: window.deviceId ? window.deviceId : "undefined",
            category: e,
            name: t,
            parameters: {},
            platform_id: window.platformId,
            user_id: window.userId
        }
    }

    function Tp() {
        try {
            var e = xp("button_pressed", "traderoom_close");
            localStorage.setItem("close_event", JSON.stringify(e))
        } catch (e) {}
    }

    function Sp(e, t, n) {
        var r, i = !1,
            o = !1,
            a = !1,
            s = !1,
            c = Ls !== As.Desktop,
            u = (cs.iphone() || cs.ipad() || cs.android(), 6e4),
            l = 2 * u;
        _s(), new URL(window.location).searchParams.forEach(function(e, t) {
            switch (t) {
                case "debug":
                    Ru.debug = 0 !== parseInt(e, 10);
                    break;
                case "lang":
                    Ru.lang = e;
                    break;
                case "asm":
                    Ru.asm = 0 !== parseInt(e, 10);
                    break;
                case "loglevel":
                    Ru.logLevel = parseInt(e, 10);
                    break;
                case "mobile":
                    Ru.noMobileCheck = 0 !== parseInt(e, 10);
                    break;
                case "showfps":
                    Ru.showfps = 0 !== parseInt(e, 10);
                    break;
                case "vsync":
                    Ru.vsync = parseInt(e, 10);
                    break;
                case "crashmode":
                    Ru.crashMode = 0 !== parseInt(e, 10);
                    break;
                case "asm":
                    Ru.asm = 0 !== parseInt(e, 10);
                    break;
                case "redirectNoAuth":
                    Ru.redirectNoAuth = e;
                    break;
                case "preload":
                    Ru.preload = e.split(",")
            }
        }), window.platformId = Iu.platform.web, window.webPSupported = !1, (r = new Image).onerror = function() {
            window.webPSupported = !1
        }, r.onload = function() {
            window.webPSupported = !0
        }, r.async = !1, r.src = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=";
        var f = !1;

        function d() {
            fetch("/api/register/getregdata", {
                method: "GET",
                credentials: "include"
            }).then(function(e) {
                return e.json()
            }).then(function(e) {
                var t;
                e.isSuccessful && e.result && e.result.profile ? (n(2, a = e.result.profile.kyc.isRegulatedUser), e.result.profile.id && (window.userId = e.result.profile.id, fetch("/api/tag/add", {
                    method: "POST",
                    body: JSON.stringify({
                        type: 5,
                        name: "visit_traderoom"
                    })
                }).catch(function(e) {
                    console.warn("Failed to set tag", e)
                })), (t = e.result.profile).kyc && (t.kyc.isRegulatedUser && "iqoption.com" === location.host && (location.host = "eu.iqoption.com"), t.kyc.isRegulatedUser || "eu.iqoption.com" !== location.host || (location.host = "iqoption.com")), setTimeout(function() {
                    setInterval(Tp, u);
                    var e = xp("page_open", "traderoom_show");
                    try {
                        var t = localStorage.getItem("close_event");
                        if (t) {
                            localStorage.removeItem("close_event");
                            var n = JSON.parse(t);
                            n && Math.abs(n.time - e.time) > l ? Wu([n, e]) : Wu(e)
                        } else Wu(e)
                    } catch (t) {
                        Wu(e)
                    }
                }, 800), n(1, o = !0)) : Ru.redirectNoAuth ? location.href = decodeURIComponent(Ru.redirectNoAuth) : (console.error("getregdata failed"), localStorage.setItem("redirect", '"' + location.href + '"'), location.href = "/login" + location.search)
            }).catch(function(e) {
                console.error("getregdata ", e), Ru.redirectNoAuth ? location.href = decodeURIComponent(Ru.redirectNoAuth) : (localStorage.setItem("redirect", '"' + location.href + '"'), location.href = "/login" + location.search)
            })
        }
        if (Uu.subscribe(function(e) {
                n(4, f = e)
            }), Gu.subscribe(function(e) {
                n(0, i = e)
            }), window.isInStandaloneMode = function() {
                return window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches && c || window.navigator.standalone
            }, function() {
                if ("function" != typeof window.fetch) return !0;
                if (!window.HTMLCanvasElement) return !0;
                try {
                    var e = document.createElement("canvas");
                    return !(window.WebGLRenderingContext && (e.getContext("webgl") || e.getContext("experimental-webgl")))
                } catch (e) {
                    return !0
                }
                return !1
            }()) n(3, s = !0);
        else try {
            ! function() {
                try {
                    if ("serviceWorker" in navigator) {
                        var e = Iu.workers.prod;
                        self.location.hostname.startsWith("int.") && Iu.workers.int && (e = Iu.workers.int), navigator.serviceWorker.register(self.location.origin + e).then(function(e) {
                            console.log("ServiceWorker registration successful with scope: ", e.scope)
                        }, function(e) {
                            console.log("ServiceWorker registration failed: ", e)
                        })
                    } else console.log("Service workers are not supported.")
                } catch (e) {}
            }(), c && !Ru.noMobileCheck || (c && (window.platformId = Iu.platform.webMobile), isInStandaloneMode() && ((cs.iphone() || cs.ipad()) && (window.platformId = Iu.platform.iphone), cs.android() && (window.platformId = Iu.platform.android))), isInStandaloneMode() && -1 == document.cookie.indexOf("ssid") ? (console.log("Waiting for token store"), new Promise(function(e) {
                if (navigator.serviceWorker.controller) return e();
                navigator.serviceWorker.addEventListener("controllerchange", function(t) {
                    return e()
                })
            }).then(function(e) {
                console.log("Requesting token"), fetch("/traderoom/token_store").then(function(e) {
                    return e.text()
                }).then(function(e) {
                    e.split(";").forEach(function(e) {
                        document.cookie = e.trim() + ";path=/;max-age=2592000;domain=" + document.location.hostname + ";"
                    }), console.log("Requesting reg data"), d()
                }).catch(function(e) {
                    console.error("Wailed to read token store. Falling back to login page"), Ru.redirectNoAuth ? location.href = decodeURIComponent(Ru.redirectNoAuth) : (console.error("getregdata " + e), localStorage.setItem("redirect", '"' + location.href + '"'), location.href = "/login" + location.search)
                })
            })) : (console.log("Requesting reg data"), d())
        } catch (e) {
            console.error("Exception", e), n(0, i = !0)
        }
        return [i, o, a, s, f]
    }
    return new(function(e) {
        function t(t) {
            e.call(this), Zo(this, t, Sp, wp, mo, {})
        }
        return e && (t.__proto__ = e), t.prototype = Object.create(e && e.prototype), t.prototype.constructor = t, t
    }(Qo))({
        target: document.body,
        props: {}
    })
}();