var print_candle = true;
function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;

    try{
        var data = JSON.parse(str);
        //result win - loose - sold
        if(data){
            /*if(data.name 
                && data.name != 'candle-generated'
                && data.name != 'socket-option-opened'
                && data.name != 'option'
                && data.name != 'socket-option-closed'
                && data.name != 'option-opened'
                && data.name != 'option-closed'
                && data.name != 'balance-changed'
                && data.name != 'option-archived'
                && data.name != 'candles'
                && data.name != 'traders-mood-changed'
                && data.name != 'heartbeat'
                && data.name != 'balances'
                && data.name != 'result'
                && data.name != 'timeSync'
                && data.name != 'underlying-list-changed'
                && data.name != 'instruments-changed'
                && data.name != 'user-availability'
                && data.name != 'set-user-settings-reply'
                && data.name != 'commission-changed'
                && data.name != 'spot-buyback-quote-generated'
            ){
                console.log(data.name);
                //if(data.name == 'candles'){
                //if(data.name == 'traders-mood-changed'){
                //if(data.name == 'traders-mood-changed'){
                //if(data.name == 'underlying-list-changed'){
                //if(data.name == 'commission-changed'){
                if(data.name == 'signal-created'){
                    console.log(data);
                }
            }*/
            if(data.name == 'traders-mood-changed'){
                traders_mood = (data.msg.value * 100).toFixed(2);
            }else if(data.name && data.name == 'candle-generated'){
                evaluateCandle(data.msg);
            }else if(data.name && data.name == 'option-opened' && run_martingala){
                setEntryValue(data.msg.value);
            }else if(data.name && data.name == 'option-closed' && run_martingala){
                if(data.msg.result == 'equal'){
                    attemps--;
                    option_equal = true;
                }else if(data.msg.result == 'win'){
                    if(typeof stop_loss == 'number'){
                        current_gain += (data_entries[0].amount * data_entries[0].utility)/100;

                        max_gain = (current_gain > max_gain)?current_gain:max_gain;
                        //console.log('GANANCIA EN ENTRADA: '+((data_entries[0].amount * data_entries[0].utility)/100));
                        //console.log('GANANCIAS ACTUALES: '+current_gain);
                        data_entries.splice(0, 1);
                    }
                }else if(data.msg.result == 'loose'){
                    if(typeof stop_loss == 'number'){
                        current_gain -= data_entries[0].amount;
                        
                        //console.log('PERDIDA EN ENTRADA: '+data_entries[0].amount);
                        //console.log('GANANCIAS ACTUALES: '+current_gain);
                        data_entries.splice(0, 1);

                        if(stop_loss_dynamic){
                            //si las perdidas han llegado a un punto cercano del stop loss dinámico
                            //el cual no permite realizar la entrada mínima (initial_amount)
                            if(current_gain < ((max_gain - stop_loss) + initial_amount)){
                                //console.log('Sistema detenido por alcance de stop loss dinámico');
                                //console.log('Utilidad final: $ '+current_gain);
                            }
                        }else{
                            //si las perdidas han llegado a un punto cercano del stop loss
                            //el cual no permite realizar la entrada mínima (initial_amount)
                            if(current_gain < 0 && (stop_loss - Math.abs(current_gain)) < initial_amount){
                                //console.log('Sistema detenido por alcance de stop loss');
                                //console.log('Utilidad final: $ '+current_gain);
                            }
                        }
                    }
                }
            }else if(data.name && data.name == 'commission-changed' && data.msg.active_id == active_id && data.msg.instrument_type == 'turbo-option'){
                current_utility = 100 - data.msg.commission.value;
            }
        }
    }catch(error){

    }

    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
}

let omite = {
    'timeSync':true,
    'candles':true,
    'candle-generated':true,
    'commission-changed':true,
    'socket-option-closed':true,
    'socket-option-opened':true,
    'balance-changed':true,
    'option':true,
    'option-closed':true,
    'option-opened':true,
    'position-changed':true,
    'option-archived':true,
    'heartbeat':true,
    'traders-mood-changed':true,
    'result':true,
    'underlying-list-changed':true,
    'expiration-top-computed':false,
    'balances':true,
    'instruments-changed':true,
    'spot-buyback-quote-generated':true,
    'set-user-settings-reply':true,
    'signal-created':false,
    'live-deal-binary-option-placed':true,
    'candles-generated':true,
    'quote-generated':true,
    'top-assets-updated':true,
    'user-profile-client':false,
    'leaderboard-userinfo-deals-client':false,
    'users-availability':true,
    'user-availability':true,
};

let copy_user_id = '32240884';
let copy_user_id_2 = '50648605';

function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
    if (!(maxBytesToWrite > 0)) return 0;

    try{
        var data = JSON.parse(str);
        if(data && data.name && !omite[data.name]){
            console.log(data);

            /*if(data.name == 'api_option_init_all_result'){
                actives = data.msg.result.binary.actives;
                let sql_ = 'INSERT INTO actives (name, img, broker_id) VALUES ';
                for(key in actives){
                     sql_ += '("'+(actives[key].description.split('front.')[1])+'", "https://static.cdnpub.info/files'+actives[key].image+'", '+actives[key].id+'),';
                }

                console.log(sql_)
            }*/
        }
    }catch(error){
        //console.log('ERROR', error)
    }

    var startIdx = outIdx;
    var endIdx = outIdx + maxBytesToWrite - 1;
    for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
            var u1 = str.charCodeAt(++i);
            u = 65536 + ((u & 1023) << 10) | u1 & 1023
        }
        if (u <= 127) {
            if (outIdx >= endIdx) break;
            outU8Array[outIdx++] = u
        } else if (u <= 2047) {
            if (outIdx + 1 >= endIdx) break;
            outU8Array[outIdx++] = 192 | u >> 6;
            outU8Array[outIdx++] = 128 | u & 63
        } else if (u <= 65535) {
            if (outIdx + 2 >= endIdx) break;
            outU8Array[outIdx++] = 224 | u >> 12;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        } else {
            if (outIdx + 3 >= endIdx) break;
            outU8Array[outIdx++] = 240 | u >> 18;
            outU8Array[outIdx++] = 128 | u >> 12 & 63;
            outU8Array[outIdx++] = 128 | u >> 6 & 63;
            outU8Array[outIdx++] = 128 | u & 63
        }
    }
    outU8Array[outIdx] = 0;
    return outIdx - startIdx
}

{"name":"sendMessage","request_id":"86","msg":{"name":"set-user-settings","version":"1.0","body":{"name":"traderoom_gl_trading","version":4,"client_id":"1586991489434000","config":{"isBuybackOneClickForex":true,"isBuybackOneClickCrypto":false,"isBuybackOneClickCfd":false,"isBuybackOneClickDigital":false,"isBuybackOneClickBinary":true,"isBuybackOneClickFX":false,"isBuybackOneClickDemo":true,"isBuybackOneClickOption":false,"isBuybackOneClickStock":false,"isBuyOneClickExchange":false,"isBuyOneClickForex":true,"isBuyOneClickCrypto":false,"isBuyOneClickCfd":false,"isBuyOneClickDigital":false,"isBuyOneClickBinary":true,"isBuyOneClickFX":false,"isBuyOneClickDemo":false,"isBuyOneClickOption":false,"isBuyOneClickStock":false,"isCodeOfConduct":false,"lastTournamentBet":[5.57,4.5,2.0,1.0,5.0,10.0,25.0,50.0,100.0],"lastRealBet":[5.06,2.25,1.0,2.41,25.61,11.38,2.51,1.79,2.0,5.0],"lastDemoBet":[1.0,1000.0,713.94,412.68,816.58,472.01,272.84,157.75,100.0,1.67],"lastRealLotBets":[],"lastPracticeLotBets":[],"lastLots":{},"lastAmounts":{"binary":1.0,"turbo":1.0,"digital-option":1.0,"cfd":1000.0,"forex":1000.0,"crypto":1000.0},"lastTpsl":{"tpOrderId":0,"takeProfitType":"percent","takeProfitPrice":null,"slOrderId":0,"stopLoseType":"percent","stopLosePrice":-40.0,"activeId":74,"leverage":1,"trailingStop":false},"recentMuxFactor":1.0,"recentIndicators":"{\"indicators\":[]}","widgetsEnable":[{"widgetName":"Wt_TradersDeals","optionType":"cfd","status":false},{"widgetName":"Wt_First","optionType":"crypto","status":true},{"widgetName":"Wt_LiveDeals","optionType":"turbo","status":true},{"widgetName":"Wt_HLValues","optionType":"cfd","status":true},{"widgetName":"Wt_None","optionType":"","status":true},{"widgetName":"Wt_HLValues","optionType":"crypto","status":true},{"widgetName":"Wt_First","optionType":"binary","status":true},{"widgetName":"Wt_Volume","optionType":"cfd","status":false},{"widgetName":"Wt_TradersDeals","optionType":"exchange","status":false},{"widgetName":"Wt_LiveDeals","optionType":"","status":true},{"widgetName":"Wt_TradersDeals","optionType":"binary","status":false},{"widgetName":"Wt_EventsOnPlot","optionType":"cfd","status":false},{"widgetName":"Wt_HLValues","optionType":"forex","status":true},{"widgetName":"Wt_Volume","optionType":"crypto","status":false},{"widgetName":"Wt_OrderBook","optionType":"","status":true},{"widgetName":"Wt_LiveDeals","optionType":"digital-option","status":true},{"widgetName":"Wt_LiveDeals","optionType":"forex","status":true},{"widgetName":"Wt_None","optionType":"exchange","status":true},{"widgetName":"Wt_None","optionType":"fx-option","status":true},{"widgetName":"Wt_Volume","optionType":"binary","status":false},{"widgetName":"Wt_LiveDeals","optionType":"crypto","status":true},{"widgetName":"Wt_EventsOnPlot","optionType":"exchange","status":false},{"widgetName":"Wt_First","optionType":"exchange","status":true},{"widgetName":"Wt_TradersDeals","optionType":"forex","status":false},{"widgetName":"Wt_None","optionType":"crypto","status":true},{"widgetName":"Wt_LiveDeals","optionType":"cfd","status":true},{"widgetName":"Wt_Volume","optionType":"fx-option","status":false},{"widgetName":"Wt_Volume","optionType":"digital-option","status":false},{"widgetName":"Wt_First","optionType":"","status":true},{"widgetName":"Wt_TradersDeals","optionType":"crypto","status":false},{"widgetName":"Wt_EventsOnPlot","optionType":"forex","status":false},{"widgetName":"Wt_EventsOnPlot","optionType":"","status":false},{"widgetName":"Wt_HLValues","optionType":"exchange","status":true},{"widgetName":"Wt_None","optionType":"digital-option","status":true},{"widgetName":"Wt_First","optionType":"fx-option","status":true},{"widgetName":"Wt_None","optionType":"binary","status":true},{"widgetName":"Wt_EventsOnPlot","optionType":"fx-option","status":false},{"widgetName":"Wt_First","optionType":"forex","status":true},{"widgetName":"Wt_LiveDeals","optionType":"fx-option","status":true},{"widgetName":"Wt_EventsOnPlot","optionType":"digital-option","status":false},{"widgetName":"Wt_TradersDeals","optionType":"","status":false},{"widgetName":"Wt_First","optionType":"cfd","status":true},{"widgetName":"Wt_LiveDeals","optionType":"binary","status":true},{"widgetName":"Wt_TradersDeals","optionType":"fx-option","status":false},{"widgetName":"Wt_Volume","optionType":"exchange","status":false},{"widgetName":"Wt_HLValues","optionType":"binary","status":true},{"widgetName":"Wt_OrderBook","optionType":"exchange","status":true},{"widgetName":"Wt_None","optionType":"forex","status":true},{"widgetName":"Wt_EventsOnPlot","optionType":"binary","status":false},{"widgetName":"Wt_HLValues","optionType":"fx-option","status":true},{"widgetName":"Wt_None","optionType":"cfd","status":true},{"widgetName":"Wt_TradersHistory","optionType":"exchange","status":true},{"widgetName":"Wt_HLValues","optionType":"","status":true},{"widgetName":"Wt_TradersHistory","optionType":"","status":true},{"widgetName":"Wt_First","optionType":"digital-option","status":true},{"widgetName":"Wt_EventsOnPlot","optionType":"crypto","status":false},{"widgetName":"Wt_TradersDeals","optionType":"turbo","status":false},{"widgetName":"Wt_TradersDeals","optionType":"digital-option","status":false},{"widgetName":"Wt_HLValues","optionType":"digital-option","status":true},{"widgetName":"Wt_LiveDeals","optionType":"exchange","status":true},{"widgetName":"Wt_Volume","optionType":"forex","status":false}],"hiLoWidgetMinDuration":3600,"bubbleInfoTypeStock":"invest","bubbleInfoTypeOption":"invest","priceMode":true,"isPlotAlertsVisible":true,"isPlotPendingsVisible":true,"isPercentOnOptionsPlotTabs":false,"isBuybackResultOnBinaryPlotTab":false,"isBuybackResultOnDigitalPlotTab":false,"isBuybackResultOnFXPlotTab":true,"dealsFeatureApply":"old_user"}}}}