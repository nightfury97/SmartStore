var config;
var server;
const mosca = require('mosca');

module.exports = {
    configure: function (c) {
        config = c;
    },

    start: function () {
        server = new mosca.Server({
            
            http: config.mqtt.http,
            port: config.mqtt.port,
        });

        server.on('ready', setup);
        server.on('clientConnected', connected);
        server.on('clientDisconnected', disconnected);
        server.on('published', published);
        server.on('subscribed', subscribed);
        server.on('unsubscribed', unsubscribed);
    },

    publish: function (topic, message) {
        var payload = {
            topic: topic,
            payload: message,
            qos: 0,
            retain: false
        };

        server.publish(payload, function () {
            console.log('Published callback complete.');
        });
    }
};

function setup() {
    console.log('Mosca server started.');
}

function connected(client) {
    console.log(`Client ${client.id} connected`);
}

function subscribed(topic, client) {
    console.log(`Client ${client.id} subscribed to ${topic}.`);
}

function unsubscribed(topic, client) {
    console.log(`Client ${client.id} unsubscribed from ${topic}.`);
}

function disconnected(client) {
    console.log(`Client ${client.id}`);
}


function published(packet, client) {
    console.log(`Published to ${packet.topic} <- ${packet.payload}`);
    var pos = packet.payload.slice(0, 4);
    var pro = packet.payload.slice(5, 13);
    console.log(pos+"+"+pro);
    var sql = require("mssql");
    var config = {
        user: 'sa',
        password: '123456',
        server: "localhost", 
        database: 'NCKH' 
    };
    if(packet.topic=="takePro") {
        sql.connect(config, function (err) {

            if (err) console.log(err);
        
            // create Request object
            var request = new sql.Request();
               
            // query to the database and get the records
            request.query("addCart @pos='"+pos+"',@pro='"+pro+"'", function (err, recordset) {
                
                if (err) console.log(err)
        
                // send records as a response
                console.log(recordset);
              
            });
        });
    
    }
}
