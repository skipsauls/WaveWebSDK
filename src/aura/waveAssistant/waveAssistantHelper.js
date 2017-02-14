({
    createActionsCell: function(component, fullname, jsonPayload, actions) {
        var cell = null;
        var div = null;
        cell = document.createElement("td");
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("name", "actions");
        var self = this;
        for (var key in actions) {
            div = document.createElement("button");
            div.classList.add("slds-button");
            div.classList.add("slds-truncate");
            div.classList.add("slds-show--inline-block");
            div.classList.add("slds-p-right--medium");
            div.innerHTML = key;
            div.setAttribute("data-asset-fullname", fullname);
            div.setAttribute("data-asset-payload", jsonPayload);
            div.setAttribute("data-action", actions[key]);
            div.onclick = function(evt) {
                var action = evt.target.getAttribute('data-action');
                var fullname = evt.target.getAttribute('data-asset-fullname');
                var payload = evt.target.getAttribute('data-asset-payload');
                self[action](component, fullname, payload);
            }
            cell.appendChild(div);            
        }
        return cell;
    },
    
    logEvent: function(component, evt) {
        console.warn('waveAssistantHelper.logEvent: ', evt);
        
        var self = this;
        
        var params = evt.getParams();
        var def = evt.getDef();
		var desc = def.getDescriptor();
        
        var val = null;
        
        var tbody = component.find("tbody").getElement();
        //tbody.innerHTML = "";

        var row = document.createElement("tr");
        var cell = null;
        
        var fullName = desc.getFullName();
        
        var cell = document.createElement("td");
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("name", "fullname");
        var div = document.createElement("div");
        div.classList.add("slds-truncate");
        div.innerHTML = '' + fullName;
        cell.appendChild(div);
        
        row.appendChild(cell);

        var val = null;
        var payload = {};
        for (var key in params) {
            payload[key] = params[key];
        }
        
        var regex = new RegExp('\"', 'g');


        console.warn('payload: ', payload);
        var jsonPayload = JSON.stringify(payload, null, 4);
        
        var cell = document.createElement("td");
        cell.setAttribute("role", "gridcell");
        cell.setAttribute("name", "payload");
        var txt = document.createElement("textarea");
        txt.classList.add("slds-truncate");
        //div.innerHTML = '' + val;
        txt.value = jsonPayload;
        cell.appendChild(txt);
                         
        row.appendChild(cell);

        var actions = {
            'Show': 'showEvent',
            'Fire': 'fireEvent'
        };
        
        cell = self.createActionsCell(component, fullName, jsonPayload, actions);
        row.appendChild(cell);
        
        //row.setAttribute("data-namespace", desc.getNamespace());
        
        tbody.appendChild(row);
        
    },
    
    fireEvent: function(component, fullname, jsonPayload) {
        var evt = $A.get('e.' + fullname);
        
        var payload = JSON.parse(jsonPayload);
        
        var regex = new RegExp('\"', 'g');        
        var val = null;
        for (var key in payload) {
            val = payload[key];
            val = val.replace(regex, '\"');
            evt.setParam(key, val);
        }
        evt.fire();                    
    },
    
    handleResponse: function(component, response) {
		var self = this;
        if (response && response.message) {
            if (response.message.data) {
                
                var data = response.message.data;
                var obj = data.sobject;
                var name = obj.Name;
                var namespace = obj.Namespace__c;
                var payload = obj.Payload__c;
                var extPayload = obj.ExtPayload__c;
                var useServer = obj.UseServer__c;
                
                var evt = $A.get('e.' + namespace + ':' + name);
                var params = JSON.parse(payload);
                var regex = new RegExp('\"', 'g');
                for (var k in params) {
                    if (typeof params[k] === 'object') {
    	                evt.setParam(k, JSON.stringify(params[k]).replace(regex, '"'));	                        
                    } else {
                        evt.setParam(k, params[k]);
                    }
                }
                self.logEvent(component, evt);
                evt.fire();                
            }
        }
        
    },
    
    setupTopics: function(component) {
        var self = this;    
        var proxy = component.find('proxy');
        var ready = proxy.get("v.ready");
        var self = this;
        if (ready === true) {
	        console.warn('$$$$$$$$$$$$$$$ waveAssistantHelper calling proxy.handshake');
            proxy.handshake(null, function(response) {
                if (response.ready === true) {
                    var topic = component.get('v.topic');
                    proxy.subscribe(topic, function(response) {
                        var timestamp = Date.now();
                        component.set("v.ready", true);
                        component.set("v.pulsing", true);
                        self.handleResponse(component, response);
                       	var tdiff = Date.now() - timestamp;
                        var min_pulse_time = component.get("v.min_pulse_time");
                        if (tdiff < min_pulse_time) {
                            setTimeout(function() {
			                    component.set("v.pulsing", false);
                            }, min_pulse_time - tdiff);
                        } else {
                            component.set("v.pulsing", false);
                        }
                    });                    
                } else {
                    component.set("v.pulsing", false);
                    component.set("v.ready", false);
                }
            });		
            
        } else {
            setTimeout(function() {
                self.setupTopics(component);
            }, 500);
        }
    },
    
    setup: function(component) {
        var self = this;
        self.setupTopics(component);
    }
})