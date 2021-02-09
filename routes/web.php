<?php

use App\CurrencyPair;
use Symfony\Component\HttpFoundation\StreamedResponse;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Route::prefix("iq_value")->group(function(){
	Route::get("add/{name}/{open}/{close}/{min}/{max}/{date}/{time}/{volume}", "IqValueController@add");
	Route::get("evaluate/{name}/{value}/{open}/{max}/{date}", "IqValueController@evaluate");
});*/

Route::get('/', function () {
    return view('welcome');
});
