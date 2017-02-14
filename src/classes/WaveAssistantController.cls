@RestResource(urlMapping='/WaveAssistant/*')
global with sharing class WaveAssistantController {

    /*
     * Need to determine if one message per user per session works, or should it be per request or something else?
     */
    global static WaveMessage__c getMessageForUserSession() {
        Id userId = UserInfo.getUserId();
        Id sessionId = UserInfo.getSessionId();
        WaveMessage__c wm = [SELECT Id, Name, Owner.Id, Sender__c, Recipient__c, Topic__c, Payload__c, Index__c FROM WaveMessage__c WHERE Owner.Id =: userId AND SessionId__c =: sessionId];
        if (wm == null) {
            wm = new WaveMessage__c();
            wm.SessionId__c = sessionId;
            wm.Name = UserInfo.getUserName() + ' Session';
        }
        
        return wm;
        
    }

    /*
     These appear to be behind a perm, profile, etc.?
    public List<Lens> Dashboards {get;set;}
    
    public void foo() {
        Dashboards = [SELECT Id,FolderId,MasterLabel,NamespacePrefix,DeveloperName,Type,VisualizationType,Description FROM Lens WHERE Type = 'dashboard'];
    }
    */
    
    @HttpPost
    global static String applyFilter(String dashboardId, String filter) {
        WaveMessage__c wm = getMessageForUserSession();
        //wm.Recipient__c = 
        
        return '';
    }
    
    
    public static String getDashboardIdByLabel(String label) {
    
        System.debug('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ getDashbaordIdByLabel: ' + label);
        
        String dashboardsJson = getAssets('dashboards');
        
        JSONParser parser = JSON.createParser(dashboardsJson);
        JSONToken token = null;
        
        List<Map<String, String>> dashboards = new List<Map<String, String>>();
        
        while (parser.nextToken() != null) {
            if ((parser.getCurrentToken() == JSONToken.FIELD_NAME)) {
                String fieldName = parser.getText();
                parser.nextToken();
                if (fieldName == 'action') {
                    //action = parser.getText();
                } else if (fieldName == 'responseId') {
                    //responseId = parser.getText();
                } else if (fieldName == 'query') {
                    //query = parser.getText();                    
                } else if (fieldName == 'responseTime') {
                    //responseTime = parser.getIntegerValue();
                } else if (fieldName == 'dashboards') {
                    Map<String, String> dashboard = null;

                    token = parser.nextToken();
                    fieldName = parser.getText();
                    //if (fieldName == 'records') {
                    //    parser.nextToken();
                        
                        if (parser.getCurrentToken() == JSONToken.START_ARRAY){
                            while (parser.nextToken() != null){
                                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                                    dashboard = new Map<String, String>();
                                    String fname;
                                    String val;
                                    while (parser.nextToken() != null) {
                                        if ((parser.getCurrentToken() == JSONToken.FIELD_NAME)) {
                                            fname = parser.getText();
                                            parser.nextToken();
                                            val = parser.getText();
                                            //record.fields.put(fname, val);
                                            dashboard.put(fname, val);
                                            
                                        } else if (parser.getCurrentToken() == JSONToken.END_OBJECT) {
                                            dashboards.add(dashboard);
                                            break;
                                        }
                                    }
                                } else if (parser.getCurrentToken() == JSONToken.END_ARRAY){
                                    break;  
                                }
                            }
                        }                        
                    //}                                        
                }
            }       
        }        
        
    
        return '';
    }
    
    public static String getAssets(String type) {
        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();
        String url =  salesforceHost + '/services/data/v39.0/wave/' + type;
                
        HttpRequest req = new HttpRequest();
                    
        req.setMethod('GET');
        req.setEndpoint(url);
        req.setHeader('Content-type', 'application/json');
        req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());                 
        
        Http http = new Http();

        HTTPResponse res = http.send(req);

        String resp = res.getBody();

        System.debug('----------------------------> Assets JSON: ' + resp);
        
        return resp;
    }
        
}