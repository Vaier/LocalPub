const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TimeTableSchema = new Schema({
    table: {type: Schema.Types.ObjectId, ref: 'Table', required: true},
    customer: {type: Schema.Types.ObjectId, ref: 'Customer', required: true},
    reservation_date_from: {type: Date, required: true},
    reservation_date_to: {type: Date, required: true},
	code: {type: Number, required: true},
});

TimeTableSchema
    .virtual('url')
    .get(function() {
        return '/catalog/time_table/' + this._id;
    });

//Export model
module.exports = mongoose.model('TimeTable', TimeTableSchema);