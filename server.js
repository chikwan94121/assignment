var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var mongodbURL = 'mongodb://MongoLab-w:XBVAFA8OxsKro.sTrBKxYczt2zKXtWRBTWQ3E2SC9Qs-@ds052968.mongolab.com:52968/MongoLab-w';
var mongoose = require('mongoose');



app.post('/',function(req,res) {
	//console.log(req.body);
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		if(req.body.building != undefined||req.body.street != undefined||req.body.zipcode != undefined){
		rObj.address = {};
		if(req.body.building != undefined) rObj.address.building = req.body.building;
		if(req.body.street != undefined) rObj.address.street = req.body.street;
		if(req.body.zipcode != undefined) rObj.address.zipcode = req.body.zipcode;
		}
		if(req.body.lon != undefined||req.body.lat != undefined){
		rObj.address.coord = [];
		rObj.address.coord.push(req.body.lon);
		rObj.address.coord.push(req.body.lat);
		}
		if(req.body.borough != undefined) rObj.borough = req.body.borough;
		if(req.body.cuisine != undefined) rObj.cuisine = req.body.cuisine;
		if(req.body.name != undefined) rObj.name = req.body.name;
		if(req.body.restaurant_id != undefined) rObj.restaurant_id = req.body.restaurant_id;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		//console.log(r);
		r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant created!')
       		db.close();
			res.status(200).json({message: 'insert done', _id: r._id});
    	});
    });
});

app.delete('/restaurant_id/:id',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', restaurant_id: req.params.id});
    	});
    });
});

app.get('/restaurant_id/:id', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({restaurant_id: req.params.id},function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document', restaurant_id: req.params.id});
			}
			db.close();
    	});
    });
});

app.put('/restaurant_id/:id/grade', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.grades = {};
		rObj.grades.date = req.body.date;
		rObj.grades.grade = req.body.grade;
		rObj.grades.score = req.body.score;
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update({restaurant_id: req.params.id},{$push:rObj},function(err){
			if (err) {
				res.status(500).json(err);
				throw err
			}
       		db.close();
			res.status(200).json({message: 'update done'});
		});
	});
});
//delete by attribe
app.delete('/:attrib/:attrib_value',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	var criteria = {};
	criteria[req.params.attrib] = req.params.attrib_value;
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done'});
    	});
    });
});

//update by id 
app.put('/restaurant_id/:id/:attrib/:attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	var criteria = {};
	criteria[req.params.attrib] = req.params.attrib_value;
	console.log(criteria);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update({restaurant_id: req.params.id},{$set:criteria},function(err){
			if (err) {
				res.status(500).json(err);
				throw err
			}
       		db.close();
			res.status(200).json({message: 'update done'});
		});
	});
});
//update address by id 
app.put('/restaurant_id/:id/address/:attrib/:attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	var criteria = {};
	criteria["address."+req.params.attrib] = req.params.attrib_value;
	console.log(criteria);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update({restaurant_id: req.params.id},{$set:criteria},function(err){
			if (err) {
				res.status(500).json(err);
				throw err
			}
       		db.close();
			res.status(200).json({message: 'update done'});
		});
	});
});

/*update grades by id fail
app.put('/restaurant_id/:id/grades/:attrib/:attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	var criteria = {};
	criteria["grades."+req.params.attrib] = req.params.attrib_value;
	console.log(criteria);
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update({restaurant_id: req.params.id},{$push:criteria},function(err){
			if (err) {
				res.status(500).json(err);
				throw err
			}
       		db.close();
			res.status(200).json({message: 'update done'});
		});
	});
});
*/

//delete by name
app.delete('/name/:name',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({name: req.params.name}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done', restaurant_id: req.params.id});
    	});
    });
});
//delete by borough
app.delete('/borough/:borough',function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find({borough: req.params.borough}).remove(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		//console.log('Restaurant removed!')
       		db.close();
			res.status(200).json({message: 'delete done'});
    	});
    });
});
//delete by cuisine

app.delete('/grades', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var rObj = {};
		rObj.grades = {};
		rObj.grades.date = req.body.date;
		rObj.grades.grade = req.body.grade;
		rObj.grades.score = req.body.score;
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.find(rObj).remove(function(err) {
			if (err) {
				res.status(500).json(err);
				throw err
			}
       		db.close();
			res.status(200).json({message: 'update done'});
		});
	});
});


//get by address attrib 
app.get('/address/:attrib/:attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	var criteria = {};
	criteria["address."+req.params.attrib] = req.params.attrib_value;

	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
		});
	});
});

//get by attrib
app.get('/:attrib/:attrib_value', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	var criteria = {};
	criteria[req.params.attrib] = req.params.attrib_value;

	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
		});
	});
});

app.get('/avgscore/lt/:score', function(req,res) {
	var restaurantSchema = require('./models/restaurant');
	var criteria = {};
	criteria[req.params.attrib] = req.params.attrib_value;

	mongoose.connect(mongodbURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		Restaurant.find(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
		});
	});
});

app.listen(process.env.PORT || 8099);

