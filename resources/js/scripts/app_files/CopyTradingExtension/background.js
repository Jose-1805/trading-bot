let ws = null;
let domain = "iqoption.com";
let user_balance_id = null;
let ssid = null;

//let start_ct = document.getElementById('start_ct');

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({copy_trading_is_running: false}, function() {
      console.log("Copy trading 1805 is not running---");
    });

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'iqoption.com'},
        })
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
});

function getSSID(callback){
	return chrome.cookies.get({
        url: "https://iqoption.com",
        name: "ssid"
    }, callback)
}

function stopCopyTrading(){
	//start_ct.style.backgroundColor = "red";
	chrome.storage.sync.set({copy_trading_is_running: false}, function() {
		//start_ct.innerHTML = "Start Copy Trading";
      	console.log("Copy trading 1805 is not running");
    });			
}

function startCopyTrading(){
	/*chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'function startApp(){console.log("Funciona UJU");}'});
    });

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'startApp()'});
    });*/

	//start_ct.style.backgroundColor = "green";
	chrome.storage.sync.set({copy_trading_is_running: true}, function() {
		//start_ct.innerHTML = "Copy Trading Active";
      	console.log("Copy trading 1805 is running");
    });

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

                chrome.extension.getBackgroundPage().getSSID(function(e){
			    	ssid = e.value;
			    	console.log("SSID: ", ssid);
                	connectToServer();
			    });
            }
        }else if(201 == e.status){
            console.log('Para iniiar el sistema debe tener abierta la plataforma iq_option');
        }
    }
}

function connectToServer() {
    (ws = new WebSocket("wss://" + domain + "/echo/websocket")).onopen = function() {
        console.log("CONEXION WEB SOCKET ESTABLECIDA");
        ws.send('{"name":"ssid","msg":"'+ssid+'"}');

        requestSyncDataCurrencyPairs();
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
            console.log(JSON.parse(e.data));
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