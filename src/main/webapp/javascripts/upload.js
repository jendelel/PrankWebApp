function uploadPdbFile() {
    var files = $('#upload-pdb').get(0).files;

    if (files.length > 0) {
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');

        var formData = new FormData();

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append('pdbFile', file, file.name);
        }

        var doConservation = $('#conservation-checkbox').prop('checked');
        formData.append('conservation', doConservation);

        $.ajax({
            url: '/analyze/file_upload',
            type: 'POST',
            contentType: false,
            data: formData,
            processData: false,
            success: function (data) {
                console.log('Upload successful!\n' + data);
                window.location.assign(data);
            },
            xhr: function () {
                // create an XMLHttpRequest
                var xhr = new XMLHttpRequest();

                // listen to the 'progress' event
                xhr.upload.addEventListener('progress', function (evt) {

                    if (evt.lengthComputable) {
                        // calculate the percentage of upload completed
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);

                        // update the Bootstrap progress bar with the new percentage
                        $('.progress-bar').text(percentComplete + '%');
                        $('.progress-bar').width(percentComplete + '%');
                        $('.progress').show();

                        // once the upload reaches 100%, set the progress bar text to done
                        if (percentComplete === 100) {
                            $('.progress-bar').html('Running analysis...');
                            $('.progress').hide();
                            $('.spinner').show();
                        }
                    }
                }, false);
                return xhr;
            }
        });
    }
}

function submitPdbId() {
    var pdbId = $('#pdbId').val();
    //TODO: Improve validation
    if (pdbId === "") {
        window.location.href = '/analyze/id/4x09';
    } else if (pdbId.length == 0 && pdbId.search('^[a-zA-Z0-9]$')) {
        var hostName = window.location.hostname;
        window.location.href = '/analyze/id/' + pdbId;
    }
}

