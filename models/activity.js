var mongoose = require('mongoose')

const activitySchema = new mongoose.Schema({
  creator: { type: String },
  activityType: { type: String },
  activityText: { type: String },
  roommates: [{ type: String }]
})

module.exports = mongoose.model('Activity', activitySchema);
