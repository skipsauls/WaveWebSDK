@isTest(SeeAllData=true)
private class ListViewControllerTest {
    static testMethod void validateGetRecords() {
        List<SObject> recs1 = [SELECT Id, Name FROM Opportunity];
        
        String query = 'SELECT Id, Name FROM Opportunity';
        
        List<SObject> recs2 = ListViewController.getRecords(query);
        
        System.assertEquals(recs1.get(0).Id, recs2.get(0).Id);
    }
}