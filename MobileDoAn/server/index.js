import express from "express";
import cors from "cors";
const config = require('./config');
const bodyParser = require('body-parser');
import {UploadService, Momo,ServeImageService,MobileUploadService,CheckIn,CheckOut,Login,GetCart} from "./services";



// const config2 = { database: {   file: "../server/node-server/db/data.db"}}


/*  We create a global db variable because it needs to be referenced by the handlers.
    This is not ideal but, I couldn't figure out how to inject it and use the swagger-routes
    to automatically generate handlers.
 */
// const db = require('../server/node-server/db/sqlite');
// db.open(config2);

global.mqtt = require('./mqtt.js');
mqtt.configure(config);
mqtt.start();

const APP = express();

APP.use([
    bodyParser.json(),
    bodyParser.urlencoded({
        extended: true,
    })
]);

APP.get('/', (req, res) => {
    // res.json({status: true});
    res.status(200).send('You can post to /api/imageMobile.')
});


// APP.use("/api/upload", UploadService);
APP.use("/api/view-image", ServeImageService);
APP.use("/api/imageMobile", MobileUploadService);
APP.use("/api/checkin", CheckIn);
APP.use("/api/checkout", CheckOut);
APP.use("/api/login", Login);
APP.use("/api/getcart", GetCart);


APP.use("/api/momo", Momo);

APP.listen(8082, () => {
    console.log('SERVER IS LISTENING AT PORT 8082');
});


