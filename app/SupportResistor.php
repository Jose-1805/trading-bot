<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class SupportResistor extends Model
{
    protected $table = "supports_resistors";
    public $timestamps = false;

    protected $fillable = [
        'value',
        'type',//valleys_hills,candle_level,candle_levels_big
        'date',
        'last_date',
        'appearances',
        'bounces_below',
        'bounces_up',
        'broke_below',
        'broke_up',
        'currency_pair_id',
    ];

    public function currencyPair()
    {
        return $this->belongsTo(CurrencyPair::class, 'currency_pair_id');
    }

    /**
     * Guarda o actualiza un nivel de soporte y resistencia
     * dependiendo si encuentra niveles similares
     */
    public function saveOrUpdateData()
    {
    	$currency_pair = $this->currencyPair;

    	$proximity_value = (config('trading.proximity_percentage_peaks') * $currency_pair->big)/100;

    	//consulta niveles con un valor similar al actual
    	//se utiliza el valor de proximidad para generar un rango
    	$similar_levels = SupportResistor::select('*')
    	->whereRaw('(value + ?) >= ?', [$proximity_value, $this->value])
    	->whereRaw('(value - ?) <= ?', [$proximity_value, $this->value])
    	->where('currency_pair_id', $this->currency_pair_id)
    	->get();

    	//existen niveles similares
    	if($similar_levels->count()){

    		foreach ($similar_levels as $item) {
    			if(strtotime($item->date) != strtotime($this->date) && strtotime($item->last_date) != strtotime($this->date)){
	    			$item->appearances += 1;
	    			$item->last_date = $this->date;

	    			//si es un valle o colina y ya se a repetido varias veces
	    			//se vuelve un nivel de velas
	    			if($item->type == 'valleys_hills' && $item->appearances >= config('trading.appearances_valleys_hills_to_candle_level')){
	    				$item->type = 'candle_level';
	    			}

	    			$item->save();
	    		}
    		}
    	}else{
            //fecha a partir de la cual contar las rupturas y rebotes del soporte o resistencia
            $min_date = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_support_resistor').' minutes', strtotime($this->date)));
            //es nueva y se guarda
            $this->setBouncesUp($min_date);
            $this->setBouncesBelow($min_date);
            $this->setBrokesUp($min_date);
            $this->setBrokesBelow($min_date);
    		$this->save();
    	}
    }

    /**
     * Busca el último nivel de soporte y resistencia producido por un pico alto o bajo
     * y lo almacena en la base de datos si no existe
     * @param  [CurrencyPair] $currency_pair [Par de divisas a analizar]
     * @param  [IqValue] $last_iq_value [Ultimo valor de vela]
     */
    public static function searchAndSave(IqValue $last_iq_value, CurrencyPair $currency_pair = null)
    {	
        $currency_pair = $currency_pair?$currency_pair:$last_iq_value->currencyPair;
        //altura minima de un pico
        $height_peaks = config('trading.height_peaks') * $currency_pair->avg_candles_size;

        $height_peaks = $height_peaks >= config('trading.min_height_peaks')?$height_peaks:config('trading.min_height_peaks');

    	SupportResistor::searchBullishPeak($last_iq_value, $height_peaks, config('trading.minutes_for_peaks'), $currency_pair);
    	SupportResistor::searchBearishPeak($last_iq_value, $height_peaks, config('trading.minutes_for_peaks'), $currency_pair);
    }

    /**
     * Busca y almacena un pico alcista en las ultimas velas
     * @param  IqValue $last_iq_value     [Ultima vela que se conoce]
     * @param  Float   $height_peaks     [Tamaño minimo de un pico]
     * @param  Integer  $minutes_for_peaks    [Cantidad de minutos a analizar]
     */
    public static function searchBullishPeak(IqValue $last_iq_value, $height_peaks, $minutes_for_peaks, $currency_pair)
    {
        $date_start = date('Y-m-d H:i', strtotime('-'.$minutes_for_peaks.' minutes', strtotime($last_iq_value->date)));

    	//se consulta la vela con la mecha más alta de los ultimos ($minutes_for_peaks) minutos
		$iq_value_upper = $currency_pair->getMaxOrMinPointCandleBetweenDates($date_start, $last_iq_value->date, true);

    	if($iq_value_upper && $iq_value_upper->date != $last_iq_value->date){
            $date_start = date('Y-m-d H:i', strtotime('-'.$minutes_for_peaks.' minutes', strtotime($iq_value_upper->date)));
            $end = date('Y-m-d H:i', strtotime('+'.$minutes_for_peaks.' minutes', strtotime($iq_value_upper->date)));
    		//se consulta si existe una vela más alta en los ($minutes_for_peaks) anteriores y posteriores a la vela
            //más alta encontrada si existe no se debe hacer nada
    		$iq_value_upper_left = $currency_pair->getMaxOrMinPointCandleBetweenDates($date_start, $iq_value_upper->date, true);
            $iq_value_upper_right = $currency_pair->getMaxOrMinPointCandleBetweenDates($iq_value_upper->date, $end, true);

    		if(
                (!$iq_value_upper_left || ($iq_value_upper_left->max < $iq_value_upper->max))
                && (!$iq_value_upper_right || ($iq_value_upper_right->max < $iq_value_upper->max))
            ){
                $date_end = date('Y-m-d H:i', strtotime('+'.$minutes_for_peaks.' minutes', strtotime($iq_value_upper->date)));
	    		//se busca la vela más baja a la derecha
	    		$iq_value_lowwer_right = $currency_pair->getMaxOrMinPointCandleBetweenDates($iq_value_upper->date, $date_end, false);

	    		//se busca la vela más baja a la izquierda
                $iq_value_lowwer_left = $currency_pair->getMaxOrMinPointCandleBetweenDates($date_start, $iq_value_upper->date, false);
	    		
	    		if(
                    $iq_value_lowwer_left &&  $iq_value_lowwer_left->date != $iq_value_upper->date
                    && $iq_value_lowwer_right && $iq_value_lowwer_right->date != $iq_value_upper->date
                ){
	    			//se calcula la altura que hay a la derecha y a la izquierda
	    			$left_height = $iq_value_upper->max - $iq_value_lowwer_left->min;
	    			$right_height = $iq_value_upper->max - $iq_value_lowwer_right->min;
	    			//se calcula el porcentaje equivalente, en cada lado
	    			$percentage_left = ($left_height * 100)/$currency_pair->big;
	    			$percentage_right = ($right_height * 100)/$currency_pair->big;
	    			//los porcentajes son mayores
	    			//Hay un pico alcista
	    			if($percentage_right >= $height_peaks && $percentage_left >= $height_peaks){

                        if(!$currency_pair->valueInLevel($iq_value_upper->max)){
    	    				$support_resistor = new SupportResistor();
    	    				$support_resistor->value = $iq_value_upper->max;
    						$support_resistor->type = 'valleys_hills';
    						$support_resistor->date = $iq_value_upper->date;
    						$support_resistor->last_date = $iq_value_upper->date;
    						$support_resistor->appearances = 1;
    						$support_resistor->currency_pair_id = $iq_value_upper->currency_pair_id;
    						$support_resistor->saveOrUpdateData();
                        }
	    			}
	    		}
	    	}
    	}
    }

    /**
     * Busca y almacena un pico bajista en las ultimas velas
     * @param  IqValue $last_iq_value     [Ultima vela que se conoce]
     * @param  Float  $height_peaks       [Altura minima que debe diferenciar al pico encontrado y sus valores mas bajos a la derecha e izquierda]
     * @param  Integer  $minutes_for_peaks    [Cantidad de velas a analizar]
     */
    public static function searchBearishPeak(IqValue $last_iq_value, $height_peaks, $minutes_for_peaks, $currency_pair)
    {
        $date_start = date('Y-m-d H:i', strtotime('-'.$minutes_for_peaks.' minutes', strtotime($last_iq_value->date)));

        //se consulta la vela con la mecha más baja de los ultimos ($minutes_for_peaks) minutos
        $iq_value_lowwer = $currency_pair->getMaxOrMinPointCandleBetweenDates($date_start, $last_iq_value->date, false);

        if($iq_value_lowwer && $iq_value_lowwer->date != $last_iq_value->date){
            $date_start = date('Y-m-d H:i', strtotime('-'.$minutes_for_peaks.' minutes', strtotime($iq_value_lowwer->date)));
            $end = date('Y-m-d H:i', strtotime('+'.$minutes_for_peaks.' minutes', strtotime($iq_value_lowwer->date)));
            //se consulta si existe una vela más baja en los ($minutes_for_peaks) anteriores y posteriores a la vela
            //más baja encontrada si existe no se debe hacer nada
            $iq_value_lowwer_left = $currency_pair->getMaxOrMinPointCandleBetweenDates($date_start, $iq_value_lowwer->date, false);
            $iq_value_lowwer_right = $currency_pair->getMaxOrMinPointCandleBetweenDates($iq_value_lowwer->date, $end, false);
            if(
                (!$iq_value_lowwer_left || ($iq_value_lowwer_left->min > $iq_value_lowwer->min))
                && (!$iq_value_lowwer_right || ($iq_value_lowwer_right->min > $iq_value_lowwer->min))
            ){
                $date_end = date('Y-m-d H:i', strtotime('+'.$minutes_for_peaks.' minutes', strtotime($iq_value_lowwer->date)));
                //se busca la vela más alta a la derecha
                $iq_value_upper_right = $currency_pair->getMaxOrMinPointCandleBetweenDates($iq_value_lowwer->date, $date_end, true);

                //se busca la vela más alta a la izquierda
                $iq_value_upper_left = $currency_pair->getMaxOrMinPointCandleBetweenDates($date_start, $iq_value_lowwer->date, true);
                
                if(
                    $iq_value_upper_left &&  $iq_value_upper_left->date != $iq_value_lowwer->date
                    && $iq_value_upper_right && $iq_value_upper_right->date != $iq_value_lowwer->date
                ){
                    //se calcula la altura que hay a la derecha y a la izquierda
                    $left_height = $iq_value_upper_left->max - $iq_value_lowwer->min;
                    $right_height = $iq_value_upper_right->max - $iq_value_lowwer->min;

                    //se calcula el porcentaje equivalente, en cada lado
                    $percentage_left = ($left_height * 100)/$currency_pair->big;
                    $percentage_right = ($right_height * 100)/$currency_pair->big;


                    //los porcentajes son mayores
                    //Hay un pico alcista
                    if($percentage_right >= $height_peaks && $percentage_left >= $height_peaks){
                        if(!$currency_pair->valueInLevel($iq_value_lowwer->min)){
                            $support_resistor = new SupportResistor();
                            $support_resistor->value = $iq_value_lowwer->min;
                            $support_resistor->type = 'valleys_hills';
                            $support_resistor->date = $iq_value_lowwer->date;
                            $support_resistor->last_date = $iq_value_lowwer->date;
                            $support_resistor->appearances = 1;
                            $support_resistor->currency_pair_id = $iq_value_lowwer->currency_pair_id;
                            $support_resistor->saveOrUpdateData();
                        }
                    }
                }
            }
        }
    }

    /**
     * Consulta la vela más superior o inferior entre un grupo
     * @param  integer  $id            [Id de la vela a partir de la cual se inicia el conteo]
     * @param  integer $number_candles [Cantidad de velas a analizar]
     * @param  boolean $left          [Si se deben analizar las velas a la izquierda]
     * @param  boolean $right         [Si se deben analizar las velas a la derecha]
     * @param  boolean $direction     [Determina la dirección que se debe consulta true => la vela mas superior, false = la vela mas inferior]
     */
    public static function candleUpperLowwer($iq_value, $number_candles = 1, $left = false, $right = false, $direction = true)
    {
    	//subconsulta para obtener las ($number_candles) velas
    	$sub_query = IqValue::select('id');

    	if($left){
    		$sub_query = $sub_query->where('id', '<', $iq_value->id);
    	}

    	if($right){
    		$sub_query = $sub_query->where('id', '>', $iq_value->id);
    	}

    	$sub_query = $sub_query->where('currency_pair_id', $iq_value->currency_pair_id)
    		->orderBy('id', 'DESC')
    		->limit($number_candles);

    	return IqValue::select('*')
    		->joinSub($sub_query, 'last_iq_values', function($join){
    			$join->on('iq_values.id', '=', 'last_iq_values.id');
    		})
    		//->where('iq_values.direction', $direction?1:-1)
    		//se consulta el máximo más alto o el mínimo más bajito
    		->orderBy('iq_values.'.($direction?'max':'min'), $direction?'DESC':'ASC')
    		->first();
    }

    /**
     * Determina el porcentaje deprobabilidad de que el 
     * precio rebote en el nivel
     */
    public function getPercentageProbability($current_candle)
    {
        if(!$current_candle)return 0;

        $percentage = 0;

        switch ($this->type) {
            //nivel de velas grandes
            case 'candle_levels_big':
                $percentage += config('trading.probability_levels_big_candles');
                break;
            //nivel de velas
            case 'candle_level':
                $percentage += config('trading.probability_levels_candles');
                break;
            //valles y colinas
            case 'valleys_hills':
                $percentage += $this->appearances >= config('trading.appearances_valleys_hills_for_entry')?config('trading.probability_valleys_hills'):0;
                break;
        }

        $min_last_date = date('Y-m-d H:i', strtotime('-'.config('trading.minutos_for_last_date_level').' minutes', strtotime($current_candle->date)));
        //se calculan rebotes y rupturas
        $bounces = $this->getCountBounces();
        $brokes = $this->getCountBrokes();
        $total = $bounces + $brokes;

        if($total != 0){
            //porcentaje de rebotes en un total de rebotes + rupturas
            $percentage_bounces = ($bounces * 100)/$total;

            //si a tenido un numero determinado de rebotes
            if( 
                $bounces >= config('trading.bounce_count')
                && $percentage_bounces >= config('trading.percentage_bounces_brokes')
            )
                $percentage += config('trading.probability_bounce');
        }

        //config('trading.active_log')?Log::info('SUPPORT RESISTOR '.$this->value.' WITH '.$percentage.'%'):null;
        
        return $percentage;
    }

    public function isGood($current_candle)
    {
        if(!$current_candle)return false;

        $min_last_date = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_support_resistor').' minutes', strtotime($current_candle->date)));
        //si la ultima aparición del rebote está dentro de lo permitido
        if(strtotime($min_last_date) <= strtotime($this->last_date)){            
            $percentage = $this->getPercentageProbability($current_candle); 
            $is_good = false;
            switch ($this->type) {
                //nivel de velas grandes
                case 'candle_levels_big':
                    $is_good = $percentage > config('trading.probability_levels_big_candles')?true:false;
                    break;
                //nivel de velas
                case 'candle_level':
                    $is_good = $percentage > config('trading.probability_levels_candles')?true:false;
                    break;
                //valles y colinas
                case 'valleys_hills':
                    $is_good = $percentage > config('trading.probability_valleys_hills')?true:false;
                    break;
            }

            return $is_good;
        }

        return false;
    }

    public function setBouncesUp($date)
    {
        $proximity_value = (config('trading.percentage_for_alert') * $this->currencyPair->big)/100;
        $this->bounces_up = IqValue::where('min', '<=', ($this->value + $proximity_value))
                ->where('open', '>=',$this->value)
                ->where('close', '>=',$this->value)
                ->where('currency_pair_id', $this->currency_pair_id)
                ->where('date', '>=', $date)
                ->count();
    }

    public function setBouncesBelow($date)
    {
        $proximity_value = (config('trading.percentage_for_alert') * $this->currencyPair->big)/100;
        $this->bounces_below = IqValue::where('max', '>=', ($this->value - $proximity_value))
                ->where('open', '<=',$this->value)
                ->where('close', '<=',$this->value)
                ->where('currency_pair_id', $this->currency_pair_id)
                ->where('date', '>=', $date)
                ->count();
    }

    /**
     * Cantidad de rebotes en elnivel
     */
    public function getCountBounces()
    {
        return $this->bounces_below + $this->bounces_up;
    }

    public function setBrokesUp($date)
    {
        $this->broke_up = IqValue::where('open', '>', $this->value)
        ->where('close', '<', $this->value)
        ->where('currency_pair_id', $this->currency_pair_id)
        ->where('date', '>=', $date)
        ->count();
    }

    public function setBrokesBelow($date)
    {
        $this->broke_below = IqValue::where('open', '<', $this->value)
        ->where('close', '>', $this->value)
        ->where('currency_pair_id', $this->currency_pair_id)
        ->where('date', '>=', $date)
        ->count();
    }

    /**
     * Cantidad de rupturas en el nivel
     */
    public function getCountBrokes()
    {
        return $this->broke_up + $this->broke_below;
    }
}

/*

$iq = App\IqValue::where('date', '2019-12-8 21:17')->first();
$c = $iq->currencyPair;
$c->setAvgCandles($iq);
App\SupportResistor::searchAndSave($iq, $c);
*/