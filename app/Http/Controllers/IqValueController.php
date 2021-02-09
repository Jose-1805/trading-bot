<?php

namespace App\Http\Controllers;

use App\Alert;
use App\CurrencyPair;
use App\Events\NewMessage;
use App\IqValue;
use App\SupportResistor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IqValueController extends Controller
{   
    /**
     * Agrega los valores de una vela al sistema
     * @param Request $request 
     * @param String  $name    Nombre del par de divisas
     * @param Double  $open    Valor de apertura de la vela
     * @param Double  $close   Valor de cierre de la vela
     * @param Double  $min     Mínimo valor alcanzado por la vela
     * @param Double  $max     Máximo valor alcanzado por la vela
     * @param Date    $date    Fecha de la vela
     * @param Integer $time    Time de la fecha de la vela
     * @param Double  $volume  Valor de volumen de la vela
     */
    public function add(Request $request, $name, $open, $close, $min, $max, $date, $time, $volume, $traders_mood) {
    	$iq_value = new IqValue();

    	$currency_pair = CurrencyPair::where('name', $name)->first();

    	if($currency_pair){
			$iq_value->open = (float) number_format($open, config('trading.max_decimals_value'));
			$iq_value->close = (float) number_format($close, config('trading.max_decimals_value'));
			$iq_value->min = (float) number_format($min, config('trading.max_decimals_value'));
			$iq_value->max = (float) number_format($max, config('trading.max_decimals_value'));
			$iq_value->date = $date;
			$iq_value->time = $time;
			$iq_value->volume = $volume;
			$iq_value->currency_pair_id = $currency_pair->id;
            $iq_value->setDirection();
            $iq_value->setCandleSize();

            //evalua si debe lanzar alertas de martín gala al cerrar la vela
            $iq_value->evaluateMartingala($currency_pair, $traders_mood);

            $iq_value->setBrokeLevel();
            $iq_value->send_alert = false;

            if($iq_value->broke_level == 1){
                //Log::info('ALERTAS BLOQUEADAS POR RUPTURA DE NIVEL');
                $currency_pair->launch_alerts = -1;
            }else{

                $iq_value->evaluateHammer($currency_pair);

                //si no se ha enviado alerta
                if(!$iq_value->send_alert){
                    //vela alcista, cierra en nivel
                    if( 
                        $iq_value->direction == 1
                        && $iq_value->close == $currency_pair->next_bear_entry
                    ){
                        /*$alert = new Alert();
                        $alert->value = $iq_value->close;
                        $alert->direction_alert = -1;
                        $alert->date = date('Y-m-d H:i:s', strtotime('+1 minute', strtotime($date)));
                        $alert->probability = $currency_pair->probability_bear_entry;
                        $alert->currency_pair_id = $currency_pair->id;
                        $alert->dispatcher = 'level_touch';
                        $alert->send();
                        $alert->save();*/

                        //se hace para no enviar alertas en el siguiente minuto
                        $iq_value->send_alert = true;
                        //vela bajista y cierra en nivel
                    } else if ( 
                        $iq_value->direction == -1
                        && $iq_value->close == $currency_pair->next_bullish_entry
                    ){
                        /*$alert = new Alert();
                        $alert->value = $iq_value->close;
                        $alert->direction_alert = 1;
                        $alert->date = date('Y-m-d H:i:s', strtotime('+1 minute', strtotime($date)));
                        $alert->probability = $currency_pair->probability_bullish_entry;
                        $alert->currency_pair_id = $currency_pair->id;
                        $alert->dispatcher = 'level_touch';
                        $alert->send();
                        $alert->save();*/

                        //se hace para no enviar alertas en el siguiente minuto
                        $iq_value->send_alert = true;
                    }
                }

                if($iq_value->send_alert){
                    //Log::info('ALERTAS BLOQUEADAS POR ENVIO DE ALERTA PREVIO');
                }

                //se activan las alertas si es posible
                $currency_pair->launch_alerts = $iq_value->send_alert?-1:1;
            }            

    		$iq_value->evaluateBigCandle($currency_pair);
            
            unset($iq_value->send_alert);
            
            $iq_value->save();

            //Si la vela rebota en un nivel o
            //rompe uno aumenta el contador de rebotes y/o rupturas
            $iq_value->saveBounces($currency_pair);
            $iq_value->saveBrokes();

            //calcula la cantidad de velas que van en la misma dirección de la actual
            $currency_pair->setCandlesCount($iq_value->direction);

            $currency_pair->setAvgCandles($iq_value);

            //si la vela cierra después de un nivel o si no existe nivel se buscan 
            //las siguientes entradas
            /*if(
                !$currency_pair->next_bear_entry || !$currency_pair->next_bullish_entry
                $currency_pair->next_bear_entry < $iq_value->close || $currency_pair->next_bullish_entry > $iq_value->close
            ){
                //calcula las siguientes entradas según el punto de cierre de la vela
                $currency_pair->setNextEntries($iq_value->close);
            }*/

            //calcula las siguientes entradas según el punto de cierre de la vela
            $currency_pair->setNextEntries($iq_value->close);

            //calcula los siguientes niveles más cercanos al vslor de cierre de vela
            $currency_pair->setNextLevels($iq_value->close);
            
            $currency_pair->save();

            //se envia par de divisas con los datos actualizados
            $message = [
                //'type' => 'data',
                //'data' => collect([$currency_pair])
                'type' => 'full_data',
                'data' => CurrencyPair::where('state', 'active')->get()
            ];

            event(new NewMessage($message));
            
            //busca, almacena y/o actualiza los soportes y resistencias resientes
            SupportResistor::searchAndSave($iq_value, $currency_pair);

		}else{
			echo 'Par de divisas no soportadas o no activas';
		}
    }

    public function evaluate(Request $request, $name, $value, $open, $max, $date)
    {
        $currency_pair = CurrencyPair::where('name', $name)->where('state','active')->first();

        $value = (float) number_format($value, config('trading.max_decimals_value'));

        if($currency_pair && $currency_pair->launch_alerts == 1){
            $last_iq_value = $currency_pair->lastIqValue();
            $levels_distance = $currency_pair->setPercentageLevelsDistance($value);

            $second = intval(date('s', strtotime($date)));
            
            //en el primer segundo
            if($second == 1){
                //si es un salto que atraviesa un nivel
                //se actualizan los siguientes niveles de entrada
                if(
                    ($currency_pair->next_bear_entry && $open > $currency_pair->next_bear_entry)
                     || ($currency_pair->next_bullish_entry && $open < $currency_pair->next_bullish_entry)
                )
                {
                    $currency_pair->setNextEntries($open);
                    //Log::info('ALERTAS BLOQUEADAS POR SALTO DE PRECIO A NUEVO NIVEL');
                    $currency_pair->launch_alerts = -1;
                }

                $levels_distance_open = $currency_pair->setPercentageLevelsDistance($open);

                //si la nueva vela abre muy cerca a uno de sus niveles se desactivan las alertas
                if(($levels_distance_open['upper'] && $levels_distance_open['upper'] <= config('trading.percentage_open_candle_lock_alert')) || ($levels_distance_open['lowwer'] && $levels_distance_open['lowwer'] <= config('trading.percentage_open_candle_lock_alert'))){
                    //Log::info($levels_distance_open);
                    //Log::info('ALERTAS BLOQUEADAS POR PRECIO CERCA DE NIVEL');
                    $currency_pair->launch_alerts = -1;
                }

                $currency_pair->save();

                //se encuentra antes del segundo 29 y se puede enviar alertas
                //se evalua si se puede enviar una alerta
            } else if($second < 29 && $currency_pair->launch_alerts == 1){
                //si existe una vela anterior
                //y esa vela corresponde al minuto anterior al actual
                if($last_iq_value && date('Y-m-d H:i',strtotime($last_iq_value->date)) == date('Y-m-d H:i', strtotime('-1 minute', strtotime($date)))){                    
                    //si llega al nivel superior se genera alerta bajista 
                    if($levels_distance['upper'] && $levels_distance['upper'] <= config('trading.percentage_for_alert')){
                        //si la velaanterior va en dirección de la alerta o es pequeña
                        if($last_iq_value->direction != 1 || $last_iq_value->candle_size <= config('trading.max_size_candle_previous')){
                            $alert = new Alert();
                            $alert->value = $value;
                            $alert->direction_alert = -1;
                            $alert->date = $date;
                            $alert->probability = $currency_pair->probability_bear_entry;
                            $alert->currency_pair_id = $currency_pair->id;
                            $alert->dispatcher = 'level_touch';
                            $alert->send($currency_pair);
                            $alert->save();
                        }
                    }else if($levels_distance['lowwer'] && $levels_distance['lowwer'] <= config('trading.percentage_for_alert')){
                            //si la velaanterior va en dirección de la alerta o es pequeña
                            if($last_iq_value->direction != -1 || $last_iq_value->candle_size <= config('trading.max_size_candle_previous')){
                                $alert = new Alert();
                                $alert->value = $value;
                                $alert->direction_alert = 1;
                                $alert->date = $date;
                                $alert->probability = $currency_pair->probability_bullish_entry;
                                $alert->currency_pair_id = $currency_pair->id;
                                $alert->dispatcher = 'level_touch';
                                $alert->send($currency_pair);
                                $alert->save();
                            }
                    }
                }
            }

            if($currency_pair->launch_alerts == 1){
                $currency_pair->level_distance_upper = $levels_distance['upper'];
                $currency_pair->level_distance_lowwer = $levels_distance['lowwer'];
            }

            $message = [
                'type' => 'data',
                'data' => collect([$currency_pair])
            ];

            event(new NewMessage($message));

        }else{
            echo 'Par de divisas no soportadas o no activas';
        }

    }

    public function evaluateMartingala(Request $request, $name, $value=0, $open = 0)
    {
        $currency_pair = CurrencyPair::where('name', $name)->where('state','active')->first();

        if($currency_pair){
            $last_iq_value = $currency_pair->lastIqValue();
            if($last_iq_value){
                $currency_pair->evaluateLastAlertMartingala($last_iq_value, $open);
            }
        }else{
            echo 'Par de divisas no soportadas o no activas';
        }       
    }

    public function setEntryValueMartingala(Request $request, $name, $value=0)
    {
        $currency_pair = CurrencyPair::where('name', $name)->where('state','active')->first();

        if($currency_pair){
            $last_iq_value = $currency_pair->lastIqValue();
            
            if($last_iq_value && ($last_iq_value->alert_martingala == 1 || $last_iq_value->alert_martingala == -1)){
                $last_iq_value->martingala_alert_value = $value;
                $last_iq_value->save();
            }   
        }else{
            echo 'Par de divisas no soportadas o no activas';
        }     
    }

    public function addCandle(Request $request, $name, $open, $close, $min, $max, $date, $time, $volume, $candle_size, $direction, $id_martingala, $alert_martingala, $martingala_mandatory_shipping, $level_martingala, $martingala_alert_value, $speed, $reasons_martingala)
    {
        $currency_pair = CurrencyPair::where('name', $name)->first();

        if($currency_pair){
            $iq_value = new IqValue();
            $iq_value->open = (float) number_format($open, config('trading.max_decimals_value'));
            $iq_value->close = (float) number_format($close, config('trading.max_decimals_value'));
            $iq_value->min = (float) number_format($min, config('trading.max_decimals_value'));
            $iq_value->max = (float) number_format($max, config('trading.max_decimals_value'));
            $iq_value->date = $date;
            $iq_value->time = $time;
            $iq_value->volume = $volume;
            $iq_value->direction = $direction;
            $iq_value->candle_size = $candle_size;
            $iq_value->speed = $speed != null && $speed != 'undefined' && $speed != 'Infinity' && $speed != 'null'?$speed:0;
            $iq_value->reasons_martingala = $reasons_martingala != null && $reasons_martingala != 'undefined' && $reasons_martingala != 'Infinity' && $reasons_martingala != 'null'?$reasons_martingala:null;
            $iq_value->id_martingala = $id_martingala != null && $id_martingala != 'undefined' && $id_martingala != 'Infinity' && $id_martingala != 'null'?$id_martingala:null;
            $iq_value->alert_martingala = $alert_martingala != null && $alert_martingala != 'undefined' && $alert_martingala != 'Infinity' && $alert_martingala != 'null'?$alert_martingala:null;
            $iq_value->martingala_mandatory_shipping = $martingala_mandatory_shipping != null && $martingala_mandatory_shipping != 'undefined' && $martingala_mandatory_shipping != 'Infinity' && $martingala_mandatory_shipping != 'null'?$martingala_mandatory_shipping:null;
            $iq_value->level_martingala = $level_martingala != null && $level_martingala != 'undefined' && $level_martingala != 'Infinity' && $level_martingala != 'null'?$level_martingala:null;
            $iq_value->martingala_alert_value = $martingala_alert_value != null && $martingala_alert_value != 'undefined' && $martingala_alert_value != 'Infinity' && $martingala_alert_value != 'null'?$martingala_alert_value:null;
            $iq_value->currency_pair_id = $currency_pair->id;
            $iq_value->save();
            $currency_pair->setNextLevels($iq_value->close);
            $currency_pair->setAvgCandles($iq_value);
            $currency_pair->save();

            $date_delete = date('Y-m-d H:i', strtotime('-1 hours', strtotime($date)));
            //DB::table('iq_values')->whereNull('alert_martingala')->where('date', '<', $date_delete)->delete();
            DB::table('iq_values')->where('reasons_martingala', '**')->where('date', '<', $date_delete)->delete();
        }else{
            echo 'Par de divisas no soportadas o no activas';
        } 
    }

    public function updateCandle(Request $request, $name, $date, $id_martingala, $alert_martingala, $martingala_mandatory_shipping, $level_martingala, $martingala_alert_value, $result_alert_martingala, $reasons_martingala, $speed)
    {
        $currency_pair = CurrencyPair::where('name', $name)->first();

        if($currency_pair){
            $iq_value = $currency_pair->iqValues()->where('date', $date)->first();
            if($iq_value){
                $iq_value->id_martingala = $id_martingala != null && $id_martingala != 'undefined' && $id_martingala != 'Infinity' && $id_martingala != 'null'?$id_martingala:null;
                $iq_value->alert_martingala = $alert_martingala != null && $alert_martingala != 'undefined' && $alert_martingala != 'Infinity' && $alert_martingala != 'null'?$alert_martingala:null;
                $iq_value->speed = $speed != null && $speed != 'undefined' && $speed != 'Infinity' && $speed != 'null'?$speed:$iq_value->speed;
                $iq_value->martingala_mandatory_shipping = $martingala_mandatory_shipping != null && $martingala_mandatory_shipping != 'undefined' && $martingala_mandatory_shipping != 'Infinity' && $martingala_mandatory_shipping != 'null'?$martingala_mandatory_shipping:null;
                $iq_value->level_martingala = $level_martingala != null && $level_martingala != 'undefined' && $level_martingala != 'Infinity' && $level_martingala != 'null'?$level_martingala:null;
                $iq_value->martingala_alert_value = $martingala_alert_value != null && $martingala_alert_value != 'undefined' && $martingala_alert_value != 'Infinity' && $martingala_alert_value != 'null'?$martingala_alert_value:null;
                $iq_value->result_alert_martingala = $result_alert_martingala != null && $result_alert_martingala != 'undefined' && $result_alert_martingala != 'Infinity' && $result_alert_martingala != 'null'?$result_alert_martingala:null;
                $iq_value->reasons_martingala = $reasons_martingala != null && $reasons_martingala != 'undefined' && $reasons_martingala != 'Infinity' && $reasons_martingala != 'null'?$reasons_martingala:null;
                $iq_value->save();
            }
        }else{
            echo 'Par de divisas no soportadas o no activas';
        } 
    }
}
