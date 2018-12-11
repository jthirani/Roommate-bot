var mongoose = require('mongoose')

const choreSchema = new mongoose.Schema({
  choreText: { type: String },
  roommates: [{ type: String }]
})

module.exports = mongoose.model('Chore', choreSchema);
