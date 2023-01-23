/*******************************************************************************************
* @Name         CustomHierarchyDataService 
* @Author       Kimberly Small
* @Date         01/22/2023
* @Description  This class contains all test methods for the CustomHierarchyDataService class.
*******************************************************************************************/
@isTest
private class CustomHierarchyDataServiceTest {
    /**
     * @description test the getRecords method from the CustomHierarchyDataService class
     */
     @IsTest static void testGetRecords(){
        Account acc = new Account(Name = 'Edge Communications');
        insert acc;

        Contact parentContact = TestDataFactory.createContact('John', 'Doe', 'john.doe@test.com', acc.Id, null);
        insert parentContact;

        Contact childContact = TestDataFactory.createContact('Sally', 'Smith', 'sally.smith@test.com', acc.Id, parentContact.Id);
        insert childContact;

        List<sObject> records = new List<sObject>();

        Test.startTest();
        records = CustomHierarchyDataService.getRecords('Contact', 'AccountId', parentContact.AccountId, 'ReportsToId');
        Test.stopTest();
        
        System.assertEquals(2, records.size());
    }

    /**
     * @description test the getCustomHierarchySettings method from the CustomHierarchyDataService class
     */
    @IsTest static void testGetCustomHierarchySettings(){
        List<Custom_Hierarchy_Setting__mdt> custHierSetting = new List<Custom_Hierarchy_Setting__mdt>();

        Test.startTest();
        custHierSetting = CustomHierarchyDataService.getCustomHierarchySettings('Contact');
        Test.stopTest();
        
        System.assertEquals(3, custHierSetting.size());
    }
}