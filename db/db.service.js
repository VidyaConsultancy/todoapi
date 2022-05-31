const { MongoClient } = require("mongodb");

class DBService {
    constructor(DB_URL = "mongodb://localhost:27017", DB_NAME = "todos") {
        this.client = null;
        this.db = null;
        this.connectToDB(DB_URL, DB_NAME);
    }

    async connectToDB(dbUrl, dbName) {
        const mongoClient = new MongoClient(dbUrl);
        this.client = await mongoClient.connect();
        this.db = this.client.db(dbName);
    }
}

module.exports.dbService = new DBService();