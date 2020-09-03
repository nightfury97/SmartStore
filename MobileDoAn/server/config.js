module.exports = {
    database: {
        file: "./db/data.db"
    },

    restify: {
        port: 8000,
        host: "localhost",
        options: {
            name: "Intel Facial Recognition Server"
        }
    },
    api: './api/swagger.json',

    mqtt: {
        backingStore: {
        },
        port: 1883,
        host: '192.168.43.250',
        http: {port: 3000, bundle: true, static: './'}  
    }
}