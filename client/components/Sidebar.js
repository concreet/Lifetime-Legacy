angular.module('app')
.controller('SidebarCtrl', function($scope, Contacts) {

  // this.username = '';
  // this.password = '';
  // this.butnClicked = true;
  // this.signup = true;
  // this.error = false;
  // this.sisu = 'Need to Sign Up?';


  // this.handleSignIn = (email, password) => {
  //
  //   this.error = false;
  // 	var obj = {email: email, password: password};



  // this.toggle = () => {
  //   this.error = false;
  // 	this.signup = !this.signup;
  //   this.style = !this.style;
  // 	if (this.signup) {
  // 	  this.sisu = 'Need to Sign Up?';
  // 	} else {
  // 	  this.sisu = 'Have an account? Sign In!';
  // 	}
  // }

})
.component('sidebar', {
  controller: 'SidebarCtrl',
  bindings: {
  	signedIn: '=',
    userId: '=',
    init: '=',
    email: '='
  },
  templateUrl: '../templates/sidebar.html'
})
