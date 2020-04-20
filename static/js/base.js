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

    if (title == 'Introduction') {
        location.href = "/var?example=" + example;
    } else if (title == 'Variable') {
        location.href = "/data_intro?example=" + example;
    } else if (title == 'Smilarity Comparison') {
        if ($('.label2').hasClass('hidden')) {
            $('.label1').addClass('hidden');
            $('.label2').removeClass('hidden');
        } else {
            location.href = "/groupwise_compare?example=" + example;
        }
    } else if (title == 'Groupwise Smilarity Comparison') {
        if (! $('.label1').hasClass('hidden')) {
            $('.label1').addClass('hidden');
            $('.label2').removeClass('hidden');
        } else if (! $('.label2').hasClass('hidden')) {
            add_cluster();
            $('.label2').addClass('hidden');
            $('.label3').removeClass('hidden');
        } else if (! $('.label3').hasClass('hidden')){
            $('.label3').addClass('hidden');
            $('.label4').removeClass('hidden');
        } else if (! $('.label4').hasClass('hidden')){
            location.href = "/dataset2face?example=" + example;
        }
    } else if (title == 'Automatic Clustering') {
        if ($(this).attr('id') == 'cluster-question0') {
            $('#next-button').removeClass('hidden');
            $('#next-button').trigger('click');
        } else if ($(this).attr('id').includes('cluster-question-familay')) {
            $(this).parent('.answer-box').remove();
            if ($('.answer-box').length == 0) {
                $('#next-button').removeClass('hidden');
            }
        } else if ($(this).attr('id') == 'cluster-question-center1') {
            $(this).parent('.answer-box').remove();
            var cluster_step5 = $('<div class="col-3 card border-light answer-box fixed-right-bottom" width = "100%"><form class="user-answer" id = "cluster-question-center2"><label for="message-text" class="col-form-label card-body">What are the ecological features differentiate the field sites represented by these emojis?</label><div class="row"><div class="col-8"><textarea class="form-control" id="user_input" rows="3" type="text" name="user_input"></textarea></div><div class="col-4"><button type="submit" class="btn btn-outline-success btn-sm" >Submit</button></div></div></form></div>');
            $('.fixed-right-bottom-parent').append(cluster_step5);
        } else if ($(this).attr('id') == 'cluster-question-center2') {
            location.href = "/stem?example=" + example;
        }
    }
});

function add_cluster() {
    var current_num = $('.compare-block').length;
    $('.compare-block').removeClass('selected-block');
    var compare_template = $('.compare-block').eq(0).clone();
    var block_id = $('.compare-block').length;
    compare_template.attr('id', 'block' + block_id);
    compare_template.addClass('selected-block');
    compare_template.children(".compare-canvas").children().remove();
    compare_template.children(".compare-index").children().remove();
    compare_template.children(".compare-canvas").attr('id', 'canvas' + current_num);
    // $('.compare-row').append(compare_template);
    $('.compare-block-row').append(compare_template);
    if (current_num == 1) {
        $('#face38').parent('.conbox').trigger("click");
    }
}

$(document).on('mouseover', ".face-ele", function(e) {
    var getLocalData = localStorage.getItem('mappingRule');
    var json_mapping = JSON.parse(getLocalData);
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

    if ((! $(this).hasClass('face-circle'))) {
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
        } else if (! $(this).parents('svg').hasClass('user-generated')) {
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
        $('#face svg').attr('class', 'user-generated'); 
    } else {
        location.reload(true);
    }
}
