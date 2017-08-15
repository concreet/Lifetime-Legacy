angular.module('app')
.controller("VideoCtrl", ["$scope", "$sce", "VideoMedia", function($scope, $sce, UserMedia) {
    
    $scope.captureVideo = function() {
      VideoMedia.get().then(function(stream) {
        console.log("starting video", stream);
        window.stream = stream; // stream available to console for dev
        if (window.URL) {
          console.log("using window.URL");
          $scope.videostream = $sce.trustAsResourceUrl(
            window.URL.createObjectURL(stream)
          );
        } else {
          $scope.videostream = $sce.trustAsResourceUrl(stream);
        }
      });
    };
  }
])

.component('audioVideoRecord', {
  controller: 'VideoCtrl',

  bindings: {

  },

  templateUrl: 
})



