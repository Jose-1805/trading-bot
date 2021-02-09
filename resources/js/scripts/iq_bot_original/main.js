function check_id() {
    console.log("check_id func"),
    domain = document.domain;
    var e = new XMLHttpRequest;
    e.open("GET", "https://" + domain + "/api/register/getregdata", !0),
    e.send(),
    e.onreadystatechange = function() {
        if (4 == e.readyState && 200 == e.status) {
            var t = JSON.parse(e.responseText);
            if (0 != t.isSuccessful) {
                id = t.result.profile.user_id;
                var s = new XMLHttpRequest;
                s.open("GET", "https://iqbot.com/data/check.php?id=" + id, !0),
                s.send(),
                s.onreadystatechange = function() {
                    4 == s.readyState && 200 == s.status && (step1 = s.responseText,
                    console.log("step1=" + step1))
                }
            }
        }
    }
    ,
    chrome.runtime.sendMessage({
        msg: "request",
        url: "https://iqbot.com/api/"
    }, function(e) {
        iqbot_json = JSON.parse(e.answer),
        chrome.runtime.sendMessage({
            msg: "request",
            url: "https://api.myip.com"
        }, function(e) {
            for (key in iqbot_json.currency)
                JSON.parse(e.answer).cc === iqbot_json.currency[key].country && (add_text = " / " + iqbot_json.currency[key].char + " " + 10 * iqbot_json.currency[key].min_deposit + " or more")
        })
    })
}
function connect() {
    (ws = new WebSocket("wss://" + domain + "/echo/websocket")).onopen = function() {
        console.log("Соединение установлено."),
        ws.send('{"name":"ssid","msg":"' + ssid + '"}')
    }
    ,
    ws.onclose = function(e) {
        console.log("Соединение закрыто. Код «" + e.code + "». Причина «" + e.reason + "»."),
        connect()
    }
    ,
    ws.onmessage = function(e) {
        if (console.log("Пришло сообщение «" + e.data + "»."),
        mes = JSON.parse(e.data),
        "timeSync" == mes.name && check_ws(curtime = mes.msg),
        "profile" == mes.name && 1 == flag && ws.send('{"name":"sendMessage","msg":{"name":"get-balances"}}'),
        "profile" == mes.name && (baltype = mes.msg.balance_type,
        char = mes.msg.currency_char,
        $(".char").html(char)),
        "balance-changed" == mes.name) {
            for (key in balances)
                balances[key].id == mes.msg.current_balance.id && (balances[key].amount = mes.msg.current_balance.amount);
            balance_update()
        }

        if ("option-opened" == mes.name && 1 == AssetData.flag && (AssetData.id = mes.msg.option_id,
        AssetData.flag = 0),
        "option-closed" == mes.name && AssetData.id == mes.msg.option_id) {
            for (key in balances)
                balances[key].id == mes.msg.balance_id && (balances[key].amount = balances[key].amount + mes.msg.profit_amount);
            result = mes.msg.result,
            ws.send('{"msg":"","name":"api_option_init_all"}')
        }

        "api_option_init_all_result" == mes.name && (assets = mes,
        assets_update(),
        1 == start && 0 == flag && stavka()),

        "balances" == mes.name && (0 == (balances = mes.msg)[0].amount && "" == char && (char = "$"),
        balance_update(),
        1 == flag && asset_listener(),
        1 != start && 1 != flag || (flag = 0,
        ws.send('{"msg":"","name":"api_option_init_all"}'))),
        "short-active-info" == mes.name && show_panel(mes.msg.image),
        "option" == mes.name && 0 !== mes.status && end(mes.msg.message)
    }
    ,
    ws.onerror = function(e) {
        console.log("Произошла ошибка: «" + e.message + "».")
    }
}
function balance_update() {
    step2 = balances[0].amount >= 1 ? 1 : 0,
    (step1 = 1) && balances[0].amount >= 1 && 1 !== localStorage.getItem("event_ftd") && (ga("send", "event", "platform", "ftd"),
    localStorage.setItem("event_ftd", "1")),
    0 != $(".acc.real .jq-selectbox__select-text").length && $(".acc.real .jq-selectbox__select-text").html(char + balances[0].amount),
    0 != $(".acc.demo .jq-selectbox__select-text").length && $(".acc.demo .jq-selectbox__select-text").html("$" + balances[1].amount),
    $("li.top-select.real").html(char + balances[0].amount),
    $("li.top-select.demo").html("$" + balances[1].amount),
    $("option.top-select.real").html(char + balances[0].amount),
    $("option.top-select.demo").html("$" + balances[1].amount),
    $("select.acc").trigger("refresh"),
    balance_listener()
}
function assets_update() {
    html = "",
    style = "";
    for (key in assets.msg.result[asset_type].actives) {
        style += ".asset-" + key + ", .asset-" + key + " .jq-selectbox__select-text {background-image: url(https://static.cdnpub.info/files" + assets.msg.result[asset_type].actives[key].image + ")}";
        for (ky in assets.msg.result[asset_type].actives[key].schedule)
            !0 === assets.msg.result[asset_type].actives[key].top_traders_enabled && Math.round(curtime / 1e3) > assets.msg.result[asset_type].actives[key].schedule[ky][0] && Math.round(curtime / 1e3) < assets.msg.result[asset_type].actives[key].schedule[ky][1] && -1 === html.indexOf(assets.msg.result[asset_type].actives[key].name.slice(6)) && (html += '<option class="asset asset-' + key + '" value="' + key + '">' + assets.msg.result[asset_type].actives[key].description.slice(6) + " " + (100 - assets.msg.result[asset_type].actives[key].option.profit.commission) + "%</option>")
    }
    for (document.getElementById("assets-style").innerHTML = style,
    document.getElementById("asset").innerHTML = html,
    asset_sort(),
    $("#asset").trigger("refresh"),
    html2 = "",
    arr = $("select#asset option"),
    key = 0; key < arr.length; key++)
        html2 += '<li data-jqfs-class="asset-' + arr[key].value + '" class="asset asset-' + arr[key].value + '" style="">' + arr[key].innerText + "</li>";
    $(".div-auto.checked").length > 0 && (document.getElementsByClassName("div-auto")[0].click(),
    document.getElementsByClassName("div-auto")[0].click())
}
function asset_sort() {
    var e = document.getElementById("asset");
    Array.from(e.children).sort(function(e, t) {
        return t.text.split(" ").pop().localeCompare(e.text.split(" ").pop())
    }).forEach(function(t) {
        e.appendChild(t)
    }),
    e.selectedIndex = 0
}
function stavka() {
    if (assets.msg.result[asset_type].actives[asset].minmax.min > min_amount && (min_amount = assets.msg.result[asset_type].actives[asset].minmax.min),
    console.log(acc_type, min_amount, time, asset, auto, strategy, signals, balance_flag, max_balance, step1, step2),
    1 == auto && best_asset(),
    check_procent(),
    winning = parseFloat((min_amount / 100 * procent).toFixed(2)),
    console.log("winning: ", winning),
    0 == acc_type ? (balance = balances[1].amount,
    idbal = balances[1].id) : (balance = balances[0].amount,
    idbal = balances[0].id),
    (profit = (balance - start_balance).toFixed(2)) < 0 && (profit = 0),
    "loose" === result) {
        switch (amount = Math.ceil((summ / procent * 100).toFixed(2)),
        console.log("summ=" + summ),
        console.log("procent=" + procent),
        console.log("amount=" + amount),
        strategy) {
        case 1:
            summ += amount;
            break;
        case 2:
            summ = summ + amount + winning
        }
        changetrend()
    }
    if ("win" === result) {
        switch (amount = parseFloat(min_amount),
        console.log("summ1=" + summ),
        console.log("procent=" + procent),
        console.log("amount=" + amount),
        strategy) {
        case 1:
            summ = amount + winning;
            break;
        case 2:
            summ = amount + winning + winning
        }
        console.log("summ2=" + summ)
    }
    amount > balance && (amount = balance),
    assets.msg.result[asset_type].actives[asset].minmax.max < amount && (amount = assets.msg.result[asset_type].actives[asset].minmax.max),
    oldbalance = balance,
    timestart = curtime,
    console.log("Время начала: ", timestart),
    timeend = 60 * Math.ceil((Math.ceil(timestart / 1e3) + 35) / 60) + 60 * (time - 1),
    option_type = 3,
    time >= 10 && (timeend = 900 * Math.round(timeend / 900),
    option_type = 1),
    console.log("Время конца: ", timeend),
    AssetData.flag = 1,
    balance >= max_balance ? (text = "The robot has reached the balance filter.",
    1 === step1 && 1 === step2 || (text += "<br>To disable this restriction, activate the robot."),
    end(text),
    0 === acc_type && ga("send", "event", "platform", "win_demo")) : 1 == start && (ws.send('{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":' + idbal + ',"active_id":' + asset + ',"option_type_id":' + option_type + ',"direction":"' + trend + '","expired":' + timeend + ',"refund_value":0,"price":' + amount + ',"value":0,"profit_percent":' + procent + "}}}"),
    ws.send('{"name":"sendMessage","msg":{"name":"get-short-active-info","version":"1.0","body":{"active_id":' + asset + ',"lang":"en_US"}}}'))
}
function changetrend() {
    trend = "put" === trend ? "call" : "put"
}
function check_procent() {
    procent = 100 - assets.msg.result[asset_type].actives[asset].option.profit.commission
}
function best_asset() {
    for (key in assets.msg.result[asset_type].actives)
        for (ky in assets.msg.result[asset_type].actives[key].schedule)
            1 == assets.msg.result[asset_type].actives[key].top_traders_enabled && Math.round(curtime / 1e3) > assets.msg.result[asset_type].actives[key].schedule[ky][0] && Math.round(curtime / 1e3) < assets.msg.result[asset_type].actives[key].schedule[ky][1] && assets.msg.result[asset_type].actives[key].option.profit.commission < assets.msg.result[asset_type].actives[asset].option.profit.commission && (asset = key)
}
function end(e) {
    console.log("Робот остановлен. Причина: " + e),
    Swal.fire({
        title: "Robot is stopped!",
        html: e,
        type: "error",
        confirmButtonText: "OK"
    }),
    start = 0,
    document.getElementById("panel").style.opacity = "0",
    document.getElementById("panel").className += "hide",
    setTimeout(function() {
        document.getElementById("panel").style.display = "block"
    }, 550)
}
function asset_listener() {
    document.getElementById("time-1-styler").onclick = function() {
        asset_type = "turbo",
        assets_update(),
        localStorage.getItem("asset") && document.getElementsByClassName(localStorage.getItem("asset"))[1] && document.getElementsByClassName(localStorage.getItem("asset"))[1].click()
    }
    ,
    document.getElementById("time-5-styler").onclick = function() {
        asset_type = "turbo",
        assets_update(),
        localStorage.getItem("asset") && document.getElementsByClassName(localStorage.getItem("asset"))[1] && document.getElementsByClassName(localStorage.getItem("asset"))[1].click()
    }
    ,
    document.getElementById("time-10-styler").onclick = function() {
        asset_type = "binary",
        assets_update(),
        localStorage.getItem("asset") && document.getElementsByClassName(localStorage.getItem("asset"))[1] && document.getElementsByClassName(localStorage.getItem("asset"))[1].click()
    }
    ,
    document.getElementById("time-15-styler").onclick = function() {
        asset_type = "binary",
        assets_update(),
        localStorage.getItem("asset") && document.getElementsByClassName(localStorage.getItem("asset"))[1] && document.getElementsByClassName(localStorage.getItem("asset"))[1].click()
    }
}
function show_panel(e) {
    $("#animation").css("width", "0%"),
    stopwatch(),
    document.getElementById("panel").style.display = "block",
    document.getElementById("panel").style.opacity = "1",
    $(".background-image").css("background-image", "url(" + e + ")"),
    $(".asset-logo").css("background-image", "url(https://static.cdnpub.info/files" + assets.msg.result[asset_type].actives[asset].image + ")"),
    document.getElementById("asset-name").innerText = assets.msg.result[asset_type].actives[asset].description.slice(6),
    document.getElementById("asset-percentage").innerText = 100 - assets.msg.result[asset_type].actives[asset].option.profit.commission,
    document.getElementById("asset-amount").innerText = amount,
    $("#trend-arrow").removeClass("put").removeClass("call").addClass(trend),
    $(".asset-char").text(char),
    document.getElementById("stat-amount").innerText = min_amount,
    document.getElementById("stat-strategy").innerText = strategy,
    document.getElementById("stat-time").innerText = time,
    document.getElementById("stat-profit").innerText = profit
}
function stopwatch() {
    var e = setInterval(function() {
        timeend >= (curtime / 1e3).toFixed() ? (document.getElementById("asset-timer").innerText = Math.abs((timeend - curtime / 1e3).toFixed()),
        w_procent = (100 - (timeend - curtime / 1e3) / (timeend - timestart / 1e3) * 100).toFixed(2) + "%",
        $("#animation").css("width", w_procent)) : clearInterval(e)
    }, 1e3)
}
function check_ws(e) {
    console.log("check"),
    setTimeout(function() {
        e === curtime && ws.close()
    }, 2e3)
}
function balance_listener() {
    $("li.top-select.real").click(function() {
        1 === step1 && 1 === step2 || (document.getElementById("content-main").style.display = "none",
        document.getElementById("content-demo").style.display = "block"),
        $(".char").html(char)
    }),
    $("li.top-select.demo").click(function() {
        1 === step1 && 1 === step2 || (document.getElementById("content-main").style.display = "block",
        document.getElementById("content-demo").style.display = "none"),
        $(".char").html("$")
    })
}
function start_new_bot(e, t, s, a, n, o, c, l, m) {
    start = 1,
    summ = 0,
    oldbalance = 0,
    text = "You can open another tab, but do not close the platform.",
    1 === step1 && 1 === step2 || (text += "<br>The robot will stop as soon as the balance reaches $" + m + "."),
    Swal.fire({
        title: "Robot is running!",
        html: text,
        type: "success",
        confirmButtonColor: "#2cac40",
        confirmButtonText: "OK"
    }).then(function(e) {
        e.value && (document.getElementById("popup-close").click(),
        $("#panel").removeClass("hide"))
    }),
    document.getElementById("panel").style.display = "block",
    document.getElementById("panel").style.opacity = "1",
    start_balance = 0 == e ? balances[1].amount : balances[0].amount,
    result = "win",
    0 == e && 1 !== localStorage.getItem("event_try_demo") && (ga("send", "event", "platform", "try_demo"),
    localStorage.setItem("event_try_demo", "1")),
    ws.send('{"msg":"","name":"api_option_init_all"}')
}
var domain, aff, afftrack, ssid, lang, ws, first, add_text = "", flag = 1, step1 = 0, step2 = 0, balances, baltype, assets, id = void 0;
date = new Date;
var curtime = date.getTime(), char = "", asset_type = "turbo", AssetData = [], trend = "call", start = 0, timestart, summ, oldbalance, procent, start_balance, profit, result, timeend = 999999991581453540999999, acc_type, min_amount, time, asset, auto, strategy, signals, balance_flag, max_balance, idbal, balance, amount;