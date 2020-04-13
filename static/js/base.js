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
        $("#toolbox .dataset2face").attr("href", "/dataset2face?example=" + example);
        $("#toolbox .compare").attr("href", "/compare?example=" + example);
        $("#toolbox .cluster").attr("href", "/cluster2?example=" + example + "&k=" + 2 + "&unmapped=" + unmapped_list);
    }

});


$(document).on('submit', '.user-answer', function(e) {
    e.preventDefault();
    var data = {
        val: document.getElementById("user_input").value
    };
    console.log('---');
    console.log(this.value);
    console.log($(this).attr('id'));
    fetch(`${window.origin}/intro`, {
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
    $('#exampleModal').modal('hide');

    //to change the steps on the page
    if (q_num > 0) {
        var q_id = parseInt($(this).attr('id').replace(/[^\d]/g, ''));
        var card_id = steps[q_id - 1];
        if (q_id == steps.length) {
            $('.next-page-btn').removeClass('hidden');
        } else {
            var card_id_new = steps[q_id];
            $('#' + card_id).addClass('hidden');
            $('#' + card_id_new).removeClass('hidden');
        }
    }

    if (title == 'Introduction') {
        location.href = "/var?example=" + example;
    } else if (title == 'Variable') {
        location.href = "/dataset2face?example=" + example;
    }
    
});


$(document).on('mouseover', "g.chernoff", function(e) {
    var mousePos = mousePosition(e);
    var  xOffset = 20;
    var  yOffset = 25;
    $("#tooltip").css("display","block").css("position","absolute").css("top",(mousePos.y - yOffset) + "px").css("left",(mousePos.x + xOffset) + "px");
    if ($(this).parent('svg').hasClass('hover-face')) {
        var datapoint_id = $(this).parent('svg').attr('id').substr(4);
        var datapoint = json_dataset[datapoint_id];
        if (parseInt(datapoint_id) == (parseInt(datapoint['id']) - 1)) {
            var id = parseInt(datapoint_id) + 1;
        } else {
            var id = datapoint['id'];
        }
        var id_line = $('<div>id: ' + id + '</div>');
        $("#tooltip").append(id_line);
    } else if ($(this).parent('svg').hasClass('center')) {
        var datapoint_id = $(this).parent('svg').attr('id');
        var datapoint = center_face_list[datapoint_id];
        var id_line = $('<div>Center Face</div>');
        $("#tooltip").append(id_line);
    }
    for (dataset_feature in json_mapping) {
        var facial_short = json_mapping[dataset_feature];
        var facial_feature = facial_full[facial_short];
        var datapoint_value = datapoint[dataset_feature];
        var feature_line = $('<p>' + facial_feature + ' - ' + dataset_feature + ': ' + datapoint_value + '</p>');
        $("#tooltip").append(feature_line);
    }
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
}
