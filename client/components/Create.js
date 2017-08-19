angular.module('app')
.controller('CreateCtrl', function($scope, $sce, Caps) {

  this.capsuleId = $scope.$ctrl.capsuleId;
  this.capsuleToEdit = $scope.$ctrl.capsuleToEdit;
  this.capIndex = null;
  this.capsuleNameModel = '';
  $scope.date = '';
  $scope.recipient = '';

  this.clearMomentoValues = () => {
    $scope.momentoName = '';
    $scope.input = '';
    this.momentoVideoKey = '';
  }

  //Initialize moment values on $scope
  this.clearMomentoValues();

  this.saveCapsule = (capObj, newMomento) => {
    Caps.saveCap(capObj, (err, res) => {
      if (err) {
        if(newMomento){
          this.currentCap.shift();
        }
        throw new Error(err);
      } else {
        this.clearMomentoValues();
      }
    });
  }

  this.capsuleChange = (input, addMomento) => {
    if ($scope.$ctrl.editingViewCapsule) {
      if(addMomento) {
        this.capsuleToEdit.contents.unshift({input: input, name: $scope.momentoName, videoKey: this.momentoVideoKey});
      }
      var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.capsuleToEdit.contents};
      this.saveCapsule(capObj, false);
    } else {
      if(addMomento) {
        this.currentCap.unshift({input: input, name: $scope.momentoName, videoKey: this.momentoVideoKey});
      }
      var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.currentCap};
      this.saveCapsule(capObj, true);
    }
  }

  this.setCapsuleName = (name) => {


    var capName;
    if(name) {
      capName = name;
    } else {
      capName = document.getElementById('capsuleInput').value;
    }
    if(capName !== null && capName !== undefined && capName !== '') {
      console.log(capName, '??')
      Caps.createCap($scope.$ctrl.userId, capName, (err, capsuleId) => {
        if (err) {
          console.log('You dun screwed up');
          throw new Error(err);
        } else {
          //this.capsuleName = '';
          this.capsuleId = capsuleId;
          //this.capsuleToEdit = {};
          //this.named = false;
          //this.view = false;
        }
      })
      $scope.$ctrl.capsuleName = capName;
      //$scope.$ctrl.editedCapsuleName = capName;
      $scope.$ctrl.named = true;
      //this.capsuleChange(null, false);
    }
  }

  this.getIndex = (index) => {
    this.capIndex = index;
  }

  this.editMomento = (input, momentoName) => {
    console.log(this.capIndex, input, momentoName);
    $scope.momentoName = momentoName;
    if ($scope.$ctrl.editingViewCapsule) {
      $scope.$ctrl.capsuleToEdit.contents[this.capIndex] = {input: input, name: $scope.momentoName, videoKey: this.momentoVideoKey};
      var capObj = {capsuleName: $scope.$ctrl.editedCapsuleName, capsuleId: $scope.$ctrl.capsuleId, capsuleContent: $scope.$ctrl.capsuleToEdit.contents};
      this.saveCapsule(capObj, false);
    } else {
      this.currentCap[this.capIndex] = {input: input, name: $scope.momentoName, videoKey: this.momentoVideoKey};
      var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.currentCap};
      this.saveCapsule(capObj, false);
    }
    this.capIndex = null;
  }

  this.deleteMomento = (index) => {
    var deletThis = confirm('Are you sure you want to delete this momento?');
    if(deletThis) {
      if ($scope.$ctrl.editingViewCapsule) {
        $scope.$ctrl.capsuleToEdit.contents.splice(index, 1);
        var capObj = {capsuleName: $scope.$ctrl.editedCapsuleName, capsuleId: $scope.$ctrl.capsuleId, capsuleContent: $scope.$ctrl.capsuleToEdit.contents};
        this.saveCapsule(capObj, false);
      } else {
      	this.currentCap.splice(index, 1);
        var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.currentCap};
        this.saveCapsule(capObj, false);
      }
    }
  }

  this.saveForLater = () => {
    var saveProgress = confirm('Save any changes and view your capsules?');
    if(saveProgress) {
      if ($scope.$ctrl.editingViewCapsule) {
        var capObj = {capsuleName: $scope.$ctrl.editedCapsuleName, capsuleId: $scope.$ctrl.capsuleId, capsuleContent: $scope.$ctrl.capsuleToEdit.contents};
        this.saveCapsule(capObj, false);
      } else {
        var capObj = {capsuleName: $scope.$ctrl.capsuleName, capsuleId: this.capsuleId, capsuleContent: this.currentCap};
        this.saveCapsule(capObj, false);
      }
      this.clearMomentoValues();
      $scope.$ctrl.viewToggle(true);
    }
  }

  this.bury = (years, months, days, recipient) => {

    var date = [0, 0, 0]
    date[0] = Number(years) || 0;
    date[1] = Number(months) || 0;
    date[2] = Number(days) || 0;

    console.log(date, years, months, days)

    var capObj;
    if ($scope.$ctrl.editingViewCapsule) {

      capObj = {
        capsuleId: this.capsuleId,
        capsuleContent: this.capsuleToEdit.contents,
        unearthDate: date,
        recipient: recipient
      };

    } else {
      capObj = {
        capsuleId: this.capsuleId,
        capsuleContent: this.currentCap,
        unearthDate: date,
        recipient: recipient
      };
    }

    Caps.bury(capObj, (err, res) => {
      if (err) {
        this.currentCap.shift();
        throw new Error(err);
      } else {
        $scope.$ctrl.view = true;
        $scope.$ctrl.capsuleName = '';
        $scope.input = '';
        $scope.date = '';
        this.clearMomentoValues();
        this.recipient = '';
        this.currentCap = [];
        $scope.$ctrl.viewToggle(true);
     }
    });
  }

  $scope.showMomentoVideo = (momento) => {
    if(momento.videoKey) { 
      return true;
    } else {
      return false;
    }
  }

  $scope.getMomentoVideoUrl = (momento) => {
    if(momento.videoKey) {
      return $sce.trustAsResourceUrl('https://s3.amazonaws.com/bchilds-greenfield-legacy-timecapsule/' + momento.videoKey);
    } else { 
      return '';
    }
  }

  this.momentoDetails = (momento) => {
    // Work around for rendering dynamic content to modal by using jquery
    //momento.videoKey
    if(momento.videoKey) {
        $('#viewMomentoModal').html(
          `<div class="modal-dialog" id="viewModalDialog">
          <div class="modal-content" id="viewModalContent">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" ng-click="stopVideos()">&times;</button>
              <h4 class="modal-title" id="momentoDetails">${$scope.$ctrl.capsuleName}</h4>
            </div>
            <div class="viewModal-body" id="viewModalBody">
              <div id="momentoDetails">
                <h4>${momento.name}</h4>
                <p id="viewDetails">${momento.input}</p>
                <video id="view-video" controls autoplay>
                  <source src="https://s3.amazonaws.com/bchilds-greenfield-legacy-timecapsule/${momento.videoKey}">
                </video>
              </div>
            </div>
          </div>
        </div>`
        )
    } else {
      //no video, no S3 needed for display
      $('#viewMomentoModal').html(
        `<div class="modal-dialog" id="viewModalDialog">
        <div class="modal-content" id="viewModalContent">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title" id="momentoDetails">${$scope.$ctrl.capsuleName}</h4>
          </div>
          <div class="viewModal-body" id="viewModalBody">
            <div id="momentoDetails">

              <h4>${momento.name}</h4>
              <p id="viewDetails">${momento.input}</p>

            </div>
          </div>
        </div>
      </div>`
      )
    }
  }
})
.component('createPage', {
  controller: 'CreateCtrl',

  bindings: {
    userId: '<',
    capsuleId: '<',
    capsuleToEdit: '<',
    editingViewCapsule: '<',
    view: '=',
    named: '=',
    editedCapsuleName: '=',
    viewToggle: '<',
    currentCap: '=',
    capsuleName: '=',
    deleteCap: '=',
    contacts: '=',
  },

 templateUrl: '../templates/create.html'

})
