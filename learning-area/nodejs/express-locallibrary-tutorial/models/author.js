const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const moment = require('moment');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});

AuthorSchema.virtual('name').get(function () {
    return `${this.family_name}, ${this.first_name}`;
});

AuthorSchema.virtual("lifespan").get(function () {
    let lifetime_string = "";
    if (this.date_of_birth) {
        lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
    } else {
        lifetime_string += '?';
    }
    lifetime_string += " - ";
    if (this.date_of_death) {
        lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED);
    } else {
        lifetime_string += '?';
    }
    return lifetime_string;
});

AuthorSchema.virtual("date_of_birth_yyyy_mm_dd").get(function () {
    // return DateTime.fromJSDate(this.date_of_birth).toISODate(); // format 'YYYY-MM-DD'
    return moment(this.date_of_birth).format('YYYY-MM-DD');
});

AuthorSchema.virtual("date_of_death_yyyy_mm_dd").get(function () {
    // return DateTime.fromJSDate(this.date_of_death).toISODate(); // format 'YYYY-MM-DD'
    return moment(this.date_of_death).format('YYYY-MM-DD');
});

AuthorSchema.virtual('url').get(function () {
    return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model('Author', AuthorSchema);