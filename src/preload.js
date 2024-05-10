import { ipcRenderer, contextBridge } from 'electron'

const Datastore = require('@seald-io/nedb')
const db = {
    categories: new Datastore({ filename: 'data/categories.db', autoload: true }),
    records: new Datastore({ filename: 'data/records.db', autoload: true })
};

contextBridge.exposeInMainWorld('frame', {
    closeApp: () => ipcRenderer.send('closeApp'),
    sizeApp: () => ipcRenderer.send('sizeApp'),
    reduceApp: () => ipcRenderer.send('reduceApp'),
    
    findCategories: async () => {
        return await db.categories.findAsync({});
    },

    findRecords: async (minDate, maxDate) => {
        return await db.records.findAsync({$and: [{ date: { $gte: minDate } }, { date: { $lte: maxDate } }]});
    },

    appendRecord: async (data) => {
        return await db.records.insertAsync(data);
    },

    removeRecord: async (recordId) => {
        const { numRemoved } = await db.records.removeAsync({ _id: recordId }, {});

        return numRemoved > 0;
    },

    updateRecord: async (data, recordId) => {
        await db.records.updateAsync({ _id: recordId }, {$set: data}, {upsert: true});
        await db.records.loadDatabase();

        return true;
    }
})
