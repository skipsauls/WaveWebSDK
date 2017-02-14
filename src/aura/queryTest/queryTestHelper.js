({
    index: 0,
    
    createCheckbox: function(component, recordId, val, field, callback) {
        var self = this;
        var span = document.createElement("span");
        span.classList.add("slds-checkbox");
        
        var checkbox = document.createElement("input");
        var uid = "checkbox-" + self.index; //Date.now();
        self.index++;
        checkbox.setAttribute("data-record-id", recordId);        
        checkbox.setAttribute("data-field", field);        
        checkbox.setAttribute("data-value", val);        
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("name", "filter");
        checkbox.setAttribute("id", uid);
        checkbox.checked =  false;
        checkbox.onclick = callback;
        
        span.appendChild(checkbox);
        
        var label = document.createElement("label");
        label.classList.add("slds-checkbox__label");
        label.setAttribute("for", uid);
        
        var lspan = document.createElement("span");
        lspan.classList.add("slds-checkbox--faux");
        label.appendChild(lspan);
        
        lspan = document.createElement("span");
        lspan.classList.add("slds-form-element__label");
        lspan.classList.add("slds-assistive-textx");
        label.appendChild(lspan);
        
        span.appendChild(label);
        
        return span;        
    },
    
    
    createCell: function(component, recordId, label, val, field, type, callback) {
        var self = this;
        
        field = field.trim();
        
        var cell = document.createElement(type);
        cell.setAttribute("role", "gridcell");
        
        
        var div = document.createElement("div");
        div.classList.add("slds-truncate");
        if (type === 'th') {
            //div.classList.add("slds-cell-fixed");
        }
        
        var checkbox = self.createCheckbox(component, recordId, val, field, callback);
        div.appendChild(checkbox);
        
        var span = document.createElement("span");
        span.classList.add("slds-p-around--small");
        span.innerHTML = '' + label;
        
        div.appendChild(span);
        
        div.setAttribute("data-field", field);
        
        if (typeof callback === "function") {
            checkbox.onclick = callback;
        }
        
        cell.appendChild(div);
        return cell;
    },
    
    createTable: function(component, records) {
        var self = this;
        
        /*
        var fields = component.get("v.fields");
        if (fields && fields.length > 0) {
            fields = fields.split(',');            
        } else {
            fields = [];
        }
        */
        /*
        var labels = component.get("v.labels");
        if (labels && labels.length > 0) {
            labels = labels.split(',');
        } else {
            labels = [];
        }*/ 
		
        var fields = [];
        var labels = [];
        for (var key in records[0]) {
            fields.push(key);
            labels.push(key);
        }
        
        var thead = component.find("thead").getElement();
        thead.innerHTML = '';
        
        var record = records[0];
        var row = document.createElement("tr");
        row.classList.add('slds-text-title--caps');
        cell = self.createCell(component, "", 'All', 'all', 'all', "th", function(evt) {
            evt.stopPropagation();
            if (evt.target.type === 'checkbox') {
                var checked = evt.target.checked;
                
                var field = evt.target.getAttribute("data-field");
                var value = evt.target.getAttribute("data-value");
                
                var checkboxes = document.querySelectorAll("input[data-field]");
                checkboxes.forEach(function(cb) {
                    cb.checked = checked;
                });
                
                self.createFilter(component, "all", true);                
            }
            
        });
        row.appendChild(cell);
        for (var i = 0; i < labels.length; i++) {
            cell = self.createCell(component, "", labels[i], labels[i], fields[i], "th", function(evt) {
                evt.stopPropagation();
                if (evt.target.type === 'checkbox') {
					var checked = evt.target.checked;
                    var field = evt.target.getAttribute("data-field");
                    var value = evt.target.getAttribute("data-value");
                    
                    var checkboxes = document.querySelectorAll("input[data-field='" + field + "']");
                    checkboxes.forEach(function(cb) {
                        cb.checked = checked;
                    });
                    
                    self.createFilter(component, field, true);
                }
                
            });    
            row.appendChild(cell);            
        }
        
        thead.appendChild(row);
        
        var tbody = component.find("tbody").getElement();
        tbody.innerHTML = '';
        
        for (var i = 0; i < records.length; i++) {
            record = records[i];
            row = document.createElement("tr");
            cell = self.createCell(component, record["Id"], i, record["Id"], "Id", "td", function(evt) {
                evt.stopPropagation();
                if (evt.target.type === 'checkbox') {
                    var checked = evt.target.checked;
                    var recordId = evt.target.getAttribute("data-record-id");
                    var field = evt.target.getAttribute("data-field");
                    var value = evt.target.getAttribute("data-value");

                    var checkboxes = document.querySelectorAll("input[data-record-id='" + recordId + "']");
                    checkboxes.forEach(function(cb) {
                        cb.checked = checked;
                    });
                    
                    self.createFilter(component, field);
                }
            });
            //cell.setAttribute("data-record-id", record["Id"]);
            row.appendChild(cell);
            var field = null;
            var value = null;
            var obj = null;
            for (var j = 0; j < fields.length; j++) {            
                field = fields[j].trim();
                value = record[field];
                if (field.indexOf(".") >= 0) {
                    var tokens = field.split(".");
                    obj = record[tokens[0]];
                    if (typeof obj === "object") {
                        value = obj[tokens[1]];
                    }
                }
                
                cell = self.createCell(component, record["Id"], value, value, field, "td", function(evt) {
                    
                    evt.stopPropagation();
                    if (evt.target.type === 'checkbox') {
                        var field = evt.target.getAttribute("data-field");
                        var value = evt.target.getAttribute("data-value");
                        self.createFilter(component, field);
                    }
                });
                
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }        
    },

    createFilter: function(component, fields, resetFields) {
        var dashboardId = component.get('v.dashboardId');
        var datasetName = component.get('v.dataset');
        
        var checkboxes = document.querySelectorAll("tbody input[data-field]");
        var field = null;
        var value = null;
        
        var filter = {};
        filter[datasetName] = {};
        
        /* - Reset case?
        var allFields = component.get("v.fields").split(",");
        for (var i = 0; i < allFields.length; i++) {
            filter[datasetName][allFields[i].trim()] = [];
        }
        */
        
       	fields = typeof fields === "string" ? [fields] : fields;

        
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked === true) {
				field = checkbox.getAttribute("data-field");
				value = checkbox.getAttribute("data-value");
                value = isNaN(parseInt(value)) ? value : parseInt(value);
                filter[datasetName][field] = filter[datasetName][field] || [];
                filter[datasetName][field].push(value);
            }
        });

        
        for (var i = 0; i < fields.length; i++) {
            field = fields[i].trim();
            filter[datasetName][field] = filter[datasetName][field] || [];
        }
        
        var json = JSON.stringify(filter);

        var evt = $A.get('e.wave:sendMessageToWave');
        evt.setParams({
            payload: json,
            instanceId: dashboardId
        });
        evt.fire();

    }    
})