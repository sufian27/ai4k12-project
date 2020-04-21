$(document).ready( function() {
    // $("#data_table").toggleClass("hidden");
    // $("#face").toggleClass("hidden");
    // $(this).text(function(i, text){
    //     return text === "View all Faces" ? "View the Table" : "View all Faces";
    // })

    for (data_id = 0; data_id < dataset_face.length; data_id++) {
         var face_plance_content = $('<span id = "id' + data_id + '"></span>');
         $('#face_table').append(face_plance_content);         
    }

    for (data_id = 0; data_id < dataset_face.length; data_id++) {
        datapoint_face = dataset_face[data_id];
        var face_place_id = "#id" + data_id;
        d3.select(face_place_id)
            .call(chernoffFace(1));
        $(face_place_id + ' svg').attr('id', "face" + data_id);
        $(face_place_id + ' svg').attr('class', 'hover-face');              
    }

});
