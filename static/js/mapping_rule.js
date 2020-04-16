$(document).ready(function() {
    console.log('mapping');
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
    // var facial_full = {"er": "Eye Radius", "bs": "Brow Slant", "bl": "Brow Length", "bv": "Brow Vertical", "ms": "Mouth Size", "mv": "Mouth Vertical", "mc": "Mouth Curve", "nw": "Nose Width", "nh": "Nose Height"};

    if (localStorage.getItem("mappingRule") === null) {
        var json_mapping = {};
        var json_mapping_face = {};
        if (example == '2') {
            json_mapping = {
                "Beetles_Richness": "er",
                "Mean_Temp_degC": "bs",
                "Mean_Canopy_Height_m": "bl",
                "Mean_Ann_Precip_mm": "bv",
                // "Longitude": "ms",
                "Longitude": "0",
                "Latitude": "ms",
                "Small_Mammal_Richness": "nw",
                "Elevation_m": "0"
            };
            json_mapping_face = {
                "er": "Beetles_Richness", 
                "bs": "Mean_Temp_degC", 
                "bl": "Mean_Canopy_Height_m", 
                "bv": "Mean_Ann_Precip_mm", 
                // "ms": "Longitude", 
                "ms": "Latitude", 
                "nw": "Small_Mammal_Richness"
            }
        } else if (example == '1') {
            json_mapping = {
                "alcohol": "er",
                "volatile_acidity": "bl",
                "quality": "bv",
                "total_sulfur_dioxide": "ms",
                "free_sulfur_dioxide": "mv",
                "fixed_acidity": "mc",
                "residual_sugar": "nw",
                "density": "nh",
                "chlorides": "0",
                "sulphates": "0",
                "citric_acid": "0",
                "pH": "bs",
            }

            json_mapping_face = {
                "er": "alcohol", 
                "bs": "pH", 
                "bl": "volatile_acidity", 
                "bv": "quality", 
                "ms": "total_sulfur_dioxide", 
                "mv": "free_sulfur_dioxide", 
                "mc": "fixed_acidity", 
                "nw": "residual_sugar", 
                "nh": "density"
            }
        } else {
            for (i = 0; i < variables_forface.length; i++) {
                if (i < facial_feature.length) {
                    json_mapping[variables_forface[i]] = facial_feature[i];
                    json_mapping_face[facial_feature[i]] = variables_forface[i];
                } else {
                    json_mapping[variables_forface[i]] = "0";
                    // json_mapping_face["unmapped" + i] =  variables_forface[i];
                }
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

        if (json_mapping == json_mapping_new) {
            $('#exampleModal').modal('hide'); 
        } else {
            json_mapping = json_mapping_new;
            var str_mapping = JSON.stringify(json_mapping_new);
            localStorage.setItem('mappingRule', str_mapping);
            $('#exampleModal').modal('hide');  
            var current_loc = window.location.href;
            if ( current_loc.includes("unmapped=") ) {
                console.log('include');
                var unmapped_list = [];
                var getLocalData = localStorage.getItem('mappingRule');
                var mapping = JSON.parse(getLocalData);
                for (key in mapping) {
                    if (mapping[key] == '0') {
                        unmapped_list.push(key);
                    }
                } 
                window.location.href = "/cluster2?example=" + example + "&k=" + k + "&unmapped=" + unmapped_list;
            } else {
                location.reload(true);
            }
        }
    });

});


