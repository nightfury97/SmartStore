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
    console.log(req.query.cartid);

    var sql = require("mssql");
    var config = {
        user: 'sa',
        password: '123456',
        server: 'localhost', 
        database: 'NCKH' 
    };
    sql.connect(config).then(pool => {
    
        // Stored procedure
        console.log("result")
        return pool.request()
            // .input('input_parameter', sql.NChar, value)              
            // .query('select * from Cart')
            .query("declare @out1 int exec CheckOut @cartid="+req.query.cartid+",@out= @out1 output  select @out1 as total")
    }).then(result => {   
            var data =result.recordset[0].total;
            console.log(data )
            client.publish('checkout',JSON.stringify(data));
            client.on('connect', function () {
                client.publish('checkout',JSON.stringify(data));
                console.log('Message Sent '+data);
            });
            res.status(200).json(result.recordset[0].total);
    }).catch(err => {
        console.log(err)// ... error checks
    })
    // sql.disconnect();
   
  })

export default router;