let data_currency_pairs = {
	//EUR-USD
	_1:{
		name:'EUR-USD',
		active_id:1,

		current_utility:null,//utilidad actual - Se configura al iniciar el sistema, después se actualiza automáticamente

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,//Ultimos datos de martingala enviados en el primer segundo de cada minuto
		traders_mood:50,//Estado de ánimo de los traders, se actualiza automáticamente 
		currency_pair:null,
		entry_confirmed:true,//Identifica la confirmación de una entrada en el mercado
		mandatory_entry:false,//Determina si se debe realizar una entrada obligatoria
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,//Determina si el precio de las divisas se está moviendo rápido
		restart_high_speed_at:null,//Almacena la fecha en que se debe restablecer la variable high_speed
		last_entry:null,//Hora y minuto de la ultima entrada
		option_currently_open:false,//indica si hay una opción abierta actualmente
		candle_pending_save:false,
		amount_last_candles:60,//cantidad de velas que debe guardar en memoria
		number_of_fast_movements:0,////Cantidad de movimientos rápidos detectados
		reset_number_of_fast_movements_at:null,//Fecha para restablecer numero de movimientos rápidos (Si no aparece uno nuevo)

		//PARA MARTINGALA
		current_amount:0,//Valor de inversión actual
		attemps:0,//Cantidad de intentos actuales
		current_gain:0,//Ganancias actuales
		max_gain:0,//Ganancia máxima obtenida
		option_equal:false,//Identifica si la utlima entrada se empató
		id_martingala:null,//Identificador de la entrada martingala
		data_entries:[],//Datos de las entradas realizadas

		//Suma o resta la direccion de cada alerta en una entrada martingala
		//Si hay tres entradas al alza su valor será 3 y hay dos entradas al alza y una a la baja su valor sera 1
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-USD//OTC
	_76:{
		name:'EUR-USD',//OTC
		active_id:76,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//AUD-USD
	_99:{
		name:'AUD-USD',
		active_id:99,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//NZD-USD
	_8:{
		name:'NZD-USD',
		active_id:8,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//NZD-USD//OTC
	_80:{
		name:'NZD-USD',//OTC
		active_id:80,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-NZD
	_212:{
		name:'EUR-NZD',
		active_id:212,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-JPY
	_4:{
		name:'EUR-JPY',
		active_id:4,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//GBP-USD
	_5:{
		name:'GBP-USD',
		active_id:5,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//GBP-USD//OTC
	_81:{
		name:'GBP-USD',//OTC
		active_id:81,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//GBP-JPY
	_3:{
		name:'GBP-JPY',
		active_id:3,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-GBP
	_2:{
		name:'EUR-GBP',
		active_id:2,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-GBP//OTC
	_77:{
		name:'EUR-GBP',//OTC
		active_id:77,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//AUD-JPY
	_101:{
		name:'AUD-JPY',
		active_id:101,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//EUR-AUD
	_108:{
		name:'EUR-AUD',
		active_id:108,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
	
	//USD-JPY
	_6:{
		name:'USD-JPY',
		active_id:6,

		current_utility:null,

		last_params:'start',//ultimos parametros enviados al servidor
		last_martingala_one:null,
		traders_mood:50,
		currency_pair:null,
		entry_confirmed:true,
		mandatory_entry:false,
		last_entry_result:null,
		last_candle_generated:null,
		last_direction:0,
		high_speed:false,
		restart_high_speed_at:null,
		last_entry:null,
		option_currently_open:false,
		candle_pending_save:false,
		amount_last_candles:60,
		number_of_fast_movements:0,
		reset_number_of_fast_movements_at:null,
		current_amount:0,
		attemps:0,
		current_gain:0,
		max_gain:0,
		option_equal:false,
		id_martingala:null,
		data_entries:[],
		attemps_direction:0,
		active:true,
		enabled:false
	},
}