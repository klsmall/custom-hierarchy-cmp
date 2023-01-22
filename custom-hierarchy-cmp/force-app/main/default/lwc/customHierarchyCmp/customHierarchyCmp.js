import { LightningElement, wire, api } from 'lwc';
import { FIELDS, GRID_COLUMNS } from './constants.js';

import getRecords from '@salesforce/apex/CustomHierarchyDataService.getRecords';
import { getRecord } from 'lightning/uiRecordApi';

export default class CustomHierarchyCmp extends LightningElement {
    @api recordId;
    @api header;
    @api obj;
    @api lookupField;
    @api filterField;
    

    gridColumns = GRID_COLUMNS; // definition of columns for the tree grid
    gridData = []; // data provided to the tree grid
    filterFieldValue = '';
    error;

    renderedCallback() {
        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.expandAll();
    }

    @wire(getRecord, {recordId: '$recordId', fields: '$fields'})
    wiredRecord({error, data}) {
        if(error) {
            this.error = error;
            console.log(error);
        }
        else if(data) {
            this.filterFieldValue = data.fields[this.filterField].value;
        }
    }

    get fields() {
        return this.obj + '.' + this.filterField;
    }

    @wire(getRecords, {
        obj: '$obj', 
        filterField: '$filterField', 
        filterFieldValue: '$filterFieldValue', 
        lookupField: '$lookupField'
    })
    wiredRecords({error, data}) {
        if(error) {
            this.error = error;
            console.log(error);
        }
        else if(data) {
            let records = JSON.parse( JSON.stringify( data ) );
            let hierarchy = [];

            records.forEach((record) => {
                let children = records.filter(child => record.Id == child[this.lookupField]);
                if (children.length > 0) {
                    record._children = children;
                }
            });
            
            hierarchy = records.filter(record => record.Id == this.recordId);
            
            this.gridData = hierarchy;
        }
    }
}
