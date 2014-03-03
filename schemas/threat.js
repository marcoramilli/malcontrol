exports.mongoose = require('mongoose');
exports.Schema = this.mongoose.Schema;  

exports.Threat = new this.Schema({  
		_id: this.Schema.Types.ObjectId,
		url: {type: String, required: false},
		linkToReport: {type: String, required: false},
		timestamp: {type: String, required: false},
    ip: { type: String, required: false },
    alerts: {type: String, required: false},
    ids: {type: String, required: false},
    reportlink: {type: String, required: false}, 
    scraped_source: {type: String, required: true}, 

    country: { type: String, required: false},
    city: { type: String, required: false},
    region: { type: String, required: false},
    ll: { type: String, required: false},
    desc: { type: String, required: false},
    modified: { type: Date, required: false, default: Date.now }
});
