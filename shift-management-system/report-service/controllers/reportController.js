// report-service/controllers/reportController.js
import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import Report from '../models/Report.js'; // Import the Report model!

dotenv.config();

// Helper function to fetch data from other services
async function fetchData(url, token) {
    console.log("Fetching URL:", url);
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}: ${response.status} ${await response.text()}`);
    }
    return await response.json();
}

// Generate Report
export const generateReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { reportType, startDate, endDate, userId, format } = req.body;
    const token = req.header("Authorization").split(" ")[1];

    try {
        let reportData;
        let fileNameBase = `report-${reportType}-${startDate}-${endDate}`;
        if (userId) {
            fileNameBase += `-user${userId}`;
        }

        if (reportType === 'shiftEvents') {
            // Example: Fetch all events within the date range
            const events = await fetchData(`${process.env.EVENT_SERVICE_URL}/api/events`, token);

            // Filter events by date range and optionally by userId
            reportData = events.filter(event => {
                const eventDate = new Date(event.timestamp);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return eventDate >= start &&
                    eventDate <= end &&
                    (userId ? event.userId === parseInt(userId) : true);
            });
            //transform data
            reportData = reportData.map(item => {
                return {
                    id: item.id,
                    type: item.type,
                    userId: item.userId,
                    shiftId: item.shiftId,
                    timestamp: item.timestamp
                }
            })

        } else if (reportType === 'users') {
            reportData = await fetchData(`${process.env.USER_SERVICE_URL}/api/users`, token);
        } else if (reportType === 'shifts') {
            reportData = await fetchData(`${process.env.SHIFT_SERVICE_URL}/api/shifts`, token);
        }
        else {
            return res.status(400).json({ error: 'Invalid report type' });
        }

        // Create the report in the database
        const newReport = await Report.create({
            reportType: reportType,
            generatedAt: new Date(),
            data: reportData // Store raw report data
        });

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=${fileNameBase}.json`);
            res.status(200).json(reportData);
        } else if (format === 'csv') {
            stringify(reportData, { header: true }, (err, output) => {
                if (err) throw err;
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=${fileNameBase}.csv`);
                res.status(200).send(output);
            });
        } else if (format === 'pdf') {
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${fileNameBase}.pdf`);
            doc.pipe(res);

            // Add content to the PDF
            doc.fontSize(12).text(`Report Type: ${reportType}`, { align: 'center' });
            doc.text(`Date Range: ${startDate} - ${endDate}`, { align: 'center' });
            if (userId) {
                doc.text(`User ID: ${userId}`, { align: 'center' });
            }
            doc.moveDown();

            // Table Headers (adjust based on report type)
            let headers = [];

            if (reportType === 'shiftEvents') {
                headers = ['ID', 'Type', 'User ID', 'Shift ID', 'Timestamp'];
            }

            if (reportType === 'users') {
                headers = ['ID', 'Fullname', 'Email'];
            }
            if (reportType === 'shifts') {
                headers = ['ID', 'UserId', 'Date', 'Time In', 'Time Out', 'Status'];
            }
            const tableTop = 150;
            const columnWidth = 100;

            doc.font('Helvetica-Bold');
            headers.forEach((header, index) => {
                doc.text(header, 50 + index * columnWidth, tableTop);
            });
            doc.font('Helvetica');

            // Table Rows
            let y = tableTop + 20; // Start position for the first row
            reportData.forEach(item => {
                let values = [];
                if (reportType === 'shiftEvents') {
                    values = [item.id, item.type, item.userId, item.shiftId, item.timestamp];
                }
                if (reportType === 'users') {
                    values = [item.id, item.fullName, item.email];
                }
                if (reportType === 'shifts') {
                    values = [item.id, item.userId, item.date, item.timeIn, item.timeOut, item.status];
                }
                values.forEach((value, index) => {
                    doc.text(String(value), 50 + index * columnWidth, y);
                });
                y += 20; // Move down for the next row
            });
            doc.end();

        } else {
            res.status(400).json({ error: 'Invalid format' });
        }

    } catch (error) {
        console.error("❌ Error generating report:", error);
        res.status(500).json({ error: 'Failed to generate report', message: error.message });
    }
};

//get all reports
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll();
        res.status(200).json(reports);
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Something went wrong", error: e})
    }
}


//get reports by ID
export const getReportsById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        res.status(200).json(report)
    } catch (e) {
        res.status(500).json({message: "Something went wrong", error: e})
    }
}
/*
// report-service/controllers/reportController.js
import PDFDocument from 'pdfkit';
import { stringify } from 'csv-stringify';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import Report from '../models/Report.js'; // Import the Report model!

dotenv.config();

// Helper function to fetch data from other services
async function fetchData(url, token) {
    const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}: ${response.status} ${await response.text()}`);
    }
    return await response.json();
}

// Generate Report
export const generateReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { reportType, startDate, endDate, userId, format } = req.body;
    const token = req.header("Authorization").split(" ")[1];

    try {
        let reportData;
        let fileNameBase = `report-${reportType}-${startDate}-${endDate}`;
        if (userId) {
            fileNameBase += `-user${userId}`;
        }

        if (reportType === 'shiftEvents') {
            // Example: Fetch all events within the date range
            const events = await fetchData(`${process.env.EVENT_SERVICE_URL}/api/events`, token);

            // Filter events by date range and optionally by userId
            reportData = events.filter(event => {
                const eventDate = new Date(event.timestamp);
                const start = new Date(startDate);
                const end = new Date(endDate);
                return eventDate >= start &&
                    eventDate <= end &&
                    (userId ? event.userId === parseInt(userId) : true);
            });
            //transform data
            reportData = reportData.map(item => {
                return {
                    id: item.id,
                    type: item.type,
                    userId: item.userId,
                    shiftId: item.shiftId,
                    timestamp: item.timestamp
                }
            })

        } else if (reportType === 'users') {
            reportData = await fetchData(`${process.env.USER_SERVICE_URL}/api/users`, token);
        } else if (reportType === 'shifts') {
            reportData = await fetchData(`${process.env.SHIFT_SERVICE_URL}/api/shifts`, token);
        }
        else {
            return res.status(400).json({ error: 'Invalid report type' });
        }

        // Create the report in the database
        const newReport = await Report.create({
            reportType: reportType,
            generatedAt: new Date(),
            data: reportData // Store raw report data
        });

        if (format === 'json') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', `attachment; filename=${fileNameBase}.json`);
            res.status(200).json(reportData);
        } else if (format === 'csv') {
            stringify(reportData, { header: true }, (err, output) => {
                if (err) throw err;
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', `attachment; filename=${fileNameBase}.csv`);
                res.status(200).send(output);
            });
        } else if (format === 'pdf') {
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${fileNameBase}.pdf`);
            doc.pipe(res);

            // Add content to the PDF
            doc.fontSize(12).text(`Report Type: ${reportType}`, { align: 'center' });
            doc.text(`Date Range: ${startDate} - ${endDate}`, { align: 'center' });
            if (userId) {
                doc.text(`User ID: ${userId}`, { align: 'center' });
            }
            doc.moveDown();

            // Table Headers (adjust based on report type)
            let headers = [];

            if (reportType === 'shiftEvents') {
                headers = ['ID', 'Type', 'User ID', 'Shift ID', 'Timestamp'];
            }

            if (reportType === 'users') {
                headers = ['ID', 'Fullname', 'Email'];
            }
            if (reportType === 'shifts') {
                headers = ['ID', 'UserId', 'Date', 'Time In', 'Time Out', 'Status'];
            }
            const tableTop = 150;
            const columnWidth = 100;

            doc.font('Helvetica-Bold');
            headers.forEach((header, index) => {
                doc.text(header, 50 + index * columnWidth, tableTop);
            });
            doc.font('Helvetica');

            // Table Rows
            let y = tableTop + 20; // Start position for the first row
            reportData.forEach(item => {
                let values = [];
                if (reportType === 'shiftEvents') {
                    values = [item.id, item.type, item.userId, item.shiftId, item.timestamp];
                }
                if (reportType === 'users') {
                    values = [item.id, item.fullName, item.email];
                }
                if (reportType === 'shifts') {
                    values = [item.id, item.userId, item.date, item.timeIn, item.timeOut, item.status];
                }
                values.forEach((value, index) => {
                    doc.text(String(value), 50 + index * columnWidth, y);
                });
                y += 20; // Move down for the next row
            });
            doc.end();

        } else {
            res.status(400).json({ error: 'Invalid format' });
        }

    } catch (error) {
        console.error("❌ Error generating report:", error);
        res.status(500).json({ error: 'Failed to generate report', message: error.message });
    }
};

//get all reports
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll();
        res.status(200).json(reports);
    } catch (e) {
        console.log(e)
        res.status(500).json({message: "Something went wrong", error: e})
    }
}

//get reports by ID
export const getReportsById = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        res.status(200).json(report)
    } catch (e) {
        res.status(500).json({message: "Something went wrong", error: e})
    }
}
*/