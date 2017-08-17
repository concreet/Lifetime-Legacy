angular.module('app')
.factory('Contacts', function($http) {

  // var STORE_URL = 'http://localhost:3000';
  var STORE_URL = '';

  const addContact = function(userEmail, contactObj ,cb) {

    $http({
      url: `${STORE_URL}/addContact`,
      method: 'POST',
      data: { email: userEmail, contact: contactObj},
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

  const removeContact = function(userEmail, contactObj, cb) {
    $http({
      url: `${STORE_URL}/removeContact`,
      method: 'POST',
      data: { email: userEmail, contact: contactObj},
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


  const getContacts = function(email, cb) {

    $http({
        url: `${STORE_URL}/getContacts`,
        method: 'POST',
        data: { email: email},
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

  }

  return {
    addContact: addContact,
    removeContact: removeContact,
    getContacts: getContacts
  };

});
