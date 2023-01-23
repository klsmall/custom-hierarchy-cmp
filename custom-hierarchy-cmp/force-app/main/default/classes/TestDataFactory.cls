/*******************************************************************************************
* @Name         TestDataFactory 
* @Author       Kimberly Small
* @Date         01/22/2023
* @Description  This class contains all data creation methods for test classes.
*******************************************************************************************/
@isTest
public with sharing class TestDataFactory {
    /**
     * @description create contact records
     */
    public static Contact createContact (String firstName, String lastName, String email, String accId, String reportsToId) {
        Contact contact = new Contact(
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            AccountId = accId,
            ReportsToId = reportsToId
        );

        return contact;
    }
}