$(document).ready( function() {
    var image_stored = localStorage.getItem('images_stored');
    if (image_stored == null) {
        image_stored = false;
        localStorage.setItem("images_stored",image_stored);
    } else {
        image_stored = JSON.parse(image_stored);
    }

    $("#all_faces").click( function() {
        // $("#data_table").toggleClass("hidden");
        // $("#face").toggleClass("hidden");
        $('#single-face').toggleClass('hidden');
        $("#face_table").toggleClass("hidden");
        $(this).text(function(i, text){
            return text === "View all Faces" ? "View the Table" : "View all Faces";
        })

        var face_plance_content = "";
        for (data_id = 0; data_id < dataset_face.length; data_id++) {
            face_plance_content += '<span id = "id' + data_id + '"></span>';
        }
        document.getElementById("face_table").innerHTML = face_plance_content;

        // for (data_id = 0; data_id < 7; data_id++) {
        for (data_id = 0; data_id < dataset_face.length; data_id++) {
            setTimeout((function(data_id) {
                // datapoint = json_dataset[data_id];
                datapoint_face = dataset_face[data_id];
                var face_place_id = "#id" + data_id;
                d3.select(face_place_id)
                    .call(chernoffFace());

                // if (!image_stored) {
                //     //codes to transfer the canvas as a png image:
                //     var svgtag = face_place_id + " svg";
                //     var svg_face = document.querySelector(svgtag);
                //     var svgData = new XMLSerializer().serializeToString(svg_face);
                //     var canvas = document.createElement("canvas");
                //     var svgSize = svg_face.getBoundingClientRect();
                //     canvas.width = svgSize.width;
                //     canvas.height = svgSize.height;
                //     var ctx = canvas.getContext("2d");
                //     var img = document.createElement("img");
                //     img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );
                    
                //     img.onload = function() {
                //         ctx.drawImage(img, 0, 0);
                //         var imgUrl = canvas.toDataURL( "image/png" );
                //         imgUrl = imgUrl.substring(22);
                //         var imgData = {};
                //         imgData[data_id] = imgUrl; //codes from https://blog.csdn.net/weixin_41679938/java/article/details/89400287
                //         imgData["example"] = example;
                //         var senddata = JSON.stringify(imgData);
                //         var xhr = new XMLHttpRequest();
                //         var uploadcanvas = "/uploadcanvas";
                //         xhr.open("POST", uploadcanvas, true);
                //         xhr.setRequestHeader('content-type', 'application/json');
                //         xhr.send(JSON.stringify(senddata));
                //     }
                // }                

            })(data_id),(function(data_id){
                return data_id * 1000;
            })(data_id));

            if (data_id == (dataset_face.length - 1)) {
                image_stored = true;
                localStorage.setItem("images_stored",image_stored);
            }
            // codes to download png image
            // var link = document.createElement('a');
            // link.download = data_id + '.png';
            // link.href = canvas.toDataURL("image/png");
            // link.click();  
        }

    });

});
