@RestResource(urlMapping='/pushevents/*')
global with sharing class PushEventController {

    /*
     * Need to determine if one message per user per session works, or should it be per request or something else?
     */
    global static PushEvent__c getPushEventForUserSession(String namespace, String name) {
        Id userId = UserInfo.getUserId();
        String sessionId = userId + '_' + name + '_' + namespace; //UserInfo.getSessionId();
        List<PushEvent__c> lpe = [SELECT Id, Name, Owner.Id, Namespace__c, Index__c, Payload__c, ExtPayload__c, UseServer__c, SessionId__c FROM PushEvent__c WHERE Owner.Id =: userId AND SessionId__c =: sessionId];
        PushEvent__c pe = null;
        if (lpe.isEmpty()) {
            pe = new PushEvent__c();
            pe.SessionId__c = sessionId;
            pe.Index__c = 1;
        } else {
            pe = lpe[0];
            pe.Index__c = pe.Index__c != null ? pe.Index__c + 1 : 1;
        }
        
        
        return pe;
    }

    
    @HttpPost
    global static void postEvent(String namespace, String name, String payload, String extPayload, Boolean useServer) {
    
        RestRequest rreq = RestContext.request;
        RestResponse rres = Restcontext.response;
        
        rres.addHeader('Content-Type', 'application/json');        
        
        String uri = rreq.requestURI;    
        PushEvent__c pe = getPushEventForUserSession(namespace, name);
        pe.Namespace__c = namespace;
        pe.Name = name;
        pe.Payload__c = payload;
        pe.ExtPayload__c = extPayload;
        pe.UseServer__c = useServer != null ? useServer : false;
        
        upsert pe;
        
        
        rres.responseBody = Blob.valueOf('{"Status: "Success", "Id: "' + pe.Id + '", "Index": ' + pe.Index__c + ', "Name: "' + pe.Name + '", "Namespace: "' + pe.Namespace__c + '"}');

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