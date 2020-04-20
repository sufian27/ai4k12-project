$(document).ready(function() {
    console.log('base');
    // alert("base");
    function tool_reload() {
        var container = $("#toolbox");
        var content = container.innerHTML;
        container.innerHTML= content; 
    }
    tool_reload();

    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    if(example > 0) {
        if (localStorage.getItem("mappingRule") === null) {          
            var unmapped_list = [];
        } else {
            var unmapped_list = [];
            var getLocalData = localStorage.getItem('mappingRule');
            var mapping = JSON.parse(getLocalData);
            for (key in mapping) {
                if (mapping[key] == '0') {
                    unmapped_list.push(key);
                }
            }  
        }

    	$("#toolbox .intro").attr("href", "/intro?example=" + example);
        $("#toolbox .var").attr("href", "/var?example=" + example);
        $("#toolbox .data_intro").attr("href", "/data_intro?example=" + example);
        $("#toolbox .slider").attr("href", "/slider?example=" + example);
        $("#toolbox .dataset2face").attr("href", "/dataset2face?example=" + example);
        $("#toolbox .compare").attr("href", "/compare?example=" + example);
        $("#toolbox .cluster").attr("href", "/cluster2?example=" + example + "&k=" + 2 + "&unmapped=" + unmapped_list);
    }

});


$(document).on('submit', '.user-answer', function(e) {
    console.log(title);
    e.preventDefault();
    var data = {
        q_index: $(this).attr('id'),
        val: document.getElementById("user_input").value
    };
    console.log('---');
    console.log(this.value);
    console.log($(this).attr('id'));
    fetch(`${window.origin}/answer`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(function (response) {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
            }
        response.json().then(function (data) {
            console.log('===');
            console.log(data);
        });
    })
    .catch(function (error) {
        console.log("Fetch error: " + error);
    });

    $("#user_input").val("");
    // $('#qa').modal('hide');

    //to change the steps on the page
    // if (q_num > 0) {
    //     var q_id = parseInt($(this).attr('id').replace(/[^\d]/g, ''));
    //     var card_id = steps[q_id - 1];
    //     if (q_id == steps.length) {
    //         $('#todolist').addClass('hidden');
    //         $('.next-page-btn').removeClass('hidden');
    //     } else {
    //         var card_id_new = steps[q_id];
    //         $('#' + card_id).addClass('hidden');
    //         $('#' + card_id_new).removeClass('hidden');
    //     }
    // } else {
    //     console.log('q number is zero');
    // }

    if (title == 'Introduction') {
        location.href = "/var?example=" + example;
    } else if (title == 'Variable') {
        location.href = "/data_intro?example=" + example;
    }
    
});

$(document).on('click', ".next-q-btn", function() {
    var answer_id = title.replace(/\s/g, '') + '_' + $(this).attr('id');
    var question = $(this).parent('.card').children('.question').text();
    $('#qa form').attr('id', answer_id);
    $('#qa form label').text(question);
});

$(document).on('mouseover', ".face-ele", function(e) {
    $('#tooltip').empty();
    var face_group = {
        'reyebrow': ['bv', 'bl', 'bs'],
        'leyebrow': ['bv', 'bl', 'bs'],
        'reye': ['er'],
        'leye': ['er'],
        'mouth': ['ms', 'mv', 'mc'],
        'nose': ['nh', 'nw'] 
    };

    if ($(this).parents('svg').hasClass('hover-face')) {
        var datapoint_id = $(this).parents('svg').attr('id').substr(4);
        var datapoint = json_dataset[datapoint_id];
        if (parseInt(datapoint_id) == (parseInt(datapoint['id']) - 1)) {
            var id = parseInt(datapoint_id) + 1;
        } else {
            var id = datapoint['id'];
        }
    } else if ($(this).parents('svg').hasClass('center')) {
        var datapoint_id = $(this).parents('svg').attr('id');
        var datapoint = center_face_list[datapoint_id];
    }

    if ((! $(this).hasClass('face-circle')) && (! $(this).parents('svg').hasClass('user-generated'))) {
        var face_class = $(this).attr("class").split(' ')[0];
        for (i in face_group[face_class]) {
            var facial_short = face_group[face_class][i];
            var dataset_feature = '';
            var dataset_feature_orig = '';
            var mapped = false;
            for (k in json_mapping) {
                if (json_mapping[k] == facial_short) {
                    dataset_feature_orig = k;
                    dataset_feature = feature_names[k][1];
                    mapped = true;
                    break;
                }
            }
            if (mapped) {
                var facial_feature = facial_full[facial_short].split(' ')[1];
                var feature_line = $('<p><span class = "face-label">' + facial_feature + '</span><span class = "dataset-feature-label"> ' + dataset_feature + '</span>' + ( ($(this).parents('svg').hasClass('hover-face')) || ($(this).parents('svg').hasClass('center')) ? (': ' + toDecimal1NoZero(datapoint[dataset_feature_orig])) : "" ) + '</p>');
                $("#tooltip").append(feature_line);
            }
        }
    } else {
        if ($(this).parents('svg').hasClass('hover-face')) {
            var id_line = $('<p>id: ' + id + '</p>');   
            $("#tooltip").append(id_line);
        } else if ($(this).parents('svg').hasClass('center')) {
            var id_line = $('<p>Center Face</p>');
            $("#tooltip").append(id_line);
        } else if (! $(this).parents('svg').hasClass('user-generated')){
            var id_line = $('<p>Face Overlay</p>');
            $("#tooltip").append(id_line);
        }
    }

    var mousePos = mousePosition(e);
    var  xOffset = 20;
    var  yOffset = 25;
    $("#tooltip").css("display","block").css("position","absolute").css("top",(mousePos.y - yOffset) + "px").css("left",(mousePos.x + xOffset) + "px");
});

$(document).on('mouseout', "g.chernoff", function(e) {
     $("#tooltip").empty();
     $("#tooltip").css("display","none");
});

function mousePosition(ev){ 
    ev = ev || window.event; 
    if(ev.pageX || ev.pageY){ 
        return {x:ev.pageX, y:ev.pageY}; 
    } 
    return { 
        x:ev.clientX + document.body.scrollLeft - document.body.clientLeft, 
        y:ev.clientY + document.body.scrollTop - document.body.clientTop 
    }; 
}

function click_record_fuc() {
    var data = {
        page: title,
        element: $(this).attr('id'),
        // val: this.value
    };
    console.log($(this).attr('id'));
    console.log(this.value)
    fetch(`${window.origin}/click_record`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers: new Headers({
            "content-type": "application/json"
        })
    })
    .then(function (response) {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            return;
        }
        response.json().then(function (data) {
        console.log(data);
        });
    })
    .catch(function (error) {
        console.log("Fetch error: " + error);
    });
}

function toDecimal1NoZero(x) {
    var float_num = parseFloat(x);
    var f = Math.round(float_num * 10) / 10;
    var s = f.toString();
    return s;
}

function allowDropFeature(ev) {
    ev.preventDefault();
}
function dragFeature(ev) {
    ev.dataTransfer.setData('span', ev.target.id);
}

function dropFeature(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData('span');
    // console.log(data);
    var data_element = document.getElementById(data);
    var target_id = ev.target.id;
    console.log(target_id);
    console.log(ev.target.tagName);
    console.log(title);
    if (ev.target.tagName == 'SPAN') {
        ev.target.after(data_element);
        $('.feature-unmapped-area').append($('#' + target_id));        
    } else if (target_id == 'unmapped-area') {
        ev.target.appendChild(data_element);
    } else {
        var x = $('#' + target_id).children('.dataset-feature').length;
        if (x > 0) {
            $('.feature-unmapped-area').append($('#' + target_id).children('.dataset-feature'));
        }
        ev.target.appendChild(data_element);
    }
    if (title == 'Make Your Emoji') {
        $(update_map());
    }    
}

function update_map() {
    var json_mapping_new = {}
    for (i in facial_full) {
        var x = $('#' + i).children('.dataset-feature').length;
        if(x == 1) {
            var dataset_feature = $('#' + i).children('.dataset-feature').attr('id');
            json_mapping_new[dataset_feature] = i;
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
    var json_mapping = json_mapping_new;
    var str_mapping = JSON.stringify(json_mapping_new);
    localStorage.setItem('mappingRule', str_mapping);
    // $('#exampleModal').modal('hide');  
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
    } else if (title == 'Make Your Emoji') {
        console.log("title");
        console.log(title);
        var datapoint_face = dataset_face[27];
        d3.select("#face svg").remove();
        d3.select('#face')
            .call(chernoffFace(2));
    } else {
        location.reload(true);
    }
}
