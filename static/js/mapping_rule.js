$(document).ready(function() {
    //default mapping rule
    var data_id = 0;
    var datapoint_face = dataset_face[data_id];
    var variables_numeric = Object.keys(datapoint_face);
    var variables_forface = [];
    for (var i = 0; i < variables_numeric.length; i++) {
        if (variables_numeric[i] != 'id') {
            variables_forface.push(variables_numeric[i]);
        }
    }

    var facial_feature = ["er", "bs", "bl", "bv", "ms", "mv", "mc", "nw", "nh"];
    var facial_full = {"er": "Eye Radius", "bs": "Brow Slant", "bl": "Brow Length", "bv": "Brow Vertical", "ms": "Mouth Size", "mv": "Mouth Vertical", "mc": "Mouth Curve", "nw": "Nose Width", "nh": "Nose Height"}

    if (localStorage.getItem("mappingRule") === null) {
        var json_mapping = {};
        var json_mapping_face = {};
        for (i = 0; i < variables_forface.length; i++) {
            if (i < facial_feature.length) {
                json_mapping[variables_forface[i]] = facial_feature[i];
                json_mapping_face[facial_feature[i]] = variables_forface[i];
            } else {
                json_mapping[variables_forface[i]] = "0";
                // json_mapping_face["unmapped" + i] =  variables_forface[i];
            }
        }
        var str_mapping = JSON.stringify(json_mapping);
        localStorage.setItem('mappingRule', str_mapping);
    } else {
        var getLocalData = localStorage.getItem('mappingRule');
        var json_mapping = JSON.parse(getLocalData);
        var json_mapping_face = {};
        for (key in json_mapping) {
            if (json_mapping[key] != "0") {
                json_mapping_face[json_mapping[key]] = key;
            }
        }
    }

    if ($('#mappingModal').length > 0) {
        var mapping_modal = "";
        // var id_generate = 0;
        for (i in facial_feature) {
            mapping_modal = '<div id = "' + facial_feature[i] + '" class = "facial-feature" ondragover = "allowDropFeature(event)" ondrop = "dropFeature(event)">' + facial_full[facial_feature[i]] + '</div>';
            $('.modal-body .feature-mapped-area').append(mapping_modal);
        }

        for (i in facial_feature) {
            if (facial_feature[i] in json_mapping_face) {
                mapping_modal = '<span id = "' + json_mapping_face[facial_feature[i]] + '" class = "dataset-feature pointer-cursor" draggable = "true" ondragstart = "dragFeature(event)" >' + json_mapping_face[facial_feature[i]] + '</span>';
                $('#' + facial_feature[i]).append(mapping_modal);
                // id_generate = id_generate + 1;
            }
        }

        for (i in json_mapping) {
            if (json_mapping[i] == "0") {
                mapping_modal = '<span id = "' + i + '" class = "dataset-feature pointer-cursor" draggable = "true" ondragstart = "dragFeature(event)" >' + i + '</span>'
                $('.modal-body .feature-unmapped-area').append(mapping_modal);
                // id_generate = id_generate + 1;
            }
            
        }
    }

    $('.update-mapping').click( function() {
        var json_mapping_new = {}
        for (i in facial_feature) {
            var x = $('#' + facial_feature[i]).children('.dataset-feature').length;
            if(x == 1) {
                var dataset_feature = $('#' + facial_feature[i]).children('.dataset-feature').attr('id');
                json_mapping_new[dataset_feature] = facial_feature[i];
            } else if (x > 1) {
                alert('Something went wrong with the mapping rule!');
            }
        }
        var y = $('#unmapped-area').children('.dataset-feature').length;
        if(y > 0) {
            for (i = 0; i < y; i++) {
                var dataset_feature = $('#unmapped-area').children('.dataset-feature').eq(i).attr('id');
                json_mapping_new[dataset_feature] = "0";
            }
        }

        json_mapping = json_mapping_new;
        var str_mapping = JSON.stringify(json_mapping_new);
        localStorage.setItem('mappingRule', str_mapping);
    });

});

