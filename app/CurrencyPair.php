<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CurrencyPair extends Model
{
    protected $table = "currency_pairs";
    public $timestamps = false;

    protected $fillable = [
        'name',
        'big',
        'candles_direction',
        'candles_count',
        'avg_candles_size',
        'next_bullish_entry',
        'next_bear_entry',
        'probability_bullish_entry',
        'probability_bear_entry',
        'launch_alerts'
    ];

    public function iqValues()
    {
        return $this->hasMany(IqValue::class, 'currency_pair_id');
    }

    public function supportsResistors()
    {
        return $this->hasMany(SupportResistor::class, 'currency_pair_id');
    }

    public function levels()
    {
        return $this->hasMany(Level::class, 'currency_pair_id');
    }

    public function lastIqValue()
    {
        return $this->iqValues()->orderBy('id','DESC')->first();
    }

    /**
     * Determina en que posición porcentual se encuentra
     * el valor pasado como parametro, todo en relación a la siguiente
     * entrada bajista y alcista del par de divisas
     * @param  integer $value [Valor del precio]
     * @return [type]         [description]
     */
    public function getPercentageBetweenEntries($value = 0)
    {
        //la direcencia entre la siguiente entrada bajista y la alcista determina una distancia
        //la cual se usa para medir la posición porcentual del precio
        $diference_entries = $this->next_bear_entry - $this->next_bullish_entry;

        if($diference_entries == 0){
            return 0;
        }

        //se calcula, en porcentaje, donde se encuentra el precio actual
        //en relación a la entrada superior e inferior
        return (($value - $this->next_bullish_entry) * 100)/$diference_entries;
    }

    /**
     * Distancia en porcentaje a la que se encuentra el precio enviado
     * del siguiente nivel, porcentaje medido en relación al tamaño de vela grande
     * 
     * @param  Double $value       [Valor del par de divisas]
     * @param  boolean $level      [Si es el nivel superior o inferior]
     */
    public function getLevelDistance($value=0, $level = true)
    {
        $value_distance = 0;
        //si es con el nivel superior
        if($level){
            //existe un nivel superior
            if($this->next_bear_entry){
                $value_distance = $this->next_bear_entry - $value;
            } else {
                return null;
            }
        }else{
            //existe un nivel inferior
            if($this->next_bullish_entry){
                $value_distance = $value - $this->next_bullish_entry;
            } else {
                return null;
            }
        }

        //se determina el porcentaje en relacion a la vela grande
        return ($value_distance * 100)/$this->big;
    }

    public function setCandlesCount($current_direction = 0)
    {   
        //si la vela no tiene dirección se 
        if($current_direction == 0 || $this->candles_direction == $current_direction){
            $this->candles_count++;   
        }else{
            //$candles_count = DB::select('SELECT count(*) candles from iq_values WHERE currency_pair_id = '.$this->id.' AND id > (SELECT MAX(id) FROM iq_values WHERE currency_pair_id = '.$this->id.' AND direction = '.($current_direction == 0?($this->candles_direction * -1):($current_direction * -1)).')')[0]->candles;
        	//se calculan la cantidad de velas que van en la misma dirección de la ultima
            $this->candles_count = 1;
            //cambia la dirección de las velas
            $this->candles_direction = $this->candles_direction * -1;
        }
    }

    /**
     * Determina, si es posible, la siguiente entrada bajista y alcista
     * dependiendo del valor enviado como parametro y la posibilidad de entrada.
     * 
     * @param Double $value [Valor actual del par de divisas]
     */
    public function setNextEntries($value = 0)
    {
        $levels = $this->getNextLevels($value);
        $supports_resistors = $this->getNextSupportsResistors($value);

        $upper_level = $this->selectNextUpperLevel($levels, $supports_resistors);
        $lowwer_level = $this->selectNextLowwerLevel($levels, $supports_resistors);       

        //se calculan las probabilidades de entrada
        $probabilities = $this->getProbabilities($upper_level, $lowwer_level);
        
        $this->setBearEntry($upper_level, $probabilities);
        $this->setBullishEntry($lowwer_level, $probabilities);        
        //si la distancia entre los niveles de entradas
        //es menor a la permitida, se deja el de mayor probabilidad 
        //y busca intenta buscar un nivel nuevo
        if($this->next_bullish_entry && $this->next_bear_entry){
            $diference = $this->next_bear_entry - $this->next_bullish_entry;

            $space_between_levels = (float)number_format($this->big*config('trading.factor_space_levels'), config('trading.max_decimals_value'));

            $distance_between_entries = ($diference * 100)/$space_between_levels;

            $min_distance_between_levels = config('trading.min_distance_between_levels');
            //si el producto de la distancia minima entre niveles por su factor
            //es menor al promedio de velas, se recalcula la distancia minima entre niveles
            $result_factor = $min_distance_between_levels * config('trading.factor_for_distance_between_levels');
            if($result_factor < $this->avg_candles_size){
                $min_distance_between_levels = ($this->avg_candles_size / $result_factor) * $min_distance_between_levels;
            }

            if($distance_between_entries < $min_distance_between_levels){
                //si las posibilidades de entrar al alza son mayores a las de entrar a la baja
                if($this->probability_bullish_entry > $this->probability_bear_entry){
                    //se sube el valor un poco menos del valor de entrada
                    $value = $this->next_bear_entry + 0.000001;

                    $levels = $this->getNextLevels($value);
                    $supports_resistors = $this->getNextSupportsResistors($value);

                    $upper_level = $this->selectNextUpperLevel($levels, $supports_resistors);
                    $lowwer_level = $this->selectNextLowwerLevel($levels, $supports_resistors);       

                    //se calculan las probabilidades de entrada
                    $probabilities = $this->getProbabilities($upper_level, $lowwer_level);
                    
                    $this->setBearEntry($upper_level, $probabilities);
                }else{

                    //se baja el valor un poco menos del valor de entrada
                    $value = $this->next_bullish_entry - 0.000001;

                    $levels = $this->getNextLevels($value);
                    $supports_resistors = $this->getNextSupportsResistors($value);

                    $upper_level = $this->selectNextUpperLevel($levels, $supports_resistors);
                    $lowwer_level = $this->selectNextLowwerLevel($levels, $supports_resistors);       

                    //se calculan las probabilidades de entrada
                    $probabilities = $this->getProbabilities($upper_level, $lowwer_level);
                    
                    $this->setBullishEntry($lowwer_level, $probabilities);         
                }

                //si la diferencia de niveles sigue se deja en null
                //alguno de los dos
                if($this->next_bullish_entry && $this->next_bear_entry){
                    $diference = $this->next_bear_entry - $this->next_bullish_entry;

                    $distance_between_entries = ($diference * 100)/$space_between_levels;

                    if($distance_between_entries < config('trading.min_distance_between_levels')){
                        //si las posibilidades de entrar al alza son mayores a las de entrar a la baja
                        if($this->probability_bullish_entry > $this->probability_bear_entry){
                            $this->probability_bear_entry = null;
                            $this->next_bear_entry = null;
                        }else{
                            $this->probability_bullish_entry = null;
                            $this->next_bullish_entry = null;
                        }
                    }
                }
            }
        }

        config('trading.active_log')?Log::info('NEXT BULLISH ENTRY '.$this->next_bullish_entry):null;
        config('trading.active_log')?Log::info('NEXT BEAR ENTRY '.$this->next_bear_entry):null;
    }

    public function setBearEntry($upper_level, $probabilities)
    {
        $this->next_bear_entry = null;
        $this->probability_bear_entry = null;

        //si se encontró un nivel superior o resistencia
        //se asigna al objeto, siempre y cuando la probablidad sea la minima o más
        if($upper_level['upper'] && $probabilities['bear_entry'] >= config('trading.min_percentage_alert')){
            $this->next_bear_entry = $upper_level['upper']->value;
            $this->probability_bear_entry = $probabilities['bear_entry'];
        }
    }

    public function setBullishEntry($lowwer_level, $probabilities)
    {
        $this->next_bullish_entry = null;
        $this->probability_bullish_entry = null;
        
        //si se encontró un nivel inferior o soporte
        //se asigna al objeto, siempre y cuando la probablidad sea la minima o más
        if($lowwer_level['lowwer'] && $probabilities['bullish_entry'] >= config('trading.min_percentage_alert')){
            $this->next_bullish_entry = $lowwer_level['lowwer']->value;
            $this->probability_bullish_entry = $probabilities['bullish_entry'];            
        }
    }

    public function selectNextUpperLevel($levels, $supports_resistors)
    {
        $upper_level = null;
        $probability = 0;
        //se define siguiente nivel superior si existe
        if($levels['upper']  || $supports_resistors['upper']){
            if($levels['upper']  && $supports_resistors['upper']){
                //el nivel, soporte o resistencia más cercano
                $upper_level = $levels['upper']->value < $supports_resistors['upper']->value?$levels['upper']:$supports_resistors['upper'];
                $probability = $levels['upper']->value < $supports_resistors['upper']->value?$levels['upper_probability']:$supports_resistors['upper_probability'];
            }else if($levels['upper']){
                $upper_level = $levels['upper'];
                $probability = $levels['upper_probability'];
            }else if($supports_resistors['upper']){
                $upper_level = $supports_resistors['upper'];
                $probability = $supports_resistors['upper_probability'];
            }
        }

        return [
            'upper' => $upper_level,
            'upper_probability' => $probability,
        ];
    }

    public function selectNextLowwerLevel($levels, $supports_resistors)
    {
        $lowwer_level = null;
        $probability = 0;
        //se define siguiente nivel inferior si existe
        if($levels['lowwer']  || $supports_resistors['lowwer']){
            if($levels['lowwer']  && $supports_resistors['lowwer']){
                //el nivel, soporte o resistencia más cercano
                $lowwer_level = $levels['lowwer']->value > $supports_resistors['lowwer']->value?$levels['lowwer']:$supports_resistors['lowwer'];
                $probability = $levels['lowwer']->value > $supports_resistors['lowwer']->value?$levels['lowwer_probability']:$supports_resistors['lowwer_probability'];
            }else if($levels['lowwer']){
                $lowwer_level = $levels['lowwer'];
                $probability = $levels['lowwer_probability'];
            }else if($supports_resistors['lowwer']){
                $lowwer_level = $supports_resistors['lowwer'];
                $probability = $supports_resistors['lowwer_probability'];
            }
        }

        return [
            'lowwer' => $lowwer_level,
            'lowwer_probability' => $probability,
        ];
    }

    /**
     * Calcula las probabilidades de las siguientes entradas a alza y a la baja
     * @param  [Array] $upper_level  [Datos del siguiente nivel superior]
     * @param  [Array] $lowwer_level           [Datos del siguiente nivel inferior]
     */
    public function getProbabilities($upper_level, $lowwer_level)
    {
        //se calcula la probabilidad de entrada dependiendo
        //de la cantidad de velas en la misma dirección
        $probability_count_candles = $this->candles_count >= config('trading.number_candles_entry')?config('trading.probability_count_candles'):0;
        config('trading.active_log')?Log::info('COUNT CANDLES '.$probability_count_candles):null;
        //probabilidad por cada vela adicional a la cantidad en la misma dirección
        $probability_count_candles_more = $probability_count_candles > 0?($this->candles_count - config('trading.number_candles_entry'))*config('trading.probability_count_candles_more'):0;
        config('trading.active_log')?Log::info('COUNT CANDLES MORE '.$probability_count_candles_more):null;
        $probability_bear_entry = 0;
        $probability_bullish_entry = 0;

        if($probability_count_candles > 0){
            if($this->candles_direction == 1)
                $probability_bear_entry += $probability_count_candles + $probability_count_candles_more;
            if($this->candles_direction == -1)
                $probability_bullish_entry += $probability_count_candles + $probability_count_candles_more;
        }

        //tendencia de los ultimos config('trading.minutes_for_good_trend') minutos
        $trend = $this->getTrend();
        config('trading.active_log')?Log::info('TREND '.$trend['trend_direction'].' '.$trend['trend_size_percentage'].'% --- AVG '.$trend['avg_candle_size']):null;

        //si se a encontrado una buena tendencia
        if($trend && $trend['is_good_trend']){
            config('trading.active_log')?Log::info('GOOD TREND **** '):null;
            if($trend['trend_direction'] == 1){
                $probability_bear_entry += config('trading.probability_good_trend');
                config('trading.active_log')?Log::info('TREND 1 '.config('trading.probability_good_trend')):null;
            }else if($trend['trend_direction'] == -1){
                $probability_bullish_entry += config('trading.probability_good_trend');
                config('trading.active_log')?Log::info('TREND -1 '.config('trading.probability_good_trend')):null;
            }
        }else{
            config('trading.active_log')?Log::info('NOT A GOOD TREND **** '):null;
        }

        //se aumenta la probabilidad de que el precio rebote en el nivel superior
        $probability_bear_entry += $upper_level['upper_probability'];
        config('trading.active_log')?Log::info('LEVEL UP BOUNCE '.$upper_level['upper_probability']):null;


        //se aumenta la probabilidad de que el precio rebote en el nivel inferior
        $probability_bullish_entry += $lowwer_level['lowwer_probability'];
        config('trading.active_log')?Log::info('LEVEL DOWN BOUNCE '.$lowwer_level['lowwer_probability']):null;

        //si la probabilidad alcista es 0 se deja la probabilidad mínima
        if($probability_bullish_entry == 0){
            $probability_bullish_entry = config('trading.probability_min');
        }else{
            $probability_bullish_entry += config('trading.probability_min');

            if($probability_bullish_entry > config('trading.probability_max')){
                $probability_bullish_entry = config('trading.probability_max');
            }
        }

        //si la probabilidad bajista es 0 se deja la probabilidad mínima
        if($probability_bear_entry == 0){
            $probability_bear_entry = config('trading.probability_min');
        }else{
            $probability_bear_entry += config('trading.probability_min');

            if($probability_bear_entry > config('trading.probability_max')){
                $probability_bear_entry = config('trading.probability_max');
            }
        }
        config('trading.active_log')?Log::info('************** '):null;
        config('trading.active_log')?Log::info('Bullish_entry '.$probability_bullish_entry):null;
        config('trading.active_log')?Log::info('Bear_entry '.$probability_bear_entry):null;

        return [
            'bullish_entry' => $probability_bullish_entry,
            'bear_entry' => $probability_bear_entry
        ];
    }

    /**
     * Identifica, si es posible, los primeros niveles fundamentales y/o semifundamentales
     * que se encuentran por encima y por debajo del valor enviado como parametro y en los 
     * cuales existe una buena probablidad de inversión
     * @param  integer $value [Valor del par de divisas]
     */
    public function getNextLevels($value = 0)
    {   
        //siguiente nivel superior con probabilidades
        $upper = $this->getNextLevelWithProbabilities($value, 1);
        //siguiente nivel inferior con probabilidades
        $lowwer = $this->getNextLevelWithProbabilities($value, -1);

        $last_candle = $this->lastIqValue();
        return [
            'upper' => $upper,
            'lowwer'=> $lowwer,
            //calcula la probabilidad de entrada en cada uno de los niveles
            'upper_probability' => $upper?$upper->getPercentageProbability($last_candle):0,
            'lowwer_probability' => $lowwer?$lowwer->getPercentageProbability($last_candle):0
        ];
    }

    /**
     * Busca el siguiente nivel con buenas probabilidades de inversión
     * si los niveles que el sistema calcula no están en la base de datos 
     * se almacenan
     * @param  integer $value     [Nivel actual]
     * @param  integer $direction [Dirección en que se debe buscar el nivel]
     */
    public function getNextLevelWithProbabilities($value=0, $direction = 1)
    {
        $count_attemps_level = 0;

        $level = null;

        //espacio que hay entre niveles
        $space_between_levels = (float)number_format($this->big*config('trading.factor_space_levels'), config('trading.max_decimals_value'));

        $max_attemps_level = ceil(($this->avg_candles_size?$this->avg_candles_size:0)/config('trading.max_size_attemps_level')) * config('trading.attemps_level');

        $max_attemps_level = $max_attemps_level > 0?$max_attemps_level:config('trading.attemps_level');

        $level_value = $this->getNextLevel($value, $direction);

        $last_iq_value = $this->lastIqValue();

        $date = $last_iq_value?$last_iq_value->date:date('Y-m-d H:i');
        //fecha a partir de la cual contar las rupturas y rebotes de niveles
        $min_date_level = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_last_date_level').' minutes', strtotime($date)));
        //se busca en si existe un nivel superior y es bueno
        while(!$level && $count_attemps_level < $max_attemps_level) {
            $count_attemps_level++;

            $level = Level::where('value', $level_value)
            ->where('currency_pair_id', $this->id)
            //->where('last_date', '>=', $min_last_date)
            ->first();

            //si el nivel existe se evalua si un buen nivel de ingreso
            //si no existe se crea y almacena
            if($level){
                $level = $level->isGood($this->lastIqValue())?$level:null;
            }else{
                //se almacena el nivel si no existe
                $level_save = new Level();
                $level_save->value = (float) $level_value;                
                $level_save->setFundamental();
                $level_save->currency_pair_id = $this->id;

                $level_save->setBouncesUp($min_date_level);
                $level_save->setBouncesBelow($min_date_level);
                $level_save->setBrokesUp($min_date_level);
                $level_save->setBrokesBelow($min_date_level);
                $level_save->save();
            }
            //si no se encontro el nivel se cambia value para buscarlo 
            //en la siguiente iteración del ciclo
            if(!$level){
                $level_value += $direction == 1?$space_between_levels:($space_between_levels * -1);
                $level_value = (float)number_format($level_value, config('trading.max_decimals_value'));
            }
        }

        return $level;
    }

    /**
     * Identifica,si es posible, los primeros niveles de soporte y/o resistencia
     * que se encuentren por encima y por debajo del valor enviado
     * @param  integer $value [Valor del par de divisas]
     */
    public function getNextSupportsResistors($value = 0)
    {   
        //siguiente resistencia
        $next_upper = $this->getNextSupportResistorWithProbabilities($value, 1);
        //siguiente soporte
        $next_lowwer = $this->getNextSupportResistorWithProbabilities($value, -1);

        $last_candle = $this->lastIqValue();
        return [
            'upper' => $next_upper,
            'lowwer'=> $next_lowwer,

            //se calcula la probabilidad de entrada en los niveles
            //de soporte y resistencia más cercanos
            'upper_probability' => $next_upper?$next_upper->getPercentageProbability($last_candle):0,
            'lowwer_probability' => $next_lowwer?$next_lowwer->getPercentageProbability($last_candle):0
        ];
    }

    /**
     * Identifica el siguiente soporte o resistencia con probabilidades de inversión
     * dependiendo del valor y la dirección enviados
     * @param  integer $value     [Valor del par de divisas]
     * @param  integer $direction [Dirección de búsqueda de los niveles]
     */
    public function getNextSupportResistorWithProbabilities($value=0, $direction = 1)
    {
        $support_resistor = null;
        $count_attemps_support_resistor = 0;

        $max_attemps_support_resistor = ceil(($this->avg_candles_size?$this->avg_candles_size:0)/config('trading.max_size_attemps_support_resistor')) * config('trading.attemps_support_resistor');

        $max_attemps_support_resistor = $max_attemps_support_resistor > 0?$max_attemps_support_resistor:config('trading.attemps_support_resistor');

        //mientras no se encuentre el soporte o resistencia
        //y no se pase de los intentos permitidos
        while (!$support_resistor && $count_attemps_support_resistor < $max_attemps_support_resistor) {
            $count_attemps_support_resistor++;

            $min_last_date = date('Y-m-d H:i', strtotime('-'.config('trading.minutos_for_last_date_support_resistor').' minutes', strtotime($this->lastIqValue()->date)));

            $support_resistor = $this->supportsResistors()
                ->where('value', $direction == 1?'>':'<', $value)
                ->orderBy('value', $direction == 1?'ASC':'DESC')
                //->where('last_date', '>=', $min_last_date)
                ->first();
            
            if($support_resistor){
                //se asigna el siguiente valor por si
                //el soporte o resistencia no es bueno
                $value = $support_resistor->value + ($direction == 1?0.000001:-0.000001);

                $support_resistor = $support_resistor->isGood($this->lastIqValue())?$support_resistor:null;
            }else{
                //si no se encuentra el soporte o la resistencia
                //se cambia la variable para salir del ciclo
                $count_attemps_support_resistor = $max_attemps_support_resistor;
            }
        }

        return $support_resistor;
    }

    /**
     * Calcula los porcentajes de distancia entre los niveles
     * y el preció enviado, el porcentaje se calcula en relación
     * al tamaño de una vela grande
     * @param Double $value [Valor del par de divisas]
     */
    public function setPercentageLevelsDistance($value=0)
    {
        return [
            'upper' =>  $this->getLevelDistance($value, true),
            'lowwer' =>  $this->getLevelDistance($value, false)
        ];
    }

    /**
     * Retorna la información de la tendencia anterior a una vela
     * @param  [type] $candle [Ultima vela de la tendencia, si no se envia el sistema toma la ultima]
     */
    public function getTrend($candle = null)
    {
        $last_candle = $candle?$candle:$this->lastIqValue();

        if($last_candle){
            $up_trend = $this->getDataTrend($last_candle, true);
            $down_trend = $this->getDataTrend($last_candle, false);

            if($up_trend['trend_size_percentage'] > $down_trend['trend_size_percentage']){
                return $up_trend;
            }

            return $down_trend;
        }

        return false;
    }

    /**
     * Calcula y retorna los datos de una tendencia
     * @param  IqValue $last_candle     [Ultima vela de la tendencia]
     * @param  boolean $direction [Dirección de la tendencia true => alcista, false = bajista]
     */
    public function getDataTrend(IqValue $last_candle, $direction = true)
    {
        //tamaño de la tendencia en porcentaje
        $trend_size_percentage = 0;
        //tamaño de la tendencia en valor real
        $trend_size = 0;
        //dirección de la tendencia
        $trend_direction = 0;
        //tamaño promedio de las velas de la tendencia, en porcentaje
        $avg_candle_size = 0;
        //determina si es una tendencia buena para ingresar en su contra
        $is_good_trend = false;

        //vela más alta (si es tendencia bajista) o mas baja (si es tendencia alcista)
        $max_or_min_candle = $this->getMaxOrMinCandleOfTrend($last_candle, !$direction);

        $trend_direction = $direction?1:-1;
        if($direction){
            $trend_size = number_format($last_candle->close - $max_or_min_candle->close, config('trading.max_decimals_value'));
        }else{
            $trend_size = number_format($max_or_min_candle->close - $last_candle->close, config('trading.max_decimals_value'));
        }
        $trend_size_percentage = number_format(($trend_size * 100)/$this->big, 2);

        $avg_candle_size = DB::select('SELECT AVG(candle_size) as avg FROM iq_values WHERE date >= ? AND date <= ? AND currency_pair_id = ?', [$max_or_min_candle->date, $last_candle->date, $this->id])[0]->avg;

        //si el promedio de velas es menor a una parte determinada de la altura
        //de la tendencia es una tendencia real, de lo contrario puede ser lateralidad
        //if($avg_candle_size < ($trend_size_percentage/3)){
            //si la tendencia tiene el tamaño mínimo requerido
            $is_good_trend = $trend_size_percentage >= config('trading.good_trend_size')?true:false;
        //}else{
          //  $is_good_trend = true;
          //  $trend_direction = 0;
        //}

        return [
            'trend_direction' => $trend_direction,
            'is_good_trend' => $is_good_trend,
            'trend_size_percentage' => $trend_size_percentage,
            'trend_size' => $trend_size,
            'avg_candle_size' => $avg_candle_size
        ];
    }

    /**
     * Obtiene el punto más alto o bajo de una tendencia
     * @param  IqValue $last_candle [Vela desde la cual se mide la tendencia]
     * @param  boolean $max         [Si se busca el valor máximo de una tendecia bajista o el minimo de una alcista]
     */
    public function getMaxOrMinCandleOfTrend(IqValue $last_candle, $max = true)
    {
        $last_max_or_min_candle = $last_candle;

        //limite para la consulta de la vela más alta o más baja
        $limit = $last_candle->date;

        $attemps = 0;

        //si no se pasa del limite de intentos
        //al buscar un nuevo punto alto o bajo en la tendencia
        while ($attemps < config('trading.attemps_trend')) {
            $attemps++;
            //se resta al limite los minutos configurados en config('trading.minutes_for_good_trend')
            $date_start = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_good_trend').' minutes', strtotime($limit)));

            $max_or_min_candle = $this->getMaxOrMinCandleBetweenDates($date_start, $limit, $max);
            
            //si existe una vela más alta o baja
            if(
                $max_or_min_candle
                && (
                    //se esta buscando la máxima y es mayor al maximo anterior
                    ($max && $max_or_min_candle->close > $last_max_or_min_candle->close)
                    || (!$max && $max_or_min_candle->close < $last_max_or_min_candle->close)
                )
            ){
                //la fecha de la ultima vela más alta o baja es el nuevo limite
                $limit = date('Y-m-d H:i', strtotime('-'.config('trading.minutes_for_good_trend').' minutes', strtotime($max_or_min_candle->date)));
                $last_max_or_min_candle = $max_or_min_candle;
                $attemps = 0;
            }else{
                //si no se encontro vela más alta 
                //el nuevo limite es el la fecha de inicio
                //de la consulta anterior
                $limit = $date_start;
            }
        }

        return $last_max_or_min_candle;
    }

    /**
     * Consulta la vela más alta o más baja entre un rango de tiempo
     * @param  [type]  $start [Fecha de inicio de la busqueda]
     * @param  [type]  $end   [Fecha de fin de la busqueda]
     * @param  boolean $max   [Si debe buscar la más alta o la más baja]
     */
    public function getMaxOrMinCandleBetweenDates($start, $end, $max = true)
    {
        return $this->iqValues()
        ->where('date', '>', $start)
        ->where('date', '<', $end)
        //si es el máximo se busca el precio de cierre más alto
        //si es el minimo se busca el precio de cierre más bajo
        ->orderBy('close', $max?'DESC':'ASC')
        ->first();
    }

    /**
     * Consulta la vela con el punto más alto o más bajo entre un rango de tiempo
     * @param  [type]  $start [Fecha de inicio de la busqueda]
     * @param  [type]  $end   [Fecha de fin de la busqueda]
     * @param  boolean $max   [Si debe buscar la más alta o la más baja]
     */
    public function getMaxOrMinPointCandleBetweenDates($start, $end, $max = true)
    {
        return $this->iqValues()
        ->where('date', '>', $start)
        ->where('date', '<', $end)
        //si es el máximo se busca el precio de cierre más alto
        //si es el minimo se busca el precio de cierre más bajo
        ->orderBy($max?'max':'min', $max?'DESC':'ASC')
        ->first();
    }

    /**
     * Calula el tamaño promedio de las velas existentes en los $minutes_for_avg_candles
     * anteriores a la fecha de la vela $last_candle
     * @param  IqValue $last_candle             [Ultima vela del promedio]
     * @param  [Integer]  $minutes_for_avg_candles [Cantidad de minutos utilizados para medir el promedio]
     */
    public function getAvgCandles(IqValue $last_candle, $minutes_for_avg_candles = 10)
    {
        $date_start = date('Y-m-d H:i', strtotime('-'.$minutes_for_avg_candles.' minutes', strtotime($last_candle->date)));
        return DB::select('SELECT AVG(candle_size) as avg FROM iq_values WHERE date >= ? AND date <= ? AND currency_pair_id = ?', [$date_start, $last_candle->date, $this->id])[0]->avg;
    }

    /**
     * Calula y asigna el tamaño promedio de las velas existentes en los $minutes_for_avg_candles
     * anteriores a la fecha de la ultima vela
     * @param  IqValue $last_candle             [Ultima vela del promedio]
     * @param  [Integer]  $minutes_for_avg_candles [Cantidad de minutos utilizados para medir el promedio]
     */
    public function setAvgCandles(IqValue $last_candle = null)
    {
        $last_candle = $last_candle?$last_candle:$this->lastIqValue();

        if($last_candle){
            $this->avg_candles_size = $this->getAvgCandles($last_candle, config('trading.minutes_for_avg_candles'));
        }
    }

    /**
     * Retorna el siguiente nivelsuperior o inferior
     * de acuerdo alvalor dado
     * @param  integer $value     [Valor desde donde se calcula el siguiente nivel]
     * @param  integer $direction [Indica si es el nivelsuperior 1 o inferior -1]
     * @return [type]             [description]
     */
    public function getNextLevel($value = 0, $direction = 1)
    {
        $space_between_levels = (float)number_format($this->big*config('trading.factor_space_levels'), config('trading.max_decimals_value'));

        //cantidad de decimales que tiene el campo que define el tamaño de las velas
        $decimals = strlen(explode('.', $this->big)[1]);
        //se define el siguiente nivel inferior al valor actual
        $level_value = number_format($value, $decimals);

        //si el valor redondeado a la cantidad de decimales del campo big es mayor al valor recibido
        //el siguiente nivel inferior es igual al nivel redondeado menos el espacio entre niveles
        //si el valor redondeado es menor se deja como nivel inferior
        $level_value += (float)($value < $level_value)?($space_between_levels * -1):0;

        //si la dirección es alcista se establece el nivel primer superior
        if($direction == 1)
            $level_value += $space_between_levels;

        return (float)number_format($level_value, config('trading.max_decimals_value'));
    }

    /**
     * Determina si un valor se encuentra en un nivel
     */
    public function valueInLevel($value = 0)
    {
        $level_up = $this->getNextLevel($value, 1);
        $level_down = $this->getNextLevel($value, -1);

        $distance_up = $level_up - $value;
        $distance_down = $value - $level_down;

        $percentage_up = ($distance_up * 100)/$this->big;
        $percentage_down = ($distance_down * 100)/$this->big;

        return ($percentage_up <= config('trading.percentage_value_in_level') || $percentage_down <= config('trading.percentage_value_in_level'));
    }

    public function setNextLevels($value = 0)
    {
        $this->next_level_upper = $this->getNextLevel($value, 1);
        $this->next_level_lowwer = $this->getNextLevel($value, -1);
    }

    public function evaluateLastAlertMartingala($last_iq_value, $current_open)
    {
        $last_iq_value = $last_iq_value?$last_iq_value:$this->lastIqValue();
        $launch_alert = false;
        //si se creó alerta en la vela anterior pero no se envió
        if($last_iq_value->martingala_send == -1){
            //vela alcista
            if($last_iq_value->direction == 1){
                //alerta por ruptura de nivel ruptura de nivel
                if($last_iq_value->close > $last_iq_value->level_martingala && $last_iq_value->open < $last_iq_value->level_martingala){
                    $launch_alert = true;

                    //si hay salto al nivel anterior se recalculan los niveles
                    if($current_open < $last_iq_value->level_martingala){
                        $this->setNextLevels($current_open);
                        $this->save();
                    }

                //si el cierre de la vela alcista es menor al nivel de la alerta
                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
                }else if($last_iq_value->close <= $last_iq_value->level_martingala){
                    //la alerta se puede enviar si es alcista
                    //o si es bajista pero no hay un salto al siguiente nivel
                    if($last_iq_value->alert_martingala == 1 || ($last_iq_value->alert_martingala == -1 && $this->next_level_upper > $current_open)){
                        $launch_alert = true;
                    }else{
                        //si existe un salto al siguiente nivel la alerta se invierte
                        //siempre y cuando el envío sea obligatorio
                        if($last_iq_value->martingala_mandatory_shipping == 1){
                            $last_iq_value->alert_martingala = 1;
                            $launch_alert = true;
                        }else{
                            //la alerta no se envía y se calculan los niveles
                            config('trading.active_log_martingala')?Log::info('Alerta cancelada por rutura en salto'):null;
                            $this->setNextLevels($current_open);
                            $this->save();
                        }
                    }
                //si el cierre de la vela alcista es mayor al nivel de la alerta
                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
                }else if($last_iq_value->close >= $last_iq_value->level_martingala){
                    //la alerta se puede enviar si es bajista
                    //o si es alcista pero no hay un salto al nivel anterior
                    if($last_iq_value->alert_martingala == -1 || ($last_iq_value->alert_martingala == 1 && $this->next_level_lowwer < $current_open)){
                        $launch_alert = true;
                    }else{
                        //si existe un salto al nivel anterior la alerta se invierte
                        //siempre y cuando el envío sea obligatorio
                        if($last_iq_value->martingala_mandatory_shipping == 1){
                            $last_iq_value->alert_martingala = -1;
                            $launch_alert = true;
                        }else{
                            //la alerta no se envía y se calculan los niveles
                            config('trading.active_log_martingala')?Log::info('Alerta cancelada por rutura en salto'):null;
                            $this->setNextLevels($current_open);
                            $this->save();
                        }
                    }
                }else{
                    //la alerta fue creada de otra forma
                    $launch_alert = true;
                }
            
            //vela bajista
            }else if($last_iq_value->direction == -1){
                //alerta por ruptura de nivel
                if($last_iq_value->close < $last_iq_value->level_martingala && $last_iq_value->open > $last_iq_value->level_martingala){
                    $launch_alert = true;

                    //si hay salto al siguiente nivel se recalculan los niveles
                    if($current_open > $last_iq_value->level_martingala){
                        $this->setNextLevels($current_open);
                        $this->save();
                    }

                //si el cierre de la vela bajista es mayor al nivel de la alerta
                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
                }else if($last_iq_value->close >= $last_iq_value->level_martingala){
                    //la alerta se puede enviar si es bajista
                    //o si es alcista pero no hay un salto al nivel anterior
                    if($last_iq_value->alert_martingala == -1 || ($last_iq_value->alert_martingala == 1 && $this->next_level_lowwer < $current_open)){
                        $launch_alert = true;
                    }else{
                        //si existe un salto al nivel anterior la alerta se invierte
                        //siempre y cuando el envío sea obligatorio
                        if($last_iq_value->martingala_mandatory_shipping == 1){
                            $last_iq_value->alert_martingala = -1;
                            $launch_alert = true;
                        }else{
                            //la alerta no se envía y se calculan los niveles
                            config('trading.active_log_martingala')?Log::info('Alerta cancelada por rutura en salto'):null;
                            $this->setNextLevels($current_open);
                            $this->save();
                        }
                    }
                //si el cierre de la vela bajista es menor al nivel de la alerta
                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
                }else if($last_iq_value->close <= $last_iq_value->level_martingala){
                    //la alerta se puede enviar si es alcista
                    //o si es bajista pero no hay un salto al nivel superior
                    if($last_iq_value->alert_martingala == 1 || ($last_iq_value->alert_martingala == -1 && $this->next_level_upper > $current_open)){
                        $launch_alert = true;
                    }else{
                        //si existe un salto al nivel superopr la alerta se invierte
                        //siempre y cuando el envío sea obligatorio
                        if($last_iq_value->martingala_mandatory_shipping == 1){
                            $last_iq_value->alert_martingala = 1;
                            $launch_alert = true;
                        }else{
                            //la alerta no se envía y se calculan los niveles
                            config('trading.active_log_martingala')?Log::info('Alerta cancelada por rutura en salto'):null;
                            $this->setNextLevels($current_open);
                            $this->save();
                        }
                    }
                }else{
                    //la alerta fue creada de otra forma
                    $launch_alert = true;
                }
            }else if($last_iq_value->direction == 0){
                //si el cierre de la vela es menor al nivel de la alerta
                if($last_iq_value->close <= $last_iq_value->level_martingala){
                    //la alerta se puede enviar si es alcista
                    //o si es bajista pero no hay un salto al siguiente nivel
                    if($last_iq_value->alert_martingala == 1 || ($last_iq_value->alert_martingala == -1 && $this->next_level_upper > $current_open)){
                        $launch_alert = true;
                    }else{
                        //si existe un salto al siguiente nivel la alerta se invierte
                        //siempre y cuando el envío sea obligatorio
                        if($last_iq_value->martingala_mandatory_shipping == 1){
                            $last_iq_value->alert_martingala = 1;
                            $launch_alert = true;
                        }else{
                            //la alerta no se envía y se calculan los niveles
                            config('trading.active_log_martingala')?Log::info('Alerta cancelada por rutura en salto'):null;
                            $this->setNextLevels($current_open);
                            $this->save();
                        }
                    }
                //si el cierre de la vela alcista es mayor al nivel de la alerta
                //puede ser cualquier tipo de alerta diferente a ruptura de nivel
                }else if($last_iq_value->close >= $last_iq_value->level_martingala){
                    //la alerta se puede enviar si es bajista
                    //o si es alcista pero no hay un salto al nivel anterior
                    if($last_iq_value->alert_martingala == -1 || ($last_iq_value->alert_martingala == 1 && $this->next_level_lowwer < $current_open)){
                        $launch_alert = true;
                    }else{
                        //si existe un salto al nivel anterior la alerta se invierte
                        //siempre y cuando el envío sea obligatorio
                        if($last_iq_value->martingala_mandatory_shipping == 1){
                            $last_iq_value->alert_martingala = -1;
                            $launch_alert = true;
                        }else{
                            //la alerta no se envía y se calculan los niveles
                            config('trading.active_log_martingala')?Log::info('Alerta cancelada por rutura en salto'):null;
                            $this->setNextLevels($current_open);
                            $this->save();
                        }
                    }
                }else{
                    //la alerta fue creada de otra forma
                    $launch_alert = true;
                }
            }

        }

        //la alerta cumple los criterios y se puede enviar
        if($launch_alert){
            $alert = new Alert();
            $alert->event_type = 'alert_martingala';
            $alert->direction_alert = $last_iq_value->alert_martingala;
            $alert->id = $last_iq_value->id_martingala;
            $alert->send($this);
            $last_iq_value->martingala_send = 1;
            $last_iq_value->save();
            config('trading.active_log_martingala')?Log::info('*******************************************************************'):null;
            config('trading.active_log_martingala')?Log::info('*******************************************************************'):null;
        }else{
            //si existía alerta pero no se envió
            if($last_iq_value->martingala_send == -1){
                $last_iq_value->alert_martingala = null;
                $last_iq_value->level_martingala = null;
                $last_iq_value->martingala_send = null;
                $last_iq_value->id_martingala = null;
                $last_iq_value->save();
                config('trading.active_log_martingala')?Log::info('*******************************************************************'):null;
                config('trading.active_log_martingala')?Log::info('*******************************************************************'):null;
            }
        }
    }

    public function generateAllLevelData()
    {
        $iq_values = $this->iqValues;
        foreach ($iq_values as $iq_value) {
            $iq_value->saveBounces($this);

            $iq_value->saveBrokes();

            $this->setAvgCandles($iq_value);
            $this->save();

            $this->setNextEntries($iq_value->close);

            SupportResistor::searchAndSave($iq_value, $this);
        }

        echo 'FIN';
    }

    public function evaluateResultsMartingala($from = null, $to = null)
    {
        $candles = $this->iqValues()->whereNotNull('alert_martingala')->whereNotNull('result_alert_martingala');

        if($from){
            $candles = $candles->where('date', '>=', $from);
        }

        if($to){
            $candles = $candles->where('date', '<=', $to);
        }

        $candles = $candles->get();

        //echo $candles->count()." Entradas analizadas"; 

        $data = [];
        $counter = 0;
        foreach ($candles as $candle) {
            $counter++;
            if($candle->result_alert_martingala == 1){
                if(array_key_exists($counter, $data)){
                    $data[$counter] = $data[$counter] + 1;
                }else{
                    $data[$counter] = 1;                    
                }
                $counter = 0;
            }else if($candle->result_alert_martingala == 0){
                $counter--;
            }
        }

        $counter = 0;
        $index = 0;
        $data_return = [];
        while($counter < count($data)){
            $index++;
            if(array_key_exists($index, $data)){
                $data_return[$index] = $data[$index];
                $counter++; 
            }
        }

        return $data_return; 
    }

    public static function evaluateAllResultsMartingala($from = null, $to = null)
    {
        $currency_pairs = CurrencyPair::all();
        $result = [];
        foreach ($currency_pairs as $c) {
            $result[$c->name] = $c->evaluateResultsMartingala($from, $to);
        }
        return $result;
    }
}
