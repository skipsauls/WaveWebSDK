({
    doInit: function(component, event, helper) {
    	var query = "\
q = load \"0Fb0M000000DKZgSAO/0Fc0M000000DvJ7SAK\";\n \
q = filter q by 'Amount' > 50000;\n \
q = filter q by !('StageName' in [\"Needs Analysis\", \"Perception Analysis\", \"Prospecting\"]);\n \
q = group q by ('StageName', 'Type', 'Name', 'Id');\n \
q = foreach q generate 'StageName' as 'StageName', 'Type' as 'Type', 'Name' as 'Name', 'Id' as 'Id', max('Amount') as 'max_Amount', max('Probability') as 'max_Probability';\n \
q = order q by ('StageName' asc, 'Type' asc, 'Name' asc, 'Id' asc);\n \
q = limit q 2000;";
        query = query.replace(new RegExp('\r', 'g'), '\n'); 
        component.set("v.query", query);
        
    },
    
	executeQuery: function(component, event, helper) {
		var query = document.querySelector("textarea[name='query']").value;
        var action = component.get("c.execute");
        action.setParams({query: query});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var json = response.getReturnValue();
                var resp = JSON.parse(json);
                console.warn('resp: ', resp);
                var results = resp.results;
                console.warn('results: ', results);
                var records = results.records;
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
	}
})