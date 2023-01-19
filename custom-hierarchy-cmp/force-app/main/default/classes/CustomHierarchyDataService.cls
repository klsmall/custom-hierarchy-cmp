public with sharing class CustomHierarchyDataService {
    @AuraEnabled(cacheable=true)
    public static List<Department__c> getDepartments(String accountId){
        try {
            List<Department__c> departments = [
                SELECT Id, Name, Number_of_Employees__c, Phone__c, Point_of_Contact__c, Parent_Department__c 
                FROM Department__c
                WHERE Account__c = :accountId
            ];
            return departments;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
}