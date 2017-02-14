({
    doInit: function(component, event, helper) {
    	helper.showDashboard(component, event);    
    },
    
    dashboardIdChange: function(component, event, helper) {
    	helper.showDashboard(component, event);    
    },

    developerNameChange: function(component, event, helper) {
    	helper.showDashboard(component, event);    
    },
    
	showDashboard: function(component, event, helper) {
        console.warn('dashboardViewController.showDashboard: ', event);
		var params = event.getParam('arguments') || event.getParams();
        if (params) {
            var dashboardId = params.dashboardId;
            if (dashboardId) {
                component.set("v.dashboardId", dashboardId);
            } else {
	            var developerName = params.developerName;
                if (developerName) {
	                component.set("v.dashboardId", null);
                    component.set("v.developerName", developerName);
                }
            }
        }			
	}
})