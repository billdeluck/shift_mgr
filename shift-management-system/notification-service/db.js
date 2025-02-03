// notification-service/db.js
import { promises as fs } from 'fs';
import path from 'path';

const __dirname = path.resolve();
const dataFilePath = path.join(__dirname, 'data.json');
let db = {};

async function loadData() {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        db = JSON.parse(fileData);
        console.log('data.json loaded');
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('data.json does not exist. Initialising with empty JSON.');
            db = { notifications: [] };
            await saveData();
        } else {
            console.log(`error reading json: ${error}`);
        }
    }
}

async function saveData() {
    try {
        await fs.writeFile(dataFilePath, JSON.stringify(db, null, 2), "utf-8");
        console.log('data.json saved');
    } catch (error) {
        console.log(`error saving json: ${error}`);
    }
}

const dbModule = {
    getDb: () => db,
    setDb: (newDb) => {
        db = newDb;
        saveData();
    }
};

loadData();

export default dbModule;