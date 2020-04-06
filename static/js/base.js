$(document).ready(function() {
    // alert("base");
    function tool_reload() {
        var container = $("#toolbox");
        var content = container.innerHTML;
        container.innerHTML= content; 
    }
    tool_reload();
    if(example > 0) {
    	$(".var").attr("href", "/var?example=" + example);
        $(".dataset2face").attr("href", "/dataset2face?example=" + example);
        $(".compare").attr("href", "/compare?example=" + example);
        $(".cluster").attr("href", "/cluster?example=" + example + "&k=" + 2);
    }

});

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
    // console.log(target_id);
    if (target_id.includes("feature")) {
        ev.target.after(data_element);
        $('.feature-unmapped-area').append($('#' + target_id));
    } else if (target_id == 'unmapped') {
        ev.target.appendChild(data_element);
    } else {
        var x = $('#' + target_id).children('.dataset-feature').length;
        // console.log("================================================");
        // console.log(x);
        if(x>0){
            $('.feature-unmapped-area').append($('#' + target_id).children('.dataset-feature'));
        }
        ev.target.appendChild(data_element);
    }    
}
