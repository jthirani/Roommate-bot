var express = require('express')
var router = express.Router();
var Activity = require('../models/activity.js')

router.get('/getActivities', function (req, res, next) {
  Activity.find({}, function (err, result) {
    if (!err) {
      // console.log(result);
      res.json(result)
    } else {
      next(err)
    }
  })
})

module.exports = router;