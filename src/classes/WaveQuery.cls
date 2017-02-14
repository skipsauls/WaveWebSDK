global class WaveQuery {

    @InvocableVariable(label='Opp Id' required=true)
    public Id oppId;
        
    @InvocableMethod
    global static void updateOpportunity(List<Opportunity> opps) {
        System.debug(LoggingLevel.Info, 'before doUpdateOpportunity');
        WaveCallout.doUpdateOpportunity(opps[0].Id);
        System.debug(LoggingLevel.Info, 'after doUpdateOpportunity');
    }
}