$(document).ready( function() {
    $("#all_faces .btn").click( function() {
        $("#data_table").toggleClass("hidden");
        $("#face").toggleClass("hidden");
        $("#face_table").toggleClass("hidden");
        $(this).text(function(i, text){
            return text === "View all Faces" ? "View the Table" : "View all Faces";
        })

        var face_plance_content = "";
        for (data_id = 0; data_id < json_dataset.length; data_id++) {
            face_plance_content += '<span id = "id' + data_id + '"></span>';
        }
        document.getElementById("face_table").innerHTML = face_plance_content;

        // for (data_id = 0; data_id < 7; data_id++) {
        for (data_id = 0; data_id < json_dataset.length; data_id++) {
            setTimeout((function(data_id) {
                datapoint = json_dataset[data_id];
                var face_place_id = "#id" + data_id;
                d3.select(face_place_id)
                    .call(chernoffFace2());

                //codes to transfer the canvas as a png image:
                var svgtag = face_place_id + " svg";
                var svg_face = document.querySelector(svgtag);
                var svgData = new XMLSerializer().serializeToString(svg_face);
                var canvas = document.createElement("canvas");
                var svgSize = svg_face.getBoundingClientRect();
                canvas.width = svgSize.width;
                canvas.height = svgSize.height;
                var ctx = canvas.getContext("2d");
                var img = document.createElement("img");
                img.setAttribute( "src", "data:image/svg+xml;base64," + btoa( svgData ) );
                
                img.onload = function() {
                    ctx.drawImage(img, 0, 0);
                    var imgUrl = canvas.toDataURL( "image/png" );
                    imgUrl = imgUrl.substring(22);
                    var imgData = {};
                    imgData[data_id] = imgUrl; //codes from https://blog.csdn.net/weixin_41679938/java/article/details/89400287
                    imgData["example"] = example;
                    var senddata = JSON.stringify(imgData);
                    var xhr = new XMLHttpRequest();
                    var uploadcanvas = "/uploadcanvas";
                    xhr.open("POST", uploadcanvas, true);
                    xhr.setRequestHeader('content-type', 'application/json');
                    xhr.send(JSON.stringify(senddata));
                }
                

            })(data_id),(function(data_id){
                return data_id * 1000;
            })(data_id));
            // codes to download png image
            // var link = document.createElement('a');
            // link.download = data_id + '.png';
            // link.href = canvas.toDataURL("image/png");
            // link.click();  
        }

    });

	function chernoffFace2() {
		var width = 100, height = 100;
		var chernoff = d3.chernoff()
			.face(function(d) { return d.f; })
            .hair(function(d) { return d.h; })
            .mouth(function(d) { return d.m; })
            .nosew(function(d) { return d.nw; })
            .noseh(function(d) { return d.nh; })
            .eyew(function(d) { return d.ew; })
            .eyeh(function(d) { return d.eh; })
            .brow(function(d) { return d.b; })
            .eyeRadius(function(d) { return d.er; })
            .browVertical(function(d) { return d.bv; })
            .browSlant(function(d) { return d.bs; })
            .browLength(function(d) { return d.bl; })
            .mouthSize(function(d) { return d.ms; })
            .mouthVertical(function(d) { return d.mv; })
            .mouthCurve(function(d) { return d.mc; });

        function value_transfer(datapoint) {
        	var datapoint_new = {};

        	datapoint_new["fixed_acidity"] = (datapoint["fixed_acidity"] - 3.8) / (14.2 - 3.8);
        	datapoint_new["volatile_acidity"] = (datapoint["volatile_acidity"] - 0.08) / (1.1 - 0.08);
        	datapoint_new["citric_acid"] = (datapoint["volatile_acidity"] - 0) / (1.66 - 0);
        	datapoint_new["residual_sugar"] = (datapoint["residual_sugar"] - 0.6) / (65.8 - 0.6);
        	datapoint_new["chlorides"] = (datapoint["chlorides"] - 0.009) / (0.346 - 0.009);
        	datapoint_new["free_sulfur_dioxide"] = (datapoint["free_sulfur_dioxide"] - 2) / (289 - 2);
        	datapoint_new["total_sulfur_dioxide"] = (datapoint["total_sulfur_dioxide"] - 9) / (440 - 9);
        	datapoint_new["density"] = (datapoint["density"] - 0.994) / (1.001 - 0.994);
        	datapoint_new["pH"] = (datapoint["pH"] - 2.87) / (3.69 - 2.87);
        	datapoint_new["sulphates"] = (datapoint["sulphates"] - 0.27) / (0.84 - 0.27);
        	datapoint_new["alcohol"] = (datapoint["alcohol"] - 8.6) / (12.8 - 8.6);
        	datapoint_new["quality"] = (datapoint["quality"] - 4) / (8 - 4);

        	return datapoint_new;
        }
        
        function data() {
        	var data_new = value_transfer(datapoint);
        	var d = {};
        	var facial = "";
        	for (key in data_new) {
        		facial = json_mapping[key];
        		if (facial != "0") {
        			d[facial] = data_new[key];
        		}
        	}
        	return [d];
        }

        function drawFace(selection) {
            var svg = selection.append("svg")
            	.attr("width", width)
            	.attr("height", height);
            var face = svg.selectAll("g.chernoff")
            	.data(data())
            	.enter().append("g")
            	.attr("class", "chernoff")
            	.call(chernoff);
        }

        function updateFace(selection) {
        	selection.select("svg")
                .selectAll("g.chernoff")
                .remove();
          // chernoff will not draw on update selections
            selection.select("svg")
                .selectAll("g.chernoff")
                .data(data())
                .enter().append("g")
                .attr("class", "chernoff")
                .call(chernoff);
        }

        function draw(selection) {
        	selection
                .call(drawFace)
        }

        return draw;
    }

});
