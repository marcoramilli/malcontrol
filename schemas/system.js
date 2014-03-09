exports.mongoose = require('mongoose');
exports.Schema = this.mongoose.Schema;  

exports.System = new this.Schema({  
		_id: this.Schema.Types.ObjectId,
    maxNumberofMalwareh: {type: Number, required: false, default: 0},
    maxNumberofThreatsh: {type: Number, required: false, default: 0},
    modified: { type: Date, required: false, default: Date.now }
});
