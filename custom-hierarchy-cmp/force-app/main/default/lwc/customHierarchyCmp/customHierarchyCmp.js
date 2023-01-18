import { LightningElement, wire, api } from 'lwc';
import { FIELDS, GRID_COLUMNS } from './constants.js';

import getDepartments from '@salesforce/apex/CustomHierarchyDataService.getDepartments';
import { getRecord } from 'lightning/uiRecordApi';

export default class CustomHierarchyCmp extends LightningElement {
    @api recordId;
    gridColumns = GRID_COLUMNS; // definition of columns for the tree grid
    gridData = []; // data provided to the tree grid
    error;
    department;
    accountId = '';

    @wire(getRecord, {recordId: '$recordId', fields: FIELDS})
    wiredRecord({error, data}) {
        if(error) {
            this.error = error;
            console.log(error);
        }
        else if(data) {
            this.accountId = data.fields.Account__c.value;
        }
    }

    @wire(getDepartments, {accountId: '$accountId'})
    wiredDepartments({error, data}) {
        if(error) {
            this.error = error;
            console.log(error);
        }
        else if(data) {
            this.gridData = JSON.parse( JSON.stringify( data ) );
        }
    }
}
