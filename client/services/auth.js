angular.module('app')
.factory('Auth', function($http) {

  var STORE_URL = 'http://localhost:3000';

  const signin = function(userObj, cb) {

    var header = {'Content-Type': 'application/json'};

    $http({
      method: 'POST',
      url: `${STORE_URL}/signin`,
      headers: header,
      data: userObj,
      withCredentials: true 
    })
    .then(function(res) {
      //console.log('anything back with res session?', res)
      // gets the user id back from the server
      cb(null, res.data);
    })
    .catch(function(err) {
      console.log('error',err)
      cb(err);
    });

  };

  const signup = function(userObj, cb) {

  	var header = {'Content-Type': 'application/json'};

  	$http({
  	  url: `${STORE_URL}/signup`,
  	  method: 'POST',
  	  data: userObj,
  	  headers: header,
      withCredentials: true 
  	})
  	.then(function(res) {
      // doesn't actually get anything back
  	  cb(null, res.data);
  	})
  	.catch(function(err) {
      console.log('whoops', err)
  	  cb(err);
  	});
  }

  const sessionCheck = function(cb) {
    //var header = {'Content-Type': 'application/json'};

    $http({
      url: `${STORE_URL}/session`,
      method: 'GET',
      withCredentials: true 
    })
    .then(function(res) {
      // doesn't actually get anything back
      // console.log(res.data);
      cb(null, res.data);
    })
    .catch(function(err) {
      console.log('whoops', err)
      cb(err);
    });

  }

  const logout = function(cb) {
    $http({
      url: `${STORE_URL}/logout`,
      method: 'GET',
      withCredentials: true 
    })
    .then(function(res) {
      // doesn't actually get anything back
      cb(null, res.data);
    })
    .catch(function(err) {
      console.log('whoops', err)
      cb(err);

    })
  }

  return {
    signin: signin,
    signup: signup,
    sessionCheck: sessionCheck,
    logout: logout
  };
})
