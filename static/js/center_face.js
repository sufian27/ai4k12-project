$(document).ready(function(){
    $(document).on('dblclick', '.compare-canvas img', function() {
        var current_canvas_id = $(this).parent('.compare-canvas').attr('id');
        var datapointIDs = [];
        var face_img_list = $('#' + current_canvas_id + ' img');
        for (i = 0; i < face_img_list.length; i++) {
            var face_img = face_img_list.eq(i);
            //extract number from a string
            var data_id = face_img.attr('id').replace(/[^\d]/g, '');
            datapointIDs.push(data_id);
        }

        var datapoints_by_var = getDatapoints(datapointIDs, dataset_face);
        // console.log("==========================0");
        // console.log(datapoints_by_var);
        var centroid_for_face = getCentroid(datapoints_by_var);
        // console.log("==========================1");
        // console.log(centroid_for_face);

        datapoint_face = centroid_for_face;
        face_img_list.addClass('hidden');
        $('#' + current_canvas_id).attr('ondrop','console.log("disable ondrop");')
        $('#' + current_canvas_id).attr('ondragover', 'console.log("disable ondragover");')
        d3.select('#' + current_canvas_id)
            .call(chernoffFace())

    });

    $(document).on('dblclick', '.compare-canvas', function() {
        var current_canvas_id = $(this).attr('id');
        var current_cluster_id = current_canvas_id.substr(7);
        if ($(this).children('span').hasClass('hidden')) {
            var face_span_list = $('#' + current_canvas_id + ' span');
            $('#' + current_canvas_id + ' > svg').remove();
            face_span_list.removeClass('hidden');
            $('.selected-block').removeClass('selected-block');
            $(this).parent('.compare-block').addClass('selected-block');
            if ($('.cluster-canvas').length > 1) {
                $(this).parent('.cluster-canvas').children('.overlay-btn').remove();
                $('#center' + current_cluster_id).parent('span').remove();
            }

        } else {
            var datapointIDs = [];
            if ($(this).children('span').length > 1) {
                var current_canvas_id = $(this).attr('id');
                var face_span_list = $('#' + current_canvas_id + ' span');
                for (i = 0; i < face_span_list.length; i++) {
                    var face_span = face_span_list.eq(i);
                    //extract number from a string
                    var data_id = face_span.attr('id').replace(/[^\d]/g, '');
                    datapointIDs.push(data_id);
                }
                var datapoints_by_var = getDatapoints(datapointIDs, dataset_face);
                var centroid_for_face = getCentroid(datapoints_by_var);
                var datapoints_by_var_original = getDatapoints(datapointIDs, json_dataset);
                var centroid_original = getCentroid(datapoints_by_var_original);

                datapoint_face = centroid_for_face;
                face_span_list.addClass('hidden');
                d3.select('#' + current_canvas_id)
                    .call(chernoffFace()); 
                var center_id = 'center' + current_cluster_id;
                $('#' + current_canvas_id + ' > svg').attr('id', center_id);   
                $('#' + current_canvas_id + ' > svg').attr('class', 'center');
                center_face_list[center_id] = centroid_original;
            }
            if($(this).parent('.compare-block').hasClass('selected-block')) {
                $(this).parent('.compare-block').removeClass('selected-block');
            }
            if ($('.cluster-canvas').length > 1) {
                var overlay_btn = $('<button type="button" class = "overlay-btn btn-outline-success btn-sm">Compare</button>');
                $(this).parent('.cluster-canvas').append(overlay_btn);
            }
        }
    });

    //for the cluster2 page
    $(document).on('click', '.overlay-btn', function() {
        var cluster_id = $(this).parent('.cluster-canvas').children('.compare-canvas').attr('id');
        var center_id = 'center' + cluster_id.substr(7);
        if ($(this).hasClass('take-back')) {
            $('.center-face-overlay .' + cluster_id).remove();
            $(this).removeClass('take-back');
            $(this).text('Compare');
        } else {
            var center = $('#' + center_id).clone();
            var center_span = $('<span class = "overlay ' + cluster_id + '"></span>');
            $('.center-face-overlay').append(center_span);
            $('.' + cluster_id).append(center);
            $(this).addClass('take-back');
            $(this).text('Remove');
            if($('.center-face-overlay').children('span').length > 1) {
                $('.center-face-overlay .center').attr('opacity', 0.4);
            }
        }
    });

    function getDatapoints(id_list, dataset) {
        var datapoints_by_var = {};
        var variables = Object.keys(dataset[id_list[0]]);
        // console.log("==========================var");
        // console.log(variables);
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
