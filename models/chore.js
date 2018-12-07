var mongoose = require('mongoose')

const choreSchema = new mongoose.Schema({
  choreText: { type: String },
  roomates: { type: String }
})

module.exports = mongoose.model('Chore', choreSchema);
