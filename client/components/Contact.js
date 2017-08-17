angular.module('app')
.controller('ContactCtrl', function($scope, Contacts) {

  this.selectedContact = function(contact) {
    $scope.$ctrl.selectedContacts.push(contact);
    console.log('selectedContacts', $scope.$ctrl.selectedContacts);
  }

  this.removeContacts = function(contact) {
    var accepted = confirm('Do you really want to remove '+ contact.name + ' from your contacts?')
    if (accepted) {
      Contacts.removeContact($scope.$ctrl.email, contact, ()=>{
        console.log('removed contact')
        $scope.$ctrl.renderContacts();
      })
    }
  }

})
.component('contact', {
  controller: 'ContactCtrl',
  bindings: {
    contact: '=',
    selectedContacts: '=',
    email: '=',
    renderContacts: '='
  },
  templateUrl: '../templates/contact.html'
})
