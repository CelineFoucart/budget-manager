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
    exportToPdf: (filename) => ipcRenderer.send('exportPdf', filename),
    refresh: () => ipcRenderer.send('on-reload'),
    
    findCategories: async () => {
        return await db.categories.findAsync({}).sort({ name: 1 });
    },

    appendCategory: async (data) => {
        return await db.categories.insertAsync(data);
    },

    updateCategory: async (data, categoryId) => {
        await db.categories.updateAsync({ _id: categoryId }, {$set: data}, {upsert: true});
        await db.categories.loadDatabase();

        return true;
    },

    removeCategory: async (categoryId) => {
        const count = await db.records.countAsync({ category: categoryId })

        if (count !== 0) {
            return false;
        }

        await db.categories.removeAsync({ _id: categoryId }, {});
        await db.categories.loadDatabase();

        return true;
    },

    findSold: async (maxDate) => {
        let sold = { total: 0, inBank: 0 };
        const docs = await db.records.findAsync({$and: [{ date: { $lt: maxDate } }]});

        if (docs.length === 0) {
            return sold;
        }

        docs.forEach(record => {
            sold.total += parseFloat(record.amount);
            if (record.isPassed) {
                sold.inBank += parseFloat(record.amount);
            }
        });

        return sold;
    },

    findRecords: async (minDate, maxDate) => {
        return await db.records.findAsync({$and: [{ date: { $gte: minDate } }, { date: { $lte: maxDate } }]}).sort({ date: 1 });
    },

    appendRecord: async (data) => {
        return await db.records.insertAsync(data);
    },

    removeRecord: async (recordId) => {
        await db.records.removeAsync({ _id: recordId }, {});
        await db.records.loadDatabase();

        return true;
    },

    updateRecord: async (data, recordId) => {
        await db.records.updateAsync({ _id: recordId }, {$set: data}, {upsert: true});
        await db.records.loadDatabase();

        return true;
    }
})
