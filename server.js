var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
const handlebars = require('express-handlebars');
var accountRoutes = require('./routes/account.js');
var isAuthenticated = require('./middleware/isAuthenticated');
var Chore = require('./models/chore.js');
var Bill = require('./models/bill.js');
var User = require('./models/user.js');
var Activity = require('./models/activity.js');
var path = require('path');
var apiRouter = require('./routes/api.js');

var app = express();

// this is our MongoDB database
const dbRoute = "mongodb://jthirani:password1@ds117711.mlab.com:17711/cis197finalproject";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/final-project');

app.use('/static', express.static(path.join(__dirname, 'assets')))
app.use(express.static('assets'));
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieSession({
  name: 'local-session',
  keys: ['yo'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

app.get('/', (req, res, next) => {
  res.render('home', {title: "RoommateBot", user: req.session.user});
});

app.get('/getChores', function (req, res, next) {
  Chore.find({}, function (err, result) {
    if (!err) {
      // console.log(result);
      console.log(result)
      res.json(result)
    } else {
      next(err)
    }
  })
})

app.get('/getBills', function (req, res, next) {
  Bill.find({}, function (err, result) {
    if (!err) {
      // console.log(result);
      // console.log(result)
      res.json(result)
    } else {
      next(err)
    }
  })
})

app.post('/deleteBill', (req, res, next) => {
  var { id } = req.body;
  console.log(id);
  Bill.findByIdAndDelete(id, function(err, result) {
    if (!err) {
      console.log(result)
      var a = new Activity({creator: req.session.user, activityType: "deleted a bill", activityText: result.billText, roommates: req.body.roommate})
      a.save(function (err, result) {
        if (!err) {
          res.send({message: "deleted!"});
        } else {
          next(err);
        }
      }); 
    }
  })
});


app.post('/deleteChore', (req, res, next) => {
  var { id } = req.body;
  console.log(id);

  Chore.findByIdAndDelete(id, function(err, result) {
    if (!err) {
      console.log(result)
      var a = new Activity({creator: req.session.user, activityType: "deleted a chore", activityText: result.choreText, roommates: req.body.roommate})
      a.save(function (err, result) {
        if (!err) {
          res.send({message: "deleted!"});
        } else {
          next(err);
        }
      }); 
    }
  })
});

app.post('/chores', (req, res, next) => {
  // console.log(req.body);
  if (typeof req.body.roommate === 'string') {
    // console.log(req.body.roommate);
    var c = new Chore({choreText: req.body.chore, roommates: [req.body.roommate]});
    c.save(function (err, result) {
      if (!err) {
        var a = new Activity({creator: req.session.user, activityType: "created a chore", activityText: req.body.chore, roommates: [req.body.roommate]})
        a.save(function (err, result) {
          if (!err) {
            // res.render('home', {title: "RoommateBot", user: req.session.user});
          } else {
            next(err);
          }
        });
      } else {
        next(err);
      }
    })
  } else {
    var c = new Chore({choreText: req.body.chore, roommates: req.body.roommate});
    c.save(function (err, result) {
      if (!err) {
        var a = new Activity({creator: req.session.user, activityType: "created a chore", activityText: req.body.chore, roommates: req.body.roommate})
        a.save(function (err, result) {
          if (!err) {
            // res.render('home', {title: "RoommateBot", user: req.session.user});
          } else {
            next(err);
          }
        });
      } else {
        next(err);
      }
    })
  }
});


app.post('/bills', (req, res, next) => {
  var b = new Bill({billText: req.body.bill, amount: req.body.amount});
  console.log()
  b.save(function (err, result) {
    if (!err) {
      var a = new Activity({creator: req.session.user, activityType: "created a bill", activityText: req.body.bill, roommates: [req.body.roommate]})
      a.save(function (err, result) {
        if (!err) {
          // res.render('home', {title: "RoommateBot", user: req.session.user});
        } else {
          next(err);
        }
      });
    } else {
      next(err);
    }
  })
});


app.get('/chores', (req, res, next) => {
  User.find({}, function(err, users) {
    if (!err) {
      Chore.find({}, function(err, chores) {
        if (!err) {
          console.log(chores);
          res.render('chores', {title: "Roommate", user: req.session.user, chores: chores, users: users});
        } else {
          next(err);
        }
      })
    } else {
      next(err);
    }
  })
  
});

app.get('/bills', (req, res, next) => {
  Bill.find({}, function(err, bills) {
    if (!err) {
      console.log(bills);
      res.render('bills', {title: "Roommate", user: req.session.user, bills: bills});
    } else {
      next(err);
    }
  })
});

app.use('/api', apiRouter)

app.use('/account', accountRoutes);

app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})

