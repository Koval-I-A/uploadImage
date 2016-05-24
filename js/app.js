$(document).ready(function() {
	'use strict';
	var _URL = window.URL || window.webkitURL;

	var croppicContaineroutputOptions = {
			uploadUrl:'img_save_to_file.php',
			cropUrl:'img_crop_to_file.php', 
			customUploadButtonId:'btnUpload',
			outputUrlId:'hiddenInput',
			loaderHtml:'<div class="loader bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div> ',
			onBeforeImgUpload: function(){
				if ($("#files_imgUploadField")[0].files.length) {
					var file = $("#files_imgUploadField")[0].files[0],
						img = new Image();
						img.onload = function() {
							if (this.width < 128 || this.height < 128 || file.size > 1000000) {
								alert('File not accept');
								cropContaineroutput.reset();
							};
						};
						img.src = _URL.createObjectURL(file);
				}
			},
			onAfterImgUpload: function(){
				$('#showImage').html('<img src=' + $(this)[0].imgUrl + '>');
				$('#inputUrl').val('');
				$(this)[0].options.loadPicture = '';
			},
			onAfterImgCrop:function(){
				$('#finishImg').html('<img src="/' + $('#hiddenInput').val() + '">');
				$('#uploadFile').modal('hide');
			},
			onError:function(errormessage){ console.log('onError:'+errormessage) }
	}
	var cropContaineroutput = new Croppic('files', croppicContaineroutputOptions);

	$('#buttonUrl').on('click', function() {
		var img = new Image();
			img.onload = function() {
				if (this.width < 128 || this.height < 128) {
					alert('File not accept');
					cropContaineroutput.reset();
				} else {
					var croppicContaineroutputOptionsUrl = croppicContaineroutputOptions;
						croppicContaineroutputOptionsUrl.loadPicture = $('#inputUrl').val();

					var cropContaineroutputUrl = new Croppic('files', croppicContaineroutputOptionsUrl);
				};
			};
			img.src = $('#inputUrl').val();
	});

});