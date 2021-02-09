var current_amount = 1;
var initial_amount = 1;
var factor_increase = 2.25;
var max_attemps = null;
var attemps = 0;
var option_equal = false;
var id_martingala = null;

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

function resetAttemps() {
	attemps = 0;
}
  
function increaceCurrentAmount(){
	setCurrentAmount(current_amount * factor_increase);
}

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