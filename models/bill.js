var mongoose = require('mongoose')

const billSchema = new mongoose.Schema({
  billText: { type: String },
  amount: { type: Number }
})

module.exports = mongoose.model('Bill', billSchema);
