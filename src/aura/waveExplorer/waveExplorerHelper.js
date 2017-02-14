({
    createCell: function(component, asset, attr) {
        var cell = null;
        var div = null;
        cell = document.createElement("td");
        cell.setAttribute("role", "gridcell");                
        div = document.createElement("div");
        div.classList.add("slds-truncate");
        div.innerHTML = asset[attr];
        cell.appendChild(div);
        return cell;
    },

    createActionsCell: function(component, asset, actions) {
        var cell = null;
        var div = null;
        cell = document.createElement("td");
        cell.setAttribute("role", "gridcell");
        var self = this;
        for (var key in actions) {
            div = document.createElement("button");
            div.classList.add("slds-button");
            div.classList.add("slds-truncate");
            div.classList.add("slds-show--inline-block");
            div.classList.add("slds-p-right--medium");
            div.innerHTML = key;
            div.setAttribute("data-asset-type", asset.type);
            div.setAttribute("data-asset-label", asset.label);
            div.setAttribute("data-asset-name", asset.name);
           	div.setAttribute("data-asset-id", asset.id);
            div.setAttribute("data-action", actions[key]);
            div.onclick = function(evt) {
                var action = evt.target.getAttribute('data-action');
                var type = evt.target.getAttribute('data-asset-type');
                var id = evt.target.getAttribute('data-asset-id');
                self[action](component, type, id);
            }
            cell.appendChild(div);            
        }
        return cell;
    },
    
    listAssets: function(component, event) {
        var type = component.get("v.selected_asset_type");
        var proxy = component.find('proxy');
        var self = this;
        proxy.listAssets(type, function(response) {
            console.warn('waveExplorerHelper.listAssets - response: ', response);
            
            var body = response.body;
            var assets = body[type];
            var asset = null;
            var row = null;
            var cell = null;
            var div = null;
            var tbody = component.find("tbody").getElement();
            tbody.innerHTML = "";
            for (var i = 0; i < assets.length; i++) {
                asset = assets[i];
                
                row = document.createElement("tr");
                row.setAttribute("scope", "row");
                row.setAttribute("data-asset-type", type);
                row.setAttribute("data-asset-label", asset.label);
                row.setAttribute("data-asset-name", asset.name);
                row.setAttribute("data-asset-id", asset.id);
/*                
                row.onclick = function(evt) {
                    console.warn("click: ", evt);
                    var target = evt.currentTarget;
                    var id = target.getAttribute("data-asset-id");
                    var type = target.getAttribute("data-asset-type");
                    console.warn(type, " clicked with id: ", id);
                    
                    component.set("v.selected_id", id);
                    
                    if (type === 'dashboards' && id !== null) {
	                    var viewer = component.find('dashboardViewer');
    					viewer.showDashboard(id);                    
                    }                    
                }
*/                
                cell = self.createCell(component, asset, "label")
                row.appendChild(cell);
                
                cell = self.createCell(component, asset, "name")
                row.appendChild(cell);
                
                cell = self.createCell(component, asset, "id")
                row.appendChild(cell);
                
                if (type === 'dashboards') {
                    var actions = {
                        'View': 'viewDashboard',
                        'Describe': 'describeDashboard'
                    };
                    cell = self.createActionsCell(component, asset, actions);
	                row.appendChild(cell);
                }
                   
                tbody .appendChild(row);
            }                      	
        });
    },
    
    viewDashboard: function(component, type, id) {
        console.warn('viewDashboard: ', type, id);
        if (type === 'dashboard' && id !== null) {
            var viewer = component.find('dashboardViewer');
            if (viewer) {
    	        viewer.showDashboard(id);                    	                
            }
            var evt = $A.get("e.c:showDashboard");
            console.warn('evt: ', evt);
            evt.setParams({dashboardId: id});
            evt.fire();
        }
    },
    
    describeDashboard: function(component, type, id) {
        console.warn('describeDashboard: ', type, id);
        
        var proxy = component.find('proxy');
        var self = this;
        proxy.getAsset('dashboards', id, function(response) {
            console.warn('dashboard: ', response.body);
            var datasets= response.body.datasets;
            for (var i = 0; i < datasets.length; i++) {
                console.warn('----------------------------------- dataset: ', datasets[i].id);
                proxy.getAsset('datasets', datasets[i].id, function(response) {
                    console.warn('dataset: ', response.body);
                    proxy.getRelativeUrl(response.body.currentVersionUrl, function(response) {
                        console.warn('dataset version: ', response.body); 
                    });
                });                
            }
        });
        
    }
    
})