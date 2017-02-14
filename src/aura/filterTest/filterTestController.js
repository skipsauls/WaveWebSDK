({
    doInit: function(component, event, helper) {
    	component.set('v.filter', '{"oppty_test": {"StageName": ["Closed Won"]}}');    
    },
    
	handleSendFilter: function(component, event, helper) {
		var filter = component.get('v.filter');
        var dashboardId = component.get('v.dashboardId');
        console.warn('filter: ', filter);
        console.warn('dashboardId: ', dashboardId);
        var evt = $A.get('e.wave:sendMessageToWave');
        evt.setParams({
            payload: filter,
            instanceId: dashboardId
        });
        evt.fire();
	}
})