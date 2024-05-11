import { defineStore } from 'pinia'

export const useRecordStore = defineStore('record', {
    state: () => ({ 
        records: [], 
        categories: {}, 
        monthlyRevenue: 0, 
        monthlyExpense: 0, 
        startingSold: 0, endingSold: 0 
    }),

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

        async getStartingSold(maxDate) {
            try {
                this.startingSold = await window.frame.findSold(maxDate);
                return true;
            } catch (error) {
                return false;
            }
        },

        async getRecords(minDate, maxDate) {
            try {
                this.monthlyRevenue = 0;
                this.monthlyExpense = 0;
                this.endingSold = this.startingSold;

                this.records = await window.frame.findRecords(minDate, maxDate);

                for (let i = 0; i < this.records.length; i++) {
                    const record = this.records[i];
                    const amount = parseFloat(record.amount)
                    if (isNaN(amount)) {
                        continue;
                    }

                    this.endingSold = (this.endingSold + amount);
                    this.records[i].sold = this.endingSold;

                    if (amount < 0) {
                        this.monthlyExpense+= amount;
                    } else {
                        this.monthlyRevenue+= amount;
                    }
                }

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
