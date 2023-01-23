/*******************************************************************************************
* @Name         CustomHierarchyDataService 
* @Author       Kimberly Small
* @Date         01/22/2023
* @Description  This class contains all data service methods for customHierarchyCmp.
*******************************************************************************************/
public with sharing class CustomHierarchyDataService {

    /**
     * @description retrieve records required to build the hierarchy based on values provided by the user
     * @param obj object records should be pulled from
     * @param filterField field used to filter and limit the amount of records returned
     * @param filterFieldValue value from the current record that should be used for filtering
     * @param lookupField lookup field used to build the hierarchy 
     */
    @AuraEnabled(cacheable=true)
    public static List<sObject> getRecords(String obj, String filterField, String filterFieldValue, String lookupField){
        try {
            //use the fields defined in the custom hierarchy settings to build the query
            List<Custom_Hierarchy_Setting__mdt> custHierSetting = getCustomHierarchySettings(obj);

            Set<String> fields = new Set<String>();

            //add the fields to a set, ensuring no duplicate fields
            for(Custom_Hierarchy_Setting__mdt setting : custHierSetting) {
                fields.add(setting.fieldName__c);
            }
            fields.add(lookupField);

            String joinedFields = String.join(new List<String>(fields), ', ');
            String query = 'SELECT Id, ' + joinedFields + ' FROM ' + obj; 
            
            //make filter field optional
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

    /**
     * @description retrieve custom metadata settings to populate tree-grid columns
     * @param obj object the custom metadata settings should be pulled for
     */
    @AuraEnabled(cacheable=true) @TestVisible
    public static List<Custom_Hierarchy_Setting__mdt> getCustomHierarchySettings(String obj){
        try {
            Custom_Hierarchy_Setting__mdt[] custHierSetting = [SELECT label__c, type__c, fieldName__c FROM Custom_Hierarchy_Setting__mdt WHERE object__c = :obj];
            return custHierSetting;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}