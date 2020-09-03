import {Router} from "express";
import multer from 'multer';
import fs from 'fs';
const Express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const Storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'images/')
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`)
    },
  })
  
const upload = multer({ storage: Storage })
const router = Router();

router.post('/image', upload.array('image', 3), (req, res,next) => {
    console.log('file', req.files);
    console.log('body 2', req.body.top_left);
    console.log('body', JSON.stringify(req.body));
    console.log('rectangleCoordinates',JSON.stringify(req.body.rectangleCoordinates));

    
    var obj = new Object();
    obj.name = "SER JoDS Lila eeY";
    obj.email = "ansad@uic.edu";
    obj.mobile_number = "12312211";
    obj.skills =["Testing", "System", "Lean", "Analysis", "Reports", "Training", "P", "Email", "Writing", "Cad", "Modeling", "Automation", "Architecture", "Assembly", "Mobile", "Electrical", "Autocad", "Programming", "Process", "Interactive", "Engineering", "Solidworks", "Robot", "Fabrication", "Experiments", "Matlab", "Electronics", "C++", "Troubleshooting", "Design", "Pendulum", "Sales", "Coding", "Python", "Technical", "Visual", "Administration", "C", "Excel", "Powerpoint", "Research", "Hardware", "Regulations", "Controls"];
    obj.college_name = "ACS";
    obj.degree = "ACS";
    obj.designation = ["Mechanical Design Manufacturing Electrical"];
    obj.experience = "sxcxzcxzczxczczxcz";
    obj.company_names = ["Engineer Intern Servotech Inc, United States May 2019"];
    obj.no_of_pages = null;
    obj.total_experience = "10000";

   
    var data = JSON.stringify(obj)
    console.log(data);
    res.status(200).json({
      data
    });
    next();
})

export default router;