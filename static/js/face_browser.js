$(document).ready(function(){
	// var content = "";
 //    for (var data_id = 0; data_id < json_dataset.length; data_id++) {
 //    	var src = "/static/image/user" + user_id + "/example" + example_id + "/" + data_id + ".png";
 //    	content += "<div class = 'conbox' id = 'wrap" + data_id + "' ><img id = 'drag" + data_id +"' src = '" + src + "' width = '35' draggable = 'true' ondragstart = 'drag(event)' class = 'pointer-cursor' >" + "</div>";
 //    }
 //    document.getElementById("face-browser").innerHTML = content;

 //    for (var data_id = 0; data_id < json_dataset.length; data_id++) {
 //    	$('.conbox').eq(data_id).css({ 'width': '35px', 'height': '35px', 'background': 'transparent url("' + $('#face-browser div').eq(data_id).find('img').attr('src') + '") no-repeat center', 'background-size': 'contain', 'filter': 'alpha(opacity=20)' })
 //    }

    var content = "";
    for (var data_id = 0; data_id < dataset_face.length; data_id ++) {
        content += "<div class = 'conbox pointer-cursor clickable-element' id = 'wrap" + data_id + "' ></div>";
    }

    document.getElementById("face-browser").innerHTML = content;

    for (var data_id = 0; data_id < dataset_face.length; data_id ++) {
        datapoint_face = dataset_face[data_id];
        var face_place_id = "#wrap" + data_id;
        d3.select(face_place_id)
            .call(chernoffFace(0.7));
        $(face_place_id + ' svg').attr('id', "face" + data_id);
        $(face_place_id + ' svg').attr('class', 'hover-face');
        // console.log('===');
        // console.log(data_id);
        // console.log(dataset_face[data_id]['id']);
    }

    for (var data_id = 0; data_id < dataset_face.length; data_id ++) {
        // $('.conbox').eq(data_id).css({ 'width': '35px', 'height': '35px', 'background': 'transparent url("' + $('#face-browser div').eq(data_id).find('img').attr('src') + '") no-repeat center', 'background-size': 'contain', 'filter': 'alpha(opacity=20)' });
        $('.conbox').eq(data_id).css({ 'width': '70px', 'height': '84px', 'background-size': 'contain', 'filter': 'alpha(opacity=20)' });
    }

    var data_box_id1 = '#face' + sample_dp[0];
    $(data_box_id1).parent('.conbox').trigger("click");
});
