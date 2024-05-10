import { defineStore } from 'pinia'

export const useRecordStore = defineStore('record', {
    state: () => ({ records: [], categories: {} }),

    actions: {
        async getCategories() {
            try {
                const docs = await window.frame.findCategories();
                docs.forEach(category => {
                    this.categories[category._id] = category;
                });
                
                return true;
            } catch (error) {
                return false;
            }
        },

        async getRecords(minDate, maxDate) {
            try {
                this.records = await window.frame.findRecords(minDate, maxDate);

                return true;
            } catch (error) {
                return false;
            }
        },

        async appendRecord(data, withInsert = true) {
            try {
                const newRecord = await window.frame.appendRecord(data);
                if (withInsert) {
                    this.records.push(newRecord);
                }

                return true;
            } catch (error) {
                return false;
            }
        },

        async removeRecord(recordId) {
            try {
                const isRemoved = await window.frame.removeRecord(recordId);
                if (!isRemoved) {
                    return false;
                }

                const index = this.records.findIndex(element => element._id === recordId)
                if (index !== -1) {
                    this.records.splice(index, 1);
                }

                return true;
            } catch (error) {
                return false;
            }
        },

        async updateRecord(data, recordId) {
            try {
                const isEdited = await window.frame.updateRecord(data, recordId);
                if (!isEdited) {
                    return false;
                }
                

                const index = this.records.findIndex(element => element._id === recordId)
                if (index !== -1) {
                    data._id = recordId;
                    this.records[index] = data;
                }

                return true;
            } catch (error) {
                console.log(error)
                return false;
            }
        }
    }
})
