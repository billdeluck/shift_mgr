 // report-service/controllers/reportController.js
 import Report from '../models/Report.js';
  import { validationResult } from 'express-validator';

 export const getAllReports = async (req, res) => {
  try {
        const reports = await Report.findAll();
       res.status(200).json(reports);
      } catch (error) {
       res.status(500).json({ error: 'Error getting reports' });
      }
   };
 export const getReportById = async (req, res) => {
    const errors = validationResult(req);
     if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array()})
      }
     const { id } = req.params
   try {
     const report = await Report.findById(id);
      if(!report){
           return res.status(404).json({error: `Report with id ${id} not found`})
         }
          res.status(200).json(report);
       } catch (error) {
         res.status(500).json({ error: `Error getting report with id ${id}` });
      }
 };
 export const createReport = async (req, res) => {
    const errors = validationResult(req);
   if (!errors.isEmpty()) {
     return res.status(400).json({ errors: errors.array() });
    }
    try{
         const newReport = await Report.create(req.body)
         res.status(201).json(newReport);
     }catch(err){
      console.log(err)
       res.status(500).json({error: "Error creating report"})
    }
 }