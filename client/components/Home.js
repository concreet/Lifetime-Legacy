angular.module('app')
.controller('HomeCtrl', function($scope, Caps, Auth, Contacts) {

  this.view = true;
  this.editingViewCapsule = false;
  this.editedCapsuleName = '';
  this.capsuleId = 0;
  this.capsuleToEdit = {};
  this.currentCap = [];
  this.named = false;
  this.addContactPopupBool = true;
  this.addContactName = '';
  this.addContactEmailOrPhrase = '';
  this.valueEmailOrPhrase = 'Email';
  this.selectedContacts = [];

  //fake data


  this.renderContacts = function() {
    Contacts.getContacts(this.email, (err, data)=>{
      $scope.$ctrl.contacts = data;
    })
  }.bind(this)

  this.compareContacts = function(cb) {
    for (var contact of $scope.$ctrl.contacts) {
      console.log(contact.name);
      if (this.addContactName === contact.name) {
        alert('Contact name already exists')
        cb(err)
      }
    }
    cb()
  }

  this.handleFilter = function(event) {

    
    Caps.filterCaps(event.target.id, $scope.$ctrl.userId, this.email, (err, res) => {
      if (!err) {
        $scope.$ctrl.capsData = res;
      } else {
        throw new Error(err);
      }
    });
  }

  this.addContact = function() {
    this.compareContacts((err) => {
      if (!err) {
        var field = this.valueEmailOrPhrase.toLowerCase();
        var contactObj = {}
        contactObj.name = this.addContactName,
        contactObj[field] = this.addContactEmailOrPhrase

        Contacts.addContact($scope.$ctrl.email, contactObj, ()=>{
          console.log('callback!')
          this.renderContacts();
        });
        this.addContactPopupBool = !this.addContactPopupBool;
      }
    })
  }

  this.toggleEmailOrPhrase = function(e) {
    console.log(e.target.attributes[0].value)
    // e.preventDefault();
    this.valueEmailOrPhrase = e.target.attributes[0].value;
    this.addContactEmailOrPhrase = '';
    this.addContactName = '';

  }

  this.addContactPopup = function(event) {
    this.addContactEmailOrPhrase = '';
    this.addContactName = '';
    this.addContactPopupBool = !this.addContactPopupBool;
  }

  this.editCapsule = (capsule) => {
    this.capsuleToEdit = capsule;
    this.capsuleToEdit.contents = capsule.contents;
    this.capsuleId = capsule._id;
    this.capsuleName = capsule.capsuleName;
    this.editingViewCapsule = true;
    this.editedCapsuleName = capsule.capsuleName;
    this.named = true;
    this.view = false;
  }

  this.toggleToCreate = () => {
    if (this.view) {
      this.view = false;
      // Caps.createCap($scope.$ctrl.userId, 'test', (err, capsuleId) => {
      //   if (err) {
      //     console.log('You dun screwed up');
      //     throw new Error(err);
      //   } else {
      //     this.capsuleName = '';
      //     this.capsuleId = capsuleId;
      //     this.capsuleToEdit = {};
      //     this.named = false;
      //     this.view = false;
      //   }
      // })
    }
    // } else {
    //   var saveProgress = confirm('Are you sure you want to start a new capsule?');
    //   if(saveProgress) {
    //     Caps.createCap($scope.$ctrl.userId, 'test', (err, capsuleId) => {
    //       if (err) {
    //         console.log('You dun screwed up');
    //         throw new Error(err);
    //       } else {
    //         this.named = false;
    //         this.capsuleName = '';
    //         this.currentCap = [];
    //         this.capsuleId = capsuleId;
    //         this.capsuleToEdit = {};
    //         this.named = false;
    //         this.view = false;
    //         this.editingViewCapsule = false;
    //         console.log(':D')
    //       }
    //     })
    //   }
    // }
  }


  this.toggleToView = function(buried) {

    // check if the page is in "view" or "create"
    if(!this.view) {

      // if (!buried) {
      //   var saveProgress = confirm('Are you sure you want to leave this capsule?\nWe\'ll save this one if you do.');
      // } else {
      //   var saveProgress = true;
      // }

      // if (saveProgress) {
        Caps.filterCaps('all', this.userId, this.email, (err, res) => {
          if (!err) {
            this.capsData = res;
            console.log(this.capsData, 'need to check this');
          } else {
            throw new Error(err);
          }
        });
        this.capsuleName = '';
        this.currentCap = [];
        this.editingViewCapsule = false;
        this.named = false;
        this.view = true;
      }
    // } else {
      // Caps.filterCaps('all', $scope.$ctrl.userId, this.email, (err, res) => {
      //   if (!err) {
      //     $scope.$ctrl.capsData = res;
      //   } else {
      //     throw new Error(err);
      //   }
      // });
    // }
  }.bind(this)


  this.deleteCap = (capId, index) => {
    var saveProgress = confirm('Remove this capsule?...forever??');

    if(saveProgress) {

      var capObj = {capsuleId: capId}
      Caps.deleteCap(capObj, (err, res) => {
        if (err) {
          throw new Error(err);
        } else {
          //this.toggleToView(true);
          this.init(this.userId);
        }
      });
    }
  }

  this.logOut = () => {
    Auth.logout((err, data) => {
      if (data) {
        console.log('successfully logged out.');
      }
    })
    $scope.$ctrl.signedIn = false;
  }

  // this.init = (id) => {
  //   // this.renderContacts();
  // }

})
.component('homePage', {
  controller: 'HomeCtrl',
  bindings: {
    userId: '<',
    initialData: '=',
    first: '=',
    editedCapsuleName: '<',
    signedIn: '=',
    email: '<',
    capsData: '=',
    contacts: '=',
    init: '<'
  },
  templateUrl: '../templates/home.html'
})
