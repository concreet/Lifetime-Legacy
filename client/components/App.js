angular.module('app', [])
.controller('AppCtrl', function($scope, Caps, Auth, Contacts) {

  this.signedIn = false;
  this.userId = '';
  this.email = '';
  this.contacts = [];


  this.setUser = function(err, user) {
    // console.log('user', user);

    if (user._id) {
      this.signedIn = true;
      this.userId = user._id;
      this.email = user.email;
      this.init(user._id);
    }
  }.bind(this);

  Auth.sessionCheck(this.setUser);
  // Auth.sessionCheck(this.setUser);
  // All capsules belonging to a user.
  // Filtering done on backend.
  this.capsData = [];

  // Initial GET request upon successful sign in.
  // id passed from Landing.js signin

  this.init = (id) => {
    // console.log(this.email, '====ljzlxcvjlxvjld;s=');
    // console.log(this.email, this.userId, this.signedIn, '????')
    Contacts.getContacts(this.email, (err, data)=>{
      this.contacts = data;
    })

    Caps.filterCaps('all', id, this.email, (err, allCaps) => {
  	  if (err) {
  	    throw new Error(err);
  	  } else {
        this.capsData = allCaps;
      }
    });
  }
})
.component('app', {
  controller: 'AppCtrl',
  templateUrl: '../templates/app.html'
})
