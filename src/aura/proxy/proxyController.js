({
	getRelativeUrl: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var url = params.url;

            var xhrConfig = {
                url: url,
                method: "GET"
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},
    
	listAssets: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var type = params.type;

            var xhrConfig = {
                url: "/services/data/v39.0/wave/" + type,
                method: "GET"
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},

	getAsset: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var type = params.type;
            var id = params.id;

            var xhrConfig = {
                url: "/services/data/v39.0/wave/" + type + "/" + id,
                method: "GET"
            };
            
            helper.sendMessage(component, "request", xhrConfig, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},
    
	handshake: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var config = {
                type: "handshake",
                preserveCallback: true	// Same callback is reused
            };
            config.logLevel = params.logLevel || undefined;
            
;            helper.sendMessage(component, "handshake", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},
    
	subscribe: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var topic = params.topic;
            
            var config = {
                type: "subscribe",
                topic: topic,
                preserveCallback: true	// Same callback is reused
            };
            
            helper.sendMessage(component, "subscribe", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	},
    
	unsubscribe: function(component, event, helper) {
		var params = event.getParam('arguments');
        if (params) {
            var topic = params.topic;
            
            var config = {
                type: "unsubscribe",
                topic: topic
            };
            
            helper.sendMessage(component, "unsubscribe", config, function(cmp, response) {
                var callback = params.callback;
                if (typeof callback === 'function') {
                    callback(response);
                }
            });
        }
	}

})