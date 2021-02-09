<?php

namespace App\Http\Controllers;

use App\Alert;
use App\CurrencyPair;
use Illuminate\Http\Request;

class CurrencyPairController extends Controller
{
    public function requestSync(Request $request, $name = '')
    {
    	$currency_pair = CurrencyPair::where('name', $name)->first();

    	if($currency_pair){
    		$currency_pair->data_trend = $currency_pair->getTrend();
	    	$alert = new Alert();
	        $alert->event_type = 'sync_currency_pair';
	        $alert->data = $currency_pair;
	        $alert->send($currency_pair);
	    }
    }

    public function requestUpdateLevels(Request $request, $name = '', $value =  0)
    {
        $currency_pair = CurrencyPair::where('name', $name)->first();

        if($currency_pair){
            $currency_pair->setNextLevels($value);
            $currency_pair->save();
            $alert = new Alert();
            $alert->event_type = 'sync_currency_pair';
            $alert->data = $currency_pair;
            $alert->send($currency_pair);
        }
    }
}
