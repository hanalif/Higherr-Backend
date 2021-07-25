const MongoClient = require('mongodb').MongoClient
const logger = require('./logger.service');

const config = require('../config')

module.exports = {
    getCollection
}

// function getCollection(collectionName) {
//     const uri = "mongodb+srv://ben:benitzhak1234@cluster0.xpmjg.mongodb.net/HIGHERR_DB?retryWrites=true&w=majority";
//     const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//     client.connect(err => {
//         const collection = client.db('HIGHERR_DB').collection(collectionName);
//         collection.find().toArray()
//             .then(res => console.log(res))
//         client.close();
//     });
// }
// Database Name
const dbName = 'HIGHERR_DB'

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}