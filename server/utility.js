const User = require('./models/user.js');
const Capsule = require('./models/capsule.js');

exports.parseDate = ([years, months, days]) => {
  let today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth() + 1;
  let currentDay = today.getDate();

  let unearthYear = currentYear + years;
  let unearthMonth = currentMonth + months;
  let unearthDay = currentDay + days;

  return new Date([unearthYear, unearthMonth, unearthDay]);
};

exports.signup = (req, res) => {
  let newUser = User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  // the password will be hashed in the user file before save gets called
  newUser.save((err) => {
    if (err) {
      console.error(err);
      res.sendStatus(404);
    } else {
      console.log('New user created');
      res.sendStatus(201);
    }
  });
};

exports.signin = (req, res) => {
  // User.findOne({ email: req.body.email }, (err, user) => {
  //   if (err) {
  //     console.error(`ERROR: ${err}`);
  //     res.sendStatus(404);
  //   } else if (!user) {
  //     console.log(`Could not find user with email ${req.body.email}`);
  //     res.sendStatus(404);
  //   } else {
  //     user.comparePassword(req.body.password, (err, matches) => {
  //       if (err) {
  //         console.error(`Signin error: ${err}`)
  //         res.sendStatus(404);
  //       } else if (!matches) {
  //         console.log('Password did not match');
  //         res.sendStatus(404);
  //       } else {
  //         console.log(`Successful user signin for email ${req.body.email}`);
  //         res.send(user._id);
  //       }
  //     });
  //   }
  // });
  res.send('5993447ada1e1a8c9114be47');   ////********   Put your ID here
};

exports.getAllCapsules = (req, res) => {
  console.log('req body userId', req.body);
  Capsule.find({ _user: req.body.userId }, (err, capsules) => {
    if (err) {
      console.error(`All capsules retrieval error: ${err}`);
      res.sendStatus(404);
    } else if (!capsules) {
      console.log('Could not retrieve all capsules');
      res.sendStatus(404);
    } else {
      console.log(`Successfully retrieved all capsules for user ${req.body.userId}`);
      res.send(capsules);
    }
  });
};

exports.getBuriedCapsules = (req, res) => {
  Capsule.find({ _user: req.body.userId, buried: true }, (err, capsules) => {
    if (err) {
      console.error(`Buried capsules retrieval error: ${err}`);
      res.sendStatus(404);
    } else if (!capsules) {
      console.log('Could not retrieve buried capsules');
      res.sendStatus(404);
    } else {
      console.log(`Successfully retrieved buried capsules for user ${req.body.userId}`);
      res.send(capsules);
    }
  });
};

exports.inProgress = (req, res) => {
  Capsule.find({ _user: req.body.userId, buried: false }, (err, capsules) => {
    if (err) {
      console.error(`In progress capsules retrieval error: ${err}`);
      res.sendStatus(404);
    } else if (!capsules) {
      console.log('Could not retrieve in progress capsules');
      res.sendStatus(404);
    } else {
      console.log(`Successfully retrieved in progress capsules for user ${req.body.userId}`);
      res.send(capsules);
    }
  });
};

exports.createCapsule = (req, res) => {
  let newCapsule = Capsule({
    _user: req.body.userId,
    capsuleName: '',
    contents: [],
    buried: false,
    unearthed: false,
    unearthDate: null,
    createdAt: Date.now(),
    unearthMessage: ''
  });

  newCapsule.save((err) => {
    if (err) {
      console.error(`ERROR creating capsule in database: ${err}`)
    } else {
      console.log(`New empty capsule created for user ${req.body.userId}`);
      res.send(newCapsule._id);
    }
  });
}

exports.editCapsule = (req, res) => {
  let newName = req.body.capsuleName;
  let capsuleId = req.body.capsuleId;
  let newContents = req.body.capsuleContent;
  console.log('server capsuleId', capsuleId)
  Capsule.findOne({ _id: capsuleId }, (err, capsule) => {
    if (err) {
      console.error(`ERROR: ${err}`);
      res.sendStatus(404);
    } else if (!capsule) {
      console.log(`Could not find capsule with id ${capsuleId}`);
      res.sendStatus(404);
    } else {
      capsule.capsuleName = newName;
      capsule.contents = newContents;
      capsule.save((err) => {
        if (err) {
          console.error(`ERROR editing capsule ${capsuleId}: ${err}`);
          res.sendStatus(504);
        } else {
          console.log(`Capsule ${capsuleId} successfully edited`);
          res.sendStatus(200);
        }
      });
    }
  });
};

exports.deleteCapsule = (req, res) => {
  Capsule.remove({ _id: req.body.capsuleId }, (err) => {
    if (err) {
      console.error(`Failed to remove capsule ${req.body.capsuleId} from the database`);
      res.sendStatus(504);
    } else {
      console.log(`Successfully removed capsule ${req.body.capsuleId} from the database`);
      res.sendStatus(204);
    }
  });
};

exports.buryCapsule = (req, res) => {
  let capsuleId = req.body.capsuleId;
  let unearthDate = req.body.unearthDate;

  Capsule.findOne({ _id: capsuleId })
    .populate('_user')
    .exec((err, capsule) => {
      if (err) {
        console.error(`ERROR: ${err}`);
        res.sendStatus(404);
      } else if (!capsule) {
        console.log(`Could not find capsule with id ${capsuleId}`);
        res.sendStatus(404);
      } else {
        capsule.buried = true;
        capsule.unearthDate = util.parseDate(unearthDate);
        let year = capsule.unearthDate.getFullYear();
        let month = capsule.unearthDate.getMonth() + 1;
        let day = capsule.unearthDate.getDate();
        capsule.unearthMessage =
          `
          You may open this capsule on ${month}/${day}/${year}
          `;
        capsule.save((err) => {
          if (err) {
            console.error(`ERROR burying capsule ${capsuleId}: ${err}`);
            res.sendStatus(504);
          } else {
            console.log(`Capsule ${capsuleId} successfully buried`);
            res.sendStatus(200);
          }
        });
      }
    });
};




