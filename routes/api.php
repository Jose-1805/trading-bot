<?php
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix("iq_value")->group(function(){
	Route::get("add_candle/{name}/{open}/{close}/{min}/{max}/{date}/{time}/{volume}/{candle_size}/{direction}/{id_martingala}/{alert_martingala}/{martingala_mandatory_shipping}/{level_martingala}/{martingala_alert_value}/{speed}/{reasons_martingala}", "IqValueController@addCandle");
	Route::get("update_candle/{name}/{date}/{id_martingala}/{alert_martingala}/{martingala_mandatory_shipping}/{level_martingala}/{martingala_alert_value}/{result_alert_martingala}/{reasons_martingala}/{speed}", "IqValueController@updateCandle");
	Route::get("add/{name}/{open}/{close}/{min}/{max}/{date}/{time}/{volume}/{traders_mood}", "IqValueController@add");
	Route::get("evaluate/{name}/{value}/{open}/{max}/{date}", "IqValueController@evaluate");
	Route::get("evaluate-martingala/{name}/{value}/{open}", "IqValueController@evaluateMartingala");
	Route::get("set-entry-value-martingala/{name}/{value}", "IqValueController@setEntryValueMartingala");
});

Route::prefix("currency-pair")->group(function(){
	Route::get("request-sync/{name}", "CurrencyPairController@requestSync");
	Route::get("request-update-levels/{name}/{value}", "CurrencyPairController@requestUpdateLevels");
});
