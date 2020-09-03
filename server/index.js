import express from "express";
import cors from "cors";
const config = require('./config');
const bodyParser = require('body-parser');
import {UploadService, ServeImageService,MobileUploadService, CheckIn} from "./services";



// const config2 = { database: {   file: "../server/node-server/db/data.db"}}


/*  We create a global db variable because it needs to be referenced by the handlers.
    This is not ideal but, I couldn't figure out how to inject it and use the swagger-routes
    to automatically generate handlers.
 */
// const db = require('../server/node-server/db/sqlite');
// db.open(config2);



const APP = express();

// Allow REACTApp to access
const corsOptions = {
    origin: ['http://0.0.0.0:8081','http://0.0.0.0:8080'],
    optionsSuccessStatus: 200,
}
APP.use(cors(corsOptions));
APP.use([
    bodyParser.json(),
    bodyParser.urlencoded({
        extended: true,
    })
]);

APP.get('/', (req, res) => {
    // res.json({status: true});
    res.status(200).send('You can post to /api/.')
});
// APP.use("/api/upload", UploadService);
APP.use("/api/view-image", ServeImageService);
APP.use("/api/imageMobile", MobileUploadService);
APP.use("/api/checkin", CheckIn);

APP.listen(8082, () => {
    console.log('SERVER IS LISTENING AT PORT 8082');
});

global.mqtt = require('./mqtt.js');
mqtt.configure(config);
mqtt.start();
