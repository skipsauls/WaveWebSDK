@RestResource(urlMapping='/waveasset/*')
global with sharing class WaveAssetController {

    global static String getWave(String type, String id) {
        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();
        String url =  salesforceHost + '/services/data/v39.0/wave/' + type;
        url += id != null ? '/' + id : '';
        
        HttpRequest req = new HttpRequest();
                    
        req.setMethod('GET');
        req.setEndpoint(url);
        req.setHeader('Content-type', 'application/json');
        req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());                 
        
        Http http = new Http();

        HTTPResponse res = http.send(req);

        String resp = res.getBody();
        
        return resp;    
    }
    
    @HttpGet
    global static void doGet() {
    
        RestRequest rreq = RestContext.request;
        RestResponse rres = Restcontext.response;
        
        rres.addHeader('Content-Type', 'application/json');        
        
        String uri = rreq.requestURI;
        
        String[] tokens = uri.split('/');
        
        String type = tokens[2];
        
        String id = tokens.size() > 3 ? tokens[3] : null;
                
        
        String resp = getWave(type, id);
        
        if (rreq.params.size() > 0) {
            String assetId = getAssetIdByAttr(type, resp, rreq.params);
            rres.responseBody = Blob.valueOf('{"Id": "' + assetId + '"}');
            
        } else {
        
            rres.responseBody = Blob.valueOf(resp);
        }    
    }
    
    public static String getAssetIdByAttr(String type, String resp, Map<String, String> params) {
    
        JSONParser parser = JSON.createParser(resp);
        JSONToken token = null;
        
        List<Map<String, String>> dashboards = new List<Map<String, String>>();
        
        while (parser.nextToken() != null) {
            if ((parser.getCurrentToken() == JSONToken.FIELD_NAME)) {
                String fieldName = parser.getText();
                parser.nextToken();
                if (fieldName == type) {
                    Map<String, String> dashboard = null;

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
                                        token = parser.getCurrentToken();
                                        if (token == JSONToken.START_OBJECT || token == JSONToken.START_ARRAY) {
                                            parser.skipChildren();
                                        } else if (fname == 'Id' || fname == 'Label' || fname == 'Name') {
                                            val = parser.getText();
                                            dashboard.put(fname, val);                                        
                                        } else {
                                        }
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
                }
            }       
        }        
        
        String dashboardId = null;

        for (Map<String, String> dashboard : dashboards) {
            for (String param: params.keySet()) {
                
                if (dashboard.get(param) == params.get(param)) {
                    dashboardId = dashboard.get('id');
                }
            }
        }


        return dashboardId;
    }    
}