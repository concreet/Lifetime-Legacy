angular.module('app')
.controller('ContactCtrl', function($scope, Contacts) {

  // this.username = '';
  // this.password = '';
  // this.butnClicked = true;
  // this.signup = true;
  // this.error = false;
  // this.sisu = 'Need to Sign Up?';


})
.component('contact', {
  controller: 'ContactCtrl',
  bindings: {
    contact: '='
  },
  templateUrl: '../templates/contact.html'
})
