function uploadPdbFile() {
    var files = $('#upload-pdb').get(0).files;
    var msaFiles = $('#upload-msas').get(0).files;
    var pdbId = $('#pdbId').val();
    var doConservation = $('#conservation-checkbox').prop('checked');
    if (pdbId === "") {
        pdbId = '2src'
    }

    if (files.length > 0 || (doConservation && msaFiles.length > 0 && isValidPdbId(pdbId))) {
        $('.progress-bar').text('0%');
        $('.progress-bar').width('0%');

        var formData = new FormData();
        formData.append('conservation', doConservation);
        formData.append('chainIds', $('#fileChains').val());

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append('pdbFile', file, file.name);
        }

        if (doConservation) {
            var pdbIdOpt = $("#pdbId_opt").val();
            if (isValidPdbId(pdbIdOpt) && msaFiles.length === 0) {
                formData.append('pdbId', pdbIdOpt);
            }
            if (msaFiles.length > 0 && isValidPdbId(pdbId)) {
                formData.append('pdbId', pdbId);
            }
            for (i = 0; i < msaFiles.length; i++) {
                file = msaFiles[i];
                formData.append(file.name, file, file.name);
            }
        }

        $.ajax({
                   url: '/analyze/file_upload',
                   type: 'POST',
                   contentType: false,
                   data: formData,
                   processData: false,
                   success: function (data) {
                       console.log('Upload successful!\n' + data);
                       var newUrl;
                       if (data.startsWith("/")) {
                           newUrl = data;
                       } else if (data.length < 50) {
                           newUrl = '/analyze/upload/'.concat(data);
                       } else {
                           document.write(data);
                           document.close();
                       }
                       window.location.assign(newUrl);
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
    } else if (isValidPdbId(pdbId)) {
        var chains = getSelectedChains();
        if (chains.length === 0) {
            alert('At least one chain need to be selected.');
            return false;
        }
        var chainsStr = chains.join(',');

        if (doConservation) {
            window.location.href =
              '/analyze/id/' + pdbId + '_' + chainsStr;
        } else {
            window.location.href =
              '/analyze/id_noconser/' + pdbId + '_' + chainsStr;
        }
    } else {
        alert("Please select some files to upload or enter valid PDB ID.")
        return false;
    }
}

function doConservationClicked() {
    var pdbFiles = $('#upload-pdb').get(0).files;
    var pdbId = $('#pdbId').val();
    if ($('#conservation-checkbox').prop('checked')) {
        var pdbid_opt = (pdbFiles.length === 0);
        $('#pdbId_opt').prop('disabled', pdbid_opt);
        $('#upload-msas').prop('disabled', false);
        if (!pdbid_opt) {
            $('#pdbId_opt_lbl').removeClass('disabled');
        }
        $('#msa_opt_lbl').removeClass('disabled');
    } else {
        $('#pdbId_opt').prop('disabled', true);
        $('#upload-msas').prop('disabled', true);
        $('#pdbId_opt_lbl').addClass('disabled');
        $('#msa_opt_lbl').addClass('disabled');
    }
}

function isValidPdbId(pdbId) {
    return pdbId.length === 4 && /^[a-zA-Z0-9]*$/.test(pdbId);
}

$(document).ready(function () {
   doConservationClicked();
    $(".tooltip-hint").tooltip();
    document.getElementById('pdbUploadSumbit').onclick = function() { uploadPdbFile(); };
});

function updateChainSelector() {
    var pdbId = $('#pdbId').val().toLowerCase();
    var chainSelector = $('#chain-selector');
    if (!isValidPdbId(pdbId)) {
        chainSelector.hide();
        return;
    }
    var url = 'https://www.ebi.ac.uk/pdbe/api/pdb/entry/molecules/' + pdbId;
    fetch(url).then(function(response) {
        console.log(response);
        if (response.status !== 200) {
            throw new Error('Invalid response.');
        }
        return response.json();
    }).then(function(response) {
        var chains = collectChainsFromPdbMoleculeResponse(response[pdbId]);
        var html = generateHtmlForChainSelectors(chains);
        chainSelector.html(html).show();
    }).catch(function (error) {
        console.warn('Can\'t fetch chains:' , error);
        chainSelector.html('Can\'t fetch chains for given PDB ID.').show();
    });
}

function collectChainsFromPdbMoleculeResponse(entities) {
    var chains = new Set();
    entities.forEach(function(entity) {
      if (!entity['sequence']) {
          return;
      }
      entity['in_chains'].forEach(function (chain) {
        chains.add(chain);
      });
    });
    return chains;
}

function generateHtmlForChainSelectors(chains) {
    var checkBoxTemplate =
        '<div class="checkbox col-sm-1">\n' +
        '    <label>\n' +
        '        <input type="checkbox" onclick="doConservationClicked()" checked="checked" style="margin-right: 4px;" chain="{name}"" class="chain-checkbox">\n' +
        '        {name}\n' +
        '</label>\n' +
        '</div>\n';
    var content = '';
    chains.forEach(function (chain) {
        // Version of replaceAll.
        content += checkBoxTemplate.split('{name}').join(chain);
    });
    var html = (
        '<div>\n' +
        '  <b>Restrict to chains</b>\n' +
        '</div>\n' +
        '<div>\n' +
        '  {content}\n' +
        '</div>'
    ).replace('{content}', content);
    return html;
}

function getSelectedChains() {
    var chains = [];
    $('.chain-checkbox').each(function () {
        var checkbox = $(this);
        if (checkbox.prop('checked')) {
            chains.push(checkbox.attr('chain'));
        }
    });
    return chains;
}