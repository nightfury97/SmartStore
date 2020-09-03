import {Router} from "express";
import multer from 'multer';
import fs from 'fs';
const Express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var mqtt = require('mqtt');
//var client  = mqtt.connect('mqtt://192.168.43.250');

const router = Router();
router.get('/', function (req, res) {
    console.log("get data"+req.query.cartID);
    // client.on('connect', function () {
    //     setInterval(function() {
    //         client.publish('myTopic2', req.query.data);
    //         console.log('Message Sent');
    //     }, 5000);
    // });
    var sql = require("mssql");
    var config = {
        user: 'sa',
        password: '123456',
        server: "localhost", 
        database: 'NCKH' 
    };
    sql.connect(config).then(pool => {
    
        // Stored procedure
        console.log("result")
        return pool.request()
            // .input('input_parameter', sql.NChar, value)              
            // .query('select * from Cart')
            .query('SELECT dbo.GetCart('+req.query.cartID+') as cart')
    }).then(result => {
        console.log(JSON.stringify(result.recordset[0].cart) )
        res.status(200).json(result.recordset[0].cart);
        // server.publish({
        //     topic: 'getCart',
        //     payload: JSON.stringify(result.recordset),
        //     qos: 1 // this is important for offline messaging
        //   }, null, function done() {})
    }).catch(err => {
        console.log(err)// ... error checks
    })
})

export default router;