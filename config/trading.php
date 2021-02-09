<?php

return [
    /*******************************************
     ******** CONFIGURACIÓN PARA PICOS, ********
     ******** NIVELES, VALLES Y COLINAS ********
     ******************************************/

		//determina la altura de un pico
		//un pico debe tener una altura mayor o igual a el valor de esta variable
		//multiplicado por el promedio de altura de velas actual
		'height_peaks' => 10,

		//altura minima de un pico
		//se miden en porcentaje en relación a el tamaño de una vela grande
		'min_height_peaks' => 20,

		//cantidad de minutos que se deben analizar antes y después del pico
		'minutes_for_peaks' => 15,

		//determina el porcentaje por encima o por debajo que se debe tener en cuenta
		//para determinar que un valor está sobre un nivel existente
		//este porcentaje es en relación a lo definido como vela grande (big) en currency_pairs
		//se utiliza para saber cuando un pico se repite o cuando supar rebotes a un nivel
		'proximity_percentage_peaks' => 2,

		//cantidad de valles o colinas que se deben repetir
		//para que se considere un nivel de velas
		'appearances_valleys_hills_to_candle_level' => 5,

		//cantidad de apariciones que debe tener un valle o colina
		//para poder identificar una entrada
		'appearances_valleys_hills_for_entry' => 2,

	    //canidad de intentos para encontrar un buen nivel
  		'attemps_level' => 1,

  		//Tamaño promedio máximo para intentos de busqueda de nivel
  		//si el tamaño promedio es mayor al seleccionado se incrementan los
  		//intentos en relación al tamaño promedio
  		'max_size_attemps_level' => 10,

  		//canidad de intentos para encontrar un buen soporte o resistencia
  		'attemps_support_resistor' => 3,

  		//Tamaño promedio máximo para intentos de busqueda de un soporte o resistencia
  		//si el tamaño promedio es mayor al seleccionado se incrementan los
  		//intentos en relación al tamaño promedio
  		'max_size_attemps_support_resistor' => 10,

  		//distancia mínima que puede haber entre dos niveles que permitan entradas
	  	//la distancia se mide en porcentaje y con relación a la vela grande
	  	'min_distance_between_levels' => 50,

	  	//factor de 'min_distance_between_levels' utilizado para calcular la 
	  	//distancia minima real entre dos niveles de entrada
	  	'factor_for_distance_between_levels' => 0.2,

	  	//determina la fracción del tamaño de una vela grande
	    //que se utiliza para definir los niveles de precio de un par de divisas
	    'factor_space_levels' => 0.5,

	    //cantidad de minutos antes de la ultima vela en los cuales debe haber
	    //rebotado un nivel para tenerlo en cuenta en la siguiente entrada
	    'minutes_for_last_date_level' => 2880,

	    //cantidad de minutos antes de la ultima vela en los cuales debe haber
	    //rebotado un soporte o resistencia para tenerlo en cuenta en la siguiente entrada
	    'minutes_for_last_date_support_resistor' => 360,

	    //determina el porcentaje minimo para definir que un valor
	    //esta en un nivel, el porcentaje se calcula en relación
	    //al tamaño de una vela grande (big)
	    'percentage_value_in_level' => 1,


	/**********************************************
     ******** CONFIGURACIÓN PARA MARTILLOS ********
     *********************************************/

		//tamaño mínimo del cuerpo de una vela para considerar martillo
		//el tamaño de mide en porcentaje de acuerdo al campo big de curency_pairs
		'hammer_size' => 5,

		//porcentaje (en relación al cuerpo de la vela) que debe tener el palo del martillo
		//como mínimo para considerarse martillo
		'percentage_hammer_stick' => 120,

		//porcentaje máximo (en relación al cuerpo de la vela) que puede tener la mecha que
		//puede aparecer por encima de la maseta del martillo
		'percentage_hammer_header' => 0,



	/**********************************************
     ******** CONFIGURACIÓN PARA ESTRELLAS ********
     *********************************************/

		//tamaño máximo del cuerpo de una estrella
	  	'max_size_star' => 0.3,

	  	//cantidad de velas en una misma dirección para 
	  	//realizar una entrada con una estrella
	  	'number_candles_entry_star' => 4,



	/************************************************************
     ******** CONFIGURACIÓN PARA ENTRADAS DE MECHA NIVEL ********
     ***********************************************************/


	  	//Porcentaje de proximidad a la cual la punta de una mecha
	  	//puede quedar de un nivel para lanzar una alerta
	  	//el porcentaje se mide en relación a una vela grande
	  	'proximity_alert_wick' => 0.1,

	  	//Altura minima en porcentage de una mecha para realizar una entrada
	  	//cuando la punta de una mecha toca un nivel
	  	'min_percentage_for_alert_wick_closure' => 2,

	  	//altura minima de una vela para lanzar alertas 
	  	//de cierre de mecha
	  	'min_percentage_body_for_alert_wick_closure' => 2,

		//cantidad de minutos anteriores en que debe haber aparecido un rebote
		//en el nivel para realizar una entrada de toque de vela
	  	'minutes_for_last_date_in_wick_touch' => 180,

	  	//Cantidad minima de rebotes para poder lanzar una alerta
	  	//de mecha nivel
	  	'min_bounces_after_date_for_wick_touch' => 5,



	/**************************************************
     ******** CONFIGURACIÓN PARA VELAS GRANDES ********
     *************************************************/

	    //determina cuando una vela es grande
	    //se define en porcentaje, en relación al campo big de la tabla currency_pairs
	    'big_candle' => 70,

		//determina el porcentaje mínimo de altura de las mechas de una vela
	    //definido para guardar los niveles de cierre y apertura de la vela como soportes y resistencias
	    //en una vela grande
	    'percentage_wick_save_body' => 20,

	    //factor de 'big_candle' que debe ser mayor al promedio 
	    //de velas para almacenar los niveles de la vela grande
	    'factor_for_save_big_candle' => 0.1,



	/*******************************************************
     ******** CONFIGURACIÓN PARA VELAS CONSECUTIVAS ********
     ******************************************************/

	    //cantidad de velas que deben ir en una misma dirección
	    //para aumentar la probabilidad de entrada
	  	'number_candles_entry' => 8,



	/**************************************************
     ******** CONFIGURACIÓN REBOTES Y RUPTURAS ********
     *************************************************/

	    //cantidad mínima de velas que deben haber rebotado en un nivel
	    //para aumentar su probabilidad
	    'bounce_count' => 10,

	    //porcentaje de rebotes que deben existir en comparación
	    //con rupturas para aumentar la probabilidad
	    'percentage_bounces_brokes' => 70,



    /*******************************************************
     ******** CONFIGURACIÓN DE VALOR DE PROBAILIDAD ********
     ******************************************************/
    
	    //probabilidad por rebotes en un nivel, soporte o resistencia
	    'probability_bounce' => 7,
	    //probabilidad por toque de un nivel semifundamental
	    'probability_semifundamental' => 5,
	    //probabilidad por toque de un nivel fundamental
	    'probability_fundamental' => 7,
	    //probabilidad por N velas en el mismo sentido
	    'probability_count_candles' => 7,
	    //probabilidad por cada vela adicional a N en el mismo sentido
	    'probability_count_candles_more' => 1,
	    //probabilidad por toque en soporte o resistencia de vela grande
	    'probability_levels_big_candles' => 6,
	    //probabilidad por toque en soporte o resistencia de nivel de vela
	    'probability_levels_candles' => 5,
	    //probabilidad por toque en soporte o resistencia de valle o colina
	    'probability_valleys_hills' => 3,
	    //probabilidad por tendencia
	    'probability_good_trend' => 7,
	    
	    'probability_max' => 95,  
  		'probability_min' => 50,



	/********************************************
     ******** CONFIGURACIÓN PARA ALERTAS ********
     ********************************************/

	    //porcentaje mínimo de probabilidad para lanzar alerta
	    'min_percentage_alert' => 	60,

	  	//porcentaje mínimo para enviar una alerta
	  	//se mide en relación al tamaño de una vela grande
	  	'percentage_for_alert' => .3,

	  	//porcentaje minimo de apertura de una vela para lanzar alertas
	  	//si la vela abre a una distancia menor o igual a esta no lanza alertas
	  	//se miden en porcentaje en relación al tamaño de una vela grande
	  	'percentage_open_candle_lock_alert' => .5,

	  	//tamaño máximo permitido para enviar alertas segudo a segundo cuando 
	  	//la vela anterior va en dirección opuesta a la dirección de la alerta
	  	'max_size_candle_previous' => 1.5,



	/********************************************
     ******** CONFIGURACIÓN PARA TENDENCIAS ********
     ********************************************/
		//determina el tamaño mínimo de una tendencia
	  	//para determinar que es buena, tamaño en porcentaje
	  	//en relación a una vela grande
	  	'good_trend_size' => 60,

	  	//cantidad de minutos que se evalua por cada
	  	//ciclo de revisión de tendencia
	  	'minutes_for_good_trend' => 5,

	  	//canidad de intentos para encontrar la siguiente vela
	  	//más alta o baja de una tendencia
	  	'attemps_trend' => 3,



  	/***************************************
     ******** CONFIGURACIÓN GENERAL ********
     ***************************************/

	  	//cantidad máxima de decimales que puede tener un valor
	  	'max_decimals_value' => 6,

	  	//determina si se deben almacenar mensajes de log
	  	'active_log' => false,
  	
	  	//determina cuantos minutos se utilizan para medir un promedio de velas
	  	'minutes_for_avg_candles' => 10,



	/******************************************
     ******** CONFIGURACIÓN MARTINGALA ********
     *****************************************/	

		//distancia mínima a la que el punto máximo o minimo
		//de una vela debe estar de un nivel para lanzar alerta martingala
		'proximity_to_level' => 0.8,

		//cuando una vel atravieza un nivel y la tendencia es
		//mayor a esta variable se va en sentido de la tendencia
		//si la tendencia es menor se va en el sentido de la vela
		'min_percentage_trend' => 60,

		//tamaño minimo en porcentaje para decidir la dirección de la
		//siguiente vela dependiendo de las mechas
		'min_percentage_wick' => 3,

		//estado de ánimo mínimo para abrir una posición
		'min_traders_mood' => 15,

		//estado de ánimo mínimo para hacer caso a las mechas
		'min_traders_mood_wicks' => 50,

		//estado de ánimo mínimo para hacer caso a la tendencia
		'min_traders_mood_trend' => 60,

		//estado de ánimo mínimo para hacer caso al estado de ánimo
		'min_traders_mood_without_direction' => 80,

		//Factor para calcular una vela pequeña en relación 
		//al promedio de velas, utilizado cuando una vela atravieza un nivel
		//para saber en que dirección r dependiendo del tamaño
		'factor_candle_small_broke' => .3,

		//determina si se deben almacenar mensajes de log de martingala
	  	'active_log_martingala' => false,
];