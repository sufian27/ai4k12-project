﻿function chernoffFace(r) {
    var original_width = 100;
    var original_height = 120;
    var width = original_width * r, height = original_height * r;
    var getLocalData = localStorage.getItem('mappingRule');
    var json_mapping = JSON.parse(getLocalData);
    var chernoff = d3.chernoff()
        .face(function(d) { return d.f; })
        .hair(function(d) { return d.h; })
        .mouth(function(d) { return d.m; })
        .nosew(function(d) { return d.nw; }) //exist
        .noseh(function(d) { return d.nh; }) //exist
        .eyew(function(d) { return d.ew; })
        .eyeh(function(d) { return d.eh; })
        .brow(function(d) { return d.b; })
        .eyeRadius(function(d) { return d.er; }) //exist
        .browVertical(function(d) { return d.bv; }) //exist
        .browSlant(function(d) { return d.bs; }) //exist
        .browLength(function(d) { return d.bl; }) //exist
        .mouthSize(function(d) { return d.ms; }) //exist
        .mouthVertical(function(d) { return d.mv; }) //exist
        .mouthCurve(function(d) { return d.mc; }); //exist
    
    function data() {
        var d = {};
        var facial = "";
        for (key in datapoint_face) {
            facial = json_mapping[key];
            if (facial != "0") {
                d[facial] = datapoint_face[key];
            }
        }
        // console.log("=========================");
        // console.log(datapoint_face);
        // console.log(d);
        return [d];
    }

    function drawFace(selection) {
        var svg = selection.append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", "0 0 " + original_width + " " + original_height);
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


