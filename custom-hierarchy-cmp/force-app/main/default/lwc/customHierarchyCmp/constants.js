export const FIELDS = ['Department__c.Account__c'];

export const GRID_COLUMNS = [
    {
        type: 'text',
        fieldName: 'Name',
        label: 'Name',
        initialWidth: 300,
    },
    {
        type: 'number',
        fieldName: 'Number_of_Employees__c',
        label: 'Number of Employees',
    },
    {
        type: 'phone',
        fieldName: 'Phone__c',
        label: 'Phone Number',
    },
    {
        type: 'text',
        fieldName: 'Point_of_Contact__c',
        label: 'Point of Contact',
    },
];

