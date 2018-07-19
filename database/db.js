const stitch = require('mongodb-stitch');


const URI = 'database-xqhvb';
const TASK_DB = 'Tasks';

function clientPromise(){
	return stitch.StitchClientFactory.create(URI);
}


function clientAuth(name){
	const cli = clientPromise();
	return cli.then(client => {
		const db = client.service("mongodb", "mongodb-atlas").db(name);
		return {db, client};
	});
}

module.exports.DB = class{
	
	constructor(db_name){
		this.db_name = db_name;
	}
	
	async login(){
		try{
			const res = await clientAuth(this.db_name);
			this.client = res.client;
			this.db = res.db;
			await this.client.login();
		}
		catch(err){
			console.log(err);
		}
	}
	
	getCol(col){
		return this.db.collection(col).find({}).execute().then( res => {
			return res;
		});
	}
	
	
}

module.exports.getTask = function(col, callback){
	const cli = clientPromise();
	cli.then(client => {
		const db = client.service('mongodb', 'mongodb-atlas').db(TASK_DB);
		client.login().then( () => {
			
			db.collection(col).find({}).execute().then( res => {
				
				callback(false, res);
			}).catch(err => {
				
				callback(true, err);
			});
		});
	});
};