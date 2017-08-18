angular.module('app')
.controller("VideoCtrl", ["$scope", "$sce", "VideoMedia", 
  function($scope, $sce, VideoMedia) {

    //*****
    //insert AWS config here

    var albumBucketName = 'bchilds-greenfield-legacy-timecapsule';

    AWS.config.region = 'us-east-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:d2bcb54e-2e0d-49e8-b4fa-ad7a899e5aaf',
    });

    // AWS.config.update({
    //   // credentials: new AWS.CognitoIdentityCredentials({
    //   //   // region: 'us-east-1',
    //   //   IdentityPoolId: IdentityPoolId
    //   // }),
    //   accessKeyId: window.AWS_ACCESS_KEY,
    //   secretAccessKey: window.AWS_SECRET_KEY
    // });

    //init logging

    var s3 = new AWS.S3({
      apiVersion: '2006-03-01',
      params: {Bucket: albumBucketName}
    });
    //*****

    this.recordedVideo = document.querySelector('video#cap-video');
    this.mediaRecorder;
    this.recordedBlobs = [];
    this.recButton = document.querySelector('button#addVideo');


    this.getScope = () => {
      console.log($scope.$ctrl)
    }

    this.getVideos = () => {
      //will be getObject
      //takes in something from $scope to determine which video to get
      // s3.listObjectsV2({
      //   MaxKeys: 5,
      // }, function(err, data){
      //   if(err) console.log(err)
      //   console.log('DATA: ', data)
      // })
      console.log('Scope: ', $scope.$ctrl.capsule)
    }

    this.handleDataAvailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    }

    this.startVideo = () => {
      var constraints = {
        audio: true,
        video: true
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(VideoMedia.handleSuccess).catch(VideoMedia.handleError)
        .then(this.startRecording);

      this.recordedVideo.addEventListener('error', function(ev) {
        console.error('MediaRecording.recordedMedia.error()');
        alert('Your browser can not play\n\n' + this.recordedVideo.src
          + '\n\n media clip. event: ' + JSON.stringify(ev));
      }, true);
    } 

    this.startRecording = () => {
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
        this.mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e) {
        console.error('Exception while creating MediaRecorder: ' + e);
        alert('Exception while creating MediaRecorder: '
          + e + '. mimeType: ' + options.mimeType);
        return;
      }
      console.log('Created MediaRecorder', this.mediaRecorder, 'with options', options);
      this.mediaRecorder.onstop = VideoMedia.handleStop;
      this.mediaRecorder.ondataavailable = this.handleDataAvailable;
      this.mediaRecorder.start(10); // collect 10ms of data
      console.log('MediaRecorder started', this.mediaRecorder);
    }

    this.stopRecording = () => {
      this.mediaRecorder.stop();
      console.log('Recorded Blobs: ', this.recordedBlobs);
      this.recordedVideo.controls = true;
      var superBuffer = new Blob(this.recordedBlobs, {type: 'video/webm'});
      this.recordedVideo.src = window.URL.createObjectURL(superBuffer);
    }

    this.runVid = () => {
      if(this.recButton.textContent === 'Record Video'){
        this.recordedBlobs = [];
        this.startVideo();
        this.recButton.textContent = 'Stop';
      } else if(this.recButton.textContent === 'Stop'){
        this.stopRecording();
        this.recButton.textContent = 'Record Video';
      }
    }

    this.uploadToS3 = () => {
      if(this.recordedBlobs.length > 0) {
        let file = new Blob(this.recordedBlobs, {type: 'video/webm'});
        file.lastModifiedDate = new Date();
        var dateString = file.lastModifiedDate.toString();
        dateString = dateString.replace(/\s+/g,"");
        dateString = dateString.replace(/:|-/g,"");
        dateString = dateString.replace("(","")
        dateString = dateString.replace(")","");
        file.name = $scope.$ctrl.capsule.capsuleId + dateString;
        var params = {Body: file, Key: file.name};
        s3.upload(params, (err, data) => {
          // console.log(err, data);   
          this.recButton.textContent = 'Record Video';
          $scope.$ctrl.capsule.momentoVideoKey= data.key;
          
          // if($scope.$ctrl.capsule.editingViewCapsule){
          //   //is momento in old capsule
          // } else {
          //   //is new momento in a new capsule
          // }
          //data.key contains the unique key for this file
        });
      }
    }

  } //end function
])

.component('videoCtrl', {
  controller: 'VideoCtrl',

  //will need capsule ID and momento index
  //capsule will either be capsuleToEdit or... currentCap?
  bindings: {
    capsule: '=',
  },

  templateUrl: '../templates/videoPlayer.html'
})



//https://codepen.io/Xeoncross/pen/WbYggJ?editors=1010