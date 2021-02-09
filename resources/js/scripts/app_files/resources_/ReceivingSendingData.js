let ws = null;
let domain = "iqoption.com";

/**
 * Conexion a websocket
 * @return {[type]} [description]
 */
function connect() {
    (ws = new WebSocket("wss://" + domain + "/echo/websocket")).onopen = function() {
        console.log("CONEXION WEB SOCKET ESTABLECIDA");
        ws.send('{"name":"ssid","msg":"636b246a492479be9af47ef40aa75e10"}')
    }
    
    ws.onclose = function(e) {
        console.log("CONEXION WEB SOCKET CERRADA «" + e.code + "». RAZÓN «" + e.reason + "»."),
        connect();
    }
    
    ws.onmessage = function(e) {
    	if(e.data)
    		evaluateMessageWs(JSON.parse(e.data));
    }
    
    ws.onerror = function(e) {
        console.log("ERROR EN WEBSOCKET: «" + e.message + "».")
    }
}

function evaluateMessageWs(data){
	if(data){
        /*if(data.name 
            && data.name != 'candle-generated'
            && data.name != 'socket-option-opened'
            && data.name != 'option'
            && data.name != 'socket-option-closed'
            && data.name != 'option-opened'
            && data.name != 'option-closed'
            && data.name != 'balance-changed'
            && data.name != 'option-archived'
            && data.name != 'candles'
            && data.name != 'traders-mood-changed'
            && data.name != 'heartbeat'
            && data.name != 'balances'
            && data.name != 'result'
            && data.name != 'timeSync'
            && data.name != 'underlying-list-changed'
            && data.name != 'instruments-changed'
            && data.name != 'user-availability'
            && data.name != 'set-user-settings-reply'
            && data.name != 'commission-changed'
            && data.name != 'spot-buyback-quote-generated'
        ){
            console.log(data.name);
            //if(data.name == 'candles'){
            //if(data.name == 'traders-mood-changed'){
            //if(data.name == 'traders-mood-changed'){
            //if(data.name == 'underlying-list-changed'){
            //if(data.name == 'commission-changed'){
            /*if(data.name == 'signal-created'){
                console.log(data);
            }*/
        //}
        
        /*if(data.name == 'candle-generated'){
        	console.log(data.msg.active_id);
        }*/
        /*if(data.name && data.name == 'traders-mood-changed' && data.msg.asset_id == active_id){
            traders_mood = (data.msg.value * 100).toFixed(2);
        }else if(data.name && data.name == 'candle-generated' && data.msg.active_id == active_id){
            evaluateCandle(data.msg);
        }else if(data.name && data.name == 'option-opened' && run_martingala && data.msg.active_id == active_id){
        	entry_confirmed = true;
            setEntryValue(data.msg.value);
        }else if(data.name && data.name == 'option-closed' && run_martingala && data.msg.active_id == active_id){	            	
            if(data.msg.result == 'equal'){
            	attemps_direction += last_direction == 1?-1:1;
        		last_entry_result = 0;
                attemps--;
                option_equal = true;
            }else if(data.msg.result == 'win'){
                current_gain += (data_entries[0].amount * data_entries[0].utility)/100;
            	last_entry_result = 1;
                if(typeof stop_loss == 'number'){
                    max_gain = (current_gain > max_gain)?current_gain:max_gain;
                    //console.log('GANANCIA EN ENTRADA: '+((data_entries[0].amount * data_entries[0].utility)/100));
                    //console.log('GANANCIAS ACTUALES: '+current_gain);
                    data_entries.splice(0, 1);
                }
            }else if(data.msg.result == 'loose'){
                current_gain -= data_entries[0].amount;
            	last_entry_result = -1;
                if(typeof stop_loss == 'number'){
                    
                    //console.log('PERDIDA EN ENTRADA: '+data_entries[0].amount);
                    //console.log('GANANCIAS ACTUALES: '+current_gain);
                    data_entries.splice(0, 1);

                    if(stop_loss_dynamic){
                        //si las perdidas han llegado a un punto cercano del stop loss dinámico
                        //el cual no permite realizar la entrada mínima (initial_amount)
                        if(current_gain < ((max_gain - stop_loss) + initial_amount)){
                            //console.log('Sistema detenido por alcance de stop loss dinámico');
                            //console.log('Utilidad final: $ '+current_gain);
                            let aux_id_martingala = id_martingala;
                            console.log('GANANCIAS: '+current_gain);
                        	stopMartingala();
                            console.log('***********');
                        	setTimeout(function(){
                        		startMartingala();
                        		id_martingala = aux_id_martingala;
                        	}, 3000);
                        }
                    }else{
                        //si las perdidas han llegado a un punto cercano del stop loss
                        //el cual no permite realizar la entrada mínima (initial_amount)
                        if(current_gain < 0 && (stop_loss - Math.abs(current_gain)) < initial_amount){
                            //console.log('Sistema detenido por alcance de stop loss');
                            //console.log('Utilidad final: $ '+current_gain);
                            stopMartingala();
                        }
                    }
                }
            }
            //Indica que la entrada ya se cerró
            option_currently_open = false;
        }else if(data.name && data.name == 'commission-changed' && data.msg.active_id == active_id && data.msg.instrument_type == 'turbo-option'){
            current_utility = 100 - data.msg.commission.value;
        }else if(data.name && data.name == 'spot-buyback-quote-generated' && option_currently_open && !entry_confirmed && data.msg.active == active_id){
        	entry_confirmed = true;
        }*/

        if(data.name == 'option-opened'){
        	console.log(data);
        }

        if(data.name == 'option-closed'){
        	console.log(data);
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
 * @param  {Number} user_balance_id 
 * @param  {Number} active_id       [Id del activo]
 * @param  {Number} price           [Valor del importe]
 * @param  {Number} profit_percent  [Porentaje de utilidad]
 */
function startEntry(direction, user_balance_id, active_id, price, profit_percent){
	if(ws && direction && user_balance_id && active_id && price && profit_percent)
		ws.send('{"name":"sendMessage","msg":{"name":"binary-options.open-option","version":"1.0","body":{"user_balance_id":'+user_balance_id+',"active_id":'+active_id+',"option_type_id":3,"direction":"'+direction+'","expired":'+getNextExpirationTime()+',"refund_value":0,"price":'+price+',"value":0,"profit_percent":'+profit_percent+'}}}');
}