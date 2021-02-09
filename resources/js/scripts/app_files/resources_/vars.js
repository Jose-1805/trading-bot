/***********************************
VARIABLES PARA GENERALES DEL SISTEMA
/**********************************/

	var last_params = "start";//Ultimos paramtros definidos para envíar al sistema
	
	//var name = "EUR-USD";//Nombre del par de divisas
	//var active_id = 1;//Identificador del par de divisas
	//var active_id = 76;//Identificador del par de divisas OTC

	//var name = "AUD-USD";
	//var active_id = 99;

	//var name = "NZD-USD";
	//var active_id = 8;
	//var active_id = 80;//OTC

	//var name = "EUR-NZD";
	//var active_id = 212;

	//var name = "EUR-JPY";
	//var active_id = 4;

	var name = "GBP-USD";
	var active_id = 5;
	//var active_id = 81;//OTC

	//var name = "GBP-JPY";
	//var active_id = 3;

	//var name = "EUR-GBP";
	//var active_id = 2;
	//var active_id = 77;//OTC

	//var name = "AUD-JPY";
	//var active_id = 101;

	//var name = "EUR-AUD";
	//var active_id = 108;

	//var name = "USD-JPY";
	//var active_id = 6;

	var current_utility = 77;//utilidad actual - Se configura al iniciar el sistema, después se actualiza automáticamente
	var second_to_second = true;//Determina si se envían datos segundo a segundo
	var last_martingala_one = null;//Ultimos datos de martingala enviados en el primer segundo de cada minuto
	var traders_mood = 50;//Estado de ánimo de los traders, se actualiza automáticamente 
	var currency_pair = null;

	var entry_confirmed = true;//Identifica la confirmación de una entrada en el mercado

	var mandatory_entry = false;//Determina si se debe realizar una entrada obligatoria

	var last_entry_result = null;

	var last_candle_generated = null;

	var last_direction = 0;

	//cantidad de velas que debe guardar en memoria
	var amount_last_candles = 60;

	//Determina so el precio de las divisas se está moviendo rápido
	var high_speed = false;

	//Almacena la fecha en que se debe restablecer la variable high_speed
	var restart_high_speed_at = null;

	//altura máxima de la pantalla para calcular el tamaño de los botónes
	//si la altura es mayor los botones tienen una altura fija
	var max_height = 600; 

	var run_martingala = false;//Habilida o desabilita las funcionalidades de martingala
	var run_entries_to_level = false;//Habilida o desabilita las funionalidades de alertas de toque de nivel

	//Hora y minuto de la ultima entrada
	let last_entry = null;

	//indica si hay una opción abierta actualmente
	let option_currently_open = false;

	let candle_pending_save = false;

	//Cantidad de movimientos rápidos detectados
	let number_of_fast_movements = 0;

	//Fecha para restablecer numero de movimientos rápidos (Si no aparece uno nuevo)
	let reset_number_of_fast_movements_at = null;

	//Suma o resta la direccion de cada alerta en una entrada martingala
	//Si hay tres entradas al alza su valor será 3 y hay dos entradas al alza y una a la baja su valor sera 1
	let attemps_direction = 0;

/*************************
VARIABLES PARA MARTINGALA
*************************/
	var initial_amount = 1;//Valor de la inversión inicial
	var current_amount = initial_amount;//Valor de inversión actual
	var factor_increase = 2.25;//Factor para incremento de inversión en cada pérdida
	var max_attemps = null;//Cantidad máxima de intentos seguidos que deben ejecutarse
	var attemps = 0;//Cantidad de intentos actuales
	var option_equal = false;//Identifica si la utlima entrada se empató
	var id_martingala = null;//Identificador de la entrada martingala

	//Lista de caracteres permitidos para cambiar la inversión actual
	var key_codes = {
	'_.':46,
	'_0':48,
	'_1':49,
	'_2':50,
	'_3':51,
	'_4':52,
	'_5':53,
	'_6':54,
	'_7':55,
	'_8':56,
	'_9':57
	};

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
	};

/***********************************************************
VARIABLES PARA CONTROL DE PERDIDAS Y GANANCIAS EN MARTINGALA
/**********************************************************/
	//Precio de perdida en que el sistema se detiene
	var stop_loss = null;

	//El precio de perdida se calcula de acuerdo a la ganancia
	//máxima obtenida
	var stop_loss_dynamic = true;

	//Ganancias actuales
	var current_gain = 0;

	//Ganancia máxima obtenida
	var max_gain = 0;

	//Datos de las entradas realizadas
	var data_entries = [];