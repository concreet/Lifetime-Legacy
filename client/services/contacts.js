angular.module('app')
.factory('Contacts', function($http) {

  // var STORE_URL = 'http://localhost:3000';
  var STORE_URL = '';

  const addContact = function(userId, contact ,cb) {

    $http({
      url: `${STORE_URL}/addContact`,
      method: 'POST',
      data: {userId: userId, contact: contact},
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

  return {
    addContact: addContact,
  };
})
