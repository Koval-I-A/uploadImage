$(document).ready(function() {
    var jcrop_api,
        boundx,
        boundy;

	var initJcrop = function (boundx, boundy){
	    var $preview = $('#preview-pane'),
	        $pcnt = $('#preview-pane .preview-container'),
	        $pimg = $('#preview-pane .preview-container img'),

	        xsize = $pcnt.width(),
	        ysize = $pcnt.height();

	    $('#showImage, #sendData').show();
	    
	    $('#target').Jcrop({
	      	onChange: updatePreview,
	      	onSelect: updateCoords,
	      	aspectRatio: xsize / ysize,
	      	boxWidth: 450,
	      	boxHeight: 450
	    }, function() {
	      	boundx = boundx;
	      	boundy = boundy;

	      	jcrop_api = this;

	      	$preview.appendTo(jcrop_api.ui.holder);
	    });

		function updateCoords(c) {
			$('#x').val(c.x);
			$('#y').val(c.y);
			$('#w').val(c.w);
			$('#h').val(c.h);
		}

	    function updatePreview(c) {
	      	if (parseInt(c.w) > 0) {
	        	var rx = xsize / c.w;
	        	var ry = ysize / c.h;

	        	$pimg.css({
	          		width: Math.round(rx * boundx) + 'px',
	          		height: Math.round(ry * boundy) + 'px',
	          		marginLeft: '-' + Math.round(rx * c.x) + 'px',
	          		marginTop: '-' + Math.round(ry * c.y) + 'px'
	        	});
	      	}
	    };

  	};

	var readURL = function (input) {
	    if (input.files && input.files[0]) {
	    	var boundx, boundy;
	        var reader = new FileReader();

	        reader.onload = function (file) {
				var image = new Image();
				    image.src = file.target.result;

				    image.onload = function() {
				    	boundx = this.width;
				    	boundy = this.height;
				        if (file.total < 5000000 && this.width > 128 && this.height > 128) {
				        	jcrop_api.release();
				            $('#target, #jcropPreview').attr('src', file.target.result);
		            		$('#photo').val(file.target.result);
				            jcrop_api.setImage(file.target.result);
				        } else {
				        	alert('File not accept');
				        }
				    };
	        }

	        reader.readAsDataURL(input.files[0]);

	        initJcrop(boundx, boundy);
	    }
	}

	$("#inputFile").change(function(){
	    readURL(this);
	});

	$('#buttonUrl').on('click', function() {
	    	var boundx, boundy;

			function toDataUrl(url, callback, outputFormat){
			    var img = new Image();
			    img.crossOrigin = '';
			    img.onload = function() {
			        var canvas = document.createElement('CANVAS');
			        var ctx = canvas.getContext('2d');
			        var dataURL;
			        canvas.height = this.height;
			        canvas.width = this.width;
			    	boundx = this.width;
			    	boundy = this.height;
			        ctx.drawImage(this, 0, 0);
			        dataURL = canvas.toDataURL(outputFormat);
					if (canvas.height < 128 || canvas.width < 128) {
						alert('File not accept');
					} else {
				        callback(dataURL);
					};
			        canvas = null; 
			    };
			    img.src = url;
			}
			toDataUrl($('#inputUrl').val(), function(base64Img){
			    if (base64Img.length < 5000000) {
		        	initJcrop(boundx, boundy);
		        	
		            $('#target, #jcropPreview').attr('src', base64Img);
		            $('#photo').val(base64Img);
		            jcrop_api.setImage(base64Img);
	            }
			});

	});

	$('#sendData').on('click', function() {
		$('#uploadFile').modal('hide');
		$.ajax({
			url: '/crop.php',
			type: 'POST',
			data: {
				x: $('#x').val(),
				y: $('#y').val(),
				w: $('#w').val(),
				h: $('#h').val(),
				photo: $('#photo').val()
			},
			success:function(data){
			}
		});
	});
});