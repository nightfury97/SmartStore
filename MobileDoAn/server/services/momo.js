import {Router} from "express";
import multer from 'multer';
import fs from 'fs';
import { json } from "body-parser";
const Express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
var mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.43.250');
const router = Router();
const https = require('https');
const uuidv1 = require('uuid/v1');
router.post('/', function (req, res) {
    // console.log("momo "+JSON.parse(req.body));
    console.log("momo2 "+req.query.phonenumber);
    // var obj = JSON.parse(req.body);
    // console.log("momo "+obj.total);
    var sql = require("mssql");
    var config = {
        user: 'sa',
        password: '123456',
        server: 'localhost', 
        database: 'NCKH' 
    };
    var publickey = 'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAh5ggZmX82UQUiSBIBgs8a8ZopQLQX0aTNuWFMdefF7nL+w4jf4gv+tENr3PkTsrp8ozaAqcUOt22JIbDRNKTb3umMVY8WGuEhpcWx6fMeUVLEemqKuP+DYlBHLk4/4TCkNOOXrIfpFPuwQrX8Jgq8N+NMIQbtBhC37cz1Mxg5qJgJW76HcWfkU0Vabu9ad+seq3SwUCFFOmWpE6+ExbzfhvXyVF01w6OpqYxguHw0EMLT7/xjiPc0+L3MdKGbBjO+6xWgdgjIcxLoiR9dVUb7+vRUEGE2wcx5vgpure3QAf5CGqhOQg2BdIgulAMalzxr5r9/Yr3wgQn5U81sY2M0T+sJcVSPaGz79vypJuzrKfb2xkAD8wZv++YaJ0O6/nJt4K8KRzhfcjEX+2f9Ou7DMx9fp6EvYGJyAiLJLkWFBnk070pQr/LCC/AAV/wFQxq6kDU5iOjiqRJDh3SqlicBjuhTqiy2PDlOl92cmG3gAvy4m2oMCB3bP+h9v1I/g8338nF8A0VGD6SehhJzgVMwYb4jcW2nzr4faBL9MJb+di8yHV/izmYdtGihnkCuZ/PS0nPMmQuDA00T7fDzoaTmKpmE5uL74J7YzvVEJ3FTTLmdc5H7UX2nSjXsG2hawfYH6nO8cQVP4w/OoPUMAIVEnhfxJADuYWJ6xLKhBMb0vsCAwEAAQ=='
    var phonenumber =req.query.phonenumber;
    var fromapp = req.query.fromapp;
    var momoToken = req.query.momoToken.replace(/ /g, '+'); 
    console.log("token="+momoToken);
    var merchantcode = req.query.merchantcode;
    var total = parseInt(req.query.total,10);
    console.log("total="+total);
    var partnerRefId = req.query.partnerRefId;
    const PARTNERCODE = "MOMOBBBL20200403";

    var jsonString = {"partnerCode":PARTNERCODE,"partnerRefId":partnerRefId,"amount":total}
    console.log(JSON.stringify(jsonString));
    const NodeRSA = require('node-rsa');
    const pubKey = '-----BEGIN PUBLIC KEY-----'+publickey+'-----END PUBLIC KEY-----';
    const key = new NodeRSA(pubKey, {encryptionScheme: 'pkcs1'});
 
    const encrypted = key.encrypt(JSON.stringify(jsonString), 'base64');
    console.log('encrypted: ', encrypted);
    var body = JSON.stringify({
      partnerCode : PARTNERCODE,
      customerNumber : phonenumber,
      partnerRefId : uuidv1(),
      appData : momoToken,
      hash : encrypted,
      version: 2,
      payType: 3
  })
  //Create the HTTPS objects
  var options = {
    hostname: 'test-payment.momo.vn',
    port: 443,
    path: '/pay/app',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
   }
  };
  
  //Send the request and get the response
  console.log("Sending....")
  var req2 = https.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (body) => {
      console.log('Body');
      console.log(body);
      console.log('payURL');
      console.log(JSON.parse(body).message);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });
  req2.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
  });
  req2.write(body);
  req2.end();
    res.send({
      status: true,
      message: 'file uploaded',
      // fileNameInServer: newFullPath
  });
  })

export default router;