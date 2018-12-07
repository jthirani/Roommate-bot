var isAuthenticated = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next(new Error("you aren't authenticated"));
  }
}

module.exports = isAuthenticated;