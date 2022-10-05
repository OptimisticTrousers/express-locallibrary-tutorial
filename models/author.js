const { DateTime } = require("luxon");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullname = "";
  }
  return fullname;
});

AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("date_of_birth_formatted").get(function () {
  return this.date_of_birth
    ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("date_of_death_formatted").get(function () {
  return this.date_of_death
    ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
    : "";
});

AuthorSchema.virtual("lifespan").get(function () {
  let { date_of_birth, date_of_death } = this;

  if(date_of_birth && date_of_death === undefined) {
    return "N/A"
  }
  if (date_of_birth === undefined) {
    date_of_birth = "Unknown";
  }
  if (date_of_death === undefined) {
    date_of_death = "Present";
  }
  return `${date_of_birth} - ${date_of_death}`;

  // return `${DateTime.fromJSDate(date_of_birth).toLocaleString(
  //   DateTime.DATE_MED
  // )} - ${DateTime.fromJSDate(date_of_death).toLcateString(DateTime.DATE_MED)}`;

  // return this.date_of_death
  //   ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
  //   : "";
});

module.exports = mongoose.model("Author", AuthorSchema);
