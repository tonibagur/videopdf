var videoFactory = angular.module('Factory', []);

videoFactory.factory('Video', function() {
     
    var video = {};
 
    video.setEnlace = function(data) {
           video.enlace = data;
        };
 
    return video;
});