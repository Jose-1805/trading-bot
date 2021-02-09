var run_martingala = false;//Habilida o desabilita las funcionalidades de martingala

var initial_amount = 1;//Valor de la inversión inicial
var factor_increase = 2.25;//Factor para incremento de inversión en cada pérdida
var max_attemps = null;//Cantidad máxima de intentos seguidos que deben ejecutarse

//Precio de perdida en que el sistema se detiene
var stop_loss = null;

//El precio de perdida se calcula de acuerdo a la ganancia
//máxima obtenida
var stop_loss_dynamic = true;

//Ganancias actuales
var global_current_gain = 0;

//Ganancia máxima obtenida
var global_max_gain = 0;

//Determina si se está ejecutando una entrada de martingala global 
//(Martingala global: cuando no se ejecuta martingala con cada divisa por separado sino analizando varias divisas)
var global_martingala_is_running = false;

//Identificador del activo que está ejecutando la entrada martingala global
var active_id_global_martingala_running = null;

var reasons_martingala = {
	broke_level:1,
	touch_level_upper:2,
	touch_level_lowwer:3,
	upper_wick_big:4,
	lowwer_wick_big:5,
	traders_mood:6,
	cancel_for_inadequate_traders_mood:7,
	inverted_for_inadequate_traders_mood:8,
	reassigned_for_big_small:9,
	broke_level_continuous:10,
	trend:11,
	heritage:12,
	inverted_for_small_broke_level:13,
	inverted_for_big_trend:14,
	inverted_for_jump_between_levels:15,
	cancel_for_jump_between_levels:16,
	cancel_for_high_speed:17,
	reassigned_by_several_failed_entries:18,
	cancel_for_jump_against:19,
};

/**
 * Restablecimiento de intentos martingala
 */
function resetAttemps(data_currency_pair) {
	data_currency_pair.attemps = 0;
}

/**
 * Incrementa la inversión de acuerdo a la configuración
 */
function increaceCurrentAmount(data_currency_pair){
	setCurrentAmount(data_currency_pair.current_amount * factor_increase, data_currency_pair);
}

/**
 * Restaura los valores de inversión
 */
function resetCurrentAmount(data_currency_pair){
	resetAttemps(data_currency_pair);
	setCurrentAmount(initial_amount, data_currency_pair);   
}  

/**
* Asigna un nuevo valor al current_amount
* @param {Number} new_current_amount [Nuevo importe]
*/
function setCurrentAmount(new_current_amount = 1, data_currency_pair){
	data_currency_pair.current_amount = new_current_amount;
}


function startMartingala(){
	if(!run_martingala){
		console.log('Martingala iniciado');
		run_martingala = true;
		global_max_gain = 0;
		global_current_gain = 0;
		for(var key in data_currency_pairs){
			if(data_currency_pairs[key].active){
				data_currency_pairs[key].current_amount = initial_amount;
				data_currency_pairs[key].attemps = 0;
				data_currency_pairs[key].option_equal = false;
				data_currency_pairs[key].id_martingala = null;
				data_currency_pairs[key].current_gain = 0;
				data_currency_pairs[key].max_gain = 0;
				data_currency_pairs[key].data_entries = [];
			}
		}
	}
}

function stopMartingala(){
	if(run_martingala){
		console.log('Martingala detenido');
		
		run_martingala = false;
		global_max_gain = 0;
		global_current_gain = 0;
		
		for(var key in data_currency_pairs){
			data_currency_pairs[key].active = true;
			data_currency_pairs[key].current_amount = initial_amount;
			data_currency_pairs[key].attemps = 0;
			data_currency_pairs[key].option_equal = false;
			data_currency_pairs[key].id_martingala = null;
			data_currency_pairs[key].current_gain = 0;
			data_currency_pairs[key].max_gain = 0;
			data_currency_pairs[key].data_entries = [];
		}
	}
}

function startMartingalaCurrencyPair(data_currency_pair){
	if(run_martingala){
		if(!data_currency_pair.active){
			data_currency_pair.active = true;
			data_currency_pair.current_amount = initial_amount;
			data_currency_pair.attemps = 0;
			data_currency_pair.option_equal = false;
			data_currency_pair.id_martingala = null;
			data_currency_pair.current_gain = 0;
			data_currency_pair.max_gain = 0;
			data_currency_pair.data_entries = [];
		}
	}
}

function stopMartingalaCurrencyPair(data_currency_pair){
	if(run_martingala){
		if(data_currency_pair.active){
			data_currency_pair.active = false;
			data_currency_pair.current_amount = initial_amount;
			data_currency_pair.attemps = 0;
			data_currency_pair.option_equal = false;
			data_currency_pair.id_martingala = null;
			data_currency_pair.current_gain = 0;
			data_currency_pair.max_gain = 0;
			data_currency_pair.data_entries = [];
		}
	}
}

/**
 * Si una entrada no se ejecuta en el sistema
 * se restablecen los valores
 */
function rollbackEntryMartingala(data_currency_pair){
	if(data_currency_pair.option_currently_open){
		data_currency_pair.attemps--;
		data_currency_pair.option_currently_open = false;
		data_currency_pair.attemps_direction += data_currency_pair.last_direction == 1?-1:1;
		data_currency_pair.data_entries.splice(0, 1);

		last_candle = data_currency_pair.currency_pair.getLastCandle();

		last_candle.alert_martingala = null;
		last_candle.update();

		//Si era un intento mayor al primero se debe realizar entrada obligatoria
		if(data_currency_pair.attemps > 0){
			data_currency_pair.mandatory_entry = true;
		}else{
			//Si martingala se esta ejecturando de manera global
			//y era el primer intento se restablecen los valores globales
			if(!config_trading.individual_martingala){
				global_martingala_is_running = false;
				active_id_global_martingala_running = null;
			}
		}
	}
}

/**
 * Realiza una entrada en el mercado
 * @param  {Boolean} direction [Dirección de la entrada true => alcista false => bajista]
 */
function enterNow(direction = true, data_currency_pair){
	let new_last_entry = new Date();
	new_last_entry = new_last_entry.getHours()+':'+new_last_entry.getMinutes();

	if(new_last_entry != data_currency_pair.last_entry){
		data_currency_pair.last_entry = new_last_entry;

		startEntry(direction?'call':'put', data_currency_pair.active_id, data_currency_pair.current_amount, data_currency_pair.current_utility);
	}
}

function startEntryMartingala(id_alert, direction, data_currency_pair) {
	if(run_martingala && max_attemps == null || data_currency_pair.attemps < max_attemps){
		var launch_alert = true;

		//SI se está ejecutando martingala de manera global
		//y hay una alerta corriendo pero de diferente par de divisas
		//no se debe ejecutar la entrada actual
		if(!config_trading.individual_martingala && global_martingala_is_running && data_currency_pair.active_id != active_id_global_martingala_running){
			return false;
		}

		//si es el primer intento pero tiene el mismo id
		//significa que es un intento más de una entrada fallida anterior
		//por lo cual no se debe lanzar la alerta
		if(data_currency_pair.attemps == 0 && data_currency_pair.id_martingala == id_alert && !data_currency_pair.option_equal){
			launch_alert = false;

			//SI se está ejecutando martingala de manera global
			if(!config_trading.individual_martingala){
				global_martingala_is_running = false;
				active_id_global_martingala_running = null;
			}
		}

		if(launch_alert){
			//si no es el primer intento y no es un empate se incrementa el importe
			if(data_currency_pair.attemps > 0/*attemps > 1*/ && !data_currency_pair.option_equal){
				increaceCurrentAmount(data_currency_pair);
			}

			data_currency_pair.id_martingala = id_alert;

			//siempre se restablece el valor de esta variable
			data_currency_pair.option_equal = false;

			data_currency_pair.last_entry = null;

			var send_entry = true;

			if(typeof stop_loss == 'number'){
				if(stop_loss_dynamic){
					//Si se ejecuta martingala individual en cada divisa
					//y las ganancias actuales menos el valor de la
					//inversión actual sobrepasan las perdidas permitidas
					//segun el stop_loss dinámico se detienen las entradas
					if(config_trading.individual_martingala && (data_currency_pair.current_gain - data_currency_pair.current_amount) < (data_currency_pair.max_gain - stop_loss)){
						send_entry = false;
					}
					//Si se ejecuta martingala de manera global
					//y las ganancias actuales menos el valor de la
					//inversión actual sobrepasan las perdidas permitidas
					//segun el stop_loss dinámico se detienen las entradas
					else if(!config_trading.individual_martingala && (global_current_gain - data_currency_pair.current_amount) < (global_max_gain - stop_loss)){
						send_entry = false;

						global_martingala_is_running = false;
						active_id_global_martingala_running = null;
					}
				}else{
					//Si se ejecuta martingala individual en cada divisa
					//y las ganancias actuales menos el valor de la
					//inversión actual sobrepasan las perdidas del stop_loss
					//se detienen las entradas
					if((data_currency_pair.current_gain - data_currency_pair.current_amount) < (stop_loss * -1)){
						send_entry = false;
					}
					//Si se ejecuta martingala de maneraglobal
					//y las ganancias actuales menos el valor de la
					//inversión actual sobrepasan las perdidas del stop_loss
					//se detienen las entradas
					else if(!config_trading.individual_martingala && (global_current_gain - data_currency_pair.current_amount) < (stop_loss * -1)){
						send_entry = false;

						global_martingala_is_running = false;
						active_id_global_martingala_running = null;
					}
				}
			}

			if(send_entry){
				console.log('Velocidad en la entrada: '+data_currency_pair.currency_pair.speed);
				enterNow(direction == 1?true:false, data_currency_pair);

				data_currency_pair.option_currently_open = true;
				data_currency_pair.entry_confirmed = false;
				data_currency_pair.attemps++;

				//Si martingala corre de manera global
				if(!config_trading.individual_martingala){
					global_martingala_is_running = true;
					active_id_global_martingala_running = data_currency_pair.active_id;
				}

				data_currency_pair.data_entries.push({
					amount:data_currency_pair.current_amount,
					utility:data_currency_pair.current_utility
				})

				setTimeout(function(){
					data_currency_pair.last_entry = null;
				}, 10000)
			}else{
				//si no se puede realizar la entrada se reinician los valores de inversión
				resetCurrentAmount(data_currency_pair);
			}
		}
	}else if(data_currency_pair.attemps >= max_attemps){
		//Si ya se llegó al tope de los intentos permitidos
		resetCurrentAmount(data_currency_pair);
	}
}

function stopEntriesMartingala(data_currency_pair) {
	if(run_martingala)
		resetCurrentAmount(data_currency_pair);
}