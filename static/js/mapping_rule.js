$(document).ready(function() {
    //default mapping rule
    var data_id = 0;
    var datapoint_face = dataset_face[data_id];
    var json_mapping = {};
    var json_mapping_face = {};
    var variables_face = Object.keys(datapoint_face);
    var facial_feature = ["er", "bs", "bl", "bv", "ms", "mv", "mc", "nw", "nh"];
    var facial_full = {"er": "Eye Radius", "bs": "Brow Slant", "bl": "Brow Length", "bv": "Brow Vertical", "ms": "Mouth Size", "mv": "Mouth Vertical", "mc": "Mouth Curve", "nw": "Nose Width", "nh": "Nose Height"}
    for (i = 0; i < variables_face.length; i++) {
        if (i < facial_feature.length) {
            json_mapping[variables_face[i]] = facial_feature[i];
            json_mapping_face[facial_feature[i]] = variables_face[i];
        } else {
            json_mapping[variables_face[i]] = "0";
            json_mapping_face["unmapped" + i] =  variables_face[i];
        }
    }

    if (localStorage.getItem("infiniteScrollEnabled") === null) {
        var str_mapping = JSON.stringify(json_mapping);
        localStorage.setItem('mappingRule', str_mapping);
    }

    if ($('#mappingModal').length > 0) {
        var mapping_modal = "";
        for (i in facial_feature) {
            mapping_modal = '<div class ="features-mapped" ondragover = "allowDrop(event)" ondrop = "dropChild(event)"><span class = "facial-feature feature-item">' + facial_full[facial_feature[i]] + '</span><span class = "dataset-feature feature-item pointer_cursor" draggable = "true" ondragstart = "drag(event)" >' + json_mapping_face[facial_feature[i]] + '</span></div>';
            $('.modal-body .feature-mapped-area').append(mapping_modal);
        }

        for (i in json_mapping_face) {
            if (!(facial_feature.includes(i))) {
                mapping_modal = '<span class = "feature-item" draggable = "true" ondragstart = "drag(event)" >' + json_mapping_face[i] + '</span>'
                console.log("===========================");
                console.log(i);
                console.log(json_mapping_face[i]);
                $('.modal-body .feature-unmapped-area').append(mapping_modal);
            }
            
        }
    }

});

function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData('span', ev.target.id);
}

function dropChild(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData('span');
    var data_element = document.getElementById(data);
    ev.target.appendChild(data_element);
}

