angular.module('app')
.factory('Caps', function($http) {

  // var STORE_URL = 'http://localhost:3000';
  var STORE_URL = '';

  const filterCaps = function(filterMethod, userId, userEmail, cb) {

    $http({
      url: `${STORE_URL}/capsules/${filterMethod}`,
      method: 'POST',
      data: {userId: userId, email: userEmail },
      contentType: 'application/json',
      withCredentials: true
    })
    .then(function(res) {
      // gets all the capsules return matching the filer
      cb(null, res.data);
    })
    .catch(function(err) {
      cb(err);
    });
  };

  const getCapsBySecret = function(secret, userEmail, cb) {
    $http({
      url: `${STORE_URL}/secretCapsules`,
      method: 'POST',
      data: {secret: secret, email: userEmail },
      contentType: 'application/json',
      withCredentials: true
    })
    .then(function(res) {
      // gets all the capsules return matching the filer
      cb(null, res.data);
    })
    .catch(function(err) {
      cb(err);
    });
  }

//change the angular front end so that it takes a capsule name
  const createCap = function(userId, capsuleName, cb) {

    $http({
      url: `${STORE_URL}/create`,
      method: 'POST',
      data: {userId: userId, capsuleName: capsuleName},
      contentType: 'application/json',
      withCredentials: true
    })
    .then(function(res) {
      // Returns the newly created capsules' id
      cb(null, res.data);
    })
    .catch(function(err) {
      cb(err);
    });

  };

//change the angular front end so it wont let you change if capsule name is empty
  const saveCap = function(inputObj, cb) {

    $http({
      url: `${STORE_URL}/edit`,
      method: 'PUT',
      contentType: 'application/json',
      data: inputObj,
      withCredentials: true
    })
    .then(function(res) {
      // doesn't actually get anything back
      cb(null, res.data);
    })
    .catch(function(err) {
      cb(err);
    });

  };

//change angular front end so that the input actually takes in an array of contact
  const bury = function(input, cb) {
    console.log('input', input);

    $http({
      url: `${STORE_URL}/bury`,
      method: 'PUT',
      contentType: 'application/json',
      data: input,
      withCredentials: true
    })
    .then(function(res) {
      // doesn't actually get anything back
      cb(null, res.data);
    })
    .catch(function(err) {
      cb(err);
    });

  };

  const deleteCap = function(inputObj, cb) {

    $http({
      url: `${STORE_URL}/delete`,
      method: 'POST',
      contentType: 'application/json',
      data: inputObj,
      withCredentials: true
    })
    .then(function(res) {
      // doesn't actually get anything back
      cb(null, res.data);
    })
    .catch(function(err) {
      cb(err);
    });

  };

  return {
    filterCaps: filterCaps,
    saveCap: saveCap,
    bury: bury,
    createCap: createCap,
    deleteCap: deleteCap,
    getCapsBySecret: getCapsBySecret
  };
})
