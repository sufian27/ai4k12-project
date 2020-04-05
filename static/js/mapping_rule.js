$(document).ready(function() {
    //default mapping rule
    var data_id = 0;
    var datapoint_face = dataset_face[data_id];
    var json_mapping = {};
    var variables_face = Object.keys(datapoint_face);
    var facial_feature = ["er", "bs", "bl", "bv", "ms", "mv", "mc", "nw", "nh"];
    for (i = 0; i < variables_face.length; i++) {
        if (i < facial_feature.length) {
            json_mapping[variables_face[i]] = facial_feature[i];
        } else {
            json_mapping[variables_face[i]] = "0";
        }
    }
    var str_mapping = JSON.stringify(json_mapping);
    localStorage.setItem('mappingRule', str_mapping);
});
