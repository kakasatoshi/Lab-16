const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.json({
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.json({
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
      bcrypt.compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              if (err) {
                console.log(err);
                return res.status(500).json({ message: 'Session save failed.' });
              }
              res.json({ message: 'Login successful!', user: { email: user.email, id: user._id } });
            });
          }
          res.status(401).json({ message: 'Invalid email or password.' });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Login failed.' });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Something went wrong.' });
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) {
        return res.status(422).json({ message: 'E-Mail exists already, please pick a different one.' });
      }
      return bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
          });
          return user.save();
        })
        .then(result => {
          res.status(201).json({ message: 'User created successfully!' });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Signup failed.' });
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.json({ message: 'Logout successful!' });
  });
};
