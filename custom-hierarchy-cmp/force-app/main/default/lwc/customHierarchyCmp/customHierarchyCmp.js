import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

import getRecords from '@salesforce/apex/CustomHierarchyDataService.getRecords';
import getCustomHierarchySettings from '@salesforce/apex/CustomHierarchyDataService.getCustomHierarchySettings';

export default class CustomHierarchyCmp extends LightningElement {
    @api recordId;
    @api header;
    @api obj;
    @api lookupField;
    @api filterField;

    gridColumns = ''; // definition of columns for the tree grid
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

    @wire(getCustomHierarchySettings, {obj: '$obj'})
    wiredCustHierSetting({error, data}) {
        if(error) {
            this.error = error;
            console.log(error);
        }
        else if(data) {
            let custHierSetting = JSON.parse( JSON.stringify( data ) );
            let columns = [];
            
            custHierSetting.forEach((setting) => {
                columns.push({
                    type: setting.type__c, 
                    fieldName: setting.fieldName__c, 
                    label: setting.label__c
                });
            });

            this.gridColumns = columns;
        }
    }
}