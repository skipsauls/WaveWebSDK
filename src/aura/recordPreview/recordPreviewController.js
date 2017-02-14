({
    recordUpdated: function(component, event, helper) {
		console.warn('recordUpdated');
        var changeType = event.getParams().changeType;
        console.warn('changeType: ', changeType);
        var record = component.get("v.targetRecord");
        console.warn('record: ', record);
    },
    
	handleSendMessageToWindow: function(component, event, helper) {
        var params = event.getParams();
        var id = params.id;
        var payload = params.payload;
        if (payload) {
            var step = payload.step;
            var data = payload.data;
            data.forEach(function(obj) {
                for (var k in obj) {
                    if (k === 'Id') {
                        component.set("v.recordId", obj[k]);                        
                    }
                }
            });
        }
	}
})