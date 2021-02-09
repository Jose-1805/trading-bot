const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.react('resources/js/app.js', 'public/js')
   .combine([
   		'resources/js/scripts/app_files/echo_and_pusher.js',
         'resources/js/scripts/app_files/resources/vars.js',
   		'resources/js/scripts/app_files/resources/config.js',
   		'resources/js/scripts/app_files/resources/Martingala.js',
   		'resources/js/scripts/app_files/resources/ReceivingSendingData.js',
   		'resources/js/scripts/app_files/resources/CurrencyPair.js',
   		'resources/js/scripts/app_files/resources/Candle.js',
   		'resources/js/scripts/app_files/resources/functions.js'
	], 'public/js/martingala.js')
   .sass('resources/sass/app.scss', 'public/css');
