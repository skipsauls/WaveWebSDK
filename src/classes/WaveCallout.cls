global class WaveCallout {

    @Future(callout=true)
    global static void doUpdateOpportunity(Id id) {
        
        
        String q = 'q = load "0Fb0M000000DStKSAW/0Fc0M000000DwP6SAK";';
        q += 'q = group q by (\'AccountId.Name\', \'Name\');';
        q += 'q = foreach q generate \'AccountId.Name\' as \'Account Name\', \'Name\' as \'Name\', max(\'Amount\') as \'max_Amount\';';
        q += 'q = order q by (\'Account Name\' asc, \'Name\' asc);';
        q += 'q = limit q 2000;';
        
                
        String result = Wave.Query.execute(q);

        JSONParser parser = JSON.createParser(result);
        JSONToken token = null;
        
        List<Map<String, String>> records = new List<Map<String, String>>();
        
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
                } else if (fieldName == 'results') {
                    Map<String, String> record = null;

                    token = parser.nextToken();
                    fieldName = parser.getText();
                    if (fieldName == 'records') {
                        parser.nextToken();
                        
                        if (parser.getCurrentToken() == JSONToken.START_ARRAY){
                            while (parser.nextToken() != null){
                                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                                    record = new Map<String, String>();
                                    String fname;
                                    String val;
                                    while (parser.nextToken() != null) {
                                        if ((parser.getCurrentToken() == JSONToken.FIELD_NAME)) {
                                            fname = parser.getText();
                                            parser.nextToken();
                                            val = parser.getText();
                                            record.put(fname, val);
                                            
                                        } else if (parser.getCurrentToken() == JSONToken.END_OBJECT) {
                                            records.add(record);
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
        }
        
        Opportunity opp = [SELECT Account.Name, Amount, Description, Suggested_Discount__c FROM Opportunity WHERE ID =: id];                                
        Account acct = [SELECT Global_Discount__c FROM Account WHERE Name =: opp.Account.Name];
        
        for (Map<String, String> record : records) {
            System.debug(LoggingLevel.Info, 'Record:' + record);
            if (Decimal.valueOf(record.get('max_Amount')) >= opp.Amount) {
                //opp.Description = 'This is not the biggest opportunity';
                acct.Global_Discount__c = 10;
            } else {
                //opp.Description = 'This is the biggest opportunity';
                acct.Global_Discount__c = 20;
            }
        }
                
        update acct;
    }
}