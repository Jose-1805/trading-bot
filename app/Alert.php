<?php

namespace App;

use App\Events\NewMessage;
use Illuminate\Database\Eloquent\Model;

class Alert extends Model
{
    protected $table = 'alerts';

    public $timestamps = false;

    protected $fillable = [
        'value',
        'direction_alert',
        'date',
        'probability',
        'result'
    ];

    public function currencyPair()
    {
    	return $this->belongsTo(CurrencyPair::class, 'currency_pair_id');
    }

    public function send(CurrencyPair $currency_pair = null)
    {
        $currency_pair = $currency_pair?$currency_pair:$this->currencyPair;
        
        $this->currency_pair_name = $currency_pair->name;

    	$message = [
            'type' => $this->event_type?$this->event_type:'alert',
            'data' => $this->data?$this->data:$this
        ];

        event(new NewMessage($message));
        unset($this->currency_pair_name);
    }
}
