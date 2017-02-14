global with sharing class ListViewController {

    @AuraEnabled
    public static List<SObject> getRecords(String query) {
        System.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> getRecords: ' + query);
        List<SObject> records = Database.query(query);
        System.debug('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> records.size: ' + records.size());
    
        return records;
    }

}