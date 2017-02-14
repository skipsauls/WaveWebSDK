({
    handshake: function(component, event, helper) {
        
        var proxy = component.find('proxy');
        var self = this;
        proxy.handshake(null, function(response) {
            //console.warn('response: ', response);
        });
        
    },
    
    subscribe: function(component, event, helper) {
        
        var proxy = component.find('proxy');
        var topic = component.get('v.topic');
        var self = this;
        proxy.subscribe(topic, function(response) {
            if (response && response.message) {
                if (response.message.data) {
                    
					var data = response.message.data;
					var obj = data.sobject;
                    var evt = $A.get('e.wave:sendMessageToWave');
                    evt.setParams({
                        payload: obj.Payload__c,
                        instanceId: obj.Recipient__c
                    });
                    evt.fire();                
                }
            }
        });
        
    },
    
    unsubscribe: function(component, event, helper) {
        
        var proxy = component.find('proxy');
        var topic = component.get('v.topic');
        var self = this;
        proxy.unsubscribe(topic, function(response) {
            //console.warn('streamTestController.unsubscribe - response: ', response);
        });		
    }        
})