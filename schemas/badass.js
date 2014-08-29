exports.mongoose = require('mongoose');
exports.Schema = this.mongoose.Schema;  

exports.Badass = new this.Schema({  
		_id: this.Schema.Types.ObjectId,
    detection_date: {type: Date, required:true },
    ip: { type: String, required: false },
    scraped_source: {type: String, required: true}, 
    description: {type: String, required: true},
    run: {type: String, required: true}, //this is the key indpuf feeds style

    country: { type: String, required: false},
    city: { type: String, required: false},
    region: { type: String, required: false},
    ll: { type: String, required: false},
    modified: { type: Date, required: false, default: Date.now }
});
