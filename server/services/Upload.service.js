// import { Router } from "express";
// import multer from 'multer';
// import fs from 'fs';
// import jo from 'jpeg-autorotate';

// const fetch = require("node-fetch");
// var download = require('download-file')
// const imageUploader = multer({ dest: '../server/node-server/public/uncheck' })
// const router = Router();
// const config2 = { database: { file: "../server/node-server/db/data.db" } }
// const db = require('../../server/node-server/db/sqlite');
// db.open(config2);


// // const config = require('../../server/node-server/config');
// // const mqtt = require('../../server/node-server/mqtt');
// // mqtt.configure(config);
// // mqtt.start();

// router.post('/avatar', imageUploader.array('avatar'), (req, res,next) => {
    
//         console.log("acs");
        
        
//         db.getLastIDUncheck(results2 => {
//             console.log(`Results: ${JSON.stringify(results2)}`);
//             if (results2.status === db.SUCCESS) {       
//                 var idUncheck = 0;
//                 idUncheck = results2.data[0]+1;
//                 console.log("idunchecks "+ idUncheck);
//                 // db.insertUncheckImage(idUncheck, filename, results2 => {
//                 //     console.log(`Results: ${JSON.stringify(results2)}`);
//                 //     if (results2.status === db.SUCCESS) {
//                 //         console.log("ok");
//                 //     } else {
//                 //         console.log("2s");
//                 //     }
//                 // });
                 
//         var name = req.body.name;
//         var fileAudio = req.body.filename;
//         var age = req.body.age;
//         var sex = req.body.sex;
//         var type = req.body.type;
//         console.log("fileAudio"+fileAudio);
//         var strPublic = "";
//         var files = req.files;
//         var keyApi = ["LY4UgM9latPlUO2Gd0i9GPH9832U6yH2","bMMCSUAZGLiS3vg6ibZw7QgdKzT4xjqH","kJqrj1AuIsGtIWlVy8Rn5mnvpxuS1IPs"];
        

    
//         if (files) {
//             var idImg = 0;
//             files.forEach(function(file) {
//                 console.log(name);
//                 // var vary = new Promise((resolve, reject) => {
//                 const processedFile = file || {}; // MULTER xử lý và gắn đối tượng FILE vào req
//                 let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
//                 // orgName = orgName.trim().replace(/ /g, "-")
//                 const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
//                 // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
            
//                 var checkPath = `../server/node-server/public/uncheck/${orgName}/`
            
//                 console.log("ok 211");
//                 if (!fs.existsSync(checkPath)) {
//                     console.log("make " + checkPath)
//                     fs.mkdirSync(checkPath);
//                 }
//                 const filename = `${orgName}-${Date.now()}${idImg++}.png`
//                 const filepath = `${orgName}/${filename}`;
//                 const newFullPath = `../server/node-server/public/uncheck/${filepath}`;
//                 fs.renameSync(fullPathInServ, newFullPath);
            
//                 var upload_done = false;
//                 while (!upload_done) {
//                     upload_done = fs.existsSync(newFullPath);
//                     console.log(upload_done);
//                     if (upload_done) {
//                         fs.chmod(newFullPath, 0o777, (err) => {
//                             if (err) throw err;
//                             console.log('The permissions for file have been changed!');
//                         });
//                     }
//                 }
//                 console.log("ok nha");
//                 if (idImg == 1) {
//                     db.insertUncheck(name, age, sex,type, filename, results2 => {
//                         console.log(`Results: ${JSON.stringify(results2)}`);
//                         if (results2.status === db.SUCCESS) {       
                            
//                             console.log("okBig "+ idUncheck);
//                             // db.insertUncheckImage(idUncheck, filename, results2 => {
//                             //     console.log(`Results: ${JSON.stringify(results2)}`);
//                             //     if (results2.status === db.SUCCESS) {
//                             //         console.log("ok");
//                             //     } else {
//                             //         console.log("2s");
//                             //     }
//                             // });
//                         } else {
//                             console.log("2s");
//                         }
//                         });            
//                     var options0 = {
//                         "method": "POST",
//                         "hostname": [
//                             "api",
//                             "fpt",
//                             "ai"
//                         ],
//                         "path": [
//                             "hmi",
//                             "tts",
//                             "v5"
//                         ],
//                         "headers": {
//                             "api_key": keyApi[0],
//                             "voice": "female",
//                             "speed": "3",
//                             "Content-Type": "text/plain",
//                             "Cache-Control": "no-cache",
//                             "User-Agent": "PostmanRuntime/7.19.0",
//                             "Accept": "*/*",
//                             "Postman-Token": "fb0a9317-09ce-4a1e-be2a-6ce7191f51ba,ca0886a0-d566-4851-a2b8-1a3a35189d33",
//                             "Host": "api.fpt.ai",
//                             "Accept-Encoding": "gzip, deflate",
//                             "Content-Length": "20",
//                             "Connection": "keep-alive",
//                             "cache-control": "no-cache"
//                         },
//                         "body": `chào mừng ${name} đến với phòng lab của chúng tôi `,
//                     };
//                     var options1 = {
//                         "method": "POST",
//                         "hostname": [
//                             "api",
//                             "fpt",
//                             "ai"
//                         ],
//                         "path": [
//                             "hmi",
//                             "tts",
//                             "v5"
//                         ],
//                         "headers": {
//                             "api_key": keyApi[1],
//                             "voice": "female",
//                             "speed": "3",
//                             "Content-Type": "text/plain",
//                             "Cache-Control": "no-cache",
//                             "User-Agent": "PostmanRuntime/7.19.0",
//                             "Accept": "*/*",
//                             "Postman-Token": "fb0a9317-09ce-4a1e-be2a-6ce7191f51ba,ca0886a0-d566-4851-a2b8-1a3a35189d33",
//                             "Host": "api.fpt.ai",
//                             "Accept-Encoding": "gzip, deflate",
//                             "Content-Length": "20",
//                             "Connection": "keep-alive",
//                             "cache-control": "no-cache"
//                         },
//                         "body": `chào mừng ${name} đến với phòng lab của chúng tôi `,
//                     };
//                     var options2 = {
//                         "method": "POST",
//                         "hostname": [
//                             "api",
//                             "fpt",
//                             "ai"
//                         ],
//                         "path": [
//                             "hmi",
//                             "tts",
//                             "v5"
//                         ],
//                         "headers": {
//                             "api_key": keyApi[2],
//                             "voice": "female",
//                             "speed": "3",
//                             "Content-Type": "text/plain",
//                             "Cache-Control": "no-cache",
//                             "User-Agent": "PostmanRuntime/7.19.0",
//                             "Accept": "*/*",
//                             "Postman-Token": "fb0a9317-09ce-4a1e-be2a-6ce7191f51ba,ca0886a0-d566-4851-a2b8-1a3a35189d33",
//                             "Host": "api.fpt.ai",
//                             "Accept-Encoding": "gzip, deflate",
//                             "Content-Length": "20",
//                             "Connection": "keep-alive",
//                             "cache-control": "no-cache"
//                         },
//                         "body": `chào mừng ${name} đến với phòng lab của chúng tôi `,
//                     };
            
//                     fetch(`https://api.fpt.ai/hmi/tts/v5`, options1)
//                         .then(results => {
//                             console.log("tesst ok d");
//                             return results.json();
//                         })
//                         .then(data => {
//                             console.log(data.async);
//                             var options = {
//                                 directory: checkPath,
//                                 filename: fileAudio+"-name.mp3"
//                             }
                                                    
//                             download(data.async, options, function(err) {
//                                 if (err) {
//                                     download(data.async, options, function(err) {
//                                         if (err) {
//                                             download(data.async, options, function(err) {
//                                                 if (err) {flag=2;throw err;}
//                                                 console.log("meow3");                        
//                                             })
//                                         }
//                                         console.log("meow2");                        
//                                     })
//                                 }
//                                 console.log("meow1");                        
//                             })}                                          
//                         )
//                 } 
//                         if (idImg >0){
//                             db.insertUncheckImage(idUncheck, filename, results2 => {
//                                 console.log(`Results: ${JSON.stringify(results2)}`);
//                                 if (results2.status === db.SUCCESS) {
//                                     console.log("ok");
//                                 } else {
//                                     console.log("2s");
//                                 }
//                             });
//                         }
//                             strPublic += "||" + filename;
//                         // }
//                     //     resolve(console.log("done!") );
//                     //     reject(console.log("no files"));
//                     // });
//             });
//             // mqtt.publish("commands/name", strPublic);
//             // console.log("commands/name: " + strPublic);
//         } else {
//             console.log("no files");    
//         }
        
//         } else {
//             console.log("xong");
//         }
//     });  

//     // db.getLastIDUncheck ( results => {
//     //     console.log(`Results: ${JSON.stringify(results)}`);
//     //     console.log(`Results: ${JSON.stringify(results.data[0])}`);
//     //     switch (results.status) {
//     //         case db.SUCCESS:
//     //         console.log(results.data[0]);
//     //             id = parseInt(results.data[0]);
//     //             console.log("id2 "+id+" name "+name);    
//     //             
//     //         case db.NOT_FOUND:

//     //             break;
//     //         default:

//     //     }
//     // });

//     // var uncheck =  { profile: {
//     //     id: this.props.returnedPerson,
//     //     name: eventData.name,
//     //     clearanceType: eventData.clearanceType,
//     //     position: eventData.position,
//     //     age: eventData.age,
//     //     height: eventData.height,
//     //     weight: eventData.weight,
//     //     phone: eventData.phone,
//     //     email: eventData.email,
//     //   } };

    
//     console.log("complete!");
//     next(); 
//     res.send({
//         status: true,
//         message: 'file uploaded',
//         // fileNameInServer: newFullPath
//     });
// })

// export default router;