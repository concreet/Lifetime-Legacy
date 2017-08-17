angular.module('app')
.factory("VideoMedia", function() {


  const handleSuccess = function(stream) {
    var gumVideo = document.querySelector('video#gum');
    console.log('getUserMedia() got stream: ', stream);
    window.stream = stream;
    if (window.URL) {
      gumVideo.src = window.URL.createObjectURL(stream);
    } else {
      gumVideo.src = stream;
    }
  }

  const handleError = function(error) {
    console.log('navigator.getUserMedia error: ', error);
  }


  return {
    handleSuccess: handleSuccess,
    handleError: handleError,
  }



});
