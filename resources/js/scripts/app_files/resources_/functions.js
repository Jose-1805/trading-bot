/*******************************
FUNCIONES PARA MARTINGALA
*******************************/
	
	function resetAttemps() {
		attemps = 0;
	}
	
	/**
	 * Incrementa la inversión de acuerdo a la configuración
	 */
	function increaceCurrentAmount(){
		setCurrentAmount(current_amount * factor_increase);
	}

	/**
	 * Restaura los valores de inversión
	 */
	function resetCurrentAmount(){
		resetAttemps();
		setCurrentAmount(initial_amount);   
	}  

	/**
	* Limpia el tablero de importe
	*/
	function deleteCurrentAmount(){
		var length_ = current_amount.toString().length;

		for(var i = 0; i < length_; i++){
		 	simulateKeyboard('keydown', 8);
		}
	}

	/**
	* Asigna un nuevo valor al current_amount y lo agrega en pantalla
	* @param {Number} new_current_amount [Nuevo importe]
	*/
	function setCurrentAmount(new_current_amount = 1){
		//deleteCurrentAmount();
		focusAmount();

		new_current_amount = parseFloat(new_current_amount).toFixed(2);

		var length_ = new_current_amount.toString().length;
		for(var i = 0; i < length_; i++){
			simulateKeyboard('keypress', key_codes['_'+new_current_amount.toString()[i]]);   
		}

		current_amount = new_current_amount;
	}


/********************************************
FUNCIONES DE CONTROL DE ELEMENTOS DE PANTALLA
********************************************/

	/**
	 * Simula un evento en el teclado
	 * @param  {String} event    [Nombre del evento]
	 * @param  {Integer} key_code [Clave de la tecla que genera el evento]
	 */
	function simulateKeyboard(event = 'keypress', key_code){
	    var evt = new KeyboardEvent(event, {'keyCode':key_code});
	    var cb = document.getElementById('glcanvas');
	    cb.focus();
	    cb.dispatchEvent(evt);  
	}

	/**
	 * Simula un clic en una coordenada de la pantalla
	 * @param  {String} evt [Nombre del evento]
	 * @param  {Float} x   [Coordenada x]
	 * @param  {Float} y   [Coordenada y]
	 */
	function simulateClick(evt, x, y) {
	    var event = new MouseEvent(evt, {
	      view: window,
	      button: 0,
	      buttons: 0,
	      bubbles: true,
	      cancelBubble: false,
	      cancelable: true,
	      clientX: x,
	      clientY: y,
	      screenX: x,
	      screenY: y+130,
	      pageX: x,
	      pageY: y,
	      offsetX: x,
	      offsetY: y,
	      which: 1,
	      x: x,
	      y: y
	    });
	    var cb = document.getElementById('glcanvas');
	    var cancelled = !cb.dispatchEvent(event);
	    /*if (cancelled) {
	      // A handler called preventDefault.
	      console.log("cancelled");
	    } else {
	      // None of the handlers called preventDefault.
	      console.log("not cancelled");
	    }*/
	}

	/**
	 * Establece el foco en la intrada del importe
	 */
	function focusAmount(){
		var height_buttons = getHeightButtons();

		//tamaño del campo de ingreso en porcentaje de pantalla
		var height_amount = 9;

		//tamaño máximo del campo de ingreso en pixeles
		var max_height_amount = 50;

		var current_height_amount = max_height_amount;

		if(window.innerHeight < max_height){
			current_height_amount = (window.innerHeight * height_amount) / 100;
		}


		var x = window.innerWidth - (height_buttons / 2);

		var y = window.innerHeight - ((height_buttons * 3) + (current_height_amount * 0.8));

		y = (window.innerHeight > max_height)?(y - (window.innerHeight - max_height)):y;

		if(window.innerHeight < max_height){
			y -= (window.innerHeight * 0.15);
		}		

		y = parseInt(y);
		x = parseInt(x);

		simulateClick('mousedown', x, y);
		simulateClick('mouseup', x, y);

		simulateClick('mousedown', x, y);
		simulateClick('mouseup', x, y);	
	}

	/**
	 * Calcula la altura de los botones de entrada
	 */
	function getHeightButtons(){
		var size_buttons = 15;

		//altura mázima que puede tener un botón
		var max_height_buttons = 120;

		var height_buttons = max_height_buttons;

		if(window.innerHeight < max_height){
			height_buttons = (window.innerHeight * size_buttons) / 100;
		}

		return height_buttons;
	}


/********************************************
FUNCIONES GENERALES DEL SISTEMA
********************************************/

	/**
	 * Realiza una entrada en el mercado
	 * @param  {Boolean} direction [Dirección de la entrada true => alcista false => bajista]
	 */
	function enterNow(direction = true){
		let new_last_entry = new Date();
		new_last_entry = new_last_entry.getHours()+':'+new_last_entry.getMinutes();

		if(new_last_entry != last_entry){
			last_entry = new_last_entry;

			var height_buttons = getHeightButtons();

			var x = window.innerWidth - (height_buttons / 2);

			var y = window.innerHeight - (direction?(height_buttons * 1.5):(height_buttons * 0.5));

			y = (window.innerHeight > max_height)?(y - (window.innerHeight - max_height)):y;

			if(window.innerHeight < max_height){
				y -= (window.innerHeight * 0.1);
			}		

			y = parseInt(y);
			x = parseInt(x);
			simulateClick('mousedown', x, y);
			simulateClick('mouseup', x, y);
		}
	}

	//var print_data = true;
	/**
	 * Recive y analiza los datos que se generan dentro de cada minuto
	 * @param  {Objext} data [Objeto con los datos de la vela]
	 */
	function evaluateCandle(data){

		/*if(print_data){
			console.log(data);
			print_data = false;
		}*/
		//Registra el ultimo valor y calcula la velocidad del movimiento
		if(currency_pair && 'close' in data){
			currency_pair.addLastValue(data.close);

			//Si se detecta un movimiento rápido
			if(currency_pair.speed > config_trading.speed_for_block_entries){
				let date_ = new Date();
				date_.setSeconds(date_.getSeconds() + config_trading.seconds_to_reset_number_of_fast_movements);

				//Fecha de restablecimiento de contador de movimientos rápidos
				reset_number_of_fast_movements_at = date_.getFullYear()
	            +'-'+(date_.getMonth()+1)  
	            +'-'+date_.getDate()  
	            +' '+date_.getHours()
	            +':'+date_.getMinutes()
	            +':'+date_.getSeconds();

				number_of_fast_movements++;
	            config_trading.active_log_martingala?console.log('Movimiento rápido detectado (actuales: '+number_of_fast_movements+')'):null;

	            //Si no hay una opción abierta y la cantidad de movimientos rápidos
	            //alcanza o supera el limite se bloquean las entradas por unos minutos
				if(!option_currently_open && number_of_fast_movements >= config_trading.number_of_fast_movements_to_block_entries){
					//Se desactivan las alertas por alta velocidad
					high_speed = true;

					let date_ = new Date();
					date_.setMinutes(date_.getMinutes() + config_trading.high_speed_lock_minutes);

					//Fecha de reactivación de entradas
					restart_high_speed_at = date_.getFullYear()
		            +'-'+(date_.getMonth()+1)  
		            +'-'+date_.getDate()  
		            +' '+date_.getHours()
		            +':'+date_.getMinutes();

		            number_of_fast_movements = 0;

		            config_trading.active_log_martingala?console.log('Alertas suspendidas por movimiento rápido del precio, se reactivaran automáticamente -> '+restart_high_speed_at):null;
				}
			}
		}

		//Si las alertas están suspendidas por alta velocidad
		if(high_speed){
			let current_date = new Date();

			current_date = current_date.getFullYear()
            +'-'+(current_date.getMonth()+1)  
            +'-'+current_date.getDate()  
            +' '+current_date.getHours()
            +':'+current_date.getMinutes();

            if(current_date == restart_high_speed_at){
            	high_speed = false;
            	config_trading.active_log_martingala?console.log('Alertas activadas nuevamente ***************'):null;
            }
		}

		//Si el contador de movimientos rápidos está iniciado
		if(number_of_fast_movements > 0){
			let current_date = new Date();

			current_date = current_date.getFullYear()
            +'-'+(current_date.getMonth()+1)  
            +'-'+current_date.getDate()  
            +' '+current_date.getHours()
            +':'+current_date.getMinutes()
            +':'+current_date.getSeconds();

            if(current_date == reset_number_of_fast_movements_at){
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

	    /*if(date_at.getSeconds() == 25){
	    	id_martingala = null;
	    	startEntryMartingala(1,1);
	    	id_martingala = null;
	    }*/
	    //si es el segundo 0 se establecen los parametros para
	    //guardar los datos de la vela si el se recibe más de un dato 
	    //por segundo se tomará el ultimo
	    if(date_at.getSeconds() == 0){
	        last_params = {
		        name,
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
	    	if(date_at.getSeconds() >= 15 && option_currently_open && !entry_confirmed){
	    		rollbackEntryMartingala();
	    	}

	    	//Si existen parametros para enviar al servidor
	    	if(last_params != 'start'){

	    		last_candle_generated = new Candle(
	    			last_params.name,
			        last_params.open,
			        last_params.close,
			        last_params.min,
			        last_params.max,
			        last_params.date,
			        last_params.time,
			        last_params.candle_size,
			        last_params.direction,
			        last_params.volume,
			        currency_pair
		        );
	    		last_candle_generated.is_broke_level = false;
	    		last_candle_generated.setDirection();

	    		//si ya se sincronizo el objeto currency_pair
	    		//y no existe una opción abierta
	    		if(currency_pair && !option_currently_open){
	    			last_candle_generated.setCandleSize();

		    		//se agrega la vela a la lista de velas del objeto currency_pair
		    		currency_pair.last_candles.push(last_candle_generated);

		    		//Si hay N velas se empieza a eliminar la primera
					if(currency_pair.last_candles.length >= (amount_last_candles + 1)){
						currency_pair.last_candles.splice(0, 1);
					}
		    		
		    		//Se calculan los datos de pronostico de las velas almacenadas en last_candle
		    		currency_pair.evaluateForecasts();

		    		//se recalcula la cantidad de rupturas de nivel en las ultimas
		    		//N velas
		    		currency_pair.setLastBrokesLevel();

	    			//si martingala esta corriendo se evalua
	    			//si se debe crear una entrada
		    		if(run_martingala /*&& currency_pair.last_candles.length >= amount_last_candles*/){
		    			last_candle_generated.evaluateMartingala();
		    		}else{
		    			last_candle_generated.calculateForecastForNextCandle();
		    		}

					candle_pending_save = false;

					setTimeout(function(){
		    			last_candle_generated.save();
		    		}, 2000);			    		
		    	}else{
		    		//si no se ha creado currency_pair
		    		if(!currency_pair){
		    			//si no existe el objeto currency_pair se crea
			    		currency_pair = new CurrencyPair();
			    		currency_pair.name = name;
			    	//si existe una opción abierta
			    	}else if(option_currently_open){
			    		candle_pending_save = true;
			    	}
		    	}

		    	//restablecimiento de parametros para no seguir enviando
		    	//datos al servidor durante el minuto actual
	    		last_params = 'start';

	    		//En 5 segundos se envía a guardar la vela si se puede
	    		//y se sincroniza el objeto currency_pair con el servidor
	    		setTimeout(function(){
	    			currency_pair.requestSync();
	    		}, 5000);
	    	}else{
	    		//si existe una vela pendiente de envío y ya se cerró
	    		//la opcion que estaba abierta
	    		if(candle_pending_save && !option_currently_open){
		    		last_candle_generated.setCandleSize();

		    		//se agrega la vela a la lista de velas del objeto currency_pair
		    		currency_pair.last_candles.push(last_candle_generated);

		    		//Si hay N velas se empieza a eliminar la ultima
					if(currency_pair.last_candles.length >= (amount_last_candles + 1)){
						currency_pair.last_candles.splice(0, 1);
					}
		    		
		    		//Se calculan los datos de pronostico de las velas almacenadas en last_candle
		    		currency_pair.evaluateForecasts();

		    		//se recalcula la cantidad de rupturas de nivel en las ultimas
		    		//N velas
		    		currency_pair.setLastBrokesLevel();

	    			//si martingala esta corriendo se evalua
	    			//si se debe crear una entrada
		    		if(run_martingala /*&& currency_pair.last_candles.length >= amount_last_candles*/){
		    			last_candle_generated.evaluateMartingala();
		    		}else{
		    			last_candle_generated.calculateForecastForNextCandle();
		    		}

					candle_pending_save = false;

					setTimeout(function(){
		    			last_candle_generated.save();
		    		}, 2000);	
				}
	    	}

	    	//Si martingala esta corriendo, no se han evaluado alertas en el minuto actual
	    	//y no hay una entrada abierta
	    	if(run_martingala && last_martingala_one != date_at.getMinutes() && !option_currently_open){
	    		//console.log('Enviando datos de primer segundo en '+date_send_at_s_s);
	    		
	    		//en last_martingala_one se almacena el ultimo minuto que se 
	    		//realizo la evaluación de alertas martingala (Solo se evalua una vez por minuto)
	    		last_martingala_one = date_at.getMinutes();

	    		//si ya se sincronizo el objeto currency_pair
	    		//se evalua la entrada martingala con la posición de apertura de la vela actual
	    		if(currency_pair){
	    			currency_pair.evaluateLastAlertMartingala(data.open);
	    		}
	    	}

	    	//en entradas de nivel se analizan los datos segundo a segundo
	    	if(run_entries_to_level){
		        if(second_to_second){
		            const params = /*NAME*/name
		            /*CLOSE*/+'/'+data.close
		            /*OPEN*/+'/'+data.open
		            /*MAX*/+'/'+data.max
		            /*DATE*/+'/'+date_send_at_s_s;

		            fetch("http://127.0.0.1:8000/api/iq_value/evaluate/"+params, {mode: 'no-cors'});
		        }
		    }
	    }
	}

	/**
	 * Envia valor de la ultima alerta al servidor
	 * @param {Float} value [Valor de la alerta]
	 */
	function setEntryValue(value){
		if(run_martingala){
			setTimeout(function(){
				fetch("http://127.0.0.1:8000/api/iq_value/set-entry-value-martingala/"+name+"/"+value, {mode: 'no-cors'});
			}, 7000);
		}
	}

	function startMartingala(){
		if(!run_martingala){
			console.log('Martingala iniciado');
			run_martingala = true;
			current_amount = initial_amount;
			attemps = 0;
			option_equal = false;
			id_martingala = null;
			current_gain = 0;
			max_gain = 0;
			data_entries = [];
			//listenWebsocket();
		}
	}

	function stopMartingala(){
		if(run_martingala){
			console.log('Martingala detenido');
			run_martingala = false;
			current_amount = initial_amount;
			attemps = 0;
			option_equal = false;
			id_martingala = null;
			current_gain = 0;
			max_gain = 0;
			data_entries = [];
			//leaveWebsocket();
		}
	}

	/**
	 * Si una entrada no se ejecuta en el sistema
	 * se restablecen los valores
	 */
	function rollbackEntryMartingala(){
		if(option_currently_open){
			attemps--;
			option_currently_open = false;
			attemps_direction += last_direction == 1?-1:1;
			data_entries.splice(0, 1);

			last_candle = currency_pair.getLastCandle();

			last_candle.alert_martingala = null;
			last_candle.update();

			//Si era un intento mayor al primero se debe realizar entrada obligatoria
			if(attemps > 0){
				mandatory_entry = true;
			}
		}
	}

	function startEntryMartingala(id_alert, direction) {
		if(run_martingala && max_attemps == null || attemps < max_attemps){
			var launch_alert = true;

			//si es el primer intento pero tiene el mismo id
			//significa que es un intento más de una entrada fallida anterior
			//por lo cual no se debe lanzar la alerta
			if(attemps == 0 && id_martingala == id_alert && !option_equal){
				launch_alert = false;
			}

			if(launch_alert){
				if(attemps == -10){
					attemps++;
				}else{
					//si no es el primer intento y no es un empate se incrementa el importe
					if(attemps > 0/*attemps > 1*/ && !option_equal){
						increaceCurrentAmount();
					}else{
						setCurrentAmount(current_amount);
					}

					id_martingala = id_alert;

					//siempre se restablece el valor de esta variable
					option_equal = false;

					last_entry = null;

					var send_entry = true;

					if(typeof stop_loss == 'number'){
						if(stop_loss_dynamic){
							//si las ganancias actuales menos el valor de la
							//inversión actual sobrepasan las perdidas permitidas
							//segun el stop_loss dinámico se detienen las entradas
							if((current_gain - current_amount) < (max_gain - stop_loss)){
								send_entry = false;
							}
						}else{
							//si las ganancias actuales menos el valor de la
							//inversión actual sobrepasan las perdidas del stop_loss
							//se detienen las entradas
							if((current_gain - current_amount) < (stop_loss * -1)){
								send_entry = false;
							}
						}
					}

					if(send_entry){
						console.log('Velocidad en la entrada: '+currency_pair.speed);
						enterNow(direction == 1?true:false);
						option_currently_open = true;
						entry_confirmed = false;
						attemps++;

						data_entries.push({
							amount:current_amount,
							utility:current_utility
						})

						//En 35 segundos se hace click en el lugar donde se ubica 
						//el botón de entrada alcista para habilitar una siguiente entrada
						setTimeout(function(){
							last_entry = null;
							enterNow(true);
						}, 35000)
					}else{
						//si no se puede realizar la entrada se reinician los valores de inversión
						resetCurrentAmount();
					}
				}
			}
		}else if(attemps >= max_attemps){
			//Si ya se llegó al tope de los intentos permitidos
			resetCurrentAmount();
		}
	}

	function stopEntriesMartingala() {
		if(run_martingala)
			resetCurrentAmount();
	}

	function listenerWebSocket(e){
		if(e.message.type == 'sync_currency_pair' && e.message.data.name == currency_pair.name){
			currency_pair.dataSync(e.message.data);
		}else{
			if(run_entries_to_level){

				if(e.message.type == 'alert'){
					//if(e.message.data.currency_pair_name == name)
						//enterNow(e.message.data.direction_alert == 1?true:false);
				}else if(e.message.type == 'full_data'){
					/*var data = e.message.data;
					second_to_second = false;

					for (var i = 0; i < data.length; i++) {
						if(data[i].launch_alerts == 1 && data[i].name == name && (data[i].next_bullish_entry || data[i].next_bear_entry)){
							second_to_second = true;
						}
					}*/

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


/********************************************
FUNCIONES INTERCEPTADAS
********************************************/
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

	listenWebsocket();