<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Level extends Model
{
    protected $table = "levels";
    public $timestamps = false;

    protected $fillable = [
        'value',
        'fundamental',
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
     * Determina el porcentaje deprobabilidad de que el 
     * precio rebote en el nivel
     */
    public function getPercentageProbability($current_candle)
    {
        if(!$current_candle)return 0;

    	$percentage = 0;

    	$percentage += $this->fundamental == 1?config('trading.probability_fundamental'):config('trading.probability_semifundamental');

        $min_last_date = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_level').' minutes', strtotime($current_candle->date)));
    	//se calculan rebotes y rupturas
    	$bounces = $this->getCountBounces();
        $brokes = $this->getCountBrokes();
        $total = $bounces + $brokes;

        if($total != 0){
        	//porcentaje de rebotes en un total de rebotes + rupturas
        	$percentage_bounces = ($bounces * 100)/$total;

        	if(
	        	$bounces >= config('trading.bounce_count')//rebotes mininos
	        	//porcentaje de rebotes minimo
	            && $percentage_bounces >= config('trading.percentage_bounces_brokes')
	        )
        		$percentage += config('trading.probability_bounce');
        }
        //config('trading.active_log')?Log::info('LEVEL '.$this->value.' WITH '.$percentage.'%'):null;
    	return $percentage;
    }

    /**
     * Determina si es un buen nivel para entrar
     * @return boolean [description]
     */
    public function isGood($current_candle)
    {	
        if(!$current_candle)return false;

        $min_last_date = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_level').' minutes', strtotime($current_candle->date)));
        //si la ultima aparición del rebote está dentro de lo permitido
        if(strtotime($min_last_date) <= strtotime($this->last_date)){            
            $percentage = $this->getPercentageProbability($current_candle);
            //es fundamental y tiene rebotes
            if($this->fundamental == 1 && $percentage > config('trading.probability_fundamental'))
                return true;

            //es semifundamental y tiene rebotes
            if($this->fundamental == -1 && $percentage > config('trading.probability_semifundamental'))
                return true;
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
     * Cantidad de rebotes en el nivel
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

    public function setFundamental()
    {
    	$last_number = substr((float)$this->value, -1);

    	$this->fundamental = (($last_number == 1) || ($last_number == 5))?1:-1;
    }
}
