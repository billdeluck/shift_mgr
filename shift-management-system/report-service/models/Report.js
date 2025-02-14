// report-service/models/Report.js
import { getDb, setDb, saveData } from '../db.js';

class Report {
    constructor(reportType, generatedAt, data) {
        this.id = this.generateId();
        this.reportType = reportType;
        this.generatedAt = generatedAt;
        this.data = data; // Raw data for the report. Consider serializing/stringifying if large
    }

    generateId() {
        const db = getDb();
        const reports = db.reports || [];
        return reports.length === 0 ? 1 : Math.max(...reports.map(report => report.id)) + 1;
    }

    static async create(reportData) {
        const db = getDb();
        const newReport = new Report(
            reportData.reportType,
            reportData.generatedAt,
            reportData.data // The raw data for the report
        );
        db.reports.push(newReport);
        setDb(db); // Update in-memory db.
        await saveData(); // Persist to disk.
        return newReport;
    }

    static async findOne(condition) {
        const db = getDb();
        return db.reports.find(report =>
            Object.keys(condition).every(key => report[key] === condition[key])
        );
    }

    static async findAll() {
        return getDb().reports || [];
    }

    static async findById(id) {
        const db = getDb();
        return db.reports.find(report => report.id === parseInt(id));
    }

    static async find(criteria) {
        const db = getDb();
        return db.reports.filter(report =>
            Object.keys(criteria).every(key =>
                criteria[key] === report[key]
            )
        );
    }
}

export default Report;
/*
// report-service/models/Report.js
import { getDb, setDb, saveData } from '../db.js';

class Report {
    constructor(reportType, generatedAt, data) {
        this.id = this.generateId();
        this.reportType = reportType;
        this.generatedAt = generatedAt;
        this.data = data; // Raw data for the report. Consider serializing/stringifying if large
    }

    generateId() {
        const db = getDb();
        const reports = db.reports || [];
        return reports.length === 0 ? 1 : Math.max(...reports.map(report => report.id)) + 1;
    }

    static async create(reportData) {
        const db = getDb();
        const newReport = new Report(
            reportData.reportType,
            reportData.generatedAt,
            reportData.data // The raw data for the report
        );
        db.reports.push(newReport);
        setDb(db); // Update in-memory db.
        await saveData(); // Persist to disk.
        return newReport;
    }

    static async findOne(condition) {
        const db = getDb();
        return db.reports.find(report =>
            Object.keys(condition).every(key => report[key] === condition[key])
        );
    }

    static async findAll() {
        return getDb().reports || [];
    }

    static async findById(id) {
        const db = getDb();
        return db.reports.find(report => report.id === parseInt(id));
    }

    static async find(criteria) {
        const db = getDb();
        return db.reports.filter(report =>
            Object.keys(criteria).every(key =>
                criteria[key] === report[key]
            )
        );
    }
}

export default Report;*/