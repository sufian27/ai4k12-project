$(document).ready(function(){
	// alert("compare");
	var content = "";
    for (var data_id = 0; data_id < json_dataset.length; data_id++) {
    	var src = "/static/image/user" + user_id + "/example" + example_id + "/" + data_id + ".png";
    	// content += "<span id = 'span" + data_id + "' width = '35' height = '35' style = 'background: transparent url(" + src + ") no-repeat center; background-size: contain; filter: alpha(opacity=20);' ><img id = 'drag" + data_id +"' src = '" + src + "' width = '35' draggable = 'true' ondragstart = 'drag(event)' >" + "</span>";
    	content += "<div class = 'conbox' id = 'wrap" + data_id + "' ><img id = 'drag" + data_id +"' src = '" + src + "' width = '35' draggable = 'true' ondragstart = 'drag(event)' class = 'pointer_cursor' >" + "</div>";
    
    }
    document.getElementById("face-browser").innerHTML = content;

    for (var data_id = 0; data_id < json_dataset.length; data_id++) {
    	$('.conbox').eq(data_id).css({ 'width': '35px', 'height': '35px', 'background': 'transparent url("' + $('#face-browser div').eq(data_id).find('img').attr('src') + '") no-repeat center', 'background-size': 'contain', 'filter': 'alpha(opacity=20)' })
    }

});
