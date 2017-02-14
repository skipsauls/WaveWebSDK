({
    doInit: function(component, event, helper) {
		var query = "";
        
        var recordType = component.get("v.recordType");
        
        var fields = component.get("v.fields");
        if (fields && fields.length > 0) {
            fields = fields.split(',');
        }
        
        var limit = component.get("v.limit");
        
        if (typeof fields !== "undefined" && fields.length > 0) {
            var sep = "";
            query = "SELECT ";
            for (var i = 0; i < fields.length; i++) {
                query += sep + fields[i].trim();
                sep = ", ";
            }
            query += " FROM " + recordType;
            
            if (typeof limit !== "undefined" && limit > 0) {
                query += " LIMIT " + limit;
            }
        } else {
            //query = component.get("v.query"); //SELECT Id, Name, StageName FROM Opportunity";
        }
        //console.warn("query: ", query);
        
        var action = component.get("c.getRecords");
        action.setParams({query: query});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var records = response.getReturnValue();
                helper.createTable(component, records);
            }
            else if (state === "INCOMPLETE") {
                // do something
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + errors[0].message);
                    }
                } else {
                    console.error("Unknown error");
                }
            }            
        });
        $A.enqueueAction(action);
        
    },
    
    handleSendMessageToWindow: function(component, event, helper) {
    
	}
    
})