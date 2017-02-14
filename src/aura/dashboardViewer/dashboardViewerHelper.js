({
    showDashboard: function(component, event) {
        var dashboardId = component.get("v.dashboardId");
        var developerName = component.get("v.developerName");
        var config = null;
        if (dashboardId) {
            config = {dashboardId: dashboardId}
        } else if (developerName) {
            config = {developerName: developerName};
        }
        
        if (config) {
            config.height = "700";
            $A.createComponent("wave:waveDashboard", config, 
                               function(dashboard, status, err) {
                                   
                                   if (status === "SUCCESS") {
                                       
                                       //component.set("v.body", dashboard);
                                       
                                       var body = component.get("v.body");
                                       //body.push(dashboard);
                                       
                                       // Workaround for weird behavior when replacing dashboards
                                       for (var i = 0; i < body.length; i++) {
                                           if (!$A.util.hasClass(body[i], "hide")) {
	                                           $A.util.addClass(body[i], "hide");
                                           }
                                       }
                                       
                                       body.push(dashboard);
                                       
                                       component.set("v.body", body);
                                       
                                   }
                                   else if (status === "INCOMPLETE") {
                                       console.log("No response from server or client is offline.")
                                   } else if (status === "ERROR") {
                                       console.log("Error: " + errorMessage);
                                   }
                               }
                              );		
            
        }
    }
})