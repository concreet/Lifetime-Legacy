angular.module('app')
.controller("VideoCtrl", ["$scope", "$sce", "VideoMedia", 
  function($scope, $sce, VideoMedia) {

    //*****
    //insert AWS config here
    var albumBucketName = 'bchilds-greenfield-legacy-timecapsule';
    var bucketRegion = 'us-east-2'; // Region;
    var IdentityPoolId = 'us-east-2:e876f515-6fe2-4e44-930b-600544fbd60b';

    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
      })
    });

    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: albumBucketName}
    });
    //*****

    
    this.captureVideo = function() {
      VideoMedia.get().then(function(stream) {
        console.log("starting video", stream);
        window.stream = stream; // stream available to console for dev
        if (window.URL) {
          console.log("using window.URL:  ", window.URL);
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

.component('videoCtrl', {
  controller: 'VideoCtrl',

  //will need capsule ID and momento index
  bindings: {

  },

  templateUrl: '../templates/videoPlayer.html'
})



//https://codepen.io/Xeoncross/pen/WbYggJ?editors=1010