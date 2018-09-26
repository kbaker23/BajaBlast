const mongo = require('mongodb');
const promisify = require('util').promisify;
const conn = promisify(mongo.MongoClient.connect);

const URI = 'mongodb://admin18:KbJcNsAp18@cluster0-shard-00-00-2xl5d.mongodb.net:27017,cluster0-shard-00-01-2xl5d.mongodb.net:27017,cluster0-shard-00-02-2xl5d.mongodb.net:27017/Tasks?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true';

module.exports.DB = class DB{
	constructor(name){
		this.db_name = name;
	}

	async login(){
		try{
			const dbo = await conn(URI, {useNewUrlParser: true});
			this.db = dbo.db('Tasks');
		}
		catch(err){
			console.log(err);
		}
	}

	getCol(col){
		const collection = this.db.collection(col);
		return collection.find({}).toArray();
	}
}
