/**************************
VARIABLES PARA EVALUAR VELA
/*************************/
	var last_params = "start";
	//var name = "AUD-USD"
	var name = "EUR-USD";
	var active_id = 1;
	var current_utility = 74;
	var second_to_second = true;
	var last_martingala_one = null;
	var traders_mood = 50;

/****************************
VARIABLES PARA TIPOS DE JUEGO
/***************************/
	var run_martingala = true;
	var run_entries_to_level = false;


/*********************************************
VARIABLES PARA CONTROL DE PERDIDAS Y GANANCIAS
/********************************************/
	//precio de perdida en que el sistema se detiene
	var stop_loss = 250;
	//el precio de perdida se calcula de acuerdo a la ganancia
	//máxima obtenida
	var stop_loss_dynamic = true;
	//ganancias actuales
	var current_gain = 0;
	//ganancia máxima obtenida
	var max_gain = 0;
	//datos de las entradas realizadas
	var data_entries = [];

	//altura máxima de la pantalla para calcular el tamaño de los botónes
	//si la altura es mayor los botones tienen una altura fiha
	var max_height = 600; 

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

//hora y minuto de la ultima entrada
let last_entry = null;

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
 * Recive y analiza los datos que se generan dentro de cada minuto
 * @param  {Objext} data [Objeto con los datos de la vela]
 */
function evaluateCandle(data){
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
    //guardar los datos de la vela
    if(date_at.getSeconds() == 0){
        last_params = /*NAME*/name
        /*OPEN*/+'/'+data.open
        /*CLOSE*/+'/'+data.close
        /*MIN*/+'/'+data.min
        /*MAX*/+'/'+data.max
        /*DATE*/+'/'+date_send_at
        /*DATE*/+'/'+time_date_at
        /*DATE*/+'/'+data.volume
        /*DATE*/+'/'+traders_mood;
    }else{
    	if(date_at.getSeconds() == 1){

	    	//en el segundo 1 de cada minuto se envían a guardar los datos de la vela
	    	//si no se han enviado
	    	if(last_params != 'start'){
	    		fetch("http://127.0.0.1:8000/api/iq_value/add/"+last_params, {mode: 'no-cors'});
	    		last_params = 'start';
	    	}

	    	//en martingala solo se envian los datos del primer y ultimo segundo
	    	if(run_martingala && last_martingala_one != date_send_at_s_s){
	    		last_martingala_one = date_send_at_s_s;
	    		const params = /*NAME*/name
		            /*CLOSE*/+'/'+data.close
		            /*OPEN*/+'/'+data.open;

		        fetch("http://127.0.0.1:8000/api/iq_value/evaluate-martingala/"+params, {mode: 'no-cors'});
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
		fetch("http://127.0.0.1:8000/api/iq_value/set-entry-value-martingala/"+name+"/"+value, {mode: 'no-cors'});
	}
}

/**
 * Genera escuchador para websocket
 */
window.Echo.channel('home').listen('NewMessage', e => {
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

	if(run_martingala){
		if(e.message.type == 'alert_martingala'){
			//si es la divisa eactual y no se han excedido los intentos, si están activados
			if(e.message.data.currency_pair_name == name && (max_attemps == null || attemps < max_attemps)){
				var launch_alert = true;

				//si es el primer intento pero tiene el mismo id
				//significa que es un intento más de una entrada fallida anterior
				//por lo cual no se debe lanzar la alerta
				if(attemps == 0 && id_martingala == e.message.data.id && !option_equal){
					launch_alert = false;
				}

				if(launch_alert){
					//si no es el primer y no es un empate intento se incrementa el importe
					if(attemps > 0 && !option_equal){
						increaceCurrentAmount();
					}else{
						setCurrentAmount(current_amount);
					}

					id_martingala = e.message.data.id;

					//siempre se restablece el valor de esta variable
					option_equal = false;

					last_entry = null;

					var send_entry = true;

					//si existe stop_loss y al perder la siguiente entrada
					//pasaría el stop loss
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
						enterNow(e.message.data.direction_alert == 1?true:false);
						attemps++;

						data_entries.push({
							amount:current_amount,
							utility:current_utility
						})

						setTimeout(function(){
							last_entry = null;
							enterNow(true);
						}, 35000)
					}else{
						resetAttemps();
						resetCurrentAmount();
					}
				}
			}else if(attemps >= max_attemps){
				resetCurrentAmount();
			}
		}else if(e.message.type == 'close_martingala'){
			if(e.message.data.currency_pair_name == name){
				resetCurrentAmount();
			}
		}
	}
 })