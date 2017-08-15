const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const db = require('./db/config.js');
const User = require('./models/user.js');
const Capsule = require('./models/capsule.js');
const util = require('./utility.js')
const emailService = require('./email.js');
const cronScan = require('./cronScan.js');
const session = require('express-session');
const cors = require('cors');


const app = express();

// app.use(cors());
app.use(session({
  secret: 'why'
}));

let isLoggedOn = function(req, res, next) {
  console.log('cheking for user session every request:', req.session);
  if (req.session.user) {
    // console.log('was it here?')
    next();
  } else {
    // console.log('didnt log in?')
    // next();
    res.redirect('/');
  }
}


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('client'));

//app.use(isLoggedOn);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


app.post('/signup', util.signup);

app.post('/signin', util.signin);

app.post('/capsules/all', isLoggedOn, util.getAllCapsules);

app.post('/capsules/buried', isLoggedOn, util.getBuriedCapsules);

app.get('/session', (req, res) => {
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    res.send('no session found');
  }
})

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');

})

app.post('/capsules/inProgress', isLoggedOn, util.inProgress);

app.post('/create', isLoggedOn, util.createCapsule);

app.put('/edit', isLoggedOn, util.editCapsule);

app.post('/delete', isLoggedOn, util.deleteCapsule);

app.put('/bury', isLoggedOn, util.buryCapsule);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
