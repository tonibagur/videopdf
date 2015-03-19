var ctrl = angular.module('LinkController', []);

ctrl.controller('videoController', ['$scope','Video', function($scope, Video) {

	// busquem el video per id i li canviem l'atribut src
	var video = document.getElementById('videopanel');
	video.src = Video.enlace;

	// funcio nomes necessaria per a apps
	// android nomes mostra els controls a l'inici i al final del video
	// fa que el video s'aturi i continui en fer click
	$scope.toggleControls = function() {
		if (video.paused) {
			video.play();
		} else {
	 		video.pause();
	 	}
	}
}]);
