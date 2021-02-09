let ws = null;
let domain = "iqoption.com";
let user_balance_id = null;

function connectToServer() {
    (ws = new WebSocket("wss://" + domain + "/echo/websocket")).onopen = function() {
        console.log("CONEXION WEB SOCKET ESTABLECIDA");
        ws.send('{"name":"ssid","msg":"636b246a492479be9af47ef40aa75e10"}');
        ws.send('{"msg":"","name":"api_option_init_all"}')
    }
    
    ws.onclose = function(e) {
        console.log("CONEXION WEB SOCKET CERRADA «" + e.code + "». RAZÓN «" + e.reason + "»."),
        connectToServer();
    }
    
    ws.onmessage = function(e) {
    	if(e.data && JSON.parse(e.data).name == 'api_option_init_all_result'){
            console.log(JSON.parse(e.data));
            try {
                //syncDataCurrencyPairs(JSON.parse(e.data).msg.result.turbo.actives);
            } catch(e) {
                // statements
                console.log(e);
            }
        }else if(e.data && JSON.parse(e.data).name != 'timeSync'){
            //console.log(JSON.parse(e.data));
        }
    }
    
    ws.onerror = function(e) {
        console.log("ERROR EN WEBSOCKET: «" + e.message + "».")
    }
}

function requestSyncDataCurrencyPairs(){
    if(ws){
        ws.send('{"msg":"","name":"api_option_init_all"}');
    }
}

function getNextExpirationTime(){
    var date = new Date();
    var add_minutes = 2;
    if(date.getSeconds() < 30){
        add_minutes = 1;
    }

    date.setSeconds(0, 0);
    date.setMinutes(date.getMinutes() + add_minutes);

    return date.getTime().toString().substr(0,10);
}

function startEntry(){
    ws.send('{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":226446523,"active_id":76,"option_type_id":3,"direction":"call","expired":'+getNextExpirationTime()+',"refund_value":0,"price":1,"value":0,"profit_percent":99}}}');
}

function startApp(){

    var e = new XMLHttpRequest;
    e.open("GET", "https://" + domain + "/api/register/getregdata", !0),
    e.send(),
    e.onreadystatechange = function() {
        if (4 == e.readyState && 200 == e.status) {
            var t = JSON.parse(e.responseText);
            if (0 != t.isSuccessful) {
                user_balance_id = t.result.profile.balance_id;
                console.log(user_balance_id);

                chrome.runtime.sendMessage({
                    msg: "get-ssid",
                    domain: domain
                }, function(e) {
                    ssid = e.ssid
                    console.log(ssid)
                })

                //connectToServer();
            }
        }else if(201 == e.status){
            console.log('Para iniiar el sistema debe tener abierta la plataforma iq_option');
        }
    }
}
//226446523