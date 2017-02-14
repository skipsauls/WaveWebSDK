global class WaveQueryController {

    @AuraEnabled
    public static String execute(String query) {
        return Wave.Query.execute(query);
    }
}