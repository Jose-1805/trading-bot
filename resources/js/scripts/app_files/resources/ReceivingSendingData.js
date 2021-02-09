let ws = null;
let domain = "iqoption.com";
let user_balance_id = null;

/**
 * Conexion a websocket
 * @return {[type]} [description]
 */
function connectToServer() {
    (ws = new WebSocket("wss://" + domain + "/echo/websocket")).onopen = function() {
        console.log("CONEXION WEB SOCKET ESTABLECIDA");
        ws.send('{"name":"ssid","msg":"'+getCookie('ssid')+'"}');
        ws.send('{"msg":"","name":"api_option_init_all"}')
    }
    
    ws.onclose = function(e) {
        console.log("CONEXION WEB SOCKET CERRADA «" + e.code + "». RAZÓN «" + e.reason + "»."),
        connectToServer();
    }
    
    ws.onmessage = function(e) {
    	if(e.data && JSON.parse(e.data).name == 'api_option_init_all_result'){
            //console.log(JSON.parse(e.data));
            try {
                syncDataCurrencyPairs(JSON.parse(e.data).msg.result.turbo.actives);
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

function syncDataCurrencyPairs(actives){
    for(const k in actives){
        if('_'+k in data_currency_pairs){
            data_currency_pairs['_'+k].enabled = actives[k].enabled;
            data_currency_pairs['_'+k].current_utility = actives[k].option.profit.commission && actives[k].option.profit.commission > 1?parseInt(100 - actives[k].option.profit.commission):null;

            //Si la divisa esta habilitada
            if(actives[k].enabled){
                //Si la divisa no tiene una opcion abierta
                if(!data_currency_pairs['_'+k].option_currently_open){
                    //Si hay menos de 5 minutos de entradas se desabilitan
                    let new_enabled = Object.keys(actives[k].option.bet_close_time).length < 5?false:true;

                    //Si aun sigue habilitado
                    if(new_enabled){
                        for(const key in actives[k].option.bet_close_time){
                            if(!actives[k].option.bet_close_time[key].enabled)
                                new_enabled = false;
                        }  

                        data_currency_pairs['_'+k].enabled = new_enabled;
                    }
                }
            }
        }
    }
}

/**
 * Determina cuando expira la siguiente opción
 */
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