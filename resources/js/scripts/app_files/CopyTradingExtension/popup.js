let start_ct = document.getElementById('start_ct');

chrome.storage.sync.get('copy_trading_is_running', function(data) {
	if(data.copy_trading_is_running){
		start_ct.style.backgroundColor = "#00ff00";
	}else{
		start_ct.style.backgroundColor = "#ff0000";
	}
});


start_ct.onclick = function(element) {
	chrome.storage.sync.get('copy_trading_is_running', function(data) {
		if(data.copy_trading_is_running){
			chrome.extension.getBackgroundPage().stopCopyTrading();
		}else{
			chrome.extension.getBackgroundPage().startCopyTrading();	
		}
	});
};

