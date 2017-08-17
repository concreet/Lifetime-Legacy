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

    this.startVideo = () => {
      var constraints = {
        audio: true,
        video: true
      };
      var recordedVideo = document.querySelector('video#cap-video')

      navigator.mediaDevices.getUserMedia(constraints)
        .then(VideoMedia.handleSuccess).catch(VideoMedia.handleError)
        .then(this.startRecording);

      recordedVideo.addEventListener('error', function(ev) {
        console.error('MediaRecording.recordedMedia.error()');
        alert('Your browser can not play\n\n' + recordedVideo.src
          + '\n\n media clip. event: ' + JSON.stringify(ev));
      }, true);
    } 

    this.startRecording = () => {
      var recordedBlobs, mediaRecorder
      recordedBlobs = [];
      var options = {mimeType: 'video/webm;codecs=vp9'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {mimeType: 'video/webm;codecs=vp8'};
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported');
          options = {mimeType: 'video/webm'};
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported');
            options = {mimeType: ''};
          }
        }
      }
      try {
        mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e);
        alert('Exception while creating MediaRecorder: '
          + e + '. mimeType: ' + options.mimeType);
        return;
      }
      console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      mediaRecorder.onstop = handleStop;
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(10); // collect 10ms of data
      console.log('MediaRecorder started', mediaRecorder);
    }

    this.runVid = () => {
      var recButton = document.querySelector('button#addVideo')
      if(recButton.textContent === 'Record Video'){
        this.startVideo();
        //now start recording somehow
        
        recButton.textContent = 'Stop';
      } else if(recButton.textContent === 'Stop'){

      }
    }
  } //end function
])

.component('videoCtrl', {
  controller: 'VideoCtrl',

  //will need capsule ID and momento index
  bindings: {

  },

  templateUrl: '../templates/videoPlayer.html'
})



//https://codepen.io/Xeoncross/pen/WbYggJ?editors=1010