<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IqValue extends Model
{
	protected $table = "iq_values";

    protected $fillable = [
        'name',
        'open',
        'close',
        'min',
        'max',
        'date',
        'time',
        'candle_size',
        'direction',
        'volume'
    ];

    public function currencyPair()
    {
        return $this->belongsTo(CurrencyPair::class, 'currency_pair_id');
    }

    public function evaluateStar(CurrencyPair $currency_pair = null)
    {
        //$currency_pair = $currency_pair?$currency_pair:$this->currencyPair;
        //si la vela es una estrella
            /*if($this->star()){
                //si la estrella toca el siguiente nivel superior 
                //pero no el inferior y ademas las velas van en dirección
                //alcista y van config('trading.number_candles_entry_star') o más
                if($this->touchTopLevel() && !$this->touchLowerLevel() && $currency_pair->candles_direction == 1 && $currency_pair->candles_count >= config('trading.number_candles_entry_star')){
                    $alert = new Alert();
                    $alert->value = $this->close;
                    $alert->direction_alert = -1;
                    $alert->date = date('Y-m-d H:i:s', strtotime('+1 minute', strtotime($date)));
                    $alert->probability = $currency_pair->probability_bear_entry;
                    $alert->currency_pair_id = $currency_pair->id;
                    $alert->dispatcher = 'star';
                    $alert->send($currency_pair);
                    $alert->save();            

                    //si la estrella toca el siguiente nivel inferior 
                    //pero no el superior y ademas las velas van en dirección
                    //bajista y van config('trading.number_candles_entry_star') o más
                }else if($this->touchLowerLevel() && !$this->touchTopLevel() && $currency_pair->candles_direction == -1 && $currency_pair->candles_count >= config('trading.number_candles_entry_star')){
                    $alert = new Alert();
                    $alert->value = $this->close;
                    $alert->direction_alert = 1;
                    $alert->date = date('Y-m-d H:i:s', strtotime('+1 minute', strtotime($date)));
                    $alert->probability = $currency_pair->probability_bear_entry;
                    $alert->currency_pair_id = $currency_pair->id;
                    $alert->dispatcher = 'star';
                    $alert->send($currency_pair);
                    $alert->save();   
                }
            }*/
    }

    /**
     * Define si una vela es una estrella
     * @return [type] [description]
     */
    public function star()
    {
        if($this->candle_size <= config('trading.max_size_star')){
            if($this->min != $this->max){
                if(
                    ($this->min != $this->close && $this->min != $this->open)
                    || ($this->max != $this->close && $this->max != $this->open)
                ){
                        return true;
                }
            }
        }

        return false;
    }

    /**
     * Evalua si la vela es un martillo y si debe envia alerta
     * @param  CurrencyPair|null $currency_pair [Modelo CurrentPair si no existe se consulta]
     */
    public function evaluateHammer(CurrencyPair $currency_pair = null)
    {
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;
        //si es un martillo
        $hammer = $this->hammer();
        if($hammer){
            //martillo alcista
            if($hammer['direction'] == 1){

                //si el palo del martillo toca o supera el siguiente nivel inferior
                //pero el martillo esta sobre el nivel
                if(
                    $this->touchLowerLevel($currency_pair)
                    && $this->broke_level == -1
                ){
                    $alert = new Alert();
                    $alert->value = $this->close;
                    $alert->direction_alert = 1;
                    $alert->date = date('Y-m-d H:i:s', strtotime('+1 minute', strtotime($this->date)));
                    $alert->probability = $currency_pair->probability_bullish_entry;
                    $alert->currency_pair_id = $currency_pair->id;
                    $alert->dispatcher = 'hammer';
                    $alert->send($currency_pair);
                    $alert->save();
                    $this->send_alert = true;
                }
                //martillo bajista
            }else if($hammer['direction'] == -1){

                //si el palo del martillo toca o sobrepasa el siguiente nivel superior
                //pero el martillo esta bajo el nivel
                if(
                    $this->touchTopLevel()
                    && $this->broke_level == -1
                ){
                    $alert = new Alert();
                    $alert->value = $this->close;
                    $alert->direction_alert = -1;
                    $alert->date = date('Y-m-d H:i:s', strtotime('+1 minute', strtotime($this->date)));
                    $alert->probability = $currency_pair->probability_bear_entry;
                    $alert->currency_pair_id = $currency_pair->id;
                    $alert->dispatcher = 'hammer';
                    $alert->send($currency_pair);
                    $alert->save();
                    $this->send_alert = true;
                }
            }
        }
    }

    /**
     * Determina si una vela es un martillo
     */
    public function hammer()
    {
        //si la vela tiebe dirección y su tamaño es mayor al 5%
        //del tamaño de una vela grande
        if($this->direction != 0 && $this->candle_size >= config('trading.hammer_size')){
            
            //vela alcista
            if($this->direction == 1){
                //tamaño del cuerpo de la vela
                $body = $this->close - $this->open;
                //tamaño de la mecha superior de la vela
                $upper_wick = $this->max - $this->close;
                //tamaño de la mecha inferior de la vela
                $lowwer_wick = $this->open - $this->min;
            }else{
                //tamaño del cuerpo de la vela
                $body = $this->open - $this->close;
                //tamaño de la mecha superior de la vela
                $upper_wick = $this->max - $this->open;
                //tamaño de la mecha inferior de la vela
                $lowwer_wick = $this->close - $this->min;
            }
            
            return $this->hasHammerCharacteristics($body, $upper_wick, $lowwer_wick);
        }

        return false;
    }

    /**
     * Determina si las caracteristicas enviadas son de una vela martillo
     * @param  [type] $body       [Tamaño del cuerpo de la vela]
     * @param  [type] $upper_wick  [Tamaño de la mecha superior de lavel]
     * @param  [type] $lowwer_wick [Tamaño de la mecha inferior de la vela]
     */
    public function hasHammerCharacteristics($body, $upper_wick, $lowwer_wick)
    {
        $percentage_upper_wick = ($upper_wick * 100)/$body;
        $percentage_lowwer_wick = ($lowwer_wick * 100)/$body;

        $percentage_hammer_stick = config('trading.percentage_hammer_stick');
        $percentage_hammer_header = config('trading.percentage_hammer_header');

        //Es un martillo alcista
        if($percentage_lowwer_wick >= $percentage_hammer_stick && $percentage_upper_wick <= $percentage_hammer_header){
            return [
                'direction'=>1,
            ];
        }

        //es un martillo bajista
        if($percentage_upper_wick >= $percentage_hammer_stick && $percentage_lowwer_wick <= $percentage_hammer_header){
            return [
                'direction'=>-1
            ];
        }

        return false;
    }  

    public function evaluateBigCandle(CurrencyPair $currency_pair = null)
    {
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;

        //es una vela grande y se guardan sus niveles
        if(
            $this->candle_size >= config('trading.big_candle')
            && $currency_pair->avg_candles_size <= config('trading.big_candle') * config('trading.factor_for_save_big_candle')
        ){
            $this->saveSupportsResistorsLevelsBigCandle();
        }
    }

    /**
     * * Determina si una vela a tocado su nivel superior
     * @param  CurrencyPair $currency_pair [Par de divisa relacionado]
     * @return [type]                      [description]
     */
    public function touchTopLevel(CurrencyPair $currency_pair = null)
    {
        //si no se envia el par de divisas se busca
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;

        //Distancia en porcentaje del punto maximo de la vela al nivel superior
        $level_distance = $currency_pair->getLevelDistance($this->max, true);

        if(!$level_distance)return false;

        return $level_distance <= config('trading.percentage_for_alert');
    }

    /**
     * * Determina si una vela a tocado su nivel inferior
     * @param  CurrencyPair $currency_pair [Par de divisa relacionado]
     * @return [type]                      [description]
     */
    public function touchLowerLevel(CurrencyPair $currency_pair = null)
    {
        //si no se envia el par de divisas se busca
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;

        //Distancia en porcentaje del punto minimo de la vela al nivel inferior
        $level_distance = $currency_pair->getLevelDistance($this->min, false);

        if(!$level_distance)return false;

        return $level_distance <= config('trading.percentage_for_alert');
    }  

    /**
     * Se define la direccion de la vela
     * 1 -> en dirección alcista
     * 0 -> sin dirección
     * -1 -> en dirección bajista
     */
    public function setDirection()
    {
        $this->direction = $this->open < $this->close?1:($this->open > $this->close?-1:0); 
    }

    /**
     * Define el tamaño deuna vela de acuerdo al tamaño definido
     * como big en la tabla de par de divisas
     */
    public function setCandleSize()
    {
        //se calcula la diferencia entre el precio de apertura y cierre de la vela
        //dependiendo de su dirección
        $difference = $this->direction == 1?($this->close - $this->open):($this->direction == -1?$this->open - $this->close:0);
        //se define el tamaño de la vela en porcentaje
        //calculando el 100% como el tamaño definido para una vela grande en 'currency_pairs'
        $candle_size = ($difference * 100)/$this->currencyPair->big;
        $this->candle_size = number_format($candle_size, 2);
    }

    /**
     * Almacena niveles de soporte y resistencia de una vela de acuerdo a su tamaño 
     * y el de sus mechas
     */
    public function saveSupportsResistorsLevelsBigCandle()
    {   
        $type = 'candle_levels_big';
        //siempre se almacena el minimo y el máximo valor de la vela
        $this->saveSupportResistor($this->min, $type);
        $this->saveSupportResistor($this->max, $type);

        //determina el porcentaje de altura de las mechas
        //definido para guardar los niveles de cierre y apertura de la vela
        $percentage_wick_save_body = config('trading.percentage_wick_save_body');

        //vela alcista
        if($this->direction == 1){
            //tamaño del cuerpo de la vela
            $body = $this->close - $this->open;
            //tamaño de la mecha superior de la vela
            $upper_wick = $this->max - $this->close;
            //tamaño de la mecha inferior de la vela
            $lowwer_wick = $this->open - $this->min;

            $percentage_upper_wick = ($upper_wick * 100)/$body;
            $percentage_lowwer_wick = ($lowwer_wick * 100)/$body;

            if($percentage_upper_wick >= $percentage_wick_save_body){
                $this->saveSupportResistor($this->close, $type);
            }

            if($percentage_lowwer_wick >= $percentage_wick_save_body){
                $this->saveSupportResistor($this->open, $type);
            }
        }else{
            //tamaño del cuerpo de la vela
            $body = $this->open - $this->close;
            //tamaño de la mecha superior de la vela
            $upper_wick = $this->max - $this->open;
            //tamaño de la mecha inferior de la vela
            $lowwer_wick = $this->close - $this->min;

            $percentage_upper_wick = ($upper_wick * 100)/$body;
            $percentage_lowwer_wick = ($lowwer_wick * 100)/$body;

            if($percentage_upper_wick >= $percentage_wick_save_body){
                $this->saveSupportResistor($this->open, $type);
            }

            if($percentage_lowwer_wick >= $percentage_wick_save_body){
                $this->saveSupportResistor($this->close, $type);
            }
        }
    }

    public function saveSupportResistor($value, $type)
    {
        $support_resistor = new SupportResistor();
        $support_resistor->value = $value;
        $support_resistor->type = $type;
        $support_resistor->date = $this->date;
        $support_resistor->last_date = $this->date;
        $support_resistor->appearances = 1;
        $support_resistor->currency_pair_id = $this->currency_pair_id;
        $support_resistor->saveOrUpdateData();
    }

    /**
     * Aumenta el numero de rebotes de una linea de soporte o resistencia
     * o de un nivel si las mecha de la vela los alcanzan
     * @param  CurrencyPair|null $currency_pair [Par de divisas]
     */
    public function saveBounces(CurrencyPair $currency_pair = null)
    {   
        if(!$currency_pair)$currency_pair = $this->currencyPair;

        //valores de la mecha superior
        $upper_wick = [
            'max' => $this->max,
            'min' => $this->close
        ];
        //valores de la mecha inferior
        $lowwer_wick = [
            'max' => $this->open,
            'min' => $this->min
        ];

        //si la vela es bajista
        if($this->direction == -1){
            $upper_wick['min'] = $this->open;
            $lowwer_wick['max'] = $this->close;
        }

        $proximity_value = (config('trading.percentage_for_alert') * $currency_pair->big)/100;

        //fecha a partir de la cual contar los rebotes de niveles
        $min_date_level = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_level').' minutes', strtotime($this->date)));
        //fecha a partir de la cual contar los rebotes de soportes y resistencias
        $min_date_support_resistor = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_support_resistor').' minutes', strtotime($this->date)));

        //se suma al máximo y se resta al minimo el porcentaje 
        //de proximidad a los valores externos de las mechas
        $upper_wick['max'] += $proximity_value;
        //$upper_wick['min'] -= $proximity_value;

        //$lowwer_wick['max'] += $proximity_value;
        $lowwer_wick['min'] -= $proximity_value;

        //se actualiza los rebotes de la resistencia
        //DB::statement('UPDATE supports_resistors SET bounces_below = supports_resistors.bounces_below + 1, last_date = ? WHERE id = (SELECT id FROM supports_resistors WHERE value <= ? AND value >= ? ORDER BY value DESC LIMIT 1)', [$this->date, $upper_wick['max'], $upper_wick['min']]);

        //se actualiza los rebotes del soporte
        //DB::statement('UPDATE supports_resistors SET bounces_up = supports_resistors.bounces_up + 1, last_date = ? WHERE id = (SELECT id FROM supports_resistors WHERE value <= ? AND value >= ? ORDER BY value ASC LIMIT 1)', [$this->date, $lowwer_wick['max'], $lowwer_wick['min']]);

        //se actualiza los rebotes del nivel superior
        //DB::statement('UPDATE levels SET bounces_below = levels.bounces_below + 1, last_date = ? WHERE id = (SELECT id FROM levels WHERE value <= ? AND value >= ? ORDER BY value DESC LIMIT 1)', [$this->date, $upper_wick['max'], $upper_wick['min']]);

        //se actualiza los rebotes del nivel inferior
        //DB::statement('UPDATE levels SET bounces_up = levels.bounces_up + 1, last_date = ? WHERE id = (SELECT id FROM levels WHERE value <= ? AND value >= ? ORDER BY value ASC LIMIT 1)', [$this->date, $lowwer_wick['max'], $lowwer_wick['min']]);

        //conteo de rebotes por debajo de los soportes o resistencias encontrados
        $query_count = '(SELECT COUNT(*) FROM iq_values WHERE iq_values.max >= (supports_resistors.value - '.$proximity_value.') AND iq_values.open < supports_resistors.value AND iq_values.close < supports_resistors.value AND iq_values.currency_pair_id = supports_resistors.currency_pair_id AND iq_values.date >= "'.$min_date_support_resistor.'")';
        //actualiza la cantidad de rebotes en los soportes o resistencias
        DB::statement('UPDATE supports_resistors SET bounces_below = ('.$query_count.' + 1), last_date = ? WHERE id IN (SELECT id FROM supports_resistors WHERE value <= ? AND value >= ? AND currency_pair_id = ?)', [$this->date, $upper_wick['max'], $upper_wick['min'], $this->currency_pair_id]);

        //conteo de rebotes por encima de los soportes o resistencias encontrados
        $query_count = '(SELECT COUNT(*) FROM iq_values WHERE iq_values.min <= (supports_resistors.value + '.$proximity_value.') AND iq_values.open > supports_resistors.value AND iq_values.close > supports_resistors.value AND iq_values.currency_pair_id = supports_resistors.currency_pair_id AND iq_values.date >= "'.$min_date_support_resistor.'")';
        //actualiza la cantidad de rebotes en los soportes o resistencias
        DB::statement('UPDATE supports_resistors SET bounces_up = ('.$query_count.' + 1), last_date = ? WHERE id IN (SELECT id FROM supports_resistors WHERE value <= ? AND value >= ? AND currency_pair_id = ?)', [$this->date, $lowwer_wick['max'], $lowwer_wick['min'], $this->currency_pair_id]);

        //conteo de rebotes por debajo de los niveles encontrados
        $query_count = '(SELECT COUNT(*) FROM iq_values WHERE iq_values.max >= (levels.value - '.$proximity_value.') AND iq_values.open < levels.value AND iq_values.close < levels.value AND iq_values.currency_pair_id = levels.currency_pair_id AND iq_values.date >= "'.$min_date_level.'")';
        //actualiza la cantidad de rebotes en los niveles
        DB::statement('UPDATE levels SET bounces_below = ('.$query_count.' + 1), last_date = ? WHERE id IN (SELECT id FROM levels WHERE value <= ? AND value >= ? AND currency_pair_id = ?)', [$this->date, $upper_wick['max'], $upper_wick['min'], $this->currency_pair_id]);

        //conteo de rebotes por encima de los niveles encontrados
        $query_count = '(SELECT COUNT(*) FROM iq_values WHERE iq_values.min <= (levels.value + '.$proximity_value.') AND iq_values.open > levels.value AND iq_values.close > levels.value AND iq_values.currency_pair_id = levels.currency_pair_id AND iq_values.date >= "'.$min_date_level.'")';
        //actualiza la cantidad de rebotes en los niveles
        DB::statement('UPDATE levels SET bounces_up = ('.$query_count.' + 1), last_date = ? WHERE id IN (SELECT id FROM levels WHERE value <= ? AND value >= ? AND currency_pair_id = ?)', [$this->date, $lowwer_wick['max'], $lowwer_wick['min'], $this->currency_pair_id]);
    }

    /**
     * Aumenta el numero veces que una vela rompe un soporte 
     * una resistencia o un nivel 
     * @param  CurrencyPair|null $currency_pair [Par de divisas]
     */
    public function saveBrokes()
    {   
        //fecha a partir de la cual contar las rupturas de niveles
        $min_date_level = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_level').' minutes', strtotime($this->date)));
        //fecha a partir de la cual contar las rupturas de soportes y resistencias
        $min_date_support_resistor = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_support_resistor').' minutes', strtotime($this->date)));

        //si la vela es alcista
        if($this->direction == 1){
            //se consultan la cantidad de rupturas por debajo
            $query_count = '(SELECT COUNT(*) FROM iq_values WHERE iq_values.open < supports_resistors.value AND iq_values.close > supports_resistors.value AND iq_values.currency_pair_id = supports_resistors.currency_pair_id AND iq_values.date >= "'.$min_date_support_resistor.'")';
            //se actualizan las rupturas desde abajo
            DB::statement('UPDATE supports_resistors SET broke_below = ('.$query_count.' + 1) WHERE id IN (SELECT id FROM supports_resistors WHERE value > ? AND value < ? AND currency_pair_id = ?)', [$this->open, $this->close, $this->currency_pair_id]);

            //se consultan la cantidad de rupturas por debajo
            $query_count = '(SELECT COUNT(*) FROM iq_values WHERE iq_values.open < levels.value AND iq_values.close > levels.value AND iq_values.currency_pair_id = levels.currency_pair_id AND iq_values.date >= "'.$min_date_level.'")';
            //se actualizan las rupturas desde abajo
            DB::statement('UPDATE levels SET broke_below = ('.$query_count.' + 1) WHERE id IN (SELECT id FROM levels WHERE value > ? AND value < ? AND currency_pair_id = ?)', [$this->open, $this->close, $this->currency_pair_id]);
        }else if($this->direction == -1){
            //se consultan la cantidad de rupturas por arriba
            $query_count = '(SELECT COUNT(*) FROM iq_values WHERE iq_values.open > supports_resistors.value AND iq_values.close < supports_resistors.value AND iq_values.currency_pair_id = supports_resistors.currency_pair_id AND iq_values.date >= "'.$min_date_support_resistor.'")';
            //se actualizan las rupturas desde arriba
            DB::statement('UPDATE supports_resistors SET broke_up = ('.$query_count.' + 1) WHERE id IN (SELECT id FROM supports_resistors WHERE value < ? AND value > ? AND currency_pair_id = ?)', [$this->open, $this->close, $this->currency_pair_id]);

            //se consultan la cantidad de rupturas por arriba
            $query_count = '(SELECT COUNT(*) FROM iq_values WHERE iq_values.open > levels.value AND iq_values.close < levels.value AND iq_values.currency_pair_id = levels.currency_pair_id AND iq_values.date >= "'.$min_date_level.'")';
            //se actualizan las rupturas desde abajo
            DB::statement('UPDATE levels SET broke_up = ('.$query_count.' + 1) WHERE id IN (SELECT id FROM levels WHERE value < ? AND value > ? AND currency_pair_id = ?)', [$this->open, $this->close, $this->currency_pair_id]);
        }
    }

    /**
     * Determina si una vela rompe o no un nivel, soporte o resistencia
     */
    public function setBrokeLevel(CurrencyPair $currency_pair = null) 
    {
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;

        if($currency_pair->next_bear_entry && $this->direction == 1){
            if($this->close > $currency_pair->next_bear_entry){
                $this->broke_level = 1;
                return true;
            }
        }else if($currency_pair->next_bullish_entry && $this->direction == -1){
            if($this->close < $currency_pair->next_bullish_entry){
                $this->broke_level = 1;
                return true;
            }
        }

        $this->broke_level = -1;
        return false;

        //vela alcista
        /*if($this->direction == 1){


            $level_upper = Level::where('currency_pair_id', $this->currency_pair_id)
            ->where('value', '>', $this->open)
            ->where('value', '<', $this->close)
            ->count();

            if($level_upper){
                $this->broke_level = 1;
                return true;
            }
            
            $support_resistor_upper = SupportResistor::where('currency_pair_id', $this->currency_pair_id)
            ->where('value', '>', $this->open)
            ->where('value', '<', $this->close)
            ->count();  
                
            if($support_resistor_upper){
                $this->broke_level = 1;
                return true; 
            }
        }

        if($this->direction == -1){
            $level_lowwer = Level::where('currency_pair_id', $this->currency_pair_id)
            ->where('value', '<', $this->open)
            ->where('value', '>', $this->close)
            ->count();

            if($level_lowwer){
                $this->broke_level = 1;
                return true;
            }
            
            $support_resistor_lowwer = SupportResistor::where('currency_pair_id', $this->currency_pair_id)
            ->where('value', '<', $this->open)
            ->where('value', '>', $this->close)
            ->count();  
                
            if($support_resistor_lowwer){
                $this->broke_level = 1;
                return true; 
            }
        }

        $this->broke_level = -1;
        return false;  */      
    }

    public function bodyMaxValue()
    {
        return $this->direction == 1?$this->close:$this->open;
    }

    public function bodyMinValue()
    {
        return $this->direction == -1?$this->close:$this->open;
    }

    /**
     * Calcula el tamaño en unidades de la mecha
     * @param  boolean $upper [Si es la mecha superior o la inferior]
     */
    public function getSizeWick($upper = true)
    {
        if($upper)
            return $this->max - $this->bodyMaxValue();   
        else
            return $this->bodyMinValue() - $this->min;   
    }

    /**
     * Calcula el tamaño de una mecha de vela en porcentaje
     * @param  boolean           $upper         [Si es la mecha superior o inferio]
     * @param  CurrencyPair|null $currency_pair [Modelo CurrencyPair si no se envía o es nulo se consulta]
     */
    public function getPercentageWick($upper = true, CurrencyPair $currency_pair = null)
    {
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;
        return ($this->getSizeWick($upper) * 100)/$currency_pair->big;
    }

    public function evaluateMartingala($currency_pair = null, $traders_mood = 50)
    {
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;
        $last_iq_value = $currency_pair->lastIqValue();

        $traders_mood_bullish = $traders_mood;
        $traders_mood_bearish = ($traders_mood - 100) * -1;

        if($last_iq_value){
            $trend = $currency_pair->getTrend($last_iq_value);
            //Log::info($trend);
            $have_old_alert = false;

            //si la vela anterior lanzó alerta
            if($last_iq_value->alert_martingala == 1 || $last_iq_value->alert_martingala == -1){
                //si no se asignó un valor de apertura se asigna la apertura de la vela actual
                if($last_iq_value->martingala_alert_value == null){
                    $last_iq_value->martingala_alert_value = $this->open;
                }

                //si la alerta se cumplió
                if(
                    ($last_iq_value->alert_martingala == 1 && $last_iq_value->martingala_alert_value < $this->close)
                    || ($last_iq_value->alert_martingala == -1 && $last_iq_value->martingala_alert_value > $this->close)
                ){
                    $alert = new Alert();
                    $alert->event_type = 'close_martingala';
                    $alert->send($currency_pair);
                    $last_iq_value->result_alert_martingala = 1;
                }else{
                    //la alerta se empató
                    if($this->close == $last_iq_value->martingala_alert_value){
                        $last_iq_value->result_alert_martingala = 0;
                    }else{
                        //la alerta se perdio
                        $last_iq_value->result_alert_martingala = -1;
                    }

                    $have_old_alert = true;
                }

                $last_iq_value->save();
            }

            //si aun no existen alertas martingala
            if(!$have_old_alert){
                $next_direction = $this->assumeNextDirectionWithLevels($currency_pair,$currency_pair->next_level_upper, $currency_pair->next_level_lowwer,$trend);

                //si se asume alguna dirección por toque o ruptura de nivel
                if($next_direction['direction'] != 0){
                    $continue = false;
                    //siguiente dirección es alcista y el estado de animo es adecuado
                    if($next_direction['direction'] == 1 && $traders_mood_bullish >= config('trading.min_traders_mood')){
                        $continue = true;
                    }
                    //siguiente dirección es bajista y el estado de animo es adecuado
                    else if($next_direction['direction'] == -1 && $traders_mood_bearish >= config('trading.min_traders_mood')){
                        $continue = true;
                    }else{
                        config('trading.active_log_martingala')?Log::info('Estado de ánimo no adecuado'):null;
                    }

                    if(!$continue)
                        config('trading.active_log_martingala')?Log::info('Alerta invertida por estado de ánimo inadecuado'):null;
                    //if($continue){                    
                        //si la dirección no corresponde con el estado de animo
                        //se invierte
                        $this->alert_martingala = $continue?$next_direction['direction']:$next_direction['direction'] * -1;
                        $this->martingala_send = -1;
                        $this->level_martingala = $next_direction['level'];
                        $this->martingala_mandatory_shipping = -1;
                        $this->id_martingala = $this->time;
                    //}
                }
            }else{//si ya se han iniado las alertas y la ultima no se ganó

                $next_direction = $this->assumeNextDirectionWithLevels($currency_pair,$currency_pair->next_level_upper, $currency_pair->next_level_lowwer,$trend);
                $this->id_martingala = $last_iq_value->id_martingala;
                //el envío de la alerta es obligatorio
                $this->martingala_mandatory_shipping = 1;

                //si se asume alguna dirección por toque o ruptura de nivel
                if($next_direction['direction'] != 0){
                    $continue = false;
                    //siguiente dirección es alcista y el estado de animo es adecuado
                    if($next_direction['direction'] == 1 && $traders_mood_bullish >= config('trading.min_traders_mood')){
                        $continue = true;
                    }
                    //siguiente dirección es bajista y el estado de animo es adecuado
                    else if($next_direction['direction'] == -1 && $traders_mood_bearish >= config('trading.min_traders_mood')){
                        $continue = true;
                    }else{
                        config('trading.active_log_martingala')?Log::info('Estado de ánimo no adecuado'):null;
                    }

                    if(!$continue)
                        config('trading.active_log_martingala')?Log::info('Alerta invertida por estado de ánimo inadecuado'):null;

                    //if($continue){
                        $this->alert_martingala = $continue?$next_direction['direction']:$next_direction['direction'] * -1;
                        $this->martingala_send = -1;
                        $this->level_martingala = $next_direction['level'];
                    //}
                }else{
                    $next_direction = $this->assumeNextDirectionWithWicks($currency_pair);

                    //si se asume una dirección por las caracteristicas de las mechas de la vela
                    //pero el estado de animo es inadecuado
                    if(
                        $next_direction != 0 
                        && (
                            ($next_direction == 1 && $traders_mood_bullish < config('trading.min_traders_mood_wicks'))
                            ||($next_direction == -1 && $traders_mood_bearish < config('trading.min_traders_mood_wicks'))
                        )
                    ){
                        config('trading.active_log_martingala')?Log::info('Dirección de mecha eliminada por estado de ánimo insuficiente'):null;
                    }

                    //si se asume alguna dirección con mechas
                    //y el estado de animo esta a favor en lo indicado en config
                    if(
                        $next_direction != 0 
                        && (
                            ($next_direction == 1 && $traders_mood_bullish >= config('trading.min_traders_mood_wicks'))
                            ||($next_direction == -1 && $traders_mood_bearish >= config('trading.min_traders_mood_wicks'))
                        )
                    ){
                        config('trading.active_log_martingala')?Log::info('Dirección asignada por mecha'):null;
                        $this->alert_martingala = $next_direction;
                        $this->martingala_send = -1;
                        $this->level_martingala = $last_iq_value->level_martingala;

                    //si existe tendencia alta
                    //y el estado de animo esta a favor en lo indicado en config
                    }else if(
                        $trend['trend_size_percentage'] >= config('trading.min_percentage_trend')
                        && (
                            ($trend['trend_direction'] == 1 && $traders_mood_bullish >= config('trading.min_traders_mood_trend'))
                            ||($trend['trend_direction'] == -1 && $traders_mood_bearish >= config('trading.min_traders_mood_trend'))
                        )
                    ){
                        config('trading.active_log_martingala')?Log::info('Dirección asignada por tendencia'):null;
                        $this->alert_martingala = $trend['trend_direction'];
                        $this->martingala_send = -1;
                        $this->level_martingala = $last_iq_value->level_martingala;
                    }else{
                        //si hay un estado de ánimo alcista grande
                        if($traders_mood_bullish >= config('trading.min_traders_mood_without_direction')){
                            config('trading.active_log_martingala')?Log::info('Dirección asignada por estado de ánimo alcista'):null;
                            $this->alert_martingala = 1;
                        }
                        //si hay un estado de ánimo bajista grande
                        else if($traders_mood_bearish >= config('trading.min_traders_mood_without_direction')){
                            config('trading.active_log_martingala')?Log::info('Dirección asignada por estado de ánimo bajista'):null;
                            $this->alert_martingala = -1;
                        }
                        //si no se asume dirección se deja la existente
                        else{
                            config('trading.active_log_martingala')?Log::info('Dirección asignada por herencia'):null;
                            $this->alert_martingala = $last_iq_value->alert_martingala;
                        }
                        $this->level_martingala = $last_iq_value->level_martingala;
                        $this->martingala_send = -1;

                    }
                }
            }

            if($this->alert_martingala == 1){
                config('trading.active_log_martingala')?Log::info('Estado de ánimo alcista: '.$traders_mood_bullish):null;
                config('trading.active_log_martingala')?Log::info('Entrada alcista'):null;
            }else if($this->alert_martingala == -1){
                config('trading.active_log_martingala')?Log::info('Estado de ánimo bajista: '.$traders_mood_bearish):null;
                config('trading.active_log_martingala')?Log::info('Entrada bajista'):null;
            }
        }
    }

    /**
     * Supone la dirección de la siguiente vela de acuerdo a sus niveles cercanos
     * @param  integer $big          [Tamaño de vela grande]
     * @param  integer $upper_level  [Nivel superior]
     * @param  integer $lowwer_level [Nivel inferior]
     * @param  [type]  $trend        [Datos de la tendencia actual]
     */
    public function assumeNextDirectionWithLevels($currency_pair = null, $upper_level = 0, $lowwer_level = 0, $trend)
    {   
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;
        $data_return = [
            'direction' => 0,
            'level' => 0
        ];

        //vela alcista y rompe nivel
        if($this->direction == 1 && $this->close > $upper_level){
            //Log::info($trend);
            //la dirección se asigna si la tendencia es grande, en sentido contrario a la tendencia
            //la dirección se asigna si la vela es pequeña, en sentido contrario a la vela
            //sino en sentido de la vela
            config('trading.active_log_martingala')?Log::info('Dirección asignada por ruptura de nivel -> vela alcista'):null;
            if($trend['trend_direction'] == -1 && $trend['trend_size_percentage'] >= config('trading.min_percentage_trend')){
                config('trading.active_log_martingala')?Log::info('Dirección invertida por tendencia contraria grande'):null;

            }else if($this->candle_size <= ($currency_pair->avg_candles_size * config('trading.factor_candle_small_broke'))){
                config('trading.active_log_martingala')?Log::info('Dirección invertida por vela de ruptura pequeña'):null;

            }
            $data_return['direction'] = ($trend['trend_direction'] == -1 && $trend['trend_size_percentage'] >= config('trading.min_percentage_trend'))?-1:(($this->candle_size <= ($currency_pair->avg_candles_size * config('trading.factor_candle_small_broke')))?-1:1);
            $data_return['level'] = $upper_level;
            return $data_return;
        }//vela bajista y rompe nivel
        else if($this->direction == -1 && $this->close < $lowwer_level){
            //Log::info($trend);
            ////la dirección se asigna si la tendencia es grande, en sentido contrario a la tendencia
            //la dirección se asigna si la vela es pequeña, en sentido contrario a la vela
            //sino en sentido de la vela
            config('trading.active_log_martingala')?Log::info('Dirección asignada por ruptura de nivel -> vela bajista'):null;
            if($trend['trend_direction'] == 1 && $trend['trend_size_percentage'] >= config('trading.min_percentage_trend')){
                config('trading.active_log_martingala')?Log::info('Dirección invertida por tendencia contraria grande'):null;

            }else if($this->candle_size <= ($currency_pair->avg_candles_size * config('trading.factor_candle_small_broke'))){
                config('trading.active_log_martingala')?Log::info('Dirección invertida por vela de ruptura pequeña'):null;

            }
            $data_return['direction'] = ($trend['trend_direction'] == 1 && $trend['trend_size_percentage'] >= config('trading.min_percentage_trend'))?1:(($this->candle_size <= ($currency_pair->avg_candles_size * config('trading.factor_candle_small_broke')))?1:-1);
            $data_return['level'] = $lowwer_level;
            return $data_return;
        }

        //se calcula si la mecha toca el nivel superior
        $distance_to_level = $upper_level - $this->max;
        $percentage_to_level = ($distance_to_level * 100)/$currency_pair->big;
        //si el máximo está cerca al siguiente nivel
        if($percentage_to_level <= config('trading.proximity_to_level')){
            config('trading.active_log_martingala')?Log::info('Dirección asignada por toque de nivel superior'):null;
            $data_return['direction'] = -1;
            $data_return['level'] = $upper_level;
            return $data_return;
        }

        //se calcula si la mecha toca el nivel inferior
        $distance_to_level = $this->min - $lowwer_level;
        $percentage_to_level = ($distance_to_level * 100)/$currency_pair->big;
        //si el minimo está cerca al siguiente nivel
        if($percentage_to_level <= config('trading.proximity_to_level')){
            config('trading.active_log_martingala')?Log::info('Dirección asignada por toque de nivel inferior'):null;
            $data_return['direction'] = 1;
            $data_return['level'] = $lowwer_level;

            return $data_return;
        }

        return $data_return;
    }

    /**
     * Supone la dirección de la siguiente vela de acuerdo a sus mechas
     * @param  [CurrencyPair] $currency_pair [Par de divisas]
     */
    public function assumeNextDirectionWithWicks($currency_pair = null)
    {
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;

        $size_upper_wick = $this->getPercentageWick(true, $currency_pair);
        $size_lowwer_wick = $this->getPercentageWick(false, $currency_pair);

        //mecha inferior mas grande y tiene tamaño optimo
        if($size_lowwer_wick > $size_upper_wick && $size_lowwer_wick >= config('trading.min_percentage_wick')){
            config('trading.active_log_martingala')?Log::info('Dirección asignada por mecha inferior grande'):null;
            return 1;
        }//mecha superior mas grande y tiene tamaño optimo
        else if($size_lowwer_wick < $size_upper_wick && $size_upper_wick >= config('trading.min_percentage_wick')){
            config('trading.active_log_martingala')?Log::info('Dirección asignada por mecha superior grande'):null;
            return -1;
        }

        return 0;
    }
}
