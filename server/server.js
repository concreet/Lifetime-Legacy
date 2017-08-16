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

const app = express();

app.use(session({
  secret: 'why'
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('client'));

app.use((req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


app.post('/signup', util.signup);

app.post('/signin', util.signin);

app.post('/contact/add', util.addContact);

app.post('/capsules/all', util.isLoggedOn, util.getAllCapsules);

app.post('/capsules/buried', util.isLoggedOn, util.getBuriedCapsules);

app.get('/session', util.checkSession);

app.get('/logout', util.destroySession);

app.post('/capsules/inProgress', util.isLoggedOn, util.inProgress);

app.post('/create', util.isLoggedOn, util.createCapsule);

app.put('/edit', util.isLoggedOn, util.editCapsule);

app.post('/delete', util.isLoggedOn, util.deleteCapsule);

app.put('/bury', util.isLoggedOn, util.buryCapsule);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
