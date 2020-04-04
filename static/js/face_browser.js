$(document).ready(function(){
	// alert("compare");
	var content = "";
    for (data_id in json_dataset) {
    	var src = "/static/image/user" + user_id + "/example" + example_id + "/" + data_id + ".png";
    	content += "<span id = 'span" + data_id + "' ><img id = 'drag" + data_id +"' src = '" + src + "' width = '35' draggable = 'true' ondragstart = 'drag(event)' >" + "</span>";
    }
    document.getElementById("face_browser").innerHTML = content;

});
