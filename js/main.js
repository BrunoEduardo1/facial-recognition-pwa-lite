 document.addEventListener("DOMContentLoaded", function(event) {

    $('#camButton').on('click', function() {
    	console.log("Abrir camera");

    	var header = "Conceda permissão a câmera";
		
		var content = '<div class="row">'+
						  '<div class="col-12 mx-auto text-center" id="videoDiv">'+
						    '<video id="video" class="img-thumbnail" width="400" height="260" autoplay muted></video>'+
						    '<div class="position-absolute d-flex" id="canvas">'+
						    	'<canvas id="canvasElement" width="400" height="260"></canvas>'+
						    '</div>'+
						  '</div>'+
						'</div>';
		
		doModal('idMyModal', header, content, '', '');

    	const video = document.getElementById('video');
	    var canvas = document.getElementById('canvasElement');
	    var context = canvas.getContext('2d');
    	
    	var tracker = new tracking.ObjectTracker('face');
	    tracker.setEdgesDensity(0.1);
	    tracker.setStepSize(2);
	    tracker.setInitialScale(4);

	    tracking.track('#video', tracker, { camera: true });

	    tracker.on('track', function(event) {
	        context.clearRect(0, 0, canvas.width, canvas.height);

	        event.data.forEach(function(rect) {
	            context.strokeStyle = '#4074c9';
	            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
	            context.lineWidth = 3;
	        });
	    });
		
    });

    $('#uploadButton').on('click', function() {
    	console.log("Submeter arquivo");

    	var header = "Faça o envio da imagem";
		var content = '<div class="row">'+
						  '<div class="col-12 mx-auto text-center" id="imgDiv">'+
						    '<div id="canvasImgForm"><canvas id="canvasElement" width="1" height="1"></canvas></div>'+
						    '<img id="myImg" class="img-thumbnail" width="400" height="260" src=""/>'+
						    '<div id="uploadForm"><label class="btn btn-primary" for="myFileUpload">'+
								'<input id="myFileUpload" type="file" accept=".jpg, .jpeg, .png" style="display:none">'+
								'Escolher Arquivo'+
							'</label></div>'+
						  '</div>'+
						'</div>';

		doModal('idMyModal', header, content, '', '');

		$('#myFileUpload').on('change', async function() {

			const imgFile = document.getElementById('myFileUpload').files[0];

			$('#uploadForm').remove();
			$('#canvasImgForm' ).addClass('position-absolute');

			// create an HTMLImageElement from a Blob
			const img = await bufferToImage(imgFile);
			
			document.getElementById('myImg').src = img.src;
			document.getElementById('myImg').width = img.width;
			document.getElementById('myImg').height = img.height;
			document.getElementById('canvasElement').width = img.width;
			document.getElementById('canvasElement').height = img.height;
			//Load models for face recognition net
		 	const video = document.getElementById('video');
		    var canvas = document.getElementById('canvasElement');
		    var context = canvas.getContext('2d');
	    	
	    	var tracker = new tracking.ObjectTracker('face');
		    tracker.setStepSize(2);

		    tracking.track('#myImg', tracker);

		    tracker.on('track', function(event) {
		    	if (event.data.length === 0){
				 	console.log('Nenhm rosto encontrado');
				 	$('#imgDiv').append( '<p class="mt-2 title"><i class="fas fa-user-slash"></i> Nenhm rosto identificado</p>' );
		    	} else {
			        context.clearRect(0, 0, canvas.width, canvas.height);

			        event.data.forEach(function(rect) {
			            context.strokeStyle = '#fff654';
			            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
			            context.lineWidth = 4.5;
			        });
		        }
		    });

		});

    });
	function startVideo() {
	  navigator.getUserMedia(
	    { video: {} },
	    stream => video.srcObject = stream,
	    err => console.error(err)
	  )
	}
	function doModal(placementId, heading, content, strSubmitFunc, btnText)
	{
	    var html =   '<div class="modal fade" id="modalChoose" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">'+
					    '<div class="modal-dialog modal-dialog-centered" role="document">'+
					      '<div class="modal-content">'+
					        '<div class="modal-header">'+
					          '<h5 class="modal-title title" id="modalLongTitle">'+heading+'</h5>'+
					          '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
					            '<span aria-hidden="true">&times;</span>'+
					          '</button>'+
					        '</div>'+
					        '<div class="modal-body">'+
					          	content+
					        '</div>'+
					        '<div class="modal-footer">'+
					          '<button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>'+
					          '<!-- <button type="button" class="btn btn-primary">Salvar</button> -->'+
					        '</div>'+
					      '</div>'+
					    '</div>'+
					  '</div>';
	    $("#"+placementId).html(html);
	    $("#modalChoose").modal();
	}


	function hideModal(){
	    $('#modalChoose').modal('hide');
	}

	function bufferToImage(buf) {
	    return new Promise(function (resolve, reject) {
	        if (!(buf instanceof Blob)) {
	            return reject('bufferToImage - expected buf to be of type: Blob');
	        }
	        var reader = new FileReader();
	        reader.onload = function () {
	            if (typeof reader.result !== 'string') {
	                return reject('bufferToImage - expected reader.result to be a string, in onload');
	            }
	            var img = new Image();
	            img.onload = function () { return resolve(img); };
	            img.onerror = reject;
	            img.src = reader.result;
	        };
	        reader.onerror = reject;
	        reader.readAsDataURL(buf);
	    });
	}



  });