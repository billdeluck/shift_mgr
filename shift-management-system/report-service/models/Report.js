// report-service/models/Report.js
import dbModule from '../db.js';
const { getDb, setDb } = dbModule;

  class Report {
     constructor(reportType, generatedAt, data) {
        this.id = this.generateId();
        this.reportType = reportType;
         this.generatedAt = generatedAt;
         this.data = data;
      }
     generateId() {
       const db = getDb();
       const reports = db.reports || [];
         if (reports.length === 0) {
            return 1;
          }
        const maxId = Math.max(...reports.map((report) => report.id));
       return maxId + 1;
      }

      static async create(report) {
          const db = getDb();
          const reports = db.reports || [];
        const newReport = new Report(report.reportType, report.generatedAt, report.data);
        reports.push(newReport);
          setDb({ reports });
        return newReport;
      }
      static async findOne(condition){
          const db = getDb();
            const reports = db.reports || [];
          return reports.find(report => {
            for (const key in condition){
                if(report[key] !== condition[key]){
                  return false;
                }
           }
              return true
         });
       }
        static async findAll() {
        const db = getDb();
          return db.reports || [];
       }
     static async findById(id) {
         const db = getDb();
           const reports = db.reports || [];
          return reports.find(report => report.id === parseInt(id));
      }
 }
   export default Report;