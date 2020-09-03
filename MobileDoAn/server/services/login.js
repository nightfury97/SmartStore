import {Router} from "express";
import multer from 'multer';
import fs from 'fs';
const Express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const router = Router();
router.get('/', function (req, res) {
    var username =req.query.username;
    var password = req.query.password;
    console.log(username+" "+password);
    var sql = require("mssql");
    var config = {
        user: 'sa',
        password: '123456',
        server: 'localhost', 
        database: 'NCKH' 
    };
    sql.connect(config).then(pool => {
        return pool.request()
            .query("select count(*) as count from Customer where UserName='"+username+"' and Pass='"+password+"'")
    }).then(result => {
        console.log(result.recordset[0].count);
        if(result.recordset[0].count) res.status(200).json({"success":1,"username":username,"password":password});
        else res.status(200).json({"success":0,"username":username,"password":password});

    }).catch(err => {
        console.log(err)// ... error checks
    })
   
  })

export default router;