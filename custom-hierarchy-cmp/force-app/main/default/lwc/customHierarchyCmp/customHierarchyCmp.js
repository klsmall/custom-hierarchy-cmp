/**** import modules ****/
import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';

import getRecords from '@salesforce/apex/CustomHierarchyDataService.getRecords';
import getCustomHierarchySettings from '@salesforce/apex/CustomHierarchyDataService.getCustomHierarchySettings';

export default class CustomHierarchyCmp extends LightningElement {
    /**** class properties ****/
    @api recordId; // id of the current record
    @api header; // header for the component
    @api obj; // object the hierarchy should be applied to 
    @api lookupField; // lookup field on the object the hierarchy should be applied to 
    @api filterField; // filter field on the object the hierarchy should be applied to 

    gridColumns = ''; // definition of columns for the tree grid
    gridData = []; // data provided to the tree grid
    filterFieldValue = ''; // filter value from current record 
    error; // holds error information

    /**
     * @description automatically expand the tree grid when the component is rendered
     */
    renderedCallback() {
        const grid =  this.template.querySelector( 'lightning-tree-grid' );
        grid.expandAll();
    }

    /**
     * @description retrieve the filter value from current record 
     * @param recordId id of the current record
     * @param fields field that should be retrieved from the current record
     */
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

    /**
     * @description dynamically get fields based on values provided by the user
     */
    get fields() {
        return this.obj + '.' + this.filterField;
    }

    /**
     * @description retrieve records required to build the hierarchy based on values provided by the user
     * @param obj object records should be pulled from
     * @param filterField field used to filter and limit the amount of records returned
     * @param filterFieldValue value from the current record that should be used for filtering
     * @param lookupField lookup field used to build the hierarchy 
     */
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

            //add child records to the parent records
            records.forEach((record) => {
                let children = records.filter(child => record.Id == child[this.lookupField]);
                if (children.length > 0) {
                    record._children = children;
                }
            });
            
            //get hierarchy for the current record
            hierarchy = records.filter(record => record.Id == this.recordId);
            
            this.gridData = hierarchy;
        }
    }

    /**
     * @description retrieve custom metadata settings to populate tree-grid columns
     * @param obj object the custom metadata settings should be pulled for
     */
    @wire(getCustomHierarchySettings, {obj: '$obj'})
    wiredCustHierSetting({error, data}) {
        if(error) {
            this.error = error;
            console.log(error);
        }
        else if(data) {
            let custHierSetting = JSON.parse( JSON.stringify( data ) );
            let columns = [];
            
            //construct the column format needed for the tree-grid 
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