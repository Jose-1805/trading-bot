class CurrencyPair {

	constructor(name,big,candles_direction,candles_count,avg_candles_size,next_bullish_entry,next_bear_entry,probability_bullish_entry,probability_bear_entry,last_candles, data_trend) {
	  	this.name = name;
		this.big = big;
		this.candles_direction = candles_direction;
		this.candles_count = candles_count;
		this.avg_candles_size = avg_candles_size;
		this.next_bullish_entry = next_bullish_entry;
		this.next_bear_entry = next_bear_entry;
		this.probability_bullish_entry = probability_bullish_entry;
		this.probability_bear_entry = probability_bear_entry;
		this.last_candles = last_candles?last_candles:[];
		this.data_trend = data_trend;
		this.last_values = [];
		this.forecast_data = {
    		number_or_forecast:0,
    		success_rate:0
    	};
		this.speed = 0;
	}

	requestSync() {
		return fetch("http://127.0.0.1:8000/api/currency-pair/request-sync/"+this.name, {mode: 'no-cors'});
	}

	dataSync(data){
		//this.name = data.name;
		this.big = data.big;
		this.candles_direction = data.candles_direction;
		this.candles_count = data.candles_count;
		this.avg_candles_size = data.avg_candles_size;
		this.next_bullish_entry = data.next_bullish_entry;
		this.next_bear_entry = data.next_bear_entry;
		this.next_level_upper = data.next_level_upper;
		this.next_level_lowwer = data.next_level_lowwer;
		this.probability_bullish_entry = data.probability_bullish_entry;
		this.probability_bear_entry = data.probability_bear_entry;
		//this.last_candles = data.last_candles;
		this.data_trend = data.data_trend;
	}

	requestUpdateLevels(value){
		const url = "http://127.0.0.1:8000/api/currency-pair/request-update-levels/"+this.name+"/"+value;
		setTimeout(function(){
			return fetch(url, {mode: 'no-cors'});	
		}, 7000)
	}

	addLastValue(value){
		this.last_values.push(value);

		//Si hay N valores se empieza a eliminar el primero
		if(this.last_values.length > config_trading.values_for_calculate_speed){
			this.last_values.splice(0, (this.last_values.length - config_trading.values_for_calculate_speed));
		}

		let speed = 0;

		if(this.last_values.length > 1){
			for (var i = 1; i < this.last_values.length; i++) {
				//El dato actual es mayor al anterior
				if(this.last_values[i] > this.last_values[(i - 1)]){
					speed += this.last_values[i] - this.last_values[(i - 1)];
				}else{
					speed += this.last_values[(i-1)] - this.last_values[i];
				}
			}	

			speed = speed / (this.last_values.length - 1);
		}

		//La velocidad promedio en porcentaje se calcula tomando como 100% 
		//la conversión del tamaño promedio de velas en porcentaje (avg_candles_size) a 
		//la unidad de medida original, por tanto:
		//El movimiento promedio calculado es un porcentaje del tamaño de velas promedio
		speed = (speed * 100)/((this.avg_candles_size * this.big)/100);

		this.speed = parseFloat(speed).toFixed(2);
	}

	/**
	 * Determina cuantas rupturas de nivel tiene los ultimos datos
	 */
	setLastBrokesLevel(){
		let count_brokes = 0;

		if(this.last_candles.length <= config_trading.max_candles_for_set_brokes_level){
			for(let i = 0; i < this.last_candles.length; i++){
				count_brokes += (this.last_candles[i].is_broke_level?1:0);
			}
		}else{
			for(let i = (this.last_candles.length - config_trading.max_candles_for_set_brokes_level); i < config_trading.max_candles_for_set_brokes_level; i++){
				count_brokes += (this.last_candles[i].is_broke_level?1:0);
			}
		}

		this.last_brokes_level = count_brokes;
	}

	/**
	 * Retorna la ultima vela almacenada en el objeto
	 */
	getLastCandle(){
		if(this.last_candles.length){
			return this.last_candles[this.last_candles.length - 1];
		}
		return null;
	}

	/**
	 * Retorna la penúltima vela almacenada en el objeto
	 */
	getPenultimateCandle(){
		if(this.last_candles.length > 1){
			return this.last_candles[this.last_candles.length - 2];
		}
		return null;
	}

	/**
	 * Evalua si la ultima vela genera alerta de entrada
	 * y si se debe ejecutar la entrada
	 */
	evaluateLastAlertMartingala(current_open, data_currency_pair)
    {
        let last_candle = this.getLastCandle();
        if(last_candle){
	        let launch_alert = false;

	        //Tmaño máximo de salto permitido para la primera entrada
	        let max_jump = (((this.avg_candles_size * this.big)/100) * config_trading.max_jump_allowed_after_touch_level) / 100;

	        //si se creó alerta en la vela anterior
	        if(last_candle.alert_martingala == -1 || last_candle.alert_martingala == 1){
	            //vela alcista
	            if(last_candle.direction == 1){
	                //alerta por ruptura de nivel ruptura de nivel
	                if(last_candle.close > last_candle.level_martingala && last_candle.open < last_candle.level_martingala){
	                    launch_alert = true;

	                    //si hay salto al nivel anterior se recalculan los niveles
	                    if(current_open < last_candle.level_martingala){
	                        this.requestUpdateLevels(current_open);
	                    }

	                //si el cierre de la vela alcista es menor al nivel de la alerta
	                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
	                }else if(last_candle.close <= last_candle.level_martingala){
	                	//Si es el primer intento
	                	//Y existe un salto en ontra de la direccion de entrada (Bajista)
	                	if(data_currency_pair.attemps == 0 && (last_candle.close + max_jump) < current_open){
	                		last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_against);
	                        config_trading.active_log_martingala?console.log('Alerta cancelada por salto de precio en sentido contrario'):null;
	                	}else{
		                    //la alerta se puede enviar si es alcista
		                    //o si es bajista pero no hay un salto al siguiente nivel
		                    if(last_candle.alert_martingala == 1 || (last_candle.alert_martingala == -1 && this.next_level_upper > current_open)){
		                        launch_alert = true;
		                    }else{
		                        //si existe un salto al siguiente nivel la alerta se invierte
		                        //siempre y cuando el envío sea obligatorio
		                        if(last_candle.martingala_mandatory_shipping == 1){
		                            last_candle.alert_martingala = 1;
		                            launch_alert = true;
		                            last_candle.reasons_martingala += ("_"+reasons_martingala.inverted_for_jump_between_levels);
		                            config_trading.active_log_martingala?console.log('Alerta invertida por salto entre niveles'):null;
		                        }else{
		                            //la alerta no se envía y se calculan los niveles
		                            last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
		                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
		                            this.requestUpdateLevels(current_open);
		                        }
		                    }
		                }
	                //si el cierre de la vela alcista es mayor al nivel de la alerta
	                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
	                }else if(last_candle.close >= last_candle.level_martingala){
	                    //la alerta se puede enviar si es bajista
	                    //o si es alcista pero no hay un salto al nivel anterior
	                    if(last_candle.alert_martingala == -1 || (last_candle.alert_martingala == 1 && this.next_level_lowwer < current_open)){
	                        launch_alert = true;
	                    }else{
	                        //si existe un salto al nivel anterior la alerta se invierte
	                        //siempre y cuando el envío sea obligatorio
	                        if(last_candle.martingala_mandatory_shipping == 1){
	                            last_candle.alert_martingala = -1;
	                            launch_alert = true;
	                            last_candle.reasons_martingala += ("_"+reasons_martingala.inverted_for_jump_between_levels);
	                            config_trading.active_log_martingala?console.log('Alerta invertida por salto entre niveles'):null;
	                        }else{
	                            //la alerta no se envía y se calculan los niveles
	                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
	                            last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
	                            this.requestUpdateLevels(current_open);
	                        }
	                    }
	                }else{
	                    //la alerta fue creada de otra forma
	                    launch_alert = true;
	                }
	            
	            //vela bajista
	            }else if(last_candle.direction == -1){
	                //alerta por ruptura de nivel
	                if(last_candle.close < last_candle.level_martingala && last_candle.open > last_candle.level_martingala){
	                    launch_alert = true;

	                    //si hay salto al siguiente nivel se recalculan los niveles
	                    if(current_open > last_candle.level_martingala){
	                        this.requestUpdateLevels(current_open);
	                    }

	                //si el cierre de la vela bajista es mayor al nivel de la alerta
	                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
	                }else if(last_candle.close >= last_candle.level_martingala){
	                	//Si es el primer intento
	                	//Y existe un salto en contra de la direccion de entrada (Alcista)
	                	if(data_currency_pair.attemps == 0 && (last_candle.close - max_jump) > current_open){
	                		last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_against);
	                        config_trading.active_log_martingala?console.log('Alerta cancelada por salto de precio en sentido contrario'):null;
	                	}else{

		                    //la alerta se puede enviar si es bajista
		                    //o si es alcista pero no hay un salto al nivel anterior
		                    if(last_candle.alert_martingala == -1 || (last_candle.alert_martingala == 1 && this.next_level_lowwer < current_open)){
		                        launch_alert = true;
		                    }else{
		                        //si existe un salto al nivel anterior la alerta se invierte
		                        //siempre y cuando el envío sea obligatorio
		                        if(last_candle.martingala_mandatory_shipping == 1){
		                            last_candle.alert_martingala = -1;
		                            launch_alert = true;
		                        }else{
		                        	last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
		                            //la alerta no se envía y se calculan los niveles
		                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
		                            this.requestUpdateLevels(current_open);
		                        }
		                    }
		                }
	                //si el cierre de la vela bajista es menor al nivel de la alerta
	                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
	                }else if(last_candle.close <= last_candle.level_martingala){
	                    //la alerta se puede enviar si es alcista
	                    //o si es bajista pero no hay un salto al nivel superior
	                    if(last_candle.alert_martingala == 1 || (last_candle.alert_martingala == -1 && this.next_level_upper > current_open)){
	                        launch_alert = true;
	                    }else{
	                        //si existe un salto al nivel superopr la alerta se invierte
	                        //siempre y cuando el envío sea obligatorio
	                        if(last_candle.martingala_mandatory_shipping == 1){
	                            last_candle.alert_martingala = 1;
	                            launch_alert = true;
	                        }else{
	                        	last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
	                            //la alerta no se envía y se calculan los niveles
	                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
	                            this.requestUpdateLevels(current_open);
	                        }
	                    }
	                }else{
	                    //la alerta fue creada de otra forma
	                    launch_alert = true;
	                }
	            }else if(last_candle.direction == 0){
	            	//Si es el primer intento y es toque de nivel inferior
                	//Y existe un salto en contra de la direccion de entrada (Alcista)
                	if(data_currency_pair.attemps == 0 && last_candle.alert_martingala == 1 && (last_candle.close - max_jump) > current_open){
                		last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_against);
                        config_trading.active_log_martingala?console.log('Alerta cancelada por salto de precio en sentido contrario'):null;
                	}
                	//Si es el primer intento y es toque de nivel superior
                	//Y existe un salto en contra de la direccion de entrada (Bajista)
                	else if(data_currency_pair.attemps == 0 && last_candle.alert_martingala == -1 && (last_candle.close + max_jump) < current_open){
                		last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_against);
                        config_trading.active_log_martingala?console.log('Alerta cancelada por salto de precio en sentido contrario'):null;
                	}else{

		                //si el cierre de la vela es menor al nivel de la alerta
		                if(last_candle.close <= last_candle.level_martingala){
		                    //la alerta se puede enviar si es alcista
		                    //o si es bajista pero no hay un salto al siguiente nivel
		                    if(last_candle.alert_martingala == 1 || (last_candle.alert_martingala == -1 && this.next_level_upper > current_open)){
		                        launch_alert = true;
		                    }else{
		                        //si existe un salto al siguiente nivel la alerta se invierte
		                        //siempre y cuando el envío sea obligatorio
		                        if(last_candle.martingala_mandatory_shipping == 1){
		                            last_candle.alert_martingala = 1;
		                            launch_alert = true;
		                        }else{
		                        	last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
		                            //la alerta no se envía y se calculan los niveles
		                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
		                            this.requestUpdateLevels(current_open);
		                        }
		                    }
		                //si el cierre de la vela alcista es mayor al nivel de la alerta
		                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
		                }else if(last_candle.close >= last_candle.level_martingala){
		                    //la alerta se puede enviar si es bajista
		                    //o si es alcista pero no hay un salto al nivel anterior
		                    if(last_candle.alert_martingala == -1 || (last_candle.alert_martingala == 1 && this.next_level_lowwer < current_open)){
		                        launch_alert = true;
		                    }else{
		                        //si existe un salto al nivel anterior la alerta se invierte
		                        //siempre y cuando el envío sea obligatorio
		                        if(last_candle.martingala_mandatory_shipping == 1){
		                            last_candle.alert_martingala = -1;
		                            launch_alert = true;
		                        }else{
		                        	last_candle.reasons_martingala += ("_"+reasons_martingala.cancel_for_jump_between_levels);
		                            //la alerta no se envía y se calculan los niveles
		                            config_trading.active_log_martingala?console.log('Alerta cancelada por ruptura en salto'):null;
		                            this.requestUpdateLevels(current_open);
		                        }
		                    }
		                }else{
		                    //la alerta fue creada de otra forma
		                    launch_alert = true;
		                }
		            }
	            }

	        }

	        //la alerta cumple los criterios y se puede enviar
	        if(launch_alert){
	        	if(
	        		//velocidad permitida
	        		(
	        			this.speed <= config_trading.max_speed_for_entry
	        			&& this.speed >= config_trading.min_speed_for_entry
	        		)
	        		//velocidad NO permitida pero alerta obligatoria
	        		|| (
	        			(
	        				this.speed > config_trading.max_speed_for_entry 
	        				|| this.speed < config_trading.min_speed_for_entry 
	        			)
	        			&& last_candle.martingala_mandatory_shipping == 1
	        		)
        		){
	        		//Si se han perdido N intentos se realizan entradas solo en la dirección contraria a la
	        		//que ha tenido mas perdidas
	        		if(data_currency_pair.attemps >= config_trading.attemps_for_only_direction && data_currency_pair.attemps_direction != 0){
	        			last_candle.alert_martingala = data_currency_pair.attemps_direction > 0?-1:1;
		        		last_candle.reasons_martingala += ("_"+reasons_martingala.reassigned_by_several_failed_entries);
		        		config_trading.active_log_martingala?console.log('Entrada asigna en una sola dirección por perdidas consecutivas'):null;
	        		}else{
			            //Se suma el valor de la entrada para identificar la dirección con mas perdidas
			            data_currency_pair.attemps_direction += last_candle.alert_martingala;
			        }
			        //Se reasigna el valor del pronostico 
			        last_candle.forecast_for_next_candle = last_candle.alert_martingala;
			        //Se asigna el dato de pronostico
			        last_candle.reasons_martingala += "_FORECAST DIRECTION: "+last_candle.alert_martingala;
			        
			        startEntryMartingala(last_candle.id_martingala, last_candle.alert_martingala, data_currency_pair);
			        //Se asigna información de forecast
			        last_candle.reasons_martingala += "_FORECAST DATA: "+this.forecast_data.number_or_forecast+" - "+this.forecast_data.success_rate+"%";
			        data_currency_pair.last_direction = last_candle.alert_martingala;
		        }else{
		        	config_trading.active_log_martingala?console.log('Entrada cancelada por velocidad alta en movimiento de precio. Velocidad '+this.speed):null;
			        last_candle.reasons_martingala += "_"+reasons_martingala.cancel_for_high_speed+"_FORECAST DATA: "+this.forecast_data.number_or_forecast+" - "+this.forecast_data.success_rate+"%";
		        	last_candle.alert_martingala = null;
	                last_candle.level_martingala = null;
	                last_candle.id_martingala = null;
		        }

		        //Se actualiza la velocidad de movimiento
		        last_candle.speed = this.speed;

	        	setTimeout(function(){
                	last_candle.update();
                }, 3000);
		        config_trading.active_log_martingala?console.log('*******************************************************************'):null;
	        }else{
	            //si existía alerta pero no se envió
	            if(last_candle.alert_martingala == -1 || last_candle.alert_martingala == 1){
	                last_candle.alert_martingala = null;
	                last_candle.level_martingala = null;
	                last_candle.id_martingala = null;

	                setTimeout(function(){
	                	last_candle.update();
	                }, 3000);
	                config_trading.active_log_martingala?console.log('*******************************************************************'):null;
	            }
	        }
	    }
    }

    //Evalua los pronosticos generados por las velas
    evaluateForecasts(){
    	this.forecast_data = {
    		number_or_forecast:0,
    		success_rate:0
    	};

    	if(this.last_candles.length > 1){
    		let successes = 0;

    		let last_minute = null;

    		//Se evalua hasta la penultima vela para saber si la ultima cumple el pronostico
    		for (var i = 0; i < (this.last_candles.length - 1); i++) {
    			let date_last_candle = new Date(this.last_candles[i].date);

    			//las velas deben ser en minutos consecutivos
    			if(last_minute == null || last_minute == (date_last_candle.getMinutes() - 1) || (last_minute == 59 && date_last_candle.getMinutes() == 0)){
    				last_minute = date_last_candle.getMinutes();

	    			//Si existe pronostico
	    			if(this.last_candles[i].forecast_for_next_candle == 1 || this.last_candles[i].forecast_for_next_candle == -1){
	    				this.forecast_data.number_or_forecast++;
	    				//El pronostico se cumple
	    				if(this.last_candles[i].forecast_for_next_candle == this.last_candles[(i+1)].direction){
	    					successes++;
	    				}
	    			}
	    		}else{
	    			//si las velas no van en minutos conseutivos los datos
	    			//de pronostico se dejan en 0
	    			this.forecast_data = {
			    		number_or_forecast:0,
			    		success_rate:0
			    	};
			    	return false;
	    		}
    		}

    		//Se calcula el porcentaje de acierto
    		this.forecast_data.success_rate = successes > 0?((successes * 100)/this.forecast_data.number_or_forecast):0;
    		this.forecast_data.success_rate = parseFloat(parseFloat(this.forecast_data.success_rate).toFixed(2));
    	}
    }
}