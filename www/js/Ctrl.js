var app = angular.module('Controller', []);

app.controller('mainController', ['$scope','Video', function($scope, Video) {

	//http://jsfiddle.net/seikichi/RuDvz/2/	

    var url = './linked.pdf';

	  //
	  // Asynchronous download PDF
	  //
	  PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
	    //
	    // Fetch the first page
	    //
	    pdf.getPage(1).then(function getPageHelloWorld(page) {
	    	
	      var scale = 1.5;
	      var viewport = page.getViewport(scale);

	      //
	      // Prepare canvas using PDF page dimensions
	      //
	      var $canvas = $('#thecanvas');
    	  var canvas = $canvas.get(0);
	      var context = canvas.getContext('2d');
	      canvas.height = viewport.height;
	      canvas.width = viewport.width;

	      var $pdfContainer = $("#pdfContainer");
    	  $pdfContainer.css("height", canvas.height + "px")
      		.css("width", canvas.width + "px");

	      //
	      // Render PDF page into canvas context
	      //
	      var renderContext = {
	        canvasContext: context,
	        viewport: viewport
	      };

	      page.render(renderContext);
	      setupAnnotations(page, viewport, canvas, $('.annotationLayer'));
  });

  function setupAnnotations(page, viewport, canvas, $annotationLayerDiv) {
    var canvasOffset = $(canvas).offset();
    var promise = page.getAnnotations().then(function (annotationsData) {
      viewport = viewport.clone({
        dontFlip: true
      });

      for (var i = 0; i < annotationsData.length; i++) {
        var data = annotationsData[i];
        // podem modificar els atributs que sigui en aquest punt
        Video.setEnlace(data.url);
        data.url = '#/link'
        var annotation = PDFJS.Annotation.fromData(data);
        if (!annotation || !annotation.hasHtml()) {
          continue;
        }

        var element = annotation.getHtmlElement(page.commonObjs);
        
        data = annotation.getData();
        var rect = data.rect;
        var view = page.view;
        rect = PDFJS.Util.normalizeRect([
          rect[0],
          view[3] - rect[1] + view[1],
          rect[2],
          view[3] - rect[3] + view[1]]);
        element.style.left = (canvasOffset.left + rect[0]) + 'px';
        // toquem la posicio vertical aqui (si cal)
        element.style.top = (canvasOffset.top + rect[1]) + 'px';
        element.style.position = 'absolute';

        var transform = viewport.transform;
        var transformStr = 'matrix(' + transform.join(',') + ')';
        CustomStyle.setProp('transform', element, transformStr);
        var transformOriginStr = -rect[0] + 'px ' + -rect[1] + 'px';
        CustomStyle.setProp('transformOrigin', element, transformOriginStr);

        if (data.subtype === 'Link' && !data.url) {
          // In this example,  I do not handle the `Link` annotations without url.
          // If you want to handle those annotations, see `web/page_view.js`.
          continue;
        }
        $annotationLayerDiv.append(element);
      }
    });
    return promise;
  }
});


}]);