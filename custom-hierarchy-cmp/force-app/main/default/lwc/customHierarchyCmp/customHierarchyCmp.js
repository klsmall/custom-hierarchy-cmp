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

    renderedCallback() {
        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.expandAll();
    }

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
            let departments = JSON.parse( JSON.stringify( data ) );
            let hierarchy = [];

            departments.forEach((dept) => {
                let children = departments.filter(child => dept.Id == child.Parent_Department__c);
                if (children.length > 0) {
                    dept._children = children;
                }
            })
            
            hierarchy = departments.filter(dept => dept.Id == this.recordId);
            
            this.gridData = hierarchy;
        }
    }
}
