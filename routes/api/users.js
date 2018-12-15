const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {
  console.log("the user==== ", req.body);
  //const { body: { user } } = req;
  let user = {};
  user.email = req.body.email;
  user.password = req.body.password;
  console.log("the user==== 14", user);

  if (!user.email) {
    console.log("the user.email==== ", user.email);
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.password) {
    console.log("the user.password==== ", user.password);
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.json({
      user: finalUser.toAuthJSON()
    }));
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  console.log(" in login ", req.body.email);
  let user = {};
  user.email = req.body.email;
  user.password = req.body.password;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', {
    session: true
  }, (err, passportUser, info) => {
    console.log(" in login 2:", req.body.password);
    if (err) {
      console.error(" in error");
      return next(err);
    }

    if (passportUser) {
      console.log(" in user");
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({
        user: user.toAuthJSON()
      });
    }

    return res.status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const {
    payload: {
      id
    }
  } = req;

  return Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }

      return res.json({
        userEmail: user.email+" is user email!"
      });
    });
});

module.exports = router;