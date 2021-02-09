class Candle {

	constructor(name,open,close,min,max,date,time,candle_size,direction,volume, currency_pair) {
	  	this.name = name;
        this.open = open;
        this.close = close;
        this.min = min;
        this.max = max;
        this.date = date;
        this.time = time;
        this.candle_size = candle_size;
        this.direction = direction;
        this.volume = volume;
        this.speed = currency_pair?currency_pair.speed:0;
        this.reasons_martingala = "";
        this.currency_pair = currency_pair;
	}

	save(){
	    let params = this.name
	        +'/'+this.open
	        +'/'+this.close
	        +'/'+this.min
	        +'/'+this.max
	        +'/'+this.date
	        +'/'+this.time
	        +'/'+this.volume
	        +'/'+this.candle_size
	        +'/'+this.direction
	        +'/'+this.id_martingala
	        +'/'+this.alert_martingala
	        +'/'+this.martingala_mandatory_shipping
	        +'/'+this.level_martingala
	        +'/'+this.martingala_alert_value
	        +'/'+this.speed
	        +'/'+(this.reasons_martingala != ""?this.reasons_martingala:'undefined');

	    return fetch("http://127.0.0.1:8000/api/iq_value/add_candle/"+params, {mode: 'no-cors'});
	}

	update(){
		let params = this.name
			+'/'+this.date
			+'/'+this.id_martingala
	        +'/'+this.alert_martingala
	        +'/'+this.martingala_mandatory_shipping
	        +'/'+this.level_martingala
	        +'/'+this.martingala_alert_value
	        +'/'+this.result_alert_martingala
	        +'/'+(this.reasons_martingala != ""?this.reasons_martingala:'undefined')
	        +'/'+this.speed;

	    return fetch("http://127.0.0.1:8000/api/iq_value/update_candle/"+params, {mode: 'no-cors'});
	}

	/**
     * Se define la direccion de la vela
     * 1 -> en dirección alcista
     * 0 -> sin dirección
     * -1 -> en dirección bajista
     */
    setDirection()
    {
        this.direction = this.open < this.close?1:(this.open > this.close?-1:0); 
    }

    /**
     * Define el tamaño de una vela de acuerdo al tamaño definido
     * como big en la tabla de par de divisas
     */
    setCandleSize()
    {
        //se calcula la diferencia entre el precio de apertura y cierre de la vela
        //dependiendo de su dirección
        let difference = this.direction == 1?(this.close - this.open):(this.direction == -1?this.open - this.close:0);
        //se define el tamaño de la vela en porcentaje
        //calculando el 100% como el tamaño definido para una vela grande en 'currency_pairs'
        let size = (difference * 100)/this.currency_pair.big;
        this.candle_size = parseFloat(size).toFixed(2);
    }

    bodyMaxValue()
    {
        return this.direction == 1?this.close:this.open;
    }

    bodyMinValue()
    {
        return this.direction == -1?this.close:this.open;
    }

    getSizeBody(){
    	return this.bodyMaxValue() - this.bodyMinValue();
    }

    /**
     * Calcula el tamaño en unidades de la mecha
     * @param  boolean upper [Si es la mecha superior o la inferior]
     */
    getSizeWick(upper = true)
    {
        if(upper)
            return this.max - this.bodyMaxValue();   
        else
            return this.bodyMinValue() - this.min;   
    }

    /**
     * Calcula el tamaño de una mecha de vela en porcentaje de acuerdo al del cuerpo de la vela
     * @param  boolean           upper         [Si es la mecha superior o inferior]
     */
    getPercentageWick(upper = true)
    {
    	if(this.currency_pair){
    		let size_body = this.getSizeBody();

    		//si el tamaño de la vela es 0
    		//se establece el 1% de una vela grande como tamaño de vela
    		if(size_body == 0){
    			size_body = this.currency_pair.big / 100;
    		}
	        return (this.getSizeWick(upper) * 100)/size_body;
	        //return (this.getSizeWick(upper) * 100)/((this.currency_pair.big * this.currency_pair.avg_candles_size)/100);
	    }
	    return 0;
    }

    /**
     * Evalua si la vela debe lanzar una alerta de entrada
     */
    evaluateMartingala()
    {
        let last_candle = this.currency_pair.getPenultimateCandle();

        let traders_mood_bullish = traders_mood;
        let traders_mood_bearish = (traders_mood - 100) * -1;

        if(last_candle){
        	let evaluate_martingala = true;

        	//Si la vela anterior no tiene alertas
        	//O si tiene pero se empató en el primer intento
        	if(
        		(last_candle.alert_martingala != 1 && last_candle.alert_martingala != -1)
        		|| ((last_candle.alert_martingala == 1 || last_candle.alert_martingala == -1) && (option_equal && attemps == 0))
        	){
        		//SI se ha identificado alta velocidad
        		if(high_speed){
	        		evaluate_martingala = false;
	        	}

	        	//Si no tiene aciertos suficientes en el pronostico
	        	//o tiene más aciertos de los permitidos
	        	if(
	        		this.currency_pair.forecast_data.success_rate < config_trading.min_forecast_success_rate
	        		|| this.currency_pair.forecast_data.success_rate > config_trading.max_forecast_success_rate
	        		|| this.currency_pair.forecast_data.number_or_forecast < config_trading.min_number_or_forecast
	        	){
	        		evaluate_martingala = false;
	        	}
        	}

        	if(evaluate_martingala){
	            let trend = this.currency_pair.data_trend;

	            let min_trend = 0;

	    		if(trend){
	    			min_trend = config_trading.min_percentage_trend * (this.currency_pair.avg_candles_size / config_trading.avg_candles_size_for_trend);
	    		}

	            //si se presenta figura big-small
	            let figure_big_small = false;//this.evaluateFigureBigSmall();

	            let have_old_alert = false;

	            //si la vela anterior lanzó alerta
	            if(last_candle.alert_martingala == 1 || last_candle.alert_martingala == -1){
	                //si no se asignó un valor de apertura se asigna la apertura de la vela actual
	                if(last_candle.martingala_alert_value == null){
	                    last_candle.martingala_alert_value = this.open;
	                }

	                //se asigna el resultado de la entrada
	                last_candle.result_alert_martingala = last_entry_result;

	                //si la alerta se cumplió o se empató en el primer intento
	                if(last_entry_result == 1 || (last_entry_result == 0 && attemps == 0)){
	                	//SI se ha identificado alta velocidad
		        		if(high_speed){
			        		evaluate_martingala = false;
			        	}

			        	//Si no tiene aciertos suficientes en el pronostico
			        	//o tiene más aciertos de los permitidos
			        	if(
			        		this.currency_pair.forecast_data.success_rate < config_trading.min_forecast_success_rate
			        		|| this.currency_pair.forecast_data.success_rate > config_trading.max_forecast_success_rate
			        		|| this.currency_pair.forecast_data.number_or_forecast < config_trading.min_number_or_forecast
			        	){
			        		evaluate_martingala = false;
			        	}
	                    //fin de alertas martingala
	                    stopEntriesMartingala();
	                }else{
	                    have_old_alert = true;
	                }

	                last_candle.update();
	            }else{
	            	//Si existe obligatoriedad de entrada por entrada no enviada al servidor 
	            	//pero entradas martingala iniciadas
	            	if(mandatory_entry){
	            		have_old_alert = true;
	            	}
	            }

	            mandatory_entry = false;

	            //Si se puede evaluar martingala
	            if(evaluate_martingala){
		            //si aun no existen alertas martingala
		            if(!have_old_alert){

		            	//Se restablece la variable con la que se identifica la dirección de entradas con mas perdidas
		            	attemps_direction = 0;
		            	//Las alertas se pueden generar si no existen varias rupturas
		            	if(this.currency_pair.last_brokes_level < config_trading.amount_brokes_level_for_cancel_entry){
			                let next_direction = this.assumeNextDirectionWithLevels();

			                //si se asume alguna dirección por toque o ruptura de nivel
			                if(next_direction.direction != 0){
			                    let continue_ = false;
			                    //siguiente dirección es alcista y el estado de animo es adecuado
			                    if(next_direction.direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood){
			                        continue_ = true;
			                    }
			                    //siguiente dirección es bajista y el estado de animo es adecuado
			                    else if(next_direction.direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood){
			                        continue_ = true;
			                    }else{
			                        config_trading.active_log_martingala?console.log('Estado de ánimo no adecuado'):null;
			                        this.reasons_martingala += ("_"+reasons_martingala.inverted_for_inadequate_traders_mood);
			                    }

			                    if(!continue_)
			                        config_trading.active_log_martingala?console.log('Alerta invertida por estado de ánimo inadecuado'):null;
			                    //if(continue_){                    
			                        //si la dirección no corresponde con el estado de animo
			                        //se invierte
			                        this.alert_martingala = continue_?next_direction.direction:next_direction.direction * -1;
			                        this.level_martingala = next_direction.level;
			                        this.martingala_mandatory_shipping = -1;
			                        this.id_martingala = this.time;
			                    //}
			                    //
			                    if(figure_big_small){	
			                    	config_trading.active_log_martingala?console.log('Dirección reasignada por figura big-small'):null;
			                    	this.reasons_martingala += ("_"+reasons_martingala.reassigned_for_big_small);
			                    	this.alert_martingala = this.direction * -1;
			                    }
			                }else{
			                	if(!config_trading.start_entries_only_in_levels){
				                	next_direction = this.assumeNextDirectionWithWicks();

				                    //si se asume una dirección por las caracteristicas de las mechas de la vela
				                    //pero el estado de animo es inadecuado
				                    if(
				                        next_direction != 0 
				                        && (
				                            (next_direction == 1 && traders_mood_bullish < config_trading.min_traders_mood_wicks)
				                            ||(next_direction == -1 && traders_mood_bearish < config_trading.min_traders_mood_wicks)
				                        )
				                    ){
				                    	this.reasons_martingala += ("_"+reasons_martingala.cancel_for_inadequate_traders_mood);
				                        config_trading.active_log_martingala?console.log('Dirección de mecha eliminada por estado de ánimo insuficiente'):null;
				                    }

				                    //si se asume alguna dirección con mechas
				                    //y el estado de animo esta a favor en lo indicado en config
				                    if(
				                        next_direction != 0 
				                        && (
				                            (next_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_wicks)
				                            ||(next_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_wicks)
				                        )
				                    ){
				                        config_trading.active_log_martingala?console.log('Dirección asignada por mecha'):null;
				                        this.alert_martingala = next_direction;
				                        this.level_martingala = (next_direction == 1)?this.currency_pair.next_level_lowwer:this.currency_pair.next_level_upper;
				                        this.martingala_mandatory_shipping = -1;
			                        	this.id_martingala = this.time;

				                    //si existe tendencia alta
				                    //y el estado de animo esta a favor en lo indicado en config
				                    }else if(
				                        trend && trend.trend_size_percentage >= min_trend
				                        && (
				                            (trend.trend_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_trend)
				                            ||(trend.trend_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_trend)
				                        )
				                    ){
				                        config_trading.active_log_martingala?console.log('Dirección asignada por tendencia'):null;
				                        this.reasons_martingala += ("_"+reasons_martingala.trend);
				                        this.alert_martingala = trend.trend_direction;
				                        this.level_martingala = (trend.trend_direction == 1)?this.currency_pair.next_level_lowwer:this.currency_pair.next_level_upper;
				                        this.martingala_mandatory_shipping = -1;
			                        	this.id_martingala = this.time;
				                    }else{
				                        //si hay un estado de ánimo alcista grande
				                        if(traders_mood_bullish >= config_trading.min_traders_mood_without_direction){
				                            config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo alcista'):null;
				                            this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
				                            this.alert_martingala = 1;
				                        	this.level_martingala = this.currency_pair.next_level_lowwer;
				                        	this.martingala_mandatory_shipping = -1;
			                        		this.id_martingala = this.time;
				                        }
				                        //si hay un estado de ánimo bajista grande
				                        else if(traders_mood_bearish >= config_trading.min_traders_mood_without_direction){
				                            config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo bajista'):null;
				                            this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
				                            this.alert_martingala = -1;
				                        	this.level_martingala = this.currency_pair.next_level_upper;
				                        	this.martingala_mandatory_shipping = -1;
			                        		this.id_martingala = this.time;
				                        }

				                    }
				                }
			                }
			            }
		            }else{//si ya se han iniado las alertas y la ultima no se ganó

			            let next_direction = this.assumeNextDirectionWithLevels();
		            	
		            	//si las alertas deben ir en una sola dirección
		            	let only_one_direction = false;
			            if(this.is_broke_level && this.currency_pair.last_brokes_level >= config_trading.amount_brokes_level_only_one_direction){
			            	only_one_direction = true;
			            }
		                
		                this.id_martingala = last_candle.id_martingala;
		                //el envío de la alerta es obligatorio
		                this.martingala_mandatory_shipping = 1;

		                //Se asigna una dirección por retpuras de nivel seguidas
			            if(only_one_direction){
			            	config_trading.active_log_martingala?console.log('Dirección asignada por rupturas de nivel seguidas'):null;
			            	this.reasons_martingala += ("_"+reasons_martingala.broke_level_continuous);
			            	this.alert_martingala = last_candle.alert_martingala;
		                    this.level_martingala = last_candle.level_martingala;
			            }else{
			                //si se asume alguna dirección por toque o ruptura de nivel
			                if(next_direction.direction != 0){
			                    let continue_ = false;
			                    //siguiente dirección es alcista y el estado de animo es adecuado
			                    if(next_direction.direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood){
			                        continue_ = true;
			                    }
			                    //siguiente dirección es bajista y el estado de animo es adecuado
			                    else if(next_direction.direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood){
			                        continue_ = true;
			                    }else{
			                        config_trading.active_log_martingala?console.log('Estado de ánimo no adecuado'):null;
			                        this.reasons_martingala += ("_"+reasons_martingala.inverted_for_inadequate_traders_mood);
			                    }

			                    if(!continue_)
			                        config_trading.active_log_martingala?console.log('Alerta invertida por estado de ánimo inadecuado'):null;

			                    //if(continue_){
			                        this.alert_martingala = continue_?next_direction.direction:next_direction.direction * -1;
			                        this.level_martingala = next_direction.level;
			                    //}
			                    //
			                }else{
			                    next_direction = this.assumeNextDirectionWithWicks();

			                    //si se asume una dirección por las caracteristicas de las mechas de la vela
			                    //pero el estado de animo es inadecuado
			                    if(
			                        next_direction != 0 
			                        && (
			                            (next_direction == 1 && traders_mood_bullish < config_trading.min_traders_mood_wicks)
			                            ||(next_direction == -1 && traders_mood_bearish < config_trading.min_traders_mood_wicks)
			                        )
			                    ){
			                    	this.reasons_martingala += ("_"+reasons_martingala.cancel_for_inadequate_traders_mood);
			                        config_trading.active_log_martingala?console.log('Dirección de mecha eliminada por estado de ánimo insuficiente'):null;
			                    }

			                    //si se asume alguna dirección con mechas
			                    //y el estado de animo esta a favor en lo indicado en config
			                    if(
			                        next_direction != 0 
			                        && (
			                            (next_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_wicks)
			                            ||(next_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_wicks)
			                        )
			                    ){
			                        config_trading.active_log_martingala?console.log('Dirección asignada por mecha'):null;
			                        this.alert_martingala = next_direction;
			                        this.level_martingala = last_candle.level_martingala;

			                    //si existe tendencia alta
			                    //y el estado de animo esta a favor en lo indicado en config
			                    }else if(
			                        trend && trend.trend_size_percentage >= min_trend
			                        && (
			                            (trend.trend_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_trend)
			                            ||(trend.trend_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_trend)
			                        )
			                    ){
			                        config_trading.active_log_martingala?console.log('Dirección asignada por tendencia'):null;
			                        this.reasons_martingala += ("_"+reasons_martingala.trend);
			                        this.alert_martingala = trend.trend_direction;
			                        this.level_martingala = last_candle.level_martingala;
			                    }else{
			                        //si hay un estado de ánimo alcista grande
			                        if(traders_mood_bullish >= config_trading.min_traders_mood_without_direction){
			                            config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo alcista'):null;
			                            this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
			                            this.alert_martingala = 1;
			                        }
			                        //si hay un estado de ánimo bajista grande
			                        else if(traders_mood_bearish >= config_trading.min_traders_mood_without_direction){
			                            config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo bajista'):null;
			                            this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
			                            this.alert_martingala = -1;
			                        }
			                        //si no se asume dirección se deja la existente
			                        else{
			                            config_trading.active_log_martingala?console.log('Dirección asignada por herencia'):null;
			                            this.reasons_martingala += ("_"+reasons_martingala.heritage);
			                            this.alert_martingala = last_candle.alert_martingala;
			                        }
			                        this.level_martingala = last_candle.level_martingala;

			                    }
			                }

			                if((this.alert_martingala == 1 || this.alert_martingala == -1) && figure_big_small){
			                	config_trading.active_log_martingala?console.log('Dirección reasignada por figura big-small'):null;
			                	this.reasons_martingala += ("_"+reasons_martingala.reassigned_for_big_small);
			                	this.alert_martingala = this.direction * -1;
			                }
			            }
		            }
		        }
	        }

            if(this.alert_martingala == 1){
                config_trading.active_log_martingala?console.log('Estado de ánimo alcista: '+traders_mood_bullish):null;
                config_trading.active_log_martingala?console.log('Entrada alcista'):null;
                this.forecast_for_next_candle = 1;
                this.reasons_martingala += '_UTILITY: '+current_utility+'%';
            }else if(this.alert_martingala == -1){
                config_trading.active_log_martingala?console.log('Estado de ánimo bajista: '+traders_mood_bearish):null;
                config_trading.active_log_martingala?console.log('Entrada bajista'):null;
                this.forecast_for_next_candle = -1;
                this.reasons_martingala += '_UTILITY: '+current_utility+'%';
            }else{
            	//Si no se generó alerta se manda a calcular la predición para la siguiente vela
            	this.calculateForecastForNextCandle();
            }
        }
    }

    /**
     * Calcula la predicción para la dirección de la siguiente vela
     */
    calculateForecastForNextCandle(){

    	config_trading.active_log_martingala?console.log('************************ INICIO DE INFORMACIÓN DE PRONOSTICO PARA SIGUIENTE VELA ***************************'):null;
    	this.reasons_martingala += '**';
    	let last_candle = this.currency_pair.getPenultimateCandle();

    	if(last_candle){

	        let traders_mood_bullish = traders_mood;
	        let traders_mood_bearish = (traders_mood - 100) * -1;
	        
	        let trend = this.currency_pair.data_trend;

	        let min_trend = 0;

			if(trend){
				min_trend = config_trading.min_percentage_trend * (this.currency_pair.avg_candles_size / config_trading.avg_candles_size_for_trend);
			}

	        //si se presenta figura big-small
	        let figure_big_small = false;//this.evaluateFigureBigSmall();

	        //Calcula si se puede definir una dircción por toque o ruptura de nivel
	        let next_direction = this.assumeNextDirectionWithLevels();
	    	
	    	//si las alertas deben ir en una sola dirección
	    	let only_one_direction = false;
	        if(this.is_broke_level && this.currency_pair.last_brokes_level >= config_trading.amount_brokes_level_only_one_direction){
	        	only_one_direction = true;
	        }

	        //No hay rutpuras de nivel seguidas
	        if(!only_one_direction){
	            //si se asume alguna dirección por toque o ruptura de nivel
	            if(next_direction.direction != 0){
	                let continue_ = false;
	                //siguiente dirección es alcista y el estado de animo es adecuado
	                if(next_direction.direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood){
	                    continue_ = true;
	                }
	                //siguiente dirección es bajista y el estado de animo es adecuado
	                else if(next_direction.direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood){
	                    continue_ = true;
	                }else{
	                    config_trading.active_log_martingala?console.log('Estado de ánimo no adecuado'):null;
	                    this.reasons_martingala += ("_"+reasons_martingala.inverted_for_inadequate_traders_mood);
	                }

	                if(!continue_)
	                    config_trading.active_log_martingala?console.log('Alerta invertida por estado de ánimo inadecuado'):null;

	                //if(continue_){
	                    this.forecast_for_next_candle = continue_?next_direction.direction:next_direction.direction * -1;
	                    this.level_martingala = next_direction.level;
	                //}
	                //
	            }else{
	            	if(!config_trading.start_entries_only_in_levels){
		                next_direction = this.assumeNextDirectionWithWicks();

		                //si se asume una dirección por las caracteristicas de las mechas de la vela
		                //pero el estado de animo es inadecuado
		                if(
		                    next_direction != 0 
		                    && (
		                        (next_direction == 1 && traders_mood_bullish < config_trading.min_traders_mood_wicks)
		                        ||(next_direction == -1 && traders_mood_bearish < config_trading.min_traders_mood_wicks)
		                    )
		                ){
		                	this.reasons_martingala += ("_"+reasons_martingala.cancel_for_inadequate_traders_mood);
		                    config_trading.active_log_martingala?console.log('Dirección de mecha eliminada por estado de ánimo insuficiente'):null;
		                }

		                //si se asume alguna dirección con mechas
		                //y el estado de animo esta a favor en lo indicado en config
		                if(
		                    next_direction != 0 
		                    && (
		                        (next_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_wicks)
		                        ||(next_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_wicks)
		                    )
		                ){
		                    config_trading.active_log_martingala?console.log('Dirección asignada por mecha'):null;
		                    this.forecast_for_next_candle = next_direction;
		                    this.level_martingala = (next_direction == 1)?this.currency_pair.next_level_lowwer:this.currency_pair.next_level_upper;

		                //si existe tendencia alta
		                //y el estado de animo esta a favor en lo indicado en config
		                }else if(
		                    trend && trend.trend_size_percentage >= min_trend
		                    && (
		                        (trend.trend_direction == 1 && traders_mood_bullish >= config_trading.min_traders_mood_trend)
		                        ||(trend.trend_direction == -1 && traders_mood_bearish >= config_trading.min_traders_mood_trend)
		                    )
		                ){
		                    config_trading.active_log_martingala?console.log('Dirección asignada por tendencia'):null;
		                    this.reasons_martingala += ("_"+reasons_martingala.trend);
		                    this.forecast_for_next_candle = trend.trend_direction;
		                    this.level_martingala = (trend.trend_direction == 1)?this.currency_pair.next_level_lowwer:this.currency_pair.next_level_upper;
		                }else{
		                    //si hay un estado de ánimo alcista grande
		                    if(traders_mood_bullish >= config_trading.min_traders_mood_without_direction){
		                        config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo alcista'):null;
		                        this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
		                        this.forecast_for_next_candle = 1;
		                        this.level_martingala = this.currency_pair.next_level_lowwer;
		                    }
		                    //si hay un estado de ánimo bajista grande
		                    else if(traders_mood_bearish >= config_trading.min_traders_mood_without_direction){
		                        config_trading.active_log_martingala?console.log('Dirección asignada por estado de ánimo bajista'):null;
		                        this.reasons_martingala += ("_"+reasons_martingala.traders_mood);
		                        this.forecast_for_next_candle = -1;
		                        this.level_martingala = this.currency_pair.next_level_upper;
		                    }
		                }
		            }
	            }

	            if((this.forecast_for_next_candle == 1 || this.forecast_for_next_candle == -1) && figure_big_small){
	            	config_trading.active_log_martingala?console.log('Dirección reasignada por figura big-small'):null;
	            	this.reasons_martingala += ("_"+reasons_martingala.reassigned_for_big_small);
	            	this.forecast_for_next_candle = this.direction * -1;
	            	this.reasons_martingala += '_UTILITY: '+current_utility+'%';
	            }

	            if(this.reasons_martingala != '**'){
	            	this.reasons_martingala += (this.forecast_for_next_candle == 1 || this.forecast_for_next_candle == -1)?("_FORECAST DIRECTION: "+this.forecast_for_next_candle):"";
	            	this.reasons_martingala += "_FORECAST DATA: "+this.currency_pair.forecast_data.number_or_forecast+" - "+this.currency_pair.forecast_data.success_rate+"%";
	            	this.reasons_martingala += '_UTILITY: '+current_utility+'%';
	            }
	        }  
	    }

        config_trading.active_log_martingala?console.log('************************ FIN DE INFORMACIÓN DE PRONOSTICO PARA SIGUIENTE VELA ***************************'):null;      
    }

    /**
     * Supone la dirección de la siguiente vela de acuerdo a sus niveles cercanos
     */
    assumeNextDirectionWithLevels()
    {   
        let data_return = {
            direction : 0,
            level : 0
        };

    	if(this.currency_pair && this.currency_pair.next_level_upper && this.currency_pair.next_level_lowwer && this.currency_pair.avg_candles_size){
    		let trend = this.currency_pair.data_trend;

    		let min_trend = 0;

    		if(trend){
    			min_trend = config_trading.min_percentage_trend * (this.currency_pair.avg_candles_size / config_trading.avg_candles_size_for_trend);
    		}

    		//La ruptura de niveles sólo se analiza cuando ya se han iniciado entradas martingala
    		if(attemps > 0){
		        //vela alcista y rompe nivel
		        if(this.direction == 1 && this.close > this.currency_pair.next_level_upper){
		        	this.is_broke_level = true;
		            //la dirección se asigna si la tendencia es grande, en sentido contrario a la tendencia
		            //la dirección se asigna si la vela es pequeña, en sentido contrario a la vela
		            //sino en sentido de la vela
		            config_trading.active_log_martingala?console.log('Dirección asignada por ruptura de nivel . vela alcista'):null;
		            this.reasons_martingala += ("_"+reasons_martingala.broke_level);
		            if(trend && trend.trend_direction == -1 && trend.trend_size_percentage >= min_trend){
		                config_trading.active_log_martingala?console.log('Dirección invertida por tendencia contraria grande'):null;
		                this.reasons_martingala += ("_"+reasons_martingala.inverted_for_big_trend);
		            }else if(this.candle_size <= (this.currency_pair.avg_candles_size * config_trading.factor_candle_small_broke)){
		                //config_trading.active_log_martingala?console.log('Dirección invertida por vela de ruptura pequeña'):null;
		                //this.reasons_martingala += ("_"+reasons_martingala.inverted_for_small_broke_level);

		            }
		            data_return.direction = (trend && trend.trend_direction == -1 && trend.trend_size_percentage >= min_trend)?-1:1;//((this.candle_size <= (this.currency_pair.avg_candles_size * config_trading.factor_candle_small_broke))?-1:1);
		            data_return.level = this.currency_pair.next_level_upper;
		            return data_return;
		        }//vela bajista y rompe nivel
		        else if(this.direction == -1 && this.close < this.currency_pair.next_level_lowwer){
		        	this.is_broke_level = true;
		            ////la dirección se asigna si la tendencia es grande, en sentido contrario a la tendencia
		            //la dirección se asigna si la vela es pequeña, en sentido contrario a la vela
		            //sino en sentido de la vela
		            config_trading.active_log_martingala?console.log('Dirección asignada por ruptura de nivel . vela bajista'):null;
		            this.reasons_martingala += ("_"+reasons_martingala.broke_level);
		            if(trend && trend.trend_direction == 1 && trend.trend_size_percentage >= min_trend){
		                config_trading.active_log_martingala?console.log('Dirección invertida por tendencia contraria grande'):null;
		                this.reasons_martingala += ("_"+reasons_martingala.inverted_for_big_trend);
		            }else if(this.candle_size <= (this.currency_pair.avg_candles_size * config_trading.factor_candle_small_broke)){
		                //config_trading.active_log_martingala?console.log('Dirección invertida por vela de ruptura pequeña'):null;
		                //this.reasons_martingala += ("_"+reasons_martingala.inverted_for_small_broke_level);

		            }
		            data_return.direction = (trend && trend.trend_direction == 1 && trend.trend_size_percentage >= min_trend)?1:-1;//((this.candle_size <= (this.currency_pair.avg_candles_size * config_trading.factor_candle_small_broke))?1:-1);
		            data_return.level = this.currency_pair.next_level_lowwer;
		            return data_return;
		        }
		    }

		    let distance_to_level = 0;
			let percentage_to_level = 0;

	        //se calcula si la mecha toca el nivel superior
		    if(this.bodyMaxValue() < this.currency_pair.next_level_upper){

		        distance_to_level = this.currency_pair.next_level_upper - this.max;
		        //distancia convertida a porcentaje de acuerdo al tamaño promedio de velas
		        percentage_to_level = (distance_to_level * 100)/((this.currency_pair.big * this.currency_pair.avg_candles_size)/100);
		        //si el máximo está cerca al siguiente nivel
		        if(percentage_to_level <= config_trading.proximity_to_level){
		            config_trading.active_log_martingala?console.log('Dirección asignada por toque de nivel superior'):null;
		            this.reasons_martingala += ("_"+reasons_martingala.touch_level_upper);
		            data_return.direction = -1;
		            data_return.level = this.currency_pair.next_level_upper;
		            return data_return;
		        }
		    }

	        //se calcula si la mecha toca el nivel inferior
	        if(this.bodyMinValue() > this.currency_pair.next_level_lowwer){
		        distance_to_level = this.min - this.currency_pair.next_level_lowwer;
		        //distancia convertida a porcentaje de acuerdo al tamaño promedio de velas
		        percentage_to_level = (distance_to_level * 100)/((this.currency_pair.big * this.currency_pair.avg_candles_size)/100);
		        //si el minimo está cerca al siguiente nivel
		        if(percentage_to_level <= config_trading.proximity_to_level){
		            config_trading.active_log_martingala?console.log('Dirección asignada por toque de nivel inferior'):null;
		            this.reasons_martingala += ("_"+reasons_martingala.touch_level_lowwer);
		            data_return.direction = 1;
		            data_return.level = this.currency_pair.next_level_lowwer;

		            return data_return;
		        }
		    }
		}
        return data_return;
    }

    /**
     * Supone la dirección de la siguiente vela de acuerdo a sus mechas
     */
    assumeNextDirectionWithWicks()
    {
    	if(this.currency_pair && this.currency_pair.avg_candles_size){

    		//Tamaño de las mechas de vela en porcentage de acuerdo al tamaño del cuerpo de la vela
	        let size_upper_wick = this.getPercentageWick(true);
	        let size_lowwer_wick = this.getPercentageWick(false);

	        //mecha inferior mas grande y tiene tamaño optimo
	        if(size_lowwer_wick > size_upper_wick && size_lowwer_wick >= config_trading.min_percentage_wick && size_lowwer_wick >= (size_upper_wick * config_trading.factor_for_small_wick)){
	            config_trading.active_log_martingala?console.log('Dirección asignada por mecha inferior grande'):null;
	            this.reasons_martingala += ("_"+reasons_martingala.lowwer_wick_big);
	            return 1;
	        }//mecha superior mas grande y tiene tamaño optimo
	        else if(size_lowwer_wick < size_upper_wick && size_upper_wick >= config_trading.min_percentage_wick && size_upper_wick >= (size_lowwer_wick * config_trading.factor_for_small_wick)){
	            config_trading.active_log_martingala?console.log('Dirección asignada por mecha superior grande'):null;
	            this.reasons_martingala += ("_"+reasons_martingala.upper_wick_big);
	            return -1;
	        }
	    }

        return 0;
    }

    /**
     * Evalua si se presenta la figura donde la ultima vela
     * es N veces más pequeña a la penultima y el sentido es contrario a la penultima
     * y la tendencia va a favor de la penultima
     */
    evaluateFigureBigSmall(){
    	if(this.currency_pair){
    		let trend = this.currency_pair.data_trend;

    		let last_candle = this.currency_pair.getPenultimateCandle();

    		if(last_candle){
    			//Las velas tienen una dirección diferente de 0 y son diferentes entre ellas
    			//y el tamaño de la ultima es mayor al minimo permitido
    			if(((this.candle_size * 100)/this.currency_pair.avg_candles_size) >= config_trading.min_size_figure_big_small && last_candle.direction != 0 && this.direction != last_candle.direction && this.direction != 0){
    				//si la penultima vela es N veces más grande de la actual, la tendencia la favorece
    				//y la vela pequeña no tiene señales de ir en contra a la dirección de la grande
    				if(last_candle.candle_size >= (this.candle_size * config_trading.factor_figure_big_small) && last_candle.direction == trend.trend_direction && this.assumeNextDirectionWithWicks() != this.direction){
    					return true;
    				}
    			}
    		}
    	}

    	return false;
    }
}