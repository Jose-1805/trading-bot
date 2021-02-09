let ws = null;
let domain = "iqoption.com";
let user_balance_id = null;

function connectToServer() {
    (ws = new WebSocket("wss://" + domain + "/echo/websocket")).onopen = function() {
        console.log("CONEXION WEB SOCKET ESTABLECIDA");
        ws.send('{"name":"ssid","msg":"bd27fc4f1195f2058c0a4638f84b8928"}');

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

/**
 * Ejecuta una entrada en el sistema
 * 
 * @param  {String} direction       [Direccion de compra "put" o "call"]
 * @param  {Number} active_id       [Id del activo]
 * @param  {Number} price           [Valor del importe]
 * @param  {Number} profit_percent  [Porentaje de utilidad]
 */
function startEntry(direction, active_id, price, profit_percent){
    if(ws && direction && user_balance_id && active_id && price && profit_percent)
        ws.send('{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":'+user_balance_id+',"active_id":'+active_id+',"option_type_id":3,"direction":"'+direction+'","expired":'+getNextExpirationTime()+',"refund_value":0,"price":'+price+',"value":0,"profit_percent":'+profit_percent+'}}}');
}

function startApp(){

    var e = new XMLHttpRequest;
    e.open("GET", "https://" + domain + "/api/register/getregdata", !0),
    e.send(),
    e.onreadystatechange = function() {
        if (4 == e.readyState && 200 == e.status) {
            var t = JSON.parse(e.responseText);
            console.log(t);
            if (0 != t.isSuccessful) {
                user_balance_id = t.result.profile.balance_id;
                console.log("USER BALANCE: ", user_balance_id);

                /*chrome.runtime.sendMessage({
                    msg: "get-ssid",
                    domain: domain
                }, function(e) {
                    ssid = e.ssid
                    console.log(ssid)
                })*/

                //connectToServer();
            }
        }else if(201 == e.status){
            console.log('Para iniiar el sistema debe tener abierta la plataforma iq_option');
        }
    }
}