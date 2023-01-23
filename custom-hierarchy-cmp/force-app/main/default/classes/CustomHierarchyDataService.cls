public with sharing class CustomHierarchyDataService {
    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords(String obj, String filterField, String filterFieldValue, String lookupField){
        try {
            List<Custom_Hierarchy_Setting__mdt> custHierSetting = getCustomHierarchySettings(obj);

            Set<String> fields = new Set<String>();

            for(Custom_Hierarchy_Setting__mdt setting : custHierSetting) {
                fields.add(setting.fieldName__c);
            }
            fields.add(lookupField);

            String joinedFields = String.join(new List<String>(fields), ', ');
            String query = 'SELECT Id, ' + joinedFields + ' FROM ' + obj; 
            
            if(String.isNotEmpty(filterField)) {
                query += ' WHERE ' + filterField + ' = :filterFieldValue';
            }

            query += ' WITH SECURITY_ENFORCED';

            List<sObject> records = Database.query(query);

            return records;
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