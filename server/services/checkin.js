import {Router} from "express";
import multer from 'multer';
import fs from 'fs';
const Express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.43.250');
const router = Router();
router.get('/', function (req, res) {
    console.log("declare @out1 int exec Checkin @username =("+req.query.name+"),@out= @out1 output  select @out1");

    var sql = require("mssql");
    var config = {
        user: 'sa',
        password: '123456',
        server: 'localhost', 
        database: 'NCKH' 
    };
    // sql.connect(config, function (err) {
    
    //     if (err) console.log(err);

    //     // create Request object
    //     var request = new sql.Request();
           
    //     // query to the database and get the records
    //     request.query("insert into CustomerCheckIn(CusId) values ("+req.query.cusid+")", function (err, recordset) {
            
    //         if (err) console.log(err)

    //         // send records as a response
    //         console.log(recordset);
    //         res.status(200).json(recordset);
    //     });
    // });
    sql.connect(config).then(pool => {
    
        // Stored procedure
        console.log("result")
        return pool.request()
            // .input('input_parameter', sql.NChar, value)              
            // .query('select * from Cart')
            .query("declare @out1 int exec Checkin @username ="+req.query.name+",@out= @out1 output  select @out1 as id")
    }).then(result => {
        var data = req.query.name+"-"+result.recordset[0].id;
        console.log(data )
        client.publish('checkin',JSON.stringify(data));
        client.on('connect', function () {
            client.publish('checkin',JSON.stringify(data));
            console.log('Message Sent '+data);
        });
        res.status(200).json(result.recordset[0].id);

    }).catch(err => {
        console.log(err)// ... error checks
    })
    // sql.disconnect();
   
  })

export default router;