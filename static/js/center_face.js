$(document).ready(function(){
    $(document).on('dblclick', '.compare-canvas img', function() {
        function chernoffFace3() {
            console.log("==========================2");
            console.log(centroid_for_face);
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
            
            function data() {
                var d = {};
                var facial = "";
                for (key in centroid_for_face) {
                    facial = json_mapping[key];
                    if (facial != "0") {
                        d[facial] = centroid_for_face[key];
                    }
                }
                console.log(d);
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

            function draw(selection) {
                selection
                    .call(drawFace)
            }

            return draw;
        }

        var current_canvas_id = $(this).parent('.compare-canvas').attr('id');
        var datapointIDs = [];
        var face_img_list = $('#' + current_canvas_id + ' img');
        for (i = 0; i < face_img_list.length; i++) {
            var face_img = face_img_list.eq(i);
            var data_id = face_img.attr('id').replace(/[^\d]/g, '');
            datapointIDs.push(data_id);
        }

        var datapoints_by_var = getDatapoints(datapointIDs, dataset_face);
        console.log("==========================0");
        console.log(datapoints_by_var);
        var centroid_for_face = getCentroid(datapoints_by_var);
        console.log("==========================1");
        console.log(centroid_for_face);

        face_img_list.addClass('hidden');
        d3.select('#' + current_canvas_id)
            .call(chernoffFace3())

    });

    $(document).on('dblclick', '.compare-canvas svg', function() {
        var current_canvas_id = $(this).parent('.compare-canvas').attr('id');
        var face_img_list = $('#' + current_canvas_id + ' img');
        d3.select('#' + current_canvas_id + ' svg').remove();
        face_img_list.removeClass('hidden');
    });

    function getDatapoints(id_list, dataset) {
        var datapoints_by_var = {};
        var variables = Object.keys(dataset[id_list[0]]);
        console.log("==========================var");
        console.log(variables);
        for (var i = 0; i < variables.length; i++) {
            var key = variables[i];
            datapoints_by_var[key] = [];
        }
        for (var i = 0; i < id_list.length; i++) {
            for (var j = 0; j < variables.length; j++) {
                var key = variables[j];
                var id = id_list[i];
                datapoints_by_var[key].push(dataset[id][key]);
            }
        }
        return datapoints_by_var;
    }

    function getCentroid(dataset_by_var) {
        var center = {};
        var variables = Object.keys(dataset_by_var);
        for (var i = 0; i < variables.length; i++) {
            var key = variables[i];
            var num = dataset_by_var[key].length;
            center[key] = dataset_by_var[key].reduce(function(a,b) { return a + b}, 0);
            center[key] = center[key] / num;
        }
        return center;
    }
});
