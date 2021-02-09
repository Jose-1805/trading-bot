/**
 * Recive y analiza los datos que se generan dentro de cada minuto
 * @param  {[type]} data               [Datos enviados por el servidor]
 * @param  {[type]} data_currency_pair [Datos de configuracion del par de divi*/
function evaluateCandle(data, data_currency_pair){

	//Registra el ultimo valor y calcula la velocidad del movimiento
	if(data_currency_pair.currency_pair && 'close' in data){
		data_currency_pair.currency_pair.addLastValue(data.close);

		//Si se detecta un movimiento rápido
		if(data_currency_pair.currency_pair.speed > config_trading.speed_for_block_entries){
			let date_ = new Date();
			date_.setSeconds(date_.getSeconds() + config_trading.seconds_to_reset_number_of_fast_movements);

			//Fecha de restablecimiento de contador de movimientos rápidos
			data_currency_pair.reset_number_of_fast_movements_at = date_.getFullYear()
            +'-'+(date_.getMonth()+1)  
            +'-'+date_.getDate()  
            +' '+date_.getHours()
            +':'+date_.getMinutes()
            +':'+date_.getSeconds();

			data_currency_pair.number_of_fast_movements++;
            config_trading.active_log_martingala?console.log('Movimiento rápido detectado (actuales: '+data_currency_pair.number_of_fast_movements+')'):null;

            //Si no hay una opción abierta y la cantidad de movimientos rápidos
            //alcanza o supera el limite se bloquean las entradas por unos minutos
			if(!data_currency_pair.option_currently_open && data_currency_pair.number_of_fast_movements >= config_trading.number_of_fast_movements_to_block_entries){
				//Se desactivan las alertas por alta velocidad
				data_currency_pair.high_speed = true;

				let date_ = new Date();
				date_.setMinutes(date_.getMinutes() + config_trading.high_speed_lock_minutes);

				//Fecha de reactivación de entradas
				data_currency_pair.restart_high_speed_at = date_.getFullYear()
	            +'-'+(date_.getMonth()+1)  
	            +'-'+date_.getDate()  
	            +' '+date_.getHours()
	            +':'+date_.getMinutes();

	            data_currency_pair.number_of_fast_movements = 0;

	            config_trading.active_log_martingala?console.log('Alertas suspendidas por movimiento rápido del precio, se reactivaran automáticamente -> '+data_currency_pair.restart_high_speed_at):null;
			}
		}
	}

	//Si las alertas están suspendidas por alta velocidad
	if(data_currency_pair.high_speed){
		let current_date = new Date();

		current_date = current_date.getFullYear()
        +'-'+(current_date.getMonth()+1)  
        +'-'+current_date.getDate()  
        +' '+current_date.getHours()
        +':'+current_date.getMinutes();

        if(current_date == data_currency_pair.restart_high_speed_at){
        	data_currency_pair.high_speed = false;
        	config_trading.active_log_martingala?console.log('Alertas activadas nuevamente ***************'):null;
        }
	}

	//Si el contador de movimientos rápidos está iniciado
	if(data_currency_pair.number_of_fast_movements > 0){
		let current_date = new Date();

		current_date = current_date.getFullYear()
        +'-'+(current_date.getMonth()+1)  
        +'-'+current_date.getDate()  
        +' '+current_date.getHours()
        +':'+current_date.getMinutes()
        +':'+current_date.getSeconds();

        if(current_date == data_currency_pair.reset_number_of_fast_movements_at){
        	number_of_fast_movements = 0;
        	config_trading.active_log_martingala?console.log('Contador de movimientos rápidos restablecido ***************'):null;
        }
	}

	//time de la fecha del evento
	var time_date_at = data.at.toString().substr(0,13);
    var date_at = new Date();
    date_at.setTime(time_date_at);

    //fecha exacta de generación de los datos
    var date_send_at_s_s = date_at.getFullYear()
            +'-'+(date_at.getMonth()+1)  
            +'-'+date_at.getDate()  
            +' '+date_at.getHours()
            +':'+date_at.getMinutes()
            +':'+date_at.getSeconds();

    //a la fecha exacta se le resta un minuto para 
    //almacenarla en el sistema con el minuto en el cual se inicio
    //y no en el que terminó
    date_at.setMinutes(date_at.getMinutes() - 1);

    var date_send_at = date_at.getFullYear()
            +'-'+(date_at.getMonth()+1)  
            +'-'+date_at.getDate()  
            +' '+date_at.getHours()
            +':'+date_at.getMinutes()
            +':'+date_at.getSeconds();
    
    //si es el segundo 0 se establecen los parametros para
    //guardar los datos de la vela si el se recibe más de un dato 
    //por segundo se tomará el ultimo
    if(date_at.getSeconds() == 0){
        data_currency_pair.last_params = {
	        name:data_currency_pair.name,
	        open:data.open,
	        close:data.close,
	        min:data.min,
	        max:data.max,
	        date:date_send_at,
	        time:time_date_at,
	        candle_size:0,
	        direction:0,
	        volume:data.volume
	    }
	//A partir del segundo 1 se pueden enviar los datos al servidor y crear entradas
    }else{
    	//Si no se ha confirmado una entrada se restablecen valores porque la entrada no se envió al servidor
    	if(date_at.getSeconds() >= 15 && data_currency_pair.option_currently_open && !data_currency_pair.entry_confirmed){
    		rollbackEntryMartingala(data_currency_pair);
    	}

    	//Si existen parametros para enviar al servidor
    	if(data_currency_pair.last_params != 'start'){

    		data_currency_pair.last_candle_generated = new Candle(
    			data_currency_pair.last_params.name,
		        data_currency_pair.last_params.open,
		        data_currency_pair.last_params.close,
		        data_currency_pair.last_params.min,
		        data_currency_pair.last_params.max,
		        data_currency_pair.last_params.date,
		        data_currency_pair.last_params.time,
		        data_currency_pair.last_params.candle_size,
		        data_currency_pair.last_params.direction,
		        data_currency_pair.last_params.volume,
		        data_currency_pair.currency_pair
	        );
    		data_currency_pair.last_candle_generated.is_broke_level = false;
    		data_currency_pair.last_candle_generated.setDirection();

    		//si ya se sincronizo el objeto currency_pair
    		//y no existe una opción abierta
    		if(data_currency_pair.currency_pair && !data_currency_pair.option_currently_open){
    			data_currency_pair.last_candle_generated.setCandleSize();

	    		//se agrega la vela a la lista de velas del objeto currency_pair
	    		data_currency_pair.currency_pair.last_candles.push(data_currency_pair.last_candle_generated);

	    		//Si hay N velas se empieza a eliminar la primera
				if(data_currency_pair.currency_pair.last_candles.length >= (data_currency_pair.amount_last_candles + 1)){
					data_currency_pair.currency_pair.last_candles.splice(0, 1);
				}
	    		
	    		//Se calculan los datos de pronostico de las velas almacenadas en last_candle
	    		data_currency_pair.currency_pair.evaluateForecasts();

	    		//se recalcula la cantidad de rupturas de nivel en las ultimas
	    		//N velas
	    		data_currency_pair.currency_pair.setLastBrokesLevel();

    			//si martingala esta corriendo se evalua
    			//si se debe crear una entrada
	    		if(run_martingala && data_currency_pair.active && data_currency_pair.enabled && data_currency_pair.current_utility /*&& data_currency_pair.currency_pair.last_candles.length >= amount_last_candles*/){
	    			data_currency_pair.last_candle_generated.evaluateMartingala(data_currency_pair);
	    		}else{
	    			data_currency_pair.last_candle_generated.calculateForecastForNextCandle(data_currency_pair);
	    		}

				data_currency_pair.candle_pending_save = false;

				setTimeout(function(){
	    			data_currency_pair.last_candle_generated.save();
	    		}, 2000);			    		
	    	}else{
	    		//si no se ha creado currency_pair
	    		if(!data_currency_pair.currency_pair){
	    			//si no existe el objeto currency_pair se crea
		    		data_currency_pair.currency_pair = new CurrencyPair();
		    		data_currency_pair.currency_pair.name = data_currency_pair.name;
		    		data_currency_pair.currency_pair.active_id = data_currency_pair.active_id;
		    	//si existe una opción abierta
		    	}else if(data_currency_pair.option_currently_open){
		    		data_currency_pair.candle_pending_save = true;
		    	}
	    	}

	    	//restablecimiento de parametros para no seguir enviando
	    	//datos al servidor durante el minuto actual
    		data_currency_pair.last_params = 'start';

    		//En 5 segundos se envía a guardar la vela si se puede
    		//y se sincroniza el objeto currency_pair con el servidor
    		setTimeout(function(){
    			data_currency_pair.currency_pair.requestSync();
    		}, 5000);
    	}else{
    		//si existe una vela pendiente de envío y ya se cerró
    		//la opcion que estaba abierta
    		if(data_currency_pair.candle_pending_save && !data_currency_pair.option_currently_open){
	    		data_currency_pair.last_candle_generated.setCandleSize();

	    		//se agrega la vela a la lista de velas del objeto currency_pair
	    		data_currency_pair.currency_pair.last_candles.push(data_currency_pair.last_candle_generated);

	    		//Si hay N velas se empieza a eliminar la ultima
				if(data_currency_pair.currency_pair.last_candles.length >= (data_currency_pair.amount_last_candles + 1)){
					data_currency_pair.currency_pair.last_candles.splice(0, 1);
				}
	    		
	    		//Se calculan los datos de pronostico de las velas almacenadas en last_candle
	    		data_currency_pair.currency_pair.evaluateForecasts();

	    		//se recalcula la cantidad de rupturas de nivel en las ultimas
	    		//N velas
	    		data_currency_pair.currency_pair.setLastBrokesLevel();

    			//si martingala esta corriendo se evalua
    			//si se debe crear una entrada
	    		if(run_martingala && data_currency_pair.active && data_currency_pair.enabled && data_currency_pair.current_utility /*&& data_currency_pair.currency_pair.last_candles.length >= amount_last_candles*/){
	    			data_currency_pair.last_candle_generated.evaluateMartingala(data_currency_pair);
	    		}else{
	    			data_currency_pair.last_candle_generated.calculateForecastForNextCandle(data_currency_pair);
	    		}

				data_currency_pair.candle_pending_save = false;

				setTimeout(function(){
	    			data_currency_pair.last_candle_generated.save();
	    		}, 2000);	
			}
    	}

    	//Si martingala esta corriendo, no se han evaluado alertas en el minuto actual
    	//y no hay una entrada abierta
    	if(run_martingala && data_currency_pair.active && data_currency_pair.enabled && data_currency_pair.current_utility && data_currency_pair.last_martingala_one != date_at.getMinutes() && !data_currency_pair.option_currently_open){
    		//console.log('Enviando datos de primer segundo en '+date_send_at_s_s);
    		
    		//en last_martingala_one se almacena el ultimo minuto que se 
    		//realizo la evaluación de alertas martingala (Solo se evalua una vez por minuto)
    		data_currency_pair.last_martingala_one = date_at.getMinutes();

    		//si ya se sincronizo el objeto currency_pair
    		//se evalua la entrada martingala con la posición de apertura de la vela actual
    		if(data_currency_pair.currency_pair){
    			data_currency_pair.currency_pair.evaluateLastAlertMartingala(data.open, data_currency_pair);
    		}
    	}
    }
}

/**
 * Envia valor de la ultima alerta al servidor
 * @param {Float} value [Valor de la alerta]
 */
function setEntryValue(value, data_currency_pair){
	if(run_martingala && data_currency_pair.active && data_currency_pair.enabled && data_currency_pair.current_utility){
		setTimeout(function(){
			fetch("http://127.0.0.1:8000/api/iq_value/set-entry-value-martingala/"+data_currency_pair.name+"/"+value, {mode: 'no-cors'});
		}, 7000);
	}
}

function listenerWebSocket(e){
	if(e.message.type == 'sync_currency_pair'){
		for(var key in data_currency_pairs){
			if(data_currency_pairs[key].name == e.message.data.name && data_currency_pairs[key].active && data_currency_pairs[key].currency_pair){
				data_currency_pairs[key].currency_pair.dataSync(e.message.data);
			}
		}
	}
}

function listenWebsocket(){
	window.Echo.channel('home').listen('NewMessage', e => listenerWebSocket(e));
}

function leaveWebsocket(){
	window.Echo.leaveChannel('home');
}

listenWebsocket();

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;

    try{
        var data = null;

        try {
        	data = JSON.parse(str);	        	
        } catch(e) {
        }



        //result win - loose - sold
        if(data){
            if(data.name && data.name == 'candle-generated'){
            	let data_currency_pair = data_currency_pairs['_'+data.msg.active_id];

            	if(data_currency_pair){
            		evaluateCandle(data.msg, data_currency_pair);
            	}

            }else if(data.name && data.name == 'traders-mood-changed'){

            	let data_currency_pair = data_currency_pairs['_'+data.msg.asset_id];

            	if(data_currency_pair)
	            	data_currency_pair.traders_mood = (data.msg.value * 100).toFixed(2);

	        }else if(data.name && data.name == 'option-opened' && run_martingala){
	        	let data_currency_pair = data_currency_pairs['_'+data.msg.active_id];

            	if(data_currency_pair){
		        	data_currency_pair.entry_confirmed = true;
		            setEntryValue(data.msg.value, data_currency_pair);
		        }
	        }else if(data.name && data.name == 'option-closed' && run_martingala){	            	
	        	let data_currency_pair = data_currency_pairs['_'+data.msg.active_id];
            	if(data_currency_pair){
		            if(data.msg.result == 'equal'){
		            	data_currency_pair.attemps_direction += data_currency_pair.last_direction == 1?-1:1;
		        		data_currency_pair.last_entry_result = 0;
		                data_currency_pair.attemps--;
		                data_currency_pair.option_equal = true;

		                //Si era el primer intento y martingala se esta ejecutando de manera global
		                if(!config_trading.individual_martingala && data_currency_pair.attemps == 0 && global_martingala_is_running && data_currency_pair.active_id == active_id_global_martingala_running){
		                	global_martingala_is_running = false;
		                	active_id_global_martingala_running = null;
		                }
		            }else if(data.msg.result == 'win'){
		                data_currency_pair.current_gain += (data_currency_pair.data_entries[0].amount * data_currency_pair.data_entries[0].utility)/100;
		                data_currency_pair.max_gain = (data_currency_pair.current_gain > data_currency_pair.max_gain)?data_currency_pair.current_gain:data_currency_pair.max_gain;

		                global_current_gain += (data_currency_pair.data_entries[0].amount * data_currency_pair.data_entries[0].utility)/100;
		                global_max_gain = (global_current_gain > global_max_gain)?global_current_gain:global_max_gain;
		            	
		            	data_currency_pair.last_entry_result = 1;

		            	//Si martingala se esta ejecutando de manera global
		            	//Se restablecen variables de entrada martingala global
		                if(!config_trading.individual_martingala && data_currency_pair.active_id == active_id_global_martingala_running && global_martingala_is_running){
		                	global_martingala_is_running = false;
		                	active_id_global_martingala_running = null;
		                }
		            }else if(data.msg.result == 'loose'){
		                data_currency_pair.current_gain -= data_currency_pair.data_entries[0].amount;
		                global_current_gain -= data_currency_pair.data_entries[0].amount;
		            	data_currency_pair.last_entry_result = -1;
		                if(typeof stop_loss == 'number'){
		                    if(stop_loss_dynamic){
		                    	//Si martingala se esta ejecutando de manera individual
		                        //y las perdidas han llegado a un punto cercano del stop loss dinámico
		                        //el cual no permite realizar la entrada mínima (initial_amount)
		                        if(config_trading.individual_martingala && data_currency_pair.current_gain < ((data_currency_pair.max_gain - stop_loss) + initial_amount)){
		                            console.log('Sistema detenido por alcance de stop loss dinámico');
		                            console.log('Utilidad final: $ '+data_currency_pair.current_gain);
		                            let aux_id_martingala = data_currency_pair.id_martingala;
		                        	stopMartingalaCurrencyPair(data_currency_pair);
		                            console.log('**********************');

		                            if(config_trading.auto_start_with_stop_loss){
			                        	setTimeout(function(){
			                        		startMartingalaCurrencyPair(data_currency_pair);
			                        		data_currency_pair.id_martingala = aux_id_martingala;
			                        	}, 3000);
			                        }
		                        }
		                        //Si martingala se esta ejecutando de manera global
		                        //y las perdidas han llegado a un punto cercano del stop loss dinámico
		                        //el cual no permite realizar la entrada mínima (initial_amount)
		                        else if(!config_trading.individual_martingala && data_currency_pair.active_id == active_id_global_martingala_running && global_current_gain < ((global_max_gain - stop_loss) + initial_amount)){
		                            console.log('Sistema detenido por alcance de stop loss dinámico');
		                            console.log('Utilidad final: $ '+global_current_gain);
		                            let aux_id_martingala = data_currency_pair.id_martingala;
		                        	stopMartingala();
		                        	global_martingala_is_running = false;
		                        	active_id_global_martingala_running = null;
		                            console.log('**********************');

		                            if(config_trading.auto_start_with_stop_loss){
			                        	setTimeout(function(){
			                        		startMartingala();
			                        		data_currency_pair.id_martingala = aux_id_martingala;
			                        	}, 3000);
			                        }
		                        }
		                    }else{
		                    	//Si martingala se está ejecutando de manera individual
		                        //y las perdidas han llegado a un punto cercano del stop loss
		                        //el cual no permite realizar la entrada mínima (initial_amount)
		                        if(config_trading.individual_martingala && data_currency_pair.current_gain < 0 && (stop_loss - Math.abs(data_currency_pair.current_gain)) < initial_amount){
		                            console.log('Sistema detenido por alcance de stop loss');
		                            console.log('Utilidad final: $ '+data_currency_pair.current_gain);
		                            stopMartingalaCurrencyPair(data_currency_pair);

		                            if(config_trading.auto_start_with_stop_loss){
			                        	setTimeout(function(){
			                        		startMartingalaCurrencyPair(data_currency_pair);
			                        		data_currency_pair.id_martingala = aux_id_martingala;
			                        	}, 3000);
			                        }
		                        }
		                    	//Si martingala se está ejecutando de manera global
		                        //y las perdidas han llegado a un punto cercano del stop loss
		                        //el cual no permite realizar la entrada mínima (initial_amount)
		                        else if(!config_trading.individual_martingala && data_currency_pair.active_id == active_id_global_martingala_running && global_current_gain < 0 && (stop_loss - Math.abs(global_current_gain)) < initial_amount){
		                            console.log('Sistema detenido por alcance de stop loss');
		                            console.log('Utilidad final: $ '+global_current_gain);
		                            stopMartingala();

		                            global_martingala_is_running = false;
		                        	active_id_global_martingala_running = null;

		                            if(config_trading.auto_start_with_stop_loss){
			                        	setTimeout(function(){
			                        		startMartingala();
			                        		data_currency_pair.id_martingala = aux_id_martingala;
			                        	}, 3000);
			                        }
		                        }
		                    }

		                }
		            }

		            data_currency_pair.current_gain = parseFloat(data_currency_pair.current_gain.toFixed(2));
					data_currency_pair.max_gain = parseFloat(data_currency_pair.max_gain.toFixed(2));

					global_current_gain = parseFloat(global_current_gain.toFixed(2));
					global_max_gain = parseFloat(global_max_gain.toFixed(2));

		            data_currency_pair.data_entries.splice(0);
		            //Indica que la entrada ya se cerró
		            data_currency_pair.option_currently_open = false;
		        }

	        }else if(data.name && data.name == 'commission-changed' && data.msg.instrument_type == 'turbo-option'){
	        	let data_currency_pair = data_currency_pairs['_'+data.msg.active_id];

            	if(data_currency_pair)
	            	data_currency_pair.current_utility = 100 - data.msg.commission.value;

	        }else if(data.name && data.name == 'spot-buyback-quote-generated'){
	        	let data_currency_pair = data_currency_pairs['_'+data.msg.active];

            	if(data_currency_pair && data_currency_pair.option_currently_open && !data_currency_pair.entry_confirmed)
	        		data_currency_pair.entry_confirmed = true;
	        }else if(data.name && data.name == 'first-candles' && ws){
	        	requestSyncDataCurrencyPairs();
	        }
	    }
    }catch(error){
    	console.log(error);
    }

    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
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
                connectToServer();
				startMartingala();
            }
        }
    }

    setInterval(function(){
    	let current_date = new Date();

    	if(ws && current_date.getSeconds() >= 30){
    		ws.send('{"msg":"","name":"api_option_init_all"}');
    	}
    }, 60000)
}

function printForecastData(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].active && data_currency_pairs[key].enabled && data_currency_pairs[key].currency_pair){
			console.log(data_currency_pairs[key].name, data_currency_pairs[key].currency_pair.forecast_data);
			console.log('----------------------------------');
		}
	}
}

function printGains(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].currency_pair && data_currency_pairs[key].current_gain){
			console.log(data_currency_pairs[key].name, "Ganancia actual: $"+data_currency_pairs[key].current_gain+" Máxima ganancia: $"+data_currency_pairs[key].max_gain);
			console.log('----------------------------------');
		}
	}

	console.log('Total ganancia global: $'+global_current_gain);
	console.log('Total máxima ganancia global: $'+global_max_gain);
}

function printCurrentUtilities(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].active && data_currency_pairs[key].enabled && data_currency_pairs[key].currency_pair){
			console.log(data_currency_pairs[key].name, data_currency_pairs[key].current_utility?(data_currency_pairs[key].current_utility+"%"):"SIN UTILIDAD");
		}
	}
}

function printEnabled(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].currency_pair){
			console.log(data_currency_pairs[key].name, data_currency_pairs[key].enabled);
		}
	}
}

function printActiveIds(){
	for(var key in data_currency_pairs){
		console.log(data_currency_pairs[key].name, data_currency_pairs[key].active_id);
	}
}

function printDataEntry(){
	for(var key in data_currency_pairs){
		if(data_currency_pairs[key].active && data_currency_pairs[key].enabled && data_currency_pairs[key].currency_pair){
			console.log(data_currency_pairs[key].name, data_currency_pairs[key].data_entries);
		}
	}
}

function getCookie(cname) {
	  var name = cname + "=";
	  var decodedCookie = decodeURIComponent(document.cookie);
	  var ca = decodedCookie.split(';');
	  for(var i = 0; i <ca.length; i++) {
	    var c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}
startApp();