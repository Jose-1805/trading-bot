function reg_page() {
    $.get(chrome.extension.getURL("/reg.html"), function(e) {
        document.getElementById("holder").innerHTML = e,
        reg_function("web_main")
    })
}
function reg_function(e) {
    domain = "iqoption.com",
    chrome.runtime.sendMessage({
        msg: "request",
        url: "https://iqbot.com/api/"
    }, function(t) {
        iqbot_json = JSON.parse(t.answer),
        aff = iqbot_json.a_id + "",
        console.log(t.answer),
        chrome.runtime.sendMessage({
            msg: "request",
            url: "https://api.myip.com"
        }, function(t) {
            for (key in iqbot_json.countries)
                JSON.parse(t.answer).cc === iqbot_json.countries[key].id && (domain = iqbot_json.countries[key].domain);
            chrome.runtime.sendMessage({
                msg: "request",
                url: "https://tracker.affiliate." + domain + "/hit?a=" + aff + "&b=" + e
            }),
            console.log("https://tracker.affiliate." + domain + "/hit?a=" + aff + "&b=" + e)
        })
    }),
    document.getElementById("email").onclick = function() {
        "block" === document.getElementById("wrong-email").style.display && (document.getElementById("wrong-email").style.display = "none")
    }
    ,
    document.getElementById("wrong-email").onclick = function() {
        "block" === document.getElementById("wrong-email").style.display && (document.getElementById("wrong-email").style.display = "none")
    }
    ,
    document.getElementById("password").onclick = function() {
        "block" === document.getElementById("wrong-password").style.display && (document.getElementById("wrong-password").style.display = "none")
    }
    ,
    document.getElementById("wrong-password").onclick = function() {
        "block" === document.getElementById("wrong-password").style.display && (document.getElementById("wrong-password").style.display = "none")
    }
    ,
    document.getElementById("back-reg_btn").onclick = function() {
        document.getElementById("back-reg").style.display = "none",
        document.getElementById("reg-div").style.display = "block"
    }
    ,
    document.getElementById("reg").onclick = function() {
        check = 0,
        document.getElementById("password").value.length < 6 ? document.getElementById("wrong-password").style.display = "block" : check += 1,
        !1 === function(e) {
            return /\S+@\S+\.\S+/.test(e)
        }(document.getElementById("email").value) ? document.getElementById("wrong-email").style.display = "block" : check += 1,
        2 === check && (document.getElementById("reg").disabled = !0,
        console.log(domain + " " + aff + " " + e),
        chrome.runtime.sendMessage({
            msg: "del-cookies",
            domain: domain
        }),
        chrome.runtime.sendMessage({
            msg: "new-reg",
            domain: domain,
            aff: aff,
            afftrack: e,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }, function(e) {
            document.getElementById("reg").disabled = !1,
            console.log(e.answer),
            reg_json = JSON.parse(e.answer),
            !1 === reg_json.isSuccessful && (4 === reg_json.code && (ga("send", "event", "registration", "already"),
            document.getElementById("reg-div").style.display = "none",
            document.getElementById("back-reg").style.display = "block"),
            5 === reg_json.code && (ga("send", "event", "registration", "vpn"),
            document.getElementById("reg-div").style.display = "none",
            document.getElementById("vpn").style.display = "block")),
            !0 === reg_json.isSuccessful && (ga("send", "event", "registration", "success"),
            document.getElementById("reg-div").style.display = "none",
            document.getElementById("to-platform").style.display = "block",
            document.getElementById("to-platform_btn").onclick = function() {
                document.location.href = "https://" + domain + "/traderoom"
            }
            )
        }))
    }
}
function main_function() {
    function e() {
        0 == step1 ? $.get(chrome.extension.getURL("/reg.html"), function(e) {
            Swal.fire({
                title: "IQBot Activation Guide",
                width: "100%",
                html: '<p class="sub-title">Activation allows you to remove the limit on earnings, open the possibility of trading on signals and the real account. Activation consists of 2 steps that must be performed sequentially.</p><table class="activation-step"><thead><th class="wrong">Step 1. Register an IQ Option account through the IQBot system</th></thead><tbody><tr><td id="td-first-step">' + e + '</td></tr></tbody></table><table class="activation-step"><thead><th class="wrong">Step 2. Deposit $ 100 or more</th></thead></table>',
                showCloseButton: !0,
                showConfirmButton: !1,
                showCancelButton: !0,
                cancelButtonText: "Close",
                animation: !1
            }),
            reg_function("web_platform")
        }) : (console.log(add_text),

        Swal.fire({
            title: "IQBot Activation Guide",
            width: "100%",
            html: '<p class="sub-title">Activation allows you to remove the limit on earnings, open the possibility of trading on signals and the real account. Activation consists of 2 steps that must be performed sequentially.</p><table class="activation-step"><thead><th class="ok">Step 1. Register an IQ Option account through the IQBot system</th></thead></table><table class="activation-step"><thead><th class="wrong">Step 2. Deposit $ 100 or more' + add_text + '</th></thead><tbody><tr><td>The amount of the deposit is determined by the strategy used in the robot, it is necessary to have a margin to cover in case of an unsuccessful bet.<br><a href="https://' + document.domain + '/counting" target="_blank" onclick="$(\'.swal2-close\').click();$(\'#popup-close\').click()"><button class="make-deposit"><i class="far fa-wallet"></i> Deposit</button></a><p class="rec-bal">For the first strategy, the recommended deposit amount is $ 100 or more.<br>For the second strategy, the recommended deposit amount is $ 1000 or more.</p></td></tr></tbody></table>',
            showCloseButton: !0,
            showConfirmButton: !1,
            showCancelButton: !0,
            cancelButtonText: "Close",
            animation: !1
        }))
    }

    function t() {
        document.getElementById("show-me").style.opacity = "1",
        document.body.clientWidth <= 840 ? document.getElementById("show-me").style.top = "135px" : document.getElementById("show-me").style.top = "72px",
        document.getElementById("glcanvas").onclick = function() {
            document.getElementById("show-me").style.left = "90px",
            document.getElementById("show-me").style.top = Number.parseInt(document.getElementById("show-me").style.top.slice(0, -2)) + 95 + "px",
            document.getElementById("show-me").style.height = "41px",
            document.getElementById("show-me").style.width = "228px",
            document.getElementById("glcanvas").onclick = function() {
                document.getElementById("show-me").style.left = "94px",
                document.getElementById("show-me").style.top = Number.parseInt(document.getElementById("show-me").style.top.slice(0, -2)) + 37 + "px",
                document.getElementById("show-me").style.height = "40px",
                document.getElementById("show-me").style.width = "220px",
                document.getElementById("glcanvas").onclick = function() {
                    document.getElementById("show-me").style.left = "74px",
                    document.getElementById("show-me").style.top = Number.parseInt(document.getElementById("show-me").style.top.slice(0, -2)) + 90 + "px",
                    document.getElementById("show-me").style.height = "90px",
                    document.getElementById("show-me").style.width = "260px",
                    document.getElementById("glcanvas").onclick = function() {
                        $("#show-me").attr("style", "")
                    }
                }
            }
        }
    }
    function n() {
        function t() {
            console.log("first_launch func", baltype),
            1 == baltype ? $("li.top-select.real").click() : $("li.top-select.demo").click(),
            $("#min_amount").on("keydown", function() {
                var e = event.keyCode || event.charCode;
                8 != e && 46 != e || $("#min_amount").val($("#min_amount").val().slice(0, -1))
            }),
            $("#max_balance").on("keydown", function() {
                var e = event.keyCode || event.charCode;
                8 != e && 46 != e || $("#min_amount").val($("#min_amount").val().slice(0, -1))
            }),
            first = 0,
            localStorage.getItem("time") && document.getElementById(localStorage.getItem("time")).click(),
            1 == parseInt(localStorage.getItem("auto")) && $(".div-auto").click(),
            1 == parseInt(localStorage.getItem("signals")) && document.getElementsByClassName("div-signals")[0].click(),
            1 == parseInt(localStorage.getItem("balance")) && document.getElementsByClassName("div-balance")[0].click(),
            document.getElementById("strategy-1").onclick = function(e) {
                localStorage.setItem("strategy", "strategy-1")
            }
            ,
            document.getElementById("strategy-2").onclick = function(e) {
                localStorage.setItem("strategy", "strategy-2")
            }
            ,
            localStorage.getItem("strategy") && document.getElementById(localStorage.getItem("strategy")).click()
        }
        $(".blur").click(function() {
            1 == first && t(),
            $("#glcanvas").hasClass("blur") ? ($("#glcanvas").removeClass("blur"),
            $("#robot_div").removeClass("zoomIn faster"),
            $("#robot_div").addClass("zoomOut faster"),
            $("#glcanvas").removeClass("add-blur"),
            $("#openButton").removeClass("add-blur")) : ($("#glcanvas").addClass("blur"),
            $("#robot_div").removeClass("zoomOut faster"),
            $("#robot_div").addClass("zoomIn faster"),
            $("#glcanvas").addClass("add-blur"),
            $("#openButton").addClass("add-blur"))
        }),
        document.getElementById("openButton").onclick = function() {
            1 == start ? Swal.fire({
                title: "The robot is already running",
                text: "To open the settings of the robot you need to stop it.",
                type: "warning",
                showCancelButton: !0,
                confirmButtonColor: "#DB4931",
                confirmButtonText: "Stop the robot",
                cancelButtonText: "Cancel"
            }).then(function(e) {
                e.value ? end("Thank you for using our robot.") : document.getElementById("popup-close").click()
            }) : (ws.send('{"msg":"","name":"api_option_init_all"}'),

            1 !== step1 || 1 !== step2 ? (document.getElementById("signals-wrong").style.display = "block",
            document.getElementById("signals-ok").style.display = "none",
            document.getElementById("balance-styler").className.indexOf("checked") < 0 && document.getElementById("balance-styler").click(),
            $("#balance-styler").addClass("disabled"),
            $("#max_balance").attr("disabled", !0),
            $(".max-bal").addClass("off"),
            document.getElementsByClassName("max-bal")[0].onclick = function() {
                Swal.fire({
                    title: "Robot activation",
                    text: "To change this filter you need to activate the robot",
                    type: "warning",
                    showCancelButton: !0,
                    confirmButtonColor: "#2CAC40",
                    confirmButtonText: "Activation",
                    cancelButtonText: "Cancel"
                }).then(function(t) {
                    t.value && e()
                })
            }
            ,
            document.getElementById("max_balance").value = balances[1].amount + 20) : (document.getElementById("content-main").style.display = "block",
            document.getElementById("content-demo").style.display = "none",
            document.getElementById("signals-wrong").style.display = "none",
            document.getElementById("signals-ok").style.display = "block",
            $("#balance-styler").removeClass("disabled"),
            $("#max_balance").attr("disabled", !1),
            $(".max-bal").removeClass("off"),
            $(".max-bal").attr("onclick", "")))
        }
        ,
        document.getElementById("stop-robot").onclick = function() {
            end("Thank you for using our robot.")
        }
        ,
        jQuery(document).ready(function(e) {
            e('[data-toggle="tooltip"]').tooltip()
        }),
        document.getElementById("start-button").onclick = function() {
            for (1 == $(".jq-selectbox.acc.demo").length ? acc_type = 0 : acc_type = 1,
            min_amount = document.getElementById("min_amount").value,
            time = parseInt($("#time-styler .jq-selectbox__select-text").text().replace(/\D+/g, "")),
            key = 0; key < $("#asset-styler")[0].classList.length; key++)
                -1 != $("#asset-styler")[0].classList[key].indexOf("asset-") && (asset = $("#asset-styler")[0].classList[key].split("-")[1]);
            -1 != document.getElementById("auto-styler").className.indexOf("checked") ? auto = 1 : auto = 0,
            -1 != document.getElementById("str1-styler").className.indexOf("checked") ? strategy = 1 : strategy = 2,
            -1 != document.getElementById("signals-styler").className.indexOf("checked") ? signals = 1 : signals = 0,
            -1 != document.getElementById("balance-styler").className.indexOf("checked") ? balance_flag = 1 : balance_flag = 0,
            max_balance = document.getElementById("max_balance").value,
            start_new_bot(acc_type, min_amount, time, asset, auto, strategy, signals, balance_flag, max_balance)
        }	
        ,
        document.getElementById("close-panel").onclick = function() {
            $("#panel").hasClass("hide") ? $("#panel").removeClass("hide") : $("#panel").addClass("hide")
        }
    }
    1 !== localStorage.getItem("event_install") && (ga("send", "event", "platform", "install"),
    localStorage.setItem("event_install", "1")),
    domain = document.domain,
    check_id(),
    $.get(chrome.extension.getURL("/iqbot.html"), function(o) {
        chrome.runtime.sendMessage({
            msg: "get-lang",
            domain: domain
        }, function(e) {
            lang = e.lang
        }),
        chrome.runtime.sendMessage({
            msg: "get-ssid",
            domain: domain
        }, function(e) {
            ssid = e.ssid
        }),
        chrome.runtime.sendMessage({
            msg: "get-aff",
            domain: domain
        }, function(e) {
            aff = e.aff
        }),
        $("body").append(o),
        $("select").styler(),
        $("input").styler(),
        connect(),
        n(),
        setTimeout('document.getElementById("openButton").style.display="block"', 5e3),
        $("li.asset").click(function(e) {
            $("li.asset.sel")
        }),
        document.getElementById("min_amount").onchange = function(e) {
            localStorage.setItem("min_amount", e.target.value)
        }
        ,
        parseInt(localStorage.getItem("min_amount")) ? document.getElementById("min_amount").value = parseInt(localStorage.getItem("min_amount")) : document.getElementById("min_amount").value = "1",
        document.getElementById("max_balance").onchange = function(e) {
            localStorage.setItem("max_balance", e.target.value)
        }
        ,
        parseInt(localStorage.getItem("max_balance")) ? document.getElementById("max_balance").value = parseInt(localStorage.getItem("max_balance")) : document.getElementById("max_balance").value = "1000000",
        document.getElementById("time-1-styler").onclick = function() {
            localStorage.setItem("time", "time-1-styler")
        }
        ,
        document.getElementById("time-5-styler").onclick = function() {
            localStorage.setItem("time", "time-5-styler")
        }
        ,
        document.getElementById("time-10-styler").onclick = function() {
            localStorage.setItem("time", "time-10-styler")
        }
        ,
        document.getElementById("time-15-styler").onclick = function() {
            localStorage.setItem("time", "time-15-styler")
        }
        ,
        document.getElementById("auto").onchange = function() {
            $(".div-auto .checked").length > 0 ? ($(".div-auto .checked").closest(".div-auto").addClass("checked"),
            $(".jq-selectbox.asset").addClass("disabled"),
            $("li.asset").closest(".jq-selectbox__dropdown").addClass("disabled"),
            localStorage.setItem("auto", "1")) : ($(".div-auto .jq-checkbox").closest(".div-auto").removeClass("checked"),
            $(".jq-selectbox.asset").removeClass("disabled"),
            $("li.asset").closest(".jq-selectbox__dropdown").removeClass("disabled"),
            localStorage.setItem("auto", "0"))
        }
        ,
        document.getElementById("signals").onchange = function() {
            $(".div-signals .checked").length > 0 ? ($(".div-signals .checked").closest(".div-signals").addClass("checked"),
            localStorage.setItem("signals", "1")) : ($(".div-signals .jq-checkbox").closest(".div-signals").removeClass("checked"),
            localStorage.setItem("signals", "0"))
        }
        ,
        document.getElementById("balance").onchange = function() {
            $(".div-balance .checked").length > 0 ? ($(".div-balance .checked").closest(".div-balance").addClass("checked"),
            $("table.max-bal").removeClass("disabled"),
            localStorage.setItem("balance", "1")) : ($(".div-balance .jq-checkbox").closest(".div-balance").removeClass("checked"),
            $("table.max-bal").addClass("disabled"),
            localStorage.setItem("balance", "0"))
        }
        ,
        document.getElementById("str1").onchange = function() {
            $(".div-str .jq-radio").closest(".div-str").removeClass("checked"),
            $(".div-str .checked").closest(".div-str").addClass("checked")
        }
        ,
        document.getElementById("str2").onchange = function() {
            $(".div-str .jq-radio").closest(".div-str").removeClass("checked"),
            $(".div-str .checked").closest(".div-str").addClass("checked")
        }
        ;
        var a = document.createElement("canvas");
        a.id = "pixel_color",
        document.body.appendChild(a),
        document.getElementById("show-bet").onclick = function() {
            t()
        }
        ;
        for (var l = document.getElementsByClassName("activation"), s = 0; s < l.length; s++)
            l[s].onclick = function() {
                console.log(step1, step2),
                e()
            }
    })
}
-1 !== document.URL.indexOf("traderoom") && main_function(),
-1 !== document.URL.indexOf("iqbot.com/reg") && reg_page();
var first = 1;
