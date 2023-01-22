public with sharing class CustomHierarchyDataService {
    @AuraEnabled(cacheable=true)
    public static List<Department__c> getRecords(String obj, String filterField, String filterFieldValue, String lookupField){
        try {
            List<Custom_Hierarchy_Setting__mdt> custHierSetting = getCustomHierarchySettings(obj);

            Set<String> fields = new Set<String>();

            for(Custom_Hierarchy_Setting__mdt setting : custHierSetting) {
                fields.add(setting.fieldName__c);
            }
            fields.add(lookupField);

            String joinedFields = String.join(new List<String>(fields), ', ');
            String query = 'SELECT Id, ' + joinedFields + ' FROM ' + obj + ' WHERE ' + filterField + ' = :filterFieldValue'; 
            System.debug(query);

            List<sObject> records = Database.query(query);
            System.debug(records);

            List<Department__c> departments = [
                SELECT Id, Name, Number_of_Employees__c, Phone__c, Point_of_Contact__c, Parent_Department__c 
                FROM Department__c
                WHERE Account__c = :filterFieldValue
            ];
            return departments;
        } catch (Exception e) {
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Custom_Hierarchy_Setting__mdt> getCustomHierarchySettings(String obj){
        try {
            Custom_Hierarchy_Setting__mdt[] custHierSetting = [SELECT label__c, type__c, fieldName__c FROM Custom_Hierarchy_Setting__mdt WHERE object__c = :obj];
            return custHierSetting;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}